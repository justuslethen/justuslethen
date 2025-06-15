import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.tsx';
import NotFound from './pages/NotFound/NotFound.tsx';
import Rooms from './pages/Rooms/Rooms.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/rooms" element={<Rooms />}>
        <Route path="public" element={<p>Public</p>} />
        <Route path="recent" element={<p>Recent</p>} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;