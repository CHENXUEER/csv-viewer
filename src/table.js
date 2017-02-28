import Table from './scripts/components/Table/Table.js';

import $ from 'jquery';

const csvDataObj = [
	['属性1', '属性2', '属性3', '属性4', '属性5', '属性6', '属性7', '属性8', '属性9', '属性10'],
	[12, 'abc', '值1', '值11212121212121', '值1', '值1', '值1', '值1', '值1', '值1'],
	[1212, 'cba', '值2', '值1', '值1', '值1', '值1', '值1', '值1', '值1'],
	[123, 'ddd', '值3', '值1', '值1', '值1', '值1', '值1', '值1', '值1'],
];

for(let i = 0; i < 1000; i ++) {
	csvDataObj.push([11, 'sdaf', '值1', '值1', '值1', '值1', '值1', '值1', '值1', '值1']);
}


const table = new Table(csvDataObj, $('#table'));