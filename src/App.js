import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OpenPhoneList from './pages/OpenPhoneLIst';
import SignInSide from './pages/SingInSide';
import OpenPhoneCaculation from './pages/OpenPhoneCaculation';
import AdminPage from './pages/AdminPage';
import SignUp from './pages/SignUp';
import OpenPhoneDashBoard from './pages/OpenPhoneDashBoard';


function App() {

  return (
    <Router>
      <Routes>
        <Route path = "/" element={<SignInSide />} />
        <Route path = "/signUp" element={<SignUp />} />
        <Route path = "/dashBoard" element={<OpenPhoneDashBoard />} />
        <Route path = "/openPhoneList" element={<OpenPhoneList />} />
        <Route path = "/calculate" element={<OpenPhoneCaculation />} />
        <Route path = "/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
