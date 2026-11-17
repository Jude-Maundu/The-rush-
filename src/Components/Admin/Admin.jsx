import React, { useCallback, useEffect, useState } from 'react';
import api from '../../services/api';

function Admin() {

    const [overview, setOverview] = useState({});
    const [reviews, setReviews] = useState([]);
    const [movies, setMovies] = useState([]);

    const [sort, setSort] = useState('newest');
    const [activeTab, setActiveTab] = useState('overview');

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [movieForm, setMovieForm] = useState({
        title: '',
        year: '',
        genre: '',
        poster: '',
        backdrop: '',
        description: '',
        trailer: '',
        director: ''
    });

    const loadDashboard = useCallback(async () => {
        try {
            const result = await api.adminOverview();
            setOverview(result.overview || {});
            const reviewResult = await api.adminReviews(sort);
            setReviews(reviewResult.reviews || []);
            setError('');
        } catch (err) {
            setError(err.message);
        }
    }, [sort]);

    const loadMovies = useCallback(async () => {
        try {
            const result = await api.movies();
            setMovies(result.movies || []);
        } catch (err) {
            setError(err.message);
        }
    }, []);

    useEffect(() => {
        loadDashboard();
        loadMovies();
    }, [loadDashboard, loadMovies]);

    async function addMovie(e) {

        e.preventDefault();

        try {

            await api.addMovie({
                ...movieForm,
                year: Number(movieForm.year)
            });

            setMessage('Movie added successfully.');

            setMovieForm({
                title: '',
                year: '',
                genre: '',
                poster: '',
                backdrop: '',
                description: '',
                trailer: '',
                director: ''
            });

            await loadMovies();

        } catch (err) {
            setError(err.message);
        }
    }

    async function deleteMovie(id) {

        if (!window.confirm('Delete this movie?')) return;

        try {
            await api.deleteMovie(id);
            setMovies(previous =>
                previous.filter(movie => (movie._id || movie.id) !== id)
            );
            setMessage('Movie deleted successfully.');
        } catch (err) {
            setError(err.message);
        }
    }

    async function deleteReview(id) {

        if (!window.confirm('Delete this review?')) return;

        try {
            await api.deleteReview(id);
            setReviews(previous =>
                previous.filter(review => review.id !== id)
            );
            setMessage('Review deleted successfully.');
        } catch (err) {
            setError(err.message);
        }
    }

    return (

        <div
            className="container-fluid px-3 px-lg-5 py-5"
            style={{
                background: '#050505',
                minHeight: '100vh'
            }}
        >

            <h2 className="text-white fw-bold mb-1">
                Admin <span style={{ color: '#D6FF00' }}>Dashboard</span>
            </h2>

            <p className="text-secondary mb-5">
                Manage your streaming platform.
            </p>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row g-3 mb-5">

                {[
                    ['Members', overview.userCount || 0, 'bi-people'],
                    ['Reviews', overview.reviewCount || 0, 'bi-chat-left-text'],
                    ['Average Rating', `${overview.averageRating || 0}/5`, 'bi-star'],
                    ['Movies', movies.length, 'bi-film']
                ].map(([label, value, icon]) => (

                    <div className="col-6 col-lg-3" key={label}>

                        <div className="rounded p-4 bg-dark h-100">

                            <i className={`bi ${icon} fs-3`}
                                style={{ color: '#D6FF00' }}>
                            </i>

                            <h3 className="text-white fw-bold mt-3">
                                {value}
                            </h3>

                            <span className="text-secondary">
                                {label}
                            </span>

                        </div>

                    </div>

                ))}

            </div>

            <div className="d-flex gap-2 flex-wrap mb-4">

                {['overview', 'movies', 'reviews', 'users'].map(tab => (

                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className="btn text-capitalize"
                        style={{
                            background: activeTab === tab ? '#D6FF00' : '#222',
                            color: activeTab === tab ? '#000' : '#fff'
                        }}
                    >
                        {tab}
                    </button>

                ))}

            </div>

            {activeTab === 'overview' && (

                <div className="bg-dark rounded p-4">

                    <h5 className="text-white mb-3">
                        Platform Overview
                    </h5>

                    <p className="text-secondary">
                        Welcome to your SHARPMOVIES administration panel.
                    </p>

                </div>

            )}

            {activeTab === 'movies' && (

                <div className="bg-dark rounded p-4">

                    <h5 className="text-white mb-4">
                        Add New Movie
                    </h5>

                    <form onSubmit={addMovie}>

                        <div className="row g-3">

                            {Object.keys(movieForm).map(field => (

                                <div className="col-md-6" key={field}>

                                    <label className="form-label text-white text-capitalize">
                                        {field}
                                    </label>

                                    {field === 'description' ? (

                                        <textarea
                                            className="form-control bg-black text-white border-secondary"
                                            rows="3"
                                            value={movieForm[field]}
                                            onChange={e => setMovieForm({
                                                ...movieForm,
                                                [field]: e.target.value
                                            })}
                                            required
                                        />

                                    ) : (

                                        <input
                                            type={field === 'year' ? 'number' : 'text'}
                                            className="form-control bg-black text-white border-secondary"
                                            value={movieForm[field]}
                                            onChange={e => setMovieForm({
                                                ...movieForm,
                                                [field]: e.target.value
                                            })}
                                            required
                                        />

                                    )}

                                </div>

                            ))}

                        </div>

                        <button
                            className="btn fw-bold mt-4"
                            style={{ background: '#D6FF00' }}
                        >
                            ADD MOVIE
                        </button>

                    </form>

                    <hr className="border-secondary my-5" />

                    <h5 className="text-white mb-3">
                        Existing Movies
                    </h5>

                    {movies.map(movie => (

                        <div
                            key={movie._id || movie.id}
                            className="d-flex justify-content-between align-items-center border-bottom border-secondary py-3"
                        >

                            <span className="text-white">
                                {movie.title}
                            </span>

                            <button
                                onClick={() => deleteMovie(movie._id || movie.id)}
                                className="btn btn-outline-danger btn-sm"
                            >
                                <i className="bi bi-trash"></i>
                            </button>

                        </div>

                    ))}

                </div>

            )}

            {activeTab === 'reviews' && (

                <div className="bg-dark rounded p-4">

                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <h5 className="text-white">Manage Reviews</h5>

                        <select
                            className="form-select bg-black text-white border-secondary"
                            style={{ maxWidth: '170px' }}
                            value={sort}
                            onChange={e => setSort(e.target.value)}
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                            <option value="highest">Highest rated</option>
                            <option value="lowest">Lowest rated</option>
                        </select>

                    </div>

                    {reviews.map(review => (

                        <div
                            key={review.id}
                            className="border-bottom border-secondary py-3"
                        >

                            <div className="d-flex justify-content-between">

                                <div>

                                    <h6 className="text-white">
                                        {review.name}
                                    </h6>

                                    <span style={{ color: '#D6FF00' }}>
                                        {'★'.repeat(review.rating)}
                                    </span>

                                </div>

                                <button
                                    onClick={() => deleteReview(review.id)}
                                    className="btn btn-outline-danger btn-sm"
                                >
                                    Delete
                                </button>

                            </div>

                            <p className="text-secondary mt-2 mb-0">
                                {review.body}
                            </p>

                        </div>

                    ))}

                </div>

            )}

            {activeTab === 'users' && (

                <div className="bg-dark rounded p-4">

                    <h5 className="text-white">
                        User Management
                    </h5>

                    <p className="text-secondary">
                        User management API will be connected when the
                        backend user-list endpoint is implemented.
                    </p>

                </div>

            )}

        </div>
    );
}

export default Admin;