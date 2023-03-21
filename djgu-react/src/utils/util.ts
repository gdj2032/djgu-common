export /**
 * 异步执行
 *
 * @param func
 * @returns
 */
  const nextTick = (func: (value: void) => void): Promise<void> => Promise.resolve().then(func);

export /**
 * 文件下载
 *
 * @param _blob
 * @param [fileName='']
 */
  const downloadFile = (_blob: Blob, fileName: string = '') => {
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
