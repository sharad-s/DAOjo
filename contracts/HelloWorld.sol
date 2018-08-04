pragma solidity ^0.4.23;

contract HelloWorld {
  string public message;

  constructor(string _message) {
    message = _message;
  }

  //Only Owner can call this function
  function setMessage(string _message) {
    message = _message;
  }
}
