import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, DollarSign, Zap, Droplets, Check, ChevronDown, ChevronUp, Mail, Phone, Clock, Users, Tent, Sun, Star, ArrowRight } from 'lucide-react';

interface FormData {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  productCategory: string;
  productDescription: string;
  boothSize: string;
  days: string[];
  electricity: boolean;
  specialRequests: string;
  paymentMethod: string;
  agreeTerms: boolean;
}

const AppLayout: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    productCategory: '',
    productDescription: '',
    boothSize: '10x10',
    days: [],
    electricity: false,
    specialRequests: '',
    paymentMethod: '',
    agreeTerms: false
  });

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const calculateTotal = () => {
    const vendorFeePerDay = 61;
    const electricityFee = 28;
    const daysSelected = formData.days.length;
    const vendorTotal = vendorFeePerDay * daysSelected;
    const electricityTotal = formData.electricity ? electricityFee : 0;
    return {
      vendorTotal,
      electricityTotal,
      total: vendorTotal + electricityTotal,
      daysSelected
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const pricing = calculateTotal();
    
    const formPayload = {
      ...formData,
      days: formData.days.join(', '),
      totalAmount: `$${pricing.total}`,
      vendorFee: `$${pricing.vendorTotal}`,
      electricityFee: formData.electricity ? `$${pricing.electricityTotal}` : 'Not selected',
      eventName: 'Central Nebraska Home & Builders Show 2026',
      eventDates: 'January 23-25, 2026',
      eventLocation: 'Fonner Park Campus, Grand Island, NE 68801'
    };

    try {
      // IMPORTANT: Replace 'YOUR_FORM_ID' with your actual Formspree form ID
      // Go to https://formspree.io, create a free account, create a new form,
      // and copy your unique form endpoint (e.g., https://formspree.io/f/xyzabcde)
      const response = await fetch('https://formspree.io/f/mjggveol', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formPayload)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          businessName: '',
          contactName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          productCategory: '',
          productDescription: '',
          boothSize: '10x10',
          days: [],
          electricity: false,
          specialRequests: '',
          paymentMethod: '',
          agreeTerms: false
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    }
    
    setIsSubmitting(false);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const pricing = calculateTotal();

  const faqs = [
    {
      question: "What are the setup and breakdown times?",
      answer: "Setup begins at 6:00 AM each day. The fair runs from 9:00 AM to 4:00 PM. Breakdown must be completed by 6:00 PM. Early breakdown is not permitted."
    },
    {
      question: "What is included with my booth space?",
      answer: "Your booth space includes the designated area only. You must provide your own tent, tables, chairs, and display materials. Water access is free and available on-site."
    },
    {
      question: "Do I need any permits or licenses?",
      answer: "Vendors selling food items must have a valid California Seller's Permit and Health Department certification. All vendors should have their business license available for inspection."
    },
    {
      question: "Can I share my booth with another vendor?",
      answer: "Booth sharing is allowed but must be disclosed during registration. Both vendors must complete separate registration forms and each is responsible for their portion of the fees."
    },
    {
      question: "What happens in case of inclement weather?",
      answer: "The event is rain or shine. In case of severe weather conditions that make the event unsafe, organizers will notify vendors via email. Refund policies apply based on the specific circumstances."
    },
    {
      question: "How will I receive payment instructions?",
      answer: "After submitting your registration, you will receive an email within 24-48 hours with detailed payment instructions for your selected payment method (CashApp, Zelle, or Venmo)."
    }
  ];

  const productCategories = [
    "Arts & Crafts",
    "Jewelry & Accessories",
    "Clothing & Apparel",
    "Home Decor",
    "Food & Beverages",
    "Health & Wellness",
    "Plants & Garden",
    "Vintage & Antiques",
    "Pet Products",
    "Children's Items",
    "Other"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center space-x-2">
              <Sun className={`w-8 h-8 ${scrolled ? 'text-orange-500' : 'text-white'}`} />
              <span className={`font-bold text-lg md:text-xl ${scrolled ? 'text-gray-800' : 'text-white'}`}>
                Palm Desert Street Fair
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('about')} className={`font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-orange-500' : 'text-white/90 hover:text-white'}`}>
                About
              </button>
              <button onClick={() => scrollToSection('pricing')} className={`font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-orange-500' : 'text-white/90 hover:text-white'}`}>
                Pricing
              </button>
              <button onClick={() => scrollToSection('faq')} className={`font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-orange-500' : 'text-white/90 hover:text-white'}`}>
                FAQ
              </button>
              <button onClick={() => scrollToSection('register')} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl">
                Register Now
              </button>
            </div>
            <button onClick={() => scrollToSection('register')} className="md:hidden bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full font-semibold text-sm">
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-amber-500 to-rose-500"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-yellow-300 mr-2" />
            <span className="text-white text-sm font-medium">Vendor Registration Now Open!</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Palm Desert Winter
            <span className="block bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
              Outdoor Street Fair
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join us for the most anticipated outdoor market of the season! 
            Showcase your products to thousands of visitors.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
              <Calendar className="w-5 h-5 text-yellow-300 mr-3" />
              <span className="text-white font-semibold">January 17-18, 2026</span>
            </div>
            <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
              <MapPin className="w-5 h-5 text-yellow-300 mr-3" />
              <span className="text-white font-semibold">Fonner Park Campus</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => scrollToSection('register')}
              className="group bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transition-all hover:scale-105 flex items-center"
            >
              Register Your Booth
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-white border-2 border-white/50 hover:border-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:bg-white/10"
            >
              Learn More
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/70" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Event Details
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about the Central Nebraska Home & Builders Show 2026
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Event Dates</h3>
              <p className="text-gray-600">Saturday, January 17</p>
              <p className="text-gray-600">Sunday, January 18, 2026</p>
              <p className="text-sm text-orange-600 mt-2 font-medium">9:00 AM - 4:00 PM</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">Fonner Park Campus</p>
              <p className="text-gray-600">Grand Island</p>
              <p className="text-sm text-blue-600 mt-2 font-medium"> NE 68801</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Expected Attendance</h3>
              <p className="text-gray-600">5,000+ Visitors</p>
              <p className="text-gray-600">Per Day</p>
              <p className="text-sm text-green-600 mt-2 font-medium">Great Exposure!</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Tent className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Booth Space</h3>
              <p className="text-gray-600">10x10 Standard</p>
              <p className="text-gray-600">Outdoor Setup</p>
              <p className="text-sm text-purple-600 mt-2 font-medium">Bring Your Own Tent</p>
            </div>
          </div>
          
          {/* Map Embed */}
          <div className="mt-16 rounded-2xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3315.8744!2d-116.3736!3d33.7537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80db1a8b1f1f1f1f%3A0x1f1f1f1f1f1f1f1f!2sCollege%20of%20the%20Desert!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Event Location"
              className="w-full"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-28 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No hidden fees. Choose your days and add-ons.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow border-2 border-transparent hover:border-orange-200">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <DollarSign className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Vendor Fee</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-5xl font-extrabold text-orange-600">$61</span>
                <span className="text-gray-500 ml-2">/day</span>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  10x10 booth space
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  Full day access (9AM-4PM)
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  Event marketing included
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow border-2 border-transparent hover:border-yellow-200">
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Electricity</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-5xl font-extrabold text-yellow-600">$28</span>
                <span className="text-gray-500 ml-2">total</span>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  Standard outlet access
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  Both days included
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  Optional add-on
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow border-2 border-transparent hover:border-blue-200">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Droplets className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Water Access</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-5xl font-extrabold text-blue-600">FREE</span>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  Complimentary access
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  On-site water stations
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  All vendors included
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <div className="inline-flex items-center bg-green-100 text-green-800 px-6 py-3 rounded-full font-semibold">
              <Check className="w-5 h-5 mr-2" />
              Both Days: Only $122 + optional electricity
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section id="register" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Register Your Booth
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Complete the form below to secure your spot at the fair
            </p>
          </div>
          
          {submitStatus === 'success' ? (
            <div className="max-w-2xl mx-auto text-center bg-green-50 rounded-2xl p-12">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Registration Submitted!</h3>
              <p className="text-lg text-gray-600 mb-6">
                Thank you for registering! You will receive an email within 24-48 hours with payment instructions for your selected payment method.
              </p>
              <button 
                onClick={() => setSubmitStatus('idle')}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
              >
                Submit Another Registration
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Business Information */}
                  <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                      Business Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name *</label>
                        <input
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                          placeholder="Your Business Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Name *</label>
                        <input
                          type="text"
                          name="contactName"
                          value={formData.contactName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                          placeholder="Full Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                          placeholder="email@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 mt-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                          placeholder="CA"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP Code *</label>
                        <input
                          type="text"
                          name="zip"
                          value={formData.zip}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                          placeholder="92260"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Product Information */}
                  <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                      Product Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Product Category *</label>
                        <select
                          name="productCategory"
                          value={formData.productCategory}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white"
                        >
                          <option value="">Select a category</option>
                          {productCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Booth Size</label>
                        <select
                          name="boothSize"
                          value={formData.boothSize}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white"
                        >
                          <option value="10x10">10x10 Standard</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Product Description *</label>
                      <textarea
                        name="productDescription"
                        value={formData.productDescription}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                        placeholder="Describe the products you will be selling..."
                      ></textarea>
                    </div>
                  </div>

                  {/* Event Days & Add-ons */}
                  <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                      Select Days & Add-ons
                    </h3>
                    
                    <div className="mb-8">
                      <label className="block text-sm font-semibold text-gray-700 mb-4">Select Event Days *</label>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => handleDayToggle('Saturday, January 17')}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            formData.days.includes('Saturday, January 17')
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-orange-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold text-gray-900">Saturday</p>
                              <p className="text-sm text-gray-600">January 17, 2026</p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              formData.days.includes('Saturday, January 17')
                                ? 'border-orange-500 bg-orange-500'
                                : 'border-gray-300'
                            }`}>
                              {formData.days.includes('Saturday, January 17') && (
                                <Check className="w-4 h-4 text-white" />
                              )}
                            </div>
                          </div>
                          <p className="text-orange-600 font-semibold mt-2">$61</p>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleDayToggle('Sunday, January 18')}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            formData.days.includes('Sunday, January 18')
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-orange-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold text-gray-900">Sunday</p>
                              <p className="text-sm text-gray-600">January 18, 2026</p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              formData.days.includes('Sunday, January 18')
                                ? 'border-orange-500 bg-orange-500'
                                : 'border-gray-300'
                            }`}>
                              {formData.days.includes('Sunday, January 18') && (
                                <Check className="w-4 h-4 text-white" />
                              )}
                            </div>
                          </div>
                          <p className="text-orange-600 font-semibold mt-2">$61</p>
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-4">Add-ons</label>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, electricity: !prev.electricity }))}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          formData.electricity
                            ? 'border-yellow-500 bg-yellow-50'
                            : 'border-gray-200 hover:border-yellow-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Zap className={`w-6 h-6 mr-3 ${formData.electricity ? 'text-yellow-600' : 'text-gray-400'}`} />
                            <div>
                              <p className="font-bold text-gray-900">Electricity Access</p>
                              <p className="text-sm text-gray-600">Standard outlet for both days</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="text-yellow-600 font-bold mr-4">+$28</span>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              formData.electricity
                                ? 'border-yellow-500 bg-yellow-500'
                                : 'border-gray-300'
                            }`}>
                              {formData.electricity && (
                                <Check className="w-4 h-4 text-white" />
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                      
                      <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
                        <div className="flex items-center">
                          <Droplets className="w-6 h-6 text-blue-600 mr-3" />
                          <div>
                            <p className="font-bold text-gray-900">Water Access</p>
                            <p className="text-sm text-gray-600">Complimentary for all vendors</p>
                          </div>
                          <span className="ml-auto text-blue-600 font-bold">FREE</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                      Payment Method
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Select your preferred payment method. Payment details will be sent to your email after registration.
                    </p>
                    <div className="grid sm:grid-cols-3 gap-4">
                      {['CashApp', 'Zelle', 'Venmo'].map(method => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method }))}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            formData.paymentMethod === method
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-green-300'
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                              formData.paymentMethod === method
                                ? 'border-green-500 bg-green-500'
                                : 'border-gray-300'
                            }`}>
                              {formData.paymentMethod === method && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span className="font-semibold text-gray-900">{method}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
                      <div className="flex items-start">
                        <Mail className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                        <p className="text-sm text-amber-800">
                          <strong>Note:</strong> Payment details will be sent to your email within 24-48 hours after registration. Please check your spam folder if you don't receive it.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
                      Additional Information
                    </h3>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Special Requests or Notes</label>
                      <textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                        placeholder="Any special requirements, accessibility needs, or questions..."
                      ></textarea>
                    </div>
                  </div>

                  {/* Terms & Submit */}
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 md:p-8 border border-orange-200">
                    <label className="flex items-start cursor-pointer mb-6">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleInputChange}
                        required
                        className="w-5 h-5 mt-0.5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="ml-3 text-gray-700">
                        I agree to the vendor terms and conditions, including setup/breakdown times, event rules, and understand that my booth space is not confirmed until payment is received. *
                      </span>
                    </label>
                    
                    {submitStatus === 'error' && (
                      <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
                        There was an error submitting your registration. Please try again or contact us directly.
                      </div>
                    )}
                    
                    <button
                      type="submit"
                      disabled={isSubmitting || formData.days.length === 0 || !formData.paymentMethod || !formData.agreeTerms}
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-gray-400 disabled:to-gray-400 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        'Submit Registration'
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Pricing Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
                    <h3 className="text-xl font-bold">Order Summary</h3>
                    <p className="text-white/80 text-sm">Your registration details</p>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                      <div>
                        <p className="font-semibold text-gray-900">Vendor Fee</p>
                        <p className="text-sm text-gray-500">
                          {pricing.daysSelected > 0 
                            ? `${pricing.daysSelected} day${pricing.daysSelected > 1 ? 's' : ''} × $61`
                            : 'Select days above'}
                        </p>
                      </div>
                      <span className="font-bold text-gray-900">${pricing.vendorTotal}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                      <div>
                        <p className="font-semibold text-gray-900">Electricity</p>
                        <p className="text-sm text-gray-500">
                          {formData.electricity ? 'Standard outlet' : 'Not selected'}
                        </p>
                      </div>
                      <span className="font-bold text-gray-900">
                        {formData.electricity ? '$28' : '$0'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                      <div>
                        <p className="font-semibold text-gray-900">Water Access</p>
                        <p className="text-sm text-gray-500">Included</p>
                      </div>
                      <span className="font-bold text-green-600">FREE</span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <p className="text-xl font-bold text-gray-900">Total</p>
                      <span className="text-3xl font-extrabold text-orange-600">${pricing.total}</span>
                    </div>
                    
                    {formData.paymentMethod && (
                      <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200">
                        <p className="text-sm text-green-800">
                          <strong>Payment via:</strong> {formData.paymentMethod}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          Details will be emailed after submission
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="px-6 pb-6">
                    <div className="p-4 rounded-xl bg-gray-50">
                      <h4 className="font-semibold text-gray-900 mb-2">Selected Days:</h4>
                      {formData.days.length > 0 ? (
                        <ul className="space-y-1">
                          {formData.days.map(day => (
                            <li key={day} className="flex items-center text-sm text-gray-600">
                              <Check className="w-4 h-4 text-green-500 mr-2" />
                              {day}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No days selected yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-28 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about participating
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-8 md:p-16 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Have Questions?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              We're here to help! Reach out to our vendor coordination team.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a href="mailto:vendors@palmdesertfair.com" className="flex items-center bg-white text-orange-600 px-6 py-3 rounded-full font-semibold hover:bg-orange-50 transition-colors">
                <Mail className="w-5 h-5 mr-2" />
                palmdesertfair@email.com
              </a>
              <a href="tel:+17605551234" className="flex items-center bg-white/20 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-colors">
                <Phone className="w-5 h-5 mr-2" />
                (650) 762-9764
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Sun className="w-8 h-8 text-orange-500" />
                <span className="font-bold text-xl">Palm Desert Street Fair</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Join us for the most anticipated outdoor market of the winter season at the beautiful Fonner Park Campus campus.
              </p>
              <div className="flex items-center space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Event Info</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                  January 17-18, 2026
                </li>
                <li className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-orange-500" />
                  9:00 AM - 4:00 PM
                </li>
                <li className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 mt-1 text-orange-500" />
                  <span>Fonner Park Campus<br />Grand Island<br /> NE 68801</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <button onClick={() => scrollToSection('about')} className="text-gray-400 hover:text-orange-500 transition-colors">
                    About the Event
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('pricing')} className="text-gray-400 hover:text-orange-500 transition-colors">
                    Pricing
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('register')} className="text-gray-400 hover:text-orange-500 transition-colors">
                    Register Now
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('faq')} className="text-gray-400 hover:text-orange-500 transition-colors">
                    FAQ
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; 2026 Central Nebraska Home & Builders Show 2026. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
