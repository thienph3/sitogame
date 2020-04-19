from app.models import MovingObject
from app.models.enum import Frame 
import random

class Humans(MovingObject):
    def __init__(self,
                 color, 
                 radius, 
                 **kwargs):
        super(Humans, self).__init__(color, radius, **args, **kwargs)
        
    def checkDead(self, **monsters):
        for monster in monsters:
            if self.isCollision(monster):
                self.isDead = True


if __name__ == "__main__":
    a_human =  Humans((255, 0, 0 ), 10)
    print(a_human)
     
        
            

