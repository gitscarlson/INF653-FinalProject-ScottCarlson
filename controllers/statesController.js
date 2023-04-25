const { stringify } = require('uuid');
const State = require('../model/State');
//mongodb+srv://scott73carlson:EmmntYY4@cluster0.wteysmi.mongodb.net/StatesDB?retryWrites=true&w=majority

const data = {
    states: require('../model/statesData.json'),
    setStates: function (data) { this.states = data }
}

const getAllStates = async (req, res) => {
    
    const parseURL = req.query.contig;
    if (parseURL == "true") {
        let contigFilter = data.states.filter(state => state.state !== 'Alaska' && state.state !== 'Hawaii');
        return res.json(contigFilter);
    } else if (parseURL == "false") {
        let contigFilter = data.states.filter(state => state.state == 'Alaska' || state.state == 'Hawaii');
        return res.json(contigFilter);
    } else {
        //mongoDB lookup for funfacts
        return res.json(data.states);
    }
    
    //need to add check for funfacts from monogoDB
}

const getStateCapital = (req, res) => {
    let code = req.params.code;
    code = code.toUpperCase();
    for(x = 0; x < data.states.length; x++) {
        let array = Object.entries(data.states).map(([key,value])=>value);
        if(code == array[x].code){
            return res.json({"state":array[x].state,"capital":array[x].capital_city});
        }
    } 
    return res.json({"message":"Invalid state abbreviation parameter"});
}

const getState = async (req, res) => {
    //funfact lookup
    let code = req.params.state;
    code = code.toUpperCase();
    for(x = 0; x < data.states.length; x++) {
        let array = Object.entries(data.states).map(([key,value])=>value);
        if(code == array[x].code){
            var facts = await State.findOne({ stateCode: code }).exec();

            var result = data.states.filter(obj=> obj.code == code);
            if(facts != null) {
                const resultObject = { funfacts: facts.funfacts };
                var updatedReturn = {...result[0], ...resultObject };
                
                return res.json(updatedReturn);
            }  
            
            return res.json(result[0]);
        }
    } 
    return res.json({"message":"Invalid state abbreviation parameter"});
}

const getNickname = (req, res) => {
    let code = req.params.code;
    code = code.toUpperCase();
    for(x = 0; x < data.states.length; x++) {
        let array = Object.entries(data.states).map(([key,value])=>value);
        if(code == array[x].code){
            return res.json({"state":array[x].state,"nickname":array[x].nickname});
        }
    } 
    return res.json({"message":"Invalid state abbreviation parameter"});
}

const getPopulation = (req, res) => {
    let code = req.params.code;
    code = code.toUpperCase();
    for(x = 0; x < data.states.length; x++) {
        let array = Object.entries(data.states).map(([key,value])=>value);
        if(code == array[x].code){
            return res.json({"state":array[x].state,"population":array[x].population.toLocaleString()});
        }
    } 
    return res.json({"message":"Invalid state abbreviation parameter"});
}

const getAdmission = (req, res) => {
    let code = req.params.code;
    code = code.toUpperCase();
    for(x = 0; x < data.states.length; x++) {
        let array = Object.entries(data.states).map(([key,value])=>value);
        if(code == array[x].code){
            return res.json({"state":array[x].state,"admitted":array[x].admission_date.toLocaleString()});
        }
    } 
    return res.json({"message":"Invalid state abbreviation parameter"});
}

const getFunFacts = async (req, res) => {
    let code = req.params.code;
    code = code.toUpperCase();
    for(x = 0; x < data.states.length; x++) {
        let array = Object.entries(data.states).map(([key,value])=>value);
        if(code == array[x].code){
            var facts = await State.findOne({ stateCode: code }).exec();
            var result = data.states.filter(obj=> obj.code == code);
            var updatedState = result[0].state;
            if(facts != null) {
                var resultObject = { funfacts: facts.funfacts };
                var resultIndex = Math.floor(Math.random() * resultObject.funfacts.length);
                var funfact = resultObject.funfacts[resultIndex];
                var updatedReturn = { funfact };
                
                return res.json(updatedReturn);
            }  
            var message = ("No Fun Facts found for " + updatedState);
            return res.json({"message": message});
        }
    } 
    return res.json({"message":"Invalid state abbreviation parameter"});
}


const createFunFact = async (req, res) => {
    //Need to do a check if stateCode is a valid stateCode before submitting - this check is against the .json file
    for(x = 0; x < data.states.length; x++) {
        let code = req.params.code;
        code = code.toUpperCase();
        let array = Object.entries(data.states).map(([key,value])=>value);
        if(code == array[x].code){
            var facts = await State.findOne({ stateCode: code }).exec();
            console.log(facts);
            if (!req?.body?.funfacts) {
                return res.status(400).json({ 'message': 'State fun facts value required'});
            }
            var arrayCheck = req.body.funfacts;
            if (!Array.isArray(arrayCheck)){
                return res.status(400).json({ 'message': 'State fun facts value must be an array'});
            }
            
            try {
                if(!facts) {
                const result = await State.create({
                    stateCode: code,
                    funfacts: req.body.funfacts
                });
                return res.status(201).json(result);
            } else {
                const result = await State.findOneAndUpdate(
                    { stateCode: code },
                    { $push: { funfacts: req.body.funfacts } },
                    { upsert: true, new: true }
                  );
                return res.status(201).json(result);
            }
                
            } catch (err) {
                console.error(err);
            }
        }
    } 
    return res.json({"message":"Invalid state abbreviation parameter"});
}

const deleteFunFact = async (req, res) => {
    let code = req.params.code;
    code = code.toUpperCase();
    for(x = 0; x < data.states.length; x++) {
        let array = Object.entries(data.states).map(([key,value])=>value);
        if(code == array[x].code){
            var index = req.body.index;
            if(!index){
                return res.status(400).json({ "message": "State fun fact index value required"});
            }
            var facts = await State.findOne({ stateCode: code }).exec();
            var result = data.states.filter(obj=> obj.code == code);
            var updatedState = result[0].state;
            if(facts != null) {
                var resultObject = { funfacts: facts.funfacts };
                if(index > resultObject.length){
                    var message = ("No Fun Fact found at that index for " + updatedState);
                    return res.json({"message": message});
                }
                const deleteResult = await State.findOneAndUpdate(
                    { stateCode: code },
                    { $unset: { [`funfacts.${index-1}`]: 1 } },
                    { new: true }
                  );
                  await State.findOneAndUpdate(
                    { stateCode: code },
                    { $pull: { funfacts: null } },
                    { new: true }
                  );
                  console.log(deleteResult);
                //need to use the index variable to delete the funfact also need to check if index is valid
                //const factDelete  = await State.deleteOne( State.funfacts[index-1] ).exec();
                //console.log(factDelete);
                return res.json(deleteResult);
            }  
            var message = ("No Fun Facts found for " + updatedState);
            return res.json({"message": message});
        }
    } 
    return res.json({"message":"Invalid state abbreviation parameter"});
}

const deleteEmployee = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Employee ID required'});

    const employee  = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id} `});
    }
    
    const result = await employee.deleteOne({ _id: req.body.id });
    res.json(result);
}

module.exports = { 
    getAllStates,
    getStateCapital,
    getState,
    getNickname,
    getPopulation,
    getAdmission,
    createFunFact,
    getFunFacts,
    deleteFunFact
}