class TeaPot {
	private water: Water = new Water(0, 25, 25);
	private isTurned: boolean = false;
	constructor(private readonly power: number, private readonly volume: number) {}; //мощность - Вт, обьем - мл

	public addWater(newWater: Water): void {
		if(this.isExistEmptySpace(newWater.getVolume())) {
			this.water.addNewWater(newWater);
		}
	}

	public turnOn(): void {
		if(this.water.getVolume() != 0 && this.isTurned == false) {
			clearInterval(this.water.getCoolingInterval());
			this.isTurned = true;
			let timeForBoil: number = Math.round(this.water.getspesificHead() * this.water.getVolume() / 1000 * (this.water.boildTemp - this.water.getTemperature()) / this.power); //sec
			let speed: number = (this.water.boildTemp - this.water.getTemperature()) / timeForBoil;
			this.water.boild(timeForBoil, speed, this.turnOff.bind(this));
		} else {
			if(this.water.getVolume() === 0) {
				throw new Error('Teapot is empty');
			} else {
				throw new Error('Teapot is already on');
			}
		}
	}

	public turnOff(): void {
		if(this.isTurned == true) {
			this.isTurned = false;
			clearInterval(this.water.getBoilingInterval());
			this.water.coolDown();
		} else {
			throw new Error('Teapot is already off');
		}
	}

	public pourOutWater(volume: number): void {
		if(this.isExistWaterVolume(volume)) {
			this.water.decreaseVolume(volume);
		}
	}

	public getWater(volume: number): Water {
		if(this.isExistWaterVolume(volume)) {
			this.pourOutWater(volume);
			return new Water(volume, this.water.getTemperature(), this.water.getOuterTemp());
		}
	}

	public changeTeaPotPlace(toTemperature: number): void {
		this.water.changeOuterTemp(toTemperature);
	}

	private isExistWaterVolume(volume: number): boolean {
		if(this.water.getVolume() > volume) {
			return true;
		}
		throw new Error('Not enought water in teapot. There is only ' + this.water.getVolume() + ' milliliters');
		return false;
	}

	private isExistEmptySpace(volume: number) {
		if(this.volume - this.water.getVolume() > volume) {
			return true;
		}
		throw new Error('Not enought empty space, you can add not more then ' + <number>(this.volume - this.water.getVolume()) + ' milliliters');
		return false;
	}
}

class Water {
	private readonly spesificHead: number = 4200; //удельная теплоемкость воды при нормальном давлении (Дж)
	public readonly boildTemp: number = 100; //температура кипения воды (C)
	private intervalForBoiling: number;
	private intervalForCooling: number;
	private intervalForHeating: number;
	constructor(private volume: number, private temperature: number, private outerTemp: number) {};

	public boild(secForBoild: number, growSpeed: number, callback: Function): void {
		console.log('Water is heating up');
		let seconds = 0;
		this.intervalForBoiling = setInterval(() => {
			if(seconds >= secForBoild) {
				clearInterval(this.intervalForBoiling);
				console.log('Water is boiled');
				callback();
				return;
			}
			seconds++;
			this.temperature += growSpeed;
			console.log('Water temperature ', this.temperature.toFixed(2)); //закоментировать если не хотим показывать процесс нагревания
		}, 300);
	}

	public coolDown(): void {
		let speed = 3;
		console.log('Start to cool down');
		if(this.intervalForCooling) {
			clearInterval(this.intervalForCooling);
		}
		this.intervalForCooling = setInterval(() => {
			if(this.temperature <= this.outerTemp) {
				clearInterval(this.intervalForCooling);
				return;
			}
			this.temperature -= speed;
			console.log('Water temperature: ', this.temperature.toFixed(2)); //закоментировать если не хотим показывать процесс остывания
		}, 2000);
	}

	public heatUp(toTemp: number): void {
		console.log('Heating up');
		if(this.intervalForHeating) {
			clearInterval(this.intervalForHeating);
		}
		this.intervalForHeating = setInterval(() => {
			if(this.temperature === toTemp) {
				clearInterval(this.intervalForHeating);
			}
			this.temperature++;
			console.log('Water temperature ', this.temperature); //закоментировать если не хотим показывать процесс нагревания
		}, 2000)
	}

	public addNewWater(newWater: Water): void {
		this.volume += newWater.volume;
		this.temperature = Math.round((this.temperature * this.volume + newWater.temperature * newWater.volume) / (this.volume + newWater.volume));
		if(this.temperature > this.outerTemp && !this.intervalForBoiling) {
			this.coolDown();
		} else if(this.temperature < this.outerTemp) {
			this.heatUp(this.outerTemp);
		}
	}

	public changeOuterTemp(to: number): void {
		this.outerTemp = to;
	}

	public decreaseVolume(volume: number): void {
			this.volume -= volume;
	}

	public getTemperature(): number {
		return this.temperature;
	}

	public getVolume(): number {
		return this.volume;
	}

	public getspesificHead(): number {
		return this.spesificHead;
	}

	public getOuterTemp(): number {
		return this.outerTemp;
	}

	public getBoilingInterval(): number {
		return this.intervalForBoiling;
	}

	public getCoolingInterval(): number {
		return this.intervalForCooling;
	}
}

const teaPot = new TeaPot(2400, 1700);
teaPot.addWater(new Water(400, 25, 25));
console.log(teaPot);
teaPot.turnOn();

//если вы дочитали до этого места обьясните как получить сюда кипяток :) 
//*вывести в консоль понимаю как, а как получить в основной поток кода чтобы иметь возможность с ним что-то делать дальше нет.