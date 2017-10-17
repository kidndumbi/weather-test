const _ = require('lodash');

module.exports = class statsManager {
     
    constructor(){

        this.metric = [];
        this.stat = [];
    }

    getMin(data, metric){

        let result = 0;

        result = _.min(data.map((d) => { return d[metric];}).filter((d) =>{ return d }));

        return result;

    }

    getMax(data, metric){

        let result = 0;
        
        result = _.max(data.map((d) => { return d[metric];}));
        return result;

    }

    getAverage(data, metric){

        let trimmed = [];

        let sum = 0;
        let avg = 0;

        trimmed = data.map((d) => { return d[metric];});
        sum = trimmed.reduce(function(a, b) { return a + b; })
        avg = sum / trimmed.length;

        return avg;

    }
    

    //set metric and stat properties.
    parseData(data, stat, metric){

        if(metric){
            if(_.isArray(metric)){
                 this.metric = metric;
            }else{
                 this.metric.push(metric)
            }
        }

        if(stat){
            if(_.isArray(stat)){
                 this.stat = stat;
            }else{
                 this.stat.push(stat)
            }
        }

        return this.buildReport(data);



    }

    //build report based on supplie params from frontend
    buildReport(dateRangeData){

           let data = [];

           this.metric.forEach((m) => {

                   this.stat.forEach((s) => {
                          
                    let statResult = 0;

                    if(s === "min"){
                        statResult = this.getMin(dateRangeData, m);
                    }
                    if(s === "max"){
                        statResult = this.getMax(dateRangeData, m);
                    }
                    if(s === "average"){
                        statResult = this.getAverage(dateRangeData, m);
                    }

                          data.push({metric: m, stat: s, value: statResult})
                   });

           });

          return data;

    }
   
}