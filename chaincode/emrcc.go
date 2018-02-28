package main

import (
	"bytes"
	"fmt"
	"strings"
	"strconv"
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

// Main
//=====
func main(){
        if err := shim.Start(new(EMR)); err != nil {
                fmt.Printf("Error starting EMR chaincode: %s", err)
        }
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
	fmt.Println("invoke is running " + function)

	// New, Update
	if function == "initEMR"{
		return t.initEMR(stub, args) //create a new EMR
	} else if function == "updateHB" {
		return t.updateHB(stub, args) // Change heartBeat of owner
	{

	// Return the result as success payload
	fmt.Println("invoke did not find func: " + function) 
	return shim.Error("Received unknown function invocation")

}

// New
//====
func (t *Chaincode) initEMR(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	var err error

	// 	0	1	2	3	4
	// 	"001"	"John"	"Doe"	"87"	"70"
	if len(args) != 5 {
		return shim.Error("Incorret number of arguments. Expecting 5")
	}

	// === Input Sanitation ===
	fmt.Println("- start init EMR")
	if len(args[0]) <= 0 {
		return shim.Error("1st arguement must be a non-empty string")
	} else if len(args[0]) <= 0 {
		return shim.Error("2nd arguement must be a non-empty string")
	} else if len(args[0] <= 0 {
		return shim.Error("3rd arguement must be an non-empty string")
	} else if len(args[0] <= 0 {
		return shim.Error("4th arguement must be a non-empty string")
	} else if len(args[0] <= 0 {
		return shim.Error("5th arguement must be a non-empty string")
	}

	userId, err := strconv.Atoi(args[0])
	if err != nil {
		return shim.Error("1st arguement must be a numeric string")
	}
	firstName := strings.ToLower(args[1])
	lastName := strings.ToLower(args[2])
	heartBeat, err := strconv.Atoi(args[3])
	if err != nil {
		return shim.Error("4th arguement must be a numeric string")
	}
	temp, err := strconv.Atoi(args[4])
	if err != nil {
		return shim.Error("4th arguement must be a numeric string")
	}

	// == Check if EMR already exists ===
	emrAsBytes, err := stub.GetState(userId)
	if err != nil {
		return shim.Error("Failed to get EMR: " + err.Error())
	} else if emrAsBytes != nil {
		fmt.Println("This EMR already exists: " + userId)
		return shim.Error("This EMR already exists: " + userId)
	}

	// == Create EMR object and marchal to JSON ==
	objectType := "EMR"
	emr := &emr{objectType, userId, firstName, lastName, heartBeat, temp}
	emrJSONasBytes, err := json.Marshal(emr)
	if err != nil {
		return shim.Error(err.Error())
	}
	
	// == Save EMR to state ==
	err = stub.PutState(userId, emrJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	// == EMR saved. Return success ==
	fmt.Println("- end init EMR")
	return shim.Success(nil)
}


// Update
//=======
func (t *Chaincode) updateHB(stub shim.ChaincodeStubInterface, args []string) peer.Response {
}

