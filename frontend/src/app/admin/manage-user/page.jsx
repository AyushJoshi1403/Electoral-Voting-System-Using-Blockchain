'use client';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ManageUser = () => {
  const [userList, setUserList] = useState([]);
  const token = localStorage.getItem('token');
  const router = useRouter();

  const fetchUsers = () => {
    axios.get('http://localhost:5000/user/getall', {
      headers: {
        'x-auth-token': token
      }
    })
      .then((result) => {
        setUserList(result.data);
      }).catch((err) => {
        if (err?.response?.status === 403) {
          toast.error('You are not authorized to view this page');
          router.push('/login');
        }
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = (id) => {
    axios.delete(`http://localhost:5000/user/delete/${id}`)
      .then(() => {
        toast.success('User deleted successfully');
        fetchUsers();
      }).catch(() => {
        toast.error('Failed to delete user');
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Manage Users</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Password</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">City</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Created At</th>
                <th className="px-4 py-3 text-center text-sm font-semibold" colSpan={2}>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userList.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 text-sm text-gray-600 break-words">{user._id}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{user.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{user.email}</td>
                  <td className="px-4 py-2 text-sm text-gray-500">{user.password}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{user.city}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {new Date(user.createdAt).toDateString()}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-center">
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full text-sm shadow"
                    >
                      Delete
                    </button>
                  </td>
                  <td className="px-2 py-2 text-center">
                    <Link
                      href={`/updateuser/${user._id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full text-sm shadow"
                    >
                      Update
                    </Link>
                  </td>
                </tr>
              ))}
              {userList.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-gray-500 py-6">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
