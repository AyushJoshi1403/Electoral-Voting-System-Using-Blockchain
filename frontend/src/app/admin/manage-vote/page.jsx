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
            console.table(result.data);
            setVoterList(result.data);
        }).catch((err) => {
            console.log(err);

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
        axios.delete('http://localhost:5000/voter/delete/' + id, {
            headers: {
                'x-auth-token': token
            }
        })
        .then((result) => {
            toast.success('Voter Deleted Successfully');
            fetchVoters();
        }).catch((err) => {
            console.log(err);
            toast.error('Failed to delete voter');
        });
    };

    return (
        <div className=''>
            <div className='container mx-auto py-10'>
                <h1 className='text-center text-2xl font-bold'>Voting Data</h1>

                <table className='w-full'>
                    <thead>
                        <tr className='bg-gray-600 text-white font-bold'>
                            <th className='p-3'>Voter ID</th>
                            <th className='p-3'>Public Key</th>
                            <th className='p-3'>Voting District</th>
                            <th className='p-3'>Voting Status</th>
                            <th className='p-3'>Nonce</th>
                            <th className='p-3'>Registration Timestamp</th>
                            <th className='p-3'>Last Auth Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            voterList.map((voter) => {
                                return (
                                    <tr className='border bg-gray-200' key={voter.voterId}>
                                        <td className='p-3'>{voter.voterId}</td>
                                        <td className='p-3'>{voter.publicKey}</td>
                                        <td className='p-3'>{voter.votingDistrict}</td>
                                        <td className='p-3'>{voter.votingStatus}</td>
                                        <td className='p-3'>{voter.nonce}</td>
                                        <td className='p-3'>{new Date(voter.registrationTimestamp).toLocaleString()}</td>
                                        <td className='p-3'>{new Date(voter.lastAuthTimestamp).toLocaleString()}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageVotePage;