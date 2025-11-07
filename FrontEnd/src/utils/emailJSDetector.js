// Quick EmailJS Service ID Detector
// Use this in browser console to find your service ID

const commonServiceIds = [
  'service_gmail',
  'gmail_service', 
  'service_1',
  'default_service',
  'service_default',
  'service_mail',
  'email_service',
  'service_google'
];

const testEmailJS = async () => {
  const templateParams = {
    to_email: 'test@example.com',
    to_name: 'Test User',
    otp_code: '123456',
    user_name: 'Test User',
    app_name: 'TaskFlow',
    from_name: 'TaskFlow Team'
  };

  console.log('🔍 Testing common service IDs...');
  
  for (const serviceId of commonServiceIds) {
    try {
      console.log(`Testing service ID: ${serviceId}`);
      
      const result = await emailjs.send(
        serviceId,
        'template_66k0j4s', // Your template ID
        templateParams
      );
      
      console.log(`✅ SUCCESS! Service ID found: ${serviceId}`, result);
      return serviceId;
      
    } catch (error) {
      console.log(`❌ Failed with ${serviceId}:`, error.text || error.message);
    }
  }
  
  console.log('❌ No working service ID found. Check your EmailJS dashboard for the correct service ID.');
};

// Export for manual testing
window.testEmailJS = testEmailJS;
window.commonServiceIds = commonServiceIds;

console.log('🧪 EmailJS Service Detector loaded!');
console.log('📋 Run testEmailJS() in console to find your service ID');
console.log('📋 Or check these common IDs:', commonServiceIds);