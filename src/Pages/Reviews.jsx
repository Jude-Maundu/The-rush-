import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

async function fetchReviews(sort) {
    const result = await api.reviews(sort);
    return result.reviews || [];
}

function Reviews() {

    const [reviews, setReviews] = useState([]);
    const [sort, setSort] = useState('newest');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    let user = null;
    try {
        user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    } catch {
        localStorage.removeItem('currentUser');
    }

    useEffect(() => {
        let active = true;

        fetchReviews(sort)
            .then(nextReviews => {
                if (!active) return;
                setReviews(nextReviews);
                setError('');
            })
            .catch(err => {
                if (active) setError(err.message);
            });

        return () => {
            active = false;
        };
    }, [sort]);

    async function submitReview(e) {
        e.preventDefault();

        try {
            await api.addReview({
                rating: Number(rating),
                body: comment.trim()
            });

            setComment('');
            setMessage('Your review has been submitted.');
            setError('');
            setReviews(await fetchReviews(sort));

        } catch (err) {
            setError(err.message);
        }
    }

    return (

        <div className="container py-5"
            style={{ background: '#050505', minHeight: '100vh' }}>

            <h2 className="text-white fw-bold mb-2">
                Movie <span style={{ color: '#D6FF00' }}>Reviews</span>
            </h2>

            <p className="text-secondary mb-5">
                Share your thoughts and see what others think.
            </p>

            {!user && (
                <div className="alert alert-dark border-secondary mb-4">
                    Want to share your thoughts? <Link to="/signin" className="text-lime">Sign in</Link>
                    {' '}or <Link to="/signup" className="text-lime">sign up</Link> to leave a review.
                </div>
            )}

            {user && (

                <div className="bg-dark p-4 rounded mb-5">

                    <h5 className="text-white mb-4">Write a review</h5>

                    <form onSubmit={submitReview}>

                        <div className="mb-3">

                            <label className="form-label text-white">
                                Your Rating
                            </label>

                            <select
                                className="form-select bg-black text-white border-secondary"
                                value={rating}
                                onChange={e => setRating(e.target.value)}
                            >
                                {[5, 4, 3, 2, 1].map(value => (
                                    <option key={value} value={value}>
                                        {value} / 5
                                    </option>
                                ))}
                            </select>

                        </div>

                        <div className="mb-3">

                            <label className="form-label text-white">
                                Your Feedback
                            </label>

                            <textarea
                                className="form-control bg-black text-white border-secondary"
                                rows="4"
                                maxLength="500"
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                required
                            />

                        </div>

                        <button
                            className="btn fw-bold"
                            style={{ background: '#D6FF00' }}
                        >
                            Submit Review
                        </button>

                    </form>

                </div>

            )}

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h5 className="text-white">Community Reviews</h5>

                <select
                    className="form-select bg-dark text-white border-secondary"
                    style={{ maxWidth: '180px' }}
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="highest">Highest rated</option>
                    <option value="lowest">Lowest rated</option>
                </select>

            </div>

            {reviews.length ? reviews.map(review => (

                <div key={review.id} className="bg-dark p-4 rounded mb-3">

                    <div className="d-flex justify-content-between">

                        <h6 className="text-white">
                            {review.name}
                        </h6>

                        <small className="text-secondary">
                            {new Date(review.createdAt).toLocaleDateString()}
                        </small>

                    </div>

                    <div style={{ color: '#D6FF00' }}>
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                    </div>

                    <p className="text-secondary mt-2 mb-0">
                        {review.body}
                    </p>

                </div>

            )) : (

                !error && (
                    <p className="text-secondary">
                        No reviews yet.
                    </p>
                )

            )}

        </div>
    );
}

export default Reviews;