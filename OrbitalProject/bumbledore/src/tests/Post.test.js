import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Post from '../pages/Post.js' ;
import Home from '../pages/Home.js' ;
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

const mockSetState = jest.fn();

/*jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: value => [true, mockSetState],
  }));

  import { useState } from 'react';*/

describe("page loads correctly",() => {
    test('renders Post component', () => {
        render(<BrowserRouter><Post/></BrowserRouter>);
        expect(screen.getByRole("heading", {name: "Post"})).toBeInTheDocument();
    })
    
    /*test('form able to be filled in with Looking For Tutor', async () => {
        const user = userEvent.setup();
        const useState = require('react').useState;
        useState.mockReturnValue(value);
    
        render(
            <BrowserRouter>
                <Post />
            </BrowserRouter>
        );
    
        const typeOfRequestInput = screen.getByText("Type of Request:");
        const courseCodeInput = screen.getByText('Course Code:');
        const descriptionInput = screen.getByText("Description:")
    
        await user.click(typeOfRequestInput);
        expect(screen.getByText("Looking for Tutor")).toBeInTheDocument();
        await user.click(screen.getByTestId("lookingForTutor"));
        typeOfRequestInput.value = "lookingForTutor";
        expect(typeOfRequestInput.value).toBe("lookingForTutor");

        const payInput = screen.getByText('Pay:');
        expect(payInput).toBeInTheDocument();

        await user.type(payInput, "1");
        expect(payInput.value).toBe("1");

        await user.type(courseCodeInput, "cs1010a");
        expect(courseCodeInput.value).toBe("cs1010a");

        await user.type(descriptionInput, "yay");
        expect(descriptionInput.value).toBe("yay");
    
    });

    test('form able to be filled in with Looking For Groupmate', async () => {
        const user = userEvent.setup()
    
        render(
            <BrowserRouter>
                <Post />
            </BrowserRouter>
        );
    
        const typeOfRequestInput = screen.getByText("Type of Request:");
        const courseCodeInput = screen.getByText('Course Code:');
        const descriptionInput = screen.getByText("Description:")
    
        await user.click(typeOfRequestInput);
        await user.click(screen.getByTestId("lookingForGroupmate"));
        typeOfRequestInput.value = "lookingForGroupmate";
        expect(typeOfRequestInput.value).toBe("lookingForGroupmate");

        const numberOfMembersInput = screen.getByText('Number of Groupmates Needed:');
        expect(numberOfMembersInput).toBeInTheDocument();

        await user.type(numberOfMembersInput, "1");
        expect(numberOfMembersInput.value).toBe("1");

        await user.type(courseCodeInput, "bt2102");
        expect(courseCodeInput.value).toBe("bt2102");

        await user.type(descriptionInput, "yay");
        expect(descriptionInput.value).toBe("yay");
    
    });
})

describe('correct form input and submission', () => {
    test('after form filled in with correct details, clicking on \'Submit\' button navigates user to Home page', async () => {
        axios.post.mockResolvedValue("Post created successfully");
        const mockNavigate = jest.fn();
        const mockSubmit = jest.fn(() => {
            mockNavigate();
        });

        const { getByRole } = render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        )
        
        const user = userEvent.setup()
        const useNavigate = require('react-router-dom').useNavigate;
        useNavigate.mockReturnValue(mockNavigate);
    
        render(
            <BrowserRouter>
                <Post />
            </BrowserRouter>
        );
    
        const form = screen.getByLabelText("post-form");
        expect(form).toBeInTheDocument();
        form.onsubmit = mockSubmit;
    
        const typeOfRequestInput = screen.getByText("Type of Request:");
        const courseCodeInput = screen.getByText('Course Code:');
        const descriptionInput = screen.getByText("Description:")

        await user.click(typeOfRequestInput);
        await user.click(screen.getByTestId("lookingForGroupmate"));
        typeOfRequestInput.value = "lookingForGroupmate";
        const numberOfMembersInput = screen.getByText('Number of Groupmates Needed:');
        await user.type(numberOfMembersInput, "1");
        await user.type(courseCodeInput, "bt2102");
        await user.type(descriptionInput, "yay");
    
        
        await user.click(screen.getByRole('button', {name: 'Submit'}));
        expect(mockSubmit).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalled();
        expect(screen.getByText("All Posts")).toBeInTheDocument();
    });*/
})