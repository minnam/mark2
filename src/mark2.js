if (typeof window === 'undefined') {
  window = {};
}

const vendors = ['ms', 'moz', 'webkit', 'o'];

vendors.map((vendor) => {
  window.requestAnimationFrame = window[`${vendor}RequestAnimationFrame`];
  window.cancelAnimationFrame = window[`${vendor}CancelAnimationFrame`] || window[`${vendor}CancelRequestAnimationFrame`];
});

/**
* @author  Min Nam https://github.com/minnam/Mark2
* @namespace
*/
class Mark2 {
  static group = { nonames: [] };
  static easing = {
    new: (a, b) => {
      this[a] = b;
    },
    linear: a => a,
    quadratic: a => a * a,
    cubic: a => a * a * a,
    quintic: a => a * a * a * a
  };
  /**
   * Create a new Sequencer
   * @param {Object} param Sequencer to feed
   * @param {string} param.group Name of a group for sequencer to be assigned to
   * @param {string} param.type 'variable' or 'quantized'
   * @param {boolean} param.loop Set loop
   * @param {number} param.fps Frames per second
   * @param {number} param.end Count length between Events. Only applies to VariableSequencer
   * @return {Sequencer} Returns created sequencer
   */
   new = (param) => {
     if (param) {
       switch (param.type) {
         case 'variable': {
           const seq = new VariableSequencer(param);
           if (param.group) {
             if (Mark2.group[param.group]) {
               Mark2.group[param.group].push(seq);
             }
           } else {
             Mark2.group.nonames.push(seq);
           }

           return seq;
         }

         case 'quantiazed': {
           const seq = new QuantizedSequencer(param);

           if (param.group) {
             if (Mark2.group[param.group]) {
               Mark2.group[param.group].push(seq);
             } else {
               Mark2.group.nonames.push(seq);
             }
           }

           return seq;
         }

         default: {
           const seq = new QuantizedSequencer({
             loop: true,
           });

           return seq;
         }
       }
     }
     const seq = new QuantizedSequencer({
       loop: true,
     });

     return seq;
   }

   /**
    * Play all Sequencer or a group of Sequnecers
    * @param {string} a A name of group
    * @memberof Mark2#
    */
    play = (a) => {
      if (a !== undefined) {
        Mark2.group[a].map((seq => seq.play()));
      } else {
        Object.entries(Mark2.group).forEach(([key]) => {
          Mark2.group[key].map((seq => seq.play()));
        });
      }
    }

    /**
    * Pause all Sequencer or a group of Sequnecers
    * @param {string} a A name of group
    * @memberof! Mark2#
    */
    pause = (a) => {
      if (a !== undefined) {
        Mark2.group[a].map((seq => seq.pause()));
      } else {
        Object.entries(Mark2.group).forEach(([key]) => {
          Mark2.group[key].map((seq => seq.pause()));
        });
      }
    }

    /**
    * Stop all Sequencer or a group of Sequnecers
    * @param {string} a A name of group
    * @memberof! Mark2#
    */
    stop = (a) => {
      if (a !== undefined) {
        Mark2.group[a].map((seq => seq.stop()));
      } else {
        Object.entries(Mark2.group).forEach(([key]) => {
          Mark2.group[key].map((seq => seq.stop()));
        });
      }
    }
}

export default Mark2;
