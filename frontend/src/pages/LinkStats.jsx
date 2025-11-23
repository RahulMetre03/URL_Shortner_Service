import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Navbar from "../components/Navbar";
import { API } from "../config/apiConfig";

const LinkStatsPage = () => {
    const { code } = useParams(); // grab the link code from URL
    const [link, setLink] = useState(null);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState('stats');

    const handleLogout = () => {
        localStorage.removeItem("token");
        toast.success("Logged out successfully!");
        navigate('/');
    };

    useEffect(() => {
        if (currentPage === 'dashboard') {
            navigate('/dashboard');
        }
    }, [currentPage, navigate]);

    useEffect(() => {
        const fetchLink = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            const userId = token ? jwtDecode(token).id : null;

            try {
                const res = await fetch(API.LINKS.GET(code, userId), {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                const data = await res.json();

                if (!res.ok) {
                    toast.error(data.message || "Failed to fetch link stats");
                } else {
                    setLink(data);
                }
            } catch (err) {
                console.error(err);
                toast.error("Server error. Try again later.");
            }
        };

        fetchLink();
    }, [code]);

    if (!link) return <p>Loading...</p>;
    // --- Derived data for charts ---
    const createdDate = new Date(link.created_at);
    const updatedDate = new Date(link.updated_at);
    const totalDays = Math.max(1, Math.ceil((updatedDate - createdDate) / (1000 * 60 * 60 * 24)));

    // Clicks over lifetime (uniform distribution)
    const clicksOverTime = Array.from({ length: totalDays }, (_, i) => ({
        date: new Date(createdDate.getTime() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
        clicks: Math.floor(link.clicks / totalDays),
    }));

    // Click progress toward goal (e.g., goal = 10 clicks)
    const clickGoal = 10;
    const clickProgressPercent = Math.min(100, Math.round((link.clicks / clickGoal) * 100));

    return (
        <div>
            <Navbar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                onLogout={handleLogout}
            />

            <ToastContainer position="top-right" autoClose={3000} />

            <h2 className="page-title">Stats for {link.code}</h2>

            {/* Clicks over lifetime */}
            <div className="chart-container" style={{ marginTop: '1.5rem' }}>
                <h3 className="chart-title">Clicks Over Lifetime</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={clicksOverTime}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                            labelStyle={{ color: '#D1D5DB' }}
                        />
                        <Bar dataKey="clicks" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Stats cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <p className="stat-label">Short URL</p>
                    <p className="stat-value">{link.code}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Target URL</p>
                    <p className="stat-value">
                        {link.target_url.length > 7
                            ? `${link.target_url.slice(8, 15)}...`
                            : link.target_url}
                    </p>

                </div>
                <div className="stat-card">
                    <p className="stat-label">Total Clicks</p>
                    <p className="stat-value stat-value-blue">{link.clicks}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Created At</p>
                    <p className="stat-value">{createdDate.toLocaleDateString()}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Days Active</p>
                    <p className="stat-value">{totalDays}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Click Goal Progress</p>
                    <p className="stat-value stat-value-cyan">{clickProgressPercent}%</p>
                </div>
            </div>
        </div>
    );
};


export default LinkStatsPage;
