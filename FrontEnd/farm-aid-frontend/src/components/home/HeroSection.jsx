import React from 'react';
import { AreaChart, BookOpen } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="bg-[#555d50] text-white min-h-[500px] flex items-center pt-16 pb-24 px-4 overflow-hidden relative">
      <div className="container mx-auto max-w-7xl relative z-10 flex flex-col items-start text-left">
        
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold tracking-wider uppercase mb-6 text-green-100">
          Botswana's Leading Agri-Tech Solution
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6 max-w-3xl">
          The Future of Rural <br />
          <span className="text-[#3bce7b]">Livestock Management</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl font-normal">
          Empowering Botswana's smallholder farmers with offline-first tools for herd tracking, disease management, and direct vet access.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-[#1e9d56] hover:bg-[#128042] text-white px-6 py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors shadow-md text-sm md:text-base">
            Start Managing Herd <AreaChart className="w-5 h-5" />
          </button>
          <button className="bg-transparent hover:bg-white/10 border border-white/30 text-white px-6 py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors text-sm md:text-base">
            Explore Knowledge Base <BookOpen className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-black/20 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default HeroSection;
