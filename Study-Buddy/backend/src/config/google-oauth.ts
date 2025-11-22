import { google } from 'googleapis';
import { logger } from '../utils/logger';
/**
 * Google OAuth2 Configuration
 * Creates and configures OAuth2 client for Google APIs
 */

const SCOPES = [
  'https://www.googleapis.com/auth/drive.file', // Create and manage files in Drive
  'https://www.googleapis.com/auth/calendar.events', // Manage calendar events
];

/**
 * Create OAuth2 client
 */
export function createOAuth2Client() : any {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    logger.error('Missing Google OAuth credentials in environment variables');
    throw new Error('Google OAuth credentials not configured');
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

/**
 * Generate authorization URL for OAuth flow
 */
export function getAuthorizationUrl(oauth2Client: any): string {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline', // Get refresh token
    scope: SCOPES,
    prompt: 'consent', // Force consent screen to get refresh token
  });
}

/**
 * Exchange authorization code for tokens
 */
export async function getTokensFromCode(oauth2Client: any, code: string) {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  } catch (error: any) {
    logger.error('Error exchanging code for tokens:', error);
    throw new Error('Failed to exchange authorization code for tokens');
  }
}

/**
 * Set credentials on OAuth2 client
 */
export function setCredentials(
  oauth2Client: any,
  accessToken: string,
  refreshToken: string,
  expiryDate: number
) {
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
    expiry_date: expiryDate,
  });
}

/**
 * Refresh access token if expired
 */
export async function refreshAccessTokenIfNeeded(
  oauth2Client: any,
  refreshToken: string,
  expiryDate: number
): Promise<{ accessToken: string; expiryDate: number } | null> {
  // Check if token is expired or will expire in next 5 minutes
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  if (expiryDate > now + fiveMinutes) {
    return null; // Token is still valid
  }

  try {
    logger.info('Refreshing expired Google access token');
    
    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    const { credentials } = await oauth2Client.refreshAccessToken();

    return {
      accessToken: credentials.access_token!,
      expiryDate: credentials.expiry_date!,
    };
  } catch (error: any) {
    logger.error('Error refreshing access token:', error);
    throw new Error('Failed to refresh Google access token');
  }
}

/**
 * Create OAuth2 client with user credentials
 */
export function createAuthenticatedClient(
  accessToken: string,
  refreshToken: string,
  expiryDate: number
) {
  const oauth2Client = createOAuth2Client();
  setCredentials(oauth2Client, accessToken, refreshToken, expiryDate);
  return oauth2Client;
}
