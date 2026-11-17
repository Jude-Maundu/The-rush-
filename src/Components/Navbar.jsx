import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function readUser() {
    try {
        return JSON.parse(localStorage.getItem('currentUser') || 'null');
    } catch {
        localStorage.removeItem('currentUser');
        return null;
    }
}

function Navbar() {
    const [user, setUser] = useState(readUser);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const syncUser = () => setUser(readUser());
        window.addEventListener('rush-auth-change', syncUser);
        window.addEventListener('storage', syncUser);
        return () => {
            window.removeEventListener('rush-auth-change', syncUser);
            window.removeEventListener('storage', syncUser);
        };
    }, []);

    async function signOut() {
        setError('');
        try {
            await api.signout();
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('currentUser');
            setUser(null);
            window.dispatchEvent(new Event('rush-auth-change'));
            navigate('/');
        }
    }

    const links = [
        ['Home', '/'],
        ['About', '/about'],
        ['Cast & crew', '/cast'],
        ['Gallery', '/gallery'],
        ['The film', '/watch'],
        ['Screenings', '/screenings'],
        ['Contact', '/contact']
    ];

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark rush-navbar sticky-top">
                <div className="container">
                    <Link className="navbar-brand rush-brand" to="/">
                        THE <span>RUSH</span>
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#rushNavbar" aria-controls="rushNavbar"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="rushNavbar">
                        <ul className="navbar-nav mx-auto gap-lg-3">
                            {links.map(([label, path]) => (
                                <li className="nav-item" key={path}>
                                    <Link className="nav-link" to={path}>{label}</Link>
                                </li>
                            ))}
                        </ul>
                        <div className="navbar-user d-flex align-items-center gap-2 mt-3 mt-lg-0">
                            {user ? (
                                <>
                                    <span className="navbar-greeting">Hi, {user.name}</span>
                                    <Link className="btn btn-outline-light btn-sm" to="/history">History</Link>
                                    <Link className="btn btn-outline-light btn-sm" to="/watch-later">Watchlist</Link>
                                    <Link className="btn btn-outline-light btn-sm" to="/profile">Account</Link>
                                    {user.role === 'admin' && (
                                        <Link className="btn btn-outline-light btn-sm" to="/admin">Admin</Link>
                                    )}
                                    <button className="btn btn-lime btn-sm" onClick={signOut}>Sign out</button>
                                </>
                            ) : (
                                <>
                                    <Link className="btn btn-outline-light btn-sm" to="/signin">Sign in</Link>
                                    <Link className="btn btn-lime btn-sm" to="/signup">Sign up</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            {error && (
                <div className="container pt-2">
                    <div className="alert alert-warning mb-0" role="status">{error} You have been signed out on this device.</div>
                </div>
            )}
        </>
    );
}

export default Navbar;
