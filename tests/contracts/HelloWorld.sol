pragma solidity  0.5.12;

import "./SubContract1.sol";
import "./nested/SubContract2.sol";


contract HelloWorld {
    uint private time;

    constructor() public {
        time = block.timestamp;
    }
}
