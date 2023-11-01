import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserCompanyContext } from './context/UserCompanyContext';
import { UserNameContext } from './context/UserNameContext';
import { UserGradeContext } from './context/UserGradeContext';
import OpenPhoneList from './pages/OpenPhoneLIst';
import SignInSide from './pages/SingInSide';
import OpenPhoneCaculation from './pages/OpenPhoneCaculation';
import AdminPage from './pages/AdminPage';
import SignUp from './pages/SignUp';
import OpenPhoneDashBoard from './pages/OpenPhoneDashBoard';
import { useState } from 'react';



function App() {

  const [ userCompanyName, setUserCompanyName ] = useState(null);
  const [ userName, setUserName ] = useState(null);
  const [ userGrade, setUserGrade ] = useState(null);

  return (
    <UserCompanyContext.Provider value={{userCompanyName, setUserCompanyName}}>
    <UserNameContext.Provider value={{userName, setUserName}}>
    <UserGradeContext.Provider value={{userGrade, setUserGrade}}>
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
    </UserGradeContext.Provider>
    </UserNameContext.Provider>
    </UserCompanyContext.Provider>


  );
}

export default App;
