# Async Enzyme Helpers
Helper library to work with Promises using Enzyme.
The library's main purpose is to provide helper functions to flush
Promise resolution queues.

### Install
`npm install --save-dev async-enzyme-helpers`

## Usage with React and Jest
Assume you had the component below. The user is shown two items to click.
On click, some async operations are done (e.g. fetching from the server), and
finally the user is shown which value was chosen.
```
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class TestComponent extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        chosen: null,
      }
      this.select = this.select.bind(this)
    }

    async select(num) {
        await wait(0);
        await wait(0);
        await wait(0);
        this.setState({chosen: num})
    }

    render() {
        return <div>
            <ul>
                <li onClick={() => this.select(1)}>one</li>
                <li onClick={() => this.select(2)}>two</li>
            </ul>
            {this.state.chosen &&
                <div data-test-id="text">Chosen is {this.state.chosen}</div>
            }
        </div>
    }
}
```

The following test would fail:
```
test('Should display correct value', () => {
    const selector = '[data-test-id="text"]';
    component = mount(<TestComponent />);

    component.find('li').at(1).simulate('click');

    expect(component.find(selector).text()).toEqual('Chosen is 2');
});
```

To make the test pass we need to wait for the Promise queue to resolve.
`waitFor()` resolves this issue.

```
test('Should display correct value', async (done) => {
    const selector = '[data-test-id="text"]';
    component = mount(<TestComponent />);

    component.find('li').at(1).simulate('click');

    await waitFor(component, selector);
    expect(component.find(selector).text()).toEqual('Chosen is 2');
    done();
});
```

You might also want to use `waitNotToThrow()`.
The function takes a callback and resolves when a passed callback stops throwing errors.
The test above could have also been written the following way:

```
test('Should display correct value', async (done) => {
    const selector = '[data-test-id="text"]';
    component = mount(<TestComponent />);
    component.find('li').at(1).simulate('click');

    await expect(waitNotToThrow(component, (component) =>
      expect(component.find(selector).text()).toEqual('Chosen is 2')
    )).resolves.toEqual(undefined);
    done();
});
```

## waitFor()
The function takes three arguments:
1. Your component `ReactWrapper`
2. Selector `EnzymeSelector`
3. Timeout (optional, default 100ms) `number` (how long the function should wait for selector to find a node(s))

Once the provided selector matches one or more nodes in the tree, the `waitFor` function resolves a promise.
If a node is not found within the set timeout, the promise is rejected.

## waitNotToThrow()
The function takes three arguments:
1. Your component `ReactWrapper`
2. Callback: `(yourComponent: ReactWrapper) => undefined`
3. Timeout (optional, default 100ms) `number` (how long the function should wait for the callback not to throw)

The function calls the provided callback in a regular interval to see if the callback throws.
The callback receives the component under test as its only argument.
If the callback stops throwing within the set timeout, the `waitNotToThrow` function resolves a promise, otherwise it rejects the promise.

In your callback you can test multiple `find`s, or some more complex logic.
For instance, if you want to retrieve the `nth` child of a list whose existence on the tree is
dependent on the completion of a Promise queue, then the `waitNotToThrow` function might prove useful:

`waitNotToThrow(component, (comp) => comp.find('li).at(4))`

