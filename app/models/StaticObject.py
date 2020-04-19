# to define static object (object which does not move ex: tree, wall )
# Super Init frSom base object 
from app.models import BaseObject

class StatisObject(BaseObject):
    def __init__(self):
        pass  


class Wall(StatisObject):
    def __init__(self):
        pass 

    