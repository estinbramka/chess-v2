import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchGet, fetchPost } from "../../function/fetch";
import Navbar from "../../components/navbar";

export default function Home() {
    const navigate = useNavigate();
    const [name, setName] = useState('');


    useEffect(() => {
        let result = fetchGet('/auth/session');
        result.then(res => {
            if (!res.auth) {
                navigate('/login')
            } else {
                setName(res.user.name);
            }
        })
    }, [navigate])

    async function createGame(e) {
        e.preventDefault();
        const startingSide = e.target.elements.namedItem("createStartingSide").value;
        let game = await fetchPost('/games/', { startingSide });
        //console.log(game);
        if(game){
            navigate(`/${game.code}`);
        }
    }

    return (
        <div>
            <Navbar></Navbar>
            {name}
            <form onSubmit={createGame}>
                <select name="createStartingSide" id="createStartingSide">
                    <option value="random">Random</option>
                    <option value="white">White</option>
                    <option value="black">Black</option>
                </select>
                <button type="submit">Create</button>
            </form>
        </div>
    )
}