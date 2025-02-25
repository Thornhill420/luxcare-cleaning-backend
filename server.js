require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

// ✅ Configure CORS to allow only your frontend (GitHub Pages & backend)
const allowedOrigins = [
    "https://luxcare.github.io", // GitHub Pages root (handles all subpaths)
    "https://luxcare-cleaning-backend.onrender.com"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
}));

// ✅ Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Nodemailer Transport Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ✅ Contact Form Email Route
app.post('/send-email', async (req, res) => {
    console.log("Received contact form request:", req.body);

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        console.log("❌ Missing required fields!");
        return res.status(400).json({ error: 'All fields are required' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "New Contact Form Message",
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Contact email sent:", info.response);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error("❌ Error sending contact email:", error);
        res.status(500).json({ error: 'Failed to send email.' });
    }
});

// ✅ Booking Form Email Route
app.post('/book-service', async (req, res) => {
    console.log("Received booking request:", req.body);

    const { name, email, phone, service, date, time, address, notes } = req.body;
    if (!name || !email || !phone || !service || !date || !time || !address) {
        console.log("❌ Missing required fields!");
        return res.status(400).json({ error: 'All fields except notes are required' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "New Booking Request",
        text: `New cleaning service booking:\n
        Name: ${name}\n
        Email: ${email}\n
        Phone: ${phone}\n
        Selected Service: ${service}\n
        Preferred Date: ${date}\n
        Preferred Time: ${time}\n
        Address: ${address}\n
        Special Notes: ${notes || "No additional notes provided."}`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Booking email sent:", info.response);
        res.status(200).json({ message: 'Booking request sent successfully!' });
    } catch (error) {
        console.error("❌ Error sending booking email:", error);
        res.status(500).json({ error: 'Failed to send booking request.' });
    }
});

// ✅ Default Route to Check Server Status
app.get('/', (req, res) => {
    res.send('LuxCare Cleaning Backend is Running 🚀');
});

// ✅ Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => console.log(`Backend running on port ${PORT}`));
