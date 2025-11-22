import { AgentState } from '../state';
import { pdfService } from '../../services/pdf.service';
import { googleDriveService } from '../../services/googleDrive.service';
import { db, users } from '../../db';
import { eq } from 'drizzle-orm';
import { logger } from '../../utils/logger';

/**
 * Compiler Agent Node
 * Converts markdown to PDF and uploads to Google Drive
 */
export async function compilerAgentNode(state: AgentState): Promise<Partial<AgentState>> {
  logger.info(`[Compiler Agent] Starting for study plan: ${state.studyPlanId}`);

  try {
    // Validate that we have simplified content
    if (!state.simplifiedContent) {
      throw new Error('No simplified content available to compile');
    }

    // Step 1: Generate PDF from markdown
    logger.debug('[Compiler Agent] Generating PDF from markdown');
    const pdfBuffer = await pdfService.generatePDF(state.simplifiedContent, state.topic);

    logger.info(`[Compiler Agent] Generated PDF (${pdfBuffer.length} bytes)`);

    // Step 2: Get user's Google OAuth credentials
    logger.debug('[Compiler Agent] Fetching user OAuth credentials');
    const user = await db.query.users.findFirst({
      where: eq(users.id, state.userId),
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.googleAccessToken || !user.googleRefreshToken || !user.googleTokenExpiry) {
      throw new Error('User has not connected Google account');
    }

    // Step 3: Create authenticated Google client
    const oauth2Client = googleDriveService.getAuthenticatedClient(
      user.googleAccessToken,
      user.googleRefreshToken,
      user.googleTokenExpiry
    );

    // Step 4: Create StudyBuddy folder in Drive
    logger.debug('[Compiler Agent] Creating Drive folder');
    const { folderId, folderUrl } = await googleDriveService.createStudyBuddyFolder(
      state.topic,
      oauth2Client
    );

    logger.info(`[Compiler Agent] Created folder: ${folderId}`);

    // Step 5: Upload PDF to Drive
    logger.debug('[Compiler Agent] Uploading PDF to Drive');
    const fileName = `${state.topic} - Study Guide.pdf`;
    const uploadResult = await googleDriveService.uploadBuffer(
      pdfBuffer,
      fileName,
      'application/pdf',
      oauth2Client,
      folderId
    );

    logger.info(`[Compiler Agent] Uploaded PDF: ${uploadResult.fileId}`);

    return {
      pdfBuffer,
      driveFileId: uploadResult.fileId,
      driveFileUrl: uploadResult.fileUrl,
      driveFolderId: folderId,
      driveFolderUrl: folderUrl,
      currentStep: 'compiler_complete',
    };
  } catch (error: any) {
    logger.error('[Compiler Agent] Error:', error);

    return {
      currentStep: 'compiler_failed',
      errors: [...(state.errors || []), `Compiler Agent failed: ${error.message}`],
    };
  }
}
