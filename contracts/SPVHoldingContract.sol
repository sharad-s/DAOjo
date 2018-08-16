import './Crowdsale.sol';
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


contract SPVHoldingContract is Crowdsale {

  constructor(uint256 _rate, address _wallet, ERC20 _token) Crowdsale(_rate, _wallet, _token) {
  }

}
