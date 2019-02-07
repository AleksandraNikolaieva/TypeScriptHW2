var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CoffeeIngredients = /** @class */ (function () {
    function CoffeeIngredients(volume) {
        this.volume = volume;
    }
    ;
    CoffeeIngredients.prototype.get = function (volume) {
        if (this.isEnought(volume) === true) {
            this.volume -= volume;
            return volume;
        }
        throw new Error('not enought ' + this.constructor.name);
    };
    CoffeeIngredients.prototype.isEnought = function (volume) {
        if (this.volume >= volume || volume === undefined) {
            return true;
        }
        else {
            throw new Error('not enought ' + this.constructor.name);
            return false;
        }
    };
    CoffeeIngredients.prototype.isExist = function (volume) {
        return this.isEnought(volume);
    };
    CoffeeIngredients.prototype.getVolume = function () {
        return this.volume;
    };
    CoffeeIngredients.prototype.add = function (ingredient) {
        this.volume += ingredient.volume;
    };
    return CoffeeIngredients;
}());
var Milk = /** @class */ (function (_super) {
    __extends(Milk, _super);
    function Milk(volume, expirationDate) {
        var _this = _super.call(this, volume) || this;
        _this.expirationDate = expirationDate;
        return _this;
    }
    Milk.prototype.add = function (ingredient) {
        if (ingredient.isNotExpired() && this.isNotExpired()) {
            _super.prototype.add.call(this, ingredient);
            this.expirationDate = this.expirationDate < ingredient.expirationDate ? this.expirationDate : ingredient.expirationDate;
        }
    };
    Milk.prototype.isNotExpired = function () {
        if (this.expirationDate >= new Date()) {
            return true;
        }
        throw new Error('Milk is expired');
        return false;
    };
    return Milk;
}(CoffeeIngredients));
var Water = /** @class */ (function (_super) {
    __extends(Water, _super);
    function Water(volume) {
        var _this = _super.call(this, volume) || this;
        _this.temperature = 20;
        return _this;
    }
    Water.prototype.heatUp = function () {
        this.temperature = 95;
        console.log('Water has been heated');
        this.coolDown();
    };
    Water.prototype.coolDown = function () {
        var _this = this;
        var intervalId = setInterval(function () {
            if (_this.temperature == 20) {
                clearInterval(intervalId);
            }
            _this.temperature--;
        }, 1000);
    };
    return Water;
}(CoffeeIngredients));
var CoffeeBeans = /** @class */ (function (_super) {
    __extends(CoffeeBeans, _super);
    function CoffeeBeans(volume) {
        return _super.call(this, volume) || this;
    }
    CoffeeBeans.prototype.grind = function (volume) {
        console.log(volume + ' gram of coffee has been grind');
    };
    return CoffeeBeans;
}(CoffeeIngredients));
var CoffeMachine = /** @class */ (function () {
    function CoffeMachine(milk, coffeeBeans, water, maxWaterVolume, maxCoffeeVolume, maxMilkVolume) {
        this.milk = milk;
        this.coffeeBeans = coffeeBeans;
        this.water = water;
        this.maxWaterVolume = maxWaterVolume;
        this.maxCoffeeVolume = maxCoffeeVolume;
        this.maxMilkVolume = maxMilkVolume;
    }
    ;
    CoffeMachine.prototype.getLatte = function () {
        var waterToCreate = 100;
        var coffeeBeansToCreate = 20;
        var milkToCreate = 100;
        var latte;
        if (this.has(waterToCreate, coffeeBeansToCreate, milkToCreate) === true && this.milk.isNotExpired()) {
            return latte = this.createCoffee('Latte', waterToCreate, coffeeBeansToCreate, milkToCreate);
        }
    };
    CoffeMachine.prototype.getExpresso = function () {
        var waterToCreate = 50;
        var coffeeBeansToCreate = 20;
        var expresso;
        if (this.has(waterToCreate, coffeeBeansToCreate) === true) {
            return expresso = this.createCoffee('Expresso', waterToCreate, coffeeBeansToCreate);
        }
    };
    CoffeMachine.prototype.getCappuchino = function () {
        var waterToCreate = 100;
        var coffeeBeansToCreate = 20;
        var milkToCreate = 50;
        var cappuchino;
        if (this.has(waterToCreate, coffeeBeansToCreate, milkToCreate) === true && this.milk.isNotExpired()) {
            return cappuchino = this.createCoffee('Cappuchino', waterToCreate, coffeeBeansToCreate, milkToCreate);
        }
    };
    CoffeMachine.prototype.addWater = function (newWater) {
        if (newWater.getVolume() <= this.maxWaterVolume - this.water.getVolume()) {
            this.water.add(newWater);
        }
        else {
            var emptySpace = this.maxWaterVolume - this.water.getVolume();
            throw new Error('You can add not more then ' + emptySpace);
        }
    };
    CoffeMachine.prototype.addCoffeeBeens = function (newCoffeeBeans) {
        if (newCoffeeBeans.getVolume() <= this.maxCoffeeVolume - this.coffeeBeans.getVolume()) {
            this.coffeeBeans.add(newCoffeeBeans);
        }
        else {
            var emptySpace = this.maxWaterVolume - this.coffeeBeans.getVolume();
            throw new Error('You can add not more then ' + emptySpace);
        }
    };
    CoffeMachine.prototype.addMilk = function (newMilk) {
        if (newMilk.getVolume() <= this.maxMilkVolume - this.milk.getVolume()) {
            this.milk.add(newMilk);
        }
        else {
            var emptySpace = this.maxWaterVolume - this.milk.getVolume();
            throw new Error('You can add not more then ' + emptySpace);
        }
    };
    //#############################
    CoffeMachine.prototype.createCoffee = function (name, waterVolume, coffeeBeansWeight, milkVolume) {
        var waterToMake = this.water.get(waterVolume);
        var coffeeBeansToMake = this.coffeeBeans.get(coffeeBeansWeight);
        var makeMilk;
        if (milkVolume !== undefined) {
            this.milk.get(milkVolume);
        }
        this.coffeeBeans.grind(coffeeBeansToMake);
        this.water.heatUp();
        return {
            name: name,
            description: 'Created'
        };
    };
    CoffeMachine.prototype.has = function (waterVolume, coffeeBeansWeight, milkVolume) {
        if (this.water.isExist(waterVolume) !== true) {
            return false;
        }
        if (this.milk.isExist(milkVolume) !== true) {
            return false;
        }
        if (this.coffeeBeans.isExist(coffeeBeansWeight) !== true) {
            return false;
        }
        return true;
    };
    return CoffeMachine;
}());
var coffeeMachine = new CoffeMachine(new Milk(100, new Date(2019, 2, 3)), new CoffeeBeans(100), new Water(300), 1000, 400, 1000);
console.log(coffeeMachine.getLatte());
console.log(coffeeMachine);
