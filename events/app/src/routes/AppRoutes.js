import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Event from '../pages/Event';
import Create from '../pages/Create';
import Edit from '../pages/Edit';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<Create />} />
      <Route path="/edit/:eventId" element={<Edit />} />
      <Route path="/event/:eventId" element={<Event />} />
    </Routes>
  );
};

export default AppRoutes;