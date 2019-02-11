var Water = /** @class */ (function () {
    function Water(volume, temperature) {
        this.volume = volume;
        this.temperature = temperature;
    }
    ;
    Water.prototype.boil = function (heaterPower, callback) {
        var _this = this;
        this.stopHeatUp();
        this.stopCoolDown();
        var spesificHead = 4200;
        var boildTemp = 100;
        var timeForBoil = Math.round(spesificHead * this.volume / 1000 * (boildTemp - this.temperature) / heaterPower); //sec
        var speed = (boildTemp - this.temperature) / timeForBoil;
        console.log('Start boil');
        var seconds = 0;
        this.intervalForBoiling = setInterval(function () {
            if (seconds >= timeForBoil && _this.temperature >= boildTemp) {
                _this.stopBoild();
                console.log('Water has been boiled');
                if (callback) {
                    callback();
                }
                return;
            }
            seconds++;
            _this.temperature += speed;
            console.log('Water temperature: ', _this.temperature.toFixed(2)); //закоментировать если не хотим показывать процесс нагревания
        }, 300);
    };
    Water.prototype.coolDown = function (to, speed) {
        var _this = this;
        if (this.intervalForBoiling) {
            return;
        }
        this.stopHeatUp();
        if (!this.intervalForCooling)
            console.log('water start to cool down to ' + to);
        this.stopCoolDown();
        this.intervalForCooling = setInterval(function () {
            if (_this.temperature <= to) {
                _this.temperature = to;
                _this.stopCoolDown();
                console.log('Water temperature: ', _this.temperature.toFixed(2));
                return;
            }
            _this.temperature -= speed;
            console.log('Water temperature: ', _this.temperature.toFixed(2)); //закоментировать если не хотим показывать процесс остывания
        }, 600);
    };
    Water.prototype.heatUp = function (toTemp, speed) {
        var _this = this;
        if (this.intervalForBoiling) {
            return;
        }
        this.stopHeatUp();
        this.stopCoolDown();
        if (!this.intervalForHeating)
            console.log('Start to heat up to ' + toTemp);
        this.intervalForHeating = setInterval(function () {
            if (_this.temperature === toTemp) {
                _this.stopHeatUp();
                return;
            }
            _this.temperature += speed;
            console.log('Water temperature: ', _this.temperature.toFixed(2)); //закоментировать если не хотим показывать процесс нагревания
        }, 600);
    };
    Water.prototype.addNewWater = function (newWater) {
        this.temperature = Math.round((this.temperature * this.volume + newWater.temperature * newWater.volume) / (this.volume + newWater.volume));
        this.volume += newWater.volume;
    };
    Water.prototype.decreaseVolume = function (volume) {
        if (this.volume >= volume) {
            this.volume -= volume;
        }
        else {
            throw new Error('Not enought water. There is only ' + this.volume + ' milliliters');
        }
    };
    Water.prototype.getTemperature = function () {
        return this.temperature;
    };
    Water.prototype.getVolume = function () {
        return this.volume;
    };
    Water.prototype.stopCoolDown = function () {
        if (this.intervalForCooling) {
            clearInterval(this.intervalForCooling);
            this.intervalForCooling = undefined;
        }
    };
    Water.prototype.stopHeatUp = function () {
        if (this.intervalForHeating) {
            clearInterval(this.intervalForHeating);
            this.intervalForHeating = undefined;
        }
    };
    Water.prototype.stopBoild = function () {
        if (this.intervalForBoiling) {
            clearInterval(this.intervalForBoiling);
            this.intervalForBoiling = undefined;
        }
    };
    return Water;
}());
var Kettle = /** @class */ (function () {
    function Kettle(power, volume) {
        this.power = power;
        this.volume = volume;
        this.water = new Water(0, 0);
        this.isTurned = false;
        this.ambientTemp = 25; //условная комнатная температура
    }
    ; //мощность - Вт, обьем - мл
    Kettle.prototype.addWater = function (newWater) {
        if (this.isExistEmptySpace(newWater.getVolume())) {
            this.water.addNewWater(newWater);
            if (this.water.getTemperature() > this.ambientTemp) {
                this.water.coolDown(this.ambientTemp, 1);
            }
            else if (this.water.getTemperature() < this.ambientTemp) {
                this.water.heatUp(this.ambientTemp, 1);
            }
        }
    };
    Kettle.prototype.turnOn = function () {
        if (this.water.getVolume() != 0 && this.isTurned == false) {
            this.isTurned = true;
            this.water.boil(this.power, this.turnOff.bind(this));
        }
        else {
            if (this.water.getVolume() === 0) {
                throw new Error('Kettle is empty');
            }
            else {
                throw new Error('Kettle is already on');
            }
        }
    };
    Kettle.prototype.turnOff = function () {
        if (this.isTurned == true) {
            this.isTurned = false;
            this.water.stopBoild();
            this.water.coolDown(this.ambientTemp, 1);
        }
        else {
            throw new Error('Kettle is already off');
        }
    };
    Kettle.prototype.pourOutWater = function (volume) {
        this.water.decreaseVolume(volume);
    };
    Kettle.prototype.getWater = function (volume) {
        this.pourOutWater(volume);
        return new Water(volume, this.water.getTemperature());
    };
    Kettle.prototype.changeAmbientTemp = function (to) {
        this.ambientTemp = to;
        if (this.water.getVolume() != 0) {
            if (this.ambientTemp < this.water.getTemperature()) {
                this.water.coolDown(to, 1);
            }
            else if (this.ambientTemp > this.water.getTemperature()) {
                this.water.heatUp(to, 1);
            }
        }
    };
    Kettle.prototype.isExistEmptySpace = function (volume) {
        if (this.volume - this.water.getVolume() >= volume) {
            return true;
        }
        throw new Error('Not enought empty space, you can add not more then ' + (this.volume - this.water.getVolume()) + ' milliliters');
        return false;
    };
    return Kettle;
}());
var kettle = new Kettle(2400, 1700);
window['_'] = kettle;
