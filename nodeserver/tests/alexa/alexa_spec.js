var bst = require('bespoken-tools');

//https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs

//https://www.npmjs.com/package/alexa-app
var server = null;
var alexa = null;

// http://docs.bespoken.tools/en/latest/tutorials/tutorial_bst_emulator_nodejs/
beforeEach(function (done) {
    server = new bst.LambdaServer('./index.js', 10000, true);
    alexa = new bst.BSTAlexa('http://localhost:10000',
                             __dirname+'/speechAssets/IntentSchema.json',
                             __dirname+'/speechAssets/Utterances.txt');
    server.start(function() {
        alexa.start(function (error) {
            if (error !== undefined) {
                console.error("Error: " + error);
            } else {
                done();
            }
        });
    });
});

afterEach(function(done) {
    alexa.stop(function () {
        server.stop(function () {
            done();
        });
    });
});


it('Launches and then plays first', function (done) {
    // Launch the skill via sending it a LaunchRequest
    alexa.launched(function (error, payload) {
        // Check that the introduction is play as outputSpeech
        assert.equal(payload.response.outputSpeech.ssml, '<speak> <audio src="https://s3.amazonaws.com/bespoken/streaming/bespokenspodcast-INTRODUCTION.mp3" />You can say play, scan titles, or about the podcast </speak>');

        // Emulate the user saying 'Play'
        alexa.spoken('Play', function (error, payload) {
            // Ensure the correct directive and audioItem is returned
            assert.equal(payload.response.directives[0].type, 'AudioPlayer.Play');
            assert.equal(payload.response.directives[0].audioItem.stream.token, '0');
            assert.equal(payload.response.directives[0].audioItem.stream.url, 'https://traffic.libsyn.com/bespoken/TIP103.mp3?dest-id=432208');
            done();
        });
    });
});


it('Plays To Completion', function (done) {
    alexa.spoken('Play', function (error, payload) {
        // Emulates the track being played 'NearlyFinished'
        //  Alexa sends this event at some point during track playback
        // Our skill uses the opportunity to queue up the next track to play
        alexa.playbackNearlyFinished(function (error, payload) {
            assert.equal(payload.response.directives[0].type, 'AudioPlayer.Play');
            assert.equal(payload.response.directives[0].playBehavior, 'ENQUEUE');
            assert.equal(payload.response.directives[0].audioItem.stream.url, 'https://traffic.libsyn.com/bespoken/TIP104.mp3?dest-id=432208');
        });

        // Emulates the track playing to completion
        // The callback is invoked after the skill responds to the PlaybackFinished request
        alexa.playbackFinished(function (error, payload) {
            // Confirm there are no directives in the reply to the PlaybackFinished request
            // They came on the PlaybackNearlyFinished call
            assert(!payload.response.directives);

            // Check that playback started on the next track
            alexa.once('AudioPlayer.PlaybackStarted', function(audioItem) {
                assert.equal(audioItem.stream.token, '1');
                assert.equal(audioItem.stream.url, 'https://traffic.libsyn.com/bespoken/TIP104.mp3?dest-id=432208');
                done();
            });
        });
    });
});