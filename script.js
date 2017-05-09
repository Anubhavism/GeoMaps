      var map, infoWindow;
      var pos = {
              lat: 0,
              lng: 0 
            };
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: pos,
          zoom: 6
        });
        var marker = new google.maps.Marker({
          position: pos,
          map: map,
          draggable: true
        });
        infoWindow = new google.maps.InfoWindow;
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            pos.lat=position.coords.latitude;
            pos.lng=position.coords.longitude;
            map.setCenter(pos);
            marker.setPosition(pos);
            marker.setMap(map);
            weatherUpdate(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          handleLocationError(false, infoWindow, map.getCenter());
        }
        marker.addListener('dragend', function() {
          map.setCenter(marker.getPosition());
          pos.lat=marker.getPosition().lat();
          pos.lng=marker.getPosition().lng();
          weatherUpdate(pos);
        });
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }
      function weatherUpdate(pos){
        var openWeatherMapKey = "a051d73e4268b2723f0520dffbef3332";
        var url="http://api.openweathermap.org/data/2.5/weather?lat="+pos.lat+"&lon="+pos.lng+"&appid="+openWeatherMapKey+"&units=metric";
        var blockUI = document.getElementById("overlay");
        if (!blockUI.classList.contains('active')) {
          blockUI.className += " active";
        }
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            document.getElementById("weather-json").innerHTML = this.responseText;
            var weatherData = JSON.parse(this.responseText);
            if(!!weatherData.name) {
              document.getElementById("w-location").innerHTML = weatherData.name;
            }
            var d = new Date();
            document.getElementById("w-date").innerHTML = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + (d.getHours()>9?d.getHours():'0'+d.getHours()) + ' : ' + d.getMinutes();
            if(!!weatherData.weather[0].main && !!weatherData.weather[0].description) {
              document.getElementById("w-desc").innerHTML = weatherData.weather[0].main + ' - ' + weatherData.weather[0].description;
            }
            if(!!weatherData.main.temp) {
              document.getElementById("w-temp").innerHTML = weatherData.main.temp + '<sup><small>&deg; C</small><sup>';
            }
            if(!!weatherData.main.humidity) {
              document.getElementById("w-humidity").innerHTML = 'Humidity : ' + weatherData.main.humidity + '%';
            }
            if(!!weatherData.wind.speed) {
              document.getElementById("w-wind").innerHTML = 'Wind : ' + weatherData.wind.speed + 'km/h';
            }
            if (blockUI.classList.contains('active')) {
              blockUI.classList.remove("active");
            }
          }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
      }