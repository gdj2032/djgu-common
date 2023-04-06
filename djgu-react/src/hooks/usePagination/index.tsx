import {
  useEffect, useState, useRef, useCallback, DependencyList, ReactNode
} from 'react';
import { debounce } from 'lodash';
import { useLatest } from 'react-use';

interface IPaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => Promise<void>;
  onShowSizeChange: (size: number, current: number) => Promise<void>;
  showTotal?: (t: number) => ReactNode;
  showQuickJumper?: boolean;
  showSizeChanger?: boolean;
}

export interface PaginationResult<T> {
  /**
   * 表格基本数据
   *
   * @memberof PaginationResult
   */
  tableProps: {
    loading?: boolean;
    dataSource: T[];
  };
  /**
   * 分页信息
   *
   * @memberof PaginationResult
   */
  paginationProps: IPaginationProps;
  /**
   * 是否完成了请求
   *
   * @memberof PaginationResult
   */
  isFirstComplete: boolean;
  /**
   * resetPage 是否重置查询
   */
  refresh: (resetPage?: boolean) => Promise<void>;
  /**
   * 刷新
   * @resetPage 是否重置刷新
   *
   * @memberof PaginationResult
   */
  debounceRefresh: (resetPage?: boolean) => void;
  /**
   * 快速逃避方案
   *
   * @memberof PaginationResult
   */
  setDataSource: (data: T[]) => void;
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

const usePagination = <T,>(
  server: IInfoServer<T>,
  deps?: DependencyList, // 依赖条件 数据更新默认执行server
  option?: IInfoOption<T>,
): PaginationResult<T> => {
  const {
    isReady = true,
    dataSource: propDataSource = [],
    current: propCurrent = 1,
    pageSize: propPageSize = 10,
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
  const doSearch = async () => {
    if (!isReady) {
      return;
    }
    let _current = current.current;
    const _pageSize = pageSize;
    setIsLoading(true);

    seq.current++;
    const _seq = seq.current;
    try {
      // 发送请求
      let { dataSource: data_source, total: _total } = await server({
        limit: _pageSize, offset: Math.round((_current - 1) * _pageSize), current: _current
      });
      if (_seq !== seq.current) return;
      if (pageSize * (_current - 1) >= _total && _current !== 1) {
        _current = 1;
        const totalPage = Math.ceil(_total / pageSize);
        ({ dataSource: data_source, total: _total } = await server({
          limit: _pageSize, offset: Math.round((totalPage - 1) * _pageSize), current: _current
        }));
        if (_seq !== seq.current) return;
        _current = totalPage;
      }
      setDataSource(data_source);
      current.current = _current
      setPageSize(_pageSize);
      setTotal(_total);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('fetch err', error);
      if (_seq !== seq.current) return;
    }
    setIsFirstComplete(true);
    setIsLoading(false);
  };
  const latestDoSearch = useLatest(doSearch);

  /* 暴露方法 */
  /* 暴露方法 */
  const refresh = async (resetPage?: boolean) => {
    if (resetPage) {
      current.current = propCurrent
      setPageSize(propPageSize);
    }
    latestDoSearch.current()
  };

  /* 重置逻辑 */
  const _deps = [...(deps || []), isReady];

  useEffect(() => {
    if (!isReady) return;
    debounceRefresh(true);
  }, _deps);

  const debounceRefresh = useCallback(
    debounce(
      (resetPage?: boolean) => {
        // todo: resetPage应该直接重置非reset的缓存
        refresh(resetPage);
      },
      100,
      {
        maxWait: 400,
      },
    ),
    [],
  );

  return {
    tableProps: {
      loading: isLoading,
      dataSource,
    },
    paginationProps: {
      current: current.current,
      pageSize,
      total,
      onChange: async (_cur: number, _pageSize: number) => {
        current.current = _cur
        setPageSize(_pageSize)
        debounceRefresh()
      },
      onShowSizeChange: async (_cur: number, _pageSize: number) => {
        current.current = _cur
        setPageSize(_pageSize)
        debounceRefresh()
      },
      showTotal: (_t: number) => `共 ${_t} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
    },
    isFirstComplete,
    refresh,
    debounceRefresh,
    /* 快速逃避方案 */
    setDataSource,
  } as PaginationResult<T>;
};

export default usePagination;
