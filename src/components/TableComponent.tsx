import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Checkbox,
  IconButton,
} from "@mui/material";
import { PushPin, PushPinOutlined, OpenInNew } from "@mui/icons-material";
import { tableCellClasses } from "@mui/material/TableCell";
import { ListProps } from "../types/Props.types";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#9d1414",
    color: theme.palette.common.white,
    fontStyle: "italic",
    fontWeight: "bold",
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

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

  const openWikipedia = (
    e: React.MouseEvent<HTMLButtonElement>,
    url: string
  ) => {
    e.stopPropagation();
    window.open(url, "_blank");
  };

  return (
    <div style={{ width: "100%" }}>
      <TableContainer component={Paper} sx={{ maxHeight: 450 }}>
        <Table stickyHeader aria-label="Data Table">
          <TableHead>
            <TableRow>
              {Object.keys(headings).map((columnKey) => (
                <StyledTableCell key={columnKey} align="center">
                  {headings[columnKey]}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortRows().map((row, index) => (
              <StyledTableRow
                key={index}
                sx={{
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
                    <StyledTableCell key={columnKey} align="center">
                      {columnKey === "url" ? (
                        <IconButton
                          onClick={(e) => {
                            openWikipedia(e, rowValue);
                          }}
                        >
                          <OpenInNew />
                        </IconButton>
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
                          checkedIcon={<PushPin sx={{ color: "#9d1414" }} />}
                        />
                      ) : (
                        rowValue
                      )}
                    </StyledTableCell>
                  );
                })}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, { label: "All", value: data.length }]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default TableComponent;
