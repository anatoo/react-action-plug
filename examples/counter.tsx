import React from 'react';
import {render} from 'react-dom';
import {createActionPlug} from '../';

type Actions = {
  increment(n: number): void;
  reset(): void;
};

const CounterPlug = createActionPlug<Actions>();

function Example() {
  const [count, setCount] = React.useState(0);
  CounterPlug.useActionHandlers({
    increment(n) {
      setCount(count => count + n);
    },
    reset() {
      setCount(0);
    }
  });

  return (
    <>
      <div>count: {count}</div>
    </>
  );
};

function Controller() {
  const {increment, reset} = CounterPlug.useActions();

  return <div>
    <button onClick={() => increment(1)}>+1</button>
    <button onClick={() => increment(-1)}>-1</button>
    <button onClick={() => reset()}>reset</button>
  </div>;
}

function Counter() {
  return (
    <CounterPlug.Boundary>
      <Example />
      <Controller />
    </CounterPlug.Boundary>
  );
}

function App() {
  return (
    <div>
      <div>counter1:</div>
      <Counter />

      <br />
      <br />

      <div>counter2:</div>
      <Counter />
    </div>
  );
}

render(<App />, document.getElementById('root'));
