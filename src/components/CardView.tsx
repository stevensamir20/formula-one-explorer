import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stack,
  Card,
  CardContent,
  Button,
  CardActions,
  List,
  ListItem,
  ListItemText,
  Link,
  Checkbox,
  Pagination,
  Paper,
} from "@mui/material";
import { PushPin, PushPinOutlined } from "@mui/icons-material";
import { ListProps } from "../types/Props.types";

const CardView = <T,>({
  headings,
  data,
  itemClick,
  itemPin,
  pinnedItems,
}: ListProps<T>) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const cardsPerPage = 12;
  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const sortCards = () => {
    const sortedCards =
      pinnedItems && itemPin
        ? [...data].sort((a, b) => {
            if (pinnedItems.includes(String(a[itemPin.key as keyof T])))
              return -1;
            if (pinnedItems.includes(String(b[itemPin.key as keyof T])))
              return 1;
            return 0;
          })
        : [...data];
    return sortedCards.slice(
      (page - 1) * cardsPerPage,
      (page - 1) * cardsPerPage + cardsPerPage
    );
  };

  return (
    <Paper>
      <Stack
        spacing={3}
        direction="row"
        useFlexGap
        sx={{ flexWrap: "wrap", justifyContent: "center" }}
      >
        {sortCards().map((card, index) => (
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
                justifyContent: itemPin ? "space-between" : "center",
              }}
            >
              <Button
                size="small"
                color="primary"
                variant="outlined"
                onClick={() => {
                  navigate(
                    `${itemClick?.link}/${card[itemClick?.key as keyof T]}`
                  );
                }}
              >
                View Details
              </Button>
              {itemPin && (
                <Checkbox
                  checked={
                    pinnedItems?.includes(
                      String(card[itemPin.key as keyof T])
                    ) || false
                  }
                  onChange={() => {
                    itemPin.click(String(card[itemPin.key as keyof T]));
                  }}
                  icon={<PushPinOutlined />}
                  checkedIcon={<PushPin />}
                />
              )}
            </CardActions>
          </Card>
        ))}
      </Stack>
      {data.length > cardsPerPage && (
        <Stack spacing={2}>
          <Pagination
            count={Math.ceil(data.length / cardsPerPage)}
            variant="outlined"
            color="secondary"
            page={page}
            onChange={handleChange}
          />
        </Stack>
      )}
    </Paper>
  );
};

export default CardView;
