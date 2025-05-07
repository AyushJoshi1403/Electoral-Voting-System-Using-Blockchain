'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ManageVotePage = () => {
  const [voterList, setVoterList] = useState([]);
  const token = localStorage.getItem('token');
  const router = useRouter();

  const fetchVoters = () => {
    axios.get('http://localhost:5000/voter/getall', {
      headers: {
        'x-auth-token': token
      }
    })
    .then((result) => {
      setVoterList(result.data);
    }).catch((err) => {
      if (err?.response?.status === 403) {
        toast.error('You are not authorized to view this page');
        router.push('/login');
      }
    });
  };

  useEffect(() => {
    fetchVoters();
  }, []);

  const deleteVoter = (id) => {
    axios.delete(`http://localhost:5000/voter/delete/${id}`, {
      headers: {
        'x-auth-token': token
      }
    })
    .then(() => {
      toast.success('Voter deleted successfully');
      fetchVoters();
    }).catch(() => {
      toast.error('Failed to delete voter');
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Voting Data</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Voter ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Public Key</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Voting District</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Voting Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Nonce</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Registered</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Last Auth</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {voterList.map((voter) => (
                <tr key={voter.voterId} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 text-sm text-gray-700 break-words">{voter.voterId}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 break-words">{voter.publicKey}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{voter.votingDistrict}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      voter.votingStatus === 'voted'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {voter.votingStatus}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">{voter.nonce}</td>
                  <td className="px-4 py-2 text-sm text-gray-500">{new Date(voter.registrationTimestamp).toLocaleString()}</td>
                  <td className="px-4 py-2 text-sm text-gray-500">{new Date(voter.lastAuthTimestamp).toLocaleString()}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => deleteVoter(voter.voterId)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full text-sm shadow"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {voterList.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-gray-500 py-6">No voter records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageVotePage;
