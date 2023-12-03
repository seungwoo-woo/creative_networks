import React, { useEffect, useState } from 'react';
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import { UserCompanyContext } from '../context/UserCompanyContext';
import { UserNameContext } from '../context/UserNameContext';
import { UserGradeContext } from '../context/UserGradeContext';
import Container from '@mui/material/Container';
import * as XLSX  from 'xlsx';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, IconButton, Paper, TableContainer, Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow, tableCellClasses, Dialog, DialogTitle, Divider, DialogContent, DialogActions } from '@mui/material';
import { pink } from '@mui/material/colors';
import ReportIcon from '@mui/icons-material/Report';





// firebase import=======================================================
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { firebaseConfig } from '../firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import CalcPhone from '../components/CalcPhone';


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

  const [jsonData, setJsonData] = useState();
  const [msg, setMsg] = useState('');
  const [isCompUploadDialogOpen, setIsCompUploadDialogOpen] = useState(false)



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
  const TempFunction = () => {
    let startDate = new Date(1900, 0, 0)
    jsonData.map(async (item) => {    
      for(let i=1; i<10;i++) {
        if(i===5){
          console.log(new Date(startDate.getTime() + (Number(item[`__EMPTY_${i}`])-1) * 24 * 60 * 60 * 1000))
        } else {
        console.log(item[`__EMPTY_${i}`])
        }
      }
    })
  }


  // ----------------------------------------------------------------------
  const hdcCompUploadDialogOpen = () => {
    setIsCompUploadDialogOpen(true);
  }

  // ----------------------------------------------------------------------
  const hdcCompUploadDialogClose = () => {
    setIsCompUploadDialogOpen(false);
  };


  // 정산자료 엑셀 업로드 ----------------------------------------------------------
  const CalcDBUpload = () => {
    let startDate = new Date(1900, 0, 0)
    try {
      jsonData.map(async (item, index) => {
        if (index !== 0 && index !== 1 && index !== 2) {
          const docRef = await addDoc(collection(db, "calcDB"), {
            no: item[`__EMPTY_${1}`],
            telCom: item[`__EMPTY_${2}`],
            openCom: item[`__EMPTY_${3}`],
            type: item[`__EMPTY_${4}`],
            openDate: new Date(startDate.getTime() + (Number(item[`__EMPTY_${5}`])-1) * 24 * 60 * 60 * 1000),
            openType: item[`__EMPTY_${6}`],
            phoneModel: item[`__EMPTY_${7}`],
            phoneSerial: item[`__EMPTY_${8}`],
            phoneColor: item[`__EMPTY_${9}`],
            customerName: (item[`__EMPTY_${10}`] || ""),
            phoneNo: (item[`__EMPTY_${11}`] || ""),
            birthday: (item[`__EMPTY_${12}`] || ""),
            callingPlan: (item[`__EMPTY_${13}`] || ""),
            controlNo: (item[`__EMPTY_${14}`] || ""),
            memo: (item[`__EMPTY_${15}`] || ""),
            sellCom: (item[`__EMPTY_${16}`] || ""),
            rebate: (item[`__EMPTY_${17}`] || ""),
            myRebate: (item[`__EMPTY_${18}`] || ""),
            netRebate: (item[`__EMPTY_${19}`] || ""),
            isDeleted: 0 
          })
        } // if 앞에 3개 지나가기 ---------------
      })
      setMsg('이번달 정산자료가 업로드되었습니다.')
      hdcCompUploadDialogOpen();      
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    // getDataRefresh3();
  }



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
      <Typography sx={{ mt: 2, ml: 0, mb: 2, fontWeight: 400, display: 'flex', justifyContent: 'space-between', alignItems:'center' }} variant="h6" >
        {/* <div><StoreIcon fontSize="small"/> 판매처 정보 확인 및 수정</div> */}
          <div>
          <Button  size='small' component="label" variant="contained" onChange={ExcelToJson} startIcon={<CloudUploadIcon />}>
            Select Excel file
          <VisuallyHiddenInput type="file" 
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"  />
          </Button>
          <Button sx={{mt: 0, ml: 1}} size='small' variant="outlined" onClick={CalcDBUpload}>UPLOAD</Button>
          </div>
      </Typography>
      </Container>


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
                <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>모델명</StyledTableCell>
                {/* <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>일련번호</StyledTableCell> */}
                {/* <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>색상</StyledTableCell> */}
                <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>고객명</StyledTableCell>
                <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>이동번호</StyledTableCell>
                {/* <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>생년월일</StyledTableCell> */}
                <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>음성요금제</StyledTableCell>
                {/* <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>메모</StyledTableCell> */}
                <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>판매처</StyledTableCell>
                <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>리베이트</StyledTableCell>
                <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>원가리베이트</StyledTableCell>
                <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>총수익</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>

            {/* {jsonData && jsonData.map((item, index) => { 
              if (index !== 0 && index !== 1 && index !== 2) {
              return (<CalcPhone 
                key = {index}
                no = {item[`__EMPTY_${1}`]}
                telCom = {item[`__EMPTY_${2}`]}
                openCom = {item[`__EMPTY_${3}`]}
                type = {item[`__EMPTY_${4}`]}
                openDate = {item[`__EMPTY_${5}`]}
                openType = {item[`__EMPTY_${6}`]}
                phoneModel = {item[`__EMPTY_${7}`]}
                phoneSerial = {item[`__EMPTY_${8}`]}
                phoneColor = {item[`__EMPTY_${9}`]}
                customerName = {item[`__EMPTY_${10}`]}
                phoneNo = {item[`__EMPTY_${11}`]}
                birthday = {item[`__EMPTY_${12}`]}
                callingPlan = {item[`__EMPTY_${13}`]}
                controlNo = {item[`__EMPTY_${14}`]}
                memo = {item[`__EMPTY_${15}`]}
                sellCom = {item[`__EMPTY_${16}`]}
                rebate = {item[`__EMPTY_${17}`]}
                myRebate = {item[`__EMPTY_${18}`]}
                netRebate = {item[`__EMPTY_${19}`]}
              />)}
            })
            } */}

             {/* openPhoneList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)              
              .map((op, index) => {
                  return (<OpenPhone 
                    key = {op.id}
                    id = {op.id} 
                    no = {index + 1 + (page * rowsPerPage)}
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
              }) */}
              
      </TableBody>



            </Table>
          </TableContainer> 
      </Paper>


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

}

export default OpenPhoneCaculation