import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OpenPhoneList from './pages/OpenPhoneLIst';
import SignInSide from './pages/SingInSide';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import OpenPhoneCaculation from './pages/OpenPhoneCaculation';
import AdminPage from './pages/AdminPage';
import SignUp from './pages/SignUp';
import { useState } from 'react';


function App() {

  const [ isLogin, setIsLogin ] = useState(false);

  return (
    <Router>
      {isLogin && <ResponsiveAppBar />}
      {/* <ResponsiveAppBar /> */}

      <Routes>
        <Route path = "/" element={<SignInSide setIsLogin = {setIsLogin}/>} />
        <Route path = "/signUp" element={<SignUp />} />
        <Route path = "/openPhoneList" element={<OpenPhoneList />} />
        <Route path = "/calculate" element={<OpenPhoneCaculation setIsLogin = {setIsLogin}/>} />
        <Route path = "/admin" element={<AdminPage setIsLogin = {setIsLogin}/>} />
      </Routes>
    </Router>
  );
}

export default App;
