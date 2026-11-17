import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { film } from '../data/film';
import { loadYouTubeIframeAPI } from '../services/youtube';

function readUser() {
    try {
        return JSON.parse(localStorage.getItem('currentUser') || 'null');
    } catch {
        localStorage.removeItem('currentUser');
        return null;
    }
}

function readWatchData(key) {
    try {
        const stored = JSON.parse(localStorage.getItem(key) || '{}');
        return {
            position: Number(stored.position) || 0,
            duration: Number(stored.duration) || 0,
            history: Array.isArray(stored.history) ? stored.history : []
        };
    } catch {
        return { position: 0, duration: 0, history: [] };
    }
}

function formatTime(seconds) {
    const time = Math.max(0, Math.floor(seconds));
    return `${Math.floor(time / 60)}:${String(time % 60).padStart(2, '0')}`;
}

function Film() {
    const [user] = useState(readUser);
    const playerHost = useRef(null);
    const player = useRef(null);
    const timer = useRef(null);
    const introTimer = useRef(null);
    const historyLogged = useRef(false);
    const key = `rush_d_${user?.id || user?.email || 'guest'}`;
    const [watchData, setWatchData] = useState(() => readWatchData(key));
    const [requested, setRequested] = useState(false);
    const [ready, setReady] = useState(false);
    const [introDismissed, setIntroDismissed] = useState(false);
    const [introVisible, setIntroVisible] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setWatchData(readWatchData(key));
    }, [key]);

    useEffect(() => {
        if (!requested || !user || !playerHost.current) return undefined;
        let active = true;

        loadYouTubeIframeAPI()
            .then(YT => {
                if (!active || !playerHost.current || player.current) return;
                const saved = readWatchData(key);
                player.current = new YT.Player(playerHost.current, {
                    width: '100%',
                    height: '100%',
                    videoId: film.videoId,
                    playerVars: {
                        controls: 1,
                        rel: 0,
                        start: saved.position > 5 ? Math.floor(saved.position) : 0
                    },
                    events: {
                        onReady: () => setReady(true),
                        onStateChange: event => {
                            const states = window.YT.PlayerState;
                            if (event.data === states.PLAYING) {
                                if (!historyLogged.current) {
                                    historyLogged.current = true;
                                    const next = readWatchData(key);
                                    next.history.unshift({ t: Date.now() });
                                    next.history = next.history.slice(0, 50);
                                    localStorage.setItem(key, JSON.stringify(next));
                                    setWatchData(next);
                                }
                                clearInterval(timer.current);
                                timer.current = setInterval(() => {
                                    if (!player.current?.getCurrentTime) return;
                                    const next = readWatchData(key);
                                    next.position = player.current.getCurrentTime();
                                    next.duration = player.current.getDuration();
                                    localStorage.setItem(key, JSON.stringify(next));
                                    setWatchData(next);
                                }, 3000);
                            } else {
                                clearInterval(timer.current);
                                if (player.current?.getCurrentTime && event.data !== states.ENDED) {
                                    const next = readWatchData(key);
                                    next.position = player.current.getCurrentTime();
                                    next.duration = player.current.getDuration();
                                    localStorage.setItem(key, JSON.stringify(next));
                                    setWatchData(next);
                                }
                                if (event.data === states.ENDED) {
                                    const next = readWatchData(key);
                                    next.position = 0;
                                    localStorage.setItem(key, JSON.stringify(next));
                                    setWatchData(next);
                                    historyLogged.current = false;
                                }
                            }
                        }
                    }
                });
            })
            .catch(loadError => {
                if (active) setError(loadError.message);
            });

        return () => {
            active = false;
            clearInterval(timer.current);
            clearTimeout(introTimer.current);
            player.current?.destroy();
            player.current = null;
        };
    }, [key, requested, user]);

    function startPlayback() {
        if (!player.current || !ready) return;
        if (watchData.position > 5 && player.current.seekTo) {
            player.current.seekTo(watchData.position, true);
        }
        player.current.playVideo();
        setIntroDismissed(true);
        setIntroVisible(true);
        clearTimeout(introTimer.current);
        introTimer.current = window.setTimeout(() => setIntroVisible(false), 2700);
    }

    function clearHistory() {
        const next = readWatchData(key);
        next.history = [];
        localStorage.setItem(key, JSON.stringify(next));
        setWatchData(next);
    }

    if (!user) {
        return (
            <main className="container py-5 min-vh-100">
                <div className="watch-gate text-center mx-auto">
                    <img src={film.posterImage} alt="The Rush film poster" />
                    <div>
                        <p className="section-eyebrow">THE FEATURE FILM</p>
                        <h1 className="page-title">The <span>Rush</span></h1>
                        <p className="text-secondary">Sign in to watch the film and save your place and viewing history.</p>
                        <Link className="btn btn-lime me-2" to="/signin">Sign in</Link>
                        <Link className="btn btn-outline-light" to="/signup">Create an account</Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="container py-5 min-vh-100">
            <p className="section-eyebrow">THE FEATURE FILM</p>
            <h1 className="page-title mb-4">The <span>Rush</span></h1>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}

            <div className="film-player">
                {!requested ? (
                    <button className="film-player__poster" onClick={() => {
                        setError('');
                        setRequested(true);
                    }} aria-label="Load and play The Rush">
                        <img src={film.heroImage} alt="A still from The Rush" />
                        <span className="film-player__play"><i className="bi bi-play-fill" /> Play the film</span>
                    </button>
                ) : (
                    <>
                        <div className="film-player__frame" ref={playerHost} />
                        {ready && !introDismissed && (
                            <div className="film-intro">
                                <div className="film-intro__card">
                                    <p className="section-eyebrow">A CAMPUS FILM</p>
                                    <h2>The <span>Rush</span></h2>
                                    <p>ONE LONG NIGHT. ONE RUSHED MORNING.</p>
                                    <button className="btn btn-lime" onClick={startPlayback}>
                                        <i className="bi bi-play-fill me-1" />
                                        {watchData.position > 5 ? 'Resume film' : 'Start film'}
                                    </button>
                                </div>
                            </div>
                        )}
                        {introVisible && (
                            <div className="film-title-overlay" aria-live="polite">
                                <span>A CAMPUS FILM</span>
                                <strong>The <em>Rush</em></strong>
                                <span>ONE LONG NIGHT. ONE RUSHED MORNING.</span>
                                <button className="btn btn-outline-light btn-sm"
                                    onClick={() => setIntroVisible(false)}>
                                    Skip intro
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {watchData.position > 5 && watchData.duration > watchData.position && (
                <section className="content-panel mt-4">
                    <h2 className="h4 text-white">Continue watching</h2>
                    <p className="text-secondary">
                        You stopped at {formatTime(watchData.position)} of {formatTime(watchData.duration)}.
                    </p>
                    <div className="progress rush-progress mb-3" role="progressbar"
                        aria-valuenow={Math.round(watchData.position / watchData.duration * 100)}
                        aria-valuemin="0" aria-valuemax="100">
                        <div className="progress-bar" style={{
                            width: `${Math.min(100, watchData.position / watchData.duration * 100)}%`
                        }} />
                    </div>
                    {!requested && (
                        <button className="btn btn-lime" onClick={() => setRequested(true)}>
                            Resume film
                        </button>
                    )}
                </section>
            )}

            <section className="content-panel mt-4">
                <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
                    <h2 className="h4 text-white mb-0">Recently watched</h2>
                    <Link to="/history" className="text-lime">Full history</Link>
                </div>
                {watchData.history.length ? watchData.history.slice(0, 3).map((entry, index) => (
                    <div className="history-row" key={`${entry.t}-${index}`}>
                        <span>The Rush</span>
                        <small>{new Date(entry.t).toLocaleString()}</small>
                    </div>
                )) : <p className="text-secondary mb-0">Nothing yet. Press play to start.</p>}
            </section>

            <section className="content-panel mt-4">
                <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
                    <h2 className="h4 text-white mb-0">Watch history</h2>
                    {watchData.history.length > 0 && (
                        <button className="btn btn-outline-light btn-sm" onClick={clearHistory}>
                            Clear history
                        </button>
                    )}
                </div>
                {watchData.history.length
                    ? watchData.history.map((entry, index) => (
                        <div className="history-row" key={`${entry.t}-${index}`}>
                            <span>Watched The Rush</span>
                            <small>{new Date(entry.t).toLocaleString()}</small>
                        </div>
                    ))
                    : <p className="text-secondary mb-0">Your watch history will show here.</p>}
            </section>

            <p className="mt-4 mb-0">
                <Link to="/film/discussion" className="text-lime">
                    Discuss the film or raise a concern <i className="bi bi-arrow-right" />
                </Link>
            </p>
        </main>
    );
}

export default Film;
