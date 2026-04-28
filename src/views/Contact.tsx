"use client";
import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, ExternalLink, MessageCircle } from 'lucide-react';
import ContactForm from '../components/ui/ContactForm';

const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/place/IQS-Integrated+Quality+Solutions+consultants+%26+Outsourcing+Services./@28.6353344,77.2851613,20.11z/data=!4m6!3m5!1s0x390cfd688764dc67:0xa00f900a4ac92f6!8m2!3d28.6353613!4d77.2852049!16s%2Fg%2F11xztgj_k9?entry=ttu&g_ep=EgoyMDI2MDIyNS4wIKXMDSoASAFQAw%3D%3D';

const contactInfo = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+(91) 7042559158',
    href: 'tel:+917042559158',
    color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@iqsindia.in',
    href: 'mailto:info@iqsindia.in',
    color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  },
  {
    icon: Clock,
    label: 'Office Hours',
    value: 'Mon – Sat: 9:00 AM – 6:00 PM',
    href: null,
    color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  },
];

/* ── Floating keyboard keys ── */
const KEYS = ['H', 'R', 'IQS', '?', '@', '✓', 'Hi!', '📞', '✉', 'Q', 'S'];

/* ── Typewriter hook ── */
function useTypewriter(phrases: string[], speed = 80, pause = 1800) {
  const [display, setDisplay] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIdx];
    let timer: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < current.length) {
      timer = setTimeout(() => setCharIdx(c => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timer = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timer = setTimeout(() => setCharIdx(c => c - 1), speed / 2);
    } else {
      setDeleting(false);
      setPhraseIdx(p => (p + 1) % phrases.length);
    }

    setDisplay(current.slice(0, charIdx));
    return () => clearTimeout(timer);
  }, [charIdx, deleting, phraseIdx, phrases, speed, pause]);

  return display;
}

const ContactPage = () => {
  React.useEffect(() => {
    document.title = 'Contact Us | IQS - Integrated Quality Solutions';
  }, []);

  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const typed = useTypewriter([
    'Get in Touch.',
    "We're Here to Help You.",
    "Your Growth Partner.",
    'Start a Conversation.',
    'Reach Out to Us.',
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">

      {/* ── Hero Banner ── */}
      <div
        className="relative overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-primary-700 opacity-90 z-0" />

        {/* Floating keyboard keys */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {KEYS.map((key, i) => (
            <div
              key={i}
              className="absolute flex items-center justify-center bg-white/8 border border-white/15 rounded-lg text-white/25 font-mono font-bold text-sm backdrop-blur-sm select-none"
              style={{
                width: key.length > 2 ? '52px' : '38px',
                height: '38px',
                left: `${(i * 9 + 3) % 95}%`,
                top: `${(i * 17 + 10) % 85}%`,
                animation: `floatKey ${3.5 + (i % 3) * 0.8}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
                fontSize: key.length > 2 ? '10px' : '14px',
              }}
            >
              {key}
            </div>
          ))}
        </div>

        {/* Hero content */}
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 relative z-10">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full mb-6 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
          >
            <MessageCircle className="w-4 h-4" />
            We're here to help
          </div>

          {/* Typewriter heading */}
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat text-white mb-4 leading-tight min-h-[1.2em] transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            {typed}
            {/* Blinking cursor */}
            <span className="inline-block w-0.5 h-[0.85em] bg-white ml-1 align-middle animate-pulse" />
          </h1>

          {/* Subtitle */}
          <p
            className={`text-lg md:text-xl text-white/75 max-w-xl leading-relaxed transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            Have questions or ready to transform your HR operations?<br />
            Our experts are just a message away.
          </p>
        </div>

        {/* Keyframe styles */}
        <style>{`
          @keyframes floatKey {
            0%, 100% { transform: translateY(0px) rotate(-2deg); }
            50% { transform: translateY(-10px) rotate(2deg); }
          }
        `}</style>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">

          {/* Left: Contact Info */}
          <div className="lg:col-span-2 space-y-5">

            {/* Info Cards */}
            {contactInfo.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-gray-900 dark:text-white font-medium hover:text-primary-600 dark:hover:text-blue-400 transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-gray-900 dark:text-white font-medium">{item.value}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Address + Map Button */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-11 h-11 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Address</p>
                  <p className="text-gray-900 dark:text-white font-medium text-sm leading-relaxed">
                    R-307, Third Floor, Dua Complex,<br />
                    24 VS Block, Vikas Marg, Near<br />
                    Nirman Vihar Metro Station<br />
                    New Delhi – 110092
                  </p>
                </div>
              </div>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow hover:shadow-md"
              >
                <MapPin className="w-4 h-4" />
                Open in Google Maps
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Embedded Map Preview */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm h-48">
              <iframe
                title="IQS Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57.78!2d77.2852049!3d28.6353613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd688764dc67%3A0xa00f900a4ac92f6!2sIQS-Integrated%20Quality%20Solutions%20consultants%20%26%20Outsourcing%20Services.!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-7 md:p-10">
              <div className="mb-7">
                <h2 className="text-2xl font-bold font-montserrat text-gray-900 dark:text-white mb-2">Send Us a Message</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Fill in the form below and our team will get back to you within 24 hours.</p>
              </div>
              <ContactForm />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;