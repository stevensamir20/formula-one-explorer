import { CircularProgress, Backdrop } from "@mui/material";

const Loader = () => {
  return (
    <Backdrop sx={{ zIndex: 10 }} open={true}>
      <CircularProgress
        size="4rem"
        sx={{
          color: "#9d1414",
        }}
      />
    </Backdrop>
  );
};

export default Loader;
