import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { RaceState, Race } from "../../types/SeasonDetails.types";
import { API } from "../../config/apiConfig";

interface SeasonRaces {
  races: RaceState[];
  pinnedRaces: string[];
  total: number;
  offset: number;
  loading: boolean;
  error: string | null;
}

interface SeasonDetailsState {
  [seasonId: string]: SeasonRaces;
}

const initialState: SeasonDetailsState = {};

const loadPinnedRacesFromLocalStorage = () => {
  const pinnedRaces = localStorage.getItem("pinnedRaces");
  return pinnedRaces ? JSON.parse(pinnedRaces) : {};
};

const persistedPinnedRaces = loadPinnedRacesFromLocalStorage();

export const fetchRaces = createAsyncThunk(
  "seasonDetails/fetchRaces",
  async (
    { seasonId, offset }: { seasonId: string; offset: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${API}${seasonId}/races.json?limit=20&offset=${offset}`
      );

      return { seasonId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const seasonDetailsSlice = createSlice({
  name: "seasonDetails",
  initialState,
  reducers: {
    incrementOffset: (state, action: PayloadAction<string>) => {
      const seasonId = action.payload;

      if (state[seasonId]) {
        state[seasonId].offset += 20;
      }
    },
    togglePin: (
      state,
      action: PayloadAction<{ seasonId: string; raceId: string }>
    ) => {
      const { seasonId, raceId } = action.payload;
      const seasonData = state[seasonId];

      if (seasonData) {
        const isPinned = seasonData.pinnedRaces.includes(raceId);
        seasonData.pinnedRaces = isPinned
          ? seasonData.pinnedRaces.filter((id) => id !== raceId)
          : [...seasonData.pinnedRaces, raceId];

        localStorage.setItem(
          "pinnedRaces",
          JSON.stringify({
            ...persistedPinnedRaces,
            [seasonId]: seasonData.pinnedRaces,
          })
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRaces.pending, (state, action) => {
        const seasonId = action.meta.arg.seasonId;
        if (!state[seasonId]) {
          state[seasonId] = {
            races: [],
            pinnedRaces: persistedPinnedRaces[seasonId] || [],
            total: 0,
            offset: 0,
            loading: true,
            error: null,
          };
        } else {
          state[seasonId].loading = true;
        }
      })
      .addCase(fetchRaces.fulfilled, (state, action) => {
        const { seasonId, data } = action.payload;
        const racesData: Race[] = data.MRData.RaceTable.Races;
        const newRaces = racesData.map((race) => ({
          raceId: race.round,
          raceName: race.raceName,
          circuitName: race.Circuit.circuitName,
          date: new Date(race.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }));

        state[seasonId] = {
          ...state[seasonId],
          races: [...state[seasonId].races, ...newRaces],
          total: parseInt(data.MRData.total, 10),
          loading: false,
        };
      })
      .addCase(fetchRaces.rejected, (state, action) => {
        const seasonId = action.meta.arg.seasonId;
        state[seasonId].loading = false;
        state[seasonId].error = action.payload as string;
      });
  },
});

export const { incrementOffset, togglePin } = seasonDetailsSlice.actions;
export const selectSeasonDetails = (state: RootState, seasonId: string) =>
  state.seasonDetails[seasonId];
export default seasonDetailsSlice.reducer;
