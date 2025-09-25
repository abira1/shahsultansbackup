import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import Logo from '../ui/Logo';
const Footer: React.FC = () => {
  return <footer className="bg-primary text-white">
      <div className="container py-8 sm:py-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <Logo />
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-300">
              Shah Sultan's IELTS Academy is dedicated to helping students
              achieve their target band scores through personalized coaching and
              structured learning programs.
            </p>
            <div className="flex mt-4 sm:mt-6 space-x-3 sm:space-x-4">
              <a href="#" className="text-gray-300 hover:text-accent" aria-label="Facebook">
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-accent" aria-label="Instagram">
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-accent" aria-label="Twitter">
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-accent" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-accent text-xs sm:text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-accent text-xs sm:text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-300 hover:text-accent text-xs sm:text-sm">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/teachers" className="text-gray-300 hover:text-accent text-xs sm:text-sm">
                  Teachers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-accent text-xs sm:text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
              Resources
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-accent text-xs sm:text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-accent text-xs sm:text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-gray-300 hover:text-accent text-xs sm:text-sm">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-300 hover:text-accent text-xs sm:text-sm">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-accent text-xs sm:text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-accent mt-0.5" />
                <span className="text-xs sm:text-sm text-gray-300">
                  R.B. Complex, 6th Floor, East Zindabazar, Sylhet
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-accent" />
                <a href="tel:+8801646882798" className="text-xs sm:text-sm text-gray-300 hover:text-accent">
                  +880 1646-882798
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-accent" />
                <a href="mailto:info@shahsultanielts.com" className="text-xs sm:text-sm text-gray-300 hover:text-accent break-all">
                  info@shahsultanielts.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-6 sm:mt-10 pt-4 sm:pt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-400">
            © {new Date().getFullYear()} Shah Sultan's IELTS Academy. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;