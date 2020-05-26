import React from 'react';
import {render} from 'react-dom';
import {createActionPlug, useActionPlug, useTrigger, createBoundary} from '../src/';

const increment = createActionPlug<number>('increment');
const set = createActionPlug<number>('set');
const CounterActionBoundary = createBoundary([increment, set]);

function Exmaple() {
  useActionPlug(increment, (payload) => {
    setCount(count + payload);
  });

  useActionPlug(set, (payload) => {
    setCount(payload);
  });

  const [count, setCount] = React.useState(0);

  return (
    <>
      <div>count: {count}</div>
    </>
  );
};

function MyButton() {
  const trigger = useTrigger();

  return (
    <div>
      <button onClick={() => trigger(increment, 1)}>+1</button>
      &nbsp;
      <button onClick={() => trigger(increment, -1)}>-1</button>
      &nbsp;
      <button onClick={() => trigger(set, 0)}>reset</button>
    </div>
  );
}


function Counter() {
  return (
    <CounterActionBoundary>
      <MyButton />
      <Exmaple />
    </CounterActionBoundary>
  );
}

function App() {
  return (
    <div>
      <div>counter1:</div>
      <Counter />
      <br />
      <div>counter2:</div>
      <Counter />
    </div>
  );
}

render(<App />, document.getElementById('root'));
