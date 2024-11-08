import { Link, useLocation, matchPath } from "react-router-dom";
import { Box, AppBar, Toolbar, Button, Typography } from "@mui/material";

const Navbar = () => {
  const location = useLocation();

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
