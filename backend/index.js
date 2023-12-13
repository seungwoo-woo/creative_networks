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

  const q = "UPDATE comusers SET `name` = ?, `company` = ?, `userGrade` = ? WHERE fbid = ?"
  const values = [
    req.body.name, 
    req.body.company,
    req.body.userGrade,
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



// backend run --------------------------------------------------------------------------------
app.listen(8800, ()=>{
  console.log('Connected to backend')
})
// backend run --------------------------------------------------------------------------------


