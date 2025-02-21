require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ✅ Contact Form Email Route
app.post('/send-email', async (req, res) => {
    console.log("Received contact form request:", req.body); // Debugging

    const { name, email, message } = req.body;
    if (!name || !email || !message) {
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
        console.log("Contact email sent:", info.response); // Debugging
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error("Error sending contact email:", error);
        res.status(500).json({ error: 'Failed to send email.' });
    }
});

// ✅ Booking Form Email Route
app.post('/book-service', async (req, res) => {
    console.log("Received booking request:", req.body); // Debugging

    const { name, email, phone, service, date, time, address, notes } = req.body;
    if (!name || !email || !phone || !service || !date || !time || !address) {
        return res.status(400).json({ error: 'All fields except notes are required' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "New Booking Request",
        text: `New cleaning service booking:
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Selected Service: ${service}
        Preferred Date: ${date}
        Preferred Time: ${time}
        Address: ${address}
        Special Notes: ${notes || "No additional notes provided."}`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Booking email sent:", info.response); // Debugging
        res.status(200).json({ message: 'Booking request sent successfully!' });
    } catch (error) {
        console.error("Error sending booking email:", error);
        res.status(500).json({ error: 'Failed to send booking request.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Backend running on port ${PORT}`));
