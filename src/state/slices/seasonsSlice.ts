import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { API } from "../../config/apiConfig";

interface Season {
  season: string;
  url: string;
}

interface SeasonsState {
  seasons: Season[];
  loading: boolean;
  error: string | null;
}

const initialState: SeasonsState = {
  seasons: [],
  loading: false,
  error: null,
};

export const fetchSeasons = createAsyncThunk(
  "seasons/fetchSeasons",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}seasons.json?limit=100`);

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.message) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

const seasonsSlice = createSlice({
  name: "seasons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeasons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeasons.fulfilled, (state, action) => {
        state.loading = false;
        state.seasons = [
          ...state.seasons,
          ...action.payload.MRData.SeasonTable.Seasons,
        ];
      })
      .addCase(fetchSeasons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectSeasons = (state: RootState) => state.seasons;
export default seasonsSlice.reducer;
