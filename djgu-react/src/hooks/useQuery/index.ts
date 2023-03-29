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

/**
 * 获取url的query参数 xxx?id=111 返 { id: '111' }
 *
 * @author gdj
 * @date 2023-03-29
 * @export
 * @template T
 * @param [u]
 * @returns
 */
export default function useQuery<T = any>(u?: string): T {
  const loc = useLocation();
  let url = u || loc?.href;
  if (url) {
    const opt = getQueryOption(url)
    return (opt as unknown) as T;
  }
  return {} as unknown as T;
}
