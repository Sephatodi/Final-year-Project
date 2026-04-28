import React from 'react';
import { Activity, Stethoscope, Languages, CheckCircle2 } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Activity className="w-6 h-6 text-[#1e9d56]" />,
      title: "Herd Tracking",
      description: "Digital records for births, vaccinations, and expenses. Keep your history safe and generate reports instantly, with or without data.",
      bullets: ["Automated pedigree mapping", "Expense monitoring"],
    },
    {
      icon: <Stethoscope className="w-6 h-6 text-[#1e9d56]" />,
      title: "Expert Advice",
      description: "Secure messaging and image sharing with licensed vets. Get remote diagnosis and treatment plans for your livestock.",
      bullets: ["Photo-based consultations", "Direct messaging history"],
    },
    {
      icon: <Languages className="w-6 h-6 text-[#1e9d56]" />,
      title: "Localized Support",
      description: "Accessibility is key. All management tools and educational content available in both English and Setswana.",
      bullets: ["Setswana audio instructions", "Localized best practices"],
    }
  ];

  return (
    <section id="features" className="py-24 bg-[#f8fafc] px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a202c] mb-4">Built for the Modern Farmer</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Everything you need to thrive in rural environments, designed to work perfectly even without an active internet connection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-[#1a202c] mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {feature.description}
              </p>
              <ul className="space-y-3">
                {feature.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2 text-sm text-gray-500 font-medium tracking-tight">
                    <CheckCircle2 className="w-4 h-4 text-[#1e9d56] mt-0.5 shrink-0" />
                    {bullet}
                  </li>
                ))}
              </ul>
              
              {/* Decorative subtle border top */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1e9d56] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
