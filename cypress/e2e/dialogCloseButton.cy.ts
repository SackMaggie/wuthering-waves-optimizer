// #632: a dialog's close (X) stays in the box's corner while the dialog content scrolls,
// instead of scrolling away with it (style.css pins the X's form with position: sticky).
describe("Dialog close button", () => {
  it("stays in the corner while the Optimizer Guide scrolls", () => {
    cy.visit("/");
    cy.get('[data-test-calculator-nav="optimizer"]').click();
    cy.get("[data-test-optimizer-guide-btn]").click();

    cy.get(".modal[open] .modal-box").as("box");
    cy.get("@box").should(($box) => {
      expect($box[0].scrollHeight, "guide is long enough to scroll").to.be.greaterThan($box[0].clientHeight);
    });

    const xOffset = ($box: JQuery<HTMLElement>) => {
      const box = $box[0].getBoundingClientRect();
      const x = $box[0].querySelector(':scope > form[method="dialog"] .btn-circle')!.getBoundingClientRect();
      return { top: x.top - box.top, right: box.right - x.right };
    };

    cy.get("@box").then(($box) => {
      const atTop = xOffset($box);
      cy.get("@box").scrollTo("bottom");
      cy.get("@box").should(($scrolled) => {
        expect($scrolled[0].scrollTop).to.be.greaterThan(0);
        const scrolled = xOffset($scrolled);
        expect(scrolled.top).to.be.closeTo(atTop.top, 1);
        expect(scrolled.right).to.be.closeTo(atTop.right, 1);
      });
    });

    cy.get('.modal[open] .modal-box > form[method="dialog"] .btn-circle').click();
    cy.get(".modal[open]").should("not.exist");
  });

  // The weights editor's close form closes the dialog on click, so anything of the X's that
  // reaches into the content would close it here.
  it("leaves the dialog open when clicking just below the top of the box", () => {
    cy.visit("/");
    cy.get('[data-test-calculator-nav="echoes"]').click();
    cy.get('[data-test="calculator-echoes-overflow-menu"]').filter(":visible").click();
    cy.contains("button", "Customize Weights").click();

    // 8px into the content (below the 1.5rem padding), mid-width, away from the X.
    cy.get(".modal[open] .modal-box").then(($box) => {
      cy.wrap($box).click($box[0].clientWidth / 2, 24 + 8);
    });
    cy.get(".modal[open] .modal-box").should("be.visible");
  });
});
