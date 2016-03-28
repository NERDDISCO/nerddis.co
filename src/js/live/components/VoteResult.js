var React = require('react');
var Rx = require('../rx/dist/rx.all.js');
var PieChart = require('react-chartjs').Pie;





/**
 * The result of a Vote.
 */
var VoteResult = React.createClass({

  render() {

    // Don't render 0
    if (this.props.yes == 0 && this.props.no == 0) {
      return null;
    }

    // Data for the chart
    var data = [
      {
        value: this.props.no,
        color:"#855C52",
        highlight: "#855C52",
        label: "No"
      },
      {
        value: this.props.yes,
        color: "#D7598B",
        highlight: "#D7598B",
        label: "Yes"
      }
    ];

    // Options for the chart
    var options = {
      animateScale: false,
      tooltipTemplate: "<%= label %>: <%= value %>",
      tooltipEvents: [],
      showTooltips: true,

      // Show tooltip after animation is completed
      onAnimationComplete: function() {
        this.showTooltip(this.segments, true);
      }
    };


    return (
      <div>
        <div className="vote-legend vote-legend--yes" data-yes={this.props.yes}></div>
        <div className="vote-legend vote-legend--no" data-no={this.props.no}></div>
        <div className="voteresult--container">
          <PieChart data={data} options={options} className="voteresult--chart" />
        </div>
      </div>
    );
  }

});




module.exports = VoteResult;