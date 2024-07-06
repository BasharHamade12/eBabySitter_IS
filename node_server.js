const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

let face_found = true; // Initialize face_found variable

app.get('/api/face-status', (req, res) => {
    res.json(face_found); // Return the current state of face_found
});

app.post('/update-face-status', (req, res) => {  
    console.log(`post req`);
    const { face_found: newFaceFound } = req.body;
    
    face_found = newFaceFound; // Update face_found based on the request
    console.log(`Updated face_found to: ${face_found}`);
    res.json({ message: `Face status updated to ${face_found}` });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
