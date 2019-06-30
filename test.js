var createState = require('./index.js');

function checkSimpleSet() {
   let initialState = {
      user: null,
      siteList: [],
      inputs: {
         site: "",
         email: "",
         secret: ""
      },
      visualHint: [],
      generatedKey: "",
      settings: {
         isShowing: false,
         isMemorable: true,
         length: 10,
         numWords: 3,
         includeSymbol: true,
         symbols: "@#$%^&*?!",
         useSalt: false,
         salt: ""
       }
   }
   var state = createState(initialState);
   let ref = state.ref('inputs').ref('site');
   ref.set('a');
   if (ref.val() !== 'a') {
      console.warn('simple set not working');
   }
}

function checkPrimativeVals() {
   let initialState = {
      user: null,
      siteList: [],
      inputs: {
         site: "",
         email: "",
         secret: ""
      },
      visualHint: [],
      generatedKey: "",
      settings: {
         isShowing: false,
         isMemorable: true,
         length: 10,
         numWords: 3,
         includeSymbol: true,
         symbols: "@#$%^&*?!",
         useSalt: false,
         salt: ""
       }
   }
   var state = createState(initialState);
   if (
      state.ref('inputs').ref('site').val() !== "" ||
      state.ref('settings').ref('length').val() !== 10 ||
      state.ref('settings').ref('isShowing').val() !== false
   ) {
      console.warn('issue getting primative val');
   }
}

function checkReset() {
   var state = createState({
      a: "",
      x: 100,
      y: {
         z: 100
      }
   });

   state.ref('a').reset();
   state.ref('x').set(42);
   state.ref('x').reset();
   state.ref('y').ref('z').set(42);
   state.ref('y').ref('bubba').set(42);
   state.ref('y').reset();
   if (
      state.ref('x').val() !== 100 ||
      state.ref('y').ref('z').val() !== 100 ||
      state.ref('y').ref('bubba').val() ||
      state.ref('a').val() !== ""
   ) {
      console.warn('reset not working');
   }
}

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

function checkListenerShallow() {
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
   let innerRef = state.ref('c').ref('b').ref('c')
   const unsubC = innerRef.listen(function() {
      error = false;
   })
   const unsubA = state.ref('a').listen(function() {
      error = true;
   })
   state.ref('c').ref('b').set({c: 'nice'});
   unsubC();
   unsubA();
   if (error) {
      console.warn('listener no work on shallow change');
   }
}

function runTests() {
   checkInitialState();
   checkListener();
   checkListenerDeep();
   checkListenerShallow()
   checkSetDeep();
   checkImmutable();
   checkStateReplace();
   checkReset();
   checkPrimativeVals();
   checkSimpleSet();
}

runTests();