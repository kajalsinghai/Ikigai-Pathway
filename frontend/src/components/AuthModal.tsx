import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useUser } from '../context/UserContext';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signIn, signUp } = useUser();
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [avatarId, setAvatarId] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Available avatars
  const avatars = [
    { id: 'Geisha', name: 'Geisha' },
    { id: 'Ninja', name: 'Ninja' },
    { id: 'Samurai Warrior', name: 'Samurai Warrior' },
    { id: 'Sumo Wrestler', name: 'Sumo Wrestler' },
  ];

  useEffect(() => {
    // Reset form when modal opens/closes or switches between sign in/sign up
    setEmail('');
    setPassword('');
    setUsername('');
    setAvatarId('');
    setError('');
    setSuccessMessage('');
    setAllFieldsFilled(false);
  }, [isOpen, isSignUp]);

  // Check if all fields are filled for sign up
  useEffect(() => {
    if (isSignUp) {
      setAllFieldsFilled(!!email && !!password && !!username && !!avatarId);
    } else {
      setAllFieldsFilled(!!email && !!password);
    }
  }, [email, password, username, avatarId, isSignUp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Validate fields
        if (!email || !password || !username || !avatarId) {
          throw new Error('All fields are required');
        }
        
        const result = await signUp(email, password, username, avatarId);
        setSuccessMessage(result.message);
        
        // Close modal after a short delay to show success message
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        if (!email || !password) {
          throw new Error('Email and password are required');
        }
        
        await signIn(email, password);
        onClose();
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click was outside the modal content
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-sumi bg-opacity-75 flex items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      <div 
        ref={modalRef}
        className="bg-softWhite rounded-lg shadow-xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-sumi hover:text-indigo"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-noto text-indigo text-center mb-6">
          {isSignUp ? 'Create Your Account' : 'Welcome Back'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block font-sawarabi text-sumi mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block font-sawarabi text-sumi mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo"
              required
            />
          </div>

          {isSignUp && (
            <>
              <div className="mb-4">
                <label htmlFor="username" className="block font-sawarabi text-sumi mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block font-sawarabi text-sumi mb-2">
                  Choose Your Avatar
                </label>
                <div className="overflow-x-auto pb-2">
                  <div className="flex space-x-4 min-w-max">
                    {avatars.map((avatar) => (
                      <div
                        key={avatar.id}
                        className={`border-2 rounded-lg p-2 cursor-pointer transition-all flex-shrink-0 w-32 ${
                          avatarId === avatar.id
                            ? 'border-indigo bg-indigo bg-opacity-10'
                            : 'border-gray-200 hover:border-indigo'
                        }`}
                        onClick={() => setAvatarId(avatar.id)}
                      >
                        <div className="relative h-24 w-full mb-2">
                          <Image
                            src={`/images/avatar images/${avatar.id}.jpg`}
                            alt={avatar.name}
                            layout="fill"
                            objectFit="contain"
                          />
                        </div>
                        <p className="text-center font-sawarabi text-sm">{avatar.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading || !allFieldsFilled}
            className={`w-full font-sawarabi py-2 px-4 rounded-md transition duration-300 mt-4 ${
              allFieldsFilled 
                ? 'bg-bamboo hover:bg-bamboo-dark text-white transform hover:scale-105' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
          
          <div className="text-center mt-4">
            {isSignUp ? (
              <p className="text-sumi font-sawarabi">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-indigo hover:text-indigo-dark font-medium"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p className="text-sumi font-sawarabi">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-indigo hover:text-indigo-dark font-medium"
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
