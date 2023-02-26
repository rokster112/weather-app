import windIcon from '../images/wind.png'
import rainIcon from '../images/rain.png'
import sunriseIcon from  '../images/sunrise.png'
import SingleHourTemplate from './SingleHourTemplate'

export default function SingleDay(props) {
  const { datetime, cloudcover, description, sunrise, sunset, tempmax, tempmin, temp, conditions, feelslike, precipprob, windspeed, hours } = props.dayData

  return (
    <div className='single--day--container'>
      <div className='day--header'>
        <button className='day--close--btn' onClick={() => {
          props.setWeatherData(prevData => {
            const updatedDay = prevData.days.map(day => {
              return { ...day, clicked: false }
            })
            return { ...prevData, days: updatedDay }
          })
          props.setDayData(false)
        }}>&#10232;</button>
      </div>
      <div className='day--weather'>
        <div className='day--weather--left'>
          <h3 className='day--title'>{props.resolvedAddress}</h3> 
          <h3 className='day--weather--left--p'>{new Date(datetime).toLocaleString('en-GB', { weekday: 'long' })}</h3>
          <p className='day--weather--left--p'>{datetime}</p>
          <p className='day--weather--left--p'>Cloud cover: {cloudcover}</p>
          <p className='day--weather--left--p'>Day&apos;s description: {description}</p>
        </div>
        <div className='day--weather--right'>
          <div className='sunrise--div'>
            <p className='sun--p'>{sunrise.slice(0, 5)}</p>
            <img src={sunriseIcon} style={{ width: 40, height: 40 }} />
            <p className='sun--p'>{sunset.slice(0, 5)}</p>
          </div>
          <p className='day--weather--right--p'>Max {props.tempToggle ? `${props.tempChange(tempmax)}°C`  : tempmax + '°F'}</p>
          <p className='day--weather--right--p'>Min {props.tempToggle ? `${props.tempChange(tempmin)}°C`  : tempmin + '°F'}</p>
          <p className='day--weather--right--p'>Feels like: {props.tempToggle ? `${props.tempChange(feelslike)}°C`  : feelslike + '°F'}</p>
          <p className='day--weather--right--p'>{conditions}</p>
          <p className='day--weather--right--p'>{props.tempToggle ? `${props.tempChange(temp)}°C`  : temp + '°F'}</p>
          <div className='rain--day--div'>
            <p className='day--weather--right--p'>{precipprob}%</p>
            <img src={rainIcon} style={{ width: 40, height: 40 }} />
          </div>
          <div className='wind--day--div'>
            <p className='day--weather--right--p'>{windspeed}mph</p>
            <img src={windIcon} style={{ width: 40, height: 40 }} />
          </div>
        </div>
      </div>
      <div className='day--data--hour'>
        <SingleHourTemplate 
          hours={hours}
          tempChange={props.tempChange}
          tempToggle={props.tempToggle}
        />
      </div>
    </div>
  )
}