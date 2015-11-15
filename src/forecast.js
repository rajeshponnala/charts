import React, { Component } from 'react';
import {Line,Bar} from 'react-chartjs';
import _ from 'underscore';


function mean(data,prop){
    return _.reduce(data,function(acc,d) { return acc+d[prop];},0)/data.length;
}

function a (xbar,ybar,b) {
    return (ybar-(b*xbar));
}

function b (xmean,ymean,data) {
    return (_.reduce(data,function(acc,d) { return acc + ((d.year-xmean)*(d.y-ymean));  },0)/
    (_.reduce(data,function(acc,d){ return acc + Math.pow(d.year-xmean,2);},0)));
}

function y (x,data) {
    var xbar = mean(data,"year");
    var ybar = mean(data,"y");
    var bop = b(xbar,ybar,data);
    return parseInt(a(xbar,ybar,bop)+ (bop*x));
}

function y1 (a,b,x) {
    return parseInt(a+(b*x));
}


function sampleData(){
    var data = {
        "Persons":{"labour-rate": [{"year":1,"y":35.9},{"year":3,"y":54.15},{"year":4,"y" :51.65},{"year":5,"y":54.05}],
                   "worker-population":[{"year":1,"y":46.5},{"year":3,"y":52.2},{"year":4,"y" :49.3},{"year":5,"y":51.8}],
                   "unemployment-rate":[{"year":1,"y":9.4},{"year":3,"y":3.55},{"year":4,"y" :4.6},{"year":5,"y":4.5}],
                   "proportion-unemployment":[{"year":1,"y":3.4},{"year":3,"y":1.9},{"year":4,"y" :2.35},{"year":5,"y":2.25}]
                  },
        "Females":{"labour-rate": [{"year":1,"y":35.9},{"year":3,"y":54.4},{"year":4,"y" :53.1},{"year":5,"y":55.6}],
                   "worker-population":[{"year":1,"y":46.5},{"year":3,"y":53.6},{"year":4,"y" :51.0},{"year":5,"y":53.7}],
                   "unemployment-rate":[{"year":1,"y":9.4},{"year":3,"y":3.3},{"year":4,"y" :4},{"year":5,"y":3.4}],
                   "proportion-unemployment":[{"year":1,"y":3.4},{"year":3,"y":1.8},{"year":4,"y" :2.1},{"year":5,"y":1.9}]
                   },
        "Males":{"labour-rate": [{"year":1,"y":35.9},{"year":3,"y":52.9},{"year":4,"y" :50.2},{"year":5,"y":52.5}],
                 "worker-population":[{"year":1,"y":46.5},{"year":3,"y":50.8},{"year":4,"y" :47.6},{"year":5,"y":49.9}],
                  "unemployment-rate":[{"year":1,"y":9.4},{"year":3,"y":3.8},{"year":4,"y" :5.2},{"year":5,"y":4.9}],
                 "proportion-unemployment":[{"year":1,"y":3.4},{"year":3,"y":2.0},{"year":4,"y" :2.6},{"year":5,"y":2.6}]
                }
        };
    return data;
}


function labour_rate_persons_data(){

    return [{"year":1,"y":9.4},{"year":3,"y":3.55},{"year":4,"y":4.6},{"year":5,"y":4.15}];

}

function getY(year,data) {
    return y(year,data);
}

function getData(labeldata,dataarray){
    return { labels: labeldata,
             datasets:[
                 {
                     label: "original",
                     fillColor: "rgba(220,220,220,0.2)",
                     strokeColor: "rgba(220,220,220,1)",
                     pointColor: "rgba(220,220,220,1)",
                     pointStrokeColor: "#fff",
                     pointHighlightFill: "#fff",
                     pointHighlightStroke: "rgba(220,220,220,1)",
                     data: dataarray
                 }


             ]};
}

var options = { bezierCurve: false,datasetFill:false,pointDot:false};

export class LineChart extends Component {
    constructor(props) {
        super(props);
        this.state = {data: props.data,tdata:[],bdata:props.bdata};
    }
    componentDidMount() {

    }
    handleDataType(){
        var fvalues = getFilterValues();
        if(fvalues.year > 0) {
            $.ajax({
                url: "http://localhost:8091/"+getChartType(fvalues.type),
                dataType: 'json',
                cache: false,
                success: function (data) {
                    var dt = data.filter(function (i) {
                        return i.type === fvalues.datatype;
                    });
                    var maxminDates = getMinDateAndMaxDateInGivenData(_.map(dt,function(d){return d.year}));
                    var newdata = (fvalues.year >= maxminDates[0] && fvalues.year <= maxminDates[1])? getPresentData(dt,fvalues):PredictData(dt,fvalues);
                    this.setState({tdata:newdata[0],data:newdata[1],bdata:barChartData(newdata[0])});
                }.bind(this),
                error: function (xhr, status, err) {
                    console.log(xhr);
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        }
    }
    handleTypes() {
        var fvalues = getFilterValues();
        if(fvalues.year > 0) {
            $.ajax({
                url: "http://localhost:8091/"+getChartType(fvalues.type),
                dataType: 'json',
                cache: false,
                success: function (data) {
                    var dt = data.filter(function (i) {
                        return i.type === fvalues.datatype;
                    });
                    var maxminDates = getMinDateAndMaxDateInGivenData(_.map(dt,function(d){return d.year}));
                    var newdata = (fvalues.year >= maxminDates[0] && fvalues.year <= maxminDates[1])? getPresentData(dt,fvalues):PredictData(dt,fvalues);
                    this.setState({tdata:newdata[0],data:newdata[1],bdata:barChartData(newdata[0])});
                }.bind(this),
                error: function (xhr, status, err) {
                    console.log(xhr);
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        }
    }
    onChange(){
        var fvalues = getFilterValues();
        if(fvalues.year > 0) {
            $.ajax({
                url: "http://localhost:8091/"+getChartType(fvalues.type),
                dataType: 'json',
                cache: false,
                success: function (data) {
                    var dt = data.filter(function (i) {
                        return i.type === fvalues.datatype;
                    });
                    var maxminDates = getMinDateAndMaxDateInGivenData(_.map(dt,function(d){return d.year}));
                    var newdata = (fvalues.year >= maxminDates[0] && fvalues.year <= maxminDates[1])? getPresentData(dt,fvalues):PredictData(dt,fvalues);
                    this.setState({tdata:newdata[0],data:newdata[1],bdata:barChartData(newdata[0])});
                }.bind(this),
                error: function (xhr, status, err) {
                    console.log(xhr);
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        }
    }
    casteHandle(){
        var fvalues = getFilterValues();
        if(fvalues.year > 0) {
            $.ajax({
                url: "http://localhost:8091/"+getChartType(fvalues.type),
                dataType: 'json',
                cache: false,
                success: function (data) {
                    var dt = data.filter(function (i) {
                        return i.type === fvalues.datatype;
                    });
                    var maxminDates = getMinDateAndMaxDateInGivenData(_.map(dt,function(d){return d.year}));
                    var newdata = (fvalues.year >= maxminDates[0] && fvalues.year <= maxminDates[1])? getPresentData(dt,fvalues):PredictData(dt,fvalues);
                    this.setState({tdata:newdata[0],data:newdata[1],bdata:barChartData(newdata[0])});
                }.bind(this),
                error: function (xhr, status, err) {
                    console.log(xhr);
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        }
    }
    genderHandle(){
        var fvalues = getFilterValues();
        if(fvalues.year > 0) {
            $.ajax({
                url: "http://localhost:8091/"+getChartType(fvalues.type),
                dataType: 'json',
                cache: false,
                success: function (data) {
                    var dt = data.filter(function (i) {
                        return i.type === fvalues.datatype;
                    });
                    var maxminDates = getMinDateAndMaxDateInGivenData(_.map(dt,function(d){return d.year}));
                    var newdata = (fvalues.year >= maxminDates[0] && fvalues.year <= maxminDates[1])? getPresentData(dt,fvalues):PredictData(dt,fvalues);
                    this.setState({tdata:newdata[0],data:newdata[1],bdata:barChartData(newdata[0])});
                }.bind(this),
                error: function (xhr, status, err) {
                    console.log(xhr);
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        }
    }
    geoHandle(){
        var fvalues = getFilterValues();
        if(fvalues.year > 0) {
            $.ajax({
                url: "http://localhost:8091/"+getChartType(fvalues.type),
                dataType: 'json',
                cache: false,
                success: function (data) {
                    var dt = data.filter(function (i) {
                        return i.type === fvalues.datatype;
                    });
                    var maxminDates = getMinDateAndMaxDateInGivenData(_.map(dt,function(d){return d.year}));
                    var newdata = (fvalues.year >= maxminDates[0] && fvalues.year <= maxminDates[1])? getPresentData(dt,fvalues):PredictData(dt,fvalues);
                    this.setState({tdata:newdata[0],data:newdata[1],bdata:barChartData(newdata[0])});
                }.bind(this),
                error: function (xhr, status, err) {
                    console.log(xhr);
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        }
    }
    render() {
        return (<div>
             <Filter handleDataType={this.handleDataType.bind(this)} handleTypes={this.handleTypes.bind(this)}
                     data={this.state.data} tdata={this.state.tdata} casteHandle={this.casteHandle.bind(this)}
                     genderHandle={this.genderHandle.bind(this)} geoHandle={this.geoHandle.bind(this)}></Filter>
             <br/>
            <ComboBox dates={yearsData(2012,2030)} onChange={this.onChange.bind(this)} tdata={this.state.tabledata}></ComboBox>
            <br/>
            <Line id="chart" data={this.state.data} options={options}  width="600" height="250" redraw></Line>
            <Bar id="bchart" data={this.state.bdata} options={options}  width="600" height="250" redraw></Bar>
            <div id="legend"></div>
            <br/>
            <DataTable tabledata={this.state.tdata}></DataTable>
        </div>);
    }
}

export class Filter extends Component {
    render() {
        return (
            <div>
                <div>
                    <input id="male" type="radio" onClick={this.props.genderHandle.bind(this)}  name="gen"/>Male
                    <input id="female" type="radio" onClick={this.props.genderHandle.bind(this)} name="gen"/>Female
                    <input id="person" type="radio" name="gen" onClick={this.props.genderHandle.bind(this)} defaultChecked="true"/>Persons
                </div>
                <br/>
                <div>
                    <input id="SC" type="radio" onClick={this.props.casteHandle.bind(this)} name="cat"/>SC
                    <input id="ST" type="radio" onClick={this.props.casteHandle.bind(this)} name="cat"/>ST
                    <input id="OBC" type="radio" onClick={this.props.casteHandle.bind(this)} name="cat"/>OBC
                    <input id="OTHERS" type="radio" onClick={this.props.casteHandle.bind(this)} name="cat" defaultChecked="true"/>OTHERS
                </div>
                <br/>
                <div>
                    <input id="rural" type="radio" onClick={this.props.geoHandle.bind(this)} defaultChecked="true" name="geo"/>Rural
                    <input id="urban" type="radio" onClick={this.props.geoHandle.bind(this)} name="geo"/>Urban
                    <input id="rural_urban" type="radio" onClick={this.props.geoHandle.bind(this)} name="geo"/>Rural+Urban
                </div>
                <br/>
                <div><input id="labour-rate" type="radio" onClick={this.props.handleTypes.bind(this)} name="charttype" defaultChecked="true"/>Labour Rate
                    <input id="worker-population" type="radio" onClick={this.props.handleTypes.bind(this)} name="charttype"/>Worker Population
                    <input id="unemployment-rate" type="radio" onClick={this.props.handleTypes.bind(this)} name="charttype"/>Un-Employment Rate
                    <input id="proportion-unemployment" type="radio" onClick={this.props.handleTypes.bind(this)} name="charttype"/>proportion UnEmployment</div>
                <br/>
                <div><input id="UPS" type="radio" onClick={this.props.handleDataType.bind(this)} name="datatype" defaultChecked="true"/>UPS
                    <input id="UPSS" type="radio" onClick={this.props.handleDataType.bind(this)} name="datatype"/>UPSS
                    </div>
                <br/>

            </div>);
    }
}

export class ComboBox extends Component{
    render(){
        var optionsarray = this.props.dates.map(function(d){
            return <option key={d.val} value={d.val}>{d.lbl}</option>
        });
        return (<select id="dates" onChange={this.props.onChange.bind(this)}>{optionsarray}</select>);
    }
}

function getFilterValues() {
    var Gen = $('input[name=gen]:checked')[0];
    var Types = $('input[name=charttype]:checked')[0];
    return {
        gen: [Gen.id],
        type: Types.id,
        cat: $('input[name=cat]:checked')[0].id,
        geo:$('input[name=geo]:checked')[0].id,
        datatype: $('input[name=datatype]:checked')[0].id,
        year: $('#dates').val()
    };
}

function yearsData (start,end) {
    var cmbData = [{lbl:"select",val:0}];
    for(var i = start;i<=end;i++)
     cmbData.push({lbl:i-1+"-"+i,val:i});
    return cmbData;
}

function getPreviousData(cattype,prop,data) {
    return _.map(data,function(x){ return {"year":x["year"],"y":x[prop]};});
}

function getPredictedData(sampledata,year){
    var types = ["SC","ST","OBC","OTHERS","OVERALL"];
    var props = ["rural_male","rural_female","rural_person","urban_male","urban_female","urban_person",
        "rural_urban_male","rural_urban_female","rural_urban_person"];
    var predictedData = [];
    _.each(types,function(obj){
        var transobj = {"caste":obj,"year":year};
        var dat = _.filter(sampledata,function(d) { return d.caste === obj});
        _.each(props,function(k) {
            var preData = getPreviousData(obj,k,dat);
            var yval = getY(year,preData);
            transobj[k] = (yval< 0)?0:yval;
          });
        predictedData.push(transobj);
      });
    return predictedData;
}


export class DataTable extends Component {
    render(){
        var rows = [];
        this.props.tabledata.forEach(function(dat) {
           rows.push(<Row data={dat}/>);
        });
        return (
            <table cellSpacing={0} style={{border: '1px solid #900',bordercollapse: 'collaps'}} cellPadding={0} border={1}>
                <thead>
                    <tr>
                      <td>Social Group</td>
                        <td>Rural Male</td>
                        <td>Rural Female</td>
                        <td>Rural Person</td>
                        <td>Urban Male</td>
                        <td>Urban Female</td>
                        <td>Urban Person</td>
                        <td>Rural+Urban Male</td>
                        <td>Rural+Urban Female</td>
                        <td>Rural+Urban Person</td>
                    </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
        );
    }
}


export class Row extends Component {
    render(){
        var d = this.props.data;
        return (<tr>
            <td>{d.caste}</td>
            <td><p className="dataCell">{d.rural_male}</p></td>
            <td><p className="dataCell">{d.rural_female}</p></td>
            <td><p className="dataCell">{d.rural_person}</p></td>
            <td><p className="dataCell">{d.urban_male}</p></td>
            <td><p className="dataCell">{d.urban_female}</p></td>
            <td><p className="dataCell">{d.urban_person}</p></td>
            <td><p className="dataCell">{d.rural_urban_male}</p></td>
            <td><p className="dataCell">{d.rural_urban_female}</p></td>
            <td><p className="dataCell">{d.rural_urban_person}</p></td>
        </tr>);
    }
}

function getChartType(chartType) {
    switch (chartType){
        case "labour-rate":
            return "lfpr";
            break;
        case "worker-population":
            return "wpr";
            break;
        case "unemployment-rate":
            return "umr";
            break;
         default:
             return "pur";
    }
}

function genYears(selyear,min) {
    var years = [];
     for(var i = min;i<selyear;i++)
        years.push(i);
    return years;
}

function getMinDateAndMaxDateInGivenData(data){
        return [_.min(data),_.max(data)];
}

function getPresentData(data,fvalues) {
     var cData = _.filter(data,function(d) { return d.year <= fvalues.year && d.caste == fvalues.cat;});
     var sortedData = (fvalues.datatype == "UPSS")? cData : cData.sort(function(a){ return a.year;});
     var labels = [];
     var axisData = [];
     _.each(sortedData,function(c){
         labels.push(c.year.toString());
         axisData.push(c[fvalues.geo+"_"+fvalues.gen]);
     });
    return [_.filter(data,function(d) { return d.year == fvalues.year}),getData(labels,axisData)];
}

function PredictData(data,fvalues) {
    var predictData = getPredictedData(data,fvalues.year);
    var eDataYears = getMinDateAndMaxDateInGivenData(_.map(data,function(d){return d.year}));
     var filteredData = _.filter(data,function(d){ return d.caste == fvalues.cat});
    var fdata =  (fvalues.datatype == "UPSS")?_.map(filteredData,function(x) { return {"year":x.year,"y":x[fvalues.geo+'_'+fvalues.gen]};})
        : _.map(filteredData.sort(function (i) { return i.year;}),function(x) { return {"year":x.year,"y":x[fvalues.geo+'_'+fvalues.gen]};});
    var xmean = mean(fdata,"year");
    var ymean = mean(fdata,"y");
    var b1 = b(xmean,ymean,fdata);
    var a1 = a(xmean,ymean,b1);
    var labels = _.map(fdata,function(d){ return d.year.toString()});
    var axisdata = _.map(fdata,function(d){ return d.y});
    for(var i = eDataYears[1]+1;i<=fvalues.year;i++) {
        labels.push(i.toString());
        var yval = y1(a1,b1,i);
        axisdata.push((yval<0)?0:yval);
    }
    return [predictData,getData(labels,axisdata)];
}

function barChartData(data) {
    var datasets = [];
    var bsettings = barSettings();
    var labels = ["rural","urban","rural_urban"];
    var casts =  ["SC","ST","OBC","OTHERS"];
    var gen = ["male","female","person"]
    _.each(casts,function(c){
        var catobj = _.find(data, function (x) { return x.caste == c; });
        _.each(gen,function(g){
            var data = [];
            _.each(labels,function(l){
                data.push(catobj[l+"_"+g]);
             });
            datasets.push(createDataObj(bsettings[c+'-'+g],data));
        });
    });
     console.log(datasets);
    return {
        labels: labels,
        datasets: datasets
    };
}

function createDataObj(csettings, data) {
    console.log(csettings)
    return {
        label: csettings[0],
        fillColor: csettings[1],
        strokeColor: csettings[2],
        highlightFill: csettings[3],
        highlightStroke: csettings[4],
        data: data
    }
}

function barSettings() {
    return {
        "SC-person": ["SC-Person", "rgba(220,220,220,0.5)", "rgba(220,220,220,0.8)", "rgba(220,220,220,0.75)", "rgba(220,220,220,1)"],
        "ST-person": ["ST-Person", "rgba(151,187,205,0.5)", "rgba(151,187,205,0.8)", "rgba(151,187,205,0.75)", "rgba(151,187,205,1)"],
        "OBC-person": ["OBC-Person", "rgba(128,0,0,0.5)", "rgba(128,0,0,0.8)", "rgba(128,0,0,0.75)", "rgba(128,0,0,1)"],
        "OTHERS-person": ["OTHERS-Person", "rgba(0,128,128,0.5)", "rgba(0,128,128,0.8)", "rgba(0,128,128,0.75)", "rgba(0,128,128,1)"],
        "SC-male":["SC-Male", "rgba(204,229,255,0.5)", "rgba(204,229,255,0.8)", "rgba(204,229,255,0.75)", "rgba(204,229,255,1)"],
        "SC-female":["SC-Female","rgba(204,204,255,0.5)", "rgba(204,204,255,0.8)", "rgba(204,204,255,0.75)", "rgba(204,204,255,1)"],
        "ST-male":["ST-Male","rgba(204,229,255,0.5)", "rgba(204,229,255,0.8)", "rgba(204,229,255,0.75)", "rgba(204,229,255,1)"],
        "ST-female":["ST-Female","rgba(255,204,255,0.5)", "rgba(255,204,255,0.8)", "rgba(255,204,255,0.75)", "rgba(255,204,255,1)"],
        "OBC-male":["OBC-Male","rgba(102,178,255,0.5)", "rgba(102,178,255,0.8)", "rgba(102,178,255,0.75)", "rgba(102,178,255,1)"],
        "OBC-female":["OBC-Female","rgba(51,153,255,0.5)", "rgba(51,153,255,0.8)", "rgba(51,153,255,0.75)", "rgba(51,153,255,1)"],
        "OTHERS-male":["Others-Male","rgba(255,102,255,0.5)", "rgba(255,102,255,0.8)", "rgba(255,102,255,0.75)", "rgba(255,102,255,1)"],
        "OTHERS-female":["Others-Female","rgba(255,51,255,0.5)", "rgba(255,51,255,0.8)", "rgba(255,51,255,0.75)", "rgba(255,51,255,1)"]
    };
}

