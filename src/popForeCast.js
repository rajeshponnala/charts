import React, { Component } from 'react';
import {Line,Bar} from 'react-chartjs';
import _ from 'underscore';

function R(decadeSYearValue,decadeEYearValue) {
    return ( (decadeEYearValue/decadeSYearValue)-1) * 100;
}

function projectedValue(R,D,previouYearVal){
    return (previouYearVal*(Math.pow((1+(R/100)),(D/120))));
}

function diff (selYear,decadeEndYear) {
    return (selYear-decadeEndYear) * 12;
}


function decadeYears(data) {
    return [data[0].year,data[1].year];
}

function yearsData (start,end) {
    var cmbData = [{lbl:"select",val:0}];
    for(var i = start;i<=end;i++)
        cmbData.push({lbl:i-1+"-"+i,val:i});
    return cmbData;
}

var labels = ["rural_male","rural_female", "urban_male","urban_female"];

var options = { bezierCurve: false,datasetFill:false,pointDot:false};
var barOptions = {inGraphDataShow:true,showTooltips:false,
    onAnimationComplete:function(){
        var ctx = this.chart.ctx;
        ctx.font = this.scale.font;
        ctx.fillStyle = this.scale.textColor
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";

        this.datasets.forEach(function (dataset) {
            dataset.bars.forEach(function (bar) {
                ctx.fillText(bar.value, bar.x, bar.y - 5);
            });
        })
    }};

export class PopulationChart extends Component {
    constructor(props) {
        super(props);
        this.state = {data: props.data,tdata:[],bdata:props.bdata,knobvalue:0};
    }
    componentDidMount() {
        $('#dates').val(2012);
        var fvalues = getFilterValues();
        $.ajax({
            url: "http://localhost:8091/all",
            dataType: 'json',
            success: function (data) {
                var arr = [];
                var minandmaxdatadates = getMinDateAndMaxDateInGivenData(data.lfp.map(function(o){ return o.year;}));
                 var opData;
                 if(fvalues.year <= minandmaxdatadates[1]) {
                     var lpf =  _.filter(data.lfp,function(x){ return x.year == fvalues.year && x.type == fvalues.datatype;})[0];
                     lpf.paramType = "Labour Force";
                     arr.push(lpf);
                     var wp = _.filter(data.wp,function(x){ return x.year == fvalues.year && x.type == fvalues.datatype;})[0];
                     wp.paramType= "Workers";
                     arr.push(wp);
                     var ump = _.filter(data.ump,function(x){ return x.year == fvalues.year && x.type == fvalues.datatype;})[0];
                     ump.paramType = "Unemployed Persons";
                     arr.push(ump);
                     opData = getPresentData(arr,data.decade,fvalues.year,data[this.props.paramType].filter(function(l) { return l.type == "UPS" && l.year <= fvalues.year;}),fvalues);
                     this.setState({tdata:opData[0],data:opData[1],bdata:barChartData(arr),knobvalue:opData[1].datasets[0].data[opData[1].datasets[0].data.length-1]});
                 }
                else {
                     var years = genYears(fvalues.year,minandmaxdatadates[0]);
                     years.push(parseInt(fvalues.year));
                     var preData  = predictedData(years,data,fvalues,this.props.paramType,minandmaxdatadates)
                     this.setState({tdata:preData[0],data:preData[1],bdata:barChartData(preData[0]),knobvalue:preData[1].datasets[0].data[preData[1].datasets[0].data.length-1]});
                 }

            }.bind(this),
            error: function (xhr, status, err) {
                console.log(xhr);
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }
    handleDataType(){
        var fvalues = getFilterValues();
        $.ajax({
            url: "http://localhost:8091/all",
            dataType: 'json',
            success: function (data) {
                var arr = [];
                var minandmaxdatadates = getMinDateAndMaxDateInGivenData(data.lfp.map(function(o){ return o.year;}));
                var opData;
                if(fvalues.year <= minandmaxdatadates[1]) {
                    var lpf =  _.filter(data.lfp,function(x){ return x.year == fvalues.year && x.type == fvalues.datatype;})[0];
                    lpf.paramType = "Labour Force";
                    arr.push(lpf);
                    var wp = _.filter(data.wp,function(x){ return x.year == fvalues.year && x.type == fvalues.datatype;})[0];
                    wp.paramType= "Workers";
                    arr.push(wp);
                    var ump = _.filter(data.ump,function(x){ return x.year == fvalues.year && x.type == fvalues.datatype;})[0];
                    ump.paramType = "Unemployed Persons";
                    arr.push(ump);
                    opData = getPresentData(arr,data.decade,fvalues.year,data[this.props.paramType].filter(function(l) { return l.type == "UPS" && l.year <= fvalues.year;}),fvalues);
                    console.log(opData[0]);
                    this.setState({tdata:opData[0],data:opData[1],bdata:barChartData(arr)});
                }
                else {
                    var years = genYears(fvalues.year,minandmaxdatadates[0]);
                    years.push(parseInt(fvalues.year));
                    var preData  = predictedData(years,data,fvalues,this.props.paramType,minandmaxdatadates)
                    this.setState({tdata:preData[0],data:preData[1],bdata:barChartData(preData[0])});
                }

            }.bind(this),
            error: function (xhr, status, err) {
                console.log(xhr);
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }
    onChange(){
        var fvalues = getFilterValues();
        $.ajax({
            url: "http://localhost:8091/all",
            dataType: 'json',
            success: function (data) {
                var arr = [];
                var minandmaxdatadates = getMinDateAndMaxDateInGivenData(data.lfp.map(function(o){ return o.year;}));
                var opData;
                if(fvalues.year <= minandmaxdatadates[1]) {
                    var lpf =  _.filter(data.lfp,function(x){ return x.year == fvalues.year && x.type == fvalues.datatype;})[0];
                    lpf.paramType = "Labour Force";
                    arr.push(lpf);
                    var wp = _.filter(data.wp,function(x){ return x.year == fvalues.year && x.type == fvalues.datatype;})[0];
                    wp.paramType= "Workers";
                    arr.push(wp);
                    var ump = _.filter(data.ump,function(x){ return x.year == fvalues.year && x.type == fvalues.datatype;})[0];
                    ump.paramType = "Unemployed Persons";
                    arr.push(ump);
                    opData = getPresentData(arr,data.decade,fvalues.year,data[this.props.paramType].filter(function(l) { return l.type == "UPS" && l.year <= fvalues.year;}),fvalues);
                    this.setState({tdata:opData[0],data:opData[1],bdata:barChartData(arr),knobvalue:opData[1].datasets[0].data[opData[1].datasets[0].data.length-1]});
                }
                else {
                    var years = genYears(fvalues.year,minandmaxdatadates[0]);
                    years.push(parseInt(fvalues.year));
                    var preData  = predictedData(years,data,fvalues,this.props.paramType,minandmaxdatadates)
                    this.setState({tdata:preData[0],data:preData[1],bdata:barChartData(preData[0]),knobvalue:preData[1].datasets[0].data[preData[1].datasets[0].data.length-1]});
                }

            }.bind(this),
            error: function (xhr, status, err) {
                console.log(xhr);
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }
    genderHandle(){
        var fvalues = getFilterValues();
        $.ajax({
            url: "http://localhost:8091/all",
            dataType: 'json',
            success: function (data) {
                var arr = [];
                var minandmaxdatadates = getMinDateAndMaxDateInGivenData(data.lfp.map(function(o){ return o.year;}));
                var opData;
                if(fvalues.year <= minandmaxdatadates[1]) {
                    var lpf =  _.filter(data.lfp,function(x){ return x.year == fvalues.year && x.type == fvalues.datatype;})[0];
                    lpf.paramType = "Labour Force";
                    arr.push(lpf);
                    var wp = _.filter(data.wp,function(x){ return x.year == fvalues.year && x.type == fvalues.datatype;})[0];
                    wp.paramType= "Workers";
                    arr.push(wp);
                    var ump = _.filter(data.ump,function(x){ return x.year == fvalues.year && x.type == fvalues.datatype;})[0];
                    ump.paramType = "Unemployed Persons";
                    arr.push(ump);
                    opData = getPresentData(arr,data.decade,fvalues.year,data[this.props.paramType].filter(function(l) { return l.type == "UPS" && l.year <= fvalues.year;}),fvalues);
                    this.setState({tdata:opData[0],data:opData[1],bdata:barChartData(arr),knobvalue:opData[1].datasets[0].data[opData[1].datasets[0].data.length-1]});
                }
                else {
                    var years = genYears(fvalues.year,minandmaxdatadates[0]);
                    years.push(parseInt(fvalues.year));
                    var preData  = predictedData(years,data,fvalues,this.props.paramType,minandmaxdatadates)
                    this.setState({tdata:preData[0],data:preData[1],bdata:barChartData(preData[0]),knobvalue:preData[1].datasets[0].data[preData[1].datasets[0].data.length-1]});
                }

            }.bind(this),
            error: function (xhr, status, err) {
                console.log(xhr);
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }
    geoHandle(){
        var fvalues = getFilterValues();
        $.ajax({
            url: "http://localhost:8091/all",
            dataType: 'json',
            success: function (data) {
                var arr = [];
                var minandmaxdatadates = getMinDateAndMaxDateInGivenData(data.lfp.map(function(o){ return o.year;}));
                var opData;
                if(fvalues.year <= minandmaxdatadates[1]) {
                    var lpf =  _.filter(data.lfp,function(x){ return x.year == fvalues.year && x.type == fvalues.datatype;})[0];
                    lpf.paramType = "Labour Force";
                    arr.push(lpf);
                    var wp = _.filter(data.wp,function(x){ return x.year == fvalues.year && x.type == fvalues.datatype;})[0];
                    wp.paramType= "Workers";
                    arr.push(wp);
                    var ump = _.filter(data.ump,function(x){ return x.year == fvalues.year && x.type == fvalues.datatype;})[0];
                    ump.paramType = "Unemployed Persons";
                    arr.push(ump);
                    opData = getPresentData(arr,data.decade,fvalues.year,data[this.props.paramType].filter(function(l) { return l.type == "UPS" && l.year <= fvalues.year;}),fvalues);
                    console.log(opData[0]);
                    this.setState({tdata:opData[0],data:opData[1],bdata:barChartData(arr),knobvalue:opData[1].datasets[0].data[opData[1].datasets[0].data.length-1]});
                }
                else {
                    var years = genYears(fvalues.year,minandmaxdatadates[0]);
                    years.push(parseInt(fvalues.year));
                    var preData  = predictedData(years,data,fvalues,this.props.paramType,minandmaxdatadates)
                    this.setState({tdata:preData[0],data:preData[1],bdata:barChartData(preData[0]),knobvalue:preData[1].datasets[0].data[preData[1].datasets[0].data.length-1]});
                }

            }.bind(this),
            error: function (xhr, status, err) {
                console.log(xhr);
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }

    render() {
        return (<div>
            <Filter handleDataType={this.handleDataType.bind(this)}
                    data={this.state.data} tdata={this.state.tdata}
                    genderHandle={this.genderHandle.bind(this)} geoHandle={this.geoHandle.bind(this)}></Filter>
            <br/>
            <ComboBox dates={yearsData(2012,2030)} onChange={this.onChange.bind(this)} tdata={this.state.tabledata}></ComboBox>
            <br/>
            <Line id="chart" data={this.state.data} options={options}  width="600" height="250" redraw></Line>
            <Bar id="bchart" data={this.state.bdata} options={barOptions}   width="600" height="250" redraw></Bar>
            <div id="legend"></div>
            <br/>
            <DataTable tabledata={this.state.tdata}></DataTable>
        </div>);
    }
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


function getPresentData(data,decadeData,selYear,allYearsData,fvalues) {
    var df =diff(selYear,decadeData[1].year);
     var obj = {paramType: "Projected Population as on "+selYear};
    _.each(labels,function(l){
        obj[l] = parseInt(projectedValue(R(decadeData[0][l],decadeData[1][l]).toFixed(3),df,decadeData[1][l]).toFixed(0));
    });
    obj["rural_person"] = obj.rural_male + obj.rural_female;
    obj["urban_person"] = obj.urban_male + obj.urban_female;
    obj["rural_urban_person"] = obj["urban_person"] +  obj["rural_person"];
    obj["rural_urban_male"] = obj["urban_male"] +  obj["rural_male"];
    obj["rural_urban_female"] = obj["urban_female"] +  obj["rural_female"];
    data.push(obj);
    var lchartData = getLineChartData(allYearsData,fvalues);
    return [data,getData(lchartData[0],lchartData[1])];
}

export class Filter extends Component {
    render() {
        return (
            <div>
                <div>
                    <input id="male" type="radio" onClick={this.props.genderHandle.bind(this)}  name="gen"/>Male
                    <input id="female" type="radio" onClick={this.props.genderHandle.bind(this)} name="gen"/>Female
                    <input id="person" type="radio" name="gen" onClick={this.props.genderHandle.bind(this)} defaultChecked="true" />Persons
                </div>
                <br/>
                <div>
                    <input id="rural" type="radio" onClick={this.props.geoHandle.bind(this)} defaultChecked="true" name="geo"/>Rural
                    <input id="urban" type="radio" onClick={this.props.geoHandle.bind(this)} name="geo"/>Urban
                    <input id="rural_urban" type="radio" onClick={this.props.geoHandle.bind(this)} name="geo"/>Rural+Urban
                </div>
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
                    <td>Total Male</td>
                    <td>Total Female</td>
                    <td>Total Person</td>
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
            <td>{d.paramType}</td>
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


function createDataObj(csettings, data) {
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
        "Labour Force-person": ["SC-Person", "rgba(220,220,220,0.5)", "rgba(220,220,220,0.8)", "rgba(220,220,220,0.75)", "rgba(220,220,220,1)"],
        "Workers-person": ["ST-Person", "rgba(151,187,205,0.5)", "rgba(151,187,205,0.8)", "rgba(151,187,205,0.75)", "rgba(151,187,205,1)"],
        "Unemployed Persons-person": ["OBC-Person", "rgba(128,0,0,0.5)", "rgba(128,0,0,0.8)", "rgba(128,0,0,0.75)", "rgba(128,0,0,1)"],
        "Labour Force-male":["SC-Male", "rgba(204,229,255,0.5)", "rgba(204,229,255,0.8)", "rgba(204,229,255,0.75)", "rgba(204,229,255,1)"],
        "Labour Force-female":["SC-Female","rgba(204,204,255,0.5)", "rgba(204,204,255,0.8)", "rgba(204,204,255,0.75)", "rgba(204,204,255,1)"],
        "Workers-male":["ST-Male","rgba(204,229,255,0.5)", "rgba(204,229,255,0.8)", "rgba(204,229,255,0.75)", "rgba(204,229,255,1)"],
        "Workers-female":["ST-Female","rgba(255,204,255,0.5)", "rgba(255,204,255,0.8)", "rgba(255,204,255,0.75)", "rgba(255,204,255,1)"],
        "Unemployed Persons-male":["OBC-Male","rgba(102,178,255,0.5)", "rgba(102,178,255,0.8)", "rgba(102,178,255,0.75)", "rgba(102,178,255,1)"],
        "Unemployed Persons-female":["OBC-Female","rgba(51,153,255,0.5)", "rgba(51,153,255,0.8)", "rgba(51,153,255,0.75)", "rgba(51,153,255,1)"],
    };
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

function getFilterValues() {
    var Gen = $('input[name=gen]:checked')[0];
    var Types = $('input[name=charttype]:checked')[0];
    return {
        gen: [Gen.id],
        geo:$('input[name=geo]:checked')[0].id,
        datatype: $('input[name=datatype]:checked')[0].id,
        year: $('#dates').val()
    };
}

function getLineChartData(previousData,fvalues) {
    var labels = [];
    var axisData = [];
    _.each(previousData,function(c){
        labels.push(c.year.toString());
        axisData.push(c[fvalues.geo+'_'+fvalues.gen]);
    });
    return [labels,axisData];
}

function barChartData(data) {
    var datasets = [];
    var bsettings = barSettings();
    var labels = ["rural","urban","rural_urban"];
    var paramTypes =  ["Labour Force","Workers","Unemployed Persons"];
    var gen = ["male","female","person"]
    _.each(paramTypes,function(p){
        var catobj = _.find(data, function (x) { return x.paramType == p; });
        _.each(gen,function(g){
            var data = [];
            _.each(labels,function(l){
                data.push(catobj[l+"_"+g]);
            });
            datasets.push(createDataObj(bsettings[p+'-'+g],data));
        });
    });
    return {
        labels: labels,
        datasets: datasets
    };
}
function getMinDateAndMaxDateInGivenData(data){
    return [_.min(data),_.max(data)];
}

function predictedData(years,data,fvalues,paramType,minMaxDates){
   var labels = [];
    var lineChartData = [];
    var maxYearData = _.filter(data[paramType],function(data)
    { return data.year == minMaxDates[1] && data.type == fvalues.datatype;})[0]
   _.each(years,function(d) {

       if(d<=minMaxDates[1]) {
           labels.push(d.toString());
           lineChartData.push(_.filter(data[paramType],function(data)
           { return data.year == d && data.type == fvalues.datatype;})[0][fvalues.geo+'_'+fvalues.gen]);
       }
       else {

           labels.push(d.toString());
           var projData = (fvalues.geo == 'rural_urban') ? (fvalues.gen == 'person') ? (parseInt(projectedValue(R(data.decade[0]['rural'+'_'+'male'],data.decade[1]['rural'+'_'+'male']).toFixed(3),
               diff(d,minMaxDates[1]),maxYearData['rural'+'_'+'male']).toFixed(0)) + parseInt(projectedValue(R(data.decade[0]['rural'+'_'+'female'],data.decade[1]['rural'+'_'+'female']).toFixed(3),
               diff(d,minMaxDates[1]),maxYearData['rural'+'_'+'female']).toFixed(0)) + parseInt(projectedValue(R(data.decade[0]['urban'+'_'+'male'],data.decade[1]['urban'+'_'+'male']).toFixed(3),
               diff(d,minMaxDates[1]),maxYearData['urban'+'_'+'male']).toFixed(0)) + parseInt(projectedValue(R(data.decade[0]['urban'+'_'+'female'],data.decade[1]['urban'+'_'+'female']).toFixed(3),
               diff(d,minMaxDates[1]),maxYearData['urban'+'_'+'female']).toFixed(0))) : (parseInt(projectedValue(R(data.decade[0]['rural'+'_'+fvalues.gen],data.decade[1]['rural'+'_'+fvalues.gen]).toFixed(3),
               diff(d,minMaxDates[1]),maxYearData['rural'+'_'+fvalues.gen]).toFixed(0)) + parseInt(projectedValue(R(data.decade[0]['urban'+'_'+fvalues.gen],data.decade[1]['urban'+'_'+fvalues.gen]).toFixed(3),
               diff(d,minMaxDates[1]),maxYearData['urban'+'_'+fvalues.gen]).toFixed(0))) : (fvalues.gen == 'person') ? parseInt(projectedValue(R(data.decade[0][fvalues.geo+'_'+'male'],data.decade[1][fvalues.geo+'_'+'male']).toFixed(3),
               diff(d,minMaxDates[1]),maxYearData[fvalues.geo+'_'+'male']).toFixed(0)) + parseInt(projectedValue(R(data.decade[0][fvalues.geo+'_'+'female'],data.decade[1][fvalues.geo+'_'+'female']).toFixed(3),
               diff(d,minMaxDates[1]),maxYearData[fvalues.geo+'_'+'female']).toFixed(0)) : parseInt(projectedValue(R(data.decade[0][fvalues.geo+'_'+fvalues.gen],data.decade[1][fvalues.geo+'_'+fvalues.gen]).toFixed(3),
               diff(d,minMaxDates[1]),maxYearData[fvalues.geo+'_'+fvalues.gen]).toFixed(0));
           lineChartData.push(projData);
       }
   });
    return [getTablePredicatedData(data,fvalues,minMaxDates),getData(labels,lineChartData)] ;
}

function getTablePredicatedData(data,fvalues,minMaxDates){
    var obj1 = {paramType:"Labour Force"},obj2={paramType:"Workers"},obj3={paramType:"Unemployed Persons"},
        obj4={paramType:"Projected population As On "+fvalues.year};
    var df =  diff( fvalues.year,minMaxDates[1]);
    var df1= diff(fvalues.year,data.decade[1].year);
    var lpf = _.filter(data.lfp,function(lp) { return lp.type==fvalues.datatype && lp.year == minMaxDates[1]})[0];
    var wp = _.filter(data.wp,function(lp) { return lp.type==fvalues.datatype && lp.year == minMaxDates[1]})[0];
    var uep = _.filter(data.ump,function(lp) { return lp.type==fvalues.datatype && lp.year == minMaxDates[1]})[0];
    _.each(labels,function(l){
         obj1[l] = parseInt(projectedValue(R(data.decade[0][l],data.decade[1][l]).toFixed(3),df,lpf[l]).toFixed(0));
    });
    setPersonsAndTotalValues(obj1);
    _.each(labels,function(l){
        obj2[l] = parseInt(projectedValue(R(data.decade[0][l],data.decade[1][l]).toFixed(3),df,wp[l]).toFixed(0));
    });
    setPersonsAndTotalValues(obj2);
    _.each(labels,function(l){
        obj3[l] = parseInt(projectedValue(R(data.decade[0][l],data.decade[1][l]).toFixed(3),df,uep[l]).toFixed(0));
    });
    setPersonsAndTotalValues(obj3);
    _.each(labels,function(l){
        obj4[l] = parseInt(projectedValue(R(data.decade[0][l],data.decade[1][l]).toFixed(3),df1,data.decade[1][l]).toFixed(0));
    });
    setPersonsAndTotalValues(obj4);
    return [obj1,obj2,obj3,obj4];
}

function setPersonsAndTotalValues(obj){
    obj["rural_person"] = obj.rural_male + obj.rural_female;
    obj["urban_person"] = obj.urban_male + obj.urban_female;
    obj["rural_urban_person"] = obj["urban_person"] +  obj["rural_person"];
    obj["rural_urban_male"] = obj["urban_male"] +  obj["rural_male"];
    obj["rural_urban_female"] = obj["urban_female"] +  obj["rural_female"];
}

function getTypeOfParam(v) {
    if("lpf") return "Labour Force";
    if("wp") return "Workers";
    if("ump") return "Unemployed Persons";
}


