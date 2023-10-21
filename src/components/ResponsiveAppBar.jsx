// react & material UI import ==================================================
import React from 'react'
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import SatelliteAltTwoToneIcon from '@mui/icons-material/SatelliteAltTwoTone';
import { Avatar, Box, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { deepOrange } from '@mui/material/colors';


// firebase import=======================================================
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../firebase';
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where} from "firebase/firestore";


// Initialize Firebase ==================================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



//  ======================================================================================
// Function 시작 =========================================================================
// =======================================================================================
function ResponsiveAppBar() {

// Initialize Variable ==================================================
const navigate = useNavigate();
const auth = getAuth();
const user = auth.currentUser;
const [ anchorElUser, setAnchorElUser ] = React.useState(null);
const [ userName, setUserName ] = React.useState(null);
const settings = ['Logout'];


// Define subFunction ==================================================
//-----------------------------------------------------------------------
const handleOpenUserMenu = (event) => {
  setAnchorElUser(event.currentTarget);
};


//-----------------------------------------------------------------------
const handleCloseUserMenu = () => {
  setAnchorElUser(null);
  signOut(auth).then(() => {
    navigate('/');
  }).catch((error) => {
    // An error happened.
  });
};


// useEffect Start ========================================================
React.useEffect(()=>{

  const getUserName = async () => {
    let data = '';
    const querySnapshot = await getDocs(query(collection(db, "comUsers"), where("id", "==", user.uid)));
    querySnapshot.forEach((doc) => {
      data = (doc.data().name);
    });

    setUserName(data);
  }    
  getUserName();

}, []);



// ------------------------------------------------------------------------------------
// return 시작 ------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
return (
  <AppBar position="relative" >
    <Container maxWidth="xl">
      <Toolbar disableGutters>        
        <SatelliteAltTwoToneIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
        
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Typography variant="h5" component="a" href="/openPhoneList"
              sx={{ mr: 4, display: { xs: 'none', md: 'flex' }, fontWeight: 400, color: 'inherit', textDecoration: 'none' }}
            >
              Creactive Networks
            </Typography>

            <Typography variant="h10" component="a" href="/calculate"
              sx={{ mr: 2, pt: 0.8, display: { xs: 'none', md: 'flex' }, fontWeight: 200, color: 'inherit', textDecoration: 'none' }}
            >
              정산
            </Typography>

            <Typography variant="h10" component="a" href="/admin"
              sx={{ mr: 2, pt: 0.8, display: { xs: 'none', md: 'flex' }, fontWeight: 200, color: 'inherit', textDecoration: 'none' }}
            >
              관리자페이지
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: deepOrange[500] }}>{userName}</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

      </Toolbar>
    </Container>
  </AppBar>
);

}

export default ResponsiveAppBar