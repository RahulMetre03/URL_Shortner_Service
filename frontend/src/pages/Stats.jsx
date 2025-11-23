import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { API, BASE_URL } from "../config/apiConfig.js";

const StatsPage = () => {
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState('stats');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate('/');
  };

  // Handle navigation when currentPage changes
  useEffect(() => {
    if (currentPage === 'dashboard') {
      navigate('/dashboard');
    }
  }, [currentPage, navigate]);

  useEffect(() => {
    const fetchLinks = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      let userId;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = payload.id;
      } catch (err) {
        console.error("Invalid token");
        return;
      }

      try {
        const res = await fetch(API.LINKS.GET_ALL(userId), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message || "Failed to fetch links");
        } else {
          setLinks(data);
        }
      } catch (err) {
        console.error(err);
        toast.error("Server error. Try again later.");
      }
    };

    fetchLinks();
  }, []);

  // Prepare chart data
  const statsData = links.map(link => ({
    name: link.code,
    clicks: link.clicks
  }));

  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
  const avgClicks = links.length > 0 ? Math.round(totalClicks / links.length) : 0;

  return (
    <div>
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onLogout={handleLogout}
      />

      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="page-title">Click Statistics</h2>

      <div className="chart-container" style={{ marginTop: '1.5rem' }}>
        <h3 className="chart-title">Clicks per Link</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={statsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#D1D5DB' }}
            />
            <Bar dataKey="clicks" fill="#3B82F6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Total Links</p>
          <p className="stat-value">{links.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Clicks</p>
          <p className="stat-value stat-value-blue">{totalClicks}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Avg Clicks per Link</p>
          <p className="stat-value stat-value-cyan">{avgClicks}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;