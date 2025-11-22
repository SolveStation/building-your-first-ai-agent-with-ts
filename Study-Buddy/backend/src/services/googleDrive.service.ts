import { google } from 'googleapis';
import fs from 'fs';
import { logger } from '../utils/logger';
import { DriveUploadResult } from '../types/agent.types';
import { createAuthenticatedClient } from '../config/google-oauth';

/**
 * Google Drive Service
 * Handles file uploads and folder management in Google Drive
 */
class GoogleDriveService {
  /**
   * Create a folder in Google Drive
   */
  async createFolder(
    folderName: string,
    oauth2Client: any,
    parentFolderId?: string
  ): Promise<{ folderId: string; folderUrl: string }> {
    try {
      const drive = google.drive({ version: 'v3', auth: oauth2Client });

      const folderMetadata: any = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      };

      if (parentFolderId) {
        folderMetadata.parents = [parentFolderId];
      }

      const folder = await drive.files.create({
        requestBody: folderMetadata,
        fields: 'id, webViewLink',
      });

      logger.info(`Created folder: ${folderName} (${folder.data.id})`);

      return {
        folderId: folder.data.id!,
        folderUrl: folder.data.webViewLink!,
      };
    } catch (error: any) {
      logger.error('Error creating folder in Drive:', error);
      throw new Error(`Failed to create Drive folder: ${error.message}`);
    }
  }

  /**
   * Upload a file to Google Drive
   */
  async uploadFile(
    filePath: string,
    fileName: string,
    mimeType: string,
    oauth2Client: any,
    folderId?: string
  ): Promise<DriveUploadResult> {
    try {
      const drive = google.drive({ version: 'v3', auth: oauth2Client });

      const fileMetadata: any = {
        name: fileName,
      };

      if (folderId) {
        fileMetadata.parents = [folderId];
      }

      const media = {
        mimeType,
        body: fs.createReadStream(filePath),
      };

      const file = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, name, webViewLink, webContentLink',
      });

      logger.info(`Uploaded file: ${fileName} (${file.data.id})`);

      return {
        fileId: file.data.id!,
        fileUrl: file.data.webViewLink!,
        fileName: file.data.name!,
      };
    } catch (error: any) {
      logger.error('Error uploading file to Drive:', error);
      throw new Error(`Failed to upload file to Drive: ${error.message}`);
    }
  }

  /**
   * Upload buffer as file to Google Drive
   */
  async uploadBuffer(
    buffer: Buffer,
    fileName: string,
    mimeType: string,
    oauth2Client: any,
    folderId?: string
  ): Promise<DriveUploadResult> {
    try {
      const drive = google.drive({ version: 'v3', auth: oauth2Client });

      const fileMetadata: any = {
        name: fileName,
      };

      if (folderId) {
        fileMetadata.parents = [folderId];
      }

      const { Readable } = require('stream');
      const bufferStream = new Readable();
      bufferStream.push(buffer);
      bufferStream.push(null);

      const media = {
        mimeType,
        body: bufferStream,
      };

      const file = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, name, webViewLink, webContentLink',
      });

      logger.info(`Uploaded buffer as file: ${fileName} (${file.data.id})`);

      return {
        fileId: file.data.id!,
        fileUrl: file.data.webViewLink!,
        fileName: file.data.name!,
      };
    } catch (error: any) {
      logger.error('Error uploading buffer to Drive:', error);
      throw new Error(`Failed to upload buffer to Drive: ${error.message}`);
    }
  }

  /**
   * Set file permissions (make it accessible to user)
   */
  async setFilePermissions(
    fileId: string,
    oauth2Client: any,
    emailAddress?: string
  ): Promise<void> {
    try {
      const drive = google.drive({ version: 'v3', auth: oauth2Client });

      // If email provided, share with specific user
      if (emailAddress) {
        await drive.permissions.create({
          fileId,
          requestBody: {
            type: 'user',
            role: 'writer',
            emailAddress,
          },
        });
        logger.info(`Shared file ${fileId} with ${emailAddress}`);
      }
    } catch (error: any) {
      logger.error('Error setting file permissions:', error);
      // Don't throw - permissions are not critical
    }
  }

  /**
   * Delete a file from Google Drive
   */
  async deleteFile(fileId: string, oauth2Client: any): Promise<void> {
    try {
      const drive = google.drive({ version: 'v3', auth: oauth2Client });
      await drive.files.delete({ fileId });
      logger.info(`Deleted file: ${fileId}`);
    } catch (error: any) {
      logger.error('Error deleting file from Drive:', error);
      throw new Error(`Failed to delete file from Drive: ${error.message}`);
    }
  }

  /**
   * Create StudyBuddy folder structure
   * Returns the main folder ID and URL
   */
  async createStudyBuddyFolder(
    topic: string,
    oauth2Client: any
  ): Promise<{ folderId: string; folderUrl: string }> {
    try {
      // Create main StudyBuddy folder (if not exists, we'll just create a new one each time)
      const timestamp = new Date().toISOString().split('T')[0];
      const folderName = `StudyBuddy - ${topic} - ${timestamp}`;

      return await this.createFolder(folderName, oauth2Client);
    } catch (error: any) {
      logger.error('Error creating StudyBuddy folder structure:', error);
      throw error;
    }
  }

  /**
   * Get authenticated client for user
   */
  getAuthenticatedClient(accessToken: string, refreshToken: string, expiryDate: number) {
    return createAuthenticatedClient(accessToken, refreshToken, expiryDate);
  }
}

// Export singleton instance
export const googleDriveService = new GoogleDriveService();
