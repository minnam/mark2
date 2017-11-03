# Mark2
[![Travis](https://img.shields.io/travis/minnam/mark2.svg?style=flat-square)](https://travis-ci.org/minnam/mark2)

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

### Quntized Sequencer
A quantized sequencer simply counts from 0 to the length of events.
```javascript
var sequencer = Mark2.new({
    type: 'quantized',
    loop: true,
});
```

### Adding an Event to a Sequncer
By default, event derives its end and fps from the sequencer. However, individual events can have its own end, fps, and easing type.

```javascript
sequencer.add({
  execute : function (event) {
    // Event 1
  }
});

sequencer.add({
  ease : 'quadratic',
  execute : function (event) {
    // Event 2
  }
});

sequencer.add({
  ease : 'cubic',
  end: 100,
  fps: 30,
  execute: function (event) {
    // Event 3
  }
});

```

### Controlling a Sequencer
```javascript
sequencer.play();
sequencer.pause();
sequencer.stop();
sequencer.reset();
sequencer.roll(true); // By Rolling, a sequencer continues playing but does not proceed to the next event.
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
