'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import * as Yup from 'yup';

const VoterSchema = Yup.object().shape({
    voterId: Yup.string().required('Voter ID is required'),
    publicKey: Yup.string().required('Public Key is required'),
    votingDistrict: Yup.string().required('Voting District is required'),
    votingStatus: Yup.string().required('Voting Status is required').oneOf(['registered', 'not registered'], 'Invalid voting status'),
    nonce: Yup.string().required('Nonce is required'),
});

const Voter = () => {

    const router = useRouter();

    const VoteForm = useFormik({
        initialValues: {
            voterId: '',
            publicKey: '',
            votingDistrict: '',
            votingStatus: '',
            nonce: '',
        },
        onSubmit: (values) => {
            console.log(values);

            axios.post('http://localhost:5000/voter/add', values)
                .then((result) => {
                    toast.success('Voter added successfully');
                    router.push('/login');
                }).catch((err) => {
                    console.log(err);
                    toast.error(err?.response?.data?.message || 'Some error occured');
                });

        },
        validationSchema: VoterSchema
    });

    return (
        <div className="max-w-xl mx-auto">
            <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
                <div className="p-4 sm:p-7">
                    <div className="text-center">
                        <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                            Voting System
                        </h1>
                    </div>
                    <div className="mt-5">
                        <form onSubmit={VoteForm.handleSubmit}>
                            <div className="grid gap-y-4">
                                <div>
                                    <label htmlFor="voterId" className="block text-sm mb-2 dark:text-white">Voter ID</label>
                                    <input
                                        id="voterId"
                                        name="voterId"
                                        type="text"
                                        onChange={VoteForm.handleChange}
                                        onBlur={VoteForm.handleBlur}
                                        value={VoteForm.values.voterId}
                                        className="border py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                    />
                                    {VoteForm.touched.voterId && VoteForm.errors.voterId ? (
                                        <p className="text-xs text-red-600 mt-2">{VoteForm.errors.voterId}</p>
                                    ) : null}
                                </div>

                                <div>
                                    <label htmlFor="publicKey" className="block text-sm mb-2 dark:text-white">Public Key</label>
                                    <input
                                        id="publicKey"
                                        name="publicKey"
                                        type="text"
                                        onChange={VoteForm.handleChange}
                                        onBlur={VoteForm.handleBlur}
                                        value={VoteForm.values.publicKey}
                                        className="border py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="votingDistrict" className="block text-sm mb-2 dark:text-white">Voting District</label>
                                    <input
                                        id="votingDistrict"
                                        name="votingDistrict"
                                        type="text"
                                        onChange={VoteForm.handleChange}
                                        onBlur={VoteForm.handleBlur}
                                        value={VoteForm.values.votingDistrict}
                                        className="border py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                    />
                                    {VoteForm.touched.votingDistrict && VoteForm.errors.votingDistrict ? (
                                        <p className="text-xs text-red-600 mt-2">{VoteForm.errors.votingDistrict}</p>
                                    ) : null}
                                </div>

                                <div>
                                    <label htmlFor="votingStatus" className="block text-sm mb-2 dark:text-white">Voting Status</label>
                                    <select
                                        id="votingStatus"
                                        name="votingStatus"
                                        onChange={VoteForm.handleChange}
                                        onBlur={VoteForm.handleBlur}
                                        value={VoteForm.values.votingStatus}
                                        className="border py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="registered">Registered</option>
                                        <option value="not registered">Not Registered</option>
                                    </select>
                                    {VoteForm.touched.votingStatus && VoteForm.errors.votingStatus ? (
                                        <p className="text-xs text-red-600 mt-2">{VoteForm.errors.votingStatus}</p>
                                    ) : null}
                                </div>

                                <div>
                                    <label htmlFor="nonce" className="block text-sm mb-2 dark:text-white">Nonce</label>
                                    <input
                                        id="nonce"
                                        name="nonce"
                                        type="text"
                                        onChange={VoteForm.handleChange}
                                        onBlur={VoteForm.handleBlur}
                                        value={VoteForm.values.nonce}
                                        className="border py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Voter;