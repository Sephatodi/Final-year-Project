import React from 'react';

const CTASection = () => {
  return (
    <section className="py-16 px-4 pb-24 bg-[#f8fafc]">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-[#111827] bg-gradient-to-br from-[#111827] to-[#1e2e38] rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Ready to digitize your farm?</h2>
            <p className="text-gray-300 md:text-lg max-w-2xl mx-auto mb-10">
              Join thousands of farmers in Botswana using Farm-Aid to increase productivity and health of their herds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#1e9d56] hover:bg-[#128042] text-white px-8 py-3.5 rounded-lg font-semibold transition-colors shadow-lg">
                Get Started for Free
              </button>
              <button className="bg-[#1f2937] hover:bg-[#374151] border border-gray-600 text-white px-8 py-3.5 rounded-lg font-semibold transition-colors">
                Contact Support
              </button>
            </div>
          </div>

          {/* Abstract background shapes */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#1e9d56] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-400 rounded-full blur-[80px] opacity-10 pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
