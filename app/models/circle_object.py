#TODO
# -create and object with color, shape 

class CircleObject():
    # attribute of the object: color, radius, --> create a shape
    # attribute of position: get_pos() 
    # attribute of movement: speed , nxtPos, crrPos, 
    # attribute of collision: side 
    def __init__(self, rgbColor, crrPos, w, h): 
        ''' w, h is the weight and hight of the frame''' 
        self.w = w 
        self.h = h
        self.color = rgbColor # vd (255, 0, 0)
        self.radius = self.getRadius() 
        self.pos = pos  
        self.crrPos = None 
        self.nxtPos = None # the position right after this position
        self.destPos = None  # destination 
        self.speed = None
        self.central = self.getCentral() # tâm hình tròn 

    
    def getRadius(self):
        return self.w // 20
        
    def getCentral(self):
        return (self.pos[0]-self.radius, self.pos[1]+self.radius)

    def updatePos(self):
        ''' update when player move to a new pos''' 
        pass 

    @staticmethod
    def calcDistance(pos_1, pos_2):
        '''calc distance bw 2 points''' 
        return 

    @staticmethod
    def moveTo(destPos, speed):
        ''' when player click on a new nxtPos, 
        the object will update its crrPos until get the destPos  
        input: destPos
        return: True if self.crrPos == self.nxtPos
        ''' 
        while not self.crrPos == self.nxtPos: 
            self.crrPos = self.calcNextPos() 
            if CircleObject.isCollision() == True:
                return False  # đang viet
        return  True 
    
    @staticmethod 
    def isCollision(self):
        '''If crrPos is overlap with another object''' 
        return False

if __name__ == "__main__":
    human = GameObject((255, 0, 0 )), (0, 0), 480, 270) 


