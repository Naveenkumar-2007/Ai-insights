import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Shield, LogOut, Key } from 'lucide-react';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = () => {
    navigate('/change-password');
  };

  const getMemberSince = () => {
    if (currentUser?.metadata?.creationTime) {
      const date = new Date(currentUser.metadata.creationTime);
      return date.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      });
    }

    return new Date().toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isEmailVerified = currentUser?.emailVerified || false;

  const getAuthProvider = () => {
    if (currentUser?.providerData && currentUser.providerData.length > 0) {
      const providerId = currentUser.providerData[0].providerId;
      if (providerId === 'google.com') return 'Google.com';
      if (providerId === 'password') return 'Email/Password';
      return providerId;
    }
    return 'Email/Password';
  };

  return (
    <div className="min-h-screen bg-brand-50 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 rounded-t-2xl sm:rounded-t-3xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-brand-600" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold">Account Profile</h1>
              <p className="text-brand-100 mt-1 text-sm sm:text-base line-clamp-2">Manage your account details and security preferences</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-b-2xl sm:rounded-b-3xl shadow-xl p-6 sm:p-8">
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600 flex-shrink-0" />
                <h2 className="text-lg sm:text-xl font-bold text-brand-text">Contact Information</h2>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <p className="block text-xs font-medium text-gray-500 uppercase mb-1 sm:mb-2">Name</p>
                  <p className="text-base sm:text-lg font-semibold text-brand-text break-words">{currentUser?.displayName || 'User'}</p>
                </div>

                <div>
                  <p className="block text-xs font-medium text-gray-500 uppercase mb-1 sm:mb-2">Email</p>
                  <p className="text-sm sm:text-base lg:text-lg text-brand-text break-all">{currentUser?.email || 'No email provided'}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600 flex-shrink-0" />
                <h2 className="text-lg sm:text-xl font-bold text-brand-text">Security Overview</h2>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isEmailVerified ? 'bg-brand-500' : 'bg-gray-300'}`} />
                  <span className="text-xs sm:text-sm text-gray-700">
                    Email verified: <span className="font-semibold">{isEmailVerified ? 'Yes' : 'No'}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-700 break-words">
                    Provider: <span className="font-semibold">{getAuthProvider()}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-700">
                    Member since: <span className="font-semibold">{getMemberSince()}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 sm:pt-8 mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Key className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600 flex-shrink-0" />
              <h2 className="text-lg sm:text-xl font-bold text-brand-text">Account Security</h2>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
              For security, password updates require recent authentication. Use the button below to open the dedicated password change flow.
            </p>

            <button
              type="button"
              onClick={handleUpdatePassword}
              className="w-full sm:w-auto bg-brand text-white px-6 py-3 sm:px-8 sm:py-3 rounded-lg font-semibold hover:bg-brand-hover transition-all transform hover:scale-105 shadow-md touch-target active-scale ripple"
            >
              Change Password
            </button>
          </div>

          <div className="border-t border-gray-200 pt-6 sm:pt-8">
            <h2 className="text-lg sm:text-xl font-bold text-red-600 mb-2">Sign out</h2>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
              Securely end your session. You will need to sign in again to access predictions.
            </p>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 sm:px-8 sm:py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed touch-target active-scale ripple"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{loading ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
