import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import StatsPage from "./pages/Stats.jsx";
import LinkStatsPage from './pages/LinkStats';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/stats" element={<StatsPage />} />
      <Route path="/code/:code" element={<LinkStatsPage />} />
    </Routes>
  );
};

export default App;
