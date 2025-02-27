import { menuAction } from "../Actions/menu.action";

const intialState = {
    menuData: []
}


const menuReducer = (state = intialState, action) => {
    // console.log(99999)
     console.log(action)
    switch (action.type) {
        case "Fetch Menu":
            return { ...state, menuData: action.payload };
        default:
            return state;
    }
}

export default menuReducer