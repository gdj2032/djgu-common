import qs from "qs";
import { useLocation } from "react-use";

// 获取页面路由参数 xxx?id=111 返 { id: '111' }
export default function useQuery<T = any>(): T {
  const { search } = useLocation();
  if (search) {
    return (qs.parse(search.replace('?', '')) as unknown) as T;
  }
  return {} as unknown as T
}
