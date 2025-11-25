import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import AddLinkModal from '../components/AddLinkModal';
import Navbar from '../components/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API, BASE_URL } from "../config/apiConfig.js";

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token).id : null;

  // Fetch links on mount
  useEffect(() => {
    const fetchLinks = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const res = await fetch(API.LINKS.GET_ALL(userId), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
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
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [userId]);

  // Handle navigation when currentPage changes
  useEffect(() => {
    if (currentPage === 'stats') {
      navigate('/stats');
    }
  }, [currentPage, navigate]);

  const filteredLinks = links.filter(link =>
    link.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.target_url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddLinkSubmit = (newLink) => {
    setLinks(prev => [newLink, ...prev]);
    setShowAddModal(false);
  };

  const handleDeleteLink = (id) => {
    const ConfirmToast = ({ closeToast }) => (
      <div style={{ color: "#fff" }}>
        <p>Are you sure you want to delete this link?</p>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
          <button
            onClick={async () => {
              try {
                const res = await fetch(API.LINKS.DELETE(id, userId), {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                });
                const data = await res.json();

                if (!res.ok) {
                  toast.error(data.message || "Failed to delete link");
                } else {
                  toast.success("Link deleted successfully!");
                  setLinks(prev => prev.filter(link => link.id !== id));
                }
              } catch (err) {
                console.error(err);
                toast.error("Server error. Try again later.");
              }

              closeToast(); // close the confirmation toast
            }}
            style={{
              marginRight: "0.5rem",
              padding: "0.25rem 0.5rem",
              background: "#ef4444",
              color: "white",
              borderRadius: "0.25rem",
              border: "none",
              cursor: "pointer"
            }}
          >
            Yes
          </button>

          <button
            onClick={closeToast}
            style={{
              padding: "0.25rem 0.5rem",
              background: "#9ca3af",
              color: "white",
              borderRadius: "0.25rem",
              border: "none",
              cursor: "pointer"
            }}
          >
            No
          </button>
        </div>
      </div>
    );

    // Show the toast
    toast.info(<ConfirmToast />, {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
      style: { background: "#1f2937" } // dark theme
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate('/');
  };

  const viewStats = (code) => {
    navigate(`/code/${code}`);
  }


  return (
    <div>
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onLogout={handleLogout}
      />

      <ToastContainer position="top-right" autoClose={3000} />
      <div className="dashboard-header">
        <h2 className="page-title">My Links</h2>
        <button onClick={() => setShowAddModal(true)} className="btn-add">
          + Add Link
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by code or URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <p style={{ color: 'white' }}>Loading...</p>
      ) : (
        <div className='table-outer'>
        <div className="table-container">
          <div className="table-wrapper">
            <table className="data-table">
              <thead className="table-header">
                <tr>
                  <th>Short Code</th>
                  <th>Target URL</th>
                  <th>Total Clicks</th>
                  <th>Created At</th>
                  <th>Last Visited</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {filteredLinks.map(link => (
                  <tr key={link.id}>
                    <td>
                      <span
                        onClick={() => {
                          navigator.clipboard.writeText(`${BASE_URL.replace("/api", "")}/${link.code}`);
                          toast.success("Link Copied!"); // optional toast or notification
                        }}
                        style={{ cursor: "pointer", textDecoration: "underline", color: "#3B82F6" }}
                        title="Click to copy"
                      >
                        {link.code}
                      </span>
                    </td>
                    <td className="link-url">
                      {link.target_url.length > 7
                        ? `${link.target_url.slice(8, 15)}...`
                        : link.target_url}
                    </td>

                    <td>
                      <span className="clicks-badge">{link.clicks}</span>
                    </td>
                    <td className="last-clicked">{new Date(link.created_at).toLocaleString()}</td>
                    <td className="last-clicked">{new Date(link.updated_at).toLocaleString()}</td>
                    <td>
                      <button onClick={() => handleDeleteLink(link.id)} className="btn-delete">
                        Delete
                      </button>
                      <button onClick={() => viewStats(link.code)} className="btn-delete">
                        Stats
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      )}

      {showAddModal && (
        <AddLinkModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddLinkSubmit}
        />
      )}
    </div>
  );
};

export default Dashboard;
