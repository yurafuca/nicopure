export default class QueryString {
  static parse(text, sep, eq, isDecode = true) {
    text = text || location.search.substr(1);
    sep = sep || '&';
    eq = eq || '=';
    const decode = isDecode
      ? decodeURIComponent
      : function(a) {
          return a;
        };
    return text.split(sep).reduce(function(obj, v) {
      const pair = v.split(eq);
      obj[pair[0]] = decode(pair[1]);
      return obj;
    }, {});
  }

  static stringify(value, sep, eq, isEncode) {
    sep = sep || '&';
    eq = eq || '=';
    const encode = isEncode
      ? encodeURIComponent
      : function(a) {
          return a;
        };
    return Object.keys(value)
      .map(function(key) {
        return key + eq + encode(value[key]);
      })
      .join(sep);
  }
}
