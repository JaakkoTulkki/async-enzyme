import React from 'react';
import {mount} from 'enzyme';
import {TestComponent} from "./test.component"
import {waitFor, waitNotToThrow} from "./index"

let component;
const selector = '[data-test-id="text"]'
describe('TestComponent', () => {
  beforeEach(() => {
    component = mount(<TestComponent async/>);
    component.find('li').at(1).simulate('click');
  });

  it('should not display results with zero update()', () => {
    expect(component.find(selector).length).toEqual(0);
  });

  it('should render results with waitFor()', async (done) => {
    await waitFor(component, selector);
    expect(component.find(selector).text()).toEqual('Chosen is 2');
    done();
  });
})

describe('waitFor', () => {
  beforeEach(() => {
    component = mount(<TestComponent/>);
  });

  it('should not throw if element present', async (done) => {
    component.find('li').at(1).simulate('click');
    await expect(waitFor(component, selector)).resolves.toEqual(undefined);
    done();
  });

  it('should throw if element not present in the passed timeout', async (done) => {
    await expect(waitFor(component, 'h1', 1)).rejects.toThrow('Could not locate element with the following selector: h1 in 1ms');
    done();
  });

  it('should throw if element not present (incorrect selector) with default timeout', async (done) => {
    const component = mount(<TestComponent/>);
    await expect(waitFor(component, 'h1')).rejects.toThrow('Could not locate element with the following selector: h1 in 100ms');
    done();
  });
});

describe('waitNotToThrow', () => {
  beforeEach(() => {
    component = mount(<TestComponent/>);
  });

  it('should throw if cb does not stop throwing within default timeout', async (done) => {
    await expect(waitNotToThrow(component, (component) => expect(component.find(selector).text()).toEqual('fd')))
      .rejects.toThrow('Still rejecting after 100ms.');
    done();
  });

  it('should throw if cb does not stop throwing within a set timeout', async (done) => {
    await expect(waitNotToThrow(component, (component) => expect(component.find(selector).text()).toEqual('fd'), 2))
      .rejects.toThrow('Still rejecting after 2ms.');
    done();
  });

  it('should not throw if cb stops throwing within the timeout period', async (done) => {
    component.find('li').at(1).simulate('click');
    await expect(waitNotToThrow(component, (component) =>
      expect(component.find(selector).text()).toEqual('Chosen is 2')
    )).resolves.toEqual(undefined);
    done();
  });
});