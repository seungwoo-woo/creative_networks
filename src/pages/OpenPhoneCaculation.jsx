import React from 'react'
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import { getAuth } from 'firebase/auth';


function OpenPhoneCaculation(props) {
  const auth = getAuth();

  console.log('/////', auth.currentUser);


// ------------------------------------------------------------------------------------
// return 시작 ------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
return (
  <>
    <ResponsiveAppBar />
    <div>OpenPhoneCaculation</div>
  </>
);

}

export default OpenPhoneCaculation