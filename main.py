from flask import Flask, render_template
from flask_socketio import SocketIO
import os

TEMPLATE_DIR = os.path.abspath('app/views')
STATIC_DIR = os.path.abspath('app/plugins')

print(TEMPLATE_DIR, STATIC_DIR)

app = Flask(__name__, template_folder=TEMPLATE_DIR, static_folder=STATIC_DIR)

app.config['SECRET_KEY'] = 'ManhMaidGameStudioSitoGameProject'
socketio = SocketIO(app)

@app.route('/')
def sessions():
    return render_template('session.html')

def messageReceived(methods=['GET', 'POST']):
    print('message was received!!!')

@socketio.on('my event')
def handle_my_custom_event(json, methods=['GET', 'POST']):
    print('received my event: ' + str(json))
    socketio.emit('my response', json, callback=messageReceived)

if __name__ == '__main__':
    socketio.run(app, debug=True)