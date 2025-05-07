import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import ContactForm from '../components/ui/ContactForm';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="py-6 px-4 bg-Gray shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          
          <nav className="hidden md:flex space-x-8">
            
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions or ready to get started? Our team is here to help you with all your HR solutions needs.
            </p>
          </div>
          
          {/* Contact Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h2>
              
              <ul className="space-y-6">
                <li className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <Phone className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Phone</p>
                    <a 
                      href="tel:+917042559158" 
                      className="text-gray-600 hover:text-primary-600 transition-colors text-lg"
                    >
                      +(91) 7042559158
                    </a>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <Mail className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Email</p>
                    <a 
                      href="mailto:info@iqsolutions.com" 
                      className="text-gray-600 hover:text-primary-600 transition-colors text-lg"
                    >
                      info@iqsindia.in
                    </a>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <MapPin className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Address</p>
                    <p className="text-gray-600 text-lg">
                      32, DDA Market,Preet Vihar, New Delhi, 110092, India
                    </p>
                    <Link 
                      to="https://maps.google.com" 
                      target="_blank"
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-1 inline-block"
                    >
                      View on Map →
                    </Link>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <Clock className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Office Hours</p>
                    <p className="text-gray-600 text-lg">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday - Sunday: Closed
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send Us a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-black py-12">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} IQSolutions. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;