import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { RaceResult } from "../../types/RaceDetails.types";
import { API } from "../../config/apiConfig";

interface RaceDetailsState {
  raceResult: RaceResult[];
  raceName: string;
  loading: boolean;
  error: string | null;
}

const initialState: RaceDetailsState = {
  raceResult: [],
  raceName: "",
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
        `${API}${seasonId}/${raceId}/results.json?limit=50`
      );
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
        state.raceName = action.payload.MRData.RaceTable.Races[0].raceName;
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
