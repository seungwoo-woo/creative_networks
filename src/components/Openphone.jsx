import { TableCell, TableRow } from '@mui/material';
import React from 'react'
import { styled } from '@mui/material/styles';

function OpenPhone(props) {

  const {no, telCom, openCom, type, openDate, openType, phoneModel, phoneSerial, phoneColor, customerName, phoneNo, birthday, callingPlan, controlNo, memo, sellCom} = props;

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));



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
      <TableCell>{birthday}</TableCell>
      <TableCell>{callingPlan}</TableCell>
      <TableCell>{controlNo}</TableCell>
      <TableCell>{memo}</TableCell>
      <TableCell>{sellCom}</TableCell>
    </StyledTableRow>
  )
}

export default OpenPhone