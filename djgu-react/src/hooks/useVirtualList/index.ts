// 虚拟列表加载
import { debounce } from 'lodash';
import { DependencyList, useEffect, useRef, useState } from 'react';
import { PAGE_SIZE } from '@/constants';

export interface IPaginationResult<T> {
  /**
   * 数据
   *
   * @memberof IPaginationResult
   */
  dataSource: T[];
  /**
   * 加载状态
   *
   * @memberof IPaginationResult
   */
  loading?: boolean;
  /**
   * 是否完成了一次请求
   *
   * @memberof IPaginationResult
   */
  isFirstComplete: boolean;
  /**
   * 分页信息
   *
   * @memberof IPaginationResult
   */
  paginationProps: {
    current: number;
    pageSize: number;
    total: number;
  },
  /**
   * reset 是否重置查询
   *
   * @memberof IPaginationResult
   */
  refresh: (reset?: boolean) => Promise<void>;
  debounceRefresh: (reset?: boolean) => void;
  /* 快速逃避方案 */
  setDataSource: (data: T[]) => void;
  setTotal: (total: number) => void;
}

interface IServerParams {
  offset: number;
  limit: number;
  current: number;
}


type IInfoBack<T> = { dataSource: T[]; total: number }

type IInfoServer<T> = (params: IServerParams) => IInfoBack<T> | Promise<IInfoBack<T>>

interface IInfoOption<T> {
  /**
   * 第一次是否执行server
   *
   */
  isReady?: boolean;
  /**
   * 默认的数据
   *
   */
  dataSource?: T[];
  /**
   * 默认当前第几页
   *
   */
  current?: number;
  /**
   * 默认一页几条数据
   *
   */
  pageSize?: number;
}

const useVirtualList = <T,>(
  server: IInfoServer<T>,
  deps?: DependencyList, // 依赖条件 数据更新默认执行server
  option?: IInfoOption<T>,
): IPaginationResult<T> => {
  const {
    isReady = true,
    dataSource: propDataSource = [],
    current: propCurrent = 1,
    pageSize: propPageSize = PAGE_SIZE,
  } = option || {};

  // 是否完成了一次请求
  const [isFirstComplete, setIsFirstComplete] = useState(false);
  // 分页
  const current = useRef(propCurrent);
  const [pageSize, setPageSize] = useState(propPageSize);
  const [total, setTotal] = useState(0);

  // 表格
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState(propDataSource);

  // 计数器
  const seq = useRef(0);
  const doSearch = async (reset?: boolean) => {
    if (!isReady) {
      return;
    }
    let _current = current.current;
    const _pageSize = pageSize;
    setIsLoading(true)

    seq.current += 1;
    const _seq = seq.current;
    try {
      // 发送请求
      let { dataSource: data0, total: total0 } = await server({ limit: _pageSize, offset: Math.round((_current - 1) * _pageSize), current: _current });
      if (_seq !== seq.current) return;
      if (pageSize * (_current - 1) >= total0 && _current !== 1) {
        const totalPage = Math.ceil(total0 / pageSize);
        ({ dataSource: data0, total: total0 } = await server({ limit: _pageSize, offset: Math.round((totalPage - 1) * _pageSize), current: _current }));
        if (_seq !== seq.current) return;
        _current = totalPage;
        // message.error('数据源发生变化，该页没有数据，自动加载最后一页');
      }
      const d = reset ? data0 : dataSource.concat(data0 as any)
      setDataSource(d)
      current.current = _current
      setPageSize(_pageSize)
      setTotal(total0)
    } catch (error) {
      console.error('fetch err', error);
      if (_seq !== seq.current) return;
    }
    setIsFirstComplete(true)
    setIsLoading(false)
  };

  /* 暴露方法 */
  const refresh = async (reset?: boolean) => {
    if (reset) {
      setDataSource([])
      current.current = propCurrent
      setPageSize(propPageSize)
    } else {
      const curTotal = pageSize * (current.current);
      if (total && total <= curTotal) return;
      current.current = current.current + 1
    }
    await doSearch(reset);
  };

  /* 重置逻辑 */
  const _deps = [...(deps || []), isReady];

  useEffect(() => {
    if (!isReady) return;
    debounceRefresh(true);
  }, _deps);

  const debounceRefresh = debounce(
    (resetPage?: boolean) => {
      // todo: resetPage应该直接重置非reset的缓存
      refresh(resetPage);
    },
    100,
    {
      maxWait: 400,
    },
  )


  return {
    loading: isLoading,
    dataSource,
    paginationProps: {
      current: current.current,
      pageSize,
      total,
    },
    isFirstComplete,
    refresh: async (reset?: boolean) => {
      await refresh(reset);
    },
    debounceRefresh,
    setDataSource,
    setTotal,
  }
};

export default useVirtualList;
