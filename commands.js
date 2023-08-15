// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
/// <reference types="cypress"/>
require("@4tw/cypress-drag-drop");
require("cypress-downloadfile/lib/downloadFileCommand");

import "cypress-iframe";
// or
require("cypress-iframe");
import "cypress-file-upload";
import "./commands";
import "@testing-library/cypress/add-commands";
import "cypress-wait-until";

Cypress.Commands.add("checkBrokenLinks", () => {
  cy.get("a[href]").each(($a) => {
    const url = $a.prop("href");
    cy.request(url)
      .then((response) => {
        expect(response.status).to.eq(200);
      })
      .catch((error) => {
        cy.log(`Link ${url} is broken: ${error}`);
      });
  });
});

//######## Find Broken Links ###########
Cypress.Commands.add("checkBrokenLinks", () => {
  let brokenLinks = 0;
  let activeLinks = 0;

  cy.get("a")
    .each(($link, index) => {
      const href = $link.attr("href");
      if (href) {
        cy.request({ url: href, failOnStatusCode: false }).then((response) => {
          if (response.status >= 400) {
            cy.log(`**** link ${index + 1} is a Broken Link *** ${href} `);
            brokenLinks++;
          } else {
            cy.log(`*** link ${index + 1} is an Active Link ***`);
            activeLinks++;
          }
        });
      }
    })
    .then(($links) => {
      const totalLinks = $links.length;
      cy.step("==========Total links==========");
      cy.log(`**** total links **** ${totalLinks}`);
      cy.step("==========broken links==========");
      cy.log(`**** broken links **** ${brokenLinks}`);
      cy.step("==========active links==========");
      cy.log(`**** active links **** ${activeLinks}`);
    });
});

//++++++++ IMMO Session +++++++++++++//
Cypress.Commands.add("loginSession", () => {
  cy.session("Loginsession", () => {
    cy.visit("https://imo.ls.codesorbit.net/login");
    cy.get("#email").type("HaneefUllah00345@gmail.com");
    cy.get("#password").type("Haneef@12345");
    cy.get("form button").click();
  });
});

//########### download image ############
Cypress.Commands.add(
  "downloadImage",
  { prevSubject: "element" },
  (subject, downloadOptions = {}) => {
    cy.wrap(subject)
      .click()
      .then(() => {
        cy.wait(2000); // Wait for the download to complete (adjust as needed)
        cy.task("downloadFile", { url: "", ...downloadOptions });
      });
  }
);

// ########### Recursion #############

Cypress.Commands.add("recurse", (startNumber, iterations) => {
  let currentNumber = startNumber;

  const recursiveFunction = (number, count) => {
    if (count <= 0) {
      return number;
    } else {
      const newNumber = number * 2; // Example operation, you can modify this as per your needs
      return recursiveFunction(newNumber, count - 1);
    }
  };

  return recursiveFunction(currentNumber, iterations);
});

// ########### Recursion #############
Cypress.Commands.add("iframeCustom", { prevSubject: "element" }, ($iframe) => {
  return new Cypress.Promise((resolve) => {
    $iframe.ready(function () {
      resolve($iframe.contents().find("body"));
    });
  });
});
