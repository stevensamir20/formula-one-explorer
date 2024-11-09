import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CardView from "../CardView";
import { ListProps } from "../../types/Props.types";
import Seasons from "../../../cypress/fixtures/seasons.json";

interface SeasonData {
  season: string;
  url: string;
}

const mockSeasons = Seasons.MRData.SeasonTable.Seasons;
const mockHeadings = { season: "Season", url: "More Info" };
const mockItemClick = { link: "/seasons", key: "season" };
const mockItemPin = { key: "season", click: jest.fn() };

const renderComponent = (props?: Partial<ListProps<SeasonData>>) =>
  render(
    <BrowserRouter>
      <CardView<SeasonData>
        headings={mockHeadings}
        data={mockSeasons}
        itemClick={mockItemClick}
        itemPin={mockItemPin}
        {...props}
      />
    </BrowserRouter>
  );

describe("Card View Component with Seasons Data", () => {
  it("renders cards with correct season data", () => {
    renderComponent();
    const cards = screen.getAllByTestId("card");
    expect(cards).toHaveLength(15);

    const firstCard = screen.getByText("1950");
    expect(firstCard).toBeInTheDocument();
  });

  it("shows pinned items at the top", () => {
    renderComponent({ pinnedItems: ["1951"] });
    const firstCardItem = screen
      .getAllByTestId("card-list-item")[0]
      .getElementsByTagName("p")[0];
    expect(firstCardItem).toHaveTextContent("1951");
  });

  it("navigates to the correct link on 'View Details' button click", () => {
    renderComponent();
    const viewDetailsButton = screen.getAllByTestId("card-button")[0];
    fireEvent.click(viewDetailsButton);
    expect(window.location.pathname).toBe(`/seasons/1950`);
  });

  it("renders external links correctly", () => {
    renderComponent();
    const linkElements = screen.getAllByTestId("external-link");
    expect(linkElements[0]).toHaveAttribute(
      "href",
      "http://en.wikipedia.org/wiki/1950_Formula_One_season"
    );
  });

  it("checks pagination", () => {
    renderComponent();
    const nextPageButton = screen.getByRole("button", { name: "Go to page 2" });
    fireEvent.click(nextPageButton);

    const cards = screen.getAllByTestId("card");
    expect(cards).toHaveLength(mockSeasons.length - 15);
  });
});
