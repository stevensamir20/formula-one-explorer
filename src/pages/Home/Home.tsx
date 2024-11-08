import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../state/store";
import {
  fetchSeasons,
  incrementOffset,
  selectSeasons,
} from "../../state/slices/seasonsSlice";

// Components
import { Alert } from "@mui/material";
import TableComponent from "../../components/TableComponent";
import Loader from "../../components/Loader";
import Container from "../../components/Container";
import CardView from "../../components/CardView";

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [view, setView] = useState<string>("table");

  const {
    data: seasons,
    total,
    offset,
    loading,
    error,
  } = useSelector((state: RootState) => selectSeasons(state));

  useEffect(() => {
    if (seasons.length === 0) {
      dispatch(fetchSeasons(0));
    }
  }, [dispatch]);

  const showMoreSeasons = () => {
    dispatch(incrementOffset());
    dispatch(fetchSeasons(offset + 20));
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
              headings={{ season: "Season", url: "Information" }}
              data={seasons}
              itemClick={{
                key: "season",
                link: "seasons",
              }}
            />
          ) : (
            <CardView
              headings={{ season: "Season", url: "Information" }}
              data={seasons}
              itemClick={{
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
