import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Profile() {

    const navigate = useNavigate();

    const [user] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('currentUser'));
        } catch {
            return null;
        }
    });

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    async function changePassword(e) {

        e.preventDefault();

        setMessage('');
        setError('');

        try {

            await api.changePassword({
                currentPassword,
                newPassword
            });

            setMessage('Password updated successfully.');

            setCurrentPassword('');
            setNewPassword('');

        } catch (err) {
            setError(err.message);
        }
    }

    if (!user) {
        return (
            <div className="container text-center text-white py-5">
                <h3>Please sign in to view your profile.</h3>
                <button
                    className="btn mt-3"
                    style={{ background: '#D6FF00' }}
                    onClick={() => navigate('/signin')}
                >
                    Sign In
                </button>
            </div>
        );
    }

    return (

        <div className="container py-5"
            style={{ background: '#050505', minHeight: '100vh', maxWidth: '900px' }}>

            <h2 className="text-white fw-bold mb-5">
                My <span style={{ color: '#D6FF00' }}>Profile</span>
            </h2>

            <div className="bg-dark rounded p-4 mb-4">

                <div className="d-flex align-items-center gap-3">

                    <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                            width: '75px',
                            height: '75px',
                            background: '#D6FF00',
                            color: '#000',
                            fontSize: '30px',
                            fontWeight: 'bold'
                        }}
                    >
                        {user.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <h4 className="text-white mb-1">{user.name}</h4>
                        <p className="text-secondary mb-0">{user.email}</p>
                    </div>

                </div>

                <hr className="border-secondary my-4" />

                <p className="text-secondary">
                    Account type: <span className="text-white">{user.role || 'Member'}</span>
                </p>

            </div>

            <div className="bg-dark rounded p-4">

                <h5 className="text-white mb-4">Change Password</h5>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={changePassword}>

                    <div className="mb-3">
                        <label className="form-label text-white">
                            Current Password
                        </label>

                        <input
                            type="password"
                            className="form-control bg-black text-white border-secondary"
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-white">
                            New Password
                        </label>

                        <input
                            type="password"
                            minLength="8"
                            className="form-control bg-black text-white border-secondary"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        className="btn fw-bold"
                        style={{ background: '#D6FF00' }}
                    >
                        Update Password
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Profile;