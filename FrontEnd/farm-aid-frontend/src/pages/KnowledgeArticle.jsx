import React from 'react';
import { Database, Cpu, Smartphone, CheckSquare } from 'lucide-react';

const KnowledgeArticle = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans pb-16">
      <header className="bg-[#fafafa] border-b border-gray-200 py-4 px-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
           <div className="bg-[#ea580c] p-1.5 rounded-lg">
             <Database className="w-5 h-5 text-white" />
           </div>
           <h1 className="font-bold text-xl text-gray-900 tracking-tight">Smart Diagnostics</h1>
        </div>
        <nav className="flex items-center gap-6">
          <a href="#architecture" className="text-sm font-bold text-gray-800">System Architecture</a>
          <a href="#validation" className="text-sm font-medium text-gray-500 hover:text-gray-800">Validation Data</a>
          <button className="bg-orange-100 text-[#ea580c] w-8 h-8 rounded-full flex items-center justify-center hover:bg-orange-200 transition">
             <span className="font-serif font-bold italic text-sm">i</span>
          </button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-8 pt-16">
         <div className="max-w-4xl mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827] tracking-tighter mb-4">
              Smart Diagnostics: <span className="text-[#ea580c]">How the AI Works</span>
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed font-medium">
              Our edge-computing AI models are trained on massive clinical datasets and optimized for real-time field use, providing veterinary-grade insights without requiring an internet connection.
            </p>
         </div>

         {/* Process Cards */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
               <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                 <Database className="w-8 h-8 text-[#ea580c]" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-6">1. Training the Model</h3>
               
               <div className="w-full flex justify-between gap-2 mb-6">
                 <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex-1">
                    <div className="text-[#ea580c] text-sm font-bold mb-1">FMD</div>
                 </div>
                 <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex-1">
                    <div className="text-green-600 text-sm font-bold mb-1">OK</div>
                 </div>
               </div>

               <p className="text-sm text-gray-500 font-medium leading-relaxed">
                 Proprietary dataset of <strong className="text-gray-800">25,000+</strong> annotated images feeding into a deep neural network.
               </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
               <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                 <Cpu className="w-8 h-8 text-[#ea580c]" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-6">2. Optimization</h3>
               
               <div className="w-full flex justify-around items-center gap-2 mb-6 border-2 border-dashed border-orange-200 rounded-xl p-4 bg-orange-50/30">
                 <div className="text-center font-bold text-gray-700">1.2GB</div>
                 <div className="text-gray-400">&rarr;</div>
                 <div className="bg-[#ea580c] text-white rounded-lg p-2 font-bold shadow-md shadow-orange-200">30MB</div>
               </div>

               <p className="text-sm text-gray-500 font-medium leading-relaxed">
                 <strong className="text-gray-800">Quantization</strong> reduces model size by <strong className="text-[#ea580c]">75%</strong> while maintaining 98% accuracy.
               </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
               <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                 <Smartphone className="w-8 h-8 text-[#ea580c]" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-4">3. On-Device Inference</h3>
               
               <div className="bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-6 flex items-center gap-1">
                 <CheckSquare className="w-3 h-3" /> No Internet Required
               </div>

               <p className="text-sm text-gray-500 font-medium leading-relaxed">
                 Powered by <strong className="text-gray-800">TensorFlow Lite</strong> for local processing, ensuring privacy and zero latency.
               </p>
            </div>
         </div>

         {/* Disease Coverage Table */}
         <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
               <div className="bg-[#ea580c] p-1 rounded"><CheckSquare className="w-5 h-5 text-white" /></div>
               Priority Disease Coverage
            </h2>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-[#fafafa] border-b border-gray-100">
                     <tr>
                        <th className="py-4 px-6 text-xs font-bold text-gray-800 uppercase tracking-widest">Disease Type</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-800 uppercase tracking-widest">Confidence Score</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     <tr className="hover:bg-gray-50/50">
                        <td className="py-5 px-6 font-bold text-gray-900">Foot & Mouth Disease (FMD)</td>
                        <td className="py-5 px-6 font-bold text-gray-900">98%</td>
                     </tr>
                     <tr className="hover:bg-gray-50/50">
                        <td className="py-5 px-6 font-bold text-gray-900">Heartwater</td>
                        <td className="py-5 px-6 font-bold text-gray-900">92%</td>
                     </tr>
                     <tr className="hover:bg-gray-50/50">
                        <td className="py-5 px-6 font-bold text-gray-900">Tick-borne Diseases</td>
                        <td className="py-5 px-6 font-bold text-gray-900">89%</td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </main>
    </div>
  );
};

export default KnowledgeArticle;
