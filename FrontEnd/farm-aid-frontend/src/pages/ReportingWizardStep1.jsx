import React, { useState } from 'react';
import { WifiOff, MapPin, Edit3, AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const ReportingWizardStep1 = () => {
  const [selectedSpecies, setSelectedSpecies] = useState('cattle');

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col">
      <Navbar 
        title="Disease Reporting" 
        subtitle="Step 1: Location & Animal" 
        showBack={true}
        backTo="/vet-dashboard"
      />
      
      <div className="flex-1 pb-24 pt-8">

      <div className="max-w-3xl mx-auto px-6 mt-8">
        
        {/* Progress Bar */}
        <div className="flex items-center justify-center gap-4 mb-8">
           <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-[#00dd00] text-white flex items-center justify-center font-bold text-sm shadow-sm ring-4 ring-[#e6ffe6]">1</div>
              <span className="text-[10px] font-bold text-gray-800">Location & Animal</span>
           </div>
           
           <div className="w-24 h-px bg-gray-200 -mt-4"></div>
           
           <div className="flex flex-col items-center gap-1 opacity-50">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm">2</div>
              <span className="text-[10px] font-bold text-gray-500">Symptoms & AI</span>
           </div>

           <div className="w-24 h-px bg-gray-200 -mt-4"></div>

           <div className="flex flex-col items-center gap-1 opacity-50">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm">3</div>
              <span className="text-[10px] font-bold text-gray-500">Submission</span>
           </div>
        </div>

        {/* Offline Banner */}
        <div className="bg-[#f0fbf0] border border-[#d3f4d3] rounded-xl p-4 mb-8 flex justify-between items-center shadow-sm">
           <div className="flex items-start gap-3">
              <div className="mt-0.5"><WifiOff className="w-5 h-5 text-[#00aa00]" /></div>
              <div>
                 <h4 className="font-bold text-[#006600] text-sm leading-tight mb-0.5">Offline Mode Active</h4>
                 <p className="text-[#008800] text-xs">Reports will sync automatically (E tla itlhaeletsa ka bo yona)</p>
              </div>
           </div>
           <div className="flex items-center gap-1.5 bg-white border border-[#d3f4d3] px-2 py-1 rounded text-[10px] font-bold text-[#00aa00] tracking-wider uppercase">
              ACTIVE <div className="w-1.5 h-1.5 rounded-full bg-[#00dd00] animate-pulse"></div>
           </div>
        </div>

        {/* Page Title */}
        <div className="mb-6">
           <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Step 1: Location & Animal</h1>
           <p className="text-[#64748b] text-sm font-medium">Lefelo le Loruo</p>
        </div>

        <form className="space-y-6">
           
           {/* Location Card */}
           <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                 <div className="text-[#00dd00]"><MapPin fill="currentColor" className="w-5 h-5" /></div>
                 Location (Lefelo)
              </h2>
              
              <div className="relative w-full h-[180px] bg-[#dbeafe] rounded-xl overflow-hidden mb-4 border border-gray-200 flex flex-col items-center justify-center">
                 {/* Map Background Mock */}
                 <div className="absolute inset-0 opacity-40 mix-blend-multiply" style={{ backgroundImage: "url('https://maps.googleapis.com/maps/api/staticmap?center=-24.6282,25.9231&zoom=7&size=800x400&maptype=terrain&key=YOUR_KEY_HERE')"}}></div>
                 
                 {/* Reticle */}
                 <div className="relative z-10 flex flex-col items-center">
                    <div className="w-12 h-12 flex items-center justify-center text-[#00cc00]">
                       <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="6"></circle><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line></svg>
                    </div>
                    <div className="bg-gray-900/10 backdrop-blur-md font-bold text-gray-800 text-xs px-3 py-1.5 rounded-md mt-2">GPS Detected: 24.6282° S, 25.9231° E</div>
                 </div>
              </div>
              
              <button type="button" className="w-full border-2 border-dashed border-gray-200 bg-gray-50 text-gray-600 font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition">
                 Edit Location Manually (Baakanya Lefelo)
              </button>
           </div>

           {/* Species Card */}
           <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-6">
                 <div className="text-[#00dd00]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a4 4 0 00-4 4v2H6a4 4 0 00-4 4v6a4 4 0 004 4h12a4 4 0 004-4v-6a4 4 0 00-4-4h-2V6a4 4 0 00-4-4zm0 2a2 2 0 012 2v2h-4V6a2 2 0 012-2zM6 10h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2z"/></svg></div>
                 Species (Mofuta wa Loruo)
              </h2>

              <div className="grid grid-cols-3 gap-4 mb-6">
                 {/* Cattle */}
                 <button 
                   type="button" 
                   onClick={() => setSelectedSpecies('cattle')}
                   className={`relative border-2 rounded-xl p-4 flex flex-col items-center justify-center transition ${selectedSpecies === 'cattle' ? 'border-[#00cc00] bg-[#f0fbf0]' : 'border-gray-100 bg-white hover:border-gray-300'}`}
                 >
                    {selectedSpecies === 'cattle' && <div className="absolute top-2 right-2 w-3 h-3 bg-[#00cc00] rounded-full ring-4 ring-white"></div>}
                    {selectedSpecies !== 'cattle' && <div className="absolute top-2 right-2 w-3 h-3 border-2 border-gray-200 rounded-full"></div>}
                    <div className="mb-2 text-gray-800"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M14 6l-4 4M2 13h20M9 22V13M15 22V13M5 3a2 2 0 012-2h1m4 0h1a2 2 0 012 2v2H5V3z"></path></svg></div>
                    <span className="font-bold text-sm text-gray-900 leading-tight">Cattle</span>
                    <span className="text-[10px] text-gray-400">Dikgomo</span>
                 </button>

                 {/* Goat */}
                 <button 
                   type="button" 
                   onClick={() => setSelectedSpecies('goat')}
                   className={`relative border-2 rounded-xl p-4 flex flex-col items-center justify-center transition ${selectedSpecies === 'goat' ? 'border-[#00cc00] bg-[#f0fbf0]' : 'border-gray-100 bg-white hover:border-gray-300'}`}
                 >
                    {selectedSpecies === 'goat' && <div className="absolute top-2 right-2 w-3 h-3 bg-[#00cc00] rounded-full ring-4 ring-white"></div>}
                    {selectedSpecies !== 'goat' && <div className="absolute top-2 right-2 w-3 h-3 border-2 border-gray-200 rounded-full"></div>}
                    <div className="mb-2 text-gray-800"><svg className="w-8 h-8 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 14l3-3m0 0l3 3m-3-3v8M17 14l3-3m0 0l3 3m-3-3v8M2 10h20"></path></svg></div>
                    <span className="font-bold text-sm text-gray-900 leading-tight">Goat</span>
                    <span className="text-[10px] text-gray-400">Dipudi</span>
                 </button>

                 {/* Sheep */}
                 <button 
                   type="button" 
                   onClick={() => setSelectedSpecies('sheep')}
                   className={`relative border-2 rounded-xl p-4 flex flex-col items-center justify-center transition ${selectedSpecies === 'sheep' ? 'border-[#00cc00] bg-[#f0fbf0]' : 'border-gray-100 bg-white hover:border-gray-300'}`}
                 >
                    {selectedSpecies === 'sheep' && <div className="absolute top-2 right-2 w-3 h-3 bg-[#00cc00] rounded-full ring-4 ring-white"></div>}
                    {selectedSpecies !== 'sheep' && <div className="absolute top-2 right-2 w-3 h-3 border-2 border-gray-200 rounded-full"></div>}
                    <div className="mb-2 text-gray-800"><svg className="w-8 h-8 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5 7 13 7 13s7-8 7-13c0-3.87-3.13-7-7-7z"></path><circle cx="12" cy="9" r="3"></circle></svg></div>
                    <span className="font-bold text-sm text-gray-900 leading-tight">Sheep</span>
                    <span className="text-[10px] text-gray-400">Dinku</span>
                 </button>
              </div>

              <div>
                 <label className="block text-sm font-bold text-gray-800 mb-2">Number of affected animals (Palo e e amegileng)</label>
                 <input type="number" placeholder="0" className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00cc00] font-bold text-gray-800" />
              </div>
           </div>

           {/* Notifiable Disease Warning Card */}
           <div className="bg-[#fff0f0] border border-red-200 rounded-xl p-5 shadow-sm">
             <div className="flex gap-4 items-start">
               <div className="mt-0.5"><AlertTriangle className="w-6 h-6 text-red-600" fill="currentColor" /></div>
               <div>
                  <h3 className="font-bold text-red-800 text-sm mb-1">Notifiable Disease? (Bolwetse jo bo kotsi?)</h3>
                  <p className="text-red-700 text-xs mb-4">If you suspect Foot & Mouth Disease (FMD), report to DVS immediately.</p>
                  <button type="button" className="bg-[#e62e2d] hover:bg-red-700 text-white text-xs font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 transition shadow-sm">
                    <ShieldAlert className="w-4 h-4" /> Report to DVS (Bega kwa go ba Veterinary)
                  </button>
               </div>
             </div>
           </div>

        </form>

        {/* Form Actions Footer */}
        <div className="mt-8 flex gap-4">
           <button type="button" className="w-1/3 bg-[#e2e8f0] hover:bg-[#cbd5e1] text-gray-700 font-bold py-4 rounded-xl transition">
              Save Draft
           </button>
           <button type="button" className="w-2/3 bg-[#00dd00] hover:bg-[#00cc00] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-[0_4px_14px_rgba(0,221,0,0.3)]">
              Next: Symptoms & AI <ArrowRight className="w-5 h-5" strokeWidth="2.5" />
           </button>
        </div>

      </div>
      </div>
    </div>
  );
};

export default ReportingWizardStep1;
