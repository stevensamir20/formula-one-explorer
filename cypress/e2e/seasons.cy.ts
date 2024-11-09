import Seasons from "../fixtures/seasons.json";
import {
  CARD_BUTTON_SELECTOR,
  CARD_EXTERNAL_LINK_SELECTOR,
  CARD_LIST_ITEM_SELECTOR,
  CARD_SELECTOR,
  CARD_VIEW_BUTTON_SELECTOR,
  ERROR_SELECTOR,
  LOADER_SELECTOR,
  TABLE_CELL_SELECTOR,
  TABLE_EXTERNAL_LINK_SELECTOR,
  TABLE_ROW_SELECTOR,
} from "../support/selectors";
import { API } from "../support/api";

const URL = `${API}/seasons.json?limit=100`;
const Season = Seasons.MRData.SeasonTable.Seasons[0];

describe("Home Page", () => {
  beforeEach(() => {
    cy.intercept("GET", URL, {
      statusCode: 200,
      body: Seasons,
      delay: 500,
    }).as("getSeasons");

    cy.visit("http://localhost:3000/");
  });

  it("should dipslay a loader", () => {
    cy.get(LOADER_SELECTOR).should("be.visible");
    cy.wait("@getSeasons");
    cy.get(LOADER_SELECTOR).should("not.exist");
  });

  it("should display an error message", () => {
    cy.intercept("GET", URL, {
      statusCode: 500,
      body: "Internal Server Error",
    }).as("getSeasonsError");

    cy.get(ERROR_SELECTOR).should("not.exist");
    cy.wait("@getSeasonsError");
    cy.get(ERROR_SELECTOR).should("be.visible");
  });

  it("should display the table view", () => {
    cy.get(TABLE_ROW_SELECTOR)
      .first()
      .within(() => {
        cy.get(TABLE_CELL_SELECTOR).should("contain", Season.season);
        cy.get(TABLE_EXTERNAL_LINK_SELECTOR).should("exist");
      });
    cy.get(TABLE_ROW_SELECTOR).first().click();
    cy.url().should("include", Season.season);
  });

  it("should display the card view", () => {
    cy.get(CARD_VIEW_BUTTON_SELECTOR).click();
    cy.get(CARD_SELECTOR).should("have.length", 15);

    cy.get(CARD_SELECTOR)
      .first()
      .within(() => {
        cy.get(CARD_LIST_ITEM_SELECTOR).should("contain", Season.season);
        cy.get(CARD_EXTERNAL_LINK_SELECTOR)
          .should("exist")
          .and("have.attr", "href", Season.url);
        cy.get(CARD_BUTTON_SELECTOR).should("exist");
        cy.get(CARD_BUTTON_SELECTOR).click();
        cy.url().should("include", Season.season);
      });
  });
});
