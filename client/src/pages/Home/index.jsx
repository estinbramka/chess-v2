import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchGet } from "../../function/fetch";

export default function Home({ gameID, setGameID }) {
    const navigate = useNavigate();
    const [name, setName] = useState('');


    useEffect(() => {
        let result = fetchGet('http://localhost:5000/session');
        result.then(res => {
            if (!res.auth) {
                navigate('/login')
            } else {
                setName(res.username);
            }
        })
    }, [navigate])

    function createGame() {
        if (gameID !== '') {
            navigate(`/`);
        }
    }

    return (
        <div>
            {name}
            <input type="text" value={gameID} onChange={(e) => setGameID(e.target.value)} />
            <button onClick={createGame}>create Game</button>
        </div>
    )
}