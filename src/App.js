import { useEffect, useState } from 'react'
import axios from 'axios'
import windIcon from './images/wind.png'
import rainIcon from './images/rain.png'
import sunriseIcon from  './images/sunrise.png'
import sunshineBG from './images/sunshine-bg.jpeg'
import sunriseBG from './images/sunrise-bg.jpeg'
import nightBG from './images/night-bg.jpeg'
import SingleDay from './components/SingleDay'
import AllDays from './components/AllDays'
import Alerts from './components/Alerts'
import warningIcon from './images/warning.png'



const App = () => {
  
  const [weatherData, setWeatherData] = useState()
  const [dayData, setDayData] = useState(false)
  const [tempToggle, setTempToggle] = useState(false)
  const [location, setLocation] = useState('london')
  const [inputField, setinputField] = useState('')
  const [error, setError] = useState(false)
  const [alertData, setAlertData] = useState(false)
  const apiKey = process.env.REACT_APP_API_KEY

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=${apiKey}&contentType=json`)
        const { days } = data
        const updatedDays = days.map(day => {
          return { ...day, clicked: false }
        })
        setWeatherData({ ...data, days: updatedDays })
        setError(false)
      } catch (error) {
        console.error('This is the error!!!', error)
        setError('Location provided does not exist, check your input and please try again.')
      }
    }
    getData()
  }, [location])

  function findGps() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        setinputField(`${latitude}, ${longitude}`)
      })
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }

  function handleChange(e) {
    setinputField(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setLocation(inputField.toLowerCase())
    setinputField('')
    setDayData(false)
    setAlertData(false)
  }

  function tempChange(temp) {
    const convertedToCelc = (temp - 32) * 5 / 9
    return convertedToCelc.toFixed(1) 
  }


  let resolvedAddress, alerts, timezone, days, currentConditions, description, cloudcover, conditions, datetime, feelslike, temp, humidity, sunrise, sunset, windspeed, precipprob
  
  if (weatherData) {
    ({ resolvedAddress, alerts, timezone, currentConditions, days, description } = weatherData),
    ({ cloudcover, conditions, datetime, feelslike, temp, humidity, sunrise, sunset, windspeed, precipprob } = currentConditions) 
  } else {
    return 'Data is unavailable'
  }

  const time = Number(datetime.slice(0, 2))
  // const time = 10
  const bgStyle = { backgroundImage: time < 10 && time >= 6  ? `url(${sunriseBG})` : time >= 10 && time < 21 ? `url(${sunshineBG})` : time >= 21 && time <= 24 || time >= 0 && time < 6 ? `url(${nightBG})` : '' }

  console.log('alert data', alertData)

  return (
    <div className='weather--app--container' style={bgStyle}>
      <div className='input--temp--div'>
        { error ? null :
          <button className='temp--convert--btn' onClick={() => {
            setTempToggle(!tempToggle)
          }}>{tempToggle ? 'Convert to °F' : 'Convert to °C'}</button>}
        {weatherData && <h1 className='time'>{datetime.slice(0, 5)}</h1>}
        <form onSubmit={handleSubmit}>
          <button type='button' className='location--btn' onClick={findGps}>&#8982;</button>
          <input onChange={handleChange} placeholder='Change location' value={inputField}/>
          <button className='submit--btn' type='submit'>Go</button>
        </form>
      </div>
      {error ?
        <p>{error}</p> : 
        weatherData &&
        <>
          {dayData ? 
            <SingleDay 
              dayData={dayData}
              resolvedAddress={resolvedAddress}
              tempChange={tempChange}
              setDayData={setDayData}
              setWeatherData={setWeatherData}
              tempToggle={tempToggle}
            />
            : alertData && alertData.length > 0 ?
              <Alerts 
                alertData={alertData}
                setAlertData={setAlertData}
              />
              :
              <>
                <div className='header--current--div'>
                  <header>
                    <h3>{resolvedAddress}</h3>
                    <p>Timezone: {timezone}</p>
                    <p>Day&apos;s description - {description}</p>
                    <p>Cloudcover: {cloudcover}</p>
                    <p>Humidity: {humidity}</p>
                    <p>{conditions}</p>
                    {alerts && alerts.length > 0 ? <button className='alert--btn' onClick={() => setAlertData(alerts)}><img style={{ width: 120, height: 80 }} src={warningIcon}/></button> : null}
                    {alerts && alerts.length > 0 ? <p className='alert--warning--p'>ALERT!</p> : null}
                  </header>

                  <div className='current--conditions'>
                    <div className='sunrise--div'>
                      <p className='sun--p'>{sunrise.slice(0, 5)}</p>
                      <img src={sunriseIcon} style={{ width: 40, height: 40 }} />
                      <p className='sun--p'>{sunset.slice(0, 5)}</p>
                    </div>
                    <p>Feels like: {tempToggle ? `${tempChange(feelslike)}°C`  : feelslike + '°F'}</p>
                    <p>{tempToggle ? `${tempChange(temp)}°C` : temp + '°F'}</p>
                    <div className='rain--current--div'>
                      <img src={rainIcon} style={{ width: 40, height: 40 }} />
                      <p>{precipprob}%</p>
                    </div>
                    <div className='wind--current--div'>
                      <img src={windIcon} style={{ width: 40, height: 40 }} />
                      <p>{windspeed}mph</p>
                    </div>
                  </div>
                </div>

                <div className='days--container'>
                  <AllDays 
                    days={days}
                    setDayData={setDayData}
                    setWeatherData={setWeatherData}
                    tempToggle={tempToggle}
                    tempChange={tempChange}
                  />
                </div>
              </>
          }
        </>
      }
    </div>
  )
}

export default App
