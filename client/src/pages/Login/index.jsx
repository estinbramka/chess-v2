import { useNavigate } from "react-router-dom"
import { fetchPost } from "../../function/fetch";

export default function Login({ name, setName }) {
    const navigate = useNavigate();

    function login(e) {
        e.preventDefault();
        fetchPost('http://localhost:5000/login',{name});
    }

    return (
        <form onSubmit={login}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <button onClick={login}>Login</button>
        </form>
    );
}