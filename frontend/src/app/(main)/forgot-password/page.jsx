'use client';
import React from 'react';
import { useFormik } from 'formik';
import Link from 'next/link';

const ForgotPassword = () => {
  const forgotPasswordForm = useFormik({
    initialValues: {
      email: '',
    },
    onSubmit: async (values) => {
      console.log(values);
      // Add your forgot password logic here
    },
  });

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-gradient-to-br from-blue-50 to-white sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white rounded-2xl shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl dark:bg-neutral-900 dark:border-neutral-800">
        <div className="p-6 sm:p-8">
          <div className="text-center space-y-3">
            <div className="inline-block p-3 rounded-full bg-blue-50 dark:bg-blue-900/20">
              <svg className="size-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Reset your password
            </h1>
            <p className="text-gray-600 dark:text-neutral-400">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <form onSubmit={forgotPasswordForm.handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-neutral-300"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    required
                    onChange={forgotPasswordForm.handleChange}
                    value={forgotPasswordForm.values.email}
                    className="block w-full px-4 py-3 text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:focus:ring-blue-600"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 dark:hover:bg-blue-700 dark:focus:ring-offset-neutral-900"
              >
                Send reset instructions
              </button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Return to sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;