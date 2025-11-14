# 📧 EmailJS Setup Guide for TaskFlow OTP System

## 🚀 Quick Setup (5 minutes)

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Connect Your Email Service
1. Go to **Email Services** in EmailJS dashboard
2. Click **Add New Service**
3. Choose your email provider:
   - **Gmail** (recommended for testing)
   - **Outlook/Hotmail**
   - **Yahoo Mail** 
   - Or any SMTP service
4. Follow the connection steps for your provider

### Step 3: Create Email Template
1. Go to **Email Templates** in dashboard
2. Click **Create New Template**
3. Use this OTP template:

```html
Hello {{to_name}},

You requested a password reset for your {{app_name}} account.

Your One-Time Password (OTP) is: **{{otp_code}}**

This OTP will expire in 10 minutes.

If you didn't request this password reset, please ignore this email.

Best regards,
{{from_name}}
```

### Step 4: Get Your Configuration
1. **Service ID**: From Email Services page
2. **Template ID**: From Email Templates page  
3. **Public Key**: From Account > General settings

### Step 5: Update Frontend Configuration
Edit `FrontEnd/.env`:
```env
REACT_APP_EMAILJS_SERVICE_ID=your_actual_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_actual_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_actual_public_key
```

## 🧪 Testing

1. Start your servers:
   ```bash
   # Backend
   cd Backend && npm start
   
   # Frontend  
   cd FrontEnd && npm start
   ```

2. Test the flow:
   - Go to http://localhost:3001/forgot-password-otp
   - Enter: `test@example.com`
   - Check your email for the OTP
   - Complete the reset process

## 📱 Template Variables

Your EmailJS template can use these variables:
- `{{to_email}}` - Recipient email
- `{{to_name}}` - User's name
- `{{otp_code}}` - 6-digit OTP
- `{{app_name}}` - "TaskFlow"
- `{{from_name}}` - "TaskFlow Team"

## 🔒 Security Notes

- ✅ OTP expires in 10 minutes
- ✅ Frontend-only email sending (no server email config needed)
- ✅ EmailJS free tier: 200 emails/month
- ✅ Public key is safe to expose (it's meant for frontend)

## 🆓 Free Tier Limits

EmailJS Free Account:
- **200 emails/month**
- **2 email services**
- **3 email templates**
- Perfect for development and small apps!

## 🔧 Troubleshooting

**Email not received?**
- Check spam/junk folder
- Verify EmailJS service is connected
- Check template ID matches
- Look at browser console for errors

**Service errors?**
- Verify service ID and template ID are correct
- Make sure email service is active in EmailJS dashboard
- Check EmailJS usage limits

## 💡 Alternative: Console Testing

If you don't want to set up EmailJS yet, the OTP will still be logged to the backend console for testing purposes.