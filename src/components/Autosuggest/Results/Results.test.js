import React from "react";
import { shallow, mount, unmount } from "enzyme";
import Results from "../Results/Results";

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

describe("<Results /> unit tests", () => {
	let wrapper;

	beforeEach(() => {
		wrapper = mount(
			<Results
				data={mockData}
				highlightedID={""}
				handleMouseDown={() => null}
				handleMouseOver={() => null}
			/>
		);
	});

	afterEach(() => wrapper.unmount());

	it("should not be visible without performing search", () => {
		expect(wrapper).toEqual({});
	});

	it("should render results when passed data", () => {
		expect(wrapper.find("Result")).toHaveLength(mockData.length);
	});

	it("should render message to inform when no results are found", () => {
		wrapper = shallow(
			<Results
				data={[]}
				highlightedID={""}
				handleMouseDown={() => null}
				handleMouseOver={() => null}
			/>
		);
		expect(wrapper.find("span").text()).toBe("No results.");
	});
});
