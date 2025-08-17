// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

// Password validation
export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/(?=.*[a-z])/.test(password)) return 'Password must contain lowercase letters';
  if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain uppercase letters';
  if (!/(?=.*\d)/.test(password)) return 'Password must contain numbers';
  if (!/(?=.*[@$!%*?&])/.test(password)) return 'Password must contain special characters';
  return null;
};

// Password strength calculation
export const getPasswordStrength = (password) => {
  let strength = 0;
  let feedback = [];

  if (password.length >= 8) strength += 1;
  else feedback.push('At least 8 characters');

  if (/(?=.*[a-z])/.test(password)) strength += 1;
  else feedback.push('Lowercase letters');

  if (/(?=.*[A-Z])/.test(password)) strength += 1;
  else feedback.push('Uppercase letters');

  if (/(?=.*\d)/.test(password)) strength += 1;
  else feedback.push('Numbers');

  if (/(?=.*[@$!%*?&])/.test(password)) strength += 1;
  else feedback.push('Special characters');

  const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['red', 'orange', 'yellow', 'blue', 'green'];

  return {
    score: strength,
    level: levels[Math.min(strength, 4)],
    color: colors[Math.min(strength, 4)],
    feedback
  };
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
};

// General form validation
export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};