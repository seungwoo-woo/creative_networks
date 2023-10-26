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
const {id, no, telCom, openCom, type, openDate, openType, phoneModel, phoneSerial, phoneColor, customerName, phoneNo, birthday, callingPlan, controlNo, memo, sellCom, getDataRefresh, userGrade} = props;

// Table style ----------------------------------------------------
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


// ------------------------------------------------------------------------------------
// return 시작 ------------------------------------------------------------------------
// ------------------------------------------------------------------------------------

return (
  <StyledTableRow>
    <TableCell>{no}</TableCell>
    <TableCell>{telCom}</TableCell>
    <TableCell>{openCom}</TableCell>
    <TableCell>{type}</TableCell>
    <TableCell>{openDate}</TableCell>
    <TableCell>{openType}</TableCell>
    <TableCell>{phoneModel}</TableCell>
    <TableCell>{phoneSerial}</TableCell>
    <TableCell>{phoneColor}</TableCell>
    <TableCell>{customerName}</TableCell>
    <TableCell>{phoneNo}</TableCell>
    {/* <TableCell>{birthday}</TableCell> */}
    <TableCell>{callingPlan}</TableCell>
    {/* <TableCell>{controlNo}</TableCell> */}
    <TableCell>{memo}</TableCell>
    <TableCell>{sellCom}</TableCell>
    { (userGrade === 'A') && <TableCell><OpenPhoneEdit id={id} getDataRefresh={getDataRefresh}/></TableCell> }
  </StyledTableRow>
);

}

export default OpenPhone
