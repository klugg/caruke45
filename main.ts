radio.onReceivedString(function (receivedString) {
    if (receivedString == "stop") {
        speed = 0
        turn = 0
    } else if (receivedString == "fullForward") {
        speed = 100
        turn = 0
    } else {
        turn = 0
    }
})
radio.onReceivedValue(function (name, value) {
    if (name == "throttle") {
        speed += value
        if (speed > 99) {
            speed = 100
        }
        if (speed < -99) {
            speed = -100
        }
    } else if (name == "turn") {
        turn = value
    }
})
let speed = 0
let turn = 0
radio.setGroup(99)
bitbot.bbEnableBluetooth(BBBluetooth.btEnable)
bitbot.select_model(BBModel.XL)
turn = 0
speed = 0
let leftSpeed = 1
let rightSpeed = 1
let turnTweak = 2
basic.showNumber(5)
loops.everyInterval(20, function () {
    if (speed != 0) {
        if (turn < -10) {
            if (leftSpeed < 0) {
                leftSpeed = speed + 0
            } else {
                leftSpeed = speed + turn
                rightSpeed = speed
            }
        } else if (turn > 10) {
            if (rightSpeed < 0) {
                rightSpeed = speed - turn
            } else {
                leftSpeed = speed
                rightSpeed = speed - turn
            }
        } else {
            leftSpeed = speed
            rightSpeed = speed
        }
        if (leftSpeed < 0) {
            bitbot.move(BBMotor.Left, BBDirection.Reverse, 0 - leftSpeed)
        } else {
            bitbot.move(BBMotor.Left, BBDirection.Forward, leftSpeed)
        }
        if (rightSpeed < 0) {
            bitbot.move(BBMotor.Right, BBDirection.Reverse, 0 - rightSpeed)
        } else {
            bitbot.move(BBMotor.Right, BBDirection.Forward, rightSpeed)
        }
    } else {
        bitbot.stop(BBStopMode.Coast)
    }
})
