// import ============================================================
import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs from "dayjs";
import Autocomplete from '@mui/material/Autocomplete';
// ======================================================================


// firestore ============================================================
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../firebase';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy} from "firebase/firestore";
import { DialogContent, DialogTitle, DialogContentText, DialogActions, Table, TableBody, TableCell, TableRow, TextField, Select, MenuItem, Box, FormControl, InputLabel } from "@mui/material";
// ======================================================================

// Initialize Firebase ==================================================
const app = initializeApp(firebaseConfig);
// ======================================================================

// Initialize Cloud Storage and get a reference to the service ==========
const db = getFirestore(app);
// ======================================================================

// Modal Transition ==================================================
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
// ======================================================================



//  ======================================================================================
// Function 시작 =========================================================================
// =======================================================================================

function OpenPhoneAdd(props) {

  const getDataRefresh = props.getDataRefresh

  const [openPhoneCase, setOpenPhoneCase] = 
    useState({ no: '', telCom: '', openCom: '', type: '', openDate: '', openType: '', phoneModel: '', phoneSerial: '', phoneColor: '', customerName: '', phoneNo: '', birthday: '', callingPlan: '', controlNo: '', memo: '', sellCom: '', isDeleted: 0});

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [sellComNameList, setSellComNameList] = useState([]);

  const [inputValue, setInputValue] = useState('');    // sellComName


  useEffect(()=>{

    const getSellComName = async () => {
      let data = [];
      const querySnapshot = await getDocs(query(collection(db, "sellComName"), orderBy("comName", "asc"), where("isDeleted", "==", 0)));

      querySnapshot.forEach((doc) => {
        // data.push({...doc.data(), id: doc.id,})
        data.push(doc.data().comName);

      });
      setSellComNameList(data);
    }
    
    getSellComName();

  }, []);


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

    setOpenPhoneCase(openPhoneCaseCopy);
  };

  const handleSelectChange = (e) => {  
    const keyValue = e.target.name
    const openPhoneCaseCopy = {...openPhoneCase, [keyValue]: e.target.value };

    setOpenPhoneCase(openPhoneCaseCopy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(openPhoneCase.openDate);
    console.log(openPhoneCase.sellCom);

    try {
      const docRef = await addDoc(collection(db, "CreativeNetworks"), {
        // no: maxNo[0] + 1,
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

      alert("신규 개통내역이 등록되었습니다.");

      getDataRefresh();
      handleClickClose();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    
    setIsDialogOpen(false);
  };


  
// ------------------------------------------------------------------------------------
// return 시작 ------------------------------------------------------------------------
// ------------------------------------------------------------------------------------

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
              <CloseIcon onClick={handleClickClose} />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              개통내역 신규등록
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit}>
              Save
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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DesktopDatePicker label={["개통일"]}
                                format="YYYY-MM-DD"
                                id="openDate" 
                                value={dayjs(openPhoneCase.openDate)} onChange={(newValue) => setOpenPhoneCase({...openPhoneCase, openDate: dayjs(newValue).format("YYYY-MM-DD")})} />
                  </DemoContainer>
                </LocalizationProvider>         
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
                {/* <Box >
                  <FormControl sx={{ m: 0, minWidth: 210 }} size="small" fullWidth>
                    <InputLabel id="demo-simple-select">판매처</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      label="판매처"
                      name="sellCom"                      
                      value={openPhoneCase.sellCom}
                      onChange={handleSelectChange}
                    >
                      {sellComNameList.map((com) => (
                        <MenuItem key={com.id} value={com.comName}>{com.comName}</MenuItem>)
                      )}
                    </Select>
                  </FormControl>
                </Box>             */}

                <Autocomplete
                  value={openPhoneCase.sellCom}
                  onChange={(event, newValue) => {
                    setOpenPhoneCase({...openPhoneCase, 'sellCom': newValue });
                  }}  

                  inputValue={inputValue}
                  onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                  }}
                  id="controllable-states-demo"
                  options={sellComNameList}
                  sx={{ width: 250 }}
                  renderInput={(params) => <TextField {...params} label="판매처" />}
                />

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
