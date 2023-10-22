// react & material UI import ==================================================
import React from 'react'
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';


// firebase import=======================================================
import { getAuth } from "firebase/auth";
import ResponsiveAppBar from '../components/ResponsiveAppBar';



//  ======================================================================================
// Function 시작 =========================================================================
// =======================================================================================

function AdminPage(props) {


// ------------------------------------------------------------------------------------
// return 시작 ------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
return (
  <>
    <ResponsiveAppBar />
    {/*  */}
    <Typography sx={{ mt: 3, ml: 4, fontWeight: 400, display: 'flex', alignItems: 'center' }} variant="h4" >
      <NoteAltIcon fontSize="large" sx={{ mr: 2}} /> 관리자 페이지
    </Typography>

    <Box sx={{ mt: 1, ml: 2, fontWeight: 400, display: 'flex', alignItems: 'center' }} >
        <Paper sx={{ mt: 1, ml: 2, width: 300, height: 500, display: 'flex', justifyContent: 'center', alignItems: 'center' }} elevation={5} >
          <Stack spacing={3} >            
            <Button sx={{ width: 220}} variant="contained" size="large">판매처 관리</Button>
            <Button variant="contained" size="large">통신사 관리</Button>
            <Button variant="contained" size="large">개통처 관리</Button>
            <Button variant="contained" size="large">요금제 관리</Button>
            <Button variant="contained" size="large">사용자 관리</Button>            
          </Stack>
        </Paper>

        <Paper sx={{ mt: 1, ml: 2, width: 1150, height: 500, display: 'flex', alignItems: 'center' }} elevation={5} >
          1
        </Paper>
    </Box>
    
  </>
);

}

export default AdminPage