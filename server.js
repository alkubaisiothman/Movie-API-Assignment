import express from 'express';
const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());

// Pääsivu
app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Movie Api!</h1>');
});
// Simuloidaan tietokantoja taulukoilla
let genres = [];
let movies = [];
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

// Lisää elokuva
app.post('/movies', (req, res) => {
    const { name, year, genre } = req.body;

    // Tarkistetaan, että kaikki vaaditut tiedot ovat mukana
    if (!name || !year || !genre) {
        return res.status(400).json({ error: 'Name, year, and genre are required' });
    }

    // Tarkistetaan, että genre löytyy
    const genreExists = genres.some(g => g.name.toLowerCase() === genre.toLowerCase());
    if (!genreExists) {
        return res.status(400).json({ error: `Genre '${genre}' does not exist` });
    }

    // Luodaan uusi elokuva ja lisätään taulukkoon
    const newMovie = {
        id: movies.length + 1, // Luodaan ID automaattisesti
        name,
        year,
        genre
    };
    movies.push(newMovie);

    res.status(201).json({ message: 'Movie added successfully', movie: newMovie });
});

// Hae kaikki elokuvat
app.get('/movies', (req, res) => {
    res.json(movies);
});

// Hae elokuva ID:n perusteella
app.get('/movies/:id', (req, res) => {
    const movieId = parseInt(req.params.id);
    const movie = movies.find(m => m.id === movieId);

    if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
    }

    res.json(movie);
});

// Serverin käynnistys
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
