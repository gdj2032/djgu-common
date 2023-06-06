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
  newArr: T[];
  repeatArr: T[];
  isRepeat: boolean;
} {
  const map = new Map()
  const repeatArr: T[] = []
  const newArr = arr.filter((item: T) => {
    // @ts-ignore
    const itemKey = key ? item[key] : item;
    let repeat = true
    if (map.has(itemKey)) {
      repeatArr.push(item)
    } else {
      map.set(itemKey, 1)
      repeat = false;
    }
    return repeat;
  })
  return { newArr, repeatArr, isRepeat: newArr.length !== arr.length }
}
