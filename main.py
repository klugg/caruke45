def on_received_string(receivedString):
    global globalSpeed, globalTurn
    if receivedString == "stop":
        globalSpeed = 0
        globalTurn = 0
    elif receivedString == "XfullForward":
        globalSpeed = 100
        globalTurn = 0
radio.on_received_string(on_received_string)

# Mottar enten «throttle» 10 eller -10
# Eller
# «turn» og fjernkontrollens sideveis horisontale vinkel/tilt.

def on_received_value(name, value):
    global globalSpeed, globalTurn
    if name == "throttle":
        globalSpeed += value
        if globalSpeed > 99:
            globalSpeed = 100
        if globalSpeed < -99:
            globalSpeed = -100
    elif name == "turn":
        globalTurn = value
radio.on_received_value(on_received_value)

globalSpeed = 0
globalTurn = 0
radio.set_group(99)
bitbot.select_model(BBModel.XL)
turn = 0
speed = 0
leftSpeed = 0
rightSpeed = 0
globalTurn = 0
reverse = 0
globalSpeed = 0
basic.show_number(5)

def on_every_interval():
    global turn, speed, reverse, leftSpeed, rightSpeed
    # Bruke lokale variabler
    turn = globalTurn
    speed = globalSpeed
    if speed < 0:
        speed = 0 - speed
        reverse = 1
    elif speed == 0:
        if turn < -10:
            bitbot.move(BBMotor.LEFT, BBDirection.REVERSE, (0 - turn) / 2)
            bitbot.move(BBMotor.RIGHT, BBDirection.FORWARD, (0 - turn) / 2)
        elif turn > 10:
            bitbot.move(BBMotor.LEFT, BBDirection.FORWARD, turn / 2)
            bitbot.move(BBMotor.RIGHT, BBDirection.REVERSE, turn / 2)
        else:
            bitbot.stop(BBStopMode.COAST)
    else:
        reverse = 0
    leftSpeed = speed
    rightSpeed = speed
    # Left turn
    if turn < -5:
        # Make turn a positive value
        turn = 0 - turn
        # Set leftSpeed to speed - turn percent of speed
        leftSpeed = speed - turn / 100 * speed
    elif turn > 5:
        # Set leftSpeed to set rightSpeed to speed - turn percent of speed
        rightSpeed = speed - turn / 100 * speed
    # forward
    if reverse:
        bitbot.move(BBMotor.LEFT, BBDirection.REVERSE, leftSpeed)
        bitbot.move(BBMotor.RIGHT, BBDirection.REVERSE, rightSpeed)
    elif speed != 0:
        bitbot.move(BBMotor.LEFT, BBDirection.FORWARD, leftSpeed)
        bitbot.move(BBMotor.RIGHT, BBDirection.FORWARD, rightSpeed)
    reverse = 0
    speed = 0
loops.every_interval(20, on_every_interval)
