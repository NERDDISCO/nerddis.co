---
  title: "First steps with Tessel"
  date: 2014-08-04T00:00:00+02:00
  draft: false
  type: "subpage"
  img: ""
  tags: ""
---

# First steps with Tessel

I love the concept of [Tessel](https://tessel.io/) from [Technical Machine](https://tessel.io/about): A small microcontroller running [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/About_JavaScript) (+ [Node.js](https://nodejs.org/)) combined with a [collection of modules](https://tessel.io/modules) (e.g. GPS, camera, bluetooth) to extend it's functionality and their corresponding [Node.js](https://nodejs.org/) API to use them in your code. 

Sounds impossible? It's not! So let's start from the beginning: My first steps with a brand new [Tessel](https://tessel.io/). 

## Unboxing

My package had the following content: 

*   2 x Tessel sticker (one of them is [already on my notebook](https://www.eyeem.com/p/41858502))
*   1 x Tessel
*   1 x micro USB to USB cable
*   1 x Tessel [Servo Module](https://tessel.io/modules#module-servo)

![Unpacking Tessel](/img/20140804_NERDDISCO_unpack_tessel_servo_sticker_usb_cable.jpg)

## Connect to PC

Use the USB cable to connect the Tessel with your PC. You will see the four onboard LEDs blink once and the main (green) LED shines constantly: 

![](/img/20140804_NERDDISCO_connect_tessel_with_pc.jpg)

## Installation & firmware update

Before we can start using Tessel we have to install the Tessel CLI (a Node.js module) & update the firmware as descripted here: [start.tessel.io](https://start.tessel.io/)

The firmware update was succesful if you see this message after running _sudo tessel update_ again:

```javascript
INFO Checking for latest firmware... 
INFO Tessel is already on the latest firmware build. You can force an update with "tessel update --force"
```

### Update fails

If you run into any problems and the installation is not working, you should:

1.  [Reset everything](first-steps-with-tessel/#reset-everything)
2.  Run the update using the "Device Firmware Upgrade"-mode (dfu)
    ```javascript
    sudo tessel update --dfu
    ```
    

If it's not working, you can also try this:

```javascript
sudo tessel update --force
```

Also not working? Maybe your [Tessel command line tools](https://www.npmjs.org/package/tessel) are out of date and you should update them first:

```javascript
sudo npm update -g tessel
sudo tessel install-drivers
```

Not working? I recommend you to search for the problem inside the [Tessel Forums](https://forums.tessel.io/) and if you can't find a proper solution, you should create a new entry with a detailed description and the community will help you. 

### Wifi update fails

If you have problems updating the Wifi firmware, you should:

1.  [Reset everything](first-steps-with-tessel/#reset-everything)
2.  Run this command (and replace the _\--wifi <version>_ with the one you need):  
    ```javascript
    sudo tessel update --wifi 1.28 --force
    ```
    

This will output something like this if everything went right:

```javascript
INFO Downloading remote file https://builds.tessel.io/wifi/1.28.bin
INFO Wifi patch uploaded... waiting for it to apply (10s)
INFO ...
INFO ...
INFO ...
INFO ...
INFO ...
INFO ...
INFO 
INFO Complete
```

## Reset everything

Just use this 5 simple steps to reset your Tessel. You can be as fast or slow between these steps as you want:

1.  **Press** the **Reset** button on your Tessel
2.  **Press** the **Config** button on your Tessel
3.  **Release** the **Reset** button on your Tessel
4.  **Release** the **Config** button on your Tessel
5.  **Execute** "sudo tessel erase" on your command line

_This "trick" was found in the [Tessel Forums](https://forums.tessel.io/t/no-wifi-can-not-run-or-update/561/2)._ 

## Use Wifi

The following command will show you a list of all available 2.4 GHz Wifi networks in range of your Tessel:

```javascript
tessel wifi --list
```

You can connect to a 2.4 GHz Wifi with one command:

```javascript
# -n = network name
# -p = password
tessel wifi -n "MY SSID" -p "MYPASSWORD"
```

This should output something like this if everything was ok:

```javascript
INFO Connecting to "MY SSID" with wpa2 security...
INFO Acquiring IP address. 

INFO Connected!

IP	 192.168.0.101
DNS	 192.168.0.1
DHCP	 192.168.0.1
Gateway	 192.168.0.1
```

You can also use the _tessel wifi --list_ command to see if Tessel is connected to a network and it's IP:

```javascript
INFO Requesting wifi status...
Current network: MY SSID
Currently visible networks (1):
	MY SSID (83/127)INFO Connected: 1
INFO Ip: 192.168.0.101
```

## Hello World

Create a file called _hello-world.js_ and put this into it:

```javascript
// Import the Tessel module
var tessel = require('tessel');

// Print a message to the console with the ID of the connected Tessel
console.log('Hello World, my name is ' + tessel.deviceId() + '!');
```

### Run code

Switch to your command line and execute:

```javascript
tessel run hello-world.js
```

This will create the following output:

```javascript
TESSEL! Connected to TM-00-04-f0009a30-006a4345-5a9e6249.
INFO Bundling directory /home/timpietrusky/node/first-steps-with-tessel
INFO Deploying bundle (5.00 KB)...
INFO Running script...
Hello World, my name is TM-00-04-f0009a30-006a4345-5a9e6249! 

```

Use _CTRL + C_ to cancel the running script. 

## Control the onboard LED

The [first example](https://start.tessel.io/blinky) from Tessel explains how to turn two onboard LEDs on / off. I modified the code and added some comments to make it easier to understand. 

Create a file called _blinky.js_ and insert the following code:

```javascript
// Import the Tessel module
var tessel = require('tessel');

// Real names for the LED
var led = {
  green : tessel.led[0].output(1), // output(1) -> Initial on
  blue  : tessel.led[1].output(0), // output(0) -> Initial off
} 

// Toggle the state of the green LED every 150 ms
setInterval(function () {
  led.green.toggle();
}, 150);

// Toggle the state of the blue LED every 300 ms
setInterval(function () {
  led.blue.toggle();
}, 300);
```

Running this code (_tessel run blinky.js_) will switch the green / blue LED on / off in a defined interval. 

### Push code

Everytime you use _tessel run_ the code is deleted from Tessel after you cancel the execution. If you want your code permanently on Tessel, you can push it using the following command:

```javascript
sudo tessel push blinky.js
```

## Use the servo module

I bought a [servo module](https://tessel.io/modules#module-servo) with my Tessel, because they say that this module 

> Can also be used as an LED driver

and I want to use many LEDs in the near future.

### US to EU power plug adapter

The servo comes with it's own power supply, which has a US power plug. That's why I also orderer a power plug adapter to use it in Germany:

![Servo: US to EU power plug adapter](/img/20140804_NERDDISCO_servo_power_plug_adapter_us_to_eu.jpg)

### Get started

Just follow the steps on the offical "[getting started with servo](https://start.tessel.io/modules/servo)"-page, because Technical Machine did a forking awesome job in documenting everything. 

### Final result

This is what the serve module looks like connected to Tessel on port A:

![Servo connected to Tessel](/img/20140804_NERDDISCO_servo_connected_to_tessel.jpg)

### What's next?

I will use the servo module in the future to control some LEDs, so please be patient! :D

## Conclusion

Using the Tessel is straight forward and very nice: You receive a forking awesome documentation, a community of helpful people and a company that's 100% behind their product. I'm looking forward to use Tessel in future projects and provide more in depth articles for specific use cases.