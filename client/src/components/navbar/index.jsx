import { Link, useNavigate } from "react-router-dom";
import { fetchGet } from "../../function/fetch";

export default function Navbar() {
    const navigate = useNavigate();

    async function logout() {
        let result = await fetchGet('http://localhost:5000/logout');
        if (!result.auth) {
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