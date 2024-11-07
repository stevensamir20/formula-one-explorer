import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { RaceState, FetchData, Race } from "../../types/SeasonDetails.types";
import { Alert } from "@mui/material";
import TableComponent from "../../components/TableComponent";
import Loader from "../../components/Loader";
import Container from "../../components/Container";
import CardView from "../../components/CardView";

const SeasonDetails = () => {
  const { seasonId } = useParams<{ seasonId: string }>();
  const [races, setRaces] = useState<RaceState[]>([]);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState<number>(0);
  const [view, setView] = useState<string>("table");

  const { data, error, loading } = useFetch(
    `${seasonId}/races.json?limit=20&offset=${offset}`
  );

  useEffect(() => {
    if (data) {
      const racesData: Race[] = (data as FetchData).MRData.RaceTable.Races;
      const newRaces = racesData.map((race) => ({
        raceId: race.round,
        raceName: race.raceName,
        circuitName: race.Circuit.circuitName,
        date: new Date(race.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        pin: false,
      }));
      setRaces((prevRaces) => [...prevRaces, ...newRaces]);
      setTotal(parseInt((data as FetchData).MRData.total, 10));
    }
  }, [data]);

  const handleRacePin = (raceId: string) => {
    setRaces((prevRaces) => {
      const updatedRaces = prevRaces.map((race) =>
        race.raceId === raceId ? { ...race, pin: !race.pin } : race
      );
      const pinnedRaces = updatedRaces.filter((race) => race.pin);
      const unpinnedRaces = updatedRaces.filter((race) => !race.pin);

      return [...pinnedRaces, ...unpinnedRaces];
    });
  };

  const showMoreRaces = () => {
    setOffset((prevOffset) => prevOffset + 20);
  };

  const changeView = (_event: React.MouseEvent<HTMLElement>, value: string) => {
    setView(value);
  };

  return (
    <>
      {loading && <Loader />}
      {races.length !== 0 && (
        <Container
          title={`Season ${seasonId} Races`}
          button={{
            show: races.length < total,
            loading: loading,
            onClick: showMoreRaces,
          }}
          view={{
            value: view,
            onChange: changeView,
          }}
        >
          {view === "table" ? (
            <TableComponent
              columns={{
                pin: "Pin",
                raceName: "Race Name",
                circuitName: "Circuit Name",
                date: "Date",
              }}
              data={races}
              rowClick={{
                key: "raceId",
                link: "races",
              }}
              rowPin={{
                key: "raceId",
                click: (raceId: string) => {
                  handleRacePin(raceId);
                },
              }}
            />
          ) : (
            <CardView
              headings={{
                raceName: "Race Name",
                circuitName: "Circuit Name",
                date: "Date",
              }}
              cardClick={{
                key: "raceId",
                link: "races",
              }}
              cardPin={{
                value: "pin",
                key: "raceId",
                click: (raceId: string) => {
                  handleRacePin(raceId);
                },
              }}
              data={races}
            />
          )}
        </Container>
      )}
      {error && <Alert severity="error">{error}</Alert>}
    </>
  );
};

export default SeasonDetails;
