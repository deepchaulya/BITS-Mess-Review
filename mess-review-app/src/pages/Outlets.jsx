import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import outletService from '../services/outletService';
import StarRating from '../components/StarRating';

const Outlets = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL'); // ALL, MESS, RESTAURANT

  useEffect(() => {
    fetchOutlets();
  }, [filter]);

  const fetchOutlets = async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      if (filter === 'ALL') {
        data = await outletService.getAllOutlets();
      } else {
        data = await outletService.getOutletsByType(filter);
      }
      console.log('Fetched outlets:', data);
      setOutlets(data);
    } catch (error) {
      console.error('Error fetching outlets:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch outlets. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">BITS Mess Review</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user?.role === 'ADMIN' && (
                <button
                  onClick={() => navigate('/admin/complaints')}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50"
                >
                  Manage Complaints
                </button>
              )}
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Mess & Restaurants</h2>

          {/* Filter Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-4 py-2 rounded-md font-medium ${
                filter === 'ALL'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('MESS')}
              className={`px-4 py-2 rounded-md font-medium ${
                filter === 'MESS'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Mess Only
            </button>
            <button
              onClick={() => setFilter('RESTAURANT')}
              className={`px-4 py-2 rounded-md font-medium ${
                filter === 'RESTAURANT'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Restaurants Only
            </button>
          </div>
        </div>

        {/* Outlets Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading outlets...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outlets.map((outlet) => (
              <div
                key={outlet.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/outlets/${outlet.id}`)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{outlet.name}</h3>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        outlet.type === 'MESS'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {outlet.type}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{outlet.description}</p>

                  <div className="flex items-center justify-between">
                    <StarRating rating={outlet.averageRating || 0} readonly size="small" />
                    <span className="text-sm text-gray-500">
                      {outlet.totalRatings || 0} ratings
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h3 className="text-red-800 font-semibold mb-2">Error Loading Outlets</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchOutlets}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && outlets.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No outlets found</p>
            <p className="text-sm text-gray-400 mt-2">Make sure the backend is running and data is initialized</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Outlets;
