import { useEffect, useState } from 'react'
import axios from 'axios'
import windIcon from './images/wind.png'
import rainIcon from './images/rain.png'
import sunriseIcon from  './images/sunrise.png'

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

  function handleChange(e) {
    setinputField(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setLocation(inputField.toLowerCase())
    setinputField('')
  }

  console.log(weatherData)

  function tempChange(temp) {
    const convertedToCelc = (temp - 32) * 5 / 9 
  }


  let resolvedAddress, alerts, timezone, days, currentConditions, description, cloudcover, conditions, datetime, feelslike, temp, humidity, sunrise, sunset, windspeed, precipprob
  
  if (weatherData) {
    ({ resolvedAddress, alerts, timezone, currentConditions, days, description } = weatherData),
    ({ cloudcover, conditions, datetime, feelslike, temp, humidity, sunrise, sunset, windspeed, precipprob } = currentConditions)
  } else {
    return 'Data is unavailable'
  }

  console.log('day data', dayData)

  return (
    <div className='weather--app--container'>
      <div>
        { error ? null :
          <button onClick={() => {
            setTempToggle(!tempToggle)
          }}>{tempToggle ? 'Convert to °F' : 'Convert to °C'}</button>}
        <form onSubmit={handleSubmit}>
          <input onChange={handleChange} placeholder='Change location' value={inputField}/>
          <button type='submit'>Go</button>
        </form>
      </div>
      {error ?
        <p>{error}</p> : 
        weatherData &&
        <>
          {dayData ? 
            <div>
              <h1>{resolvedAddress}</h1> 
              <h1 onClick={() => {
                setWeatherData(prevData => {
                  const updatedDay = prevData.days.map(day => {
                    return { ...day, clicked: false }
                  })
                  return { ...prevData, days: updatedDay }
                })
                setDayData(false)
              }}>X</h1>
              <div>
                <p>Cloud cover: {dayData.cloudcover}</p>
                <p>{dayData.description}</p>
                <p>Max {tempToggle ? `${((dayData.tempmax - 32) * 5 / 9).toFixed(1)}°C`  : dayData.tempmax + '°F'}</p>
                <p>Min {tempToggle ? `${((dayData.tempmin - 32) * 5 / 9).toFixed(1)}°C`  : dayData.tempmin + '°F'}</p>
                <p>Feels like: {tempToggle ? `${((dayData.feelslike - 32) * 5 / 9).toFixed(1)}°C`  : dayData.feelslike + '°F'}</p>
                <p>{dayData.conditions}</p>
                <p>{tempToggle ? `${((dayData.temp - 32) * 5 / 9).toFixed(1)}°C`  : dayData.temp + '°F'}</p>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <img src={rainIcon} style={{ width: 40, height: 40 }} />
                  <p>{dayData.precipprob}%</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <img src={windIcon} style={{ width: 40, height: 40 }} />
                  <p>{dayData.windspeed}</p>
                </div>
                <div className='sunrise--div'>
                  <p>{dayData.sunrise}</p>
                  <img src={sunriseIcon} style={{ width: 40, height: 40 }} />
                  <p>{dayData.sunset}</p>
                </div>
              </div>
              <div className='day--data--hour' style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', overflow: 'scroll' }}>
                {dayData.hours.map((hour, i) => {
                  const { conditions, datetime, precipprob, temp, windspeed } = hour
                  return <div key={i}>
                    <h2>{datetime.slice(0, 5)}</h2>
                    <p>{conditions}</p>
                    <p>{tempToggle ? `${((temp - 32) * 5 / 9).toFixed(1)}°C`  : temp + '°F'}</p>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <img src={windIcon} style={{ width: 40, height: 40 }} />
                      <p>{windspeed}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <img src={rainIcon} style={{ width: 40, height: 40 }} />
                      <p>{precipprob}%</p>
                    </div>
                  </div>
                })}
              </div>
            </div>
            :
            <><div>
              <h3>{resolvedAddress}</h3>
              <p>{timezone} - {datetime.slice(0, 5)}</p>
              <p>{description}</p>
            </div><>
              <div className='current--conditions'>
                <p>{conditions}</p>
                <p>Feels like: {tempToggle ? `${((feelslike - 32) * 5 / 9).toFixed(1)}°C`  : feelslike + '°F'}</p>
                <p>{tempToggle ? `${((temp - 32) * 5 / 9).toFixed(1)}°C` : temp + '°F'}</p>
                <div className='sunrise--div'>
                  <p>{sunrise.slice(0, 5)}</p>
                  <img src={sunriseIcon} style={{ width: 40, height: 40 }} />
                  <p>{sunset.slice(0, 5)}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <img src={rainIcon} style={{ width: 40, height: 40 }} />
                  <p>{precipprob}%</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <img src={windIcon} style={{ width: 40, height: 40 }} />
                  <p>{windspeed}</p>
                </div>
              </div></><div>
              <div className='days--container'>
                {days.map((day, index) => {
                  return <div key={index} className='individual--day'>
                    <button value={day.clicked} onClick={() => {
                      setWeatherData(prevData => {
                        const updatedDays = [...prevData.days]
                        updatedDays[index].clicked = !updatedDays[index].clicked
                        return { ...prevData, days: updatedDays }
                      })
                      setDayData(day)
                    } }>
                      <>
                        <h4>{new Date(day.datetime).toLocaleString('en-GB', { weekday: 'long' })}</h4>
                        <p>{tempToggle ? `${((day.temp - 32) * 5 / 9).toFixed(1)}°C` : day.temp + '°F'}</p>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                          <img src={rainIcon} style={{ width: 40, height: 40 }} />
                          <p>{precipprob}%</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                          <img src={windIcon} style={{ width: 40, height: 40 }} />
                          <p>{day.windspeed}</p>
                        </div>
                      </>
                    </button>
                  </div>
                })}
              </div>
            </div></>
          
          }
        </>
      }
    </div>
  )
}

export default App
