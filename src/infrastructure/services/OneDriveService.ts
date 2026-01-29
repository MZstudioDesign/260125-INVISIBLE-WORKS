// OneDrive Service - Infrastructure Layer
// Uses Microsoft Graph API for file operations (App-only auth)

import { ConfidentialClientApplication } from '@azure/msal-node';

// Graph API endpoints
const GRAPH_API_BASE = 'https://graph.microsoft.com/v1.0';

// Get environment config at runtime
function getAzureConfig() {
  return {
    tenantId: process.env.AZURE_TENANT_ID,
    clientId: process.env.AZURE_CLIENT_ID,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
    ownerEmail: process.env.ONEDRIVE_OWNER_EMAIL,
  };
}

// MSAL client instance (cached)
let msalClient: ConfidentialClientApplication | null = null;

/**
 * Get or create MSAL client for app-only authentication
 */
function getMsalClient(): ConfidentialClientApplication {
  if (msalClient) return msalClient;

  const config = getAzureConfig();
  if (!config.tenantId || !config.clientId || !config.clientSecret) {
    throw new Error('Azure credentials not configured. Set AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET.');
  }

  msalClient = new ConfidentialClientApplication({
    auth: {
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      authority: `https://login.microsoftonline.com/${config.tenantId}`,
    },
  });

  return msalClient;
}

/**
 * Get access token for Microsoft Graph API
 */
async function getAccessToken(): Promise<string> {
  const client = getMsalClient();

  const result = await client.acquireTokenByClientCredential({
    scopes: ['https://graph.microsoft.com/.default'],
  });

  if (!result?.accessToken) {
    throw new Error('Failed to acquire access token from Azure AD');
  }

  return result.accessToken;
}

/**
 * Get user's drive ID by email
 */
async function getUserDriveId(accessToken: string): Promise<string> {
  const config = getAzureConfig();
  if (!config.ownerEmail) {
    throw new Error('ONEDRIVE_OWNER_EMAIL not configured.');
  }

  const response = await fetch(
    `${GRAPH_API_BASE}/users/${config.ownerEmail}/drive`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get user drive: ${error}`);
  }

  const data = await response.json();
  return data.id;
}

// ============================================
// Interfaces
// ============================================

export interface CreateFolderResult {
  success: boolean;
  folderId?: string;
  folderUrl?: string;
  shareLink?: string;
  error?: string;
}

export interface UploadFileResult {
  success: boolean;
  fileId?: string;
  webUrl?: string;
  error?: string;
}

// ============================================
// Main Functions
// ============================================

/**
 * Create a client folder in OneDrive
 * Folder naming: [IW] {QuoteNumber}_{ClientName}
 */
export async function createClientFolder(
  quoteNumber: string,
  clientName: string
): Promise<CreateFolderResult> {
  const config = getAzureConfig();

  if (!config.tenantId || !config.clientId || !config.clientSecret || !config.ownerEmail) {
    console.warn('[OneDrive] Not configured, skipping folder creation');
    return { success: false, error: 'OneDrive not configured' };
  }

  try {
    const accessToken = await getAccessToken();
    const driveId = await getUserDriveId(accessToken);

    // Create folder name with date
    const dateStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const sanitizedName = clientName.replace(/[<>:"/\\|?*]/g, '_'); // Remove invalid chars
    const folderName = `[IW] ${dateStr}_${quoteNumber}_${sanitizedName}`;

    // Create folder in root
    const createFolderResponse = await fetch(
      `${GRAPH_API_BASE}/drives/${driveId}/root/children`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: folderName,
          folder: {},
          '@microsoft.graph.conflictBehavior': 'rename',
        }),
      }
    );

    if (!createFolderResponse.ok) {
      const error = await createFolderResponse.text();
      console.error('[OneDrive] Failed to create folder:', error);
      return { success: false, error: `Failed to create folder: ${error}` };
    }

    const folderData = await createFolderResponse.json();
    const folderId = folderData.id;

    // Create anonymous sharing link
    const shareLinkResponse = await fetch(
      `${GRAPH_API_BASE}/drives/${driveId}/items/${folderId}/createLink`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'edit', // Allow uploads
          scope: 'anonymous',
        }),
      }
    );

    let shareLink = '';
    if (shareLinkResponse.ok) {
      const linkData = await shareLinkResponse.json();
      shareLink = linkData.link?.webUrl || '';
    } else {
      console.warn('[OneDrive] Failed to create share link, folder created without sharing');
    }

    console.log('[OneDrive] Folder created:', folderName, shareLink);

    return {
      success: true,
      folderId,
      folderUrl: folderData.webUrl,
      shareLink,
    };
  } catch (error) {
    console.error('[OneDrive] Error creating folder:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Upload a file to a specific folder
 */
export async function uploadFileToFolder(
  folderId: string,
  fileName: string,
  fileContent: Buffer,
  contentType: string = 'application/pdf'
): Promise<UploadFileResult> {
  const config = getAzureConfig();

  if (!config.tenantId || !config.clientId || !config.clientSecret || !config.ownerEmail) {
    return { success: false, error: 'OneDrive not configured' };
  }

  try {
    const accessToken = await getAccessToken();
    const driveId = await getUserDriveId(accessToken);

    // For small files (< 4MB), use simple upload
    // For larger files, should use upload session
    // Convert Buffer to Uint8Array for fetch compatibility
    const uploadResponse = await fetch(
      `${GRAPH_API_BASE}/drives/${driveId}/items/${folderId}:/${encodeURIComponent(fileName)}:/content`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': contentType,
        },
        body: new Uint8Array(fileContent),
      }
    );

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      console.error('[OneDrive] Failed to upload file:', error);
      return { success: false, error: `Failed to upload file: ${error}` };
    }

    const fileData = await uploadResponse.json();
    console.log('[OneDrive] File uploaded:', fileName);

    return {
      success: true,
      fileId: fileData.id,
      webUrl: fileData.webUrl,
    };
  } catch (error) {
    console.error('[OneDrive] Error uploading file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create folder and upload PDF in one operation
 */
export async function createFolderAndUploadPDF(
  quoteNumber: string,
  clientName: string,
  pdfBuffer: Buffer
): Promise<CreateFolderResult & { pdfUrl?: string }> {
  // Create folder
  const folderResult = await createClientFolder(quoteNumber, clientName);

  if (!folderResult.success || !folderResult.folderId) {
    return folderResult;
  }

  // Upload PDF
  const pdfFileName = `견적서_${quoteNumber}.pdf`;
  const uploadResult = await uploadFileToFolder(
    folderResult.folderId,
    pdfFileName,
    pdfBuffer
  );

  return {
    ...folderResult,
    pdfUrl: uploadResult.webUrl,
  };
}

/**
 * Check if OneDrive is configured
 */
export function isOneDriveConfigured(): boolean {
  const config = getAzureConfig();
  return !!(
    config.tenantId &&
    config.clientId &&
    config.clientSecret &&
    config.ownerEmail
  );
}
