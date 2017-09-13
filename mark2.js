/**
*	@author  Min Nam https://github.com/MINNAM/M2
*	@namespace
*/
var M2 = function () {
	var group = {nonames: []};
	var M2 = {
		/**
		 * Create a new Sequencer
		 *
		 * @param {string} group
		 * @param {string} type 'variable' or 'quantized'
		 * @param {boolean} loop
		 * @param {int} fps Frames per second
		 * @param {int} end Count length between Notes. Only applies to VariableSequencer
		 * @return {M2.Sequencer}
		 * @memberOf M2#
		 *
		 */
		new: function (param) {
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

				default: {
					var seq = new QuantizedSequencer(param);

					if (param.group) {
						if (group[param.group]) {
							group[param.group].push(seq);
						}
					}

					return seq;
				}
			}
		},

		/**
		 * Play all Sequencer or a group of Sequnecers
		 * @param {string} a A name of group
		 * @memberof M2#
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
		 * @memberof! M2#
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
		 * @memberof! M2#
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
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame  = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

	/**
	*	Note object is an individual node for Sequencer. When Note is executed by Sequencer,
	*	Note's postion will be incremented or decremented while executing it's callback function
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
	*	@memberof M2
	*/
	var Note = function ( param ) {

		var Note = {},
		_index,
		_start,
		_position,
		_end,
		_execute,
		_velocity,
		_fps,
		_ease;

		Note.init = function () {
			this.index(param.index);
			this.start(param.start ? param.start : 0);
			this.end(param.end ? param.end : 50);
			this.fps(param.fps ? param.fps : 20);
			this.velocity(param.velocity ? param.velocity : 1);
			this.execute(param.execute ? param.execute : this.log);
			this.ease(param.ease ? param.ease : 'linear');
			this.setProceed();

			return Note;
		}

		/**
		 * @param  {int} index
		 * @return {int}
		 * @memberof! M2.Note#
		 */
		Note.index = function (a) {
			if (a !== undefined) {
				_index = a;
			}

			return _index;
		}

		/**
		 * @return {int} Start position associated with execute function.
		 * @memberof! M2.Note#
		 */
		Note.start = function (a) {
			if (a !== undefined) {
				_start = a;
			}

			this.position(a);

			return _start;
		}

		/**
		 * Reset position associated with execute function.
		 * @memberof! M2.Note#
		 */
		Note.reset = function () {
			this.start(_start);
		}

		/**
		 * @default 0
		 * @param  {int} position
		 * @memberof! M2.Note#
		 */
		Note.position = function (a) {
			if (a !== undefined) {
				_position = a;
			}

			return _position;
		}

		/**
		 * @default 0
		 * @param  {int} end
		 * @memberof! M2.Note#
		 */
		Note.end = function (a) {
			if (a !== undefined) {
				_end = a;
			}

			return _end;
		}

		Note.fps = function (a) {
			if (a === undefined) {
				_fps = a;
			}

			return _fps;
		}

		Note.velocity = function (a) {
			if (a !== undefined) {
				_velocity = a;
			}

			return _velocity;
		}

		Note.ease = function (a) {
			if (a !== undefined) {
				_ease = a;
			}

			return _ease;
		}

		Note.setProceed = function () {
			if (_end < _start) {
				this.proceed = this.decrement;
			} else{
				this.proceed = this.increment;
			}
		}

		Note.increment = function () {
			_position = _position + _velocity;
		}

		Note.decrement = function () {
			_position = _position + _velocity;
		}

		Note.execute = function (a) {
			if ( a !== undefined ) {
				_execute = a;
			} else {
				_execute({
					end: _end,
					position: _position,
					fps: _fps,
					progress: M2.easing[this.ease()](_position / _end)
				});
			}
		}

		Note.log = function () {
			console.log( "Empty Note " + _index + " is executing.");
		}

		return Note.init();
	};

	/**
	*	Sequencer is a
	*	@memberof M2
	*	@constructor
	*/
	var Sequencer = function ( param ) {
		var Sequencer = {},
		_notes = {},
		_loop = true,
		_loopStart = 0,
		_roll = false,
		_playhead,
		_finish,
		_fps,
		_end,
		_tick,
		_bpm,
		_total = 0

		Sequencer.init = function () {
			this.loop( param.loop ? param.loop : true );
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

			for (key in _notes) {
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

			for ( var key in _notes ) {
				_notes[key].reset();
			}
		}

		Sequencer.length = function () {
			return this.iterate().length;
		}

		Sequencer.lastNote = function () {
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
				_notes[length] = new Note({index: length});

				return;
			}

			if (a.index === undefined) {
				if (length < 1) {
					_notes[0] = new Note(
						Object.assign({
							end: _end,
							fps: _fps
						}, a)
					);
				} else{
					_notes[length] = new Note(
						Object.assign({
							end: _end,
							fps: _fps
						}, a)
					);
				}
			} else{
				_notes[a.index] = new Note(
					Object.assign({
						end: _end,
						fps: _fps
					}, a)
				);
			}
		}

		Sequencer.get = function (a) {
			return _notes[a];
		}

		Sequencer.nextExist = function () {
			return this.get( _playhead + 1 );
		}

		Sequencer.next = function () {
			_playhead++;
		}

		Sequencer.prev = function () {
			_playhead--;
		}

		Sequencer.delete = function (a) {
			if (index === undefined) {
				_notes[this.lastNote()] = undefined;
			} else{
				_notes[a] = undefined;
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
			clearTimeout(this.currentNote);

			if (this.executionId) {
				window.cancelAnimationFrame( this.executionId );
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
	 * @augments M2.Sequencer
	 * @constructor
	 * @memberOf M2
	 */
	var VariableSequencer = function (param) {
		var VariableSequencer = new Sequencer(param);

		VariableSequencer.init = function () {
			return VariableSequencer;
		}

		VariableSequencer.play = function () {
			var id, self = this;

			this.execution = function () {
				var note = self.get(self.playhead());

				if (M2.easing[note.ease()](note.position() / note.end()) <= 1) {
					self.currentNote = setTimeout(function () {
						if (note.position() <= note.end()) {
							self.default(self);
							note.execute();
							note.proceed();
						} else {
							clearTimeout(self.currentNote);
							window.cancelAnimationFrame(self.executionId);
						}

						self.executionId = window.requestAnimationFrame(self.execution);
					}, note.fps());

					self.total++;

				} else{
					clearTimeout(self.currentNote);
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
	 * @augments M2.Sequencer
	 * @constructor
	 * @memberOf M2
	 */
	var QuantizedSequencer = function (param) {
		var QuantizedSequencer = new Sequencer(param);

		QuantizedSequencer.init = function () {
			return QuantizedSequencer;
		}

		QuantizedSequencer.play = function () {
			var self = this;

			this.tick = setInterval(function () {
				var note = this.get((this.playhead) % this.length());

				note.execute();

				if (!this.isRolling() ) {
					this.playhead++;
				}

				if (!this.loop ) {
					this.pause();
				}
			}.bind(this), this.fps );
		}

		return QuantizedSequencer.init();
	}

	return M2;
}();
