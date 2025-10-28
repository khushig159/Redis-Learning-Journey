import {redis} from "../app.js"

export const getcachedDate = (key) => async (req, res, next) => {
     let data= await redis.get(key)
    if (data){
        console.log("get from cache")
        //const products= await redis.get("products")
        return res.json({
        products: JSON.parse(data)
    })
    } 
    next();
}

export const rateLimiter=({limit=20,timer=60, key})=>async(req,res,next)=>{
    const clientIP=req.headers["x-forwarded-for"] || req.socket.remoteAddress
    const fullkey=`${clientIP}:${key}:request_count`
    const reqCount=await redis.incr(fullkey)
    if (reqCount===1){
        redis.expire(key,timer)
    }
    const ttl=await redis.ttl(fullkey)
    
    if (reqCount>limit){
        return res.status(429).send(`too many requests, please try again after ${ttl} seconds`)
    }
    next()
}
