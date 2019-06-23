var createState = require('./index.js');

function checkStateReplace() {
   var state = createState({
      x: 100
   });
   state.set({x: 42});
   if (state.ref('x').val() !== 42) {
      console.warn('state replace broken');
   }
}

function checkImmutable() {
   var state = createState({
      a: [1,2,3],
      b: {
         c: [1,2,3]
      }
   });
   var a = state.ref('a').val();
   var b = state.ref('b').val();
   var c = state.ref('b').ref('c').val();
   a.pop();
   c.pop();
   b.d = 'wow';
   if (
      state.ref('a').val().length !== 3 ||
      state.ref('b').ref('d').val() !== undefined ||
      state.ref('b').ref('c').val().length !== 3
   ) {
      console.warn('yo state is mutable af');
   }
}

function checkSetDeep() {
   var state = createState({});
   state.ref('x').set({});
   state.ref('x').ref('y').set('wow');
   if (state.ref('x').ref('y').val() !== 'wow') {
      console.warn('set deep not working');
   }
}

function checkInitialState() {
   var state = createState({
      a: 5,
      b: true,
      c: {
         a: 100,
         b: {
            c: 'wow'
         }
      }
   });
   if (
      state.ref('a').val() !== 5
      || state.ref('c').ref('a').val() !== 100
      || state.ref('c').ref('b').ref('c').val() !== 'wow'
   ) {
      console.warn('initialiazed with wrong value');
   }
}

function checkListener() {
   var state = createState({
      a: 5,
      b: true,
      c: {
         a: 100,
         b: {
            c: 'wow'
         }
      }
   });
   var error = true;
   const unsub = state.ref('a').listen(function(snap) {
      error = snap.val() !== 6;
   })
   state.ref('a').set(6);
   unsub();
   state.ref('a').set(7);
   if (error) {
      console.warn('listener no work');
   }
}

function checkListenerDeep() {
   var state = createState({
      a: 5,
      b: true,
      c: {
         a: 100,
         b: {
            c: 'wow'
         }
      }
   });
   var error = true;
   const unsub = state.ref('c').listen(function(snap) {
      error = false;
   })
   state.ref('c').ref('a').set(42);
   unsub();
   if (error) {
      console.warn('listener no work on deep change');
   }
}

function runTests() {
   checkInitialState();
   checkListener();
   checkListenerDeep();
   checkSetDeep();
   checkImmutable();
   checkStateReplace();
}

runTests();