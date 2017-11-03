/**
* Event object is an individual node for Sequencer. When Event is executed by Sequencer,
* Event's postion will be incremented or decremented while executing it's callback function
* untill it reaches to end.
*
* @constructor
* @param {object} param hello
* @param {int} param.index there
* @param {int} param.start tes
* @param {int} param.end what
* @param {int} param.fps erg
* @param {int} param.velocity agr
* @param {execute} param.execute arg
* @memberof Mark2
*/
class Event {
  constuctor (param) {
    let _index,
    _start,
    _position,
    _end,
    _execute,
    _velocity,
    _fps,
    _ease;

    this.index = function (a) {
      if (a !== undefined) {
        _index = a;
      }

      return _index;
    }
  }
}

var Event = function ( param ) {

  var Event = {},
  _index,
  _start,
  _position,
  _end,
  _execute,
  _velocity,
  _fps,
  _ease;

  Event.init = function () {
    this.index(param.index);
    this.start(param.start ? param.start : 0);
    this.end(param.end ? param.end : 50);
    this.fps(param.fps ? param.fps : 20);
    this.velocity(param.velocity ? param.velocity : 1);
    this.execute(param.execute ? param.execute : this.log);
    this.ease(param.ease ? param.ease : 'linear');
    this.setProceed();

    return Event;
  }

  /**
   * @param  {int} index
   * @return {int}
   * @memberof! Mark2.Event#
   */
  Event.index = function (a) {
    if (a !== undefined) {
      _index = a;
    }

    return _index;
  }

  /**
   * @return {int} Start position associated with execute function.
   * @memberof! Mark2.Event#
   */
  Event.start = function (a) {
    if (a !== undefined) {
      _start = a;
    }

    this.position(a);

    return _start;
  }

  /**
   * Reset position associated with execute function.
   * @memberof! Mark2.Event#
   */
  Event.reset = function () {
    this.start(_start);
  }

  /**
   * @default 0
   * @param  {int} position
   * @memberof! Mark2.Event#
   */
  Event.position = function (a) {
    if (a !== undefined) {
      _position = a;
    }

    return _position;
  }

  /**
   * @default 0
   * @param  {int} end
   * @memberof! Mark2.Event#
   */
  Event.end = function (a) {
    if (a !== undefined) {
      _end = a;
    }

    return _end;
  }

  Event.fps = function (a) {
    if (a === undefined) {
      _fps = a;
    }

    return _fps;
  }

  Event.velocity = function (a) {
    if (a !== undefined) {
      _velocity = a;
    }

    return _velocity;
  }

  Event.ease = function (a) {
    if (a !== undefined) {
      _ease = a;
    }

    return _ease;
  }

  Event.setProceed = function () {
    if (_end < _start) {
      this.proceed = this.decrement;
    } else{
      this.proceed = this.increment;
    }
  }

  Event.increment = function () {
    _position = _position + _velocity;
  }

  Event.decrement = function () {
    _position = _position + _velocity;
  }

  Event.execute = function (a) {
    if (a !== undefined) {
      _execute = a;
    } else {
      _execute({
        end: _end,
        position: _position,
        fps: _fps,
        progress: Mark2.easing[this.ease()](_position / _end)
      });
    }
  }

  Event.log = function () {
    console.log("Empty Event " + _index + " is executing.");
  }

  return Event.init();
};

export default Event;
