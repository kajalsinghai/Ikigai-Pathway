import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '../components/Layout';
import UserInfoModal from '../components/UserInfoModal';
import ProgressTracker from '../components/ProgressTracker';
import { useSimpleUser } from '../context/SimpleUserContext';

export default function Home() {
  const router = useRouter();
  const { user, loading, saveUserInfo } = useSimpleUser();
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);

  // Check if we need to show the user info modal
  useEffect(() => {
    if (!loading && !user) {
      setShowUserInfoModal(true);
    }
  }, [loading, user]);

  const handleBeginJourney = () => {
    if (user) {
      // User exists, navigate directly to the first pillar
      router.push('/pillars/passion');
    } else {
      // Show the modal to collect user info
      setShowUserInfoModal(true);
    }
  };

  const handleSaveUserInfo = async (email: string, avatarId: string) => {
    const result = await saveUserInfo(email, avatarId);
    
    if (result.success) {
      setShowUserInfoModal(false);
      // Navigate to the first pillar
      router.push('/pillars/passion');
    } else {
      console.error('Failed to save user info:', result.message);
      // Error handling will be done in the modal component
    }
  };

  return (
    <Layout>
      <div className="relative min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/zen_garden_bg.jpg"
            alt="Japanese Garden"
            layout="fill"
            objectFit="cover"
            priority
          />
          <div className="absolute inset-0 bg-sumi bg-opacity-40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 text-center">
          <h1 className="mb-6 text-4xl md:text-6xl font-noto text-softWhite leading-tight">
            Discover Your <span className="text-gold">Ikigai</span>
          </h1>
          
          <p className="mb-8 max-w-2xl text-lg md:text-xl text-softWhite font-sawarabi">
            Explore the ancient Japanese concept of finding purpose.
          </p>
          
          {user && (
            <div className="mb-8 bg-white bg-opacity-90 rounded-lg shadow-md p-4 max-w-md w-full">
              <ProgressTracker userId={user.id} compact={true} />
            </div>
          )}
          
          <button
            onClick={handleBeginJourney}
            className="px-8 py-3 bg-bamboo text-white rounded-md shadow-lg font-sawarabi text-lg transition duration-300 transform hover:scale-105 hover:bg-opacity-90"
          >
            {user ? 'Continue Your Journey' : 'Begin Your Journey'}
          </button>
        </div>
      </div>

      {/* User Info Modal */}
      <UserInfoModal
        isOpen={showUserInfoModal}
        onClose={() => setShowUserInfoModal(false)}
        onSave={handleSaveUserInfo}
      />
    </Layout>
  );
}
