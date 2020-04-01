
class Store{
    constructor(rootReducer){
        this.rootReducer = rootReducer;
        this.state = this.rootReducer({});
        this.subscriptions = [];
        
        this.getState = this.getState.bind(this);
        this.dispatch = this.dispatch.bind(this);
        this.subscribe = this.subscribe.bind(this);
    }

    getState(){
        return Object.assign({}, this.state);
    }

    dispatch(actions){
       this.state = this.rootReducer(this.state , actions, this.subscriptions);
    }

    subscribe(cb){
        this.subscriptions.push(cb);
    }
}
//Combining Reducers

// const combineReducers = (obj) => {
//         return (prevState = {user: "default"}, action = {type: "default", user: "default"} ) =>{
        
//           let stateTypes = Object.keys(obj);
//           let reducers = Object.values(obj);
//           newObj = {}
//           for (i = 0; i < stateTypes.length; i++) {
//               let stateType = stateTypes[i];
//               let reducerFunc = reducers[i];

//             let output = reducerFunc(prevState[stateType], action);
//             newObj[stateType] = output;
//         }
//         return newObj;
//     }
// };

const createStore = (...args) => new Store(...args);

const combineReducers= config => {
    return (prevState, action, subscriptions) => {
        const nextState = {};
        let stateChanged = false;

        Object.keys(config).forEach(k =>{
            if (!action){
                const args = [, {type: "__initialize" }];
                nextState[k] = config[k](...args);
                stateChanged = true;
            } else {
                const next = config[k](prevState[k], action);
                if (next !== prevState[k]){
                    stateChanged = true;
                    nextState[k] = next;
                }
            }
        });

        if (stateChanged){
            if (subscriptions){
                subscriptions.forEach(cb => cb(nextState));
                return nextState;
            }
        }
        return prevState;
    }
}


const myNoiseReducer = (prevState = "peace and quiet", action) => {
    switch (action.type) {
        case "noisy action":
            return action.noise;
        default:
            return prevState;
    }
};

const myNoisyAction = {
    type: "noisy action",
    noise: "Car alarm"
};

const myInconsequentialAction = {
    type: "a type no one cares about",
    data: {
        thisThing: "will not get used anyway"
    }
};

const myInitialState = {
    noise: "peace and quiet"
};

const myRootReducer = combineReducers({
    noise: myNoiseReducer,
});

let newState = myRootReducer(myInitialState, myInconsequentialAction);
// => { noise: "peace and quiet" }

newState = myRootReducer(newState, myNoisyAction)
// => { noise: "Car alarm" }

myRootReducer(newState, myInconsequentialAction)
// => { noise: "Car alarm" }


// The first time you call `myRootReducer` with `myInconsequentialAction`, it returns the initial state. This is because the only reducer, `myNoiseReducer`, doesn't respond to that action type. When we invoke it with `newState` and `myNoisyAction`, however, the `noise` key is modified because `myNoiseReducer` returns something other than its `prevState` for the `"noisy action"` action type. When we invoke the `rootReducer`, with `myInconsequentialAction` the second time, the `noise` property doesn't revert back to it's default value, it just doesn't change.
////////////////////////////////////////////////////////////////////////////
//Dispatch
//const dispatch = 

// // define a reducer for user:
// const userReducer = (oldUser = null, action) => {
//   if (action.type === "new user") {
//     return action.user;
//   }
//   return oldUser;
// };

// // create a rootReducer:
// // const rootReducer = combineReducers({
// //   user: userReducer
// // });

// // create a store using the rootReducer:
// // const store = new Store(rootReducer);

// const rootReducerTest = combineReducers({user: userReducer});
// const storeTest = new Store(rootReducerTest);
// console.log(storeTest.getState());


// // get the state:
// store.getState(); // => {}

// // invoke the dispatch function to update the user key:
// const action = {
//   type: "new user",
//   user: "Jeffrey Fiddler"
// };


// //store.dispatch(action);

// store.getState(); // => { user: "Jeffrey Fiddler" }


////////////////////////////////////////////////////////////////////////////////
//Subscribing to the Store

  const actionCreator1 = value => ({
    type: "add",
    value
  });

  const actionCreator2 = value => ({
    type: "subtract",
    value
  });

  const actionCreator3 = value => ({
    type: "no change",
    value
  });

  const numberReducer = (num = 0, action) => {
    switch(action.type) {
      case "add":
        return num + action.value;
      case "subtract":
        return num - action.value;
      default:
        return num;
    }
  }

  const rootReducer = combineReducers({
    number: numberReducer
  });

  const store = new Store(rootReducer);

  store.getState() // => { number: 0 }

  const announceStateChange = nextState => {
    console.log(`That action changed the state! Number is now ${nextState.number}`);
  }

  store.subscribe(announceStateChange);

  console.log(store.dispatch(actionCreator1(5))); // => "That action changed the state! Number is now 5"
  console.log(store.dispatch(actionCreator1(5))); // => "That action changed the state! Number is now 10"
  console.log(store.dispatch(actionCreator2(7))); // => "That action changed the state! Number is now 3"
  console.log(store.dispatch(actionCreator3(7))); // => Nothing should happen! The reducer doesn't do anything for type "no change"
  console.log(store.dispatch(actionCreator1(0)));console.log()// => Nothing should happen here either. Even though the reducer checks for the "add" action type, adding 0 to the number won't result in a state change.

  store.getState(); // => { number: 3 }

