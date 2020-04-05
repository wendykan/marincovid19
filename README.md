# Site
The site is at [https://marin-covid19.firebaseapp.com/](https://marin-covid19.firebaseapp.com/)
# Data Sources
During the Covid19 pandemic, I wanted to make a point to a neighbor on Nextdoor that the growth was significant. I couldn't find anywhere on the internet that has a collection of historic Marin County COVID19 cases data, so I made one myself quickly on a [Google Sheet](https://docs.google.com/spreadsheets/d/1neJU9AKBjDqCWke0x4d7QRSA9zqoPERahumhBKgLO1k/edit?usp=sharing). Since then, I've been getting messages on Nextdoor to keep my chart updated. I decided to make a nicer looking plot properly. 

- NYTimes covid-19 [data](https://github.com/nytimes/covid-19-data)
- My manual updates from from Marin HHS [daily updates](https://coronavirus.marinhhs.org/updates). 

## References
To sync Google Sheets data to Firebase Realtime DB:
https://medium.com/firebase-developers/sheets-to-firebase-33132e31935b

To make a plotly plot on site and push to Firebase
https://medium.com/@o.lourme/our-iot-journey-through-esp8266-firebase-angular-and-plotly-js-part-3-644048e90ca4

## My own notes

`firebase serve --only hosting`

`firebase deploy --only hosting`
