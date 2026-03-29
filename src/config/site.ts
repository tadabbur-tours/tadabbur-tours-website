/**
 * Site-wide content and configuration.
 * Edit here to add packages, change copy, or update nav without touching components.
 */

import type { Package, SacredSite, Testimonial, NavItem, ContactItem } from '@/lib/types';

export const SITE_NAME = 'Tadabbur Tours';

export const NAV_ITEMS: NavItem[] = [
  { label: 'About', sectionId: 'about' },
  { label: 'The Experience', sectionId: 'taf-seerah' },
  { label: 'Gallery', sectionId: 'gallery' },
  { label: 'Contact Us', sectionId: 'contact' },
];

export const PACKAGES: Package[] = [
  {
    id: 'january',
    name: 'January Umrah',
    price: '$3,300',
    duration: '10 days',
    dates: 'January 7-18, 2026',
    tagline: 'An experience worth reliving.',
    status: 'sold-out',
    soldOut: true,
  },
  {
    id: 'december',
    name: 'December Umrah',
    price: '$3,750',
    duration: '10 days',
    /** Abbrev. months so the range fits one line in package cards */
    dates: 'Dec 23, 2026 – Jan 3, 2027',
    tagline: 'A premium experience at a competitive price',
    status: 'standard',
    soldOut: false,
  },
  {
    id: 'august',
    name: 'August Umrah',
    price: '$3,300',
    duration: '10 days',
    dates: 'August 5-15, 2027',
    tagline: 'Where Islam is lived, not merely visited.',
    status: 'inquiry',
    soldOut: false,
  },
];

export const GALLERY_SLIDES = [
  'captured-moments-1.JPG',
  'captured-moments-2.JPG',
  'captured-moments-3.JPG',
  'captured-moments-4.JPG',
  'captured-moments-5.JPG',
  'captured-moments-6.JPG',
  'captured-moments-7.JPG',
  'captured-moments-8.JPG',
  'gallery-1.JPG',
  'gallery-2.JPG',
  'gallery-3.JPG',
];

export const SACRED_SITES: SacredSite[] = [
  { name: 'Makkah', image: 'ts26-makkah.jpeg', description: 'Experience the spiritual center of Islam. Perform Umrah at the Ka\'bah and walk in the footsteps of Prophet Ibrahim (AS).' },
  { name: 'Jabal Nur', image: 'ts26-jabal-al-nur.JPG', description: 'Stand at the Cave of Hira where the first revelation "Iqra" descended upon Prophet Muhammad (SAW).' },
  { name: 'Madinah', image: 'ts25-madinah.jpeg', description: 'Visit the Prophet\'s Mosque and experience the blessed Rawdah, a piece of Jannah on earth.' },
  { name: 'Mount Uhud', image: 'ts26-uhud.JPG', description: 'Reflect on the lessons of the Battle of Uhud and visit the graves of the martyrs including Hamza (RA).' },
  { name: 'Badr', image: 'ts26-badr.JPG', description: 'Walk the battlefield where 313 believers faced impossible odds with divine assistance.' },
  { name: 'Ta\'if', image: 'ts26-taif.JPG', description: 'Trace the difficult journey of the Prophet (SAW) and understand his perseverance in the face of rejection.' },
];

export const TESTIMONIALS: Testimonial[] = [
  { text: "It's an experience I'll cherish forever and hope to revisit, insha'Allah.", author: 'Abdullahi A.', stars: 5 },
  { text: "I don't think this trip will ever be outbeat.", author: '— Hanad A.', stars: 5 },
  { text: 'Wonderful itinerary and meaningful reflections. Highly recommend Tadabbur for a transformative Umrah.', author: '— Fatima R.', stars: 5 },
  { text: 'Professional team, inspiring sessions, and smooth logistics. It exceeded my expectations.', author: '— Muhammad A.', stars: 5 },
];

export const EXPERIENCE_FEATURES = [
  { icon: '📖', title: 'Deepen Your Connection with the Qur\'an', desc: 'Study the Qur\'an in the very land where it was revealed, allowing you to absorb its meanings and significance like never before.' },
  { icon: '🕌', title: 'Learn from the Seerah', desc: 'Experience the Seerah come to life as you walk the path of the Prophet Muhammad (SAW) and reflect on his timeless message.' },
  { icon: '🤲', title: 'Guided Tours', desc: 'We guide you through the story as it unfolded, in the lands where they first took place.' },
  { icon: '✨', title: 'Reconnect and Transform', desc: 'Rediscover your purpose through reflection, revelation, and transformation.' },
];

export const CONTACT_ITEMS: ContactItem[] = [
  { icon: '📧', title: 'Email', info: 'info@tadabburtours.com', description: 'Send us your questions anytime' },
  { icon: '📱', title: 'Phone', info: '+1 (763) 772-2055', description: 'Call us for immediate assistance' },
  { icon: '📷', title: 'Instagram', info: '@tadabburtours', description: 'Follow us for updates and journey highlights', link: 'https://instagram.com/tadabburtours' },
];

export const FLICKR_GALLERY_URL = 'https://flic.kr/s/aHBqjC18Bk';
