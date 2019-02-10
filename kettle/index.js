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
	let water = new Water(vol, temp);
	kettle.addWater(water);

})

pourOut.addEventListener('click', () => {
	let vol = +volumes[1].value;
	volumes[1].value = '';
	kettle.pourOutWater(vol);
})

getWater.addEventListener('click', () => {
	var vol = +volumes[2].value;
	volumes[2].value = '';
	var cup = kettle.getWater(vol);
	volumes[2].value = '';
	createdCups.push(cup);
	console.log(cup);
})

changeAmbientTemp.addEventListener('click', () => {
	var temp = +document.getElementById('temperature').value;
	kettle.changeOutTemp(temp, );
})

showAllCups.addEventListener('click', () => {
	console.log(createdCups);
})