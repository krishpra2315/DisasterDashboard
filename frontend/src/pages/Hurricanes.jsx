import {useEffect, useState} from "react";
import './Hurricanes.css'
import { useNavigate } from 'react-router-dom';

function Hurricanes() {
    const [data, setData] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/weather`)
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
            <div className="header" onClick={() => navigate('/')}>
                <img src="/Users/krishprasad/Desktop/Projects/DisasterDashboard/frontend/src/assets/dd_logo.jpeg" 
                alt="Logo" style={{ cursor: 'pointer', width: '100px' }} />
                <h1>Hurricanes & Tropical Storms</h1>
            </div>
            <div>
                {hurricanes.map((hurricane, index) => {
                    return (
                        <div key={index} onClick={() => handleClick(hurricane)} className="hurricane-nav">
                            <p>{hurricane}</p>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default Hurricanes