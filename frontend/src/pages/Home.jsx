import {useEffect, useState} from "react";
import './Home.css'
import { useNavigate } from 'react-router-dom';

function Home() {
    const [data, setData] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/weather`)
            const d = await response.json()
            setData(d)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    fetchData()
    }, []);

    let hurricanes = []
    if (data) {
        for (const [key, value] of Object.entries(data)) {
            hurricanes.push(key)
        }
    }

    const navigate = useNavigate();

    const handleClick = (hurricane) => {
        navigate(`/hurricanes/${hurricane}`);
    };

    return (
        <>
            <div>
                <h1>Disaster Dashboard</h1>
                {hurricanes.map((hurricane, index) => {
                        return (
                            <div key={index} onClick={() => handleClick(hurricane)} className="hurricane-nav">
                                <p>{hurricane}</p>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default Home