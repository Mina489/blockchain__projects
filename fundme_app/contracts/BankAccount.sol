pragma solidity >=0.7.22 <= 0.8.22;
contract BankAccount{
    event Deposit(address indexed user,uint indexed accountid,uint value,uint timestamp);
    event Withdrawrequested(address indexed user,uint indexed accountid,uint indexed withdrawid,uint amount,uint timestamp);
    event Withdraw(uint indexed withdrawid,uint timestamp);
    event Accountcreated(address[] owners,uint indexed id,uint timestamp);
    struct withdrawrequest{
        address user;
        uint amount;
        uint approvals;
        mapping (address=>bool) ownerApproved;
        bool approved;
    }
    struct Account {
        address[] owners;
        uint balance;
        mapping(uint => withdrawrequest) withdrawrequests;  
    }
    mapping(uint =>Account) accounts;
    mapping(address => uint[]) useraccounts;
    uint nextaccountid;
    uint nextwithdrawid;
    modifier accountowner(uint accountid){
        bool isowner;
        for(uint idx;idx< accounts[accountid].owners.length;idx++){
            if (accounts[accountid].owners[idx]==msg.sender){
                isowner=true;
                break;
            }
        }
        require(isowner,"you are not an owner of this account");
        _;
    }
    modifier validowners(address[] calldata owners){ 
        require(owners.length + 1<=4,"maximum of 4 accounts per owner");
        for (uint i;i<owners.length;i++){
            if(owners[i] == msg.sender){
                    revert("no duplicate owners");
                }
            for (uint j=i+1;i<owners.length;j++){
                if(owners[i] == owners[j]){
                    revert("no duplicate owners");
                }
            }
        }
        _;    
    }
    modifier sufficeint_balance(uint accountid,uint amount){
        require(accounts[accountid].balance>=amount,"insufficient balance");
        _;
    }
    modifier can_approve(uint accountid,uint withdrawid){
        require(!accounts[accountid].withdrawrequests[withdrawid].approved,"this request is already approved");
        require(accounts[accountid].withdrawrequests[withdrawid].user!=msg.sender,"you cannot approve this request");
        require(accounts[accountid].withdrawrequests[withdrawid].user!=address(0),"this request doesnt exist");
        require(!accounts[accountid].withdrawrequests[withdrawid].ownerApproved[msg.sender],"you have already approved this request");
        _;
    }
    modifier canwithdraw(uint accountid,uint withdrawid){
        require(accounts[accountid].withdrawrequests[withdrawid].user==msg.sender,"you didn't create this request");
        require(accounts[accountid].withdrawrequests[withdrawid].approved,"this request is not approved");
        _;
    }
    function deposit(uint accountid) external payable accountowner(accountid){
        accounts[accountid].balance +=msg.value;
    }
    function createAccount(address[] calldata otherOwners) external validowners(otherOwners){
        address[] memory owners=new address[](otherOwners.length+1);
        owners[otherOwners.length]=msg.sender;
        uint id=nextaccountid;
        for (uint idx;idx<owners.length;idx++){
            if(idx <owners.length-1){
                owners[idx] = otherOwners[idx];
            }
            if (useraccounts[owners[idx]].length>2){
                revert("each user can have a mx of three");
            }
            useraccounts[owners[idx]].push(id);
        }
        accounts[id].owners;
        nextaccountid++;
        emit Accountcreated(owners,id,block.timestamp);
    }
    function requestwithdrawl(uint accountid,uint amount) external accountowner(accountid) sufficeint_balance(accountid, amount){
        uint id=nextwithdrawid;
        withdrawrequest storage request=accounts[accountid].withdrawrequests[id];
        request.user=msg.sender;
        request.amount=amount;
        nextwithdrawid++;
        emit Withdrawrequested(msg.sender, accountid, id, amount, block.timestamp);
    }
    function approvewithdrawal(uint accountid,uint withdrawid) external accountowner(accountid) can_approve(accountid, withdrawid){
        withdrawrequest storage request = accounts[accountid].withdrawrequests[withdrawid];
        request.approvals++;
        request.ownerApproved[msg.sender]=true;
        if (request.approvals==accounts[accountid].owners.length-1){
            request.approved=true;
        }
    }
    function withdraw(uint accountid,uint withdrawid) external accountowner(accountid) canwithdraw(accountid, withdrawid){
        uint amount = accounts[accountid].withdrawrequests[withdrawid].amount;
        require(accounts[accountid].balance>=amount,"inssuficeint balance");

        accounts[accountid].balance-=amount;
        delete accounts[accountid].withdrawrequests[withdrawid];
        (bool sent,)=payable(msg.sender).call{value:amount}("");
        require(sent);
        emit Withdraw(withdrawid,block.timestamp);
    }
    function getBalance(uint256 accountid) public view returns(uint256){
        uint my_balance=accounts[accountid].balance;
        return my_balance;
    }
    function getowners(uint256 accountid) public view returns(address[] memory){
        return accounts[accountid].owners;
    }
    function getApprovals(uint256 accountid,uint256 withdrawid) public view returns(uint256){
        uint256 number_of_approvals=accounts[accountid].withdrawrequests[withdrawid].approvals;
        return number_of_approvals;
    }
    function getaccounts() public view returns(uint[] memory){
        return useraccounts[msg.sender];
    }
} 