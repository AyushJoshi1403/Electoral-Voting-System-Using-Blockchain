import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            About Our Electoral Voting System
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Revolutionizing democracy through secure and transparent blockchain technology
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Vision Card */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mb-6">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600">
              To create a future where every vote is secure, transparent, and tamper-proof, ensuring the integrity of democratic processes worldwide.
            </p>
          </div>

          {/* Technology Card */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 mb-6">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Technology</h2>
            <p className="text-gray-600">
              Built on blockchain technology, our system provides immutable records, end-to-end encryption, and real-time vote tracking.
            </p>
          </div>

          {/* Features Card */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 mb-6">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Secure and anonymous voting
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Real-time result tracking
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Tamper-proof records
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">For Voters</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  Easy and accessible voting process
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  Complete privacy and security
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  Instant vote confirmation
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">For Election Officials</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  Automated vote counting
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  Real-time monitoring
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  Comprehensive audit trails
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;