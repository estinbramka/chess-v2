import { Link, useNavigate } from "react-router-dom";
import { fetchPost } from "../../function/fetch";

export default function Navbar() {
    const navigate = useNavigate();

    async function logout() {
        let refreshToken = window.localStorage.getItem('RefreshToken');
        let result = await fetchPost('/auth/logout', { token: refreshToken });
        if (!result.auth) {
            window.localStorage.removeItem('Token');
            window.localStorage.removeItem('RefreshToken');
            navigate("/login");
        }
        console.log(result);
    }

    return (
        <div>
            <Link to="/home">Home</Link>
            <button onClick={logout}>Logout</button>
        </div>
    );
}