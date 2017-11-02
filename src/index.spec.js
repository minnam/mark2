var expect = require('chai').expect;
var mark2 = require('./index.js');

describe('Test for mark2', function () {
  it('Passing test', function () {
    expect(true).to.be.true
  })
  describe('Create a default sequencer', function () {
    var sequencer = mark2.new();

    it('Type of quantized', function () {
      expect(sequencer).to.have.property('type', 'quantized')
    })

    it('Loop set to true', function () {
      expect(sequencer.loop()).to.equal(true)
    })

    let count = 0;

    it('Adding events to sequencer and play', function () {
      sequencer.add({
        execute: function (event) {
          count++
        }
      });

      sequencer.add({
        execute: function (event) {
          count++
          if (count > 5) {
            sequencer.stop()
          }
        }
      });

      sequencer.play();

      expect(sequencer.length()).to.equal(2)
    })

    it('Play sequencer and count until 6 and stopping a sequencer resets playhead', function () {
      this.timeout(100);

      setTimeout(function () {
        expect(count).to.equal(6)
        expect(sequencer.stop().playhead()).to.equal(0)

      },100)
    })
  })
})
