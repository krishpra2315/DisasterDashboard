import {useNavigate} from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    const handleClick = (page) => {
        navigate(`/${page}`);
    };

    return(
        <>
            <div>
                <h1>Disaster Dashboard</h1>
                <button onClick={() => handleClick("hurricanes")}>Hurricanes</button>
            </div>
        </>
    )
}

export default Home;