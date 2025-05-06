'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token is missing. Redirecting to login page.');
      window.location.href = '/login';
      return;
    }

    axios
      .get('http://localhost:5000/user/profile', { // Updated the URL to match the backend route
        headers: {
          'x-auth-token': token,
        },
      })
      .then((response) => {
        console.log(response.data);

        setUser(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        if (error.response && error.response.status === 401) {
          console.error('Unauthorized. Redirecting to login page.');
          window.location.href = '/login';
        }
      });
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="profile-container p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-6">
      <div className="profile-header flex items-center justify-between space-x-6">
        <div className="flex items-center space-x-6">
          <img
            src={user.profilePicture || '/file.svg'}
            alt="Profile Picture"
            className="w-24 h-24 rounded-full border-2 border-gray-300"
          />
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="flex space-x-6"> {/* Buttons reordered */}
          <button
            onClick={() => window.location.href = '/user/profile-update'}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="profile-details space-y-6">
        <div className="personal-info space-y-4">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Age:</strong> {user.age}</p>
          <p><strong>Date of Birth:</strong> {new Date(user.dateOfBirth).toLocaleDateString()}</p>
          <p><strong>Address:</strong> {user.address}</p>
          <p><strong>City:</strong> {user.city}</p>
          <p><strong>Pin Code:</strong> {user.pinCode}</p>
        </div>

        <div className="additional-info space-y-4">
          <h2 className="text-xl font-semibold">Additional Information</h2>
          <p><strong>Aadhar Number:</strong> {user.aadharNumber}</p>
          <p><strong>Voter ID:</strong> {user.voterId}</p>
          <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;