abstract class CoffeeIngredients {
	constructor(private volume: number) {};

	public get(volume: number): number {
		if(this.isEnought(volume) === true) {
			this.volume -= volume;
			return volume;
		}
		throw new Error('not enought ' + (<any>this).constructor.name);
	}

	private isEnought(volume: number): boolean {
		if(this.volume >= volume || volume === undefined) {
			return true;
		} else {
			throw new Error('not enought ' + (<any>this).constructor.name);
			return false;
		}
	}

	public isExist(volume: number): boolean {
		return this.isEnought(volume);
	}

	public getVolume(): number {
		return this.volume;
	}

	public add(ingredient: CoffeeIngredients): void {
		this.volume += ingredient.volume;
	}
}

class Milk extends CoffeeIngredients {
	constructor(volume: number, private expirationDate: Date) { 
		super(volume);
	}

	add(ingredient: Milk): void {
		if(ingredient.isNotExpired() && this.isNotExpired()) {
			super.add(ingredient);
			this.expirationDate = this.expirationDate < ingredient.expirationDate ? this.expirationDate : ingredient.expirationDate;
		}
	}

	public isNotExpired(): boolean {
		if(this.expirationDate >= new Date()) {
			return true;
		}
		throw new Error('Milk is expired');
		return false;
	}
}

class Water extends CoffeeIngredients {
	private temperature: number = 20;
	constructor(volume: number) { 
		super(volume);
	}

	public heatUp(): void {
		this.temperature = 95;
		console.log('Water has been heated');
		this.coolDown();
	}

	private coolDown() {
		let intervalId = setInterval(() => {
			if(this.temperature == 20) {
				clearInterval(intervalId);
			}
			this.temperature--;
		}, 1000)
	}
}

class CoffeeBeans extends CoffeeIngredients {
	constructor(volume: number) { 
		super(volume);
	}

	public grind(volume: number): void {
		console.log(volume + ' gram of coffee has been grind');
	}
}

interface ICoffee {
	name: string;
	description: string
}

class CoffeMachine {

	constructor(
		private milk: Milk,
		private coffeeBeans: CoffeeBeans,
		private water: Water,
		private maxWaterVolume: number,
		private maxCoffeeVolume: number,
		private maxMilkVolume: number
		) {};

	public getLatte(): ICoffee {
		const waterToCreate: number = 100;
		const coffeeBeansToCreate: number = 20;
		const milkToCreate: number = 100;
		let latte;

		if(this.has(waterToCreate, coffeeBeansToCreate, milkToCreate) === true && this.milk.isNotExpired()) {
			return latte = this.createCoffee('Latte', waterToCreate, coffeeBeansToCreate, milkToCreate);
		}
	}

	public getExpresso(): ICoffee {
		const waterToCreate: number = 50;
		const coffeeBeansToCreate: number = 20;
		let expresso;

		if(this.has(waterToCreate, coffeeBeansToCreate) === true) {
			return expresso = this.createCoffee('Expresso', waterToCreate, coffeeBeansToCreate);
		}
	}

	public getCappuchino(): ICoffee {
		const waterToCreate: number = 100;
		const coffeeBeansToCreate: number = 20;
		const milkToCreate: number = 50;
		let cappuchino;

		if(this.has(waterToCreate, coffeeBeansToCreate, milkToCreate) === true && this.milk.isNotExpired()) {
			return cappuchino = this.createCoffee('Cappuchino', waterToCreate, coffeeBeansToCreate, milkToCreate);
		}
	}

	public addWater(newWater: Water): void{
		if(newWater.getVolume() <= this.maxWaterVolume - this.water.getVolume()) {
			this.water.add(newWater);
		} else {
			let emptySpace: number = this.maxWaterVolume - this.water.getVolume();
			throw new Error('You can add not more then ' + emptySpace);
		}
	}

	public addCoffeeBeens(newCoffeeBeans: CoffeeBeans): void {
		if(newCoffeeBeans.getVolume() <= this.maxCoffeeVolume - this.coffeeBeans.getVolume()) {
			this.coffeeBeans.add(newCoffeeBeans);
		} else {
			let emptySpace: number = this.maxWaterVolume - this.coffeeBeans.getVolume();
			throw new Error('You can add not more then ' + emptySpace);
		}
	}

	public addMilk(newMilk: Milk): void{
		if(newMilk.getVolume() <= this.maxMilkVolume - this.milk.getVolume()) {
			this.milk.add(newMilk);
		} else {
			let emptySpace: number = this.maxWaterVolume - this.milk.getVolume();
			throw new Error('You can add not more then ' + emptySpace);
		}
	}

//#############################

	private createCoffee(name: string, waterVolume: number, coffeeBeansWeight: number, milkVolume?: number): ICoffee {
		const waterToMake = this.water.get(waterVolume);
		const coffeeBeansToMake = this.coffeeBeans.get(coffeeBeansWeight);
		let makeMilk;

		if(milkVolume !== undefined) {
			this.milk.get(milkVolume);
		}

		this.coffeeBeans.grind(coffeeBeansToMake);
		this.water.heatUp();

		return {
			name: name,
			description: 'Created'
		}
	}

	private has(waterVolume: number, coffeeBeansWeight: number, milkVolume?: number): boolean {
		if(this.water.isExist(waterVolume) !== true) {
			return false;
		}

		if(this.milk.isExist(milkVolume) !== true) {
			return false;
		}

		if(this.coffeeBeans.isExist(coffeeBeansWeight) !== true) {
			return false;
		}

		return true;
	}
}


const coffeeMachine = new CoffeMachine(new Milk(100, new Date(2019, 2, 3)), new CoffeeBeans(100), new Water(300), 1000, 400, 1000);
console.log(coffeeMachine.getLatte());
console.log(coffeeMachine);