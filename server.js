import express from 'express';
const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Movie Service API!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Simuloidaan tietokantaa taulukolla
let genres = [];

// Lisää genre
app.post('/genres', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Genre name is required' });
    }
    genres.push({ id: genres.length + 1, name });
    res.status(201).json({ message: 'Genre added successfully', genre: { id: genres.length, name } });
});
// Hae kaikki genret
app.get('/genres', (req, res) => {
    res.json(genres);
});
