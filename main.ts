radio.onReceivedString(function (receivedString) {
    if (receivedString == "stop") {
        globalSpeed = 0
        globalTurn = 0
    } else if (receivedString == "XfullForward") {
        globalSpeed = 100
        globalTurn = 0
    }
})
// Mottar enten «throttle» 10 eller -10
// Eller
// «turn» og fjernkontrollens sideveis horisontale vinkel/tilt.
radio.onReceivedValue(function (name, value) {
    if (name == "throttle") {
        globalSpeed += value
        if (globalSpeed > 99) {
            globalSpeed = 100
        }
        if (globalSpeed < -99) {
            globalSpeed = -100
        }
    } else if (name == "turn") {
        globalTurn = value
    }
})
let rightSpeed = 0
let leftSpeed = 0
let reverse = 0
let speed = 0
let turn = 0
let globalSpeed = 0
let globalTurn = 0
radio.setGroup(99)
bitbot.select_model(BBModel.XL)
globalTurn = 0
globalSpeed = 0
basic.showNumber(4)
loops.everyInterval(20, function () {
    // Bruke lokale variabler
    turn = globalTurn
    speed = globalSpeed
    if (speed < 0) {
        speed = 0 - speed
        reverse = 1
    } else if (speed == 0) {
        if (turn < -10) {
            bitbot.move(BBMotor.Left, BBDirection.Reverse, (0 - turn) / 2)
            bitbot.move(BBMotor.Right, BBDirection.Forward, (0 - turn) / 2)
        } else if (turn > 10) {
            bitbot.move(BBMotor.Left, BBDirection.Forward, turn / 2)
            bitbot.move(BBMotor.Right, BBDirection.Reverse, turn / 2)
        } else {
            bitbot.stop(BBStopMode.Coast)
        }
    } else {
        reverse = 0
    }
    leftSpeed = speed
    rightSpeed = speed
    // Left turn
    if (turn < -5) {
        // Make turn a positive value
        turn = 0 - turn
        // Set leftSpeed to speed - turn percent of speed
        leftSpeed = speed - turn / 100 * speed
    } else if (turn > 5) {
        // Set leftSpeed to set rightSpeed to speed - turn percent of speed
        rightSpeed = speed - turn / 100 * speed
    }
    // forward
    if (reverse) {
        bitbot.move(BBMotor.Left, BBDirection.Reverse, leftSpeed)
        bitbot.move(BBMotor.Right, BBDirection.Reverse, rightSpeed)
    } else if (speed != 0) {
        bitbot.move(BBMotor.Left, BBDirection.Forward, leftSpeed)
        bitbot.move(BBMotor.Right, BBDirection.Forward, rightSpeed)
    }
    reverse = 0
    speed = 0
})
