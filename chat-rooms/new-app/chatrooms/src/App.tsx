import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.tsx';
import NotFound from './pages/NotFound/NotFound.tsx';
import Rooms from './pages/Rooms/Rooms.tsx';
import Recent from './pages/Rooms/Recent/Recent.tsx';
import Public from './pages/Rooms/Public/Public.tsx';
import CreateRoom from './pages/CreateRoom/CreateRoom.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create-room" element={<CreateRoom />} />
      <Route path="/rooms" element={<Rooms />}>
        <Route path="public" element={<Public />} />
        <Route path="recent" element={<Recent />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;