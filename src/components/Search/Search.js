// Import necessary React libraries and hooks, navigation and themoviedb API
import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import theMovieDb from '../Utils/themoviedb';
import { fetchThemeMode, fetchParticlesMode } from '../../services/database';
import { useUsername } from '../Contexts/UsernameContext';
import './Search.css';

/**
 * Search Component
 *
 * Provides a UI for searching movies, TV shows, and people using The Movie Database (TMDb) API.
 * Displays search results with relevant information and navigates to detailed pages.
 *
 * @returns {JSX.Element} - The JSX structure of the Search component.
 */
function Search(props) {
    const navigate = useNavigate();
    // State hooks for managing search results, type of search, and UI focus/hover states
    const { username, setUsername } = useUsername();
    const [searchResults, setSearchResults] = useState([]);
    const [searchType, setSearchType ] = useState('movie');
    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

     /**
     * getSearch Function
     *
     * Handles changes to the search input, triggering an API call to TMDb based on the current search type.
     *
     * @param {Object} event - The input event object from onKeyUp.
     * @returns {void}
     */
    function getSearch(event) {
        const query = event.target.value;
        if (query.trim() !== '') {
            if (searchType === 'movie') {
                theMovieDb.search.getMovie({ "query": encodeURIComponent(query) }, successCB, errorCB);
            } else if (searchType === 'tv') {
                theMovieDb.search.getTv({ "query": encodeURIComponent(query) }, successCB, errorCB);
            } else if (searchType === 'person') {
                theMovieDb.search.getPerson({ "query": encodeURIComponent(query) }, successCB, errorCB);
            }
        } else {
            setSearchResults([]);
        }
    }
    
    /**
     * handleSearchType Function
     *
     * Updates the type of search based on a select dropdown.
     *
     * @param {Object} event - The select event object from onChange.
     * @returns {void}
     */
    function handleSearchType(event) {
        setSearchType(event.target.value);
    }

   /**
     * truncateText Function
     *
     * Utility function to truncate text to a specified maximum length.
     *
     * @param {string} text - The text to be truncated.
     * @param {int} maxLength - The maximum allowed length for the text.
     * @returns {string} - The truncated text, with "..." appended if necessary.
     */
    function truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
      }
    
    /**
     * getYear Function
     *
     * Extracts the year from movie or TV show data.
     *
     * @param {string} searchType - The type of search ("movie" or "tv").
     * @param {Object} result - The result object containing the relevant data.
     * @returns {string} - The year extracted from the data, or "N/A" if not available.
     */
    function getYear(searchType, result) {
        if (result !== '') {
            if (searchType === 'movie') {
                if (result.release_date && result.release_date.length >= 4) {
                    return result.release_date.substring(0, 4);
                }
            } else {
                if (result.first_air_date && result.first_air_date.length >= 4) {
                    return result.first_air_date.substring(0, 4);
                }
            }
        } else {

            return null;
        }
        
        return "N/A"; 
    }

     /**
     * successCB Function
     *
     * Callback function for a successful API call to TMDb, updating search results.
     *
     * @param {string} data - The raw data returned from the API call.
     * @returns {void}
     */
    function successCB(data) {
        const parsedData = JSON.parse(data);
        // Shows max of 5 results
        if (parsedData.results && parsedData.results.length > 0) {
            if (searchType == 'person') {
                setSearchResults(parsedData.results[0].known_for.slice(0,10));
            }
            else{
                setSearchResults(parsedData.results.slice(0,10));
            }
        }
    }

    const [particlesMode, setParticlesMode] = useState();
    const [particlesColor, setParticlesColor] = useState();
    const [themeMode, setThemeMode] = useState();
    useEffect(() => {
        fetchUserSettings();
      }, [username]);
    const fetchUserSettings = async () => {
        const fetchedParticlesMode = await fetchParticlesMode(username);
        const fetchedThemeMode = await fetchThemeMode(username);
        setParticlesMode(fetchedParticlesMode.particles_mode);
        setThemeMode(fetchedThemeMode.theme_mode);
        setParticlesColor('light' === fetchedThemeMode.theme_mode ? props.primary : props.secondary);
        const element = document.body;
        element.dataset.bsTheme = fetchedThemeMode.theme_mode;
        console.log(fetchThemeMode)
    }
    
   /**
     * errorCB Function
     *
     * Callback function for a failed API call, logging an error message.
     *
     * @param {string} error - The error message returned from the API call.
     * @returns {void}
     */
    function errorCB(error) {
        console.error('Error fetching data:', error);
    }
    
     // UI rendering with search bar, select dropdown, and search results list
    return (
        <div style={{flexGrow: "3"}} onBlur={() => setIsFocused(false)} onFocus={() => setIsFocused(true)}>
            <div className="search-bar-container">
            <input className="search-bar" id="searchbar" onKeyUp={getSearch} type="text" name="search" placeholder={"Search "+searchType} />
            <select value={searchType} onChange={handleSearchType}>
                <option value="movie">movie</option>
                <option value="tv">tv</option>
                <option value="person">person</option>
            </select>
            </div>
            <ul className ="search-results-list" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} style ={{display: searchResults.length === 0 || (!isFocused && !isHovered) ? 'none' : 'flex'}}>
                {searchResults.map(result => (
                    searchType === 'person' ? ( 
                    <div className = "search-result-item" style={{backgroundColor: themeMode === "dark" ? props.accent1 : "whitesmoke"}} key={result.id} onClick={()=>navigate(`/details/${result.media_type}/${result.id}`)}>
                        <div className='title-year-box'>
                            <span className="title">{result.media_type === 'tv' ? result.name : result.title }</span>
                            <span className="year">{getYear(result.media_type, result)}</span>
                        </div>
                        <span className="overview">{truncateText(result.overview, 150)}</span>
                        <img className="movie-poster"src={`https://image.tmdb.org/t/p/w200${result.poster_path}`} alt="Media Poster" />
                    </div>
                    ) : (
                        <div className = "search-result-item" key={result.id} onClick={()=>navigate(`/details/${searchType}/${result.id}`)}>
                            <div className='title-year-box'>
                                <span className="title">{searchType === 'tv' ? result.name : result.title }</span>
                            
                                <span className="year">{getYear(searchType, result)}</span>
                            </div>
                            <div className='overview-box'>
                                <span className="overview">{truncateText(result.overview, 150)}</span>
                            </div>
                            <img className="movie-poster" src={`https://image.tmdb.org/t/p/w200${result.poster_path}`} alt="Media Poster" />
                        </div>
                    )
            ))}
                 
            </ul>
        </div>
    );
}

export default Search;