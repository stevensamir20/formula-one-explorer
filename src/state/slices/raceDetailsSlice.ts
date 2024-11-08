import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { RaceResult } from "../../types/RaceDetails.types";
import { API } from "../../config/apiConfig";

interface RaceDetailsState {
  raceResult: RaceResult[];
  loading: boolean;
  error: string | null;
}

const initialState: RaceDetailsState = {
  raceResult: [],
  loading: false,
  error: null,
};

export const fetchRaceDetails = createAsyncThunk(
  "raceDetails/fetchRaceDetails",
  async (
    { seasonId, raceId }: { seasonId: string; raceId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${API}${seasonId}/${raceId}/results.json`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const raceDetailsSlice = createSlice({
  name: "raceDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRaceDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRaceDetails.fulfilled, (state, action) => {
        const raceData: RaceResult[] =
          action.payload.MRData.RaceTable.Races[0].Results;
        state.raceResult = raceData;
        state.loading = false;
      })
      .addCase(fetchRaceDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectRaceDetails = (state: RootState) => state.raceDetails;
export default raceDetailsSlice.reducer;
