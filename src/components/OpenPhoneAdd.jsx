// react & material UI import ==================================================
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { pink } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import ReportIcon from '@mui/icons-material/Report';
import Slide from '@mui/material/Slide';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs from "dayjs";
import Autocomplete from '@mui/material/Autocomplete';
import { DialogContent, DialogTitle, DialogContentText, DialogActions, Table, TableBody, TableCell, TableRow, TextField, Select, MenuItem, Box, FormControl, InputLabel } from "@mui/material";


// firebase import=======================================================
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../firebase';
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy} from "firebase/firestore";


// Initialize Firebase ==================================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Define subFunction ================================================
// Modal Transition --------------------------------------------------
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



//  ======================================================================================
// Function 시작 =========================================================================
// =======================================================================================

function OpenPhoneAdd(props) {

// Initialize Variable ==================================================
const getDataRefresh = props.getDataRefresh;
const [openPhoneCase, setOpenPhoneCase] = 
  useState({ no: '', telCom: '', openCom: '', type: '', openDate: '', openType: '', phoneModel: '', phoneSerial: '', phoneColor: '', customerName: '', phoneNo: '', birthday: '', callingPlan: '', controlNo: '', memo: '', sellCom: '', isDeleted: 0});
const [isDialogOpen, setIsDialogOpen] = useState(false);
const [isCompSaveDialogOpen, setIsCompSaveDialogOpen] = useState(false);
const [sellComNameList, setSellComNameList] = useState([]);
const [telComNameList, setTelComNameList] = useState([]);
const [openComNameList, setOpenComNameList] = useState([]);
const [openCallingPlanList, setOpenCallingPlanList] = useState([]);
const [inputValue, setInputValue] = useState('');    // sellComName


// Define subFunction ==================================================
//-----------------------------------------------------------------------
const handleClickOpen = () => {
  setIsDialogOpen(true);
};


//-----------------------------------------------------------------------
const handleClickClose = () => {
  setOpenPhoneCase({ no: '', telCom: '', openCom: '', type: '', openDate: '', openType: '', phoneModel: '', phoneSerial: '', phoneColor: '', customerName: '', phoneNo: '', birthday: '', callingPlan: '', controlNo: '', memo: '', sellCom: '', isDeleted: 0});
  setIsDialogOpen(false);
};


//-----------------------------------------------------------------------
const handleClickCompSaveDialogClose = () => {
  setIsCompSaveDialogOpen(false);
  getDataRefresh();
};


//-----------------------------------------------------------------------
const handleValueChange = (e) => {
  const keyValue = e.target.id;
  const openPhoneCaseCopy = {...openPhoneCase, [keyValue]: e.target.value };

  setOpenPhoneCase(openPhoneCaseCopy);
};


//-----------------------------------------------------------------------
const handleSelectChange = (e) => {  
  const keyValue = e.target.name
  const openPhoneCaseCopy = {...openPhoneCase, [keyValue]: e.target.value };

  setOpenPhoneCase(openPhoneCaseCopy);
};


//-----------------------------------------------------------------------
const handleSubmit = async (e) => {
  e.preventDefault();

  console.log(openPhoneCase.openDate);
  console.log(openPhoneCase.sellCom);

  try {
    const docRef = await addDoc(collection(db, "CreativeNetworks"), {
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

    setIsCompSaveDialogOpen(true);
    // alert("신규 개통내역이 등록되었습니다.");

    handleClickClose();
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  
  handleClickClose();
};


// useEffect 1 Start ========================================================
useEffect(()=>{    

  // 통신사 리스트 읽어오기 --------------------------------------------------
  const getTelComName = async () => {
    let data = [];
    const querySnapshot = await getDocs(query(collection(db, "telComName"), orderBy("comName", "asc"), where("isDeleted", "==", 0)));
    querySnapshot.forEach((doc) => {
      data.push({...doc.data(), id: doc.id,})
      // data.push(doc.data().comName);
    });
    setTelComNameList(data);
  }

  // 판매점 리스트 읽어오기 --------------------------------------------------
  const getSellComName = async () => {
    let data = [];
    const querySnapshot = await getDocs(query(collection(db, "sellComName"), orderBy("comName", "asc"), where("isDeleted", "==", 0)));
    querySnapshot.forEach((doc) => {
      // data.push({...doc.data(), id: doc.id,})
      data.push(doc.data().comName);
    });
    setSellComNameList(data);
  }

  getTelComName();
  getSellComName();

}, []);


// useEffect 2 Start ========================================================
useEffect(()=>{

  // 개통처 리스트 읽어오기 --------------------------------------------------
  const getOpenComName = async () => {
    let data = [];
    const querySnapshot = await getDocs(query(collection(db, "openComName"), orderBy("comName", "asc"), where("telComName", "==", openPhoneCase.telCom)));
    querySnapshot.forEach((doc) => {
      data.push({...doc.data(), id: doc.id,})
      // data.push(doc.data().comName);
    });
    setOpenComNameList(data);
  }    
  getOpenComName();

}, [openPhoneCase.telCom]);


// useEffect 3 Start ========================================================
useEffect(()=>{

  // 요금제 읽어오기 --------------------------------------------------
  const getOpenCallingPlan = async () => {
    let data = [];
    const querySnapshot = await getDocs(query(collection(db, "callingPlanName"), orderBy("planName", "asc"), where("openComName", "==", openPhoneCase.openCom)));
    querySnapshot.forEach((doc) => {
      data.push({...doc.data(), id: doc.id,})
      // data.push(doc.data().comName);
    });
    setOpenCallingPlanList(data);
  }    
  getOpenCallingPlan();

}, [openPhoneCase.openCom]);


  
// ------------------------------------------------------------------------------------
// return 시작 ------------------------------------------------------------------------
// ------------------------------------------------------------------------------------

return (
  <>
  <div style={{display: 'flex',  justifyContent: 'end', paddingRight: 10 }}>      
    <Typography variant="h4" 
      sx={{ mr: 115, display: { xs: 'none', md: 'flex' }, 
      fontWeight: 100, color: '#1976D2' }}>
      Creative Networks 개통 리스트
    </Typography>
    
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
            신규 개통내역 등록
          </Typography>
          <Button autoFocus color="inherit" onClick={handleSubmit}>
            Save
          </Button>
        </Toolbar>
      </AppBar>

      <DialogTitle>신규 개통내역 상세</DialogTitle>
      <DialogContent>
        <DialogContentText>
          신규 개통건의 상세내역을 입력하세요.
        </DialogContentText>

        <Table>
          <TableBody>
          <TableRow>
            <TableCell>
              <FormControl sx={{ m: 0, minWidth: 210 }} size="small" fullWidth>
                  <InputLabel id="demo-simple-select">통신사</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    label="통신사"
                    name="telCom"                      
                    value={openPhoneCase.telCom}
                    onChange={handleSelectChange}
                  >
                    {telComNameList.map((com) => (
                      <MenuItem key={com.id} value={com.comName}>{com.comName}</MenuItem>)
                    )}
                  </Select>
                </FormControl>
            </TableCell>
            <TableCell>
              <FormControl sx={{ m: 0, minWidth: 210 }} size="small" fullWidth>
                  <InputLabel id="demo-simple-select">개통처</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    label="개통처"
                    name="openCom"                      
                    value={openPhoneCase.openCom}
                    onChange={handleSelectChange}
                  >
                    {openComNameList.map((com) => (
                      <MenuItem key={com.id} value={com.comName}>{com.comName}</MenuItem>)
                    )}
                  </Select>
                </FormControl>
            </TableCell>
            <TableCell>
              <FormControl sx={{ m: 0, minWidth: 210 }} size="small" fullWidth>
                  <InputLabel id="demo-simple-select">타입</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    label="타입"
                    name="type"                      
                    value={openPhoneCase.type}
                    onChange={handleSelectChange}
                  >
                    <MenuItem value={'USIM'}>USIM</MenuItem>
                    <MenuItem value={'단말기'}>단말기</MenuItem>
                  </Select>
                </FormControl>
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
              <FormControl sx={{ m: 0, minWidth: 210 }} size="small" fullWidth>
                  <InputLabel id="demo-simple-select">유형</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    label="유형"
                    name="openType"                      
                    value={openPhoneCase.openType}
                    onChange={handleSelectChange}
                  >
                    <MenuItem value={'MNP할부'}>MNP할부</MenuItem>
                    <MenuItem value={'MNP현금'}>MNP현금</MenuItem>
                    <MenuItem value={'기변할부'}>기변할부</MenuItem>
                    <MenuItem value={'기변현금'}>기변현금</MenuItem>
                    <MenuItem value={'신규할부'}>신규할부</MenuItem>
                    <MenuItem value={'신규현금'}>신규현금</MenuItem>
                  </Select>
                </FormControl>
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
              {/* <TextField id="callingPlan" label="요금제" type="text" value={openPhoneCase.callingPlan} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" /> */}
              <FormControl sx={{ m: 0, minWidth: 210 }} size="small" fullWidth>
                  <InputLabel id="demo-simple-select">요금제</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    label="요금제"
                    name="callingPlan"                      
                    value={openPhoneCase.callingPlan}
                    onChange={handleSelectChange}
                  >
                    {openCallingPlanList.map((com) => (
                      <MenuItem key={com.id} value={com.planName}>{com.planName}</MenuItem>)
                    )}
                  </Select>
                </FormControl>              
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
        <Button onClick={handleClickClose}>CANCLE</Button>
        <Button onClick={handleSubmit}>SAVE</Button>
      </DialogActions>
  </Dialog>


  <Dialog
  open={isCompSaveDialogOpen}
  onClose={handleClickCompSaveDialogClose}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
  >
    <DialogTitle sx={{color: pink[500], fontWeight: '400', display: 'flex', alignItems: 'center'}}>
      <ReportIcon sx={{mr: 1}}/>{" 개통내역 등록 "}
    </DialogTitle>
    <Divider />
    <DialogContent>      
      <Typography>
        신규 개통내역이 정상적으로 등록되었습니다.
      </Typography>
    </DialogContent>
    <Divider />
    <DialogActions>
      <Button onClick={handleClickCompSaveDialogClose}>OK</Button>
    </DialogActions>
  </Dialog>


  </>
)

}

export default OpenPhoneAdd
