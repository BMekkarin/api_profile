var express = require('express')
var app = express()
const bodyParser = require('body-parser')
const router = express.Router();
const pgp = require('pg-promise')( /* options */ )

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
const db = pgp('postgres://pbablyah:toSizihJhOT3gmeAM98fE1VnTSl-T0CA@tyke.db.elephantsql.com/pbablyah')
function  get (){
db.query('SELECT * FROM profile ORDER BY id ASC')
    .then((data) => {

      res.send(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
    })
}
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

  db.query('SELECT * FROM profile WHERE  id = $1', [id])
    .then((data) => {

      res.send(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
    })

})
app.post('/profile_add',async (req, res) => {

  const {
      name,
      firstname,
      address,
      city
    } = req.body
    console.log("req.body",req.body);

 let d = await db.query('INSERT INTO profile (name, firstname,address ,city) VALUES ($1, $2,$3,$4) RETURNING *',[name, firstname,address ,city])
   
      res.json({
        message:'OK',
        data:d[0]
      })
})
app.put('/profile_update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name,
      firstname,
      address,
      city 
    } = req.body;


    const query = `
      UPDATE profile
      SET name = COALESCE($1, name),
          firstname = COALESCE($2, firstname),
          address = COALESCE($3, address),
          city = COALESCE($4, city)
      WHERE id = $5
      RETURNING *;
    `;
    const { rows } = await db.query(query, [
      name,
      firstname,
      address,
      city, 
      id
    ]);

    if (rows.length === 0) {
      return res.status(404).send('Cannot find anything');
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Some error has occured failed');
  }
});
app.delete('/del_profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM profile WHERE id = $1 RETURNING *;';
    const { rows } = await db.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).send('we have not found the album');
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('some error has occured');
  }
});
app.listen(3000, () => {
  console.log('Start server at port 3000.')
})