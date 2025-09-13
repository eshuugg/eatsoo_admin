import { combineReducers } from "@reduxjs/toolkit";
import loginReducer from "../redux/Slicers/LoginSlicer";
import userReducer from "../redux/Slicers/userSlicer";
import categoryReducer from "./Slicers/CategorySlicer";
import inventoryReducer from "./Slicers/InventorySlicer";

const rootReducer = combineReducers({
  loginData: loginReducer,
  userData: userReducer,
  categoryData: categoryReducer,
  inventoryData: inventoryReducer,
});

export default rootReducer;