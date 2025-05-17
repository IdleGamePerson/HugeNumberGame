function z(s, b, i) {
    return Math.floor((s - b) / i);
  }
  
  function f(x, b, i, h, s) {
    const zVal = z(s, b, i);
    if (x <= zVal) {
      return b + i * x;
    } else {
      const delta = x - zVal;
      return b + i * x + h * ((delta ** 2 + delta) / 2);
    }
  }
  
  function gc(x, i) {
    const b = ((i - 1) ** 2 + i - 1) / 2;
    const inc = Math.floor(3 + (i ** 2) / 4);
    const h = 1;
    const s = 1024 * Math.log10(2);
    const floorX10 = Math.floor(x / 10);
    return Math.pow(10, f(floorX10, b, inc, h, s));
  }
  // For MegaNumber
  function gcMega(x, i) {
    const b = ((i - 1) ** 2 + i - 1) / 2;
    const inc = 3 + (i ** 2) / 4;
    const h = 1;
    const s = 1024 * Math.log10(2);
    const floorX10 = Math.floor(x / 10);
    const exp = f(floorX10, b, inc, h, s);
    return new MegaNumber(exp, 0, 1); // 10^exp
  }