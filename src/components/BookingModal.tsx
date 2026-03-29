'use client';

import { useState, useEffect } from 'react';
import CountrySelect from '@/components/CountrySelect';
import DateOfBirthPicker from '@/components/DateOfBirthPicker';

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

interface ContractSection {
  heading: string;
  body?: string[];
  list?: string[];
}

const CONTRACT_SECTIONS: ContractSection[] = [
  {
    heading: 'Umrah Trip Agreement',
    body: [
      '﷽',
      'In the name of Allah, The Most Gracious, The Most Merciful.',
      'We testify that there is no God worthy of worship except Allah, and we testify that Prophet Muhammad (peace and blessings be upon him) is His final servant and messenger.',
      'This contract has been mutually agreed upon between Tadabbur Tours, LLC and the undersigned Participant. By signing this Agreement, the Participant acknowledges and agrees to be legally bound by the following terms and conditions.'
    ]
  },
  {
    heading: 'Trip Inclusions',
    body: ['Tadabbur Tours agrees to provide the following services as part of the Umrah Trip package:'],
    list: [
      'Round-trip airfare from the designated departure location',
      'Accommodation in a luxury hotel near the Haram',
      'Group transportation by bus as per the itinerary',
      'Daily buffet breakfast at the hotel',
      'Umrah visa for participants holding a U.S. passport',
      'Male Ihram garment',
      'Umrah guidebook'
    ]
  },
  {
    heading: 'Exclusions',
    body: ['The following items are not included in the Trip package and remain the sole responsibility of the Participant:'],
    list: [
      'Meals other than the buffet breakfast',
      'Fees related to green cards and/or non-U.S. passports',
      'Personal transportation outside of the group itinerary',
      'Any personal expenses or costs not associated with the group trip'
    ]
  },
  {
    heading: 'Visa Requirements',
    body: [
      'Tadabbur Tours will provide a standard Saudi e-tourist visa at no additional cost for all eligible passport holders, except for those from Pakistan, India, Bangladesh, Egypt, Morocco, and Somalia.',
      'Participants holding a U.S. green card and a passport from any of the above-listed countries, or any other country subject to Saudi visa regulations, will be required to pay an additional $100 fee for an Umrah visa.',
      'It is the sole responsibility of the Participant to ensure that their passport and/or green card is valid and meets the necessary entry requirements for Saudi Arabia.'
    ]
  },
  {
    heading: 'Payment Schedule & Participant Responsibility',
    body: [
      'The Participant acknowledges and agrees to the payment schedule as presented during the registration process. Payment amounts and due dates are displayed when selecting a payment method.',
      'All package prices are per person. If a Participant registers multiple people, they are responsible for the full payment of all individuals they registered. Each installment will reflect the total amount due for all registered participants.'
    ]
  },
  {
    heading: 'Refund Policy',
    body: [
      'The initial deposit is refundable until February 1, 2026. After flight tickets have been purchased, no refunds will be processed under any circumstances.',
      'The registered participant (signee) assumes full financial responsibility for all individuals included in their booking or package.',
      'All refunds will be issued to the original method of payment. If the original payment method is unavailable, Tadabbur Tours may issue the refund via check or bank transfer at its sole discretion.'
    ]
  },
  {
    heading: 'Media Release',
    body: ['By joining the trip, the Participant grants Tadabbur Tours permission to use any photos or videos taken during the trip for marketing and promotional purposes. This permission is permanent and irrevocable. The Participant understands they will not receive compensation for such use and waive the right to review or approve materials before publication.']
  },
  {
    heading: 'Assumption of Risk and Waiver of Liability',
    body: ['Participant acknowledges that participation in the Trip entails inherent risks, including but not limited to illness, injury, accidents, delays, and unforeseen events. By signing this Agreement, Participant assumes all such risks and agrees to waive any claims of liability against Tadabbur Tours, its directors, officers, employees, agents, or affiliates for any injury, loss, or damage sustained during the Trip, regardless of cause, including negligence.']
  },
  {
    heading: 'Indemnification and Force Majeure',
    body: [
      'Participant agrees to indemnify, defend, and hold harmless Tadabbur Tours, its affiliates, directors, officers, employees, and agents from any and all claims, liabilities, losses, damages, or expenses arising out of or in connection with this Agreement or the Participant’s conduct.',
      'Tadabbur Tours is not responsible for delays, changes, or cancellations caused by events beyond its control, including natural disasters, pandemics, government restrictions, airline cancellations, strikes, war, or other unforeseen circumstances. In such events, Tadabbur Tours may cancel, reschedule, or alter the itinerary without liability, and no refunds will be provided.'
    ]
  },
  {
    heading: 'Binding Arbitration',
    body: ['Any dispute arising out of or relating to this Agreement shall be resolved exclusively by binding arbitration pursuant to the rules of the American Arbitration Association (AAA). Arbitration shall be held in Minnesota, and the decision of the arbitrator(s) shall be final and binding. The prevailing party may recover reasonable attorneys’ fees and costs unless prohibited by law. Participant waives the right to initiate or participate in any class action lawsuits.']
  },
  {
    heading: 'Covid-19 and Health Compliance',
    body: ['Participant agrees to adhere to all health protocols required by Tadabbur Tours, airlines, hotels, or the government of Saudi Arabia, including vaccination requirements, mask mandates, or proof of a negative COVID-19 test. Tadabbur Tours is not liable for any illness or adverse health outcomes related to COVID-19 or other contagious diseases. Participant acknowledges the risk of exposure and releases Tadabbur Tours from any liability arising from such exposure.']
  },
  {
    heading: 'Governing Law and Severability',
    body: [
      'This Agreement shall be governed by the laws of the state of Minnesota. Any action or proceeding arising out of this Agreement that is not subject to arbitration shall be brought exclusively in the state or federal courts located in Minnesota.',
      'If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.'
    ]
  },
  {
    heading: 'Entire Agreement',
    body: ['This Agreement constitutes the entire understanding between Tadabbur Tours and Participant concerning the subject matter herein and supersedes any prior agreements or representations. This Agreement may only be amended in writing, signed by both parties.']
  },
  {
    heading: 'Acknowledgement',
    body: ['The individual agreeing to the terms and conditions of this contract does so on behalf of all attendees they registered, and confirms they have communicated these terms to each participant.']
  }
];

export default function BookingModal({ isOpen, onClose, packageData }: BookingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  /** Highest step the user has moved forward to — used to show “completed” styling when editing an earlier step */
  const [maxStepReached, setMaxStepReached] = useState(1);
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
  const [showFullContract, setShowFullContract] = useState(false);
  const [contractSignature, setContractSignature] = useState('');
  /** After user clicks Next (or nav forces validation), show inline errors until the step validates */
  const [stepsWithValidationShown, setStepsWithValidationShown] = useState<Set<number>>(new Set());

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

  useEffect(() => {
    if (!isOpen) {
      setShowFullContract(false);
      setContractSignature('');
    } else {
      setStepsWithValidationShown(new Set());
      setCurrentStep(1);
      setMaxStepReached(1);
    }
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
    // YYYY-MM-DD as date-only strings parse as UTC and shift the calendar day in US timezones
    const birthDate = /^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)
      ? new Date(`${dateOfBirth}T12:00:00`)
      : new Date(dateOfBirth);
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

  /** Field-keyed errors for inline messages (single source of truth with getValidationErrors) */
  const getFieldErrors = (step: number): Record<string, string> => {
    const e: Record<string, string> = {};
    switch (step) {
      case 1: {
        const total = getTotalSpots();
        if (total === 0) {
          e.spots = 'Please select at least one room spot';
          break;
        }
        formData.participants.slice(0, total).forEach((participant, index) => {
          const p = `p${index}`;
          if (!participant.firstName?.trim()) e[`${p}-firstName`] = 'First name is required';
          if (!participant.lastName?.trim()) e[`${p}-lastName`] = 'Last name is required';
          if (!participant.dateOfBirth) e[`${p}-dateOfBirth`] = 'Date of birth is required';
          if (!participant.phone?.trim()) e[`${p}-phone`] = 'Phone number is required';
          if (!participant.gender) e[`${p}-gender`] = 'Gender is required';
          if (!participant.nationality) e[`${p}-nationality`] = 'Country of citizenship is required';
          if (!participant.hasPassport) e[`${p}-hasPassport`] = 'Passport status is required';
          if (participant.hasPassport === 'yes' && !participant.passportNationality) {
            e[`${p}-passportNationality`] = 'Passport issuing country is required';
          }
        });
        const under18Participants = getUnder18Participants().filter(({ index }) => index < total);
        under18Participants.forEach(({ participant, index }) => {
          const p = `p${index}`;
          if (under18Guardian[index] === undefined) {
            e[`${p}-guardian`] = 'Please indicate guardian travel arrangements (required for travelers under 18)';
          } else if (under18Guardian[index] === true) {
            if (!participant.guardianFirstName?.trim()) e[`${p}-guardianFirstName`] = 'Guardian first name is required';
            if (!participant.guardianLastName?.trim()) e[`${p}-guardianLastName`] = 'Guardian last name is required';
          }
        });
        break;
      }
      case 2:
        if (!formData.buyerInfo.firstName?.trim()) e['buyer-firstName'] = 'Buyer first name is required';
        if (!formData.buyerInfo.lastName?.trim()) e['buyer-lastName'] = 'Buyer last name is required';
        if (!formData.buyerInfo.email?.trim()) e['buyer-email'] = 'Buyer email is required';
        if (!formData.buyerInfo.confirmEmail?.trim()) e['buyer-confirmEmail'] = 'Email confirmation is required';
        if (
          formData.buyerInfo.email &&
          formData.buyerInfo.confirmEmail &&
          formData.buyerInfo.email !== formData.buyerInfo.confirmEmail
        ) {
          e['buyer-emailMismatch'] = 'Email addresses do not match';
        }
        if (!formData.buyerInfo.phone?.trim()) e['buyer-phone'] = 'Buyer phone number is required';
        break;
      case 3:
        if (!formData.paymentMethod) e.paymentMethod = 'Please select a payment method';
        break;
      case 4:
        if (!contractSignature.trim()) e.contractSignature = 'Please type your full name to acknowledge the contract';
        if (!formData.termsAccepted) e.termsAccepted = 'You must accept the terms and conditions to continue';
        break;
      default:
        break;
    }
    return e;
  };

  const getValidationErrors = (step: number): string[] => Object.values(getFieldErrors(step));

  const validateStep = (step: number): boolean => {
    return getValidationErrors(step).length === 0;
  };

  /** After paint, scroll the first inline error in the modal body into view */
  const scrollFirstBookingErrorIntoView = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const root = document.querySelector('[data-booking-modal-body]');
        if (!root) return;
        const first = root.querySelector<HTMLElement>('[role="alert"]');
        if (!first) return;
        first.scrollIntoView({ block: 'center', behavior: 'smooth' });
      });
    });
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setStepsWithValidationShown((prev) => {
        const next = new Set(prev);
        next.delete(currentStep);
        return next;
      });
      setCurrentStep((prev) => {
        const n = Math.min(prev + 1, 6);
        setMaxStepReached((m) => Math.max(m, n));
        return n;
      });
    } else {
      setStepsWithValidationShown((prev) => new Set(prev).add(currentStep));
      scrollFirstBookingErrorIntoView();
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  /** Back: always. Forward to step N: only if steps 1..N-1 all validate. */
  const canNavigateToStep = (target: number): boolean => {
    if (target < 1 || target > 6) return false;
    if (target <= currentStep) return true;
    for (let s = 1; s < target; s++) {
      if (!validateStep(s)) return false;
    }
    return true;
  };

  const goToStep = (stepNumber: number) => {
    if (stepNumber < 1 || stepNumber > 6) return;
    if (stepNumber === currentStep) return;
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
      return;
    }
    if (!canNavigateToStep(stepNumber)) {
      for (let s = 1; s < stepNumber; s++) {
        if (!validateStep(s)) {
          setCurrentStep(s);
          setStepsWithValidationShown((prev) => new Set(prev).add(s));
          setTimeout(() => scrollFirstBookingErrorIntoView(), 0);
          return;
        }
      }
      return;
    }
    setCurrentStep(stepNumber);
    setMaxStepReached((m) => Math.max(m, stepNumber));
  };

  const createStripeCheckout = async () => {
    for (let s = 1; s <= 4; s++) {
      if (!validateStep(s)) {
        setCurrentStep(s);
        setStepsWithValidationShown((prev) => new Set(prev).add(s));
        setTimeout(() => scrollFirstBookingErrorIntoView(), 0);
        return;
      }
    }

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

      let data: { error?: string; url?: string };
      try {
        data = await response.json();
      } catch {
        throw new Error(`Checkout failed (${response.status}). Server may have returned a non-JSON response.`);
      }

      if (!response.ok) {
        const msg = (data && typeof data.error === 'string') ? data.error : `Checkout failed (${response.status})`;
        throw new Error(msg);
      }

      const url = data?.url;
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      const msg = error instanceof Error ? error.message : 'Failed to initialize payment. Please try again or contact support.';
      alert(msg);
      setIsLoadingPayment(false);
    }
  };

  const handleSubmit = async () => {
    for (let s = 1; s <= 4; s++) {
      if (!validateStep(s)) {
        setCurrentStep(s);
        setStepsWithValidationShown((prev) => new Set(prev).add(s));
        setTimeout(() => scrollFirstBookingErrorIntoView(), 0);
        return;
      }
    }

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

  const displayedContractSections = showFullContract ? CONTRACT_SECTIONS : CONTRACT_SECTIONS.slice(0, 3);

  const fieldErrors = getFieldErrors(currentStep);
  const stepValid = validateStep(currentStep);
  const showInlineFieldErrors =
    stepsWithValidationShown.has(currentStep) && !stepValid;

  const fieldMsg = (key: string) => (showInlineFieldErrors && fieldErrors[key] ? fieldErrors[key] : undefined);
  const fieldRing = (key: string) =>
    showInlineFieldErrors && fieldErrors[key] ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[min(92vh,880px)] flex flex-col shadow-xl animate-scale-in border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
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

        {/* Progress bar — original layout; steps clickable when allowed (forward only if prior steps valid) */}
        <div className="flex-shrink-0 px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step) => {
              const lockedForward = step.number > currentStep && !canNavigateToStep(step.number);
              const isActive = step.number === currentStep;
              const isCompleted = step.number <= maxStepReached && step.number !== currentStep;
              const circleClasses = isActive
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                : isCompleted
                  ? 'bg-gray-200 text-gray-600 ring-2 ring-emerald-500 ring-offset-2 ring-offset-gray-50'
                  : 'bg-gray-200 text-gray-500';
              const labelClasses = isActive
                ? 'text-emerald-700'
                : isCompleted
                  ? 'text-gray-600'
                  : 'text-gray-500';
              const segmentComplete = step.number < maxStepReached;
              return (
                <div key={step.number} className="flex items-center">
                  <button
                    type="button"
                    disabled={lockedForward}
                    onClick={() => goToStep(step.number)}
                    className="flex items-center bg-transparent border-0 p-0 text-left disabled:cursor-not-allowed disabled:opacity-50 enabled:cursor-pointer"
                    aria-current={isActive ? 'step' : undefined}
                    aria-label={
                      lockedForward
                        ? `Step ${step.number}: complete previous steps first`
                        : isCompleted
                          ? `Step ${step.number} completed: ${step.title}. Go to this step`
                          : `Go to ${step.title}`
                    }
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${circleClasses}`}
                    >
                      {step.number}
                    </div>
                    <span className={`ml-2 text-sm font-medium transition-colors duration-300 ${labelClasses}`}>
                      {step.title}
                    </span>
                  </button>
                  {step.number < steps.length && (
                    <div
                      className={`w-12 h-0.5 mx-4 transition-colors duration-300 ${
                        segmentComplete ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Compact notice — details are inline under each field */}
        {showInlineFieldErrors && (
          <div
            className="flex-shrink-0 px-4 sm:px-6 py-2.5 bg-red-50 border-b border-red-200"
            role="status"
            aria-live="polite"
          >
            <p className="text-sm text-red-800">
              Please fix the highlighted fields below, then press Next again.
            </p>
          </div>
        )}

        {/* Form Content — scrolls independently */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6 sm:p-8" data-booking-modal-body>
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

                {fieldMsg('spots') && (
                  <p className="text-red-600 text-sm mt-3" role="alert">
                    {fieldMsg('spots')}
                  </p>
                )}

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
                  
                  <div className="space-y-6">
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
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900 placeholder-gray-500 ${fieldRing(`p${index}-firstName`)}`}
                              placeholder="Enter first name"
                              required
                              aria-invalid={!!fieldMsg(`p${index}-firstName`)}
                            />
                            {fieldMsg(`p${index}-firstName`) && (
                              <p className="text-red-600 text-xs mt-1" role="alert">{fieldMsg(`p${index}-firstName`)}</p>
                            )}
                          </div>
                          
                          {/* Last Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                            <input
                              type="text"
                              value={participant.lastName}
                              onChange={(e) => handleParticipantChange(index, 'lastName', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900 placeholder-gray-500 ${fieldRing(`p${index}-lastName`)}`}
                              placeholder="Enter last name"
                              required
                              aria-invalid={!!fieldMsg(`p${index}-lastName`)}
                            />
                            {fieldMsg(`p${index}-lastName`) && (
                              <p className="text-red-600 text-xs mt-1" role="alert">{fieldMsg(`p${index}-lastName`)}</p>
                            )}
                          </div>
                          
                          {/* Date of Birth */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={`participant-${index}-dob`}>
                              Date of Birth <span className="text-red-500" aria-hidden>*</span>
                            </label>
                            <div className={fieldMsg(`p${index}-dateOfBirth`) ? 'rounded-lg ring-1 ring-red-500' : ''}>
                              <DateOfBirthPicker
                                id={`participant-${index}-dob`}
                                value={participant.dateOfBirth}
                                onChange={(v) => handleParticipantChange(index, 'dateOfBirth', v)}
                              />
                            </div>
                            {fieldMsg(`p${index}-dateOfBirth`) && (
                              <p className="text-red-600 text-xs mt-1" role="alert">{fieldMsg(`p${index}-dateOfBirth`)}</p>
                            )}
                          </div>
                          
                          {/* Gender */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                            <select
                              value={participant.gender}
                              onChange={(e) => handleParticipantChange(index, 'gender', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900 ${fieldRing(`p${index}-gender`)}`}
                              required
                              aria-invalid={!!fieldMsg(`p${index}-gender`)}
                            >
                              <option value="">Select gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                            {fieldMsg(`p${index}-gender`) && (
                              <p className="text-red-600 text-xs mt-1" role="alert">{fieldMsg(`p${index}-gender`)}</p>
                            )}
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
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900 placeholder-gray-500 ${fieldRing(`p${index}-phone`)}`}
                              placeholder="xxx-xxx-xxxx"
                              maxLength={12}
                              required
                              aria-invalid={!!fieldMsg(`p${index}-phone`)}
                            />
                            {fieldMsg(`p${index}-phone`) && (
                              <p className="text-red-600 text-xs mt-1" role="alert">{fieldMsg(`p${index}-phone`)}</p>
                            )}
                          </div>
                          
                          {/* Nationality — country of citizenship */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={`participant-${index}-nationality-select`}>
                              Country of citizenship (nationality) <span className="text-red-500" aria-hidden>*</span>
                            </label>
                            <div className={fieldMsg(`p${index}-nationality`) ? 'rounded-lg ring-1 ring-red-500' : ''}>
                              <CountrySelect
                                inputId={`participant-${index}-nationality-select`}
                                value={participant.nationality}
                                onChange={(v) => handleParticipantChange(index, 'nationality', v)}
                                placeholder="Search or select country…"
                              />
                            </div>
                            {fieldMsg(`p${index}-nationality`) && (
                              <p className="text-red-600 text-xs mt-1" role="alert">{fieldMsg(`p${index}-nationality`)}</p>
                            )}
                          </div>
                          
                          {/* Passport Status */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Do you have a valid passport? *</label>
                            <select
                              value={participant.hasPassport}
                              onChange={(e) => handleParticipantChange(index, 'hasPassport', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900 ${fieldRing(`p${index}-hasPassport`)}`}
                              required
                              aria-invalid={!!fieldMsg(`p${index}-hasPassport`)}
                            >
                              <option value="">Select option</option>
                              <option value="yes">Yes, I have a valid passport</option>
                              <option value="no">No, I need to obtain one</option>
                            </select>
                            {fieldMsg(`p${index}-hasPassport`) && (
                              <p className="text-red-600 text-xs mt-1" role="alert">{fieldMsg(`p${index}-hasPassport`)}</p>
                            )}
                          </div>
                          
                          {participant.hasPassport === 'yes' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={`participant-${index}-passport-country-select`}>
                                Passport issuing country <span className="text-red-500" aria-hidden>*</span>
                              </label>
                              <div className={fieldMsg(`p${index}-passportNationality`) ? 'rounded-lg ring-1 ring-red-500' : ''}>
                                <CountrySelect
                                  inputId={`participant-${index}-passport-country-select`}
                                  value={participant.passportNationality}
                                  onChange={(v) => handleParticipantChange(index, 'passportNationality', v)}
                                  placeholder="Search or select issuing country…"
                                />
                              </div>
                              {fieldMsg(`p${index}-passportNationality`) && (
                                <p className="text-red-600 text-xs mt-1" role="alert">{fieldMsg(`p${index}-passportNationality`)}</p>
                              )}
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
                                <div className={`flex gap-4 flex-wrap rounded-lg p-2 -m-2 ${fieldMsg(`p${index}-guardian`) ? 'ring-1 ring-red-500' : ''}`}>
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
                                {fieldMsg(`p${index}-guardian`) && (
                                  <p className="text-red-600 text-xs mt-1" role="alert">{fieldMsg(`p${index}-guardian`)}</p>
                                )}
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
                                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900 placeholder-gray-500 bg-white ${
                                        fieldMsg(`p${index}-guardianFirstName`) ? 'border-red-500 ring-1 ring-red-500' : 'border-amber-300'
                                      }`}
                                      placeholder="Enter guardian's first name"
                                      required
                                      aria-invalid={!!fieldMsg(`p${index}-guardianFirstName`)}
                                    />
                                    {fieldMsg(`p${index}-guardianFirstName`) && (
                                      <p className="text-red-600 text-xs mt-1" role="alert">{fieldMsg(`p${index}-guardianFirstName`)}</p>
                                    )}
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-amber-800 mb-1">Guardian Last Name *</label>
                                    <input
                                      type="text"
                                      value={participant.guardianLastName}
                                      onChange={(e) => handleParticipantChange(index, 'guardianLastName', e.target.value)}
                                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900 placeholder-gray-500 bg-white ${
                                        fieldMsg(`p${index}-guardianLastName`) ? 'border-red-500 ring-1 ring-red-500' : 'border-amber-300'
                                      }`}
                                      placeholder="Enter guardian's last name"
                                      required
                                      aria-invalid={!!fieldMsg(`p${index}-guardianLastName`)}
                                    />
                                    {fieldMsg(`p${index}-guardianLastName`) && (
                                      <p className="text-red-600 text-xs mt-1" role="alert">{fieldMsg(`p${index}-guardianLastName`)}</p>
                                    )}
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
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900 placeholder-gray-500 ${fieldRing('buyer-firstName')}`}
                      placeholder="Enter first name"
                      required
                      aria-invalid={!!fieldMsg('buyer-firstName')}
                    />
                    {fieldMsg('buyer-firstName') && (
                      <p className="text-red-600 text-xs mt-1" role="alert">{fieldMsg('buyer-firstName')}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={formData.buyerInfo.lastName}
                      onChange={(e) => handleInputChange('buyerInfo.lastName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900 placeholder-gray-500 ${fieldRing('buyer-lastName')}`}
                      placeholder="Enter last name"
                      required
                      aria-invalid={!!fieldMsg('buyer-lastName')}
                    />
                    {fieldMsg('buyer-lastName') && (
                      <p className="text-red-600 text-xs mt-1" role="alert">{fieldMsg('buyer-lastName')}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.buyerInfo.email}
                    onChange={(e) => handleInputChange('buyerInfo.email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900 placeholder-gray-500 ${
                      fieldMsg('buyer-email') || fieldMsg('buyer-emailMismatch') ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                    required
                    aria-invalid={!!fieldMsg('buyer-email') || !!fieldMsg('buyer-emailMismatch')}
                  />
                  {fieldMsg('buyer-email') && (
                    <p className="text-red-600 text-xs mt-1" role="alert">{fieldMsg('buyer-email')}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Email Address *</label>
                  <input
                    type="email"
                    value={formData.buyerInfo.confirmEmail}
                    onChange={(e) => handleInputChange('buyerInfo.confirmEmail', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900 placeholder-gray-500 ${
                      fieldMsg('buyer-confirmEmail') || fieldMsg('buyer-emailMismatch') ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm email address"
                    required
                    aria-invalid={!!fieldMsg('buyer-confirmEmail') || !!fieldMsg('buyer-emailMismatch')}
                  />
                  {fieldMsg('buyer-confirmEmail') && (
                    <p className="text-red-600 text-xs mt-1" role="alert">{fieldMsg('buyer-confirmEmail')}</p>
                  )}
                  {fieldMsg('buyer-emailMismatch') && (
                    <p className="text-red-600 text-xs mt-1" role="alert">{fieldMsg('buyer-emailMismatch')}</p>
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900 placeholder-gray-500 ${fieldRing('buyer-phone')}`}
                    placeholder="xxx-xxx-xxxx"
                    maxLength={12}
                    required
                    aria-invalid={!!fieldMsg('buyer-phone')}
                  />
                  {fieldMsg('buyer-phone') && (
                    <p className="text-red-600 text-xs mt-1" role="alert">{fieldMsg('buyer-phone')}</p>
                  )}
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
                  {fieldMsg('paymentMethod') && (
                    <p className="text-red-600 text-sm" role="alert">{fieldMsg('paymentMethod')}</p>
                  )}
                  {/* Stripe Option */}
                  <div 
                    className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                      formData.paymentMethod === 'stripe' 
                        ? 'border-emerald-500 bg-emerald-50' 
                        : fieldMsg('paymentMethod')
                          ? 'border-red-400 bg-red-50/30'
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
                        : fieldMsg('paymentMethod')
                          ? 'border-red-400 bg-red-50/30'
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
                {/* Contract Viewer */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-900">Booking Terms & Conditions</h4>
                    <p className="text-sm text-gray-600">Review the summary below. Expand to read the full agreement before continuing.</p>
                  </div>

                  <div className={`px-6 py-6 space-y-6 ${showFullContract ? 'max-h-[38rem]' : 'max-h-[24rem]'} overflow-y-auto`}> 
                    {displayedContractSections.map((section, index) => (
                      <div key={index} className="space-y-2">
                        <h5 className="text-base font-semibold text-gray-900">{section.heading}</h5>
                        {section.body?.map((paragraph, idx) => (
                          <p key={idx} className="text-sm text-gray-700 leading-relaxed">{paragraph}</p>
                        ))}
                        {section.list && (
                          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                            {section.list.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                    {!showFullContract && (
                      <div className="text-sm text-gray-500 italic">
                        Additional sections are available when you expand the full contract.
                      </div>
                    )}
                  </div>

                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <span className="text-xs text-gray-500">
                      {showFullContract ? 'You are viewing the complete contract.' : 'Previewing the opening sections of the contract.'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowFullContract(prev => !prev)}
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg border border-emerald-500 text-emerald-600 hover:bg-emerald-50 transition-colors duration-200"
                    >
                      {showFullContract ? 'Collapse Contract' : 'Read Full Contract'}
                    </button>
                  </div>
                </div>

                {/* Signature Acknowledgement */}
                <div className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-sm">
                  <label htmlFor="contractSignature" className="block text-sm font-semibold text-emerald-800 mb-2">
                    Type your full name to acknowledge the contract
                  </label>
                  <input
                    id="contractSignature"
                    type="text"
                    value={contractSignature}
                    onChange={(e) => setContractSignature(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-gray-900 ${
                      fieldMsg('contractSignature') ? 'border-red-500 ring-1 ring-red-500' : 'border-emerald-200'
                    }`}
                    placeholder="Full name as it appears on your booking"
                    aria-invalid={!!fieldMsg('contractSignature')}
                  />
                  {fieldMsg('contractSignature') && (
                    <p className="text-red-600 text-xs mt-1" role="alert">{fieldMsg('contractSignature')}</p>
                  )}
                  <p className="text-xs text-emerald-700 mt-2">
                    By typing your full name you confirm that you have read and understand the agreement on behalf of all attendees in your booking.
                  </p>
                </div>

                {/* Terms Acceptance */}
                <div
                  className={`bg-emerald-50 border rounded-lg p-6 ${
                    fieldMsg('termsAccepted') ? 'border-red-400 ring-1 ring-red-500' : 'border-emerald-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      id="termsAccepted"
                      checked={!!formData.termsAccepted}
                      onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
                      className="mt-1 w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      aria-invalid={!!fieldMsg('termsAccepted')}
                    />
                    <div className="flex-1">
                      <label htmlFor="termsAccepted" className="text-sm font-medium text-gray-900 cursor-pointer">
                        I have read and agree to the Terms & Conditions
                      </label>
                      <p className="text-xs text-gray-600 mt-1">
                        Checking this box confirms that the information above is accurate and that you agree to the contract terms.
                      </p>
                      {fieldMsg('termsAccepted') && (
                        <p className="text-red-600 text-xs mt-2" role="alert">{fieldMsg('termsAccepted')}</p>
                      )}
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
                        This booking is subject to the terms and conditions above. Please ensure you understand all terms before proceeding. If you have any questions, please contact us before completing your booking.
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
                <div className="flex justify-between text-gray-900">
                  <span className="font-semibold">Contract Acknowledgement:</span>
                  <span>{contractSignature || 'Pending signature'}</span>
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

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 border-t border-gray-200 bg-gray-50 gap-3">
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
              type="button"
              onClick={nextStep}
              className="px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
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