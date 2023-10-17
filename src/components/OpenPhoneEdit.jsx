import React, { useEffect, useState } from "react";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import EditCalendarTwoToneIcon from '@mui/icons-material/EditCalendarTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { pink } from '@mui/material/colors';



// firestore ============================================================
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../firebase';
import { getFirestore, collection, getDoc, doc, getDocs, query, where, orderBy, updateDoc, deleteDoc } from "firebase/firestore";
import { DialogContent, DialogTitle, DialogContentText, DialogActions, Table, TableBody, TableCell, TableRow, TextField, Select, MenuItem, Box, FormControl, InputLabel } from "@mui/material";
// ======================================================================

// Initialize Firebase ==================================================
const app = initializeApp(firebaseConfig);
// ======================================================================

// Initialize Cloud Storage and get a reference to the service ==========
const db = getFirestore(app);
// ======================================================================


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});




//  ======================================================================================
// Function 시작 =========================================================================
// =======================================================================================

function OpenPhoneEdit(props) {

  const id = props.id
  const getDataRefresh = props.getDataRefresh

  const [openPhoneEditCase, setOpenPhoneEditCase] = 
    useState({ no: '', telCom: '', openCom: '', type: '', openDate: '', openType: '', phoneModel: '', phoneSerial: '', phoneColor: '', customerName: '', phoneNo: '', birthday: '', callingPlan: '', controlNo: '', memo: '', sellCom: '', isDeleted: 0});

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sellComNameList, setSellComNameList] = useState([]);


  useEffect(()=>{

    const getPhoneCaseEdit = async () => {

      const querySnapshot = await getDoc(doc(db, "CreativeNetworks", id));

      setOpenPhoneEditCase(querySnapshot.data());
    }

    getPhoneCaseEdit();


    const getSellComName = async () => {
      let data = [];
      const querySnapshot = await getDocs(query(collection(db, "sellComName"), orderBy("comName", "asc"), where("isDeleted", "==", 0)));

      querySnapshot.forEach((doc) => {
        data.push({...doc.data(), id: doc.id,})
      });
      setSellComNameList(data);
    }
    
    getSellComName();

  }, []);


  const handleClickOpen = () => {
    setIsDialogOpen(true);
  };

  const handleClickClose = () => {
    setIsDialogOpen(false);
  };

  const handleClickDeleteOpen = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleClickDeleteClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleValueChange = (e) => {
    const keyValue = e.target.id;
    const openPhoneCaseCopy = {...openPhoneEditCase, [keyValue]: e.target.value };

    setOpenPhoneEditCase(openPhoneCaseCopy);
  };

  const handleSelectChange = (e) => {  
    const keyValue = e.target.name
    const openPhoneCaseCopy = {...openPhoneEditCase, [keyValue]: e.target.value };

    setOpenPhoneEditCase(openPhoneCaseCopy);
  };


  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const docRef = await updateDoc(doc(db, "CreativeNetworks", id), {
        telCom: openPhoneEditCase.telCom,
        openCom: openPhoneEditCase.openCom,
        type: openPhoneEditCase.type,
        openDate: openPhoneEditCase.openDate,
        openType: openPhoneEditCase.openType,
        phoneModel: openPhoneEditCase.phoneModel,
        phoneSerial: openPhoneEditCase.phoneSerial,
        phoneColor: openPhoneEditCase.phoneColor,
        customerName: openPhoneEditCase.customerName,
        phoneNo: openPhoneEditCase.phoneNo,
        birthday: openPhoneEditCase.birthday,
        callingPlan: openPhoneEditCase.callingPlan,
        controlNo: openPhoneEditCase.controlNo,
        memo: openPhoneEditCase.memo,
        sellCom: openPhoneEditCase.sellCom,
      });

      alert("개통내역이 수정되었습니다.");

      getDataRefresh();
      handleClickClose();

    } catch (e) {
      console.error("Error adding document: ", e);
    }
    
    setIsDialogOpen(false);
  };



  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      const docRef = await deleteDoc(doc(db, "CreativeNetworks", id));

      handleClickDeleteClose();

      alert("개통내역이 삭제되었습니다.");

      getDataRefresh();      

    } catch (e) {
      console.error("Error adding document: ", e);
    }
    
    setIsDeleteDialogOpen(false);
  };




// ------------------------------------------------------------------------------------
// return 시작 ------------------------------------------------------------------------
// ------------------------------------------------------------------------------------

  return (
    <>
    <div style={{display: 'flex',  justifyContent: 'end', paddingRight: 10 }}>
      <EditCalendarTwoToneIcon cursor='pointer' variant='contained' color='primary' onClick={handleClickOpen}/>
      <DeleteTwoToneIcon cursor='pointer' variant='contained' sx={{ color: pink[500], fontSize: 26 }} onClick={handleClickDeleteOpen}/>
    </div>

    <Dialog
        fullScreen
        open={isDialogOpen}
        onClose={handleClickClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="close" onClick={handleClickClose} >
              <CloseIcon onClick={handleClickClose} />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              개통내역 수정
            </Typography>
            <Button autoFocus color="inherit" onClick={handleUpdate}>
              Update
            </Button>
          </Toolbar>
        </AppBar>


        <DialogTitle>개통 상세 내역 수정</DialogTitle>
        <DialogContent>
          <DialogContentText>
            신규개통 상세내역을 수정하세요.
          </DialogContentText>

          <Table>
            <TableBody>
            <TableRow>
              <TableCell>
                <TextField id="telCom" label="통신사" type="text" value={openPhoneEditCase.telCom} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
              </TableCell>
              <TableCell>
                <TextField id="openCom" label="개통처" type="text" value={openPhoneEditCase.openCom} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
              </TableCell>
              <TableCell>
                <TextField id="type" label="타입" type="text" value={openPhoneEditCase.type} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
              </TableCell>
              <TableCell>
                <TextField id="openDate" label="개통일" type="text" value={openPhoneEditCase.openDate} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <TextField id="openType" label="유형" type="text" value={openPhoneEditCase.openType} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
              </TableCell>
              <TableCell>
                <TextField id="phoneModel" label="개통모델" type="text" value={openPhoneEditCase.phoneModel} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
              </TableCell>
              <TableCell>
                <TextField id="phoneSerial" label="일련번호" type="text" value={openPhoneEditCase.phoneSerial} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
              </TableCell>
              <TableCell>
                <TextField id="phoneColor" label="색상" type="text" value={openPhoneEditCase.phoneColor} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <TextField id="customerName" label="고객명" type="text" value={openPhoneEditCase.customerName} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
              </TableCell>
              <TableCell>
                <TextField id="phoneNo" label="이동번호" type="text" value={openPhoneEditCase.phoneNo} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
              </TableCell>
              <TableCell>
                <TextField id="birthday" label="생년월일" type="text" value={openPhoneEditCase.birthday} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
              </TableCell>
              <TableCell>
                <TextField id="callingPlan" label="요금제" type="text" value={openPhoneEditCase.callingPlan} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <TextField id="controlNo" label="관리번호" type="text" value={openPhoneEditCase.controlNo} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
              </TableCell>
              <TableCell>
                <TextField id="memo" label="메모" type="text" value={openPhoneEditCase.memo} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
              </TableCell>

              <TableCell>
                <Box >
                  <FormControl sx={{ m: 0, minWidth: 210 }} size="small" fullWidth>
                    <InputLabel id="demo-simple-select">판매처</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      label="판매처"
                      name="sellCom"                      
                      value={openPhoneEditCase.sellCom}
                      onChange={handleSelectChange}
                    >
                      {sellComNameList.map((com) => (
                        <MenuItem key={com.id} value={com.comName}>{com.comName}</MenuItem>)
                      )}
                    </Select>
                  </FormControl>
                </Box>            
              </TableCell>

            </TableRow>
          </TableBody>
          </Table>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickClose}>취소</Button>
          <Button onClick={handleUpdate}>수정</Button>
        </DialogActions>
    </Dialog>

    <Dialog
        open={isDeleteDialogOpen}
        onClose={handleClickDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"개통내역을 삭제하시겠습니까 ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            선택하신 개통내역이 완전하게 삭제됩니다.
            삭제 후에는 되돌릴 수 없습니다. 그래도 삭제하시겠습니까 ? 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickDeleteClose}>취소</Button>
          <Button onClick={handleDelete} autoFocus>
            삭제
          </Button>
        </DialogActions>
      </Dialog>

    </>
  )
}

export default OpenPhoneEdit
