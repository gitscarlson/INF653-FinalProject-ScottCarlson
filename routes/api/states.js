const express = require('express');
const cors = require('cors');
const router = express.Router();
const statesController = require('../../controllers/statesController');

app.use(cors());

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

router.route('/:code/funfacts')
    .get(statesController.getFunFacts);

router.route('/:state')
    .get(statesController.getState);

module.exports = router;