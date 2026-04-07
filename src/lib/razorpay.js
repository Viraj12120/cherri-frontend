/**
 * Utility to load Razorpay SDK dynamically.
 * Uses a singleton promise to ensure the script is only loaded once.
 */
let razorpayPromise = null;

export const loadRazorpay = () => {
  // If a promise is already in progress or resolved, return it
  if (razorpayPromise) return razorpayPromise;

  razorpayPromise = new Promise((resolve, reject) => {
    const SCRIPT_ID = 'razorpay-checkout-js';
    const SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

    // 1. Check if already available on window
    if (window.Razorpay) {
      console.log('Razorpay SDK already available on window.');
      resolve(true);
      return;
    }

    // 2. Check for existing script tag and clean up if it's broken
    const existingScript = document.getElementById(SCRIPT_ID);
    if (existingScript) {
      console.warn('Existing Razorpay script tag found. Removing to retry loading...');
      existingScript.remove();
    }

    // 3. Create and append the new script
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.id = SCRIPT_ID;
    script.async = true;

    // Timeout to prevent indefinite waiting (e.g. 10 seconds)
    const timeout = setTimeout(() => {
      console.error('Razorpay SDK loading timed out after 10s.');
      razorpayPromise = null;
      reject(new Error('Razorpay SDK loading timed out. Please check your internet connection.'));
    }, 10000);

    script.onload = () => {
      clearTimeout(timeout);
      console.log('Razorpay SDK loaded successfully.');
      resolve(true);
    };

    script.onerror = () => {
      clearTimeout(timeout);
      console.error('Failed to load Razorpay SDK.');
      razorpayPromise = null; // Reset so we can try again later
      reject(new Error('Failed to load Razorpay SDK. Please check your internet connection or disable ad-blockers.'));
    };

    document.body.appendChild(script);
  });

  return razorpayPromise;
};

// Expose to window for debugging
if (typeof window !== 'undefined') {
  window.loadRazorpay = loadRazorpay;
}
