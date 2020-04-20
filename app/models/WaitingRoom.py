from app.models.Singleton import Singleton

class WaitingRoom(metaclass=Singleton):
    def __init__(self):
        self.count = 0
        self.players = {}
        
    def join(self, player = None):
        if player is None:
            self.count += 1
            player = 'Player ' + str(self.count)
        
        isNewPlayer = player not in self.players
        if isNewPlayer:
            self.players[player] = 0
        
        r = list(self.players.keys())

        return (r, r.index(player), isNewPlayer)
    