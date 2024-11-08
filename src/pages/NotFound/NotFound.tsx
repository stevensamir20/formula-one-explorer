import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Stack, Typography } from "@mui/material";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      height={"70vh"}
      spacing={4}
    >
      <Typography
        variant="h2"
        sx={{
          color: "#9d1414",
        }}
      >
        404 - Not Found
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/")}
        size="large"
        sx={{
          backgroundColor: "#9d1414",
        }}
      >
        Back to Home
      </Button>
    </Stack>
  );
};

export default NotFound;
