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
      <section
        style={{
          padding: "0 70px",
        }}
      >
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="seasons/:seasonId" element={<SeasonDetails />} />
          <Route
            path="seasons/:seasonId/races/:raceId"
            element={<RaceDetails />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </section>
    </>
  );
}

export default App;
