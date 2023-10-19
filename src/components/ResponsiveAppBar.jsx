import React from 'react'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import SatelliteAltTwoToneIcon from '@mui/icons-material/SatelliteAltTwoTone';


//  ======================================================================================
// Function 시작 =========================================================================
// =======================================================================================

function ResponsiveAppBar() {

  return (
    <AppBar position="relative" >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          
          <SatelliteAltTwoToneIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          
          <Typography variant="h5" component="a" href="/openPhoneList"
            sx={{ mr: 4, display: { xs: 'none', md: 'flex' }, fontWeight: 400, color: 'inherit', textDecoration: 'none' }}
          >
            Creactive Networks
          </Typography>

          <Typography variant="h10" component="a" href="/calculate"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, fontWeight: 200, color: 'inherit', textDecoration: 'none' }}
          >
            정산
          </Typography>

          <Typography variant="h10" component="a" href="/admin"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, fontWeight: 200, color: 'inherit', textDecoration: 'none' }}
          >
            관리자페이지
          </Typography>

        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar