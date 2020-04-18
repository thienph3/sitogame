from app.models.Singleton import Singleton

class WaitingRoom():

    __instance = None

    @staticmethod 
    def getInstance():
        """ Static access method. """
        if WaitingRoom.__instance == None:
            WaitingRoom()
        return WaitingRoom.__instance
    
    def __init__(self):
        """ Virtually private constructor. """
        if WaitingRoom.__instance != None:
            raise Exception("This class is a singleton!")
        else:
            WaitingRoom.__instance = self
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
    