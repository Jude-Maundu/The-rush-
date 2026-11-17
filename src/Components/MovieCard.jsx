import React from 'react';
import { Link } from 'react-router-dom';

function MovieCard({ movie, onWatchLater, saved = false }) {
    const movieLink = movie.id === 'the-rush'
        ? '/watch'
        : `/movie/${movie._id || movie.id}`;

    return (
        <div className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4">

            <div className="position-relative">

                <Link to={movieLink}>
                    <img
                        src={movie.poster}
                        alt={movie.title}
                        className="img-fluid rounded"
                        style={{
                            width: '100%',
                            height: '250px',
                            objectFit: 'cover'
                        }}
                    />
                </Link>

                <button
                    onClick={() => onWatchLater?.(movie)}
                    className="btn btn-dark position-absolute top-0 end-0 m-2 rounded-circle"
                    title="Watch Later"
                >
                    <i
                        className={`bi ${saved
                            ? 'bi-bookmark-check-fill'
                            : 'bi-bookmark-plus'}`}
                        style={{ color: saved ? '#D6FF00' : '#fff' }}
                    ></i>
                </button>

                <Link
                    to={movieLink}
                    className="btn btn-dark position-absolute bottom-0 start-0 m-2 rounded-circle"
                >
                    <i className="bi bi-play-fill"></i>
                </Link>

            </div>

            <div className="mt-2">
                <h6 className="text-white mb-1">{movie.title}</h6>

                <div className="d-flex justify-content-between text-secondary small">
                    <span>{movie.year}</span>
                    <span>{movie.genre}</span>
                </div>
            </div>

        </div>
    );
}

export default MovieCard;