import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateAccount from './CreateAccount.js' ;
import Login from './Login.js' ;
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

describe("page loads correctly",() => {
    test('renders CreateAccount component', () => {
        render(<BrowserRouter><CreateAccount/></BrowserRouter>);
        expect(screen.getByRole("button", {value: "Create Account"})).toBeInTheDocument();
    })
    
    test('form able to be filled in', async () => {
        const user = userEvent.setup()
    
        render(
            <BrowserRouter>
                <CreateAccount />
            </BrowserRouter>
        );
    
        const emailInput = screen.getByTestId("email-createaccount");
        const passwordInput = screen.getByTestId('password-createaccount');
    
        await user.type(emailInput, 'a@gmail.com');
        expect(emailInput.value).toBe('a@gmail.com');
    
        await user.type(passwordInput, '0000');
        expect(passwordInput.value).toBe('0000');
    });
})

describe('correct form input and submission', () => {
    test('after form filled in with valid email and password, clicking on \'Create Account\' button navigates user to Login page', async () => {
        axios.post.mockResolvedValue("Account created successfully");
        const mockNavigate = jest.fn();
        const mockSubmit = jest.fn(() => {
            if (emailInput.value === "a@gmail.com" && passwordInput.value === "0000") {
                mockNavigate();
            }
        });

        const { getByRole } = render(
            <BrowserRouter>
                <Login setToken={() => {}}/>
            </BrowserRouter>
        )
        
        const user = userEvent.setup()
        const useNavigate = require('react-router-dom').useNavigate;
        useNavigate.mockReturnValue(mockNavigate);
    
        render(
            <BrowserRouter>
                <CreateAccount />
            </BrowserRouter>
        );
    
        const form = screen.getByLabelText("create-account-form");
        expect(form).toBeInTheDocument();
        form.onsubmit = mockSubmit;
    
        const emailInput = screen.getByTestId("email-createaccount");
        const passwordInput = screen.getByTestId('password-createaccount');
    
        await user.type(emailInput, 'a@gmail.com');
        await user.type(passwordInput, '0000');
        
        await user.click(screen.getByRole('button', {name: 'Create Account'}));
        expect(mockSubmit).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalled();
        expect(screen.getByLabelText("login-form")).toBeInTheDocument();
    });

    /*test('after form filled in with invalid email, clicking on \'Login\' button gives \'User not found\' error', async () => {
        axios.post.mockResolvedValue({token: "WiseGoose"});
        axios.get.mockResolvedValue({});
        const mockSetToken = jest.fn(() => {token: "WiseGoose"});
        const mockNavigate = jest.fn();
        const mockSubmit = jest.fn(() => {
            if (emailInput.value === "a@gmail.com" && passwordInput.value === "0000") {
                mockSetToken();
                mockNavigate();
            }
        });

        const { getByRole } = render(
            <BrowserRouter>
                <Home/>
            </BrowserRouter>
        )
        
        const user = userEvent.setup()
        const useNavigate = require('react-router-dom').useNavigate;
        useNavigate.mockReturnValue(mockNavigate);
    
        render(
            <BrowserRouter>
                <Login setToken={mockSetToken} />
            </BrowserRouter>
        );
    
        const form = screen.getByLabelText("login-form");
        expect(form).toBeInTheDocument();
        form.onsubmit = mockSubmit;
    
        const emailInput = screen.getByLabelText('Email:');
        const passwordInput = screen.getByLabelText('Password:');
    
        await user.type(emailInput, 'a@gmail.co');
        await user.type(passwordInput, '0000');
        
        await user.click(screen.getByRole('button', {name: 'Login'}));
        expect(mockSubmit).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(screen.getByText('All Posts')).not.toBeInTheDocument();
    });*/
})