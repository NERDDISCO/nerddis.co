'use strict';

class ndDot {
    
  constructor(args) {
    // Canvas context
    this.ctx = args.ctx || undefined;

    // Is the element active
    this.active = args.active || false;

    // Radius
    this.r = args.r || 0;
    this._r = this.r;

    // Position
    this.x = args.x || 0;
    this._x = this.x;

    this.y = args.y || 0;
    this._y = this.y;

    // Time to life
    this.ttl = args.ttl || 0;
    // The amount of time I'm alive
    this._ttl = this.ttl;

    // Color
    this.color = args.color || 0;
    this._color = this.color;
  }



  draw() {

    // Canvas context does not exist
    if (this.ctx === undefined) {
      return;
    }

    if (!this.active) {
      return;
    }

    // The element is still alive
    if (this._ttl-- > 0) {

      // Save the canvas state
      this.ctx.save();

      // Start to draw a path
      this.ctx.beginPath();

      // Decrease the radius    
      this._r = this._r - (this.r / this.ttl);

      // Change the positon
      // this._x = this._x - (this.r / this.ttl);
      // this._y = this._y - (this.r / this.ttl);

      // Set the color
      this.ctx.fillStyle = "hsla(" + this._color + ", 100%, 60%, .45)";

      // Draw the dot
      this.ctx.arc(this.x, this.y, this._r, 0, 2 * Math.PI);
      
      // Fill the dot with color
      this.ctx.fill();
        
      // Restore the canvas state
      this.ctx.restore();
    }
  }



  /**
   * Reset the initial state of the dot.
   * 
   */
  reset() {
    this._ttl = this.ttl;
    this._r = this.r;
  }

} // / ndDot




module.exports = ndDot;