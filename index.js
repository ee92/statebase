function createState(initialState) {
   var state = initialState;
   var initial = JSON.parse(JSON.stringify(initialState))
   var listeners = {};

   function createRef(key, path = [key]) {

      function reset() {
         if (path.length === 1 && key === 'state') {
            state = initial;
            callListeners();
            return;
         }
         var update = state;
         for (var i=1; i<path.length-1; i++) {
            update = update[path[i]];
         }
         if (update[key] === initial[key]) return;
         update[key] = initial[key];
         callListeners();
      }
      
      function ref(key) {
         return createRef(key, path.concat(key));
      }

      function val() {
         var value = state;
         for (var i=1; i<path.length; i++) {
            var innerVal = value[path[i]]
            if (innerVal === undefined) return undefined
            value = innerVal;
         }
         return JSON.parse(JSON.stringify(value))
      }

      function callListeners() {
         for (var i=0; i<path.length; i++) {
            var paths = path.slice(0, i+1);
            const id = paths.join('-');
            if (!listeners[id]) continue;
            for (var j=0; j<listeners[id].length; j++) {
               var ref = createRef(paths[i], paths);
               listeners[id][j](ref);
            }
         }
      }

      function set(value) {
         if (path.length === 1 && key === 'state') {
            state = value;
            callListeners();
            return;
         }
         var update = state;
         for (var i=1; i<path.length-1; i++) {
            update = update[path[i]];
         }
         if (update[key] === value) return;
         update[key] = value;
         callListeners();
      }

      function listen(listener) {
         var id = path.join('-');
         if (!listeners[id]) {
            listeners[id] = [];
         }
         listeners[id].push(listener);
         return function() {
            var index = listeners[id].indexOf(listener);
            listeners[id].splice(index, 1);
         }
      }

      return {
         ref: ref,
         val: val,
         set: set,
         listen: listen,
         reset: reset
      }
   }

   return createRef('state');
}

module.exports = createState;
