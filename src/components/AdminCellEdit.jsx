import React, { useEffect, useState } from 'react'
import EditCalendarTwoToneIcon from '@mui/icons-material/EditCalendarTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import PersonOffTwoToneIcon from '@mui/icons-material/PersonOffTwoTone';
import { pink } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import ReportIcon from '@mui/icons-material/Report';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Slide from '@mui/material/Slide';
import { Dialog, DialogContent, DialogTitle, DialogActions, TextField, Table, TableHead, TableBody, TableCell, TableRow, Input, tableCellClasses } from "@mui/material";



// firebase import=======================================================
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../firebase';
import { getFirestore, getDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";


// Initialize Firebase ==================================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Modal Transition --------------------------------------------------
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



//  ======================================================================================
// Function 시작 =========================================================================
// =======================================================================================

function AdminCellEdit(props) {

// Initialize Variable ==================================================
const { id, getDataRefresh, editCase } = props

const [isEditOpen, setIsEditOpen] = useState(false);
const [isDeleteOpen, setIsDeleteOpen] = useState(false);
const [isCallingPlanEditOpen, setIsCallingPlanEditOpen] = useState(false);
const [isDisableOpen, setIsDisableOpen] = useState(false);
const [isCompUpdateDialogOpen, setIsCompUpdateDialogOpen] = useState(false);
const [isCompDeleteDialogOpen, setIsCompDeleteDialogOpen] = useState(false);
const [isCompDisableDialogOpen, setIsCompDisableDialogOpen] = useState(false);
const [adminEditCase, setAdminEditCase] = useState([{}]);
const [adminEditCaseCP, setAdminEditCaseCP] = useState([{}]);
const [rebate1, setRebate1] = useState([]);
const [rebate2, setRebate2] = useState([]);
const [rebate3, setRebate3] = useState([]);
const [rebate4, setRebate4] = useState([]);



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


// Table style ----------------------------------------------------
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // '&:last-child td, &:last-child th': {
  //   border: 0,
  // },
}));


// Define subFunction ==================================================
// Edit 대상 판매처 정보 읽어오기 ------------------------------------------------
const getAdminEditCase1 = async () => {
  const querySnapshot = await getDoc(doc(db, "sellComName", id));
  setAdminEditCase(querySnapshot.data());
}

// Edit 대상 통신사 정보 읽어오기 ------------------------------------------------
const getAdminEditCase2 = async () => {
  const querySnapshot = await getDoc(doc(db, "telComName", id));
  setAdminEditCase(querySnapshot.data());
}

// Edit 대상 개통처 정보 읽어오기 ------------------------------------------------
const getAdminEditCase3 = async () => {
  const querySnapshot = await getDoc(doc(db, "openComName", id));
  setAdminEditCase(querySnapshot.data());
}

// Edit 대상 요금제 정보 읽어오기 ------------------------------------------------
const getAdminEditCase4 = async () => {
  const querySnapshot = await getDoc(doc(db, "callingPlanName", id));
  setRebate1(querySnapshot.data().rebate1);
  setRebate2(querySnapshot.data().rebate2);
  setRebate3(querySnapshot.data().rebate3);
  setRebate4(querySnapshot.data().rebate4);
  setAdminEditCaseCP(querySnapshot.data());
}

// Edit 대상 User 정보 읽어오기 ------------------------------------------------
const getAdminEditCase5 = async () => {
  const querySnapshot = await getDoc(doc(db, "comUsers", id));
  setAdminEditCase(querySnapshot.data());
}

// --------------------------------------------------------------------
const hdcEditOpen = () => {
  if (editCase !== 4) {
    setIsEditOpen(true);
  }

  if (editCase === 4) {
    setIsCallingPlanEditOpen(true);
  }
};

// --------------------------------------------------------------------
const hdcEditClose = () => {
  if (editCase === 1) {
    getAdminEditCase1();
  } 

  if (editCase === 2) {
    getAdminEditCase2();
  }

  if (editCase === 3) {
    getAdminEditCase3();
  }

  if (editCase === 5) {
    getAdminEditCase5();
  }

  setIsEditOpen(false);

};


// --------------------------------------------------------------------
const hdcEditCloseCP = () => {

  getAdminEditCase4();
  setIsCallingPlanEditOpen(false);
};



// --------------------------------------------------------------------
const CompletedUpdateDialogOpen = () => {
  setIsCompUpdateDialogOpen(true);
};

// --------------------------------------------------------------------
const handleClickCompUpdateDialogClose = () => {
  setIsCompUpdateDialogOpen(false);
  getDataRefresh();
};


const CompletedDeletDialogOpen = () => {
  setIsCompDeleteDialogOpen(true);
}

const handleClickCompDeleteDialogClose = () => {
  setIsCompDeleteDialogOpen(false);
  getDataRefresh();
}

const CompletedDisableDialogOpen = () => {
  setIsCompDisableDialogOpen(true);
}

const handleClickCompDisableDialogClose = () => {
  setIsCompDisableDialogOpen(false);
  getDataRefresh();
}



// --------------------------------------------------------------------
const handleUpdate = async (e) => {
  e.preventDefault();

  try {
    if (editCase === 1) {
    const docRef = await updateDoc(doc(db, "sellComName", id), {
      comName: adminEditCase.comName,
      comNo: adminEditCase.comNo,    
    });}

    if (editCase === 2) {
      const docRef = await updateDoc(doc(db, "telComName", id), {
        comName: adminEditCase.comName,
        comPerson: adminEditCase.comPerson,
      });}

    if (editCase === 3) {
      const docRef = await updateDoc(doc(db, "openComName", id), {
        comName: adminEditCase.comName,
        comPerson: adminEditCase.comPerson,
        telComName: adminEditCase.telComName,
      });}

    if (editCase === 4) {
      const docRef = await updateDoc(doc(db, "callingPlanName", id), {
        planName: adminEditCaseCP.planName,
        openComName: adminEditCaseCP.openComName,
        rebate1: rebate1,
        rebate2: rebate2,
        rebate3: rebate3,
        rebate4: rebate4,
      });}

    if (editCase === 5) {
      const docRef = await updateDoc(doc(db, "comUsers", id), {
        name: adminEditCase.name,
        company: adminEditCase.company,
        userGrade: adminEditCase.userGrade,
      });}

  CompletedUpdateDialogOpen();
  hdcEditClose()
  
  } catch (e) {
    console.error("Error adding document: ", e);
  }

  hdcEditClose();
}

// --------------------------------------------------------------------
const handleValueChange = (e) => {
  const keyValue = e.target.id;
  const editCopy = {...adminEditCase, [keyValue]: e.target.value };
  setAdminEditCase(editCopy);
};

// --------------------------------------------------------------------
const handleValueChangeCP = (e) => {
  const keyValue = e.target.id;
  const editCopy = {...adminEditCaseCP, [keyValue]: e.target.value };
  setAdminEditCaseCP(editCopy);
};

// --------------------------------------------------------------------
const handleValueChangeCP1 = (e) => {
  const editCopy = [...rebate1];
  editCopy[e.target.name] = Number(e.target.value);
  console.log(editCopy);
  setRebate1(editCopy);
};

// --------------------------------------------------------------------
const handleValueChangeCP2 = (e) => {
  const editCopy = [...rebate2];
  editCopy[e.target.name] = Number(e.target.value);
  console.log(editCopy);
  setRebate2(editCopy);
};

// --------------------------------------------------------------------
const handleValueChangeCP3 = (e) => {
  const editCopy = [...rebate3];
  editCopy[e.target.name] = Number(e.target.value);
  console.log(editCopy);
  setRebate3(editCopy);
};

// --------------------------------------------------------------------
const handleValueChangeCP4 = (e) => {
  const editCopy = [...rebate4];
  editCopy[e.target.name] = Number(e.target.value);
  console.log(editCopy);
  setRebate4(editCopy);
};

// --------------------------------------------------------------------
const hdcDeleteOpen = () => {
  setIsDeleteOpen(true);
};

// --------------------------------------------------------------------
const hdcDeleteClose = () => {
  setIsDeleteOpen(false);
};



// Delete Function =======================================================
const handleDelete = async (e) => {
  e.preventDefault();

  try {
    if (editCase === 1) {
      const docRef = await deleteDoc(doc(db, "sellComName", id));
    }
    if (editCase === 2) {
      const docRef = await deleteDoc(doc(db, "telComName", id));
    }
    if (editCase === 3) {
      const docRef = await deleteDoc(doc(db, "openComName", id));
    }
    if (editCase === 4) {
      const docRef = await deleteDoc(doc(db, "callingPlanName", id));
    }

    CompletedDeletDialogOpen();
    hdcDeleteClose();

  } catch (e) {
    console.error("Error adding document: ", e);
  }
  
  hdcDeleteClose();
};


// --------------------------------------------------------------------
const hdcDisableOpen = () => {
  setIsDisableOpen(true);
};

// --------------------------------------------------------------------
const hdcDisableClose = () => {
  setIsDisableOpen(false);
};


// User Disable Function =======================================================
const handleDisable = async (e) => {
  e.preventDefault();

  try {
    const docRef = await updateDoc(doc(db, "comUsers", id), {
      userGrade: 'D',
    })

    CompletedDisableDialogOpen();
    hdcDisableClose();

  } catch (e) {
    console.error("Error adding document: ", e);
  }
  
  hdcDisableClose();
};



// useEffect 1 Start ========================================================
useEffect(()=>{

  if (editCase === 1) {
    getAdminEditCase1();
  } 

  if (editCase === 2) {
    getAdminEditCase2();
  }

  if (editCase === 3) {
    getAdminEditCase3();
  }

  if (editCase === 4) {
    getAdminEditCase4();
  }

  if (editCase === 5) {
    getAdminEditCase5();
  }
  
}, []);



return (
  <>
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <EditCalendarTwoToneIcon cursor='pointer' variant='contained' color='primary' sx={{ fontSize: 24 }} onClick={hdcEditOpen}/>
      {(editCase !== 5) && <DeleteTwoToneIcon cursor='pointer' variant='contained' sx={{ color: pink[500], fontSize: 25 }} onClick={hdcDeleteOpen}/> }
      {(editCase === 5) && <PersonOffTwoToneIcon cursor='pointer' variant='contained' sx={{ color: pink[500], fontSize: 25 }} onClick={hdcDisableOpen}/> }
    </div>

    <Dialog open={isEditOpen} onClose={hdcEditClose}>
      {(editCase === 1) && <DialogTitle sx={{color: pink[500], fontWeight: '400', display: 'flex', alignItems: 'center'}}>
        <ReportIcon sx={{mr: 1}}/>판매처 정보 수정</DialogTitle>}
      {(editCase === 2) && <DialogTitle sx={{color: pink[500], fontWeight: '400', display: 'flex', alignItems: 'center'}}>
        <ReportIcon sx={{mr: 1}}/>통신사 정보 수정</DialogTitle>}
      {(editCase === 3) && <DialogTitle sx={{color: pink[500], fontWeight: '400', display: 'flex', alignItems: 'center'}}>
        <ReportIcon sx={{mr: 1}}/>개통처 정보 수정</DialogTitle>}
      {(editCase === 5) && <DialogTitle sx={{color: pink[500], fontWeight: '400', display: 'flex', alignItems: 'center'}}>
        <ReportIcon sx={{mr: 1}}/>사용자 정보 수정 (A-관리자, B-개통 직원, C-판매처 직원)</DialogTitle>}
      <Divider />       
      <DialogContent>
        {(editCase === 1) && <TextField value={adminEditCase.comName} id="comName" label="판매처" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
        {(editCase === 1) && <TextField value={adminEditCase.comNo} id="comNo" label="사업자번호" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
        {(editCase === 2) && <TextField value={adminEditCase.comName} id="comName" label="통신사" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
        {(editCase === 2) && <TextField value={adminEditCase.comPerson} id="comPerson" label="담당자" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
        {(editCase === 3) && <TextField value={adminEditCase.comName} id="comName" label="개통처" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
        {(editCase === 3) && <TextField value={adminEditCase.comPerson} id="comPerson" label="담당자" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
        {(editCase === 3) && <TextField value={adminEditCase.telComName} id="telComName" label="통신사" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
        {(editCase === 5) && <TextField value={adminEditCase.name} id="name" label="사용자" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
        {(editCase === 5) && <TextField value={adminEditCase.company} id="company" label="판매처" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
        {(editCase === 5) && <TextField value={adminEditCase.userGrade} id="userGrade" label="권한등급" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
      </DialogContent>
      <DialogActions>
        <Button onClick={hdcEditClose}>Cancel</Button>
        <Button onClick={handleUpdate}>Update</Button>          
      </DialogActions>
    </Dialog>


    <Dialog
    open={isCompUpdateDialogOpen}
    onClose={handleClickCompUpdateDialogClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    >
      <DialogTitle sx={{color: pink[500], fontWeight: '400', display: 'flex', alignItems: 'center'}}>
        <ReportIcon sx={{mr: 1}}/>{" 정보 수정 "}
      </DialogTitle>
      <Divider />
      <DialogContent>      
        <Typography>
          해당 정보가 정상적으로 수정되었습니다.
        </Typography>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={handleClickCompUpdateDialogClose}>OK</Button>
      </DialogActions>
    </Dialog>


    <Dialog
      open={isDeleteOpen}
      onClose={hdcDeleteClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle sx={{color: pink[500], fontWeight: '400', display: 'flex', alignItems: 'center'}}>
        <ReportIcon sx={{mr: 1}}/>{" 해당 정보를 삭제하시겠습니까 ?"}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Typography>
          선택한 정보가 완전하게 삭제됩니다.
        </Typography>
        <Typography sx={{mt: 0.5}}>
          삭제 후에는 되돌릴 수 없습니다. 그래도 삭제하시겠습니까 ? 
        </Typography>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={hdcDeleteClose}>CANCLE</Button>
        <Button onClick={handleDelete} autoFocus>DELETE</Button>
      </DialogActions>
    </Dialog>


    <Dialog
    open={isCompDeleteDialogOpen}
    onClose={handleClickCompDeleteDialogClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    >
      <DialogTitle sx={{color: pink[500], fontWeight: '400', display: 'flex', alignItems: 'center'}}>
        <ReportIcon sx={{mr: 1}}/>{" 정보 삭제 "}
      </DialogTitle>
      <Divider />
      <DialogContent>      
        <Typography>
          해당정보가 정상적으로 삭제되었습니다.
        </Typography>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={handleClickCompDeleteDialogClose}>OK</Button>
      </DialogActions>
    </Dialog>



    <Dialog
      open={isDisableOpen}
      onClose={hdcDisableClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle sx={{color: pink[500], fontWeight: '400', display: 'flex', alignItems: 'center'}}>
        <ReportIcon sx={{mr: 1}}/>{" 해당 사용자를 비활성화하시겠습니까 ?"}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Typography>
        선택하신 사용자의 권한등급을 D등급으로 수정하여,
        </Typography>
        <Typography sx={{mt: 0.5}}>
        로그인할 수 없도록 비활성화 합니다. 
        </Typography>
        <Typography sx={{mt: 0.5}}>
        사용자를 비활성화 하시겠습니까 ? 
        </Typography>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={hdcDisableClose}>CANCLE</Button>
        <Button onClick={handleDisable} autoFocus>DISABLE</Button>
      </DialogActions>
    </Dialog>

    <Dialog
    open={isCompDisableDialogOpen}
    onClose={handleClickCompDisableDialogClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    >
      <DialogTitle sx={{color: pink[500], fontWeight: '400', display: 'flex', alignItems: 'center'}}>
        <ReportIcon sx={{mr: 1}}/>{" 사용자 비활성화 "}
      </DialogTitle>
      <Divider />
      <DialogContent>      
        <Typography>
          해당 사용자가 정상적으로 비활성화 되었습니다.
        </Typography>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={handleClickCompDisableDialogClose}>OK</Button>
      </DialogActions>
    </Dialog>




    {/* 요금제 수정 Dialog 열기 */}
    <Dialog
      fullScreen
      open={isCallingPlanEditOpen}
      onClose={hdcEditCloseCP}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={hdcEditCloseCP} aria-label="close">
            <CloseIcon onClick={hdcEditCloseCP} />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            요금제 리베이트 수정
          </Typography>
          <Button autoFocus color="inherit" onClick={handleUpdate}>
            Update
          </Button>
        </Toolbar>
      </AppBar>

      <DialogTitle sx={{color: pink[500], fontWeight: '600', display: 'flex', alignItems: 'center'}}>
        {/* <ReportIcon sx={{mr: 1}}/>{adminEditCaseCP.planName} - {adminEditCaseCP.openComName} */}
        <ReportIcon sx={{mr: 1}}/> 요금제 - 
        <Input id={'planName'} value={adminEditCaseCP.planName} onChange={handleValueChangeCP} type="text" disableUnderline={true} sx={{ pl: 1, width: 300, fontSize: 18, fontWeight: 600 }} variant="standard"/>
        개통처 - <Input id={'openComName'} value={adminEditCaseCP.openComName} onChange={handleValueChangeCP} type="text" disableUnderline={true} sx={{ pl: 1, width: 300, fontSize: 18, fontWeight: 600 }} variant="standard"/>
      </DialogTitle>

      <DialogContent>      
      <Paper sx={{ ml: 2, pl: 5, pr: 5, width: 1360, height: 1100 }} elevation={5} >        
      <Typography sx={{ mt: 2, ml: 1, mb: 2, fontWeight: 400, display: 'flex', alignItems: 'center' }} variant="h6" />
        <Table stickyHeader size='small' aria-label="sticky table">
          <TableHead>
            <TableRow>
              <StyledTableCell style={{fontWeight: 600}} align='center' >No.</StyledTableCell>
              <StyledTableCell style={{fontWeight: 600}} align='center' >신규-리베이트</StyledTableCell>
              <StyledTableCell style={{fontWeight: 600}} align='center' >MNP-리베이트</StyledTableCell>
              <StyledTableCell style={{fontWeight: 600}} align='center' >신규-원가리베이트</StyledTableCell>
              <StyledTableCell style={{fontWeight: 600}} align='center' >MNP-원가리베이트</StyledTableCell>
              <StyledTableCell style={{fontWeight: 600}} align='center' >신규-손익</StyledTableCell>
              <StyledTableCell style={{fontWeight: 600}} align='center' >MNP-손익</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rebate1.map((r, index) => {
              return (
              <StyledTableRow key = {index} sx={{padding:0}}>
                <TableCell align='center' size="small" padding="none">{index + 1}</TableCell>
                <TableCell align='center' size="small" padding="none"><Input name={(index)} value={rebate1[index]} onChange={handleValueChangeCP1} type="text" disableUnderline={true} sx={{ pl: 10, width: 200 }} variant="standard" /></TableCell>
                <TableCell align='center' size="small" padding="none"><Input name={(index)} value={rebate2[index]} onChange={handleValueChangeCP2} type="text" disableUnderline={true} sx={{ pl: 10, width: 200 }} variant="standard" /></TableCell>
                <TableCell align='center' size="small" padding="none"><Input name={(index)} value={rebate3[index]} onChange={handleValueChangeCP3} type="text" disableUnderline={true} sx={{ pl: 10, width: 200 }} variant="standard"/></TableCell>
                <TableCell align='center' size="small" padding="none"><Input name={(index)} value={rebate4[index]} onChange={handleValueChangeCP4} type="text" disableUnderline={true} sx={{ pl: 10, width: 200 }} variant="standard"/></TableCell>
                <TableCell align='center' size="small" padding="none"><Input value={rebate3[index] - rebate1[index]} type="text" disableUnderline={true} sx={{ pl: 10, width: 200 }} /></TableCell>
                <TableCell align='center' size="small" padding="none"><Input value={rebate4[index] - rebate2[index]} type="text" disableUnderline={true} sx={{ pl: 10, width: 200 }} /></TableCell>
              </StyledTableRow>
              )
            })}       
        </TableBody>
        </Table>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={hdcEditCloseCP}>CANCLE</Button>
        <Button onClick={handleUpdate}>UPDATE</Button>
      </DialogActions>
  </Dialog>
  </>
)

// Component End =========================================================
}

export default AdminCellEdit