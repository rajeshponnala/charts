import {Charts} from './chartexm.js';
import React from 'react';
import {CommentBox} from './Comments'
import { render } from 'react-dom';
import _ from 'underscore';
import {LineChart} from './forecast.js';
//render(<KeysExample results={[ {id : 1, text : 'helloububg'}, {id : 2, text : 'world'}, {id: 3, text : 'universe'}]} />,
//     document.getElementById("root"));

// render(<PopChart/>,document.getElementById("root"));

var linedata = {
    labels: ["2010", "2012", "2013", "2014", "2015"],
    datasets: [
        {}
    ]
};

var line1data = {
    labels: ["rural","urban","rural_urban"],
    datasets: [
        {}
    ]
};


//render(<Charts data={linedata}></Charts>,document.getElementById("root"));
render(<LineChart data={linedata} bdata={line1data}></LineChart>,document.getElementById("root"));
