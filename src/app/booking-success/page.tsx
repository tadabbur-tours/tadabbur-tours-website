'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [bookingDetails, setBookingDetails] = useState<{
    packageName: string;
    participantCount: number;
    totalAmount: number;
    depositAmount: number;
    remainingAmount: number;
    installmentDates: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // In a real app, you'd fetch booking details from your database
      // For now, we'll simulate the data
      setTimeout(() => {
        setBookingDetails({
          packageName: 'Umrah Package',
          totalAmount: 375000, // $3,750 in cents
          depositAmount: 75000, // $750 in cents
          remainingAmount: 300000, // $3,000 in cents
          installmentDates: ['January 1, 2025', 'February 1, 2025', 'March 1, 2025'],
          participantCount: 1
        });
        setLoading(false);
      }, 1000);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your deposit has been successfully processed.</p>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Package:</span>
              <span className="font-medium">{bookingDetails?.packageName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Participants:</span>
              <span className="font-medium">{bookingDetails?.participantCount} people</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-medium">${(bookingDetails?.totalAmount || 0) / 100}</span>
            </div>
            <div className="flex justify-between text-emerald-600">
              <span>Deposit Paid:</span>
              <span className="font-semibold">${(bookingDetails?.depositAmount || 0) / 100}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Remaining Balance:</span>
              <span className="font-medium">${(bookingDetails?.remainingAmount || 0) / 100}</span>
            </div>
          </div>
        </div>

        {/* Payment Schedule */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Schedule</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
              <div>
                <p className="font-medium text-emerald-800">Deposit</p>
                <p className="text-sm text-emerald-600">Paid today</p>
              </div>
              <span className="font-semibold text-emerald-600">$750</span>
            </div>
            
            {bookingDetails?.installmentDates?.map((date: string, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Installment {index + 1}</p>
                  <p className="text-sm text-gray-600">Due {date}</p>
                </div>
                <span className="font-semibold text-gray-600">$1,000</span>
              </div>
            ))}
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="font-semibold text-amber-800 mb-2">Important Information</h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• You will receive email reminders before each installment is due</li>
                <li>• Payment links will be sent to your email address</li>
                <li>• Please ensure your contact information is up to date</li>
                <li>• Contact us if you need to modify your payment schedule</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">What's Next?</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• You&apos;ll receive a confirmation email within 24 hours</li>
            <li>• Travel documents and itinerary will be sent 30 days before departure</li>
            <li>• We'll contact you to finalize travel arrangements</li>
            <li>• Keep an eye on your email for installment reminders</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-center py-3 px-6 rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
          >
            Return to Home
          </Link>
          <button
            onClick={() => window.print()}
            className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
          >
            Print Confirmation
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingSuccessContent />
    </Suspense>
  );
}
