import RaceResult from "../fixtures/raceResult.json";
import {
  ERROR_SELECTOR,
  LOADER_SELECTOR,
  TABLE_CELL_SELECTOR,
  TABLE_ROW_SELECTOR,
  PIN_CHECKBOX_SELECTOR,
  ERROR_HIGHLIGHT_SELECTOR,
  LINE_CHART_SELECTOR,
  RADAR_CHART_SELECTOR,
} from "../support/selectors";
import { API } from "../support/api";

const URL = `${API}/1950/1/results.json?limit=50`;
const RaceResults = RaceResult.MRData.RaceTable.Races[0].Results;

describe("Race Details Page", () => {
  beforeEach(() => {
    cy.intercept("GET", URL, {
      statusCode: 200,
      body: RaceResult,
      delay: 500,
    }).as("getRaceResult");

    cy.visit("http://localhost:3000/seasons/1950/races/1");
  });

  it("should dipslay a loader", () => {
    cy.get(LOADER_SELECTOR).should("be.visible");
    cy.wait("@getRaceResult");
    cy.get(LOADER_SELECTOR).should("not.exist");
  });

  it("should display an error message", () => {
    cy.intercept("GET", URL, {
      statusCode: 500,
      body: "Internal Server Error",
    }).as("getRaceResultError");

    cy.get(ERROR_SELECTOR).should("not.exist");
    cy.wait("@getRaceResultError");
    cy.get(ERROR_SELECTOR).should("be.visible");
  });

  it("should display the table view", () => {
    const driver = RaceResults[0];
    cy.get(TABLE_ROW_SELECTOR)
      .first()
      .within(() => {
        cy.get(TABLE_CELL_SELECTOR).should(
          "contain",
          `${driver.Driver.givenName} ${driver.Driver.familyName}`
        );
        cy.get(TABLE_CELL_SELECTOR).should(
          "contain",
          driver.Driver.nationality
        );
        cy.get(TABLE_CELL_SELECTOR).should("contain", driver.Constructor.name);
        cy.get(TABLE_CELL_SELECTOR).should("contain", driver.position);
      });
  });

  it("should highlight/unhighlight the driver", () => {
    cy.get(ERROR_HIGHLIGHT_SELECTOR).should("exist");
    cy.get(TABLE_ROW_SELECTOR)
      .first()
      .within(() => {
        cy.get(PIN_CHECKBOX_SELECTOR).should("exist").click();
        cy.get('input[type="checkbox"]').should("be.checked");
        cy.get(ERROR_HIGHLIGHT_SELECTOR).should("not.exist");
      });
  });

  it("should display the drivers line chart", () => {
    const lineChart = cy.get(LINE_CHART_SELECTOR);
    lineChart.should("be.visible");
    lineChart
      .find(".apexcharts-yaxis-label")
      .should("have.length", RaceResults.length);
    lineChart.should("contain", RaceResults[0].Driver.givenName);
  });

  it("should display the drivers radar chart", () => {
    const driverOne = RaceResults[0];
    const driverTwo = RaceResults[1];

    cy.get(TABLE_ROW_SELECTOR)
      .first()
      .within(() => {
        cy.get(PIN_CHECKBOX_SELECTOR).should("exist").click();
      });

    cy.get(TABLE_ROW_SELECTOR)
      .eq(1)
      .within(() => {
        cy.get(PIN_CHECKBOX_SELECTOR).should("exist").click();
      });

    const radarChart = cy.get(RADAR_CHART_SELECTOR);

    radarChart.should("be.visible");
    radarChart.find(".apexcharts-legend-series").should("have.length", 2);
    radarChart.should("contain", driverOne.Driver.givenName);
    radarChart.should("contain", driverTwo.Driver.givenName);
  });
});
