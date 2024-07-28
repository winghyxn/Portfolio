import { render, screen, waitFor } from '@testing-library/react';
import Profile from './Profile.js';
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

describe('Profile Component', () => {
    test('renders Profile heading', async () => {
        // Mock the profile API response
        axios.get.mockResolvedValueOnce({
            data: {
                username: "BrightChicken",
                year: "2",
                major: "cs",
                description: "hehehaha"
            }
        });

        // Mock the click data API response with no posts
        axios.get.mockResolvedValueOnce({
            data: {
                "totalClicks": {
                    "usernameClicksHome": 0,
                    "usernameClicksApps": 0,
                    "usernameClicksMessages": 0
                },
                "userPosts": []
            }
        });

        render(
            <BrowserRouter>
                <Profile />
            </BrowserRouter>
        );

        await waitFor(() => {
            const profileElements = screen.getAllByText('My Profile');
            
            expect(profileElements).toHaveLength(2);

            expect(profileElements.some(el => el.tagName === 'H1')).toBe(true);
            expect(profileElements.some(el => el.tagName === 'A')).toBe(true);
        });
    });
});
