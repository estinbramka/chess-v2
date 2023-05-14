import { useNavigate } from "react-router-dom"
import { fetchGet, fetchPost } from "../../function/fetch";
import { useEffect, useState } from "react";

export default function Login() {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        let result = fetchGet('/session');
        result.then(res => {
            if (res.auth) {
                navigate('/home');
            }
        })
    }, [navigate])

    async function login(e) {
        e.preventDefault();
        let result = await fetchPost('/login', { name });
        if (result.auth) {
            console.log(result);
            window.localStorage.setItem('Token', result.accessToken);
            window.localStorage.setItem('RefreshToken', result.refreshToken);
            navigate('/home');
        }
    }

    return (
        <form onSubmit={login}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <button onClick={login}>Login</button>
        </form>
    );
}