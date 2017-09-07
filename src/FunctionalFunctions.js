function restrict(table, pred) {
  return _.reduce(table, function(newTable, obj) {
    if (truthy(pred(obj)))
      return newTable;
    else
      return _.without(newTable, obj);
  }, table);
}

function as(table, newNames) {
  return _.map(table, function(obj) {
    return rename(obj, newNames);
  });
}

function rename(obj, newNames) {
  return _.reduce(newNames, function(o, nu, old) {
    if (_.has(obj, old)) {
      o[nu] = obj[old];
      return o;
    }
    else
      return o;
  },
  _.omit.apply(null, construct(obj, _.keys(newNames))));
}

function project(table, keys) {
  return _.map(table, function(obj) {
    return _.pick.apply(null,construct(obj, keys));
  });
}

function stringReverse(s) {
  if (!_.isString(s)) return undefined;
  return s.split('').reverse().join('');
}

function dispatch(/* 任意の数の関数 */) {
  var funs = _.toArray(arguments);
  var size = funs.length;
  return function(target /*, 追加の引数 */) {
    var ret;
    var args = _.rest(arguments);
    for (var funIndex = 0; funIndex < size; funIndex++) {
      var fun = funs[funIndex];
      ret = fun.apply(fun, construct(target, args));
      if (existy(ret)) return ret;
    }
    return ret;
  };
}

function validator(message, fun) {
  var f = function(/* args */) {
    return fun.apply(fun, arguments);
  };
  f.message = message;
  return f;
}

function hasKeys() {
  var KEYS = _.toArray(arguments);
  var fun = function(obj) {
    return _.every(KEYS, function(k) {
      return _.has(obj, k);
    });
  };
  fun.message = cat([' これらのキーが存在する必要があります：'], KEYS).join(' ');
  return fun;
}

function checker(/* （1 つ以上の）検証関数 */) {
  var validators = _.toArray(arguments);
  return function(obj) {
    return _.reduce(validators, function(errs, check) {
      if (check(obj))
        return errs;
        else
          return _.chain(errs).push(check.message).value();
    }, []);
  };
}

function fnull(fun /*, （1 つ以上の）デフォルト値 */) {
  var defaults = _.rest(arguments);
  return function(/* args */) {
    var args = _.map(arguments, function(e, i) {
      return existy(e) ? e : defaults[i];
    });
    return fun.apply(null, args);
  };
}

function invoker (NAME, METHOD) {
  return function(target /* 任意の数の引数 */) {
    if (!existy(target)) fail('Must provide a target');
    var targetMethod = target[NAME];
    var args = _.rest(arguments);
    return doWhen((existy(targetMethod) && METHOD === targetMethod), function() {
      return targetMethod.apply(target, args);
    });
  };
}

function fail(message){
  Logger.log('Error: '+message);
}

function k(val) {
  return function() {
    return val;
  };
}

function iterateUntil(fun, check, init) {
  var ret = [];
  var result = fun(init);
  while (check(result)) {
    ret.push(result);
    result = fun(result);
  }
  return ret;
}

function repeatedly(times, fun) {
  return _.map(_.range(times), fun);
}

function best(fun, coll) {
  return _.reduce(coll, function(x, y) {
    return fun(x, y) ? x : y;
  });
}

function finder(valueFun, bestFun, coll) {
  return _.reduce(coll, function(best, current) {
    var bestValue = valueFun(best);
    var currentValue = valueFun(current);
    return (bestValue === bestFun(bestValue, currentValue)) ? best : current;
  });
}

function interpose(inter, coll) {
  return butLast(mapcat(function(e) {
    return construct(e, [inter]);
  }, coll));
}

function butLast(coll) {
  return _.toArray(coll).slice(0, -1);
}

function mapcat(func, coll) {
  return cat.apply(null, _.map(coll, func));
}

function construct(head, tail) {
  return cat([head], _.toArray(tail));
}

function cat(/* */){
  var head = _.first(arguments);
  if(existy(head))
    return head.concat.apply(head,_.tail(arguments));
  else
    return [];
}

function truthy(x) { return (x !== false) && existy(x); }

function existy(x) { return x != null; }

