import axios from "axios";
import { useDispatch } from "react-redux";
import { menuAction } from "../Redux/Actions/menu.action";


export async function getMenu() {
    const data = await axios.get("http://localhost:4000/api/categories");
    return data.data
}

