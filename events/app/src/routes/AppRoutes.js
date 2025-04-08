import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Event from '../pages/Event';
import Create from '../pages/Create';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<Create />} />
      <Route path="/event" element={<Event />} />
    </Routes>
  );
};

export default AppRoutes;