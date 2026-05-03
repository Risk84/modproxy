const express = require('express');
const app = express();
app.use(express.json());

const WEBHOOK_URL = process.env.WEBHOOK_URL;
const SECRET_KEY = process.env.SECRET_KEY;

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

app.listen(3000, () => console.log('Server running'));