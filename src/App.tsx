import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import SeasonDetails from "./pages/SeasonDetails/SeasonDetails";
import RaceDetails from "./pages/RaceDetails/RaceDetails";
import NotFound from "./pages/NotFound/NotFound";
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
