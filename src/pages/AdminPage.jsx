import React from 'react'

import { getAuth } from "firebase/auth";

function AdminPage(props) {

// Initialize Variable ==================================================
const setIsLogin = props.setIsLogin
const auth = getAuth();

// call function ==================================================
setIsLogin(true);



// ------------------------------------------------------------------------------------
// return 시작 ------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
return (
  <div>AdminPage</div>
);

}

export default AdminPage