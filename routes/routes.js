const express = require('express');

const fs = require('fs');

const router = new express.Router();
const Pollings = require('./../pu.json');

const data = require('./../bincom_test.json');

const party = data.find(datum => datum.name === 'party');
const lga = data.find(lg => lg.name === 'lga');

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Ejs App App',
    name: 'tunde usman'
  });
});

router.get('/pu_results', (req, res) => {
  res.render('pu_results', {
    Pollings
  });
});

router.get('/summed_tpu_results', (req, res) => {
  const lgaResults = lga.data;
  res.render('summed_tpu_results', {
    lgaResults
  });
});

router.get('/store_result', (req, res) => {
  res.render('store_result', {
    party: party.data,
    msg: ''
  });
});

const read = () => {
  try {
    let readPu = fs.readFileSync('pu.json');
    return (pUnits = JSON.parse(readPu));
  } catch (e) {
    return (pUnits = []);
  }
};
const write = pUnits => fs.writeFileSync('pu.json', JSON.stringify(pUnits));

router.post('/store_result', (req, res) => {
  const {
    PDP,
    DPP,
    ACN,
    PPA,
    CDC,
    JP,
    ANPP,
    LABOUR,
    CPP,
    pu,
    entered_by_user,
    polling_unit_uniqueid
  } = req.body;
  if (!req.body) {
    res.render("index");
  } else {
    const partyNames = [
      { party_score: PDP, party_abbreviation: 'PDP' },
      { party_score: DPP, party_abbreviation: 'DPP' },
      { party_score: ACN, party_abbreviation: 'ACN' },
      { party_score: PPA, party_abbreviation: 'PPA' },
      { party_score: CDC, party_abbreviation: 'CDC' },
      { party_score: JP, party_abbreviation: 'JP' },
      { party_score: ANPP, party_abbreviation: 'ANPP' },
      { party_score: LABOUR, party_abbreviation: 'LABO' },
      { party_score: CPP, party_abbreviation: 'CPP' }
    ];
    read();
    const last = pUnits[pUnits.length - 1];
    partyNames.forEach((party, index) => {
      const num = parseInt(last.result_id);
      party.result_id = index + 1 + num;
      party.pu = pu;
      party.polling_unit_uniqueid = polling_unit_uniqueid;
      party.entered_by_user = entered_by_user;
    });
    let duplicatePU = pUnits.filter(
      pu => pu.polling_unit_uniqueid === polling_unit_uniqueid
    );
    const newPUnit = pUnits.concat(partyNames);
    const query = {
      party: party.data,
      msg: 'Stored'
    };
    duplicatePU.length === 0 && (newPUnit, write(newPUnit), newPUnit);
    res.render('index');
  }
});

module.exports = router;
