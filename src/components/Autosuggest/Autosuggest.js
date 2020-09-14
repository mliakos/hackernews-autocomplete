import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import useDebounce from "../../hooks/useDebounce";

import Input from "./Input/Input";
import Results from "./Results/Results";
import Button from "./Button/Button";

import classes from "./Autosuggest.module.css";

const Autosuggest = props => {
	const [highlightedID, setHighlightedID] = useState("");
	const [displayResults, setDisplayResults] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);

	/* 
	Debouncing the search query, will effectively return the same value each time
	so no requests will be made. The new value will be returned only if certain time
	has passed. 
	*/
	const debouncedInputValue = useDebounce(inputValue, props.debounce);

	// Hook to make API calls when debounced value changes
	useEffect(() => {
		(async () => {
			// Fetch data
			if (debouncedInputValue.length >= 3) {
				fetchResults();
			}
		})();
	}, [debouncedInputValue]);

	// Hook to manage results container display when input value changes
	useEffect(() => {
		//  Hide results on empty input
		if (inputValue.length < 3 && displayResults) {
			toggleResults();
		}

		//  Display results on input
		if (inputValue.length >= 3 && !displayResults) {
			toggleResults();
		}
	}, [inputValue]);

	/*** Handler functions ***/

	const handleInputKeyDown = event => {
		if (event.key == "ArrowDown") changeSelection("inc");

		if (event.key == "ArrowUp") changeSelection("dec");

		if (event.key == "Escape") {
			if (displayResults) toggleResults();
		}

		if (event.key == "Enter") {
			loadHighlightedStory();
		}
	};

	// Updates highlighted result ID in state
	const handleResultMouseOver = event => {
		const targetID = event.target.closest("li").getAttribute("data-id");

		if (highlightedID != targetID) setHighlightedID(targetID);
	};

	const handleResultMouseDown = event => loadHighlightedStory();

	// Updates state on input change
	const handleInputChange = event => {
		setInputValue(event.target.value);
	};

	// Hides results container on input blur
	const handleInputBlur = () => (displayResults ? toggleResults() : null);

	// Displays results container on input focus if input value > 3
	const handleInputFocus = () =>
		!displayResults && inputValue.length >= 3 && data.length
			? toggleResults()
			: null;

	/*** Other functions ***/

	const fetchResults = async () => {
		// Initially try to fetch from cache
		try {
			const cached = JSON.parse(localStorage.getItem(`${inputValue}`));
			setData([...cached]);
		} catch (e) {
			setLoading(true);

			try {
				// Fetching data
				const response = await fetch(
					`https://hn.algolia.com/api/v1/search?query=${inputValue}&tags=story`
				);

				// Parsing response
				const data = await response.json();

				// Caching data
				localStorage.setItem(inputValue, JSON.stringify(data.hits));

				setData(data.hits);
			} catch (e) {
				alert("There was an error during the request.");
			}

			setLoading(false);
		}
	};

	const loadHighlightedStory = () => {
		const highlightedElementIndex = data.findIndex(
			e => e.objectID == highlightedID
		);

		window.open(
			data[highlightedElementIndex].url ||
				data[highlightedElementIndex].story_url
		);
	};

	const changeSelection = mode => {
		// Currently highlighted result index in state object
		const highlightedElementIndex = data.findIndex(
			e => e.objectID == highlightedID
		);

		// Increment selection
		if (mode == "inc") {
			if (highlightedElementIndex < data.length - 1) {
				const targetID = data[highlightedElementIndex + 1].objectID;

				setHighlightedID(targetID);
			}
		}

		// Decrement selection
		if (mode == "dec") {
			if (highlightedElementIndex > 0) {
				const targetID = data[highlightedElementIndex - 1].objectID;

				setHighlightedID(targetID);
			}
		}
	};

	const toggleResults = () => {
		setDisplayResults(!displayResults);
	};

	/*** Rendering ***/

	// Conditionally show results based on state and input value
	const results = displayResults ? (
		<Results
			data={data}
			highlightedID={highlightedID}
			handleMouseDown={handleResultMouseDown}
			handleMouseOver={handleResultMouseOver}
		/>
	) : null;

	// Conditionally render search button text to indicate loading
	const buttonText = loading ? "Loading..." : "SEARCH";

	// Conditionally disable search button
	const disabledSearch = data.length < 3 || inputValue.length < 3;

	return (
		<div className={classes.Autosuggest}>
			<div style={{ textAlign: "left" }}>
				<label style={{ fontSize: "0.75em", display: "block" }}>Search</label>

				<Input
					handleKeyDown={event => handleInputKeyDown(event, highlightedID)}
					handleBlur={handleInputBlur}
					handleFocus={handleInputFocus}
					handleChange={handleInputChange}
					inputValue={inputValue}
				></Input>

				<Button disabledSearch={disabledSearch}>{buttonText}</Button>

				{results}
			</div>
		</div>
	);
};

Autosuggest.propTypes = {
	minChars: PropTypes.number,
	debounce: PropTypes.number
};

export default Autosuggest;
