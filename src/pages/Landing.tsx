import { createSignal, onMount } from 'solid-js';

export default function Landing() {
  const [isLoaded, setIsLoaded] = createSignal(false);
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);

  onMount(() => {
    setTimeout(() => setIsLoaded(true), 100);
  });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen());

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  };

  const navigationItems = [
    { name: 'Home', id: 'home' },
    { name: 'Products', id: 'products' },
    { name: 'About', id: 'about' },
    { name: 'Contact', id: 'contact' }
  ];

  return (
    <div class="font-sans text-[#2E365A] overflow-x-hidden">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8) rotate(-2deg); }
          to { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
          40%, 43% { transform: translate3d(0,-15px,0); }
          70% { transform: translate3d(0,-8px,0); }
          90% { transform: translate3d(0,-3px,0); }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(1deg); }
          50% { transform: translateY(-15px) rotate(-1deg); }
          75% { transform: translateY(-5px) rotate(0.5deg); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .slide-in-left { animation: slideInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .slide-in-right { animation: slideInRight 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .scale-in { animation: scaleIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .bounce-animation { animation: bounce 3s infinite ease-in-out; }
        .floating { animation: float 8s ease-in-out infinite; }
        
        .gradient-animation { 
          background: linear-gradient(-45deg, #D0797F, #A801A7, #3F5B8B, #96AAC5);
          background-size: 400% 400%;
          animation: gradient 4s ease infinite;
        }
        
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
        .delay-400 { animation-delay: 0.4s; opacity: 0; }
        .delay-500 { animation-delay: 0.5s; opacity: 0; }
        .delay-600 { animation-delay: 0.6s; opacity: 0; }
        .delay-700 { animation-delay: 0.7s; opacity: 0; }
        .delay-800 { animation-delay: 0.8s; opacity: 0; }
        
        .hover-lift {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hover-lift:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .hover-glow {
          transition: all 0.3s ease;
        }
        .hover-glow:hover {
          box-shadow: 0 0 30px rgba(208, 121, 127, 0.5);
          transform: scale(1.05);
        }
        
        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .card-hover::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        
        .card-hover:hover::before {
          left: 100%;
        }
        
        .card-hover:hover {
          transform: translateY(-12px) scale(1.03);
          box-shadow: 0 25px 50px rgba(0,0,0,0.15);
        }
        
        .text-gradient {
          background: linear-gradient(135deg, #D0797F, #A801A7, #3F5B8B);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .pulse-glow {
          animation: pulse-glow 2s infinite;
        }
        
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 5px rgba(208, 121, 127, 0.5); }
          50% { box-shadow: 0 0 25px rgba(208, 121, 127, 0.8), 0 0 40px rgba(208, 121, 127, 0.4); }
          100% { box-shadow: 0 0 5px rgba(208, 121, 127, 0.5); }
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #D0797F, #A801A7);
          position: relative;
          overflow: hidden;
        }
        
        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.6s;
        }
        
        .btn-primary:hover::before {
          left: 100%;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .hero-pattern {
          background-image: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%);
        }

        .product-image {
          width: 100%;
          height: 120px;
          object-fit: contain;
          border-radius: 12px;
          transition: transform 0.3s ease;
        }

        .product-image:hover {
          transform: scale(1.05);
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* Navbar */}
      <header class="fixed top-0 left-0 right-0 z-50 glass-effect shadow-lg slide-in-left delay-100">
        <div class="flex justify-between items-center px-4 md:px-16 py-4">
          <h1 
            class="text-2xl md:text-3xl font-bold text-gradient hover:scale-110 transition-transform duration-300 cursor-pointer"
            onClick={() => scrollToSection('home')}
          >
            🏕️ CampRent
          </h1>
          
          {/* Desktop Navigation */}
          <nav class="hidden md:flex gap-8 text-sm font-medium text-gray-600">
            {navigationItems.map((item) => (
              <button 
                onClick={() => scrollToSection(item.id)} 
                class="hover:text-[#D0797F] transition-all duration-300 relative group"
              >
                {item.name}
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#D0797F] to-[#A801A7] transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </nav>
          
          {/* Desktop Buttons */}
          <div class="hidden md:flex gap-3">
            <a href="/register" class="border-2 border-[#D0797F] text-[#D0797F] px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#FCEBEC] hover:scale-105 transition-all duration-300">
              Sign Up
            </a>
            <a href="/login" class="btn-primary text-white px-6 py-2 rounded-full text-sm font-semibold hover:scale-105 transition-all duration-300">
              Sign In
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            class="md:hidden p-2 text-[#D0797F] hover:bg-gray-100 rounded-lg transition-colors duration-300"
          >
            {isMenuOpen() ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen() && (
          <div class="md:hidden glass-effect border-t border-gray-200 slide-in-right delay-100">
            <nav class="flex flex-col px-4 py-4 space-y-3">
              {navigationItems.map((item) => (
                <button 
                  onClick={() => scrollToSection(item.id)} 
                  class="text-gray-600 hover:text-[#D0797F] py-2 transition-colors duration-300 text-left"
                >
                  {item.name}
                </button>
              ))}
              <div class="flex flex-col gap-3 pt-4 border-t border-gray-200">
                <a href="/register" class="border-2 border-[#D0797F] text-[#D0797F] px-6 py-2 rounded-full text-sm font-semibold text-center hover:bg-[#FCEBEC] transition-all duration-300">
                  Sign Up
                </a>
                <a href="/login" class="btn-primary text-white px-6 py-2 rounded-full text-sm font-semibold text-center transition-all duration-300">
                  Sign In
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="home" class="relative bg-gradient-to-br from-[#1a1f3a] via-[#2d4059] to-[#3f5b8b] min-h-screen flex items-center justify-center overflow-hidden">
        {/* Advanced Background Pattern */}
        <div class="absolute inset-0 opacity-30">
          <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-indigo-800/20"></div>
          <div class="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-pink-400/10 to-purple-500/10 rounded-full blur-3xl floating delay-100"></div>
          <div class="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-indigo-500/10 rounded-full blur-3xl floating delay-300"></div>
          <div class="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl floating delay-500"></div>
        </div>
        
        {/* Geometric Floating Elements */}
        <div class="absolute top-32 left-16 w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full floating delay-200 opacity-70"></div>
        <div class="absolute top-48 right-32 w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-500 rotate-45 floating delay-400 opacity-60"></div>
        <div class="absolute bottom-32 left-1/4 w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full floating delay-600 opacity-80"></div>
        <div class="absolute bottom-48 right-1/4 w-5 h-5 bg-gradient-to-r from-cyan-400 to-blue-500 rotate-45 floating delay-800 opacity-50"></div>
        <div class="absolute top-1/3 left-8 w-2 h-2 bg-white rounded-full floating delay-1000 opacity-90"></div>
        <div class="absolute top-2/3 right-8 w-2 h-2 bg-white rounded-full floating delay-1200 opacity-70"></div>
        
        <div class="relative z-10 text-center text-white px-6 max-w-7xl mt-16">
          {/* Enhanced Main Title */}
          <div class="fade-in delay-200 mb-12">
            <div class="inline-block mb-6">
              <div class="text-5xl md:text-8xl font-black mb-4 leading-none">
                <span class="block bg-gradient-to-r from-white via-purple-100 to-blue-100 bg-clip-text text-transparent drop-shadow-2xl">
                  Sewa Alat Camping
                </span>
              </div>
              <div class="relative">
                <div class="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 blur-2xl opacity-50 scale-110"></div>
                <h2 class="relative text-4xl md:text-6xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  Mudah & Cepat
                </h2>
              </div>
            </div>
          </div>
          
          {/* Enhanced Description */}
          <div class="fade-in delay-400 mb-12">
            <p class="text-xl md:text-3xl mb-6 max-w-4xl mx-auto font-light leading-relaxed text-blue-50">
              Mulai petualanganmu hari ini bersama
            </p>
            <div class="inline-block relative mb-6">
              <div class="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 blur-xl opacity-40 scale-110"></div>
              <span class="relative text-3xl md:text-4xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                CampRent
              </span>
            </div>
            <p class="text-lg md:text-xl max-w-4xl mx-auto font-light leading-relaxed text-blue-100/90">
              Platform terpercaya untuk menyewa peralatan camping berkualitas tinggi
            </p>
          </div>
          
          {/* Enhanced CTA Buttons */}
          <div class="fade-in delay-600 flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <a href="/login" class="group relative px-12 py-5 text-xl font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105">
              <div class="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 group-hover:from-pink-400 group-hover:via-purple-400 group-hover:to-indigo-400 transition-all duration-300"></div>
              <div class="absolute inset-0 bg-gradient-to-r from-pink-600/50 to-purple-600/50 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300 scale-110"></div>
              <span class="relative flex items-center justify-center gap-3 text-white">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.75 2c0 .83.42 1.64 1.16 2.1l6.188 3.93c.74.47 1.18 1.27 1.18 2.1v7.9c0 .83-.44 1.63-1.18 2.1l-6.188 3.93c-.74.46-1.16 1.27-1.16 2.1s-.42 1.64-1.16 2.1l-6.188 3.93c-.74.47-1.18 1.27-1.18 2.1s.44 1.63 1.18 2.1l6.188 3.93c.74.46 1.16 1.27 1.16 2.1"/>
                </svg>
                Sewa Sekarang
              </span>
            </a>
            
            <button 
              onClick={() => scrollToSection('products')} 
              class="group relative px-12 py-5 text-xl font-bold rounded-2xl border-2 border-white/30 backdrop-blur-sm bg-white/10 hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 text-white"
            >
              <span class="flex items-center justify-center gap-3">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                Lihat Produk
              </span>
            </button>
          </div>
          
          {/* Enhanced Stats */}
          <div class="fade-in delay-800">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-4xl mx-auto">
              <div class="group text-center">
                <div class="relative mb-4">
                  <div class="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 scale-110"></div>
                  <div class="relative text-5xl md:text-6xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    500+
                  </div>
                </div>
                <div class="text-lg font-medium text-blue-100/80 tracking-wide">Peralatan Tersedia</div>
                <div class="w-16 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto mt-3 rounded-full"></div>
              </div>
              
              <div class="group text-center">
                <div class="relative mb-4">
                  <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 scale-110"></div>
                  <div class="relative text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    1000+
                  </div>
                </div>
                <div class="text-lg font-medium text-blue-100/80 tracking-wide">Pelanggan Puas</div>
                <div class="w-16 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto mt-3 rounded-full"></div>
              </div>
              
              <div class="group text-center">
                <div class="relative mb-4">
                  <div class="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 scale-110"></div>
                  <div class="relative text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
                    4.9
                    <svg class="w-8 h-8 md:w-10 md:h-10 text-yellow-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                </div>
                <div class="text-lg font-medium text-blue-100/80 tracking-wide">Rating Pelanggan</div>
                <div class="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mt-3 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Gradient Border */}
        <div class="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
      </section>

      {/* Features */}
      <section class="py-20 bg-gradient-to-b from-white to-gray-50 px-6 md:px-24">
        <div class="max-w-screen-xl mx-auto">
          <div class="text-center mb-16 fade-in delay-100">
            <h2 class="text-4xl md:text-5xl font-bold mb-6">
              <span class="text-gradient">Mengapa Pilih CampRent?</span>
            </h2>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
              Kami menyediakan layanan terbaik untuk memastikan pengalaman camping Anda tak terlupakan
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg class="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 16h6v4a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-4h6m8-8V4a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v4"/>
                    <rect x="8" y="8" width="8" height="4"/>
                    <path d="M8 16l2-2 2 2 2-2 2 2"/>
                  </svg>
                ),
                title: "Lengkap",
                desc: "Tersedia berbagai alat camping berkualitas tinggi untuk semua kebutuhan petualangan outdoor Anda, dari pemula hingga profesional",
                gradient: "from-[#3F5B8B] to-[#96AAC5]",
                delay: "delay-200"
              },
              {
                icon: (
                  <svg class="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                ),
                title: "Cepat",
                desc: "Proses pemesanan dan konfirmasi hanya dalam hitungan menit. Sistem otomatis kami memastikan booking langsung terkonfirmasi",
                gradient: "from-[#D0797F] to-[#A801A7]",
                delay: "delay-400"
              },
              {
                icon: (
                  <svg class="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12l2 2 4-4"/>
                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                    <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                    <path d="M15 12c0 3-3 6-3 6s-3-3-3-6c0-3 3-3 3-3s3 0 3 3"/>
                  </svg>
                ),
                title: "Aman",
                desc: "Jaminan keamanan 100% dalam transaksi dengan sistem pembayaran terintegrasi dan perlindungan data terdepan",
                gradient: "from-[#96AAC5] to-[#3F5B8B]",
                delay: "delay-600"
              }
            ].map((feature, index) => (
              <div class={`text-center card-hover bg-white p-8 rounded-2xl shadow-xl scale-in ${feature.delay} group`}>
                <div class={`bg-gradient-to-br ${feature.gradient} w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 class="text-2xl font-bold mb-4 text-[#2E365A]">{feature.title}</h3>
                <p class="text-gray-600 leading-relaxed text-lg">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section id="products" class="bg-gradient-to-br from-[#96AAC5] to-[#3F5B8B] py-20 px-6 md:px-24">
        <div class="max-w-screen-xl mx-auto">
          <div class="text-center mb-16 fade-in delay-100">
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
              🔥 Alat Camping Terpopuler
            </h2>
            <p class="text-xl text-white/90 max-w-3xl mx-auto">
              Pilihan favorit para petualang yang sudah terbukti kualitasnya
            </p>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                name: "Tenda 2 Orang", 
                price: "Rp 50.000", 
                period: "/hari", 
                img: "/tenda.png", 
                popular: true,
                rating: 4.9,
                reviews: 156,
                features: ["Waterproof", "Easy Setup", "Compact"]
              },
              { 
                name: "Kompor Lipat", 
                price: "Rp 20.000", 
                period: "/hari", 
                img: "/kompor.png", 
                popular: false,
                rating: 4.8,
                reviews: 89,
                features: ["Portable", "Gas Efficient", "Safety Lock"]
              },
              { 
                name: "Nesting Set", 
                price: "Rp 20.000", 
                period: "/hari", 
                img: "/nesting.png", 
                popular: false,
                rating: 4.7,
                reviews: 124,
                features: ["Non-stick", "Lightweight", "Complete Set"]
              },
              { 
                name: "Headlamp LED", 
                price: "Rp 15.000", 
                period: "/hari", 
                img: "/headlamp.png", 
                popular: true,
                rating: 4.9,
                reviews: 203,
                features: ["Super Bright", "Waterproof", "Long Battery"]
              },
            ].map((item, i) => (
              <div class={`bg-white rounded-2xl shadow-xl p-6 text-center hover-lift scale-in delay-${(i + 2) * 100} relative overflow-hidden group`}>
                {item.popular && (
                  <div class="absolute -top-2 -right-2 bg-gradient-to-r from-[#D0797F] to-[#A801A7] text-white px-4 py-2 rounded-bl-2xl text-xs font-bold shadow-lg">
                    🔥 POPULAR
                  </div>
                )}
                
                <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 mb-6 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={item.img} 
                    alt={item.name}
                    class="product-image"
                  />
                </div>
                
                <h3 class="font-bold text-xl mb-2 text-[#2E365A]">{item.name}</h3>
                
                <div class="flex items-center justify-center gap-1 mb-3">
                  <div class="flex text-yellow-400">
                    {Array.from({length: 5}).map((_, starIndex) => (
                      <svg 
                        class={`w-4 h-4 ${starIndex < Math.floor(item.rating) ? "fill-current" : "fill-gray-200"}`}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <span class="text-sm text-gray-600 ml-2">{item.rating} ({item.reviews})</span>
                </div>
                
                <div class="mb-4">
                  {item.features.map((feature, idx) => (
                    <span class="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs mr-1 mb-1">
                      {feature}
                    </span>
                  ))}
                </div>
                
                <div class="mb-6">
                  <span class="text-3xl font-bold text-[#D0797F]">{item.price}</span>
                  <span class="text-gray-600 text-lg">{item.period}</span>
                </div>
                
                <button class="w-full btn-primary text-white py-3 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-bold text-lg">
                  🛒 Sewa Sekarang
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Rent */}
      <section class="bg-gradient-to-b from-[#E3ECF7] to-white py-20 px-6 md:px-24">
        <div class="max-w-screen-lg mx-auto">
          <div class="text-center mb-16 fade-in delay-100">
            <h2 class="text-4xl md:text-5xl font-bold mb-6">
              <span class="text-gradient">Cara Sewa di CampRent</span>
            </h2>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
              Proses yang mudah dan cepat untuk memulai petualangan Anda
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                step: 1,
                title: "Cari Alat Camping",
                desc: "Jelajahi berbagai alat camping berkualitas yang tersedia dan pilih yang sesuai dengan kebutuhan petualanganmu. Filter berdasarkan kategori, harga, dan rating.",
                icon: "🔍",
                color: "from-[#D0797F] to-[#A801A7]"
              },
              {
                step: 2,
                title: "Tentukan Lama Penyewaan",
                desc: "Pilih durasi penyewaan yang fleksibel sesuai rencana perjalananmu, mulai dari 1 hari hingga beberapa minggu dengan harga yang kompetitif.",
                icon: "📅",
                color: "from-[#3F5B8B] to-[#96AAC5]"
              },
              {
                step: 3,
                title: "Checkout & Konfirmasi",
                desc: "Isi detail penyewa dengan lengkap, pilih metode pembayaran yang aman, dan dapatkan konfirmasi booking secara instan melalui email dan WhatsApp.",
                icon: "💳",
                color: "from-[#96AAC5] to-[#D0797F]"
              },
              {
                step: 4,
                title: "Nikmati Petualangan",
                desc: "Alat akan dikirim ke lokasi yang Anda tentukan atau bisa diambil di store kami. Tinggal gunakan dan nikmati pengalaman camping yang tak terlupakan!",
                icon: "🏕️",
                color: "from-[#A801A7] to-[#3F5B8B]"
              },
            ].map((item, index) => (
              <div class={`bg-white rounded-2xl shadow-xl p-8 flex gap-6 items-start hover-lift slide-in-${index % 2 === 0 ? 'left' : 'right'} delay-${(index + 1) * 150} border-l-4 border-[#D0797F] group`}>
                <div class="flex-shrink-0">
                  <div class="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                  <div class={`w-12 h-12 bg-gradient-to-r ${item.color} text-white rounded-full flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform duration-300`}>
                    {item.step}
                  </div>
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-2xl mb-4 text-[#2E365A]">{item.title}</h3>
                  <p class="text-gray-600 leading-relaxed text-lg">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" class="bg-gradient-to-br from-[#96AAC5] to-[#3F5B8B] py-20 px-6 md:px-24">
        <div class="max-w-screen-xl mx-auto">
          <div class="text-center mb-16 fade-in delay-100">
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
              ✨ Tentang CampRent
            </h2>
            <p class="text-xl text-white/90 max-w-3xl mx-auto">
              Misi kami adalah membuat petualangan outdoor lebih mudah diakses untuk semua orang
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div class="space-y-8 fade-in delay-200">
              <div class="bg-white/10 backdrop-filter backdrop-blur-sm rounded-2xl p-8">
                <h3 class="text-3xl font-bold text-white mb-6">🎯 Visi Kami</h3>
                <p class="text-white/90 text-lg leading-relaxed">
                  Menjadi platform rental alat camping terdepan di Indonesia yang memungkinkan setiap orang 
                  untuk menikmati keindahan alam tanpa harus mengeluarkan investasi besar untuk peralatan camping.
                </p>
              </div>

              <div class="bg-white/10 backdrop-filter backdrop-blur-sm rounded-2xl p-8">
                <h3 class="text-3xl font-bold text-white mb-6">🚀 Misi Kami</h3>
                <ul class="text-white/90 text-lg leading-relaxed space-y-3">
                  <li class="flex items-start gap-3">
                    <span class="text-[#D0797F] mt-1">•</span>
                    Menyediakan peralatan camping berkualitas tinggi dengan harga terjangkau
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="text-[#D0797F] mt-1">•</span>
                    Memberikan pengalaman rental yang mudah, cepat, dan terpercaya
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="text-[#D0797F] mt-1">•</span>
                    Mendukung gaya hidup outdoor yang berkelanjutan dan ramah lingkungan
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="text-[#D0797F] mt-1">•</span>
                    Membangun komunitas pecinta alam Indonesia yang solid
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Content */}
            <div class="space-y-8 fade-in delay-400">
              <div class="bg-white/10 backdrop-filter backdrop-blur-sm rounded-2xl p-8">
                <h3 class="text-3xl font-bold text-white mb-6">💎 Nilai-Nilai Kami</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div class="text-center">
                    <div class="text-4xl mb-3">🤝</div>
                    <div class="font-bold text-white mb-2">Kepercayaan</div>
                    <div class="text-white/80 text-sm">Komitmen untuk selalu memberikan pelayanan terbaik</div>
                  </div>
                  <div class="text-center">
                    <div class="text-4xl mb-3">⚡</div>
                    <div class="font-bold text-white mb-2">Inovasi</div>
                    <div class="text-white/80 text-sm">Terus berinovasi untuk pengalaman yang lebih baik</div>
                  </div>
                  <div class="text-center">
                    <div class="text-4xl mb-3">🌱</div>
                    <div class="font-bold text-white mb-2">Berkelanjutan</div>
                    <div class="text-white/80 text-sm">Mendukung pariwisata yang bertanggung jawab</div>
                  </div>
                  <div class="text-center">
                    <div class="text-4xl mb-3">🎯</div>
                    <div class="font-bold text-white mb-2">Kualitas</div>
                    <div class="text-white/80 text-sm">Peralatan berkualitas tinggi dan terawat</div>
                  </div>
                </div>
              </div>

              {/* Team Stats */}
              <div class="bg-white/10 backdrop-filter backdrop-blur-sm rounded-2xl p-8">
                <h3 class="text-3xl font-bold text-white mb-6 text-center">🏆 Pencapaian Kami</h3>
                <div class="grid grid-cols-2 gap-6">
                  <div class="text-center">
                    <div class="text-3xl font-bold text-[#D0797F] mb-2">3+</div>
                    <div class="text-white/80 text-sm">Tahun Pengalaman</div>
                  </div>
                  <div class="text-center">
                    <div class="text-3xl font-bold text-[#D0797F] mb-2">50+</div>
                    <div class="text-white/80 text-sm">Destinasi Terjangkau</div>
                  </div>
                  <div class="text-center">
                    <div class="text-3xl font-bold text-[#D0797F] mb-2">99%</div>
                    <div class="text-white/80 text-sm">Kepuasan Pelanggan</div>
                  </div>
                  <div class="text-center">
                    <div class="text-3xl font-bold text-[#D0797F] mb-2">24/7</div>
                    <div class="text-white/80 text-sm">Customer Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div class="text-center mt-16 fade-in delay-600">
            <div class="bg-white/10 backdrop-filter backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 class="text-3xl font-bold text-white mb-4">
                🤝 Bergabung dengan Keluarga Besar CampRent
              </h3>
              <p class="text-white/90 text-lg mb-6">
                Jadilah bagian dari komunitas petualang yang terus berkembang dan nikmati berbagai keuntungan eksklusif
              </p>
              <button 
                onClick={() => scrollToSection('contact')} 
                class="btn-primary text-white px-8 py-4 rounded-full text-lg font-bold hover:scale-105 transition-all duration-300"
              >
                💬 Hubungi Kami Sekarang
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section class="bg-white py-20 px-6 md:px-24">
        <div class="max-w-screen-xl mx-auto">
          <div class="text-center mb-16 fade-in delay-100">
            <h2 class="text-4xl md:text-5xl font-bold mb-6">
              💬 <span class="text-gradient">Apa Kata Mereka?</span>
            </h2>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
              Pengalaman nyata dari para petualang yang telah mempercayai CampRent
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                rating: 5, 
                name: "Rina Sari", 
                comment: "Alat campingnya lengkap dan berkualitas tinggi! Pengirimannya juga super cepat, bahkan bisa same day delivery. Sangat recommended untuk yang mau camping pertama kali seperti saya.",
                location: "Jakarta",
                avatar: "👩",
                trip: "Camping ke Gunung Salak"
              },
              { 
                rating: 5, 
                name: "Bayu Pratama", 
                comment: "Pelayanan customer service sangat ramah dan responsif. Harga sangat terjangkau dibanding beli sendiri. Sangat cocok buat trip bareng teman-teman. Pasti akan sewa lagi!",
                location: "Bandung",
                avatar: "👨",
                trip: "Adventure ke Pantai Pangandaran"
              },
              { 
                rating: 5, 
                name: "Sita Maharani", 
                comment: "Kondisi semua peralatan masih bagus banget dan bersih. Proses booking-nya sangat mudah, bisa dilakukan online. Tim CampRent juga kasih tips camping yang berguna banget.",
                location: "Yogyakarta",
                avatar: "👩‍🦱",
                trip: "Camping di Dieng Plateau"
              },
            ].map((item, i) => (
              <div class={`bg-gradient-to-br from-[#96AAC5] to-[#3F5B8B] p-8 rounded-2xl text-white hover-lift scale-in delay-${(i + 2) * 100} relative overflow-hidden group`}>
                <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                <div class="relative">
                  <div class="flex items-center justify-between mb-6">
                    <div class="flex text-yellow-400 text-xl">
                      {Array.from({length: item.rating}).map((_, starIndex) => (
                        <svg 
                          class="w-5 h-5 fill-current" 
                          viewBox="0 0 24 24"
                          style={`animation-delay: ${starIndex * 0.1}s`}
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </div>
                    <div class="text-3xl group-hover:scale-110 transition-transform duration-300">{item.avatar}</div>
                  </div>
                  
                  <p class="mb-6 text-lg italic leading-relaxed font-medium">"{item.comment}"</p>
                  
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-bold text-xl">{item.name}</p>
                      <p class="text-sm opacity-80 flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {item.location}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm opacity-80">Trip:</p>
                      <p class="text-sm font-semibold">{item.trip}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Trust Indicators */}
          <div class="mt-16 text-center fade-in delay-400">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div class="text-center">
                <div class="text-2xl mb-2">🏆</div>
                <div class="font-bold text-lg text-[#2E365A]">Best Service 2024</div>
                <div class="text-sm text-gray-600">Camping Awards</div>
              </div>
              <div class="text-center">
                <div class="text-2xl mb-2">✅</div>
                <div class="font-bold text-lg text-[#2E365A]">100% Verified</div>
                <div class="text-sm text-gray-600">All Equipment</div>
              </div>
              <div class="text-center">
                <div class="text-2xl mb-2">🚚</div>
                <div class="font-bold text-lg text-[#2E365A]">24h Delivery</div>
                <div class="text-sm text-gray-600">Jakarta Area</div>
              </div>
              <div class="text-center">
                <div class="text-2xl mb-2">💎</div>
                <div class="font-bold text-lg text-[#2E365A]">Premium Quality</div>
                <div class="text-sm text-gray-600">Guaranteed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section class="bg-gradient-to-r from-[#96AAC5] via-[#3F5B8B] to-[#2E365A] py-20 text-center px-6 relative overflow-hidden">
        <div class="absolute inset-0 bg-black/20"></div>
        
        {/* Animated Background */}
        <div class="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full floating delay-100"></div>
        <div class="absolute bottom-10 right-10 w-24 h-24 bg-white/5 rounded-full floating delay-300"></div>
        <div class="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full floating delay-500"></div>
        
        <div class="relative z-10 max-w-4xl mx-auto fade-in delay-100">
          <h3 class="text-4xl md:text-5xl font-bold text-white mb-6">
            🌟 Siap Memulai Petualangan?
          </h3>
          <p class="text-xl md:text-2xl mb-10 text-white/90 max-w-3xl mx-auto leading-relaxed">
            Bergabunglah dengan ribuan petualang lainnya dan ciptakan kenangan tak terlupakan bersama <strong class="text-[#D0797F]">CampRent</strong>
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="/register" class="btn-primary text-white px-10 py-4 rounded-full text-xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 pulse-glow inline-flex items-center justify-center gap-2">
              🚀 Mulai Sekarang
            </a>
            <a href="tel:+628123456789" class="border-2 border-white text-white px-10 py-4 rounded-full text-xl font-bold hover:bg-white hover:text-[#2E365A] hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2">
              📞 Hubungi Kami
            </a>
          </div>
          
          {/* Contact Info */}
          <div id="contact" class="grid grid-cols-1 md:grid-cols-3 gap-8 text-white/80">
            <div class="flex items-center justify-center gap-3">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>+62 812-3456-7890</span>
            </div>
            <div class="flex items-center justify-center gap-3">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>hello@camprent.id</span>
            </div>
            <div class="flex items-center justify-center gap-3">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>Jakarta, Indonesia</span>
            </div>
          </div>
        </div>
        
        {/* Decorative Bottom Border */}
        <div class="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#D0797F] via-[#A801A7] to-[#3F5B8B]"></div>
      </section>

      {/* Footer */}
      <footer class="bg-[#2E365A] text-white py-12 px-6">
        <div class="max-w-screen-xl mx-auto fade-in delay-100">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div class="col-span-1 md:col-span-2">
              <h3 class="text-3xl font-bold text-gradient mb-4">🏕️ CampRent</h3>
              <p class="text-gray-300 mb-6 leading-relaxed max-w-md">
                Platform terpercaya untuk menyewa peralatan camping berkualitas tinggi. 
                Wujudkan petualangan impianmu dengan layanan terbaik dari kami.
              </p>
              <div class="flex gap-4">
                <a href="#" class="w-10 h-10 bg-[#D0797F] rounded-full flex items-center justify-center hover:bg-[#A801A7] transition-colors duration-300">
                  📘
                </a>
                <a href="#" class="w-10 h-10 bg-[#D0797F] rounded-full flex items-center justify-center hover:bg-[#A801A7] transition-colors duration-300">
                  📷
                </a>
                <a href="#" class="w-10 h-10 bg-[#D0797F] rounded-full flex items-center justify-center hover:bg-[#A801A7] transition-colors duration-300">
                  🐦
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 class="font-bold text-lg mb-4">Quick Links</h4>
              <ul class="space-y-2">
                {navigationItems.map((item) => (
                  <li>
                    <button 
                      onClick={() => scrollToSection(item.id)} 
                      class="text-gray-300 hover:text-[#D0797F] transition-colors duration-300"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 class="font-bold text-lg mb-4">Support</h4>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-300 hover:text-[#D0797F] transition-colors duration-300">FAQ</a></li>
                <li><a href="#" class="text-gray-300 hover:text-[#D0797F] transition-colors duration-300">Privacy Policy</a></li>
                <li><a href="#" class="text-gray-300 hover:text-[#D0797F] transition-colors duration-300">Terms of Service</a></li>
                <li><a href="#" class="text-gray-300 hover:text-[#D0797F] transition-colors duration-300">Help Center</a></li>
              </ul>
            </div>
          </div>
          
          <hr class="border-gray-600 my-8" />
          
          <div class="flex flex-col md:flex-row justify-between items-center">
            <p class="text-gray-400 text-sm">© 2024 CampRent. All rights reserved.</p>
            <p class="text-gray-400 text-sm mt-2 md:mt-0">Made with ❤️ for Adventure Lovers</p>
          </div>
        </div>
      </footer>
    </div>
  );
}