import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Sun, Moon, FileText, Users, DollarSign, LayoutDashboard, Phone, Globe } from 'lucide-react';
import logoLight from '../../assets/L.png';
import logoDark from '../../assets/d.png';
import { useTheme } from '../../context/ThemeContext';

const serviceItems = [
  {
    icon: FileText,
    label: 'HR Services',
    path: '/services/hr-services',
    desc: 'Payroll, attendance & compliance',
  },
  {
    icon: Users,
    label: 'Recruitment & Manpower',
    path: '/services/recruitment-manpower',
    desc: 'End-to-end hiring solutions',
  },
  {
    icon: DollarSign,
    label: 'Payroll Services',
    path: '/services/payroll',
    desc: 'Accurate & timely payroll processing',
  },
  {
    icon: Globe,
    label: 'Project Outsourcing',
    path: '/services/project-outsourcing',
    desc: 'Web, app development & maintenance',
  },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll detection for navbar glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const isServiceActive = location.pathname.startsWith('/services');

  const navLinkClass = (isActive: boolean) =>
    `relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${isActive
      ? 'text-primary-600 dark:text-blue-400'
      : 'text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-blue-400'
    } after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:rounded-full after:bg-primary-600 dark:after:bg-blue-400 after:transition-all after:duration-300 ${isActive ? 'after:w-6' : 'after:w-0 hover:after:w-6'
    }`;

  return (
    <header
      className={`fixed top-8 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isOpen
        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg'
        : 'bg-white dark:bg-gray-900 shadow-md'
        }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between h-20.5">
          {/* Logo */}
          <Link to="/" className="z-50 flex items-center">
            <img
              src={theme === 'dark' ? logoDark : logoLight}
              alt="IQS Logo"
              className={`object-contain transition-all duration-300 hover:scale-105  ${theme === 'dark' ? 'h-21 w-40 ' : 'h-21 w-40'
                }`}
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={({ isActive }) => navLinkClass(isActive)} end>
              Home
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => navLinkClass(isActive)}>
              About Us
            </NavLink>

            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setServicesOpen(p => !p)}
                className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${isServiceActive
                  ? 'text-primary-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-blue-400'
                  }`}
              >
                Services
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Mega Dropdown */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[420px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 origin-top ${servicesOpen
                  ? 'opacity-100 scale-y-100 pointer-events-auto'
                  : 'opacity-0 scale-y-95 pointer-events-none'
                  }`}
              >
                {/* Header */}
                <div className="px-5 py-3 bg-gradient-to-r from-primary-600 to-primary-500 flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-white" />
                  <span className="text-white text-xs font-semibold uppercase tracking-wider">Our Services</span>
                </div>

                <div className="p-3 grid gap-1">
                  {serviceItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-blue-400'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200'
                          }`
                        }
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/40 flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-800/40 transition-colors">
                          <Icon className="w-5 h-5 text-primary-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{item.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</div>
                        </div>
                      </NavLink>
                    );
                  })}
                </div>

                {/* Footer CTA */}
                <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
                  <Link
                    to="/contact"
                    className="flex items-center justify-center gap-2 text-xs font-semibold text-primary-600 dark:text-blue-400 hover:text-primary-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Discuss your requirements with us
                  </Link>
                </div>
              </div>
            </div>

            <NavLink to="/contact" className={({ isActive }) => navLinkClass(isActive)}>
              Contact Us
            </NavLink>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="relative w-14 h-7 rounded-full bg-gray-200 dark:bg-primary-700 transition-colors duration-300 flex items-center px-1 focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              <span
                className={`absolute left-1 top-1 w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-300 ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
                  }`}
              >
                {theme === 'dark' ? (
                  <Moon className="w-3 h-3 text-primary-600" />
                ) : (
                  <Sun className="w-3 h-3 text-yellow-500" />
                )}
              </span>
            </button>

            {/* Get a Quote CTA - Desktop */}
            <Link
              to="/contact"
              className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Book Demo
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsOpen(p => !p)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu — slide-down drawer */}
      <div
        className={`md:hidden fixed left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 shadow-xl overflow-y-auto transition-all duration-300 ease-in-out ${isOpen
          ? 'top-28 opacity-100 translate-y-0 pointer-events-auto max-h-[calc(100vh-7rem)]'
          : 'top-28 opacity-0 -translate-y-4 pointer-events-none max-h-0'
          }`}
        style={{ overflowY: isOpen ? 'auto' : 'hidden' }}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-4 py-3.5 rounded-xl text-base font-semibold transition-colors ${isActive
                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `px-4 py-3.5 rounded-xl text-base font-semibold transition-colors ${isActive
                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`
            }
          >
            About Us
          </NavLink>

          {/* Mobile Services Accordion */}
          <div className="rounded-xl overflow-hidden">
            <button
              onClick={() => setMobileServicesOpen(p => !p)}
              className="w-full flex items-center justify-between px-4 py-3.5 text-base font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-xl"
            >
              Services
              <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileServicesOpen && (
              <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-primary-100 dark:border-primary-800 pl-3">
                {serviceItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`
                      }
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/40 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-primary-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div>{item.label}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 font-normal">{item.desc}</div>
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `px-4 py-3.5 rounded-xl text-base font-semibold transition-colors ${isActive
                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`
            }
          >
            Contact Us
          </NavLink>

          <div className="pt-2 pb-2 px-1">
            <Link
              to="/contact"
              className="flex items-center justify-center w-full px-5 py-3.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-md"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </div>
    </header>

  );
};

export default Navbar;
