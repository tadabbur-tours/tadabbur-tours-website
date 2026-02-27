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
    status: 'sold-out',
    soldOut: true,
  },
  {
    id: 'december',
    name: 'December Umrah',
    price: '$3,750',
    duration: '10 days',
    dates: 'December 23, 2026 – January 3, 2027',
    status: 'standard',
    soldOut: false,
  },
  {
    id: 'august',
    name: 'August Umrah',
    price: '$3,300',
    duration: '10 days',
    dates: 'August 5-15, 2027',
    status: 'inquiry',
    soldOut: false,
  },
];

export const GALLERY_SLIDES = [
  'gallery-1.JPG',
  'gallery-2.JPG',
  'gallery-3.JPG',
  'gallery-5.jpg',
  'gallery-6.jpg',
];

export const SACRED_SITES: SacredSite[] = [
  { name: 'Makkah', image: 'makkah.jpg', description: 'Experience the spiritual center of Islam. Perform Umrah at the Ka\'bah and walk in the footsteps of Prophet Ibrahim (AS).' },
  { name: 'Jabal Nur', image: 'jabal-nur.jpg', description: 'Stand at the Cave of Hira where the first revelation "Iqra" descended upon Prophet Muhammad (SAW).' },
  { name: 'Madinah', image: 'madinah.jpg', description: 'Visit the Prophet\'s Mosque and experience the blessed Rawdah, a piece of Jannah on earth.' },
  { name: 'Mount Uhud', image: 'uhud.jpg', description: 'Reflect on the lessons of the Battle of Uhud and visit the graves of the martyrs including Hamza (RA).' },
  { name: 'Badr', image: 'badr.jpg', description: 'Walk the battlefield where 313 believers faced impossible odds with divine assistance.' },
  { name: 'Ta\'if', image: 'taif.jpg', description: 'Trace the difficult journey of the Prophet (SAW) and understand his perseverance in the face of rejection.' },
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
