import {createActionPlug, ActionPlugManager} from './';

test('ActionPlugManager', () => {
  const manager = new ActionPlugManager();
  let called = false;
  const listener = () => {
    called = true;
  };

  manager.addListener('noop', listener);
  expect(manager.listeners.get('noop')!.size).toBe(1);

  expect(called).toBe(false);
  manager.dispatch('noop', null);
  expect(called).toBe(true);

  manager.removeListener('noop', listener);
  expect(manager.listeners.get('noop')!.size).toBe(0);
});
