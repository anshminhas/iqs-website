import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import logo from '../../assets/Logo.jpg';

interface NavbarProps {
  scrolled: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ scrolled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
        setActiveDropdown(null);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Check if current path is a service route
  const isServiceActive = location.pathname.includes('/services');

  // Desktop link styling
  const getNavLinkClass = (isActive: boolean) => {
    const baseClasses = 'px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg';
    
    if (isActive) {
      return `${baseClasses} bg-primary-600 text-white shadow-md hover:bg-primary-700`;
    }
    return scrolled 
      ? `${baseClasses} text-gray-800 hover:bg-gray-100 hover:text-primary-600`
      : `${baseClasses} text-black hover:bg-white/10 hover:shadow-sm`;
  };

  // Mobile link styling
  const getMobileNavLinkClass = (isActive: boolean) => {
    return `px-6 py-3 text-lg font-medium rounded-lg transition-colors ${
      isActive ? 'bg-primary-100 text-primary-600' : 'text-gray-800 hover:bg-gray-50'
    }`;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white shadow-lg py-2 backdrop-blur-sm bg-white/90'
        : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="z-50" onClick={closeMenu}>
            <img 
              src={logo} 
              alt="Logo" 
              className={`h-16 transition-all duration-300 ${
                scrolled ? 'w-32' : 'w-36'
              }`} 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" className={({ isActive }) => getNavLinkClass(isActive)} end>
              Home
            </NavLink>
            
            <NavLink to="/about" className={({ isActive }) => getNavLinkClass(isActive)}>
              About Us
            </NavLink>
            
            {/* Services Dropdown */}
            <div className="relative group">
              <button
                className={getNavLinkClass(isServiceActive)}
                onMouseEnter={() => setActiveDropdown('services')}
                onClick={() => setActiveDropdown(activeDropdown === 'services' ? null : 'services')}
              >
                <div className="flex items-center gap-1">
                  Services
                  <ChevronDown className={`w-4 h-4 transition-transform ${
                    activeDropdown === 'services' ? 'rotate-180' : ''
                  }`} />
                </div>
              </button>
              
              <div 
                className={`absolute left-0 mt-1 w-56 bg-white rounded-xl shadow-xl z-10 transition-all duration-300 origin-top ${
                  activeDropdown === 'services' 
                    ? 'opacity-100 scale-y-100' 
                    : 'opacity-0 scale-y-95 pointer-events-none'
                }`}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="p-2 space-y-1">
                  <NavLink
                    to="/services/hr-services"
                    className={({ isActive }) => 
                      `block px-4 py-3 text-sm rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-primary-600 text-white shadow-md' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    HR Services
                  </NavLink>
                  <NavLink
                    to="/services/recruitment-manpower"
                    className={({ isActive }) => 
                      `block px-4 py-3 text-sm rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-primary-600 text-white shadow-md' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    Recruitment & Manpower
                  </NavLink>
                  <NavLink
                    to="/services/rcu-verification"
                    className={({ isActive }) => 
                      `block px-4 py-3 text-sm rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-primary-600 text-white shadow-md' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    RCU & Verification
                  </NavLink>
                </div>
              </div>
            </div>
            
            <NavLink to="/contact" className={({ isActive }) => getNavLinkClass(isActive)}>
              Contact Us
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg focus:outline-none z-50"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <X className={`w-6 h-6 ${scrolled ? 'text-gray-800' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${scrolled ? 'text-gray-800' : 'text-white'}`} />
            )}
          </button>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="fixed inset-0 top-0 pt-24 pb-10 bg-white z-40 md:hidden px-6 overflow-y-auto">
              <div className="flex flex-col space-y-4">
                <NavLink
                  to="/"
                  className={({ isActive }) => getMobileNavLinkClass(isActive)}
                  onClick={closeMenu}
                  end
                >
                  Home
                </NavLink>
                
                <NavLink
                  to="/about"
                  className={({ isActive }) => getMobileNavLinkClass(isActive)}
                  onClick={closeMenu}
                >
                  About Us
                </NavLink>
                
                <div className="flex flex-col space-y-1 pl-4">
                  <div className="px-6 py-3 text-lg font-medium text-gray-800">Services</div>
                  <NavLink
                    to="/services/hr-services"
                    className={({ isActive }) => getMobileNavLinkClass(isActive)}
                    onClick={closeMenu}
                  >
                    HR Services
                  </NavLink>
                  <NavLink
                    to="/services/recruitment-manpower"
                    className={({ isActive }) => getMobileNavLinkClass(isActive)}
                    onClick={closeMenu}
                  >
                    Recruitment & Manpower
                  </NavLink>
                  <NavLink
                    to="/services/rcu-verification"
                    className={({ isActive }) => getMobileNavLinkClass(isActive)}
                    onClick={closeMenu}
                  >
                    RCU & Verification
                  </NavLink>
                </div>
                
                <NavLink
                  to="/contact"
                  className={({ isActive }) => 
                    `px-6 py-3 text-lg font-medium rounded-lg text-center ${
                      isActive 
                        ? 'bg-primary-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-800 hover:bg-primary-600 hover:text-white'
                    }`
                  }
                  onClick={closeMenu}
                >
                  Contact Us
                </NavLink>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;