from app.models import GameRoom

class GameRoomController():
    def __init__(self):
        pass
    
    def addRoom(self, room):
        pass
    def removeRoom(self, room):
        pass
    
    def join(self, roomId, player):
        room.joinBy(player)
    def removePlayerFromRoom(self, room, player):
        room.leaveBy(player)
    