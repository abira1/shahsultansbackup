import React, { useState, lazy } from 'react';
import { Mail, MapPin, Phone, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};
type FormErrors = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};
const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        // Reset success message after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      }, 1500);
    }
  };
  return <section className="py-10 sm:py-16 bg-secondary" id="contact">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Contact Us
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-sm sm:text-base">
            Have questions about our courses or want to schedule a visit? Get in
            touch with us.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div>
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
                Send Us a Message
              </h3>
              {isSubmitted ? <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-3 sm:p-4 flex items-start">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2 sm:mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Message sent successfully!</p>
                    <p className="text-xs sm:text-sm mt-1">
                      Thank you for contacting us. We'll get back to you
                      shortly.
                    </p>
                  </div>
                </div> : <form onSubmit={handleSubmit} noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
                    <div>
                      <label htmlFor="name" className="form-label text-xs sm:text-sm">
                        Full Name <span className="text-error">*</span>
                      </label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`form-input text-sm sm:text-base ${errors.name ? 'border-error focus:ring-error' : ''}`} placeholder="Enter your full name" required aria-invalid={errors.name ? 'true' : 'false'} aria-describedby={errors.name ? 'name-error' : undefined} />
                      {errors.name && <p id="name-error" className="form-error text-xs sm:text-sm">
                          {errors.name}
                        </p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="form-label text-xs sm:text-sm">
                        Email Address <span className="text-error">*</span>
                      </label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`form-input text-sm sm:text-base ${errors.email ? 'border-error focus:ring-error' : ''}`} placeholder="Enter your email address" required aria-invalid={errors.email ? 'true' : 'false'} aria-describedby={errors.email ? 'email-error' : undefined} />
                      {errors.email && <p id="email-error" className="form-error text-xs sm:text-sm">
                          {errors.email}
                        </p>}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="subject" className="form-label text-xs sm:text-sm">
                      Subject <span className="text-error">*</span>
                    </label>
                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} className={`form-input text-sm sm:text-base ${errors.subject ? 'border-error focus:ring-error' : ''}`} placeholder="Enter subject" required aria-invalid={errors.subject ? 'true' : 'false'} aria-describedby={errors.subject ? 'subject-error' : undefined} />
                    {errors.subject && <p id="subject-error" className="form-error text-xs sm:text-sm">
                        {errors.subject}
                      </p>}
                  </div>
                  <div className="mb-6">
                    <label htmlFor="message" className="form-label text-xs sm:text-sm">
                      Message <span className="text-error">*</span>
                    </label>
                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={5} className={`form-input text-sm sm:text-base ${errors.message ? 'border-error focus:ring-error' : ''}`} placeholder="Enter your message" required aria-invalid={errors.message ? 'true' : 'false'} aria-describedby={errors.message ? 'message-error' : undefined}></textarea>
                    {errors.message && <p id="message-error" className="form-error text-xs sm:text-sm">
                        {errors.message}
                      </p>}
                  </div>
                  <Button variant="primary" type="submit" fullWidth loading={isSubmitting} disabled={isSubmitting}>
                    Send Message
                  </Button>
                </form>}
            </div>
          </div>
          <div>
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
                Contact Information
              </h3>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-accent mr-3 sm:mr-4 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">
                      Main Branch
                    </h4>
                    <p className="text-text-secondary text-xs sm:text-sm">
                      R.B. Complex, 6th Floor, East Zindabazar, Sylhet
                    </p>
                    <h4 className="font-semibold mb-1 text-sm sm:text-base mt-3">
                      Jalalpur Branch
                    </h4>
                    <p className="text-text-secondary text-xs sm:text-sm">
                      Mosahid Plaza, 2nd Floor, Jalalpur Bazaar, College Road
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-accent mr-3 sm:mr-4 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">
                      Phone Numbers
                    </h4>
                    <a href="tel:+8801646882798" className="text-text-secondary text-xs sm:text-sm hover:text-accent transition-colors">
                      +880 1646-882798 (Sylhet)
                    </a>
                    <a href="tel:+8801337993522" className="block text-text-secondary text-xs sm:text-sm hover:text-accent transition-colors">
                      +880 1337-993522 (Jalalpur)
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-accent mr-3 sm:mr-4 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">
                      Email Address
                    </h4>
                    <a href="mailto:info@shahsultanielts.com" className="text-text-secondary text-xs sm:text-sm hover:text-accent transition-colors break-all">
                      info@shahsultanielts.com
                    </a>
                    <a href="mailto:admissions@shahsultanielts.com" className="block text-text-secondary text-xs sm:text-sm hover:text-accent transition-colors break-all">
                      admissions@shahsultanielts.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
                Office Hours
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-text-secondary">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-text-secondary">Saturday</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-text-secondary">Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 sm:mt-12">
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d226.19224072350596!2d91.87044199451496!3d24.895394195729892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375055000162c3ff%3A0x498fe2eae1c93794!2sShah%20Sultan%E2%80%99s%20IELTS%20Academy!5e0!3m2!1sen!2sbd!4v1757593744391!5m2!1sen!2sbd" width="100%" height="350" style={{
            border: 0
          }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Shah Sultan's IELTS Academy Location" aria-label="Map showing the location of Shah Sultan's IELTS Academy"></iframe>
          </div>
        </div>
      </div>
    </section>;
};
export default ContactSection;