import windIcon from '../images/wind.png'
import rainIcon from '../images/rain.png'

export default function SingleHourTemplate(props) {
  
  return (
    props.hours.map((hour, i) => {
      const { conditions, datetime, precipprob, temp, windspeed } = hour
      return <div key={i} className='single--hour--div'>
        <button className='single--hour--btn'>
          <h2 className='single--hour--text'>{datetime.slice(0, 5)}</h2>
          <p className='single--hour--text'>{conditions}</p>
          <p className='single--hour--text'>{props.tempToggle ? `${props.tempChange(temp)}°C`  : temp + '°F'}</p>
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
    })
    
  )
}