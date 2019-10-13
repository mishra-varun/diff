export const updateProd = (pid, price, quantity) => {
    return {
        type: "update",
        pid: pid,
        quantity: quantity,
        price: price
    }
}

export const addProd = (prodobj, price) => {
    return {
        type: "add",
        prodobj: prodobj,
        price:price
    }
}

export const removeProd = (pid, price) => {
    return {
        type :"remove",
        pid: pid,
        price: price
    }
}

export const emptyCart = () => {
    return {type: "empty"}
}