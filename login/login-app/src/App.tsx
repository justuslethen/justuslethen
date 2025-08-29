import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.tsx';
import NotFound from './pages/NotFound/NotFound.tsx';
import Registrate from './pages/Register/Register.tsx';
import Login from './pages/Login/Login.tsx';
import LogInCheck from './pages/LogInCheck/LogInCheck.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/registrate" element={<Registrate />} />

      <Route path="/login" element={<Login />} />

      <Route path="/login-check" element={<LogInCheck />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;