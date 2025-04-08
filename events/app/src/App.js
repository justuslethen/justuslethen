import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { PinProvider } from './contexts/PinContext';

import Header from './components/Header';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <PinProvider>
      <Router>
        <AppRoutes />
      </Router>
    </PinProvider>
  );
}

export default App;