import { DependencyList, useEffect, useRef, useState } from "react";

interface IOptions {
  /**
   * 条件
   *
   * @memberof IOptions
   */
  deps?: DependencyList;
  /**
   * 定时器延迟
   *
   * @memberof IOptions
   */
  delay?: number;
  /**
   * 默认第一次执行时loading为true 之后执行false
   * @default true
   *
   * @memberof IOptions
   */
  firstLoading?: boolean;
  /**
   * 是否第一次默认执行
   *
   * @memberof IOptions
   */
  ready?: boolean;
}

export default function useInterval(fn: Function, opt?: IOptions) {
  const { delay = 8000, deps = [], firstLoading = true, ready = true } = opt || {}
  const [loading, setLoading] = useState(false);
  const first = useRef<boolean>();
  const running = useRef<boolean>();
  const timer = useRef<NodeJS.Timeout>()
  const endRef = useRef<boolean>(false)
  const st = useRef(new Date().getTime())

  useEffect(() => {
    first.current = firstLoading
    st.current = new Date().getTime();
    return () => {
      endRef.current = true
      clearTimeout(timer.current)
    }
  }, [])

  const _deps = [...deps];

  const initTimeout = (actualDelay: number = delay) => {
    if (actualDelay !== null && !endRef.current) {
      timer.current && clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        tick()
        st.current = new Date().getTime();
      }, actualDelay)
    }
  }

  async function tick(ct?: number) {
    const actualDelay = ct ? delay - (ct - st.current) : delay;
    if (running.current) return;
    if (first.current && !ready) {
      first.current = false
      initTimeout(actualDelay)
      return;
    }
    first.current && setLoading(true)
    timer.current && clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      running.current = true;
      await fn?.()
      running.current = false;
      if (first.current) {
        setLoading(false)
        first.current = false;
      }
      st.current = new Date().getTime();
      tick()
    }, actualDelay)
  }

  useEffect(() => {
    const ct = new Date().getTime();
    tick(ct)
  }, _deps);

  return {
    loading,
    fn: tick,
  }
}
