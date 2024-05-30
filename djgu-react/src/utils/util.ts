/**
 * 异步执行
 *
 * @author gdj
 * @date 2023-03-22
 * @param func
 * @returns
 */
export const nextTick = (func: (value: void) => void): Promise<void> => Promise.resolve().then(func);

/**
 * 文件下载
 *
 * @author gdj
 * @date 2023-03-22
 * @param _blob
 * @param [fileName='']
 */
export const downloadFile = (_blob: Blob, fileName: string = '') => {
  const blob = new Blob([_blob], { type: _blob.type });
  const objectUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = fileName
  a.target = '_blank'
  a.click()
  a.remove();
  window.URL.revokeObjectURL(objectUrl);
}

/**
 * 随机key
 *
 * @author gdj
 * @date 2023-03-22
 * @export
 * @returns
 */
export function randomKey() {
  return Math.random().toString(16).slice(2);
}

/**
 * 验证url是否合法
 *
 * @author gdj
 * @date 2023-03-29
 * @export
 * @param url
 * @returns
 */
export function isURL(url: string) {
  // const strRegex = '^((https|http|ftp|rtsp|mms)?://)'
  //     + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' // ftp的user@
  //     + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
  //     + '|' // 允许IP和DOMAIN（域名）
  //     + '([0-9a-z_!~*\'()-]+.)*' // 域名- www.
  //     + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名
  //     + '[a-z]{2,6})' // first level domain- .com or .museum
  //     + '(:[0-9]{1,4})?' // 端口- :80
  //     + '((/?)|' // a slash isn't required if there is no file name
  //     + '(/[0-9a-zA-Z_!~*\'().;?:@&=+$,%#-]+)+/?)$';
  // const re = new RegExp(strRegex);
  return url.indexOf('https://') === 0 || url.indexOf('http://') === 0;
}

/**
 * 判断数组元素是否重复
 * 返回 newArr: 去重后的数组, repeatArr: 重复的数组, isRepeat: 是否重复
 *
 * @author gdj
 * @date 2023-06-06
 * @export
 * @template T
 * @param arr
 * @param [key]
 * @returns
 */
export function unique<T = any>(arr: T[], key?: string): {
  arr: T[],
  newArr: T[];
  repeatArr: T[];
  isRepeat: boolean;
} {
  const map = new Map()
  const repeatArr = arr.filter((item) => {
    // @ts-ignore
    const itemKey = key ? item[key] : item;
    let repeat = true
    if (!map.has(itemKey)) {
      map.set(itemKey, item)
      repeat = false;
    }
    return repeat;
  })
  const newArr = [...map.values() as unknown as T[]]
  return { arr, newArr, repeatArr, isRepeat: newArr.length !== arr.length }
}

/**
 * 获取对象值
 *
 * @author gdj
 * @date 2024-03-26
 * @export
 * @param obj
 * @param params 'user.name' | 'users[0].name'
 */
export function get(obj: any, values: string) {
  if (!obj) return undefined;
  const arr = values.split('.') || [];
  let foo = obj
  for (const key of arr) {
    if (key.includes('[') && key.includes(']')) {
      // 数组
      const splitKey = '~~~'
      const ks = key.replace(/\[|\]/g, splitKey)
      const arr2 = ks.split(splitKey).filter(e => !!e);
      const k = arr2[0];
      let f = foo[k]
      const type = Object.prototype.toString.call(f)
      if (type === '[object Array]') {
        for (let i = 1; i < arr2.length; i++) {
          if (f && f.length > arr2[i]) {
            f = f[arr2[i]]
          } else {
            f = undefined;
            break;
          }
        }
        foo = f;
      } else if (type === '[object Object]') {
        foo = f;
      } else {
        foo = undefined;
      }
    } else {
      // 非数组
      foo = foo ? foo[key] : undefined;
    }
  }
  return foo;
}

