/**
*	@author  Min Nam https://github.com/MINNAM/Mark2
*	@namespace
*/
var Mark2 = function() {

	var Mark2 = {

		/**
		 * Create a new Sequencer
		 * 
		 * @param {string} type
		 * @param {int} bpm
		 * @param {boolean} loop
		 * @return {Mark2.Sequencer}
		 * @memberOf Mark2#
		 *
		 */		
		new : function( param ) {

			return new VariableSequencer( param );

		},

		/**
		 * Play all Sequencer
		 * @memberof Mark2#
		 */
		play: function() {},

		/**
		 * Pause all Sequencer
		 * @memberof! Mark2#
		 */
		pause: function() {},

		easing : {

			new : function( a, b ){

				this[ a ] = b;

			},

			linear    : function( a ) { return a  },
			quadratic : function( a ) { return a * a },
			cubic     : function( a ) { return a * a * a },
			quintic   : function( a ) { return a * a * a * a }			

		}

	};


	var vendors = [ 'ms', 'moz', 'webkit', 'o' ];

    for( var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i ){

        window.requestAnimationFrame = window[ vendors[ x ] + 'RequestAnimationFrame' ];
        window.cancelAnimationFrame  = window[ vendors[ x ] + 'CancelAnimationFrame' ] || window[ vendors[ x ] + 'CancelRequestAnimationFrame' ];
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
	*	@memberof Mark2	
	*/
	var Note = function( param ) {

		var Note = {},
		_index,
		_start,
		_position,
		_end,
		_execute,
		_velocity,
		_fps,
		_ease;
		
		Note.init = function() {

			this.index( param.index );
			this.start( param.start ? param.start : 0 );			
			this.end( param.end ? param.end : 50 );			
			this.fps( param.fps ? param.fps : 20 );
			this.velocity( param.velocity ? param.velocity : 1 );
			this.execute( param.execute ? param.execute : this.logEmpty );
			this.ease( param.ease ? param.ease : 'quintic' );
			this.setProceed();
			
			return Note;

		}		

		/**
		 * @param  {int} index
		 * @return {int}
		 * @memberof! Mark2.Note#
		 */
		Note.index = function( a ) {

			if( a === undefined ) {

				return _index;

			}

			_index = a;

		}		

		/**
		 * Reset position associated with execute function.
		 * @memberof! Mark2.Note#
		 */
		Note.reset = function() {

			this.start( _start );

		}

		/**		 
		 * @return {int} Start position associated with execute function.
		 * @memberof! Mark2.Note#
		 */
		Note.start = function( a ) {

			if( a === undefined ) {

				return _start;

			}

			_start = a;

			this.position( a );

		}

		/**	
		 * @default 0
		 * @param  {int} position
		 * @memberof! Mark2.Note#
		 */
		Note.position = function( a ) {

			if( a === undefined ) {

				return _position;

			}

			_position = a;

		}

		/**	
		 * @default 0
		 * @param  {int} end
		 * @memberof! Mark2.Note#
		 */		
		Note.end = function( newEnd ) {

			if( newEnd === undefined ) {

				return _end;

			}else{

				_end = newEnd;

			}

		}		

		Note.fps = function( a ) {

			if( a === undefined ) {

				return _fps;

			}

			_fps = a;

		}

		Note.velocity = function( a ) {

			if( a === undefined ) {

				return _velocity;

			}

			_velocity = a;

		}

		Note.ease = function( a ) {

			if( a === undefined ) {

				return _ease;

			}

			_ease = a;

		}

		Note.proceed = function() {}

		Note.setProceed = function() {

			if( _end < _start ) {

				this.proceed = this.decrement;

			}else{
				
				this.proceed = this.increment;

			}

		}
		
		Note.increment = function() {

			_position += _velocity;

			// console.log(  );

		}

		
		Note.decrement = function( a ) {

			_position -= _velocity;

		}

		
		Note.execute = function( newExecute ) {

			if( newExecute === undefined ) {
				 
        			_execute( _end * Mark2.easing[ this.ease() ]( _position / _end ) );
        			

			}else{

				_execute = newExecute;
			}
				
		}

		Note.logEmpty = function() {

			console.log( "Empty Note " + _index + " is executing.");

		}

		return Note.init();

	};

	

	/**
	*	Sequencer is a 
	*	@memberof Mark2
	*	@constructor
	*/
	var Sequencer = function( param ) {

		var Sequencer = {},
		_seq       		   = {},
		_loop 	   		   = true,
		_loopStart 		   = 0,
		_roll 	   		   = false,
		_state 	  	 	   = false,								
		_state     		   = false,		
		_playhead  		   = 0,
		_finish,
		_tick,
		_bpm;
		
		Sequencer.init = function() {

			if( param.loop === undefined ) {

				this.loop( true );

			}else{
				
				this.loop( param.loop );				
			}



			if( param.bpm === undefined ) {

				this.bpm( 120 );

			}else{

				this.bpm( param.bpm );

			}

			Sequencer.defaultExecution(function() {});
			

			return Sequencer;

		}

		
		Sequencer.seq = function() {

			return seq;

		}

		Sequencer.iterate = function() {

			var length = 0, key;

			for( key in _seq ) {
						
				length++;

			}

			return { length: length, key: key };

		};

		
		Sequencer.reset = function() {

		
			for( var key in _seq ) {
						
				_seq[ key ].reset();

			}		

		}

		
		Sequencer.length = function() {

			return this.iterate()[ "length" ];

		}

		
		Sequencer.lastElement = function() {

			return this.iterate()[ "key" ];
			
		}

		
		Sequencer.add = function( param ) {

			var length = this.length();

			if( param === undefined ) { 

				_seq[ length ] = new Note({ index: length });

				return;

			}

			if( param.index === undefined ) {
			 	

				if( length < 1 ) {

					_seq[ 0 ] = new Note( param );

				}else{

					_seq[ length ] = new Note( param );

				}


			}else{

				_seq[ param.index ] = new Note( param );

			}

		}

		Sequencer.get = function( index ) {

			return _seq[ index ];

		}

		Sequencer.delete = function( index ) {

			if( index === undefined ) {
				
				_seq[ this.lastElement() ] = undefined;

			}else{

				_seq[ index ] = undefined;

			}

		}

		Sequencer.bpm = function( newBpm ) {

			if( _state ) {

				this.pause();
				_bpm = 60000 / newBpm;
				this.play();

			}else{

				this.pause();
				_bpm = 60000 / newBpm;

			}

		}

		Sequencer.loop = function( a ) {

			if( a === undefined ) {

				return _loop;

			}

			_loop = a;

		}

		Sequencer.loopStart = function( newLoopStart ) {

			_loopStart = newLoopStart;
			
		}

		Sequencer.roll = function( newRoll ) {

			_roll = newRoll;
			
		}

		Sequencer.isRolling = function() {

			return _roll;

		}

		Sequencer.exeIndex = 0;	

		Sequencer.defaultExecution = function( newDefaultExecution ) {

			if( newDefaultExecution === undefined ) {

				_defaultExecution();

			}else{

				_defaultExecution = newDefaultExecution;

			}


		}		

		Sequencer.pause = function() {

			_state = false;
			clearInterval( _tick );

		}

		Sequencer.stop = function() {

			this.pause();
			_playhead = 0;

			return this;

		}

		Sequencer.finish = function( a ){


			if( a !== undefined ){


				_finish = a;				
				return this;

			}


			if( _finish !== undefined ){

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
	var VariableSequencer = function( param ) {

		var VariableSequencer = new Sequencer( param );

		VariableSequencer.init = function() {
			
			return VariableSequencer;

		}

		VariableSequencer.play = function( ) {

			var id, self = this;		
			execution = function() {
		
				var Note = self.get( self.exeIndex );

				if( Note.position() < Note.end() ) {

					setTimeout(function() {
    			
			
						self.defaultExecution();

						for( var i = 0; i < self.exeIndex; i++ ) {

							self.get( i ).execute();															

						}
			
						Note.execute();
						

						id = window.requestAnimationFrame( execution );

						Note.proceed();							

					}, Note.fps() );

				}else{

					window.cancelAnimationFrame( id );							
					
					if( self.get( self.exeIndex + 1 ) != undefined ) {

							self.exeIndex++;
							self.play();

					}else{
						

						if( self.loop() ) {

							self.finish();
							self.reset();
							self.exeIndex = 0;
							self.play();

						}else{

							self.finish();

						}

					}
									
				}

			}

			id = window.requestAnimationFrame( execution );
			
		}

		return VariableSequencer.init();

	}

	/**
	 *
	 * @augments Mark2.Sequencer
	 * @constructor
	 * @memberOf Mark2
	 */
	var QuantizedSequencer = function() {

		var FixedSequencer = new Sequencer();

		FixedSequencer.init = function() {

			return FixedSequencer;

		}

		FixedSequencer.play = function() {

			_state = true;

			_tick = setInterval( function() {

				_seq[ ( _loopStart + _playhead )  % this.length() ].execute( "hello" + _playhead );

				if( ! this.isRolling() ) {

					_playhead++;

				}

				if( !_loop ) {

					Sequencer.pause();

				}

			}, _bpm );

		}

		return FixedSequencer.init();

	}


	return Mark2;

}();
