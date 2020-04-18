from flask import Flask
from flask_socketio import SocketIO
import os
from app.controllers.WaitingRoomController import WaitingRoomController
#from app.controllers.GameRoomController import GameRoomController

TEMPLATE_DIR = os.path.abspath('app/views')
STATIC_DIR = os.path.abspath('app/statics')

print(TEMPLATE_DIR, STATIC_DIR)

app = Flask(__name__, template_folder=TEMPLATE_DIR, static_folder=STATIC_DIR)

app.config['SECRET_KEY'] = 'ManhMaidGameStudioSitoGameProject'
socketio = SocketIO(app)

@app.route('/')
def waitingroom():
    # player = 'Player ' + session
    player = None
    return WaitingRoomController.join(socketio, player)

#@app.route('/room/<id>', methods=['POST'])
#def room(id):
#    # player = 'Player ' + session
#    player = None 
#    return GameRoomController.join(socketio, id, player)

def messageReceived(methods=['GET', 'POST']):
    print('message was received!!!')

@socketio.on('my event')
def handle_my_custom_event(json, methods=['GET', 'POST']):
    print('received my event: ' + str(json))
    socketio.emit('my response', json, callback=messageReceived)

if __name__ == '__main__':
    socketio.run(app, debug=True)