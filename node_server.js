const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

app.use(bodyParser.json());
app.use(cors());

let face_found = true;
let lastEmailSentTime = 0;

app.get('/api/face-status', (req, res) => {
    res.json(face_found);
});

app.post('/update-face-status', (req, res) => {  
    const { face_found: newFaceFound } = req.body;
    
    face_found = newFaceFound;
    res.json({ message: `Face status updated to ${face_found}` });
});

app.post('/api/send-email', async (req, res) => {
    const { to, subject, text } = req.body;
    const currentTime = Date.now();
    const cooldownTime = 5 * 60 * 1000;

    if (currentTime - lastEmailSentTime < cooldownTime) {
        return res.status(429).send({ error: 'Email cooldown period has not passed yet. Please wait.' });
    }

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'ebabysitterproject@gmail.com',
            pass: 'kntt jpzw bdex vkal'
        }
    });

    let mailOptions = {
        from: 'ebabysitterproject@gmail.com',
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        lastEmailSentTime = currentTime;
        res.status(200).send({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ error: 'Failed to send email' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
