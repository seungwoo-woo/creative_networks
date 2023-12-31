// react & material UI import ==================================================
import React, { useEffect, useState } from "react";
import { useContext } from 'react'
import * as XLSX  from 'xlsx';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { pink } from '@mui/material/colors';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import ReportIcon from '@mui/icons-material/Report';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Table, IconButton, TableHead, TableBody, TableCell, TableRow, TableFooter, TablePagination, tableCellClasses, Container } from "@mui/material";
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import AddOneRow from "../components/AddOneRow";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import StoreIcon from '@mui/icons-material/Store';
import WifiCalling3Icon from '@mui/icons-material/WifiCalling3';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Dialog, DialogContent, DialogTitle, DialogActions } from "@mui/material";
import { UserCompanyContext } from '../context/UserCompanyContext';
import { UserNameContext } from '../context/UserNameContext';
import { UserGradeContext } from '../context/UserGradeContext';
import axios from 'axios'


// firebase import=======================================================
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy} from "firebase/firestore";


// Initialize Firebase ==================================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Define subFunction ================================================
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

function AdminPage(props) {

// Initialize Variable ==================================================
const navigate = useNavigate();
const auth = getAuth(app);

const [isSellComOpen, setIsSellComOpen] = useState(false);
const [sellComList, setSellComList] = useState([]);
const [isTelComOpen, setIsTelComOpen] = useState(false);
const [telComList, setTelComList] = useState([]);
const [isOpenComOpen, setIsOpenComOpen] = useState(false);
const [openComList, setOpenComList] = useState([]);
const [isCallingPlanOpen, setIsCallingPlanOpen] = useState(false);
const [callingPlanList, setCallingPlanList] = useState([]);
const [isUserOpen, setIsUserOpen] = useState(false);
const [userList, setUserList] = useState([]);

const [ jsonData, setJsonData ] = useState();
const [ editCase, setEditCase ] = useState();

const [ isCompUploadDialogOpen, setIsComUpLoadDialogOpen ] = useState(false);
const [ msg, setMsg ] = useState('');

const { setUserCompanyName } = useContext(UserCompanyContext);
const { setUserName } = useContext(UserNameContext);
const { setUserGrade } = useContext(UserGradeContext);


// Table Pagination Start ----------------------------------------
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


// File Input Button style ----------------------------------------------------
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


// Define subFunction ==================================================
// Refresh sellComList -------------------------------------------------------------
const getDataRefresh = async () => {
  const res = await axios.get(`http://localhost:8800/sellComs`)
  setSellComList(res.data);
}


// Refresh telComList-------------------------------------------------------------
const getDataRefresh2 = async () => {
  const res = await axios.get(`http://localhost:8800/telComs`)
  setTelComList(res.data);
}


// Refresh openComList-------------------------------------------------------------
const getDataRefresh3 = async () => {
  const res = await axios.get(`http://localhost:8800/openComs`)
  setOpenComList(res.data);

  // let data = [];
  // const querySnapshot = await getDocs(query(collection(db, "openComName"), orderBy("comName", "asc"), where("isDeleted", "==", 0)));
  // querySnapshot.forEach((doc) => {
  //   data.push({...doc.data(), id: doc.id,})
  // });
  // setOpenComList(data);
}


// Refresh callingPlanList-------------------------------------------------------------
const getDataRefresh4 = async () => {
  const res = await axios.get(`http://localhost:8800/callingPlan`)
  console.log(res.data)

  // let data = [];
  // const querySnapshot = await getDocs(query(collection(db, "callingPlanName"), orderBy("planName", "asc"), where("isDeleted", "==", 0)));
  // querySnapshot.forEach((doc) => {
  //   data.push({...doc.data(), id: doc.id,})
  // });
  setCallingPlanList(res.data);
}


// Refresh userList (firebase DB) -------------------------------------------------------------
// const getDataRefresh5 = async () => {
//   let data = [];
//   const querySnapshot = await getDocs(query(collection(db, "comUsers"), orderBy("name", "asc"), where("isDeleted", "==", 0)));
//   querySnapshot.forEach((doc) => {
//     data.push({...doc.data(), id: doc.id,})
//   });
//   setUserList(data);
// }

// Refresh userList (mysql DB) -------------------------------------------------------------
const getDataRefresh5 = async () => {
  const res = await axios.get(`http://localhost:8800/comUsers`)
  setUserList(res.data);
}


// 판매처 Table Open ----------------------------------------------------------------
const hdcSellComOpen = () => {
  setIsSellComOpen(true);
  setIsTelComOpen(false);
  setIsOpenComOpen(false);
  setIsCallingPlanOpen(false);
  setIsUserOpen(false);
  setEditCase(1);
};

// 통신사 Table Open ----------------------------------------------------------------
const hdcTelComOpen = () => {
  setIsSellComOpen(false);
  setIsTelComOpen(true);  
  setIsOpenComOpen(false);
  setIsCallingPlanOpen(false);
  setIsUserOpen(false);
  setEditCase(2);
};

// 개통처 Table Open ----------------------------------------------------------------
const hdcOpenComOpen = () => {
  setIsSellComOpen(false);
  setIsTelComOpen(false);  
  setIsOpenComOpen(true);
  setIsCallingPlanOpen(false);
  setIsUserOpen(false);
  setEditCase(3);
};


// 요금제 Table Open ----------------------------------------------------------------
const hdcCallingPlanOpen = () => {
  setIsSellComOpen(false);
  setIsTelComOpen(false);
  setIsOpenComOpen(false);
  setIsCallingPlanOpen(true);
  setIsUserOpen(false);
  setEditCase(4);
};

// 사용자 Table Open ----------------------------------------------------------------
const hdcUserOpen = () => {
  setIsSellComOpen(false);
  setIsTelComOpen(false);
  setIsOpenComOpen(false);
  setIsCallingPlanOpen(false);
  setIsUserOpen(true);
  setEditCase(5);
};


// ----------------------------------------------------------------------
const hdcCompUploadDialogOpen = () => {
  setIsComUpLoadDialogOpen(true);
}

// ----------------------------------------------------------------------
const hdcCompUploadDialogClose = () => {
  setIsComUpLoadDialogOpen(false);
};

//----------------------------------------------------------------------- 
const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

//----------------------------------------------------------------------- 
const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
};  

//----------------------------------------------------------------------- 
const ExcelToJson = (e) => {
  const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const jsonData 
        = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        setJsonData(jsonData);
      };

      reader.readAsBinaryString(file);
    }
}


// 판매처 엑셀 업로드 ----------------------------------------------------------
const SellComUpload = () => {
  try {
    jsonData.map(async (item) => {
      await axios.post("http://localhost:8800/sellComs", {
        comName: item.판매처,
        comNo: item.사업자번호,
        bank: item.은행,
        acount: item.계좌,
        comPerson: item.담당자,
        isDeleted: 0 
    });    
    });
    setMsg('판매처 정보가 업로드되었습니다.')
    hdcCompUploadDialogOpen();
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  getDataRefresh();
}


// 통신사 엑셀 업로드 ----------------------------------------------------------
const TelComUpload = () => {
  try {
    jsonData.map(async (item) => {
      await axios.post("http://localhost:8800/telComs", {
        comName: item.통신사,
        comPerson: item.담당자,
        isDeleted: 0
      })
    })
    setMsg('통신사 정보가 업로드되었습니다.')
    hdcCompUploadDialogOpen();
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  getDataRefresh2();
}


// 개통처 엑셀 업로드 ----------------------------------------------------------
const OpenComUpload = () => {
  try {
    jsonData.map(async (item) => {
      await axios.post("http://localhost:8800/openComs", {
        comName: item.개통처,
        comPerson: item.담당자,
        telComName: item.통신사,
        isDeleted: 0 
    })    
    })
    setMsg('개통처 정보가 업로드되었습니다.')
    hdcCompUploadDialogOpen();
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  getDataRefresh3();
}


// 요금제 엑셀 업로드 ----------------------------------------------------------
const CallingPlanUpload = () => {
  
  try {
    // console.log(jsonData);
    jsonData.map(async (item) => {

      const rebate1 = [];
      const rebate2 = [];
      const rebate3 = [];
      const rebate4 = [];

      for (let i = 0; i < 31; i++) {
        rebate1.push(item.신규리베이트);
        rebate2.push(item.MNP리베이트);
        rebate3.push(item.신규원가리베이트);
        rebate4.push(item.MNP원가리베이트);
      }

      // const docRef = await addDoc(collection(db, "callingPlanName"), {
      await axios.post("http://localhost:8800/callingPlan", {      
        planName: item.요금제,
        openComName: item.개통처,
        rebate1: rebate1.join(),
        rebate2: rebate2.join(),
        rebate3: rebate3.join(),
        rebate4: rebate4.join(),
    });    
  });
    setMsg('요금제 정보가 업로드되었습니다.')
    hdcCompUploadDialogOpen();
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  getDataRefresh4();
}




// useEffect 1 Start ========================================================
useEffect(()=>{

  const getUserInformation = () => {    

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const res = await axios.get(`http://localhost:8800/comUsers/${user.uid}`)
      setUserName(res.data[0].name);
      setUserCompanyName(res.data[0].company);
      setUserGrade(res.data[0].userGrade);

      if(res.data[0].userGrade !== 'A') {
        navigate('/openPhoneList');
      }

    } else {
      navigate('/');
    }
  });    
  }    
  getUserInformation();

}, []);


// useEffect 2 Start ========================================================
useEffect(()=>{    

  // 판매점 리스트 읽어오기 --------------------------------------------------
  const getSellComName = async () => {
    const res = await axios.get("http://localhost:8800/sellComs")
    setSellComList(res.data);
  }
  getSellComName();


  // 통신사 리스트 읽어오기 --------------------------------------------------
  const getTelComName = async () => {
    const res = await axios.get("http://localhost:8800/telComs")
    setTelComList(res.data);
  }
  getTelComName();


  // 개통처 리스트 읽어오기 --------------------------------------------------
  const getOpenComName = async () => {
    const res = await axios.get("http://localhost:8800/openComs")
    setOpenComList(res.data);
  }
  getOpenComName();


  // 요금제 리스트 읽어오기 --------------------------------------------------
  const getCallingPlanName = async () => {

    const res = await axios.get(`http://localhost:8800/callingPlan`)
    let temp = res.data.map((doc)=>{
      return {...doc, rebate1: doc.rebate1.split(','), rebate2: doc.rebate2.split(','), rebate3: doc.rebate3.split(','), rebate4: doc.rebate4.split(',') }
    })
    // console.log(temp)
    setCallingPlanList(temp);
  }
  getCallingPlanName();


// 사용자 리스트 읽어오기 (firebase DB) --------------------------------------------------
//   const getUser = async () => {
//     let data = [];
//     const querySnapshot = await getDocs(query(collection(db, "comUsers"), orderBy("name", "asc"), where("isDeleted", "==", 0)));
//     querySnapshot.forEach((doc) => {
//       data.push({...doc.data(), id: doc.id,})
//       // data.push(doc.data().comName);
//     });
//     setUserList(data);
//   }
//   getUser();

// }, [isSellComOpen, isTelComOpen, isSellComOpen, isCallingPlanOpen, isUserOpen]);


  // 사용자 리스트 읽어오기 (mysql DB) --------------------------------------------------
  const getUser = async () => {
    const res = await axios.get(`http://localhost:8800/comUsers`)
    setUserList(res.data);
  }
  getUser();

}, [isSellComOpen, isTelComOpen, isSellComOpen, isCallingPlanOpen, isUserOpen]);



// ------------------------------------------------------------------------------------
// return 시작 ------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
return (
  <Container maxWidth='false'>
    <ResponsiveAppBar />

    <Typography sx={{ mt: 2, fontWeight: 400, display: 'flex', alignItems: 'center' }} variant="h5" >
      <NoteAltIcon fontSize="large"/> 관리자 페이지
    </Typography>

    <Box sx={{ mt: 1, fontWeight: 400, display: 'flex', alignItems: 'center' }} >
        <Paper sx={{ mt: 1, width: 300, height: 550, display: 'flex', justifyContent: 'center', alignItems: 'center' }} elevation={5} >
          <Stack spacing={3} >
            {isSellComOpen && <Button sx={{ width: 250}} variant="outlined" size="large" onClick={hdcSellComOpen} >판매처 관리</Button>}            
            {!isSellComOpen && <Button sx={{ width: 250}} variant="contained" size="large" onClick={hdcSellComOpen} >판매처 관리</Button>}
            {isTelComOpen && <Button variant="outlined" size="large" onClick={hdcTelComOpen}>통신사 관리</Button>}
            {!isTelComOpen && <Button variant="contained" size="large" onClick={hdcTelComOpen}>통신사 관리</Button>}
            {isOpenComOpen && <Button variant="outlined" size="large" onClick={hdcOpenComOpen}>개통처 관리</Button>}
            {!isOpenComOpen && <Button variant="contained" size="large" onClick={hdcOpenComOpen}>개통처 관리</Button>}
            {isCallingPlanOpen && <Button variant="outlined" size="large" onClick={hdcCallingPlanOpen}>요금제 관리</Button>}
            {!isCallingPlanOpen && <Button variant="contained" size="large" onClick={hdcCallingPlanOpen}>요금제 관리</Button>}
            {isUserOpen && <Button variant="outlined" size="large" onClick={hdcUserOpen}>사용자 관리</Button>}           
            {!isUserOpen && <Button variant="contained" size="large" onClick={hdcUserOpen}>사용자 관리</Button>}           
          </Stack>
        </Paper>

        <Paper sx={{ mt: 1, ml: 2, pl: 5, pr: 5, width: 1100, height: 550 }} elevation={5} >
          
          {/* 판매처 테이블 보이기 -------------------------------------------*/}
          { isSellComOpen && 
          <>
          <Typography sx={{ mt: 2, ml: 0, mb: 2, fontWeight: 400, display: 'flex', justifyContent: 'space-between', alignItems:'center' }} variant="h6" >
            <div><StoreIcon fontSize="small"/> 판매처 정보 확인 및 수정</div>
              <div>
              <Button  size='small' component="label" variant="contained" onChange={ExcelToJson} startIcon={<CloudUploadIcon />}>
                Select Excel file
              <VisuallyHiddenInput type="file" 
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"  />
              </Button>
              <Button sx={{mt: 0, ml: 1}} size='small' variant="outlined" onClick={SellComUpload}>UPLOAD</Button>
              </div>
          </Typography>

          <Table stickyHeader size='small' aria-label="sticky table">        
            <TableHead>
              <TableRow>
                <StyledTableCell style={{fontWeight: 400}} align='center' >No.</StyledTableCell>
                <StyledTableCell style={{fontWeight: 400}} align='center' >판매처</StyledTableCell>
                <StyledTableCell style={{fontWeight: 400}} align='center' >사업자번호</StyledTableCell>
                <StyledTableCell style={{fontWeight: 400}} align='center' >은행</StyledTableCell>
                <StyledTableCell style={{fontWeight: 400}} align='center' >계좌번호</StyledTableCell>
                <StyledTableCell style={{fontWeight: 400}} align='center' >담당자</StyledTableCell>
                <StyledTableCell style={{fontWeight: 600, color: "yellow"}} align='center' >ACTION</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sellComList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)              
                .map((item, index) => {
                    return (<AddOneRow 
                      key = {item.id}
                      id = {item.id} 
                      no = {index + 1 + (page * rowsPerPage)}
                      cell1 = {item.comName}
                      cell2 = {item.comNo}
                      cell3 = {item.bank}
                      cell4 = {item.acount}
                      cell5 = {item.comPerson}
                      getDataRefresh={getDataRefresh}
                      editCase = {editCase}
                      />
                    );    // return ----------
                })
              }
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10]}
                  count={sellComList.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
          </>          
          }


          {/* 통신사 테이블 보이기 -------------------------------------------*/}
          { isTelComOpen && 
          <>
          <Typography sx={{ mt: 2, ml: 0, mb: 2, fontWeight: 400, display: 'flex', justifyContent: 'space-between', alignItems:'center' }} variant="h6" >
            <div><StoreIcon fontSize="small"/> 통신사 정보 확인 및 수정</div>
              <div>
              <Button sx={{ml: 69}} size='small' component="label" variant="contained" onChange={ExcelToJson} startIcon={<CloudUploadIcon />}>
                Select Excel file
              <VisuallyHiddenInput type="file" 
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"  />
              </Button>
              <Button sx={{mt: 0, ml: 1}} size='small' variant="outlined" onClick={TelComUpload}>UPLOAD</Button>
              </div>
          </Typography>

          <Table stickyHeader size='small' aria-label="sticky table">        
            <TableHead>
              <TableRow>
                <StyledTableCell style={{fontWeight: 400}} align='center' >No.</StyledTableCell>
                <StyledTableCell style={{fontWeight: 400}} align='center' >통신사</StyledTableCell>
                <StyledTableCell style={{fontWeight: 400}} align='center' >담당자</StyledTableCell>
                <StyledTableCell style={{fontWeight: 600, color: "yellow"}} align='center' >ACTION</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {telComList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)              
                .map((item, index) => {
                    return (<AddOneRow 
                      key = {item.id}
                      id = {item.id} 
                      no = {index + 1 + (page * rowsPerPage)}
                      cell1 = {item.comName}
                      cell2 = {item.comPerson}
                      getDataRefresh={getDataRefresh2}
                      editCase={editCase}
                      />
                    );    // return ----------
                })
              }
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10]}
                  count={telComList.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
          </>          
          }


          {/* 개통처 테이블 보이기 -------------------------------------------*/}
          { isOpenComOpen && 
          <>
          <Typography sx={{ mt: 2, ml: 0, mb: 2, fontWeight: 400, display: 'flex', justifyContent: 'space-between', alignItems:'center' }} variant="h6" >
            <div><StoreIcon fontSize="small"/> 개통처 정보 확인 및 수정</div>
            <div>
            <Button sx={{ml: 69}} size='small' component="label" variant="contained" onChange={ExcelToJson} startIcon={<CloudUploadIcon />}>
              Select Excel file
            <VisuallyHiddenInput type="file" 
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"  />
            </Button>
            <Button sx={{mt: 0, ml: 1}} size='small' variant="outlined" onClick={OpenComUpload}>UPLOAD</Button>
            </div>
          </Typography>

          <Table stickyHeader size='small' aria-label="sticky table">        
            <TableHead>
              <TableRow>
                <StyledTableCell style={{fontWeight: 400}} align='center' >No.</StyledTableCell>
                <StyledTableCell style={{fontWeight: 400}} align='center' >개통처</StyledTableCell>
                <StyledTableCell style={{fontWeight: 400}} align='center' >담당자</StyledTableCell>
                <StyledTableCell style={{fontWeight: 400}} align='center' >통신사</StyledTableCell>
                <StyledTableCell style={{fontWeight: 600, color: "yellow"}} align='center' >ACTION</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {openComList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)              
                .map((item, index) => {
                    return (<AddOneRow 
                      key = {item.id}
                      id = {item.id} 
                      no = {index + 1 + (page * rowsPerPage)}
                      cell1 = {item.comName}
                      cell2 = {item.comPerson}
                      cell3 = {item.telComName}
                      getDataRefresh={getDataRefresh3}
                      editCase={editCase}
                      />
                    );    // return ----------
                })
              }
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10]}
                  count={openComList.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
          </>          
          }


          {/* 요금제 테이블 보이기 -------------------------------------------*/}
          { isCallingPlanOpen && 
          <>
          <Typography sx={{ mt: 2, ml: 0, mb: 2, fontWeight: 400, display: 'flex', justifyContent: 'space-between', alignItems:'center' }} variant="h6" >
            <div><WifiCalling3Icon fontSize="small"/> 요금제 정보 확인 및 수정</div>
            <div>
            <Button sx={{ml: 69}} size='small' component="label" variant="contained" onChange={ExcelToJson} startIcon={<CloudUploadIcon />}>
                Select Excel file
            <VisuallyHiddenInput type="file" 
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"  />
            </Button>
            <Button sx={{mt: 0, ml: 1}} size='small' variant="outlined" onClick={CallingPlanUpload}>UPLOAD</Button>
            </div>
          </Typography>

          <Table stickyHeader size='small' aria-label="sticky table">        
            <TableHead>
              <TableRow>
                <StyledTableCell style={{fontWeight: 400}} align='center' >No.</StyledTableCell>
                <StyledTableCell style={{fontWeight: 400}} align='center' >요금제</StyledTableCell>
                <StyledTableCell style={{fontWeight: 400}} align='center' >개통처</StyledTableCell>
                <StyledTableCell style={{fontWeight: 600, color: "yellow"}} align='center' >ACTION</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {callingPlanList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)              
                .map((item, index) => {
                    return (<AddOneRow 
                      key = {item.id}
                      id = {item.id} 
                      no = {index + 1 + (page * rowsPerPage)}
                      cell1 = {item.planName}
                      cell2 = {item.openComName}
                      getDataRefresh={getDataRefresh4}
                      editCase={editCase}
                      />
                    );    // return ----------
                })
              }
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10]}
                  count={callingPlanList.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
          </>          
          }


          {/* 사용자 테이블 보이기 -------------------------------------------*/}
          { isUserOpen && 
          <>
          <Typography sx={{ mt: 2, ml: 0, mb: 2, fontWeight: 400, display: 'flex', justifyContent: 'space-between', alignItems:'center' }} variant="h6" >
            <div><ManageAccountsIcon fontSize="small"/> 사용자 정보 확인 및 수정</div>
          </Typography>

          <Table stickyHeader size='small' aria-label="sticky table">        
            <TableHead>
              <TableRow>
                <StyledTableCell style={{fontWeight: 400}} align='center' >No.</StyledTableCell>
                <StyledTableCell style={{fontWeight: 400}} align='center' >사용자</StyledTableCell>
                <StyledTableCell style={{fontWeight: 400}} align='center' >판매처</StyledTableCell>
                <StyledTableCell style={{fontWeight: 400}} align='center' >이메일</StyledTableCell>
                <StyledTableCell style={{fontWeight: 400}} align='center' >권한등급</StyledTableCell>
                <StyledTableCell style={{fontWeight: 400}} align='center' >비고</StyledTableCell>
                <StyledTableCell style={{fontWeight: 600, color: "yellow"}} align='center' >ACTION</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {userList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)              
                .map((item, index) => {
                    return (<AddOneRow 
                      key = {item.id}
                      id = {item.fbid} 
                      no = {index + 1 + (page * rowsPerPage)}
                      cell1 = {item.name}
                      cell2 = {item.company}
                      cell3 = {item.email}
                      cell4 = {item.userGrade}
                      cell5 = {item.note}
                      getDataRefresh={getDataRefresh5}
                      editCase={editCase}
                      />
                    );    // return ----------
                })
              }
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10]}
                  count={userList.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
          </>          
          }

        </Paper>
    </Box>


    <Dialog
    open={isCompUploadDialogOpen}
    onClose={hdcCompUploadDialogClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    >
      <DialogTitle sx={{color: pink[500], fontWeight: '400', display: 'flex', alignItems: 'center'}}>
        <ReportIcon sx={{mr: 1}}/>{" Excel File Upload "}
      </DialogTitle>
      <Divider />
      <DialogContent>      
        <Typography>
          {msg}
        </Typography>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={hdcCompUploadDialogClose}>OK</Button>
      </DialogActions>
    </Dialog>
    
  </Container>
);

// Component End =========================================================
}

export default AdminPage