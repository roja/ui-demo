import React from 'react';
import { ReactWrapper } from 'enzyme';

import { Button } from 'z-frontend-elements';
import { mountWithTheme } from 'z-frontend-theme/test-utils/theme';

import SearchSelect, {
  BasicSearchSelect,
  SearchOption,
  SearchOptions,
  SearchSelectOption,
} from './SearchSelectDeprecated';

const combobox = 'input[role="combobox"]';
const optionList = [{ value: 'Option 1' }, { value: 'Option 2' }, { value: 'Option 3' }];

jest.useFakeTimers();

const getOptions = (query: string) =>
  optionList.filter(option => option.value.toLowerCase().includes(query.toLowerCase()));
const getOptionsAsync = (query: string) => {
  return new Promise<SearchSelectOption[]>(resolve => {
    setTimeout(() => resolve(getOptions(query)), 200);
  });
};

// jest's fake timer won't resolve promises triggered by faked timeout events synchronously
// we'll create another promise to schedule our assertions after our changes
const runAfterPromisesResolve = (fn: Function, wrapper: ReactWrapper) => {
  (async () => {
    const p = new Promise(resolve => setTimeout(resolve, 0));
    await p;
    wrapper.update();
    fn();
  })();

  jest.runOnlyPendingTimers();
};

// const splitResolver = (resolver, numSplits) => {
//   const resolvers = [];
//   const promises: Promise<{}>[] = [];

//   for (let i = 0; i < numSplits; i += 1) {
//     promises.push(new Promise(resolve => resolvers.push(resolve)));
//   }
//   Promise.all(promises).then(() => resolver());

//   return resolvers;
// };

const mockChangeEvent = (value: string) => {
  return { target: { value } };
};

describe('Search', () => {
  it('should mount without throwing an error', () => {
    expect(mountWithTheme(<SearchSelect getOptions={getOptions} />)).toHaveLength(1);
  });

  it('should render input when the button is clicked', () => {
    const wrapper = mountWithTheme(<SearchSelect getOptions={getOptions} />);
    expect(wrapper.find(Button).length).toBe(1);
    expect(wrapper.find(combobox).length).toBe(0);

    wrapper.find(Button).simulate('click');
    expect(wrapper.find(Button).length).toBe(0);
    expect(wrapper.find(combobox).length).toBe(1);
  });

  describe('Async', () => {
    it('shows options after input changes', done => {
      // Specifically setting debounceWaitTime to 200 here because the default 300
      // causes a bug, see https://github.com/facebook/jest/issues/3465
      const wrapper = mountWithTheme(<SearchSelect getOptions={getOptionsAsync} debounceWaitTime={200} />);
      wrapper.find(Button).simulate('click');
      wrapper.find(combobox).simulate('change', mockChangeEvent('Op'));

      jest.runAllTimers();
      runAfterPromisesResolve(() => {
        const actualOptions = optionList.map(option => option.value);
        const foundOptions = wrapper.find(SearchOption).map(option => option.text());
        expect(foundOptions).toEqual(actualOptions);
        done();
      }, wrapper);
    });

    it('shows no results message', done => {
      // Specifically setting debounceWaitTime to 200 here because the default 300
      // causes a bug, see https://github.com/facebook/jest/issues/3465
      const wrapper = mountWithTheme(<SearchSelect getOptions={getOptionsAsync} debounceWaitTime={200} />);
      wrapper.find(Button).simulate('click');
      wrapper.find(combobox).simulate('change', mockChangeEvent('Opz'));
      jest.runAllTimers();
      runAfterPromisesResolve(() => {
        expect(wrapper.find(SearchOptions).text()).toBe('No results found.');
        done();
      }, wrapper);
    });
  });
});

describe('BasicSearchSelect', () => {
  it('finds exact match', done => {
    const wrapper = mountWithTheme(<BasicSearchSelect options={optionList} />);
    wrapper.find(Button).simulate('click');
    const searchValue = 'Option 1';
    wrapper.find(combobox).simulate('change', mockChangeEvent(searchValue));
    runAfterPromisesResolve(() => {
      const foundOptions = wrapper.find(SearchOption).map(option => option.text());
      expect(foundOptions).toHaveLength(1);
      expect(foundOptions).toContain(searchValue);
      done();
    }, wrapper);
  });

  it('finds partial match', done => {
    const wrapper = mountWithTheme(<BasicSearchSelect options={optionList} />);
    wrapper.find(Button).simulate('click');
    wrapper.find(combobox).simulate('change', mockChangeEvent('Option'));
    runAfterPromisesResolve(() => {
      const foundOptions = wrapper.find(SearchOption).map(option => option.text());
      expect(foundOptions).toHaveLength(3);
      done();
    }, wrapper);
  });

  it('finds case insensitive match', done => {
    const wrapper = mountWithTheme(<BasicSearchSelect options={optionList} />);
    wrapper.find(Button).simulate('click');
    wrapper.find(combobox).simulate('change', mockChangeEvent('option'));
    jest.runAllTimers();
    runAfterPromisesResolve(() => {
      const foundOptions = wrapper.find(SearchOption).map(option => option.text());
      expect(foundOptions).toHaveLength(3);
      done();
    }, wrapper);
  });
});
