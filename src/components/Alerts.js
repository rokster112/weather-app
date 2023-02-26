export default function Alerts(props) {
  console.log('alerts', props.alertData)
  return (
    <div className='alert--container'>
      <button className='alert--close--btn' onClick={() => props.setAlertData(false)}>&#10232;</button>
      <div className='alert--text--container'>
        {props.alertData.map(alert => {
          return <div className='alert--text--div' key={alert.id}>
            <h3 className='alert--text'>{alert.event}</h3>
            <a href={alert.link} rel='noreferrer' target='_blank'>
              <h4 className='alert--text'>{alert.headline}</h4>
            </a>
            <h5 className='alert--text'>Starts: {new Date(alert.onsetEpoch * 1000).toString().slice(0, 21)}</h5>
            <h5 className='alert--text'>Ends: {new Date(alert.endsEpoch * 1000).toString().slice(0, 21)}</h5>
            <p className='alert--text'>{alert.description}</p>
          </div>
        })}
      </div>
    </div>
  )
}