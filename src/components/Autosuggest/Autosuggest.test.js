import React from "react";
import { shallow, mount } from "enzyme";
import Autosuggest from "./Autosuggest";

const mockData = [
	{
		points: 100,
		author: "test",
		num_comments: 123,
		objectID: "56345",
		_highlightResult: {
			title: {
				value: "Test title"
			}
		}
	}
];

it("renders", () => {
	const wrapper = shallow(<Autosuggest />);
	expect(wrapper.exists()).toBe(true);
});

let autosuggestWrapper;
beforeEach(() => {
	autosuggestWrapper = mount(<Autosuggest minChars={3} debounce={500} />);
});

afterEach(() => autosuggestWrapper.unmount());

describe("<Results /> integration tests", () => {
	it("should be visible when input value >= 3", () => {
		const inputWrapper = autosuggestWrapper.find("Input");

		inputWrapper.simulate("change", { target: { value: "test" } });

		const resultsWrapper = autosuggestWrapper.find("Results");

		expect(resultsWrapper.exists()).toEqual(true);
	});

	it("should not be visible when input value < 3", () => {
		const inputWrapper = autosuggestWrapper.find("Input");

		inputWrapper.simulate("change", { target: { value: "te" } });

		const resultsWrapper = autosuggestWrapper.find("Results");

		expect(resultsWrapper.exists()).toEqual(false);
	});
});
