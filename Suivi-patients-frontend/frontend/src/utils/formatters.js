const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
    
    // Remove all non-numeric characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Format based on length
    if (cleaned.length <= 6) {
      return cleaned.replace(/(\d{2})(\d{0,4})/, '$1 $2').trim();
    } else if (cleaned.length <= 8) {
      return cleaned.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1 $2 $3').trim();
    } else {
      return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{0,4})/, '$1 $2 $3 $4').trim();
    }
  };
  
  const formatCurrency = (amount, currency = 'EUR', locale = 'fr-FR') => {
    if (amount === null || amount === undefined) return '';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };
  
  const truncateText = (text, maxLength = 50) => {
    if (!text || text.length <= maxLength) return text;
    
    return text.slice(0, maxLength) + '...';
  };
  
  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  
  const formatFullName = (firstName, lastName) => {
    return `${capitalizeFirstLetter(firstName)} ${lastName ? lastName.toUpperCase() : ''}`.trim();
  };
  
  const formatAddress = (street, postalCode, city, country) => {
    const parts = [street, `${postalCode || ''} ${city || ''}`.trim(), country];
    return parts.filter(Boolean).join(', ');
  };
  
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const formatSocialSecurityNumber = (ssn) => {
    if (!ssn) return '';
    
    // Remove all non-numeric characters
    const cleaned = ssn.replace(/\D/g, '');
    
    // Format as X XX XX XX XXX XXX XX for French social security numbers
    return cleaned.replace(/(\d{1})(\d{2})(\d{2})(\d{2})(\d{3})(\d{3})(\d{0,2})/, '$1 $2 $3 $4 $5 $6 $7').trim();
  };
  
  export {
    formatPhoneNumber,
    formatCurrency,
    truncateText,
    capitalizeFirstLetter,
    formatFullName,
    formatAddress,
    formatFileSize,
    formatSocialSecurityNumber,
  };