import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiMap, FiRefreshCw, FiAlertTriangle, FiCheckCircle, FiClock, FiLayers } from 'react-icons/fi';

export default function InteractiveMap() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  // Fetch complaints from the backend
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/complaints');
      const data = res.data;
      setComplaints(data);
      
      // Calculate Stats
      const total = data.length;
      const pending = data.filter(c => c.status === 'Pending').length;
      const inProgress = data.filter(c => c.status === 'In Progress').length;
      const resolved = data.filter(c => c.status === 'Resolved').length;
      setStats({ total, pending, inProgress, resolved });

      // Re-initialize markers on map
      plotMarkers(data);
    } catch (err) {
      console.error('Error fetching map complaints:', err);
      toast.error('Failed to load complaints for map rendering.');
    } finally {
      setLoading(false);
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!window.L || !mapContainerRef.current) return;

    // Center on generic coordinates
    mapRef.current = window.L.map(mapContainerRef.current).setView([37.7749, -122.4194], 11);

    // Dark-mode/standard Tile Layer
    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(mapRef.current);

    fetchComplaints();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Plot markers on the Leaflet map
  const plotMarkers = (data) => {
    if (!window.L || !mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => mapRef.current.removeLayer(marker));
    markersRef.current = [];

    if (data.length === 0) return;

    const bounds = [];

    data.forEach((complaint) => {
      const { lat, lng } = complaint.location;
      if (lat === undefined || lng === undefined) return;

      bounds.push([lat, lng]);

      // Define marker color based on status
      let pinColor = '#ef4444'; // Red for Pending
      if (complaint.status === 'In Progress') pinColor = '#3b82f6'; // Blue
      if (complaint.status === 'Resolved') pinColor = '#10b981'; // Green

      const markerIcon = window.L.divIcon({
        className: 'custom-map-icon',
        html: `<div style="background-color: ${pinColor}; width: 16px; height: 16px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 0 10px ${pinColor}; transition: all 0.2s hover:scale-110"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      // Construct popup HTML
      const popupHtml = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 6px; width: 220px; font-size: 13px;">
          <img src="${complaint.imageUrl}" alt="${complaint.category}" style="width:100%; height:110px; object-cover; border-radius:6px; margin-bottom: 8px;" />
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
            <strong style="color:white; font-size:14px;">${complaint.category}</strong>
            <span style="font-size:10px; font-weight:bold; padding:2px 6px; border-radius:4px; border: 1px solid ${pinColor}30; background:${pinColor}15; color:${pinColor};">${complaint.status}</span>
          </div>
          <p style="color:#cbd5e1; margin:0 0 8px 0; line-height:1.4; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;">${complaint.description}</p>
          <div style="font-size:10px; color:#94a3b8;">Reported: ${new Date(complaint.createdAt).toLocaleDateString()}</div>
        </div>
      `;

      const marker = window.L.marker([lat, lng], { icon: markerIcon })
        .addTo(mapRef.current)
        .bindPopup(popupHtml);

      markersRef.current.push(marker);
    });

    // Auto fit map bounds to cover all markers if present
    if (bounds.length > 0) {
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  };

  // Center map on specific complaint
  const handleFocusComplaint = (complaint) => {
    if (mapRef.current) {
      const { lat, lng } = complaint.location;
      mapRef.current.setView([lat, lng], 15);
      
      // Find corresponding marker and open popup
      const marker = markersRef.current.find(m => {
        const markerLatLng = m.getLatLng();
        return markerLatLng.lat === lat && markerLatLng.lng === lng;
      });
      if (marker) {
        marker.openPopup();
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="text-left space-y-1">
          <h1 className="text-3xl font-extrabold text-white">Live Complaint Map</h1>
          <p className="text-slate-400">View real-time geo-coordinates of reports and monitor community progress.</p>
        </div>
        <button
          onClick={fetchComplaints}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          <span>Refresh Map</span>
        </button>
      </div>

      {/* Map Layout */}
      <div className="grid lg:grid-cols-12 gap-6 h-[calc(100vh-16rem)] min-h-[500px]">
        {/* Sidebar details */}
        <div className="lg:col-span-4 glass-panel border border-white/5 rounded-2xl flex flex-col overflow-hidden text-left">
          {/* Sidebar Header Stats */}
          <div className="p-4 border-b border-white/5 space-y-3 bg-slate-900/30">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Map Statistics</span>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 bg-slate-950 border border-white/5 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 block">Total</span>
                <span className="text-sm font-bold text-white">{stats.total}</span>
              </div>
              <div className="p-2 bg-slate-950 border border-white/5 rounded-xl text-center">
                <span className="text-[10px] text-amber-500 block">Pending</span>
                <span className="text-sm font-bold text-amber-400">{stats.pending}</span>
              </div>
              <div className="p-2 bg-slate-950 border border-white/5 rounded-xl text-center">
                <span className="text-[10px] text-emerald-500 block">Fixed</span>
                <span className="text-sm font-bold text-emerald-400">{stats.resolved}</span>
              </div>
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Reported Locations</span>
            {loading ? (
              <div className="py-12 flex justify-center">
                <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : complaints.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-10">No items available to display on the map.</p>
            ) : (
              complaints.map((item) => (
                <button
                  key={item._id}
                  onClick={() => handleFocusComplaint(item)}
                  className="w-full text-left p-3.5 bg-slate-900/40 hover:bg-slate-900 border border-white/5 rounded-xl transition-all duration-200 group flex items-start space-x-3.5"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.category}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-900 flex-shrink-0"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=600';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-1">
                      <span className="text-xs font-semibold text-white truncate">{item.category}</span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                        item.status === 'Resolved' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' :
                        item.status === 'In Progress' ? 'text-blue-400 border-blue-500/20 bg-blue-500/5' :
                        'text-amber-400 border-amber-500/20 bg-amber-500/5'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-1">{item.description}</p>
                    <p className="text-[9px] text-slate-500 font-mono mt-1">
                      📍 {item.location.lat.toFixed(4)}, {item.location.lng.toFixed(4)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Map Container */}
        <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative h-[400px] lg:h-auto">
          <div ref={mapContainerRef} className="w-full h-full" />
          
          {/* Float Layers guide */}
          <div className="absolute top-4 right-4 z-40 bg-slate-900/90 border border-white/10 px-3.5 py-2 rounded-xl text-left backdrop-blur-md max-w-xs pointer-events-none flex items-center space-x-2">
            <FiLayers className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] text-slate-300 font-bold">Interactive Leaflet Grid Layer</span>
          </div>
        </div>
      </div>
    </div>
  );
}
