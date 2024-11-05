import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import axios from 'axios';
import Sidebar from "../components/sidebar.js";
import useToken from "../components/useToken.js";
import loaderStyles from '../components/loader.module.css';
import './Home.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EditProfileForm = lazy(() => import('../components/editProfileForm.js'));

export default function Profile() {
  const { token } = useToken();
  const [showForm, setShowForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [profile, setProfile] = useState({});
  const [clickData, setClickData] = useState(null);
  const [postClicksData, setPostClicksData] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = (responseData) => {
    setProfile(responseData);
    setShowForm(false);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`https://bumbledore-server.vercel.app/my-profile?username=${token}`);
        setProfile(response.data);
      } catch (error) {
        setError('Error fetching profile');
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`https://bumbledore-server.vercel.app/reviews?username=${token}`);
        setReviews(response.data);
      } catch (error) {
        setError('Failed to fetch reviews');
      }
    };

    fetchProfile();
    fetchReviews();
  }, [token]);

  const fetchClickData = useCallback(async () => {
    try {
      const url = `https://bumbledore-server.vercel.app/user-clicks/${token}`;
      const response = await axios.get(url);
      setClickData(response.data.totalClicks);

      const posts = response.data.userPosts;
      const postClicks = posts.map(post => ({
        id: post._id,
        totalClicks: (post.clickCounts?.usernameClicksHome || 0) +
                      (post.clickCounts?.usernameClicksApps || 0) +
                      (post.clickCounts?.usernameClicksMessages || 0)
      }));
      setPostClicksData(postClicks);
    } catch (error) {
      setError('Error fetching clickData');
    }
  }, [token]);

  useEffect(() => {
    fetchClickData();
  }, [token, fetchClickData]);

  const averageRating = (reviews.length > 0) ? (
    (reviews.map((review) => parseInt(review.rating)).reduce((accumulator, currentValue) => accumulator + currentValue, 0) / reviews.length).toFixed(2)
  ) : (
    "-"
  );

  if (error) {
    return <p>{error}</p>; // Display error message
  }

  return (
    <div className="grid-container">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="header">
        <h1>My Profile</h1>
      </div>
      {showForm ? (
        <div className="main-page">
          <Suspense fallback={<div className={loaderStyles.loader}></div>}>
            <EditProfileForm onSubmit={handleSubmit}></EditProfileForm>
          </Suspense>
          <div>
            <button type="button" onClick={() => setShowForm(false)}>Back</button>
          </div>
        </div>
      ) : (
        <div className="main-page">
          <h2>Welcome, {token}!</h2> 
          <div className="content-box">
            <p className="content-text">Year: {profile.year}</p>
            <p className="content-text">Major: {profile.major}</p>
            <p className="content-text">Description: {profile.description}</p>
          </div>
          <div>
            <button onClick={() => setShowForm(true)}>Edit Profile</button>
          </div>
          <div className="content-box">
              <h3 className="content-text">Reviews: </h3> 
              {reviews.map(review => (
                  <div key={review._id} className="content-text">
                      <div className="content-text">-----------</div>
                      <div className="content-text">Rating: {review.rating}</div>
                      <div className="content-text">Description: {review.text}</div>
                      <div className="content-text">Average Rating: {averageRating}</div>
                  </div>
              ))}
          </div>
          {clickData && (
            <div className="charts">
              <h2>Insights</h2>
              <h3>Page where users came from</h3>
              <Bar
                data={{
                  labels: ['Home Page', 'Direct Messages Page', 'My Applications Page'],
                  datasets: [{
                    label: 'Clicks',
                    data: [clickData.usernameClicksHome, clickData.usernameClicksMessages, clickData.usernameClicksApps],
                    backgroundColor: ['rgba(75, 192, 192, 0.2)'],
                    borderColor: ['rgba(75, 192, 192, 1)'],
                    borderWidth: 1
                  }]
                }}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
              <h3>Profile Clicks by Post</h3>
              <Bar
                data={{
                  labels: postClicksData.map(post => post.id),
                  datasets: [{
                    label: 'Profile Clicks',
                    data: postClicksData.map(post => post.totalClicks),
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                  }]
                }}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
