import os
from flask import Flask
from flask_socketio import SocketIO

TEMPLATE_DIR = os.path.abspath('app/views')
STATIC_DIR = os.path.abspath('app/statics')

print(TEMPLATE_DIR, STATIC_DIR)

app = Flask(__name__, template_folder=TEMPLATE_DIR, static_folder=STATIC_DIR)

app.config['SECRET_KEY'] = 'ManhMaidGameStudioSitoGameProject'
socketio = SocketIO(app)

# Init controler
from app.controllers.GameRoomController import game_room
from app.controllers.WaitingRoomController import waiting_room
from app.controllers.IndexController import index_blue

app.register_blueprint(index_blue)
app.register_blueprint(game_room)
app.register_blueprint(waiting_room)

# Init Socket
from app.controllers.GameRoomSocket import GameRoomSocket
socketio.on_namespace(GameRoomSocket('/game-room'))

if __name__ == '__main__':
    socketio.run(app, debug=True)