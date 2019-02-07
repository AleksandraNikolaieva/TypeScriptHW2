var Water = /** @class */ (function () {
    function Water(volume, temperature, outerTemp) {
        this.volume = volume;
        this.temperature = temperature;
        this.outerTemp = outerTemp;
        this.spesificHead = 4200; //удельная теплоемкость воды при нормальном давлении (Дж)
        this.boildTemp = 100; //температура кипения воды (C)
    }
    ;
    Water.prototype.boild = function (secForBoild, growSpeed, callback) {
        var _this = this;
        console.log('Water is heating up');
        var seconds = 0;
        this.intervalForBoiling = setInterval(function () {
            if (seconds >= secForBoild) {
                clearInterval(_this.intervalForBoiling);
                console.log('Water is boiled');
                callback();
                return;
            }
            seconds++;
            _this.temperature += growSpeed;
            console.log('Water temperature: ', _this.temperature.toFixed(2)); //закоментировать если не хотим показывать процесс нагревания
        }, 300);
    };
    Water.prototype.coolDown = function () {
        var _this = this;
        var speed = 3;
        console.log('Start to cool down');
        if (this.intervalForCooling) {
            clearInterval(this.intervalForCooling);
        }
        this.intervalForCooling = setInterval(function () {
            if (_this.temperature <= _this.outerTemp) {
                clearInterval(_this.intervalForCooling);
                return;
            }
            _this.temperature -= speed;
            console.log('Water temperature: ', _this.temperature.toFixed(2)); //закоментировать если не хотим показывать процесс остывания
        }, 600);
    };
    Water.prototype.heatUp = function (toTemp) {
        var _this = this;
        console.log('Heating up');
        if (this.intervalForHeating) {
            clearInterval(this.intervalForHeating);
        }
        this.intervalForHeating = setInterval(function () {
            if (_this.temperature === toTemp) {
                clearInterval(_this.intervalForHeating);
            }
            _this.temperature++;
            console.log('Water temperature: ', _this.temperature); //закоментировать если не хотим показывать процесс нагревания
        }, 600);
    };
    Water.prototype.addNewWater = function (newWater) {
        this.volume += newWater.volume;
        this.temperature = Math.round((this.temperature * this.volume + newWater.temperature * newWater.volume) / (this.volume + newWater.volume));
        if (this.temperature > this.outerTemp && !this.intervalForBoiling) {
            this.coolDown();
        }
        else if (this.temperature < this.outerTemp) {
            this.heatUp(this.outerTemp);
        }
    };
    Water.prototype.changeOuterTemp = function (to) {
        this.outerTemp = to;
    };
    Water.prototype.decreaseVolume = function (volume) {
        this.volume -= volume;
    };
    Water.prototype.getTemperature = function () {
        return this.temperature;
    };
    Water.prototype.getVolume = function () {
        return this.volume;
    };
    Water.prototype.getspesificHead = function () {
        return this.spesificHead;
    };
    Water.prototype.getOuterTemp = function () {
        return this.outerTemp;
    };
    Water.prototype.getBoilingInterval = function () {
        return this.intervalForBoiling;
    };
    Water.prototype.getCoolingInterval = function () {
        return this.intervalForCooling;
    };
    return Water;
}());
var TeaPot = /** @class */ (function () {
    function TeaPot(power, volume) {
        this.power = power;
        this.volume = volume;
        this.water = new Water(0, 25, 25);
        this.isTurned = false;
    }
    ; //мощность - Вт, обьем - мл
    TeaPot.prototype.addWater = function (newWater) {
        if (this.isExistEmptySpace(newWater.getVolume())) {
            this.water.addNewWater(newWater);
        }
    };
    TeaPot.prototype.turnOn = function () {
        if (this.water.getVolume() != 0 && this.isTurned == false) {
            clearInterval(this.water.getCoolingInterval());
            this.isTurned = true;
            var timeForBoil = Math.round(this.water.getspesificHead() * this.water.getVolume() / 1000 * (this.water.boildTemp - this.water.getTemperature()) / this.power); //sec
            var speed = (this.water.boildTemp - this.water.getTemperature()) / timeForBoil;
            this.water.boild(timeForBoil, speed, this.turnOff.bind(this));
        }
        else {
            if (this.water.getVolume() === 0) {
                throw new Error('Teapot is empty');
            }
            else {
                throw new Error('Teapot is already on');
            }
        }
    };
    TeaPot.prototype.turnOff = function () {
        if (this.isTurned == true) {
            this.isTurned = false;
            clearInterval(this.water.getBoilingInterval());
            this.water.coolDown();
        }
        else {
            throw new Error('Teapot is already off');
        }
    };
    TeaPot.prototype.pourOutWater = function (volume) {
        if (this.isExistWaterVolume(volume)) {
            this.water.decreaseVolume(volume);
        }
    };
    TeaPot.prototype.getWater = function (volume) {
        if (this.isExistWaterVolume(volume)) {
            this.pourOutWater(volume);
            return new Water(volume, this.water.getTemperature(), this.water.getOuterTemp());
        }
    };
    TeaPot.prototype.changeTeaPotPlace = function (toTemperature) {
        this.water.changeOuterTemp(toTemperature);
    };
    TeaPot.prototype.isExistWaterVolume = function (volume) {
        if (this.water.getVolume() > volume) {
            return true;
        }
        throw new Error('Not enought water in teapot. There is only ' + this.water.getVolume() + ' milliliters');
        return false;
    };
    TeaPot.prototype.isExistEmptySpace = function (volume) {
        if (this.volume - this.water.getVolume() > volume) {
            return true;
        }
        throw new Error('Not enought empty space, you can add not more then ' + (this.volume - this.water.getVolume()) + ' milliliters');
        return false;
    };
    return TeaPot;
}());
var teaPot = new TeaPot(2400, 1700);
teaPot.addWater(new Water(400, 25, 25));
console.log(teaPot);
teaPot.turnOn();
//если вы дочитали до этого места обьясните как получить сюда кипяток :) 
//*вывести в консоль понимаю как, а как получить в основной поток кода чтобы иметь возможность с ним что-то делать дальше нет.
