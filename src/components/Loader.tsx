import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import Backdrop from "@mui/material/Backdrop";

const Loader = () => {
  return (
    <Backdrop sx={{ zIndex: 10 }} open={true}>
      <Stack sx={{ maxWidth: "100px", width: "100%" }} spacing={2}>
        <LinearProgress color="secondary" />
        <LinearProgress color="success" />
        <LinearProgress color="info" />
      </Stack>
    </Backdrop>
  );
};

export default Loader;
