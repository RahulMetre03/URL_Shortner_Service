import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API } from '../config/apiConfig';

const AddLinkModal = ({ onClose, onSubmit }) => {
  const [newLink, setNewLink] = useState({ url: '', customCode: '' });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token).id : null;

  const handleSubmit = async () => {
    if (!newLink.url) {
      toast.error("Please enter a URL");
      return;
    }
    let formattedUrl = newLink.url;
      try {
        // Ensure URL has proper protocol
        if (!/^https?:\/\//i.test(formattedUrl)) {
          formattedUrl = "https://" + formattedUrl;
        }
        new URL(formattedUrl); // throws if invalid
      } catch (err) {
        toast.error("Please enter a valid URL");
        return;
      }

    setLoading(true);

   try {
    const res = await fetch(API.LINKS.ADD, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: newLink.url, userId })
    });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to create link");
      } else {
        toast.success("Link created successfully!");
        onSubmit(data.link); // pass the new link back to dashboard
        setNewLink({ url: '', customCode: '' });
        onClose();
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="modal-content">
        <h3 className="modal-title">Add New Link</h3>
        
        <div className="form-group">
          <label className="form-label">Target URL *</label>
          <input 
            type="url"
            value={newLink.url}
            onChange={(e) => setNewLink({...newLink, url: e.target.value})}
            className="form-input"
            placeholder="https://example.com"
          />
        </div>
        
        <div className="modal-actions">
          <button onClick={onClose} className="btn-cancel" disabled={loading}>
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn-submit" disabled={loading}>
            {loading ? "Adding..." : "Add Link"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLinkModal;
