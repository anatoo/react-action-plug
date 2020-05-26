import {useEffect, createContext, useState, useContext, useMemo} from 'react';
import React from 'react';

export interface ActionPlug<T> {
  displayName: string;
}

export function createActionPlug<T = undefined>(displayName?: string): ActionPlug<T> {
  return {
    displayName: displayName ?? 'unnamed',
  };
}

export type ActionHandler<T> = ((payload: T) => void);

export function useTrigger<T>(): ((actionPlug: ActionPlug<T>, payload: T) => void) {
  const manager = useContext(ActionPlugContext);
  return ((actionPlug: ActionPlug<T>, payload: T) => {
    manager.trigger(actionPlug, payload);
  });
}

export function useActionPlug<T>(plug: ActionPlug<T>, handler: ActionHandler<T>): void {
  const manager = useContext(ActionPlugContext);
  useEffect(() => {
    manager.addHandler(plug, handler);
    return () => {
      manager.removeHandler(plug, handler);
    };
  }, [plug, handler]);
}

export function createBoundary(actionPlugs: ActionPlug<any>[]): React.FC<{children: React.ReactNode}> {
  return ({children}: {children: React.ReactNode}) => {
    const parent = useContext(ActionPlugContext);
    const manager = useMemo(() => new ActionPlugManager(actionPlugs, parent), []);

    return (
      <ActionPlugContext.Provider value={manager}>
        {children}
      </ActionPlugContext.Provider>
    );
  };
}

export class ActionPlugManager {
  handlersMap = new Map<ActionPlug<any>, Set<ActionHandler<any>>>();
  _parent: ActionPlugManager | null = null;
  plugs: Set<ActionPlug<any>>;

  constructor(plugs: ActionPlug<any>[], parent?: ActionPlugManager) {
    this.plugs = new Set(plugs);
    if (parent) {
      this._parent = parent;
    }
  }

  get parent(): ActionPlugManager {
    return this._parent!;
  }

  isRoot() {
    return this.plugs.size === 0 && !this.parent;
  }

  _getHandlers(plug: ActionPlug<any>): Set<ActionHandler<any>> {
    if (!this.handlersMap.has(plug)) {
      const set = new Set<ActionHandler<any>>();
      this.handlersMap.set(plug, set);
      return set;
    }

    return this.handlersMap.get(plug)!;
  }

  addHandler(plug: ActionPlug<any>, handler: ActionHandler<any>): void {
    if (!this.isRoot() && !this.plugs.has(plug)) {
      this.parent!.addHandler(plug, handler);
    } else {
      this._getHandlers(plug).add(handler);
    }
  }

  removeHandler(plug: ActionPlug<any>, handler: ActionHandler<any>): void {
    if (!this.isRoot() && !this.plugs.has(plug)) {
      this.parent!.removeHandler(plug, handler);
    } else {
      this._getHandlers(plug).delete(handler);
    }
  }

  trigger<T>(plug: ActionPlug<T>, payload: T): void {

    if (!this.isRoot() && !this.plugs.has(plug)) {
      this.parent!.trigger(plug, payload);
    } else {
      for (const handler of Array.from(this._getHandlers(plug))) {
        handler(payload);
      }
    }
  }

  clear(): void {
    this.handlersMap.clear();
  }
}

export const rootActionPlugManager = new ActionPlugManager([], undefined);

const ActionPlugContext = createContext<ActionPlugManager>(rootActionPlugManager);

