abstract class CoffeeIngredients {
	constructor(private volume: number) {};

	public get(volume: number): number {
		if(this.isEnought(volume) === true) {
			this.volume -= volume;
			return volume;
		}
	}

	public isExist(volume: number): boolean {
		return this.isEnought(volume);
	}

	public add(ingredient: CoffeeIngredients): void {
		this.volume += ingredient.volume;
	}

	public getVolume(): number {
		return this.volume;
	}

	private isEnought(volume: number): boolean {
		if(this.volume >= volume || volume === undefined) {
			return true;
		} else {
			throw new Error('not enought ' + (<any>this).constructor.name);
			return false;
		}
	}
}

class Milk extends CoffeeIngredients {
	constructor(volume: number, private expirationDate: Date) { 
		super(volume);
	}

	add(newMilk: Milk): void {
		if(newMilk.isNotExpired() && this.isNotExpired()) {
			super.add(newMilk);
			this.expirationDate = this.expirationDate < newMilk.expirationDate ? newMilk.expirationDate : this.expirationDate;
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
	private intervalIdforCooling: number;
	private intervalIdforHeading: number;
	constructor(volume: number) { 
		super(volume);
	}

	public heatUp(): Promise<void> {
		clearInterval(this.intervalIdforCooling);
		clearInterval(this.intervalIdforHeading);
		const maxTemp = 92;
		const minTemp = 87;
		return new Promise((resolve, reject) => {
			console.log('Water start to heat up');
			this.intervalIdforHeading = setInterval(() => {
				if(this.temperature >= maxTemp) {
					console.log('Water has been heated to 92 degrees');
					clearInterval(this.intervalIdforHeading);
					resolve();
					this.coolDown(minTemp);
					return;
				}
				this.temperature++;
				console.log(this.temperature);
			}, 100);
		});
	}

	public coolDown(to: number): Promise<void> {
		clearInterval(this.intervalIdforCooling);
		return new Promise((resolve, reject) => {
			console.log('Water start to cool down');
			this.intervalIdforCooling = setInterval(() => {
				if(this.temperature == to) {
					clearInterval(this.intervalIdforCooling);
					resolve();
					this.heatUp();
					return;
				}
				this.temperature--;
				console.log(this.temperature);
			}, 4000)
		});
	}
}

class CoffeeBeans extends CoffeeIngredients {
	constructor(volume: number) { 
		super(volume);
	}

	public grind(volume: number): Promise<void> {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				console.log(volume + ' gram of coffee has been ground');
				resolve();
			}, 1000);
		});
	}
}

interface ICoffee {
	name: string;
	description: string
}

class CoffeeMachine {

	constructor(
		private milk: Milk,
		private coffeeBeans: CoffeeBeans,
		private water: Water,
		private maxWaterVolume: number,
		private maxCoffeeBeansVolume: number,
		private maxMilkVolume: number
		) {};

	public getLatte(): void {
		const waterToCreate: number = 100;
		const coffeeBeansToCreate: number = 20;
		const milkToCreate: number = 100;
		//let latte;

		if(this.has(waterToCreate, coffeeBeansToCreate, milkToCreate) === true && this.milk.isNotExpired()) {
			this.createCoffee('Latte', waterToCreate, coffeeBeansToCreate, milkToCreate);
		}
	}

	public getExpresso(): void {
		const waterToCreate: number = 50;
		const coffeeBeansToCreate: number = 20;
		//let expresso;

		if(this.has(waterToCreate, coffeeBeansToCreate) === true) {
			this.createCoffee('Expresso', waterToCreate, coffeeBeansToCreate);
		}
	}

	public getCappuchino(): void {
		const waterToCreate: number = 100;
		const coffeeBeansToCreate: number = 20;
		const milkToCreate: number = 50;
		//let cappuchino;

		if(this.has(waterToCreate, coffeeBeansToCreate, milkToCreate) === true && this.milk.isNotExpired()) {
			this.createCoffee('Cappuchino', waterToCreate, coffeeBeansToCreate, milkToCreate);
		}
	}

	public addWater(newWater: Water): void{
		if(this.isEnoughtEmtySpace(newWater)) {
			this.water.add(newWater);
		}
	}

	public addCoffeeBeans(newCoffeeBeans: CoffeeBeans): void {
		if(this.isEnoughtEmtySpace(newCoffeeBeans)) {
			this.coffeeBeans.add(newCoffeeBeans);
		}
	}

	public addMilk(newMilk: Milk): void{
		if(this.isEnoughtEmtySpace(newMilk)) {
			this.milk.add(newMilk);
		}
	}

//#############################

	private createCoffee(name: string, waterVolume: number, coffeeBeansWeight: number, milkVolume?: number): void {
		const waterToMake = this.water.get(waterVolume);
		const coffeeBeansToMake = this.coffeeBeans.get(coffeeBeansWeight);
		let makeMilk;

		if(milkVolume !== undefined) {
			this.milk.get(milkVolume);
		}


		this.coffeeBeans.grind(coffeeBeansToMake)
			.then(() => {
				return this.water.heatUp()
			})
			.then(() => {
				console.log({name: name, description: 'Created'});
			});
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

	private isEnoughtEmtySpace(forIngredient: CoffeeIngredients): boolean {
		let emptySpace;
		switch((<any>forIngredient).constructor.name) {
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

		if(forIngredient.getVolume() <= emptySpace) {
			return true;
		} else {
			throw new Error('You can add not more then ' + emptySpace);
			return false;
		}
	}
}

const cm: CoffeeMachine = new CoffeeMachine(
	new Milk(100, new Date(2019, 2, 3, 23, 59, 59)),
	new CoffeeBeans(100),
	new Water(300),
	1000, 400, 1000);

window['_'] = cm;