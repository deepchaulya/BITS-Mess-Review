import api from './api';

const complaintService = {
  createComplaint: async (outletId, complaintText, isAnonymous = false) => {
    const response = await api.post('/complaints', {
      outletId,
      complaintText,
      isAnonymous,
    });
    return response.data;
  },

  getAllComplaints: async () => {
    const response = await api.get('/complaints');
    return response.data;
  },

  getComplaintsByOutlet: async (outletId) => {
    const response = await api.get(`/complaints/outlet/${outletId}`);
    return response.data;
  },

  resolveComplaint: async (complaintId) => {
    const response = await api.put(`/complaints/${complaintId}/resolve`);
    return response.data;
  },

  deleteComplaint: async (complaintId) => {
    await api.delete(`/complaints/${complaintId}`);
  },
};

export default complaintService;
