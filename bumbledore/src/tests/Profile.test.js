import { render, screen } from '@testing-library/react';
import Profile from '../pages/Profile.js';
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
  test('renders Profile component', () => {
      render(<BrowserRouter><Profile/></BrowserRouter>);
      expect(screen.getByRole("heading", {name: "My Profile"})).toBeInTheDocument();
  });
});
