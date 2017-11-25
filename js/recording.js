function recordingUtils() {
    var that = this;
    that.recording = false;
    this.startRecording = function() {
        console.log("Start recording");
        that.recording = true;
        that.capturer = new CCapture({
            framerate: 30,
            verbose: true,
            format: 'webm'
        });
        that.capturer.start();
    }
    this.stopRecording = function() {
        console.log("Stop recording");
        that.recording = false;
        that.capturer.stop();
        that.capturer.save();
        that.capturer = undefined;
    }
}