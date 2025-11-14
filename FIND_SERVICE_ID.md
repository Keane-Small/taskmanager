# 🔍 How to Find Your EmailJS Service ID

## ✅ You Have:
- ✅ **Template ID**: `template_66k0j4s`
- ✅ **Public Key**: `lzy7k8tFHEXAdAfFp`
- ❓ **Service ID**: Need to find this

## 🎯 Finding Your Service ID

### Method 1: EmailJS Dashboard
1. **Go to**: [https://dashboard.emailjs.com/admin](https://dashboard.emailjs.com/admin)
2. **Login** to your account
3. **Click "Email Services"** in the left sidebar
4. **Look for your connected service** (Gmail, Outlook, etc.)
5. **Copy the Service ID** - it looks like `service_xxxxxxx`

### Method 2: Common Service IDs to Try
Update your `.env` file with these common service IDs one by one:

```env
# Try these service IDs (most common first)
REACT_APP_EMAILJS_SERVICE_ID=service_gmail
# OR
REACT_APP_EMAILJS_SERVICE_ID=gmail_service
# OR  
REACT_APP_EMAILJS_SERVICE_ID=service_1
# OR
REACT_APP_EMAILJS_SERVICE_ID=default_service
```

## 🧪 Testing Steps

1. **Update `.env`** with a service ID to try
2. **Restart your React app**: `Ctrl+C` then `npm start`
3. **Go to**: http://localhost:3001/forgot-password-otp
4. **Enter email**: `test@example.com`
5. **Check browser console** for detailed error messages
6. **Check your email** - if it works, you found the right service ID!

## 🔧 Current Configuration

Your current settings in `.env`:
```env
REACT_APP_EMAILJS_SERVICE_ID=service_gmail  # ← Try different IDs here
REACT_APP_EMAILJS_TEMPLATE_ID=template_66k0j4s  # ✅ Correct
REACT_APP_EMAILJS_PUBLIC_KEY=lzy7k8tFHEXAdAfFp  # ✅ Correct
```

## 🚨 Error Messages & Solutions

### "Service not found" or "Invalid service"
- ✏️ **Fix**: Wrong service ID - try different ones from list above

### "Template not found"  
- ✏️ **Fix**: Template ID is wrong (but yours looks correct: `template_66k0j4s`)

### "Unauthorized" or "Invalid public key"
- ✏️ **Fix**: Public key is wrong (but yours looks correct: `lzy7k8tFHEXAdAfFp`)

### "Forbidden" or "Rate limit"
- ✏️ **Fix**: EmailJS rate limiting - wait a few minutes

## 💡 Quick Test

After updating your service ID:

1. **Enter this email**: `test@example.com`
2. **Watch browser console** for detailed logs
3. **If successful**: You'll see "OTP email sent successfully!"
4. **If failed**: You'll see specific error details

## 📞 Need Help?

If none of the common service IDs work:
1. **Double-check** your EmailJS dashboard for the exact service ID
2. **Make sure** the email service is **Active** (not paused)
3. **Verify** you're using the template with the HTML code you provided

**Once you find the correct service ID, the OTP emails will be sent to real email addresses!** 🎉