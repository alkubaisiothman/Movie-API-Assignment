CREATE TABLE Genre (
    GenreID SERIAL PRIMARY KEY,
    Name VARCHAR(50) UNIQUE NOT NULL
);

-- Movie-taulu
CREATE TABLE Movie (
    MovieID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Year INT NOT NULL,
    GenreID INT,
    FOREIGN KEY (GenreID) REFERENCES Genre(GenreID)
);

-- User-taulu
CREATE TABLE MovieUser (
    UserID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(100) NOT NULL,
    YearOfBirth INT NOT NULL
);

-- Review-taulu
CREATE TABLE Review (
    ReviewID SERIAL PRIMARY KEY,
    Stars INT CHECK (Stars >= 1 AND Stars <= 5),
    ReviewText TEXT,
    ReviewDate DATE DEFAULT CURRENT_DATE,
    UserID INT,
    MovieID INT,
    FOREIGN KEY (UserID) REFERENCES MovieUser(UserID),
    FOREIGN KEY (MovieID) REFERENCES Movie(MovieID)
);

-- Favorite-taulu
CREATE TABLE Favorite (
    FavoriteID SERIAL PRIMARY KEY,
    UserID INT,
    MovieID INT,
    FOREIGN KEY (UserID) REFERENCES MovieUser(UserID),
    FOREIGN KEY (MovieID) REFERENCES Movie(MovieID),
    UNIQUE(UserID, MovieID) 
);

TESTIDATA 

-- Lisää genrejä
INSERT INTO Genre (Name) VALUES 
('Drama'), ('Comedy'), ('Scifi'), ('Fantasy'), ('Action'), ('Thriller');

-- Lisää elokuvia
INSERT INTO Movie (Name, Year, GenreID) VALUES
('Inception', 2010, (SELECT GenreID FROM Genre WHERE Name = 'Action')),
('The Terminator', 1984, (SELECT GenreID FROM Genre WHERE Name = 'Action')),
('Tropic Thunder', 2008, (SELECT GenreID FROM Genre WHERE Name = 'Comedy')),
('Borat', 2006, (SELECT GenreID FROM Genre WHERE Name = 'Comedy')),
('Interstellar', 2014, (SELECT GenreID FROM Genre WHERE Name = 'Drama')),
('Joker', 2019, (SELECT GenreID FROM Genre WHERE Name = 'Drama'));

-- Lisää käyttäjiä
INSERT INTO MovieUser (Username, Name, Password, YearOfBirth) VALUES
('reimarii', 'Reima Riihimäki', 'qwerty123', 1986),
('lizzy', 'Lisa Simpson', 'abcdef', 1991),
('boss', 'Ben Bossy', 'salasana', 1981);

-- Lisää arvosteluita
INSERT INTO Review (Stars, ReviewText, UserID, MovieID) VALUES
(5, 'Amazing movie!', (SELECT UserID FROM MovieUser WHERE Username = 'reimarii'), (SELECT MovieID FROM Movie WHERE Name = 'Inception')),
(4, 'Pretty good.', (SELECT UserID FROM MovieUser WHERE Username = 'lizzy'), (SELECT MovieID FROM Movie WHERE Name = 'The Terminator')),
(3, 'Not bad.', (SELECT UserID FROM MovieUser WHERE Username = 'boss'), (SELECT MovieID FROM Movie WHERE Name = 'Joker'));

-- Lisää suosikkeja
INSERT INTO Favorite (UserID, MovieID) VALUES
((SELECT UserID FROM MovieUser WHERE Username = 'reimarii'), (SELECT MovieID FROM Movie WHERE Name = 'Inception')),
((SELECT UserID FROM MovieUser WHERE Username = 'lizzy'), (SELECT MovieID FROM Movie WHERE Name = 'Interstellar')),
((SELECT UserID FROM MovieUser WHERE Username = 'boss'), (SELECT MovieID FROM Movie WHERE Name = 'The Terminator'));


--Checking that all tables are showing their contents

SELECT * from genre;

SELECT * FROM movie;

SELECT * FROM profile;

SELECT * FROM review;

SELECT * FROM favorite;

--Testing tables with more complex queries

SELECT movie.movie_name, movie.year, genre.genre_name
FROM movie
JOIN genre ON movie.genre_id = genre.id;

SELECT profile.profile_name, review.stars, review.review_text
FROM review
JOIN profile ON review.profile_id = profile.id
WHERE review.movie_id = 2;  -- Movie ID 2 is "The Terminator"


SELECT movie.movie_name
FROM favorite
JOIN movie ON favorite.movie_id = movie.id
WHERE favorite.profile_id = 3;  -- Profile ID 1 is "Reima Riihimäki"