// Import necessary React libraries and hooks, navigation and themoviedb API
import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import theMovieDb from '../Utils/themoviedb';
import './Search.css';


function Search() {
    const navigate = useNavigate();
    // State hooks for managing search results, type of search, and UI focus/hover states
    const [searchResults, setSearchResults] = useState([]);
    const [searchType, setSearchType ] = useState('movie');
    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

     // Function to handle search input changes, triggers API call for non-empty queries
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
    
    // Function to handle changes in search type (movie, tv, person)
    function handleSearchType(event) {
        setSearchType(event.target.value);
    }
    // Utility function to truncate text to a specified max length
    function truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
      }
    
    // Utility function to extract the year from movie or TV show data
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

    // Callback for successful API call, updates search results
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
    
    // Callback for failed API call, logs error
    function errorCB(error) {
        console.error('Error fetching data:', error);
    }
    
    // onKeyUp calls the function getSearch
    // Unordered list of search results
        // Takes each movie and on click, navigates to the details page for it
    return (
        <div onBlur={() => setIsFocused(false)} onFocus={() => setIsFocused(true)}>
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
                    <div className = "search-result-item" key={result.id} onClick={()=>navigate(`/details/${result.media_type}/${result.id}`)}>
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