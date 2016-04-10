var React = require('react');
var Rx = require('../rx/dist/rx.all.js');





var Frequency = React.createClass({
  getInitialState() {
    this.colors = [
      '#F44336',
      '#E91E63',
      '#9C27B0',
      '#673AB7',
      '#3F51B5',
      '#2196F3',
      '#03A9F4',
      '#00BCD4',
      '#4CAF50',
      '#CDDC39',
      '#FFEB3B',
    ];

    this.colors.reverse();

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
    var freqStyle = {
      color: '#fff'
    };

    if (this.state.frequency > 0) {
      freqStyle.color = this.colors[Math.ceil(this.colors.length / 255 * this.state.frequency) - 1];
    }

    return (
      <li><span className="title">{this.props.title}</span><br /><span className="freq" style={freqStyle}>{this.state.frequency}</span></li>
    );
  }
});





module.exports = Frequency;