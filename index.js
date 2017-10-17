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

     m.save(req.body.temperature,req.body.dewPoint,req.body.precipitation, req.body.timestamp).then(() =>{

         res.location('/measurements/' + req.body.timestamp).status(201).send();

     }, () =>{
        res.status(400).send();
     });



});

//get measurements by timestamp or date
app.get('/measurements/:timestamp', (req, res) => {

         m.findOne(req.params.timestamp).then((data) => {
            res.status(200).send(data);
         }, () =>{  res.status(404).send()  });
  
});


//replace a measurement
app.put('/measurements/:timestamp', (req, res) => {

      m.replace(req.params.timestamp, req.body).then(() => {
          
          res.status(204).send();
       
      }, (error) => {
             if(error === "misMatch"){
                res.status(409).send()
             }
             if(error === "Does not exist"){
                res.status(404).send()
             }
             if(error === "Invalid value"){
                res.status(400).send()
             }

      })
      
});

//update values in particular measurement
app.patch('/measurements/:timestamp', (req, res) => {

      m.update(req.params.timestamp, req.body).then(() => {

            res.status(204).send();

      }, (error) => {

        if(error === "misMatch"){
            res.status(409).send();
         }
         if(error === "Does not exist"){
            res.status(404).send();
         }
         if(error === "Invalid value"){
            res.status(400).send();
         }

      })
      
});

//delete a measurement
app.delete('/measurements/:timestamp', (req, res) => {
    
      m.delete(req.params.timestamp).then(() => {
          
        res.status(204).send();

      }, (error) => {
        if(error === "Does not exist"){
            res.status(404).send();
         }
      })
      
});

//compute statistics
app.get('/stats', (req, res) => {

      m.compute(req.query).then((data) => {
          res.send(data);
      }, () => {
          
      })
      
});


app.get('/all', (req, res) => {
    
      res.send(m.getAll());
      
});





const PORT = process.env.PORT || 4119
app.listen(PORT, () => {
   
    console.log(`connected to port ${PORT}`);

});