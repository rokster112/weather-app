import windIcon from '../images/wind.png'
import rainIcon from '../images/rain.png'

export default function AllDays(props) {

  return (
    props.days.map((day, index) => {
      return <div key={index} className='individual--day'>
        <button className='day--btn' value={day.clicked} onClick={() => {
          props.setWeatherData(prevData => {
            const updatedDays = [...prevData.days]
            updatedDays[index].clicked = !updatedDays[index].clicked
            return { ...prevData, days: updatedDays }
          })
          props.setDayData(day)
        } }>
          <>
            <h4>{new Date(day.datetime).toLocaleString('en-GB', { weekday: 'long' })}</h4>
            <p>{props.tempToggle ? `${props.tempChange(day.temp)}°C` : day.temp + '°F'}</p>
            <div className='rain--div'>
              <img src={rainIcon} style={{ width: 40, height: 40 }} />
              <p>{day.precipprob}%</p>
            </div>
            <div className='wind--div'>
              <img src={windIcon} style={{ width: 40, height: 40 }} />
              <p>{day.windspeed}mph</p>
            </div>
          </>
        </button>
      </div>
    })
  )
}