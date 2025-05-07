import React, { useState } from 'react';
import Button from './Button';
import { Send, Check, ArrowRight, AlertCircle } from 'lucide-react';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    hrPlan: '',
    verificationType: '',
    recruitmentType: '',
    customRequirements: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handlePlanSelect = (plan: string) => {
    setFormData(prev => ({
      ...prev,
      hrPlan: plan.toLowerCase(),
      customRequirements: plan === 'Custom' ? prev.customRequirements : ''
    }));
  };

  const handleTypeSelect = (field: 'verificationType' | 'recruitmentType', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Replace with your Google Apps Script URL
      const response = await fetch('https://script.google.com/macros/s/AKfycbyo_g-kctpWxwU0F0lYYOq-u73MkOTYVBDJRXAx3HjdTzO5h-In4XpErBvzvrycoufZ4w/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        mode: 'no-cors'
      });

      setSubmitted(true);
      
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: '',
          hrPlan: '',
          verificationType: '',
          recruitmentType: '',
          customRequirements: ''
        });
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error('Submission error:', err);
      setError('Failed to submit form. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const showHrPlans = formData.subject === 'HR Services';
  const showVerificationTypes = formData.subject === 'RCU & Verification';
  const showRecruitmentTypes = formData.subject === 'Recruitment & Manpower';

  return (
    <div className="bg-white shadow-elevation-1 rounded-lg p-6 md:p-8">
      {submitted ? (
        <div className="text-center py-8">
          <div className="mb-4 text-success flex justify-center">
            <Check className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-bold font-montserrat text-gray-800 mb-2">
            Thank You! <br />
            You have taken your first step to success!!!
          </h3>
          <p className="text-gray-600">
            Your message has been received. We'll get back to you shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-error-50 text-error-700 rounded-md flex items-start">
              <AlertCircle className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-error">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Company Field */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          
          {/* Subject Field */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject <span className="text-error">*</span>
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Please select</option>
              <option value="HR Services">HR Services</option>
              <option value="Recruitment & Manpower">Recruitment & Manpower</option>
              <option value="RCU & Verification">RCU & Verification</option>
              <option value="General Inquiry">General Inquiry</option>
            </select>
          </div>

          {/* Conditional Fields */}
          {showHrPlans && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">HR Services Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {['Basic', 'Standard', 'Premium', 'Custom'].map((plan) => (
                  <div
                    key={plan}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.hrPlan === plan.toLowerCase()
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                    onClick={() => handlePlanSelect(plan)}
                  >
                    <h4 className="font-medium text-gray-900">{plan}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {plan === 'Basic' && 'Essential HR support'}
                      {plan === 'Standard' && 'Standard HR solutions'}
                      {plan === 'Premium' && 'Full-service HR solutions'}
                      {plan === 'Custom' && 'Tailored to your needs'}
                    </p>
                  </div>
                ))}
              </div>

              {formData.hrPlan === 'custom' && (
                <div className="mt-4">
                  <label htmlFor="customRequirements" className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Requirements
                  </label>
                  <textarea
                    id="customRequirements"
                    name="customRequirements"
                    rows={3}
                    value={formData.customRequirements}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Describe your specific HR needs..."
                  />
                </div>
              )}
            </div>
          )}

          {showVerificationTypes && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">Verification Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Banks', 'Company'].map((type) => (
                  <div
                    key={type}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.verificationType === type
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                    onClick={() => handleTypeSelect('verificationType', type)}
                  >
                    <h4 className="font-medium text-gray-900">{type}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {type === 'Banks' && 'Financial institution verification services'}
                      {type === 'Company' && 'Corporate background verification'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showRecruitmentTypes && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">Service Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Recruitment', 'Manpower', 'Outsourcing'].map((type) => (
                  <div
                    key={type}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.recruitmentType === type
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                    onClick={() => handleTypeSelect('recruitmentType', type)}
                  >
                    <h4 className="font-medium text-gray-900">{type}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {type === 'Recruitment' && 'Talent acquisition services'}
                      {type === 'Manpower' && 'Workforce staffing solutions'}
                      {type === 'Outsourcing' && 'Complete HR outsourcing'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message <span className="text-error">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          {/* Submit Button */}
          <div className="relative group">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full overflow-hidden"
              disabled={submitting}
            >
              <span className={`flex items-center justify-center transition-all duration-300 ${submitting ? 'opacity-0' : 'opacity-100'}`}>
                Send Message
                <Send className="ml-2 h-4 w-4" />
              </span>
              <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${submitting ? 'opacity-100' : 'opacity-0'}`}>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </span>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 group-hover:right-3 transition-all duration-300">
                <ArrowRight className="h-5 w-5" />
              </span>
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContactForm;