// The object 'Contracts' will be injected here, which contains all data for all contracts, keyed on contract name:
// Contracts['HelloWorld'] = {
//  abi: [],
//  address: "0x..",
//  endpoint: "http://...."
// }
function QFun(Contract) {
    this.web3 = null;
    this.instance = null;
    this.Contract = Contract;
}

QFun.prototype.init = function() {
    // We create a new Web3 instance using either the Metamask provider
    // or an independent provider created towards the endpoint configured for the contract.
    this.web3 = new Web3(
        (window.web3 && window.web3.currentProvider) ||
        new Web3.providers.HttpProvider(this.Contract.endpoint));

    // Create the contract interface using the ABI provided in the configuration.
    var contract_interface = this.web3.eth.contract(this.Contract.abi);

    // Create the contract instance for the specific address provided in the configuration.
    this.instance = contract_interface.at(this.Contract.address);
};


// Get balance of Tokens found by address from contract
QFun.prototype.getBalance = function(address, cb) {
    this.instance.balances(address, function(error, result) {
        cb(error, result);
    })
}

// Function triggered by "Check Balance" button
QFun.prototype.showAddressBalance = function() {
    var that = this;

    // Get input values
    var Question = $("#Question").val();

    // Check the balance from the address passed and output value 
    
    $("#message").text(balance.toNumber());
        
}

// Send Tokens to another address
QFun.prototype.createTokens = function() {
    var that = this;

    // Get input values
    var address = $("#create-address").val();
    var amount = $("#create-amount").val();
    console.log(amount);


    // Validate address
    if(!isValidAddress(address)) {
        console.log("Invalid address");
        return;
    }

    // Validate amount
    if(!isValidAmount(amount)) {
        console.log("Invalid amount");
        return;
    }

    
        
}

// Waits for receipt from transaction
QFun.prototype.waitForReceipt = function(hash, cb) {
    var that = this;

    // Checks for transaction receipt
    this.web3.eth.getTransactionReceipt(hash, function(err, receipt) {
        if (err) {
            error(err);
        }
        if (receipt !== null) {
            // Transaction went through
            if (cb) {
                cb(receipt);
            }
        } else {
            // Try again in 2 second
            window.setTimeout(function() {
                that.waitForReceipt(hash, cb);
            }, 2000);
        }
    });
}

// Check if it has the basic requirements of an address
function isValidAddress(address) {
    return /^(0x)?[0-9a-f]{40}$/i.test(address);
}

// Basic validation of amount. Bigger than 0 and typeof number
function isValidAmount(amount) {
    return amount > 0 && typeof Number(amount) == 'number';    
}

QFun.prototype.bindButtons = function() {
    var that = this;

    $(document).on("click", "#button-create", function() {
        that.createTokens();
    });

    $(document).on("click", "#Submit", function() {
        var Question = $("#Question").val();
         $("#message").text(Question);
    }); 

    $(document).on("click", "#SubmitS", function() {
        var Answer = $("#Answer").val();
        var AnswerS = $("#AnswerS").val();
        if (Answer == AnswerS){
            var amount = $("#create-amount").val();
            $("#message2").text("Congragulations!, you won "+ amount + " Ether");
            // Transfer amount to other address
            this.instance.mint(address, amount, { from: window.web3.eth.accounts[0], gas: 100000, gasPrice: 100000, gasLimit: 100000 }, 
                function(error, txHash) {
                    if(error) {
                        console.log(error);
                    }
                    else {
                        that.waitForReceipt(txHash, function(receipt) {
                            if(receipt.status) {
                                $("#Student-address").val("");
                                $("#create-amount").val("");
                            }
                            else {
                                console.log("error");
                            }
                        });
                    }
                }
            )
        }
    }); 
}

QFun.prototype.onReady = function() {
    this.bindButtons();
    this.init();
};

if(typeof(Contracts) === "undefined") var Contracts={ QFun: { abi: [] }};
var QFun = new QFun(Contracts['QFun']);

$(document).ready(function() {
    QFun.onReady();
});
