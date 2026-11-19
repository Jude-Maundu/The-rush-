import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';
import Admin from './Components/Admin/Admin';
import api from './services/api';

beforeEach(() => {
  window.history.replaceState({}, '', '/');
  localStorage.clear();
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders the homepage', async () => {
  render(<App />);
  expect(await screen.findByRole('heading', { name: 'THE RUSH' })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: 'Teddy Ngare' })).toHaveAttribute('src', '/cast/Teddy.jpeg');
  expect(screen.getByRole('link', { name: /Teddy Ngare/ })).toHaveAttribute('href', '/cast/teddy-ngare');
});

test('navigates to the film information page', async () => {
  render(<App />);
  fireEvent.click(await screen.findByRole('link', { name: 'About' }));
  expect(await screen.findByRole('heading', { name: 'About The Rush' })).toBeInTheDocument();
});

test('requires a sign in before showing the full film', async () => {
  render(<App />);
  fireEvent.click(await screen.findByRole('link', { name: 'The film' }));
  expect(await screen.findByText(/Sign in to watch the film/)).toBeInTheDocument();
});

test('opens a dedicated profile page for a cast or crew member', async () => {
  render(<App />);
  fireEvent.click(await screen.findByRole('link', { name: 'Cast & crew' }));
  fireEvent.click(await screen.findByRole('link', { name: /Teddy Ngare/ }));
  expect(await screen.findByRole('heading', { name: 'Teddy Ngare' })).toBeInTheDocument();
  expect(screen.getByText('Director')).toBeInTheDocument();
  expect(screen.getByRole('img', { name: 'Teddy Ngare' })).toHaveAttribute('src', '/cast/Teddy.jpeg');
});

test('shows the provided cast and crew names', async () => {
  render(<App />);
  fireEvent.click(await screen.findByRole('link', { name: 'Cast & crew' }));

  for (const name of [
    'Teddy Ngare',
    'Felister Mwende',
    'Rita Njeri',
    'Gift Kioko',
    'Felix Ochari',
    'Daniel Gori',
    'Dimitry Bifwoli',
    'Evelyn Mwikali',
    'Serena Spechiozers'
  ]) {
    expect(await screen.findByRole('heading', { name })).toBeInTheDocument();
  }
  expect(screen.getByRole('img', { name: 'Dimitry Bifwoli' })).toHaveAttribute('src', '/cast/Dimitry.jpeg');
  expect(screen.queryByText('Lighting technician')).not.toBeInTheDocument();
});

test('explains Supabase signup rate limits and offers sign in', async () => {
  window.history.replaceState({}, '', '/signup');
  jest.spyOn(api, 'signup').mockRejectedValue(
    Object.assign(new Error('Rate limit exceeded'), { status: 429 })
  );
  render(<App />);

  fireEvent.change(await screen.findByLabelText('Your name'), { target: { value: 'Jude' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jude@example.com' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secure-password' } });
  fireEvent.click(screen.getByRole('button', { name: 'CREATE ACCOUNT' }));

  expect(await screen.findByRole('alert')).toHaveTextContent(/temporarily rate-limited signup/i);
  expect(screen.getByRole('link', { name: 'sign in instead' })).toHaveAttribute('href', '/signin');
});

test('allows an admin to create a member account', async () => {
  jest.spyOn(api, 'adminOverview').mockResolvedValue({ overview: { userCount: 1 } });
  jest.spyOn(api, 'adminReviews').mockResolvedValue({ reviews: [] });
  jest.spyOn(api, 'movies').mockResolvedValue({ movies: [] });
  jest.spyOn(api, 'adminMembers').mockResolvedValue({ members: [] });
  const createUser = jest.spyOn(api, 'createUser').mockResolvedValue({
    user: { email: 'member@example.com', role: 'member' }
  });
  render(<Admin />);

  fireEvent.click(screen.getByRole('button', { name: 'users' }));
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New Member' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'member@example.com' } });
  fireEvent.change(screen.getByLabelText('Initial password'), { target: { value: 'secure-password' } });
  fireEvent.click(screen.getByRole('button', { name: 'CREATE MEMBER' }));

  await waitFor(() => expect(createUser).toHaveBeenCalledWith({
    name: 'New Member',
    email: 'member@example.com',
    password: 'secure-password'
  }));
  expect(await screen.findByText(/Member account created for member@example\.com/)).toBeInTheDocument();
});

test('lets an admin add a cast profile with the Cloudinary portrait uploader', async () => {
  jest.spyOn(api, 'adminOverview').mockResolvedValue({ overview: {} });
  jest.spyOn(api, 'adminReviews').mockResolvedValue({ reviews: [] });
  jest.spyOn(api, 'movies').mockResolvedValue({ movies: [] });
  jest.spyOn(api, 'adminMembers').mockResolvedValue({ members: [] });
  const addMember = jest.spyOn(api, 'addMember').mockResolvedValue({
    member: { id: 'member-id', name: 'New Actor', role: 'Lead actor', group: 'cast' }
  });
  render(<Admin />);

  fireEvent.click(screen.getByRole('button', { name: 'members' }));
  expect(screen.getByText(/uploaded securely to Cloudinary when you save/i)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New Actor' } });
  fireEvent.change(screen.getByLabelText('Role'), { target: { value: 'Lead actor' } });
  fireEvent.click(screen.getByRole('button', { name: 'ADD MEMBER' }));

  await waitFor(() => expect(addMember).toHaveBeenCalledTimes(1));
  const payload = addMember.mock.calls[0][0];
  expect(payload).toBeInstanceOf(FormData);
  expect(payload.get('name')).toBe('New Actor');
  expect(payload.get('role')).toBe('Lead actor');
  expect(payload.get('group')).toBe('cast');
  expect(await screen.findByText('Cast or crew member added successfully.')).toBeInTheDocument();
});
