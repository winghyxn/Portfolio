import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import MyPosts from '../pages/MyPosts.js';

jest.mock('axios');

beforeEach(() => {
    jest.clearAllMocks();
});

describe("page loads correctly", () => {
    const token = 'InnovativePorcupine';
    test('shows loader while fetching data, then render users posts', async () => {
        // Mock posts data
        axios.get.mockResolvedValueOnce({
            data: [{
                applicants: ['BrightChicken', 'WiseGoose'],
                clickCounts: {messageClicks: 2, applyClicks: 2, usernameClicksHome: 1, usernameClicksApps: 1, usernameClicksMessages: 1},
                courseCode: "cs1010",
                createdAt: "2024-07-17T11:32:37.530Z",
                description: "testy",
                numGroupmates: null,
                pay: "2/h",
                status: "Open",
                typeOfRequest: "lookingForTutor",
                username: "InnovativePorcupine",
                _id: "6697abd5d0a210744d5b43c1"
            }]
        });

        // Mock click data
        axios.get.mockResolvedValueOnce({
            data: {
                messageClicks: 2,
                applyClicks: 2,
                usernameClicksHome: 1,
                usernameClicksApps: 1,
                usernameClicksMessages: 1
            }
        });

        render(<BrowserRouter><MyPosts /></BrowserRouter>);

        // Check for loading state
        expect(screen.getByText("Loading...")).toBeInTheDocument();

        // Wait for the component to fetch data and update
        await waitFor(() => {
            // Get all elements with the text 'My Posts'
            const myPostsElements = screen.getAllByText('My Posts');
            
            // Check if the number of elements matches your expectation
            expect(myPostsElements).toHaveLength(2); // Adjust as needed

            // Optionally, you can also check specific element types if necessary
            expect(myPostsElements.some(el => el.tagName === 'H1')).toBe(true);
            expect(myPostsElements.some(el => el.tagName === 'A')).toBe(true);
        });
    });
});
