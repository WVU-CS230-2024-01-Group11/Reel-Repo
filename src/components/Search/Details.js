import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import theMovieDb from '../Utils/themoviedb';
import './Details.css';
import Button from 'react-bootstrap/Button';
import { addEpisodeToWatched, addMovieToWatched } from '../../services/database';
import Form from 'react-bootstrap/Form';
import  Modal from 'react-bootstrap/Modal';
import { FormControl, ModalBody, ModalFooter } from 'react-bootstrap';



function Details() {
    const [mediaDetails, setMediaDetails] = useState(null);
    const [mediaType, setMediaType] = useState("");
    const [mediaId, setMediaId] = useState('');
    const [rating, setRating] = useState('');
    const [date_watched, setDateWatched] = useState('');
    const [show, setShow] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState('');
    const [selectedEpisode, setSelectedEpisode] = useState('');
    const location = useLocation();
    const username = "test";

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const pathParts = location.pathname.split('/');
        const type = pathParts[pathParts.length - 2]; 
        const id = pathParts.pop(); 
        setMediaId(id);
        setMediaType(type); 
    
        if (type === 'movie') {
            theMovieDb.movies.getById({ "id": id }, detailsSuccess, errorCB);
        } else {
            theMovieDb.tv.getById({ "id": id }, detailsSuccess, errorCB);
        }
    }, [location.pathname]);

    function detailsSuccess(details) {
        const parsedDetails = JSON.parse(details);
        setMediaDetails(parsedDetails);
    }

    function errorCB(error) {
        console.error('Error fetching data:', error);
    }

    function handleWatchedButton(event) {
        handleShow();
    }

    function submitMovieData(event) {
        event.preventDefault();
        handleClose();
        const movieData = {
            username,
            movieData: mediaDetails,
            date_watched,
            rating
        };
        addMovieToWatched(movieData);
    }

    function submitTVData(event) {
        event.preventDefault();
        handleClose();
        theMovieDb.tvEpisodes.getById({"id": mediaId, "season_number": selectedSeason, "episode_number": selectedEpisode}, successTV, errorCB);

        function successTV(details) {
            const jsonEpDetails = JSON.parse(details);
            
            const episodeData = {
                username,
                showDetails: mediaDetails,
                tvShowData: jsonEpDetails,
                season_number: selectedSeason,
                episode_number: selectedEpisode,
                date_watched,
                user_rating: rating
            };

            addEpisodeToWatched(episodeData);
        }
    }

    return (
        <div>
            {mediaDetails && (
                <>
                    {mediaType === 'movie' ? (
                        <>
                          
                           <div className="movie-details-container">
                <h1>{mediaDetails.original_title}</h1>
                <div className='movie-grid'>
                <img className='poster' src={`https://image.tmdb.org/t/p/w300${mediaDetails.poster_path}`} alt="Movie Poster" />
                <div>
                    <Button variant="success" onClick={handleWatchedButton}>I Watched This!</Button>{' '}
                    <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add to Watched Movies</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className='mb-3' controlId='ratingControl'>
                            <Form.Label>Rating (out of 10)</Form.Label>
                            <FormControl
                                type="text"
                                name="rating"
                                placeholder="10.000"
                                autoFocus
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                            />
                            </Form.Group>
                            <Form.Group className='mb-3' controlId='dateControl'>
                            <Form.Label>Date</Form.Label>
                            <FormControl
                                type="date"
                                name="date_watched"
                                value={date_watched}
                                onChange={(e) => setDateWatched(e.target.value)}
                            />

                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <ModalFooter>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={submitMovieData}>
                            Submit
                        </Button>
                    </ModalFooter>
                </Modal>
                    <Button variant="secondary">Watch Later</Button>
                    <div className='overviewDetails'>{mediaDetails.overview}</div>
                    <div className='details-grid'>
                    <div className='releaseYear'>Release year
                        <p className='releaseYearP'>{mediaDetails.release_date.substring(0, 4)}</p>
                    </div>
                    <div className='rating'>Average Rating
                        <p className='averageVote'>{mediaDetails.vote_average}</p>
                    </div>
                    <div className='genres'>Genres
                        <p className='genresP'>{mediaDetails.genres.slice(0, 3).map(genre => genre.name).join(', ')}</p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
                        </>
                    ) : (
                        <>
                <div className="tv-details-container">
                <h1>{mediaDetails.name}</h1>
                <div className="tv-grid">
                <img src={`https://image.tmdb.org/t/p/w200${mediaDetails.poster_path}`} alt="TV Show Poster" />
                <div>
                    <Button variant="success" onClick={handleWatchedButton}>I Watched an Episode!</Button>{' '}
                    <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add to Watched Movies</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className='mb-3' controlId='ratingControl'>
                            <Form.Label>Rating (out of 10)</Form.Label>
                            <FormControl
                                type="text"
                                name="rating"
                                placeholder="10.000"
                                autoFocus
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                            />
                            </Form.Group>
                            <Form.Group className='mb-3' controlId='dateControl'>
                            <Form.Label>Date</Form.Label>
                            <FormControl
                                type="date"
                                name="date_watched"
                                value={date_watched}
                                onChange={(e) => setDateWatched(e.target.value)}
                            />

                            </Form.Group>
                            <Form.Group className='mb-3' controlId='seasonControl'>
                            <Form.Label>Season</Form.Label>
                            <Form.Select
                                value={selectedSeason}
                                onChange={(e) => setSelectedSeason(e.target.value)}
                            >
                                <option value="">Select a Season</option>
                                {Array.from({ length: mediaDetails.number_of_seasons }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>Season {i + 1}</option>
                                ))}
                            </Form.Select>
                            </Form.Group>
                            <Form.Group className='mb-3' controlId='episodeControl'>
                            <Form.Label>Episode</Form.Label>
                            <Form.Select
                                value={selectedEpisode}
                                onChange={(e) => setSelectedEpisode(e.target.value)}
                                disabled={!selectedSeason} 
                            >
                                <option value="">Select an Episode</option>
                                {selectedSeason && Array.from({ length: mediaDetails.seasons[selectedSeason - 1].episode_count }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>Episode {i + 1}</option>
                                ))}
                            </Form.Select>
                            </Form.Group>

                        </Form>
                    </Modal.Body>
                    <ModalFooter>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={submitTVData}>
                            Submit
                        </Button>
                    </ModalFooter>
                </Modal>
                    <Button variant="secondary">Watch Later</Button>
                    <div className='tv-overviewDetails'>{mediaDetails.overview}</div>
                    <div className='tv-details-grid'>
                    <div className='tv-seasonsBox'>Number of seasons
                        <p className='tv-seasons'>{mediaDetails.number_of_seasons}</p>
                    </div>
                    
                    <div className='tv-ratingBox'>Average Rating
                        <p className='tv-tvRating'>{mediaDetails.vote_average}</p>
                    </div>
                    <div className='tv-episodesBox'>Episodes
                        <p className='tv-episodes'>{mediaDetails.number_of_episodes}</p>
                    </div>
                    <div className='tv-genresBox'>Genres
                        <p className='tv-tvGenres'>{mediaDetails.genres.slice(0, 3).map(genre => genre.name).join(', ')}</p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default Details;
