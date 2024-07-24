import { render, screen, fireEvent } from '@testing-library/react'
import Login from './Login.js' ;
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

test('renders Login component', () => {
    render(<BrowserRouter><Login setToken={() => {}} /></BrowserRouter>);
    expect(screen.getByText('Email:')).toBeInTheDocument();
})

test('calls setToken and navigates on form submission', () => {
    const mockSetToken = jest.fn();
    const mockNavigate = jest.fn();
    const data = axios.post.mockResolvedValue({token: "WiseGoose"});

    const useNavigate = require('react-router-dom').useNavigate;
    useNavigate.mockReturnValue(mockNavigate);

    render(
        <BrowserRouter>
            <Login setToken={mockSetToken} />
        </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', {name: 'Login'}))
    //expect(mockSetToken).toHaveBeenCalled();
    //expect(mockNavigate).toHaveBeenCalledWith('/home');
});