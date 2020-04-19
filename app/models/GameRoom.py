from enum import Enum

class RoomState(Enum):
    INIT = 0
    FULL = 1
    #ALLREADY = 2
    LOADING = 3 #loading game in each client 
    START = 4
    END = 5

class PlayerState(Enum):
    INIT = -1
    JOINROOM = 0
    READY = 2
    LOADED = 3
    INGAME = 4
    ENDED = 5

class GameRoom():

    def __init__(self, name):
        self.name = name
        self.players = {}
        self.state = RoomState.INIT
        self.number_of_players = {
            PlayerState.JOINROOM = 0,
            PlayerState.READY = 0,
            PlayerState.INLOADING = 0,
            PlayerState.INGAME = 0
        }
        self.MAX = 3

    def isFull(self):
        return False
    def isEmpty(self):
        return False
    def add(self, player):
        return False
    def remove(self, player):
        return False
    def changeState(self, newState):
        return False

    # 1 Player join Room
    def joinBy(self, player, callback):
        if not self.isFull():
            self.add(player)
            f = self.isFull()
            if f:
                self.changeState(RoomState.FULL)
            if callback:
                callback(player, f)
            return True
        return False

    # 1 Player left Room
    def leaveBy(self, player, callback):
        if not self.isEmpty():
            self.remove(player)
            self.changeState(RoomState.INIT)
            if callback:
                callback(player)
            return True
        return False
    
    # 1 Player ready
    def readyBy(self, player, callback):
        if not self.isReady(player):
            self.changePlayerState(player, PlayerState.READY)
            f = self.allReady()
            if f:
                self.changeState(RoomState.LOADING)
            if callback:
                callback(player, f)
            return True
        return False
    
    # 1 Player unready
    def unreadyBy(self, player, callback):
        if self.isReady(player):
            self.changePlayerState(player, PlayerState.JOINROOM)
            self.changeState(RoomState.FULL)
            if callback:
                callback(player)
            return True
        return False
    
    # 1 Player loaded game
    def loadedBy(self, player, callback):
        if not self.isLoaded(player):
            self.changePlayerState(player, PlayerState.LOADED)
            f = self.allLoaded()
            if f:
                self.changeState(RoomState.START)
            if callback:
                callback(player, f)
            return True
        return False
    
    # 1 Player ended game
    def endedBy(self, player, callback):
        if not self.isEnded(player):
            self.changePlayerState(player, PlayerState.ENDED)
            f = self.allEndedBut1()
            if f:
                self.changeState(RoomState.END)
            if callback:
                callback(player, f)
            return True
        return False



