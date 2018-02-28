package main

import (
	"fmt"
	
	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

type EMR struct {
}

func (t *EMR) Init (stub shim.ChaincodeStubInterface) peer.Response {
	
	return shim.Success(nil)
}

func (t *EMR) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
}

func main(){
	if err := shim.Start(new(EMR)); err != nil {
		fmt.Printf("Error starting EMR chaincode: %s", err)
	}
}

