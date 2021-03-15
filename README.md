# react-action-plug

[![npm version](https://badge.fury.io/js/react-action-plug.svg)](https://badge.fury.io/js/react-action-plug)

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
import React from 'react';
import {createActionPlug} from 'react-action-plug';

// Define action plug
type MyActions = {
  increment(n: number): void;
  reset(): void;
};
const {Boundary, useActionHandlers, useActions} = createActionPlug<MyActions>();

function Counter() {
  const [count, setCount] = React.useState(0);
  // Prepare action handlers to do something
  useActionHandlers({
    increment(n: number) {
      setCount(count => count + n);
    },
    reset() {
      setCount(0);
    }
  });

  return (
    <div>count: {count}</div>
  );
}

function Controller() {
  const {increment, reset} = useActions();
  return (
    <>
      {/* Trigger "increment" action when click */}
      <button onClick={() => increment(1)}>click!</button>
  
      {/* Trigger "reset" action when click */}
      <button onClick={() => reset()}>reset</button>
    </>
  );
}

function App() {
  // Wrap with Boundary component, which specifies the scope of the actions and those handlers.
  return <Boundary>
    <Controller />
    <Counter />
  </Boundary>;
}
```

## API

### createActionPlug<T = {[actionName: string]: (payload: any) => void>()

* `<T>` - Type for the actions.

```typescript
type Actions = {
  increment(): void;
}
const {Boundary, useActions, useActionHandlers} = createActionPlug<Actions>();
```

### useActionHandlers(handlers: Partial<T>)

Prepare a handler functions for the action plug.

```typescript
function MyComponent() {
  const [state, setState] = useState(0);
  useActionHandlers({
    increment() {
      setState(count => count + 1);
    }
  });

  return <div>count: {state}</div>;
}
```

### useActions()

Get a function to trigger action plug with something payload.

```typescript
function MyController() {
  const actions = useActions();
  const handlerClick = () => {
    actions.increment();
  };

  return <div onClick={handleClick}>increment</div>;
}
```

### Boundary: React.FC<{children: React.ReactNode}>

Create a boundary for action plug trigger to be enabled.

```typescript
const {Boundary, useActions, useActionHandlers} = createActionPlug<{/* ... */}>();

function Container() {
  return (
    <Boundary>
      <Controller />
      <Counter />
    </Boundary>
  );
}
```

## License

[MIT License](LICENSE.md)

## Author

Kubota Mitsunori, [@anatoo](https://twitter.com/anatoo)
