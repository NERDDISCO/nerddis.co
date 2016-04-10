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
        <Frequency type="sublow" title="< 100" color="#F44336" />
        <Frequency type="low" title="100-250" color="#E91E63" />
        <Frequency type="lowmid" title="250-500" color="#9C27B0" />
        <Frequency type="mid" title="500-1k" color="#673AB7" />
        <Frequency type="highmid" title="1k-5k" color="#3F51B5" />
        <Frequency type="high" title="5k-10k" color="#2196F3" />
        <Frequency type="superhigh" title="> 10k" color="#03A9F4" />
      </ul>
    );
  }

});





module.exports = FrequencyGroup;