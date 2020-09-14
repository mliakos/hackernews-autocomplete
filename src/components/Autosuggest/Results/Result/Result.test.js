import React from "react";
import ReactDOM from "react-dom";

import Result from "../Result/Result";

it("should render without crashing", () => {
	const div = document.createElement("div");
	ReactDOM.render(<Result />, div);
});
