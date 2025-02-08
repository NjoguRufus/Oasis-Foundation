import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Heart, Users, Brain, Sparkles, ArrowRight, MessageCircle, Facebook, Twitter, Instagram, Apple as WhatsApp, Menu, X } from 'lucide-react';

function Logo() {
  return (
    <div className="flex items-center gap-4 lg:gap-6">
      <img src="https://i.imgur.com/xgNrrHt.png" alt="Oasis Wellness Foundation Logo" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
      <div className="flex flex-col">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-teal-400 leading-tight">Oasis Wellness Foundation.</h1>
        <div className="flex flex-col leading-tight">
          <p className="text-sm md:text-base text-coral-500">Addiction Prevention, Treatment, Recovery</p>
          <p className="text-sm md:text-base text-coral-500">And Rehabilitation</p>
        </div>
        <div className="hidden md:flex items-center gap-2 mt-1">
          <div className="h-px bg-coral-500 w-16"></div>
          <p className="text-sm md:text-base text-teal-400 italic">we care</p>
          <div className="h-px bg-coral-500 w-16"></div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const message = formData.get('message');
    
    const whatsappMessage = `New Recovery Journey Request\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage: ${message}`;
    const whatsappUrl = `https://wa.me/254711389345?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const NavLinks = ({ className = "", onClick = () => {} }) => (
    <>
      <a 
        href="#about" 
        onClick={onClick}
        className={`px-4 py-2 rounded-full border-2 border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-white transition-colors text-sm font-medium ${className}`}
      >
        About
      </a>
      <a 
        href="#services" 
        onClick={onClick}
        className={`px-4 py-2 rounded-full border-2 border-coral-500 text-coral-500 hover:bg-coral-500 hover:text-white transition-colors text-sm font-medium ${className}`}
      >
        Services
      </a>
      <a 
        href="#testimonials" 
        onClick={onClick}
        className={`px-4 py-2 rounded-full border-2 border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-white transition-colors text-sm font-medium ${className}`}
      >
        Stories
      </a>
      <a 
        href="#contact" 
        onClick={onClick}
        className={`px-4 py-2 rounded-full border-2 border-coral-500 text-coral-500 hover:bg-coral-500 hover:text-white transition-colors text-sm font-medium ${className}`}
      >
        Contact
      </a>
    </>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav 
        className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl bg-white/95 backdrop-blur-sm shadow-lg z-50 transition-all duration-300 rounded-2xl ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <Logo />
            {/* Desktop Navigation */}
            <div className="hidden lg:flex gap-4">
              <NavLinks />
            </div>
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Mobile Navigation */}
          <div className={`lg:hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100 py-4' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <div className="flex flex-col gap-3">
              <NavLinks 
                className="w-full text-center" 
                onClick={() => setIsMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content with Watermark */}
      <div className="relative">
        {/* Watermark */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-5 flex items-center justify-center"
          style={{
            zIndex: 0
          }}
        >
          <img 
            src="https://i.imgur.com/xgNrrHt.png" 
            alt="" 
            className="w-96 h-96 object-contain"
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Hero Section */}
          <header className="relative h-screen flex items-center justify-center" style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            <div className="text-center text-white px-4">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">Overcoming Addiction, One Step at a Time</h1>
              <p className="text-xl md:text-2xl mb-8 text-coral-100">Addiction Prevention, Treatment, Recovery And Rehabilitation</p>
              <div className="flex flex-col items-center gap-4">
                <a href="#contact" className="bg-coral-500 hover:bg-coral-600 text-white font-bold py-3 px-8 rounded-full transition duration-300">
                  Get Help Now
                </a>
                <p className="text-teal-300 italic">we care</p>
              </div>
            </div>
          </header>

          {/* About Us */}
          <section id="about" className="py-20 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">About Us</h2>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <img 
                    src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                    alt="Team meeting" 
                    className="rounded-lg shadow-lg"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-teal-400">Our Mission</h3>
                  <p className="text-gray-600 mb-6">
                    At Oasis Wellness Foundation, we believe in providing comprehensive support for individuals struggling with addiction. Our approach combines evidence-based treatment with compassionate care to help our clients achieve lasting recovery.
                  </p>
                  <p className="text-gray-600">
                    We understand that every journey is unique, which is why we offer personalized treatment plans tailored to each individual's needs and circumstances.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Services */}
          <section id="services" className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Our Services</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { icon: <Brain className="w-12 h-12 text-coral-500" />, title: 'Addiction Prevention', description: 'Proactive education and support programs' },
                  { icon: <Heart className="w-12 h-12 text-teal-400" />, title: 'Treatment Programs', description: 'Personalized recovery plans' },
                  { icon: <Users className="w-12 h-12 text-coral-500" />, title: 'Recovery & Support', description: 'Ongoing guidance and community' },
                  { icon: <Sparkles className="w-12 h-12 text-teal-400" />, title: 'Rehabilitation Services', description: 'Comprehensive healing approach' }
                ].map((service, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center hover:transform hover:scale-105 transition duration-300">
                    <div className="flex justify-center mb-4">{service.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section id="testimonials" className="py-20 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Success Stories</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { name: 'Sarah M.', text: '"Oasis gave me the support and tools I needed to rebuild my life. Forever grateful."' },
                  { name: 'John D.', text: '"The compassionate staff and comprehensive program made all the difference in my recovery journey."' },
                  { name: 'Michael R.', text: '"Thanks to Oasis, I\'ve been sober for 2 years and counting. They truly care about their patients."' }
                ].map((testimonial, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                    <p className="text-gray-600 mb-4">{testimonial.text}</p>
                    <p className="font-semibold text-coral-500">{testimonial.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Get Help Today</h2>
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-semibold mb-6 text-teal-400">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Phone className="w-6 h-6 text-coral-500 mr-3" />
                      <p>+254 712 929 460 / +254 711 389 345</p>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-6 h-6 text-coral-500 mr-3" />
                      <p>oasiswellness2020@gmail.com</p>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-6 h-6 text-coral-500 mr-3" />
                      <p>Ruiru Way Bridge Opp Ruiru Golf Club Group, Floor 4, Room 4</p>
                    </div>
                    <p className="ml-9">P.O. Box: 64069-00620, Muthaiga</p>
                  </div>
                  <div className="mt-8 flex space-x-4">
                    <Facebook className="w-6 h-6 text-coral-500 cursor-pointer hover:text-coral-600" />
                    <Twitter className="w-6 h-6 text-coral-500 cursor-pointer hover:text-coral-600" />
                    <Instagram className="w-6 h-6 text-coral-500 cursor-pointer hover:text-coral-600" />
                    <WhatsApp className="w-6 h-6 text-coral-500 cursor-pointer hover:text-coral-600" />
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-coral-500 hover:bg-coral-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
                  >
                    Start Your Recovery Journey
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Logo />
              <p className="text-gray-400 mt-4">Providing hope and healing for those struggling with addiction.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-coral-500" />
                  <p>oasiswellness2020@gmail.com</p>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-coral-500" />
                  <div>
                    <p>Ruiru Waybridge Opposite Ruiru Golf Club Group Floor Room 4</p>
                    <p className="mt-1">P.O Box 64069-00620, Muthaiga</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-coral-500" />
                  <p>24/7 Helpline: +254 712 929 460</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Oasis Wellness Foundation. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;