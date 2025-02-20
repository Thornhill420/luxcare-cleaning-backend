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

// Contact form email route
app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: "New Contact Form Message",
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: 'Failed to send email.' });
    }
});

// Booking form email route
app.post('/book-service', async (req, res) => {
    const { name, email, phone, service, date, time, address, notes } = req.body;

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: "New Booking Request",
        text: `New cleaning service booking:        
        Name: ${name || "Not provided"}
        Email: ${email || "Not provided"}
        Phone: ${phone || "Not provided"}
        Selected Service: ${service || "Not provided"}
        Preferred Date: ${date || "Not provided"}
        Preferred Time: ${time || "Not provided"}
        Address: ${address || "Not provided"}
        Special Notes: ${notes || "No additional notes provided."}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Booking request sent successfully!' });
    } catch (error) {
        console.error("Error sending booking email:", error);
        res.status(500).json({ error: 'Failed to send booking request.' });
    }
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
