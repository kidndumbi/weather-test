const _ = require('lodash');
const measurement = require("./measurementModel");

module.exports = class MeasurementsManager {

    constructor() {
   
         this.measurements = [];

        //initial data, will be removed later
         this.measurements.push(new measurement(43.55, 69.55, 63.56, "2015-09-01T16:00:00.000Z"))
         this.measurements.push(new measurement(64.55, 67.55, 53.56, "2015-09-01T16:10:00.000Z"))
         this.measurements.push(new measurement(23.55, 68.56, 13.56, "2015-09-02T16:00:00.000Z"))

    }

    save(temperature, dewPoint, precipitation, timestamp) {

        this.measurements.push(new measurement(temperature, dewPoint, precipitation, timestamp))
        //test push
    }

    findOne(timestamp) {

        let data = [];
        let strLength = timestamp.split("").length

        if(strLength === 10){
           
            data =  this.measurements.filter((m) => {
                return timestamp === m.timestamp.substring(0, 10);
            });

        }else{
           
            data =  this.measurements.filter((m) => {
                return timestamp === m.timestamp
            });
        }


        let promise = new Promise(function(resolve, reject){
             
             if(data.length > 0){
                if(strLength === 10){
                    resolve(data)
                }else{
                    resolve(data[0])
                }
               
             }else{
                 reject()
             }

        });

        return promise;

    }
    
 
    getAll(timestamp) {
        return this.measurements;
    }

    replace(timestamp, measure){

        console.log(timestamp);
        console.log(measure);
        //test

       let promise = new Promise((resolve, reject) => {

        if(timestamp !== measure.timestamp){
            reject("misMatch");
        }

        if(!_.isNumber(measure.temperature) || !_.isNumber(measure.dewPoint) || !_.isNumber(measure.dewPoint)){
            reject("Invalid value");
        }

        let index = _.findIndex(this.measurements, ['timestamp', timestamp]);

        if(index > -1){
           
            console.log("index found", index);
            console.log("item found");
            console.log(this.measurements[index]);

          this.measurements[index] = new measurement(measure.temperature, measure.dewPoint, measure.precipitation, measure.timestamp);

          console.log("item after attempted update");
          console.log(this.measurements[index]);

          resolve();

        }else{
            reject("Does not exist");
        }
           
       });

       return promise;
  
    }

    update(timestamp){


        
    }

    delete(timestamp){
        
    }

    stats(stat, metric,fromDateTime, toDateTime ){
        
    }


 }