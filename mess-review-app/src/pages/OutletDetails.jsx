import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import outletService from '../services/outletService';
import complaintService from '../services/complaintService';
import StarRating from '../components/StarRating';

const OutletDetails = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [outlet, setOutlet] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [outletReviews, setOutletReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Rating modal state
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingType, setRatingType] = useState(null); // 'outlet' or 'foodItem'
  const [selectedItem, setSelectedItem] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  // Complaint modal state
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintText, setComplaintText] = useState('');
  const [isAnonymousComplaint, setIsAnonymousComplaint] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [outletData, foodItemsData, reviewsData] = await Promise.all([
        outletService.getOutletById(id),
        outletService.getFoodItems(id),
        outletService.getAllReviewsForOutlet(id)
      ]);

      setOutlet(outletData);
      setFoodItems(foodItemsData);
      setOutletReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openRatingModal = (type, item = null) => {
    setRatingType(type);
    setSelectedItem(item);
    setUserRating(0);
    setReviewText('');
    setShowRatingModal(true);
  };

  const handleSubmitRating = async () => {
    if (userRating === 0) {
      alert('Please select a star rating before submitting');
      return;
    }

    try {
      // isAnonymous is determined by whether reviewText is empty
      const isAnonymous = !reviewText || reviewText.trim() === '';

      if (ratingType === 'outlet') {
        await outletService.rateOutlet(outlet.id, userRating, reviewText, isAnonymous);
      } else if (ratingType === 'foodItem') {
        await outletService.rateFoodItem(selectedItem.id, userRating, reviewText, isAnonymous);
      }

      setShowRatingModal(false);
      fetchData(); // Refresh data
      alert('Rating submitted successfully!');
    } catch (error) {
      console.error('Error submitting rating:', error);
      console.error('Error details:', error.response?.data);
      alert(`Failed to submit rating: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    }
  };

  const handleSubmitComplaint = async () => {
    if (!complaintText.trim()) {
      alert('Please enter a complaint message');
      return;
    }

    try {
      await complaintService.createComplaint(outlet.id, complaintText, isAnonymousComplaint);
      setShowComplaintModal(false);
      setComplaintText('');
      setIsAnonymousComplaint(false);
      alert('Complaint submitted successfully!');
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert(`Failed to submit complaint: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await outletService.deleteRating(reviewId);
      fetchData(); // Refresh data
      alert('Review deleted successfully!');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert(`Failed to delete review: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/outlets')}
                className="text-indigo-600 hover:text-indigo-800"
              >
                ← Back
              </button>
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
                onClick={() => {logout(); navigate('/signin');}}
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
        {/* Outlet Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-gray-900">{outlet?.name}</h2>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  outlet?.type === 'MESS' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {outlet?.type}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{outlet?.description}</p>
              <div className="flex items-center gap-6">
                <StarRating rating={outlet?.averageRating || 0} readonly />
                <span className="text-gray-600">
                  {outlet?.totalRatings || 0} ratings
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => openRatingModal('outlet')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
              >
                Rate {outlet?.type === 'MESS' ? 'Mess' : 'Restaurant'}
              </button>
              <button
                onClick={() => setShowComplaintModal(true)}
                className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
              >
                File Complaint
              </button>
            </div>
          </div>
        </div>

        {/* Food Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Food Items</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {foodItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-bold text-lg mb-2">{item.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <StarRating rating={item.averageRating || 0} readonly size="small" />
                  <span className="text-sm text-gray-500">{item.totalRatings || 0} ratings</span>
                </div>
                <button
                  onClick={() => openRatingModal('foodItem', item)}
                  className="w-full px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 font-medium text-sm"
                >
                  Rate Item
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Recent Reviews</h3>
          {outletReviews.length > 0 ? (
            <div className="space-y-4">
              {outletReviews.map((review) => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{review.userName}</span>
                      {review.foodItemName && (
                        <span className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full">
                          {review.foodItemName}
                        </span>
                      )}
                      {!review.foodItemName && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Overall
                        </span>
                      )}
                      <StarRating rating={review.stars} readonly size="small" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                      {user?.role === 'ADMIN' && (
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.reviewText}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4">
              Rate {ratingType === 'outlet' ? outlet?.name : selectedItem?.name}
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating *
              </label>
              <StarRating
                rating={userRating}
                onRatingChange={setUserRating}
                size="large"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review (optional)
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="4"
                placeholder="Share your experience..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRating}
                disabled={userRating === 0}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complaint Modal */}
      {showComplaintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4">
              File a Complaint
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complaint *
              </label>
              <textarea
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                rows="4"
                placeholder="Describe your complaint..."
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isAnonymousComplaint}
                  onChange={(e) => setIsAnonymousComplaint(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Submit anonymously</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowComplaintModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitComplaint}
                disabled={!complaintText.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutletDetails;
