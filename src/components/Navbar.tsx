import { Link } from "react-router-dom";
import { AppBar, Toolbar } from "@mui/material";
import Logo from "../assets/logo.png";

const Navbar = () => {
  return (
    <AppBar
      position="static"
      component="nav"
      className="navbar"
      sx={{
        backgroundColor: "#9D1414",
      }}
    >
      <Toolbar
        sx={{
          gap: "20px",
          paddingLeft: "70px",
          paddingRight: "70px",
        }}
      >
        <img src={Logo} alt="Logo" width="144px" height="36px" />
        <Link
          to="/"
          style={{
            fontSize: "18px",
            color: "white",
            textDecoration: "none",
          }}
        >
          Home
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
