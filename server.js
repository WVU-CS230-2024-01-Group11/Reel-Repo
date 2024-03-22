// backend; connects to database
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection( {
    host: 'database-1.c1m4ekg4o6v6.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'Eea12190!',
    database: 'reelRepoDB'
});

db.connect(err => {
    if(err){
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database');
});

app.get('/api/accounts', (req, res) => {
    db.query('SELECT * FROM accounts', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});
app.get('/api/accounts/usernames', (req, res) => {
    db.query('SELECT username FROM accounts', (error, results) => {
        if (error) {
            console.error('Error fetching usernames:', error);
            res.status(500).send('Error fetching usernames');
        } else {
            res.json(results);
        }
    });
});
app.get('/api/accounts/emails', (req, res) => {
    db.query('SELECT email FROM accounts', (error, results) => {
        if (error) {
            console.error('Error fetching emails:', error);
            res.status(500).send('Error fetching emails');
        } else {
            res.json(results);
        }
    });
});

app.get('/api/total-user-watch-time', (req, res) => {
    const username = req.query.username;
    db.query('SELECT total_watch_time FROM TotalUserWatchTime WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching total watch time:', error);
            res.status(500).send('Error fetching total watch time');
        } else {
            res.json({ total_watch_time: results[0] ? results[0].total_watch_time : 0 });
        }
    });
});
app.get('/api/total-tv-watch-time', (req, res) => {
    const username = req.query.username;
    db.query('SELECT total_watch_time FROM TotalEpisodeWatchTime WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching total watch time:', error);
            res.status(500).send('Error fetching total watch time');
        } else {
            res.json({ total_watch_time: results[0] ? results[0].total_watch_time : 0 });
        }
    });
});
app.get('/api/total-watch-time', (req, res) => {
    const username = req.query.username;
    db.query('SELECT total_runtime FROM TotalRuntime WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching total watch time:', error);
            res.status(500).send('Error fetching total watch time');
        } else {
            res.json({ total_runtime: results[0] ? results[0].total_runtime : 0 });
        }
    });
});
app.get('/api/total-month-watch-time', (req, res) => {
    const username = req.query.username;
    db.query('SELECT total_runtime FROM TotalWatchTimeCurrentMonth WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching total month watch time:', error);
            res.status(500).send('Error fetching total month watch time');
        } else {
            res.json({ total_runtime: results[0] ? results[0].total_runtime : 0 });
        }
    });
});
app.get('/api/total-year-watch-time', (req, res) => {
    const username = req.query.username;
    db.query('SELECT total_runtime FROM TotalWatchTimeThisYear WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching total year watch time:', error);
            res.status(500).send('Error fetching year month watch time');
        } else {
            res.json({ total_runtime: results[0] ? results[0].total_runtime : 0 });
        }
    });
});
app.get('/api/user-movie-genre-counts', (req, res) => {
    const username = req.query.username;
    db.query('SELECT movieGenre_name, titles_watched FROM UserMovieGenreWatchCounts  WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching genres:', error);
            res.status(500).send('Error fetching genres');
        } else {
            res.json(results);
        }
    });
});
app.get('/api/user-tv-genre-counts', (req, res) => {
    const username = req.query.username;
    db.query('SELECT tvGenre_name, media_count FROM UserTVGenreWatchCounts  WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching genres:', error);
            res.status(500).send('Error fetching genres');
        } else {
            res.json(results);
        }
    });
});
app.get('/api/user-watched-movies', (req, res) => {
    const username = req.query.username;
    db.query('SELECT * FROM UserMovieWatchDetails WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching movies watched:', error);
            res.status(500).send('Error fetching movies watched');
        } else {
            res.json(results);
        }
    });
});
app.get('/api/user-watched-episodes', (req, res) => {
    const username = req.query.username;
    db.query('SELECT * FROM UserTVWatchDetails WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching episodes watched:', error);
            res.status(500).send('Error fetching episodes watched');
        } else {
            res.json(results);
        }
    });
});
app.get('/api/movies-watched-month', (req, res) => {
    const username = req.query.username;
    db.query('SELECT * FROM UserMovieWatchDetailsCurrentMonth WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching movies watched this month:', error);
            res.status(500).send('Error fetching movies watched this month');
        } else {
            res.json(results);
        }
    });
});
app.get('/api/episodes-watched-month', (req, res) => {
    const username = req.query.username;
    db.query('SELECT * FROM UserTVWatchDetailsCurrentMonth WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching episodes watched this month:', error);
            res.status(500).send('Error fetching episodes watched this month');
        } else {
            res.json(results);
        }
    });
});

app.get('/api/movies-watched-year', (req, res) => {
    const username = req.query.username;
    db.query('SELECT * FROM UserMovieWatchDetailsCurrentYear WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching movies watched this year:', error);
            res.status(500).send('Error fetching movies watched this year');
        } else {
            res.json(results);
        }
    });
});
app.get('/api/episodes-watched-year', (req, res) => {
    const username = req.query.username;
    db.query('SELECT * FROM UserTVWatchDetailsCurrentYear WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching episodes watched this year:', error);
            res.status(500).send('Error fetching episodes watched this year');
        } else {
            res.json(results);
        }
    });
});
app.get('/api/movies-by-rating', (req, res) => {
    const username = req.query.username;
    db.query('SELECT * FROM UserTopRatedMovies WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching movies by rating:', error);
            res.status(500).send('Error fetching movies by rating');
        } else {
            res.json(results);
        }
    });
});
app.get('/api/episodes-by-rating', (req, res) => {
    const username = req.query.username;
    db.query('SELECT * FROM UserTopRatedTV WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching episodes by rating:', error);
            res.status(500).send('Error fetching episodes by rating');
        } else {
            res.json(results);
        }
    });
});

app.get('/api/top-movies-month', (req, res) => {
    const username = req.query.username;
    db.query('SELECT * FROM UserTopRatedMoviesCurrentMonth WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching movies by rating for current month:', error);
            res.status(500).send('Error fetching movies by rating for current month');
        } else {
            res.json(results);
        }
    });
});
app.get('/api/top-episodes-month', (req, res) => {
    const username = req.query.username;
    db.query('SELECT * FROM UserTopRatedTVCurrentMonth WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching episodes by rating for current month:', error);
            res.status(500).send('Error fetching episodes by rating for current month');
        } else {
            res.json(results);
        }
    });
});
app.get('/api/top-movies-year', (req, res) => {
    const username = req.query.username;
    db.query('SELECT * FROM UserTopRatedMoviesCurrentYear WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching movies by rating for current year:', error);
            res.status(500).send('Error fetching movies by rating for current year');
        } else {
            res.json(results);
        }
    });
});
app.get('/api/top-episodes-year', (req, res) => {
    const username = req.query.username;
    db.query('SELECT * FROM UserTopRatedTVCurrentYear WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching episodes by rating for current year:', error);
            res.status(500).send('Error fetching episodes by rating for current year');
        } else {
            res.json(results);
        }
    });
});
app.post('/api/accounts', (req, res) => {
    const newData = req.body;
    db.query('INSERT INTO accounts SET ?', newData, (error, results) => {
        if (error) throw error;
        res.send('Data added successfully');
    });
});

app.post('/api/UserMovies', async (req, res) => {
    const {username, movieData, date_watched, rating} = req.body;

    try {
        await db.query('INSERT INTO movies (movie_id, movie_name, average_rating, poster_path, runtime, release_date) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE movie_id=movie_id', 
            [movieData.id, movieData.title, movieData.vote_average, movieData.poster_path, movieData.runtime, movieData.release_date]);

        for (const genre of movieData.genres) {
            await db.query('INSERT IGNORE INTO movieGenres (movieGenre_id, movieGenre_name) VALUES (?, ?)', [genre.id, genre.name]);
            await db.query('INSERT IGNORE INTO MovieGenreAssociations (movie_id, genre_id) VALUES (?, ?)', [movieData.id, genre.id]);
        }

        await db.query('INSERT INTO UserMovies (username, movie_id, date_watched, user_rating) VALUES (?, ?, ?, ?)', [username, movieData.id, date_watched, rating]);
        
        res.send('Movie and user watch data added successfully');
    } catch (error) {
        console.error('Error adding movie to watched:', error);
        res.status(500).send('Error adding movie to watched');
    }
});

app.post('/api/UserTV', async (req, res) => {
    const { username, showDetails, tvShowData, season_number, episode_number, date_watched, user_rating } = req.body;

    try {
        // Insert TV show data
        await db.query(
            'INSERT INTO tvShows (show_id, show_name, average_rating, poster_path, number_of_seasons, number_of_episodes) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE show_id=show_id',
            [showDetails.id, showDetails.name, showDetails.vote_average, showDetails.poster_path, showDetails.number_of_seasons, showDetails.number_of_episodes]
        );

        // Insert TV show genres
        for (const genre of showDetails.genres) {
            await db.query('INSERT IGNORE INTO tvGenres (tvGenre_id, tvGenre_name) VALUES (?, ?)', [genre.id, genre.name]);
            await db.query('INSERT IGNORE INTO TVGenreAssociations (show_id, tvGenre_id) VALUES (?, ?)', [showDetails.id, genre.id]);
        }

        // Insert episode data
        await db.query(
            'INSERT INTO episodes (show_id, season_number, episode_number, episode_name, date_aired, vote_average, still_path, runtime) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE episode_number=episode_number',
            [showDetails.id, season_number, episode_number, tvShowData.name, tvShowData.air_date, tvShowData.vote_average, tvShowData.still_path, tvShowData.runtime]
        );

        // Insert user TV watch data
        await db.query('INSERT INTO UserTV (username, show_id, season_number, episode_number, date_watched, user_rating) VALUES (?, ?, ?, ?, ?, ?)', [username, showDetails.id, season_number, episode_number, date_watched, user_rating]);

        res.send('TV show episode and user watch data added successfully');
    } catch (error) {
        console.error('Error adding TV show episode to watched:', error);
        res.status(500).send('Error adding TV show episode to watched');
    }
});


// NEED TO ALTER
app.delete('/api/accounts/:username', (req, res) => {
    const username = req.params.username;
    db.query('DELETE FROM accounts WHERE username = ?', username, (error, results) => {
        if (error) {
            console.error('Error deleting account:', error);
            res.status(500).send('Error deleting account');
        } else {                                     
            if (results.affectedRows > 0) {
                res.send('Account deleted successfully');
            } else {
                res.status(404).send('Account not found');
            }
        }
    });
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
}); 