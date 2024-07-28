import { render, screen, waitFor } from '@testing-library/react';
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
    test('renders User Profile component', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                username: "BrightChicken",
                year: "2",
                major: "cs",
                description: "hehehaha"
            }
        });

        axios.get.mockResolvedValueOnce({
            data: [] // No reviews
        });
      
        render(<BrowserRouter><UserProfile/></BrowserRouter>);
        
        await waitFor(() => {
            // Using a more flexible matcher
            const profileHeading = screen.getByText((content, element) => {
                return element.tagName.toLowerCase() === 'h1' && content.includes('Profile');
            });

            expect(profileHeading).toBeInTheDocument();

            const profileLink = screen.getByText((content, element) => {
                return element.tagName.toLowerCase() === 'a' && content.includes('Profile');
            });

            expect(profileLink).toBeInTheDocument();
        });
    });
});


