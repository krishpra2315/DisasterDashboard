import { useParams } from 'react-router-dom'
import {useEffect, useState} from "react";
import './Hurricane.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj'
import 'ol/ol.css';

function Hurricane() {
    const { name } = useParams()
    const [data, setData] = useState(null)
    const [current, setCurrent] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/weather`)
            const d = await response.json()
            setData(d[name])
            setCurrent(data[0])
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    fetchData()
    }, []);

    useEffect(() => {
        const osmLayer = new TileLayer({
            preload: Infinity,
            source: new OSM(),
        })

        const map = new Map({
            target: "map",
            layers: [osmLayer],
            view: new View({
                center: [current ? parseInt(current["long"]) : 0, current ? parseInt(current["lat"]) : 0],
                zoom: 5,
                projection: 'EPSG:4326'
              }),
          });
      return () => map.setTarget(null)
    }, [current]);

    const dropdownChange = () => {
        let val = document.getElementById("time").value
        data.forEach((item, index) => {
                if (item[""] === val) {
                    setCurrent(item)
                }
            }
        )
    }

    const rangeChange = () => {
        let val = document.getElementById("time").value
        setCurrent(data[val - 1])
    }

    return (
        <>
            <div className="title-bar">
                <h1 className="title">{name}</h1>
            </div>
            {/*<div className="dropdown-container">
                <label>Choose a Time!</label>
                <select className="dropdown" id="time" onChange={dropdownChange}>
                    {data &&
                        data.map((event, index) => {
                            return (
                                <option value={event[""]}>{event["month"] + " " + event["day"] + " " + event["year"]
                                    + " " + event["hour"]}</option>
                            )
                        })
                    }
                </select>
            </div>*/}
            <div>
                <input onChange={rangeChange} type="range" min="1" max={data ? data.length.toString() : 0} id="time"/>
            </div>
            <div>
                {current &&
                    <div>
                    <p>latitude: {current["lat"]} longitude: {current["long"]} pressure: {current["pressure"]} wind: {current["wind"]}</p>
                    </div>}
            </div>
            <div style={{height: '500px', width: '100%'}} id="map" className="map-container"/>
        </>
    )
}

export default Hurricane