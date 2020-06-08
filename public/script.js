// REPLACE <...> BY YOUR FIREBASE PROJECT CONFIGURATION:
const config = {
    apiKey: "AIzaSyA2KhXESGlK9g8FtJ1PykYo1mNMzdSE-y8",
    authDomain: "marin-covid19.firebaseapp.com",
    databaseURL: "https://marin-covid19.firebaseio.com",
    projectId: "marin-covid19",
    storageBucket: "marin-covid19.appspot.com",
    messagingSenderId: "319713738124"
  };

firebase.initializeApp(config);


// The big picture: EACH TIME A VALUE CHANGES in the 'timestamped_measures' node, e.g.
// when a new timestamped measure has been pushed to that node,
// we make an array of the last 'nbOfElts' timestamps
// and another array of the last 'nbOfElts' luminosity values.
// This is because plotly.js, our plotting library, requires arrays of data, one for x and one for y.
// Those sliding arrays produce a live data effect.
// -----
// See https://firebase.google.com/docs/database/web/lists-of-data for trigger syntax:

// function processData(allRows,xLabel,yLabel,yTraceName) {

//   console.log(allRows.length);
//   var x = [], y = [];

//   for (var i=0; i<allRows.length; i++) {
//     row = allRows[i];
 
//     x.push(row[xLabel]);
//     y.push(row[yLabel]);
//     if(i === 0) {
//       console.log(i);
//       console.log(row);
//     }
//   }
//   makePlotly( x, y,  yTraceName);
// }



firebase.database().ref('1neJU9AKBjDqCWke0x4d7QRSA9zqoPERahumhBKgLO1k/Sheet1').on('value', ts_measures => {
    let timestamps = [];
    let confirmed_cases = [];
    let increase_ratio = [];
    let positive_rate = [];
    
    ts_measures.forEach(ts_measure => {
        timestamps.push(moment(ts_measure.val().date).format('YYYY-MM-DD HH:mm:ss'));
        confirmed_cases.push(ts_measure.val().confirmed_cases);
        increase_ratio.push(ts_measure.val().increased_ratio);
        positive_rate.push(ts_measure.val().positive_rate);
    });

    myPlotDiv1 = document.getElementById('myPlot1');
    myPlotDiv15 = document.getElementById('myPlot15');
    myPlotDiv2 = document.getElementById('myPlot2');
    myPlotDiv3 = document.getElementById('myPlot3');



    const data1 = {
        x: timestamps,
        y: confirmed_cases,
        type: 'bar',
        name: 'Marin HHS Cases'
    };

    const data2 = [{
        x: timestamps,
        y: increase_ratio,
        type: 'bar'
    }];
    const data3 = [{
        x: timestamps,
        y: positive_rate,
        type: 'bar'
    }];


    const layout1 = {
        title: 'Marin County, California COVID-19 Confirmed Cases By Date',
        titlefont: {
            family: 'Courier New, monospace',
            size: 16,
            color: '#000'
        },
        xaxis: {
            linecolor: 'black',
            linewidth: 2
        },
        yaxis: {
            title: 'Number of cases',
            titlefont: {
                family: 'Courier New, monospace',
                size: 14,
                color: '#000'
            },
            linecolor: 'black',
            linewidth: 2,
        },
        legend: {
            x: 0.02,
            xanchor:'left',
            y: 0.98
        },
        margin: {
            r: 50,
            pad: 0
        }
    };
    const layout15 = {
        title: 'Marin County, California COVID-19 Daily Increase Cases',
        titlefont: {
            family: 'Courier New, monospace',
            size: 16,
            color: '#000'
        },
        xaxis: {
            linecolor: 'black',
            linewidth: 2
        },
        yaxis: {
            title: 'ratio',
            titlefont: {
                family: 'Courier New, monospace',
                size: 14,
                color: '#000'
            },
            linecolor: 'black',
            linewidth: 2,
        },
        margin: {
            r: 50,
            pad: 0
        }
    };

    const layout2 = {
        title: 'Marin County, California COVID-19 Daily Increase Ratio',
        titlefont: {
            family: 'Courier New, monospace',
            size: 16,
            color: '#000'
        },
        xaxis: {
            linecolor: 'black',
            linewidth: 2
        },
        yaxis: {
            title: 'ratio',
            titlefont: {
                family: 'Courier New, monospace',
                size: 14,
                color: '#000'
            },
            linecolor: 'black',
            linewidth: 2,
        },
        margin: {
            r: 50,
            pad: 0
        }
    };

    const layout3 = {
        title: 'Marin County, California COVID-19 Daily Test Positive Rate',
        titlefont: {
            family: 'Courier New, monospace',
            size: 16,
            color: '#000'
        },
        xaxis: {
            linecolor: 'black',
            linewidth: 2
        },
        yaxis: {
            title: 'ratio',
            titlefont: {
                family: 'Courier New, monospace',
                size: 14,
                color: '#000'
            },
            linecolor: 'black',
            linewidth: 2,
        },
        margin: {
            r: 50,
            pad: 0
        }
    };
    var nyt_data_url = 'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv';
    Plotly.d3.csv(nyt_data_url, function(err, rows){
        var x = [], total_cases = [], deaths=[], daily_new_cases=[];

        for (var i=0; i<rows.length; i++) {
            row = rows[i];
            if(row['fips']=='06041') {
                x.push(moment(Date.parse(row['date'])).format('YYYY-MM-DD HH:mm:ss'));
                total_case_row = parseInt(row['cases'])
                if (total_cases.length > 0) { // only calculate new cases when there's prev data
                    daily_new_cases.push(total_case_row - total_cases[total_cases.length-1])
                }
                total_cases.push(total_case_row);
                deaths.push(parseInt(row['deaths']))
            }
        }

        var nyt_cases = {
            x: x,
            y: total_cases,
            type: 'bar',
            name: 'NYTimes Cases'
        };
        var nyt_deaths = {
            x: x,
            y: deaths,
            type: 'scatter',
            name: 'NYTimes Deaths'
        };
        var nyt_daily_new_cases = {
            x: x,
            y: daily_new_cases,
            type: 'bar',
            name: 'NYTimes Daily New Cases'
        };
        // console.log(daily_new_cases)
        traces = [data1, nyt_cases, nyt_deaths];
        Plotly.newPlot(myPlotDiv1, traces,layout1,{ responsive: true });
        Plotly.newPlot(myPlotDiv15, [nyt_daily_new_cases],layout15,{ responsive: true });
    });

    // At last we plot data :-)
    // Plotly.newPlot(myPlotDiv1, data1, layout1, { responsive: true });
    // Plotly.newPlot(myPlotDiv15, data15, layout15, { responsive: true });
    Plotly.newPlot(myPlotDiv2, data2, layout2, { responsive: true });
    Plotly.newPlot(myPlotDiv3, data3, layout3, { responsive: true });
});
