"use client";
import React, { useState } from 'react';
import { Send, Check, AlertCircle, User, Mail, Phone, Building2, MessageSquare, ChevronDown } from 'lucide-react';

const inputBase =
  'w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-xl px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-gray-300 dark:hover:border-gray-500';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    hrPlan: '',
    recruitmentType: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handlePlanSelect = (plan: string) => setFormData(prev => ({ ...prev, hrPlan: plan }));
  const handleRecruitmentSelect = (type: string) => setFormData(prev => ({ ...prev, recruitmentType: type }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await fetch(
        'https://script.google.com/macros/s/AKfycbzOiCKX2LM4SHmYxNfGxZO_AFJRjoWa_WuREKnoqoa_zlb-Pemkzj2IAsd9CJzOsyVWBg/exec',
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData), mode: 'no-cors' }
      );
      setSubmitted(true);
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '', hrPlan: '', recruitmentType: '' });
        setSubmitted(false);
      }, 4000);
    } catch {
      setError('Failed to send. Please email us directly at info@iqsindia.in');
    } finally {
      setSubmitting(false);
    }
  };

  const showHrPlans = formData.subject === 'HR Services';
  const showRecruitmentTypes = formData.subject === 'Recruitment & Manpower';
  const showPayrollOptions = formData.subject === 'Payroll Services';
  const showOutsourcingTypes = formData.subject === 'Project Outsourcing';

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6 animate-scale-in">
          <Check className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold font-montserrat text-gray-900 dark:text-white mb-2">
          Message Sent! 🎉
        </h3>
        <p className="text-gray-600 dark:text-gray-300 max-w-sm">
          Thank you for reaching out. You've taken the first step to success! We'll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" id="contact-form">

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 rounded-xl text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Name & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" name="name" value={formData.name} onChange={handleChange} required
              placeholder="John Doe" className={`${inputBase} pl-10`} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} required
              placeholder="john@company.com" className={`${inputBase} pl-10`} />
          </div>
        </div>
      </div>

      {/* Phone & Company */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
              placeholder="+91 98765 43210" className={`${inputBase} pl-10`} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
            Company Name
          </label>
          <div className="relative">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" name="company" value={formData.company} onChange={handleChange}
              placeholder="Your Company Ltd." className={`${inputBase} pl-10`} />
          </div>
        </div>
      </div>

      {/* Service / Subject */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
          Service Required <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select name="subject" value={formData.subject} onChange={handleChange} required className={`${inputBase} appearance-none pr-10`}>
            <option value="">Select a service...</option>
            <option value="HR Services">HR Services</option>
            <option value="Recruitment & Manpower">Recruitment &amp; Manpower</option>
            <option value="Payroll Services">Payroll Services</option>
            <option value="Project Outsourcing">Project Outsourcing</option>
            <option value="General Inquiry">General Inquiry</option>
          </select>
        </div>
      </div>

      {/* HR Plan Selector */}
      {showHrPlans && (
        <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-700">
          <p className="text-xs font-semibold text-primary-700 dark:text-blue-300 uppercase tracking-wide mb-3">Select HR Plan</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Basic', 'Standard', 'Premium', 'Custom'].map(plan => (
              <button type="button" key={plan} onClick={() => handlePlanSelect(plan)}
                className={`py-2.5 px-3 rounded-lg text-sm font-medium text-center border-2 transition-all ${formData.hrPlan === plan
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-primary-300'
                  }`}>
                {plan}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recruitment Type */}
      {showRecruitmentTypes && (
        <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-700">
          <p className="text-xs font-semibold text-primary-700 dark:text-blue-300 uppercase tracking-wide mb-3">Service Type</p>
          <div className="grid grid-cols-3 gap-3">
            {['Recruitment', 'Manpower', 'Outsourcing'].map(type => (
              <button type="button" key={type} onClick={() => handleRecruitmentSelect(type)}
                className={`py-2.5 px-3 rounded-lg text-sm font-medium text-center border-2 transition-all ${formData.recruitmentType === type
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-primary-300'
                  }`}>
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Payroll Options */}
      {showPayrollOptions && (
        <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-700">
          <p className="text-xs font-semibold text-primary-700 dark:text-blue-300 uppercase tracking-wide mb-3">Employee Count</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['1–50', '51–200', '201–500', '500+'].map(range => (
              <button type="button" key={range} onClick={() => setFormData(p => ({ ...p, hrPlan: range }))}
                className={`py-2.5 px-3 rounded-lg text-sm font-medium text-center border-2 transition-all ${formData.hrPlan === range
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-primary-300'
                  }`}>
                {range}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Project Outsourcing Type */}
      {showOutsourcingTypes && (
        <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-700">
          <p className="text-xs font-semibold text-primary-700 dark:text-blue-300 uppercase tracking-wide mb-3">Project Type</p>
          <div className="grid grid-cols-2 gap-3">
            {['Web App Development', 'Mobile App Development', 'Maintenance & Support', 'Cloud & DevOps'].map(type => (
              <button type="button" key={type} onClick={() => setFormData(p => ({ ...p, recruitmentType: type }))}
                className={`py-2.5 px-3 rounded-lg text-sm font-medium text-center border-2 transition-all ${formData.recruitmentType === type
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-primary-300'
                  }`}>
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
          Message <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
          <textarea name="message" rows={4} value={formData.message} onChange={handleChange} required
            placeholder="Tell us about your requirements..."
            className={`${inputBase} pl-10 resize-none`} />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
      >
        {submitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
};

export default ContactForm;