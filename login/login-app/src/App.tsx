import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.tsx';
import NotFound from './pages/NotFound/NotFound.tsx';
import Registrate from './pages/Register/Register.tsx';
import Login from './pages/Login/Login.tsx';
import LoginCheck from './pages/LoginCheck/LoginCheck.tsx';
import Email from './pages/Email/Email.tsx';
import VerifyEmail from './pages/Email/VerifyEmail/VerifyEmail.tsx';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/registrate" element={<Registrate />} />
      <Route path="/login" element={<Login />} />

      <Route path="/email" element={<Email />}>
        <Route path="verify-email" element={<VerifyEmail />} />
        {/* <Route path="recent" element={<Recent />} /> */}
      </Route>

      <Route path="/login-check" element={<LoginCheck />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;