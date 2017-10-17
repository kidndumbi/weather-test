const _ = require('lodash');
const measurement = require("./measurementModel");
const statsManager = require("./statsManager");

//keep _measurements a private propertie
const _measurements = Symbol('measurements collection');

module.exports = class MeasurementsManager {

    constructor() {
   
         this[_measurements] = [];

        //initial data, will be removed later
        // this[_measurements].push(new measurement(43.55, 69.55, 63.56, "2015-05-01T16:00:00.000Z"))
        // this[_measurements].push(new measurement(64.55, 67.55, 53.56, "2015-09-01T16:10:00.000Z"))
        // this[_measurements].push(new measurement(23.55, 68.56, 13.56, "2015-11-02T16:00:00.000Z"))

    }

    save(temperature, dewPoint, precipitation, timestamp) {

        let countBefore = this[_measurements].length;


        let promise = new Promise((resolve, reject) =>{

            let countAfter = 0;

            if(!timestamp || !_.isNumber(temperature) || !_.isNumber(dewPoint) || !_.isNumber(precipitation)){
                reject();
            }else{

                this[_measurements].push(new measurement(temperature, dewPoint, precipitation, timestamp))
                
                    countAfter =  this[_measurements].length;
                
                    if(countAfter > countBefore){
                        resolve();
                    }else{
                        reject();
                    }

            }

        });

        return promise;
    }

    findOne(timestamp) {

        let data = [];
        let strLength = timestamp.split("").length


        //get data by date or timestamp base on string
        if(strLength === 10){
           
            data =  this[_measurements].filter((m) => {
                return timestamp === m.timestamp.substring(0, 10);
            });

        }else{
           
            data =  this[_measurements].filter((m) => {
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
        return this[_measurements];
    }

    replace(timestamp, measure){

       let promise = new Promise((resolve, reject) => {

        if(timestamp !== measure.timestamp){
            reject("misMatch");
            return;
        }

        if(!_.isNumber(measure.temperature) || !_.isNumber(measure.dewPoint) || !_.isNumber(measure.dewPoint)){
            reject("Invalid value");
            return;
        }

        let index = _.findIndex(this[_measurements], ['timestamp', timestamp]);

        if(index > -1){
  
            this[_measurements][index] = new measurement(measure.temperature, measure.dewPoint, measure.precipitation, measure.timestamp);

          resolve();

        }else{
            reject("Does not exist");
            return;
        }
           
       });

       return promise;
  
    }

    update(timestamp, measure){

          let promise = new Promise((resolve, reject) => {

            if(timestamp !== measure.timestamp){
                reject("misMatch");
                return;
            } 

            if(measure.temperature){
                if(!_.isNumber(measure.temperature)){
                    reject("Invalid value");
                    return;
                }

            }
            if(measure.dewPoint){
                if(!_.isNumber(measure.dewPoint)){
                    reject("Invalid value");
                    return;
                }

            }
            if(measure.precipitation){
                if(!_.isNumber(measure.precipitation)){
                    reject("Invalid value");
                    return;
                }

            }
               
            let index = _.findIndex(this[_measurements], ['timestamp', timestamp]);
            
            if(index > -1){
                
                if(measure.temperature)
                this[_measurements][index].temperature = measure.temperature;
                if(measure.dewPoint)
                this[_measurements][index].dewPoint = measure.dewPoint;
                if(measure.precipitation)
                this[_measurements][index].precipitation = measure.precipitation;
              
                resolve();
              
                }else{
                    reject("Does not exist");
                }
               
          });

          return promise;
        
    }

    delete(timestamp){

        let promise = new Promise((resolve, reject) => {
                
            let index = _.findIndex(this[_measurements], ['timestamp', timestamp]);
            
                if(index > -1){ 
                    this[_measurements].splice(index, 1);
                    resolve();
                }else{
                    reject("Does not exist");
                 }
        });

        return promise;
  
    }

    compute(params){

         const SM = new statsManager();

         let promise = new Promise((resolve, reject) => {
             
                     let data = [];
            
                     data = this.getDataIndateRage(params.fromDateTime, params.toDateTime);
            
                     if(data.length > 0){
            
                        let finalData =  SM.parseData(data, params.stat, params.metric);

                        resolve(finalData);

                     }else{
                         reject('no data in date range');
                     }

         });

         return promise;

    }

    
    getDataIndateRage(fromDateTime, toDateTime){
                
        let from = new Date(fromDateTime);
        let to = new Date(toDateTime);

        let result = [];

        result = this[_measurements].filter((m) => {

            let check =  new Date(m.timestamp);
            return   (check.getTime() <= to.getTime() && check.getTime() >= from.getTime()) && m.timestamp !== toDateTime;
        });

        return result;

    }


 }