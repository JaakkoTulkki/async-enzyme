import React from 'react';
import { mount } from 'enzyme';
import {TestComponent} from "./test.component"
import {waitFor} from "./index"

let component;
const selector = '[data-test-id="text"]'
describe('TestComponent', () => {
  describe('as sync', () => {
    beforeEach(() => {
      component = mount(<TestComponent/>);
      component.find('li').at(1).simulate('click');
    });

    it('should display results', () => {
      expect(component.find(selector).text()).toEqual('Chosen is 2')
    });
  });

  describe('as async', () => {
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
  });
})

describe('waitFor', () => {
  beforeEach(() => {
    component = mount(<TestComponent/>);
  });
  it('should not throw element present', async (done) => {
    waitFor(component, selector);
    done();
  });

  it('should throw if element not present (incorrect selector)', async (done) => {
    await expect(waitFor(component, 'h1')).rejects.toThrow('Could not locate element with the following selector: h1 in 100ms');
    done();
  });

  it('should throw if element not present in the passed timeout', async (done) => {
    await expect(waitFor(component, 'h1', 1)).rejects.toThrow('Could not locate element with the following selector: h1 in 1ms');
    done();
  });
});