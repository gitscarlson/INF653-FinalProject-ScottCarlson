const State = require('../model/State');
const allowedOrigins = require('../config/allowedOrigins');
//glitch testing URL  https://glitch.com/edit/#!/import/github/gitscarlson/INF653-FinalProject-ScottCarlson
//mongodb+srv://scott73carlson:EmmntYY4@cluster0.wteysmi.mongodb.net/StatesDB?retryWrites=true&w=majority

const data = {
    states: require('../model/statesData.json'),
    setStates: function (data) { this.states = data }
}

const getAllStates = (req, res) => {
    const parseURL = req.query.contig;
    if (parseURL == "true") {
        let contigFilter = data.states.filter(state => state.state !== 'Alaska' && state.state !== 'Hawaii');
        return res.json(contigFilter);
    } else if (parseURL == "false") {
        let contigFilter = data.states.filter(state => state.state == 'Alaska' || state.state == 'Hawaii');
        return res.json(contigFilter);
    } else {
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

const getState = (req, res) => {
    let code = req.params.state;
    code = code.toUpperCase();
    for(x = 0; x < data.states.length; x++) {
        let array = Object.entries(data.states).map(([key,value])=>value);
        if(code == array[x].code){
            var result=data.states.filter(obj=> obj.code == code);
            return res.json(result);
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

const getFunFacts = (req, res) => {
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


const createFunFact = async (req, res) => {
    //Need to do a check if stateCode is a valid stateCode before submitting - this check is against the .json file
    for(x = 0; x < data.states.length; x++) {
        let code = req.body.stateCode;
        code = code.toUpperCase();
        let array = Object.entries(data.states).map(([key,value])=>value);
        if(code == array[x].code){
            if (!req?.body?.stateCode || !req?.body?.funfacts) {
                console.log(req.body.stateCode);
                return res.status(400).json({ 'message': 'First and Lastnames are required'});
            }
        
            try {
                const result = await State.create({
                    stateCode: req.body.stateCode,
                    funfacts: req.body.funfacts
                });
        
                return res.status(201).json(result);
            } catch (err) {
                console.error(err);
            }
        }
    } 
    return res.json({"message":"Invalid state abbreviation parameter"});
}

const updateEmployee = async (req, res) => {
    if(!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID paramater is required'});
    }

    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id} `});
    }
    if (req.body?.firstname) employee.firstname = req.body.firstname;
    if (req.body?.lastname) employee.lastname = req.body.lastname;
    const result = await employee.save();
    res.json(result);
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
    deleteEmployee
}