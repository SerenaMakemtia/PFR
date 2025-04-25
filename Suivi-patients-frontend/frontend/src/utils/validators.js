const isValidEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  
  const isValidPhoneNumber = (phone) => {
    // Remove all non-numeric characters except the leading +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // Basic validation for French phone numbers
    // Accept formats like +33612345678 or 0612345678
    return /^(\+33|0)[1-9]\d{8}$/.test(cleaned);
  };
  
  const isStrongPassword = (password) => {
    // Password must be at least 8 characters
    // Must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };
  
  const isValidDateOfBirth = (dateOfBirth) => {
    const date = new Date(dateOfBirth);
    const today = new Date();
    
    // Check if date is valid
    if (isNaN(date.getTime())) return false;
    
    // Check if date is in the past
    if (date > today) return false;
    
    // Check if person is not too old (e.g., older than 120 years)
    const maxAge = new Date();
    maxAge.setFullYear(today.getFullYear() - 120);
    if (date < maxAge) return false;
    
    return true;
  };
  
  const isValidName = (name) => {
    // Allow letters, spaces, hyphens, and apostrophes
    return /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/.test(name);
  };
  
  const isValidPostalCode = (postalCode, countryCode = 'FR') => {
    if (countryCode === 'FR') {
      // French postal codes are 5 digits
      return /^\d{5}$/.test(postalCode);
    }
    
    // Basic validation for other countries
    return /^[a-zA-Z0-9\s-]{3,10}$/.test(postalCode);
  };
  
  const isValidSocialSecurityNumber = (ssn) => {
    // Remove all non-numeric characters
    const cleaned = ssn.replace(/\D/g, '');
    
    // French social security numbers are 15 digits
    if (cleaned.length !== 15) return false;
    
    // Basic format check for French social security numbers
    // 1 digit for gender + 2 digits for year + 2 digits for month + 
    // 2 digits for department + 3 digits for commune + 3 digits for order number + 2 digits for key
    const pattern = /^[12]\d{2}(0[1-9]|1[0-2])\d{5}\d{3}\d{2}$/;
    
    return pattern.test(cleaned);
  };
  
  const validateForm = (values, validationRules) => {
    const errors = {};
    
    for (const field in validationRules) {
      const rules = validationRules[field];
      const value = values[field];
      
      // Required field validation
      if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        errors[field] = rules.requiredMessage || 'Ce champ est obligatoire';
        continue; // Skip other validations if the field is empty and required
      }
      
      // Skip validation if the field is empty and not required
      if (!value && !rules.required) {
        continue;
      }
      
      // Custom validation function
      if (rules.validate && typeof rules.validate === 'function') {
        const validateResult = rules.validate(value, values);
        if (validateResult) {
          errors[field] = validateResult;
          continue;
        }
      }
      
      // Minimum length validation
      if (rules.minLength && value.length < rules.minLength) {
        errors[field] = rules.minLengthMessage || `Minimum ${rules.minLength} caractères requis`;
        continue;
      }
      
      // Maximum length validation
      if (rules.maxLength && value.length > rules.maxLength) {
        errors[field] = rules.maxLengthMessage || `Maximum ${rules.maxLength} caractères autorisés`;
        continue;
      }
      
      // Pattern validation
      if (rules.pattern && !rules.pattern.test(value)) {
        errors[field] = rules.patternMessage || 'Format invalide';
        continue;
      }
      
      // Email validation
      if (rules.isEmail && !isValidEmail(value)) {
        errors[field] = rules.emailMessage || 'Email invalide';
        continue;
      }
      
      // Phone validation
      if (rules.isPhone && !isValidPhoneNumber(value)) {
        errors[field] = rules.phoneMessage || 'Numéro de téléphone invalide';
        continue;
      }
    }
    
    
    return errors;
  };
  
  export {
    isValidEmail,
    isValidPhoneNumber,
    isStrongPassword,
    isValidDateOfBirth,
    isValidName,
    isValidPostalCode,
    isValidSocialSecurityNumber,
    validateForm,
  };