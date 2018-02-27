package main

import (
	"bytes"
	"fmt"
	"strings"
	"encoding/json"	
	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

type Chaincode struct {
}

type emr struct {
	UserID		string `json:"userId"`
	FirstName	string `json:"firstName"`
	LastName	string `json:"lastName"`
	heartBeat	string `json:"heartBeat"`
	temp		string `json:"temp"`
}


// Invoke - Initializes chaincode
//===============================
func (t *EMR) Init (stub shim.ChaincodeStubInterface) peer.Response {
	return shim.Success(nil)
}

// Invoke - Our entry point for Invocations
//=========================================
func (t *Chaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	function, args := stub.GetFunctionAndParameters()

	// New, Update
	if function == "initEMR"{
		return t.initEMR(stub, args)
	} else if function == "updateEMR" {
		//assume update even if function is nil
		return = t.updateEMR(stub, args)
	{

	// Return the result as success payload
	return shim.Error("Received unknown function invocation")

}

// Main
//=====
func main(){
	if err := shim.Start(new(EMR)); err != nil {
		fmt.Printf("Error starting EMR chaincode: %s", err)
	}
}

// New
//====
func (t *Chaincode) initEMR(stub shim.ChaincodeStubInterface, args []string) peer.Response {
}


// Update
//=======
func (t *Chaincode) updateEMR(stub shim.ChaincodeStubInterface, args []string) peer.Response {
}

