import axios from 'axios';

const client = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://the-rush-backend.onrender.com',
    headers: { 'Content-Type': 'application/json' }
});

client.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

client.interceptors.response.use(
    response => response,
    error => {
        const message = error.response?.data?.error
            || error.response?.data?.message
            || error.message
            || 'The request could not be completed.';
        const requestError = new Error(message);
        requestError.status = error.response?.status;
        return Promise.reject(requestError);
    }
);

const data = promise => promise.then(response => response.data);

const api = {
    session: () => data(client.get('/api/session')),
    signup: body => data(client.post('/api/auth/signup', body)),
    signin: body => data(client.post('/api/auth/signin', body)),
    signout: () => data(client.post('/api/auth/signout')),
    changePassword: body => data(client.post('/api/auth/password', body)),

    movies: params => data(client.get('/api/movies', { params })),
    movie: id => data(client.get(`/api/movies/${encodeURIComponent(id)}`)),
    reviews: sort => data(client.get('/api/reviews', { params: { sort } })),
    addReview: body => data(client.post('/api/reviews', body)),

    adminOverview: () => data(client.get('/api/admin/overview')),
    adminReviews: sort => data(client.get('/api/admin/reviews', { params: { sort } })),
    createUser: body => data(client.post('/api/admin/users', body)),
    addMovie: body => data(client.post('/api/admin/movies', body)),
    deleteMovie: id => data(client.delete(`/api/admin/movies/${encodeURIComponent(id)}`)),
    deleteReview: id => data(client.delete(`/api/admin/reviews/${encodeURIComponent(id)}`))
};

export const authAPI = {
    session: api.session,
    signup: api.signup,
    signin: api.signin,
    signout: api.signout,
    updatePassword: api.changePassword
};

export const movieAPI = {
    getAll: params => api.movies(params),
    getOne: id => api.movie(id),
    getReviews: params => data(client.get('/api/reviews', { params })),
    addReview: api.addReview
};

export default api;
