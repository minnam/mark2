var expect = require('chai').expect;
var mark2 = require('./index.js');

describe('Test for mark2', function () {
  it('Passing test', function () {
    expect(0).to.be.true
  })
  describe('Create a default sequencer', function () {
    var sequencer = mark2.new();

    it('should have type of quantized', function () {
      expect(sequencer).to.have.property('type', 'quantized')
    })

    it('should have loop to be true by default', function () {
      expect(sequencer.loop()).to.equal(true)
    })

    let count = 0;

    it('should add events, play, and have length of 2', function () {
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

    it('should stop at count of 6 and reset playhead to 0', function () {
      this.timeout(100);

      setTimeout(function () {
        expect(count).to.equal(6)
        expect(sequencer.stop().playhead()).to.equal(0)

      },100)
    })
  })
})
