import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiCalendar, FiMapPin, FiClock, FiCheckCircle, FiSearch, FiRefreshCw } from 'react-icons/fi';

export default function ComplaintHistory() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const userId = 'citizen_user_1';

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/complaints/${userId}`);
      setComplaints(res.data);
    } catch (err) {
      console.error('Error fetching user complaints:', err);
      toast.error('Failed to load complaint history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'In Progress':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Resolved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  // Filter complaints based on status and search query
  const filteredComplaints = complaints.filter((item) => {
    const matchesFilter = filter === 'All' || item.status === filter;
    const matchesSearch = 
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="text-left space-y-1">
          <h1 className="text-3xl font-extrabold text-white">Your Reports</h1>
          <p className="text-slate-400">Track and monitor status of your reported civic issues.</p>
        </div>
        <button
          onClick={fetchHistory}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-panel p-4 rounded-xl border border-white/5 text-left">
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Total Filed</span>
          <p className="text-2xl font-bold mt-1 text-white">{complaints.length}</p>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/5 text-left">
          <span className="text-[11px] text-amber-500 font-bold uppercase tracking-wider">Pending</span>
          <p className="text-2xl font-bold mt-1 text-amber-400">
            {complaints.filter(c => c.status === 'Pending').length}
          </p>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/5 text-left">
          <span className="text-[11px] text-blue-500 font-bold uppercase tracking-wider">In Progress</span>
          <p className="text-2xl font-bold mt-1 text-blue-400">
            {complaints.filter(c => c.status === 'In Progress').length}
          </p>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/5 text-left">
          <span className="text-[11px] text-emerald-500 font-bold uppercase tracking-wider">Resolved</span>
          <p className="text-2xl font-bold mt-1 text-emerald-400">
            {complaints.filter(c => c.status === 'Resolved').length}
          </p>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        {/* Status filters */}
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

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by category or description..."
            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <FiSearch className="absolute left-3.5 top-3 text-slate-500" />
        </div>
      </div>

      {/* Complaints List Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Fetching your complaint history...</p>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="glass-panel py-20 rounded-2xl border border-white/5 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-lg">
            🔍
          </div>
          <h3 className="text-lg font-bold text-white">No complaints found</h3>
          <p className="text-slate-400 text-sm max-w-sm">
            {searchTerm || filter !== 'All' 
              ? 'Try widening your filters or clearing your search term.' 
              : 'You have not submitted any complaints yet. Go to the dashboard to report an issue!'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.map((item) => (
            <div
              key={item._id}
              className="glass-panel border border-white/5 rounded-2xl overflow-hidden flex flex-col hover:border-white/10 hover:scale-[1.01] transition-all duration-200"
            >
              {/* Card Image banner */}
              <div className="h-44 relative overflow-hidden bg-slate-900">
                <img
                  src={item.imageUrl}
                  alt={item.category}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=600';
                  }}
                />
                
                {/* Status pill overlay */}
                <span className={`absolute top-4 right-4 px-2.5 py-1 text-xs font-bold border rounded-full backdrop-blur-md shadow-lg ${getStatusStyle(item.status)}`}>
                  {item.status}
                </span>

                {/* Category label overlay */}
                <span className="absolute bottom-4 left-4 bg-slate-900/80 border border-white/5 px-2.5 py-1 text-[10px] uppercase font-extrabold tracking-wider text-slate-200 rounded-lg backdrop-blur-sm">
                  {item.category}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between text-left space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-slate-200 font-medium line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-white/5 text-xs text-slate-400">
                  {/* Geotag */}
                  <div className="flex items-center space-x-2">
                    <FiMapPin className="text-blue-400 flex-shrink-0" />
                    <span className="font-mono">
                      {item.location.lat.toFixed(4)}, {item.location.lng.toFixed(4)}
                    </span>
                  </div>

                  {/* Date filed */}
                  <div className="flex items-center space-x-2">
                    <FiCalendar className="text-teal-400 flex-shrink-0" />
                    <span>
                      Filed: {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Last updated */}
                  <div className="flex items-center space-x-2">
                    <FiClock className="text-purple-400 flex-shrink-0" />
                    <span>
                      Updated: {new Date(item.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
