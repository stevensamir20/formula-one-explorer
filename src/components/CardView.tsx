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
  SxProps,
  Theme,
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
  const cardsPerPage = 15;
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
    <div>
      <Stack
        spacing={3}
        direction="row"
        useFlexGap
        sx={{ flexWrap: "wrap", justifyContent: "center" }}
        mb={4}
      >
        {sortCards().map((card, index) => (
          <Card
            sx={{ maxWidth: 400, minWidth: 250 }}
            key={index}
            data-testid="card"
          >
            <CardContent>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                }}
              >
                {Object.keys(headings).map((key, index) => {
                  const value = String(card[key as keyof T]);
                  const textStyles: SxProps<Theme> =
                    index === 0
                      ? {
                          "& p": {
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            color: "#9d1414",
                          },
                        }
                      : {};
                  return (
                    <ListItem key={key}>
                      <ListItemText
                        data-testid="card-list-item"
                        primary={headings[key]}
                        sx={{ ...textStyles }}
                        secondary={
                          key === "url" ? (
                            <Link
                              href={value}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-testid="external-link"
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
                variant="contained"
                onClick={() => {
                  navigate(
                    `${itemClick?.link}/${card[itemClick?.key as keyof T]}`
                  );
                }}
                sx={{
                  backgroundColor: "#9d1414",
                }}
                data-testid="card-button"
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
                  checkedIcon={<PushPin sx={{ color: "#9d1414" }} />}
                  data-testid="pin-checkbox"
                />
              )}
            </CardActions>
          </Card>
        ))}
      </Stack>
      {data.length > cardsPerPage && (
        <Stack spacing={2} alignItems="center" mb={4}>
          <Pagination
            count={Math.ceil(data.length / cardsPerPage)}
            shape="rounded"
            page={page}
            onChange={handleChange}
          />
        </Stack>
      )}
    </div>
  );
};

export default CardView;
