'use strict';

class ndMidi {
  
  constructor(args) {

    // System Exclusive Support?
    this.sysex = args.sysex || false;

    // @see MIDIAccess
    this.access = args.access || null;

    // @see MIDIInputMap
    this.inputMap = args.inputMap || null;

    // @see MIDIOutputMap
    this.outputMap = args.outputMap || null;

    // Show debugging logs?
    this.debug = args.debug || false;

    // Input mapping mode activated?
    this.mappingMode = args.mappingMode || false;

    // The active input elements
    this.inputElements = args.inputElements || [];

    // Mapping of input elements
    this.inputMapping = args.inputMapping || null;
    
  } // / constructor





  /**
   * Get permission to use MIDI devices.
   */
  connect() {

    // Get permission to use connected MIDI devices
    navigator
      .requestMIDIAccess({ sysex: this.sysex })
      .then(
        // Success
        this.connectSuccess.bind(this),
        // Failure
        this.connectFailure.bind(this)
      );

  } // / ndMidi.connect



  /**
   * Got permission to use MIDI devices. 
   * 
   * @param MIDIAccess access
   */
  connectSuccess(access) {

    // Save a reference to MIDIAccess
    this.access = access;

    // Get the inputs for connected MIDI devices
    this.inputMap = this.access.inputs;

    // Get the outputs for connected MIDI devices
    this.outputMap = this.access.outputs;



    // Iterate over all input ports
    for (let input of this.inputMap.values()) {
      // Listen to MIDIMessageEvent for this input port
      input.onmidimessage = this.inputMessage.bind(this);
    }

    // Input mapping exists
    if (this.inputMapping !== null) {

      // Iterate over all input element mappings
      for (var key in this.inputMapping) {
        var note = this.inputMapping[key];

        this.inputElements[note] = {};
        this.inputElements[note].pressed = false;
        this.inputElements[note].velocity = 0;
      }
    }

    // TODO: Handle output messages

    // Listen to stateChange events
    this.access.addEventListener('statechange', this.stateChange.bind(this));

  } // / ndMidi.connectSuccess



  /**
   * It's not possible to use the Web MIDI API.
   */
  connectFailure(message) {

    console.error(message);

  } // / ndMidi.connectFailure



  /**
   * State of a MIDI devices changed: connected / disconnected
   * 
   * @param  MIDIConnectionEvent e
   */
  stateChange(e) {
      console.log('MIDIAccess state change:', e);

      for (var entry of this.access.inputs) {
        var input = entry[1];
        console.log( "Input port [type:'" + input.type + "'] id:'" + input.id +
          "' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
          "' version:'" + input.version + "'" );
      }
  } // / ndMidi.stageChange



  handleInputs() {

  } // / ndMidi.handleInputs



  /**
   * Handle MIDIMessageEvent's that are send from the MIDI device to the PC.
   * 
   * @param  {MIDIMessageEvent} message
   */
  inputMessage(message) {

    /**
     * @TODO: WTF?
     * 
     * Reproduce
     * - Connect a MIDI device
     * - Detach MIDI device
     * - Connect MIDI device 
     * ---> The "midimessage" event is fired
     */
    if (message.data.length == 1) {
      return;
    }



    // Input
    var data = message.data;

    // The current MIDI command
    var midi_command = data[0].toString(16);

    // Note
    var note = data[1];

    // Velocity
    var velocity = data[2];

    // Channel
    // var channel = data[0] & 0xf;
    var channel = midi_command.charAt(1);

    // Command
    var channel_command = midi_command.charAt(0);

    // Type
    var type = data[0];



    // Do stuff based on the message type
    switch (channel_command) {

      // Note Off
      case '8':
        this.noteOff({ note : note, velocity : velocity, channel : channel });
        break;

      // Note On
      case '9':
        this.noteOn({ note : note, velocity : velocity, channel : channel });
        break;

      // Aftertouch
      case 'a':
        this.aftertouch({ note : note, velocity : velocity, channel : channel });
        break;

      // Continuous controller
      case 'b':
        this.continuousController({ note : note, velocity : velocity, channel : channel });
        break;

      // Patch change
      case 'c':
        this.patchChange({ note : note, velocity : velocity, channel : channel });
        break;

      // Channel Pressure
      case 'd':
        this.channelPressure({ note : note, velocity : velocity, channel : channel });
        break;

      // Pitch bend
      case 'e':
        this.pitchBend({ note : note, velocity : velocity, channel : channel });
        break;

      // (non-musical commands)
      case 'f':
        this.nonMusicalCommand({ note : note, velocity : velocity, type : type });
        break;

      default:
        console.log('UNKOWN VALUE', 'channel_command', channel_command, 'channel', channel, 'type', type, 'note', note, 'velocitiy', velocity, 'message', message);

    } // / switch(type)



    if (this.debug) {
      //console.log(message.target.name, '|', 'channel_command', channel_command, 'channel', channel, 'type', type, 'note', note, 'velocitiy', velocity);
    }


    
    var event = new CustomEvent('ndMidi', { 'detail': this.inputElements[note] });
    window.dispatchEvent(event);
    
  } // / ndMidi.inputMessage






  /**
   * Note (for example a button on a drumpad) on MIDI device was activated (for example pressed).
   * 
   */
  noteOn(args) {
    if (this.debug) {
      console.log('note on', args);
    } else {
      this.inputElements[args.note] = Object.assign(this.inputElements[args.note], args);
      this.inputElements[args.note].pressed = true;
      this.inputElements[args.note].noteOn = true;
      this.inputElements[args.note].noteOff = false;
    }
  }



  /**
   * Note (for example a button on a drumpad) on MIDI device was activated (for example pressed).
   * 
   */
  noteOff(args) {
    if (this.debug) {
      console.log('note off', args);
    } else {
      this.inputElements[args.note] = Object.assign(this.inputElements[args.note], args);
      this.inputElements[args.note].pressed = false;
      this.inputElements[args.note].noteOn = false;
      this.inputElements[args.note].noteOff = true;
    }
  }



  pitchBend(args) {
    if (this.debug) {
      console.log('pitch bend', args);
    }
  }



  continuousController(args) {
    if (this.debug) {
      console.log('continuous controller', args);
    } else {
      this.inputElements[args.note] = Object.assign(this.inputElements[args.note], args);
    }
  }



  patchChange(args) {
    if (this.debug) {
      console.log('patch Change', args);
    }
  } // / ndMidi.patchChange



  aftertouch(args) {
    if (this.debug) {
      console.log('aftertouch', args);
    }
  } // / ndMidi.aftertouch



  channelPressure(args) {
    if (this.debug) {
      console.log('channel pressure', args);
    }
  } // / ndMidi.channelPressure



  nonMusicalCommand(args) {
    if (this.debug) {
      console.log('(non-musical commands)', args);
    }
  } // / ndMidi.nonMusicalCommands





} // / ndMidi



module.exports = ndMidi;