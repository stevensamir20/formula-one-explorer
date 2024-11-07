import React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

type Props = {
  children: React.ReactNode;
  title: string;
  button: {
    show: boolean;
    onClick: () => void;
    loading: boolean;
  };
  view: {
    value: string;
    onChange: (event: React.MouseEvent<HTMLElement>, value: string) => void;
  };
};

const Container = ({ children, view, title, button }: Props) => {
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
