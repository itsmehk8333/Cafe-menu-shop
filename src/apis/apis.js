import axios from "axios";
import { useDispatch } from "react-redux";
import { menuAction } from "../Redux/Actions/menu.action";


export async function getMenu() {
    const data = await axios.get("https://cafe-show-backend.onrender.com/api/categories");
    return data.data
}

