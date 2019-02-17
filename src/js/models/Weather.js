import axios from 'axios';
import { proxy, key, units } from '../config';
import * as util from '../utils/util';

export default class Weather{
  constructor(){
    //this.weather = {};
  }

  static fetchWeather(city, cb){
    // Fetch details from api
    /**
     * Rain and snow values are for last 3 hours in mm
     * humidity is in %
     * wind speed is in meter/sec
     * pressure is in hPa
     * temp are in degree celsius
     */

    // https://openweathermap.org/img/w/01d.png
    axios.get(`${proxy}https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${key}`)
      .then( (response) => {
        const responseCode = response.data.cod;
        //console.log(response);
        /*if(responseCode === "200"){
          //console.log(response.data.list[0]);
          const unixDateTime = response.data.list[0].dt;
          const jsDateTime = util.convertUnixTimestampToJavascriptDate(unixDateTime);
          console.log(jsDateTime);
          // this.weather = response.data.list[0].main;
          this.weatherData = {...response.data.list[0]};
          this.weatherData.date = jsDateTime;
          console.log(this.weatherData);

          
        }*/
        
        const {name,main,weather,sys, dt, wind, visibility} = {...response.data};
        
        let {sunrise, sunset} = {...sys};
        sunrise = util.convertUnixTimestampToJavascriptDate(sunrise);
        sunset = util.convertUnixTimestampToJavascriptDate(sunset);
        sunrise = sunrise.split(" ")[1];
        sunset = sunset.split(" ")[1];
        const weatherIcon = weather[0].icon;
        const weatherInfo = weather[0].main;
        const weatherDescription = weather[0].description;
        const humidity = main.humidity;
        const pressure = main.pressure;
        const currentTemp = main.temp;
        const minTemp = main.temp_min;
        const maxTemp = main.temp_max;

        this.weatherData = {
          main: {
            currentTemp,
            minTemp,
            maxTemp,
            weatherIcon,
            weatherInfo,
            weatherDescription,
            ...wind},
          dateTime: util.convertUnixTimestampToJavascriptDate(dt),
          location: name,
          details:{
            sunrise,
            sunset,
            visibility,
            humidity,
            pressure
          }
        };

        //console.log(this.weatherData);
        return cb(this.weatherData);

      })
      .catch( (error) => {
        //console.log(error);
        return cb(null);
      });
 
  }

  static fetchForecastWeather(city, cb){
    //console.log('in 123...');
    //api.openweathermap.org/data/2.5/forecast?q={city name},{country code}
    this.weatherForecastData = [];
    axios.get(`${proxy}https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${key}`)
      .then( (response) => {
        //console.log('Forecast...');
        const forecastData = response.data.list;
        forecastData.forEach((data)=>{
          const hourlyData = {
            dateTime: util.convertUnixTimestampToJavascriptDate(data.dt),
            currentTemp: data.main.temp,
            windSpeed :data.wind.speed,
            weatherIcon: data.weather[0].icon,
            weatherInfo: data.weather[0].main,
            weatherDescription: data.weather[0].description
          }
          this.weatherForecastData.push(hourlyData);
        });

        //console.log(this.weatherForecastData);

        return cb(this.weatherForecastData);

      })
      .catch( (error) => {
        //console.log(error);
        return cb(null);
      });

  }


  static getWeather(){
    // Return details
    return this.weatherData;
  }

  static getForecastWeather(){
    return this.weatherForecastData;
  }

}