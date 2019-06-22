# {≡} statebase
A tiny but powerful state management library. Inspired by React setState and the Firebase database API.

### example
Create state object:
```
var state = createState({
    a: true,
    b: {
        c: 'wow'
    }
})
```

Reference part of the state:
```
var aRef = state.ref('a')
var bRef = state.ref('b')
var cRef = state.ref('b').ref('c')
```
Read state values:
```
state.val()     // -> {a: true, b: {c: 'wow'}}
aRef.val()      // -> true
bRef.val()      // -> {c: 'wow'}
cRef.val()      // -> 'wow'
```

Update state values:
```
state.val()     // -> {a: true, b: {c: 'wow'}}

aRef.set(false)
aRef.val()      // -> false

cRef.set('nice')
cRef.val()      // -> 'nice'

state.val()     // -> {a: false, b: {c: 'nice'}}
```

Listen for changes:
```
var callback = function(ref) {
    console.log('b updated: ', ref.val())
}
var unsubscribe = bRef.listen(callback)

cRef.set('amazing')      // value updated, callback triggered
unsubscribe()            // remove listener
cRef.set('incredible')   // value updated, callback *NOT* triggered
```
