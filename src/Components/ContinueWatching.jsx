import React from 'react';
import { Link } from 'react-router-dom';

function ContinueWatching({ movies = [], progress = {} }) {

    if (!movies.length) return null;

    return (
        <section className="container-fluid px-3 px-lg-4 py-4">

            <h4 className="fw-bold text-white mb-4">
                Continue <span style={{ color: '#D6FF00' }}>Watching</span>
            </h4>

            <div className="row">

                {movies.map(movie => {

                    const id = movie._id || movie.id;
                    const percentage = progress[id]?.percent || 0;

                    return (
                        <div className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4" key={id}>

                            <Link to={`/movie/${id}`}>
                                <div className="position-relative">

                                    <img
                                        src={movie.poster}
                                        alt={movie.title}
                                        className="img-fluid rounded"
                                        style={{
                                            height: '220px',
                                            width: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />

                                    <div className="position-absolute top-50 start-50 translate-middle">
                                        <i className="bi bi-play-circle-fill fs-1 text-white"></i>
                                    </div>

                                </div>
                            </Link>

                            <div className="progress mt-2" style={{ height: '4px', background: '#333' }}>
                                <div
                                    className="progress-bar"
                                    style={{
                                        width: `${percentage}%`,
                                        background: '#D6FF00'
                                    }}
                                ></div>
                            </div>

                            <div className="d-flex justify-content-between mt-2">
                                <small className="text-white">{movie.title}</small>
                                <small style={{ color: '#D6FF00' }}>
                                    {percentage}%
                                </small>
                            </div>

                        </div>
                    );
                })}

            </div>

        </section>
    );
}

export default ContinueWatching;