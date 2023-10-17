import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OpenPhoneList from './pages/OpenPhoneLIst';
import SignInSide from './pages/SingInSide';


function App() {
  return (
    <Router>
      {/* <NavbarElement /> */}
      <Routes>
        <Route path = "/" element={<SignInSide />} />
        <Route path = "/openPhoneList" element={<OpenPhoneList />} />
      </Routes>
    </Router>
  );
}

export default App;
