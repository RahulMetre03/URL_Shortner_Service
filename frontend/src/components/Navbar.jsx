import React from 'react';

const Navbar = ({ currentPage, setCurrentPage, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-brand">LinkShort</h1>
        <div className="navbar-links">
          <button 
            onClick={() => setCurrentPage('dashboard')}
            className={`nav-btn ${currentPage === 'dashboard' ? 'nav-btn-active' : 'nav-btn-inactive'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setCurrentPage('stats')}
            className={`nav-btn ${currentPage === 'stats' ? 'nav-btn-active' : 'nav-btn-inactive'}`}
          >
            Stats
          </button>
          <button onClick={onLogout} className="nav-btn nav-btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
