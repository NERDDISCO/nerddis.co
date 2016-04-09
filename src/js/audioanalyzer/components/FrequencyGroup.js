var React = require('react');
var Frequency = require('./Frequency.js');



/*
     *  1. Sub Lows 20-100
     *  2. Lows 100-250
     *  3. Low Mids 250 - 500
     *  4. Mids 500 - 1k
     *  5. High Mids 1k - 5k
     *  6. Highs 5k-10k
     *  7. Super Highs 10k-20k and above
 */

var FrequencyGroup = React.createClass({

  render() {
    return (
      <ul>
        <Frequency type="sublow" title="< 100" />
        <Frequency type="low" title="100-250" />
        <Frequency type="lowmid" title="250-500" />
        <Frequency type="mid" title="500-1k" />
        <Frequency type="highmid" title="1k-5k" />
        <Frequency type="high" title="5k-10k" />
        <Frequency type="superhigh" title="> 10k" />
      </ul>
    );
  }

});





module.exports = FrequencyGroup;