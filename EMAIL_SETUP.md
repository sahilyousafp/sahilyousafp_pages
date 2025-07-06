# Email Configuration Setup

## EmailJS Setup Instructions

To enable email functionality for the contact form, you need to set up EmailJS:

### 1. Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Create Email Service
1. Go to Email Services in your EmailJS dashboard
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note down your **Service ID**

### 3. Create Email Template
1. Go to Email Templates in your EmailJS dashboard
2. Click "Create New Template"
3. Use this template structure:

```
Subject: {{subject}}

From: {{from_name}} ({{from_email}})

Message:
{{message}}

---
Sent from Portfolio Contact Form
```

4. Note down your **Template ID**

### 4. Get Your Public Key
1. Go to Account > API Keys in your EmailJS dashboard
2. Copy your **Public Key**

### 5. Update Configuration
Open `script.js` and replace these placeholders:
- `YOUR_PUBLIC_KEY` with your actual public key
- `YOUR_SERVICE_ID` with your service ID  
- `YOUR_TEMPLATE_ID` with your template ID

### Example Configuration:
```javascript
emailjs.init("your_actual_public_key_here");

emailjs.send('gmail', 'template_contact', formData)
```

### 6. Test the Form
1. Open your website
2. Fill out the contact form
3. Submit and check if the email arrives at sahil.yousaf@students.iaac.net

### Fallback
If EmailJS fails, the form will automatically open the user's default email client with a pre-filled message.

### Rate Limits
- Free EmailJS account: 200 emails/month
- Paid plans available for higher limits

### Security Note
The public key is safe to expose in client-side code. Never expose your private key.
