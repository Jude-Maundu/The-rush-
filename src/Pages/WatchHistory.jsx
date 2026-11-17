import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { film } from '../data/film';

function readUser() {
    try {
        return JSON.parse(localStorage.getItem('currentUser') || 'null');
    } catch {
        localStorage.removeItem('currentUser');
        return null;
    }
}

function WatchHistory() {
    const [history, setHistory] = useState([]);
    const [error, setError] = useState('');
    const [user] = useState(readUser);
    const key = `rush_d_${user?.id || user?.email || 'guest'}`;

    useEffect(() => {
        try {
            const data = JSON.parse(localStorage.getItem(key) || '{}');
            setHistory(Array.isArray(data.history) ? data.history : []);
        } catch {
            setHistory([]);
        }
    }, [key]);

    function clearHistory() {
        try {
            const data = JSON.parse(localStorage.getItem(key) || '{}');
            localStorage.setItem(key, JSON.stringify({
                ...data,
                history: []
            }));
        } catch (error) {
            setError(error.message);
            return;
        }
        setHistory([]);
        setError('');
    }

    return (
        <main className="container py-5 min-vh-100">
            <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
                <div>
                    <p className="section-eyebrow">YOUR ACCOUNT</p>
                    <h1 className="page-title">Watch <span>history</span></h1>
                    <p className="page-lede mb-0">Your recent viewings of The Rush.</p>
                </div>
                {history.length > 0 && (
                    <button className="btn btn-outline-light" onClick={clearHistory}>
                        <i className="bi bi-trash me-2" /> Clear history
                    </button>
                )}
            </div>

            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {history.length ? (
                <div className="content-panel">
                    {history.map((entry, index) => (
                        <Link className="history-row text-decoration-none" to="/watch"
                            key={`${entry.t}-${index}`}>
                            <span><i className="bi bi-play-circle me-2 text-lime" />Watched {film.title}</span>
                            <small>{new Date(entry.t).toLocaleString()}</small>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="content-panel text-center py-5">
                    <i className="bi bi-clock-history display-4 text-lime" />
                    <h2 className="h4 text-white mt-3">No watch history yet</h2>
                    <p className="text-secondary">Press play on the film and your viewing history will show here.</p>
                    <Link className="btn btn-lime" to="/watch">Watch The Rush</Link>
                </div>
            )}
        </main>
    );
}

export default WatchHistory;
