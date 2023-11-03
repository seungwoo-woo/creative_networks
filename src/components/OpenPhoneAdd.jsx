// react & material UI import ==================================================
import React, { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
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
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import Slide from '@mui/material/Slide';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs from "dayjs";
import Autocomplete from '@mui/material/Autocomplete';
import { DialogContent, DialogTitle, DialogContentText, DialogActions, Table, TableBody, TableCell, TableRow, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";


// firebase import=======================================================
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../firebase';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy } from "firebase/firestore";


// Initialize Firebase ==================================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Define subFunction ================================================
// Modal Transition --------------------------------------------------
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



// // Table style ----------------------------------------------------
// const StyledDesktopDataPicker = styled(DesktopDatePicker)`
// .css-nxo287-MuiInputBase-input-MuiOutlinedInput-input {
//   padding-top: 9px;
//   padding-bottom: 8px;
// }
// `



//  ======================================================================================
// Function 시작 =========================================================================
// =======================================================================================

function OpenPhoneAdd(props) {

// Initialize Variable ==================================================
const getDataRefresh = props.getDataRefresh;
const userGrade = props.userGrade;
const userCompanyName = props.userCompanyName;
const setOpenPhoneList = props.setOpenPhoneList;

const today = new Date();
const initialOpenDate = dayjs(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`).format("YYYY-MM-DD");

const [openPhoneCase, setOpenPhoneCase] = 
  useState({ no: '', telCom: '', openCom: '', type: '', openDate: initialOpenDate, openType: '', phoneModel: '', phoneSerial: '', phoneColor: '', customerName: '', phoneNo: '', birthday: '', callingPlan: '', controlNo: '', memo: '', sellCom: '', nationality: '내국인', isDeleted: 0});
const [isDialogOpen, setIsDialogOpen] = useState(false);
const [isCompSaveDialogOpen, setIsCompSaveDialogOpen] = useState(false);
const [sellComNameList, setSellComNameList] = useState([]);
const [telComNameList, setTelComNameList] = useState([]);
const [openComNameList, setOpenComNameList] = useState([]);
const [openCallingPlanList, setOpenCallingPlanList] = useState([]);
const [inputValue, setInputValue] = useState('');            // Autocomplete sellComName
const [findInputValue, setFindInputValue] = useState('');    // Autocomplete FindSellComName


// date picker ---------------------------------
const initialStartDay = dayjs(`${today.getFullYear()}-${today.getMonth()+1}-01`).format("YYYY-MM-DD");
const initialEndDay = dayjs(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`).format("YYYY-MM-DD");

const [startDate, setStartDate] = useState(initialStartDay);
const [endDate, setEndDate] = useState(initialEndDay);
const [findSellCom, setFindSellCom] = useState();
// --------------------------------------------------------



// Define subFunction ==================================================
//-----------------------------------------------------------------------
const handleClickOpen = () => {
  setIsDialogOpen(true);
};


//-----------------------------------------------------------------------
const handleClickClose = () => {
  setOpenPhoneCase({ no: '', telCom: '', openCom: '', type: '', openDate: initialOpenDate, openType: '', phoneModel: '', phoneSerial: '', phoneColor: '', customerName: '', phoneNo: '', birthday: '', callingPlan: '', controlNo: '', memo: '', sellCom: '', nationality: '내국인', isDeleted: 0});
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
const handleRadioChange = (e) => {  
  const openPhoneCaseCopy = {...openPhoneCase, nationality: e.target.value };

  setOpenPhoneCase(openPhoneCaseCopy);
};


//-----------------------------------------------------------------------
const handleSubmit = async (e) => {
  e.preventDefault();

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
      nationality: openPhoneCase.nationality,
      isDeleted: 0 
    });

    setIsCompSaveDialogOpen(true);
    handleClickClose();
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  
  handleClickClose();
};


// find function ------------------------------------------------
const findFunction = async () => {

  console.log(findSellCom);

  let data = [];

    if (userGrade === 'A' || userGrade === 'B') {
      if (findSellCom) {
        const querySnapshot = await getDocs(query(collection(db, "CreativeNetworks"), where("openDate", ">=", startDate), where("openDate", "<=", endDate), orderBy("openDate", "desc"), where("isDeleted", "==", 0), where("sellCom", "==", findSellCom)));
        querySnapshot.forEach((doc) => {
          data.push({...doc.data(), id: doc.id,})
        });
      } else {
        const querySnapshot = await getDocs(query(collection(db, "CreativeNetworks"), where("openDate", ">=", startDate), where("openDate", "<=", endDate), orderBy("openDate", "desc"), where("isDeleted", "==", 0)));
        querySnapshot.forEach((doc) => {
          data.push({...doc.data(), id: doc.id,})
        });
      }
      
    } else {
      const querySnapshot = await getDocs(query(collection(db, "CreativeNetworks"), where("openDate", ">=", startDate), where("openDate", "<=", endDate), orderBy("openDate", "desc"), where("isDeleted", "==", 0), where("sellCom", "==", userCompanyName)));
      querySnapshot.forEach((doc) => {
        data.push({...doc.data(), id: doc.id,})
      });
    }
    setOpenPhoneList(data);

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
  <div style={{display: 'flex',  justifyContent: 'space-between', alignItems: 'flex-end', paddingRight: 10, paddingLeft: 10 }}>      
    <Typography variant="h4" 
      sx={{ ml: 1, display: { xs: 'none', md: 'flex' }, 
      fontWeight: 400, color: '#1976D2' }}>
      Creative Networks 개통 리스트
    </Typography>


    {/* 검색 기능 구현 --------------------------- */}
    
    <div style={{ width: 690, display: 'flex',  justifyContent: 'space-between', alignItems: 'flex-end' }}>

    {(userGrade === 'A' || userGrade === 'B') ?
    <Autocomplete size="small"
      value={findSellCom}
      onChange={(event, newValue) => {
        setFindSellCom(newValue);
      }}  

      InputValue={findInputValue}
      onInputChange={(event, newInputValue) => {
        setFindInputValue(newInputValue);
      }}
      id="controllable-states-demo"
      options={sellComNameList}
      sx={{ width: 210 }}
      renderInput={(params) => <TextField {...params} label="판매처" />}
    /> : <div style={{ width: 210 }}>  </div> }

    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker sx={{ width: 200, "& .MuiInputBase-input": { height: "40px", paddingTop: 0, paddingBottom: 0 }}}
                    label={["검색 시작일"]}
                    format="YYYY-MM-DD"
                    id="startDate" 
                    value={dayjs(startDate)} onChange={(newValue) => setStartDate(dayjs(newValue).format("YYYY-MM-DD"))} />
        <DesktopDatePicker sx={{ width: 200, "& .MuiInputBase-input": { height: "40px", paddingTop: 0, paddingBottom: 0 }}}
                    label={["검색 종료일"]}
                    format="YYYY-MM-DD"
                    id="startDate" 
                    value={dayjs(endDate)} onChange={(newValue) => setEndDate(dayjs(newValue).format("YYYY-MM-DD"))} />
    </LocalizationProvider> 


    <Button sx={{height:'40px', width: '70px'}} variant='contained' color='success' onClick={findFunction}>
      검색
    </Button>

    </div>
    {/* 검색 기능 구현 --------------------------- */}




    
    {(userGrade === 'A' || userGrade === 'B') && <Button sx={{height:'40px'}} variant='contained' color='primary' onClick={handleClickOpen}>
      신규등록
    </Button>}
  </div>


{/* 신규 등록 Dialog Open ------------------------ */}
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
                  <DesktopDatePicker label={["개통일"]}
                              format="YYYY-MM-DD"
                              id="openDate" 
                              value={dayjs(openPhoneCase.openDate)} onChange={(newValue) => setOpenPhoneCase({...openPhoneCase, openDate: dayjs(newValue).format("YYYY-MM-DD")})} />
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
              <FormControl size="small" fullWidth>
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
              <Autocomplete size="small" 
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
                renderInput={(params) => <TextField {...params} label="판매처" />}
              />
            </TableCell>

            <TableCell>            
              <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">내국인 / 외국인</FormLabel>
                <RadioGroup row
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={openPhoneCase.nationality}
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

// Component End =========================================================
}

export default OpenPhoneAdd
