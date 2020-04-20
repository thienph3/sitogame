from flask import Blueprint, render_template
from app.models import GameRoom

game_room = Blueprint('game_room', __name__, url_prefix='/game-room')


@game_room.route('/')
def room():
    return render_template('GameRoom/list.html', rooms=[
        'rom-1', 'rom-2', 'rom-3', 'rom-4'
    ])

@game_room.route('/list', methods=['GET'])
def get_rooms():
    return { 'isSuccess': True, 'data': { 'list': [] } }

@game_room.route('/create', methods=['POST']) 
def create_room():
    pass

@game_room.route('/<rom_id>')
def get_room(rom_id):
    return render_template('GameRoom/detail.html')

@game_room.route('/<rom_id>', methods=['PUT'])
def update_room():
    return { isSuccess: True, 'data': {  } }

@game_room.route('/<rom_id>', methods=['DELETE']) 
def remove_room(rom_id):
    # TODO: remove

    return room_id

@game_room.route('/join/<rom_id>/<player_id>', methods=['POST'])
def join(rom_id, player_id):
    room.joinBy(player_id)

@game_room.route('/leave/<rom_id>/<player_id>', methods=['POST'])
def leave(rom_id, player_id):
    room.leaveBy(player_id)
