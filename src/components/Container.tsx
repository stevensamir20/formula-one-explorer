import {
  Stack,
  Button,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { ContainerProps } from "../types/Props.types";

const Container = ({ children, view, title, button }: ContainerProps) => {
  return (
    <Stack spacing={2} alignItems="center" mt={5}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <ToggleButtonGroup
          value={view.value}
          exclusive
          onChange={(event, value) => view.onChange(event, value)}
        >
          <ToggleButton value="table" aria-label="table" size="small">
            Table View
          </ToggleButton>
          <ToggleButton value="card" aria-label="card" size="small">
            Card View
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      {children}
      {button.show && (
        <Button
          variant="outlined"
          color="primary"
          sx={{ width: "200px" }}
          onClick={button.onClick}
          disabled={button.loading}
        >
          {button.loading ? "Loading..." : " Show More"}
        </Button>
      )}
    </Stack>
  );
};

export default Container;
