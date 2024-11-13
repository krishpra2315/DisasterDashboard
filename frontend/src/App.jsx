import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
    const [data, setData] = useState(null)

    useEffect(() => {
        const fetchRoomData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/weather`)
            const d = await response.json()
            setData(d)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    fetchRoomData()
    }, []);


  return (
    <>
        <div>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    </>
  )
}

export default App
