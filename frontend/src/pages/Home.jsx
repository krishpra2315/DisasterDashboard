import {useNavigate, useLocation} from "react-router-dom";
import NewsApi from "newsapi";
import {useEffect, useState} from "react";
import './Home.css';

function Home() {
    const newsAPIKey = import.meta.env.VITE_NEWS_API_KEY;

    const [newsData, setNewsData] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch(
                    `https://newsapi.org/v2/top-headlines?q=natural_disaster&language=en&from=2024-11-18&apiKey=${newsAPIKey}`
                );
                const data = await response.json();
                console.log(data.totalResults);
                setNewsData(data);
            } catch (error) {
                console.error("Error fetching news:", error);
            }
        };

        fetchNews();
    }, [])

    const navigate = useNavigate();
    const handleClick = (page) => {
        navigate(`/${page}`);
    };

    return(
        <div className="home-container">
            <div className="scroll-watcher"></div>
            <div className="title-container">
                <h1 className="title">Disaster Dashboard</h1>
            </div>
            <div className="hurr-container">
                <div className="background-image" />
                <div className="hurricane-box">
                    <p className="description">Click below to learn more about previous hurricanes, their paths, and their impacts.</p>
                    <button className="button" onClick={() => handleClick("hurricanes")}>Hurricanes</button>
                </div>
            </div>
            <div className="news-container">
                <span><pre>{JSON.stringify(newsData)}</pre></span>
            </div>
        </div>
    )
}

export default Home;