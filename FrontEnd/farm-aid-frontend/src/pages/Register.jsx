import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  MapPin, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft, 
  Tractor, 
  CheckCircle2, 
  Phone, 
  Home, 
  Fingerprint,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Briefcase
} from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    // Personal Info
    name: '',
    email: '',
    phone: '',
    omang: '',
    region: 'Central',
    role: 'farmer',
    
    // Farm/Expert Details
    farmName: '',
    livestockType: 'Cattle',
    specialization: '',
    
    // Security
    password: '',
    confirmPassword: '',
    biometrics: false
  });

  const nextStep = () => {
    // Validate current step before proceeding
    if (step === 1) {
      if (!formData.name) {
        setError('Please enter your full name');
        return;
      }
      if (!formData.email) {
        setError('Please enter your email address');
        return;
      }
      if (!formData.email.includes('@')) {
        setError('Please enter a valid email address');
        return;
      }
      if (!formData.phone) {
        setError('Please enter your phone number');
        return;
      }
    }
    if (step === 2) {
      if (formData.role === 'farmer' && !formData.farmName) {
        setError('Please enter your farm name');
        return;
      }
      if (formData.role === 'expert' && !formData.specialization) {
        setError('Please enter your specialization');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(step - 1);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    // Prepare data for API - exactly what the backend expects
    const submitData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role
    };

    console.log('Submitting registration:', { ...submitData, password: '***' });

    const result = await register(submitData);
    
    if (result.success) {
      // Registration successful, redirect to login
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-4 font-sans text-gray-800">
      
      {/* Branding */}
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-[#E35D18] p-2 rounded-xl">
          <Tractor className="w-6 h-6 text-white" />
        </div>
        <span className="font-extrabold text-2xl tracking-tighter text-gray-900">Farm-Aid</span>
      </div>

      <div className="w-full max-w-xl bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
        
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-gray-50 flex">
          <div className={`h-full transition-all duration-500 bg-[#E35D18] ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`}></div>
        </div>

        <div className="p-8 md:p-12">
          
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-500 font-medium">Join the Farm-Aid network today</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#E35D18]">
                    <User className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">Personal Information</h2>
                </div>

                <div className="space-y-4">
                  {/* Role Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest pl-1">
                      I am a
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, role: 'farmer'})}
                        className={`py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all ${
                          formData.role === 'farmer' 
                            ? 'border-[#E35D18] bg-orange-50 text-[#E35D18]' 
                            : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        👨‍🌾 Farmer
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, role: 'expert'})}
                        className={`py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all ${
                          formData.role === 'expert' 
                            ? 'border-[#E35D18] bg-orange-50 text-[#E35D18]' 
                            : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        🧑‍🔬 Expert
                      </button>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe" 
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E35D18]/20 focus:border-[#E35D18] transition-all font-semibold"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com" 
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E35D18]/20 focus:border-[#E35D18] transition-all font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest pl-1">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 font-bold border-r border-gray-200 pr-3">
                          +267
                        </div>
                        <input 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="71234567" 
                          className="w-full pl-20 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E35D18]/20 focus:border-[#E35D18] transition-all font-semibold"
                        />
                      </div>
                    </div>
                    {/* OMANG */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest pl-1">OMANG Number</label>
                      <input 
                        type="text" 
                        name="omang"
                        value={formData.omang}
                        onChange={handleInputChange}
                        placeholder="123456789" 
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E35D18]/20 focus:border-[#E35D18] transition-all font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={nextStep}
                  className="w-full flex justify-center items-center gap-2 bg-[#E35D18] hover:bg-[#c44e13] text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-500/10 transition-all active:scale-[0.98] mt-8"
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Step 2: Role-Specific Details */}
            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#E35D18]">
                    {formData.role === 'farmer' ? <Home className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                  </div>
                  <h2 className="text-xl font-bold">
                    {formData.role === 'farmer' ? 'Farm Details' : 'Professional Details'}
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Region */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest pl-1">Region / District</label>
                    <select 
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E35D18]/20 focus:border-[#E35D18] transition-all font-semibold appearance-none"
                    >
                      <option>Central</option>
                      <option>North-East</option>
                      <option>North-West</option>
                      <option>Southern</option>
                      <option>Kweneng</option>
                      <option>Kgatleng</option>
                    </select>
                  </div>

                  {/* Conditional Fields */}
                  {formData.role === 'farmer' ? (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest pl-1">Farm Name</label>
                        <input 
                          type="text" 
                          name="farmName"
                          value={formData.farmName}
                          onChange={handleInputChange}
                          placeholder="e.g., Segokgo Plains" 
                          className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E35D18]/20 focus:border-[#E35D18] transition-all font-semibold"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest pl-1">Primary Livestock</label>
                        <div className="grid grid-cols-3 gap-3">
                          {['Cattle', 'Sheep', 'Goats'].map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, livestockType: type }))}
                              className={`py-3 px-2 rounded-xl text-xs font-bold border-2 transition-all ${
                                formData.livestockType === type 
                                  ? 'border-[#E35D18] bg-orange-50 text-[#E35D18]' 
                                  : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest pl-1">Specialization</label>
                      <input 
                        type="text" 
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        placeholder="e.g., Veterinary Medicine, Livestock Nutrition" 
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E35D18]/20 focus:border-[#E35D18] transition-all font-semibold"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-8">
                  <button 
                    type="button" 
                    onClick={prevStep}
                    className="flex-1 flex justify-center items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-500 py-4 rounded-2xl font-bold transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" /> Back
                  </button>
                  <button 
                    type="button" 
                    onClick={nextStep}
                    className="flex-1 flex justify-center items-center gap-2 bg-[#E35D18] hover:bg-[#c44e13] text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-500/10 transition-all active:scale-[0.98]"
                  >
                    Next <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Security & Biometrics */}
            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#E35D18]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">Security Setup</h2>
                </div>

                <div className="space-y-4">
                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest pl-1">Set Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••" 
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E35D18]/20 focus:border-[#E35D18] transition-all font-semibold pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest pl-1">Confirm Password</label>
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••" 
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E35D18]/20 focus:border-[#E35D18] transition-all font-semibold"
                    />
                  </div>

                  {/* Biometric Toggle */}
                  <div className="bg-slate-50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between mt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#E35D18] shadow-sm">
                        <Fingerprint className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">Biometric Access</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Offline Security</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, biometrics: !prev.biometrics }))}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.biometrics ? 'bg-[#E35D18]' : 'bg-gray-200'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.biometrics ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Password Hint */}
                  <p className="text-xs text-gray-400 mt-2">
                    Password must be at least 6 characters
                  </p>
                </div>

                <div className="flex gap-3 mt-8">
                  <button 
                    type="button" 
                    onClick={prevStep}
                    className="flex-1 flex justify-center items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-500 py-4 rounded-2xl font-bold transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" /> Back
                  </button>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex-1 flex justify-center items-center gap-2 bg-[#E35D18] hover:bg-[#c44e13] text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-500/10 transition-all active:scale-[0.98] disabled:opacity-70"
                  >
                    {isLoading ? 'Creating Account...' : 'Complete Registration'} 
                    {!isLoading && <CheckCircle2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

          </form>

          {/* Login Link */}
          <div className="mt-10 text-center">
            <p className="text-sm font-medium text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-[#E35D18] font-bold hover:underline">
                Login here
              </Link>
            </p>
          </div>

        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-10 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
        © 2024 Farm-Aid Botswana • Unified Agri-Network
      </div>
    </div>
  );
};

export default Register;