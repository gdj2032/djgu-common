import { useLocation } from "react-use";

const getQueryOption = (url: string) => {
  const opt: any = {}
  if (!!url) {
    const qStr = decodeURIComponent(url);
    const parLen = qStr.indexOf('?');
    const parStr = qStr.substring(parLen + 1);
    const parArr = parStr.split('&');
    const params: any[] = []
    // tslint:disable-next-line: forin
    for (const i in parArr) {
      params.push(parArr[i].split('='))
    }
    // tslint:disable-next-line: forin
    for (const j in params) {
      opt[params[j][0]] = params[j][1]
    }
  }
  // console.log('getQueryOption opt =', opt);
  return opt;
}

// 获取页面路由参数 xxx?id=111 返 { id: '111' }
export default function useQuery<T = any>(): T {
  const loc = useLocation();
  if (loc?.href) {
    const opt = getQueryOption(loc.href)
    return (opt as unknown) as T;
  }
  return {} as unknown as T;
}
