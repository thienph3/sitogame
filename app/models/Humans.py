from app.models.MovingObject import MovingObject
from app.models.enum import Frame 
import random

class Humans(MovingObject):
    def __init__(self,
                 color, 
                 radius,
                 *args,
                 **kwargs):
        super().__init__(color, radius, *args, **kwargs)
        # self.color = color 
        # self.radius = radius
        
    def checkDead(self, **monsters):
        for monster in monsters:
            if self.isCollision(monster):
                self.isDead = True


if __name__ == "__main__":
    a_human =  Humans((255, 0, 0 ), 10, speed=4)
    print(a_human)

     
        
            

