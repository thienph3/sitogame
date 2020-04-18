# Khi vừa Login xong thì sẽ vô PlayerController trả về trang: Chơi & Thoát
# Khi chọn Chơi thì sẽ vô PlayerController
#   , PlayerController sẽ request RoomController findRoom
#   , Nếu RoomController find thành công thì sẽ addPlayer vô Room đó
#   , Nếu Room đủ Player thì RoomController sẽ start Game
#   , Nếu tất cả Player đã load Game xong thì Game chính thức bắt đầu
#   , Khi nào chỉ còn 1 Player còn sống sót thì Game kết thúc
#   , Lúc này Player được ra khỏi phòng và trả về cho PlayerController
#   , Player sẽ có 2 lựa chọn là Chơi & Thoát như lúc vừa Login.
# Khi chọn Thoát thì sẽ out Game.

# Client -> PlayerController -> RoomController -> Game -> (Monsters, Humans)
# Client: login, (findRoom, ready, loaded, click) & quit
# PlayerController: addPlayer, (findRoom, ready, loaded, click) & removePlayer
# RoomController: (findRoom -> found, ready -> load, loaded -> start, started -> click)
# Game: (init, updatePos, updateDeltaPos, checkCollision, checkPlayerDead)