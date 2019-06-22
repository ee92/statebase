function createState(initialState) {
   var state = initialState;
   var listeners = {};

   function createRef(key, path = [key]) {
      
      function ref(key) {
         return createRef(key, path.concat(key));
      }

      function val() {
         var val = state;
         for (let i=1; i<path.length; i++) {
            if (!val[path[i]]) return undefined;
            val = val[path[i]];
         }
         return val;
      }

      function callListeners() {
         for (let i=0; i<path.length; i++) {
            var paths = path.slice(0, i+1);
            const id = paths.join('-');
            if (!listeners[id]) continue;
            for (let j=0; j<listeners[id].length; j++) {
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
         const id = path.join('-');
         if (!listeners[id]) {
            listeners[id] = [];
         }
         listeners[id].push(listener);
         return function() {
            const index = listeners[id].indexOf(listener);
            listeners[id].splice(index, 1);
         }
      }

      return {
         ref: ref,
         val: val,
         set: set,
         listen: listen
      }
   }

   return createRef('state');
}

module.exports = createState;
