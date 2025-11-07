// Test EmailJS with your exact working format
import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
emailjs.init('lzy7k8tFHEXAdAfFp');

// Test function using your exact working format
export const testEmailJSExact = async () => {
  try {
    console.log('🧪 Testing EmailJS with your exact format...');
    
    const result = await emailjs.send("service_3j9305d", "template_66k0j4s", {
      app_name: "TaskFlow",
      to_name: "Test User",
      otp_code: "123456",
      from_name: "TaskFlow Team",
      email: "test@example.com"
    });
    
    console.log('✅ EmailJS test successful!', result);
    return { success: true, result };
    
  } catch (error) {
    console.error('❌ EmailJS test failed:', error);
    return { success: false, error };
  }
};

// Make it available in browser console for manual testing
if (typeof window !== 'undefined') {
  window.testEmailJSExact = testEmailJSExact;
  console.log('🧪 EmailJS Exact Test loaded! Run testEmailJSExact() in console to test.');
}

export default testEmailJSExact;