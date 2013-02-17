module.exports = function() {
  var recurse = function(stack, idx) {
    var key, next, name, ref;

    if (idx == remainder.length) {
      callback.apply(this, stack);
      return;
    }
    next = remainder[idx]; idx++;

    // Check if the item we got was a name for the item.
    if (typeof next == 'string' && next[0] !== '$') {
      named[next] = stack.length;
      name = next;
      next = remainder[idx]; idx++;
    }

    if (next) {
      // Function items are used to block recursion down a path
      if (typeof next == 'function') {
        if (next.apply(this, stack)) {
          recurse(stack, idx);
        }
      }
      // References can be used to iterate over the value
      // of an item up in the stack.
      else if (typeof next == 'string' && next[0] == '$') {
        ref = next.substr(1);
        if (typeof named[ref] == 'number' && stack[named[ref]]) {
          next = stack[named[ref]].value;
          for (key in next) {
            stack.push({key:key, value:next[key]});
            recurse(stack, idx);
            stack.pop()
          }
        }
      }
      // Otherwise this is just another object to iterate 
      // over.
      else {
        for (key in next) {
          stack.push({key:key, value:next[key]});
          recurse(stack, idx);
          stack.pop()
        }
      }
    }
  },
  remainder = Array.prototype.slice.call(arguments),
  callback = remainder.pop(),
  named = {};

  recurse([], 0);
}
