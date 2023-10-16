import React, { useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { Box, IconButton, Paper, Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow, tableCellClasses } from '@mui/material';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import OpenPhoneAdd from '../components/OpenPhoneAdd';
import OpenPhone from '../components/OpenPhone';


// firestore ============================================================
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { firebaseConfig } from '../firebase';
import { blue } from '@mui/material/colors';
// ======================================================================

// Initialize Firebase ==================================================
const app = initializeApp(firebaseConfig);
// ======================================================================

// Initialize Cloud Firestore and get a reference to the service ========
const db = getFirestore(app);
// ======================================================================



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

// Table Pagination Function End ----------------------------------------------------------





const tableHeadList = ['No.', '통신사', '개통처', '타입', '개통일', '유형', '모델명', '일련번호', '색상', '고객명', '이동번호', '생년월일', '음성요금제', '관리번호', '메모', '판매처'];

function OpenPhoneList() {

  const [openPhoneList, setOpenPhoneList] = useState([]);
  // const [progress, setProgress] = useState(0);

  const getDataRefresh = async () => {
    let data = [];
    const querySnapshot = await getDocs(query(collection(db, "CreativeNetworks"), orderBy("no", "desc"), where("isDeleted", "==", 0)));

    querySnapshot.forEach((doc) => {
      data.push({...doc.data(), id: doc.id,})
      // console.log(doc.id)
    });
    setOpenPhoneList(data);
  }



  useEffect(()=>{

    const getData = async () => {
      let data = [];
      const querySnapshot = await getDocs(query(collection(db, "CreativeNetworks"), orderBy("no", "desc"), where("isDeleted", "==", 0)));

      querySnapshot.forEach((doc) => {
        data.push({...doc.data(), id: doc.id,})
        // console.log(doc.id)
      });
      setOpenPhoneList(data);
    }
    
    getData();

  }, []);




    // Table Pagination ----------------------------------------
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
  
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - openPhoneList.length) : 0;
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    // Table Pagination ----------------------------------------


    // Table customize Start ------------------------------------------

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

    // Table customize End ------------------------------------------

    







  return (
    <>
    <div style={{marginTop: 30}}>
      <OpenPhoneAdd getDataRefresh = {getDataRefresh} />
    </div>

    <Paper style={{marginTop: 10, marginLeft: 10, marginRight: 10}} elevation={3}>
      <Table stickyHeader aria-label="sticky table">        
        <TableHead>
          <TableRow>
            {tableHeadList.map((item) => {
                return <StyledTableCell key={item} style={{fontWeight: 400}} align='center'>{item}</StyledTableCell>
            })}
          </TableRow>
        </TableHead>

        <TableBody>
          {(rowsPerPage > 0 ?
            openPhoneList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)              
            : openPhoneList).map((op) => {
                return (<OpenPhone 
                  key = {op.id}
                  no = {op.no}
                  telCom = {op.telCom}
                  openCom = {op.openCom}
                  type = {op.type}
                  openDate = {op.openDate}
                  openType = {op.openType}
                  phoneModel = {op.phoneModel}
                  phoneSerial = {op.phoneSerial}
                  phoneColor = {op.phoneColor}
                  customerName = {op.customerName}
                  phoneNo = {op.phoneNo}
                  birthday = {op.birthday}
                  callingPlan = {op.callingPlan}
                  controlNo = {op.controlNo}
                  memo = {op.memo}
                  sellCom = {op.sellCom} 
                  />
                );    // return ----------
            })
          }
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={16}
              count={openPhoneList.length}
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
    </Paper>

    </>
  );
}

export default OpenPhoneList;