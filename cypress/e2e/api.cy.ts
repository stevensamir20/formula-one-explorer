import { API } from "../support/api";

describe("Seasons API Request", () => {
  it("validate API response and it's body", () => {
    cy.fixture("seasons.json").then((seasons) => {
      cy.intercept("GET", `${API}/seasons.json`, {
        statusCode: 200,
        body: seasons,
      }).as("getEntries");

      cy.request({
        method: "GET",
        url: `${API}/seasons.json`,
      }).as("getEntries");

      cy.get("@getEntries").should((response: any) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.eq(seasons);
      });
    });
  });
});

describe("Season Races API Request", () => {
  it("validate API response and it's body", () => {
    cy.fixture("races.json").then((races) => {
      cy.intercept("GET", `${API}/1950/races.json`, {
        statusCode: 200,
        body: races,
      }).as("getEntries");

      cy.request({
        method: "GET",
        url: `${API}/1950/races.json`,
      }).as("getEntries");

      cy.get("@getEntries").should((response: any) => {
        expect(response.status).to.eq(200);
        expect(response).to.have.property("headers");
        expect(response.body).to.deep.eq(races);
      });
    });
  });
});

describe("Race result API request", () => {
  it("validate API response and it's body", () => {
    cy.fixture("raceResult.json").then((raceResults) => {
      cy.intercept("GET", `${API}/1950/1/results.json`, {
        statusCode: 200,
        body: raceResults,
      }).as("getEntries");

      cy.request({
        method: "GET",
        url: `${API}/1950/1/results.json`,
      }).as("getEntries");

      cy.get("@getEntries").should((response: any) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.eq(raceResults);
      });
    });
  });
});
