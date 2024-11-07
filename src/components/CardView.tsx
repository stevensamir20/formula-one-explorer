import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Link from "@mui/material/Link";
import Checkbox from "@mui/material/Checkbox";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";

interface Props<T> {
  headings: { [key: string]: string };
  data: T[];
  cardClick: {
    link: string;
    key: string;
  };
  cardPin?: {
    value: string;
    key: string;
    click: (id: string) => void;
  };
}

const CardView = <T,>({ headings, data, cardClick, cardPin }: Props<T>) => {
  const navigate = useNavigate();

  return (
    <Stack
      spacing={3}
      direction="row"
      useFlexGap
      sx={{ flexWrap: "wrap", justifyContent: "center" }}
    >
      {data.map((card, index) => (
        <Card sx={{ maxWidth: 400, minWidth: 250 }} key={index}>
          <CardContent>
            <List
              sx={{
                width: "100%",
                maxWidth: 360,
              }}
            >
              {Object.keys(headings).map((key) => {
                const value = String(card[key as keyof T]);
                return (
                  <ListItem key={key}>
                    <ListItemText
                      primary={headings[key]}
                      secondary={
                        key === "url" ? (
                          <Link
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Visit Link
                          </Link>
                        ) : (
                          value
                        )
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          </CardContent>
            <CardActions
            sx={{
              justifyContent: cardPin ? "space-between" : "center",
            }}
            >
            <Button
              size="small"
              color="primary"
              variant="outlined"
              onClick={() => {
              navigate(`${cardClick.link}/${card[cardClick.key as keyof T]}`);
              }}
            >
              View Details
            </Button>{" "}
            {cardPin && (
              <Checkbox
              checked={Boolean(card[cardPin.value as keyof T])}
              onChange={() => {
                cardPin.click(String(card[cardPin.key as keyof T]));
              }}
              icon={<FavoriteBorder />}
              checkedIcon={<Favorite />}
              />
            )}
            </CardActions>
        </Card>
      ))}
    </Stack>
  );
};

export default CardView;
