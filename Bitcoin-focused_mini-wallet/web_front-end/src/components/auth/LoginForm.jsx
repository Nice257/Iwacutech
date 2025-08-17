import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validateRequired } from '../../utils/validation';
import Button from '../common/Button';
import Input from '../common/Input';
import LoadingSpinner from '../common/LoadingSpinner';

const LoginForm = ({ onSwitchToRegister }) => {
  const { login, error, isLoading, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
    
    // Clear auth error
    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const errors = {};
    
    errors.email = validateEmail(formData.email);
    errors.password = validateRequired(formData.password, 'Password');
    
    // Remove null errors
    Object.keys(errors).forEach(key => {
      if (errors[key] === null) delete errors[key];
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const result = await login(formData.email, formData.password);
    // Navigation will be handled by AuthWrapper
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Demo credentials info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800 font-medium">Demo Credentials:</p>
        <p className="text-xs text-blue-700">Email: demo@wallet.com</p>
        <p className="text-xs text-blue-700">Password: Password123!</p>
      </div>

      {/* Email field */}
      <Input
        name="email"
        type="email"
        label="Email Address"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        error={formErrors.email}
        icon={Mail}
        required
        autoComplete="email"
      />

      {/* Password field */}
      <div className="relative">
        <Input
          name="password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={formErrors.password}
          icon={Lock}
          required
          autoComplete="current-password"
        />
        <button
          type="button"
          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      {/* Auth error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Submit button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isLoading}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" color="white" />
            <span className="ml-2">Signing in...</span>
          </>
        ) : (
          <>
            <LogIn className="h-5 w-5 mr-2" />
            Sign In
          </>
        )}
      </Button>

      {/* Switch to register */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-medium text-bitcoin-600 hover:text-bitcoin-500"
          >
            Create one
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;