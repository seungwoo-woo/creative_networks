// 1. react & material UI import ==================================================
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';
import axios from 'axios'

// --------------------------------------------------------------------------------
import { styled } from '@mui/material/styles';
import { Box, IconButton, Paper, TableContainer, Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow, tableCellClasses, Container } from '@mui/material';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';


// 2. coponemts import ---------------------------------------------------------------
import OpenPhoneAdd from '../components/OpenPhoneAdd';
import OpenPhone from '../components/OpenPhone';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import { UserCompanyContext } from '../context/UserCompanyContext';
import { UserNameContext } from '../context/UserNameContext';
import { UserGradeContext } from '../context/UserGradeContext';


// 3. firebase import ======================================================
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { firebaseConfig } from '../firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";


// 4. Initialize Firebase ==================================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// 5. Define subFunction ================================================
// Table Pagination Function Start -----------------------------------------------------
function TablePaginationActions(props) {
  const theme = useTheme();  
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
};

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};



//  ======================================================================================
// Function 시작 =========================================================================
// =======================================================================================

function OpenPhoneList() {

// 1. Initialize Variable ==================================================
const navigate = useNavigate();
const auth = getAuth(app);
const [ openPhoneList, setOpenPhoneList ] = useState([]);
const { userCompanyName, setUserCompanyName } = useContext(UserCompanyContext);
const { setUserName } = useContext(UserNameContext);
const { userGrade, setUserGrade } = useContext(UserGradeContext);


// 2. Table Pagination Start ----------------------------------------
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(10);


// Table style ----------------------------------------------------
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#1976d2',
    color: theme.palette.common.white,
    fontSize: 14,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));


// 3. Define subFunction ==================================================
// 3-1. 개통리스트 DB에서 다시 읽어오기 (firebase DB) --------------------------------------------
// const getDataRefresh = async () => {
//   let data = [];
//   const querySnapshot = await getDocs(query(collection(db, "CreativeNetworks"), orderBy("openDate", "desc"), where("isDeleted", "==", 0)));

//   querySnapshot.forEach((doc) => {
//     data.push({...doc.data(), id: doc.id,})
//   });

//   setOpenPhoneList(data);
// }


// 3-1. 개통리스트 DB에서 다시 읽어오기 (mysql DB) --------------------------------------------
const getDataRefresh = async () => {
  try{
    const res = await axios.get("http://localhost:8800/openPhoneList")
    setOpenPhoneList(res.data)
    // console.log(res.data[0].openDate)
  }catch(err){
    console.log(err)
  }
}


// 3-2. table pagination subfunction --------------------------------------- 
const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

// 3-3 table pagination subfunction ----------------------------------------- 
const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
};  



// 4. useEffect 1: userData 읽어오기 (firebase DB) ========================================================
// useEffect(()=>{

//   const getUserInformation = () => {    

//   onAuthStateChanged(auth, async (user) => {
//     if (user) {
//       let userCompany = '';
//       let userName = '';
//       let userGrade = '';
//       const querySnapshot = await getDocs(query(collection(db, "comUsers"), where("id", "==", user.uid)));
//       querySnapshot.forEach((doc) => {
//       userName = (doc.data().name);
//       userCompany = (doc.data().company);
//       userGrade = (doc.data().userGrade);
//       setUserName(userName);
//       setUserCompanyName(userCompany);
//       setUserGrade(userGrade);
//       });
//     } else {
//       navigate('/');
//     }
//   });    
//   }    
//   getUserInformation();

// }, []);



// 4. useEffect 1: userData 읽어오기 (mysql DB) ========================================================
useEffect(()=>{

  const getUserInformation = () => {    

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const res = await axios.get(`http://localhost:8800/comUsers/${user.uid}`)
      setUserName(res.data[0].name);
      setUserCompanyName(res.data[0].company);
      setUserGrade(res.data[0].userGrade);
    } else {
      navigate('/');
    }
  });    
  }    
  getUserInformation();

}, []);



// 5. useEffect 2: 개통 리스트 읽어오기 (firebase DB)======================================================
// useEffect(()=>{

//   const getData = async () => {

//     let data = [];

//     if (userGrade === 'A' || userGrade === 'B') {
//       const querySnapshot = await getDocs(query(collection(db, "CreativeNetworks"), orderBy("openDate", "desc"), where("isDeleted", "==", 0)));
//       querySnapshot.forEach((doc) => {
//         data.push({...doc.data(), id: doc.id,})
//       });
//     } else {
//       const querySnapshot = await getDocs(query(collection(db, "CreativeNetworks"), orderBy("openDate", "desc"), where("isDeleted", "==", 0), where("sellCom", "==", userCompanyName)));
//       querySnapshot.forEach((doc) => {
//         data.push({...doc.data(), id: doc.id,})
//       });
//     }
//     setOpenPhoneList(data);
//     }   
    
//     getData();

// }, [userCompanyName, userGrade]);



// 5. useEffect 2: 개통 리스트 읽어오기 (mysql DB)======================================================
useEffect(()=>{
  const fetchAllOpenPhoneList = async () => {
    try{
      const res = await axios.get("http://localhost:8800/openPhoneList")
      setOpenPhoneList(res.data)
    }catch(err){
      console.log(err)
    }
  }
  fetchAllOpenPhoneList()
}, [])



// ------------------------------------------------------------------------------------
// return 시작 ------------------------------------------------------------------------
// ------------------------------------------------------------------------------------

return (
  <Container maxWidth='false'>
  <ResponsiveAppBar />
  <div style={{marginTop: 30}}>
    <OpenPhoneAdd getDataRefresh={getDataRefresh} userGrade={userGrade} userCompanyName={userCompanyName} setOpenPhoneList={setOpenPhoneList}/>
  </div>

  <Paper style={{marginTop: 10, marginLeft: 0, marginRight: 0}} elevation={3}>
  <TableContainer>
    <Table stickyHeader size='small' aria-label="sticky table">        
      <TableHead>
        <TableRow>
          <StyledTableCell padding='none' sx= {{paddingTop:1, paddingBottom:1, fontWeight: 400}} align='center' rowSpan={2}>No.</StyledTableCell>
          <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>통신사</StyledTableCell>
          <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>개통처</StyledTableCell>
          <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>타입</StyledTableCell>
          <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>개통일</StyledTableCell>
          <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>유형</StyledTableCell>
          {/* <StyledTableCell style={{fontWeight: 400}} align='center' colSpan={3}>개통모델</StyledTableCell> */}
          <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>모델명</StyledTableCell>
          <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>일련번호</StyledTableCell>
          <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>색상</StyledTableCell>
          <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>고객명</StyledTableCell>
          <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>이동번호</StyledTableCell>
          <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>내/외국인</StyledTableCell>
          <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>음성요금제</StyledTableCell>
          <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>메모</StyledTableCell>
          <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>판매처</StyledTableCell>
          { (userGrade === 'A' || userGrade === 'B') && <StyledTableCell padding='none' style={{fontWeight: 600, color: "yellow"}} align='center' rowSpan={2}>ACTION</StyledTableCell> }
        </TableRow>
        {/* <TableRow>
          <StyledTableCell style={{fontWeight: 400}} align='center'>모델명</StyledTableCell>
          <StyledTableCell style={{fontWeight: 400}} align='center'>일련번호</StyledTableCell>
          <StyledTableCell style={{fontWeight: 400}} align='center'>색상</StyledTableCell>
        </TableRow> */}
      </TableHead>

      <TableBody>
        { openPhoneList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)              
          .map((op, index) => {
              return (<OpenPhone 
                key = {op.id}
                id = {op.id} 
                no = {index + 1 + (page * rowsPerPage)}
                telCom = {op.telCom}
                openCom = {op.openCom}
                type = {op.type}
                // openDate = {new Date(op.openDate).toISOString().slice(0, 10)} 
                openDate = {new Date(op.openDate).toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}).slice(0, 12)} 
                openType = {op.openType}
                phoneModel = {op.phoneModel}
                phoneSerial = {op.phoneSerial}
                phoneColor = {op.phoneColor}
                customerName = {op.customerName}
                phoneNo = {op.phoneNo}
                nationality = {op.nationality}
                birthday = {op.birthday}
                callingPlan = {op.callingPlan}
                controlNo = {op.controlNo}
                memo = {op.memo}
                sellCom = {op.sellCom}
                getDataRefresh = {getDataRefresh} 
                userGrade = {userGrade}
                />
              );    // return ----------
          })
          }
      </TableBody>

      <TableFooter>
        <TableRow>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
            count={openPhoneList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
          />
        </TableRow>
      </TableFooter>

    </Table>
    </TableContainer> 
  </Paper>
  </Container>

  
);

// Component End =========================================================
}

export default OpenPhoneList;