import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiShield, FiTrendingUp, FiMapPin, FiLayers } from 'react-icons/fi';

export default function LandingPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 relative z-10">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span>Civic-tech for Modern Cities</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Spot a problem.<br />
              <span className="bg-gradient-to-r from-blue-400 via-blue-200 to-teal-300 bg-clip-text text-transparent">
                Report it. Fix your city.
              </span>
            </h1>

            <p className="text-lg text-slate-300 max-w-xl">
              CityFix AI turns citizen reports into organized, geotagged complaints. Document potholes, garbage piles, or broken streetlights, pinpoint them on a map, and track resolution progress.
            </p>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Report an Issue
                <FiArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/map"
                className="inline-flex items-center justify-center px-6 py-3.5 border border-white/10 text-base font-semibold rounded-xl text-slate-200 hover:bg-white/5 hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                View Live Map
              </Link>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5">
              <div>
                <p className="text-3xl font-bold text-white">2 min</p>
                <p className="text-sm text-slate-400">Average report time</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-400">100%</p>
                <p className="text-sm text-slate-400">Atlas DB secure</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-teal-400">Leaflet</p>
                <p className="text-sm text-slate-400">Interactive maps</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="w-full aspect-[4/3] rounded-2xl glass-panel p-4 shadow-2xl relative overflow-hidden border border-white/10">
              <div className="flex space-x-1.5 mb-3 border-b border-white/5 pb-3">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="text-xs text-slate-400 ml-2">Live Map Demonstration</span>
              </div>
              
              <div className="w-full h-full bg-slate-900 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
                {/* SVG mock map */}
                <svg className="w-full h-full opacity-60" viewBox="0 0 400 280">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(59,130,246,0.15)" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  <path d="M0,140 Q100,100 200,140 T400,140" fill="none" stroke="rgba(14, 165, 233, 0.4)" strokeWidth="6" />
                  <path d="M120,0 L120,280 M280,0 L280,280" fill="none" stroke="rgba(14, 165, 233, 0.2)" strokeWidth="2" />
                  <circle cx="150" cy="90" r="6" fill="#ef4444" className="animate-bounce" />
                  <circle cx="250" cy="180" r="6" fill="#f97316" />
                  <circle cx="200" cy="140" r="6" fill="#14b8a6" />
                </svg>

                {/* Floating Mock Card */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-800/90 border border-white/5 shadow-xl flex items-center space-x-3 backdrop-blur-md">
                  <img 
                    src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop" 
                    alt="Road damage" 
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="text-left">
                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold">Pothole</span>
                    <p className="text-xs text-white font-semibold mt-0.5">MG Road crossing issue</p>
                    <p className="text-[10px] text-slate-400">GPS coords: 37.77, -122.41</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Overlay badges */}
            <div className="absolute -top-4 -right-4 px-4 py-2 rounded-xl glass-panel border border-white/10 flex items-center space-x-2 text-xs font-semibold text-teal-400 shadow-xl">
              <FiCheckCircle />
              <span>Manually Verified</span>
            </div>
            <div className="absolute -bottom-4 -left-4 px-4 py-2 rounded-xl glass-panel border border-white/10 flex items-center space-x-2 text-xs font-semibold text-blue-400 shadow-xl">
              <FiLayers />
              <span>Interactive Leaflet Map</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold">Features Built for Citizens & Operators</h2>
            <p className="text-slate-400">Everything needed to report, map, and resolve issues collaboratively.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-8">
            <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-3 text-left">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <FiMapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Geotagging & Pin-dropping</h3>
              <p className="text-slate-400 text-sm">
                Capture the device's native GPS coordinates automatically, or drop/drag a pin directly on our interactive map to point out the exact spot.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-3 text-left">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <FiLayers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Atlas MongoDB Sync</h3>
              <p className="text-slate-400 text-sm">
                All records are securely saved inside MongoDB Atlas, making sure the reported data persists and is immediately accessible by admin staff.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-3 text-left">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <FiShield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Operator Dashboard</h3>
              <p className="text-slate-400 text-sm">
                A full admin interface built in where operators can change status from "Pending" to "In Progress" or "Resolved" as they fix issues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
