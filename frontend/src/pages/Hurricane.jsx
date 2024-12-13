import { useParams } from 'react-router-dom'
import {useEffect, useState} from "react";
import './Hurricane.css';
import {Feature, Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';
import {Point} from "ol/geom.js";
import {fromLonLat, transform} from "ol/proj.js";
import {Fill, Stroke, Style} from "ol/style.js";
import CircleStyle from "ol/style/Circle.js";
import VectorSource from "ol/source/Vector.js";
import VectorLayer from "ol/layer/Vector.js";
import { Circle as CircleGeometry } from 'ol/geom';
import { get as getProjection } from 'ol/proj';

function Hurricane() {
    const { name } = useParams()
    const [data, setData] = useState(null)
    const [current, setCurrent] = useState(null)
    const [loading, setLoading] = useState(true); // Track loading state

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/weather`)
            const d = await response.json()
            setData(d[name])
            setCurrent(data[0])
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    }

    fetchData()
    }, []);

    useEffect(() => {
        if(!data) {
            return;
        }
        const osmLayer = new TileLayer({
            preload: Infinity,
            source: new OSM(),
        })

        // Define the map's projection (EPSG:4326)
        const projection = getProjection('EPSG:4326');
        const circles = [];

        for (let i = 0; i < data.length; i++) {
            let curr = data[i];

            // Create a circle geometry
            const circle = new CircleGeometry([curr ? parseInt(curr["long"]) : 0,
                curr ? parseInt(curr["lat"]) : 0], (parseInt(curr["wind"]) ** 1.5)/2500);

            // Create a feature for the circle
            const circleFeature = new Feature(circle);
            circleFeature.setId(`${i}`);

            // Style the circle
            const circleStyle = new Style({
                fill: new Fill({
                    color: 'rgba(0, 0, 255)', // Semi-transparent blue
                }),
                stroke: new Stroke({
                    color: '#0000FF', // Blue border
                    width: 2,
                }),
            });

            circleFeature.setStyle(circleStyle);

            circles.push(circleFeature);
        }

        // Create a vector source and add the feature
        const vectorSource = new VectorSource({
          features: circles,
        });

        // Create a vector layer
        const vectorLayer = new VectorLayer({
          source: vectorSource,
        });

        // Add the vector layer to the map
        const map = new Map({
            target: "map",
            layers: [osmLayer, vectorLayer],
            view: new View({
                center: [current ? parseInt(data[0]["long"]) : 0, current ? parseInt(data[0]["lat"]) : 0],
                zoom: 5,
                projection: projection
            }),
        });

        map.on('singleclick', (evt) => {
            const features = map.getFeaturesAtPixel(evt.pixel); // Get features at the clicked pixel
            if (features.length > 0) {
              const clickedFeature = features[0];
              const featureId = clickedFeature.getId(); // Get the feature's ID
              setCurrent(data[parseInt(featureId)]);
            }
        });

        return () => map.setTarget(null)

    }, []);

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