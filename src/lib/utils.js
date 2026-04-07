/**
 * Standardize error message extraction from API responses.
 * Specifically handles FastAPI (Pydantic) validation error objects/arrays
 * and typical Axios error structures.
 */
export const getErrorMessage = (err, defaultMsg = 'An unexpected error occurred.') => {
  if (!err) return defaultMsg;

  // Axios/Response error data
  const data = err.response?.data;
  
  if (data?.detail) {
    if (typeof data.detail === 'string') {
      return data.detail;
    }
    
    // Handle FastAPI/Pydantic validation error list
    if (Array.isArray(data.detail)) {
      // Return first clear message found
      return data.detail[0]?.msg || JSON.stringify(data.detail[0]) || defaultMsg;
    }
  }

  // Generic message
  return data?.message || err.message || defaultMsg;
};

/**
 * Format currency with internationalization
 */
export const formatCurrency = (val, lang = 'en-IN') => {
  const num = parseFloat(val);
  let currencyCode = 'INR';
  if (lang.includes('US') || lang === 'en') currencyCode = 'USD';
  else if (lang === 'fr' || lang === 'es') currencyCode = 'EUR';

  try {
    return new Intl.NumberFormat(lang, { style: 'currency', currency: currencyCode }).format(isNaN(num) ? 0 : num);
  } catch (e) {
    return (currencyCode === 'INR' ? '₹' : '$') + (isNaN(num) ? '0.00' : num.toFixed(2));
  }
};
