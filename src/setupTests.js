import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

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

global.fetch = jest.fn(async () => mockData);
