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
