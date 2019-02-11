class CoffeeIngredients {
    constructor(volume) {
        this.volume = volume;
    }
    ;
    get(volume) {
        if (this.isEnought(volume) === true) {
            this.volume -= volume;
            return volume;
        }
    }
    isEnought(volume) {
        if (this.volume >= volume || volume === undefined) {
            return true;
        }
        else {
            throw new Error('not enought ' + this.constructor.name);
            return false;
        }
    }
    isExist(volume) {
        return this.isEnought(volume);
    }
    getVolume() {
        return this.volume;
    }
    add(ingredient) {
        this.volume += ingredient.volume;
    }
}
class Milk extends CoffeeIngredients {
    constructor(volume, expirationDate) {
        super(volume);
        this.expirationDate = expirationDate;
    }
    add(newMilk) {
        if (newMilk.isNotExpired() && this.isNotExpired()) {
            super.add(newMilk);
            this.expirationDate = this.expirationDate < newMilk.expirationDate ? newMilk.expirationDate : this.expirationDate;
        }
    }
    isNotExpired() {
        if (this.expirationDate >= new Date()) {
            return true;
        }
        throw new Error('Milk is expired');
        return false;
    }
}
class Water extends CoffeeIngredients {
    constructor(volume) {
        super(volume);
        this.temperature = 20;
    }
    heatUp() {
        clearInterval(this.intervalIdforCooling);
        clearInterval(this.intervalIdforHeading);
        return new Promise((resolve, reject) => {
            console.log('Water start to heat up');
            this.intervalIdforHeading = setInterval(() => {
                if (this.temperature >= 92) {
                    console.log('Water has been heated to 92 degrees');
                    clearInterval(this.intervalIdforHeading);
                    resolve();
                    this.coolDown(87);
                    return;
                }
                this.temperature++;
                console.log(this.temperature);
            }, 100);
        });
    }
    coolDown(to) {
        clearInterval(this.intervalIdforCooling);
        return new Promise((resolve, reject) => {
            console.log('Water start to cool down');
            this.intervalIdforCooling = setInterval(() => {
                if (this.temperature == to) {
                    clearInterval(this.intervalIdforCooling);
                    resolve();
                    this.heatUp();
                    return;
                }
                this.temperature--;
                console.log(this.temperature);
            }, 4000);
        });
    }
}
class CoffeeBeans extends CoffeeIngredients {
    constructor(volume) {
        super(volume);
    }
    grind(volume) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(volume + ' gram of coffee has been ground');
                resolve();
            }, 1000);
        });
    }
}
class CoffeeMachine {
    constructor(milk, coffeeBeans, water, maxWaterVolume, maxCoffeeBeansVolume, maxMilkVolume) {
        this.milk = milk;
        this.coffeeBeans = coffeeBeans;
        this.water = water;
        this.maxWaterVolume = maxWaterVolume;
        this.maxCoffeeBeansVolume = maxCoffeeBeansVolume;
        this.maxMilkVolume = maxMilkVolume;
    }
    ;
    getLatte() {
        const waterToCreate = 100;
        const coffeeBeansToCreate = 20;
        const milkToCreate = 100;
        let latte;
        if (this.has(waterToCreate, coffeeBeansToCreate, milkToCreate) === true && this.milk.isNotExpired()) {
            this.createCoffee('Latte', waterToCreate, coffeeBeansToCreate, milkToCreate);
        }
    }
    getExpresso() {
        const waterToCreate = 50;
        const coffeeBeansToCreate = 20;
        let expresso;
        if (this.has(waterToCreate, coffeeBeansToCreate) === true) {
            this.createCoffee('Expresso', waterToCreate, coffeeBeansToCreate);
        }
    }
    getCappuchino() {
        const waterToCreate = 100;
        const coffeeBeansToCreate = 20;
        const milkToCreate = 50;
        let cappuchino;
        if (this.has(waterToCreate, coffeeBeansToCreate, milkToCreate) === true && this.milk.isNotExpired()) {
            this.createCoffee('Cappuchino', waterToCreate, coffeeBeansToCreate, milkToCreate);
        }
    }
    addWater(newWater) {
        if (this.isEnoughtEmtySpace(newWater)) {
            this.water.add(newWater);
        }
    }
    addCoffeeBeans(newCoffeeBeans) {
        if (this.isEnoughtEmtySpace(newCoffeeBeans)) {
            this.coffeeBeans.add(newCoffeeBeans);
        }
    }
    addMilk(newMilk) {
        if (this.isEnoughtEmtySpace(newMilk)) {
            this.milk.add(newMilk);
        }
    }
    //#############################
    createCoffee(name, waterVolume, coffeeBeansWeight, milkVolume) {
        const waterToMake = this.water.get(waterVolume);
        const coffeeBeansToMake = this.coffeeBeans.get(coffeeBeansWeight);
        let makeMilk;
        if (milkVolume !== undefined) {
            this.milk.get(milkVolume);
        }
        this.coffeeBeans.grind(coffeeBeansToMake)
            .then(() => {
            return this.water.heatUp();
        })
            .then(() => {
            console.log({ name: name, description: 'Created' });
        });
    }
    has(waterVolume, coffeeBeansWeight, milkVolume) {
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
    }
    isEnoughtEmtySpace(forIngredient) {
        let emptySpace;
        switch (forIngredient.constructor.name) {
            case 'Water':
                emptySpace = this.maxWaterVolume - this.water.getVolume();
                break;
            case 'CoffeeBeans':
                emptySpace = this.maxCoffeeBeansVolume - this.coffeeBeans.getVolume();
                break;
            case 'Milk':
                emptySpace = this.maxMilkVolume - this.milk.getVolume();
                break;
        }
        if (forIngredient.getVolume() <= emptySpace) {
            return true;
        }
        else {
            throw new Error('You can add not more then ' + emptySpace);
            return false;
        }
    }
}
const cm = new CoffeeMachine(new Milk(100, new Date(2019, 2, 3, 23, 59, 59)), new CoffeeBeans(100), new Water(300), 1000, 400, 1000);
window['_'] = cm;
