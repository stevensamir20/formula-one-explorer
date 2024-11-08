import { configureStore } from "@reduxjs/toolkit";
import seasonsReducer from "./slices/seasonsSlice";
import seasonDetailsReducer from "./slices/seasonDetailsSlice";
import raceDetailsReducer from "./slices/raceDetailsSlice";

export const store = configureStore({
  reducer: {
    seasons: seasonsReducer,
    seasonDetails: seasonDetailsReducer,
    raceDetails: raceDetailsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
