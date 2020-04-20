$(function () {
    var roomId = window.location.pathname.split('/').pop()
    var socket = io.connect('/game-room');

    socket.on('connect', () => {
        socket.emit('join', { roomId }, () => {
            $('form' ).on('submit', function( e ) {
                e.preventDefault()
                let username = localStorage.getItem('username');
                let user_input = $('input.message').val()
                
                if (socket.connected) {
                    socket.emit('send_message', {
                        roomId: roomId,
                        user_name : username,
                        message : user_input
                    })
                    $( 'input.message' ).val( '' ).focus()
                } else {
                    // TODO: SocketIO alway reconnect, So we should show some warning for user.
                }
            })
        })

        window.addEventListener("unload", () => {
            socket.emit('leave', { roomId })
            socket.close()
        })
    })


    socket.on('received_message', function( msg ) {
        if( typeof msg.user_name !== 'undefined' ) {
            $('h3').remove()
            $('div.message_holder').append( '<div><b style="color: #000">'+msg.user_name+'</b> '+msg.message+'</div>' )
        }
    })
});