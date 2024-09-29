const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;


// Middleware
app.use(cors({
  origin: '*', // Be more specific in production
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'xboru2@gmail.com',
    pass: 'usscpdjpulkrsfsd'
  }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log('Transporter verification error:', error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

// Email sending endpoint
app.post('/send-email', async (req, res) => {
  console.log('Received request to send email');
  const { to, subject, body, attachments } = req.body;
 
  const mailOptions = {
    from: process.env.EMAIL_USER, // Use environment variable
    to,
    subject,
    text: body,
  };

  // Handle attachments
  if (attachments && Array.isArray(attachments) && attachments.length > 0) {
    mailOptions.attachments = attachments.map(attachment => ({
      filename: attachment.filename,
      content: attachment.content,
      encoding: attachment.encoding
    }));
  }

  try {
    console.log('Attempting to send email...');
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send(`Error sending email: ${error.message}`);
  }
});

// Test endpoint
app.get('/test', (req, res) => {
  console.log('Test endpoint hit');
  res.status(200).send('Server is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error caught by middleware:', err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

app.use(cors({
  origin: '*', // Replace with your frontend's URL
  credentials: true
}));
