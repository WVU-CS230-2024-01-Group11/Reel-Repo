// Client side of MySQL server connection

import axios from 'axios';

// Define base URL for API requests
const baseURL = 'http://localhost:3001/api';

// ACCOUNT TABLE:
    // Table name: accounts
      // Columns: username (string, passed in), id(integer, SQL generated), firstname(string, passed in),
      // lastname(string, passed in), email (string, passed in), password(string, passed in)

export const fetchAccountData = async () => {
  /*
    Function to fetch account data from the server
    Called like: const data = await fetchAccountData();
    data automatically in JSON format
    */
  try {
    const response = await axios.get(`${baseURL}/accounts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
export const fetchUsernames = async () => {
  try {
      const response = await axios.get(`${baseURL}/accounts/usernames`);
      return response.data; // Returns an array of objects with username
  } catch (error) {
      console.error('Error fetching usernames:', error);
      throw error;
  }
};
export const fetchEmails = async () => {
  try {
      const response = await axios.get(`${baseURL}/accounts/emails`);
      return response.data; // Returns an array of objects with email
  } catch (error) {
      console.error('Error fetching emails:', error);
      throw error;
  }
};
   
export const addNewAccount = async (newData) => {
   /*
    Add new account to server
    Create new object of a user, pass in params like a JSON file: 
        username: username value,
        firstname: firstname value,
        etc.
    Then pass that object into addNewAccount
    */
  try {
    const response = await axios.post(`${baseURL}/accounts`, newData);
    return response.data;
  } catch (error) {
    console.error('Error adding data:', error);

  }
};

export const deleteAccount = async (username) => {
  try {
      const response = await axios.delete(`${baseURL}/accounts/${username}`);
      return response.data;
  } catch (error) {
      console.error('Error deleting account:', error);
  }
};

export const addMovieToWatched =  async (movieData) => {

  try {
    const response = await axios.post(`${baseURL}/UserMovies`, movieData);
    return response.data;
  } catch(error) {
      console.error("Error adding movie to watched: ", error);
  }
};

export const addEpisodeToWatched =  async (episodeData) => {

  try {
    const response = await axios.post(`${baseURL}/UserTV`, episodeData);
    return response.data;
  } catch(error) {
      console.error("Error adding episode to watched: ", error);
  }
};

export const totalMovieWatchTime = async (username) => {
  try{
    const response = await axios.get(`${baseURL}/total-user-watch-time`, { params: { username } });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie watch time:', error);
  }
};
export const totalTVWatchTime = async (username) => {
  try{
    const response = await axios.get(`${baseURL}/total-tv-watch-time`, { params: { username } });
    return response.data;
  } catch (error) {
    console.error('Error fetching tv watch time:', error);
  }
};

export const totalWatchTime = async (username) => {
  try{
    const response = await axios.get(`${baseURL}/total-watch-time`, { params: { username } });
    return response.data;
  } catch (error) {
    console.error('Error fetching watch time:', error);
  }
};
export const totalWatchTimeMonth = async (username) => {
  try{
    const response = await axios.get(`${baseURL}/total-month-watch-time`, { params: { username } });
    return response.data;
  } catch (error) {
    console.error('Error fetching watch time:', error);
  }
};
export const totalWatchTimeYear = async (username) => {
  try{
    const response = await axios.get(`${baseURL}/total-year-watch-time`, { params: { username } });
    return response.data;
  } catch (error) {
    console.error('Error fetching watch time:', error);
  }
};
export const movieGenreCounts = async (username) => {
  try{
    const response = await axios.get(`${baseURL}/user-movie-genre-counts`, { params: { username } });
    return response.data;
  } catch (error) {
    console.error('Error fetching genres:', error);
  }
};
export const TVGenreCounts = async (username) => {
  try{
    const response = await axios.get(`${baseURL}/user-tv-genre-counts`, { params: { username } });
    return response.data;
  } catch (error) {
    console.error('Error fetching genres:', error);
  }
};

export const allWatchedMovies = async (username) => {
  try {
    const response = await axios.get(`${baseURL}/user-watched-movies`, { params: { username } });
    return response.data;
  } catch (error) {
    console.error('Error fetching all watched movies:', error);
  }
};

export const allWatchedEpisodes = async (username) => {
  try {
    const response = await axios.get(`${baseURL}/user-watched-episodes`, { params: { username } });
    return response.data;
  } catch (error) {
    console.error('Error fetching all watched episodes:', error);
  }
};

export const moviesWatchedMonth = async (username) => {
  try {
    const response = await axios.get(`${baseURL}/movies-watched-month`, { params: { username } });
    return response.data;
  } catch (error) {
    console.error('Error fetching all watched movies this month:', error);
  }
};

export const TVWatchedMonth = async (username) => {
  try {
    const response = await axios.get(`${baseURL}/episodes-watched-month`, { params: { username } });
    return response.data;
  } catch (error) {
    console.error('Error fetching all watched episodes this month:', error);
  }
};

export const moviesWatchedYear = async (username) => {
  try {
    const response = await axios.get(`${baseURL}/movies-watched-year`, { params: { username } });
    return response.data;
  } catch (error) {
    console.error('Error fetching all watched movies this year:', error);
  }
};

export const TVWatchedYear = async (username) => {
  try {
    const response = await axios.get(`${baseURL}/episodes-watched-year`, { params: { username } });
    return response.data;
  } catch (error) {
    console.error('Error fetching all watched episodes this year:', error);
  }
};

export const moviesByRating = async (username) => {
  try {
    const response = await axios.get(`${baseURL}/movies-by-rating`, { params: { username } });
    return response.data;
  } catch (error) {
    console.error('Error fetching movies by rating:', error);
  }
};
export const TVByRating = async (username) => {
  try {
    const response = await axios.get(`${baseURL}/episodes-by-rating`, { params: { username } });
    return response.data;
  } catch (error) {
    console.error('Error fetching episodes by rating:', error);
  }
};
export const topMoviesMonth = async (username) => {
  try {
    const response = await axios.get(`${baseURL}/top-movies-month`, { params: { username } });
    return response.data;
  } catch (error) {
    console.error('Error fetching movies by rating this month:', error);
  }
};
export const topTVMonth = async (username) => {
  try {
    const response = await axios.get(`${baseURL}/top-episodes-month`, { params: { username } });
    return response.data;
  } catch (error) {
    console.error('Error fetching episodes by rating this month:', error);
  }
};
export const topMoviesYear = async (username) => {
  try {
    const response = await axios.get(`${baseURL}/top-movies-year`, { params: { username } });
    return response.data;
  } catch (error) {
    console.error('Error fetching movies by rating this year:', error);
  }
};
export const topTVYear = async (username) => {
  try {
    const response = await axios.get(`${baseURL}/top-episodes-year`, { params: { username } });
    return response.data;
  } catch (error) {
    console.error('Error fetching episodes by rating this year:', error);
  }
};

export const sendFriendRequest = async (requester, receiver) => {
  try {
      const response = await axios.post(`${baseURL}/send-friend-request`, { requester, receiver });
      return response.data;
  } catch (error) {
      console.error('Error sending friend request:', error);
  }
};
export const acceptFriendRequest = async (requester, receiver) => {
  try {
      const response = await axios.post(`${baseURL}/accept-friend-request`, { requester, receiver });
      return response.data;
  } catch (error) {
      console.error('Error accepting friend request:', error);
  }
};
export const getReceivedFriendRequests = async (username) => {
  try {
      const response = await axios.get(`${baseURL}/friend-requests/received`, { params: { username } });
      return response.data;
  } catch (error) {
      console.error('Error fetching received friend requests:', error);
  }
};
export const getSentFriendRequests = async (username) => {
  try {
      const response = await axios.get(`${baseURL}/friend-requests/sent`, { params: { username } });
      return response.data;
  } catch (error) {
      console.error('Error fetching sent friend requests:', error);
  }
};
export const getCurrentFriends = async (username) => {
  try {
      const response = await axios.get(`${baseURL}/friends`, { params: { username } });
      return response.data;
  } catch (error) {
      console.error('Error fetching friends:', error);
  }
};
export const declineFriendRequest = async (requester, receiver) => {
  try {
      const response = await axios.delete(`${baseURL}/friend-request`, { data: { requester, receiver } });
      return response.data;
  } catch (error) {
      console.error('Error declining friend request:', error);
  }
};
export const removeFriend = async (user1, user2) => {
  try {
    const response = await axios.delete(`${baseURL}/friends`, { data: { user1, user2 } });
      return response.data;
  } catch (error) {
      console.error('Error removing friend:', error);
  }
};
export const checkFriendship = async (user1, user2) => {
  try {
      const response = await axios.get(`${baseURL}/check-friendship`, { params: { user1, user2 } });
      return response.data;
  } catch (error) {
      console.error('Error checking friendship status:', error);
  }
};
