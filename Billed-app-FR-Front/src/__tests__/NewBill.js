/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;

      newBill = new NewBill({
        document,
        onNavigate: jest.fn(),
        store: null,
        localStorage: window.localStorage,
      });
    });

    // Test handleSubmit

    test("Then handleSubmit should call updateBill and navigate to Bills", () => {
      newBill.updateBill = jest.fn();
      newBill.onNavigate = jest.fn();

      const form = screen.getByTestId("form-new-bill");

      screen.getByTestId("expense-type").value = "Transports";
      screen.getByTestId("expense-name").value = "Taxi";
      screen.getByTestId("amount").value = "45";
      screen.getByTestId("datepicker").value = "2023-05-10";
      screen.getByTestId("vat").value = "10";
      screen.getByTestId("pct").value = "20";
      screen.getByTestId("commentary").value = "Business trip";

      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);

      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
