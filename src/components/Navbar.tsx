import { Link, useLocation, matchPath } from "react-router-dom";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const Navbar = () => {
  const location = useLocation();

  // Check if we are at the /seasons/:seasonId/races/:raceId path
  const match = matchPath(
    "/seasons/:seasonId/races/:raceId",
    location.pathname
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/">FORMULA 1</Link>
          </Typography>

          {match && (
            <Button color="inherit" variant="contained">
              <Link to={`/seasons/${match.params.seasonId}`}>
                Back to Season {match.params.seasonId}
              </Link>
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
