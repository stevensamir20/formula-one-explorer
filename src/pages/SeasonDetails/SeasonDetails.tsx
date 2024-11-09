import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import {
  fetchRaces,
  togglePin,
  selectSeasonDetails,
} from "../../state/slices/seasonDetailsSlice";

// Components
import { Alert } from "@mui/material";
import TableComponent from "../../components/TableComponent";
import Loader from "../../components/Loader";
import Container from "../../components/Container";
import CardView from "../../components/CardView";

const SeasonDetails: React.FC = () => {
  const { seasonId } = useParams<{ seasonId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const seasonDetails = useSelector((state: RootState) =>
    seasonId ? selectSeasonDetails(state, seasonId) : undefined
  );
  const {
    races = [],
    loading = false,
    error,
    pinnedRaces = [],
  } = seasonDetails || {};

  const [view, setView] = useState<string>("table");

  useEffect(() => {
    if (seasonId && races.length === 0) {
      dispatch(fetchRaces({ seasonId }));
    }
  }, [dispatch, seasonId, races.length]);

  const handleRacePin = (raceId: string) => {
    if (seasonId) dispatch(togglePin({ seasonId, raceId }));
  };

  const changeView = (_event: React.MouseEvent<HTMLElement>, value: string) => {
    setView(value);
  };

  return (
    <>
      {loading && <Loader />}
      {races.length !== 0 && (
        <Container
          title={`${seasonId}'s Races`}
          view={{
            value: view,
            onChange: changeView,
          }}
        >
          {view === "table" ? (
            <TableComponent
              headings={{
                pin: "",
                raceName: "Race Name",
                circuitName: "Circuit Name",
                country: "Place",
                date: "Date",
                url: "Location",
              }}
              data={races}
              itemClick={{
                key: "raceId",
                link: "races",
              }}
              itemPin={{
                key: "raceId",
                click: handleRacePin,
              }}
              pinnedItems={pinnedRaces}
            />
          ) : (
            <CardView
              headings={{
                raceName: "Race Name",
                circuitName: "Circuit Name",
                country: "Place",
                date: "Date",
                url: "Location",
              }}
              itemClick={{
                key: "raceId",
                link: "races",
              }}
              itemPin={{
                key: "raceId",
                click: handleRacePin,
              }}
              data={races}
              pinnedItems={pinnedRaces}
            />
          )}
        </Container>
      )}
      {error && (
        <Alert data-testid="error" severity="error" sx={{ mt: 5 }}>
          {error}
        </Alert>
      )}
    </>
  );
};

export default SeasonDetails;
