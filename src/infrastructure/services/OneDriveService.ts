// OneDrive Service - Infrastructure Layer
// Uses Zapier Webhook for OneDrive folder automation

/**
 * Create a client folder in OneDrive via Zapier webhook
 * 
 * Zapier Flow:
 * 1. Catch webhook with clientName
 * 2. Copy template folder (_TEMPLATE_PROJECT_FOLDER)
 * 3. Rename to "YYYY-MM-DD_ClientName"
 * 4. Create sharing link (anyone with link - view only)
 * 5. Return shareLink URL
 */
export async function createClientFolder(clientName: string): Promise<string> {
    const webhookUrl = process.env.ZAPIER_ONEDRIVE_WEBHOOK_URL;

    if (!webhookUrl) {
        console.warn('OneDrive webhook not configured (ZAPIER_ONEDRIVE_WEBHOOK_URL), skipping folder creation');
        return '';
    }

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                clientName,
                timestamp: new Date().toISOString(),
                date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Zapier webhook failed:', error);
            return '';
        }

        const data = await response.json();
        return data.shareLink || data.share_link || '';

    } catch (error) {
        console.error('Failed to create OneDrive folder:', error);
        return '';
    }
}

/**
 * Check if OneDrive automation is configured
 */
export function isOneDriveConfigured(): boolean {
    return !!process.env.ZAPIER_ONEDRIVE_WEBHOOK_URL;
}
