import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import Checkbox from "@mui/material/Checkbox";

interface Props<T> {
  columns: { [key: string]: string };
  data: T[];
  rowClick?: {
    link: string;
    key: string;
  };
  rowPin?: {
    key: string;
    click: (id: string) => void;
  };
}

const TableComponent = <T,>({ columns, data, rowClick, rowPin }: Props<T>) => {
  const navigate = useNavigate();

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 1000, maxHeight: 450 }}>
      <Table stickyHeader aria-label="Data Table">
        <TableHead>
          <TableRow>
            {Object.keys(columns).map((columnKey) => (
              <TableCell key={columnKey} align="center">
                {columns[columnKey]}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={index}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                cursor: rowClick ? "pointer" : "default",
              }}
              hover={rowClick ? true : false}
              onClick={() => {
                if (rowClick) {
                  navigate(`${rowClick.link}/${row[rowClick.key as keyof T]}`);
                }
              }}
            >
              {Object.keys(columns).map((columnKey) => {
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
                    ) : rowPin && columnKey === "pin" ? (
                      <Checkbox
                        checked={Boolean(row[columnKey as keyof T])}
                        onChange={() => {
                          rowPin.click(String(row[rowPin.key as keyof T]));
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
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
  );
};

export default TableComponent;
