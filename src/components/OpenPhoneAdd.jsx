import React, { useState } from "react";

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



// firestore ============================================================
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseConfig } from '../firebase';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { DialogContent, DialogTitle, DialogContentText, DialogActions, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Select, MenuItem, Box, FormControl, InputLabel } from "@mui/material";
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




function OpenPhoneAdd(props) {

  const getDataRefresh = props.getDataRefresh

  const [openPhoneCase, setOpenPhoneCase] = 
    useState({ no: '', telCom: '', openCom: '', type: '', openDate: '', openType: '', phoneModel: '', phoneSerial: '', phoneColor: '', customerName: '', phoneNo: '', birthday: '', callingPlan: '', controlNo: '', memo: '', sellCom: '', isDeleted: 0});

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDialogOpen(true);
  };

  const handleClickClose = () => {
    setOpenPhoneCase({ no: '', telCom: '', openCom: '', type: '', openDate: '', openType: '', phoneModel: '', phoneSerial: '', phoneColor: '', customerName: '', phoneNo: '', birthday: '', callingPlan: '', controlNo: '', memo: '', sellCom: '', isDeleted: 0});
    setIsDialogOpen(false);
  };

  const handleValueChange = (e) => {
    const keyValue = e.target.id;
    const openPhoneCaseCopy = {...openPhoneCase, [keyValue]: e.target.value };

    // console.log(e.target.id);
    // console.log(e.target.value);
    setOpenPhoneCase(openPhoneCaseCopy);
  };

  const handleSelectChange = (e) => {
    const keyValue = "sellCom";
    const openPhoneCaseCopy = {...openPhoneCase, [keyValue]: e.target.value };

    // console.log(keyValue);
    // console.log(e.target.value);
    setOpenPhoneCase(openPhoneCaseCopy);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    let maxNo = [];

    const querySnapshot = await getDocs(query(collection(db, "CreativeNetworks"), orderBy("no", "desc"), limit(2), where("isDeleted", "==", 0)));

    querySnapshot.forEach((doc) => {
      maxNo.push(Number(doc.data().no))
      // console.log(maxNo)

    });

    try {
      const docRef = await addDoc(collection(db, "CreativeNetworks"), {
        no: maxNo[0] + 1,
        // no: 5,
        telCom: openPhoneCase.telCom,
        openCom: openPhoneCase.openCom,
        type: openPhoneCase.type,
        openDate: openPhoneCase.openDate,
        openType: openPhoneCase.openType,
        phoneModel: openPhoneCase.phoneModel,
        phoneSerial: openPhoneCase.phoneSerial,
        phoneColor: openPhoneCase.phoneColor,
        customerName: openPhoneCase.customerName,
        phoneNo: openPhoneCase.phoneNo,
        birthday: openPhoneCase.birthday,
        callingPlan: openPhoneCase.callingPlan,
        controlNo: openPhoneCase.controlNo,
        memo: openPhoneCase.memo,
        sellCom: openPhoneCase.sellCom,
        isDeleted: 0 
      });
      // console.log("Document written with ID: ", docRef.id);
      alert("신규 개통내역이 등록되었습니다.");
      // navigate('/recipe/'+ docRef.id);
      // window.location.reload();
      getDataRefresh();
      handleClickClose();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    
    setIsDialogOpen(false);
  };




  return (
    <>
    <div style={{display: 'flex',  justifyContent: 'end', paddingRight: 10 }}>
      <Button variant='contained' color='primary' onClick={handleClickOpen}>
        신규등록
      </Button>
    </div>

    <Dialog
        fullScreen
        open={isDialogOpen}
        onClose={handleClickClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClickClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              개통내역 신규등록
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit}>
              save
            </Button>
          </Toolbar>
        </AppBar>


        <DialogTitle>개통 상세 내역</DialogTitle>
        <DialogContent>
          <DialogContentText>
            신규개통 상세내역을 입력하세요.
          </DialogContentText>

          <Table>
            <TableBody>
            <TableRow>
              <TableCell>
                <TextField id="telCom" label="통신사" type="text" value={openPhoneCase.telCom} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
              </TableCell>
              <TableCell>
                <TextField id="openCom" label="개통처" type="text" value={openPhoneCase.openCom} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
              </TableCell>
              <TableCell>
                <TextField id="type" label="타입" type="text" value={openPhoneCase.type} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
              </TableCell>
              <TableCell>
                <TextField id="openDate" label="개통일" type="text" value={openPhoneCase.openDate} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <TextField id="openType" label="유형" type="text" value={openPhoneCase.openType} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
              </TableCell>
              <TableCell>
                <TextField id="phoneModel" label="개통모델" type="text" value={openPhoneCase.phoneModel} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
              </TableCell>
              <TableCell>
                <TextField id="phoneSerial" label="일련번호" type="text" value={openPhoneCase.phoneSerial} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
              </TableCell>
              <TableCell>
                <TextField id="phoneColor" label="색상" type="text" value={openPhoneCase.phoneColor} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <TextField id="customerName" label="고객명" type="text" value={openPhoneCase.customerName} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
              </TableCell>
              <TableCell>
                <TextField id="phoneNo" label="이동번호" type="text" value={openPhoneCase.phoneNo} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
              </TableCell>
              <TableCell>
                <TextField id="birthday" label="생년월일" type="text" value={openPhoneCase.birthday} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
              </TableCell>
              <TableCell>
                <TextField id="callingPlan" label="요금제" type="text" value={openPhoneCase.callingPlan} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <TextField id="controlNo" label="관리번호" type="text" value={openPhoneCase.controlNo} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
              </TableCell>
              <TableCell>
                <TextField id="memo" label="메모" type="text" value={openPhoneCase.memo} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
              </TableCell>
              <TableCell>
                aaa
                {/* <TextField id="sellCom" label="판매처" type="text" value={openPhoneCase.sellCom} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" /> */}
              </TableCell>

              <TableCell>
                {/* <TextField  label="판매처" autoFocus margin="dense" fullWidth variant="standard" /> */}
                <Box >
                  <FormControl sx={{ m: 1, minWidth: 120 }} size="small" fullWidth>
                    <InputLabel id="demo-simple-select">판매처</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      label="판매처"
                      id="sellCom"                      
                      value={openPhoneCase.sellCom}
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="셀타운">셀타운</MenuItem>
                      <MenuItem value="셀타운2">셀타운2</MenuItem>
                      <MenuItem value="셀타운3">셀타운3</MenuItem>
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
          <Button onClick={handleSubmit}>등록</Button>
        </DialogActions>


 

        



    </Dialog>

    </>

  )
}

export default OpenPhoneAdd
