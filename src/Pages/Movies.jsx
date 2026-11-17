import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../Components/MovieCard';
import api from '../services/api';

function Movies() {

    const [searchParams, setSearchParams] = useSearchParams();

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [genre, setGenre] = useState('All');
    const [sort, setSort] = useState('latest');

    const genres = [
        'All', 'Action', 'Drama', 'Comedy',
        'Romance', 'Thriller', 'Adventure', 'Horror'
    ];

    useEffect(() => {

        let active = true;

        async function loadMovies() {
            try {
                setLoading(true);
                const result = await api.movies();

                if (active) {
                    setMovies(result.movies || []);
                    setError('');
                }

            } catch (err) {
                if (active) setError(err.message);
            } finally {
                if (active) setLoading(false);
            }
        }

        loadMovies();

        return () => {
            active = false;
        };

    }, []);

    const filteredMovies = movies
        .filter(movie =>
            movie.title.toLowerCase().includes(search.toLowerCase())
        )
        .filter(movie =>
            genre === 'All' ||
            movie.genre?.toLowerCase() === genre.toLowerCase()
        )
        .sort((a, b) => {
            if (sort === 'latest') return Number(b.year) - Number(a.year);
            if (sort === 'oldest') return Number(a.year) - Number(b.year);
            return a.title.localeCompare(b.title);
        });

    function handleSearch(value) {
        setSearch(value);

        if (value) {
            setSearchParams({ q: value });
        } else {
            setSearchParams({});
        }
    }

    return (

        <div className="container-fluid px-3 px-lg-5 py-5"
            style={{ background: '#050505', minHeight: '100vh' }}>

            <div className="mb-5">

                <h1 className="text-white fw-bold">
                    Explore <span style={{ color: '#D6FF00' }}>Movies</span>
                </h1>

                <p className="text-secondary">
                    Discover your next favourite movie.
                </p>

            </div>

            <div className="row g-3 mb-5">

                <div className="col-md-6">

                    <div className="input-group">

                        <span className="input-group-text bg-dark border-secondary text-white">
                            <i className="bi bi-search"></i>
                        </span>

                        <input
                            className="form-control bg-dark text-white border-secondary"
                            placeholder="Search movies..."
                            value={search}
                            onChange={e => handleSearch(e.target.value)}
                        />

                    </div>

                </div>

                <div className="col-md-3">

                    <select
                        className="form-select bg-dark text-white border-secondary"
                        value={genre}
                        onChange={e => setGenre(e.target.value)}
                    >
                        {genres.map(item => (
                            <option key={item}>{item}</option>
                        ))}
                    </select>

                </div>

                <div className="col-md-3">

                    <select
                        className="form-select bg-dark text-white border-secondary"
                        value={sort}
                        onChange={e => setSort(e.target.value)}
                    >
                        <option value="latest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                        <option value="name">Alphabetical</option>
                    </select>

                </div>

            </div>

            {loading && (
                <div className="text-center text-white py-5">
                    <div className="spinner-border" style={{ color: '#D6FF00' }}></div>
                    <p className="mt-3">Loading movies...</p>
                </div>
            )}

            {error && (
                <div className="alert alert-warning">
                    {error}
                    <p className="mb-0 small">
                        Check that your Express movie endpoint is running.
                    </p>
                </div>
            )}

            {!loading && !error && (

                <>
                    <div className="d-flex justify-content-between mb-4">

                        <h5 className="text-white">
                            All Movies
                        </h5>

                        <span className="text-secondary small">
                            {filteredMovies.length} movies
                        </span>

                    </div>

                    {filteredMovies.length ? (

                        <div className="row g-3">

                            {filteredMovies.map(movie => (
                                <MovieCard
                                    key={movie._id || movie.id}
                                    movie={movie}
                                />
                            ))}

                        </div>

                    ) : (

                        <div className="text-center text-secondary py-5">
                            <i className="bi bi-film display-3"></i>
                            <h5 className="mt-3">No movies found</h5>
                            <p>Try a different search or genre.</p>
                        </div>

                    )}
                </>

            )}

        </div>
    );
}

export default Movies;