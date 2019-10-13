const red = (state = {cart: [], cost:0}, action) => {
    console.dir({action:action,state:state});
    if(action.type == "add"){
        let addedprod = [action.prodobj];
        return Object.assign(
            {},state, {cost: state.cost + action.price, cart: state.cart.concat(addedprod)}
        );
    }
    else if (action.type == "remove"){
        let i, prodindex = 100000;
        for(i = 0; i< state.cart.length; i++){
            if (state.cart[i].id == action.pid){
                prodindex = i;
            }
        }
        return Object.assign(
            {},state, {cost: state.cost - action.price, cart: state.cart.splice(prodindex,1)}
        );
    }
    else if (action.type == "empty"){
        return {cart: [], cost: 0}
    }
    else{
        return state
    }
}

export default red