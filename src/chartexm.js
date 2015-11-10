import React, { Component } from 'react';
import {Bar} from 'react-chartjs';
function upssdata() {
    return {
        "rural": {
            "SC": {"M": 76.3, "F": 39.1, "P": 60.5},
            "ST": {"M": 83.3, "F": 52.5, "P": 68.7},
            "OBC": {"M": 75.5, "F": 36.8, "P": 58.9},
            "OTHERS": {"M": 74.9, "F": 26.1, "P": 52.9}
        },
        urban: {
            "SC": {"M": 75.3, "F": 22.3, "P": 49.9},
            "ST": {"M": 77.8, "F": 25.7, "P": 52.4},
            "OBC": {"M": 75.4, "F": 21.7, "P": 49.4},
            "OTHERS": {"M": 71.9, "F": 16.3, "P": 45.3}
        },
        rb: {
            "SC": {"M": 76.1, "F": 35.3, "P": 58.3},
            "ST": {"M": 82.5, "F": 48.7, "P": 66.4},
            "OBC": {"M": 75.5, "F": 32.1, "P": 56.2},
            "OTHERS": {"M": 73.7, "F": 22.0, "P": 49.8}
        }
    };
}
import { render } from 'react-dom';
import _ from 'underscore';

function chartData(labels, datasets) {
    return {
        labels: labels,
        datasets: datasets
    };
}

var options = {'legendTemplate': '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'}

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

function createDataSet(data, objset) {
    var opdata = [];
    for (var i = 0; i < data.length; i++) {
        opdata.push(createDataObj(data[i].caste, objset[i][1], objset[i][2], objset[i][3], objset[i][4], data[i]))
    }
    return opdata;
}

export class PopChart extends Component {
    componentDidMount() {
        alert(LineChart)
        var dt = upssdata();
        new Chart(document.getElementById("chart").getContext("2d"))
            .Bar(chartData(["Rural", "Urban", "Rural+Urban"],
                createDataSet([[dt.rural.SC.P, dt.urban.SC.P, dt.rb.SC.P], [dt.rural.ST.P, dt.urban.ST.P, dt.rb.ST.P],
                        [dt.rural.OBC.P, dt.urban.OBC.P, dt.rb.OBC.P], [dt.rural.OTHERS.P, dt.urban.OTHERS.P, dt.rb.OTHERS.P]],
                    [["SC", "rgba(220,220,220,0.5)", "rgba(220,220,220,0.8)", "rgba(220,220,220,0.75)", "rgba(220,220,220,1)"],
                        ["ST", "rgba(151,187,205,0.5)", "rgba(151,187,205,0.8)", "rgba(151,187,205,0.75)", "rgba(151,187,205,1)"],
                        ["OBC", "rgba(128,0,0,0.5)", "rgba(128,0,0,0.8)", "rgba(128,0,0,0.75)", "rgba(128,0,0,1)"],
                        ["OTHERS", "rgba(0,128,128,0.5)", "rgba(0,128,128,0.8)", "rgba(0,128,128,0.75)", "rgba(0,128,128,1)"]])));
    }

    render() {
        return (<canvas id="chart" height="400" width="400"></canvas>);
    }
}

export class Charts extends Component {
    constructor(props) {
        super(props);
        this.state = {data: props.data};
    }

    componentDidMount() {
        var fvalues = getFilterValues();
        $.ajax({
            url: "http://localhost:8091/lfpr",
            dataType: 'json',
            cache: false,
            success: function (data) {
                var dt = data.filter(function (i) {
                    return i.year === "2013-12-31T18:30:00Z"
                        && i.type === fvalues["type"] && $.inArray(i.caste, fvalues["bars"]) != -1
                });
                this.setState({data: getFilteredData(fvalues, dt)});
            }.bind(this),
            error: function (xhr, status, err) {
                console.log(xhr);
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }

    handleClick() {

        var fvalues = getFilterValues();
        $.ajax({
            url: "http://localhost:8091/lfpr",
            dataType: 'json',
            cache: false,
            success: function (data) {
                var dt = data.filter(function (i) {
                    return i.year === "2013-12-31T18:30:00Z"
                        && i.type === fvalues["type"] && $.inArray(i.caste, fvalues["bars"]) != -1
                });
                this.setState({data: getFilteredData(fvalues, dt)});
            }.bind(this),
            error: function (xhr, status, err) {
                console.log(xhr);
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }
    render() {
        return (<div>
            <Filter handleClick={this.handleClick.bind(this)} data={this.state.data}></Filter>
            <br/>
            <Bar id="chart" data={this.state.data} options={options}  width="600" height="250" redraw></Bar>
            <div id="legend"></div>
        </div>);
    }
}


var linedata = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        },
    ]
};

export class Filter extends Component {
    render() {
        return (
            <div>
                <div>
                    <input id="SC" type="radio" name="cat">SC</input>
                    <input id="ST" type="radio" name="cat">ST</input>
                    <input id="OBC" type="radio" name="cat">OBC</input>
                    <input id="OTHERS" type="radio" name="cat">Others</input>
                    <input id="ALL" type="radio" name="cat" defaultChecked="true">All</input>
                </div>
                <br/>
                <div><input id="rural" type="radio" name="geo">Rural</input>
                    <input id="urban" type="radio" name="geo">Urban</input>
                    <input id="rural_urban" type="radio" name="geo">Rural+Urban</input>
                    <input id="ALL" type="radio" name="geo" defaultChecked="true">All</input></div>
                <br/>
                <div>
                    <input id="male" type="radio" name="gen">Male</input>
                    <input id="female" type="radio" name="gen">FeMale</input>
                    <input id="person" type="radio" name="gen" defaultChecked="true">Persons</input>
                </div>
                <br/>
                <div>
                    <input id="UPS" type="radio" name="types" defaultChecked="true">UPS</input>
                    <input id="UPSS" type="radio" name="types">UPSS</input>
                </div>
                <br/>
                <input type="button" onClick={this.props.handleClick.bind(this)} value="Create Chart"/>
            </div>);
    }
}


function getFilterValues() {
    var Bars = $('input[name=cat]:checked')[0];
    var Labels = $('input[name=geo]:checked')[0];
    var Gen = $('input[name=gen]:checked')[0];
    var Types = $('input[name=types]:checked')[0];
    return {
        bars: (Bars.id === "ALL") ? ["SC", "ST", "OBC", "OTHERS"] : [Bars.id],
        labels: (Labels.id === "ALL" ) ? ["rural", "urban", "rural_urban"] : [Labels.id],
        gen: [Gen.id],
        type: Types.id
    };
}

function getFilteredData(settings, data) {
    var dt = [];
    var bSettings = barSettings();
    for (var i = 0; i < data.length; i++) {
        dt.push(createDataObj(
            bSettings[data[i]["caste"]],
            settings["labels"].reduce(function (acc, lbl) {
                console.log(acc);
                acc.push(data[i][lbl + '_' + settings.gen] / 10);
                return acc;
            }, [])
        ));
    }
    return chartData(settings["labels"], dt);
}

function barSettings() {
    return {
        "SC": ["SC", "rgba(220,220,220,0.5)", "rgba(220,220,220,0.8)", "rgba(220,220,220,0.75)", "rgba(220,220,220,1)"],
        "ST": ["ST", "rgba(151,187,205,0.5)", "rgba(151,187,205,0.8)", "rgba(151,187,205,0.75)", "rgba(151,187,205,1)"],
        "OBC": ["OBC", "rgba(128,0,0,0.5)", "rgba(128,0,0,0.8)", "rgba(128,0,0,0.75)", "rgba(128,0,0,1)"],
        "OTHERS": ["OTHERS", "rgba(0,128,128,0.5)", "rgba(0,128,128,0.8)", "rgba(0,128,128,0.75)", "rgba(0,128,128,1)"]
    };
}