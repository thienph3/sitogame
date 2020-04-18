from app.models import Room

class RoomController():
    def __init__(self):
        pass
    
    def addRoom(self, room):
        pass
    def removeRoom(self, room):
        pass
    
    def addPlayerToRoom(self, room, player):
        room.joinBy(player)
    def removePlayerFromRoom(self, room, player):
        room.leaveBy(player)
    