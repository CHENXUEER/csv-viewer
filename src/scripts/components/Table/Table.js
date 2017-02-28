import './Table.less';

import $ from 'jquery';

console.log($);

const colWidth = 60;

class Table {
	constructor(dataObj = [], dom) {
		this.dataObj = dataObj;
		this.dom = dom;
		dom.html(`
			<div class="table-container">
				<div class="tables">
					<div class="cover"></div>
					<div class="fields">
						
					</div>
					<div class="rows">

					</div>
					<div class="entries">

					</div>
				</div>
				<div class="btns">
					<button class="rowExport" disabled>导出选中行</button>
		    		<button class="colExport" disabled>导出选中列</button>
				</div>
	    	</div>
	    	`
    	);
    	this.render();
	}

	addEventListener() {
		let clickedCols = {};
		let clickedRows = {};

		const dataObj = this.dataObj;
		const dom = this.dom;

		// 表头响应
		const ths = dom.find('.fields .item');
		ths.off('mouseover').on('mouseover', function() {
			const index = ths.index(this);
			if(index === 0) {
				return false;
			}
			$(this).addClass('hovered');
			dom.find('.entry.item:nth-child(' + index + ')').addClass('hovered');
		});
		ths.off('mouseleave').on('mouseleave', function() {
			const index = ths.index(this);
			if(index === 0) {
				return false;
			}
			$(this).removeClass('hovered');
			dom.find('.entry.item').removeClass('hovered');
		});
		ths.off('click').on('click', function(ev) {
			ev.stopPropagation();
			const thisDom = $(this);
			const clicked = thisDom.hasClass('clicked');
			const index = parseInt(thisDom.attr('index'));
			const tds = dom.find('.entry:nth-child(' + index + ')');
			if(dom.find('.index.clicked').length > 0) {
				clickedCols = {};
				clickedRows = {};
				dom.find('.rowExport, .colExport').prop('disabled', true);
				dom.find('.index').removeClass('clicked');
				dom.find('.entry').removeClass('clicked');
			}
			if(clicked) {
				thisDom.removeClass('clicked');
				tds.removeClass('clicked');
				clickedCols[index - 1] = false;
			} else {
				thisDom.addClass('clicked');
				tds.addClass('clicked');
				clickedCols[index - 1] = true;
			}
			if(dom.find('.field.clicked').length > 0) {
				dom.find('.colExport').prop('disabled', false);
			} else {
				dom.find('.colExport').prop('disabled', true);
			}
		});
		
		// 列头响应 
		const tds = dom.find('.index');
		tds.off('mouseover').on('mouseover', function() {
			const thisDom = $(this);
			const row = thisDom.html();
			$(this).addClass('hovered');
			dom.find('.entries .row:nth-child(' + row + ') .item').addClass('hovered');
		});
		tds.off('mouseleave').on('mouseleave', function() {
			const thisDom = $(this);
			const row = thisDom.html();
			dom.find('.index').removeClass('hovered');
			dom.find('.entries .row:nth-child(' + row + ') .item').removeClass('hovered');
		});
		tds.off('click').on('click', function(ev) {
			ev.stopPropagation();
			const thisDom = $(this);
			const clicked = thisDom.hasClass('clicked');
			const row = thisDom.html();
			const tds = dom.find('.entries .row:nth-child(' + row + ') .item');
			if(dom.find('.field.clicked').length > 0) {
				clickedCols = {};
				clickedRows = {};
				dom.find('.rowExport, .colExport').prop('disabled', true);
				dom.find('.field').removeClass('clicked');
				dom.find('.entry').removeClass('clicked');
			}
			if(clicked) {
				thisDom.removeClass('clicked');
				tds.removeClass('clicked');
				clickedRows[row] = false;
			} else {
				thisDom.addClass('clicked');
				tds.addClass('clicked');
				clickedRows[row] = true;
			}
			if(dom.find('.index.clicked').length > 0) {
				dom.find('.rowExport').prop('disabled', false);
			} else {
				dom.find('.rowExport').prop('disabled', true);
			}
		});

		dom.off('dblclick').on('dblclick', function() {
			dom.find('.item').removeClass('clicked');
			dom.find('.rowExport, .colExport').prop('disabled', true);
		});

		dom.find('.rowExport').off('click').on('click', () => {
			let output = this.filterByRows(clickedRows);
		});

		dom.find('.colExport').off('click').on('click', () => {
			const output = this.filterByCols(clickedCols);
			console.log(output);
		});

		dom.find('.entries').off('scroll').on('scroll', function() {
			const thisDom = $(this);
			const top = thisDom.scrollTop();
			const left = thisDom.scrollLeft();
			dom.find('.fields').css('margin-left', -left);
			dom.find('.rows').css('margin-top', -top);
		});

	}

	// 按照区间过滤
	filterByRange(field, min, max) {
		const dataObj = this.dataObj;
		const fields = dataObj[0];
		const index = fields.indexOf(field);
		return dataObj.filter(function(d, i) {
			return i === 0 || (d[index] >= min && d[index] <= max);
		});
	}

	// 按照值过滤
	filterByValues(field, values) {
		const dataObj = this.dataObj;
		const fields = dataObj[0];
		const index = fields.indexOf(field);
		return dataObj.filter(function(d, i) {
			return i === 0 || (values.indexOf(d[index]) > -1);
		});
	}

	// 选数据行
	filterByRows(rows) {
		const dataObj = this.dataObj;
		return dataObj.filter(function(d, i) {
			return i === 0 || rows[i];
		});
	}

	// 选数据维度
	filterByCols(cols) {
		const dataObj = this.dataObj;
		return dataObj.map(function(d) {
			return d.filter(function(dd, ii) {
				return cols[ii];
			});
		});
	}

	render() {
		const dom = this.dom;
		const obj = this.dataObj;

		// 打印表头
		const fields = obj[0];
		const theadDom = dom.find('.fields');
		let theadStr = '<div class="row"><div class="item"></div>'
		fields.forEach((d, i) => {
			theadStr += '<div class="field item" title="' + d + '" index="' + (i + 1) + '">' + d + '</div>';
		});
		theadStr += '</div>'
		theadDom.html(theadStr);
		theadDom.find('.row').width((fields.length + 1) * colWidth);

		// 打印表
		const tbodyDom = dom.find('.entries');
		const rowsDom = dom.find('.rows');
		let tbodyStr = '';
		let rowsStr = '';
		const l = obj.length;
		for(let i = 1; i < l; i++) {
			const tr = obj[i];
			rowsStr += '<div class="row"><div class="index item" title="' + i + '">' + i + '</div></div>';
			let trStr = '<div class="row">';
			tr.forEach((d) => {
				trStr += '<div class="item entry" title="' + d + '">' + d + '</div>';
			});
			trStr += '</div>';
			tbodyStr += trStr;
		}
		tbodyDom.html(tbodyStr);
		tbodyDom.find('.row').width((fields.length) * colWidth);
		rowsDom.html(rowsStr);
		// 添加事件响应
		this.addEventListener();
	}
}

// const table = new Table(csvDataObj, $('#table'));

// console.log(table.filterByRange('属性1', 244, 1555));
// console.log(table.filterByValues('属性2', ['abc', 'ddd']));

export default Table;