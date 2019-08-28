if (window.location.protocol == "http:") {
  console.log("You are not connected with a secure connection.")
  console.log("Reloading the page to a Secure Connection...")
  window.location = document.URL.replace("http://", "https://");
}

if (window.location.protocol == "https:") {
  console.log("You are connected with a secure connection.")
}
window.addEventListener("load", ()=> {
    let lon;
    let lat;
    if (navigator.geolocation) {
        var location_timeout = setTimeout( 10000);
        navigator.geolocation.getCurrentPosition(position => {
            lon = position.coords.longitude;
            lat = position.coords.latitude;
            createMap(lon, lat);
            getWeather(lon, lat);
            })
        }
    })

function getWeather(lon, lat) {
    let apiKey;
    let dateList = [];
    let weeklyTemp = [];
    let weeklyDay = [];
    let table = document.getElementById('forecast-table');
    let tempatureDegree = document.getElementById('degrees');
    let locationCity = document.getElementById('location-city');
    let weatherId = document.getElementById('weather-id');
    apiKey = '7bf568be902e6b7383dd57a83b294572';
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const url = `https://api.openweathermap.org`;
    const forecast = `${proxy}${url}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    const weather = `${proxy}${url}/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    fetch(weather)
        .then(response => {
            return response.json();
            })
        .then(data => {
            tempatureDegree.textContent = 'Current Tempature: ' + data.main.temp + '°F';
            locationCity.textContent = data.name;
            const iconId = data.weather[0]['icon'];
            weatherId.src = `${url}/img/w/${iconId}.png`;
            })
    fetch(forecast)
        .then(response => {
            return response.json();
            })
        .then(data => {
            for (let i = 0; i < data.list.length; i++) {
                weeklyDay.push(data.list[i]['dt_txt']);
                weeklyTemp.push(data.list[i]['main']['temp']);
                }
            weeklyDay.forEach(day => {
                let date = day;
                dateList.push(moment(date).format("MM/DD HH:mm"));
                })
            createForecastGraph(dateList, weeklyTemp);
            })
}

function createMap(lon, lat) {
    //Creating the map
    let baseMapLayer = new ol.layer.Tile({
      source: new ol.source.OSM()
    });
    let map = new ol.Map({
      target: 'map',
      layers: [baseMapLayer],
      view: new ol.View({
              center: ol.proj.fromLonLat([lon, lat]),
              zoom: 16 //Initial Zoom Level
            })
    });
    //Adding a marker on the map
    let marker = new ol.Feature({
      geometry: new ol.geom.Point(
        ol.proj.fromLonLat([lon, lat])
      ),
    });
    let vectorSource = new ol.source.Vector({
      features: [marker]
    });
    let markerVectorLayer = new ol.layer.Vector({
      source: vectorSource,
    });
    map.addLayer(markerVectorLayer);
}

function createForecastGraph(label, data) {
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: label,
            datasets: [{
                label: 'Hourly Forecast',
                data: data,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                pointHoverRadius: 7,
                pointHoverBackgroundColor: 'rgb(255, 99, 132)',
                pointHoverBorderWidth: 2,
                pointRadius: 4,
                pointHitRadius: 10,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {


                        beginAtZero: true
                    }
                }]
            }
        },

    });
}
