import api from './api';

const outletService = {
  // Get all outlets
  getAllOutlets: async () => {
    const response = await api.get('/outlets');
    return response.data;
  },

  // Get outlet by ID
  getOutletById: async (id) => {
    const response = await api.get(`/outlets/${id}`);
    return response.data;
  },

  // Get outlets by type (MESS or RESTAURANT)
  getOutletsByType: async (type) => {
    const response = await api.get(`/outlets/type/${type}`);
    return response.data;
  },

  // Get food items for an outlet
  getFoodItems: async (outletId) => {
    const response = await api.get(`/outlets/${outletId}/food-items`);
    return response.data;
  },

  // Rate an outlet
  rateOutlet: async (outletId, stars, reviewText, isAnonymous = true) => {
    const response = await api.post('/ratings/outlet', {
      outletId,
      stars,
      reviewText,
      isAnonymous
    });
    return response.data;
  },

  // Rate a food item
  rateFoodItem: async (foodItemId, stars, reviewText, isAnonymous = true) => {
    const response = await api.post('/ratings/food-item', {
      foodItemId,
      stars,
      reviewText,
      isAnonymous
    });
    return response.data;
  },

  // Get ratings for an outlet
  getOutletRatings: async (outletId) => {
    const response = await api.get(`/ratings/outlet/${outletId}`);
    return response.data;
  },

  // Get ratings for a food item
  getFoodItemRatings: async (foodItemId) => {
    const response = await api.get(`/ratings/food-item/${foodItemId}`);
    return response.data;
  },

  // Get reviews for an outlet
  getOutletReviews: async (outletId) => {
    const response = await api.get(`/ratings/outlet/${outletId}/reviews`);
    return response.data;
  },

  // Get reviews for a food item
  getFoodItemReviews: async (foodItemId) => {
    const response = await api.get(`/ratings/food-item/${foodItemId}/reviews`);
    return response.data;
  },

  // Get all reviews for an outlet (both outlet and food item reviews)
  getAllReviewsForOutlet: async (outletId) => {
    const response = await api.get(`/ratings/outlet/${outletId}/all-reviews`);
    return response.data;
  },

  // Delete a rating (admin only)
  deleteRating: async (ratingId) => {
    await api.delete(`/ratings/${ratingId}`);
  }
};

export default outletService;
