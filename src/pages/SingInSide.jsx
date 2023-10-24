// react & material UI import ==================================================
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


// firebase import=======================================================
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../firebase';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


// Initialize Firebase ==================================================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// Initialize Variable ==================================================
const defaultTheme = createTheme();


// Define subFunction ================================================
function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
        (주)에셀트리
      {'  '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}



//  ======================================================================================
// Function 시작 =========================================================================
// =======================================================================================

export default function SignInSide() {

// Initialize Variable ==================================================
const [errMsgOpen, setErrMsgOpen] = React.useState(false);
const [ msg, setMsg ] = React.useState('');
const navigate = useNavigate();


// Define subFunction ==================================================
//-----------------------------------------------------------------------
const handleSignInErrMsgOpen = () => {
  setErrMsgOpen(true);
};


//-----------------------------------------------------------------------
const handleCloseError = () => {
  setErrMsgOpen(false);
};


//-----------------------------------------------------------------------
const handleSubmit = (event) => {

  event.preventDefault();

  const data = new FormData(event.currentTarget);

  const auth = getAuth();
  signInWithEmailAndPassword(auth, data.get('email'), data.get('password'))
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      navigate('/dashBoard');
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      setMsg('email 또는 password에 오류가 있습니다.');

      handleSignInErrMsgOpen();
    });    
};



// ------------------------------------------------------------------------------------
// return 시작 ------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
return (
  <>
  <ThemeProvider theme={defaultTheme}>
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />

      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>

            <Grid container>
              <Grid item xs>
              </Grid>
              <Grid item>
                <Link href="/signUp" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>

            </Grid>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  </ThemeProvider>

  {/* SingUp error alert */}
  <Dialog
      open={errMsgOpen}
      onClose={handleCloseError}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"로그인 오류"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {msg}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseError} autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  </>
);

}