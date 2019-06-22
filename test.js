var createState = require('./index.js');

function checkImmutable() {
   var state = createState({
      a: {
         b: 'c'
      }
   });
   let val = state.ref('a').val();
   val = {
      b: 42
   }
   if (state.ref('a').ref('b').val() !== 'c') {
      console.warn('state mutated incorrectly');
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
}

runTests();