import math 
from app.models.enum import Frame 
import random


#TODO
# -create and object with color, shape 
#
#Supper init from BaseObject 
class MovingObject():
    ''' Every Moving Object will have some: 
        - attribute of the object: color, radius,topleft  --> create a shape
        - attribute of movement: speed, deltaVector, crrPos 
        - attribute of collision: with other same object, with Wall   
    ''' 
    def __init__(self, 
                 color, 
                 radius, 
                 crrPos=(random.randint(0, int(Frame.FRAME_WEIGHT.value)), random.randint(0, int(Frame.FRAME_HEIGHT.value))), 
                 speed=4, 
                 deltaVector=(0, 0),
                 isDead=False
                 ): 
        self.color = color # vd (255, 0, 0)
        self.radius = radius
        self.crrPos =  crrPos
        self.speed = speed
        self.isDead = isDead
        self.deltaVector = deltaVector
    
    @property
    def deltaPos(self):
        ''' Position in the next frame''' 
        return (self.crrPos[0] + self.deltaVector[0], self.crrPos[1] + self.deltaVector[1])

    @property
    def topLeft(self):
        ''' From central return Top Left to render''' 
        return (self.crrPos[0]-self.radius, self.crrPos[1]+self.radius)
         
    def updatePos(self):
        ''' update when player move to a new pos'''
        self.crrPos = self.crrPos + self.deltaVector

    def calcDistanceToObject(self, otherObj):
        ''' Calc distance bw 2 points '''  
        otherPos = otherObj.crrPos
        return math.sqrt(pow(self.crrPos[0] - otherPos[0], 2) + pow(self.crrPos[1] - otherPos[1], 2)) - (self.radius + otherObj.radius) 

    def calcDistance(self, otherPos):
        return math.sqrt(pow(self.crrPos[0] - otherPos[0], 2) + pow(self.crrPos[1] - otherPos[1], 2))

    @property
    def delta(self, destPos = None): 
        ''' Delta is distance within a frame ''' 
        return self.speed / int(Frame.FPS.value)

    def isCollision(self, **otherObjs):
        for otherObj in otherObjs:
            if calcDistance(otherObj) <= 0:
                return True 
        return False 

    def collideWithWall(self):
        # left and right wall 
        if self.crrPos[0] - self.radius <= 0  or self.crrPos[0] + self.radius >= int(Frame.FRAME_WEIGHT.value):
            self.deltaVector[0] = -self.deltaVector[0]
        if self.crrPos[1] - self.radius <=0 or self.crrPos[1] + self.radius >= int(Frame.FRAME_HEIGHT.value):
            self.deltaVector[1] = -self.deltaVector[1]

    def collideWithObjectSameType(self, **otherObj):
        ''' - Moving Object collide with: 
            + with statics object (if statics object otherdeltaVector = (0,0) -> tạm thời để stop vì chưa biết code) 
            + with another SAME object () ''' 
        # check lại phần sum của 2 vectors: 
        sumOtherObjsDeltaVector = (0, 0)
        for obj in otherObjs:
            sumOtherObjsDeltaVector[0] += obj.deltaVector[0]
            sumOtherObjsDeltaVector[1] += obj.deltaVector[1]
        # va chạm với lực khác >0: 
        if sumOtherObjsDeltaVector==(0, 0): # TODO: define default force for current vector : define va chạm với 1 lực (0,0) -> xác định tangent line:
            self.deltaVector = (0,0)   
        # va chạm với lực khác =0: 
        else: 
            self.deltaVector = (sumOtherObjsDeltaVector[0] - self.deltaVector[0], sumOtherObjsDeltaVector[1] - self.deltaVector[1])

    def whenClick(self, clickPos): 
        ''' Update DeltaPos will be called in 2 scenarios: 
            - An event clicks
            - Calcuate a vector prepresent the distance the humans can move within a frame 
        deltaPos = A * (1-delta)/ distance +  C * (delta) / distance
        ''' 
        distance = self.calcDistance(clickPos)
        x = self.crrPos[0]*(distance-self.delta) / self.calcDistance(clickPos)  +  clickPos[0]*self.delta / self.calcDistance(clickPos) 
        y = self.crrPos[1]*(distance-self.delta) / self.calcDistance(clickPos)  +  clickPos[1]*self.delta / self.calcDistance(clickPos)
        self.deltaVector =(x - self.crrPos[0], y - self.crrPos[1])

if __name__ == "__main__":
    a_human = MovingObject((255, 0, 0 ), 10)
    b_monster = MovingObject((255, 0, 0 ), 10, crrPos=(4,5), speed =5) 
    print('monster', b_monster.crrPos)
    print('test : ', a_human.topLeft)
    print('distance to monster' , a_human.calcDistanceToObject(b_monster))
    print('deltapos', a_human.deltaPos)
    print('delta', a_human.delta)
    print('topLeft', a_human.topLeft)
    print('curr', a_human.crrPos)
    a_human.whenClick((2,3))
    print(a_human.crrPos)

