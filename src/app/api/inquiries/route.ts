import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      packageId,
      packageName,
      packagePrice,
      packageDates,
      packageDuration,
      firstName,
      lastName,
      email,
      phone,
      numberOfPeople,
      preferredContactMethod,
      message,
      hearAboutUs,
      travelExperience,
      specialRequirements,
      submittedAt
    } = body;

    // Create inquiry data object
    const inquiryData = {
      id: `inq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      package: {
        id: packageId,
        name: packageName,
        price: packagePrice,
        dates: packageDates,
        duration: packageDuration
      },
      customer: {
        firstName,
        lastName,
        email,
        phone,
        fullName: `${firstName} ${lastName}`
      },
      travel: {
        numberOfPeople,
        preferredContactMethod,
        travelExperience,
        specialRequirements
      },
      inquiry: {
        message,
        hearAboutUs,
        submittedAt,
        status: 'new'
      }
    };

    // Create filename from person's name (sanitized)
    const sanitizedName = `${firstName}_${lastName}`.replace(/[^a-zA-Z0-9_-]/g, '_');
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const filename = `inquiry_${sanitizedName}_${timestamp}.json`;

    // Create inquiries directory if it doesn't exist
    const inquiriesDir = path.join(process.cwd(), 'inquiries');
    if (!fs.existsSync(inquiriesDir)) {
      fs.mkdirSync(inquiriesDir, { recursive: true });
    }

    // Create JSON file with person's name
    const jsonFile = path.join(inquiriesDir, filename);
    fs.writeFileSync(jsonFile, JSON.stringify(inquiryData, null, 2), 'utf8');

    console.log(`New inquiry saved: ${inquiryData.id}`);
    console.log(`File created: ${jsonFile}`);

    return NextResponse.json({ 
      success: true, 
      inquiryId: inquiryData.id,
      message: 'Inquiry submitted successfully' 
    });

  } catch (error) {
    console.error('Error saving inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to save inquiry' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const inquiriesDir = path.join(process.cwd(), 'inquiries');
    
    if (!fs.existsSync(inquiriesDir)) {
      return NextResponse.json({ inquiries: [] });
    }

    // Get all JSON files
    const files = fs.readdirSync(inquiriesDir).filter(file => file.endsWith('.json'));
    const inquiries = files.map(file => {
      const filePath = path.join(inquiriesDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    });

    // Sort by submission date (newest first)
    inquiries.sort((a, b) => new Date(b.inquiry.submittedAt).getTime() - new Date(a.inquiry.submittedAt).getTime());

    return NextResponse.json({ inquiries });

  } catch (error) {
    console.error('Error retrieving inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve inquiries' },
      { status: 500 }
    );
  }
}
