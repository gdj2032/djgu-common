/* eslint-disable func-names */
/* eslint-disable no-empty */
/* eslint-disable prefer-const */
/* eslint-disable no-restricted-properties */
// 数值精度计算
class CMX {
  /**
   * 加
   */
  add = function (arg1: number, arg2: number) {
    let r1; let r2; let m; let c;
    try {
      r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
      const cm = Math.pow(10, c);
      if (r1 > r2) {
        arg1 = Number(arg1.toString().replace('.', ''));
        arg2 = Number(arg2.toString().replace('.', '')) * cm;
      } else {
        arg1 = Number(arg1.toString().replace('.', '')) * cm;
        arg2 = Number(arg2.toString().replace('.', ''));
      }
    } else {
      arg1 = Number(arg1?.toString().replace('.', ''));
      arg2 = Number(arg2?.toString().replace('.', ''));
    }
    return (arg1 + arg2) / m;
  };

  /**
   * 减
   */
  sub = function (arg1: number, arg2: number) {
    let r1; let r2; let m; let
      n;
    try {
      r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); // last modify by deeka //动态控制精度长度
    n = r1 >= r2 ? r1 : r2;
    return Number(((arg1 * m - arg2 * m) / m).toFixed(n));
  };

  /**
   * 乘
   */
  mul = function (arg1: number, arg2: number) {
    let m = 0;
    const s1 = arg1.toString();
    const s2 = arg2.toString();
    try {
      m += s1.split('.')[1].length;
    } catch (e) { }
    try {
      m += s2.split('.')[1].length;
    } catch (e) { }
    return (
      (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m)
    );
  };

  /**
   * 除
   */
  div = function (arg1: number, arg2: number) {
    let t1 = 0;
    let t2 = 0;
    let r1;
    let r2;
    try {
      t1 = arg1.toString().split('.')[1].length;
    } catch (e) { }
    try {
      t2 = arg2.toString().split('.')[1].length;
    } catch (e) { }
    r1 = Number(arg1.toString().replace('.', ''));
    r2 = Number(arg2.toString().replace('.', ''));
    return (r1 / r2) * Math.pow(10, t2 - t1);
  };
}

export const cmx = new CMX();
