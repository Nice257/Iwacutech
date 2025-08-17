import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  validateEmail, 
  validatePassword, 
  validateConfirmPassword,
  validateRequired 
} from '../../utils/validation';
import Button from '../common/Button';
import Input from '../common/Input';
import LoadingSpinner from '../common/LoadingSpinner';
import PasswordStrength from './PasswordStrength';

const RegisterForm = ({ onSwitchToLogin }) => {
  const { register, error, isLoading, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: fieldValue }));
    
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
    errors.password = validatePassword(formData.password);
    errors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword);
    
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
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
    
    const result = await register(formData.email, formData.password);
    // Navigation will be handled by AuthWrapper
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          placeholder="Create a strong password"
          value={formData.password}
          onChange={handleChange}
          error={formErrors.password}
          icon={Lock}
          required
          autoComplete="new-password"
        />
        <button
          type="button"
          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
        
        {/* Password strength indicator */}
        <PasswordStrength password={formData.password} />
      </div>

      {/* Confirm Password field */}
      <div className="relative">
        <Input
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={formErrors.confirmPassword}
          icon={Lock}
          required
          autoComplete="new-password"
        />
        <button
          type="button"
          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      {/* Terms checkbox */}
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          name="agreeToTerms"
          checked={formData.agreeToTerms}
          onChange={handleChange}
          className="h-4 w-4 text-bitcoin-600 focus:ring-bitcoin-500 border-gray-300 rounded mt-1"
        />
        <div className="flex-1">
          <label className="text-sm text-gray-700">
            I agree to the{' '}
            <a href="#" className="text-bitcoin-600 hover:text-bitcoin-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-bitcoin-600 hover:text-bitcoin-500">
              Privacy Policy
            </a>
          </label>
          {formErrors.agreeToTerms && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {formErrors.agreeToTerms}
            </p>
          )}
        </div>
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
            <span className="ml-2">Creating account...</span>
          </>
        ) : (
          <>
            <UserPlus className="h-5 w-5 mr-2" />
            Create Account
          </>
        )}
      </Button>

      {/* Switch to login */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-medium text-bitcoin-600 hover:text-bitcoin-500"
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;