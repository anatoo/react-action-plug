import {useEffect, ReactNode, createContext, useContext, useMemo} from 'react';
import React from 'react';

type BaseActions = {
  [key: string]: (payload: any) => void;
}

export class ActionPlugManager {
  listeners = new Map<string, Set<(payload: any) => void>>();

  addListener(key: string, listener: (payload: any) => void): void {
    const set = this.listeners.get(key);
    if (set) {
      set.add(listener);
    } else {
      const set = new Set<(payload: any) => void>();
      set.add(listener);
      this.listeners.set(key, set);
    }
  }

  removeListener(key: string, listener: (payload: any) => void): void {
    const set = this.listeners.get(key);
    if (set) {
      set.delete(listener);
    }
  }

  dispatch(key: string, payload: any): void {
    const listeners = this.listeners.get(key);
    if (listeners) {
      for (const listener of Array.from(listeners)) {
        listener(payload);
      }
    }
  }
}


export type ActionPlug<T extends BaseActions> = {
  Boundary: React.FC<{children: ReactNode}>;
  useActionHandlers: (handlers: Partial<T>) => void;
  useActions: () => T;
}

export function createActionPlug<T extends BaseActions>(): ActionPlug<T> {

  const PlugContext = createContext<ActionPlugManager>(new ActionPlugManager());

  return {
    Boundary: ({children}: {children: ReactNode}) => {
      const contextValue = useMemo(() => new ActionPlugManager(), []);

      return <PlugContext.Provider value={contextValue} children={children} />;
    },

    useActionHandlers: (handlers: Partial<T>) => {
      const manager = useContext(PlugContext);

      useEffect(() => {
        for (const [key, listener] of Object.entries(handlers)) {
          manager.addListener(key, listener);
        }
        return () => {
          for (const [key, listener] of Object.entries(handlers)) {
            manager.removeListener(key, listener);
          }
        }
      }, [handlers]);
    },

    useActions: (): T => {
      const manager = useContext(PlugContext);

      return new Proxy<any>({}, {
        get(target, key) {
          if (typeof key === 'string') {
            return (payload: any) => {
              manager.dispatch(key, payload);
            };
          }
          throw Error();
        }
      });
    },
  }
}
