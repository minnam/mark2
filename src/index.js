/**
*	@author  Min Nam https://github.com/MINNAM/Mark2
*	@namespace
*/
var Mark2 = function () {

	if (typeof(window) == 'undefined') {
	  window = {}
	}

	var group = {nonames: []};
	var Mark2 = {
		/**
		 * Create a new Sequencer
		 *
		 * @param {string} group
		 * @param {string} type 'variable' or 'quantized'
		 * @param {boolean} loop
		 * @param {int} fps Frames per second
		 * @param {int} end Count length between Events. Only applies to VariableSequencer
		 * @return {Mark2.Sequencer}
		 * @memberOf Mark2#
		 *
		 */
		new: function (param) {
			if (param) {
				switch (param.type) {
					case 'variable': {
						var seq = new VariableSequencer(param);

						if (param.group) {
							if (group[param.group]) {
								group[param.group].push(seq);
							}
						} else {
							group['nonames'].push(seq);
						}

						return seq;
					}

					case 'quantiazed': {
						var seq = new QuantizedSequencer(param);

						if (param.group) {
							if (group[param.group]) {
								group[param.group].push(seq);
							} else {
								group['nonames'].push(seq);
							}
						}

						return seq;
					}

				}
			}

			var seq = new QuantizedSequencer({
				loop: true
			});

			return seq;
		},

		/**
		 * Play all Sequencer or a group of Sequnecers
		 * @param {string} a A name of group
		 * @memberof Mark2#
		 */
		play: function (a) {
			if (a !== undefined) {
				group[a].map(function(seq) {
					seq.play();
				});
			} else {
				for (var key in group) {
					group[key].map(function(seq) {
						seq.play();
					});
				}
			}
		},

		/**
		 * Pause all Sequencer or a group of Sequnecers
		 * @param {string} a A name of group
		 * @memberof! Mark2#
		 */
		pause: function (a) {
			if (a !== undefined) {
				group[a].map(function(seq) {
					seq.pause();
				});
			} else {
				for (var key in group) {
					group[key].map(function(seq) {
						seq.pause();
					});
				}
			}
		},

		/**
		 * Stop all Sequencer or a group of Sequnecers
		 * @param {string} a A name of group
		 * @memberof! Mark2#
		 */
		stop: function (a) {
			if (a !== undefined) {
				group[a].map(function(seq) {
					seq.stop();
				});
			} else {
				for (var key in group) {
					group[key].map(function(seq) {
						seq.stop();
					});
				}
			}
		},
		easing: {
			new: function ( a, b ) {
				this[a] = b;
			},
			linear: function (a) {return a;},
			quadratic: function (a) {return a * a;},
			cubic: function (a) {return a * a * a;},
			quintic: function (a) {return a * a * a * a;}
		}

	};

	var vendors = ['ms', 'moz', 'webkit', 'o'];

    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame  = window[vendors[i] + 'CancelAnimationFrame'] || window[vendors[i] + 'CancelRequestAnimationFrame'];
    }

	/**
	*	Event object is an individual node for Sequencer. When Event is executed by Sequencer,
	*	Event's postion will be incremented or decremented while executing it's callback function
	*	untill it reaches to end.
	*
	* 	@constructor
	* 	@param param
	* 	@param {int} param.index
	*	@param {int} param.start
	*	@param {int} param.end
	*	@param {int} param.fps
	*	@param {int} param.velocity
	*	@param {execute} param.execute
	*	@memberof Mark2
	*/
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

	/**
	*	Sequencer is a
	*	@memberof Mark2
	*	@constructor
	*/
	var Sequencer = function (param) {
		var Sequencer = {},
		_events = {},
		_loop = true,
		_loopStart = 0,
		_roll = false,
		_playhead,
		_finish,
		_default,
		_fps,
		_end,
		_tick,
		_bpm,
		_total = 0

		Sequencer.init = function () {
			this.loop(param.loop ? param.loop : true);
			this.playhead(0);
			this.end(param.end);
			this.fps(param.fps);
			this.default(param.default ? param.default : function () {});

			return Sequencer;
		}

		Sequencer.end = function (a) {
			if (a !== undefined) {
				_end = a;
			}

			return _end;
		}

		Sequencer.fps = function (a) {
			if (a === undefined) {
				_fps = a;
			}

			return _fps;
		}

		Sequencer.loopStart  = function (a) {
			if (a !== undefined) {
				_loopStart = a;
			}

			return _loopStart;
		}

		Sequencer.iterate = function () {
			var length = 0, key;

			for (key in _events) {
				length++;
			}

			return {length: length, key: key};
		};

		Sequencer.playhead = function (a) {
			if (a !== undefined) {
				_playhead = a;
			}

			return _playhead;
		}

		Sequencer.reset = function () {
			this.playhead(0);
			_total = 0;

			for (var key in _events) {
				_events[key].reset();
			}
		}

		Sequencer.length = function () {
			return this.iterate().length;
		}

		Sequencer.lastEvent = function () {
			return this.iterate().key;
		}

		Sequencer.default = function (a) {
			if (a !== undefined) {
				_default = a;
			} else {
				_default(this);
			}
		}

		Sequencer.add = function (a) {
			var length = this.length();

			if (a === undefined) {
				_events[length] = new Event({index: length});

				return;
			}

			if (a.index === undefined) {
				if (length < 1) {
					_events[0] = new Event(
						Object.assign({
							end: _end,
							fps: _fps
						}, a)
					);
				} else{
					_events[length] = new Event(
						Object.assign({
							end: _end,
							fps: _fps
						}, a)
					);
				}
			} else{
				_events[a.index] = new Event(
					Object.assign({
						end: _end,
						fps: _fps
					}, a)
				);
			}
		}

		Sequencer.get = function (a) {
			return _events[a];
		}

		Sequencer.nextExist = function () {
			return this.get(_playhead + 1);
		}

		Sequencer.next = function () {
			_playhead++;
		}

		Sequencer.prev = function () {
			_playhead--;
		}

		Sequencer.delete = function (a) {
			if (index === undefined) {
				_events[this.lastEvent()] = undefined;
			} else{
				_events[a] = undefined;
			}
		}

		Sequencer.loop = function (a) {
			if (a === undefined) {
				return _loop;
			}

			_loop = a;
		}

		Sequencer.loopStart = function (a) {
			_loopStart = a;
		}

		Sequencer.roll = function (a) {
			_roll = a;
		}

		Sequencer.isRolling = function () {
			return _roll;
		}

		Sequencer.pause = function () {
			clearInterval(this.tick);
			clearTimeout(this.currentEvent);

			if (this.executionId) {
				window.cancelAnimationFrame(this.executionId);
			}
		}

		Sequencer.stop = function () {
			this.pause();
			this.playhead(0);

			return this;
		}

		Sequencer.finish = function (a) {
			if ( a !== undefined ) {
				_finish = a;
				return this;
			}

			if ( _finish !== undefined ) {
				_finish();
			}

			return this;
		}

		return Sequencer.init();
	};
	/**
	 *
	 * @augments Mark2.Sequencer
	 * @constructor
	 * @memberOf Mark2
	 */
	var VariableSequencer = function (param) {
		var VariableSequencer = new Sequencer(param);

		VariableSequencer.type = 'variable';

		VariableSequencer.init = function () {
			return VariableSequencer;
		}

		VariableSequencer.play = function () {
			var id, self = this;

			this.execution = function () {
				var event = self.get(self.playhead());

				if (Mark2.easing[event.ease()](event.position() / event.end()) <= 1) {
					self.currentEvent = setTimeout(function () {
						if (event.position() <= event.end()) {
							self.default(self);
							event.execute();
							event.proceed();
						} else {
							clearTimeout(self.currentEvent);
							window.cancelAnimationFrame(self.executionId);
						}

						self.executionId = window.requestAnimationFrame(self.execution);
					}, event.fps());

					self.total++;

				} else{
					clearTimeout(self.currentEvent);
					window.cancelAnimationFrame(self.executionId);

					if (!self.isRolling()) {
						if (self.nextExist() != undefined) {
							self.next();
							self.play();
						} else{
							if (self.loop()) {
								self.finish();
								self.reset();
								self.playhead(0);
								self.play();
							} else{
								self.finish();
							}
						}
					} else {
						self.finish();
						self.play();
					}
				}
			}

			this.execution();
		}

		return VariableSequencer.init();
	}

	/**
	 *
	 * @augments Mark2.Sequencer
	 * @constructor
	 * @memberOf Mark2
	 */
	var QuantizedSequencer = function (param) {
		var QuantizedSequencer = new Sequencer(param);

		QuantizedSequencer.type = 'quantized';

		QuantizedSequencer.init = function () {
			return QuantizedSequencer;
		}

		QuantizedSequencer.play = function () {
			this.tick = setInterval(function () {
				var event = this.get(this.playhead() % this.length());
				event.execute();

				if (!this.isRolling()) {
					this.playhead(this.playhead() + 1);
				}

				if (!this.loop) {
					this.pause();
				}
			}.bind(this), this.fps);
		}

		return QuantizedSequencer.init();
	}

	return Mark2;
}();

module.exports = Mark2;
