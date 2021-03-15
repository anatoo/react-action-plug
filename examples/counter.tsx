import React from 'react';
import {render} from 'react-dom';
import {createActionPlug} from '../src';

type Actions = {
  increment(n: number): void;
  reset(): void;
};

const {Boundary, useActionHandlers, useActions} = createActionPlug<Actions>();

function Example() {
  const [count, setCount] = React.useState(0);
  useActionHandlers({
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
  const {increment, reset} = useActions();

  return <div>
    <button onClick={() => increment(1)}>+1</button>
    <button onClick={() => increment(-1)}>-1</button>
    <button onClick={() => reset()}>reset</button>
  </div>;
}

function Counter() {
  return (
    <Boundary >
      <Example />
      <Controller />
    </Boundary>
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
