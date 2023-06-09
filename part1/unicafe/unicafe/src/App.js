import { useState } from "react"


const Button = ({handleClick, text}) => {
  return <button onClick={handleClick}>{text}</button>
}

const Header = ({text}) => {
  return <h2>{text}</h2>
}

const StatisticLine = ({text, value}) => {
  return <tr>
            <td>{text}</td>
            <td>{value}</td>
        </tr>
        }

const Statistics = ({clicks}) => {
  const average = (clicks.good + (clicks.bad * - 1)) / clicks.total
  const positive = clicks.good / clicks.total * 100 

  if (clicks.total === 0) {
    return <div>No feedback given!</div>
  }

  return (
        <div>
          <table>
            <tbody>
            <StatisticLine text="good" value={clicks.good}/>
            <StatisticLine text="neutral" value={clicks.neutral}/>
            <StatisticLine text="bad" value={clicks.bad}/>
            <StatisticLine text="all" value={clicks.total}/>
            <StatisticLine text="average" value={average}/>
            <StatisticLine text="positive" value={positive}/>
            </tbody>
          </table>
        </div>
  )
}


const App = () => {

  const [clicks, setClicks] = useState({
    good: 0,
    neutral: 0,
    bad: 0,
    total: 0
  })

  const addGood = () => {
    setClicks({...clicks, good : clicks.good + 1, total : clicks.total + 1})
  }

  const addNeutral = () => {
    setClicks({...clicks, neutral : clicks.neutral + 1, total : clicks.total + 1})
  }

  const addBad = () => {
    setClicks({...clicks, bad : clicks.bad + 1, total : clicks.total + 1})
  }


  return (
    <div>
      <Header text="Give feedback:" />
      <Button handleClick={addGood} text="good"></Button>
      <Button handleClick={addNeutral} text="neutral"></Button>
      <Button handleClick={addBad} text="bad"></Button>

      <div>
        <Header text="Statistics" />
        <Statistics clicks={clicks}/>      
      </div>
    </div>
  )
}

export default App;