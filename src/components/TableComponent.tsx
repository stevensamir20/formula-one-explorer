import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Link,
  Checkbox,
} from "@mui/material";
import { PushPin, PushPinOutlined } from "@mui/icons-material";
import { ListProps } from "../types/Props.types";

const TableComponent = <T,>({
  headings,
  data,
  itemClick,
  itemPin,
  pinnedItems,
}: ListProps<T>) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const sortRows = () => {
    const sortedRows =
      pinnedItems && itemPin
        ? [...data].sort((a, b) => {
            if (pinnedItems.includes(String(a[itemPin.key as keyof T])))
              return -1;
            if (pinnedItems.includes(String(b[itemPin.key as keyof T])))
              return 1;
            return 0;
          })
        : [...data];
    return sortedRows.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  };

  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer component={Paper} sx={{ maxHeight: 450 }}>
        <Table stickyHeader aria-label="Data Table">
          <TableHead>
            <TableRow>
              {Object.keys(headings).map((columnKey) => (
                <TableCell key={columnKey} align="center">
                  {headings[columnKey]}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortRows().map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  cursor: itemClick ? "pointer" : "default",
                }}
                hover={itemClick ? true : false}
                onClick={() => {
                  if (itemClick) {
                    navigate(
                      `${itemClick.link}/${row[itemClick.key as keyof T]}`
                    );
                  }
                }}
              >
                {Object.keys(headings).map((columnKey) => {
                  const rowValue = String(row[columnKey as keyof T]);
                  return (
                    <TableCell key={columnKey} align="center">
                      {columnKey === "url" ? (
                        <Link
                          href={rowValue}
                          underline="none"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ color: "blue", "&:hover": { color: "red" } }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          {rowValue.split("/").pop()}
                        </Link>
                      ) : itemPin && columnKey === "pin" ? (
                        <Checkbox
                          checked={
                            pinnedItems?.includes(
                              String(row[itemPin.key as keyof T])
                            ) || false
                          }
                          onChange={() => {
                            itemPin.click(String(row[itemPin.key as keyof T]));
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          icon={<PushPinOutlined />}
                          checkedIcon={<PushPin />}
                        />
                      ) : (
                        rowValue
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, { label: "All", value: -1 }]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TableComponent;
