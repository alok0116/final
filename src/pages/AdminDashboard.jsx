import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiRefreshCw, FiSearch, FiEdit2, FiCheck, FiMapPin, FiCalendar } from 'react-icons/fi';

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAllComplaints = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/complaints');
      setComplaints(res.data);
    } catch (err) {
      console.error('Error fetching admin complaints:', err);
      toast.error('Failed to retrieve complaints database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllComplaints();
  }, []);

  // Update Status handler
  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await axios.put(`/api/complaints/${id}`, { status: newStatus });
      if (res.status === 200) {
        toast.success(`Complaint status updated to "${newStatus}"`);
        // Update local state without full reload for micro-interaction speed
        setComplaints(prev => prev.map(item => item._id === id ? { ...item, status: newStatus } : item));
      }
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error(err.response?.data?.error || 'Failed to update complaint status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'In Progress':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'Resolved':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  // Filter & Search
  const filteredComplaints = complaints.filter((item) => {
    const matchesFilter = filter === 'All' || item.status === filter;
    const matchesSearch = 
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="text-left space-y-1">
          <h1 className="text-3xl font-extrabold text-white">Operator Console</h1>
          <p className="text-slate-400">Review community complaints and update progress status.</p>
        </div>
        <button
          onClick={fetchAllComplaints}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          <span>Sync Complaints</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-panel p-4 rounded-xl border border-white/5 text-left">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Database Total</span>
          <p className="text-2xl font-bold mt-1 text-white">{complaints.length}</p>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/5 text-left">
          <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Awaiting Review</span>
          <p className="text-2xl font-bold mt-1 text-amber-400">
            {complaints.filter(c => c.status === 'Pending').length}
          </p>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/5 text-left">
          <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">In Mitigation</span>
          <p className="text-2xl font-bold mt-1 text-blue-400">
            {complaints.filter(c => c.status === 'In Progress').length}
          </p>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/5 text-left">
          <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Resolved Issues</span>
          <p className="text-2xl font-bold mt-1 text-emerald-400">
            {complaints.filter(c => c.status === 'Resolved').length}
          </p>
        </div>
      </div>

      {/* Filters and Searches */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex bg-slate-900 border border-white/5 p-1 rounded-xl w-full md:w-auto">
          {['All', 'Pending', 'In Progress', 'Resolved'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === status
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by category, desc, userId..."
            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <FiSearch className="absolute left-3.5 top-3 text-slate-500" />
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Querying database...</p>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="glass-panel py-20 rounded-2xl border border-white/5 text-center flex flex-col items-center justify-center space-y-2">
          <div className="text-2xl">🗳️</div>
          <h3 className="text-lg font-bold text-white font-display">No complaints database records</h3>
          <p className="text-slate-400 text-sm">No complaints match your filters or search text.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/60 border-b border-white/5 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Issue Details</th>
                  <th className="px-6 py-4">Geotag / Coords</th>
                  <th className="px-6 py-4">Submitted By</th>
                  <th className="px-6 py-4">Status Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                {filteredComplaints.map((item) => (
                  <tr key={item._id} className="hover:bg-white/[0.01] transition-colors">
                    {/* Image */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={item.imageUrl}
                        alt={item.category}
                        className="w-14 h-10 object-cover rounded-lg bg-slate-900 border border-white/5"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=600';
                        }}
                      />
                    </td>

                    {/* Category & Description */}
                    <td className="px-6 py-4 max-w-sm">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          {item.category}
                        </span>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </td>

                    {/* Geotag */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-slate-400">
                      <div className="flex items-center space-x-1.5">
                        <FiMapPin className="text-blue-500" />
                        <span>{item.location.lat.toFixed(5)}, {item.location.lng.toFixed(5)}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 mt-1.5 text-[10px] text-slate-500">
                        <FiCalendar />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>

                    {/* User ID */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-slate-400">
                      {item.userId}
                    </td>

                    {/* Status selection */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <select
                          value={item.status}
                          disabled={updatingId === item._id}
                          onChange={(e) => handleStatusChange(item._id, e.target.value)}
                          className={`text-xs font-bold rounded-lg border px-3 py-1.5 focus:outline-none cursor-pointer bg-slate-900 ${getStatusColor(item.status)}`}
                        >
                          <option value="Pending">Pending Review</option>
                          <option value="In Progress">In Mitigation</option>
                          <option value="Resolved">Resolved / Closed</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
