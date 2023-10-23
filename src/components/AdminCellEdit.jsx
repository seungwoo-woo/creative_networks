import React, { useEffect, useState } from 'react'
import EditCalendarTwoToneIcon from '@mui/icons-material/EditCalendarTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
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
const [adminEditCase, setAdminEditCase] = useState({ comName: '', comNo: ''});


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
      });}


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
    const docRef = await deleteDoc(doc(db, "sellComName", id));

    hdcDeleteClose();

    alert("판매처 정보가 삭제되었습니다.");

    getDataRefresh();      

  } catch (e) {
    console.error("Error adding document: ", e);
  }
  
  hdcDeleteClose();
};



// useEffect 1 Start ========================================================
useEffect(()=>{

  if (editCase === 1) {
    getAdminEditCase1();
  } 

  if (editCase === 2) {
    getAdminEditCase2();
  }
  
},[]);



return (
  <>
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <EditCalendarTwoToneIcon cursor='pointer' variant='contained' color='primary' sx={{ fontSize: 24 }} onClick={hdcEditOpen}/>
      <DeleteTwoToneIcon cursor='pointer' variant='contained' sx={{ color: pink[500], fontSize: 25 }} onClick={hdcDeleteOpen}/>
    </div>

    <Dialog open={isEditOpen} onClose={hdcEditClose}>
      {(editCase === 1) && <DialogTitle>판매처 정보 수정</DialogTitle>}
      {(editCase === 2) && <DialogTitle>통신사 정보 수정</DialogTitle>}

      
      <DialogContent>
        {(editCase === 1) && <TextField value={adminEditCase.comName} id="comName" label="판매처" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
        {(editCase === 1) && <TextField value={adminEditCase.comNo} id="comNo" label="사업자번호" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
        {(editCase === 2) && <TextField value={adminEditCase.comName} id="comName" label="통신사" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
        {(editCase === 2) && <TextField value={adminEditCase.comNo} id="comNo" label="담당자" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
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
        {"판매처 정보를 삭제하시겠습니까 ?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          선택하신 판매처 정보가 완전하게 삭제됩니다.
          삭제 후에는 되돌릴 수 없습니다. 그래도 삭제하시겠습니까 ? 
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={hdcDeleteClose}>CANCLE</Button>
        <Button onClick={handleDelete} autoFocus>DELETE</Button>
      </DialogActions>
    </Dialog>

  </>
)

}

export default AdminCellEdit