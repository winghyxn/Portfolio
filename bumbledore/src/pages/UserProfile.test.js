import { render, screen } from '@testing-library/react';
import UserProfile from './UserProfile.js';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe("page loads correctly", () => {
  test('renders User Profile component', () => {
      render(<BrowserRouter><UserProfile/></BrowserRouter>);
      expect(screen.getByRole("heading", {name: "'s Profile"})).toBeInTheDocument();
  });
});
