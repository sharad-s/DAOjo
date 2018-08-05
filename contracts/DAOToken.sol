pragma solidity ^0.4.23;
import 'openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

contract DAOToken is StandardToken {

  constructor(address initialAccount, uint256 initialBalance) public {
    balances[initialAccount] = initialBalance;
    totalSupply_ = initialBalance;
  }

}
