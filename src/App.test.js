import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';
import Admin from './Components/Admin/Admin';
import api from './services/api';

const testMembers = [
  { id: '1', name: 'Teddy Ngare', role: 'Director', group: 'crew', image: '/cast/Teddy.jpeg', slug: 'teddy-ngare' },
  { id: '2', name: 'Felister Mwende', role: 'Producer', group: 'crew', image: '/cast/Felister.jpeg', slug: 'felister-mwende' },
  { id: '3', name: 'Rita Njeri', role: 'Script writer', group: 'crew', image: '/cast/Ritah.jpeg', slug: 'rita-njeri' },
  { id: '4', name: 'Serena Spechiozers', role: 'Director of photography', group: 'crew', image: '/cast/Serena.jpeg', slug: 'serena-spechiozers' },
  { id: '5', name: 'Gift Kioko', role: 'Videographer', group: 'crew', image: '/cast/Gift.jpeg', slug: 'gift-kioko' },
  { id: '6', name: 'Felix Ochari', role: 'Editor', group: 'crew', image: '/cast/Felix.jpeg', slug: 'felix-ochari' },
  { id: '7', name: 'Daniel Gori', role: 'Sound', group: 'crew', image: '/cast/Daniel.jpeg', slug: 'daniel-gori' },
  { id: '8', name: 'Dimitry Bifwoli', role: 'Main actor', group: 'cast', image: '/cast/Dimitry.jpeg', slug: 'dimitry-bifwoli' },
  { id: '9', name: 'Evelyn Mwikali', role: 'Supporting actor', group: 'cast', image: '/cast/Evelyne.jpeg', slug: 'evelyn-mwikali' }
];

beforeEach(() => {
  window.history.replaceState({}, '', '/');
  localStorage.clear();
  jest.spyOn(api, 'members').mockResolvedValue({ members: [] });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders the homepage', async () => {
  render(<App />);
  expect(await screen.findByRole('heading', { name: 'THE RUSH' })).toBeInTheDocument();
  expect(await screen.findByText(/profiles will appear here when the production team adds them/i)).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /Teddy Ngare/ })).not.toBeInTheDocument();
});

test('renders cast and crew entered in the admin database', async () => {
  api.members.mockResolvedValue({ members: [testMembers[0]] });
  render(<App />);
  expect(await screen.findByRole('link', { name: /Teddy Ngare/ })).toHaveAttribute('href', '/cast/teddy-ngare');
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
  api.members.mockResolvedValue({ members: testMembers });
  render(<App />);
  fireEvent.click(await screen.findByRole('link', { name: 'Cast & crew' }));
  fireEvent.click(await screen.findByRole('link', { name: /Teddy Ngare/ }));
  expect(await screen.findByRole('heading', { name: 'Teddy Ngare' })).toBeInTheDocument();
  expect(screen.getByText('Director')).toBeInTheDocument();
  expect(screen.getByRole('img', { name: 'Teddy Ngare' })).toHaveAttribute('src', '/cast/Teddy.jpeg');
});

test('shows the provided cast and crew names', async () => {
  api.members.mockResolvedValue({ members: testMembers });
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
  expect(screen.getByText(/try Cloudinary first and use temporary backend storage/i)).toBeInTheDocument();
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
