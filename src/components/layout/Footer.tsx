import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Instagram, Twitter } from 'lucide-react';
import Logo from '../ui/Logo.tsx';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-600 dark:bg-gray-900 text-white pt-16 pb-8 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <Logo className="h-12 mb-4" />
            <p className="text-secondary-100 dark:text-gray-300 max-w-xs text-sm leading-relaxed">
              Providing top-tier HR, recruitment, and payroll services to businesses. Enhancing their operations by innovative and high-tech techniques.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/company/107093167/admin/dashboard/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://www.instagram.com/iqscareers_india?igsh=MXhwa3Z2dXhwM3MyeA%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-base font-montserrat font-semibold mb-5">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/services/hr-services" className="text-secondary-100 dark:text-gray-300 hover:text-white text-sm transition-colors">
                  HR Services
                </Link>
              </li>
              <li>
                <Link to="/services/recruitment-manpower" className="text-secondary-100 dark:text-gray-300 hover:text-white text-sm transition-colors">
                  Recruitment &amp; Manpower
                </Link>
              </li>
              <li>
                <Link to="/services/payroll" className="text-secondary-100 dark:text-gray-300 hover:text-white text-sm transition-colors">
                  Payroll Services
                </Link>
              </li>
              <li>
                <Link to="/services/project-outsourcing" className="text-secondary-100 dark:text-gray-300 hover:text-white text-sm transition-colors">
                  Project Outsourcing
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-montserrat font-semibold mb-5">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-secondary-100 dark:text-gray-300 hover:text-white text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-secondary-100 dark:text-gray-300 hover:text-white text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-secondary-100 dark:text-gray-300 hover:text-white text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base font-montserrat font-semibold mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="h-4 w-4 text-secondary-300 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-secondary-100 dark:text-gray-300 text-sm leading-relaxed block">
                    R-307, Third Floor, Dua Complex, 24 VS Block, Vikas Marg, Near Nirman Vihar Metro Station.<br />New Delhi, 110092
                  </span>
                  <a
                    href="https://www.google.com/maps/place/IQS-Integrated+Quality+Solutions+consultants+%26+Outsourcing+Services./@28.6353344,77.2851613,20.11z/data=!4m6!3m5!1s0x390cfd688764dc67:0xa00f900a4ac92f6!8m2!3d28.6353613!4d77.2852049!16s%2Fg%2F11xztgj_k9?entry=ttu&g_ep=EgoyMDI2MDIyNS4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-secondary-300 hover:text-white mt-1 inline-flex items-center gap-1 transition-colors"
                  >
                    📍 View on Google Maps →
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <Phone className="h-4 w-4 text-secondary-300 flex-shrink-0 mt-0.5" />
                <a href="tel:+917042559158" className="text-secondary-100 dark:text-gray-300 hover:text-white text-sm transition-colors">
                  +(91) 7042559158
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="h-4 w-4 text-secondary-300 flex-shrink-0 mt-0.5" />
                <a href="mailto:info@iqsindia.in" className="text-secondary-100 dark:text-gray-300 hover:text-white text-sm transition-colors">
                  info@iqsindia.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-primary-500 dark:border-gray-700 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-secondary-200 dark:text-gray-400 text-sm gap-4">
          <p>© {new Date().getFullYear()} IQS — Integrated Quality Solutions. All rights reserved.</p>
          <p className="text-xs">Made with ❤️ in India</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;