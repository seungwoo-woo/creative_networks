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

app.get("/", (req, res)=>{
  res.json("hello this is the backend")
})

app.get("/openPhoneList", (req, res)=>{
  const q = "SELECT * FROM openlist"
  db.query(q, (err, data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})

app.post("/openPhoneList", (req, res)=>{
  const q = "INSERT INTO openlist (`birthday`, `callingPlan`, `controlNo`, `customerName`, `memo`, `nationality`, `openCom`, `openDate`, `openType`, `phoneColor`, `phoneModel`, `phoneNo`, `phoneSerial`, `sellCom`, `telCom`, `type`) VALUES (?)"
  // const values = ['title from backend', 'desc from backend', 'cover pic from backend']
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

// app.delete("/books/:id", (req, res)=>{
//   const bookID = req.params.id
//   const q = "DELETE FROM books WHERE id = ?"

//   db.query(q, [bookID], (err, data)=>{
//     if(err) return res.json(err)
//     return res.json("Book has been deleted successfully.")
//   })
// })

// app.put("/books/:id", (req, res)=>{
//   const bookID = req.params.id
//   const q = "UPDATE books SET `title` = ?, `desc` = ?, `cover` = ?, `price` = ? WHERE id = ?"

//   const values = [
//     req.body.title, 
//     req.body.desc,
//     req.body.cover,
//     req.body.price,
//   ]

//   db.query(q, [...values, bookID], (err, data)=>{
//     if(err) return res.json(err)
//     return res.json("Book has been updated successfully.")
//   })
// })

app.listen(8800, ()=>{
  console.log('Connected to backend')
})

