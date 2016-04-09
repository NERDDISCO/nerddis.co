var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NERD DISCO' });
});

router.get('/audioanalyzer', function(req, res, next) {
  res.render('audioanalyzer', { title: 'NERD DISCO - Audio Analyzer' });
});


router.get('/keyboard', function(req, res, next) {
  res.render('keyboard', { title: 'NERD DISCO - Keyboard' });
});

router.get('/microphone', function(req, res, next) {
  res.render('microphone', { title: 'NERD DISCO - Microphone' });
});

router.get('/live', function(req, res, next) {
  res.render('live', { title: 'NERD DISCO - LIVE' });
});



module.exports = router;