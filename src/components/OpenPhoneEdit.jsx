// react & material UI import ==================================================
import React, { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ReportIcon from '@mui/icons-material/Report';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import Slide from '@mui/material/Slide';
import Divider from '@mui/material/Divider';
import EditCalendarTwoToneIcon from '@mui/icons-material/EditCalendarTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { pink } from '@mui/material/colors';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from "dayjs";
import Autocomplete from '@mui/material/Autocomplete';
import { DialogContent, DialogTitle, DialogContentText, DialogActions, Table, TableBody, TableCell, TableRow, TextField, Select, MenuItem, Box, FormControl, InputLabel } from "@mui/material";



// firebase import=======================================================
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../firebase';
import { getFirestore, collection, getDoc, doc, getDocs, query, where, orderBy, updateDoc, deleteDoc } from "firebase/firestore";


// Initialize Firebase ==================================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Define subFunction ================================================
// Modal Transition --------------------------------------------------
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


// Table style ----------------------------------------------------
const StyledDesktopDatePicker = styled(DesktopDatePicker)`
.css-nxo287-MuiInputBase-input-MuiOutlinedInput-input {
  padding-top: 9px;
  padding-bottom: 8px;
}`


//  ======================================================================================
// Function 시작 =========================================================================
// =======================================================================================

function OpenPhoneEdit(props) {

// Initialize Variable ==================================================
const id = props.id
const getDataRefresh = props.getDataRefresh
const [openPhoneEditCase, setOpenPhoneEditCase] = 
  useState({ no: '', telCom: '', openCom: '', type: '', openDate: '', openType: '', phoneModel: '', phoneSerial: '', phoneColor: '', customerName: '', phoneNo: '', nationality: '', birthday: '', callingPlan: '', controlNo: '', memo: '', sellCom: '', isDeleted: 0});
const [isDialogOpen, setIsDialogOpen] = useState(false);
const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
const [isCompUpdateDialogOpen, setIsCompUpdateDialogOpen] = useState(false);
const [isCompDeleteDialogOpen, setIsCompDeleteDialogOpen] =  useState(false);
const [sellComNameList, setSellComNameList] = useState([]);
const [telComNameList, setTelComNameList] = useState([]);
const [openComNameList, setOpenComNameList] = useState([]);
const [openCallingPlanList, setOpenCallingPlanList] = useState([]);
const [inputValue, setInputValue] = useState('');


// Define subFunction ==================================================
// Edit 대상 정보 읽어오기 ------------------------------------------------
const getPhoneCaseEdit = async () => {
  const querySnapshot = await getDoc(doc(db, "CreativeNetworks", id));
  setOpenPhoneEditCase(querySnapshot.data());
}

// --------------------------------------------------------------------
const handleClickOpen = () => {
  setIsDialogOpen(true);
};

// --------------------------------------------------------------------
const handleClickClose = () => {
  getPhoneCaseEdit();
  setIsDialogOpen(false);
};

// --------------------------------------------------------------------
const handleClickDeleteOpen = () => {
  setIsDeleteDialogOpen(true);
};

// --------------------------------------------------------------------
const handleClickDeleteClose = () => {
  setIsDeleteDialogOpen(false);
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
};

const handleClickCompDeleteDialogClose = () => {
  setIsCompDeleteDialogOpen(false);
  getDataRefresh();
};


// --------------------------------------------------------------------
const handleValueChange = (e) => {
  const keyValue = e.target.id;
  const openPhoneCaseCopy = {...openPhoneEditCase, [keyValue]: e.target.value };
  setOpenPhoneEditCase(openPhoneCaseCopy);
};

// --------------------------------------------------------------------
const handleSelectChange = (e) => {  
  const keyValue = e.target.name
  const openPhoneCaseCopy = {...openPhoneEditCase, [keyValue]: e.target.value };
  setOpenPhoneEditCase(openPhoneCaseCopy);
};


//-----------------------------------------------------------------------
const handleRadioChange = (e) => {  
  const openPhoneCaseCopy = {...openPhoneEditCase, nationality: e.target.value };

  setOpenPhoneEditCase(openPhoneCaseCopy);
};

// Update Function =======================================================
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
      nationality: openPhoneEditCase.nationality,
      birthday: openPhoneEditCase.birthday,
      callingPlan: openPhoneEditCase.callingPlan,
      controlNo: openPhoneEditCase.controlNo,
      memo: openPhoneEditCase.memo,
      sellCom: openPhoneEditCase.sellCom,
    });    
    
    CompletedUpdateDialogOpen();
    handleClickClose();

  } catch (e) {
    console.error("Error adding document: ", e);
  }

  handleClickClose();
};

// Delete Function =======================================================
const handleDelete = async (e) => {
  e.preventDefault();

  try {
    const docRef = await deleteDoc(doc(db, "CreativeNetworks", id));

    CompletedDeletDialogOpen();
    handleClickDeleteClose();

  } catch (e) {
    console.error("Error adding document: ", e);
  }
  
  handleClickDeleteClose();
};


// useEffect 1 Start ========================================================
useEffect(()=>{

  getPhoneCaseEdit();

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
  getTelComName();

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
  getSellComName();

}, []);


// useEffect 2 Start ========================================================
useEffect(()=>{

  // 개통처 리스트 읽어오기 --------------------------------------------------
  const getOpenComName = async () => {
    let data = [];
    const querySnapshot = await getDocs(query(collection(db, "openComName"), orderBy("comName", "asc"), where("telComName", "==", openPhoneEditCase.telCom)));

    querySnapshot.forEach((doc) => {
      data.push({...doc.data(), id: doc.id,})
      // data.push(doc.data().comName);
    });
    setOpenComNameList(data);
  }    
  getOpenComName();

}, [openPhoneEditCase.telCom]);


// useEffect 3 Start ========================================================
useEffect(()=>{

  // 요금제 읽어오기 --------------------------------------------------
  const getOpenCallingPlan = async () => {
    let data = [];
    const querySnapshot = await getDocs(query(collection(db, "callingPlanName"), orderBy("planName", "asc"), where("openComName", "==", openPhoneEditCase.openCom)));

    querySnapshot.forEach((doc) => {
      data.push({...doc.data(), id: doc.id,})
      // data.push(doc.data().comName);
    });
    setOpenCallingPlanList(data);
  }    
  getOpenCallingPlan();

}, [openPhoneEditCase.openCom]);



// ------------------------------------------------------------------------------------
// return 시작 ------------------------------------------------------------------------
// ------------------------------------------------------------------------------------

return (
  <>
  <div style={{display: 'flex',  justifyContent: 'center' }}>
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker sx={{ width: '100%', "& .MuiInputBase-input": { height: "42px", paddingTop: 0, paddingBottom: 0 } }} label={["개통일"]}
                              format="YYYY-MM-DD"
                              id="openDate" 
                              value={dayjs(openPhoneEditCase.openDate)} onChange={(newValue) => setOpenPhoneEditCase({...openPhoneEditCase, openDate: dayjs(newValue).format("YYYY-MM-DD")})} />
              </LocalizationProvider> 
            </TableCell>
            
            <TableCell>
              <FormControl sx={{ m: 0, minWidth: 210 }} size="small" fullWidth>
                  <InputLabel id="demo-simple-select">통신사</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    label="통신사"
                    name="telCom"                      
                    value={openPhoneEditCase.telCom}
                    onChange={handleSelectChange}
                  >
                    {telComNameList.map((com) => (
                      <MenuItem key={com.id} value={com.comName}>{com.comName}</MenuItem>)
                    )}
                  </Select>
                </FormControl>
            
            </TableCell>
            <TableCell>
              {/* <TextField id="openCom" label="개통처" type="text" value={openPhoneEditCase.openCom} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" /> */}
              <FormControl sx={{ m: 0, minWidth: 210 }} size="small" fullWidth>
                  <InputLabel id="demo-simple-select">개통처</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    label="개통처"
                    name="openCom"                      
                    value={openPhoneEditCase.openCom}
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
                  <InputLabel id="demo-simple-select">요금제</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    label="요금제"
                    name="callingPlan"                      
                    value={openPhoneEditCase.callingPlan}
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
              <FormControl size="small" fullWidth>
                  <InputLabel id="demo-simple-select">유형</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    label="유형"
                    name="openType"                      
                    value={openPhoneEditCase.openType}
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
              <FormControl sx={{ m: 0, minWidth: 210 }} size="small" fullWidth>
                <InputLabel id="demo-simple-select">타입</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  label="타입"
                  name="type"                      
                  value={openPhoneEditCase.type}
                  onChange={handleSelectChange}
                >
                  <MenuItem value={'USIM'}>USIM</MenuItem>
                  <MenuItem value={'단말기'}>단말기</MenuItem>
                </Select>
              </FormControl>
            </TableCell>

            <TableCell>
              <TextField id="customerName" label="고객명" type="text" value={openPhoneEditCase.customerName} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
            </TableCell>
            <TableCell>
              <TextField id="phoneNo" label="이동번호" type="text" value={openPhoneEditCase.phoneNo} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
            </TableCell>
            <TableCell>
              <TextField id="birthday" label="생년월일" type="text" value={openPhoneEditCase.birthday} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
            </TableCell>

            
            
          </TableRow>

          <TableRow>

            <TableCell>
              <Autocomplete size="small"
                value={openPhoneEditCase.sellCom}
                onChange={(event, newValue) => {
                  setOpenPhoneEditCase({...openPhoneEditCase, 'sellCom': newValue });
                }}  

                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                id="controllable-states-demo"
                options={sellComNameList}
                renderInput={(params) => <TextField {...params} label="판매처" />}
              />
            </TableCell>

            <TableCell>
              <TextField id="controlNo" label="관리번호" type="text" value={openPhoneEditCase.controlNo} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
            </TableCell>
            <TableCell>
              <TextField id="memo" label="메모" type="text" value={openPhoneEditCase.memo} onChange={handleValueChange} autoFocus margin="dense" fullWidth variant="standard" />
            </TableCell>

            

            <TableCell>            
              <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">내국인 / 외국인</FormLabel>
                <RadioGroup row 
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={openPhoneEditCase.nationality}
                  onChange={handleRadioChange}
                >
                  <FormControlLabel value="내국인" control={<Radio size="small"/>} label="내국인" />
                  <FormControlLabel value="외국인" control={<Radio size="small"/>} label="외국인" />
                </RadioGroup>
              </FormControl>
            </TableCell>

          </TableRow>
        </TableBody>
        </Table>

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClickClose}>CANCLE</Button>
        <Button onClick={handleUpdate}>UPDATE</Button>
      </DialogActions>
  </Dialog>

  <Dialog
    open={isCompUpdateDialogOpen}
    onClose={handleClickCompUpdateDialogClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle sx={{color: pink[500], fontWeight: '400', display: 'flex', alignItems: 'center'}}>
      <ReportIcon sx={{mr: 1}}/>{" 개통내역 수정 "}
    </DialogTitle>
    <Divider />
    <DialogContent>      
      <Typography>
        개통내역이 정상적으로 수정되었습니다.
      </Typography>
    </DialogContent>
    <Divider />
    <DialogActions>
      <Button onClick={handleClickCompUpdateDialogClose}>OK</Button>
    </DialogActions>
  </Dialog>

  <Dialog
    open={isDeleteDialogOpen}
    onClose={handleClickDeleteClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle sx={{color: pink[500], fontWeight: '400', display: 'flex', alignItems: 'center'}}>
      <ReportIcon sx={{mr: 1}}/>{" 개통내역을 삭제하시겠습니까 ?"}
    </DialogTitle>
    <Divider />
    <DialogContent>      
      <Typography>
        선택한 개통내역이 완전하게 삭제됩니다.
      </Typography>
      <Typography sx={{mt: 0.5}}>
        삭제 후에는 되돌릴 수 없습니다. 그래도 삭제하시겠습니까 ? 
      </Typography>
    </DialogContent>
    <Divider />
    <DialogActions>
      <Button onClick={handleClickDeleteClose}>CANCLE</Button>
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
      <ReportIcon sx={{mr: 1}}/>{" 개통내역 삭제 "}
    </DialogTitle>
    <Divider />
    <DialogContent>      
      <Typography>
        개통내역이 정상적으로 삭제되었습니다.
      </Typography>
    </DialogContent>
    <Divider />
    <DialogActions>
      <Button onClick={handleClickCompDeleteDialogClose}>OK</Button>
    </DialogActions>
  </Dialog>


  </>
);

}

export default OpenPhoneEdit
