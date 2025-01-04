import {useEffect, useState} from "react";
import './Hurricanes.css'
import { useNavigate } from 'react-router-dom';
import logo from '../assets/dd_logo.png';
import React from 'react';

function Hurricanes() {
    const [data, setData] = useState(null)
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYears, setSelectedYears] = useState([]);

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

    const filteredHurricanes = hurricanes.filter(hurricane => {
        const [name, year] = hurricane.split(' (');
        const yearWithoutParenthesis = year.replace(')', '');
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesYear = selectedYears.length > 0 ? selectedYears.includes(yearWithoutParenthesis) : true;
        return matchesSearch && matchesYear;
    });

    const uniqueYears = [...new Set(hurricanes.map(hurricane => hurricane.split(' (')[1].replace(')', '')))].sort((a, b) => a - b);

    const navigate = useNavigate();

    const handleClick = (hurricane) => {
        navigate(`/hurricanes/${hurricane}`);
    };

    const handleYearChange = (e) => {
        const selectedYear = e.target.value;
        if (selectedYear && !selectedYears.includes(selectedYear)) {
            setSelectedYears([...selectedYears, selectedYear]);
        }
    };

    const removeYear = (yearToRemove) => {
        setSelectedYears(selectedYears.filter(year => year !== yearToRemove));
    };

    return (
        <>
            <div className="header" onClick={() => navigate('/')}>
                <h1>Hurricanes & Tropical Storms</h1>
            </div>
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Search hurricanes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select onChange={handleYearChange} value="">
                    <option value="">Filter years</option>
                    {uniqueYears.map((year, index) => (
                        <option key={index} value={year}>{year}</option>
                    ))}
                </select>
                <div className="selected-years">
                    {selectedYears.map((year, index) => (
                        <span key={index} className="selected-year">
                            {year} <button onClick={() => removeYear(year)}>x</button>
                        </span>
                    ))}
                </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {filteredHurricanes.map((hurricane, index) => {
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