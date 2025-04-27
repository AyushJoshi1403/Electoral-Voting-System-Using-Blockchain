'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
    if (token && userId) {
      axios
        .get(`/api/user/getbyid/${userId}`, {
          headers: {
            'x-auth-token': token,
          },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-container p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-6">
      <div className="profile-header flex items-center space-x-6">
        <img
          src={user.profilePicture || '/public/file.svg'}
          alt="Profile Picture"
          className="w-24 h-24 rounded-full border-2 border-gray-300"
        />
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
          <p className="text-gray-700 mt-2">{user.city}</p>
        </div>
      </div>

      <div className="profile-details grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="contact-info space-y-2">
          <h2 className="text-xl font-semibold">Contact Information</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>City:</strong> {user.city}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;