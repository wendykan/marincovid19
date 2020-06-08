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

    var daily_tests_octat='data:application/octet-stream;charset=utf-8,Date%2C3%2F4%2F2020%2C3%2F5%2F2020%2C3%2F6%2F2020%2C3%2F7%2F2020%2C3%2F8%2F2020%2C3%2F9%2F2020%2C3%2F10%2F2020%2C3%2F11%2F2020%2C3%2F12%2F2020%2C3%2F13%2F2020%2C3%2F14%2F2020%2C3%2F15%2F2020%2C3%2F16%2F2020%2C3%2F17%2F2020%2C3%2F18%2F2020%2C3%2F19%2F2020%2C3%2F20%2F2020%2C3%2F21%2F2020%2C3%2F22%2F2020%2C3%2F23%2F2020%2C3%2F24%2F2020%2C3%2F25%2F2020%2C3%2F26%2F2020%2C3%2F27%2F2020%2C3%2F28%2F2020%2C3%2F29%2F2020%2C3%2F30%2F2020%2C3%2F31%2F2020%2C4%2F1%2F2020%2C4%2F2%2F2020%2C4%2F3%2F2020%2C4%2F4%2F2020%2C4%2F5%2F2020%2C4%2F6%2F2020%2C4%2F7%2F2020%2C4%2F8%2F2020%2C4%2F9%2F2020%2C4%2F10%2F2020%2C4%2F11%2F2020%2C4%2F12%2F2020%2C4%2F13%2F2020%2C4%2F14%2F2020%2C4%2F15%2F2020%2C4%2F16%2F2020%2C4%2F17%2F2020%2C4%2F18%2F2020%2C4%2F19%2F2020%2C4%2F20%2F2020%2C4%2F21%2F2020%2C4%2F22%2F2020%2C4%2F23%2F2020%2C4%2F24%2F2020%2C4%2F25%2F2020%2C4%2F26%2F2020%2C4%2F27%2F2020%2C4%2F28%2F2020%2C4%2F29%2F2020%2C4%2F30%2F2020%2C5%2F1%2F2020%2C5%2F2%2F2020%2C5%2F3%2F2020%2C5%2F4%2F2020%2C5%2F5%2F2020%2C5%2F6%2F2020%2C5%2F7%2F2020%2C5%2F8%2F2020%2C5%2F9%2F2020%2C5%2F10%2F2020%2C5%2F11%2F2020%2C5%2F12%2F2020%2C5%2F13%2F2020%2C5%2F14%2F2020%2C5%2F15%2F2020%2C5%2F16%2F2020%2C5%2F17%2F2020%2C5%2F18%2F2020%2C5%2F19%2F2020%2C5%2F20%2F2020%2C5%2F21%2F2020%2C5%2F22%2F2020%2C5%2F23%2F2020%2C5%2F24%2F2020%2C5%2F25%2F2020%2C5%2F26%2F2020%2C5%2F27%2F2020%2C5%2F28%2F2020%2C5%2F29%2F2020%2C5%2F30%2F2020%2C5%2F31%2F2020%2C6%2F1%2F2020%2C6%2F2%2F2020%2C6%2F3%2F2020%2C6%2F4%2F2020%2C6%2F5%2F2020%2C6%2F6%2F2020%2C6%2F7%2F2020%0APositive%20Tests%2C1%2C0%2C0%2C0%2C0%2C2%2C0%2C0%2C4%2C8%2C2%2C3%2C14%2C4%2C13%2C6%2C2%2C4%2C5%2C9%2C9%2C11%2C6%2C10%2C5%2C3%2C5%2C7%2C8%2C4%2C5%2C4%2C1%2C0%2C3%2C1%2C5%2C3%2C3%2C1%2C13%2C3%2C3%2C3%2C4%2C3%2C1%2C1%2C4%2C6%2C2%2C12%2C0%2C0%2C6%2C5%2C2%2C2%2C0%2C0%2C1%2C5%2C4%2C6%2C6%2C7%2C0%2C1%2C7%2C8%2C4%2C14%2C18%2C8%2C4%2C12%2C12%2C25%2C26%2C10%2C4%2C1%2C2%2C19%2C11%2C31%2C24%2C5%2C0%2C9%2C32%2C17%2C6%2C8%2C0%2C0%0ANegative%20Tests%2C1%2C2%2C9%2C0%2C0%2C5%2C10%2C11%2C38%2C49%2C12%2C10%2C84%2C76%2C95%2C69%2C81%2C64%2C22%2C104%2C98%2C127%2C103%2C124%2C45%2C12%2C103%2C91%2C61%2C74%2C87%2C27%2C16%2C71%2C81%2C88%2C91%2C85%2C22%2C21%2C88%2C128%2C57%2C89%2C110%2C33%2C10%2C151%2C79%2C87%2C91%2C107%2C36%2C29%2C152%2C141%2C79%2C136%2C181%2C55%2C32%2C290%2C238%2C184%2C219%2C328%2C94%2C71%2C318%2C338%2C274%2C184%2C257%2C110%2C98%2C285%2C355%2C361%2C258%2C343%2C180%2C111%2C64%2C327%2C422%2C368%2C347%2C160%2C100%2C376%2C224%2C240%2C311%2C29%2C1%2Cnull'
    Plotly.d3.csv(daily_tests_octat, function(err, rows){
        var dates=[], pos=[], neg=[], pos_rate=[];
        for (var i=0; i<rows.length; i++) {
            row = rows[i];
            for (var j=1; j< Object.keys(row).length; j++){
                if (i == 0) {  // positive                    
                    date = moment(Date.parse(Object.keys(row)[j])).format('M/D/YYYY');
                    dates.push(date);
                    pos.push(parseInt(row[date]));
                }
                else if (i == 1) { // negative
                    date = moment(Date.parse(Object.keys(row)[j])).format('M/D/YYYY');
                    dates.push(date);
                    neg.push(parseInt(row[date]));
                }
            }
        }
        for (var i=0; i<pos.length; i++){
            pos_rate.push(pos[i]/(pos[i]+neg[i]));
        }
        console.log(dates)
        console.log(pos)
        console.log(neg)
        var test_positive_data = {
            x: dates,
            y: pos_rate,
            type: 'bar',
            name: 'Daily test positive rate'
        };
        Plotly.newPlot(myPlotDiv3, [test_positive_data],layout3,{ responsive: true });

    });


    // At last we plot data :-)
    // Plotly.newPlot(myPlotDiv1, data1, layout1, { responsive: true });
    // Plotly.newPlot(myPlotDiv15, data15, layout15, { responsive: true });
    Plotly.newPlot(myPlotDiv2, data2, layout2, { responsive: true });
    // Plotly.newPlot(myPlotDiv3, data3, layout3, { responsive: true });
});



