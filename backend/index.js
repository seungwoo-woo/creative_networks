// backend setting --------------------------------------------------------------------------------
const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

const app = express()

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'first9596',
  database: 'creativenetworks',
  port: 3306
})

app.use(express.json())
app.use(cors())
// backend setting --------------------------------------------------------------------------------



app.get("/", (req, res)=>{
  res.json("hello this is the backend")
})


// openPhoneList ================================================================================
// 전체 리스트 읽어오기 --------------------------------------------------------------------------------
app.get("/openPhoneList", (req, res)=>{
  const q = "SELECT * FROM openlist"
  db.query(q, (err, data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})
// 전체 리스트 읽어오기 --------------------------------------------------------------------------------


// 신규 리스트 추가하기 --------------------------------------------------------------------------------
app.post("/openPhoneList", (req, res)=>{
  const q = "INSERT INTO openlist (`birthday`, `callingPlan`, `controlNo`, `customerName`, `memo`, `nationality`, `openCom`, `openDate`, `openType`, `phoneColor`, `phoneModel`, `phoneNo`, `phoneSerial`, `sellCom`, `telCom`, `type`) VALUES (?)"
  const values = [
    req.body.birthday, 
    req.body.callingPlan,
    req.body.controlNo,
    req.body.customerName,
    req.body.memo,
    req.body.nationality,
    req.body.openCom,
    req.body.openDate,
    req.body.openType,
    req.body.phoneColor,
    req.body.phoneModel,
    req.body.phoneNo,
    req.body.phoneSerial,
    req.body.sellCom,
    req.body.telCom,
    req.body.type
  ]

  db.query(q, [values], (err, data)=>{
    if(err) return res.json(err)
    return res.json("openPhoneList has been created successfully.")
  })
})
// 신규 리스트 추가하기 --------------------------------------------------------------------------------


// 수정대상 읽어오기 --------------------------------------------------------------------------------
app.get("/openPhoneList/:id", (req, res)=>{
  const editPhoneListID = req.params.id
  const q = "SELECT * FROM openlist WHERE id = ?"
  db.query(q, [editPhoneListID], (err, data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})
// 수정대상 읽어오기 --------------------------------------------------------------------------------


// 수정하기 --------------------------------------------------------------------------------
app.put("/openPhoneList/:id", (req, res)=>{
  const listID = req.params.id

  console.log(listID)
  console.log(req.body)

  const q = "UPDATE openlist SET `birthday` = ?, `callingPlan` = ?, `controlNo` = ?, `customerName` = ?, `memo` = ?, `nationality` = ?, `openCom` = ?, `openDate` = ?, `openType` = ?, `phoneColor` = ?, `phoneModel` = ?, `phoneNo` = ?, `phoneSerial` = ?, `sellCom` = ?, `telCom` = ?, `type` = ? WHERE id = ?"
  const values = [
    req.body.birthday, 
    req.body.callingPlan,
    req.body.controlNo,
    req.body.customerName,
    req.body.memo,
    req.body.nationality,
    req.body.openCom,
    req.body.openDate.substr(0, 10),
    // '2023-12-12',
    req.body.openType,
    req.body.phoneColor,
    req.body.phoneModel,
    req.body.phoneNo,
    req.body.phoneSerial,
    req.body.sellCom,
    req.body.telCom,
    req.body.type
  ]

  db.query(q, [...values, listID], (err, data)=>{
    if(err) return res.json(err)
    return res.json("openPhoneList has been updated successfully.")
  })
})
// ---------------------------------------------------------------------------------------


// 삭제하기 --------------------------------------------------------------------------------
app.delete("/openPhoneList/:id", (req, res)=>{
  const deletePhoneListID = req.params.id
  const q = "DELETE FROM openlist WHERE id = ?"

  db.query(q, [deletePhoneListID], (err, data)=>{
    if(err) return res.json(err)
    return res.json("Book has been deleted successfully.")
  })
})
// 삭제하기 --------------------------------------------------------------------------------



// comUsers ================================================================================
// 전체 user 리스트 읽어오기 --------------------------------------------------------------------------------
app.get("/comUsers", (req, res)=>{
  const q = "SELECT * FROM comusers"
  db.query(q, (err, data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})
// 전체 user 리스트 읽어오기 --------------------------------------------------------------------------------

// 전체 unconfirmeduser 리스트 읽어오기 --------------------------------------------------------------------------------
app.get("/comUsers/Uncomfrim", (req, res)=>{
  const q = "SELECT * FROM comusers WHERE userGrade = 'D'"
  db.query(q, (err, data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})
// 전체 unconfirmeduser 리스트 읽어오기 --------------------------------------------------------------------------------

// 수정대상 user 읽어오기 --------------------------------------------------------------------------------
app.get("/comUsers/:id", (req, res)=>{
  const userfbID = req.params.id
  const q = "SELECT * FROM comusers WHERE fbid = ?"
  db.query(q, [userfbID], (err, data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})
// 수정대상 읽어오기 --------------------------------------------------------------------------------

// 수정하기 --------------------------------------------------------------------------------
app.put("/comUsers/:id", (req, res)=>{
  const userID = req.params.id

  const q = "UPDATE comusers SET `name` = ?, `company` = ?, `userGrade` = ?, `note` = ? WHERE fbid = ?"
  const values = [
    req.body.name, 
    req.body.company,
    req.body.userGrade,
    req.body.note,
  ]

  db.query(q, [...values, userID], (err, data)=>{
    if(err) return res.json(err)
    return res.json("user's data has been updated successfully.")
  })
})
// ---------------------------------------------------------------------------------------

// 비활성화하기 --------------------------------------------------------------------------------
app.put("/comUsersDisable/:id", (req, res)=>{
  const userID = req.params.id

  console.log(userID)

  const q = "UPDATE comusers SET `userGrade` = ? WHERE fbid = ?"
  const values = [
    req.body.userGrade
  ]

  db.query(q, [...values, userID], (err, data)=>{
    if(err) return res.json(err)
    return res.json("user's data has been updated successfully.")
  })
})
// ---------------------------------------------------------------------------------------


// 신규 user 추가하기 --------------------------------------------------------------------------------
app.post("/comUsers", (req, res)=>{
  const q = "INSERT INTO comusers (`fbid`, `name`, `company`, `email`, `note`, `userGrade`) VALUES (?)"
  const values = [
    req.body.fbid, 
    req.body.name,
    req.body.company,
    req.body.email,
    req.body.note,
    req.body.userGrade,
  ]

  db.query(q, [values], (err, data)=>{
    if(err) return res.json(err)
    return res.json("comuserList has been created successfully.")
  })
})
// 신규 user 추가하기 --------------------------------------------------------------------------------



// telCom ================================================================================
// 신규 telCom 추가하기 --------------------------------------------------------------------------------
app.post("/telComs", (req, res)=>{
  const q = "INSERT INTO telcoms (`comName`, `comPerson`, `isDeleted`) VALUES (?)"
  const values = [
    req.body.comName, 
    req.body.comPerson,
    req.body.isDeleted
  ]

  db.query(q, [values], (err, data)=>{
    if(err) return res.json(err)
    return res.json("telCom has been created successfully.")
  })
})
// 신규 telCom 추가하기 --------------------------------------------------------------------------------

// 전체 활성 telComs 리스트 읽어오기 --------------------------------------------------------------------------------
app.get("/telComs", (req, res)=>{
  const q = "SELECT * FROM telcoms WHERE isDeleted = 0"
  db.query(q, (err, data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})
// 전체 활성 telComs 리스트 읽어오기  --------------------------------------------------------------------------------

// 수정대상 telcom 읽어오기 --------------------------------------------------------------------------------
app.get("/telComs/:id", (req, res)=>{
  const telComID = req.params.id
  const q = "SELECT * FROM telcoms WHERE id = ?"
  db.query(q, [telComID], (err, data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})
// 수정대상 읽어오기 --------------------------------------------------------------------------------

// 수정하기 --------------------------------------------------------------------------------
app.put("/telComs/:id", (req, res)=>{
  const telComID = req.params.id

  const q = "UPDATE telcoms SET `comName` = ?, `comPerson` = ? WHERE id = ?"
  const values = [
    req.body.comName, 
    req.body.comPerson,
  ]

  db.query(q, [...values, telComID], (err, data)=>{
    if(err) return res.json(err)
    return res.json("telCom's data has been updated successfully.")
  })
})
// ---------------------------------------------------------------------------------------


// 삭제하기 --------------------------------------------------------------------------------
app.delete("/telComs/:id", (req, res)=>{
  const deletetelComID = req.params.id
  const q = "DELETE FROM telcoms WHERE id = ?"

  db.query(q, [deletetelComID], (err, data)=>{
    if(err) return res.json(err)
    return res.json("telCom's data has been deleted successfully.")
  })
})
// 삭제하기 --------------------------------------------------------------------------------




// sellCom ================================================================================
// 신규 sellCom 추가하기 --------------------------------------------------------------------------------
app.post("/sellComs", (req, res)=>{
  const q = "INSERT INTO sellcoms (`comName`, `comNo`, `bank`, `acount`, `comPerson`, `isDeleted`) VALUES (?)"
  const values = [
    req.body.comName, 
    req.body.comNo, 
    req.body.bank, 
    req.body.acount, 
    req.body.comPerson,
    req.body.isDeleted
  ]

  db.query(q, [values], (err, data)=>{
    if(err) return res.json(err)
    return res.json("sellCom has been created successfully.")
  })
})
// 신규 telCom 추가하기 --------------------------------------------------------------------------------

// 전체 활성 sellComs 리스트 읽어오기 --------------------------------------------------------------------------------
app.get("/sellComs", (req, res)=>{
  const q = "SELECT * FROM sellcoms WHERE isDeleted = 0"
  db.query(q, (err, data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})
// 전체 활성 sellComs 리스트 읽어오기  --------------------------------------------------------------------------------

// 수정대상 sellCom 읽어오기 --------------------------------------------------------------------------------
app.get("/sellComs/:id", (req, res)=>{
  const sellComID = req.params.id
  const q = "SELECT * FROM sellcoms WHERE id = ?"
  db.query(q, [sellComID], (err, data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})
// 수정대상 sellCom읽어오기 --------------------------------------------------------------------------------

// 수정하기 --------------------------------------------------------------------------------
app.put("/sellComs/:id", (req, res)=>{
  const sellComID = req.params.id

  const q = "UPDATE sellcoms SET `comName` = ?, `comNo` = ?, `bank` = ?, `acount` = ?, `comPerson` = ? WHERE id = ?"
  const values = [
    req.body.comName, 
    req.body.comNo, 
    req.body.bank, 
    req.body.acount, 
    req.body.comPerson,
  ]

  db.query(q, [...values, sellComID], (err, data)=>{
    if(err) return res.json(err)
    return res.json("sellCom's data has been updated successfully.")
  })
})
// ---------------------------------------------------------------------------------------

// 삭제하기 --------------------------------------------------------------------------------
app.delete("/sellComs/:id", (req, res)=>{
  const deletesellComID = req.params.id
  const q = "DELETE FROM sellcoms WHERE id = ?"

  db.query(q, [deletesellComID], (err, data)=>{
    if(err) return res.json(err)
    return res.json("sellCom's data has been deleted successfully.")
  })
})
// 삭제하기 --------------------------------------------------------------------------------



// sellCom ================================================================================
// 신규 openCom 추가하기 --------------------------------------------------------------------------------
app.post("/openComs", (req, res)=>{
  const q = "INSERT INTO opencoms (`comName`, `comPerson`, `telComName`, `isDeleted`) VALUES (?)"
  const values = [
    req.body.comName, 
    req.body.comPerson, 
    req.body.telComName, 
    req.body.isDeleted
  ]

  db.query(q, [values], (err, data)=>{
    if(err) return res.json(err)
    return res.json("openComs has been created successfully.")
  })
})
// 신규 openCom 추가하기 --------------------------------------------------------------------------------

// 전체 활성 openComs 리스트 읽어오기 --------------------------------------------------------------------------------
app.get("/openComs", (req, res)=>{
  const q = "SELECT * FROM opencoms WHERE isDeleted = 0"
  db.query(q, (err, data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})
// 전체 활성 openComs 리스트 읽어오기  --------------------------------------------------------------------------------

// 수정대상 openCom 읽어오기 --------------------------------------------------------------------------------
app.get("/openComs/:id", (req, res)=>{
  const openComID = req.params.id
  const q = "SELECT * FROM opencoms WHERE id = ?"
  db.query(q, [openComID], (err, data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})
// 수정대상 sellCom읽어오기 --------------------------------------------------------------------------------

// 수정하기 --------------------------------------------------------------------------------
app.put("/openComs/:id", (req, res)=>{
  const openComID = req.params.id

  const q = "UPDATE opencoms SET `comName` = ?, `comPerson` = ?, `telComName` = ? WHERE id = ?"
  const values = [
    req.body.comName, 
    req.body.comPerson, 
    req.body.telComName,
  ]

  db.query(q, [...values, openComID], (err, data)=>{
    if(err) return res.json(err)
    return res.json("openCom's data has been updated successfully.")
  })
})
// ---------------------------------------------------------------------------------------

// 삭제하기 --------------------------------------------------------------------------------
app.delete("/openComs/:id", (req, res)=>{
  const deleteopenComID = req.params.id
  const q = "DELETE FROM opencoms WHERE id = ?"

  db.query(q, [deleteopenComID], (err, data)=>{
    if(err) return res.json(err)
    return res.json("openCom's data has been deleted successfully.")
  })
})
// 삭제하기 --------------------------------------------------------------------------------




// callingPlan ================================================================================
// 신규 callingPlan 추가하기 --------------------------------------------------------------------------------
app.post("/callingPlan", (req, res)=>{
  const q = "INSERT INTO callingplan (`planName`, `openComName`, `rebate1`, `rebate2`, `rebate3`, `rebate4`) VALUES (?)"
  const values = [
    req.body.planName, 
    req.body.openComName, 
    req.body.rebate1, 
    req.body.rebate2,
    req.body.rebate3,
    req.body.rebate4,
  ]

  db.query(q, [values], (err, data)=>{
    if(err) return res.json(err)
    return res.json("callingPlan has been created successfully.")
  })
})
// 신규 callingPlan 추가하기 --------------------------------------------------------------------------------

// 전체 활성 callingPlan 리스트 읽어오기 --------------------------------------------------------------------------------
app.get("/callingPlan", (req, res)=>{
  const q = "SELECT * FROM callingplan"
  db.query(q, (err, data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})
// 전체 활성 callingPlan 리스트 읽어오기  --------------------------------------------------------------------------------

// 수정대상 callingPlan 읽어오기 --------------------------------------------------------------------------------
app.get("/callingPlan/:id", (req, res)=>{
  const callingPlanID = req.params.id
  const q = "SELECT * FROM callingplan WHERE id = ?"
  db.query(q, [callingPlanID], (err, data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})
// 수정대상 callingPlan 읽어오기 --------------------------------------------------------------------------------

// 수정하기 --------------------------------------------------------------------------------
app.put("/callingPlan/:id", (req, res)=>{
  const callingPlanID = req.params.id

  const q = "UPDATE callingplan SET `planName` = ?, `openComName` = ?, `rebate1` = ?, `rebate2` = ?, `rebate3` = ?, `rebate4` = ? WHERE id = ?"
  const values = [
    req.body.planName, 
    req.body.openComName, 
    req.body.rebate1, 
    req.body.rebate2,
    req.body.rebate3,
    req.body.rebate4,
  ]

  db.query(q, [...values, callingPlanID], (err, data)=>{
    if(err) return res.json(err)
    return res.json("callingPlan's data has been updated successfully.")
  })
})
// ---------------------------------------------------------------------------------------

// 삭제하기 --------------------------------------------------------------------------------
app.delete("/callingPlan/:id", (req, res)=>{
  const deletecallingPlanID = req.params.id
  const q = "DELETE FROM callingplan WHERE id = ?"

  db.query(q, [deletecallingPlanID], (err, data)=>{
    if(err) return res.json(err)
    return res.json("callingPlan's data has been deleted successfully.")
  })
})
// 삭제하기 --------------------------------------------------------------------------------





// backend run --------------------------------------------------------------------------------
app.listen(8800, ()=>{
  console.log('Connected to backend')
})
// backend run --------------------------------------------------------------------------------


