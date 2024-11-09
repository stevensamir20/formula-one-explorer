import { render, screen, fireEvent } from "@testing-library/react";
import Container from "../Container";
import "@testing-library/jest-dom";

describe("Container Component", () => {
  const view = {
    value: "table",
    onChange: jest.fn(),
  };

  beforeEach(() => {
    render(
      <Container title="Sample Title" view={view}>
        <div>Sample Child Content</div>
      </Container>
    );
    jest.clearAllMocks();
  });

  it("renders title and children correctly", () => {
    expect(screen.getByText("Sample Title")).toBeInTheDocument();
    expect(screen.getByText("Sample Child Content")).toBeInTheDocument();
  });

  it("renders toggle buttons and handles view change", () => {
    const tableViewButton = screen.getByTestId("table-view-button");
    const cardViewButton = screen.getByTestId("card-view-button");

    expect(tableViewButton).toBeInTheDocument();
    expect(cardViewButton).toBeInTheDocument();

    fireEvent.click(cardViewButton);
    expect(view.onChange).toHaveBeenCalledWith(expect.anything(), "card");
  });
});
