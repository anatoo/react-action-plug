import {renderHook} from '@testing-library/react-hooks';
import {createActionPlug, ActionPlugManager} from './index';

describe('createActionPlug', () => {
  it('should works normally', () => {
    const action = createActionPlug('action');
  });
});

describe('ActionPlugManager', () => {
  it('should works normally', () => {
    const action = createActionPlug('action');
    const manager = new ActionPlugManager([action]);
    let called = false;
    const handler = () => {
      called = true;
    };
    manager.addHandler(action, handler);
    manager.trigger(action, undefined);
    expect(called).toBe(true);

    called = false;
    manager.removeHandler(action, handler);
    manager.trigger(action, undefined);
    expect(called).toBe(false);
  });

  it('should have payload on trigger', () => {
    const action = createActionPlug<number>('action');

    const manager = new ActionPlugManager([action]);
    let number = 0;
    const handler = (payload: number) => {
      number = payload;
    };

    manager.addHandler(action, handler);
    manager.trigger(action, 6);
    expect(number).toBe(6);
  });
});

