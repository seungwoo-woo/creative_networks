// react & material UI import ==================================================
import React, { useEffect, useState } from "react";
import * as XLSX  from 'xlsx';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { useTheme } from '@emotion/react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Table, IconButton, TableHead, TableBody, TableCell, TableRow, TableFooter, TablePagination, TextField, Select, MenuItem, FormControl, InputLabel, tableCellClasses } from "@mui/material";
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import AddOneRow from "../components/AddOneRow";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// firebase import=======================================================
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../firebase';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy} from "firebase/firestore";


// Initialize Firebase ==================================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Define subFunction ================================================
// Table Pagination Function Start -----------------------------------------------------
function TablePaginationActions(props) {
  const theme = useTheme();  
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
};

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};



//  ======================================================================================
// Function 시작 =========================================================================
// =======================================================================================

function AdminPage(props) {

// Initialize Variable ==================================================
const [isSellComOpen, setIsSellComOpen] = useState(false);
const [sellComList, setSellComList] = useState([]);
const [jsonData, setJsonData] = useState();




// Table Pagination Start ----------------------------------------
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(10);


// Avoid a layout jump when reaching the last page with empty rows.
const emptyRows =
  page > 0 ? Math.max(0, (1 + page) * rowsPerPage - sellComList.length) : 0;


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


// Button style ----------------------------------------------------
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


// Define subFunction ==================================================
//-----------------------------------------------------------------------
const hdcSellComOpen = () => {
  setIsSellComOpen(true);
};

//-----------------------------------------------------------------------
const hdcTelComOpen = () => {
  setIsSellComOpen(false);
};

//----------------------------------------------------------------------- 
const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

//----------------------------------------------------------------------- 
const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
};  

//----------------------------------------------------------------------- 
const ExcelToJson = (e) => {
  const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const jsonData 
        = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        setJsonData(jsonData);
      };

      reader.readAsBinaryString(file);
    }
}


// -----------------------------------------------------------
const SellComUpload = () => {
  try {
    jsonData.map(async (item) => {
      const docRef = await addDoc(collection(db, "sellComName"), {
        comName: item.판매처,
        comNo: item.사업자번호,
        isDeleted: 0 
    });    
    });
    window.location.reload();
    alert("판매처 정보가 등록되었습니다.");
  } catch (e) {
    console.error("Error adding document: ", e);
  }

}


// useEffect 1 Start ========================================================
useEffect(()=>{    

  // 판매점 리스트 읽어오기 --------------------------------------------------
  const getSellComName = async () => {
    let data = [];
    const querySnapshot = await getDocs(query(collection(db, "sellComName"), orderBy("comName", "asc"), where("isDeleted", "==", 0)));
    querySnapshot.forEach((doc) => {
      data.push({...doc.data(), id: doc.id,})
      // data.push(doc.data().comName);
    });
    setSellComList(data);
  }

  getSellComName();

}, []);




// ------------------------------------------------------------------------------------
// return 시작 ------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
return (
  <>
    <ResponsiveAppBar />

    <Typography sx={{ mt: 3, ml: 4, fontWeight: 400, display: 'flex', alignItems: 'center' }} variant="h4" >
      <NoteAltIcon fontSize="large" sx={{ mr: 2}} /> 관리자 페이지
    </Typography>

    <Box sx={{ mt: 1, ml: 2, fontWeight: 400, display: 'flex', alignItems: 'center' }} >
        <Paper sx={{ mt: 1, ml: 2, width: 300, height: 500, display: 'flex', justifyContent: 'center', alignItems: 'center' }} elevation={5} >
          <Stack spacing={3} >            
            <Button sx={{ width: 250}} variant="contained" size="large" onClick={hdcSellComOpen} >판매처 관리</Button>
            <Button variant="contained" size="large" onClick={hdcTelComOpen}>통신사 관리</Button>
            <Button variant="contained" size="large">개통처 관리</Button>
            <Button variant="contained" size="large">요금제 관리</Button>
            <Button variant="contained" size="large">사용자 관리</Button>            
          </Stack>
        </Paper>



        <Paper sx={{ mt: 1, ml: 2, pl: 5, pr: 5, width: 1150, height: 500 }} elevation={5} >
          
          {/* 통신사 테이블-------------------------------------------*/}
          { isSellComOpen && 
          <>
          <Table stickyHeader size='small' aria-label="sticky table">        
            <TableHead>
              <TableRow>
                <StyledTableCell style={{fontWeight: 400}} align='center' >No.</StyledTableCell>
                <StyledTableCell style={{fontWeight: 400}} align='center' >판매처</StyledTableCell>
                <StyledTableCell style={{fontWeight: 400}} align='center' >사업자번호</StyledTableCell>
                <StyledTableCell style={{fontWeight: 400}} align='center' >은행</StyledTableCell>
                <StyledTableCell style={{fontWeight: 400}} align='center' >계좌번호</StyledTableCell>
                <StyledTableCell style={{fontWeight: 400}} align='center' >담당자</StyledTableCell>
                <StyledTableCell style={{fontWeight: 400}} align='center' >ACTION</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {(rowsPerPage > 0 ?
                sellComList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)              
                : sellComList).map((item, index) => {
                    return (<AddOneRow 
                      key = {item.id}
                      id = {item.id} 
                      no = {index + 1 + (page * rowsPerPage)}
                      cell1 = {item.comName}
                      cell2 = {item.comNo}
                      cell3 = {item.cell3}
                      cell4 = {item.cell4}
                      cell5 = {item.cell5}
                      cell6 = {item.cell6}
                      />
                    );    // return ----------
                })
              }
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={4} />
                </TableRow>
              )}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={16}
                  count={sellComList.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>

            

          </Table>

          <Button sx={{mt: 2}} component="label" variant="contained" onChange={ExcelToJson} startIcon={<CloudUploadIcon />}>
            Select Excel file
            <VisuallyHiddenInput type="file" 
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"  />
          </Button>
          <Button sx={{mt: 2, ml: 2}} variant="outlined" onClick={SellComUpload}>UPLOAD</Button>
          </>
          }



        </Paper>
    </Box>
    
  </>
);

}

export default AdminPage