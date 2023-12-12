// react & material UI import ==================================================
import { TableCell, TableRow } from '@mui/material';
import React from 'react'
import { styled } from '@mui/material/styles';
import OpenPhoneEdit from './OpenPhoneEdit';



//  ======================================================================================
// Function 시작 =========================================================================
// =======================================================================================

function OpenPhone(props) {

// Initialize Variable ==================================================
const {id, no, telCom, openCom, type, openDate, openType, phoneModel, phoneSerial, phoneColor, customerName, nationality, phoneNo, birthday, callingPlan, controlNo, memo, sellCom, getDataRefresh, userGrade} = props;


// Table style ----------------------------------------------------
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  // '&:last-child td, &:last-child th': {
  //   border: 0,
  // },
}));


// ------------------------------------------------------------------------------------
// return 시작 ------------------------------------------------------------------------
// ------------------------------------------------------------------------------------

return (
  <StyledTableRow>
    <TableCell padding='none' sx= {{paddingTop:0.6, paddingBottom:0.6}} align='center'>{no}</TableCell>
    <TableCell padding='none' align='left'>{telCom}</TableCell>
    <TableCell padding='none' align='left'>{openCom}</TableCell>
    <TableCell padding='none' align='center'>{type}</TableCell>
    <TableCell padding='none' align='center'>{openDate}</TableCell>
    <TableCell padding='none' align='center'>{openType}</TableCell>
    <TableCell padding='none' align='center'>{phoneModel}</TableCell>
    <TableCell padding='none' align='center'>{phoneSerial}</TableCell>
    <TableCell padding='none' align='center'>{phoneColor}</TableCell>
    <TableCell padding='none' align='left'>{customerName}</TableCell>
    <TableCell padding='none' align='center'>{phoneNo}</TableCell>
    <TableCell padding='none' align='center'>{nationality}</TableCell>
    <TableCell padding='none' align='left'>{callingPlan}</TableCell>
    {/* <TableCell>{controlNo}</TableCell> */}
    <TableCell padding='none' sx={{paddingLeft:1}} align='left'>{memo}</TableCell>
    <TableCell padding='none' align='left'>{sellCom}</TableCell>
    { (userGrade === 'A' || userGrade === 'B') && <TableCell padding='none' align='center'><OpenPhoneEdit id={id} getDataRefresh={getDataRefresh}/></TableCell> }
  </StyledTableRow>
);

// Component End =========================================================
}

export default OpenPhone
