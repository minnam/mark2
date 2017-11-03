[![Travis](https://img.shields.io/travis/minnam/mark2.svg?style=flat-square)](https://travis-ci.org/minnam/mark2)
# Mark2

Mark2 derives from sequencer in electronic music. It is useful when you need to sequence events, possibly looped, and handling numerous of individual sequences at the same time.

## Creating a Sequencer

There are two types of sequencers, "variable" and "quantized."

### Variable Sequencer
A variable sequencer counts from 0 to the length of events and an individual event also counts from 0 to end before proceeding to the next event.
```javascript
var sequencer = Mark2.new({
    type: 'variable',
    loop: true,
    end: 100,
    fps: 30,
});
```

### Quantized Sequencer
A quantized sequencer simply counts from 0 to the length of events.
```javascript
var sequencer = Mark2.new({
    type: 'quantized',
    loop: true,
});
```

### Adding an Event to a Sequencer
By default, event derives its end and fps from the sequencer. However, individual events can have its own end, fps, and easing type.

```javascript
/* Event 1 */
sequencer.add({
  end: 100,
  ease : 'linear', // default
  execute : function (event) {
    /*
    * If this is a variable sequence, events will count until given end     
    * by given easing type. When progress reaches to 100, it will move on
    * to next event
    *
    * {...end: 100, progress: 0}
    * {...end: 100, progress: 1}
    * {...end: 100, progress: 2}
    */    
  }
});

/* Event 2 */
sequencer.add({
  ease : 'quadratic',
  end: 100,
  execute : function (event) {
    ...
  }
});
```

### Controlling a Sequencer
```javascript
sequencer.play();
sequencer.pause();
sequencer.stop();
sequencer.reset();
sequencer.roll(true); // By rolling, the sequencer continues to count but does not proceed to the next event.
sequencer.roll(false);
```

### Global Control
You can assign a group to a sequencer. By grouping them, sequencers within that group can be controlled at the same time.
If no group name is given, global action will be applied to all sequencers.

```javascript
...
var sequencer = Mark2.new({
    group: "group-1",
    type: 'quantized',
    loop: true,
});
...

Mark2.play();
Mark2.play("group-1");
Mark2.pause();
Mark2.pause("group-1");
Mark2.stop();
Mark2.stop("group-1");
Mark2.reset();
Mark2.reset("group-1");
```
