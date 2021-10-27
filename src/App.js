import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import LineChartComponent from './components/linechartcomponent';
import CardComponent from './components/cardcomponent';
import SearchArea from './components/SearchArea';
import ResultArea from './components/ResultArea';
import LoadingComponent from './components/loadingcomponent';

const App = () => {
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');
  const [city, setCity] = useState('');
  const [weatherInfo, setWeatherInfo] = useState('');
  const [searchInfo, setSearchInfo] = useState('');

  const success = async (pos) => {
    const coordination = await pos.coords;
    setLat(coordination.latitude);
    setLong(coordination.longitude);
  };

  const fetchLocation = () => {
    window.navigator.geolocation.getCurrentPosition(success);
  };

  const fetchWeatherInfo = async () => {
    if (lat && long) {
      try {
        const response = await axios.get(
          //   `https://api.weatherapi.com/v1/forecast.json?key=73ed49046fd4425c884172718210709&q=${lat},${long}&days=5&aqi=no&alerts=no`
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=dededf11a524f6e8f013f1a6861da9fc`
        );
        setWeatherInfo(response.data, console.log(response.data));
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchLocation();
    fetchWeatherInfo();
  }, [long]);

  const inputEl = useRef(null);
  const onButtonClick = () => {
    inputEl.current.focus();
  };

  const onInputChange = (e) => {
    setCity(e.target.value);
  };

  const onFormSubmit = () => {
    try {
      axios
        .get(
          //   `https://api.weatherapi.com/v1/forecast.json?key=73ed49046fd4425c884172718210709&q=${city}&days=5&aqi=no&alerts=no`
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=dededf11a524f6e8f013f1a6861da9fc`
          //   `api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}`
        )
        .then((response) =>
          setSearchInfo(response.data, console.log(response.data.coord))
        );
    } catch (error) {
      console.log(error);
    }
  };

  const info = searchInfo ? searchInfo : weatherInfo;
  const date = new Date(
    info?.location?.localtime_epoch * 1000
  ).toLocaleDateString('en-GB', { dateStyle: 'full' });

  const time = new Date(
    info?.location?.localtime_epoch * 1000
  ).toLocaleTimeString('en-GB', { timeStyle: 'short' });

  const lastUpdated = new Date(
    info?.current?.last_updated_epoch * 1000
  ).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <div className='App'>
      {!weatherInfo ? (
        <LoadingComponent />
      ) : (
        <>
          <div className='left-side'>
            <SearchArea
              onFormSubmit={onFormSubmit}
              onButtonClick={onButtonClick}
              city={city}
              inputEl={inputEl}
              weatherInfo={weatherInfo}
              onInputChange={onInputChange}
            />
            <ResultArea
              info={info}
              date={date}
              time={time}
              lastUpdated={lastUpdated}
            />
          </div>
          <div className='right-side'>
            <LineChartComponent graph={info?.forecast?.forecastday[0]?.hour} />
            <div className='card-container'>
              <CardComponent
                today='Today'
                info={info?.forecast?.forecastday[0]}
              />
              <CardComponent info={info?.forecast?.forecastday[1]} />
              <CardComponent info={info?.forecast?.forecastday[2]} />
              <CardComponent info={info?.forecast?.forecastday[3]} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
