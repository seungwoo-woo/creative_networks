import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OpenPhoneList from './pages/OpenPhoneLIst';
import SignInSide from './pages/SingInSide';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import OpenPhoneCaculation from './pages/OpenPhoneCaculation';
import AdminPage from './pages/AdminPage';


function App() {
  return (
    <Router>
      <ResponsiveAppBar />
      <Routes>
        <Route path = "/" element={<SignInSide />} />
        <Route path = "/openPhoneList" element={<OpenPhoneList />} />
        <Route path = "/calculate" element={<OpenPhoneCaculation />} />
        <Route path = "/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
