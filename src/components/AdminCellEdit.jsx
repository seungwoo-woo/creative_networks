import React, { useEffect, useState } from 'react'
import EditCalendarTwoToneIcon from '@mui/icons-material/EditCalendarTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import PersonOffTwoToneIcon from '@mui/icons-material/PersonOffTwoTone';
import { pink } from '@mui/material/colors';
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
import Autocomplete from '@mui/material/Autocomplete';
import { Dialog, DialogContent, DialogTitle, DialogActions, TextField, Table, TableHead, TableBody, TableCell, TableRow, Input, Container } from "@mui/material";
import axios from 'axios'



// firebase import=======================================================
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../firebase';
import { getFirestore, getDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { collection, getDocs, addDoc, query, where, orderBy} from "firebase/firestore";



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

const [sellComNameList, setSellComNameList] = useState([]);
const [inputValue, setInputValue] = useState('');    // sellComName



// Define subFunction ==================================================
// Edit 대상 판매처 정보 읽어오기 ------------------------------------------------
const getAdminEditCase1 = async () => {
  const res = await axios.get(`http://localhost:8800/sellComs/${id}`)
  setAdminEditCase(res.data[0]);
}

// Edit 대상 통신사 정보 읽어오기 ------------------------------------------------
const getAdminEditCase2 = async () => {
  const res = await axios.get(`http://localhost:8800/telComs/${id}`)
  setAdminEditCase(res.data[0]);
}

// Edit 대상 개통처 정보 읽어오기 ------------------------------------------------
const getAdminEditCase3 = async () => {
  const res = await axios.get(`http://localhost:8800/openComs/${id}`)
  setAdminEditCase(res.data[0]);
}

// Edit 대상 요금제 정보 읽어오기 ------------------------------------------------
const getAdminEditCase4 = async () => {
  const res = await axios.get(`http://localhost:8800/callingPlan/${id}`)
  const temp = {...res.data[0], rebate1: res.data[0].rebate1.split(','), rebate2: res.data[0].rebate2.split(','), rebate3: res.data[0].rebate3.split(','), rebate4: res.data[0].rebate4.split(',') }
  // const querySnapshot = await getDoc(doc(db, "callingPlanName", id));
  // setRebate1(querySnapshot.data().rebate1);
  // setRebate2(querySnapshot.data().rebate2);
  // setRebate3(querySnapshot.data().rebate3);
  // setRebate4(querySnapshot.data().rebate4);
  console.log(temp.rebate1[0])
  setAdminEditCaseCP(temp);
}

// Edit 대상 User 정보 읽어오기 (firebase DB) ------------------------------------------------
// const getAdminEditCase5 = async () => {
//   const querySnapshot = await getDoc(doc(db, "comUsers", id));
//   setAdminEditCase(querySnapshot.data());
// }

// Edit 대상 User 정보 읽어오기 (mysql DB) ------------------------------------------------
const getAdminEditCase5 = async () => {
    const res = await axios.get(`http://localhost:8800/comUsers/${id}`)
    setAdminEditCase(res.data[0]);
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
      await axios.put(`http://localhost:8800/sellComs/${id}`,{
        comName: adminEditCase.comName,
        comNo: adminEditCase.comNo,    
        bank: adminEditCase.bank,    
        acount: adminEditCase.acount,    
        comPerson: adminEditCase.comPerson,    
    });}

    if (editCase === 2) {
      await axios.put(`http://localhost:8800/telComs/${id}`,{
        comName: adminEditCase.comName,
        comPerson: adminEditCase.comPerson
      })}

    if (editCase === 3) {
      await axios.put(`http://localhost:8800/openComs/${id}`,{
        comName: adminEditCase.comName,
        comPerson: adminEditCase.comPerson,
        telComName: adminEditCase.telComName,
      });}

    if (editCase === 4) {
      const temp = await axios.put(`http://localhost:8800/callingPlan/${id}`,{
        planName: adminEditCaseCP.planName,
        openComName: adminEditCaseCP.openComName,
        rebate1: adminEditCaseCP.rebate1.join(),
        rebate2: adminEditCaseCP.rebate2.join(),
        rebate3: adminEditCaseCP.rebate3.join(),
        rebate4: adminEditCaseCP.rebate4.join(),
      });
    console.log(temp)
    }

    // if (editCase === 5) {
    //   const docRef = await updateDoc(doc(db, "comUsers", id), {
    //     name: adminEditCase.name,
    //     company: adminEditCase.company,
    //     userGrade: adminEditCase.userGrade,
    //   });}    
    if (editCase === 5) {
      await axios.put(`http://localhost:8800/comUsers/${id}`,{ 
      name: adminEditCase.name,
      company: adminEditCase.company,
      userGrade: adminEditCase.userGrade,
      note: adminEditCase.note,
    })}

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
  const editCopy = adminEditCaseCP.rebate1
  editCopy[Number(e.target.name)] = Number(e.target.value);
    for (let i = Number(e.target.name) + 1; i < 31; i++){
      editCopy[i] = Number(e.target.value);
    }  
  setAdminEditCaseCP({...adminEditCaseCP, rebate1: editCopy });
  };

// --------------------------------------------------------------------
const handleValueChangeCP2 = (e) => {
  const editCopy = adminEditCaseCP.rebate2
  editCopy[Number(e.target.name)] = Number(e.target.value);
    for (let i = Number(e.target.name) + 1; i < 31; i++){
      editCopy[i] = Number(e.target.value);
    }
  setAdminEditCaseCP({...adminEditCaseCP, rebate2: editCopy });
};

// --------------------------------------------------------------------
const handleValueChangeCP3 = (e) => {
  const editCopy = adminEditCaseCP.rebate3
  editCopy[Number(e.target.name)] = Number(e.target.value);
    for (let i = Number(e.target.name) + 1; i < 31; i++){
      editCopy[i] = Number(e.target.value);
    }
  setAdminEditCaseCP({...adminEditCaseCP, rebate3: editCopy })
};

// --------------------------------------------------------------------
const handleValueChangeCP4 = (e) => {
  const editCopy = adminEditCaseCP.rebate4
  editCopy[Number(e.target.name)] = Number(e.target.value);
    for (let i = Number(e.target.name) + 1; i < 31; i++){
      editCopy[i] = Number(e.target.value);
    }
  setAdminEditCaseCP({...adminEditCaseCP, rebate4: editCopy })
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
      await axios.delete(`http://localhost:8800/sellComs/${id}`)
    }
    if (editCase === 2) {
      await axios.delete(`http://localhost:8800/telComs/${id}`)
    }
    if (editCase === 3) {
      await axios.delete(`http://localhost:8800/openComs/${id}`)
      // const docRef = await deleteDoc(doc(db, "openComName", id));
    }
    if (editCase === 4) {
      await axios.delete(`http://localhost:8800/callingPlan/${id}`)
      // const docRef = await deleteDoc(doc(db, "callingPlanName", id));
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
    await axios.put(`http://localhost:8800/comUsersDisable/${id}`,{ 
      userGrade: 'D'
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

    const getSellComName = async () => {
      let data = [];
      const res = await axios.get("http://localhost:8800/sellComs")
      res.data.forEach((doc)=>{
        data.push(doc.comName)
      })
      setSellComNameList(data);
    }
    getSellComName();

    // const getSellComName = async () => {
    //   const querySnapshot = await getDocs(query(collection(db, "sellComName"), orderBy("comName", "asc"), where("isDeleted", "==", 0)));
    //   querySnapshot.forEach((doc) => {
    //     data.push(doc.data().comName);
    //   });
    //   setSellComNameList(data);
    // }    
    // getSellComName();

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
        <ReportIcon sx={{mr: 1}}/>사용자 정보 수정 (A-관리자, B-개통실, C-판매처)</DialogTitle>}
      <Divider />       
      <DialogContent>
        {(editCase === 1) && <TextField value={adminEditCase.comName} id="comName" label="판매처" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
        {(editCase === 1) && <TextField value={adminEditCase.comNo} id="comNo" label="사업자번호" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
        {(editCase === 1) && <TextField value={adminEditCase.bank} id="bank" label="은행" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
        {(editCase === 1) && <TextField value={adminEditCase.acount} id="acount" label="계좌번호" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
        {(editCase === 1) && <TextField value={adminEditCase.comPerson} id="comPerson" label="담당자" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
        {(editCase === 2) && <TextField value={adminEditCase.comName} id="comName" label="통신사" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
        {(editCase === 2) && <TextField value={adminEditCase.comPerson} id="comPerson" label="담당자" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
        {(editCase === 3) && <TextField value={adminEditCase.comName} id="comName" label="개통처" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
        {(editCase === 3) && <TextField value={adminEditCase.comPerson} id="comPerson" label="담당자" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
        {(editCase === 3) && <TextField value={adminEditCase.telComName} id="telComName" label="통신사" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
        {/* {(editCase === 5) && <TextField value={adminEditCase.company} id="company" label="판매처" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> } */}
        {(editCase === 5) && 
              <Autocomplete size="small" 
              value={adminEditCase.company}
              onChange={(event, newValue) => {
                setAdminEditCase({...adminEditCase, company: newValue });
              }}  
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => { setInputValue(newInputValue) }}
              id="company"
              options={sellComNameList}
              sx={{ width: 550 }}
              renderInput={(params) => <TextField {...params} label="판매처" />} />
        }
        {(editCase === 5) && <TextField value={adminEditCase.name} id="name" label="사용자" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
        {(editCase === 5) && <TextField value={adminEditCase.userGrade} id="userGrade" label="권한등급" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
        {(editCase === 5) && <TextField value={adminEditCase.note} id="note" label="비고" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
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
      <Container maxWidth='xl'>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={hdcEditCloseCP} aria-label="close">
            <CloseIcon onClick={hdcEditCloseCP} />
          </IconButton>
          <Typography sx={{ flex: 1 }} variant="h6" component="div">
            요금제 리베이트 수정
          </Typography>
          <Button autoFocus color="inherit" onClick={handleUpdate}>
            Update
          </Button>
        </Toolbar>
      </AppBar>

      <DialogTitle sx={{color: pink[500], fontWeight: '600', display: 'flex', alignItems: 'center'}}>
        <ReportIcon sx={{mr: 1}}/> 요금제 - 
        <Input id={'planName'} value={adminEditCaseCP.planName} onChange={handleValueChangeCP} type="text" disableUnderline={true} sx={{ pl: 1, width: 300, fontSize: 22, fontWeight: 600 }} variant="standard"/>
        개통처 - <Input id={'openComName'} value={adminEditCaseCP.openComName} onChange={handleValueChangeCP} type="text" disableUnderline={true} sx={{ pl: 1, width: 300, fontSize: 22, fontWeight: 600 }} variant="standard"/>
      </DialogTitle>

      <DialogContent>      
      <Paper sx={{ pl: 5, pr: 5, height: 1085 }} elevation={5} >        
      <Typography sx={{ mt: 2, mb: 2, fontWeight: 400, display: 'flex', alignItems: 'center' }} variant="h6" />
        <Table stickyHeader size='small' aria-label="sticky table">
          <TableHead >
            <TableRow >
              <TableCell sx={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 600 }} align='center' >Day</TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 600 }} align='center' >신규-리베이트</TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 600 }} align='center' >MNP-리베이트</TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 600 }} align='center' >신규-원가리베이트</TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 600 }} align='center' >MNP-원가리베이트</TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 600 }} align='center' >신규-손익</TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 600 }} align='center' >MNP-손익</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {adminEditCaseCP.rebate1 &&  adminEditCaseCP.rebate1.map((doc, index) => {
              return (
              <TableRow key = {index} sx={{padding:0, backgroundColor: '#F5F5F5' }} >
                <TableCell align='center' size="small" padding="none">{index + 1}</TableCell>
                <TableCell align='center' size="small" padding="none"><Input name={index} value={adminEditCaseCP.rebate1[index]} onChange={handleValueChangeCP1} type="text" disableUnderline={true} sx={{ pl: 10, width: 200 }} variant="standard" /></TableCell>
                <TableCell align='center' size="small" padding="none"><Input name={index} value={adminEditCaseCP.rebate2[index]} onChange={handleValueChangeCP2} type="text" disableUnderline={true} sx={{ pl: 10, width: 200 }} variant="standard" /></TableCell>
                <TableCell align='center' size="small" padding="none"><Input name={index} value={adminEditCaseCP.rebate3[index]} onChange={handleValueChangeCP3} type="text" disableUnderline={true} sx={{ pl: 10, width: 200 }} variant="standard"/></TableCell>
                <TableCell align='center' size="small" padding="none"><Input name={index} value={adminEditCaseCP.rebate4[index]} onChange={handleValueChangeCP4} type="text" disableUnderline={true} sx={{ pl: 10, width: 200 }} variant="standard"/></TableCell>
                <TableCell align='center' size="small" padding="none"><Input value={Number(adminEditCaseCP.rebate3[index]) - Number(adminEditCaseCP.rebate1[index])} type="text" disableUnderline={true} sx={{ pl: 10, width: 200 }} /></TableCell>
                <TableCell align='center' size="small" padding="none"><Input value={Number(adminEditCaseCP.rebate4[index]) - Number(adminEditCaseCP.rebate2[index])} type="text" disableUnderline={true} sx={{ pl: 10, width: 200 }} /></TableCell>
              </TableRow> 
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
      </Container>
  </Dialog>
  </>
)

// Component End =========================================================
}

export default AdminCellEdit