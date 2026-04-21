/** @jest-environment jsdom */

import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { TextDecoder, TextEncoder } from "node:util";

globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;

const { MemoryRouter } = require("react-router");
const { App } = require("../../src/dashboard/App");

describe("dashboard App", () => {
  it("renders the overview heading and the primary CTA", () => {
    const view = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(view.getByText("Profit Copilot")).toBeInTheDocument();
    expect(view.getByRole("link", { name: "Overview" })).toBeInTheDocument();
    expect(
      view.getByRole("button", { name: "Refresh State" }),
    ).toBeInTheDocument();
  });
});
