import {
  Stack,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { ContainerProps } from "../types/Props.types";

const Container = ({ children, view, title }: ContainerProps) => {
  return (
    <Stack spacing={2} alignItems="center" mt={5}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <Typography variant="h2" className="container-title">
          {title}
        </Typography>
        <ToggleButtonGroup
          value={view.value}
          exclusive
          onChange={(event, value) => view.onChange(event, value)}
          className="toggle-buttons"
        >
          <ToggleButton
            value="table"
            aria-label="table-button"
            size="small"
            data-testid="table-view-button"
          >
            Table View
          </ToggleButton>
          <ToggleButton
            value="card"
            aria-label="card"
            size="small"
            data-testid="card-view-button"
          >
            Card View
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      {children}
    </Stack>
  );
};

export default Container;
