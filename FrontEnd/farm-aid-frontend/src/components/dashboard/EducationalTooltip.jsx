import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

export const EducationalTooltip = ({ 
  title, 
  content, 
  position = 'top',
  children 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!content) {
    return children || null;
  }

  return (
    <div className="relative group">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-help"
      >
        {children || <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />}
      </div>

      {isOpen && (
        <div className={`absolute z-50 w-64 p-4 bg-gray-900 text-white text-sm rounded-lg shadow-lg pointer-events-auto
          ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} 
          left-1/2 transform -translate-x-1/2
        `}>
          {title && <p className="font-bold mb-2">{title}</p>}
          <p className="text-gray-200">{content}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};


 import {BookOpen, Users, TrendingUp, Shield, WifiOff, Phone, 
  Video, Heart, DollarSign, GraduationCap, Target, Globe,
  ChevronRight, ChevronDown, Play, FileText, Download,
  Award, BarChart3, MapPin, Clock, CheckCircle2, AlertCircle,
  MessageCircle, Calendar, Database, Cloud, Smartphone, Zap,
  Mail, HelpCircle, ArrowRight, User, Check, Filter
} from 'lucide-react';

const EducationalDashboard = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const impactStats = {
    farmersReached: 12500,
    animalsTracked: 187000,
    consultationsCompleted: 3420,
    diseaseReports: 1256,
    offlineSessions: 8920,
    reductionInLosses: 35
  };

  const tutorials = [
    {
      id: 'getting-started',
      title: 'Getting Started with Farm-Aid',
      icon: <GraduationCap className="w-6 h-6" />,
      duration: '5 min',
      level: 'Beginner',
      steps: [
        'Download and install the Farm-Aid app from the Google Play Store or App Store',
        'Create your account using your phone number or email address',
        'Complete your farm profile with location and livestock details',
        'Add your first animal using BAITS tag number',
        'Explore the dashboard and familiarize yourself with key features'
      ]
    },
    {
      id: 'offline-mode',
      title: 'Using Offline Mode in Remote Areas',
      icon: <WifiOff className="w-6 h-6" />,
      duration: '4 min',
      level: 'Beginner',
      steps: [
        'The app automatically works offline - no setup needed!',
        'All your animal records are stored locally on your phone',
        'You can add, edit, and delete animals even without internet',
        'Health records and disease reports are saved locally',
        'When you return to an area with internet, everything syncs automatically'
      ]
    },
    {
      id: 'symptom-checker',
      title: 'Using the AI Symptom Checker',
      icon: <Heart className="w-6 h-6" />,
      duration: '6 min',
      level: 'Intermediate',
      steps: [
        'Open the Symptom Checker from the main menu',
        'Select the species of your sick animal (Cattle/Goat/Sheep)',
        'Choose the affected body area (Mouth, Feet, Skin, etc.)',
        'Select all symptoms you observe from the list',
        'Take a clear photo of the affected area (optional but helpful)',
        'Click "Analyze" - AI will provide possible diagnoses with confidence scores',
        'Review treatment recommendations and decide next steps'
      ]
    },
    {
      id: 'telehealth',
      title: 'Consulting a Veterinarian',
      icon: <Video className="w-6 h-6" />,
      duration: '7 min',
      level: 'Intermediate',
      steps: [
        'Go to the Telehealth section from the main navigation',
        'Click "New Consultation" and describe your animal\'s condition',
        'Upload photos of your sick animal for better diagnosis',
        'Select urgency level (Normal or Urgent)',
        'Submit your request - a veterinarian will be notified',
        'Receive responses via chat, audio, or video call',
        'Follow the treatment plan provided by the vet'
      ]
    },
    {
      id: 'disease-reporting',
      title: 'Reporting Notifiable Diseases',
      icon: <AlertCircle className="w-6 h-6" />,
      duration: '5 min',
      level: 'Advanced',
      steps: [
        'Immediately use the "Report Disease" feature for suspected FMD, Anthrax, or Rabies',
        'Your GPS location will be automatically detected',
        'Take clear photos of affected animals (mouth, feet, skin lesions)',
        'Describe the symptoms and number of affected animals',
        'Submit report - it goes directly to the Department of Veterinary Services',
        'Follow movement restriction instructions until DVS contacts you'
      ]
    },
    {
      id: 'data-sync',
      title: 'Understanding Data Sync & Security',
      icon: <Cloud className="w-6 h-6" />,
      duration: '4 min',
      level: 'Beginner',
      steps: [
        'All your data is encrypted both on your phone and in transit',
        'When online, data syncs automatically to secure government servers',
        'You can see sync status in the bottom left of your dashboard',
        'Pending changes are shown with a count badge',
        'Never lose data - everything is saved locally first, then backed up to the cloud'
      ]
    }
  ];

  const successStories = [
    {
      farmer: 'Mma Kedisang',
      location: 'Ngamiland',
      quote: 'Farm-Aid saved my entire herd during the FMD outbreak. The symptom checker alerted me early, and I was able to isolate affected animals before the disease spread.',
      imagePlaceholder: '👩‍🌾',
      result: 'Saved 45 cattle from FMD'
    },
    {
      farmer: 'Rre Modise',
      location: 'Kweneng',
      quote: 'Living in a remote area with no vet nearby used to be a nightmare. Now I can consult with experts through the app. It\'s like having a vet in my pocket!',
      imagePlaceholder: '👨‍🌾',
      result: 'Reduced animal deaths by 60%'
    },
    {
      farmer: 'Mma Sebina',
      location: 'Central District',
      quote: 'I learned about heartwater prevention through the knowledge base. Vaccinated my goats on time, and not a single one got sick this season.',
      imagePlaceholder: '👩‍🌾',
      result: '100% survival rate this season'
    }
  ];

  const impactMetrics = [
    { label: 'Farmers Reached', value: '12,500+', icon: <Users className="w-5 h-5" />, color: 'bg-blue-500' },
    { label: 'Animals Tracked', value: '187,000+', icon: <Database className="w-5 h-5" />, color: 'bg-green-500' },
    { label: 'Vet Consultations', value: '3,420+', icon: <MessageCircle className="w-5 h-5" />, color: 'bg-purple-500' },
    { label: 'Diseases Reported', value: '1,256', icon: <AlertCircle className="w-5 h-5" />, color: 'bg-red-500' },
    { label: 'Offline Sessions', value: '8,920+', icon: <WifiOff className="w-5 h-5" />, color: 'bg-amber-500' },
    { label: 'Loss Reduction', value: '35%', icon: <TrendingUp className="w-5 h-5" />, color: 'bg-emerald-500' }
  ];

  const faqs = [
    {
      q: 'Is Farm-Aid really free for farmers?',
      a: 'Yes! Farm-Aid is completely free for all farmers in Botswana. The platform is funded through government agricultural support programs and international development grants.'
    },
    {
      q: 'Do I need internet to use the app?',
      a: 'No! Farm-Aid is designed as an offline-first app. Most features work completely offline, including adding animals, recording health events, checking symptoms, and accessing the knowledge base.'
    },
    {
      q: 'Is my farm data secure?',
      a: 'Absolutely. All data is encrypted end-to-end. Your information is stored securely on government-approved servers and is only accessible to authorized personnel like your assigned veterinarians.'
    },
    {
      q: 'How do I get help if I have problems?',
      a: 'You can contact our support team through the app (Help section), call our toll-free number 0800-600-777, or visit your local agricultural extension office.'
    },
    {
      q: 'Can I use Farm-Aid without a smartphone?',
      a: 'While the full app requires a smartphone, we also have an SMS service that provides disease alerts and basic information to any mobile phone.'
    }
  ];

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      
      {/* Hero Section - Impact Statement */}
      <section className="bg-gradient-to-r from-green-700 to-green-800 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-6">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-semibold">Making a Difference in Botswana</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Transforming Livestock Farming
          </h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
            Farm-Aid is empowering Botswana's smallholder farmers with accessible, offline-first technology, 
            reducing livestock losses, improving animal health, and strengthening food security.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {impactMetrics.slice(0, 4).map((metric, idx) => (
              <div key={idx} className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {metric.icon}
                  <span className="text-2xl font-bold">{metric.value}</span>
                </div>
                <p className="text-sm text-green-100">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section - Detailed */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">The Impact We're Making</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Since our launch, Farm-Aid has been transforming the way Botswana's farmers manage their livestock.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Economic Impact */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Economic Impact</h3>
            <p className="text-gray-600 mb-4">
              Farmers using Farm-Aid report an average <strong className="text-green-600">35% reduction in livestock losses</strong> 
              due to early disease detection and timely veterinary intervention.
            </p>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-sm text-green-800">
                💰 Estimated P15M saved in preventable livestock losses across Botswana
              </p>
            </div>
          </div>

          {/* Social Impact */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Social Impact</h3>
            <p className="text-gray-600 mb-4">
              Over <strong className="text-blue-600">12,500 farmers</strong> now have access to veterinary advice 
              regardless of their location, reducing the urban-rural healthcare gap.
            </p>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                👨‍🌾 Average travel distance saved: 85km per consultation
              </p>
            </div>
          </div>

          {/* Environmental Impact */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Environmental Impact</h3>
            <p className="text-gray-600 mb-4">
              Reduced unnecessary travel means lower carbon emissions. Digital record-keeping has saved 
              <strong className="text-amber-600"> thousands of paper records</strong>.
            </p>
            <div className="bg-amber-50 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                🌍 Reduced CO₂ emissions by an estimated 45 tons
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real farmers, real results. Hear what the Farm-Aid community has to say.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {successStories.map((story, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
                    {story.imagePlaceholder}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{story.farmer}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      {story.location}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic mb-4">"{story.quote}"</p>
                <div className="bg-green-50 rounded-lg p-2 text-center">
                  <span className="text-sm font-semibold text-green-700">✨ {story.result}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tutorials Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Learn How to Use Farm-Aid</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Step-by-step guides to help you make the most of every feature.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial) => (
            <div key={tutorial.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div 
                className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection(tutorial.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                      {tutorial.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{tutorial.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {tutorial.duration}
                        </span>
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{tutorial.level}</span>
                      </div>
                    </div>
                  </div>
                  {expandedSection === tutorial.id ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                </div>
              </div>
              
              {expandedSection === tutorial.id && (
                <div className="px-5 pb-5 pt-0 border-t border-gray-100 bg-gray-50">
                  <div className="mt-4 space-y-3">
                    {tutorial.steps.map((step, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-green-600">{idx + 1}</span>
                        </div>
                        <p className="text-sm text-gray-700">{step}</p>
                      </div>
                    ))}
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <button className="text-orange-600 text-sm font-semibold flex items-center gap-1 hover:text-orange-700">
                        <Play className="w-4 h-4" /> Watch Video Tutorial
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Video Tutorial Highlight */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-6">
            <Play className="w-4 h-4" />
            <span className="text-sm font-semibold">Featured Tutorial</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Complete Farm-Aid Walkthrough</h2>
          <p className="text-orange-100 mb-8">
            Watch this comprehensive video guide to master all Farm-Aid features in under 15 minutes.
          </p>
          <div className="bg-black/20 rounded-2xl p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-105 transition-transform">
                <Play className="w-10 h-10 text-orange-500 ml-1" />
              </div>
              <p className="font-semibold">▶️ Watch Full Tutorial (14:32)</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600">
            Got questions? We've got answers. Here's what farmers commonly ask.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button className="bg-orange-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors">
            Ask a Question
          </button>
        </div>
      </section>

      {/* Download Resources */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Download Resources</h2>
          <p className="text-gray-600 mb-8">
            Get printable guides and training materials for offline use.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white border border-gray-200 px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-md transition">
              <FileText className="w-5 h-5 text-orange-500" />
              <span>User Manual (PDF)</span>
              <Download className="w-4 h-4 text-gray-400" />
            </button>
            <button className="bg-white border border-gray-200 px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-md transition">
              <FileText className="w-5 h-5 text-orange-500" />
              <span>Quick Start Guide</span>
              <Download className="w-4 h-4 text-gray-400" />
            </button>
            <button className="bg-white border border-gray-200 px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-md transition">
              <FileText className="w-5 h-5 text-orange-500" />
              <span>Disease Reference Card</span>
              <Download className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </section>

      {/* Support Footer */}
      <section className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-xl font-bold mb-4">Need Personalized Help?</h3>
          <p className="text-gray-400 mb-6">
            Our support team is available Monday-Friday, 8am-5pm.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-2">
              <Phone className="w-5 h-5 text-green-400" />
              <span>Toll Free: 0800-600-777</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-2">
              <MessageCircle className="w-5 h-5 text-green-400" />
              <span>WhatsApp: +267 71 234 567</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-2">
              <Mail className="w-5 h-5 text-green-400" />
              <span>support@farmaid.bw</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EducationalDashboard;
