const SafeMath = artifacts.require(
  "openzeppelin-solidity/contracts//math/SafeMath.sol"
);

const SafeERC20 = artifacts.require(
  "openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol"
);

const ERC20 = artifacts.require(
  "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol"
);

const Crowdsale = artifacts.require("Crowdsale");
const DAOToken = artifacts.require("DAOToken");

module.exports = function(deployer) {
  // deployer.deploy(KyberCall);
  deployer.deploy(SafeMath);
  deployer.deploy(SafeERC20);
  deployer.link(SafeMath, Crowdsale);
  deployer.link(SafeMath, DAOToken);
  deployer.deploy(
    DAOToken,
    "0x6e6f8121b20c42694c917cf403d5b26504eafe40",
    100000
  );
};
