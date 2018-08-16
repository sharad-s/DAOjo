const DAOToken = artifacts.require("DAOToken");
const Crowdsale = artifacts.require("Crowdsale");
const HouseNFTRegistry = artifacts.require("HouseNFTRegistry");
const SPVHoldingCrowdsale = artifacts.require("SPVHoldingContract");

contract("Crowdsale", ([owner, issuer, buyer]) => {
  let daoToken, _crowdsale;
  const TOTAL_TOKEN_SUPPLY = 100000 * 1000000000000000000; //100k tokens * 1E18 wei

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
      assert.equal(buyerBalance, 1 * 1000000000000000000, "After buy");
      // assert.equal(buyerICOtoken.valueOf(), 50, "After buy");
    });
  });
});

contract(
  "NFTTokenMetaDataEnumerableMock",
  ([deployer, houseOwner, spv, buyer1, buyer2, buyer3]) => {
    const TOTAL_TOKEN_SUPPLY = 3000; //100k tokens * 1E18 wei

    beforeEach(async () => {
      // Initiate SPV DAO Ownership Token (Crowdsale)
      _daoToken = await DAOToken.new(deployer, TOTAL_TOKEN_SUPPLY);

      // Initiate SPV Holding Contract / Crowdsale
      _spvHoldingCrowdsale = await SPVHoldingCrowdsale.new(
        1,
        houseOwner,
        _daoToken.address
      );

      // Transfer DAO ownerhip tokens equally to DAO members
      await _daoToken.transfer(buyer1, TOTAL_TOKEN_SUPPLY / 3, {
        from: deployer
      });
      // Transfer DAO ownerhip tokens equally to DAO members
      await _daoToken.transfer(buyer2, TOTAL_TOKEN_SUPPLY / 3, {
        from: deployer
      });
      // Transfer DAO ownerhip tokens equally to DAO members
      await _daoToken.transfer(buyer3, TOTAL_TOKEN_SUPPLY / 3, {
        from: deployer
      });

      // Create NFT Registry of House NFTs
      _HouseNFTRegistry = await HouseNFTRegistry.new("HOUSE TOKEN", "HOUSE");
    });

    context("NFT Registry", async () => {
      it(`Should have a total of 0 tokens when created`, async () => {
        const tokens = await _HouseNFTRegistry.getAllTokens();
        assert.lengthOf(tokens, 0, "array is empty");
      });

      it(`Should approve and transfer token to SPV contract`, async () => {
        // mint 1 house
        const house_1 = await _HouseNFTRegistry.mint(houseOwner, 1, "URI");
        const approval = await _HouseNFTRegistry.approve(
          _spvHoldingCrowdsale.address,
          1,
          {
            from: houseOwner
          }
        );
        const nft_approval = await _HouseNFTRegistry.getApproved(1);

        console.log("NFT APPROVED FOR: ", nft_approval);
        console.log("HOUSE OWNER: ", houseOwner);
        console.log("SPV: ", _spvHoldingCrowdsale.address);

        // Query Buyer balance
        const tokenBalance = await _daoToken.balanceOf(buyer1);
        console.log("DAO TOKEN BALANCE OF BUYER 1: ", tokenBalance);

        const transferFrom = await _HouseNFTRegistry.transferFrom(
          houseOwner,
          _spvHoldingCrowdsale.address,
          1,
          { from: houseOwner }
        );

        const nft_owner = await _HouseNFTRegistry.ownerOf(1);
        assert.equal(nft_owner, _spvHoldingCrowdsale.address, "NOT EQUAL");
      });
    });
  }
);
