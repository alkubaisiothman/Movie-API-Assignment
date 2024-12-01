import express from 'express';
import { client } from './client.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Movie API!</h1>');
});

app.post('/genres', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Genre name is required' });
    }
    try {
        const result = await client.query('INSERT INTO Genre (Name) VALUES ($1) RETURNING *', [name]);
        res.status(201).json({ message: 'Genre added successfully', genre: result.rows[0] });
    } catch (error) {
        if (error.code === '23505') {
            res.status(400).json({ error: 'Genre already exists' });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Database error' });
        }
    }
});

app.get('/genres', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM Genre');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/movies', async (req, res) => {
    const { name, year, genre } = req.body;
    if (!name || !year || !genre) {
        return res.status(400).json({ error: 'Name, year, and genre are required' });
    }
    try {
        const genreResult = await client.query('SELECT GenreID FROM Genre WHERE Name = $1', [genre]);
        if (genreResult.rowCount === 0) {
            return res.status(400).json({ error: `Genre '${genre}' does not exist` });
        }
        const genreId = genreResult.rows[0].genreid;
        const result = await client.query(
            'INSERT INTO Movie (Name, Year, GenreID) VALUES ($1, $2, $3) RETURNING *',
            [name, year, genreId]
        );
        res.status(201).json({ message: 'Movie added successfully', movie: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/movies', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM Movie');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/movies/:id', async (req, res) => {
    const movieId = parseInt(req.params.id);
    try {
        const result = await client.query(
            `SELECT m.MovieID, m.Name, m.Year, g.Name as Genre
             FROM Movie m
             JOIN Genre g ON m.GenreID = g.GenreID
             WHERE m.MovieID = $1`,
            [movieId]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
