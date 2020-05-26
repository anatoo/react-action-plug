# `react-action-plug`

A React library for pluggable action interface between components.

## Motivation

If you are developing a complex GUI screen in React, you may want to call an interaction or action in one component from multiple components. This library provides an action plug that can be used between components.

## Features

- TypeScript support
- Zero dependency

## Installation

```shell
yarn add react-action-plug
```

## Usage

```typescript
import {createActionPlug, useActionPlug, useTrigger} from 'react-action-plug';

// 1. Define action plug
const increment = createActionPlug<number>();

function Counter() {
  const [count, setCount] = React.useState(0);
  // 2. Prepare an action handler to increment counter state
  useActionPlug(increment, (payload: number) => {
    setCount(count + payload);
  });

  return (
    <div>count: {count}</div>
  );
}

function Controller() {
  // 3. Trigger "increment" action when click
  const trigger = useTrigger();
  return (
    <button onClick={() => trigger(increment, 1)}>click!</button>
  );
}

function App() {
  return <>
    <Controller />
    <Counter />
  </>;
}
```

### Create action boundaries

The scope of the action is global by default. When an action is triggered, all the handlers for that action will be called.

However, you can create a boundary for the action to take effect. A trigger outside the boundary does not call the handler function inside the boundary.

This feature is useful when there are multiple components on the same screen that use the same action handler.

```typescript
import {createActionPlug, createBoundary} from 'react-action-plug';

const increment = createActionPlug();
const decrement = createActionPlug();
const CounterBoundary = createBoundary([increment, decrement]);

function App() {
  return <>
    <CounterBoundary>
      <Controller />
      <Counter />
    </CounterBoundary>

    <CounterBoundary>
      <Controller />
      <Counter />
    </CounterBoundary>
  </>;
}
```

## API

### createActionPlug<T = undefined>(displayName?: string)

* `<T>` - Type for the action payload. Default: `undefined`.
* `displayName` - Display name for the action plug.

```typescript
const increment = createActionPlug<number>('increment');
```

### useActionPlug<T>(actionPlug: ActionPlug<T>, handler: (payload: T) => void)

Prepare a handler function for passed action plug.

* `actionPlug: ActionPlug<T>`
* `handler: (payload: T) => void` - `handler` is called on trigger the action plug.

```typescript
function MyComponent() {
  const [state, setState] = useState(0);
  useActionPlug(increment, (payload: number) => {
    setState(state + paylod);
  });

  return <div>count: {state}</div>;
}
```

### useTrigger()

Get a function to trigger action plug with something payload.

```typescript
function MyController() {
  const trigger = useTrigger();
  const handlerClick = () => {
    trigger(increment, 1);
  };

  return <div onClick={handleClick}>increment</div>;
}
```

### createBoundary(actionPlugs: ActionPlug<any>[]): React.FC<{children: React.ReactNode}>

Create a boundary for action plug trigger to be enabled.

* `actionPlugs: ActionPlug<any>[]` - An array of action plugs to be used for the boundary.

```typescript
const increment = createActionPlug();
const decrement = createActionPlug();
const CounterBoundary = createBoundary([increment, decrement]);

function Container() {
  return (
    <CounterBoundary>
      <Controller />
      <Counter />
    </CounterBoundary>
  );
}
```

## License

[MIT License](LICENSE.md)

## Author

Kubota Mitsunori, [@anatoo](https://twitter.com/anatoo)
