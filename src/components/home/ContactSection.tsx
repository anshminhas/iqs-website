import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import ContactForm from '../ui/ContactForm';
import { Link } from 'react-router-dom';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader
          title="Contact Us"
          subtitle="Have questions or ready to get started? Reach out to our team."
          centered
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8 bg-gray-50 p-8 rounded-xl shadow-sm">
            <div>
              <h3 className="text-2xl font-bold font-montserrat text-gray-900 mb-6">
                Get in Touch
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Fill out the form or contact us directly using the information below.
              </p>
              
              <ul className="space-y-6">
                <li className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <Phone className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Phone</p>
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
                    <p className="font-semibold text-gray-800">Email</p>
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
                    <p className="font-semibold text-gray-800">Address</p>
                    <p className="text-gray-600 text-lg">
                      32,DDA MarketPreet Vihar, New Delhi, 110092, India
                    </p>
                    <Link 
                      to="https://www.google.co.in/maps/place/Defence+Enclave+Market/@28.6410432,77.2815449,16z/data=!4m10!1m2!2m1!1s32,Defence+Enclave+,+dda+Market,preet+vihar!3m6!1s0x390cfb5743052565:0xa0295acac9588eec!8m2!3d28.6410432!4d77.2910721!15sCiszMixEZWZlbmNlIEVuY2xhdmUgLCBkZGEgTWFya2V0LHByZWV0IHZpaGFyWisiKTMyIGRlZmVuY2UgZW5jbGF2ZSBkZGEgbWFya2V0IHByZWV0IHZpaGFykgEGbWFya2V0qgFuEAEqGiIWZGRhIG1hcmtldCBwcmVldCB2aWhhcigAMh8QASIbuMVXTHWaTSjQxYjQtq4kW-_EqVczztHvZiw-Mi0QAiIpMzIgZGVmZW5jZSBlbmNsYXZlIGRkYSBtYXJrZXQgcHJlZXQgdmloYXLgAQA!16s%2Fg%2F11b6dbjy93?entry=ttu&g_ep=EgoyMDI1MDUwNi4wIKXMDSoJLDEwMjExNDU1SAFQAw%3D%3D" 
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
                    <p className="font-semibold text-gray-800">Office Hours</p>
                    <p className="text-gray-600 text-lg">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday - Sunday: Closed
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;