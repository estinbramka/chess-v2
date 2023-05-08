import { useNavigate } from "react-router-dom"

export default function Login({ name, setName }) {
    const navigate = useNavigate();

    function login() {
        if (name !== '') {
            navigate(`/home`);
        }
    }

    return (
        <div>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <button onClick={login}>Login</button>
        </div>
    );
}