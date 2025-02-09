import React, { useState, useEffect, useCallback } from 'react';
import { Phone, Mail, MapPin, Heart, Users, Brain, Sparkles, ArrowRight, MessageCircle, Facebook, Twitter, Instagram, Apple as WhatsApp, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

function Logo() {
  return (
    <div className="flex items-center gap-4">
      <img src="https://i.imgur.com/xgNrrHt.png" alt="Oasis Wellness Foundation Logo" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
      <div className="flex flex-col">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-teal-400">Oasis Wellness Foundation.</h1>
        <div className="flex flex-col">
          <p className="text-sm md:text-base text-coral-500">Addiction Prevention, Treatment, Recovery and Biopsychosocial approach</p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="h-px bg-coral-500 w-12"></div>
          <p className="text-sm md:text-base text-teal-400 italic">we care</p>
          <div className="h-px bg-coral-500 w-12"></div>
        </div>
      </div>
    </div>
  );
}

function ImageSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const images = [
    { url: "https://i.imgur.com/mo8m2o8.jpg", alt: "Oasis Wellness Event 1" },
    { url: "https://i.imgur.com/rajC5Hi.jpg", alt: "Oasis Wellness Event 2" },
    { url: "https://i.imgur.com/97589Gj.jpg", alt: "Oasis Wellness Event 3" },
    { url: "https://i.imgur.com/h2VAIDb.jpg", alt: "Oasis Wellness Event 4" },
    { url: "https://i.imgur.com/lg2bnJJ.jpg", alt: "Oasis Wellness Event 5" },
    { url: "https://i.imgur.com/nbqfHii.jpg", alt: "Oasis Wellness Event 6" }
  ];

  const nextSlide = useCallback(() => {
    if (!isTransitioning) {
      setDirection('right');
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      setTimeout(() => setIsTransitioning(false), 750);
    }
  }, [isTransitioning, images.length]);

  const prevSlide = useCallback(() => {
    if (!isTransitioning) {
      setDirection('left');
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      setTimeout(() => setIsTransitioning(false), 750);
    }
  }, [isTransitioning, images.length]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (!isTransitioning) {
      timer = setInterval(() => {
        setDirection('right');
        setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
      }, 3000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isTransitioning, images.length]);

  const goToSlide = useCallback((index: number) => {
    if (!isTransitioning && index !== currentIndex) {
      setDirection(index > currentIndex ? 'right' : 'left');
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 750);
    }
  }, [currentIndex, isTransitioning]);

  const getSlideStyle = (index: number) => {
    const isCurrent = index === currentIndex;
    const isNext = (currentIndex === images.length - 1 ? 0 : currentIndex + 1) === index;
    const isPrev = (currentIndex === 0 ? images.length - 1 : currentIndex - 1) === index;

    let transform = 'scale(1.1) translateX(0)';
    let opacity = 0;
    let zIndex = 0;

    if (isCurrent) {
      transform = isTransitioning 
        ? `scale(1.1) translateX(${direction === 'right' ? '-100%' : '100%'})`
        : 'scale(1) translateX(0)';
      opacity = 1;
      zIndex = 2;
    } else if (isNext && direction === 'right' && isTransitioning) {
      transform = 'scale(1.1) translateX(0)';
      opacity = 1;
      zIndex = 1;
    } else if (isPrev && direction === 'left' && isTransitioning) {
      transform = 'scale(1.1) translateX(0)';
      opacity = 1;
      zIndex = 1;
    }

    return {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${images[index].url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'absolute',
      inset: 0,
      transition: 'all 0.75s cubic-bezier(0.4, 0, 0.2, 1)',
      transform,
      opacity,
      zIndex,
    } as React.CSSProperties;
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Slides */}
      {images.map((_, index) => (
        <div
          key={index}
          style={getSlideStyle(index)}
          className="absolute inset-0 w-full h-full"
          aria-hidden={index !== currentIndex}
        />
      ))}

      {/* Navigation Buttons */}
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              currentIndex === index 
                ? 'bg-white w-8 transform scale-110' 
                : 'bg-white/50 hover:bg-white/75 hover:scale-110'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsAtTop(currentScrollY < 20);
      
      if (currentScrollY < 20) {
        setIsVisible(true);
      } else {
        setIsVisible(currentScrollY < lastScrollY);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className={`relative transition-all duration-500 ${
          isAtTop ? 'bg-white/60' : 'bg-white shadow-md'
        } rounded-b-[2.5rem]`}>
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Logo />
              
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-6">
                <a href="#about" className="text-gray-700 hover:text-teal-400 transition-colors px-4 py-2 rounded-full hover:bg-gray-50">About</a>
                <a href="#services" className="text-gray-700 hover:text-teal-400 transition-colors px-4 py-2 rounded-full hover:bg-gray-50">Services</a>
                <a href="#contact" className="bg-coral-500 text-white px-6 py-2 rounded-full hover:bg-coral-600 transition-colors">
                  Contact Us
                </a>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile Navigation */}
            <div
              className={`lg:hidden transition-all duration-300 ease-in-out ${
                isMenuOpen
                  ? 'max-h-64 opacity-100 visible mt-4'
                  : 'max-h-0 opacity-0 invisible'
              }`}
            >
              <div className="flex flex-col space-y-4 pb-4">
                <a
                  href="#about"
                  className="text-gray-700 hover:text-teal-400 transition-colors px-6 py-2 rounded-full hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </a>
                <a
                  href="#services"
                  className="text-gray-700 hover:text-teal-400 transition-colors px-6 py-2 rounded-full hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </a>
                <a
                  href="#contact"
                  className="bg-coral-500 text-white px-6 py-2 rounded-full hover:bg-coral-600 transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
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
          <header className="relative min-h-screen">
            <div className="absolute inset-0">
              <ImageSlideshow />
            </div>
            <div className="relative z-10 min-h-screen flex items-center justify-center pt-32">
              <div className="text-center text-white px-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Overcoming Addiction, One Step at a Time</h1>
                <p className="text-lg md:text-xl lg:text-2xl mb-8 text-coral-100">Addiction Prevention, Treatment, Recovery And Biopsychosocial approach</p>
                <div className="flex flex-col items-center gap-4">
                  <a 
                    href="#contact" 
                    className="bg-coral-500 hover:bg-coral-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105"
                  >
                    Get Help Now
                  </a>
                  <p className="text-teal-300 italic">we care</p>
                </div>
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
                    src="https://i.imgur.com/nw2TnHp.jpg" 
                    alt="Our founder speaking at an event" 
                    className="rounded-lg shadow-lg w-full h-[400px] object-cover"
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

          {/* Our Impact Section */}
          <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Our Impact</h2>
              <div className="space-y-16">
                {/* Direct Assistance Impact */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <img 
                      src="https://i.imgur.com/EVjvCqE.jpg" 
                      alt="Helping those affected by addiction" 
                      className="rounded-lg shadow-lg w-full h-[400px] object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-4 text-teal-400">Direct Assistance</h3>
                    <blockquote className="text-gray-600 mb-6 italic border-l-4 border-coral-500 pl-4">
                      "Every individual deserves a chance at recovery. Our hands-on approach ensures no one walks this path alone."
                    </blockquote>
                    <p className="text-gray-600">
                      We provide personalized support and guidance to individuals struggling with addiction, working closely with them and their families throughout the recovery journey. Our dedicated team ensures that each person receives the care and attention they need to overcome their challenges.
                    </p>
                  </div>
                </div>

                {/* First Impact Item */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="order-2 md:order-1">
                    <h3 className="text-2xl font-semibold mb-4 text-teal-400">Raising Awareness</h3>
                    <blockquote className="text-gray-600 mb-6 italic border-l-4 border-coral-500 pl-4">
                      "Addiction doesn't discriminate. It affects people from all walks of life. Our mission is to break the stigma and provide hope for those seeking recovery."
                    </blockquote>
                    <p className="text-gray-600">
                      Through our community outreach programs and public speaking engagements, we're working to educate communities about addiction prevention and the importance of seeking help early.
                    </p>
                  </div>
                  <div className="order-1 md:order-2">
                    <img 
                      src="https://i.imgur.com/q3lmvYB.jpg" 
                      alt="Speaking at community event" 
                      className="rounded-lg shadow-lg w-full h-[400px] object-cover"
                    />
                  </div>
                </div>

                {/* Second Impact Item */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <img 
                      src="https://i.imgur.com/4xzvn9q.jpg" 
                      alt="Workshop session" 
                      className="rounded-lg shadow-lg w-full h-[400px] object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-4 text-teal-400">Community Workshops</h3>
                    <blockquote className="text-gray-600 mb-6 italic border-l-4 border-coral-500 pl-4">
                      "Every workshop, every conversation is an opportunity to change lives. We're not just treating addiction; we're building a community of support and understanding."
                    </blockquote>
                    <p className="text-gray-600">
                      Our workshops bring together healthcare professionals, community leaders, and individuals affected by addiction to foster understanding and create lasting solutions.
                    </p>
                  </div>
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
                  { icon: <Sparkles className="w-12 h-12 text-teal-400" />, title: 'Biopsychosocial approach Services', description: 'Comprehensive healing approach' }
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
                      <p>Ruiru Way Bridge Opp Ruiru Golf Club, Ground Floor 4, Room 4</p>
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
      <footer className="bg-gray-900 text-white rounded-t-[2.5rem]">
        <div className="max-w-6xl mx-auto px-4 py-12">
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
                    <p>Ruiru Waybridge Opposite Ruiru Golf Club, Ground Floor Room 4</p>
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