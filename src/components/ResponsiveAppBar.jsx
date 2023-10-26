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
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
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

const [ anchorElUser, setAnchorElUser ] = React.useState(null);
const [ userName, setUserName ] = React.useState(null);
const [ userGrade, setUserGrade ] = React.useState(null);
const [ companyName, setCompanyName ] = React.useState(null);
const settings = ['Logout'];


// Define subFunction ==================================================
//-----------------------------------------------------------------------
const handleOpenUserMenu = (event) => {
  setAnchorElUser(event.currentTarget);
};


const handleJustCloseUserMenu = () => {
  setAnchorElUser(null);
}
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

  const getUserName = () => {    

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('user 있음');
        let data = '';
        let companydata = '';
        let userGrade = '';
        const querySnapshot = await getDocs(query(collection(db, "comUsers"), where("id", "==", user.uid)));
        querySnapshot.forEach((doc) => {
        data = (doc.data().name);
        companydata = (doc.data().company);
        userGrade = (doc.data().userGrade);
        setUserName(data);
        setCompanyName(companydata);
        setUserGrade(userGrade);
        });
      } else {
        navigate('/');
      }
    });
    
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
            <Typography variant="h5" component="a" href="/dashBoard"
              sx={{ mr: 4, display: { xs: 'none', md: 'flex' }, fontWeight: 400, color: 'inherit', textDecoration: 'none' }}
            >
              Creactive Networks
            </Typography>

            <Typography variant="h10" component="a" href="/openPhoneList"
              sx={{ mr: 2, pt: 0.8, display: { xs: 'none', md: 'flex' }, fontWeight: 200, color: 'inherit', textDecoration: 'none' }}
            >
              개통 리스트
            </Typography>

            <Typography variant="h10" component="a" href="/calculate"
              sx={{ mr: 2, pt: 0.8, display: { xs: 'none', md: 'flex' }, fontWeight: 200, color: 'inherit', textDecoration: 'none' }}
            >
              정산
            </Typography>

            {userGrade === 'A' ? <Typography variant="h10" component="a" href="/admin"
              sx={{ mr: 2, pt: 0.8, display: { xs: 'none', md: 'flex' }, fontWeight: 200, color: 'inherit', textDecoration: 'none' }}
            >
              관리자페이지
            </Typography> : ""}
          </Box>


          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>

            <Typography variant="h6" sx={{ mr: 3,mt: 1, fontWeight: 400, color: 'yellow'}}>
              {companyName} 
            </Typography>

            <Tooltip title="">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: deepOrange[500], width: 50, height: 50 }}>{userName}</Avatar>
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
              onClose={handleJustCloseUserMenu}
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