import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import TableComponent from "../TableComponent";
import { ListProps } from "../../types/Props.types";
import Seasons from "../../../cypress/fixtures/seasons.json";

interface SeasonData {
  season: string;
  url: string;
}

const mockSeasons = Seasons.MRData.SeasonTable.Seasons;
const mockHeadings = { season: "Season", url: "More Info", pin: "Pin" };
const mockItemClick = { link: "/seasons", key: "season" };
const mockItemPin = { key: "season", click: jest.fn() };

const renderComponent = (props?: Partial<ListProps<SeasonData>>) =>
  render(
    <BrowserRouter>
      <TableComponent<SeasonData>
        headings={mockHeadings}
        data={mockSeasons}
        itemClick={mockItemClick}
        itemPin={mockItemPin}
        pinnedItems={["1950"]}
        {...props}
      />
    </BrowserRouter>
  );

describe("Table Component with Seasons Data", () => {
  it("renders table rows with correct data", () => {
    renderComponent();
    const rows = screen.getAllByTestId("table-row");
    expect(rows).toHaveLength(10);
    const firstRow = screen.getByText("1950");
    expect(firstRow).toBeInTheDocument();
  });

  it("displays pinned items at the top", () => {
    renderComponent({ pinnedItems: ["1951"] });
    const firstRowItem = screen.getAllByTestId("table-row")[0];
    expect(firstRowItem).toHaveTextContent("1951");
  });

  it("navigates to the correct link on row click", () => {
    renderComponent();
    const firstRow = screen.getAllByTestId("table-row")[0];
    fireEvent.click(firstRow);
    expect(window.location.pathname).toBe(`/seasons/1950`);
  });

  it("handles pagination", () => {
    renderComponent();
    const nextPageButton = screen.getByRole("button", {
      name: "Go to next page",
    });
    fireEvent.click(nextPageButton);

    const rows = screen.getAllByTestId("table-row");
    expect(rows).toHaveLength(10);
  });
});
