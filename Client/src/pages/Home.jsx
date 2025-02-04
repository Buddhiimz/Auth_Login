import React from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import AnimatedBackgroundBubbles from '../components/AnimatedBackgroundBubbles'; // Adjust path as needed

const Home = () => {
  return (
    <AnimatedBackgroundBubbles>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Navbar />
        <Header />
      </div>
    </AnimatedBackgroundBubbles>
  );
};

export default Home;
