import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Facebook, Twitter } from 'lucide-react';
import Logo from '../ui/Logo.tsx';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-600 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <Logo className="h-12 mb-4" />
            <p className="text-secondary-100 max-w-xs">
              Providing top-tier HR, recruitment, and verification services to businesses. Enhancing their operations by innovative and high-tech techniques.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-secondary-300 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-secondary-300 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-secondary-300 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-montserrat font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/hr-services" className="text-secondary-100 hover:text-white transition-colors">
                  HR Services
                </Link>
              </li>
              <li>
                <Link to="/recruitment-manpower" className="text-secondary-100 hover:text-white transition-colors">
                  Recruitment & Manpower
                </Link>
              </li>
              <li>
                <Link to="/rcu-verification" className="text-secondary-100 hover:text-white transition-colors">
                  RCU & Verification
                </Link>
              </li>
              <li>
                
              </li>
              <li>
                
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-montserrat font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-secondary-100 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                
              </li>
              <li>
                
              </li>
              <li>
                
              </li>
              <li>
                <Link to="/contact" className="text-secondary-100 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-montserrat font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex">
                <MapPin className="mr-3 h-5 w-5 text-secondary-300 flex-shrink-0" />
                <span className="text-secondary-100">
                  32 ,DDA Market,Defence enclave,Preet Vihar, Delhi<br />New Delhi, 110092
                </span>
              </li>
              <li className="flex">
                <Phone className="mr-3 h-5 w-5 text-secondary-300 flex-shrink-0" />
                <a href="tel:+1234567890" className="text-secondary-100 hover:text-white transition-colors">
                  +(91) 7042559158
                </a>
              </li>
              <li className="flex">
                <Mail className="mr-3 h-5 w-5 text-secondary-300 flex-shrink-0" />
                <a href="mailto:info@iqsolutions.com" className="text-secondary-100 hover:text-white transition-colors">
                  info@iqsindia.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-primary-500 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-secondary-200 text-sm">
          <p>© {new Date().getFullYear()} IQS - Integrated Quality Solutions. All rights reserved.</p>
          <div className="flex mt-4 md:mt-0 space-x-6">
            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;