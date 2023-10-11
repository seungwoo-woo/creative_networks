import React, { useEffect, useState } from 'react';
import './App.css';
import Openphone from './components/Openphone';
import { CircularProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';


// firestore ============================================================
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { firebaseConfig } from './firebase';
// ======================================================================

// Initialize Firebase ==================================================
const app = initializeApp(firebaseConfig);
// ======================================================================

// Initialize Cloud Firestore and get a reference to the service ========
const db = getFirestore(app);
// ======================================================================



// const openPhoneList = [
//   {
//     id : 1,
//     telCom : 'EREL',
//     openCom : '에르엘선불B',
//     type : '유심',
//     openDate : '2023-10-11',
//     openType : '신규현금',
//     phoneModel : 'k9000',
//     phoneSerial : '1156355',
//     phoneColor : 'black',
//     customerName : '우승우',
//     phoneNo : '010-9728-6451',
//     birthday : '740225',
//     callingPlan : '에르엘 선불정액 300MB',
//     controlNo : '500289156826',
//     memo : '본사 개통 건',
//     sellCom : '셀타운'
//   },
//   {
//     id : 2,
//     telCom : 'EREL',
//     openCom : '에르엘선불B',
//     type : '유심',
//     openDate : '2023-10-11',
//     openType : '신규현금',
//     phoneModel : 'k9000',
//     phoneSerial : '1156355',
//     phoneColor : 'black',
//     customerName : '우승우1',
//     phoneNo : '010-9728-6451',
//     birthday : '740225',
//     callingPlan : '에르엘 선불정액 300MB',
//     controlNo : '500289156826',
//     memo : '본사 개통 건',
//     sellCom : '셀타운'
//   },
//   {
//     id : 3,
//     telCom : 'EREL',
//     openCom : '에르엘선불B',
//     type : '유심',
//     openDate : '2023-10-11',
//     openType : '신규현금',
//     phoneModel : 'k9000',
//     phoneSerial : '1156355',
//     phoneColor : 'black',
//     customerName : '우승우2',
//     phoneNo : '010-9728-6451',
//     birthday : '740225',
//     callingPlan : '에르엘 선불정액 300MB',
//     controlNo : '500289156826',
//     memo : '본사 개통 건',
//     sellCom : '셀타운'
//   },
// ]


const tableHeadList = ['No.', '통신사', '개통처', '타입', '개통일', '유형', '모델명', '일련번호', '색상', '고객명', '이동번호', '생년월일', '음성요금제', '관리번호', '메모', '판매처'];





function App() {

  const [openPhoneList, setOpenPhoneList] = useState([]);
  const [progress, setProgress] = useState(0);


  useEffect(()=>{

    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 1));
    }, 10);
    
    const getData = async () => {
      let data = [];
      const querySnapshot = await getDocs(query(collection(db, "CreativeNetworks"), where("isDeleted", "==", 0)));

      querySnapshot.forEach((doc) => {
        data.push({...doc.data(), id: doc.id,})
      });
      setOpenPhoneList(data);
    }
    
    getData();

    return () => {
      clearInterval(timer);
    };

  }, []);



  return (
    <Paper style={{marginTop: 50, marginLeft: 10, marginRight: 10}}>
      <Table>        
        <TableHead style={{backgroundColor: '#DBDBDB'}}>
          <TableRow>
            {tableHeadList.map((item) => {
                return <TableCell style={{fontSize: '0.8rem', fontWeight: 600}} align='center'>{item}</TableCell>
            })}
          </TableRow>
        </TableHead>

        <TableBody>
          { openPhoneList.length > 0 ? openPhoneList.map((op) => {
            return (<Openphone 
              key = {op.id}
              no = {op.no}
              telCom = {op.telCom}
              openCom = {op.openCom}
              type = {op.type}
              openDate = {op.openDate}
              openType = {op.openType}
              phoneModel = {op.phoneModel}
              phoneSerial = {op.phoneSerial}
              phoneColor = {op.phoneColor}
              customerName = {op.customerName}
              phoneNo = {op.phoneNo}
              birthday = {op.birthday}
              callingPlan = {op.callingPlan}
              controlNo = {op.controlNo}
              memo = {op.memo}
              sellCom = {op.sellCom} 
              />
            );
          }):       
          <TableRow>
              <TableCell colSpan="16" align='center'>
                <CircularProgress value={progress} />
              </TableCell>
          </TableRow>
          }

        </TableBody>
      </Table>
    </Paper>
  );
}

export default App;
