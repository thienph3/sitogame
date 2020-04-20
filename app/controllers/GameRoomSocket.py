from flask_socketio import Namespace, join_room, leave_room, close_room, rooms, send

class GameRoomSocket(Namespace):
    def on_connect(self):
        print('connected')

    def on_disconnect(self):
        print('on_disconnect')

    def join_callback(self):
        return { isSuccess: True }

    def on_join(self, data):
        room_id = data['roomId']
        
        join_room(room_id)

    def on_leave(self, data):
        room_id = data['roomId']

        leave_room(room_id)

    def on_send_message(self, data):
        room_id = data['roomId']
        self.emit('received_message', data, room=room_id)