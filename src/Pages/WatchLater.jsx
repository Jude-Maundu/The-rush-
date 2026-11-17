import React, { useEffect, useState } from 'react';
import MovieCard from '../Components/MovieCard';

function WatchLater() {

    const [movies, setMovies] = useState([]);

    useEffect(() => {
        setMovies(JSON.parse(localStorage.getItem('watchLater') || '[]'));
    }, []);

    function removeMovie(movie) {

        const updated = movies.filter(
            item => (item._id || item.id) !== (movie._id || movie.id)
        );

        setMovies(updated);
        localStorage.setItem('watchLater', JSON.stringify(updated));
    }

    return (

        <div className="container-fluid px-4 py-5"
            style={{ background: '#050505', minHeight: '100vh' }}>

            <h2 className="text-white fw-bold mb-2">
                My <span style={{ color: '#D6FF00' }}>Watchlist</span>
            </h2>

            <p className="text-secondary mb-5">
                Movies you have saved to watch later.
            </p>

            {movies.length ? (

                <div className="row g-3">

                    {movies.map(movie => (

                        <div className="col-6 col-md-3 col-lg-2"
                            key={movie._id || movie.id}>

                            <MovieCard movie={movie} />

                            <button
                                onClick={() => removeMovie(movie)}
                                className="btn btn-outline-danger btn-sm w-100 mt-2"
                            >
                                <i className="bi bi-trash me-2"></i>
                                Remove
                            </button>

                        </div>

                    ))}

                </div>

            ) : (

                <div className="text-center text-secondary py-5">
                    <i className="bi bi-bookmark display-2"></i>
                    <h5 className="mt-3">Your watchlist is empty</h5>
                    <p>Save movies to find them here.</p>
                </div>

            )}

        </div>
    );
}

export default WatchLater;