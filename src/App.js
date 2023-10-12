import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OpenPhoneList from './pages/OpenPhoneLIst';


function App() {
  return (
    <Router>
      {/* <NavbarElement /> */}
      <Routes>
        <Route path = "/openPhoneList" element={<OpenPhoneList />} />
      </Routes>
    </Router>
  );
}

export default App;
