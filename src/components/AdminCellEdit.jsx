import React, { useEffect, useState } from 'react'
import EditCalendarTwoToneIcon from '@mui/icons-material/EditCalendarTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import PersonOffTwoToneIcon from '@mui/icons-material/PersonOffTwoTone';
import { pink } from '@mui/material/colors';
import Button from '@mui/material/Button';
import { Dialog, DialogContent, DialogTitle, DialogActions, TextField, DialogContentText } from "@mui/material";



// firebase import=======================================================
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../firebase';
import { getFirestore, collection, getDoc, doc, getDocs, query, where, orderBy, updateDoc, deleteDoc } from "firebase/firestore";


// Initialize Firebase ==================================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



function AdminCellEdit(props) {

// Initialize Variable ==================================================
const { id, getDataRefresh, editCase } = props
const [isEditOpen, setIsEditOpen] = useState(false);
const [isDeleteOpen, setIsDeleteOpen] = useState(false);
const [isDisableOpen, setIsDisableOpen] = useState(false);
const [adminEditCase, setAdminEditCase] = useState([{}]);


// Define subFunction ==================================================
// Edit 대상 정보 읽어오기 ------------------------------------------------
const getAdminEditCase1 = async () => {
  const querySnapshot = await getDoc(doc(db, "sellComName", id));
  setAdminEditCase(querySnapshot.data());
}

// Edit 대상 정보 읽어오기 ------------------------------------------------
const getAdminEditCase2 = async () => {
  const querySnapshot = await getDoc(doc(db, "telComName", id));
  setAdminEditCase(querySnapshot.data());
}

// Edit 대상 정보 읽어오기 ------------------------------------------------
const getAdminEditCase3 = async () => {
  const querySnapshot = await getDoc(doc(db, "openComName", id));
  setAdminEditCase(querySnapshot.data());
}

// Edit 대상 정보 읽어오기 ------------------------------------------------
const getAdminEditCase5 = async () => {
  const querySnapshot = await getDoc(doc(db, "comUsers", id));
  setAdminEditCase(querySnapshot.data());
}

// --------------------------------------------------------------------
const hdcEditOpen = () => {
  setIsEditOpen(true);
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
const handleUpdate = async (e) => {
  e.preventDefault();

  try {
    if (editCase === 1) {
    const docRef = await updateDoc(doc(db, "sellComName", id), {
      comName: adminEditCase.comName,
      comNo: adminEditCase.comNo    
    });}

    if (editCase === 2) {
      const docRef = await updateDoc(doc(db, "telComName", id), {
        comName: adminEditCase.comName,
        comPerson: adminEditCase.comPerson
      });}

    if (editCase === 3) {
      const docRef = await updateDoc(doc(db, "openComName", id), {
        comName: adminEditCase.comName,
        comPerson: adminEditCase.comPerson,
        telComName: adminEditCase.telComName,
      });}

    if (editCase === 5) {
      const docRef = await updateDoc(doc(db, "comUsers", id), {
        name: adminEditCase.name,
        company: adminEditCase.company,
        userGrade: adminEditCase.userGrade,
      });}

  setIsEditOpen(false);
  
  alert("정보가 수정되었습니다.");
  } catch (e) {
    console.error("Error adding document: ", e);
  }

  getDataRefresh();
  setIsEditOpen(false);
}

// --------------------------------------------------------------------
const handleValueChange = (e) => {
  const keyValue = e.target.id;
  const editCopy = {...adminEditCase, [keyValue]: e.target.value };
  setAdminEditCase(editCopy);
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

    hdcDeleteClose();
    alert("해당 정보가 삭제되었습니다.");
    getDataRefresh();  

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


// Delete Function =======================================================
const handleDisable = async (e) => {
  e.preventDefault();

  try {
    const docRef = await updateDoc(doc(db, "comUsers", id), {
      userGrade: 'D',
    })

    hdcDisableClose();
    alert("해당 사용자가 비활성화 되었습니다.");
    getDataRefresh();  

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

  if (editCase === 5) {
    getAdminEditCase5();
  }
  
},[]);



return (
  <>
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <EditCalendarTwoToneIcon cursor='pointer' variant='contained' color='primary' sx={{ fontSize: 24 }} onClick={hdcEditOpen}/>
      {(editCase !== 5) && <DeleteTwoToneIcon cursor='pointer' variant='contained' sx={{ color: pink[500], fontSize: 25 }} onClick={hdcDeleteOpen}/> }
      {(editCase === 5) && <PersonOffTwoToneIcon cursor='pointer' variant='contained' sx={{ color: pink[500], fontSize: 25 }} onClick={hdcDisableOpen}/> }
    </div>

    <Dialog open={isEditOpen} onClose={hdcEditClose}>
      {(editCase === 1) && <DialogTitle>판매처 정보 수정</DialogTitle>}
      {(editCase === 2) && <DialogTitle>통신사 정보 수정</DialogTitle>}
      {(editCase === 3) && <DialogTitle>개통처 정보 수정</DialogTitle>}
      {(editCase === 5) && <DialogTitle>사용자 정보 수정</DialogTitle>}

      
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
      open={isDeleteOpen}
      onClose={hdcDeleteClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"해당 정보를 삭제하시겠습니까 ?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          선택하신 정보가 완전하게 삭제됩니다.
          삭제 후에는 되돌릴 수 없습니다. 그래도 삭제하시겠습니까 ? 
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={hdcDeleteClose}>CANCLE</Button>
        <Button onClick={handleDelete} autoFocus>DELETE</Button>
      </DialogActions>
    </Dialog>

    <Dialog
      open={isDisableOpen}
      onClose={hdcDisableClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"해당 사용자를 비활성화하시겠습니까 ?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          선택하신 사용자의 권한등급을 D로 수정하여, 로그인 하지 못하도록 비활성화 합니다. 
          이후, 다시 활성화할 수 있습니다. 비활성화 하시겠습니까 ? 
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={hdcDisableClose}>CANCLE</Button>
        <Button onClick={handleDisable} autoFocus>DISABLE</Button>
      </DialogActions>
    </Dialog>

  </>
)

}

export default AdminCellEdit