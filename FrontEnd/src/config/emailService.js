import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_CONFIG = {
  serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_3j9305d',
  templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_66k0j4s',
  publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'lzy7k8tFHEXAdAfFp'
};

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey);

/**
 * Send OTP email using EmailJS
 * @param {string} userEmail - Recipient email address
 * @param {string} otp - 6-digit OTP code
 * @param {string} userName - User's name (optional)
 * @returns {Promise} - EmailJS send result
 */
export const sendOTPEmail = async (userEmail, otp, userName = 'User') => {
  try {
    console.log('📧 Sending OTP email via EmailJS...');
    console.log('📧 EmailJS Config:', {
      serviceId: EMAILJS_CONFIG.serviceId,
      templateId: EMAILJS_CONFIG.templateId,
      publicKey: EMAILJS_CONFIG.publicKey
    });
    
    // Use the exact parameter format from your working example
    const templateParams = {
      app_name: "TaskFlow",
      to_name: userName,
      otp_code: otp,
      from_name: "TaskFlow Team",
      email: userEmail
    };

    console.log('📧 Template params (exact format):', templateParams);
    console.log('📧 Sending with service:', EMAILJS_CONFIG.serviceId);

    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams
    );

    console.log('✅ OTP email sent successfully:', result);
    return {
      success: true,
      result: result,
      message: 'OTP sent to your email address successfully!'
    };

  } catch (error) {
    console.error('❌ EmailJS error:', error);
    console.error('❌ Error details:', {
      status: error.status,
      text: error.text,
      message: error.message
    });
    
    // More specific error messages
    let errorMessage = 'Failed to send OTP email. ';
    if (error.status === 400) {
      errorMessage += 'Please check EmailJS configuration.';
    } else if (error.status === 401) {
      errorMessage += 'EmailJS authentication failed.';
    } else if (error.text && error.text.includes('service')) {
      errorMessage += 'Service ID may be incorrect.';
    } else if (error.text && error.text.includes('template')) {
      errorMessage += 'Template ID may be incorrect.';
    } else {
      errorMessage += 'Please try again.';
    }
    
    return {
      success: false,
      error: error.text || error.message || 'Failed to send email',
      message: errorMessage
    };
  }
};

/**
 * Test EmailJS configuration
 * @returns {Promise} - Test result
 */
export const testEmailJS = async () => {
  try {
    const testParams = {
      to_email: 'test@example.com',
      to_name: 'Test User',
      otp_code: '123456',
      user_name: 'Test User',
      app_name: 'TaskFlow',
      from_name: 'TaskFlow Team',
      message: 'This is a test email to verify EmailJS configuration.'
    };

    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      testParams
    );

    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.text || error.message };
  }
};

export default {
  sendOTPEmail,
  testEmailJS
};