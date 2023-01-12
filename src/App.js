import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import Photo from './Photo';

const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [newImages, setNewImages] = useState(false);
  const [page, setPage] = useState(1);
  // controlled input
  const [query, setQuery] = useState('');
  // uncortolled input its not rendering by default
  const mounted = useRef(false);

  const fetchImages = async () => {
    setLoading(true);
    let url;
    const urlPage = `&page=${page}`;
    const urlQuery = `&query=${query}`;

    // if the query is not empty
    if (query) {
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
    } else {
      url = `${mainUrl}${clientID}${urlPage}`;
    }

    try {
      const reponse = await axios.get(url);
      const data = reponse.data;
      // console.log(data);
      setPhotos((oldPhotos) => {
        // if the query is not empty
        if (query && page === 1) {
          return data.results;
        } else if (query) {
          return [...oldPhotos, ...data.results];
        } else {
          return [...oldPhotos, ...data];
        }
      });
      setNewImages(false);
      setLoading(false);
    } catch (error) {
      setNewImages(false);
      console.log(error.response);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line
  }, [page]);

  useEffect(() => {
    //The main goal is not to run code inside of the useEffect on initial render, run it on second page,third page and so on....
    // if mounted.current === false
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!newImages) return;
    if (loading) return;
    setPage((oldPage) => {
      return oldPage + 1;
    });
  }, [newImages]);

  const event = () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      setNewImages(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', event);
    return () => window.removeEventListener('scroll', event);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query) return;
    if (page === 1) {
      fetchImages();
    } else {
      setPage(1);
    }
  };

  return (
    <main>
      <section className='search'>
        <form className='search-form'>
          <input
            type='text'
            placeholder='search'
            className='form-input'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type='submit' className='submit-btn' onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className='photos'>
        <div className='photos-center'>
          {photos.map((image, index) => {
            return <Photo key={index} {...image} />;
          })}
        </div>
        {loading ? <h2 className='loading'>Loading...</h2> : ''}
      </section>
    </main>
  );
}

export default App;
