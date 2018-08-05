const DAOToken = artifacts.require("DAOToken");
const Crowdsale = artifacts.require("Crowdsale");

contract("Crowdsale", ([owner, issuer, buyer]) => {
  let daoToken, _crowdsale;
  const TOTAL_TOKEN_SUPPLY = 100000 * 1000000000000000000; //100k tokens * 1E18 wei

  beforeEach(async () => {
    _daoToken = await DAOToken.new(owner, TOTAL_TOKEN_SUPPLY);
    _crowdsale = await Crowdsale.new(1000, issuer, _daoToken.address);

    // Transfer DAO tokens to crowdsale
    await _daoToken.transfer(_crowdsale.address, TOTAL_TOKEN_SUPPLY, {
      from: owner
    });
  });

  context("DAOToken", async () => {
    it(`should have a total supply of: ${TOTAL_TOKEN_SUPPLY}`, async () => {
      const supply = await _daoToken.totalSupply();
      console.log(supply.toNumber());
      assert.equal(supply, TOTAL_TOKEN_SUPPLY, "Token Supply: " + supply);
    });

    it(`should have transferred ${TOTAL_TOKEN_SUPPLY} to Crowdsale`, async () => {
      const balance = await _daoToken.balanceOf(_crowdsale.address);
      assert.equal(
        balance,
        TOTAL_TOKEN_SUPPLY,
        "CROWDSALE TOKEN BALANCE: ",
        balance
      );
    });
  });

  context("Crowdsale", async () => {
    it("should accept ETH payments", async () => {
      // Buy DAOTokens from Crowdsale contract with ETH
      const tx = await _crowdsale.buyTokens(buyer, {
        from: buyer,
        value: web3.toWei("1.0", "ether")
      });

      // Log Buyer balance of MANA and ICOtoken after buy
      const buyerBalance = await _daoToken.balanceOf(buyer);
      const weiRaised = await _crowdsale.weiRaised();

      // Test: Check variable tokens on contract
      console.log("Wei Raised: ", weiRaised.toNumber());
      console.log("Buyer Balance: ", buyerBalance.toNumber());

      // Rate is set to 1000 so assert that buyer gets 1000 Tokens (1000 * 1E18 deceimals)
      assert.equal(buyerBalance, 1000 * 1000000000000000000, "After buy");
      // assert.equal(buyerICOtoken.valueOf(), 50, "After buy");
    });
  });
});
