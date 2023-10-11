import { TableCell, TableRow } from '@mui/material';
import React from 'react'

function Openphone(props) {

  const {no, telCom, openCom, type, openDate, openType, phoneModel, phoneSerial, phoneColor, customerName, phoneNo, birthday, callingPlan, controlNo, memo, sellCom} = props;


  return (
    <TableRow>
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
    </TableRow>
  )
}

export default Openphone