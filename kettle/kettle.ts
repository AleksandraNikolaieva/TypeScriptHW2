class Water {
	private intervalForBoiling: number;
	private intervalForCooling: number;
	private intervalForHeating: number;
	constructor(private volume: number, private temperature: number) {};

	public boil(heaterPower: number, callback?: Function): void {
		this.stopHeatUp();
		this.stopCoolDown();
		const spesificHead = 4200;
		const boildTemp = 100;
		let timeForBoil: number = Math.round(spesificHead * this.volume / 1000 * (boildTemp - this.temperature) / heaterPower); //sec
		let speed: number = (boildTemp - this.temperature) / timeForBoil;
		console.log('Start boil');
		let seconds = 0;
		this.intervalForBoiling = setInterval(() => {
			if(seconds >= timeForBoil && this.temperature >= boildTemp) {
				this.stopBoild();
				console.log('Water has been boiled');
				if(callback) {
					callback();
				}
				return;
			}
			seconds++;
			this.temperature += speed;
			console.log('Water temperature: ', this.temperature.toFixed(2)); //закоментировать если не хотим показывать процесс нагревания
		}, 300);
	}

	public coolDown(to: number, speed: number): void {
		if(this.intervalForBoiling) {
			return;
		}
		this.stopHeatUp();
		if(!this.intervalForCooling) console.log('Water start to cool down to ' + to);
		this.stopCoolDown();
		this.intervalForCooling = setInterval(() => {
			if(this.temperature <= to) {
				this.temperature = to;
				this.stopCoolDown();
				console.log('Water temperature: ', this.temperature.toFixed(2));
				return;
			}
			this.temperature -= speed;
			console.log('Water temperature: ', this.temperature.toFixed(2)); //закоментировать если не хотим показывать процесс остывания
		}, 600);
	}

	public heatUp(toTemp: number, speed: number): void {
		if(this.intervalForBoiling) {
			return;
		}
		this.stopHeatUp();
		this.stopCoolDown();
		if(!this.intervalForHeating) console.log('Start to heat up to ' + toTemp);
		this.intervalForHeating = setInterval(() => {
			if(this.temperature === toTemp) {
				this.stopHeatUp();
	 			return;
			}
			this.temperature += speed;
			console.log('Water temperature: ', this.temperature.toFixed(2)); //закоментировать если не хотим показывать процесс нагревания
		}, 600)
	}

	public addNewWater(newWater: Water): void {
		this.temperature = Math.round((this.temperature * this.volume + newWater.temperature * newWater.volume) / (this.volume + newWater.volume));
		this.volume += newWater.volume;
	}

	public decreaseVolume(volume: number): void {
		if(this.volume >= volume) {
			this.volume -= volume;
		} else {
			throw new Error('Not enought water. There is only ' + this.volume + ' milliliters');
		}
	}

	public getTemperature(): number {
		return this.temperature;
	}

	public getVolume(): number {
		return this.volume;
	}

	public stopBoild() {
		if(this.intervalForBoiling) {
			clearInterval(this.intervalForBoiling);
			this.intervalForBoiling = undefined;
		}
	}

	private stopCoolDown() {
		if(this.intervalForCooling) {
			clearInterval(this.intervalForCooling);
			this.intervalForCooling = undefined;
		}
	}

	private stopHeatUp() {
		if(this.intervalForHeating) {
			clearInterval(this.intervalForHeating);
			this.intervalForHeating = undefined;
		}
	}

}

class Kettle {
	private water: Water = new Water(0, 0);
	private isTurned: boolean = false;
	private ambientTemp: number = 25; //условная комнатная температура
	constructor(private readonly power: number, private readonly volume: number) {}; //мощность - Вт, обьем - мл

	public addWater(newWater: Water): void {
		if(this.isExistEmptySpace(newWater.getVolume())) {
			this.water.addNewWater(newWater);
			if(this.water.getTemperature() > this.ambientTemp) {
				this.water.coolDown(this.ambientTemp, 1);
			} else if(this.water.getTemperature() < this.ambientTemp) {
				this.water.heatUp(this.ambientTemp, 1);
			}
		}
	}

	public turnOn(): void {
		if(this.water.getVolume() != 0 && this.isTurned == false) {
			this.isTurned = true;
			this.water.boil(this.power, this.turnOff.bind(this));
		} else {
			if(this.water.getVolume() === 0) {
				throw new Error('Kettle is empty');
			} else {
				throw new Error('Kettle is already on');
			}
		}
	}

	public turnOff(): void {
		if(this.isTurned == true) {
			this.isTurned = false;
			this.water.stopBoild();
			this.water.coolDown(this.ambientTemp, 1);
		} else {
			throw new Error('Kettle is already off');
		}
	}

	public pourOutWater(volume: number): void {
		this.water.decreaseVolume(volume);
	}

	public getWater(volume: number): Water {
		this.pourOutWater(volume);
		return new Water(volume, this.water.getTemperature());
	}

	public changeAmbientTemp(to: number): void {
		this.ambientTemp = to;
		if(this.water.getVolume() != 0) {
			if(this.ambientTemp < this.water.getTemperature()) {
				this.water.coolDown(to, 1);
			} else if(this.ambientTemp > this.water.getTemperature()) {
				this.water.heatUp(to, 1);
			}
		}
	}

	private isExistEmptySpace(volume: number) {
		if(this.volume - this.water.getVolume() >= volume) {
			return true;
		}
		throw new Error('Not enought empty space, you can add not more then ' + <number>(this.volume - this.water.getVolume()) + ' milliliters');
		return false;
	}
}

const kettle: Kettle = new Kettle(2400, 1700);

window['_'] = kettle;