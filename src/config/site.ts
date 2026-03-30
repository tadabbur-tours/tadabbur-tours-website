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
  'gallery-3.JPG',
  'captured-moments-6.JPG',
  'captured-moments-7.JPG',
  'captured-moments-8.JPG',
  'gallery-1.JPG',
  'gallery-2.JPG',
  'captured-moments-9.JPG',
];

export const SACRED_SITES: SacredSite[] = [
  { name: 'Makkah', image: 'ts26-makkah.jpeg', description: 'Experience the spiritual center of Islam. Perform Umrah at the Ka\'bah and walk in the footsteps of Prophet Ibrahim (AS).' },
  { name: 'Jabal Nur', image: 'ts26-jabal-al-nur.JPG', description: 'Stand at the Cave of Hira where the first revelation "Iqra" descended upon Prophet Muhammad (SAW).' },
  { name: 'Madinah', image: 'ts25-madinah.JPG', description: 'Visit the Prophet\'s Mosque and experience the blessed Rawdah, a piece of Jannah on earth.' },
  { name: 'Mount Uhud', image: 'ts26-uhud.JPG', description: 'Reflect on the lessons of the Battle of Uhud and visit the graves of the martyrs including Hamza (RA).' },
  { name: 'Badr', image: 'ts26-badr.JPG', description: 'Walk the battlefield where 313 believers faced impossible odds with divine assistance.' },
  { name: 'Ta\'if', image: 'ts26-taif.JPG', description: 'Trace the difficult journey of the Prophet (SAW) and understand his perseverance in the face of rejection.' },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    text: "Thank you all for your services and hard work you did for us to make us very comfortable. I really enjoyed your company in Omraa. I wish you all the best and Omraa Makboula inchalah.",
    author: 'Fatima Azami',
    stars: 5,
  },
  {
    text: "We would like to thank the Tabbour Family for giving us this experience and the staffs are very knowledgeable and helpful. Thank you again for the friendship and kindness that were given to us. May Allah Subhanahu Wa Ta'ala reward you for your efforts.",
    author: 'Rozani Rashid',
    stars: 5,
  },
  {
    text: "Thank you so much for arranging such a wonderful trip. Visiting a place and truly experiencing it are two very different things, and the entire Taddabur team brought those experiences to life beautifully. We truly appreciate all the sincere effort and care you put into every detail. May Allah accept it from you and from us. Aameen.",
    author: 'Maeda Muneeb',
    stars: 5,
  },
  {
    text: "I just wanted to take a moment to say JAK to each and every one of you for making our Umrah journey so special. Especially our sisters’ leaders 🫶🏽❤️. Sharing Allah’s house, the duas, the tawaf, and all the moments in between with such a beautiful group was truly a blessing we will always cherish.",
    author: 'Nimo Salah',
    stars: 5,
  },
  {
    text: "Assalamu'alaikum. Dear Tadabbur Family. We would like to thank everyone for the wonderful Umrah experience and all the interesting side trips that went on. We learned a lot. The leaders of the Tadabbur know their subject very well. It was a pleasure to meet all the brothers and sisters; it was a trip of a lifetime.",
    author: 'Michael Lindgren',
    stars: 5,
  },
  {
    text: "The organizers of our group made everything so easy for all of us. We did not have to worry about anything. They were wonderful. Also I appreciate the camaraderie of all of you brothers. It was a great honor to team up with a great group of people like you under the leadership of capable, endearing, always helpful and very knowledgeable group of young and energetic people. We will always remember and cherish your kindness. It was great to get to know you all. May Allah bless you all and your families.",
    author: 'Mohammad Rashid',
    stars: 5,
  },
  {
    text: "Thank you for putting together such a meaningful and thoughtfully guided Umrah trip. Being present in the sacred places is powerful on its own, but being guided to truly understand their significance, history, and purpose made this journey far deeper and more impactful. The intention, care, and sincerity behind every aspect of the trip were clear from start to finish. A heartfelt thank you to the entire Tadabbur team for planning and delivering an Umrah experience that went far beyond rituals. The balance of ibadah, learning, reflection, and the companionship of fellow brothers and sisters created an atmosphere that was both uplifting and grounding. Every activity was carefully planned and exceptionally well organized. The team worked tirelessly to ensure no detail was overlooked and that every individual felt supported and cared for throughout the journey and it truly showed. The local luxury food experience in Taif and all the museum visits were truly special once-in-a-lifetime experiences that added a rich and beautiful dimension to the journey. We are deeply grateful for your dedication, service, and commitment. May Allah accept all of your efforts, place immense barakah in them, and reward you abundantly in this world and the hereafter. Aameen. Truly proud to be part of the Tadabbur tribe!",
    author: 'Muneeb Ahmed',
    stars: 5,
  },
  {
    text: "Thank you to the entire Taf-Seerah team for an amazing and truly memorable Umrah trip. Beyond the deep spiritual experience, the whole journey was enriched with history, learning, and the wonderful company of our brothers and sisters. Even though there were some airline-related issues that were beyond your control, everything else went perfectly fine. The trip was very well organized and managed on time, and all the arrangements were excellent. It truly reflected the team’s dedication and hard work in ensuring a smooth and meaningful experience for everyone. We are truly grateful to the entire Taf-Seerah team for your hard work, dedication, and commitment. May Allah accept all your efforts and reward you abundantly in this world and in the hereafter. Ameen.",
    author: 'Sohail Ahmed',
    stars: 5,
  },
  {
    text: "You guys are awesome MashaAllah! Can’t ask for more.",
    author: 'Afzal Mohideen Syed Mohamed',
    stars: 5,
  },
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
