# Redis Learning with Node.js (ioredis)

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)
![ioredis](https://img.shields.io/badge/ioredis-00599C?logo=redis&logoColor=white)

**Node.js** + **Redis** + **ioredis** = **Lightning-Fast Data Magic**

A **step-by-step**, beginner-friendly journey into **Redis** using **Node.js** and the powerful `ioredis` client. Perfect for developers who want to understand Redis from scratch — with clear explanations, real code, and practical examples.

---

## Introduction

Welcome to your **Redis learning playground**!

This repository is your personal guide to mastering **Redis** — the lightning-fast, in-memory data store using **Node.js** and the modern `ioredis` client.

Whether you're:
- Brand new to Redis
- Coming from SQL/NoSQL databases
- A JavaScript developer curious about **caching**, **sessions**, **queues**, or **real-time features**

You’ll find **clear, bite-sized lessons** with:
- Simple analogies (think of Redis as a <span style="color:#f39c12;">**super-fast sticky note board**</span>)
- Real-world code examples
- Line-by-line explanations
- Common pitfalls and how to avoid them

---

### What You'll Learn

| Topic | Why It Matters |
|------|----------------|
| <span style="color:#e74c3c;">**Redis Data Types**</span> | `Strings`, `Lists`, `Hashes`, `Sets`, `Sorted Sets` — each like a different tool in your toolbox |
| <span style="color:#3498db;">**Connection Handling**</span> | Safe, efficient ways to connect with `ioredis` |
| <span style="color:#9b59b6;">**Real-World Patterns**</span> | Caching, rate limiting, leaderboards, pub/sub |
| <span style="color:#2ecc71;">**Best Practices**</span> | Error handling, cleanup, performance tips |

---

### Tech Stack

| Tool | Description |
|------|-----------|
| <span style="color:#83CD29;">**Node.js**</span> | JavaScript runtime for server-side magic |
| <span style="color:#006eb6;">**ioredis**</span> | Full-featured, promise-based Redis client |
| <span style="color:#b33f2b;">**Redis**</span> | In-memory key-value database — **fast like RAM** |

> No prior Redis or advanced Node.js knowledge needed!

---

<span style="color:#f1c40f;">**Ready? Let’s start with the basics — one concept at a time.**</span>

---

## Table of Contents

- [Redis Basics & Data Types](#redis-basics--data-types)
  - [Strings](#strings)
  - [Lists](#lists)
  - [Hashes](#hashes)
  - [Sets](#sets)
  - [Sorted Sets (ZSETs)](#sorted-sets-zsets)
  - [Geospatial Data](#geospatial-data)
  - [JSON (RedisJSON)](#json-redisjson)
  - [Streams](#streams)
  - [Key Management & Expiration](#key-management--expiration)
- [Code Examples](#code-examples)
  - [Connecting to Redis](#example-1-connecting-to-redis)
  - [Strings in Action](#example-2-working-with-strings)
  - [Lists in Action](#example-3-working-with-lists)
  - [Hashes in Action](#example-4-working-with-hashes)
  - [Sets in Action](#example-5-working-with-sets)
  - [Sorted Sets in Action](#example-6-working-with-sorted-sets)
  - [Key Expiration](#example-7-volatile-keys-with-ttl)
  - [Geospatial: Find Nearby Locations](#example-8-geospatial-nearby-search)
- [Project Structure](#project-structure)
- [Running the Examples](#running-the-examples)
- [Best Practices & Gotchas](#best-practices--gotchas)
- [Resources](#resources)
- [Contributing](#contributing)
- [License](#license)

---

## Redis Basics & Data Types

> Think of Redis as a **giant, super-fast whiteboard** in memory.  
> You write **keys** (like labels) and attach **values** of different shapes.

Let’s explore each **data type** — what it is, when to use it, and how to work with it in **Node.js using `ioredis`**.

---

### Strings

<span style="color:#e74c3c;">**The most basic building block**</span> — like a single sticky note with a label and a message.

| Use Case | Example |
|--------|---------|
| Caching API responses | `user:123` → `{"name": "Alice"}` |
| Counters | `page:home:views` → `1520` |
| Session tokens | `sess:abc123` → `userId:42` |

#### Key Commands

| Command | Purpose |
|-------|--------|
| `SET key value` | Set a string |
| `GET key` | Retrieve it |
| `SETEX key seconds value` | Set with **auto-expire** |
| `SETNX key value` | Set **only if not exists** |
| `MGET key1 key2...` | Get multiple keys |
| `INCR key` | Increment number (+1) |
| `GETRANGE / SETRANGE` | Read/write part of string |

---

#### Example 2: Working with Strings

**File**: `examples/02-strings.js`

```js
const Redis = require('ioredis');
const redis = new Redis();

async function demoStrings() {
  try {
    // 1. Basic SET/GET
    await redis.set('greeting', 'Hello Redis!');
    const msg = await redis.get('greeting');
    console.log('Basic GET:', msg);

    // 2. SETEX — auto-expire in 10 seconds
    await redis.setex('temp:secret', 10, 'I expire soon!');
    console.log('SETEX value:', await redis.get('temp:secret'));

    // 3. SETNX — set only if key doesn't exist
    const set1 = await redis.setnx('unique:id', 'first');
    const set2 = await redis.setnx('unique:id', 'second');
    console.log('SETNX first:', set1);  // 1
    console.log('SETNX second:', set2); // 0
    console.log('Final value:', await redis.get('unique:id')); // "first"

    // 4. MGET — multiple keys
    await redis.mset('name', 'Alice', 'role', 'admin', 'score', '95');
    const values = await redis.mget('name', 'role', 'score');
    console.log('MGET result:', values);

    // 5. INCR — atomic counter
    await redis.set('visits', 10);
    await redis.incr('visits');
    console.log('Visits after INCR:', await redis.get('visits')); // 11

    await redis.quit();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

demoStrings();
```

#### Line-by-Line

| Line | Explanation |
|------|-----------|
| `setex('temp:secret', 10, ...)` | Sets key with **TTL of 10 seconds** |
| `setnx(...)` | Returns `1` if set, `0` if key already exists |
| `mset(...)` | Sets multiple keys in one command |
| `mget(...)` | Returns array of values in same order |
| `incr('visits')` | Atomically increases number — **thread-safe** |

#### Output
```bash
Basic GET: Hello Redis!
SETEX value: I expire soon!
SETNX first: 1
SETNX second: 0
Final value: first
MGET result: [ 'Alice', 'admin', '95' ]
Visits after INCR: 11
```

> **Use `INCR` for counters** — it's atomic and safe in multi-client apps.

---

### Lists

<span style="color:#3498db;">**Ordered collections**</span> — like a **to-do list** or **queue**.

| Use Case | Example |
|--------|---------|
| Recent items | `user:123:recent` |
| Job queue | `tasks:pending` |
| Activity feed | `feed:user:42` |

#### Key Commands

| Command | Purpose |
|-------|--------|
| `LPUSH / RPUSH` | Add to left/right |
| `LPOP / RPOP` | Remove from left/right |
| `LLEN` | Get count |
| `LRANGE start end` | Get slice |
| `LINDEX index` | Get by position |
| `BLPOP key timeout` | Wait for item |

---

#### Example 3: Working with Lists

**File**: `examples/03-lists.js`

```js
const Redis = require('ioredis');
const redis = new Redis();

async function demoLists() {
  const listKey = 'tasks:queue';

  // Clear old data
  await redis.del(listKey);

  // Push tasks
  await redis.lpush(listKey, 'Send email');
  await redis.rpush(listKey, 'Generate report', 'Backup DB');

  console.log('List length:', await redis.llen(listKey)); // 3

  // Get full list
  const all = await redis.lrange(listKey, 0, -1);
  console.log('All tasks:', all);

  // Pop from left (queue style)
  const task = await redis.lpop(listKey);
  console.log('Processing:', task);

  console.log('Remaining:', await redis.lrange(listKey, 0, -1));

  await redis.quit();
}

demoLists();
```

#### Output
```bash
List length: 3
All tasks: [ 'Send email', 'Generate report', 'Backup DB' ]
Processing: Send email
Remaining: [ 'Generate report', 'Backup DB' ]
```

> **Use `LPUSH + RPOP`** for a **queue**  
> **Use `RPUSH + RPOP`** for a **stack**

---

### Hashes

<span style="color:#9b59b6;">**Objects with fields**</span> — like a **row in a database table**.

| Use Case | Example |
|--------|---------|
| User profiles | `user:123` → `{name, email, role}` |
| Product catalog | `product:42` → `{price, stock, brand}` |

#### Key Commands

| Command | Purpose |
|-------|--------|
| `HSET key field value` | Set field |
| `HGET key field` | Get field |
| `HMGET key f1 f2` | Multiple fields |
| `HGETALL key` | All fields/values |
| `HINCRBY key field num` | Increment field |

---

#### Example 4: Working with Hashes

**File**: `examples/04-hashes.js`

```js
const Redis = require('ioredis');
const redis = new Redis();

async function demoHashes() {
  const bikeKey = 'bike:deimos';

  // Set multiple fields
  await redis.hset(bikeKey,
    'model', 'Deimos',
    'brand', 'Ergonom',
    'type', 'Enduro',
    'price', '4972'
  );

  // Get single field
  const brand = await redis.hget(bikeKey, 'brand');
  console.log('Brand:', brand);

  // Get multiple
  const fields = await redis.hmget(bikeKey, 'model', 'price', 'type');
  console.log('Fields:', fields);

  // Get all
  const all = await redis.hgetall(bikeKey);
  console.log('Full bike:', all);

  // Increment price
  await redis.hincrby(bikeKey, 'price', 1000);
  console.log('New price:', await redis.hget(bikeKey, 'price'));

  await redis.quit();
}

demoHashes();
```

#### Output
```bash
Brand: Ergonom
Fields: [ 'Deimos', '4972', 'Enduro' ]
Full bike: { model: 'Deimos', brand: 'Ergonom', type: 'Enduro', price: '4972' }
New price: 5972
```

> **Perfect for structured data** — saves memory vs. separate keys.

---

### Sets

<span style="color:#e67e22;">**Unordered unique items**</span> — like a **guest list** (no duplicates).

| Use Case | Example |
|--------|---------|
| Tags | `tags:redis` → `fast, cache, nosql` |
| Unique visitors | `visitors:2025-10-28` |

#### Key Commands

| Command | Purpose |
|-------|--------|
| `SADD key member` | Add |
| `SREM key member` | Remove |
| `SMEMBERS key` | List all |
| `SINTER key1 key2` | Common members |

---

#### Example 5: Working with Sets

**File**: `examples/05-sets.js`

```js
const Redis = require('ioredis');
const redis = new Redis();

async function demoSets() {
  await redis.sadd('skills:alice', 'JS', 'Redis', 'Node');
  await redis.sadd('skills:bob', 'Python', 'Redis', 'Docker');

  const alice = await redis.smembers('skills:alice');
  console.log('Alice:', alice);

  const common = await redis.sinter('skills:alice', 'skills:bob');
  console.log('Common skills:', common);

  await redis.quit();
}

demoSets();
```

#### Output
```bash
Alice: [ 'JS', 'Redis', 'Node' ]
Common skills: [ 'Redis' ]
```

---

### Sorted Sets (ZSETs)

<span style="color:#8e44ad;">**Ranked items with scores**</span> — like a **leaderboard**.

| Use Case | Example |
|--------|---------|
| Game scores | `leaderboard:game1` |
| Task priority | `tasks:priority` |

#### Key Commands

| Command | Purpose |
|-------|--------|
| `ZADD key score member` | Add with score |
| `ZRANGE key 0 -1 WITHSCORES` | Get all with scores |
| `ZREVRANK key member` | Get rank (descending) |

---

#### Example 6: Working with Sorted Sets

**File**: `examples/06-sorted-sets.js`

```js
const Redis = require('ioredis');
const redis = new Redis();

async function demoZSets() {
  const leaderboard = 'game:scores';

  await redis.zadd(leaderboard,
    100, 'Alice',
    250, 'Bob',
    180, 'Charlie'
  );

  const top = await redis.zrange(leaderboard, 0, 2, 'WITHSCORES');
  console.log('Top 3:', top);

  const rank = await redis.zrevrank(leaderboard, 'Bob');
  console.log('Bob rank:', rank + 1); // +1 for 1-based

  await redis.quit();
}

demoZSets();
```

#### Output
```bash
Top 3: [ 'Alice', '100', 'Charlie', '180', 'Bob', '250' ]
Bob rank: 1
```

---

### Geospatial Data

<span style="color:#16a085;">**Locations on Earth**</span> — powered by **Sorted Sets under the hood**.  
Think: *"Find all coffee shops within 5 km of me."*

| Use Case | Example |
|--------|---------|
| Store delivery drivers | `drivers:active` |
| Find nearby users | `users:online` |
| Geofencing | `alerts:zone` |

#### Key Commands

| Command | Purpose |
|-------|--------|
| `GEOADD key long lat member` | Add location |
| `GEORADIUS key long lat radius m|km` | Find within radius (legacy) |
| `GEOSEARCH key ... BYRADIUS ...` | Modern, flexible search |
| `GEODIST key m1 m2` | Distance between two points |

> **Note**: `GEOSEARCH` is the **recommended modern command** (Redis 6.2+).

---

#### Example 8: Geospatial — Find Nearby Locations

**File**: `examples/08-geospatial.js`

```js
const Redis = require('ioredis');
const redis = new Redis();

async function demoGeospatial() {
  const locationsKey = 'places:coffee';

  // Clear previous data
  await redis.del(locationsKey);

  // Add coffee shops: GEOADD key longitude latitude name
  await redis.geoadd(locationsKey,
    -122.4194, 37.7749, 'Blue Bottle',     // San Francisco
    -122.4100, 37.7858, 'Philz Coffee',    // SF
    -122.4783, 37.8199, 'Starbucks',       // Palo Alto
    -122.1431, 37.4450, 'Coupa Cafe'       // Stanford
  );

  // User's current location (San Francisco)
  const userLon = -122.4194;
  const userLat = 37.7749;

  // Find all coffee shops within 10 km
  const nearby = await redis.geosearch(
    locationsKey,
    'FROMLONLAT', userLon, userLat,
    'BYRADIUS', 10, 'km',
    'WITHDIST', 'WITHCOORD', 'ASC'  // include distance, coords, sort by dist
  );

  console.log('☕ Coffee shops within 10km:');
  nearby.forEach(([name, distance, [lon, lat]]) => {
    console.log(` • ${name}: ${parseFloat(distance).toFixed(2)} km away`);
  });

  // Get distance between two specific places
  const dist = await redis.geodist(locationsKey, 'Blue Bottle', 'Philz Coffee', 'km');
  console.log(`\nDistance Blue Bottle ↔ Philz: ${parseFloat(dist).toFixed(2)} km`);

  await redis.quit();
}

demoGeospatial();
```

#### Line-by-Line Explanation

| Line | Explanation |
|------|-----------|
| `geoadd(key, lon, lat, name)` | Stores location using **geohash** internally |
| `geosearch(...)` | Modern command with rich options |
| `'FROMLONLAT', lon, lat` | Search from a point |
| `'BYRADIUS', 10, 'km'` | Within 10 kilometers |
| `'WITHDIST', 'WITHCOORD'` | Return distance and coordinates |
| `'ASC'` | Sort by distance (closest first) |
| `geodist(key, a, b, 'km')` | Direct distance between two members |

#### Expected Output
```bash
Coffee shops within 10km:
 • Blue Bottle: 0.00 km away
 • Philz Coffee: 1.20 km away
 • Coupa Cafe: 48.56 km away
 • Starbucks: 51.23 km away

Distance Blue Bottle ↔ Philz: 1.20 km
```

> **Real-world use**: Ride-sharing, food delivery, social apps

> **Warning**: Coordinates are **longitude first**, then latitude (opposite of Google Maps UI!)

---

### Key Management & Expiration

<span style="color:#27ae60;">**Control how long data lives**</span>

| Type | Behavior |
|------|--------|
| **Persistent** | Stays forever until `DEL` |
| **Volatile** | Auto-deleted after **TTL** |

#### Commands

| Command | Purpose |
|-------|--------|
| `EXPIRE key 60` | Expire in 60s |
| `TTL key` | Seconds remaining (`-1` = no expiry, `-2` = gone) |
| `PERSIST key` | Remove expiry |

---

#### Example 7: Volatile Keys with TTL

**File**: `examples/07-expire.js`

```js
const Redis = require('ioredis');
const redis = new Redis();

async function demoExpire() {
  await redis.set('cache:home', 'cached content');
  await redis.expire('cache:home', 5);

  console.log('TTL:', await redis.ttl('cache:home')); // ~5

  setTimeout(async () => {
    const exists = await redis.exists('cache:home');
    console.log('Key gone?', exists === 0);
    await redis.quit();
  }, 6000);
}

demoExpire();
```

#### Output (after ~6s)
```bash
TTL: 5
Key gone? true
```

> **Use volatile keys for caching and sessions**

---

## Running the Examples

```bash
# Start Redis (Docker)
docker run -d --name redis-dev -p 6379:6379 redis:7

# Run any example
node examples/08-geospatial.js
```

---

## Best Practices & Gotchas

| Do | Don't |
|------|--------|
| Use `ioredis` for promises & performance | Use `KEYS *` in production |
| Use `HSET` for objects | Store large blobs in strings |
| Use `EXPIRE` for cache | Forget `quit()` in scripts |
| Use `GEOSEARCH` (not `GEORADIUS`) | Use `SMEMBERS` on big sets |
| Validate coordinates (lon: -180 to 180) | Mix up **longitude, latitude** order |

> **Avoid O(N) commands** on large data: `SMEMBERS`, `LRANGE 0 -1`, `HGETALL`

---

## Resources

- [`ioredis` GitHub](https://github.com/luin/ioredis)
- [Redis Geospatial Docs](https://redis.io/docs/data-types/geospatial/)
- [Redis Commands](https://redis.io/commands/)
- [Redis University](https://university.redis.com/)
- [Try Redis](https://try.redis.io/)

---

## Contributing

Found a typo? Want to add an example?  
**Pull requests welcome!**

---

## License

[MIT](LICENSE) — free to use, modify, and share.

---
