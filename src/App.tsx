import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Phone, Mail, MapPin, Users, Brain, Sparkles, ArrowRight, Facebook, Twitter, Instagram, Apple as WhatsApp, Menu, X, ChevronLeft, ChevronRight, Navigation } from 'lucide-react';
import { useJsApiLoader, GoogleMap, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import NavigationModal from './components/NavigationModal';

const MAP_CONTAINER_STYLE = { width: '100%', height: '100%', minHeight: '450px' };
const DESTINATION = { lat: -1.1921635987964438, lng: 36.94331377496547 };
const MAP_CENTER = DESTINATION;

function Logo() {
  return (
    <div className="flex items-center gap-4">
      <img src="https://i.imgur.com/xgNrrHt.png" alt="Oasis Recovery Home Logo" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
      <div className="flex flex-col">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-teal-500">Oasis Recovery Home</h1>
        <div className="flex flex-col">
          <p className="text-sm md:text-base text-coral-500">Addiction Prevention, Treatment, and Recovery</p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="h-px bg-coral-500 w-12"></div>
          <p className="text-sm md:text-base text-teal-500 italic">we care</p>
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
    { url: "https://i.imgur.com/iIc6xs5.jpg", alt: "Oasis Recovery Home Event 1" },
    { url: "https://i.imgur.com/q3lmvYB.jpg", alt: "Oasis Recovery Home Event 2" },
    { url: "https://i.imgur.com/p1BerMb.jpg", alt: "Oasis Recovery Home Event 3" },
    { url: " https://i.imgur.com/L8nmapU.jpg", alt: "Oasis Recovery Home Event 4" },
    { url: "https://i.imgur.com/iDBDk9y.jpg", alt: "Oasis Recovery Home Event 5" },
    { url: "https://i.imgur.com/0Q1DGfU.jpg", alt: "Oasis Recovery Home Event 6"}
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
    let timer: ReturnType<typeof setInterval> | null = null;
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
      {images.map((_, index) => (
        <div
          key={index}
          style={getSlideStyle(index)}
          className="absolute inset-0 w-full h-full"
          aria-hidden={index !== currentIndex}
        />
      ))}

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
  const [showCounselingRoom, setShowCounselingRoom] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [directionsResult, setDirectionsResult] = useState<google.maps.DirectionsResult | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [tripStarted, setTripStarted] = useState(false);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  const mapRef = useRef<google.maps.Map | null>(null);

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const { isLoaded: isMapsLoaded, loadError: mapsLoadError } = useJsApiLoader({
    googleMapsApiKey: googleMapsApiKey || '',
  });

  const mapOptions = useMemo(
    () => ({
      center: MAP_CENTER,
      zoom: 13,
      disableDefaultUI: false,
      zoomControl: true,
      streetViewControl: true,
      mapTypeControl: true,
    }),
    []
  );

  // Get user location once maps are loaded (for inline directions map)
  useEffect(() => {
    if (!isMapsLoaded || !googleMapsApiKey) return;

    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError('Location is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocationError('Could not get your location. Please allow location access or use the link below.')
    );
  }, [isMapsLoaded, googleMapsApiKey]);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleStartTrip = useCallback(() => {
    if (!directionsResult || !mapRef.current) return;
    const route = directionsResult.routes[0];
    if (!route) return;

    const bounds = new google.maps.LatLngBounds();
    route.legs.forEach((leg) => {
      bounds.extend(leg.start_location);
      bounds.extend(leg.end_location);
    });
    mapRef.current.fitBounds(bounds);
    setTripStarted(true);
  }, [directionsResult]);

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

  const handleOpenNavigation = useCallback(() => {
    if (!googleMapsApiKey) return;
    window.location.hash = 'live-nav';
    setIsNavigationOpen(true);
  }, [googleMapsApiKey]);

  const handleCloseNavigation = useCallback(() => {
    setIsNavigationOpen(false);
    window.location.hash = 'find-us';
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash !== '#live-nav' && isNavigationOpen) {
        setIsNavigationOpen(false);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [isNavigationOpen]);

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

  const directionsUrl = "https://www.google.com/maps/dir/?api=1&origin=current+location&destination=-1.1921635987964438,36.94331377496547";
  const placeEmbedUrl = "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3988.954678043403!2d36.94331377496547!3d-1.1921635987964438!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMcKwMTEnMzEuOCJTIDM2wrA1Nic0NS4yIkU!5e0!3m2!1sen!2ske!4v1770878328422!5m2!1sen!2ske";

  return (
    <div className="min-h-screen bg-white">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className={`relative transition-all duration-500 ${
          isAtTop ? 'bg-white/60' : 'bg-white shadow-md'
        } rounded-b-[2.5rem]`}>
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Logo />
              
              <div className="hidden lg:flex items-center space-x-6">
                <a href="#about" className="text-gray-700 hover:text-teal-400 transition-colors px-4 py-2 rounded-full hover:bg-gray-50">About</a>
                <a href="#services" className="text-gray-700 hover:text-teal-400 transition-colors px-4 py-2 rounded-full hover:bg-gray-50">Services</a>
                <a href="#contact" className="bg-coral-500 text-white px-6 py-2 rounded-full hover:bg-coral-600 transition-colors">
                  Contact Us
                </a>
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

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

      <div className="relative">
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

        <div className="relative z-10">
          <header className="relative min-h-screen">
            <div className="absolute inset-0">
              <ImageSlideshow />
            </div>
            <div className="relative z-10 min-h-screen flex items-center justify-center pt-32">
              <div className="text-center text-white px-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Overcoming Addiction, One Step at a Time</h1>
                <p className="text-lg md:text-xl lg:text-2xl mb-8 text-coral-100">Addiction Prevention, Treatment, and Recovery</p>
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
                  <h3 className="text-2xl font-semibold mb-4 text-teal-400">Our Story</h3>
                  <p className="text-gray-600 mb-6">
                    Oasis Recovery Home was established in 2020 after recognizing the urgent need to support individuals struggling with drug and substance disorders. Many were willing to recover but lacked the necessary support system.
                  </p>
                  <p className="text-gray-600">
                    Our organization is dedicated to providing both inpatient and outpatient care, guiding individuals—both male and female—on their journey to recovery. Through a compassionate and structured approach, we strive to empower individuals to regain control of their lives and achieve lasting wellness.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Our Impact</h2>
              <div className="space-y-16">
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

          <section id="services" className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Our Services</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { 
                    icon: <img src="https://i.imgur.com/4nbFFCV.png" alt="Prevention Icon" className="w-12 h-12" />, 
                    title: 'Addiction Prevention', 
                    description: 'Proactive sensitization, physcoeducation and support programs' 
                  },
                  { 
                    icon: <Brain className="w-12 h-12 text-teal-400" />, 
                    title: 'Treatment Program', 
                    description: 'Biopsychosocial approach' 
                  },
                  { 
                    icon: <Sparkles className="w-12 h-12 text-coral-500" />, 
                    title: 'Recovery & Rehabilitation Support', 
                    description: 'Inpatient and Outpatient Individualized support' 
                  },
                  { 
                    icon: <Users className="w-12 h-12 text-teal-400" />, 
                    title: 'After Care Program', 
                    description: 'AA meetings and follow ups' 
                  }
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

          <section className="py-20 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800">Our Gallery</h2>
                <button
                  onClick={() => setShowCounselingRoom(true)}
                  className="bg-teal-400 hover:bg-teal-500 text-white px-4 py-2 rounded-full transition-colors duration-300 mt-4 md:mt-0"
                >
                  Click to see our counselling room
                </button>
              </div>
              
              {showCounselingRoom && (
                <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-lg max-w-4xl w-full p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-bold">Our Counselling Room</h3>
                      <button
                        onClick={() => setShowCounselingRoom(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X size={24} />
                      </button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4">
                      <img
                        src="https://i.imgur.com/W1w7Z4j.jpg"
                        alt="Counseling Room 1"
                        className="w-full h-96 object-cover rounded-lg"
                      />
                      <img
                        src="https://i.imgur.com/6lDw8Nl.jpg"
                        alt="Counseling Room 2"
                        className="w-full h-96 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="relative">
                <div className="flex overflow-x-auto pb-8 gap-4 snap-x snap-mandatory scrollbar-hide">
                  {[
                    "https://i.imgur.com/kRm1neK.jpg",
                    "https://i.imgur.com/z3FuBsu.jpg",
                    "https://i.imgur.com/3dltxcb.jpg",
                    "https://i.imgur.com/nbqfHii.jpg",
                    "https://i.imgur.com/97589Gj.jpg",
                    "https://i.imgur.com/L8nmapU.jpg",
                    "https://i.imgur.com/ofDzZFZ.jpg",
                    "https://i.imgur.com/qg2eJzU.jpg",
                    "https://i.imgur.com/V9ZjqhE.jpg",
                    "https://i.imgur.com/Cu7GPbZ.jpg",
                    "https://i.imgur.com/65o3s72.jpg",
                    "https://i.imgur.com/cdCAX98.jpg",
                    "https://i.imgur.com/ArBmc2P.jpg",
                    "https://i.imgur.com/u30q5RP.jpg",
                    "https://i.imgur.com/p1BerMb.jpg",
                    "https://i.imgur.com/hnpC6Jx.jpg",
                    "https://i.imgur.com/ZTa9vbL.jpg",
                    "https://i.imgur.com/KSP3DO4.jpg",
                    "https://i.imgur.com/oegLCYZ.jpg",
                    "https://i.imgur.com/qorLe79.jpg",
                    "https://i.imgur.com/b2IJYhD.jpg"
                  ].map((imageUrl, index) => (
                    <div 
                      key={index} 
                      className="flex-none snap-center"
                    >
                      <img
                        src={imageUrl}
                        alt={`Gallery image ${index + 1}`}
                        className="w-72 h-72 object-cover rounded-lg shadow-lg hover:transform hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-gray-50 to-transparent w-12" />
                <div className="absolute inset-y-0 right-0 bg-gradient-to-l from-gray-50 to-transparent w-12" />
              </div>
            </div>
          </section>

          <section id="find-us" className="py-20 px-4 bg-transparent">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Find Us</h2>
              <p className="text-gray-500 text-sm text-center max-w-2xl mx-auto mb-6">
                Use the map below to pan, zoom, and view the route from your current location to <span className="font-semibold">Oasis Recovery Home</span>.
                When asked, please allow location access so we can draw the trail.
              </p>

              <div className="rounded-xl overflow-hidden shadow-lg max-w-5xl mx-auto" style={{ minHeight: 450 }}>
                {!googleMapsApiKey ? (
                  <>
                    <iframe
                      src={placeEmbedUrl}
                      title="Oasis Recovery Home location"
                      className="w-full h-full min-h-[300px]"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    <div className="mt-3 flex flex-col items-center gap-2 pb-1">
                      <a
                        href={directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg text-sm"
                      >
                        <Navigation className="w-4 h-4" />
                        Open directions in Google Maps
                      </a>
                      <p className="text-gray-400 text-xs">
                        Add <code className="text-[0.7rem] bg-gray-100 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> in <code className="text-[0.7rem] bg-gray-100 px-1 rounded">.env</code> to show the live route here.
                      </p>
                    </div>
                  </>
                ) : mapsLoadError ? (
                  <div className="flex flex-col items-center justify-center gap-4 p-6 min-h-[300px]">
                    <p className="text-gray-600 text-center">
                      The interactive map failed to load. You can still get directions in Google Maps.
                    </p>
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg text-sm"
                    >
                      <Navigation className="w-4 h-4" />
                      Open directions in Google Maps
                    </a>
                  </div>
                ) : !isMapsLoaded ? (
                  <div className="flex items-center justify-center min-h-[300px] text-gray-500 text-sm">
                    Loading interactive map…
                  </div>
                ) : locationError ? (
                  <div className="flex flex-col items-center justify-center gap-4 p-6 min-h-[300px]">
                    <p className="text-gray-600 text-center">
                      {locationError}
                    </p>
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg text-sm"
                    >
                      <Navigation className="w-4 h-4" />
                      Open directions in Google Maps
                    </a>
                  </div>
                ) : (
                  <GoogleMap
                    mapContainerStyle={MAP_CONTAINER_STYLE}
                    options={mapOptions}
                    onLoad={handleMapLoad}
                  >
                    {userLocation && !directionsResult && (
                      <DirectionsService
                        options={{
                          origin: userLocation,
                          destination: DESTINATION,
                          travelMode: google.maps.TravelMode.DRIVING,
                        }}
                        callback={(result, status) => {
                          if (status === google.maps.DirectionsStatus.OK && result) {
                            setDirectionsResult(result);
                          }
                        }}
                      />
                    )}
                    {directionsResult && <DirectionsRenderer directions={directionsResult} />}
                  </GoogleMap>
                )}
              </div>

              {googleMapsApiKey && isMapsLoaded && (
                <div className="text-center mt-3 text-xs text-gray-400 space-y-1">
                  {directionsResult && (
                    (() => {
                      const leg = directionsResult.routes[0]?.legs[0];
                      if (!leg) return null;
                      return (
                        <p>
                          Trip summary:{" "}
                          <span className="font-semibold text-gray-500">
                            {leg.distance?.text}
                          </span>{" "}
                          ·{" "}
                          <span className="font-semibold text-gray-500">
                            {leg.duration?.text}
                          </span>
                        </p>
                      );
                    })()
                  )}
                  <p>
                    If the route doesn&apos;t appear, try refreshing the page or use the button above to open Google Maps.
                  </p>
                </div>
              )}

              <div className="flex justify-center mt-6">
                <button
                  type="button"
                  onClick={handleOpenNavigation}
                  disabled={!googleMapsApiKey}
                  className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold shadow-md transition-colors ${
                    !googleMapsApiKey
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-black'
                  }`}
                >
                  <Navigation className="w-4 h-4" />
                  Start live walking navigation
                </button>
              </div>
            </div>
          </section>

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
                      <a
                        href="#find-us"
                        className="text-left text-gray-700 hover:text-teal-400 transition-colors"
                      >
                        Kahawa Sukari
                      </a>
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

      <footer className="bg-gray-900 text-white rounded-t-[2.5rem]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Logo />
              <p className="text-gray-400 mt-2 text-sm">Providing hope and healing for those struggling with addiction.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
              <div className="space-y-2 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-coral-500" />
                  <p>oasiswellness2020@gmail.com</p>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-coral-500" />
                  <div>
                    <a
                      href="#find-us"
                      className="hover:text-teal-400 transition-colors"
                    >
                      Kahawa Sukari
                    </a>
                    <p className="mt-1">P.O Box 64069-00620, Muthaiga</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-coral-500" />
                  <p>24/7 Helpline: +254 712 929 460</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Oasis Recovery Home. All rights reserved.</p>
            <div className="mt-3 text-xs flex items-center justify-center gap-2">
              <span>Developed and Maintained by</span>
              <a href="https://astraronix.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-coral-500 hover:underline">
                <img src="https://i.imgur.com/T7mH4Ly.png" alt="Astraronix Solutions Logo" className="h-5" />
                <span>Astraronix Solutions</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
      {isNavigationOpen && (
        <NavigationModal
          destination={DESTINATION}
          isOpen={isNavigationOpen}
          onClose={handleCloseNavigation}
          apiKey={googleMapsApiKey}
          isLoaded={isMapsLoaded}
          loadError={mapsLoadError}
        />
      )}
    </div>
  );
}

export default App;