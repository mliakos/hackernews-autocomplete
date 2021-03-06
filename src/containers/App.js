import React, { Component } from "react";

import Autosuggest from "../components/Autosuggest/Autosuggest";

import classes from "./App.module.css";

class App extends Component {
	render() {
		return (
			<div className={classes.App}>
				<Autosuggest
					minChars={3} // Minimum characters required to start search
					debounce={500} // Time required to make the request after user has stopped typing (in ms)
				/>
			</div>
		);
	}
}

export default App;
