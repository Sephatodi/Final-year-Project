import React, { useState } from 'react';
import { 
  ChevronRight, ChevronLeft, CheckCircle2, MapPin, Smartphone, 
  Zap, Users, PawPrint, DatabaseIcon, AlertCircle, Upload, X,
  GraduationCap, Shield, Phone, Mail, Lock, Globe
} from 'lucide-react';

/**
 * Comprehensive onboarding wizard for new farmers
 * Guides them through: farm setup, livestock registration, knowledge base intro, offline mode
 */
export const FarmerOnboarding = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    farmName: '',
    location: '',
    coordinates: { latitude: '', longitude: '' },
    district: '',
    farmSize: '',
    primaryLivestock: [],
    phoneNumber: '',
    baitsRegistration: '',
    offlineModeEnabled: true
  });

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to Farm-Aid',
      subtitle: 'Your Digital Veterinary Assistant',
      icon: <PawPrint className="w-12 h-12 text-green-600" />,
      description: 'Farm-Aid helps smallholder livestock farmers manage their herds, access veterinary support, and stay informed about diseases and market trends.',
      actions: [
        'Check symptoms with AI diagnostics',
        'Record health events for each animal',
        'Request veterinary consultations',
        'Search offline knowledge base',
        'Report suspected diseases'
      ],
      skipable: false
    },
    {
      id: 'farm-setup',
      title: 'Set Up Your Farm Profile',
      subtitle: 'Basic information about your operation',
      icon: <MapPin className="w-12 h-12 text-blue-600" />,
      fields: [
        {
          name: 'farmName',
          label: 'Farm Name',
          type: 'text',
          placeholder: 'e.g., Kgosi Cattle Ranch',
          required: true
        },
        {
          name: 'district',
          label: 'District',
          type: 'select',
          options: ['Kweneng', 'Central', 'Southern', 'Northeast', 'Northwest', 'Gaborone City'],
          required: true
        },
        {
          name: 'farmSize',
          label: 'Farm Size (hectares)',
          type: 'number',
          placeholder: '0',
          required: true
        },
        {
          name: 'phoneNumber',
          label: 'Phone Number (local)',
          type: 'tel',
          placeholder: '+267 71 234 567',
          required: true
        }
      ]
    },
    {
      id: 'livestock-setup',
      title: 'Tell Us About Your Livestock',
      subtitle: 'What animals do you raise?',
      icon: <PawPrint className="w-12 h-12 text-orange-600" />,
      livestockOptions: [
        { id: 'cattle', label: 'Cattle', emoji: '🐄', recommended: true },
        { id: 'goats', label: 'Goats', emoji: '🐐', recommended: true },
        { id: 'sheep', label: 'Sheep', emoji: '🐑', recommended: false },
        { id: 'pigs', label: 'Pigs', emoji: '🐷', recommended: false },
        { id: 'poultry', label: 'Poultry', emoji: '🐔', recommended: false }
      ],
      description: 'This helps us customize recommendations and alerts for your herd.'
    },
    {
      id: 'baits-intro',
      title: 'BAITS Registration',
      subtitle: 'Legal livestock tracking in Botswana',
      icon: <Shield className="w-12 h-12 text-red-600" />,
      description: 'BAITS (Botswana Agricultural Information and Trade System) is required for livestock movement and sale. Your animals need unique tag numbers.',
      elements: [
        {
          type: 'info',
          title: 'BAITS Tag Format',
          content: 'BW-YYYY-XXXXX (e.g., BW-2024-1234 for cattle born in 2024)'
        },
        {
          type: 'field',
          name: 'baitsRegistration',
          label: 'Have you registered your BAITS account?',
          options: ['Yes', 'No', 'Not sure']
        },
        {
          type: 'action',
          label: 'Learn about BAITS',
          link: '/knowledge-base?search=BAITS'
        }
      ]
    },
    {
      id: 'offline-mode',
      title: 'Offline Mode: Farm Anywhere',
      subtitle: 'Works without internet connection',
      icon: <Zap className="w-12 h-12 text-yellow-600" />,
      description: 'Farm-Aid is designed for remote areas with poor connectivity. All your data is stored locally and syncs automatically when online.',
      features: [
        {
          icon: '📱',
          title: 'Local Storage',
          description: 'All animal records saved on your phone'
        },
        {
          icon: '🔄',
          title: 'Auto Sync',
          description: 'Data syncs when you return to an area with internet'
        },
        {
          icon: '🤖',
          title: 'Offline AI',
          description: 'Symptom checker works completely offline'
        },
        {
          icon: '📚',
          title: 'Downloaded KB',
          description: 'Knowledge base articles available offline'
        }
      ],
      toggle: true
    },
    {
      id: 'features-tour',
      title: 'Key Features You\'ll Use',
      subtitle: 'A quick tour of Farm-Aid',
      icon: <Users className="w-12 h-12 text-purple-600" />,
      features: [
        {
          title: 'Herd Dashboard',
          description: 'View all your animals, track health, and manage vaccinations',
          icon: '📊'
        },
        {
          title: 'AI Symptom Checker',
          description: 'Describe symptoms → AI suggests conditions → Request vet consultation',
          icon: '🩺'
        },
        {
          title: 'Health Records',
          description: 'Log treatments, vaccinations, and health events for each animal',
          icon: '📋'
        },
        {
          title: 'Vet Consultations',
          description: 'Chat with Botswana veterinarians via telehealth',
          icon: '💬'
        },
        {
          title: 'Disease Reporting',
          description: 'Report suspected diseases to DVS with photos and location',
          icon: '🚨'
        },
        {
          title: 'Knowledge Base',
          description: 'Search articles on diseases, treatment, breeding, and market prices',
          icon: '📚'
        }
      ]
    },
    {
      id: 'first-animal',
      title: 'Add Your First Animal',
      subtitle: 'Create a health record for one animal',
      icon: <DatabaseIcon className="w-12 h-12 text-green-600" />,
      description: 'Let\'s get started by registering your first animal. You can add more animals at any time.',
      fields: [
        {
          name: 'species',
          label: 'Species',
          type: 'select',
          options: ['Cattle', 'Goat', 'Sheep'],
          required: true
        },
        {
          name: 'baitsTag',
          label: 'BAITS Tag Number',
          type: 'text',
          placeholder: 'BW-2024-0001',
          required: true,
          help: 'Format: BW-YYYY-XXXXX'
        },
        {
          name: 'breed',
          label: 'Breed',
          type: 'text',
          placeholder: 'e.g., Brahman, Boer',
          required: false
        },
        {
          name: 'gender',
          label: 'Gender',
          type: 'select',
          options: ['Male', 'Female'],
          required: true
        }
      ]
    },
    {
      id: 'complete',
      title: '🎉 You\'re All Set!',
      subtitle: 'Ready to manage your herd',
      icon: <CheckCircle2 className="w-12 h-12 text-green-600" />,
      description: 'Your Farm-Aid account is ready. Navigate to your Dashboard to start tracking your animals and accessing veterinary support.',
      nextSteps: [
        'Go to Dashboard',
        'Add more animals to your herd',
        'Explore the Knowledge Base',
        'Visit Settings to customize alerts'
      ]
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.(formData);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLivestockToggle = (id) => {
    setFormData(prev => ({
      ...prev,
      primaryLivestock: prev.primaryLivestock.includes(id)
        ? prev.primaryLivestock.filter(l => l !== id)
        : [...prev.primaryLivestock, id]
    }));
  };

  const step = steps[currentStep];
  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Progress Bar */}
        <div className="h-1 bg-gray-200">
          <div className="h-full bg-green-600 transition-all" style={{ width: `${progressPercent}%` }} />
        </div>

        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="mt-1">{step.icon}</div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">{step.title}</h2>
              <p className="text-gray-600 text-sm mt-1">{step.subtitle}</p>
            </div>
          </div>
          <button 
            onClick={onSkip}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          
          {/* Welcome Step */}
          {step.id === 'welcome' && (
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">{step.description}</p>
              <div className="grid grid-cols-1 gap-3 mt-6">
                {step.actions.map((action, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Farm Setup Step */}
          {step.id === 'farm-setup' && (
            <div className="space-y-4">
              {step.fields.map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-600">*</span>}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    >
                      <option value="">-- Select {field.label} --</option>
                      {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Livestock Setup Step */}
          {step.id === 'livestock-setup' && (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">{step.description}</p>
              <div className="grid grid-cols-2 gap-3">
                {step.livestockOptions.map(livestock => (
                  <button
                    key={livestock.id}
                    onClick={() => handleLivestockToggle(livestock.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      formData.primaryLivestock.includes(livestock.id)
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="text-3xl mb-2">{livestock.emoji}</div>
                    <div className="font-bold text-gray-900">{livestock.label}</div>
                    {livestock.recommended && (
                      <div className="text-xs text-green-600 font-bold mt-1">POPULAR</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* BAITS Intro Step */}
          {step.id === 'baits-intro' && (
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed mb-4">{step.description}</p>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <div className="font-bold text-blue-900">BAITS Tag Format</div>
                <div className="text-blue-800 text-sm mt-1">BW-YYYY-XXXXX (e.g., BW-2024-1234)</div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Have you registered your BAITS account?
                </label>
                <div className="space-y-2">
                  {['Yes', 'No', 'Not sure'].map(option => (
                    <button
                      key={option}
                      className="w-full p-3 border border-gray-300 rounded-lg text-left hover:bg-gray-50"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Offline Mode Step */}
          {step.id === 'offline-mode' && (
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed mb-4">{step.description}</p>
              <div className="grid grid-cols-2 gap-3">
                {step.features.map((feat, idx) => (
                  <div key={idx} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-2xl mb-2">{feat.icon}</div>
                    <div className="font-bold text-gray-900 text-sm">{feat.title}</div>
                    <div className="text-xs text-gray-600 mt-1">{feat.description}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg mt-4">
                <input
                  type="checkbox"
                  name="offlineModeEnabled"
                  checked={formData.offlineModeEnabled}
                  onChange={handleInputChange}
                  className="w-5 h-5"
                />
                <div>
                  <div className="font-bold text-green-900">Enable Offline Mode</div>
                  <div className="text-sm text-green-700">Recommended for areas with poor internet</div>
                </div>
              </div>
            </div>
          )}

          {/* Features Tour Step */}
          {step.id === 'features-tour' && (
            <div className="grid grid-cols-1 gap-4">
              {step.features.map((feat, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-3xl">{feat.icon}</div>
                  <div>
                    <div className="font-bold text-gray-900">{feat.title}</div>
                    <p className="text-sm text-gray-600 mt-1">{feat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* First Animal Step */}
          {step.id === 'first-animal' && (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">{step.description}</p>
              {step.fields.map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-600">*</span>}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      name={field.name}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                    >
                      <option>-- Select {field.label} --</option>
                      {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <div>
                      <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                      />
                      {field.help && <p className="text-xs text-gray-500 mt-1">{field.help}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Complete Step */}
          {step.id === 'complete' && (
            <div className="text-center space-y-6">
              <p className="text-gray-600 leading-relaxed text-lg">{step.description}</p>
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <div className="font-bold text-green-900 mb-3">Next Steps:</div>
                <ul className="space-y-2 text-left">
                  {step.nextSteps.map((nextStep, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-green-800">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      {nextStep}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer/Navigation */}
        <div className="border-t border-gray-200 px-8 py-4 flex items-center justify-between bg-gray-50">
          <div className="text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition"
            >
              {currentStep === steps.length - 1 ? (
                <>Go to Dashboard</>
              ) : (
                <>Next <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerOnboarding;
