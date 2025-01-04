import { useParams } from 'react-router-dom'
import {useEffect, useState, useRef} from "react";
import './Hurricane.css';
import {Feature, Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';
import {Fill, Stroke, Style} from "ol/style.js";
import VectorSource from "ol/source/Vector.js";
import VectorLayer from "ol/layer/Vector.js";
import { Circle as CircleGeometry } from 'ol/geom';
import { get as getProjection } from 'ol/proj';
import {GoogleGenerativeAI} from "@google/generative-ai";
import MarkdownView from "react-showdown";
import { Link } from 'react-router-dom';

function Hurricane() {
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const { name } = useParams()
    const [data, setData] = useState(null)
    const [current, setCurrent] = useState(null)
    const [loading, setLoading] = useState(true); // Track loading state
    const [tooltip, setTooltip] = useState({
        visible: false,
        content: '',
        position: [0, 0],
    });
    const [aiResponse, setAiResponse] = useState(''); // State to store AI response
    const [isTabVisible, setIsTabVisible] = useState(false); // State to manage tab visibility

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await fetch(`/api/weather`)
            const d = await response.json()
            setData(d[name])

            const genAI = new GoogleGenerativeAI(`${geminiApiKey}`);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `Give me a short summary about weather event ${name}`;

            const result = await model.generateContent(prompt);
            setAiResponse(result.response.text());
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
        const circleStyle = new Style({
            fill: new Fill({
                color: 'rgba(0, 0, 255)', // Semi-transparent blue
            }),
            stroke: new Stroke({
                color: '#0000FF', // Blue border
                width: 2,
            }),
        });

        for (let i = 0; i < data.length; i++) {
            let curr = data[i];

            // Create a circle geometry
            const circle = new CircleGeometry([curr ? parseInt(curr["long"]) : 0,
                curr ? parseInt(curr["lat"]) : 0], (parseInt(curr["wind"]) ** 1.5)/2500);

            // Create a feature for the circle
            const circleFeature = new Feature(circle);
            circleFeature.setId(`${i}`);

            circleFeature.setProperties({
                latitude: curr["lat"],
                longitude: curr["long"],
                pressure: curr["pressure"],
                wind: curr["wind"]
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
                center: [data[0] ? parseInt(data[0]["long"]) : 0, data[0] ? parseInt(data[0]["lat"]) : 0],
                zoom: 5,
                projection: projection
            }),
        });

        const hoverStyle = new Style({
            fill: new Fill({
              color: 'rgba(0, 0, 255, 0.3)', // Semi-transparent yellow
            }),
            stroke: new Stroke({
              color: '#0000FF', // Yellow border
              width: 3,
            }),
        });

        let hoveredFeature = null;

        map.on('pointermove', (evt) => {
            if (hoveredFeature) {
                // Reset the style of the previously hovered feature
                hoveredFeature.setStyle(circleStyle);
                hoveredFeature = null;
            }

            const features = map.getFeaturesAtPixel(evt.pixel);
            if (features.length > 0) {
                const feature = features[0];
                feature.setStyle(hoverStyle); // Apply the hover style
                hoveredFeature = feature;
                const props = feature.getProperties();

                setTooltip({
                    visible: true,
                    content: `
                        <p>Latitude: ${props.latitude}</p>
                        <p>Longitude: ${props.longitude}</p>
                        <p>Wind: ${props.wind} mph</p>
                    `,
                    position: evt.pixel,
                });
            } else {
                setTooltip({ visible: false });
            }
        });

        return () => map.setTarget(null)

    }, [data]);

    // Function to toggle the visibility of the tab
    const toggleTabVisibility = () => {
        setIsTabVisible(prev => !prev);
    };

    return (
        <>
            <div className="title-bar">
                <Link to="/hurricanes" className="hurricane-title" style={{textDecoration: 'none'}}>
                    Hurricanes & Tropical Storms:
                </Link>
                <h1 className="hurricane-title">{name}</h1>
            </div>
            {tooltip.visible && (
                <div
                    style={{
                        position: 'absolute',
                        background: 'white',
                        padding: '5px',
                        border: '1px solid black',
                        zIndex: 1000,
                        pointerEvents: 'none',
                        left: tooltip.position[0] + 10, // Slight offset for visibility
                        top: tooltip.position[1] + 10,
                    }}
                >
                    <div dangerouslySetInnerHTML={{__html: tooltip.content}}/>
                </div>
            )}
            <div style={{height: '90%', width: '100%'}} id="map" className="map-container"/>

            <div>
                <button onClick={toggleTabVisibility} style={isTabVisible ? {right: '330px'} : {}} className="toggle-button">
                    {isTabVisible ? 'x' : '<'}
                </button>
                {isTabVisible && (
                    <div className="overlay-tab">
                        <h2>About</h2><br></br>
                        <MarkdownView markdown={aiResponse} />
                    </div>
                )}
            </div>
        </>
    )
}

export default Hurricane