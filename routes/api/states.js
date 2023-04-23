const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');

router.route('/')
    .get(statesController.getAllStates)
    .post(statesController.createFunFact);
    //.put(statesController.updateEmployee)
    //.delete(statesController.deleteEmployee);

router.route('/:code/capital')
    .get(statesController.getStateCapital);

router.route('/:code/nickname')
    .get(statesController.getNickname);

router.route('/:code/population')
    .get(statesController.getPopulation);

router.route('/:code/admission')
    .get(statesController.getAdmission);

router.route('/:code/funfact')
    .get(statesController.getFunFacts);

router.route('/:state')
    .get(statesController.getState);

module.exports = router;