const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure the base uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

// Configure Multer for disk storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.params.userId; // Get userId from URL parameter to create user-specific storage
        if (!userId) {
            return cb(new Error('User ID is required for upload destination.'), null);
        }
        const userUploadsDir = path.join(UPLOADS_DIR, userId);
        // Create user-specific directory if it doesn't exist, enabling per-user content isolation
        if (!fs.existsSync(userUploadsDir)) {
            fs.mkdirSync(userUploadsDir, { recursive: true });
        }
        cb(null, userUploadsDir);
    },
    filename: (req, file, cb) => {
        // Use original filename with a timestamp to avoid overwrites and maintain uniqueness
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// --- Routes for Custom REST Storage Solution ---

// 1. Upload an image for a specific user
app.post('/upload/:userId', upload.single('image'), (req, res) => {
    // This route demonstrates how a custom solution handles file uploads
    // and stores them in a user-specific directory on the local filesystem.
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.status(201).json({
        message: `Image uploaded successfully for user ${req.params.userId}`,
        filename: req.file.filename,
        path: `/images/${req.params.userId}/${req.file.filename}`
    });
});

// 2. Retrieve an image for a specific user
app.get('/images/:userId/:filename', (req, res) => {
    // This route shows how a custom solution serves files directly from the server,
    // demonstrating manual control over access (though no auth is implemented here).
    const filePath = path.join(UPLOADS_DIR, req.params.userId, req.params.filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Image not found.');
    }
});

// 3. Delete an image for a specific user
app.delete('/images/:userId/:filename', (req, res) => {
    // This route illustrates how a custom solution manages deletion,
    // allowing per-user control over their content, a key aspect of the article's discussion.
    const filePath = path.join(UPLOADS_DIR, req.params.userId, req.params.filename);
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                return res.status(500).send('Error deleting image.');
            }
            res.send(`Image ${req.params.filename} deleted for user ${req.params.userId}.`);
        });
    } else {
        res.status(404).send('Image not found.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Custom REST storage server running on http://localhost:${PORT}`);
    console.log('Test with tools like Postman or curl.');
    console.log('To upload: POST http://localhost:3000/upload/:userId (form-data, key: image, value: your-file)');
    console.log('To retrieve: GET http://localhost:3000/images/:userId/:filename');
    console.log('To delete: DELETE http://localhost:3000/images/:userId/:filename');
});
