from app.models.MovingObject import MovingObject
from app.models.enum import Frame 
import random 
class Monsters(MovingObject):
    def __init__(self,
                 color, 
                 radius,
                 deltaVector = (random.randint(0, 4), random.randint(0, 6)),
                 *args,
                 **kwargs):
        super().__init__(color, radius,deltaVector=deltaVector, *args, **kwargs)


if __name__ == "__main__":
    a_monster = Monsters((255, 0, 0 ), 4, speed=7)
    print(a_monster.deltaVector)




