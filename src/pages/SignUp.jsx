import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';

// firestore ============================================================
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../firebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, query, where, orderBy} from "firebase/firestore";

// ======================================================================

// Initialize Firebase ==================================================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// ======================================================================






function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      {/* <Link color="inherit" href="https://mui.com/"> */}
        (주)에셀트리
      {/* </Link>{' '} */}
      {'  '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}





//  ======================================================================================
// Function 시작 =========================================================================
// =======================================================================================

const defaultTheme = createTheme();

export default function SignUp() {

  const [open, setOpen] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  const [ msg, setMsg ] = React.useState('');
  const [sellComName, setSellComName ] = React.useState('');
  const [sellComNameList, setSellComNameList] = React.useState([]);
  const [inputValue, setInputValue] = React.useState('');    // sellComName



  React.useEffect(()=>{

    const getSellComName = async () => {
      let data = [];
      const querySnapshot = await getDocs(query(collection(db, "sellComName"), orderBy("comName", "asc"), where("isDeleted", "==", 0)));

      querySnapshot.forEach((doc) => {
        // data.push({...doc.data(), id: doc.id,})
        data.push(doc.data().comName);
      });
      setSellComNameList(data);
    }    
    getSellComName();

  }, []);
// ----------------------------------------------------------

  const navigate = useNavigate();


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    navigate('/');
  };

  const handleClickOpenError = () => {
    setOpenError(true);
  };

  const handleCloseError = () => {
    setOpenError(false);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();    
    const data = new FormData(event.currentTarget);

    createUserWithEmailAndPassword(auth, data.get('email'), data.get('password'))
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;      

      const docRef = addDoc(collection(db, "comUsers"), {
        id: user.uid,
        name: data.get('firstName'),
        company: sellComName,
        email: data.get('email'),
        isDeleted: 0 
      });

      handleClickOpen();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      if (errorMessage === 'Firebase: Error (auth/email-already-in-use).') {
        setMsg('동일한 email로 생성된 계정이 있습니다.');
      } 
      else if (errorMessage === 'Firebase: Error (auth/invalid-email).') {
        setMsg('email 형식이 잘못되었습니다.');
      }
      else if (errorMessage === 'Firebase: Password should be at least 6 characters (auth/weak-password).') {
        setMsg('password는 6자리 이상으로 설정하세요');
      }
      else {
        setMsg(errorMessage);
      }

      handleClickOpenError();

      });


  };



// ------------------------------------------------------------------------------------
// return 시작 ------------------------------------------------------------------------
// ------------------------------------------------------------------------------------

  return (
    <>
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth 
                  id="firstName"
                  label="성명"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
              <Autocomplete
                  value={sellComName}
                  onChange={(event, newValue) => {
                    setSellComName(newValue);
                  }}  
                  inputValue={inputValue}
                  onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                  }}
                  id="controllable-states-demo"
                  options={sellComNameList}
                  sx={{ width: 400 }}
                  renderInput={(params) => <TextField {...params} label="판매처" />}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>

    {/* SingUp alert */}
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"계정 생성"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            계정이 정상적으로 생성되었습니다. 로그인 페이지로 이동합니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

    {/* SingUp error alert */}
    <Dialog
        open={openError}
        onClose={handleCloseError}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"계정 생성 오류"}
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