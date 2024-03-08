import { DependencyList, useEffect, useRef } from "react";

interface IOpt {
  delay?: number,
  deps?: DependencyList
}

export default function useTimeout(fn: Function, opt?: IOpt) {
  const { delay = 5000, deps = [] } = opt || {};
  const timeoutRef = useRef<NodeJS.Timeout>()
  const st = useRef(new Date().getTime())
  const _deps = [...deps];

  useEffect(() => {
    init()
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current)
    }
  }, [_deps])

  const init = () => {
    const ct = new Date().getTime();
    if (ct - st.current <= delay) {
      const actualDelay = delay - (ct - st.current);
      timeoutRef.current && clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined;
      //@ts-ignore
      timeoutRef.current = setTimeout(fn, actualDelay)
    }
  }

  const clear = () => {
    timeoutRef.current && clearTimeout(timeoutRef.current)
  }

  return {
    clear,
    timeoutRef,
  }
}
