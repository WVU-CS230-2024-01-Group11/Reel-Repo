// Dynamically searches movies as user types, clickable to take to further details
import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import theMovieDb from '../Utils/themoviedb';
import './Search.css';


function Search() {
    const navigate = useNavigate();
    // searchResults is the current state and setSearchResults allows it to update
    const [searchResults, setSearchResults] = useState([]);
    const [searchType, setSearchType ] = useState('movie');

    // Event is the onKeyUp, function is called in return part
    function getSearch(event) {
        const query = event.target.value;
    // API call only if the query is not empty
    if (query.trim() !== '') {
        if (searchType === 'movie') {
            theMovieDb.search.getMovie({ "query": encodeURIComponent(query) }, successCB, errorCB);
        } else if (searchType === 'tv') {
            theMovieDb.search.getTv({ "query": encodeURIComponent(query) }, successCB, errorCB);
        } else if (searchType === 'person') {
            theMovieDb.search.getPerson({ "query": encodeURIComponent(query) }, successCB, errorCB);
        }
    } else {
        // If the query is empty, clear the search results
        setSearchResults([]);
    }
    }
    
    function handleSearchType(event) {
        setSearchType(event.target.value);
    }

    function truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
      }
      
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

    function successCB(data) {
        // on successful retrieval, data is parsed and searchResults is updated
        const parsedData = JSON.parse(data);
        // Shows max of 5 results
        if (parsedData.results && parsedData.results.length > 0) {
            if (searchType == 'person') {
                setSearchResults(parsedData.results[0].known_for.slice(0,5));
            }
            else{
                setSearchResults(parsedData.results.slice(0,5));
            }
        }
    }

    function errorCB(error) {
        console.error('Error fetching data:', error);
    }
    
    // onKeyUp calls the function getSearch
    // Unordered list of search results
        // Takes each movie and on click, navigates to the details page for it
    return (
        <div className="search-container">
            <div className="search-bar-container">
            <input className="search-bar" id="searchbar" onKeyUp={getSearch} type="text" name="search" placeholder="Search movies"/>
            <select value={searchType} onChange={handleSearchType}>
                <option value="movie">Movie</option>
                <option value="tv">TV Show</option>
                <option value="person">Person</option>
            </select>
            </div>
            <ul className ={`search-results-list ${searchResults.length === 0 ? 'search-results-list-empty' : ''}`}>
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
                            <span className="overview">{truncateText(result.overview, 150)}</span>

                            <img className="movie-poster" src={`https://image.tmdb.org/t/p/w200${result.poster_path}`} alt="Media Poster" />
                        </div>
                    )
            ))}
                 
            </ul>
        </div>
    );
}

export default Search;