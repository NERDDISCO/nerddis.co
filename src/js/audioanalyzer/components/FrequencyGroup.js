var React = require('react');
var Frequency = require('./Frequency.js');





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