'use client';

import Image from 'next/image';
import Link from 'next/link';
import { NAV_ITEMS } from '@/config/site';

interface HeaderProps {
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onNavigate: (sectionId: string) => void;
}

export default function Header({
  isScrolled,
  isMobileMenuOpen,
  onToggleMobileMenu,
  onNavigate,
}: HeaderProps) {
  const linkClass = isScrolled ? 'text-gray-700 hover:text-amber-600' : 'text-white hover:text-amber-200';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="#" className="flex items-center group">
            <Image
              src="/logo.png"
              alt="Tadabbur Logo"
              width={isScrolled ? 80 : 100}
              height={isScrolled ? 80 : 100}
              className={`transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${isScrolled ? '' : 'brightness-0 invert'}`}
              style={{ width: 'auto', height: 'auto' }}
            />
            {isScrolled && (
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                Tadabbur Tours
              </span>
            )}
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex space-x-8">
            {NAV_ITEMS.slice(0, -1).map((item) => (
              <li key={item.sectionId}>
                <button
                  onClick={() => onNavigate(item.sectionId)}
                  className={`relative px-4 py-2 font-medium transition-all duration-300 hover:scale-105 ${linkClass}`}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300 hover:w-full" />
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => onNavigate(NAV_ITEMS[NAV_ITEMS.length - 1].sectionId)}
                className="relative px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5"
              >
                {NAV_ITEMS[NAV_ITEMS.length - 1].label}
              </button>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={onToggleMobileMenu}
            className={`lg:hidden relative w-8 h-8 flex flex-col justify-center items-center transition-all duration-300 ${linkClass}`}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`} />
            <span className={`w-6 h-0.5 bg-current mt-1 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-current mt-1 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 space-y-4 bg-white/95 backdrop-blur-md rounded-2xl mt-4 shadow-xl border border-gray-200">
            {NAV_ITEMS.map((item, index) => {
              const isCta = index === NAV_ITEMS.length - 1;
              return (
                <button
                  key={item.sectionId}
                  onClick={() => {
                    onNavigate(item.sectionId);
                    onToggleMobileMenu();
                  }}
                  className={
                    isCta
                      ? 'block w-full px-6 py-3 mx-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full text-center font-semibold hover:shadow-lg transition-all duration-300'
                      : 'block w-full text-left px-6 py-3 text-gray-700 hover:text-amber-600 hover:bg-amber-50 transition-all duration-300'
                  }
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
