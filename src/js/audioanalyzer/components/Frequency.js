var React = require('react');
var Rx = require('../rx/dist/rx.all.js');





var Frequency = React.createClass({
  getInitialState() {
    return {
      frequency : 0,
    };
  },



  componentDidMount() {
    var audio$ = Rx.Observable.fromEvent(document.body, 'ndAudioEvent');

    // Subscribe to the ndAudioEvent stream
    audio$.subscribe(e => {

      // Change the state
      this.setState({
        frequency: e.data[this.props.type].value
      });

    });

  },



  render() {
    return (
      <li><span className="title">{this.props.title}</span><br /><span className="freq">{this.state.frequency}</span></li>
    );
  }
});





module.exports = Frequency;