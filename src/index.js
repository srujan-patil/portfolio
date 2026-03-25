const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// ── Health check ── Kubernetes liveness + readiness probe hits this
app.get('/health', (req, res) => {
  res.status(200).json({
    status:  'ok',
    env:     process.env.NODE_ENV || 'development',
    uptime:  Math.floor(process.uptime()),
    version: process.env.npm_package_version || '1.0.0',
  });
});

// ── Contact form API ──
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Email logic — configure SMTP_* vars in .env
  try {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from:    email,
      to:      process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      subject: `Portfolio contact from ${name}`,
      text:    message,
    });

    res.json({ success: true, message: 'Message sent!' });
  } catch (err) {
    console.error('Mail error:', err.message);
    // Still return success in dev if SMTP not configured
    if (process.env.NODE_ENV === 'development') {
      return res.json({ success: true, message: 'Dev mode — mail skipped' });
    }
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// ── Serve portfolio for all other routes ──
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '../public/index.html'))
);

const server = app.listen(PORT, () =>
  console.log(`🚀  Portfolio running → http://localhost:${PORT}  [${process.env.NODE_ENV || 'development'}]`)
);

module.exports = { app, server };
