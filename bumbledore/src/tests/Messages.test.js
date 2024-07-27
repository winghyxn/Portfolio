import { render, screen } from '@testing-library/react';
import Messages from '../pages/Messages.js';
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
  test('renders Messages component', () => {
      render(<BrowserRouter><Messages/></BrowserRouter>);
      expect(screen.getByRole("heading", {name: "Messages"})).toBeInTheDocument();
  });
});
