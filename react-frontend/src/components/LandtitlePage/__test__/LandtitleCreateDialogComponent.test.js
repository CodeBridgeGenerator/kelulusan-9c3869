import React from "react";
import { render, screen } from "@testing-library/react";

import LandtitleCreateDialogComponent from "../LandtitleCreateDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders landtitle create dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <LandtitleCreateDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("landtitle-create-dialog-component")).toBeInTheDocument();
});
