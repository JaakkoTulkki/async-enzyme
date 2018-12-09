import React from 'react';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class TestComponent extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        chosen: null,
      }
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
                <li onClick={() => this.select.bind(this)(1)}>one</li>
                <li onClick={() => this.select.bind(this)(2)}>two</li>
            </ul>
            {this.state.chosen &&
                <div data-test-id="text">Chosen is {this.state.chosen}</div>
            }
        </div>
    }
}