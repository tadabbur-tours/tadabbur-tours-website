/**
 * Shared types for the Tadabbur Tours app.
 * Use these across components, API routes, and libs for consistency.
 */

export type PackageStatus = 'standard' | 'sold-out' | 'inquiry' | 'premium';

export interface Package {
  id: string;
  name: string;
  price: string;
  duration: string;
  dates: string;
  /** Short card blurb under dates (unique per package) */
  tagline: string;
  status: PackageStatus;
  soldOut: boolean;
}

export interface BookingModalData {
  packageId: string;
  packageName: string;
  price: string;
  dates: string;
  duration: string;
}

export interface SacredSite {
  name: string;
  image: string;
  description: string;
}

export interface Testimonial {
  text: string;
  author: string;
  stars: number;
}

export interface NavItem {
  label: string;
  sectionId: string;
}

export interface ContactItem {
  icon: string;
  title: string;
  info: string;
  description: string;
  link?: string;
}
