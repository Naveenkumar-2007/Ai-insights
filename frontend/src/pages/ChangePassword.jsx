import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setPasswords((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwords.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setError('');
      setSuccess(false);
      setLoading(true);
      await updatePassword(passwords.newPassword);
      setSuccess(true);
      setTimeout(() => navigate('/prediction'), 2000);
    } catch (err) {
      setError('Failed to update password. Please try logging in again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-brand-50">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-brand-50">
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-brand-text">Change Password</h2>
            <p className="mt-2 text-sm text-brand-muted">Enter your new password below</p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-brand-50 border-l-4 border-brand-500 p-4 rounded">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-brand-600 mr-2" />
                <p className="text-sm text-brand-700">Password updated successfully!</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-brand-muted mb-2">New Password</label>
              <input
                type="password"
                name="newPassword"
                required
                value={passwords.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-brand-100 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-muted mb-2">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={passwords.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-brand-100 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-brand-muted">
            Forgot your password?{' '}
            <Link to="/forgot-password" className="text-brand-600 font-semibold hover:text-brand-hover">
              Send reset email
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
