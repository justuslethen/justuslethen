import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.tsx';
import NotFound from './pages/NotFound/NotFound.tsx';
import PublicRooms from './pages/PublicRooms/PublicRooms.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/public-rooms" element={<PublicRooms />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;