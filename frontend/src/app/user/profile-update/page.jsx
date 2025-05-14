'use client';
import axios from 'axios';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

// Updated the ProfileUpdate page to ensure it works as a submit form, pre-filling existing user data and allowing updates.

const ProfileUpdate = () => {
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token is missing. Redirecting to login page.');
        window.location.href = '/login';
        return;
      }

      const res = await axios.get('http://localhost:5000/user/profile', {
        headers: {
          'x-auth-token': token,
        },
      });

      if (res.status === 200) {
        setUserData(res.data);
      } else {
        console.error('Unexpected response status:', res.status);
        toast.error('Failed to fetch user data. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('An error occurred while fetching user data. Please check your connection or try again later.');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const submitForm = (values) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing. Redirecting to login page.');
      window.location.href = '/login';
      return;
    }

    axios.put('http://localhost:5000/user/update-profile', values, {
      headers: {
        'x-auth-token': token,
      },
    })
      .then(() => {
        toast.success('Profile updated successfully');
        router.push('/user/profile'); // Redirect to profile page after update
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile');
      });
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Update Profile
            </h1>
          </div>
          <div className="mt-5">
            {userData ? (
              <Formik initialValues={userData} onSubmit={submitForm} enableReinitialize>
                {(form) => (
                  <form onSubmit={form.handleSubmit} className="grid gap-y-4">
                    {/* Form fields pre-filled with existing user data */}
                    <div>
                      <label htmlFor="name" className="block text-sm mb-2 dark:text-white">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        onChange={form.handleChange}
                        value={form.values.name}
                        className="border py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="age" className="block text-sm mb-2 dark:text-white">
                        Age
                      </label>
                      <input
                        type="number"
                        id="age"
                        name="age"
                        onChange={form.handleChange}
                        value={form.values.age}
                        className="border py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm mb-2 dark:text-white">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        onChange={form.handleChange}
                        value={form.values.dateOfBirth}
                        className="border py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm mb-2 dark:text-white">
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        onChange={form.handleChange}
                        value={form.values.address}
                        className="border py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm mb-2 dark:text-white">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        onChange={form.handleChange}
                        value={form.values.city}
                        className="border py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="pinCode" className="block text-sm mb-2 dark:text-white">
                        Pin Code
                      </label>
                      <input
                        type="text"
                        id="pinCode"
                        name="pinCode"
                        onChange={form.handleChange}
                        value={form.values.pinCode}
                        className="border py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="aadharNumber" className="block text-sm mb-2 dark:text-white">
                        Aadhar Number
                      </label>
                      <input
                        type="text"
                        id="aadharNumber"
                        name="aadharNumber"
                        onChange={form.handleChange}
                        value={form.values.aadharNumber}
                        className="border py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="voterId" className="block text-sm mb-2 dark:text-white">
                        Voter ID
                      </label>
                      <input
                        type="text"
                        id="voterId"
                        name="voterId"
                        onChange={form.handleChange}
                        value={form.values.voterId}
                        className="border py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm mb-2 dark:text-white">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        onChange={form.handleChange}
                        value={form.values.phoneNumber}
                        className="border py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                    >
                      Update Profile
                    </button>
                  </form>
                )}
              </Formik>
            ) : (
              <p className="text-center my-10 font-bold text-2xl">Loading...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
