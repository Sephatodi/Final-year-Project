import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

import { 
  Tractor, 
  WifiOff, 
  ShieldCheck, 
  Globe, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  Fingerprint,
  Mail  // ← Add Mail import here
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer');
  const [showPassword, setShowPassword] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    // Validate email format
    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    const result = await login(email, password);
    
    if (result.success) {
      // Small delay to ensure state is updated and data is stored
      setTimeout(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const userRole = storedUser.role;
        
        console.log('Redirecting user with role:', userRole);
        
        // Redirect based on role
        switch (userRole) {
          case 'farmer':
            navigate('/dashboard');
            break;
          case 'veterinarian':
            navigate('/vet-dashboard');
            break;
          case 'admin':
            navigate('/admin-console');
            break;
          default:
            navigate('/dashboard');
        }
      }, 100);
    } else {
      setErrorMsg(result.error || 'Login failed. Please check your credentials.');
    }
    
    setIsLoading(false);
  };

  const handleOfflineLogin = () => {
    // Simple offline fallback - navigate to dashboard with limited features
    setIsLoading(true);
    setTimeout(() => {
      navigate('/dashboard', { state: { offline: true } });
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] flex flex-col justify-center items-center p-4 md:p-8 font-sans">
      
      {/* Main Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl flex flex-col items-stretch md:flex-row overflow-hidden min-h-[700px]">
        
        {/* Left Section - Orange Branding (Botswana Focus) */}
        <div className="bg-[#E35D18] text-white w-full md:w-1/2 p-10 md:p-14 flex flex-col relative overflow-hidden">
          {/* Faint Background pattern */}
          <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{backgroundImage: 'radial-gradient(circle at center, #ffffff 0%, transparent 70%)'}}></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>

          {/* Logo */}
          <div className="flex items-center gap-3 relative z-10 mb-20 md:mb-32">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Tractor className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight">Farm-Aid</span>
          </div>

          {/* Header Text */}
          <div className="relative z-10 flex-grow">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-[1.1] mb-6 shadow-sm">
              Empowering<br/>
              Botswana's Livestock<br/>
              Farmers
            </h1>
            <p className="text-white/90 text-lg md:text-xl leading-relaxed max-w-md">
              Manage your herd, track health, and access markets — even without an internet connection.
            </p>
          </div>

          {/* Feature Badges */}
          <div className="relative z-10 space-y-6 mt-12 md:mt-24">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                <WifiOff className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-lg">Full Offline Capabilities</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-lg">Official Government Integration</span>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col relative bg-white">
          
          {/* Language Selector */}
          <div className="absolute top-8 right-8 flex items-center gap-2 text-gray-500 hover:text-gray-800 cursor-pointer transition-colors">
            <Globe className="w-5 h-5" />
            <span className="text-sm font-medium">Setswana</span>
          </div>

          <div className="mt-12 md:mt-8 flex-grow flex flex-col justify-center max-w-md w-full mx-auto">
            {/* Headers */}
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Farmer Login</h2>
            <p className="text-gray-500 mb-6 text-lg">Enter your credentials to manage your farm</p>

            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['farmer', 'expert', 'admin'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`px-4 py-2 rounded-lg font-semibold capitalize transition-all ${
                      role === r
                        ? 'bg-[#E35D18] text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-bold">
                {errorMsg}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 bg-slate-50 focus:ring-2 focus:ring-[#E35D18] focus:border-transparent focus:bg-white transition-all outline-none"
                    placeholder="farmer@example.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-xl text-gray-900 bg-slate-50 focus:ring-2 focus:ring-[#E35D18] focus:border-transparent focus:bg-white transition-all outline-none"
                    placeholder="••••••••"
                  />
                  <div 
                    className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#E35D18] focus:ring-[#E35D18]" />
                  <span className="text-sm font-medium text-gray-600">Remember me</span>
                </label>
                <a href="#" className="flex items-center gap-1 text-sm font-bold text-[#E35D18] hover:text-[#c44e13] transition-colors">
                  Forgot Password?
                </a>
              </div>

              {/* Demo Credentials Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
                <p className="font-semibold mb-1">Demo Credentials:</p>
                <p>Farmer: farmer@example.com / Test123!</p>
                <p>Expert: expert@example.com / Test123!</p>
                <p>Admin: admin@example.com / Test123!</p>
                <p className="text-xs text-blue-600 mt-1">* Use any email to register a new account</p>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 bg-[#E35D18] hover:bg-[#c44e13] text-white py-4 px-4 rounded-xl font-bold text-lg shadow-md shadow-orange-500/20 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {isLoading ? 'Authenticating...' : 'Login'} {!isLoading && <LogIn className="w-5 h-5" />}
              </button>
            </form>

            <div className="my-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
            </div>

            {/* Alternative Login Methods */}
            <div className="space-y-4">
              {/* Biometric Toggle */}
              <div className="bg-slate-50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between hover:border-gray-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#E35D18]">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Biometric Login</h3>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Use fingerprint or face ID</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setBiometricEnabled(!biometricEnabled)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#E35D18] focus:ring-offset-2 ${biometricEnabled ? 'bg-[#E35D18]' : 'bg-gray-200'}`}
                  role="switch"
                  aria-checked={biometricEnabled}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${biometricEnabled ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
              </div>

              {/* Offline Login Button */}
              <button 
                type="button" 
                onClick={handleOfflineLogin}
                className="w-full flex justify-center items-center gap-2 bg-white border-2 border-orange-100 hover:border-orange-200 hover:bg-orange-50 text-[#E35D18] py-4 px-4 rounded-xl font-bold text-lg transition-all active:scale-[0.98]"
              >
                <WifiOff className="w-5 h-5" strokeWidth={2.5} /> Offline Login
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm font-medium text-gray-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#E35D18] font-bold hover:underline">
                  Register here
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm font-medium text-gray-400">
        © 2024 Farm-Aid Botswana. Serving the livestock industry with pride.
      </div>
    </div>
  );
};

export default Login;