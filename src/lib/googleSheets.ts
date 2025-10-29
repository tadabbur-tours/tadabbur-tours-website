import { google } from 'googleapis';

// Check if Google Sheets is properly configured
const isGoogleSheetsConfigured = () => {
  return !!(
    process.env.GOOGLE_SHEET_ID &&
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY
  );
};

// Initialize Google Sheets API only if properly configured
let sheets: any = null;
let auth: any = null;

if (isGoogleSheetsConfigured()) {
  try {
    auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    sheets = google.sheets({ version: 'v4', auth });
    console.log('Google Sheets API initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Google Sheets API:', error);
    sheets = null;
  }
} else {
  console.log('Google Sheets not configured - skipping initialization');
}

// Your Google Sheet ID (you'll get this from the sheet URL)
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

export interface InquiryData {
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  numberOfPeople: number;
  package: string;
  message: string;
  source: string;
}

export interface BookingData {
  timestamp: string;
  sessionId: string;
  packageName: string;
  packageId: string;
  spots: {
    dual: number;
    triple: number;
    quad: number;
  };
  buyerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  participants: string[];
  totalAmount: number;
  depositAmount: number;
  remainingAmount: number;
  paymentStatus: string;
  paymentType: string;
  installmentDates: string[];
}

export async function addInquiryToSheet(data: InquiryData): Promise<void> {
  if (!isGoogleSheetsConfigured() || !sheets || !SPREADSHEET_ID) {
    console.log('Google Sheets not configured - skipping inquiry data');
    return;
  }

  try {
    const values = [
      [
        data.timestamp,
        data.name,
        data.email,
        data.phone,
        data.numberOfPeople,
        data.package,
        data.message,
        data.source
      ]
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Inquiries!A:H', // Adjust range based on your sheet structure
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    console.log('Inquiry added to Google Sheet successfully');
  } catch (error) {
    console.error('Error adding inquiry to Google Sheet:', error);
    throw error;
  }
}

export async function addBookingToSheet(data: BookingData): Promise<void> {
  if (!isGoogleSheetsConfigured() || !sheets || !SPREADSHEET_ID) {
    console.log('Google Sheets not configured - skipping booking data');
    return;
  }

  try {
    const values = [
      [
        data.timestamp,
        data.sessionId,
        data.packageName,
        data.packageId,
        data.spots.dual,
        data.spots.triple,
        data.spots.quad,
        `${data.buyerInfo.firstName} ${data.buyerInfo.lastName}`,
        data.buyerInfo.email,
        data.buyerInfo.phone,
        data.participants.join(', '),
        data.totalAmount / 100, // Convert from cents to dollars
        data.depositAmount / 100,
        data.remainingAmount / 100,
        data.paymentStatus,
        data.paymentType,
        data.installmentDates.join(', ')
      ]
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Bookings!A:Q', // Adjust range based on your sheet structure
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    console.log('Booking added to Google Sheet successfully');
  } catch (error) {
    console.error('Error adding booking to Google Sheet:', error);
    throw error;
  }
}
