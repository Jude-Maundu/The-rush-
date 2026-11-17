import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  window.history.replaceState({}, '', '/');
  localStorage.clear();
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
