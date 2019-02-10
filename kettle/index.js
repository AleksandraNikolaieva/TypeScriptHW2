const buttons = document.getElementsByTagName('button');

const volumes = document.getElementsByClassName('waterVolume');
const temperatures = document.getElementsByClassName('waterTemperature');

var turnOn = buttons[0];
var turnOff = buttons[1];
var addWater = buttons[2];
var pourOut = buttons[3];
var getWater = buttons[4];
var changeAmbientTemp = buttons[5];
var showAllCups = buttons[6];


var createdCups = [];

turnOn.addEventListener('click', () => {
	kettle.turnOn();
})

turnOff.addEventListener('click', () => {
	kettle.turnOff();
})

addWater.addEventListener('click', () => {
	let vol = +volumes[0].value;
	let temp = +temperatures[0].value;
	volumes[0].value = '';
	temperatures[0].value = '';
	if(!isNaN(vol) && vol > 0 && !isNaN(temp) && temp > 0 && temp < 100) {
		let water = new Water(vol, temp);
		kettle.addWater(water);
	} else {
		throw new Error('Invalid data');
	}
})

pourOut.addEventListener('click', () => {
	let vol = +volumes[1].value;
	volumes[1].value = '';
	if(!isNaN(vol)) {
		kettle.pourOutWater(vol);
	} else {
		throw new Error('Invalid data');
	}
})

getWater.addEventListener('click', () => {
	var vol = +volumes[2].value;
	volumes[2].value = '';
	if(!isNaN(vol)) {
		var cup = kettle.getWater(vol);
		createdCups.push(cup);
		console.log(cup);
	} else {
		throw new Error('Invalid data');
	}
})

changeAmbientTemp.addEventListener('click', () => {
	var temp = +document.getElementById('temperature').value;
	document.getElementById('temperature').value = '';
	if(!isNaN(temp) && temp > 0 && temp < 100) {
		kettle.changeAmbientTemp(temp);
	} else {
		throw new Error('Invalid data');
	}
})

showAllCups.addEventListener('click', () => {
	console.log(createdCups);
})