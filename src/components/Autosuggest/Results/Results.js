import React from "react";
import Result from "./Result/Result";

import parse from "html-react-parser";
import PropTypes from "prop-types";

import classes from "./Results.module.css";

const Results = props => {
	let container;

	if (props.data.length) {
		const results = props.data.map(result => {
			const highlighted = result.objectID == props.highlightedID;

			const title = parse(result._highlightResult.title.value);

			return (
				<Result
					points={result.points}
					author={result.author}
					commentsNum={result.num_comments}
					key={result.objectID}
					data-id={result.objectID}
					highlighted={highlighted}
					handleMouseDown={props.handleMouseDown}
					handleMouseOver={props.handleMouseOver}
				>
					{title}
				</Result>
			);
		});

		container = <ul className={classes.Results}>{results}</ul>;
	} else {
		container = (
			<span>
				<small>No results.</small>
			</span>
		);
	}
	return container;
};

Results.propTypes = {
	data: PropTypes.array,
	highlightedID: PropTypes.string,
	handleMouseDown: PropTypes.func,
	handleMouseOver: PropTypes.func
};

export default Results;
