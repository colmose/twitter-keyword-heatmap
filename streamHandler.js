"use strict";
var Twitter = require('twitter');
let stream = null;

var twit = new Twitter({
    consumer_key: 'jma7MPMMoVafZYKifpyk2dwrm',
    consumer_secret: 'EjVGv62HI3r4pmlwtMnXO7YwUfdSSFxiN4TY9vJWfcalB3z5Kj',
    access_token_key: '286880375-Ehb9XUm3Ap9mopSLB02turojBPm9SCQ0XdTxKyBy',
    access_token_secret: 'kKb9qOAYkM38W5NjLrfeEZo8W89hZMhXaEwmVEn3EPWDS'
});

const streamHandler = function(io){
    io.on('connection', function(socket){
        socket.on('start tweets', function(){
            if (stream === null){
               handleStreams();
            }
        });

        function handleStreams(){
            twit.stream('statuses/filter', {'locations': '-180,-90,180,90', 'track': 'flu'}, function(s){
                stream = s;
                stream.on('data', data => {
                    console.log(data)
                    if(data.coordinates && data.coordinates !== null){
                        let outputPoint = {"lat": data.coordinates.coordinates[0],"lng": data.coordinates.coordinates[1]};

                        socket.broadcast.emit("twitter-stream", outputPoint);

                        //Send out to web sockets channel.
                        socket.emit('twitter-stream', outputPoint);
                    }
                });

                stream.on('limit', function(limitMessage) {
                    return console.log(limitMessage);
                });

                stream.on('warning', function(warning) {
                    return console.log(warning);
                });

                stream.on('disconnect', function(disconnectMessage) {
                    return console.log(disconnectMessage);
                });
            })
        }
        socket.emit("connected");
    })
};

module.exports = streamHandler;
