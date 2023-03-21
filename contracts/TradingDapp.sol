// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract TradingDapp{
    enum Status{started,submitted,finished}
    IERC20 public token;
    
    constructor(address _token){
        token=IERC20(_token);
    }

    struct Trade{
        uint32 tradeID;
        address from;
        address to;
        uint32 amount;
        uint tradedate;
        Status status;
    }
    Trade[] public tradeArr;

    mapping(uint32=>Trade) public trades;
    uint16 public numTrades;
    // To store balance of tokens each address holds
    mapping(address=>uint) public balances;
   

    function startTrade(address to, uint32 amount) external returns(bool){
        require(amount>0,"enter valid amount");
        require(to!=address(0));
       // numTrades++;
        trades[numTrades]=Trade(numTrades,msg.sender,to,amount,block.timestamp,Status.started);
        tradeArr.push(trades[numTrades]);
        numTrades++;
        return true;
    }

    function submitTrade(uint32 id) external returns(bool) {
        require(id>=0 && id < tradeArr.length,"enter valid tradeID");
        Trade memory trade=trades[id];
        require(msg.sender==trade.to,"you cant submit trade");
        require(trade.status==Status.started);
        trade.tradedate=block.timestamp;
        bool success=token.transferFrom(msg.sender,address(this),trade.amount);
        balances[msg.sender]+=trade.amount;
        require(success,"transaction failed ");
        trade.status=Status.submitted;
        trades[id]=trade;
        tradeArr[id]= trades[id];
        return success;

    }

    function finishTrade(uint32 id) external returns(bool){
        require(id>=0 && id < tradeArr.length,"enter valid tradeID");
        Trade storage trade=trades[id];
        require(trade.status==Status.submitted,"not yet submitted");
         balances[msg.sender]-=trade.amount;
         balances[trade.from]+=trade.amount;
         trade.status=Status.finished;
         tradeArr[id]= trades[id];
         return true;
    }
    function withdrawTokens(uint32 amount) external returns(bool){
        require(balances[msg.sender]>=amount,"Insuffecient Balances");
        balances[msg.sender]-=amount;
        bool success=token.transfer(msg.sender,amount);
        require(success);
        return success;
    }

    // To show data in frontend
    function getTrades() public view returns(Trade[] memory){
        return tradeArr;
    }
}