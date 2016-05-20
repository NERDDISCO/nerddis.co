'use strict';

class ndMidi {

  constructor(args) {

    // System Exclusive Support?
    this.sysex = args.sysex || false;

    // @see MIDIAccess
    this.access = args.access || null;

    // @see MIDIOutputMap
    this.outputMap = args.outputMap || null;

    // Show debugging logs?
    this.debug = args.debug || false;

    // A list of devices
    this.devices = args.devices || null;

    // Internal representation of the devices
    this._devices = new Map();

    // Iterate over all devices to find the current input
    for (let device of this.devices) {
      // The mapping of input elements
      device.inputMapping = new Map();

      // Add the device to the Map of devices
      this._devices.set(device.name, device);
    }

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

    // Get the outputs for connected MIDI devices
    this.outputMap = this.access.outputs;

    // Handle all inputs
    this.handleInputs();

    // TODO: Handle outputs

    // Listen to stateChange events
    this.access.addEventListener('statechange', this.stateChange.bind(this));

  } // / ndMidi.connectSuccess



  /**
   * Handle all input ports
   *
   */
  handleInputs() {

    // Iterate over all input ports
    for (let input of this.access.inputs.values()) {

      // Listen to MIDIMessageEvent for this input port
      input.onmidimessage = this.inputMessage.bind(this);

      // Show input information
      if (this.debug) {
        console.log("type:", input.type, "| id:", input.id, "| manufacturer:", input.manufacturer, "| name:", input.name, "| version:", input.version);
      }


      // The input is a defined device
      if (this._devices.has(input.name)) {

        // Get the single device
        let device = this._devices.get(input.name);

        // Mapping for the current device exists
        if (device.mapping) {

          // Iterate over all input element mappings
          for (var key in device.mapping) {

            // Get the note for the current
            let note = device.mapping[key];

            // Add the note to the inputMapping of the device
            device.inputMapping.set(note, {
              pressed : false,
              velocity : 0
            });

          } // / Iterate over all input element mappings

        } // / Mapping for the current input exists

      } // / The input is a defined device

    } // / Iterate over all input ports

  } // / ndMidi.handleInputs



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

    if (this.debug) {
      console.log(e, e.port.type);
    }

    if (e.port.type == "input") {
      this.handleInputs();
    }

  } // / ndMidi.stageChange



  /**
   * Handle MIDIMessageEvent's that are send from the MIDI device to the PC.
   *
   * @param  {MIDIMessageEvent} message
   */
  inputMessage(message) {

    /**
     * @TODO: HANDLE WTF-ERROR CORRECTLY AND NOT LIKE THIS
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



    // The device that was used
    let device = this._devices.get(message.target.name);

    // The device for the current message does not exist
    if (device == undefined) {
      return;
    }



    // Input
    let data = message.data;

    // The current MIDI command
    let midi_command = data[0].toString(16);

    // Note
    let note = data[1];

    // Velocity
    let velocity = data[2];

    // Channel
    // var channel = data[0] & 0xf;
    let channel = midi_command.charAt(1);

    // Command
    let channel_command = midi_command.charAt(0);

    // Type
    let type = data[0];



    // Do stuff based on the message type
    switch (channel_command) {

      // Note Off
      case '8':
        this.noteOff({ device: device, note : note, velocity : velocity, channel : channel });
        break;

      // Note On
      case '9':
        this.noteOn({ device: device, note : note, velocity : velocity, channel : channel });
        break;

      // Aftertouch
      case 'a':
        this.aftertouch({ device: device, note : note, velocity : velocity, channel : channel });
        break;

      // Continuous controller
      case 'b':
        this.continuousController({ device: device, note : note, velocity : velocity, channel : channel });
        break;

      // Patch change
      case 'c':
        this.patchChange({ device: device, note : note, velocity : velocity, channel : channel });
        break;

      // Channel Pressure
      case 'd':
        this.channelPressure({ device: device, note : note, velocity : velocity, channel : channel });
        break;

      // Pitch bend
      case 'e':
        this.pitchBend({ device: device, note : note, velocity : velocity, channel : channel });
        break;

      // (non-musical commands)
      case 'f':
        this.nonMusicalCommand({ device: device, note : note, velocity : velocity, type : type });
        break;

      default:
        console.log('UNKOWN VALUE', 'channel_command', channel_command, 'channel', channel, 'type', type, 'note', note, 'velocitiy', velocity, 'message', message);

    } // / switch(type)



    // Send a custom event
    window.dispatchEvent(new CustomEvent('ndMidi', { 'detail' : { 'id': device.id, 'name': device.name, 'note': device.inputMapping.get(note) } }));

  } // / ndMidi.inputMessage





  getCommand(args) {
  	return this._devices.get(args.name).inputMapping.get(args.note.note);
  }




  /**
   * Note (for example a button on a drumpad) on MIDI device was activated (for example pressed).
   *
   */
  noteOn(args) {
    if (this.debug) {
      console.log('note on', args.note);
    }

    // Get the current command
    let command = args.device.inputMapping.get(args.note);

    // Merge the values
    command = Object.assign(command, args);

    // Set values
    command.pressed = true;
    command.noteOn = true;
    command.noteOff = false;

    // Update the command
    args.device.inputMapping.set(args.note, command);
  }



  /**
   * Note (for example a button on a drumpad) on MIDI device was activated (for example pressed).
   *
   */
  noteOff(args) {
    if (this.debug) {
      console.log('note off', args.note);
    }

    // Get the current command
    let command = args.device.inputMapping.get(args.note);

    // Merge the values
    command = Object.assign(command, args);

    // Set values
    command.pressed = false;
    command.noteOn = false;
    command.noteOff = true;

    // Update the command
    args.device.inputMapping.set(args.note, command);
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
      args.device.inputMapping[args.note] = Object.assign(args.device.inputMapping[args.note], args);
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
