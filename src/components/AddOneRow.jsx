// react & material UI import ==================================================
import { TableCell, TableRow } from '@mui/material';
import React from 'react'
import { styled } from '@mui/material/styles';
import OpenPhoneEdit from './OpenPhoneEdit';



//  ======================================================================================
// Function 시작 =========================================================================
// =======================================================================================

function AddOneRow(props) {

// Initialize Variable ==================================================
const {id, no, cell1, cell2, cell3, cell4, cell5, cell6} = props;

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
    <TableCell align='center'>{no}</TableCell>
    <TableCell align='center'>{cell1}</TableCell>
    <TableCell align='center'>{cell2}</TableCell>
    <TableCell align='center'>{cell3}</TableCell>
    <TableCell align='center'>{cell4}</TableCell>
    <TableCell align='center'>{cell5}</TableCell>
    <TableCell align='center'>{cell6}</TableCell>
  </StyledTableRow>
);

}

export default AddOneRow