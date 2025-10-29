'use client';

import Link from 'next/link';

export default function BookingCancel() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Cancel Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
          <p className="text-gray-600">Your booking was not completed.</p>
        </div>

        {/* Information Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What Happened?</h2>
          <p className="text-gray-600 mb-4">
            You cancelled the payment process before completing your booking. No charges have been made to your account.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Your booking details are still saved</h3>
            <p className="text-sm text-gray-600">
              If you&apos;d like to complete your booking, you can return to the booking form and try again. 
              All your information will be preserved.
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Need Help?</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Payment Issues:</strong> Contact your bank or try a different payment method</li>
            <li>• <strong>Technical Problems:</strong> Try refreshing the page and starting over</li>
            <li>• <strong>Questions:</strong> Contact our support team for assistance</li>
            <li>• <strong>Alternative Payment:</strong> We also accept bank transfers and cash payments</li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-emerald-800 mb-2">Contact Us</h3>
          <div className="text-sm text-emerald-700 space-y-1">
            <p><strong>Email:</strong> support@tadabburtours.com</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p><strong>Hours:</strong> Monday - Friday, 9 AM - 6 PM</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-center py-3 px-6 rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
          >
            Try Booking Again
          </Link>
          <Link
            href="/#contact"
            className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 text-center"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
