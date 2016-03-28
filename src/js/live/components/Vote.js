var React = require('react');
var Rx = require('../rx/dist/rx.all.js');





var Vote = React.createClass({

  componentDidMount() {
    // Get the yes / no elements
    var button_yes = document.getElementById('voteYes');
    var button_no = document.getElementById('voteNo');
        
    // Create streams from the yes / no click events
    var yes$ = Rx.Observable.fromEvent(button_yes, 'click');
    var no$ = Rx.Observable.fromEvent(button_no, 'click');

    // Merge the yes / no events into one stream
    var click$ = Rx.Observable.merge(yes$, no$);

    // Create a custom voteEvent
    var voteEvent = new CustomEvent("voteEvent", { data: {} });

    // Handle the click event
    click$.subscribe(e => {
      // Save the vote result into the voteEvent
      voteEvent.data = e.target.getAttribute('data');

      // Trigger the voteEvent
      document.body.dispatchEvent(voteEvent);
    });

  },

  render() {
    return (
      <div>
        <button id="voteYes" data="yes" className="vote-button vote-button--yes">&nbsp;</button>
        <button id="voteNo" data="no" className="vote-button vote-button--no">&nbsp;</button>
      </div>
    );
  }
});





module.exports = Vote;