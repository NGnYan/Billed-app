/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js";
import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");

      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBe(true);
    });
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
  });

  // Test handleClickNewBill
  describe("When I click on the New Bill button", () => {
    test("Then it should navigate to NewBill page", () => {
      const mockOnNavigate = jest.fn();
      document.body.innerHTML = `<button data-testid="btn-new-bill"></button>`;

      const billsInstance = new Bills({
        document,
        onNavigate: mockOnNavigate,
        store: null,
        localStorage: null,
      });

      const newBillButton = screen.getByTestId("btn-new-bill");
      newBillButton.click();

      expect(mockOnNavigate).toHaveBeenCalledWith(ROUTES_PATH.NewBill);
    });
  });

  // Test handleClickIconEye
  describe("When I click on the eye icon", () => {
    test("Then the modal should open and display the correct image", () => {
      const billUrl = "https://localhost/bill.jpg";

      document.body.innerHTML = `<div id="eye" data-testid="icon-eye" data-bill-url=${billUrl}>
            ${eyeBlueIcon}
            </div>
            
            <div id="modaleFile" class="modal">
  <div class="modal-body"></div>
</div>`;

      const billsInstance = new Bills({
        document,
        onNavigate: jest.fn(),
        store: null,
        localStorage: null,
      });

      const eyeIcon = screen.getByTestId("icon-eye");

      billsInstance.handleClickIconEye(eyeIcon);

      const img = document.querySelector(".modal-body img");
      expect(img).toBeTruthy();
      expect(img.src).toContain(billUrl);
      expect(img.alt).toBe("Bill");
    });
  });

  // Test getBill
});
