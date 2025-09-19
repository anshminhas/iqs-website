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
                      R-307, Third Floor, Dua Complex,24 vs Block , Above Raeev watch & co, Vikas marg , Near Nirman vihar metro station , Delhi -92. 
                    </p>
                    <Link 
                      to="https://www.google.com/search?q=Dua+Complex%2C+Vikas+Marg%2C+near+Metro+Pillar+Number+59%2C+Veer+Savarkar+Block%2C+Dayanand+Colony%2C+Shakarpur%2C+New+Delhi%2C+Delhi%2C+110092&sca_esv=39b9ebc457fec9be&sxsrf=AE3TifOnxIUdUYsG_qF5oxAmJ5-NJxRc6A%3A1758270923042&ei=yxXNaJOtAqi4seMP173ikAM&ved=0ahUKEwjTvqXOteSPAxUoXGwGHdeeGDIQ4dUDCBA&uact=5&oq=Dua+Complex%2C+Vikas+Marg%2C+near+Metro+Pillar+Number+59%2C+Veer+Savarkar+Block%2C+Dayanand+Colony%2C+Shakarpur%2C+New+Delhi%2C+Delhi%2C+110092&gs_lp=Egxnd3Mtd2l6LXNlcnAif0R1YSBDb21wbGV4LCBWaWthcyBNYXJnLCBuZWFyIE1ldHJvIFBpbGxhciBOdW1iZXIgNTksIFZlZXIgU2F2YXJrYXIgQmxvY2ssIERheWFuYW5kIENvbG9ueSwgU2hha2FycHVyLCBOZXcgRGVsaGksIERlbGhpLCAxMTAwOTIyDRAuGNEDGMcBGCcY6gIyBxAjGCcY6gIyBxAjGCcY6gIyBxAuGCcY6gIyBxAjGCcY6gIyBxAjGCcY6gIyBxAjGCcY6gIyBxAjGCcY6gIyBxAjGCcY6gIyBxAjGCcY6gJIyR9QmgVY6RtwAXgAkAEAmAEAoAEAqgEAuAEDyAEA-AEB-AECmAIBoAIMqAIKmAMM8QUEatfqIKiE-pIHATGgBwCyBwC4BwDCBwMzLTHIBwg&sclient=gws-wiz-serp&lqi=Cn9EdWEgQ29tcGxleCwgVmlrYXMgTWFyZywgbmVhciBNZXRybyBQaWxsYXIgTnVtYmVyIDU5LCBWZWVyIFNhdmFya2FyIEJsb2NrLCBEYXlhbmFuZCBDb2xvbnksIFNoYWthcnB1ciwgTmV3IERlbGhpLCBEZWxoaSwgMTEwMDkySMznnNCaqoCACFqlARAAEAEQAhADGAAYARgCGAMYBRgGGAcYCBgJGAoYCxgMGA0YDhgPGBAYERgSIndkdWEgY29tcGxleCB2aWthcyBtYXJnIG5lYXIgbWV0cm8gcGlsbGFyIG51bWJlciA1OSB2ZWVyIHNhdmFya2FyIGJsb2NrIGRheWFuYW5kIGNvbG9ueSBzaGFrYXJwdXIgbmV3IGRlbGhpIGRlbGhpIDExMDA5MpIBC3dhdGNoX3N0b3JlqgG8ARABKhoiFmR1YSBjb21wbGV4IHZpa2FzIG1hcmcoADIfEAEiG9fkoAx_PNT25QViokHVIsaHk-FF6R-sVl6DLTJ7EAIid2R1YSBjb21wbGV4IHZpa2FzIG1hcmcgbmVhciBtZXRybyBwaWxsYXIgbnVtYmVyIDU5IHZlZXIgc2F2YXJrYXIgYmxvY2sgZGF5YW5hbmQgY29sb255IHNoYWthcnB1ciBuZXcgZGVsaGkgZGVsaGkgMTEwMDky#rlimm=7170322026732738597" 
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
                      Sunday: Closed
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