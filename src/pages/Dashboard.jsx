import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiMapPin, FiCamera, FiPlus, FiNavigation, FiAlertCircle } from 'react-icons/fi';

export default function Dashboard() {
  const [category, setCategory] = useState('Pothole');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=600');
  const [lat, setLat] = useState(37.7749);
  const [lng, setLng] = useState(-122.4194);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!window.L || !mapContainerRef.current) return;

    // Create map centered on active lat/lng
    mapRef.current = window.L.map(mapContainerRef.current).setView([lat, lng], 13);

    // Dark-mode/standard Tile Layer
    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(mapRef.current);

    // Create custom pin icon
    const redPinIcon = window.L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #ef4444; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    // Add marker
    markerRef.current = window.L.marker([lat, lng], { 
      draggable: true,
      icon: redPinIcon
    }).addTo(mapRef.current);

    // Handle marker drag
    markerRef.current.on('dragend', () => {
      const position = markerRef.current.getLatLng();
      setLat(Number(position.lat.toFixed(6)));
      setLng(Number(position.lng.toFixed(6)));
    });

    // Handle map click for pin dropping
    mapRef.current.on('click', (e) => {
      const { lat: clickLat, lng: clickLng } = e.latlng;
      markerRef.current.setLatLng(e.latlng);
      setLat(Number(clickLat.toFixed(6)));
      setLng(Number(clickLng.toFixed(6)));
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync external coordinates changes (Locate Me) with the map
  const syncMapLocation = (newLat, newLng) => {
    if (mapRef.current && markerRef.current) {
      mapRef.current.setView([newLat, newLng], 15);
      markerRef.current.setLatLng([newLat, newLng]);
    }
  };

  // Capture Geolocation coordinates
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLat = Number(position.coords.latitude.toFixed(6));
        const currentLng = Number(position.coords.longitude.toFixed(6));
        setLat(currentLat);
        setLng(currentLng);
        syncMapLocation(currentLat, currentLng);
        toast.success('Successfully retrieved GPS coordinates.');
        setGpsLoading(false);
      },
      (error) => {
        console.error('Error fetching geolocation:', error);
        toast.error(`GPS Error: ${error.message}. Pin location manually.`);
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Submit Complaint Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error('Description is required.');
      return;
    }
    if (!imageUrl.trim()) {
      toast.error('Image URL is required.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        userId: 'citizen_user_1',
        category,
        description,
        imageUrl,
        location: { lat, lng }
      };

      console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);

const res = await axios.post(
  `${import.meta.env.VITE_API_BASE_URL}/api/complaints`,
  payload
);

      
      if (res.status === 201) {
        toast.success('Complaint submitted successfully!');
        setDescription('');
        // Reset to some nice random image for variety
        const randomStock = [
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600', // road
          'https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=600', // streetlight
          'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=600', // waste/garbage
        ];
        setImageUrl(randomStock[Math.floor(Math.random() * randomStock.length)]);
      }
    } catch (err) {
      console.error('Failed to submit complaint:', err);
      toast.error(err.response?.data?.error || 'Failed to submit complaint to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-left space-y-2 mb-8">
        <h1 className="text-3xl font-extrabold text-white">Report a Civic Problem</h1>
        <p className="text-slate-400">Provide description, image, and mark the location on the map.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Form panel */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-white/5 space-y-5 text-left">
            {/* Category selection */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1.5">
                Issue Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="Pothole">Pothole / Road Damage</option>
                <option value="Garbage">Garbage / Waste Overflow</option>
                <option value="Broken Streetlight">Broken Streetlight</option>
                <option value="Water Leak">Water Leak / Pipe Burst</option>
                <option value="Sidewalk Damage">Sidewalk Damage</option>
                <option value="Other">Other / General Issue</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1.5">
                Description
              </label>
              <textarea
                id="description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in detail (e.g. Size, danger level, exact spot...)"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-300 mb-1.5">
                Image URL
              </label>
              <div className="relative">
                <input
                  id="imageUrl"
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste issue image URL (e.g. Unsplash URL)"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
                <FiCamera className="absolute left-3.5 top-3.5 text-slate-500" />
              </div>
            </div>

            {/* Coordinates display & GPS */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-medium text-slate-300">Geotag Coordinates</span>
                <button
                  type="button"
                  onClick={handleLocateMe}
                  disabled={gpsLoading}
                  className="inline-flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors disabled:opacity-50"
                >
                  <FiNavigation className={gpsLoading ? 'animate-spin' : ''} />
                  <span>{gpsLoading ? 'Locating...' : 'Get Current GPS'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/50 border border-white/5 rounded-xl px-3.5 py-2 text-slate-300">
                  <span className="text-[10px] text-slate-500 block">Latitude</span>
                  <span className="text-sm font-mono font-semibold">{lat}</span>
                </div>
                <div className="bg-slate-900/50 border border-white/5 rounded-xl px-3.5 py-2 text-slate-300">
                  <span className="text-[10px] text-slate-500 block">Longitude</span>
                  <span className="text-sm font-mono font-semibold">{lng}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                  <span>Submitting...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <FiPlus className="w-5 h-5" />
                  <span>Submit Complaint</span>
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Map Panel */}
        <div className="lg:col-span-7 flex flex-col h-[500px] lg:h-auto min-h-[400px]">
          <div className="flex-1 rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative">
            <div ref={mapContainerRef} className="w-full h-full" />
            
            {/* Map instruction overlay */}
            <div className="absolute bottom-4 right-4 z-40 bg-slate-900/90 border border-white/10 px-3.5 py-2 rounded-xl text-left backdrop-blur-md max-w-xs pointer-events-none">
              <div className="flex items-start space-x-2">
                <FiAlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  <strong>Pin drop active:</strong> Click anywhere on the map or drag the red marker to refine coordinates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
