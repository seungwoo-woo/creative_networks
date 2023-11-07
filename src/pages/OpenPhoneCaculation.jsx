import React, { useEffect } from 'react';
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import { UserCompanyContext } from '../context/UserCompanyContext';
import { UserNameContext } from '../context/UserNameContext';
import { UserGradeContext } from '../context/UserGradeContext';
import Container from '@mui/material/Container';
import { Box } from '@mui/material';




// firebase import=======================================================
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { firebaseConfig } from '../firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";


// Initialize Firebase ==================================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);



//  ======================================================================================
// Function 시작 =========================================================================
// =======================================================================================

function OpenPhoneCaculation(props) {

  // Initialize Variable ==================================================
  const navigate = useNavigate();
  const { setUserCompanyName } = useContext(UserCompanyContext);
  const { setUserName } = useContext(UserNameContext);
  const { setUserGrade } = useContext(UserGradeContext);


// useEffect 1 Start ========================================================
useEffect(()=>{

  const getUserInformation = () => {    

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      let userCompany = '';
      let userName = '';
      let userGrade = '';
      const querySnapshot = await getDocs(query(collection(db, "comUsers"), where("id", "==", user.uid)));
      querySnapshot.forEach((doc) => {
      userName = (doc.data().name);
      userCompany = (doc.data().company);
      userGrade = (doc.data().userGrade);
      setUserName(userName);
      setUserCompanyName(userCompany);
      setUserGrade(userGrade);
      });
    } else {
      navigate('/');
    }
  });    
  }    
  getUserInformation();

}, []);


// ------------------------------------------------------------------------------------
// return 시작 ------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
return (
  <Container maxWidth='false'>
    <ResponsiveAppBar />
    <Container component="main" maxWidth="sm">
      <Box>OpenPhoneCaculation</Box>
    </Container>
  </Container>
);

}

export default OpenPhoneCaculation