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
  total: number;
  offset: number;
  loading: boolean;
  error: string | null;
}

const initialState: SeasonsState = {
  seasons: [],
  total: 0,
  offset: 0,
  loading: false,
  error: null,
};

export const fetchSeasons = createAsyncThunk(
  "seasons/fetchSeasons",
  async (offset: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API}seasons.json?limit=20&offset=${offset}`
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const seasonsSlice = createSlice({
  name: "seasons",
  initialState,
  reducers: {
    incrementOffset: (state) => {
      state.offset += 20;
    },
  },
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
        state.total = parseInt(action.payload.MRData.total, 10);
      })
      .addCase(fetchSeasons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { incrementOffset } = seasonsSlice.actions;
export const selectSeasons = (state: RootState) => state.seasons;
export default seasonsSlice.reducer;
