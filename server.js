const express = require('express');
const multer = require('multer');
const app = express();
app.use(express.json());

const WEBHOOK_URL = process.env.WEBHOOK_URL;
const SECRET_KEY = process.env.SECRET_KEY;
const upload = multer({ storage: multer.memoryStorage() });

// Старый эндпоинт для текста
app.post('/log', async (req, res) => {
    if (req.headers['x-secret'] !== SECRET_KEY) {
        return res.sendStatus(403);
    }

    const { message } = req.body;
    if (!message) return res.status(400).send('no message');

    try {
        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: message })
        });
        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(500);
    }
});

// Новый эндпоинт для файлов
app.post('/upload', upload.single('file'), async (req, res) => {
    if (req.headers['x-secret'] !== SECRET_KEY) {
        return res.sendStatus(403);
    }

    const formData = new FormData();
    formData.append('file', new Blob([req.file.buffer]), req.file.originalname);

    await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData
    });

    res.sendStatus(200);
});

app.listen(3000, () => console.log('Server running'));
