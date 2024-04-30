// backend; connects to database
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const util = require('util');

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
const queryAsync = util.promisify(db.query).bind(db);
db.connect(err => {
    if(err){
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database');
});

app.get('/api/accounts', (req, res) => {
    queryAsync('SELECT * FROM accounts', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});
app.get('/api/accounts/usernames', (req, res) => {
    queryAsync('SELECT username FROM accounts', (error, results) => {
        if (error) {
            console.error('Error fetching usernames:', error);
            res.status(500).send('Error fetching usernames');
        } else {
            res.json(results);
        }
    });
});
app.get('/api/accounts/emails', (req, res) => {
    queryAsync('SELECT email FROM accounts', (error, results) => {
        if (error) {
            console.error('Error fetching emails:', error);
            res.status(500).send('Error fetching emails');
        } else {
            res.json(results);
        }
    });
});
app.get('/api/user-details', async (req, res) => {
    const { username } = req.query;
    try {
        const result = await queryAsync('SELECT firstname, lastname FROM accounts WHERE username = ?', [username]);
        if (result.length > 0) {
            res.json(result[0]);  
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).send('Error fetching user details');
    }
});

app.get('/api/total-user-watch-time', (req, res) => {
    const username = req.query.username;
    queryAsync('SELECT total_watch_time FROM TotalUserWatchTime WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching total watch time:', error);
            res.status(500).send('Error fetching total watch time');
        } else {
            res.json(results);
        }
    });
});
app.get('/api/total-tv-watch-time', (req, res) => {
    const username = req.query.username;
    queryAsync('SELECT total_watch_time FROM TotalEpisodeWatchTime WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching total watch time:', error);
            res.status(500).send('Error fetching total watch time');
        } else {
            res.json(results);
        }
    });
});
app.get('/api/total-watch-time', (req, res) => {
    const username = req.query.username;
    queryAsync('SELECT total_runtime FROM TotalRuntime WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching total watch time:', error);
            res.status(500).send('Error fetching total watch time');
        } else {
            res.json(results);
        }
    });
});
app.get('/api/total-month-watch-time', (req, res) => {
    const username = req.query.username;
    queryAsync('SELECT total_runtime FROM TotalWatchTimeCurrentMonth WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching total month watch time:', error);
            res.status(500).send('Error fetching total month watch time');
        } else {
            res.json(results);
        }
    });
});
app.get('/api/total-year-watch-time', (req, res) => {
    const username = req.query.username;
    queryAsync('SELECT total_runtime FROM TotalWatchTimeThisYear WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching total year watch time:', error);
            res.status(500).send('Error fetching year month watch time');
        } else {
            res.json(results);
        }
    });
});
app.get('/api/user-movie-genre-counts', (req, res) => {
    const username = req.query.username;
    queryAsync('SELECT movieGenre_name, titles_watched FROM UserMovieGenreWatchCounts  WHERE username = ?', [username], (error, results) => {
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
    queryAsync('SELECT tvGenre_name, media_count FROM UserTVGenreWatchCounts  WHERE username = ?', [username], (error, results) => {
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
    queryAsync('SELECT * FROM UserMovieWatchDetails WHERE username = ?', [username], (error, results) => {
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
    queryAsync('SELECT * FROM UserTVWatchDetails WHERE username = ?', [username], (error, results) => {
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
    queryAsync('SELECT * FROM UserMovieWatchDetailsCurrentMonth WHERE username = ?', [username], (error, results) => {
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
    queryAsync('SELECT * FROM UserTVWatchDetailsCurrentMonth WHERE username = ?', [username], (error, results) => {
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
    queryAsync('SELECT * FROM UserMovieWatchDetailsCurrentYear WHERE username = ?', [username], (error, results) => {
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
    queryAsync('SELECT * FROM UserTVWatchDetailsCurrentYear WHERE username = ?', [username], (error, results) => {
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
    queryAsync('SELECT * FROM UserTopRatedMovies WHERE username = ?', [username], (error, results) => {
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
    queryAsync('SELECT * FROM UserTopRatedTV WHERE username = ?', [username], (error, results) => {
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
    queryAsync('SELECT * FROM UserTopRatedMoviesCurrentMonth WHERE username = ?', [username], (error, results) => {
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
    queryAsync('SELECT * FROM UserTopRatedTVCurrentMonth WHERE username = ?', [username], (error, results) => {
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
    queryAsync('SELECT * FROM UserTopRatedMoviesCurrentYear WHERE username = ?', [username], (error, results) => {
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
    queryAsync('SELECT * FROM UserTopRatedTVCurrentYear WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching episodes by rating for current year:', error);
            res.status(500).send('Error fetching episodes by rating for current year');
        } else {
            res.json(results);
        }
    });
});
app.get('/api/friend-requests/received', async (req, res) => {
    const username  = req.query.username; 
     queryAsync('SELECT requester FROM friendRequests WHERE receiver = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching recieved friend requests:', error);
            res.status(500).send('Error fetching recieved friend requests');
        } else {
            res.json(results || []);
        }
     });    
});
app.get('/api/friend-requests/sent', async (req, res) => {
    const username  = req.query.username; 
    queryAsync('SELECT receiver FROM friendRequests WHERE requester = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching sent friend requests:', error);
            res.status(500).send('Error fetching sent friend requests');
        } else {
            res.json(results);
        }
     });    
});
app.get('/api/friends', async (req, res) => {
    const username  = req.query.username; 
    queryAsync(
        'SELECT user2 AS friend FROM friends WHERE user1 = ? UNION SELECT user1 AS friend FROM friends WHERE user2 = ?',
        [username, username], (error, results) => {
        if (error) {
            console.error('Error fetching friends:', error);
            res.status(500).send('Error fetching friends');
        } else {
            res.json(results);
        }
     });  
});
app.get('/api/check-friendship', (req, res) => {
    const { user1, user2 } = req.query;
    queryAsync(
        'SELECT EXISTS (SELECT 1 FROM friends WHERE (user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?)) AS isFriends',
        [user1, user2, user2, user1],
        (error, results) => {
            if (error) {
                console.error('Error checking friendship status:', error);
                res.status(500).send('Error checking friendship status');
            } else {
                res.json({ isFriends: results[0].isFriends == 1 });
            }
        }
    );
});
app.get('/api/watch-later/movies-view', async (req, res) => {
    const { user_id } = req.query;
    try {
        const movies = await queryAsync('SELECT * FROM WatchLaterMoviesView WHERE user_id = ?', [user_id]);
        res.json(movies);
    } catch (error) {
        console.error('Error fetching watch later movies view:', error);
        res.status(500).send('Error fetching watch later movies view');
    }
});
app.get('/api/watch-later/tv-view', async (req, res) => {
    const { user_id } = req.query;
    try {
        const shows = await queryAsync('SELECT * FROM WatchLaterTVView WHERE user_id = ?', [user_id]);
        res.json(shows);
    } catch (error) {
        console.error('Error fetching watch later TV view:', error);
        res.status(500).send('Error fetching watch later TV view');
    }
});
app.get('/api/recently-watched/movies', async (req, res) => {
    const { username } = req.query;
    try {
        const movies = await queryAsync('SELECT * FROM RecentlyWatchedMovies WHERE username = ?', [username]);
        res.json(movies);
    } catch (error) {
        console.error('Error fetching recently watched movies:', error);
        res.status(500).send('Error fetching recently watched movies');
    }
});
app.get('/api/recently-watched/episodes', async (req, res) => {
    const { username } = req.query;
    try {
        const episodes = await queryAsync('SELECT * FROM RecentlyWatchedEpisodes WHERE username = ?', [username]);
        res.json(episodes);
    } catch (error) {
        console.error('Error fetching recently watched episodes:', error);
        res.status(500).send('Error fetching recently watched episodes');
    }
});
app.get('/api/average-rating/episodes', async (req, res) => {
    const { username } = req.query;
    try {
        const [rating] = await queryAsync('SELECT avg_episode_rating FROM UserAverageEpisodeRating WHERE username = ?', [username]);
        res.json(rating[0]);
    } catch (error) {
        console.error('Error fetching average episode rating:', error);
        res.status(500).send('Error fetching average episode rating');
    }
});
app.get('/api/average-rating/movies', async (req, res) => {
    const { username } = req.query;
    try {
        const [rating] = await queryAsync('SELECT avg_movie_rating FROM UserAverageMovieRating WHERE username = ?', [username]);
        res.json(rating[0]);
    } catch (error) {
        console.error('Error fetching average movie rating:', error);
        res.status(500).send('Error fetching average movie rating');
    }
});
app.get('/api/top-rated/movie', async (req, res) => {
    const username = req.query.username;
    queryAsync('SELECT * FROM UserTopMovie WHERE user_id = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching total watch time:', error);
            res.status(500).send('Error fetching total watch time');
        } else {
            res.json(results);
        }
    });
});
app.get('/api/top-rated/tv-show', async (req, res) => {
    const { username } = req.query;
    try {
        const show = await queryAsync('SELECT * FROM UserTopShow WHERE user_id = ?', [username]);
        res.json(show);
    } catch (error) {
        console.error('Error fetching top rated TV show:', error);
        res.status(500).send('Error fetching top rated TV show');
    }
});
app.get('/api/watch-history/movies', async (req, res) => {
    const { username } = req.query;
    try {
        const movies = await queryAsync('SELECT * FROM UserMovieWatchHistory WHERE username = ?', [username]);
        res.json(movies);
    } catch (error) {
        console.error('Error fetching movie watch history:', error);
        res.status(500).send('Error fetching movie watch history');
    }
});
app.get('/api/watch-history/episodes', async (req, res) => {
    const { username } = req.query;
    try {
        const episodes = await queryAsync('SELECT * FROM UserEpisodeWatchHistory WHERE username = ?', [username]);
        res.json(episodes);
    } catch (error) {
        console.error('Error fetching episode watch history:', error);
        res.status(500).send('Error fetching episode watch history');
    }
});

app.get('/api/friends-top-ratings', async (req, res) => {
    const { username } = req.query;
    try {
        const results = await queryAsync('SELECT * FROM FriendsTopRatings WHERE username = ?', [username]);
        res.json(results);
    } catch (error) {
        console.error('Error fetching friends\' top ratings:', error);
        res.status(500).send('Error fetching friends\' top ratings');
    }
});

app.get('/api/user-shows-by-rating', async (req, res) => {
    const { username } = req.query;
    try {
        const shows = await queryAsync('SELECT * FROM UserAllShowsByRating WHERE user_id = ? ORDER BY avg_user_rating DESC LIMIT 5', [username]);
        res.json(shows);
    } catch (error) {
        console.error('Error fetching TV shows by user rating:', error);
        res.status(500).send('Error fetching TV shows by user rating');
    }
});

app.get('/api/movies-by-rating-max', (req, res) => {
    const username = req.query.username;
    queryAsync('SELECT * FROM UserTopRatedMovies WHERE username = ? ORDER BY highest_user_rating DESC LIMIT 5', [username], (error, results) => {
        if (error) {
            console.error('Error fetching movies by rating:', error);
            res.status(500).send('Error fetching movies by rating');
        } else {
            res.json(results);
        }
    });
});
app.get('/api/get-avatar', async (req, res) => {
    const { username } = req.query;
    try {
    const result = await queryAsync('SELECT character_icon FROM accounts WHERE username = ?', [username]);
    res.json(result);
    } catch (error) {
        console.error('Error fetching icon:', error);
    }
    
});
app.get('/api/preferences/theme-mode', async (req, res) => {
    const { username } = req.query;

    try {
        const [results] = await queryAsync('SELECT theme_mode FROM UserThemeMode WHERE username = ?', [username]);
        res.json(results[0]);
    } catch (error) {
        console.error('Error fetching theme mode:', error);
        res.status(500).send('Error fetching theme mode');
    }
});
app.get('/api/preferences/particles-mode', async (req, res) => {
    const { username } = req.query;

    try {
        const [results] = await queryAsync('SELECT particles_mode FROM UserParticlesMode WHERE username = ?', [username]);
        res.json(results[0]);
    } catch (error) {
        console.error('Error fetching particles mode:', error);
        res.status(500).send('Error fetching particles mode');
    }
});

app.post('/api/accounts', async (req, res) => {
    const newData = req.body;

    try {
        await db.query('START TRANSACTION');

        // Insert into accounts table
        await db.query('INSERT INTO accounts (username, firstname, lastname, email, password, character_icon) VALUES (?,?,?,?,?,?)', [newData.tempUsername, newData.firstName, newData.lastName, newData.email, newData.password, newData.character_icon]);

        const username = newData.tempUsername;

        // Insert default values into UserThemeMode
        await db.query('INSERT INTO UserThemeMode (username, theme_mode) VALUES (?, "light")', [username]);

        // Insert default values into UserParticlesMode
        await db.query('INSERT INTO UserParticlesMode (username, particles_mode) VALUES (?, true)', [username]);

        await db.query('COMMIT');

        res.send('Data added successfully');
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Error creating account:', error);
        res.status(500).send('Error creating account');
    }
});
app.post('/api/UserMovies', async (req, res) => {
    const {username, movieData, date_watched, rating} = req.body;

    try {

        await queryAsync('START TRANSACTION');

        await queryAsync(
            'INSERT INTO movies (movie_id, movie_name, average_rating, poster_path, runtime, release_date) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE movie_id=movie_id', 
            [movieData.id, movieData.title, movieData.vote_average, movieData.poster_path, movieData.runtime, movieData.release_date]
        );
        for (const genre of movieData.genres) {
            await queryAsync('INSERT IGNORE INTO movieGenres (movieGenre_id, movieGenre_name) VALUES (?, ?)', [genre.id, genre.name]);
            await queryAsync('INSERT IGNORE INTO MovieGenreAssociations (movie_id, genre_id) VALUES (?, ?)', [movieData.id, genre.id]);
        }

        await queryAsync('INSERT INTO UserMovies (username, movie_id, date_watched, user_rating) VALUES (?, ?, ?, ?)', [username, movieData.id, date_watched, rating]);

        await queryAsync('DELETE FROM watchLaterMovies WHERE user_id = ? AND movie_id = ?', [username, movieData.id]);
        await queryAsync('COMMIT');

        res.send('Movie and user watch data added successfully');
    } catch (error) {
        await queryAsync('ROLLBACK');
        console.error('Error adding movie to watched:', error);
        res.status(500).send('Error adding movie to watched');
    }
});


app.post('/api/UserTV', async (req, res) => {
    const { username, showDetails, tvShowData, season_number, episode_number, date_watched, user_rating } = req.body;

    try {
        await queryAsync('START TRANSACTION');

        await queryAsync(
            'INSERT INTO tvShows (show_id, show_name, average_rating, poster_path, number_of_seasons, number_of_episodes) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE show_id=show_id',
            [showDetails.id, showDetails.name, showDetails.vote_average, showDetails.poster_path, showDetails.number_of_seasons, showDetails.number_of_episodes]
        );
        for (const genre of showDetails.genres) {
            await queryAsync('INSERT IGNORE INTO tvGenres (tvGenre_id, tvGenre_name) VALUES (?, ?)', [genre.id, genre.name]);
            await queryAsync('INSERT IGNORE INTO TVGenreAssociations (show_id, tvGenre_id) VALUES (?, ?)', [showDetails.id, genre.id]);
        }

        await queryAsync(
            'INSERT INTO episodes (show_id, season_number, episode_number, episode_name, date_aired, vote_average, still_path, runtime) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE episode_number=episode_number',
            [showDetails.id, season_number, episode_number, tvShowData.name, tvShowData.air_date, tvShowData.vote_average, tvShowData.still_path, tvShowData.runtime]
        );
        await queryAsync('INSERT INTO UserTV (username, show_id, season_number, episode_number, date_watched, user_rating) VALUES (?, ?, ?, ?, ?, ?)', [username, showDetails.id, season_number, episode_number, date_watched, user_rating]);

        await queryAsync('DELETE FROM watchLaterTV WHERE user_id = ? AND show_id = ?', [username, showDetails.id]);

        await queryAsync('COMMIT');

        res.send('TV show episode and user watch data added successfully');
    } catch (error) {
        await queryAsync('ROLLBACK');
        console.error('Error adding TV show episode to watched:', error);
        res.status(500).send('Error adding TV show episode to watched');
    }
});


app.post('/api/send-friend-request', (req, res) => {
    const { requester, receiver } = req.body;
    const requestDate = new Date().toISOString().slice(0, 10);

    queryAsync('INSERT IGNORE INTO friendRequests (requester, receiver, request_date) VALUES (?, ?, ?)', [requester, receiver, requestDate], (error, results) => {
        if (error) {
            console.error('Error sending friend request:', error);
            res.status(500).send('Error sending friend request');
        } else {
            res.send('Friend request sent successfully');
        }
    });
});

app.post('/api/accept-friend-request', async (req, res) => {
    const { requester, receiver } = req.body;
    try {
        // Start a transaction
        await queryAsync('START TRANSACTION');

        const sortedUsers = [requester, receiver].sort();
        await queryAsync('INSERT INTO friends (user1, user2) VALUES (?, ?)', [sortedUsers[0], sortedUsers[1]]);
        await queryAsync('DELETE FROM friendRequests WHERE requester = ? AND receiver = ?', [requester, receiver]);

        // Commit the transaction
        await queryAsync('COMMIT');
        res.send('Friend request accepted and friendship added successfully');
    } catch (error) {
        // Rollback the transaction in case of an error
        await queryAsync('ROLLBACK');
        console.error('Error accepting friend request:', error);
        res.status(500).send('Error accepting friend request');
    }
});

app.post('/api/watch-later/movies', async (req, res) => {
    const { username, movieData } = req.body;  // Assuming movieData includes all necessary movie details

    try {
        await queryAsync('START TRANSACTION');

        // Insert or update movie details
        await queryAsync(
            'INSERT INTO movies (movie_id, movie_name, average_rating, poster_path, runtime, release_date) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE movie_id=movie_id', 
            [movieData.id, movieData.title, movieData.vote_average, movieData.poster_path, movieData.runtime, movieData.release_date]
        );

        for (const genre of movieData.genres) {
            await queryAsync('INSERT IGNORE INTO movieGenres (movieGenre_id, movieGenre_name) VALUES (?, ?)', [genre.id, genre.name]);
            await queryAsync('INSERT IGNORE INTO MovieGenreAssociations (movie_id, genre_id) VALUES (?, ?)', [movieData.id, genre.id]);
        }

        // Add to watch later list
        await queryAsync('INSERT IGNORE INTO watchLaterMovies (user_id, movie_id) VALUES (?, ?)', [username, movieData.id]);

        await queryAsync('COMMIT');
        res.send('Movie added to watch later list successfully');
    } catch (error) {
        await queryAsync('ROLLBACK');
        console.error('Error adding movie to watch later list:', error);
        res.status(500).send('Error adding movie to watch later list');
    }
});

app.post('/api/watch-later/tv', async (req, res) => {
    const { username, showDetails } = req.body;  // showDetails includes show ID and other necessary details

    try {
        await queryAsync('START TRANSACTION');

        // Insert or update TV show details
        await queryAsync(
            'INSERT INTO tvShows (show_id, show_name, average_rating, poster_path, number_of_seasons, number_of_episodes) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE show_id=show_id',
            [showDetails.id, showDetails.name, showDetails.vote_average, showDetails.poster_path, showDetails.number_of_seasons, showDetails.number_of_episodes]
        );

        // Insert genres if they are not already present and associate them with the show
        for (const genre of showDetails.genres) {
            await queryAsync('INSERT IGNORE INTO tvGenres (tvGenre_id, tvGenre_name) VALUES (?, ?)', [genre.id, genre.name]);
            await queryAsync('INSERT IGNORE INTO TVGenreAssociations (show_id, tvGenre_id) VALUES (?, ?)', [showDetails.id, genre.id]);
        }

        // Add to watch later list
        await queryAsync('INSERT IGNORE INTO watchLaterTV (user_id, show_id) VALUES (?, ?)', [username, showDetails.id]);

        await queryAsync('COMMIT');
        res.send('TV show added to watch later list successfully');
    } catch (error) {
        await queryAsync('ROLLBACK');
        console.error('Error adding TV show to watch later list:', error);
        res.status(500).send('Error adding TV show to watch later list');
    }
});

app.post('/api/update-character-icon', async (req, res) => {
    const { username, characterIcon } = req.body;
    try {
        const result = queryAsync('UPDATE accounts SET character_icon = ? WHERE username = ?', [characterIcon, username]);
        res.send({ success: true, message: 'Character icon updated successfully.' });
    } catch (error) {
        console.error('Error updating character icon:', error);
        res.status(500).send({ success: false, message: 'Failed to update character icon.' });
    }
});
app.post('/api/preferences/theme-mode', async (req, res) => {
    const { username, theme_mode } = req.body;

    try {
        await queryAsync(
            'INSERT INTO UserThemeMode (username, theme_mode) VALUES (?, ?) ON DUPLICATE KEY UPDATE theme_mode = VALUES(theme_mode)',
            [username, theme_mode]
        );
        res.send('Theme mode updated successfully');
    } catch (error) {
        console.error('Error updating theme mode:', error);
        res.status(500).send('Error updating theme mode');
    }
});
app.post('/api/preferences/particles-mode', async (req, res) => {
    const { username, particles_mode } = req.body;

    try {
        await queryAsync(
            'INSERT INTO UserParticlesMode (username, particles_mode) VALUES (?, ?) ON DUPLICATE KEY UPDATE particles_mode = VALUES(particles_mode)',
            [username, particles_mode]
        );
        res.send('Particles mode updated successfully');
    } catch (error) {
        console.error('Error updating particles mode:', error);
        res.status(500).send('Error updating particles mode');
    }
});

// NEED TO ALTER
app.delete('/api/accounts/:username', (req, res) => {
    const username = req.params.username;
    queryAsync('DELETE FROM accounts WHERE username = ?', username, (error, results) => {
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
app.delete('/api/friend-request', async (req, res) => {
    const { requester, receiver } = req.body;
    try {
        await queryAsync('DELETE FROM friendRequests WHERE requester = ? AND receiver = ?', [requester, receiver]);
        res.send('Friend request declined successfully');
    } catch (error) {
        console.error('Error declining friend request:', error);
        res.status(500).send('Error declining friend request');
    }
});
app.delete('/api/friends', async (req, res) => {
    const { user1, user2 } = req.body;
    try {
        await queryAsync(
            'DELETE FROM friends WHERE (user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?)',
            [user1, user2, user2, user1]
        );
        res.send('Friendship removed successfully');
    } catch (error) {
        console.error('Error removing friendship:', error);
        res.status(500).send('Error removing friendship');
    }
});
app.delete('/api/user-movies', async (req, res) => {
    const { username, movie_id, date_watched } = req.body;
    try {
        await queryAsync('DELETE FROM UserMovies WHERE username = ? AND movie_id = ? AND date_watched = ?', [username, movie_id, date_watched]);
        res.send('Movie entry deleted successfully');
    } catch (error) {
        console.error('Error deleting movie entry:', error);
        res.status(500).send('Error deleting movie entry');
    }
});
app.delete('/api/user-tv', async (req, res) => {
    const { username, show_id, season_number, episode_number, date_watched } = req.body;
    try {
        await queryAsync('DELETE FROM UserTV WHERE username = ? AND show_id = ? AND season_number = ? AND episode_number = ? AND date_watched = ?', [username, show_id, season_number, episode_number, date_watched]);
        res.send('TV episode entry deleted successfully');
    } catch (error) {
        console.error('Error deleting TV episode entry:', error);
        res.status(500).send('Error deleting TV episode entry');
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
}); 