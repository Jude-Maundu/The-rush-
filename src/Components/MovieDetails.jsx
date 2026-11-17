import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

function MovieDetails() {

    const { id } = useParams();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {

        let active = true;

        const loadMovie = async () => {
            try {
                const result = await api.movie(id);

                if (active) {
                    setMovie(result.movie || result);
                }
            } catch (err) {
                if (active) setError(err.message);
            } finally {
                if (active) setLoading(false);
            }
        };

        loadMovie();

        return () => {
            active = false;
        };

    }, [id]);

    if (loading) {
        return <div className="text-center text-white py-5">Loading movie...</div>;
    }

    if (error || !movie) {
        return (
            <div className="container text-white py-5">
                <h3>Movie not found</h3>
                <p className="text-secondary">{error}</p>
                <Link to="/movies" className="btn btn-outline-light">
                    Back to movies
                </Link>
            </div>
        );
    }

    return (

        <div style={{ background: '#050505', minHeight: '100vh' }}>

            <section
                className="position-relative d-flex align-items-end"
                style={{
                    minHeight: '480px',
                    padding: '50px 25px',
                    backgroundImage: `
                        linear-gradient(to right, #000, rgba(0,0,0,.55), transparent),
                        linear-gradient(to top, #050505, transparent),
                        url(${movie.backdrop || movie.poster})
                    `,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >

                <div className="container-fluid">

                    <div className="col-lg-7">

                        <h1 className="display-2 fw-bold text-white">
                            {movie.title}
                        </h1>

                        <div className="d-flex gap-3 text-secondary mb-3">
                            <span>{movie.year}</span>
                            <span>{movie.genre}</span>
                            <span>{movie.duration}</span>
                            <span>{movie.rating}</span>
                        </div>

                        <p className="text-light">
                            {movie.description || movie.synopsis}
                        </p>

                        <button
                            className="btn btn-lg fw-bold rounded-pill px-4"
                            style={{
                                background: '#D6FF00',
                                color: '#000'
                            }}
                            data-bs-toggle="modal"
                            data-bs-target="#trailerModal"
                        >
                            <i className="bi bi-play-fill me-2"></i>
                            WATCH TRAILER
                        </button>

                    </div>

                </div>

            </section>

            <div className="container-fluid px-4 py-4">

                <div className="row g-4">

                    <div className="col-lg-8">

                        <h4 className="text-white mb-3">Synopsis</h4>

                        <p className="text-secondary">
                            {movie.description || movie.synopsis}
                        </p>

                        <h5 className="text-white mt-4">Cast & Crew</h5>

                        <div className="d-flex flex-wrap gap-3">

                            {(movie.cast || []).map((person, index) => (
                                <div
                                    key={index}
                                    className="bg-dark rounded p-3 text-white"
                                >
                                    {typeof person === 'string'
                                        ? person
                                        : person.name}
                                </div>
                            ))}

                        </div>

                    </div>

                    <div className="col-lg-4">

                        <div className="bg-dark rounded p-4">

                            <h5 className="text-white">Movie Information</h5>

                            <p className="text-secondary">
                                Release year: {movie.year}
                            </p>

                            <p className="text-secondary">
                                Genre: {movie.genre}
                            </p>

                            <p className="text-secondary">
                                Director: {movie.director || 'Not specified'}
                            </p>

                            <p className="text-secondary">
                                Duration: {movie.duration}
                            </p>

                        </div>

                    </div>

                </div>

            </div>

            <div
                className="modal fade"
                id="trailerModal"
                tabIndex="-1"
            >
                <div className="modal-dialog modal-xl modal-dialog-centered">
                    <div className="modal-content bg-dark">

                        <div className="modal-header border-secondary">
                            <h5 className="modal-title text-white">
                                {movie.title} - Trailer
                            </h5>

                            <button
                                className="btn-close btn-close-white"
                                data-bs-dismiss="modal"
                            ></button>
                        </div>

                        <div className="modal-body p-0">

                            {movie.trailer && (
                                <div className="ratio ratio-16x9">
                                    <iframe
                                        src={
                                            movie.trailer.includes('youtube.com/embed/')
                                                ? movie.trailer
                                                : `https://www.youtube.com/embed/${movie.trailer}`
                                        }
                                        title="Movie trailer"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )}

                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}

export default MovieDetails;