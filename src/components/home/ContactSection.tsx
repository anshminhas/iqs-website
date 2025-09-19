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
                      R-307, Third Floor, Dua Complex,24 vs Block , Above Raeev watch & co, Vikas marg , Near Nirman vihar metro station , Delhi -92. 
                    </p>
                    <Link 
                      to="https://www.google.com/search?q=Dua+Complex%2C+Vikas+Marg%2C+near+Metro+Pillar+Number+59%2C+Veer+Savarkar+Block%2C+Dayanand+Colony%2C+Shakarpur%2C+New+Delhi%2C+Delhi%2C+110092&sca_esv=39b9ebc457fec9be&sxsrf=AE3TifOnxIUdUYsG_qF5oxAmJ5-NJxRc6A%3A1758270923042&ei=yxXNaJOtAqi4seMP173ikAM&ved=0ahUKEwjTvqXOteSPAxUoXGwGHdeeGDIQ4dUDCBA&uact=5&oq=Dua+Complex%2C+Vikas+Marg%2C+near+Metro+Pillar+Number+59%2C+Veer+Savarkar+Block%2C+Dayanand+Colony%2C+Shakarpur%2C+New+Delhi%2C+Delhi%2C+110092&gs_lp=Egxnd3Mtd2l6LXNlcnAif0R1YSBDb21wbGV4LCBWaWthcyBNYXJnLCBuZWFyIE1ldHJvIFBpbGxhciBOdW1iZXIgNTksIFZlZXIgU2F2YXJrYXIgQmxvY2ssIERheWFuYW5kIENvbG9ueSwgU2hha2FycHVyLCBOZXcgRGVsaGksIERlbGhpLCAxMTAwOTIyDRAuGNEDGMcBGCcY6gIyBxAjGCcY6gIyBxAjGCcY6gIyBxAuGCcY6gIyBxAjGCcY6gIyBxAjGCcY6gIyBxAjGCcY6gIyBxAjGCcY6gIyBxAjGCcY6gIyBxAjGCcY6gJIyR9QmgVY6RtwAXgAkAEAmAEAoAEAqgEAuAEDyAEA-AEB-AECmAIBoAIMqAIKmAMM8QUEatfqIKiE-pIHATGgBwCyBwC4BwDCBwMzLTHIBwg&sclient=gws-wiz-serp&lqi=Cn9EdWEgQ29tcGxleCwgVmlrYXMgTWFyZywgbmVhciBNZXRybyBQaWxsYXIgTnVtYmVyIDU5LCBWZWVyIFNhdmFya2FyIEJsb2NrLCBEYXlhbmFuZCBDb2xvbnksIFNoYWthcnB1ciwgTmV3IERlbGhpLCBEZWxoaSwgMTEwMDkySMznnNCaqoCACFqlARAAEAEQAhADGAAYARgCGAMYBRgGGAcYCBgJGAoYCxgMGA0YDhgPGBAYERgSIndkdWEgY29tcGxleCB2aWthcyBtYXJnIG5lYXIgbWV0cm8gcGlsbGFyIG51bWJlciA1OSB2ZWVyIHNhdmFya2FyIGJsb2NrIGRheWFuYW5kIGNvbG9ueSBzaGFrYXJwdXIgbmV3IGRlbGhpIGRlbGhpIDExMDA5MpIBC3dhdGNoX3N0b3JlqgG8ARABKhoiFmR1YSBjb21wbGV4IHZpa2FzIG1hcmcoADIfEAEiG9fkoAx_PNT25QViokHVIsaHk-FF6R-sVl6DLTJ7EAIid2R1YSBjb21wbGV4IHZpa2FzIG1hcmcgbmVhciBtZXRybyBwaWxsYXIgbnVtYmVyIDU5IHZlZXIgc2F2YXJrYXIgYmxvY2sgZGF5YW5hbmQgY29sb255IHNoYWthcnB1ciBuZXcgZGVsaGkgZGVsaGkgMTEwMDky#rlimm=7170322026732738597"
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
                      Monday - Saturday: 9:00 AM - 6:00 PM<br />
                       Sunday: Closed
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