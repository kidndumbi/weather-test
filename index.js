const express = require("express");
var bodyParser = require('body-parser')
const measurements = require("./measurementsManager");

let m = new measurements();

const app = express();

app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json()); // Body parser use JSON data

app.get('/', (req, res) => {

        res.send(m.getAll());
});

app.post('/measurements', (req, res) => {

     m.save(req.body.temperature,req.body.dewPoint,req.body.precipitation, req.body.timestamp);

     console.log(req.body);
     res.send(req.body);

});

app.get('/measurements/:timestamp', (req, res) => {

         m.find(req.params.timestamp).then((data) => {
            res.send(data);
         }, () =>{  res.status(404).send('Data not found! 404')  });
  
});

// app.get('/measurements/:date', (req, res) => {
    
//              m.findAll(req.params.date).then((data) => {
//                 res.send(data);
//              }, () =>{  res.status(404).send('Data not found! 404')  });
      
//     });

const PORT = process.env.PORT || 4119
app.listen(PORT, () => {
   
    console.log(`connected to port ${PORT}`);

});