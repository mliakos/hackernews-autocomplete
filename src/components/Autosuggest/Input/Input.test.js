import React from "react";
import ReactDOM from "react-dom";

import Input from "../Input/Input";

it("should render without crashing", () => {
	const div = document.createElement("div");
	ReactDOM.render(<Input />, div);
});
