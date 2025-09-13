import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // Local storage
import { persistReducer, persistStore } from "redux-persist";
import rootReducer from "./reducers"; // Root reducer

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store); // Persistor for Redux Persist
export default store;
