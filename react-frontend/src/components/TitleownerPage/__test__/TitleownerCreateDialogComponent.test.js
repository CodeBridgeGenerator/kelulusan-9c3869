import React from "react";
import { render, screen } from "@testing-library/react";

import TitleownerCreateDialogComponent from "../TitleownerCreateDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders titleowner create dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <TitleownerCreateDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("titleowner-create-dialog-component")).toBeInTheDocument();
});
