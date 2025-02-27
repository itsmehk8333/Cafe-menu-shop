import { createStore } from "redux";
import menuReducer from "./Reducers/menu.reducer";

const store = createStore(menuReducer);


export default store