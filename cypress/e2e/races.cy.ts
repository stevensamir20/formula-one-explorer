import Races from "../fixtures/races.json";
import {
  CARD_BUTTON_SELECTOR,
  CARD_LIST_ITEM_SELECTOR,
  CARD_SELECTOR,
  CARD_VIEW_BUTTON_SELECTOR,
  TABLE_VIEW_BUTTON_SELECTOR,
  ERROR_SELECTOR,
  LOADER_SELECTOR,
  TABLE_CELL_SELECTOR,
  TABLE_EXTERNAL_LINK_SELECTOR,
  TABLE_ROW_SELECTOR,
  PIN_CHECKBOX_SELECTOR,
} from "../support/selectors";
import { API } from "../support/api";

const URL = `${API}/1950/races.json?limit=100`;
const FirstRace = Races.MRData.RaceTable.Races[0];
const SecondRace = Races.MRData.RaceTable.Races[1];

const raceShouldBeVisible = (race, selector) => {
  cy.get(selector).should("contain", race.raceName);
  cy.get(selector).should(
    "contain",
    new Date(race.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );
  cy.get(selector).should("contain", race.Circuit.circuitName);
  cy.get(selector).should(
    "contain",
    `${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`
  );
};

describe("Season Details Page", () => {
  beforeEach(() => {
    cy.intercept("GET", URL, {
      statusCode: 200,
      body: Races,
      delay: 500,
    }).as("getRaces");

    cy.visit("http://localhost:3000/seasons/1950");
  });

  it("should dipslay a loader", () => {
    cy.get(LOADER_SELECTOR).should("be.visible");
    cy.wait("@getRaces");
    cy.get(LOADER_SELECTOR).should("not.exist");
  });

  it("should display an error message", () => {
    cy.intercept("GET", URL, {
      statusCode: 500,
      body: "Internal Server Error",
    }).as("getRacesError");

    cy.get(ERROR_SELECTOR).should("not.exist");
    cy.wait("@getRacesError");
    cy.get(ERROR_SELECTOR).should("be.visible");
  });

  it("should display the table view", () => {
    cy.get(TABLE_ROW_SELECTOR)
      .first()
      .within(() => {
        raceShouldBeVisible(FirstRace, TABLE_CELL_SELECTOR);
        cy.get(TABLE_EXTERNAL_LINK_SELECTOR).should("exist");
      });
    cy.get(TABLE_ROW_SELECTOR).first().click();
    cy.url().should(
      "include",
      `seasons/${FirstRace.season}/races/${FirstRace.round}`
    );
  });

  it("should display the card view", () => {
    cy.get(CARD_VIEW_BUTTON_SELECTOR).click();
    cy.get(CARD_SELECTOR).should("be.visible");

    cy.get(CARD_SELECTOR)
      .first()
      .within(() => {
        raceShouldBeVisible(FirstRace, CARD_LIST_ITEM_SELECTOR);

        cy.get(CARD_BUTTON_SELECTOR).should("exist");
        cy.get(CARD_BUTTON_SELECTOR).click();
        cy.url().should(
          "include",
          `seasons/${FirstRace.season}/races/${FirstRace.round}`
        );
      });
  });

  it("should pin/unpin the race in table/card displays", () => {
    cy.get(TABLE_ROW_SELECTOR)
      .first()
      .within(() => {
        cy.get(PIN_CHECKBOX_SELECTOR).should("exist").click();
        cy.get('input[type="checkbox"]').should("be.checked");
      });

    cy.get(CARD_VIEW_BUTTON_SELECTOR).click();

    cy.get(CARD_SELECTOR)
      .first()
      .within(() => {
        cy.get('input[type="checkbox"]').should("be.checked");
        cy.get(PIN_CHECKBOX_SELECTOR).should("exist").click();
        cy.get('input[type="checkbox"]').should("not.be.checked");
      });

    cy.get(TABLE_VIEW_BUTTON_SELECTOR).click();

    cy.get(TABLE_ROW_SELECTOR)
      .first()
      .within(() => {
        cy.get('input[type="checkbox"]').should("not.be.checked");
      });
  });

  it("Should move the pinned races to the top of the table/card displays", () => {
    cy.get(TABLE_ROW_SELECTOR)
      .eq(1)
      .within(() => {
        cy.get(PIN_CHECKBOX_SELECTOR).should("exist").click();
      });

    cy.get(TABLE_ROW_SELECTOR)
      .first()
      .within(() => {
        raceShouldBeVisible(SecondRace, TABLE_CELL_SELECTOR);
      });

    cy.get(CARD_VIEW_BUTTON_SELECTOR).click();

    cy.get(CARD_SELECTOR)
      .first()
      .within(() => {
        raceShouldBeVisible(SecondRace, CARD_LIST_ITEM_SELECTOR);
        cy.get(PIN_CHECKBOX_SELECTOR).should("exist").click();
      });
  });

  it("Should presist the pinned races after a page reload", () => {
    cy.get(TABLE_ROW_SELECTOR)
      .first()
      .within(() => {
        cy.get('input[type="checkbox"]').should("not.be.checked");
        cy.get(PIN_CHECKBOX_SELECTOR).should("exist").click();
        cy.get('input[type="checkbox"]').should("be.checked");
      });

    cy.reload();

    cy.get(TABLE_ROW_SELECTOR)
      .first()
      .within(() => {
        cy.get('input[type="checkbox"]').should("be.checked");
        cy.get(PIN_CHECKBOX_SELECTOR).click();
      });
  });
});
