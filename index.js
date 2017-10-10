const express = require("express");
var bodyParser = require('body-parser')
const measurements = require("./measurementsManager");

let m = new measurements();

const app = express();

app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json()); // Body parser use JSON data

app.get('/', (req, res) => {

    res.sendFile(`${__dirname}/index.html`);
});

app.post('/measurements', (req, res) => {

     m.save(req.body.temperature,req.body.dewPoint,req.body.precipitation, req.body.timestamp);

     console.log(req.body);
     res.send(req.body);

});

//get measurements by timestamp or date
app.get('/measurements/:timestamp', (req, res) => {

         m.findOne(req.params.timestamp).then((data) => {
            res.send(data);
         }, () =>{  res.status(404).send('Data not found! 404')  });
  
});


//replace a measurement
app.put('/measurements/:timestamp', (req, res) => {

      m.replace(req.params.timestamp, req.body).then(() => {
          
          res.send('success!');
       
      }, (error) => {
             if(error === "misMatch"){
                res.status(409).send('timestamp mismatch! 409')
             }
             if(error === "Does not exist"){
                res.status(404).send('Does not exist! 404')
             }
             if(error === "Invalid value"){
                res.status(400).send('Invalid value! 400')
             }

      })
      
});

//update values in particular measurement
app.patch('/measurements/:timestamp', (req, res) => {
 
      m.update(req.params.timestamp, req.body).then(() => {

        res.send('success!');

      }, (error) => {

        if(error === "misMatch"){
            res.status(409).send('timestamp mismatch! 409')
         }
         if(error === "Does not exist"){
            res.status(404).send('Does not exist! 404')
         }
         if(error === "Invalid value"){
            res.status(400).send('Invalid value! 400')
         }

      })
      
});

//delete a measurement
app.delete('/measurements/:timestamp', (req, res) => {
    
      m.delete(req.params.timestamp).then(() => {
          
        res.send('success!');

      }, (error) => {
        if(error === "Does not exist"){
            res.status(404).send('Does not exist! 404')
         }
      })
      
});

//compute statistics
app.get('/stats', (req, res) => {
    
      
      
});


app.get('/all', (req, res) => {
    
      res.send(m.getAll());
      
});





const PORT = process.env.PORT || 4119
app.listen(PORT, () => {
   
    console.log(`connected to port ${PORT}`);

});