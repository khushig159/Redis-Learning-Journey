import express from 'express'
const app=express()
import Redis from 'ioredis'
import { getcachedDate ,rateLimiter} from './middleware/redis.js'
import {getProducts,getProductsdetails} from './products.js'


// import { createClient } from 'redis';

// const client = createClient({
//     password: 'D345YrlHOKyVQqKH9VRqcKeldB1vvgtm',
//     socket: {
//         host: 'redis-16439.c17.us-east-1-4.ec2.redns.redis-cloud.com',
//         port: 16439
//     }
// });

const redis=new Redis({
    host: 'redis-16439.c17.us-east-1-4.ec2.redns.redis-cloud.com',
    port:16439,
    password: 'D345YrlHOKyVQqKH9VRqcKeldB1vvgtm',
})
export {redis};

// if (redis.exists("products")){

// }
// else{

// }

let count=0

app.get('/', rateLimiter({limit:30,timer:300,key:"home"}),async(req,res)=>{
    // count++
    // console.log(count)
    // const key=`${clientIP}:request_count`
    // const reqCount=await redis.incr(key)
    // limit=10
    // timer=60
    // if (reqCount===1){
    //     redis.expire(key,timer)
    // }
    // const ttl=await redis.ttl(key)
    
    // if (reqCount>limit){
    //     return res.status(429).send(`too many requests, please try again after ${ttl} seconds`)
    // }

    // console.log(req.ip)
    // console.log(clientIP)
    //current IP - request count
    res.send(`hello`)
})

app.get('/products',rateLimiter({limit:5,timer:20,key:"products"}), getcachedDate("products"), async (req,res)=>{
    //const isExist=await redis.exists("products")
    // let products= await redis.get("products")
    // if (products){
    //     console.log("get from cache")
    //     //const products= await redis.get("products")
    //     return res.json({
    //     products: JSON.parse(products)
    // })
    // } 
    const products=await getProducts()
    await redis.setex("products",20,JSON.stringify(products))
    return res.json({products})
})

app.get('/product/:id', async(req,res)=>{
    const id=req.params.id;
    const key=`product:${id}`;
    let product=await redis.get(key)
    if (product){
        console.group('from cache')
        return res.json({product:JSON.parse(product)})
    }
    product=await getProductsdetails(id)
    await redis.set(key, JSON.stringify(product))
    return res.json({product})
})

app.get('/order/:id',async(req,res)=>{
    const productId=req.params.id
    const key=`product:${productId}`

    //any mutaion to database here
    //ike creating new order
    //reducing the product stock in database

    await redis.del(key)

    return res.json({
        message:"order placed successfully" + " " + productId + " " + "is ordered.",
    })
})

app.listen(3000,()=>{
    console.log("server running on 3000")
})