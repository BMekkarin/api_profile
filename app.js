var express = require('express')
var app = express()
const pgp = require('pg-promise')( /* options */ )
const db = pgp('postgres://pbablyah:toSizihJhOT3gmeAM98fE1VnTSl-T0CA@tyke.db.elephantsql.com/pbablyah')

app.get('/profile', (req, res) => {
  db.query('SELECT * FROM profile ORDER BY id ASC')
    .then((data) => {

      res.send(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
    })
  
})
app.get('/profiles/:id', (req, res) => {

  const id = parseInt(req.params.id)
  
  console.log("id",id);
  db.query('SELECT * FROM profile WHERE  id = $1',[id])
  .then((data) => {
  
    res.send(data)
  })
  .catch((error) => {
    console.log('ERROR:', error)
  })

})
app.listen(3000, () => {
  console.log('Start server at port 3000.')
})