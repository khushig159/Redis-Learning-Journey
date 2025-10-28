export const getProducts = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve( [
                    {
                        id: 1,
                        name: "Product 1",
                        price: 100,
                    }
                ]
            )
        }, 2000)
    })
}

export const getProductsdetails = (id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                products:
                {
                    id: id,
                    name: `Product ${id}`,
                    price: Math.floor(Math.random() * id * 100),
                }
            })
        }, 2000)
    })
}