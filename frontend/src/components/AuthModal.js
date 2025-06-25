import React, { useState, useEffect, useRef } from 'react';
import { X, User, Lock, Mail, Loader2, ArrowRight, UserPlus, LogIn, Globe, FacebookIcon, GithubIcon, Upload, Camera } from 'lucide-react';
import UserAvatar from './UserAvatar';
import { useUser } from './UserContext';

const AuthModal = ({ open, onClose, initialMode = 'signin' }) => {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ email: '', password: '', name: '', profilePhoto: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const { login } = useUser();

  useEffect(() => {
    if (!open) {
      // Reset form when modal closes
      setForm({ email: '', password: '', name: '', profilePhoto: null });
      setPreviewUrl(null);
      setError('');
      setSuccess('');
    }
  }, [open]);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      setForm({ ...form, profilePhoto: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Here you would typically:
      // 1. Create FormData for file upload
      // 2. Send to your backend
      // 3. Handle the response
      
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(mode === 'signin' ? 'Welcome back!' : 'Account created! Please check your email.');
      
      // Store demo user data
      const userData = {
        name: form.name,
        email: form.email,
        profilePhoto: previewUrl,
        isOnline: true
      };
      login(userData);
      
      // Close modal after success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setForm({ email: '', password: '', name: '', profilePhoto: null });
    setPreviewUrl(null);
    setError('');
    setSuccess('');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xl animate-fade-in">
      <div className="glass rounded-3xl shadow-2xl max-w-md w-full p-0 sm:p-10 relative animate-scale-in flex flex-col">
        {/* Header */}
        <button 
          className="absolute top-6 right-6 text-neutral-400 hover:text-primary-500 transition-colors" 
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-8 mt-4">
          <div className="inline-flex items-center space-x-3 mb-4 animate-slide-up">
            {mode === 'signin' ? <LogIn className="h-7 w-7 text-primary-600" /> : <UserPlus className="h-7 w-7 text-secondary-600" />}
            <h2 className="text-3xl font-bold text-primary-800">
              {mode === 'signin' ? 'Sign In to HealMind AI' : 'Create Your Account'}
            </h2>
          </div>
          <p className="text-neutral-700 text-md font-medium animate-fade-in">
            {mode === 'signin' ? 'Welcome back! Please sign in to continue.' : 'Join us and start your healing journey.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <>
              {/* Profile Photo Upload */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    {previewUrl ? (
                      <img 
                        src={previewUrl} 
                        alt="Profile preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                  >
                    <Upload className="w-6 h-6 text-white" />
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <p className="text-sm text-neutral-500">Click to upload profile photo</p>
              </div>

              {/* Name Input */}
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInput}
                  placeholder="Full Name"
                  className="w-full p-4 pl-12 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/90 text-neutral-900 font-semibold transition-all shadow-inner placeholder-neutral-500"
                  required
                  autoFocus
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-500" />
              </div>
            </>
          )}

          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleInput}
              placeholder="Email Address"
              className="w-full p-4 pl-12 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/90 text-neutral-900 font-semibold transition-all shadow-inner placeholder-neutral-500"
              required
              autoFocus={mode === 'signin'}
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-500" />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleInput}
              placeholder="Password"
              className="w-full p-4 pl-12 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/90 text-neutral-900 font-semibold transition-all shadow-inner placeholder-neutral-500"
              required
            />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-500" />
          </div>

          {error && (
            <div className="text-red-500 text-sm animate-fade-in bg-red-50 p-3 rounded-xl">
              {error}
            </div>
          )}
          
          {success && (
            <div className="text-green-600 text-sm animate-fade-in bg-green-50 p-3 rounded-xl">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 group disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            )}
            <span>{mode === 'signin' ? 'Sign In' : 'Sign Up'}</span>
          </button>
        </form>

        {/* Social Login */}
        <div className="flex items-center justify-center space-x-4 mt-8">
          <button className="p-3 rounded-xl bg-neutral-100 hover:bg-primary-50 transition-all shadow-inner">
            <Globe className="h-5 w-5 text-primary-500" />
          </button>
          <button className="p-3 rounded-xl bg-neutral-100 hover:bg-primary-50 transition-all shadow-inner">
            <FacebookIcon className="h-5 w-5 text-primary-500" />
          </button>
          <button className="p-3 rounded-xl bg-neutral-100 hover:bg-primary-50 transition-all shadow-inner">
            <GithubIcon className="h-5 w-5 text-primary-500" />
          </button>
        </div>

        {/* Switch Mode */}
        <div className="text-center mt-8 animate-fade-in">
          {mode === 'signin' ? (
            <span className="text-neutral-700">
              Don't have an account?{' '}
              <button 
                className="text-primary-600 font-semibold hover:underline transition-colors" 
                onClick={switchMode}
              >
                Sign Up
              </button>
            </span>
          ) : (
            <span className="text-neutral-700">
              Already have an account?{' '}
              <button 
                className="text-primary-600 font-semibold hover:underline transition-colors" 
                onClick={switchMode}
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 