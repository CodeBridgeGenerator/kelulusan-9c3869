import React from "react";
import { render, screen } from "@testing-library/react";

import TitleownerPage from "../TitleownerPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders titleowner page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <TitleownerPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("titleowner-datatable")).toBeInTheDocument();
    expect(screen.getByRole("titleowner-add-button")).toBeInTheDocument();
});
