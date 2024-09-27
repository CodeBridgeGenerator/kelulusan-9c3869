import React from "react";
import { render, screen } from "@testing-library/react";

import LandtitlePage from "../LandtitlePage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders landtitle page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <LandtitlePage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("landtitle-datatable")).toBeInTheDocument();
    expect(screen.getByRole("landtitle-add-button")).toBeInTheDocument();
});
