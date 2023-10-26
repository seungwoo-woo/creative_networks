import React, { useEffect, useState } from 'react';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';


// firebase import=======================================================
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { firebaseConfig } from '../firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";



// Initialize Firebase ==================================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();



const data = [{name: 'Page A', uv: 400, pv: 240, amt: 2400},
              {name: 'Page B', uv: 300, pv: 280, amt: 2400},
              {name: 'Page C', uv: 300, pv: 210, amt: 2400},
              {name: 'Page D', uv: 200, pv: 140, amt: 2400},
              {name: 'Page E', uv: 280, pv: 420, amt: 2400},
              {name: 'Page F', uv: 190, pv: 120, amt: 2400},
            ];

function OpenPhoneDashBoard(props) {

  // Initialize Variable ==================================================
  const navigate = useNavigate();

  const [ userCompanyName, setUserCompanyName ] = useState([]);

  



// useEffect 1 Start ========================================================
useEffect(()=>{ 

  const getUserCompany = () => {    

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        let companydata = '';
        const querySnapshot = await getDocs(query(collection(db, "comUsers"), where("id", "==", user.uid)));
        querySnapshot.forEach((doc) => {
        companydata = (doc.data().company);
        setUserCompanyName(companydata);
        });
      } else {
        navigate('/');
      }
    });
    
  }    
  getUserCompany();  

}, [])


// ------------------------------------------------------------------------------------
// return 시작 ------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
return (
  <>
    <ResponsiveAppBar />

    <div style={{marginTop: 50, display: 'flex', justifyContent: 'center'}}>
      <LineChart width={600} height={300} data={data} margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
        <Line type="monotone" dataKey="uv" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
      </LineChart>
    </div>
  </>
);

}

export default OpenPhoneDashBoard