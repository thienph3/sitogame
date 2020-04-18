$(function () {
    var socket = io.connect(window.location.protocol + '//' + document.domain + ':' + location.port);

    socket.on( 'connect', function() {
        //console.log('Connected')
        socket.emit( 'my event', {
            data: 'User Connected'
        } );
        var form = $( '#chatForm' ).on( 'submit', function( e ) {
            e.preventDefault()
            let user_name = $( 'input.username' ).val()
            let user_input = $( 'input.message' ).val()
            //console.log(user_name, user_input);
            socket.emit( 'my event', {
                user_name : user_name,
                message : user_input
            } );
            $( 'input.message' ).val( '' ).focus()
        } );
    } );
    socket.on( 'my response', function( msg ) {
        console.log( msg );
        if( typeof msg.user_name !== 'undefined' ) {
            $( 'h3' ).remove()
            $( 'div.message_holder' ).append( '<div><b style="color: #000">'+msg.user_name+'</b> '+msg.message+'</div>' )
        };
    });
    socket.on( 'new player join waiting room', function( msg ) {
        console.log( msg );
            
        $( '#players' ).append( '<li>' + msg + '</li>' );
    });
});