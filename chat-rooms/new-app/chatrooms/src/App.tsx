import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx';
import NotFound from './pages/NotFound.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;