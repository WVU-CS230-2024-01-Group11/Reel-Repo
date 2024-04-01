import axios from "axios";

export const getMovieWatchProviders = async (movieId) => {
    const options = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`,
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOTAyMjU0NmUzNWUyMTk5NGU2MGQwZTAyMjgyZDhjNSIsInN1YiI6IjY1YjZhNTdjOWJhODZhMDE3YmY4NjZmYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Zjg68BLPsPqoqmEDYZTZU6wuNNjJRT4bzEbLwvzVn_w',
        }
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch(error) {
        console.error(error);
        return null;
    }
};

export const getTVWatchProviders = async (tvId) => {
    const options = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/tv/${tvId}/watch/providers`,
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOTAyMjU0NmUzNWUyMTk5NGU2MGQwZTAyMjgyZDhjNSIsInN1YiI6IjY1YjZhNTdjOWJhODZhMDE3YmY4NjZmYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Zjg68BLPsPqoqmEDYZTZU6wuNNjJRT4bzEbLwvzVn_w',
        }
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch(error) {
        console.error(error);
        return null;
    }
};