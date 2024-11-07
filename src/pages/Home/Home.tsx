import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { Season, FetchData } from "../../types/Home.types";
import { Alert } from "@mui/material";
import TableComponent from "../../components/TableComponent";
import Loader from "../../components/Loader";
import Container from "../../components/Container";
import CardView from "../../components/CardView";

const Home = () => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState<number>(0);
  const [view, setView] = useState<string>("table");

  const { data, error, loading } = useFetch(
    `seasons.json?limit=20&offset=${offset}`
  );

  useEffect(() => {
    if (data) {
      const newSeasons: Season[] = (data as FetchData).MRData.SeasonTable
        .Seasons;
      setSeasons((prevSeasons) => [...prevSeasons, ...newSeasons]);
      setTotal(parseInt((data as FetchData).MRData.total, 10));
    }
  }, [data]);

  const showMoreSeasons = () => {
    setOffset((prevOffset) => prevOffset + 20);
  };

  const changeView = (_event: React.MouseEvent<HTMLElement>, value: string) => {
    setView(value);
  };

  return (
    <>
      {loading && <Loader />}
      {seasons.length !== 0 && (
        <Container
          title="Seasons"
          button={{
            show: seasons.length < total,
            onClick: showMoreSeasons,
            loading: loading,
          }}
          view={{
            value: view,
            onChange: changeView,
          }}
        >
          {view === "table" ? (
            <TableComponent
              columns={{ season: "Season", url: "Information" }}
              data={seasons}
              rowClick={{
                key: "season",
                link: "seasons",
              }}
            />
          ) : (
            <CardView
              headings={{ season: "Season", url: "Information" }}
              data={seasons}
              cardClick={{
                key: "season",
                link: "seasons",
              }}
            />
          )}
        </Container>
      )}
      {error && <Alert severity="error">{error}</Alert>}
    </>
  );
};

export default Home;
