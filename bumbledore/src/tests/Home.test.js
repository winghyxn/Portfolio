import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '../pages/Home.js' ;
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

//jest.spyOn(React, 'useEffect').mockImplementation((f) => f());

beforeEach(() => {
    jest.clearAllMocks();
  });

describe("page loads correctly",() => {
    const token = "WiseGoose";

    test('shows loader while fetching data, then renders the home component and posts', async () => {
        axios.get.mockResolvedValueOnce({data: [{
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
            _id: "6697abd5d0a210744d5b43c1"}]});
        const { getAllByTestId, getByText } = render(<BrowserRouter><Home/></BrowserRouter>);
        expect(screen.getByText("Loading...")).toBeInTheDocument();
        expect(screen.getByText('All Posts')).toBeInTheDocument();
        await waitFor(() => {screen.getByTestId("post")});
    });
})
