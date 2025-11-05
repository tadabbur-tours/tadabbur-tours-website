'use client';

import { useState, useEffect } from 'react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageData: {
    packageId: string;
    packageName: string;
    price: string;
    dates: string;
    duration: string;
  };
}

export default function BookingModal({ isOpen, onClose, packageData }: BookingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [participantCount, setParticipantCount] = useState(1);
  const [under18Guardian, setUnder18Guardian] = useState<{[key: number]: boolean}>({});
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [formData, setFormData] = useState({
    spots: {
      dual: 0,    // Number of spots in dual rooms
      triple: 0,  // Number of spots in triple rooms
      quad: 0     // Number of spots in quad rooms
    },
    buyerInfo: {
      firstName: '',
      lastName: '',
      email: '',
      confirmEmail: '',
      phone: ''
    },
    participants: [{
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      phone: '',
      gender: '',
      nationality: '',
      hasPassport: '',
      passportNationality: '',
      guardianFirstName: '',
      guardianLastName: ''
    }],
    paymentMethod: '',
    termsAccepted: false
  });

  const roomOptions = [
    { type: 'quad', price: '$3,750', priceNum: 3750, capacity: 4, description: 'Shared room with 3 other people' },
    { type: 'triple', price: '$3,950', priceNum: 3950, capacity: 3, description: 'Shared room with 2 other people' },
    { type: 'dual', price: '$4,200', priceNum: 4200, capacity: 2, description: 'Shared room with 1 other person' }
  ];

  const steps = [
    { number: 1, title: 'Package & Participants' },
    { number: 2, title: 'Buyer Info' },
    { number: 3, title: 'Payment Method' },
    { number: 4, title: 'Terms & Contract' },
    { number: 5, title: 'Payment' },
    { number: 6, title: 'Summary' }
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Helper function to calculate total spots
  const getTotalSpots = () => {
    return formData.spots.dual + formData.spots.triple + formData.spots.quad;
  };

  // Helper function to format phone number as xxx-xxx-xxxx
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-numeric characters
    const phoneNumber = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    const limited = phoneNumber.slice(0, 10);
    
    // Format as xxx-xxx-xxxx
    if (limited.length === 0) return '';
    if (limited.length <= 3) return limited;
    if (limited.length <= 6) return `${limited.slice(0, 3)}-${limited.slice(3)}`;
    return `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6)}`;
  };

  // Auto-update participant count when spots change
  useEffect(() => {
    const totalSpots = getTotalSpots();
    if (totalSpots !== participantCount && totalSpots > 0) {
      setParticipantCount(totalSpots);
      
      // Update participants array to match the new count
      const newParticipants: typeof formData.participants = [];
      for (let i = 0; i < totalSpots; i++) {
        newParticipants.push(formData.participants[i] || {
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          phone: '',
          gender: '',
          nationality: '',
          hasPassport: '',
          passportNationality: '',
          guardianFirstName: '',
          guardianLastName: ''
        });
      }
      
      setFormData(prev => ({
        ...prev,
        participants: newParticipants
      }));
    }
  }, [formData.spots, participantCount, getTotalSpots]);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, string>),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSpotQuantityChange = (roomType: 'dual' | 'triple' | 'quad', quantity: number) => {
    setFormData(prev => ({
      ...prev,
      spots: {
        ...prev.spots,
        [roomType]: Math.max(0, Math.min(50, quantity)) // Max 50 spots
      }
    }));
  };

  const handleParticipantChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.map((participant, i) => 
        i === index ? { ...participant, [field]: value } : participant
      )
    }));
  };

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getUnder18Participants = () => {
    return formData.participants
      .map((participant, index) => ({ participant, index }))
      .filter(({ participant }) => {
        if (!participant.dateOfBirth) return false;
        return calculateAge(participant.dateOfBirth) < 18;
      });
  };

  const handleGuardianResponse = (participantIndex: number, hasGuardian: boolean) => {
    setUnder18Guardian(prev => ({
      ...prev,
      [participantIndex]: hasGuardian
    }));
  };

  const getValidationErrors = (step: number): string[] => {
    const errors: string[] = [];
    
    switch (step) {
      case 1:
        // Check package selection
        if (getTotalSpots() === 0) {
          errors.push('Please select at least one room spot');
        }
        
        // Check participants
        formData.participants.forEach((participant, index) => {
          const personNum = index + 1;
          if (!participant.firstName) errors.push(`Person ${personNum}: First name is required`);
          if (!participant.lastName) errors.push(`Person ${personNum}: Last name is required`);
          if (!participant.dateOfBirth) errors.push(`Person ${personNum}: Date of birth is required`);
          if (!participant.phone) errors.push(`Person ${personNum}: Phone number is required`);
          if (!participant.gender) errors.push(`Person ${personNum}: Gender is required`);
          if (!participant.nationality) errors.push(`Person ${personNum}: Nationality is required`);
          if (!participant.hasPassport) errors.push(`Person ${personNum}: Passport status is required`);
          if (participant.hasPassport === 'yes' && !participant.passportNationality) {
            errors.push(`Person ${personNum}: Passport issuing country is required`);
          }
        });
        
        // Check under-18 guardian requirements
        const under18Participants = getUnder18Participants();
        under18Participants.forEach(({ participant, index }) => {
          const personNum = index + 1;
          if (under18Guardian[index] === undefined) {
            errors.push(`Person ${personNum}: Guardian status is required (under 18)`);
          } else if (under18Guardian[index] === true) {
            if (!participant.guardianFirstName) {
              errors.push(`Person ${personNum}: Guardian first name is required`);
            }
            if (!participant.guardianLastName) {
              errors.push(`Person ${personNum}: Guardian last name is required`);
            }
          }
        });
        
        break;
      case 2:
        if (!formData.buyerInfo.firstName) errors.push('Buyer first name is required');
        if (!formData.buyerInfo.lastName) errors.push('Buyer last name is required');
        if (!formData.buyerInfo.email) errors.push('Buyer email is required');
        if (!formData.buyerInfo.confirmEmail) errors.push('Email confirmation is required');
        if (formData.buyerInfo.email && formData.buyerInfo.confirmEmail && formData.buyerInfo.email !== formData.buyerInfo.confirmEmail) {
          errors.push('Email addresses do not match');
        }
        if (!formData.buyerInfo.phone) errors.push('Buyer phone number is required');
        break;
      case 3:
        if (!formData.paymentMethod) errors.push('Please select a payment method');
        break;
      case 4:
        if (!formData.termsAccepted) errors.push('You must accept the terms and conditions to continue');
        break;
      case 5:
        // Payment step - no validation needed since we redirect to Stripe
        break;
      case 6:
        // Summary step is always valid
        break;
    }
    
    return errors;
  };

  const validateStep = (step: number): boolean => {
    return getValidationErrors(step).length === 0;
  };

  const nextStep = async () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const createStripeCheckout = async () => {
    setIsLoadingPayment(true);
    
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageName: packageData.packageName,
          packageId: packageData.packageId,
          spots: formData.spots,
          buyerInfo: formData.buyerInfo,
          participants: formData.participants,
          totalAmount: getAmountInCents(),
          participantCount: getTotalSpots(),
          paymentMethod: formData.paymentMethod
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to initialize payment. Please try again or contact support.');
      setIsLoadingPayment(false);
    }
  };

  const handleSubmit = async () => {
    try {
      // For non-Stripe payments, save the booking
      if (formData.paymentMethod !== 'stripe') {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            packageId: packageData.packageId,
              packageName: packageData.packageName,
            spots: formData.spots,
            buyerInfo: formData.buyerInfo,
            participants: formData.participants,
            paymentMethod: formData.paymentMethod,
            totalAmount: getAmountInCents()
          })
        });

        if (!response.ok) {
          throw new Error('Failed to save booking');
        }

        alert('Booking submitted successfully! We will contact you soon.');
        onClose();
      }
      // For Stripe payments, the payment is handled by the Payment Element
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
    }
  };

  const getAmountInCents = (): number => {
    // Price is per spot (per person)
    const dualTotal = formData.spots.dual * 420000;
    const tripleTotal = formData.spots.triple * 395000;
    const quadTotal = formData.spots.quad * 375000;
    return dualTotal + tripleTotal + quadTotal;
  };

  const getSelectedRoomPrice = () => {
    // Price is per spot (per person)
    const dualTotal = formData.spots.dual * 4200;
    const tripleTotal = formData.spots.triple * 3950;
    const quadTotal = formData.spots.quad * 3750;
    const totalPrice = dualTotal + tripleTotal + quadTotal;
    return `$${totalPrice.toLocaleString()}`;
  };

  const getSelectedRoomPriceNumber = () => {
    // Price is per spot (per person)
    const dualTotal = formData.spots.dual * 4200;
    const tripleTotal = formData.spots.triple * 3950;
    const quadTotal = formData.spots.quad * 3750;
    return dualTotal + tripleTotal + quadTotal;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-xl animate-scale-in border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{packageData.packageName}</h2>
            <p className="text-gray-600 mt-1">{packageData.dates} • {packageData.duration}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step) => (
              <div key={step.number} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  step.number <= currentStep
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step.number}
                </div>
                <span className={`ml-2 text-sm font-medium transition-colors duration-300 ${
                  step.number <= currentStep ? 'text-emerald-700' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {step.number < steps.length && (
                  <div className={`w-12 h-0.5 mx-4 transition-colors duration-300 ${
                    step.number < currentStep ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 overflow-y-auto max-h-[60vh]">
          {/* Step 1: Package Selection & Participant Info */}
          {currentStep === 1 && (
            <div className="space-y-8">
              {/* Package Selection Section */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Your Room Type</h3>
                <p className="text-sm text-gray-600 mb-6">Choose how many spots you need in each room type. Each spot is for 1 person.</p>
                
                <div className="space-y-4">
                  {roomOptions.map((room) => {
                    const roomType = room.type as 'dual' | 'triple' | 'quad';
                    const spots = formData.spots[roomType];
                    const pricePerSpot = room.priceNum;
                    const subtotal = spots * pricePerSpot;
                    
                    return (
                  <div
                    key={room.type}
                        className={`p-6 border-2 rounded-xl transition-all duration-200 ${
                          spots > 0
                            ? 'border-emerald-500 bg-emerald-50/50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          {/* Room Info */}
                          <div className="flex-1">
                            <div className="flex items-baseline gap-3 mb-2">
                              <h4 className="text-lg font-bold text-gray-900 capitalize">{room.type} Room</h4>
                              <span className="text-2xl font-bold text-emerald-600">{room.price}</span>
                              <span className="text-sm text-gray-500">per person</span>
                            </div>
                            <p className="text-gray-600 text-sm mb-1">{room.description}</p>
                            <p className="text-xs text-gray-500">Room capacity: {room.capacity} people</p>
                            {spots > 0 && (
                              <div className="mt-2">
                                <span className="text-sm font-semibold text-emerald-700">
                                  {spots} {spots === 1 ? 'spot' : 'spots'} × {room.price} = ${subtotal.toLocaleString()}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 md:min-w-[200px] justify-end">
                            <button
                              type="button"
                              onClick={() => handleSpotQuantityChange(roomType, spots - 1)}
                              className="w-10 h-10 flex items-center justify-center bg-white border-2 border-emerald-500 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-bold text-xl"
                              disabled={spots <= 0}
                            >
                              −
                            </button>
                            <div className="w-16 text-center">
                              <span className="text-3xl font-bold text-gray-900">{spots}</span>
                              <span className="text-xs text-gray-600 block">{spots === 1 ? 'spot' : 'spots'}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleSpotQuantityChange(roomType, spots + 1)}
                              className="w-10 h-10 flex items-center justify-center bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl"
                              disabled={spots >= 50}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary Box */}
                {getTotalSpots() > 0 && (
                  <div className="mt-6 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Booking Summary</h4>
                        <div className="space-y-1 text-sm text-gray-700">
                          <p><span className="font-semibold">Total People:</span> {getTotalSpots()}</p>
                          {formData.spots.dual > 0 && (
                            <p className="text-xs">• {formData.spots.dual} {formData.spots.dual === 1 ? 'person' : 'people'} in Dual rooms</p>
                          )}
                          {formData.spots.triple > 0 && (
                            <p className="text-xs">• {formData.spots.triple} {formData.spots.triple === 1 ? 'person' : 'people'} in Triple rooms</p>
                          )}
                          {formData.spots.quad > 0 && (
                            <p className="text-xs">• {formData.spots.quad} {formData.spots.quad === 1 ? 'person' : 'people'} in Quad rooms</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Total Price</p>
                        <p className="text-3xl font-bold text-emerald-600">
                          ${((formData.spots.dual * 4200) + (formData.spots.triple * 3950) + (formData.spots.quad * 3750)).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">for {getTotalSpots()} {getTotalSpots() === 1 ? 'person' : 'people'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Participant Information Section */}
              {getTotalSpots() > 0 && (
                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Participant Information</h3>
                  <p className="text-sm text-gray-600 mb-6">Please provide details for all {getTotalSpots()} {getTotalSpots() === 1 ? 'person' : 'people'} traveling.</p>
                  
                  <div className="space-y-6 max-h-[50vh] overflow-y-auto">
                    {formData.participants.map((participant, index) => (
                      <div key={index} className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                        <h4 className="text-md font-semibold text-gray-900 mb-4">Person {index + 1}</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* First Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                            <input
                              type="text"
                              value={participant.firstName}
                              onChange={(e) => handleParticipantChange(index, 'firstName', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900 placeholder-gray-500"
                              placeholder="Enter first name"
                              required
                            />
                          </div>
                          
                          {/* Last Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                            <input
                              type="text"
                              value={participant.lastName}
                              onChange={(e) => handleParticipantChange(index, 'lastName', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900 placeholder-gray-500"
                              placeholder="Enter last name"
                              required
                            />
                          </div>
                          
                          {/* Date of Birth */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                            <input
                              type="date"
                              value={participant.dateOfBirth}
                              onChange={(e) => handleParticipantChange(index, 'dateOfBirth', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900"
                              required
                            />
                          </div>
                          
                          {/* Gender */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                            <select
                              value={participant.gender}
                              onChange={(e) => handleParticipantChange(index, 'gender', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900"
                              required
                            >
                              <option value="">Select gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                          </div>
                          
                          {/* Phone */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                            <input
                              type="tel"
                              value={participant.phone}
                              onChange={(e) => {
                                const formatted = formatPhoneNumber(e.target.value);
                                handleParticipantChange(index, 'phone', formatted);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900 placeholder-gray-500"
                              placeholder="xxx-xxx-xxxx"
                              maxLength={12}
                              required
                            />
                          </div>
                          
                          {/* Nationality */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nationality *</label>
                            <input
                              type="text"
                              value={participant.nationality}
                              onChange={(e) => handleParticipantChange(index, 'nationality', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900 placeholder-gray-500"
                              placeholder="Enter nationality"
                              required
                            />
                          </div>
                          
                          {/* Passport Status */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Do you have a valid passport? *</label>
                            <select
                              value={participant.hasPassport}
                              onChange={(e) => handleParticipantChange(index, 'hasPassport', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900"
                              required
                            >
                              <option value="">Select option</option>
                              <option value="yes">Yes, I have a valid passport</option>
                              <option value="no">No, I need to obtain one</option>
                            </select>
                          </div>
                          
                          {/* Passport Issuing Country */}
                          {participant.hasPassport === 'yes' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Passport Issuing Country *</label>
                              <input
                                type="text"
                                value={participant.passportNationality}
                                onChange={(e) => handleParticipantChange(index, 'passportNationality', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900 placeholder-gray-500"
                                placeholder="Enter passport issuing country"
                                required
                              />
                            </div>
                          )}
                        </div>
                        
                        {/* Under 18 Guardian Check */}
                        {calculateAge(participant.dateOfBirth) < 18 && (
                          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-amber-800 text-sm font-medium mb-2">
                              This person is under 18 years old.
                            </p>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-amber-800 mb-2">
                                  Will this person be traveling with a legal guardian?
                                </label>
                                <div className="flex gap-4">
                                  <label className="flex items-center">
                                    <input
                                      type="radio"
                                      name={`guardian_${index}`}
                                      checked={under18Guardian[index] === true}
                                      onChange={() => handleGuardianResponse(index, true)}
                                      className="mr-2 text-emerald-600"
                                    />
                                    <span className="text-sm text-amber-800">Yes, traveling with guardian</span>
                                  </label>
                                  <label className="flex items-center">
                                    <input
                                      type="radio"
                                      name={`guardian_${index}`}
                                      checked={under18Guardian[index] === false}
                                      onChange={() => handleGuardianResponse(index, false)}
                                      className="mr-2 text-emerald-600"
                                    />
                                    <span className="text-sm text-amber-800">No, please contact us</span>
                                  </label>
                                </div>
                              </div>
                              
                              {/* Guardian Name Fields */}
                              {under18Guardian[index] === true && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-amber-300">
                                  <div>
                                    <label className="block text-sm font-medium text-amber-800 mb-1">Guardian First Name *</label>
                                    <input
                                      type="text"
                                      value={participant.guardianFirstName}
                                      onChange={(e) => handleParticipantChange(index, 'guardianFirstName', e.target.value)}
                                      className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900 placeholder-gray-500 bg-white"
                                      placeholder="Enter guardian's first name"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-amber-800 mb-1">Guardian Last Name *</label>
                                    <input
                                      type="text"
                                      value={participant.guardianLastName}
                                      onChange={(e) => handleParticipantChange(index, 'guardianLastName', e.target.value)}
                                      className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900 placeholder-gray-500 bg-white"
                                      placeholder="Enter guardian's last name"
                                      required
                                    />
                                  </div>
                                </div>
                              )}
                              
                              {under18Guardian[index] === false && (
                                <p className="text-xs text-amber-700 mt-2">
                                  Please contact our team to discuss arrangements for minors traveling without a legal guardian.
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Buyer Info */}
          {currentStep === 2 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Buyer Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      value={formData.buyerInfo.firstName}
                      onChange={(e) => handleInputChange('buyerInfo.firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900 placeholder-gray-500"
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={formData.buyerInfo.lastName}
                      onChange={(e) => handleInputChange('buyerInfo.lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900 placeholder-gray-500"
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.buyerInfo.email}
                    onChange={(e) => handleInputChange('buyerInfo.email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900 placeholder-gray-500"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Email Address *</label>
                  <input
                    type="email"
                    value={formData.buyerInfo.confirmEmail}
                    onChange={(e) => handleInputChange('buyerInfo.confirmEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900 placeholder-gray-500"
                    placeholder="Confirm email address"
                    required
                  />
                  {formData.buyerInfo.email && formData.buyerInfo.confirmEmail && formData.buyerInfo.email !== formData.buyerInfo.confirmEmail && (
                    <p className="text-red-500 text-xs mt-1">Email addresses do not match</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.buyerInfo.phone}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value);
                      handleInputChange('buyerInfo.phone', formatted);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900 placeholder-gray-500"
                    placeholder="xxx-xxx-xxxx"
                    maxLength={12}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment Method */}
          {currentStep === 3 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Choose Payment Method</h3>
              
              <div className="space-y-4">
                {/* Payment Schedule Summary */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Payment Schedule</h4>
                  {(() => {
                    const totalPackage = getSelectedRoomPriceNumber();
                    const totalPeople = getTotalSpots();
                    const depositPerPerson = 750;
                    const totalDeposit = depositPerPerson * totalPeople;
                    const remaining = totalPackage - totalDeposit;
                    const installmentAmount = Math.round((remaining / 3) * 100) / 100; // Round to 2 decimals
                    
                    // Calculate processing fee on total deposit
                    const baseAmount = totalDeposit * 100; // Convert to cents
                    const cardFeeRate = 0.029; // 2.9%
                    const cardFixedFee = 30; // $0.30 in cents
                    const achFeeRate = 0.008; // 0.8%
                    const achMaxFee = 500; // $5.00 in cents
                    
                    let processingFeeCents = 0;
                    if (formData.paymentMethod === 'bank_transfer') {
                      processingFeeCents = Math.min(Math.round(baseAmount * achFeeRate), achMaxFee);
                    } else {
                      processingFeeCents = Math.round(baseAmount * cardFeeRate) + cardFixedFee;
                    }
                    const processingFee = processingFeeCents / 100; // Convert back to dollars
                    
                    const totalToday = totalDeposit + processingFee;
                    // Adjust last installment to account for rounding
                    const installment1 = installmentAmount;
                    const installment2 = installmentAmount;
                    const installment3 = totalPackage - totalDeposit - installment1 - installment2; // Ensure exact total
                    
                    return (
                      <div className="space-y-2 text-sm text-gray-900">
                        <div className="flex justify-between">
                          <span className="text-gray-900">Deposit (Today):</span>
                          <span className="font-semibold text-gray-900">${totalDeposit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-900">Processing Fee:</span>
                          <span className="font-semibold text-gray-900">
                            ${processingFee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="border-t border-gray-200 pt-1 flex justify-between font-semibold">
                          <span className="text-gray-900">Total Today:</span>
                          <span className="text-gray-900">
                            ${totalToday.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-900">Installment 1:</span>
                          <span className="font-semibold text-gray-900">${installment1.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-900">Installment 2:</span>
                          <span className="font-semibold text-gray-900">${installment2.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-900">Installment 3:</span>
                          <span className="font-semibold text-gray-900">${installment3.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                          <span className="text-gray-900">Total Package:</span>
                          <span className="text-gray-900">{getSelectedRoomPrice()}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Payment Method Options */}
                <div className="space-y-4">
                  {/* Stripe Option */}
                  <div 
                    className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                      formData.paymentMethod === 'stripe' 
                        ? 'border-emerald-500 bg-emerald-50' 
                        : 'border-gray-200 bg-white hover:border-emerald-300'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'stripe' }))}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        formData.paymentMethod === 'stripe' ? 'bg-emerald-100' : 'bg-gray-100'
                      }`}>
                        <span className="text-2xl">💳</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">Credit/Debit Card (Stripe)</h4>
                        <p className="text-gray-600 text-sm">Pay securely online with automatic installment setup</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        formData.paymentMethod === 'stripe' 
                          ? 'border-emerald-500 bg-emerald-500' 
                          : 'border-gray-300'
                      }`}>
                        {formData.paymentMethod === 'stripe' && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                </div>
                    
                    {formData.paymentMethod === 'stripe' && (
                      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                <div>
                            <h6 className="font-medium text-blue-800 mb-1">How it works:</h6>
                            <ul className="text-xs text-blue-700 space-y-1">
                              <li>• Pay your $750 deposit today to secure your booking</li>
                              <li>• We&apos;ll send you payment links for future installments</li>
                              <li>• Installments are due monthly starting next month</li>
                              <li>• You&apos;ll receive email reminders before each payment</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bank Transfer Option */}
                  <div 
                    className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                      formData.paymentMethod === 'bank_transfer' 
                        ? 'border-emerald-500 bg-emerald-50' 
                        : 'border-gray-200 bg-white hover:border-emerald-300'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'bank_transfer' }))}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        formData.paymentMethod === 'bank_transfer' ? 'bg-emerald-100' : 'bg-gray-100'
                      }`}>
                        <span className="text-2xl">🏦</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">Bank Transfer (Stripe)</h4>
                        <p className="text-gray-600 text-sm">Pay via ACH, wire transfer, or other bank methods through Stripe</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        formData.paymentMethod === 'bank_transfer' 
                          ? 'border-emerald-500 bg-emerald-500' 
                          : 'border-gray-300'
                      }`}>
                        {formData.paymentMethod === 'bank_transfer' && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    {formData.paymentMethod === 'bank_transfer' && (
                      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <h6 className="font-medium text-blue-800 mb-1">How it works:</h6>
                            <ul className="text-xs text-blue-700 space-y-1">
                              <li>• Pay your $750 deposit via ACH or wire transfer</li>
                              <li>• Secure payment processing through Stripe</li>
                              <li>• We&apos;ll send you payment links for future installments</li>
                              <li>• You&apos;ll receive email reminders before each payment</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Terms & Contract */}
          {currentStep === 4 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Terms & Conditions</h3>
              
              <div className="space-y-6">
                {/* Contract PDF Display */}
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-300">
                    <h4 className="font-semibold text-gray-900">Booking Terms & Conditions</h4>
                    <p className="text-sm text-gray-600">Please review the contract below before proceeding</p>
                  </div>
                  
                  {/* PDF Embed */}
                  <div className="h-96 bg-gray-100">
                    <iframe
                      src="/contract.pdf"
                      className="w-full h-full border-0"
                      title="Booking Terms & Conditions"
                      onError={() => {
                        // Fallback if PDF doesn't load
                        const iframe = document.querySelector('iframe[title="Booking Terms & Conditions"]') as HTMLIFrameElement;
                        if (iframe) {
                          iframe.style.display = 'none';
                          const fallback = document.createElement('div');
                          fallback.className = 'flex items-center justify-center h-full text-gray-500';
                          fallback.innerHTML = `
                            <div class="text-center">
                              <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                              </svg>
                              <p class="text-lg font-medium mb-2">Contract PDF Not Found</p>
                              <p class="text-sm">Please add your contract.pdf file to the public folder</p>
                            </div>
                          `;
                          iframe.parentNode?.appendChild(fallback);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Terms Acceptance */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      id="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={(e) => handleInputChange('termsAccepted', e.target.checked.toString())}
                      className="mt-1 w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <div className="flex-1">
                      <label htmlFor="termsAccepted" className="text-sm font-medium text-gray-900 cursor-pointer">
                        I have read and agree to the Terms & Conditions
                  </label>
                      <p className="text-xs text-gray-600 mt-1">
                        By checking this box, you acknowledge that you have read, understood, and agree to be bound by the terms and conditions outlined in the contract above.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Legal Notice */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h5 className="text-sm font-semibold text-amber-800 mb-1">Important Notice</h5>
                      <p className="text-xs text-amber-700">
                        This booking is subject to the terms and conditions above. Please ensure you understand all terms before proceeding. 
                        If you have any questions, please contact us before completing your booking.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Payment */}
          {currentStep === 5 && (() => {
            // Calculate payment amounts
            const totalPackage = getSelectedRoomPriceNumber();
            const totalPeople = getTotalSpots();
            const depositPerPerson = 750;
            const totalDeposit = depositPerPerson * totalPeople;
            const remaining = totalPackage - totalDeposit;
            
            // Calculate processing fee on total deposit
            const baseAmount = totalDeposit * 100; // Convert to cents
            const cardFeeRate = 0.029; // 2.9%
            const cardFixedFee = 30; // $0.30 in cents
            const achFeeRate = 0.008; // 0.8%
            const achMaxFee = 500; // $5.00 in cents
            
            let processingFeeCents = 0;
            if (formData.paymentMethod === 'bank_transfer') {
              processingFeeCents = Math.min(Math.round(baseAmount * achFeeRate), achMaxFee);
            } else {
              processingFeeCents = Math.round(baseAmount * cardFeeRate) + cardFixedFee;
            }
            const processingFee = processingFeeCents / 100; // Convert back to dollars
            
            const totalToday = totalDeposit + processingFee;
            
            return (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Complete Your Payment</h3>
                
                <div className="text-center py-8">
                  <div className="mb-8">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      formData.paymentMethod === 'stripe' ? 'bg-emerald-100' : 'bg-amber-100'
                    }`}>
                      <span className="text-2xl">{formData.paymentMethod === 'stripe' ? '💳' : '🏦'}</span>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      {formData.paymentMethod === 'stripe' ? 'Ready to Pay Your Deposit' : 'Bank Transfer Instructions'}
                    </h4>
                    <p className="text-gray-600 mb-6">
                      {formData.paymentMethod === 'stripe' 
                        ? `Click the button below to securely pay your $${totalDeposit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} deposit and set up your installment plan.`
                        : `We'll send you bank transfer details after booking confirmation. Please pay your $${totalDeposit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} deposit within 48 hours.`
                      }
                    </p>
                    
                    <div className="bg-gray-50 rounded-lg p-6 mb-6 max-w-md mx-auto">
                      <h5 className="font-semibold text-gray-900 mb-3">Payment Summary</h5>
                      <div className="space-y-2 text-sm text-gray-900">
                        <div className="flex justify-between">
                          <span className="text-gray-900">Deposit (Today):</span>
                          <span className="font-semibold text-gray-900">${totalDeposit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-900">Processing Fee:</span>
                          <span className="font-semibold text-gray-900">
                            ${processingFee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                          <span className="text-gray-900">Total Today:</span>
                          <span className="text-gray-900">
                            ${totalToday.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-900">Future Installments:</span>
                          <span className="font-semibold text-gray-900">${remaining.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                          <span className="text-gray-900">Total Package:</span>
                          <span className="text-gray-900">{getSelectedRoomPrice()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {isLoadingPayment ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                      <span className="ml-3 text-gray-600">Redirecting to secure payment...</span>
                    </div>
                  ) : (
                    <button
                      onClick={createStripeCheckout}
                      className="w-full max-w-md bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Pay ${totalToday.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Now
                    </button>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-4">
                    {formData.paymentMethod === 'stripe' 
                      ? 'You\'ll be redirected to Stripe\'s secure payment page with card options'
                      : 'You\'ll be redirected to Stripe\'s secure payment page with bank transfer options (ACH, wire transfer, etc.)'
                    }
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Step 6: Summary */}
          {currentStep === 6 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Booking Summary</h3>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4 border border-gray-200">
                <div className="flex justify-between text-gray-900">
                  <span className="font-semibold">Package:</span>
                  <span>{packageData.packageName}</span>
                </div>
                <div>
                  <span className="font-semibold block mb-2 text-gray-900">Room Spots Selected:</span>
                  <div className="ml-4 space-y-1 text-sm text-gray-900">
                    {formData.spots.dual > 0 && (
                      <p>• {formData.spots.dual} {formData.spots.dual === 1 ? 'spot' : 'spots'} in Dual rooms ({formData.spots.dual} × $4,200)</p>
                    )}
                    {formData.spots.triple > 0 && (
                      <p>• {formData.spots.triple} {formData.spots.triple === 1 ? 'spot' : 'spots'} in Triple rooms ({formData.spots.triple} × $3,950)</p>
                    )}
                    {formData.spots.quad > 0 && (
                      <p>• {formData.spots.quad} {formData.spots.quad === 1 ? 'spot' : 'spots'} in Quad rooms ({formData.spots.quad} × $3,750)</p>
                    )}
                    <p className="font-semibold text-emerald-600 mt-2">
                      Total: {getTotalSpots()} {getTotalSpots() === 1 ? 'person' : 'people'}
                    </p>
                </div>
                </div>
                <div className="flex justify-between text-gray-900">
                  <span className="font-semibold">Number of People:</span>
                  <span>{participantCount}</span>
                </div>
                <div className="flex justify-between text-gray-900">
                  <span className="font-semibold">Buyer:</span>
                  <span>{formData.buyerInfo.firstName} {formData.buyerInfo.lastName}</span>
                </div>
                <div className="flex justify-between text-gray-900">
                  <span className="font-semibold">Contact Email:</span>
                  <span>{formData.buyerInfo.email}</span>
                </div>
                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">
                      Total Price (for {getTotalSpots()} {getTotalSpots() === 1 ? 'person' : 'people'}):
                    </span>
                    <span className="text-emerald-600">{getSelectedRoomPrice()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Validation Errors */}
        {!validateStep(currentStep) && (
          <div className="px-6 py-4 bg-red-50 border-t border-red-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-red-800 mb-2">Please complete the following:</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {getValidationErrors(currentStep).map((error, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors duration-200"
          >
            Previous
          </button>
          
          {currentStep === 5 ? (
            // Hide next button on payment step - payment redirects to Stripe
            null
          ) : currentStep < 6 ? (
            <button
              onClick={nextStep}
              disabled={!validateStep(currentStep)}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm ${
                validateStep(currentStep)
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentStep === 3 ? 'Continue to Terms' : currentStep === 4 ? 'Continue to Payment' : currentStep === 5 ? 'Continue to Summary' : 'Next'}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-sm"
            >
              Complete Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
}