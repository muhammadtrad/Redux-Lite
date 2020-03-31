

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

const combineReducers = (obj) =>{
    let stateTypes = Object.keys(obj).type;
    let reducers = Object.values(obj);

    for (i=0; i<stateTypes.length; i++){
        let stateType = stateTypes[i];
        let reducer = reducers[i];
    
        
    }
};

