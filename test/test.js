const DAOToken = artifacts.require("DAOToken");
const Crowdsale = artifacts.require("Crowdsale");

contract("Crowdsale", ([owner, issuer, buyer]) => {
  let daoToken, _crowdsale;
  const TOTAL_TOKEN_SUPPLY = 1000000000000000000;

  beforeEach(async () => {
    _daoToken = await DAOToken.new(owner, TOTAL_TOKEN_SUPPLY);
    _crowdsale = await Crowdsale.new(1, issuer, _daoToken.address);

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
});
