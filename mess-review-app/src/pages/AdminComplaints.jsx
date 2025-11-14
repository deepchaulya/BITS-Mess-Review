import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import complaintService from '../services/complaintService';

const AdminComplaints = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, resolved
  const [groupBy, setGroupBy] = useState('all'); // all, outlet

  useEffect(() => {
    // Redirect if not admin
    if (user?.role !== 'ADMIN') {
      navigate('/outlets');
      return;
    }
    fetchComplaints();
  }, [user, navigate]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await complaintService.getAllComplaints();
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      alert('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveComplaint = async (complaintId) => {
    try {
      await complaintService.resolveComplaint(complaintId);
      fetchComplaints();
    } catch (error) {
      console.error('Error resolving complaint:', error);
      alert('Failed to resolve complaint');
    }
  };

  const handleDeleteComplaint = async (complaintId) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) {
      return;
    }

    try {
      await complaintService.deleteComplaint(complaintId);
      fetchComplaints();
    } catch (error) {
      console.error('Error deleting complaint:', error);
      alert('Failed to delete complaint');
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    if (filter === 'pending') return !complaint.isResolved;
    if (filter === 'resolved') return complaint.isResolved;
    return true;
  });

  const groupedComplaints = groupBy === 'outlet'
    ? filteredComplaints.reduce((acc, complaint) => {
        const outletName = complaint.outletName;
        if (!acc[outletName]) {
          acc[outletName] = [];
        }
        acc[outletName].push(complaint);
        return acc;
      }, {})
    : { 'All Complaints': filteredComplaints };

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
                ← Back to Outlets
              </button>
              <h1 className="text-xl font-bold text-indigo-600">Admin - Complaints Management</h1>
            </div>
            <div className="flex items-center space-x-4">
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
        {/* Stats and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800">Total Complaints</h3>
              <p className="text-3xl font-bold text-blue-900">{complaints.length}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-800">Pending</h3>
              <p className="text-3xl font-bold text-yellow-900">
                {complaints.filter(c => !c.isResolved).length}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-800">Resolved</h3>
              <p className="text-3xl font-bold text-green-900">
                {complaints.filter(c => c.isResolved).length}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Complaints</option>
                <option value="pending">Pending Only</option>
                <option value="resolved">Resolved Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Group by</label>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">No Grouping</option>
                <option value="outlet">Group by Outlet</option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        {Object.entries(groupedComplaints).map(([groupName, groupComplaints]) => (
          <div key={groupName} className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {groupName} ({groupComplaints.length})
            </h3>

            {groupComplaints.length > 0 ? (
              <div className="space-y-4">
                {groupComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className={`border rounded-lg p-4 ${complaint.isResolved ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-gray-900">{complaint.userName}</span>
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {complaint.outletName}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            complaint.isResolved
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {complaint.isResolved ? 'Resolved' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{complaint.complaintText}</p>
                        <p className="text-sm text-gray-500">
                          Submitted on {new Date(complaint.createdAt).toLocaleDateString()} at{' '}
                          {new Date(complaint.createdAt).toLocaleTimeString()}
                        </p>
                      </div>

                      <div className="flex gap-2 ml-4">
                        {!complaint.isResolved && (
                          <button
                            onClick={() => handleResolveComplaint(complaint.id)}
                            className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                          >
                            Mark Resolved
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteComplaint(complaint.id)}
                          className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No complaints in this category.</p>
            )}
          </div>
        ))}

        {filteredComplaints.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500">No complaints found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComplaints;
