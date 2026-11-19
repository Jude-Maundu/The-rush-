import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { film } from '../data/film';

function getWatchData() {
    try {
        const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (!user) return null;
        const key = `rush_d_${user.id || user.email}`;
        return JSON.parse(localStorage.getItem(key) || 'null');
    } catch {
        return null;
    }
}

function Homepage() {
    const [saved, setSaved] = useState(false);
    const [watchData, setWatchData] = useState(getWatchData);
    const [trailerOpen, setTrailerOpen] = useState(false);
    const [members, setMembers] = useState([]);
    const [membersLoading, setMembersLoading] = useState(true);
    const [membersError, setMembersError] = useState('');

    useEffect(() => {
        try {
            const existing = JSON.parse(localStorage.getItem('watchLater') || '[]');
            setSaved(existing.some(item => item.title === film.title));
        } catch {
            localStorage.removeItem('watchLater');
        }
        setWatchData(getWatchData());
        api.members().then(result => {
            setMembers(result.members || []);
        }).catch(err => {
            setMembersError(err.message);
        }).finally(() => setMembersLoading(false));
    }, []);

    function toggleWatchLater() {
        let existing;
        try {
            existing = JSON.parse(localStorage.getItem('watchLater') || '[]');
            if (!Array.isArray(existing)) existing = [];
        } catch {
            existing = [];
        }

        const next = saved
            ? existing.filter(item => item.title !== film.title)
            : [...existing.filter(item => item.title !== film.title), {
                id: 'the-rush',
                title: film.title,
                year: film.year,
                genre: film.genre,
                poster: film.posterImage,
                backdrop: film.heroImage,
                description: film.synopsis
            }];
        localStorage.setItem('watchLater', JSON.stringify(next));
        setSaved(!saved);
    }

    const hasProgress = watchData?.position > 5
        && watchData?.duration > watchData?.position;
    const progress = hasProgress
        ? Math.round(watchData.position / watchData.duration * 100)
        : 0;
    const featuredMembers = members.slice(0, 4);

    return (
        <main className="home-page">
            <section className="movie-hero" style={{ backgroundImage: `url("${film.heroImage}")` }}>
                <div className="movie-hero__shade" />
                <div className="container movie-hero__content">
                    <p className="section-eyebrow">A CAMPUS SHORT FILM · {film.year}</p>
                    <h1>THE <span>RUSH</span></h1>
                    <div className="d-flex flex-wrap gap-3 text-white-50 mb-3">
                        <span>{film.genre}</span><span>{film.runtime}</span><span>{film.format}</span>
                    </div>
                    <p className="movie-hero__synopsis">{film.synopsis}</p>
                    <div className="d-flex flex-wrap gap-2">
                        <Link className="btn btn-lime" to="/watch">
                            <i className="bi bi-play-fill me-1" /> WATCH THE FILM
                        </Link>
                        <button className="btn btn-outline-light" onClick={() => setTrailerOpen(true)}>
                            <i className="bi bi-camera-video me-1" /> WATCH TRAILER
                        </button>
                        <button className="btn btn-outline-light" onClick={toggleWatchLater}>
                            <i className={`bi ${saved ? 'bi-bookmark-check-fill' : 'bi-bookmark-plus'} me-1`} />
                            {saved ? 'SAVED TO WATCHLIST' : 'WATCH LATER'}
                        </button>
                        <Link className="btn btn-outline-light" to="/about">
                            <i className="bi bi-info-circle me-1" /> ABOUT THE FILM
                        </Link>
                        <Link className="btn btn-outline-light" to="/screenings">
                            <i className="bi bi-calendar-event me-1" /> SCREENING INFO
                        </Link>
                    </div>
                </div>
            </section>

            {trailerOpen && (
                <div className="trailer-backdrop" role="presentation" onClick={() => setTrailerOpen(false)}>
                    <section className="trailer-modal" role="dialog" aria-modal="true" aria-label="The Rush trailer"
                        onClick={event => event.stopPropagation()}>
                        <div className="d-flex justify-content-between align-items-center p-3">
                            <h2 className="h5 text-white mb-0">The Rush · Trailer</h2>
                            <button className="btn-close btn-close-white" aria-label="Close trailer"
                                onClick={() => setTrailerOpen(false)} />
                        </div>
                        <div className="ratio ratio-16x9">
                            <video src={film.trailerSrc} title="The Rush trailer" controls autoPlay />
                        </div>
                    </section>
                </div>
            )}

            <section className="container py-5">
                <div className="row g-4 align-items-stretch">
                    <div className="col-md-8">
                        <div className="content-panel h-100">
                            <p className="section-eyebrow">THE STORY</p>
                            <h2 className="h3 text-white">One long night. One rushed morning.</h2>
                            <p className="text-secondary mb-3">{film.synopsis}</p>
                            <Link to="/about" className="text-lime">Discover the story and production <i className="bi bi-arrow-right" /></Link>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="film-facts h-100">
                            <div><span>Genre</span><strong>{film.genre}</strong></div>
                            <div><span>Runtime</span><strong>{film.runtime}</strong></div>
                            <div><span>Year</span><strong>{film.year}</strong></div>
                            <div><span>Format</span><strong>{film.format}</strong></div>
                        </div>
                    </div>
                </div>
            </section>

            {hasProgress && (
                <section className="container pb-4">
                    <div className="content-panel d-flex flex-wrap align-items-center justify-content-between gap-3">
                        <div className="d-flex align-items-center gap-3">
                            <img className="resume-poster" src={film.posterImage} alt="The Rush poster" />
                            <div>
                                <p className="section-eyebrow mb-1">PICK UP WHERE YOU LEFT OFF</p>
                                <h2 className="h5 text-white mb-2">Continue watching The Rush</h2>
                                <div className="progress rush-progress">
                                    <div className="progress-bar" style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        </div>
                        <Link className="btn btn-lime" to="/watch">RESUME</Link>
                    </div>
                </section>
            )}

            <section className="container pb-5">
                <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-3">
                    <div>
                        <p className="section-eyebrow mb-2">THE PEOPLE BEHIND THE FILM</p>
                        <h2 className="h3 text-white mb-0">Meet the cast &amp; crew</h2>
                    </div>
                    <Link to="/cast" className="text-lime">View everyone <i className="bi bi-arrow-right" /></Link>
                </div>
                {membersLoading && <p className="text-secondary" role="status">Loading cast and crew…</p>}
                {membersError && <p className="text-danger" role="alert">Could not load cast and crew: {membersError}</p>}
                {!membersLoading && !membersError && members.length === 0 && (
                    <p className="text-secondary">Cast and crew profiles will appear here when the production team adds them.</p>
                )}
                <div className="row g-3">
                    {featuredMembers.map(member => (
                        <div className="col-6 col-md-3" key={member.slug}>
                            <Link className="crew-card h-100 text-decoration-none" to={`/cast/${member.slug}`}>
                                <div className="crew-card__image crew-card__image--portrait">
                                    {member.image ? (
                                        <img src={member.image} alt={member.name} loading="lazy" />
                                    ) : (
                                        <span aria-hidden="true">{member.name.split(' ').map(part => part[0]).slice(0, 2).join('')}</span>
                                    )}
                                </div>
                                <div className="p-3">
                                    <h3 className="h5 text-white mb-1">{member.name}</h3>
                                    <p className="text-secondary mb-0">{member.role}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            <section className="home-review-cta">
                <div className="container d-flex flex-wrap align-items-center justify-content-between gap-3">
                    <div>
                        <p className="section-eyebrow mb-2">HAVE YOUR SAY</p>
                        <h2 className="h3 text-white mb-0">What did you think of The Rush?</h2>
                    </div>
                    <Link className="btn btn-lime" to="/reviews">READ &amp; WRITE REVIEWS</Link>
                </div>
            </section>
        </main>
    );
}

export default Homepage;
