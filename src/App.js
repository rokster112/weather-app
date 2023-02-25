import { useEffect, useState } from 'react'
import axios from 'axios'
import windIcon from './images/wind.png'
import rainIcon from './images/rain.png'
import sunriseIcon from  './images/sunrise.png'
import sunshineBG from './images/sunshine-bg.jpeg'
import sunriseBG from './images/sunrise-bg.jpeg'
import nightBG from './images/night-bg.jpeg'

const App = () => {

  //`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=TEVQGE7FLBXGQ6YZYYA8C5FW2&contentType=json`

  const [weatherData, setWeatherData] = useState()
  const [dayData, setDayData] = useState(false)
  const [tempToggle, setTempToggle] = useState(false)
  const [location, setLocation] = useState('london')
  const [inputField, setinputField] = useState('')
  const [error, setError] = useState(false)
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
  console.log(location)

  function handleChange(e) {
    setinputField(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setLocation(inputField.toLowerCase())
    setinputField('')
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

  // const time = Number(datetime.slice(0, 2))
  const time = 11
  const bgStyle = { backgroundImage: time < 10 && time >= 6  ? `url(${sunriseBG})` : time >= 10 && time < 21 ? `url(${sunshineBG})` : time >= 21 && time <= 24 || time >= 0 && time < 6 ? `url(${nightBG})` : '' }

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
            <div className='single--day--container'>
              <div className='day--header'>
                <button className='close--btn' onClick={() => {
                  setWeatherData(prevData => {
                    const updatedDay = prevData.days.map(day => {
                      return { ...day, clicked: false }
                    })
                    return { ...prevData, days: updatedDay }
                  })
                  setDayData(false)
                }}>&#10232;</button>
              </div>
              <div className='day--weather'>
                <div className='day--weather--left'>
                  <h3 className='day--title'>{resolvedAddress}</h3> 
                  <h3 className='day--weather--left--p'>{new Date(dayData.datetime).toLocaleString('en-GB', { weekday: 'long' })}</h3>
                  <p className='day--weather--left--p'>{dayData.datetime}</p>
                  <p className='day--weather--left--p'>Cloud cover: {dayData.cloudcover}</p>
                  <p className='day--weather--left--p'>Day&apos;s description: {dayData.description}</p>
                </div>
                <div className='day--weather--right'>
                  <div className='sunrise--div'>
                    <p className='sun--p'>{dayData.sunrise.slice(0, 5)}</p>
                    <img src={sunriseIcon} style={{ width: 40, height: 40 }} />
                    <p className='sun--p'>{dayData.sunset.slice(0, 5)}</p>
                  </div>
                  <p className='day--weather--right--p'>Max {tempToggle ? `${tempChange(dayData.tempmax)}°C`  : dayData.tempmax + '°F'}</p>
                  <p className='day--weather--right--p'>Min {tempToggle ? `${tempChange(dayData.tempmin)}°C`  : dayData.tempmin + '°F'}</p>
                  <p className='day--weather--right--p'>Feels like: {tempToggle ? `${tempChange(dayData.feelslike)}°C`  : dayData.feelslike + '°F'}</p>
                  <p className='day--weather--right--p'>{dayData.conditions}</p>
                  <p className='day--weather--right--p'>{tempToggle ? `${tempChange(dayData.temp)}°C`  : dayData.temp + '°F'}</p>
                  <div className='rain--day--div'>
                    <p className='day--weather--right--p'>{dayData.precipprob}%</p>
                    <img src={rainIcon} style={{ width: 40, height: 40 }} />
                  </div>
                  <div className='wind--day--div'>
                    <p className='day--weather--right--p'>{dayData.windspeed}mph</p>
                    <img src={windIcon} style={{ width: 40, height: 40 }} />
                  </div>
                </div>
              </div>
              <div className='day--data--hour'>
                {dayData.hours.map((hour, i) => {
                  const { conditions, datetime, precipprob, temp, windspeed } = hour
                  return <div key={i} className='single--hour--div'>
                    <button className='single--hour--btn'>
                      <h2 className='single--hour--text'>{datetime.slice(0, 5)}</h2>
                      <p className='single--hour--text'>{conditions}</p>
                      <p className='single--hour--text'>{tempToggle ? `${tempChange(temp)}°C`  : temp + '°F'}</p>
                      <div className='wind--div'>
                        <img src={windIcon} style={{ width: 40, height: 40 }} />
                        <p className='single--hour--text'>{windspeed}mph</p>
                      </div>
                      <div className='rain--div'>
                        <img src={rainIcon} style={{ width: 40, height: 40 }} />
                        <p className='single--hour--text'>{precipprob}%</p>
                      </div>
                    </button>
                  </div>
                })}
              </div>
            </div>
            :
            <>
              <div className='header--current--div'>
                <header>
                  <h3>{resolvedAddress}</h3>
                  <p>Timezone: {timezone}</p>
                  <p>Day&apos;s description - {description}</p>
                  <p>{conditions}</p>
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
                {days.map((day, index) => {
                  return <div key={index} className='individual--day'>
                    <button className='day--btn' value={day.clicked} onClick={() => {
                      setWeatherData(prevData => {
                        const updatedDays = [...prevData.days]
                        updatedDays[index].clicked = !updatedDays[index].clicked
                        return { ...prevData, days: updatedDays }
                      })
                      setDayData(day)
                    } }>
                      <>
                        <h4>{new Date(day.datetime).toLocaleString('en-GB', { weekday: 'long' })}</h4>
                        <p>{tempToggle ? `${tempChange(day.temp)}°C` : day.temp + '°F'}</p>
                        <div className='rain--div'>
                          <img src={rainIcon} style={{ width: 40, height: 40 }} />
                          <p>{precipprob}%</p>
                        </div>
                        <div className='wind--div'>
                          <img src={windIcon} style={{ width: 40, height: 40 }} />
                          <p>{day.windspeed}mph</p>
                        </div>
                      </>
                    </button>
                  </div>
                })}
              </div>
            </>
          }
        </>
      }
    </div>
  )
}

export default App
