import { useNavigate } from "react-router-dom";

export default function Home({name , gameID,setGameID}){
    const navigate = useNavigate();

    function createGame() {
        if (gameID !== '') {
            navigate(`/`);
        }
    }

    return(
        <div>
            {name}
            <input type="text" value={gameID} onChange={(e) => setGameID(e.target.value)} />
            <button onClick={createGame}>create Game</button>
        </div>
    )
}