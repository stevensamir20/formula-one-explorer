import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import SeasonDetails from "./pages/seasonDetails/SeasonDetails";
import RaceDetails from "./pages/raceDetails/RaceDetails";
import NotFound from "./pages/notFound/NotFound";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="seasons/:seasonId" element={<SeasonDetails />} />
        <Route
          path="seasons/:seasonId/races/:raceId"
          element={<RaceDetails />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
