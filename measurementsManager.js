var measurement = require("./measurementModel");

module.exports = class MeasurementsManager {

    constructor() {
   
         this.measurements = [];

    }

    save(temperature, dewPoint, precipitation, timestamp) {

        this.measurements.push(new measurement(temperature, dewPoint, precipitation, timestamp))
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
    
 
    getAll() {
        return this.measurements;
    }
 }