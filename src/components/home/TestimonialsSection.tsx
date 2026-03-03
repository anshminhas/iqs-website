import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Rajesh Malhotra',
    role: 'HR Director',
    company: 'TechVista Solutions',
    avatar: 'RM',
    rating: 5,
    text: 'IQS transformed our HR operations completely. Their payroll accuracy and compliance support gave us immense peace of mind. We have zero compliance issues since partnering with them.',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'CEO',
    company: 'GrowFast Ventures',
    avatar: 'PS',
    rating: 5,
    text: 'The recruitment team at IQS is exceptional. They consistently deliver quality talent that fits our culture perfectly. Our time-to-hire dropped by 60% after engaging with IQS.',
    color: 'from-purple-500 to-pink-600',
  },
  {
    id: 3,
    name: 'Amit Gupta',
    role: 'Operations Manager',
    company: 'Meridian Logistics',
    avatar: 'AG',
    rating: 5,
    text: 'IQS handles our entire manpower requirements across 5 states. Their understanding of regional compliance and their network is unmatched. Highly professional team.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 4,
    name: 'Sunita Verma',
    role: 'Finance Head',
    company: 'Apex Manufacturing',
    avatar: 'SV',
    rating: 5,
    text: 'Payroll processing used to be a nightmare with our 500+ workforce. IQS automated it seamlessly. Accurate, on-time, every single month — exactly what we needed.',
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 5,
    name: 'Vikram Nair',
    role: 'Managing Director',
    company: 'BlueSky Enterprises',
    avatar: 'VN',
    rating: 5,
    text: 'Outstanding service quality. IQS brought a level of professionalism to our HR function that we never thought possible for a mid-size business like ours.',
    color: 'from-cyan-500 to-blue-600',
  },
];

// Real client logos from /public folder
const clientLogos = [
  { src: '/c1.jpeg', alt: 'Client 1' },
  { src: '/c2.jpeg', alt: 'Client 2' },
  { src: '/c3.png', alt: 'Client 3' },
  { src: '/c4.jpeg', alt: 'Client 4' },
  { src: '/c5.jpeg', alt: 'Client 5' },
  { src: '/c6.png', alt: 'Client 6' },
  { src: '/c7.jpeg', alt: 'Client 7' },
  { src: '/c8.jpeg', alt: 'Client 8' },
];

const TestimonialsSection: React.FC = () => {
  const [active, setActive] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActive(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const prev = () => {
    setIsAutoPlaying(false);
    setActive(p => (p === 0 ? testimonials.length - 1 : p - 1));
  };

  const next = () => {
    setIsAutoPlaying(false);
    setActive(p => (p + 1) % testimonials.length);
  };

  const current = testimonials[active];

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-6">

        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-blue-400 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            <Star className="w-4 h-4 fill-current" />
            Client Testimonials
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-gray-900 dark:text-white mb-4">
            Trusted by Leading Businesses
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Don't just take our word for it — hear what our clients say about partnering with IQS.
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-elevation-3 overflow-hidden">
            <div className={`h-1.5 w-full bg-gradient-to-r ${current.color}`} />
            <div className="p-8 md:p-12">
              <Quote className="w-10 h-10 text-primary-100 dark:text-primary-800 mb-6" />
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 leading-relaxed font-medium mb-8">
                "{current.text}"
              </p>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${current.color} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                    {current.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white text-lg">{current.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{current.role} · {current.company}</div>
                    <div className="flex gap-0.5 mt-1">
                      {Array.from({ length: current.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={prev}
                    className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all duration-200"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={next}
                    className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all duration-200"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setIsAutoPlaying(false); setActive(i); }}
                className={`h-2 rounded-full transition-all duration-300 ${i === active ? 'w-8 bg-primary-600' : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-primary-400'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Client Logos — real images */}
        <div className="mt-20">
          <p className="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-8">
            Trusted by brands across industries
          </p>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-6">
            {clientLogos.map((logo, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-700 rounded-2xl p-3 md:p-4 flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-300 aspect-square border border-gray-100 dark:border-gray-600"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;