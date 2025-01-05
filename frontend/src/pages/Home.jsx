import {useNavigate, useLocation} from "react-router-dom";
import NewsApi from "newsapi";
import {useEffect, useState} from "react";
import './Home.css';

function Home() {
    const newsAPIKey = import.meta.env.VITE_NEWS_API_KEY;
    const [newsData, setNewsData] = useState(null);

    useEffect(() => {
        const url = `https://api.currentsapi.services/v1/latest-news?apiKey=${newsAPIKey}&language=en`;

        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            // Filter articles based on keywords
            const keyword = "storms"; // Define the keyword you're searching for
            const filteredArticles = data.news.filter((article) =>
              article.title.toLowerCase().includes(keyword.toLowerCase()) ||
              article.description.toLowerCase().includes(keyword.toLowerCase())
            );

            setNewsData(filteredArticles);
          })
          .catch((error) => console.error("Error fetching news:", error));

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
                <div className="background-image"/>
                <div className="hurricane-box">
                    <p className="description">
                        Click below to access our large database of hurricanes where you can find information about their paths and the impact they had on surrounding areas.
                    </p>
                    <button className="button" onClick={() => handleClick("hurricanes")}>Hurricanes</button>
                </div>
            </div>
            <h2 className="news-header">Recent News</h2>
            <div className="news-container">
                {newsData && newsData.map((item, index) => (
                    <div className="news-item" key={index}>
                        {item.image && <img src={item.image} alt={item.title} className="news-image"/>}
                        <h2 className="news-title">{item.title}</h2>
                        <p className="news-description">{item.description}</p>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="news-link">Read more</a>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home;