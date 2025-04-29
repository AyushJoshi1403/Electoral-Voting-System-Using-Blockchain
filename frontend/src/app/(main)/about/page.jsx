import React from 'react';

const About = () => {
  return (
    <div className="about-page bg-gray-100 text-gray-800 p-6 md:p-12">
      <h1 className="text-4xl font-bold mb-6 text-center">About Our Electoral Voting System</h1>
      <p className="text-lg leading-relaxed mb-6">
        Welcome to our Electoral Voting System powered by Blockchain technology. Our platform is designed to ensure secure, transparent, and tamper-proof voting processes for elections of all scales.
      </p>
      <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
      <ul className="list-disc list-inside mb-6">
        <li>Secure and decentralized voting using blockchain technology.</li>
        <li>Real-time vote counting and result generation.</li>
        <li>Easy-to-use interface for voters, administrators, and election officials.</li>
      </ul>
      <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
      <p className="text-lg leading-relaxed mb-6">
        Our system leverages the power of blockchain to record votes in an immutable ledger. Each vote is encrypted and stored securely, ensuring that no unauthorized access or tampering can occur. Voters can cast their votes online, and the results are calculated transparently in real-time.
      </p>
      <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
      <ul className="list-disc list-inside mb-6">
        <li>Enhanced security and privacy for voters.</li>
        <li>Elimination of manual errors in vote counting.</li>
        <li>Transparency and trust in the electoral process.</li>
      </ul>
      <p className="text-lg leading-relaxed">
        Join us in revolutionizing the way elections are conducted. Together, we can build a future where every vote truly counts.
      </p>
    </div>
  );
};

export default About;