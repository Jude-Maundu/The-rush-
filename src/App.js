import React, { useEffect, useState } from 'react';
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes
} from 'react-router-dom';
import Admin from './Components/Admin/Admin';
import Auth from './Components/Auth/Auth';
import Cast from './Components/Cast';
import Film from './Components/Film';
import Homepage from './Components/Homepage';
import MovieDetails from './Components/MovieDetails';
import Navbar from './Components/Navbar';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Discussion from './Pages/Discussion';
import Gallery from './Pages/Gallery';
import MemberProfile from './Pages/MemberProfile';
import Movies from './Pages/Movies';
import ProjectInfo from './Pages/ProjectInfo';
import Profile from './Pages/Profile';
import Reviews from './Pages/Reviews';
import Screenings from './Pages/Screenings';
import WatchHistory from './Pages/WatchHistory';
import WatchLater from './Pages/WatchLater';
import api from './services/api';

function currentUser() {
    try {
        return JSON.parse(localStorage.getItem('currentUser') || 'null');
    } catch {
        localStorage.removeItem('currentUser');
        return null;
    }
}

function ProtectedRoute({ children, admin = false }) {
    const user = currentUser();

    if (!user) return <Navigate to="/signin" replace />;
    if (admin && user.role !== 'admin') return <Navigate to="/" replace />;
    return children;
}

function AppLayout() {
    const [checkingSession, setCheckingSession] = useState(true);

    useEffect(() => {
        async function checkSession() {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                localStorage.removeItem('currentUser');
                setCheckingSession(false);
                return;
            }

            try {
                const result = await api.session();
                if (result.user) {
                    localStorage.setItem('currentUser', JSON.stringify(result.user));
                } else {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('currentUser');
                }
            } catch (error) {
                if (error.status === 401) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('currentUser');
                }
            } finally {
                setCheckingSession(false);
            }
        }

        checkSession();
    }, []);

    if (checkingSession) {
        return (
            <div className="app-loading d-flex justify-content-center align-items-center">
                <div className="spinner-border" role="status" aria-label="Loading" />
            </div>
        );
    }

    return (
        <div className="app-shell">
            <Navbar />
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/about" element={<About />} />
                <Route path="/about/:section" element={<ProjectInfo />} />
                <Route path="/cast" element={<Cast />} />
                <Route path="/cast/:slug" element={<MemberProfile />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/gallery/:section" element={<Gallery />} />
                <Route path="/film/discussion" element={<Discussion />} />
                <Route path="/screenings" element={<Screenings />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/watch" element={<Film />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/signin" element={<Auth mode="signin" />} />
                <Route path="/signup" element={<Auth mode="signup" />} />
                <Route path="/forgot" element={<Auth mode="forgot" />} />
                <Route
                    path="/watch-later"
                    element={<ProtectedRoute><WatchLater /></ProtectedRoute>}
                />
                <Route
                    path="/history"
                    element={<ProtectedRoute><WatchHistory /></ProtectedRoute>}
                />
                <Route
                    path="/profile"
                    element={<ProtectedRoute><Profile /></ProtectedRoute>}
                />
                <Route
                    path="/admin"
                    element={<ProtectedRoute admin><Admin /></ProtectedRoute>}
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <footer className="site-footer">
                <div className="container d-flex flex-wrap justify-content-between gap-2">
                    <span>© 2025 The Rush · A campus short film</span>
                    <span>Drama · 5 min 36 sec</span>
                </div>
            </footer>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppLayout />
        </BrowserRouter>
    );
}

export default App;
