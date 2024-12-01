import express from 'express';
import { client } from './client.js'; // Tuo client.js

const app = express();
app.use(express.json());

app.post('/genres', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Genre name is required' });
    }
    try {
        const result = await client.query('INSERT INTO Genre (Name) VALUES ($1) RETURNING *', [name]);
        res.status(201).json({ message: 'Genre added successfully', genre: result.rows[0] });
    } catch (error) {
        if (error.code === '23505') { // UNIQUE constraint violation
            res.status(400).json({ error: 'Genre already exists' });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Database error' });
        }
    }
});

// Lisää muut endpointit samalla tavalla...
