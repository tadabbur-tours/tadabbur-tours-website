'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import BookingModal from '@/components/BookingModal';
import InquiryModal from '@/components/InquiryModal';
import type { BookingModalData } from '@/lib/types';

interface PackagePayload {
  id: string;
  name: string;
  price: string;
  dates: string;
  duration: string;
}

interface BookingModalContextValue {
  openBookingModal: (pkg: PackagePayload) => void;
  openInquiryModal: (pkg: PackagePayload) => void;
  closeBookingModal: () => void;
  closeInquiryModal: () => void;
}

const emptyData: BookingModalData = {
  packageId: '',
  packageName: '',
  price: '',
  dates: '',
  duration: '',
};

const BookingModalContext = createContext<BookingModalContextValue | null>(null);

export function BookingModalProvider({ children }: { children: React.ReactNode }) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState<BookingModalData>(emptyData);

  const openBookingModal = useCallback((pkg: PackagePayload) => {
    setBookingData({
      packageId: pkg.id,
      packageName: pkg.name,
      price: pkg.price,
      dates: pkg.dates,
      duration: pkg.duration,
    });
    setIsBookingModalOpen(true);
  }, []);

  const openInquiryModal = useCallback((pkg: PackagePayload) => {
    setBookingData({
      packageId: pkg.id,
      packageName: pkg.name,
      price: pkg.price,
      dates: pkg.dates,
      duration: pkg.duration,
    });
    setIsInquiryModalOpen(true);
  }, []);

  const closeBookingModal = useCallback(() => {
    setIsBookingModalOpen(false);
    setBookingData(emptyData);
  }, []);

  const closeInquiryModal = useCallback(() => {
    setIsInquiryModalOpen(false);
    setBookingData(emptyData);
  }, []);

  const value: BookingModalContextValue = {
    openBookingModal,
    openInquiryModal,
    closeBookingModal,
    closeInquiryModal,
  };

  return (
    <BookingModalContext.Provider value={value}>
      {children}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={closeBookingModal}
        packageData={bookingData}
      />
      <InquiryModal
        isOpen={isInquiryModalOpen}
        onClose={closeInquiryModal}
        packageData={bookingData}
      />
    </BookingModalContext.Provider>
  );
}

export function useBookingModals(): BookingModalContextValue {
  const ctx = useContext(BookingModalContext);
  if (!ctx) {
    throw new Error('useBookingModals must be used within a BookingModalProvider');
  }
  return ctx;
}
