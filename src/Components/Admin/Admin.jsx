import React, { useCallback, useEffect, useState } from 'react';
import api from '../../services/api';

function Admin() {

    const [overview, setOverview] = useState({});
    const [reviews, setReviews] = useState([]);
    const [movies, setMovies] = useState([]);
    const [members, setMembers] = useState([]);

    const [sort, setSort] = useState('newest');
    const [activeTab, setActiveTab] = useState('overview');

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [userForm, setUserForm] = useState({ name: '', email: '', password: '' });
    const [creatingUser, setCreatingUser] = useState(false);

    const [movieForm, setMovieForm] = useState({
        title: '',
        year: '',
        genre: '',
        poster: '',
        backdrop: '',
        description: '',
        trailer: '',
        director: ''
    });
    const [memberForm, setMemberForm] = useState({
        name: '', role: '', group: 'cast', image: '', bio: ''
    });
    const [editingMemberId, setEditingMemberId] = useState(null);
    const [portraitFile, setPortraitFile] = useState(null);
    const [portraitPreview, setPortraitPreview] = useState('');
    const [removePortrait, setRemovePortrait] = useState(false);
    const [savingMember, setSavingMember] = useState(false);

    useEffect(() => {
        if (!portraitFile) {
            setPortraitPreview('');
            return undefined;
        }
        const preview = URL.createObjectURL(portraitFile);
        setPortraitPreview(preview);
        return () => URL.revokeObjectURL(preview);
    }, [portraitFile]);

    const loadDashboard = useCallback(async () => {
        try {
            const result = await api.adminOverview();
            setOverview(result.overview || {});
            const reviewResult = await api.adminReviews(sort);
            setReviews(reviewResult.reviews || []);
            setError('');
        } catch (err) {
            setError(err.message);
        }
    }, [sort]);

    const loadMovies = useCallback(async () => {
        try {
            const result = await api.movies();
            setMovies(result.movies || []);
        } catch (err) {
            setError(err.message);
        }
    }, []);

    const loadMembers = useCallback(async () => {
        try {
            const result = await api.adminMembers();
            setMembers(result.members || []);
        } catch (err) {
            setError(err.message);
        }
    }, []);

    useEffect(() => {
        loadDashboard();
        loadMovies();
        loadMembers();
    }, [loadDashboard, loadMovies, loadMembers]);

    async function addMovie(e) {

        e.preventDefault();

        try {

            await api.addMovie({
                ...movieForm,
                year: Number(movieForm.year)
            });

            setMessage('Movie added successfully.');

            setMovieForm({
                title: '',
                year: '',
                genre: '',
                poster: '',
                backdrop: '',
                description: '',
                trailer: '',
                director: ''
            });

            await loadMovies();

        } catch (err) {
            setError(err.message);
        }
    }

    async function deleteMovie(id) {

        if (!window.confirm('Delete this movie?')) return;

        try {
            await api.deleteMovie(id);
            setMovies(previous =>
                previous.filter(movie => (movie._id || movie.id) !== id)
            );
            setMessage('Movie deleted successfully.');
        } catch (err) {
            setError(err.message);
        }
    }

    async function deleteReview(id) {

        if (!window.confirm('Delete this review?')) return;

        try {
            await api.deleteReview(id);
            setReviews(previous =>
                previous.filter(review => review.id !== id)
            );
            setMessage('Review deleted successfully.');
        } catch (err) {
            setError(err.message);
        }
    }

    async function createUser(event) {
        event.preventDefault();
        setMessage('');
        setError('');
        setCreatingUser(true);

        try {
            const result = await api.createUser({
                ...userForm,
                name: userForm.name.trim(),
                email: userForm.email.trim()
            });
            setUserForm({ name: '', email: '', password: '' });
            setMessage(`Member account created for ${result.user.email}. Share the initial password with them securely.`);
            await loadDashboard();
        } catch (err) {
            setError(err.message);
        } finally {
            setCreatingUser(false);
        }
    }

    function readPortrait(event) {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!/^image\/(png|jpe?g|webp)$/i.test(file.type)) {
            setError('Choose a PNG, JPG, or WebP portrait.');
            event.target.value = '';
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('Portrait images must be 5 MB or smaller.');
            event.target.value = '';
            return;
        }
        setError('');
        setPortraitFile(file);
        setRemovePortrait(false);
    }

    async function saveMember(event) {
        event.preventDefault();
        setMessage('');
        setError('');
        setSavingMember(true);
        try {
            const form = new FormData();
            form.append('name', memberForm.name);
            form.append('role', memberForm.role);
            form.append('group', memberForm.group);
            form.append('bio', memberForm.bio);
            form.append('removeImage', String(removePortrait));
            if (portraitFile) form.append('portrait', portraitFile);

            const result = editingMemberId
                ? await api.updateMember(editingMemberId, form)
                : await api.addMember(form);
            setMessage(result.warning || (editingMemberId
                ? 'Cast or crew member updated successfully.'
                : 'Cast or crew member added successfully.'));
            setMemberForm({ name: '', role: '', group: 'cast', image: '', bio: '' });
            setEditingMemberId(null);
            setPortraitFile(null);
            setRemovePortrait(false);
            await loadMembers();
        } catch (err) {
            setError(err.message);
        } finally {
            setSavingMember(false);
        }
    }

    function editMember(member) {
        setEditingMemberId(member.id);
        setMemberForm({
            name: member.name || '',
            role: member.role || '',
            group: member.group || 'cast',
            image: member.image || '',
            bio: member.bio || ''
        });
        setPortraitFile(null);
        setRemovePortrait(false);
        setActiveTab('members');
    }

    function cancelMemberEdit() {
        setEditingMemberId(null);
        setMemberForm({ name: '', role: '', group: 'cast', image: '', bio: '' });
        setPortraitFile(null);
        setRemovePortrait(false);
    }

    async function deleteMember(id) {
        if (!window.confirm('Delete this cast or crew member?')) return;
        try {
            const result = await api.deleteMember(id);
            setMembers(previous => previous.filter(member => member.id !== id));
            setMessage(result.warning || 'Cast or crew member deleted successfully.');
        } catch (err) {
            setError(err.message);
        }
    }

    return (

        <div
            className="container-fluid px-3 px-lg-5 py-5"
            style={{
                background: '#050505',
                minHeight: '100vh'
            }}
        >

            <h2 className="text-white fw-bold mb-1">
                Admin <span style={{ color: '#D6FF00' }}>Dashboard</span>
            </h2>

            <p className="text-secondary mb-5">
                Manage your streaming platform.
            </p>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row g-3 mb-5">

                {[
                    ['Members', overview.userCount || 0, 'bi-people'],
                    ['Reviews', overview.reviewCount || 0, 'bi-chat-left-text'],
                    ['Average Rating', `${overview.averageRating || 0}/5`, 'bi-star'],
                    ['Movies', movies.length, 'bi-film']
                ].map(([label, value, icon]) => (

                    <div className="col-6 col-lg-3" key={label}>

                        <div className="rounded p-4 bg-dark h-100">

                            <i className={`bi ${icon} fs-3`}
                                style={{ color: '#D6FF00' }}>
                            </i>

                            <h3 className="text-white fw-bold mt-3">
                                {value}
                            </h3>

                            <span className="text-secondary">
                                {label}
                            </span>

                        </div>

                    </div>

                ))}

            </div>

            <div className="d-flex gap-2 flex-wrap mb-4">

                {['overview', 'movies', 'members', 'reviews', 'users'].map(tab => (

                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className="btn text-capitalize"
                        style={{
                            background: activeTab === tab ? '#D6FF00' : '#222',
                            color: activeTab === tab ? '#000' : '#fff'
                        }}
                    >
                        {tab}
                    </button>

                ))}

            </div>

            {activeTab === 'overview' && (

                <div className="bg-dark rounded p-4">

                    <h5 className="text-white mb-3">
                        Platform Overview
                    </h5>

                    <p className="text-secondary">
                        Welcome to your SHARPMOVIES administration panel.
                    </p>

                </div>

            )}

            {activeTab === 'movies' && (

                <div className="bg-dark rounded p-4">

                    <h5 className="text-white mb-4">
                        Add New Movie
                    </h5>

                    <form onSubmit={addMovie}>

                        <div className="row g-3">

                            {Object.keys(movieForm).map(field => (

                                <div className="col-md-6" key={field}>

                                    <label className="form-label text-white text-capitalize">
                                        {field}
                                    </label>

                                    {field === 'description' ? (

                                        <textarea
                                            className="form-control bg-black text-white border-secondary"
                                            rows="3"
                                            value={movieForm[field]}
                                            onChange={e => setMovieForm({
                                                ...movieForm,
                                                [field]: e.target.value
                                            })}
                                            required
                                        />

                                    ) : (

                                        <input
                                            type={field === 'year' ? 'number' : 'text'}
                                            className="form-control bg-black text-white border-secondary"
                                            value={movieForm[field]}
                                            onChange={e => setMovieForm({
                                                ...movieForm,
                                                [field]: e.target.value
                                            })}
                                            required
                                        />

                                    )}

                                </div>

                            ))}

                        </div>

                        <button
                            className="btn fw-bold mt-4"
                            style={{ background: '#D6FF00' }}
                        >
                            ADD MOVIE
                        </button>

                    </form>

                    <hr className="border-secondary my-5" />

                    <h5 className="text-white mb-3">
                        Existing Movies
                    </h5>

                    {movies.map(movie => (

                        <div
                            key={movie._id || movie.id}
                            className="d-flex justify-content-between align-items-center border-bottom border-secondary py-3"
                        >

                            <span className="text-white">
                                {movie.title}
                            </span>

                            <button
                                onClick={() => deleteMovie(movie._id || movie.id)}
                                className="btn btn-outline-danger btn-sm"
                            >
                                <i className="bi bi-trash"></i>
                            </button>

                        </div>

                    ))}

                </div>

            )}

            {activeTab === 'members' && (
                <div className="bg-dark rounded p-4">
                    <h5 className="text-white mb-4">
                        {editingMemberId ? 'Edit Cast or Crew Member' : 'Add Cast or Crew Member'}
                    </h5>
                    <form onSubmit={saveMember} className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label text-white" htmlFor="member-name">Name</label>
                            <input id="member-name" className="form-control bg-black text-white border-secondary"
                                value={memberForm.name} required
                                onChange={event => setMemberForm({ ...memberForm, name: event.target.value })} />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label text-white" htmlFor="member-role">Role</label>
                            <input id="member-role" className="form-control bg-black text-white border-secondary"
                                value={memberForm.role} required
                                onChange={event => setMemberForm({ ...memberForm, role: event.target.value })} />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label text-white" htmlFor="member-group">Group</label>
                            <select id="member-group" className="form-select bg-black text-white border-secondary"
                                value={memberForm.group}
                                onChange={event => setMemberForm({ ...memberForm, group: event.target.value })}>
                                <option value="cast">Cast</option>
                                <option value="crew">Crew</option>
                            </select>
                        </div>
                        <div className="col-12">
                            <label className="form-label text-white" htmlFor="member-image">
                                Portrait <span className="text-secondary fw-normal">(optional)</span>
                            </label>
                            <div className="d-flex flex-column flex-sm-row align-items-start gap-3 p-3 rounded border border-secondary bg-black">
                                <div className="d-flex align-items-center justify-content-center rounded bg-dark overflow-hidden"
                                    style={{ width: 104, height: 104, flex: '0 0 104px' }}>
                                    {(portraitPreview || (!removePortrait && memberForm.image)) ? (
                                        <img
                                            src={portraitPreview || memberForm.image}
                                            alt={`Portrait preview for ${memberForm.name || 'cast or crew member'}`}
                                            className="w-100 h-100"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <i className="bi bi-person-bounding-box fs-1 text-secondary" aria-hidden="true" />
                                    )}
                                </div>
                                <div className="flex-grow-1">
                                    <div className="text-white fw-semibold mb-1">
                                        {portraitFile?.name || (removePortrait ? 'Portrait will be removed' : 'Add a portrait')}
                                    </div>
                                    <p className="small text-secondary mb-3">
                                        Choose a JPG, PNG, or WebP image up to 5 MB. It will be uploaded securely to Cloudinary when you save.
                                    </p>
                                    <div className="d-flex flex-wrap gap-2">
                                        <label htmlFor="member-image" className="btn btn-outline-light btn-sm mb-0">
                                            <i className="bi bi-upload me-1" />
                                            {portraitFile || memberForm.image ? 'Choose another photo' : 'Choose photo'}
                                        </label>
                                        <input id="member-image" type="file" accept="image/png,image/jpeg,image/webp"
                                            className="visually-hidden" onChange={readPortrait} />
                                        {portraitFile && (
                                            <button type="button" className="btn btn-outline-light btn-sm"
                                                onClick={() => setPortraitFile(null)}>
                                                Discard selection
                                            </button>
                                        )}
                                        {!portraitFile && memberForm.image && (
                                            <button type="button" className="btn btn-outline-danger btn-sm"
                                                onClick={() => setRemovePortrait(!removePortrait)}>
                                                {removePortrait ? 'Keep current photo' : 'Remove photo'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <label className="form-label text-white" htmlFor="member-bio">Biography</label>
                            <textarea id="member-bio" className="form-control bg-black text-white border-secondary"
                                rows="3" value={memberForm.bio}
                                onChange={event => setMemberForm({ ...memberForm, bio: event.target.value })} />
                        </div>
                        <div className="col-12 d-flex gap-2">
                            <button className="btn fw-bold" style={{ background: '#D6FF00' }} disabled={savingMember}>
                                {savingMember ? 'SAVING…' : editingMemberId ? 'SAVE CHANGES' : 'ADD MEMBER'}
                            </button>
                            {editingMemberId && (
                                <button type="button" className="btn btn-outline-light"
                                    onClick={cancelMemberEdit} disabled={savingMember}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    <hr className="border-secondary my-5" />
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                        <h5 className="text-white mb-0">Cast &amp; Crew</h5>
                        <span className="badge rounded-pill text-bg-secondary">{members.length} {members.length === 1 ? 'profile' : 'profiles'}</span>
                    </div>
                    {members.length === 0 ? (
                        <div className="text-center rounded border border-secondary p-5">
                            <i className="bi bi-people fs-2 text-secondary" aria-hidden="true" />
                            <p className="text-white mt-2 mb-1">No profiles yet</p>
                            <p className="text-secondary mb-0">Add a cast or crew member using the form above.</p>
                        </div>
                    ) : (
                        <div className="row g-3">
                            {members.map(member => (
                                <div key={member.id} className="col-md-6 col-xl-4">
                                    <article className="h-100 rounded border border-secondary bg-black p-3 d-flex gap-3">
                                        {member.image ? (
                                            <img src={member.image} alt="" loading="lazy"
                                                style={{ width: 76, height: 92, objectFit: 'cover', borderRadius: 6, flex: '0 0 76px' }} />
                                        ) : (
                                            <div className="d-flex align-items-center justify-content-center rounded bg-dark text-secondary"
                                                style={{ width: 76, height: 92, flex: '0 0 76px' }}>
                                                <i className="bi bi-person fs-2" aria-hidden="true" />
                                            </div>
                                        )}
                                        <div className="min-w-0 flex-grow-1">
                                            <span className="badge rounded-pill text-bg-secondary text-capitalize mb-2">{member.group}</span>
                                            <h6 className="text-white mb-1 text-break">{member.name}</h6>
                                            <p className="small text-secondary mb-3">{member.role}</p>
                                            <div className="d-flex flex-wrap gap-2">
                                                <button className="btn btn-outline-light btn-sm"
                                                    onClick={() => editMember(member)}>
                                                    <i className="bi bi-pencil me-1" />Edit
                                                </button>
                                                <button className="btn btn-outline-danger btn-sm"
                                                    onClick={() => deleteMember(member.id)}>
                                                    <i className="bi bi-trash me-1" />Remove
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'reviews' && (

                <div className="bg-dark rounded p-4">

                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <h5 className="text-white">Manage Reviews</h5>

                        <select
                            className="form-select bg-black text-white border-secondary"
                            style={{ maxWidth: '170px' }}
                            value={sort}
                            onChange={e => setSort(e.target.value)}
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                            <option value="highest">Highest rated</option>
                            <option value="lowest">Lowest rated</option>
                        </select>

                    </div>

                    {reviews.map(review => (

                        <div
                            key={review.id}
                            className="border-bottom border-secondary py-3"
                        >

                            <div className="d-flex justify-content-between">

                                <div>

                                    <h6 className="text-white">
                                        {review.name}
                                    </h6>

                                    <span style={{ color: '#D6FF00' }}>
                                        {'★'.repeat(review.rating)}
                                    </span>

                                </div>

                                <button
                                    onClick={() => deleteReview(review.id)}
                                    className="btn btn-outline-danger btn-sm"
                                >
                                    Delete
                                </button>

                            </div>

                            <p className="text-secondary mt-2 mb-0">
                                {review.body}
                            </p>

                        </div>

                    ))}

                </div>

            )}

            {activeTab === 'users' && (

                <div className="bg-dark rounded p-4">

                    <h5 className="text-white mb-3">Create Member Account</h5>
                    <p className="text-secondary">
                        Creates a confirmed member account without sending a confirmation email. Share the initial password securely.
                    </p>
                    <form onSubmit={createUser} className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label text-white" htmlFor="admin-user-name">Name</label>
                            <input id="admin-user-name" className="form-control bg-black text-white border-secondary"
                                autoComplete="name" value={userForm.name} required
                                onChange={event => setUserForm({ ...userForm, name: event.target.value })} />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label text-white" htmlFor="admin-user-email">Email</label>
                            <input id="admin-user-email" type="email"
                                className="form-control bg-black text-white border-secondary"
                                autoComplete="email" value={userForm.email} required
                                onChange={event => setUserForm({ ...userForm, email: event.target.value })} />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label text-white" htmlFor="admin-user-password">Initial password</label>
                            <input id="admin-user-password" type="password" minLength="8"
                                className="form-control bg-black text-white border-secondary"
                                autoComplete="new-password" value={userForm.password} required
                                onChange={event => setUserForm({ ...userForm, password: event.target.value })} />
                        </div>
                        <div className="col-12">
                            <button className="btn fw-bold" style={{ background: '#D6FF00' }} disabled={creatingUser}>
                                {creatingUser ? 'CREATING…' : 'CREATE MEMBER'}
                            </button>
                        </div>
                    </form>

                </div>

            )}

        </div>
    );
}

export default Admin;