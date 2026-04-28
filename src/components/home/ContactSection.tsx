"use client";
import React from 'react';
import { Mail, Phone, MapPin, Clock, ExternalLink } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import ContactForm from '../ui/ContactForm';

const MAPS_URL =
  'https://www.google.com/maps/place/IQS-Integrated+Quality+Solutions+consultants+%26+Outsourcing+Services./@28.6353344,77.2851613,20.11z/data=!4m6!3m5!1s0x390cfd688764dc67:0xa00f900a4ac92f6!8m2!3d28.6353613!4d77.2852049!16s%2Fg%2F11xztgj_k9?entry=ttu&g_ep=EgoyMDI2MDIyNS4wIKXMDSoASAFQAw%3D%3D';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader
          title="Contact Us"
          subtitle="Have questions or ready to get started? Reach out to our team — we'd love to hear from you."
          centered
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Contact Info */}
          <div className="lg:col-span-1 space-y-5">
            {/* Info cards */}
            {[
              { icon: Phone, label: 'Phone', value: '+(91) 7042559158', href: 'tel:+917042559158', color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
              { icon: Mail, label: 'Email', value: 'info@iqsindia.in', href: 'mailto:info@iqsindia.in', color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
              { icon: Clock, label: 'Hours', value: 'Mon–Sat: 9AM – 6PM', href: null, color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{item.label}</p>
                    {item.href
                      ? <a href={item.href} className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-blue-400 transition-colors">{item.value}</a>
                      : <p className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</p>
                    }
                  </div>
                </div>
              );
            })}

            {/* Address + Maps CTA */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Address</p>
                  <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                    R-307, Dua Complex, Vikas Marg,<br />
                    Near Nirman Vihar Metro Station,<br />
                    New Delhi – 110092
                  </p>
                </div>
              </div>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <MapPin className="w-4 h-4" />
                View in Google Maps
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold font-montserrat text-gray-900 dark:text-white mb-6">Send Us a Message</h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;