import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

function readUser() {
    try {
        return JSON.parse(localStorage.getItem('currentUser') || 'null');
    } catch {
        localStorage.removeItem('currentUser');
        return null;
    }
}

function Auth({ mode }) {
    const isSignup = mode === 'signup';
    const isForgot = mode === 'forgot';
    const navigate = useNavigate();
    const user = readUser();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [signupRateLimited, setSignupRateLimited] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    async function submit(event) {
        event.preventDefault();
        setError('');
        setMessage('');
        setSignupRateLimited(false);
        setSubmitting(true);

        try {
            if (isForgot) {
                await api.changePassword({ currentPassword, newPassword });
                setCurrentPassword('');
                setNewPassword('');
                setMessage('Your password has been updated.');
                return;
            }

            const result = isSignup
                ? await api.signup({ name: name.trim(), email: email.trim(), password })
                : await api.signin({ email: email.trim(), password });

            if (!result.token || !result.user) {
                setMessage(result.message || 'Check your email to confirm your account, then sign in.');
                return;
            }

            localStorage.setItem('accessToken', result.token);
            localStorage.setItem('currentUser', JSON.stringify(result.user));
            window.dispatchEvent(new Event('rush-auth-change'));
            navigate(result.user.role === 'admin' ? '/admin' : '/watch');
        } catch (requestError) {
            if (isSignup && requestError.status === 429) {
                setSignupRateLimited(true);
            } else {
                setError(requestError.message);
            }
        } finally {
            setSubmitting(false);
        }
    }

    if (isForgot && !user) {
        return (
            <main className="container py-5 min-vh-100">
                <section className="content-panel auth-panel mx-auto text-center">
                    <h1 className="h2 text-white">Change password</h1>
                    <p className="text-secondary">Sign in to update your password.</p>
                    <Link className="btn btn-lime" to="/signin">Sign in</Link>
                </section>
            </main>
        );
    }

    const title = isForgot ? 'Change password' : isSignup ? 'Create your account' : 'Welcome back';

    return (
        <main className="container d-flex align-items-center justify-content-center py-5 min-vh-100">
            <section className="content-panel auth-panel w-100">
                <p className="section-eyebrow">THE RUSH COMMUNITY</p>
                <h1 className="h2 text-white fw-bold mb-2">{title}</h1>
                <p className="text-secondary mb-4">
                    {isForgot
                        ? 'Choose a new password for your account.'
                        : isSignup
                            ? 'Join the conversation and save your place in the film.'
                            : 'Sign in to watch The Rush and share a review.'}
                </p>

                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                {signupRateLimited && (
                    <div className="alert alert-warning" role="alert">
                        Supabase has temporarily rate-limited signup or confirmation emails. Repeated retries will not clear the limit; wait before trying again. If you already created an account, <Link to="/signin">sign in instead</Link>. If this keeps happening for new users, configure a custom SMTP provider in Supabase under Authentication → SMTP.
                    </div>
                )}
                {message && <div className="alert alert-success" role="status">{message}</div>}

                <form onSubmit={submit}>
                    {isSignup && (
                        <div className="mb-3">
                            <label className="form-label text-white" htmlFor="auth-name">Your name</label>
                            <input id="auth-name" className="form-control bg-black text-white border-secondary"
                                autoComplete="name" value={name}
                                onChange={event => setName(event.target.value)} required />
                        </div>
                    )}
                    {isForgot ? (
                        <>
                            <div className="mb-3">
                                <label className="form-label text-white" htmlFor="auth-current-password">Current password</label>
                                <input id="auth-current-password" type="password"
                                    className="form-control bg-black text-white border-secondary"
                                    autoComplete="current-password" value={currentPassword}
                                    onChange={event => setCurrentPassword(event.target.value)} required />
                            </div>
                            <div className="mb-4">
                                <label className="form-label text-white" htmlFor="auth-new-password">New password (8+ characters)</label>
                                <input id="auth-new-password" type="password" minLength="8"
                                    className="form-control bg-black text-white border-secondary"
                                    autoComplete="new-password" value={newPassword}
                                    onChange={event => setNewPassword(event.target.value)} required />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mb-3">
                                <label className="form-label text-white" htmlFor="auth-email">Email</label>
                                <input id="auth-email" type="email"
                                    className="form-control bg-black text-white border-secondary"
                                    autoComplete="email" value={email}
                                    onChange={event => setEmail(event.target.value)} required />
                            </div>
                            <div className="mb-4">
                                <label className="form-label text-white" htmlFor="auth-password">Password</label>
                                <input id="auth-password" type="password" minLength={isSignup ? 8 : undefined}
                                    className="form-control bg-black text-white border-secondary"
                                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                                    value={password}
                                    onChange={event => setPassword(event.target.value)} required />
                            </div>
                        </>
                    )}

                    <button className="btn btn-lime w-100" disabled={submitting}>
                        {submitting ? 'PLEASE WAIT…' : isForgot ? 'UPDATE PASSWORD' : isSignup ? 'CREATE ACCOUNT' : 'SIGN IN'}
                    </button>
                </form>

                <p className="text-secondary mt-4 mb-0">
                    {isForgot ? (
                        <Link to="/profile" className="text-lime">Back to your account</Link>
                    ) : isSignup ? (
                        <>Already have an account? <Link to="/signin" className="text-lime">Sign in</Link></>
                    ) : (
                        <>
                            New to The Rush? <Link to="/signup" className="text-lime">Create an account</Link>
                            <span className="mx-2">·</span>
                            <Link to="/forgot" className="text-lime">Change password</Link>
                        </>
                    )}
                </p>
            </section>
        </main>
    );
}

export default Auth;
