var React = require('react');
var Rx = require('../rx/dist/rx.all.js');
var Vote = require('./Vote.js');
var VoteResult = require('./VoteResult.js');
var LocalStorageMixin = require('react-localstorage');


/*
 * A show / performance
 */
var Show = React.createClass({
  // mixins: [LocalStorageMixin],

  // getDefaultProps() {
  //   return {
  //     stateFilterKeys: ['voted']
  //   };
  // },


  getInitialState() {
    return {
      title : this.props.title,
      artist : this.props.artist,
      voted : false,
      vote_result : '',
      votes : {
        yes : 0,
        no : 0
      }
    };
  },



  componentDidMount() {
    // Create streams for custom events
    var mrturtleData$ = Rx.Observable.fromEvent(document.body, 'mrturtleData');
    var vote$ = Rx.Observable.fromEvent(document.body, 'voteEvent');


    // Subscribe to the mrturtleData stream
    mrturtleData$.subscribe(e => {
      // Change the state
      this.setState(e.data);
    });


    // Subscribe to the voteEvent stream
    vote$.subscribe(e => {
      // Change the state
      this.setState({
        voted : true,
        vote_result: e.data
      });
    });

  },



  render() {
    return (
      <div>
        <h2>Do you enjoy <span className="show-artist">{this.state.artist}</span> @ <span className="show-title">{this.state.title}</span>?</h2>
        { 
          !this.state.voted
          ? <Vote />
          : <VoteResult yes={this.state.votes.yes} no={this.state.votes.no} />
        }
      </div>
    );
  }
});


module.exports = Show;