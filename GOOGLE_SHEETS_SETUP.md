# Google Sheets Integration Setup

This guide will help you set up Google Sheets integration to collect inquiry and booking data.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"

## Step 2: Create a Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `tadabbur-tours-sheets`
   - Description: `Service account for Tadabbur Tours Google Sheets integration`
4. Click "Create and Continue"
5. Skip the role assignment for now (click "Continue")
6. Click "Done"

## Step 3: Generate Service Account Key

1. In the Credentials page, find your service account
2. Click on the service account email
3. Go to the "Keys" tab
4. Click "Add Key" > "Create new key"
5. Choose "JSON" format
6. Click "Create" - this will download a JSON file

## Step 4: Create Google Sheets

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it "Tadabbur Tours Data"
4. Create two sheets:
   - **Inquiries** (for inquiry data)
   - **Bookings** (for booking data)

### Inquiries Sheet Headers (Row 1):
```
Timestamp | Name | Email | Phone | Number of People | Package | Message | Source
```

### Bookings Sheet Headers (Row 1):
```
Timestamp | Session ID | Package Name | Package ID | Dual Spots | Triple Spots | Quad Spots | Buyer Name | Email | Phone | Participants | Total Amount | Deposit Amount | Remaining Amount | Payment Status | Payment Type | Installment Dates
```

## Step 5: Share the Sheet with Service Account

1. In your Google Sheet, click "Share" (top right)
2. Add the service account email (from the JSON file: `client_email`)
3. Give it "Editor" permissions
4. Click "Send"

## Step 6: Get Sheet ID

1. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
   ```
2. The Sheet ID is the long string between `/d/` and `/edit`

## Step 7: Set Environment Variables

Add these to your `.env.local` file:

```env
# Google Sheets Configuration
GOOGLE_SHEET_ID=your_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

**Important Notes:**
- Replace `YOUR_PRIVATE_KEY_HERE` with the actual private key from the JSON file
- Keep the quotes around the private key
- Make sure to include the `\n` characters for line breaks
- The private key should be on one line with `\n` for line breaks

## Step 8: For Production (Netlify/Vercel)

Add the same environment variables to your hosting platform:
- **Netlify**: Site Settings > Environment Variables
- **Vercel**: Project Settings > Environment Variables

## Testing

1. Start your development server: `npm run dev`
2. Submit an inquiry or make a booking
3. Check your Google Sheet - data should appear automatically

## Troubleshooting

- **"The caller does not have permission"**: Make sure you shared the sheet with the service account email
- **"Invalid credentials"**: Check that the private key is properly formatted with `\n` characters
- **"Sheet not found"**: Verify the Sheet ID is correct
- **"API not enabled"**: Make sure Google Sheets API is enabled in your Google Cloud project

## Security Notes

- Never commit the service account JSON file to Git
- Keep your private key secure
- The service account has limited permissions (only to your specific sheet)
- You can revoke access anytime by removing the service account from the sheet
