/*
 * This combined file was created by the DataTables downloader builder:
 *   https://datatables.net/download
 *
 * To rebuild or modify this file with the latest versions of the included
 * software please visit:
 *   https://datatables.net/download/#bs/dt-1.10.12/af-2.1.2/b-1.2.1/e-1.5.6/fh-3.1.2/se-1.2.0
 *
 * Included libraries:
 *   DataTables 1.10.12, AutoFill 2.1.2, Buttons 1.2.1, Editor 1.5.6, FixedHeader 3.1.2, Select 1.2.0
 */

/*! DataTables 1.10.12
 * ©2008-2015 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     DataTables
 * @description Paginate, search and order HTML tables
 * @version     1.10.12
 * @file        jquery.dataTables.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2008-2015 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

/*jslint evil: true, undef: true, browser: true */
/*globals $,require,jQuery,define,_selector_run,_selector_opts,_selector_first,_selector_row_indexes,_ext,_Api,_api_register,_api_registerPlural,_re_new_lines,_re_html,_re_formatted_numeric,_re_escape_regex,_empty,_intVal,_numToDecimal,_isNumber,_isHtml,_htmlNumeric,_pluck,_pluck_order,_range,_stripHtml,_unique,_fnBuildAjax,_fnAjaxUpdate,_fnAjaxParameters,_fnAjaxUpdateDraw,_fnAjaxDataSrc,_fnAddColumn,_fnColumnOptions,_fnAdjustColumnSizing,_fnVisibleToColumnIndex,_fnColumnIndexToVisible,_fnVisbleColumns,_fnGetColumns,_fnColumnTypes,_fnApplyColumnDefs,_fnHungarianMap,_fnCamelToHungarian,_fnLanguageCompat,_fnBrowserDetect,_fnAddData,_fnAddTr,_fnNodeToDataIndex,_fnNodeToColumnIndex,_fnGetCellData,_fnSetCellData,_fnSplitObjNotation,_fnGetObjectDataFn,_fnSetObjectDataFn,_fnGetDataMaster,_fnClearTable,_fnDeleteIndex,_fnInvalidate,_fnGetRowElements,_fnCreateTr,_fnBuildHead,_fnDrawHead,_fnDraw,_fnReDraw,_fnAddOptionsHtml,_fnDetectHeader,_fnGetUniqueThs,_fnFeatureHtmlFilter,_fnFilterComplete,_fnFilterCustom,_fnFilterColumn,_fnFilter,_fnFilterCreateSearch,_fnEscapeRegex,_fnFilterData,_fnFeatureHtmlInfo,_fnUpdateInfo,_fnInfoMacros,_fnInitialise,_fnInitComplete,_fnLengthChange,_fnFeatureHtmlLength,_fnFeatureHtmlPaginate,_fnPageChange,_fnFeatureHtmlProcessing,_fnProcessingDisplay,_fnFeatureHtmlTable,_fnScrollDraw,_fnApplyToChildren,_fnCalculateColumnWidths,_fnThrottle,_fnConvertToWidth,_fnGetWidestNode,_fnGetMaxLenString,_fnStringToCss,_fnSortFlatten,_fnSort,_fnSortAria,_fnSortListener,_fnSortAttachListener,_fnSortingClasses,_fnSortData,_fnSaveState,_fnLoadState,_fnSettingsFromNode,_fnLog,_fnMap,_fnBindAction,_fnCallbackReg,_fnCallbackFire,_fnLengthOverflow,_fnRenderer,_fnDataSource,_fnRowAttributes*/

(function( factory ) {
	"use strict";

	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				// CommonJS environments without a window global must pass a
				// root. This will give an error otherwise
				root = window;
			}

			if ( ! $ ) {
				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
					require('jquery') :
					require('jquery')( root );
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}
(function( $, window, document, undefined ) {
	"use strict";

	/**
	 * DataTables is a plug-in for the jQuery Javascript library. It is a highly
	 * flexible tool, based upon the foundations of progressive enhancement,
	 * which will add advanced interaction controls to any HTML table. For a
	 * full list of features please refer to
	 * [DataTables.net](href="http://datatables.net).
	 *
	 * Note that the `DataTable` object is not a global variable but is aliased
	 * to `jQuery.fn.DataTable` and `jQuery.fn.dataTable` through which it may
	 * be  accessed.
	 *
	 *  @class
	 *  @param {object} [init={}] Configuration object for DataTables. Options
	 *    are defined by {@link DataTable.defaults}
	 *  @requires jQuery 1.7+
	 *
	 *  @example
	 *    // Basic initialisation
	 *    $(document).ready( function {
	 *      $('#example').dataTable();
	 *    } );
	 *
	 *  @example
	 *    // Initialisation with configuration options - in this case, disable
	 *    // pagination and sorting.
	 *    $(document).ready( function {
	 *      $('#example').dataTable( {
	 *        "paginate": false,
	 *        "sort": false
	 *      } );
	 *    } );
	 */
	var DataTable = function ( options )
	{
		/**
		 * Perform a jQuery selector action on the table's TR elements (from the tbody) and
		 * return the resulting jQuery object.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select TR elements that meet the current filter
		 *    criterion ("applied") or all TR elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the TR elements in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {object} jQuery object, filtered by the given selector.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Highlight every second row
		 *      oTable.$('tr:odd').css('backgroundColor', 'blue');
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to rows with 'Webkit' in them, add a background colour and then
		 *      // remove the filter, thus highlighting the 'Webkit' rows only.
		 *      oTable.fnFilter('Webkit');
		 *      oTable.$('tr', {"search": "applied"}).css('backgroundColor', 'blue');
		 *      oTable.fnFilter('');
		 *    } );
		 */
		this.$ = function ( sSelector, oOpts )
		{
			return this.api(true).$( sSelector, oOpts );
		};
		
		
		/**
		 * Almost identical to $ in operation, but in this case returns the data for the matched
		 * rows - as such, the jQuery selector used should match TR row nodes or TD/TH cell nodes
		 * rather than any descendants, so the data can be obtained for the row/cell. If matching
		 * rows are found, the data returned is the original data array/object that was used to
		 * create the row (or a generated array if from a DOM source).
		 *
		 * This method is often useful in-combination with $ where both functions are given the
		 * same parameters and the array indexes will match identically.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select elements that meet the current filter
		 *    criterion ("applied") or all elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the data in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {array} Data for the matched elements. If any elements, as a result of the
		 *    selector, were not TR, TD or TH elements in the DataTable, they will have a null
		 *    entry in the array.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the data from the first row in the table
		 *      var data = oTable._('tr:first');
		 *
		 *      // Do something useful with the data
		 *      alert( "First cell is: "+data[0] );
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to 'Webkit' and get all data for
		 *      oTable.fnFilter('Webkit');
		 *      var data = oTable._('tr', {"search": "applied"});
		 *
		 *      // Do something with the data
		 *      alert( data.length+" rows matched the search" );
		 *    } );
		 */
		this._ = function ( sSelector, oOpts )
		{
			return this.api(true).rows( sSelector, oOpts ).data();
		};
		
		
		/**
		 * Create a DataTables Api instance, with the currently selected tables for
		 * the Api's context.
		 * @param {boolean} [traditional=false] Set the API instance's context to be
		 *   only the table referred to by the `DataTable.ext.iApiIndex` option, as was
		 *   used in the API presented by DataTables 1.9- (i.e. the traditional mode),
		 *   or if all tables captured in the jQuery object should be used.
		 * @return {DataTables.Api}
		 */
		this.api = function ( traditional )
		{
			return traditional ?
				new _Api(
					_fnSettingsFromNode( this[ _ext.iApiIndex ] )
				) :
				new _Api( this );
		};
		
		
		/**
		 * Add a single new row or multiple rows of data to the table. Please note
		 * that this is suitable for client-side processing only - if you are using
		 * server-side processing (i.e. "bServerSide": true), then to add data, you
		 * must add it to the data source, i.e. the server-side, through an Ajax call.
		 *  @param {array|object} data The data to be added to the table. This can be:
		 *    <ul>
		 *      <li>1D array of data - add a single row with the data provided</li>
		 *      <li>2D array of arrays - add multiple rows in a single call</li>
		 *      <li>object - data object when using <i>mData</i></li>
		 *      <li>array of objects - multiple data objects when using <i>mData</i></li>
		 *    </ul>
		 *  @param {bool} [redraw=true] redraw the table or not
		 *  @returns {array} An array of integers, representing the list of indexes in
		 *    <i>aoData</i> ({@link DataTable.models.oSettings}) that have been added to
		 *    the table.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Global var for counter
		 *    var giCount = 2;
		 *
		 *    $(document).ready(function() {
		 *      $('#example').dataTable();
		 *    } );
		 *
		 *    function fnClickAddRow() {
		 *      $('#example').dataTable().fnAddData( [
		 *        giCount+".1",
		 *        giCount+".2",
		 *        giCount+".3",
		 *        giCount+".4" ]
		 *      );
		 *
		 *      giCount++;
		 *    }
		 */
		this.fnAddData = function( data, redraw )
		{
			var api = this.api( true );
		
			/* Check if we want to add multiple rows or not */
			var rows = $.isArray(data) && ( $.isArray(data[0]) || $.isPlainObject(data[0]) ) ?
				api.rows.add( data ) :
				api.row.add( data );
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return rows.flatten().toArray();
		};
		
		
		/**
		 * This function will make DataTables recalculate the column sizes, based on the data
		 * contained in the table and the sizes applied to the columns (in the DOM, CSS or
		 * through the sWidth parameter). This can be useful when the width of the table's
		 * parent element changes (for example a window resize).
		 *  @param {boolean} [bRedraw=true] Redraw the table or not, you will typically want to
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable( {
		 *        "sScrollY": "200px",
		 *        "bPaginate": false
		 *      } );
		 *
		 *      $(window).bind('resize', function () {
		 *        oTable.fnAdjustColumnSizing();
		 *      } );
		 *    } );
		 */
		this.fnAdjustColumnSizing = function ( bRedraw )
		{
			var api = this.api( true ).columns.adjust();
			var settings = api.settings()[0];
			var scroll = settings.oScroll;
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw( false );
			}
			else if ( scroll.sX !== "" || scroll.sY !== "" ) {
				/* If not redrawing, but scrolling, we want to apply the new column sizes anyway */
				_fnScrollDraw( settings );
			}
		};
		
		
		/**
		 * Quickly and simply clear a table
		 *  @param {bool} [bRedraw=true] redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately 'nuke' the current rows (perhaps waiting for an Ajax callback...)
		 *      oTable.fnClearTable();
		 *    } );
		 */
		this.fnClearTable = function( bRedraw )
		{
			var api = this.api( true ).clear();
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
		};
		
		
		/**
		 * The exact opposite of 'opening' a row, this function will close any rows which
		 * are currently 'open'.
		 *  @param {node} nTr the table row to 'close'
		 *  @returns {int} 0 on success, or 1 if failed (can't find the row)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnClose = function( nTr )
		{
			this.api( true ).row( nTr ).child.hide();
		};
		
		
		/**
		 * Remove a row for the table
		 *  @param {mixed} target The index of the row from aoData to be deleted, or
		 *    the TR element you want to delete
		 *  @param {function|null} [callBack] Callback function
		 *  @param {bool} [redraw=true] Redraw the table or not
		 *  @returns {array} The row that was deleted
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately remove the first row
		 *      oTable.fnDeleteRow( 0 );
		 *    } );
		 */
		this.fnDeleteRow = function( target, callback, redraw )
		{
			var api = this.api( true );
			var rows = api.rows( target );
			var settings = rows.settings()[0];
			var data = settings.aoData[ rows[0][0] ];
		
			rows.remove();
		
			if ( callback ) {
				callback.call( this, settings, data );
			}
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return data;
		};
		
		
		/**
		 * Restore the table to it's original state in the DOM by removing all of DataTables
		 * enhancements, alterations to the DOM structure of the table and event listeners.
		 *  @param {boolean} [remove=false] Completely remove the table from the DOM
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      // This example is fairly pointless in reality, but shows how fnDestroy can be used
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnDestroy();
		 *    } );
		 */
		this.fnDestroy = function ( remove )
		{
			this.api( true ).destroy( remove );
		};
		
		
		/**
		 * Redraw the table
		 *  @param {bool} [complete=true] Re-filter and resort (if enabled) the table before the draw.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Re-draw the table - you wouldn't want to do it here, but it's an example :-)
		 *      oTable.fnDraw();
		 *    } );
		 */
		this.fnDraw = function( complete )
		{
			// Note that this isn't an exact match to the old call to _fnDraw - it takes
			// into account the new data, but can hold position.
			this.api( true ).draw( complete );
		};
		
		
		/**
		 * Filter the input based on data
		 *  @param {string} sInput String to filter the table on
		 *  @param {int|null} [iColumn] Column to limit filtering to
		 *  @param {bool} [bRegex=false] Treat as regular expression or not
		 *  @param {bool} [bSmart=true] Perform smart filtering or not
		 *  @param {bool} [bShowGlobal=true] Show the input global filter in it's input box(es)
		 *  @param {bool} [bCaseInsensitive=true] Do case-insensitive matching (true) or not (false)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sometime later - filter...
		 *      oTable.fnFilter( 'test string' );
		 *    } );
		 */
		this.fnFilter = function( sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive )
		{
			var api = this.api( true );
		
			if ( iColumn === null || iColumn === undefined ) {
				api.search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
			else {
				api.column( iColumn ).search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
		
			api.draw();
		};
		
		
		/**
		 * Get the data for the whole table, an individual row or an individual cell based on the
		 * provided parameters.
		 *  @param {int|node} [src] A TR row node, TD/TH cell node or an integer. If given as
		 *    a TR node then the data source for the whole row will be returned. If given as a
		 *    TD/TH cell node then iCol will be automatically calculated and the data for the
		 *    cell returned. If given as an integer, then this is treated as the aoData internal
		 *    data index for the row (see fnGetPosition) and the data for that row used.
		 *  @param {int} [col] Optional column index that you want the data of.
		 *  @returns {array|object|string} If mRow is undefined, then the data for all rows is
		 *    returned. If mRow is defined, just data for that row, and is iCol is
		 *    defined, only data for the designated cell is returned.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Row data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('tr').click( function () {
		 *        var data = oTable.fnGetData( this );
		 *        // ... do something with the array / object of data for the row
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Individual cell data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('td').click( function () {
		 *        var sData = oTable.fnGetData( this );
		 *        alert( 'The cell clicked on had the value of '+sData );
		 *      } );
		 *    } );
		 */
		this.fnGetData = function( src, col )
		{
			var api = this.api( true );
		
			if ( src !== undefined ) {
				var type = src.nodeName ? src.nodeName.toLowerCase() : '';
		
				return col !== undefined || type == 'td' || type == 'th' ?
					api.cell( src, col ).data() :
					api.row( src ).data() || null;
			}
		
			return api.data().toArray();
		};
		
		
		/**
		 * Get an array of the TR nodes that are used in the table's body. Note that you will
		 * typically want to use the '$' API method in preference to this as it is more
		 * flexible.
		 *  @param {int} [iRow] Optional row index for the TR element you want
		 *  @returns {array|node} If iRow is undefined, returns an array of all TR elements
		 *    in the table's body, or iRow is defined, just the TR element requested.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the nodes from the table
		 *      var nNodes = oTable.fnGetNodes( );
		 *    } );
		 */
		this.fnGetNodes = function( iRow )
		{
			var api = this.api( true );
		
			return iRow !== undefined ?
				api.row( iRow ).node() :
				api.rows().nodes().flatten().toArray();
		};
		
		
		/**
		 * Get the array indexes of a particular cell from it's DOM element
		 * and column index including hidden columns
		 *  @param {node} node this can either be a TR, TD or TH in the table's body
		 *  @returns {int} If nNode is given as a TR, then a single index is returned, or
		 *    if given as a cell, an array of [row index, column index (visible),
		 *    column index (all)] is given.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      $('#example tbody td').click( function () {
		 *        // Get the position of the current data from the node
		 *        var aPos = oTable.fnGetPosition( this );
		 *
		 *        // Get the data array for this row
		 *        var aData = oTable.fnGetData( aPos[0] );
		 *
		 *        // Update the data array and return the value
		 *        aData[ aPos[1] ] = 'clicked';
		 *        this.innerHTML = 'clicked';
		 *      } );
		 *
		 *      // Init DataTables
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnGetPosition = function( node )
		{
			var api = this.api( true );
			var nodeName = node.nodeName.toUpperCase();
		
			if ( nodeName == 'TR' ) {
				return api.row( node ).index();
			}
			else if ( nodeName == 'TD' || nodeName == 'TH' ) {
				var cell = api.cell( node ).index();
		
				return [
					cell.row,
					cell.columnVisible,
					cell.column
				];
			}
			return null;
		};
		
		
		/**
		 * Check to see if a row is 'open' or not.
		 *  @param {node} nTr the table row to check
		 *  @returns {boolean} true if the row is currently open, false otherwise
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnIsOpen = function( nTr )
		{
			return this.api( true ).row( nTr ).child.isShown();
		};
		
		
		/**
		 * This function will place a new row directly after a row which is currently
		 * on display on the page, with the HTML contents that is passed into the
		 * function. This can be used, for example, to ask for confirmation that a
		 * particular record should be deleted.
		 *  @param {node} nTr The table row to 'open'
		 *  @param {string|node|jQuery} mHtml The HTML to put into the row
		 *  @param {string} sClass Class to give the new TD cell
		 *  @returns {node} The row opened. Note that if the table row passed in as the
		 *    first parameter, is not found in the table, this method will silently
		 *    return.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnOpen = function( nTr, mHtml, sClass )
		{
			return this.api( true )
				.row( nTr )
				.child( mHtml, sClass )
				.show()
				.child()[0];
		};
		
		
		/**
		 * Change the pagination - provides the internal logic for pagination in a simple API
		 * function. With this function you can have a DataTables table go to the next,
		 * previous, first or last pages.
		 *  @param {string|int} mAction Paging action to take: "first", "previous", "next" or "last"
		 *    or page number to jump to (integer), note that page 0 is the first page.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnPageChange( 'next' );
		 *    } );
		 */
		this.fnPageChange = function ( mAction, bRedraw )
		{
			var api = this.api( true ).page( mAction );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw(false);
			}
		};
		
		
		/**
		 * Show a particular column
		 *  @param {int} iCol The column whose display should be changed
		 *  @param {bool} bShow Show (true) or hide (false) the column
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Hide the second column after initialisation
		 *      oTable.fnSetColumnVis( 1, false );
		 *    } );
		 */
		this.fnSetColumnVis = function ( iCol, bShow, bRedraw )
		{
			var api = this.api( true ).column( iCol ).visible( bShow );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.columns.adjust().draw();
			}
		};
		
		
		/**
		 * Get the settings for a particular table for external manipulation
		 *  @returns {object} DataTables settings object. See
		 *    {@link DataTable.models.oSettings}
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      var oSettings = oTable.fnSettings();
		 *
		 *      // Show an example parameter from the settings
		 *      alert( oSettings._iDisplayStart );
		 *    } );
		 */
		this.fnSettings = function()
		{
			return _fnSettingsFromNode( this[_ext.iApiIndex] );
		};
		
		
		/**
		 * Sort the table by a particular column
		 *  @param {int} iCol the data index to sort on. Note that this will not match the
		 *    'display index' if you have hidden data entries
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort immediately with columns 0 and 1
		 *      oTable.fnSort( [ [0,'asc'], [1,'asc'] ] );
		 *    } );
		 */
		this.fnSort = function( aaSort )
		{
			this.api( true ).order( aaSort ).draw();
		};
		
		
		/**
		 * Attach a sort listener to an element for a given column
		 *  @param {node} nNode the element to attach the sort listener to
		 *  @param {int} iColumn the column that a click on this node will sort on
		 *  @param {function} [fnCallback] callback function when sort is run
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort on column 1, when 'sorter' is clicked on
		 *      oTable.fnSortListener( document.getElementById('sorter'), 1 );
		 *    } );
		 */
		this.fnSortListener = function( nNode, iColumn, fnCallback )
		{
			this.api( true ).order.listener( nNode, iColumn, fnCallback );
		};
		
		
		/**
		 * Update a table cell or row - this method will accept either a single value to
		 * update the cell with, an array of values with one element for each column or
		 * an object in the same format as the original data source. The function is
		 * self-referencing in order to make the multi column updates easier.
		 *  @param {object|array|string} mData Data to update the cell/row with
		 *  @param {node|int} mRow TR element you want to update or the aoData index
		 *  @param {int} [iColumn] The column to update, give as null or undefined to
		 *    update a whole row.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @param {bool} [bAction=true] Perform pre-draw actions or not
		 *  @returns {int} 0 on success, 1 on error
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnUpdate( 'Example update', 0, 0 ); // Single cell
		 *      oTable.fnUpdate( ['a', 'b', 'c', 'd', 'e'], $('tbody tr')[0] ); // Row
		 *    } );
		 */
		this.fnUpdate = function( mData, mRow, iColumn, bRedraw, bAction )
		{
			var api = this.api( true );
		
			if ( iColumn === undefined || iColumn === null ) {
				api.row( mRow ).data( mData );
			}
			else {
				api.cell( mRow, iColumn ).data( mData );
			}
		
			if ( bAction === undefined || bAction ) {
				api.columns.adjust();
			}
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
			return 0;
		};
		
		
		/**
		 * Provide a common method for plug-ins to check the version of DataTables being used, in order
		 * to ensure compatibility.
		 *  @param {string} sVersion Version string to check for, in the format "X.Y.Z". Note that the
		 *    formats "X" and "X.Y" are also acceptable.
		 *  @returns {boolean} true if this version of DataTables is greater or equal to the required
		 *    version, or false if this version of DataTales is not suitable
		 *  @method
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      alert( oTable.fnVersionCheck( '1.9.0' ) );
		 *    } );
		 */
		this.fnVersionCheck = _ext.fnVersionCheck;
		

		var _that = this;
		var emptyInit = options === undefined;
		var len = this.length;

		if ( emptyInit ) {
			options = {};
		}

		this.oApi = this.internal = _ext.internal;

		// Extend with old style plug-in API methods
		for ( var fn in DataTable.ext.internal ) {
			if ( fn ) {
				this[fn] = _fnExternApiFunc(fn);
			}
		}

		this.each(function() {
			// For each initialisation we want to give it a clean initialisation
			// object that can be bashed around
			var o = {};
			var oInit = len > 1 ? // optimisation for single table case
				_fnExtend( o, options, true ) :
				options;

			/*global oInit,_that,emptyInit*/
			var i=0, iLen, j, jLen, k, kLen;
			var sId = this.getAttribute( 'id' );
			var bInitHandedOff = false;
			var defaults = DataTable.defaults;
			var $this = $(this);
			
			
			/* Sanity check */
			if ( this.nodeName.toLowerCase() != 'table' )
			{
				_fnLog( null, 0, 'Non-table node initialisation ('+this.nodeName+')', 2 );
				return;
			}
			
			/* Backwards compatibility for the defaults */
			_fnCompatOpts( defaults );
			_fnCompatCols( defaults.column );
			
			/* Convert the camel-case defaults to Hungarian */
			_fnCamelToHungarian( defaults, defaults, true );
			_fnCamelToHungarian( defaults.column, defaults.column, true );
			
			/* Setting up the initialisation object */
			_fnCamelToHungarian( defaults, $.extend( oInit, $this.data() ) );
			
			
			
			/* Check to see if we are re-initialising a table */
			var allSettings = DataTable.settings;
			for ( i=0, iLen=allSettings.length ; i<iLen ; i++ )
			{
				var s = allSettings[i];
			
				/* Base check on table node */
				if ( s.nTable == this || s.nTHead.parentNode == this || (s.nTFoot && s.nTFoot.parentNode == this) )
				{
					var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
					var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;
			
					if ( emptyInit || bRetrieve )
					{
						return s.oInstance;
					}
					else if ( bDestroy )
					{
						s.oInstance.fnDestroy();
						break;
					}
					else
					{
						_fnLog( s, 0, 'Cannot reinitialise DataTable', 3 );
						return;
					}
				}
			
				/* If the element we are initialising has the same ID as a table which was previously
				 * initialised, but the table nodes don't match (from before) then we destroy the old
				 * instance by simply deleting it. This is under the assumption that the table has been
				 * destroyed by other methods. Anyone using non-id selectors will need to do this manually
				 */
				if ( s.sTableId == this.id )
				{
					allSettings.splice( i, 1 );
					break;
				}
			}
			
			/* Ensure the table has an ID - required for accessibility */
			if ( sId === null || sId === "" )
			{
				sId = "DataTables_Table_"+(DataTable.ext._unique++);
				this.id = sId;
			}
			
			/* Create the settings object for this table and set some of the default parameters */
			var oSettings = $.extend( true, {}, DataTable.models.oSettings, {
				"sDestroyWidth": $this[0].style.width,
				"sInstance":     sId,
				"sTableId":      sId
			} );
			oSettings.nTable = this;
			oSettings.oApi   = _that.internal;
			oSettings.oInit  = oInit;
			
			allSettings.push( oSettings );
			
			// Need to add the instance after the instance after the settings object has been added
			// to the settings array, so we can self reference the table instance if more than one
			oSettings.oInstance = (_that.length===1) ? _that : $this.dataTable();
			
			// Backwards compatibility, before we apply all the defaults
			_fnCompatOpts( oInit );
			
			if ( oInit.oLanguage )
			{
				_fnLanguageCompat( oInit.oLanguage );
			}
			
			// If the length menu is given, but the init display length is not, use the length menu
			if ( oInit.aLengthMenu && ! oInit.iDisplayLength )
			{
				oInit.iDisplayLength = $.isArray( oInit.aLengthMenu[0] ) ?
					oInit.aLengthMenu[0][0] : oInit.aLengthMenu[0];
			}
			
			// Apply the defaults and init options to make a single init object will all
			// options defined from defaults and instance options.
			oInit = _fnExtend( $.extend( true, {}, defaults ), oInit );
			
			
			// Map the initialisation options onto the settings object
			_fnMap( oSettings.oFeatures, oInit, [
				"bPaginate",
				"bLengthChange",
				"bFilter",
				"bSort",
				"bSortMulti",
				"bInfo",
				"bProcessing",
				"bAutoWidth",
				"bSortClasses",
				"bServerSide",
				"bDeferRender"
			] );
			_fnMap( oSettings, oInit, [
				"asStripeClasses",
				"ajax",
				"fnServerData",
				"fnFormatNumber",
				"sServerMethod",
				"aaSorting",
				"aaSortingFixed",
				"aLengthMenu",
				"sPaginationType",
				"sAjaxSource",
				"sAjaxDataProp",
				"iStateDuration",
				"sDom",
				"bSortCellsTop",
				"iTabIndex",
				"fnStateLoadCallback",
				"fnStateSaveCallback",
				"renderer",
				"searchDelay",
				"rowId",
				[ "iCookieDuration", "iStateDuration" ], // backwards compat
				[ "oSearch", "oPreviousSearch" ],
				[ "aoSearchCols", "aoPreSearchCols" ],
				[ "iDisplayLength", "_iDisplayLength" ],
				[ "bJQueryUI", "bJUI" ]
			] );
			_fnMap( oSettings.oScroll, oInit, [
				[ "sScrollX", "sX" ],
				[ "sScrollXInner", "sXInner" ],
				[ "sScrollY", "sY" ],
				[ "bScrollCollapse", "bCollapse" ]
			] );
			_fnMap( oSettings.oLanguage, oInit, "fnInfoCallback" );
			
			/* Callback functions which are array driven */
			_fnCallbackReg( oSettings, 'aoDrawCallback',       oInit.fnDrawCallback,      'user' );
			_fnCallbackReg( oSettings, 'aoServerParams',       oInit.fnServerParams,      'user' );
			_fnCallbackReg( oSettings, 'aoStateSaveParams',    oInit.fnStateSaveParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoadParams',    oInit.fnStateLoadParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoaded',        oInit.fnStateLoaded,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCallback',        oInit.fnRowCallback,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow,        'user' );
			_fnCallbackReg( oSettings, 'aoHeaderCallback',     oInit.fnHeaderCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoFooterCallback',     oInit.fnFooterCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoInitComplete',       oInit.fnInitComplete,      'user' );
			_fnCallbackReg( oSettings, 'aoPreDrawCallback',    oInit.fnPreDrawCallback,   'user' );
			
			oSettings.rowIdFn = _fnGetObjectDataFn( oInit.rowId );
			
			/* Browser support detection */
			_fnBrowserDetect( oSettings );
			
			var oClasses = oSettings.oClasses;
			
			// @todo Remove in 1.11
			if ( oInit.bJQueryUI )
			{
				/* Use the JUI classes object for display. You could clone the oStdClasses object if
				 * you want to have multiple tables with multiple independent classes
				 */
				$.extend( oClasses, DataTable.ext.oJUIClasses, oInit.oClasses );
			
				if ( oInit.sDom === defaults.sDom && defaults.sDom === "lfrtip" )
				{
					/* Set the DOM to use a layout suitable for jQuery UI's theming */
					oSettings.sDom = '<"H"lfr>t<"F"ip>';
				}
			
				if ( ! oSettings.renderer ) {
					oSettings.renderer = 'jqueryui';
				}
				else if ( $.isPlainObject( oSettings.renderer ) && ! oSettings.renderer.header ) {
					oSettings.renderer.header = 'jqueryui';
				}
			}
			else
			{
				$.extend( oClasses, DataTable.ext.classes, oInit.oClasses );
			}
			$this.addClass( oClasses.sTable );
			
			
			if ( oSettings.iInitDisplayStart === undefined )
			{
				/* Display start point, taking into account the save saving */
				oSettings.iInitDisplayStart = oInit.iDisplayStart;
				oSettings._iDisplayStart = oInit.iDisplayStart;
			}
			
			if ( oInit.iDeferLoading !== null )
			{
				oSettings.bDeferLoading = true;
				var tmp = $.isArray( oInit.iDeferLoading );
				oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading;
				oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading;
			}
			
			/* Language definitions */
			var oLanguage = oSettings.oLanguage;
			$.extend( true, oLanguage, oInit.oLanguage );
			
			if ( oLanguage.sUrl !== "" )
			{
				/* Get the language definitions from a file - because this Ajax call makes the language
				 * get async to the remainder of this function we use bInitHandedOff to indicate that
				 * _fnInitialise will be fired by the returned Ajax handler, rather than the constructor
				 */
				$.ajax( {
					dataType: 'json',
					url: oLanguage.sUrl,
					success: function ( json ) {
						_fnLanguageCompat( json );
						_fnCamelToHungarian( defaults.oLanguage, json );
						$.extend( true, oLanguage, json );
						_fnInitialise( oSettings );
					},
					error: function () {
						// Error occurred loading language file, continue on as best we can
						_fnInitialise( oSettings );
					}
				} );
				bInitHandedOff = true;
			}
			
			/*
			 * Stripes
			 */
			if ( oInit.asStripeClasses === null )
			{
				oSettings.asStripeClasses =[
					oClasses.sStripeOdd,
					oClasses.sStripeEven
				];
			}
			
			/* Remove row stripe classes if they are already on the table row */
			var stripeClasses = oSettings.asStripeClasses;
			var rowOne = $this.children('tbody').find('tr').eq(0);
			if ( $.inArray( true, $.map( stripeClasses, function(el, i) {
				return rowOne.hasClass(el);
			} ) ) !== -1 ) {
				$('tbody tr', this).removeClass( stripeClasses.join(' ') );
				oSettings.asDestroyStripes = stripeClasses.slice();
			}
			
			/*
			 * Columns
			 * See if we should load columns automatically or use defined ones
			 */
			var anThs = [];
			var aoColumnsInit;
			var nThead = this.getElementsByTagName('thead');
			if ( nThead.length !== 0 )
			{
				_fnDetectHeader( oSettings.aoHeader, nThead[0] );
				anThs = _fnGetUniqueThs( oSettings );
			}
			
			/* If not given a column array, generate one with nulls */
			if ( oInit.aoColumns === null )
			{
				aoColumnsInit = [];
				for ( i=0, iLen=anThs.length ; i<iLen ; i++ )
				{
					aoColumnsInit.push( null );
				}
			}
			else
			{
				aoColumnsInit = oInit.aoColumns;
			}
			
			/* Add the columns */
			for ( i=0, iLen=aoColumnsInit.length ; i<iLen ; i++ )
			{
				_fnAddColumn( oSettings, anThs ? anThs[i] : null );
			}
			
			/* Apply the column definitions */
			_fnApplyColumnDefs( oSettings, oInit.aoColumnDefs, aoColumnsInit, function (iCol, oDef) {
				_fnColumnOptions( oSettings, iCol, oDef );
			} );
			
			/* HTML5 attribute detection - build an mData object automatically if the
			 * attributes are found
			 */
			if ( rowOne.length ) {
				var a = function ( cell, name ) {
					return cell.getAttribute( 'data-'+name ) !== null ? name : null;
				};
			
				$( rowOne[0] ).children('th, td').each( function (i, cell) {
					var col = oSettings.aoColumns[i];
			
					if ( col.mData === i ) {
						var sort = a( cell, 'sort' ) || a( cell, 'order' );
						var filter = a( cell, 'filter' ) || a( cell, 'search' );
			
						if ( sort !== null || filter !== null ) {
							col.mData = {
								_:      i+'.display',
								sort:   sort !== null   ? i+'.@data-'+sort   : undefined,
								type:   sort !== null   ? i+'.@data-'+sort   : undefined,
								filter: filter !== null ? i+'.@data-'+filter : undefined
							};
			
							_fnColumnOptions( oSettings, i );
						}
					}
				} );
			}
			
			var features = oSettings.oFeatures;
			
			/* Must be done after everything which can be overridden by the state saving! */
			if ( oInit.bStateSave )
			{
				features.bStateSave = true;
				_fnLoadState( oSettings, oInit );
				_fnCallbackReg( oSettings, 'aoDrawCallback', _fnSaveState, 'state_save' );
			}
			
			
			/*
			 * Sorting
			 * @todo For modularisation (1.11) this needs to do into a sort start up handler
			 */
			
			// If aaSorting is not defined, then we use the first indicator in asSorting
			// in case that has been altered, so the default sort reflects that option
			if ( oInit.aaSorting === undefined )
			{
				var sorting = oSettings.aaSorting;
				for ( i=0, iLen=sorting.length ; i<iLen ; i++ )
				{
					sorting[i][1] = oSettings.aoColumns[ i ].asSorting[0];
				}
			}
			
			/* Do a first pass on the sorting classes (allows any size changes to be taken into
			 * account, and also will apply sorting disabled classes if disabled
			 */
			_fnSortingClasses( oSettings );
			
			if ( features.bSort )
			{
				_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
					if ( oSettings.bSorted ) {
						var aSort = _fnSortFlatten( oSettings );
						var sortedColumns = {};
			
						$.each( aSort, function (i, val) {
							sortedColumns[ val.src ] = val.dir;
						} );
			
						_fnCallbackFire( oSettings, null, 'order', [oSettings, aSort, sortedColumns] );
						_fnSortAria( oSettings );
					}
				} );
			}
			
			_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
				if ( oSettings.bSorted || _fnDataSource( oSettings ) === 'ssp' || features.bDeferRender ) {
					_fnSortingClasses( oSettings );
				}
			}, 'sc' );
			
			
			/*
			 * Final init
			 * Cache the header, body and footer as required, creating them if needed
			 */
			
			// Work around for Webkit bug 83867 - store the caption-side before removing from doc
			var captions = $this.children('caption').each( function () {
				this._captionSide = $this.css('caption-side');
			} );
			
			var thead = $this.children('thead');
			if ( thead.length === 0 )
			{
				thead = $('<thead/>').appendTo(this);
			}
			oSettings.nTHead = thead[0];
			
			var tbody = $this.children('tbody');
			if ( tbody.length === 0 )
			{
				tbody = $('<tbody/>').appendTo(this);
			}
			oSettings.nTBody = tbody[0];
			
			var tfoot = $this.children('tfoot');
			if ( tfoot.length === 0 && captions.length > 0 && (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "") )
			{
				// If we are a scrolling table, and no footer has been given, then we need to create
				// a tfoot element for the caption element to be appended to
				tfoot = $('<tfoot/>').appendTo(this);
			}
			
			if ( tfoot.length === 0 || tfoot.children().length === 0 ) {
				$this.addClass( oClasses.sNoFooter );
			}
			else if ( tfoot.length > 0 ) {
				oSettings.nTFoot = tfoot[0];
				_fnDetectHeader( oSettings.aoFooter, oSettings.nTFoot );
			}
			
			/* Check if there is data passing into the constructor */
			if ( oInit.aaData )
			{
				for ( i=0 ; i<oInit.aaData.length ; i++ )
				{
					_fnAddData( oSettings, oInit.aaData[ i ] );
				}
			}
			else if ( oSettings.bDeferLoading || _fnDataSource( oSettings ) == 'dom' )
			{
				/* Grab the data from the page - only do this when deferred loading or no Ajax
				 * source since there is no point in reading the DOM data if we are then going
				 * to replace it with Ajax data
				 */
				_fnAddTr( oSettings, $(oSettings.nTBody).children('tr') );
			}
			
			/* Copy the data index array */
			oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
			
			/* Initialisation complete - table can be drawn */
			oSettings.bInitialised = true;
			
			/* Check if we need to initialise the table (it might not have been handed off to the
			 * language processor)
			 */
			if ( bInitHandedOff === false )
			{
				_fnInitialise( oSettings );
			}
		} );
		_that = null;
		return this;
	};

	
	/*
	 * It is useful to have variables which are scoped locally so only the
	 * DataTables functions can access them and they don't leak into global space.
	 * At the same time these functions are often useful over multiple files in the
	 * core and API, so we list, or at least document, all variables which are used
	 * by DataTables as private variables here. This also ensures that there is no
	 * clashing of variable names and that they can easily referenced for reuse.
	 */
	
	
	// Defined else where
	//  _selector_run
	//  _selector_opts
	//  _selector_first
	//  _selector_row_indexes
	
	var _ext; // DataTable.ext
	var _Api; // DataTable.Api
	var _api_register; // DataTable.Api.register
	var _api_registerPlural; // DataTable.Api.registerPlural
	
	var _re_dic = {};
	var _re_new_lines = /[\r\n]/g;
	var _re_html = /<.*?>/g;
	var _re_date_start = /^[\w\+\-]/;
	var _re_date_end = /[\w\+\-]$/;
	
	// Escape regular expression special characters
	var _re_escape_regex = new RegExp( '(\\' + [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ].join('|\\') + ')', 'g' );
	
	// http://en.wikipedia.org/wiki/Foreign_exchange_market
	// - \u20BD - Russian ruble.
	// - \u20a9 - South Korean Won
	// - \u20BA - Turkish Lira
	// - \u20B9 - Indian Rupee
	// - R - Brazil (R$) and South Africa
	// - fr - Swiss Franc
	// - kr - Swedish krona, Norwegian krone and Danish krone
	// - \u2009 is thin space and \u202F is narrow no-break space, both used in many
	//   standards as thousands separators.
	var _re_formatted_numeric = /[',$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfk]/gi;
	
	
	var _empty = function ( d ) {
		return !d || d === true || d === '-' ? true : false;
	};
	
	
	var _intVal = function ( s ) {
		var integer = parseInt( s, 10 );
		return !isNaN(integer) && isFinite(s) ? integer : null;
	};
	
	// Convert from a formatted number with characters other than `.` as the
	// decimal place, to a Javascript number
	var _numToDecimal = function ( num, decimalPoint ) {
		// Cache created regular expressions for speed as this function is called often
		if ( ! _re_dic[ decimalPoint ] ) {
			_re_dic[ decimalPoint ] = new RegExp( _fnEscapeRegex( decimalPoint ), 'g' );
		}
		return typeof num === 'string' && decimalPoint !== '.' ?
			num.replace( /\./g, '' ).replace( _re_dic[ decimalPoint ], '.' ) :
			num;
	};
	
	
	var _isNumber = function ( d, decimalPoint, formatted ) {
		var strType = typeof d === 'string';
	
		// If empty return immediately so there must be a number if it is a
		// formatted string (this stops the string "k", or "kr", etc being detected
		// as a formatted number for currency
		if ( _empty( d ) ) {
			return true;
		}
	
		if ( decimalPoint && strType ) {
			d = _numToDecimal( d, decimalPoint );
		}
	
		if ( formatted && strType ) {
			d = d.replace( _re_formatted_numeric, '' );
		}
	
		return !isNaN( parseFloat(d) ) && isFinite( d );
	};
	
	
	// A string without HTML in it can be considered to be HTML still
	var _isHtml = function ( d ) {
		return _empty( d ) || typeof d === 'string';
	};
	
	
	var _htmlNumeric = function ( d, decimalPoint, formatted ) {
		if ( _empty( d ) ) {
			return true;
		}
	
		var html = _isHtml( d );
		return ! html ?
			null :
			_isNumber( _stripHtml( d ), decimalPoint, formatted ) ?
				true :
				null;
	};
	
	
	var _pluck = function ( a, prop, prop2 ) {
		var out = [];
		var i=0, ien=a.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[i] && a[i][ prop ] ) {
					out.push( a[i][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				if ( a[i] ) {
					out.push( a[i][ prop ] );
				}
			}
		}
	
		return out;
	};
	
	
	// Basically the same as _pluck, but rather than looping over `a` we use `order`
	// as the indexes to pick from `a`
	var _pluck_order = function ( a, order, prop, prop2 )
	{
		var out = [];
		var i=0, ien=order.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[ order[i] ][ prop ] ) {
					out.push( a[ order[i] ][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				out.push( a[ order[i] ][ prop ] );
			}
		}
	
		return out;
	};
	
	
	var _range = function ( len, start )
	{
		var out = [];
		var end;
	
		if ( start === undefined ) {
			start = 0;
			end = len;
		}
		else {
			end = start;
			start = len;
		}
	
		for ( var i=start ; i<end ; i++ ) {
			out.push( i );
		}
	
		return out;
	};
	
	
	var _removeEmpty = function ( a )
	{
		var out = [];
	
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( a[i] ) { // careful - will remove all falsy values!
				out.push( a[i] );
			}
		}
	
		return out;
	};
	
	
	var _stripHtml = function ( d ) {
		return d.replace( _re_html, '' );
	};
	
	
	/**
	 * Find the unique elements in a source array.
	 *
	 * @param  {array} src Source array
	 * @return {array} Array of unique items
	 * @ignore
	 */
	var _unique = function ( src )
	{
		// A faster unique method is to use object keys to identify used values,
		// but this doesn't work with arrays or objects, which we must also
		// consider. See jsperf.com/compare-array-unique-versions/4 for more
		// information.
		var
			out = [],
			val,
			i, ien=src.length,
			j, k=0;
	
		again: for ( i=0 ; i<ien ; i++ ) {
			val = src[i];
	
			for ( j=0 ; j<k ; j++ ) {
				if ( out[j] === val ) {
					continue again;
				}
			}
	
			out.push( val );
			k++;
		}
	
		return out;
	};
	
	
	/**
	 * DataTables utility methods
	 * 
	 * This namespace provides helper methods that DataTables uses internally to
	 * create a DataTable, but which are not exclusively used only for DataTables.
	 * These methods can be used by extension authors to save the duplication of
	 * code.
	 *
	 *  @namespace
	 */
	DataTable.util = {
		/**
		 * Throttle the calls to a function. Arguments and context are maintained
		 * for the throttled function.
		 *
		 * @param {function} fn Function to be called
		 * @param {integer} freq Call frequency in mS
		 * @return {function} Wrapped function
		 */
		throttle: function ( fn, freq ) {
			var
				frequency = freq !== undefined ? freq : 200,
				last,
				timer;
	
			return function () {
				var
					that = this,
					now  = +new Date(),
					args = arguments;
	
				if ( last && now < last + frequency ) {
					clearTimeout( timer );
	
					timer = setTimeout( function () {
						last = undefined;
						fn.apply( that, args );
					}, frequency );
				}
				else {
					last = now;
					fn.apply( that, args );
				}
			};
		},
	
	
		/**
		 * Escape a string such that it can be used in a regular expression
		 *
		 *  @param {string} val string to escape
		 *  @returns {string} escaped string
		 */
		escapeRegex: function ( val ) {
			return val.replace( _re_escape_regex, '\\$1' );
		}
	};
	
	
	
	/**
	 * Create a mapping object that allows camel case parameters to be looked up
	 * for their Hungarian counterparts. The mapping is stored in a private
	 * parameter called `_hungarianMap` which can be accessed on the source object.
	 *  @param {object} o
	 *  @memberof DataTable#oApi
	 */
	function _fnHungarianMap ( o )
	{
		var
			hungarian = 'a aa ai ao as b fn i m o s ',
			match,
			newKey,
			map = {};
	
		$.each( o, function (key, val) {
			match = key.match(/^([^A-Z]+?)([A-Z])/);
	
			if ( match && hungarian.indexOf(match[1]+' ') !== -1 )
			{
				newKey = key.replace( match[0], match[2].toLowerCase() );
				map[ newKey ] = key;
	
				if ( match[1] === 'o' )
				{
					_fnHungarianMap( o[key] );
				}
			}
		} );
	
		o._hungarianMap = map;
	}
	
	
	/**
	 * Convert from camel case parameters to Hungarian, based on a Hungarian map
	 * created by _fnHungarianMap.
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 *  @memberof DataTable#oApi
	 */
	function _fnCamelToHungarian ( src, user, force )
	{
		if ( ! src._hungarianMap ) {
			_fnHungarianMap( src );
		}
	
		var hungarianKey;
	
		$.each( user, function (key, val) {
			hungarianKey = src._hungarianMap[ key ];
	
			if ( hungarianKey !== undefined && (force || user[hungarianKey] === undefined) )
			{
				// For objects, we need to buzz down into the object to copy parameters
				if ( hungarianKey.charAt(0) === 'o' )
				{
					// Copy the camelCase options over to the hungarian
					if ( ! user[ hungarianKey ] ) {
						user[ hungarianKey ] = {};
					}
					$.extend( true, user[hungarianKey], user[key] );
	
					_fnCamelToHungarian( src[hungarianKey], user[hungarianKey], force );
				}
				else {
					user[hungarianKey] = user[ key ];
				}
			}
		} );
	}
	
	
	/**
	 * Language compatibility - when certain options are given, and others aren't, we
	 * need to duplicate the values over, in order to provide backwards compatibility
	 * with older language files.
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnLanguageCompat( lang )
	{
		var defaults = DataTable.defaults.oLanguage;
		var zeroRecords = lang.sZeroRecords;
	
		/* Backwards compatibility - if there is no sEmptyTable given, then use the same as
		 * sZeroRecords - assuming that is given.
		 */
		if ( ! lang.sEmptyTable && zeroRecords &&
			defaults.sEmptyTable === "No data available in table" )
		{
			_fnMap( lang, lang, 'sZeroRecords', 'sEmptyTable' );
		}
	
		/* Likewise with loading records */
		if ( ! lang.sLoadingRecords && zeroRecords &&
			defaults.sLoadingRecords === "Loading..." )
		{
			_fnMap( lang, lang, 'sZeroRecords', 'sLoadingRecords' );
		}
	
		// Old parameter name of the thousands separator mapped onto the new
		if ( lang.sInfoThousands ) {
			lang.sThousands = lang.sInfoThousands;
		}
	
		var decimal = lang.sDecimal;
		if ( decimal ) {
			_addNumericSort( decimal );
		}
	}
	
	
	/**
	 * Map one parameter onto another
	 *  @param {object} o Object to map
	 *  @param {*} knew The new parameter name
	 *  @param {*} old The old parameter name
	 */
	var _fnCompatMap = function ( o, knew, old ) {
		if ( o[ knew ] !== undefined ) {
			o[ old ] = o[ knew ];
		}
	};
	
	
	/**
	 * Provide backwards compatibility for the main DT options. Note that the new
	 * options are mapped onto the old parameters, so this is an external interface
	 * change only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatOpts ( init )
	{
		_fnCompatMap( init, 'ordering',      'bSort' );
		_fnCompatMap( init, 'orderMulti',    'bSortMulti' );
		_fnCompatMap( init, 'orderClasses',  'bSortClasses' );
		_fnCompatMap( init, 'orderCellsTop', 'bSortCellsTop' );
		_fnCompatMap( init, 'order',         'aaSorting' );
		_fnCompatMap( init, 'orderFixed',    'aaSortingFixed' );
		_fnCompatMap( init, 'paging',        'bPaginate' );
		_fnCompatMap( init, 'pagingType',    'sPaginationType' );
		_fnCompatMap( init, 'pageLength',    'iDisplayLength' );
		_fnCompatMap( init, 'searching',     'bFilter' );
	
		// Boolean initialisation of x-scrolling
		if ( typeof init.sScrollX === 'boolean' ) {
			init.sScrollX = init.sScrollX ? '100%' : '';
		}
		if ( typeof init.scrollX === 'boolean' ) {
			init.scrollX = init.scrollX ? '100%' : '';
		}
	
		// Column search objects are in an array, so it needs to be converted
		// element by element
		var searchCols = init.aoSearchCols;
	
		if ( searchCols ) {
			for ( var i=0, ien=searchCols.length ; i<ien ; i++ ) {
				if ( searchCols[i] ) {
					_fnCamelToHungarian( DataTable.models.oSearch, searchCols[i] );
				}
			}
		}
	}
	
	
	/**
	 * Provide backwards compatibility for column options. Note that the new options
	 * are mapped onto the old parameters, so this is an external interface change
	 * only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatCols ( init )
	{
		_fnCompatMap( init, 'orderable',     'bSortable' );
		_fnCompatMap( init, 'orderData',     'aDataSort' );
		_fnCompatMap( init, 'orderSequence', 'asSorting' );
		_fnCompatMap( init, 'orderDataType', 'sortDataType' );
	
		// orderData can be given as an integer
		var dataSort = init.aDataSort;
		if ( dataSort && ! $.isArray( dataSort ) ) {
			init.aDataSort = [ dataSort ];
		}
	}
	
	
	/**
	 * Browser feature detection for capabilities, quirks
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBrowserDetect( settings )
	{
		// We don't need to do this every time DataTables is constructed, the values
		// calculated are specific to the browser and OS configuration which we
		// don't expect to change between initialisations
		if ( ! DataTable.__browser ) {
			var browser = {};
			DataTable.__browser = browser;
	
			// Scrolling feature / quirks detection
			var n = $('<div/>')
				.css( {
					position: 'fixed',
					top: 0,
					left: 0,
					height: 1,
					width: 1,
					overflow: 'hidden'
				} )
				.append(
					$('<div/>')
						.css( {
							position: 'absolute',
							top: 1,
							left: 1,
							width: 100,
							overflow: 'scroll'
						} )
						.append(
							$('<div/>')
								.css( {
									width: '100%',
									height: 10
								} )
						)
				)
				.appendTo( 'body' );
	
			var outer = n.children();
			var inner = outer.children();
	
			// Numbers below, in order, are:
			// inner.offsetWidth, inner.clientWidth, outer.offsetWidth, outer.clientWidth
			//
			// IE6 XP:                           100 100 100  83
			// IE7 Vista:                        100 100 100  83
			// IE 8+ Windows:                     83  83 100  83
			// Evergreen Windows:                 83  83 100  83
			// Evergreen Mac with scrollbars:     85  85 100  85
			// Evergreen Mac without scrollbars: 100 100 100 100
	
			// Get scrollbar width
			browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;
	
			// IE6/7 will oversize a width 100% element inside a scrolling element, to
			// include the width of the scrollbar, while other browsers ensure the inner
			// element is contained without forcing scrolling
			browser.bScrollOversize = inner[0].offsetWidth === 100 && outer[0].clientWidth !== 100;
	
			// In rtl text layout, some browsers (most, but not all) will place the
			// scrollbar on the left, rather than the right.
			browser.bScrollbarLeft = Math.round( inner.offset().left ) !== 1;
	
			// IE8- don't provide height and width for getBoundingClientRect
			browser.bBounding = n[0].getBoundingClientRect().width ? true : false;
	
			n.remove();
		}
	
		$.extend( settings.oBrowser, DataTable.__browser );
		settings.oScroll.iBarWidth = DataTable.__browser.barWidth;
	}
	
	
	/**
	 * Array.prototype reduce[Right] method, used for browsers which don't support
	 * JS 1.6. Done this way to reduce code size, since we iterate either way
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnReduce ( that, fn, init, start, end, inc )
	{
		var
			i = start,
			value,
			isSet = false;
	
		if ( init !== undefined ) {
			value = init;
			isSet = true;
		}
	
		while ( i !== end ) {
			if ( ! that.hasOwnProperty(i) ) {
				continue;
			}
	
			value = isSet ?
				fn( value, that[i], i, that ) :
				that[i];
	
			isSet = true;
			i += inc;
		}
	
		return value;
	}
	
	/**
	 * Add a column to the list used for the table with default values
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nTh The th element for this column
	 *  @memberof DataTable#oApi
	 */
	function _fnAddColumn( oSettings, nTh )
	{
		// Add column to aoColumns array
		var oDefaults = DataTable.defaults.column;
		var iCol = oSettings.aoColumns.length;
		var oCol = $.extend( {}, DataTable.models.oColumn, oDefaults, {
			"nTh": nTh ? nTh : document.createElement('th'),
			"sTitle":    oDefaults.sTitle    ? oDefaults.sTitle    : nTh ? nTh.innerHTML : '',
			"aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],
			"mData": oDefaults.mData ? oDefaults.mData : iCol,
			idx: iCol
		} );
		oSettings.aoColumns.push( oCol );
	
		// Add search object for column specific search. Note that the `searchCols[ iCol ]`
		// passed into extend can be undefined. This allows the user to give a default
		// with only some of the parameters defined, and also not give a default
		var searchCols = oSettings.aoPreSearchCols;
		searchCols[ iCol ] = $.extend( {}, DataTable.models.oSearch, searchCols[ iCol ] );
	
		// Use the default column options function to initialise classes etc
		_fnColumnOptions( oSettings, iCol, $(nTh).data() );
	}
	
	
	/**
	 * Apply options for a column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iCol column index to consider
	 *  @param {object} oOptions object with sType, bVisible and bSearchable etc
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnOptions( oSettings, iCol, oOptions )
	{
		var oCol = oSettings.aoColumns[ iCol ];
		var oClasses = oSettings.oClasses;
		var th = $(oCol.nTh);
	
		// Try to get width information from the DOM. We can't get it from CSS
		// as we'd need to parse the CSS stylesheet. `width` option can override
		if ( ! oCol.sWidthOrig ) {
			// Width attribute
			oCol.sWidthOrig = th.attr('width') || null;
	
			// Style attribute
			var t = (th.attr('style') || '').match(/width:\s*(\d+[pxem%]+)/);
			if ( t ) {
				oCol.sWidthOrig = t[1];
			}
		}
	
		/* User specified column options */
		if ( oOptions !== undefined && oOptions !== null )
		{
			// Backwards compatibility
			_fnCompatCols( oOptions );
	
			// Map camel case parameters to their Hungarian counterparts
			_fnCamelToHungarian( DataTable.defaults.column, oOptions );
	
			/* Backwards compatibility for mDataProp */
			if ( oOptions.mDataProp !== undefined && !oOptions.mData )
			{
				oOptions.mData = oOptions.mDataProp;
			}
	
			if ( oOptions.sType )
			{
				oCol._sManualType = oOptions.sType;
			}
	
			// `class` is a reserved word in Javascript, so we need to provide
			// the ability to use a valid name for the camel case input
			if ( oOptions.className && ! oOptions.sClass )
			{
				oOptions.sClass = oOptions.className;
			}
	
			$.extend( oCol, oOptions );
			_fnMap( oCol, oOptions, "sWidth", "sWidthOrig" );
	
			/* iDataSort to be applied (backwards compatibility), but aDataSort will take
			 * priority if defined
			 */
			if ( oOptions.iDataSort !== undefined )
			{
				oCol.aDataSort = [ oOptions.iDataSort ];
			}
			_fnMap( oCol, oOptions, "aDataSort" );
		}
	
		/* Cache the data get and set functions for speed */
		var mDataSrc = oCol.mData;
		var mData = _fnGetObjectDataFn( mDataSrc );
		var mRender = oCol.mRender ? _fnGetObjectDataFn( oCol.mRender ) : null;
	
		var attrTest = function( src ) {
			return typeof src === 'string' && src.indexOf('@') !== -1;
		};
		oCol._bAttrSrc = $.isPlainObject( mDataSrc ) && (
			attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter)
		);
		oCol._setter = null;
	
		oCol.fnGetData = function (rowData, type, meta) {
			var innerData = mData( rowData, type, undefined, meta );
	
			return mRender && type ?
				mRender( innerData, type, rowData, meta ) :
				innerData;
		};
		oCol.fnSetData = function ( rowData, val, meta ) {
			return _fnSetObjectDataFn( mDataSrc )( rowData, val, meta );
		};
	
		// Indicate if DataTables should read DOM data as an object or array
		// Used in _fnGetRowElements
		if ( typeof mDataSrc !== 'number' ) {
			oSettings._rowReadObject = true;
		}
	
		/* Feature sorting overrides column specific when off */
		if ( !oSettings.oFeatures.bSort )
		{
			oCol.bSortable = false;
			th.addClass( oClasses.sSortableNone ); // Have to add class here as order event isn't called
		}
	
		/* Check that the class assignment is correct for sorting */
		var bAsc = $.inArray('asc', oCol.asSorting) !== -1;
		var bDesc = $.inArray('desc', oCol.asSorting) !== -1;
		if ( !oCol.bSortable || (!bAsc && !bDesc) )
		{
			oCol.sSortingClass = oClasses.sSortableNone;
			oCol.sSortingClassJUI = "";
		}
		else if ( bAsc && !bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableAsc;
			oCol.sSortingClassJUI = oClasses.sSortJUIAscAllowed;
		}
		else if ( !bAsc && bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableDesc;
			oCol.sSortingClassJUI = oClasses.sSortJUIDescAllowed;
		}
		else
		{
			oCol.sSortingClass = oClasses.sSortable;
			oCol.sSortingClassJUI = oClasses.sSortJUI;
		}
	}
	
	
	/**
	 * Adjust the table column widths for new data. Note: you would probably want to
	 * do a redraw after calling this function!
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAdjustColumnSizing ( settings )
	{
		/* Not interested in doing column width calculation if auto-width is disabled */
		if ( settings.oFeatures.bAutoWidth !== false )
		{
			var columns = settings.aoColumns;
	
			_fnCalculateColumnWidths( settings );
			for ( var i=0 , iLen=columns.length ; i<iLen ; i++ )
			{
				columns[i].nTh.style.width = columns[i].sWidth;
			}
		}
	
		var scroll = settings.oScroll;
		if ( scroll.sY !== '' || scroll.sX !== '')
		{
			_fnScrollDraw( settings );
		}
	
		_fnCallbackFire( settings, null, 'column-sizing', [settings] );
	}
	
	
	/**
	 * Covert the index of a visible column to the index in the data array (take account
	 * of hidden columns)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iMatch Visible column index to lookup
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnVisibleToColumnIndex( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
	
		return typeof aiVis[iMatch] === 'number' ?
			aiVis[iMatch] :
			null;
	}
	
	
	/**
	 * Covert the index of an index in the data array and convert it to the visible
	 *   column index (take account of hidden columns)
	 *  @param {int} iMatch Column index to lookup
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnIndexToVisible( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
		var iPos = $.inArray( iMatch, aiVis );
	
		return iPos !== -1 ? iPos : null;
	}
	
	
	/**
	 * Get the number of visible columns
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the number of visible columns
	 *  @memberof DataTable#oApi
	 */
	function _fnVisbleColumns( oSettings )
	{
		var vis = 0;
	
		// No reduce in IE8, use a loop for now
		$.each( oSettings.aoColumns, function ( i, col ) {
			if ( col.bVisible && $(col.nTh).css('display') !== 'none' ) {
				vis++;
			}
		} );
	
		return vis;
	}
	
	
	/**
	 * Get an array of column indexes that match a given property
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sParam Parameter in aoColumns to look for - typically
	 *    bVisible or bSearchable
	 *  @returns {array} Array of indexes with matched properties
	 *  @memberof DataTable#oApi
	 */
	function _fnGetColumns( oSettings, sParam )
	{
		var a = [];
	
		$.map( oSettings.aoColumns, function(val, i) {
			if ( val[sParam] ) {
				a.push( i );
			}
		} );
	
		return a;
	}
	
	
	/**
	 * Calculate the 'type' of a column
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnTypes ( settings )
	{
		var columns = settings.aoColumns;
		var data = settings.aoData;
		var types = DataTable.ext.type.detect;
		var i, ien, j, jen, k, ken;
		var col, cell, detectedType, cache;
	
		// For each column, spin over the 
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			col = columns[i];
			cache = [];
	
			if ( ! col.sType && col._sManualType ) {
				col.sType = col._sManualType;
			}
			else if ( ! col.sType ) {
				for ( j=0, jen=types.length ; j<jen ; j++ ) {
					for ( k=0, ken=data.length ; k<ken ; k++ ) {
						// Use a cache array so we only need to get the type data
						// from the formatter once (when using multiple detectors)
						if ( cache[k] === undefined ) {
							cache[k] = _fnGetCellData( settings, k, i, 'type' );
						}
	
						detectedType = types[j]( cache[k], settings );
	
						// If null, then this type can't apply to this column, so
						// rather than testing all cells, break out. There is an
						// exception for the last type which is `html`. We need to
						// scan all rows since it is possible to mix string and HTML
						// types
						if ( ! detectedType && j !== types.length-1 ) {
							break;
						}
	
						// Only a single match is needed for html type since it is
						// bottom of the pile and very similar to string
						if ( detectedType === 'html' ) {
							break;
						}
					}
	
					// Type is valid for all data points in the column - use this
					// type
					if ( detectedType ) {
						col.sType = detectedType;
						break;
					}
				}
	
				// Fall back - if no type was detected, always use string
				if ( ! col.sType ) {
					col.sType = 'string';
				}
			}
		}
	}
	
	
	/**
	 * Take the column definitions and static columns arrays and calculate how
	 * they relate to column indexes. The callback function will then apply the
	 * definition found for a column to a suitable configuration object.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aoColDefs The aoColumnDefs array that is to be applied
	 *  @param {array} aoCols The aoColumns array that defines columns individually
	 *  @param {function} fn Callback function - takes two parameters, the calculated
	 *    column index and the definition for that column.
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyColumnDefs( oSettings, aoColDefs, aoCols, fn )
	{
		var i, iLen, j, jLen, k, kLen, def;
		var columns = oSettings.aoColumns;
	
		// Column definitions with aTargets
		if ( aoColDefs )
		{
			/* Loop over the definitions array - loop in reverse so first instance has priority */
			for ( i=aoColDefs.length-1 ; i>=0 ; i-- )
			{
				def = aoColDefs[i];
	
				/* Each definition can target multiple columns, as it is an array */
				var aTargets = def.targets !== undefined ?
					def.targets :
					def.aTargets;
	
				if ( ! $.isArray( aTargets ) )
				{
					aTargets = [ aTargets ];
				}
	
				for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )
				{
					if ( typeof aTargets[j] === 'number' && aTargets[j] >= 0 )
					{
						/* Add columns that we don't yet know about */
						while( columns.length <= aTargets[j] )
						{
							_fnAddColumn( oSettings );
						}
	
						/* Integer, basic index */
						fn( aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'number' && aTargets[j] < 0 )
					{
						/* Negative integer, right to left column counting */
						fn( columns.length+aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'string' )
					{
						/* Class name matching on TH element */
						for ( k=0, kLen=columns.length ; k<kLen ; k++ )
						{
							if ( aTargets[j] == "_all" ||
							     $(columns[k].nTh).hasClass( aTargets[j] ) )
							{
								fn( k, def );
							}
						}
					}
				}
			}
		}
	
		// Statically defined columns array
		if ( aoCols )
		{
			for ( i=0, iLen=aoCols.length ; i<iLen ; i++ )
			{
				fn( i, aoCols[i] );
			}
		}
	}
	
	/**
	 * Add a data array to the table, creating DOM node etc. This is the parallel to
	 * _fnGatherData, but for adding rows from a Javascript source, rather than a
	 * DOM source.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aData data array to be added
	 *  @param {node} [nTr] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @returns {int} >=0 if successful (index of new aoData entry), -1 if failed
	 *  @memberof DataTable#oApi
	 */
	function _fnAddData ( oSettings, aDataIn, nTr, anTds )
	{
		/* Create the object for storing information about this new row */
		var iRow = oSettings.aoData.length;
		var oData = $.extend( true, {}, DataTable.models.oRow, {
			src: nTr ? 'dom' : 'data',
			idx: iRow
		} );
	
		oData._aData = aDataIn;
		oSettings.aoData.push( oData );
	
		/* Create the cells */
		var nTd, sThisType;
		var columns = oSettings.aoColumns;
	
		// Invalidate the column types as the new data needs to be revalidated
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			columns[i].sType = null;
		}
	
		/* Add to the display array */
		oSettings.aiDisplayMaster.push( iRow );
	
		var id = oSettings.rowIdFn( aDataIn );
		if ( id !== undefined ) {
			oSettings.aIds[ id ] = oData;
		}
	
		/* Create the DOM information, or register it if already present */
		if ( nTr || ! oSettings.oFeatures.bDeferRender )
		{
			_fnCreateTr( oSettings, iRow, nTr, anTds );
		}
	
		return iRow;
	}
	
	
	/**
	 * Add one or more TR elements to the table. Generally we'd expect to
	 * use this for reading data from a DOM sourced table, but it could be
	 * used for an TR element. Note that if a TR is given, it is used (i.e.
	 * it is not cloned).
	 *  @param {object} settings dataTables settings object
	 *  @param {array|node|jQuery} trs The TR element(s) to add to the table
	 *  @returns {array} Array of indexes for the added rows
	 *  @memberof DataTable#oApi
	 */
	function _fnAddTr( settings, trs )
	{
		var row;
	
		// Allow an individual node to be passed in
		if ( ! (trs instanceof $) ) {
			trs = $(trs);
		}
	
		return trs.map( function (i, el) {
			row = _fnGetRowElements( settings, el );
			return _fnAddData( settings, row.data, el, row.cells );
		} );
	}
	
	
	/**
	 * Take a TR element and convert it to an index in aoData
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} n the TR element to find
	 *  @returns {int} index if the node is found, null if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToDataIndex( oSettings, n )
	{
		return (n._DT_RowIndex!==undefined) ? n._DT_RowIndex : null;
	}
	
	
	/**
	 * Take a TD element and convert it into a column data index (not the visible index)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow The row number the TD/TH can be found in
	 *  @param {node} n The TD/TH element to find
	 *  @returns {int} index if the node is found, -1 if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToColumnIndex( oSettings, iRow, n )
	{
		return $.inArray( n, oSettings.aoData[ iRow ].anCells );
	}
	
	
	/**
	 * Get the data for a given cell from the internal cache, taking into account data mapping
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {string} type data get type ('display', 'type' 'filter' 'sort')
	 *  @returns {*} Cell data
	 *  @memberof DataTable#oApi
	 */
	function _fnGetCellData( settings, rowIdx, colIdx, type )
	{
		var draw           = settings.iDraw;
		var col            = settings.aoColumns[colIdx];
		var rowData        = settings.aoData[rowIdx]._aData;
		var defaultContent = col.sDefaultContent;
		var cellData       = col.fnGetData( rowData, type, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		} );
	
		if ( cellData === undefined ) {
			if ( settings.iDrawError != draw && defaultContent === null ) {
				_fnLog( settings, 0, "Requested unknown parameter "+
					(typeof col.mData=='function' ? '{function}' : "'"+col.mData+"'")+
					" for row "+rowIdx+", column "+colIdx, 4 );
				settings.iDrawError = draw;
			}
			return defaultContent;
		}
	
		// When the data source is null and a specific data type is requested (i.e.
		// not the original data), we can use default column data
		if ( (cellData === rowData || cellData === null) && defaultContent !== null && type !== undefined ) {
			cellData = defaultContent;
		}
		else if ( typeof cellData === 'function' ) {
			// If the data source is a function, then we run it and use the return,
			// executing in the scope of the data object (for instances)
			return cellData.call( rowData );
		}
	
		if ( cellData === null && type == 'display' ) {
			return '';
		}
		return cellData;
	}
	
	
	/**
	 * Set the value for a specific cell, into the internal data cache
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {*} val Value to set
	 *  @memberof DataTable#oApi
	 */
	function _fnSetCellData( settings, rowIdx, colIdx, val )
	{
		var col     = settings.aoColumns[colIdx];
		var rowData = settings.aoData[rowIdx]._aData;
	
		col.fnSetData( rowData, val, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		}  );
	}
	
	
	// Private variable that is used to match action syntax in the data property object
	var __reArray = /\[.*?\]$/;
	var __reFn = /\(\)$/;
	
	/**
	 * Split string on periods, taking into account escaped periods
	 * @param  {string} str String to split
	 * @return {array} Split string
	 */
	function _fnSplitObjNotation( str )
	{
		return $.map( str.match(/(\\.|[^\.])+/g) || [''], function ( s ) {
			return s.replace(/\\./g, '.');
		} );
	}
	
	
	/**
	 * Return a function that can be used to get data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data get function
	 *  @memberof DataTable#oApi
	 */
	function _fnGetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Build an object of get functions, and wrap them in a single call */
			var o = {};
			$.each( mSource, function (key, val) {
				if ( val ) {
					o[key] = _fnGetObjectDataFn( val );
				}
			} );
	
			return function (data, type, row, meta) {
				var t = o[type] || o._;
				return t !== undefined ?
					t(data, type, row, meta) :
					data;
			};
		}
		else if ( mSource === null )
		{
			/* Give an empty string for rendering / sorting etc */
			return function (data) { // type, row and meta also passed, but not used
				return data;
			};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, type, row, meta) {
				return mSource( data, type, row, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* If there is a . in the source string then the data source is in a
			 * nested object so we loop over the data for each level to get the next
			 * level down. On each loop we test for undefined, and if found immediately
			 * return. This allows entire objects to be missing and sDefaultContent to
			 * be used if defined, rather than throwing an error
			 */
			var fetchData = function (data, type, src) {
				var arrayNotation, funcNotation, out, innerSrc;
	
				if ( src !== "" )
				{
					var a = _fnSplitObjNotation( src );
	
					for ( var i=0, iLen=a.length ; i<iLen ; i++ )
					{
						// Check if we are dealing with special notation
						arrayNotation = a[i].match(__reArray);
						funcNotation = a[i].match(__reFn);
	
						if ( arrayNotation )
						{
							// Array notation
							a[i] = a[i].replace(__reArray, '');
	
							// Condition allows simply [] to be passed in
							if ( a[i] !== "" ) {
								data = data[ a[i] ];
							}
							out = [];
	
							// Get the remainder of the nested object to get
							a.splice( 0, i+1 );
							innerSrc = a.join('.');
	
							// Traverse each entry in the array getting the properties requested
							if ( $.isArray( data ) ) {
								for ( var j=0, jLen=data.length ; j<jLen ; j++ ) {
									out.push( fetchData( data[j], type, innerSrc ) );
								}
							}
	
							// If a string is given in between the array notation indicators, that
							// is used to join the strings together, otherwise an array is returned
							var join = arrayNotation[0].substring(1, arrayNotation[0].length-1);
							data = (join==="") ? out : out.join(join);
	
							// The inner call to fetchData has already traversed through the remainder
							// of the source requested, so we exit from the loop
							break;
						}
						else if ( funcNotation )
						{
							// Function call
							a[i] = a[i].replace(__reFn, '');
							data = data[ a[i] ]();
							continue;
						}
	
						if ( data === null || data[ a[i] ] === undefined )
						{
							return undefined;
						}
						data = data[ a[i] ];
					}
				}
	
				return data;
			};
	
			return function (data, type) { // row and meta also passed, but not used
				return fetchData( data, type, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, type) { // row and meta also passed, but not used
				return data[mSource];
			};
		}
	}
	
	
	/**
	 * Return a function that can be used to set data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data set function
	 *  @memberof DataTable#oApi
	 */
	function _fnSetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Unlike get, only the underscore (global) option is used for for
			 * setting data since we don't know the type here. This is why an object
			 * option is not documented for `mData` (which is read/write), but it is
			 * for `mRender` which is read only.
			 */
			return _fnSetObjectDataFn( mSource._ );
		}
		else if ( mSource === null )
		{
			/* Nothing to do when the data source is null */
			return function () {};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, val, meta) {
				mSource( data, 'set', val, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* Like the get, we need to get data from a nested object */
			var setData = function (data, val, src) {
				var a = _fnSplitObjNotation( src ), b;
				var aLast = a[a.length-1];
				var arrayNotation, funcNotation, o, innerSrc;
	
				for ( var i=0, iLen=a.length-1 ; i<iLen ; i++ )
				{
					// Check if we are dealing with an array notation request
					arrayNotation = a[i].match(__reArray);
					funcNotation = a[i].match(__reFn);
	
					if ( arrayNotation )
					{
						a[i] = a[i].replace(__reArray, '');
						data[ a[i] ] = [];
	
						// Get the remainder of the nested object to set so we can recurse
						b = a.slice();
						b.splice( 0, i+1 );
						innerSrc = b.join('.');
	
						// Traverse each entry in the array setting the properties requested
						if ( $.isArray( val ) )
						{
							for ( var j=0, jLen=val.length ; j<jLen ; j++ )
							{
								o = {};
								setData( o, val[j], innerSrc );
								data[ a[i] ].push( o );
							}
						}
						else
						{
							// We've been asked to save data to an array, but it
							// isn't array data to be saved. Best that can be done
							// is to just save the value.
							data[ a[i] ] = val;
						}
	
						// The inner call to setData has already traversed through the remainder
						// of the source and has set the data, thus we can exit here
						return;
					}
					else if ( funcNotation )
					{
						// Function call
						a[i] = a[i].replace(__reFn, '');
						data = data[ a[i] ]( val );
					}
	
					// If the nested object doesn't currently exist - since we are
					// trying to set the value - create it
					if ( data[ a[i] ] === null || data[ a[i] ] === undefined )
					{
						data[ a[i] ] = {};
					}
					data = data[ a[i] ];
				}
	
				// Last item in the input - i.e, the actual set
				if ( aLast.match(__reFn ) )
				{
					// Function call
					data = data[ aLast.replace(__reFn, '') ]( val );
				}
				else
				{
					// If array notation is used, we just want to strip it and use the property name
					// and assign the value. If it isn't used, then we get the result we want anyway
					data[ aLast.replace(__reArray, '') ] = val;
				}
			};
	
			return function (data, val) { // meta is also passed in, but not used
				return setData( data, val, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, val) { // meta is also passed in, but not used
				data[mSource] = val;
			};
		}
	}
	
	
	/**
	 * Return an array with the full table data
	 *  @param {object} oSettings dataTables settings object
	 *  @returns array {array} aData Master data array
	 *  @memberof DataTable#oApi
	 */
	function _fnGetDataMaster ( settings )
	{
		return _pluck( settings.aoData, '_aData' );
	}
	
	
	/**
	 * Nuke the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnClearTable( settings )
	{
		settings.aoData.length = 0;
		settings.aiDisplayMaster.length = 0;
		settings.aiDisplay.length = 0;
		settings.aIds = {};
	}
	
	
	 /**
	 * Take an array of integers (index array) and remove a target integer (value - not
	 * the key!)
	 *  @param {array} a Index array to target
	 *  @param {int} iTarget value to find
	 *  @memberof DataTable#oApi
	 */
	function _fnDeleteIndex( a, iTarget, splice )
	{
		var iTargetIndex = -1;
	
		for ( var i=0, iLen=a.length ; i<iLen ; i++ )
		{
			if ( a[i] == iTarget )
			{
				iTargetIndex = i;
			}
			else if ( a[i] > iTarget )
			{
				a[i]--;
			}
		}
	
		if ( iTargetIndex != -1 && splice === undefined )
		{
			a.splice( iTargetIndex, 1 );
		}
	}
	
	
	/**
	 * Mark cached data as invalid such that a re-read of the data will occur when
	 * the cached data is next requested. Also update from the data source object.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {int}    rowIdx   Row index to invalidate
	 * @param {string} [src]    Source to invalidate from: undefined, 'auto', 'dom'
	 *     or 'data'
	 * @param {int}    [colIdx] Column index to invalidate. If undefined the whole
	 *     row will be invalidated
	 * @memberof DataTable#oApi
	 *
	 * @todo For the modularisation of v1.11 this will need to become a callback, so
	 *   the sort and filter methods can subscribe to it. That will required
	 *   initialisation options for sorting, which is why it is not already baked in
	 */
	function _fnInvalidate( settings, rowIdx, src, colIdx )
	{
		var row = settings.aoData[ rowIdx ];
		var i, ien;
		var cellWrite = function ( cell, col ) {
			// This is very frustrating, but in IE if you just write directly
			// to innerHTML, and elements that are overwritten are GC'ed,
			// even if there is a reference to them elsewhere
			while ( cell.childNodes.length ) {
				cell.removeChild( cell.firstChild );
			}
	
			cell.innerHTML = _fnGetCellData( settings, rowIdx, col, 'display' );
		};
	
		// Are we reading last data from DOM or the data object?
		if ( src === 'dom' || ((! src || src === 'auto') && row.src === 'dom') ) {
			// Read the data from the DOM
			row._aData = _fnGetRowElements(
					settings, row, colIdx, colIdx === undefined ? undefined : row._aData
				)
				.data;
		}
		else {
			// Reading from data object, update the DOM
			var cells = row.anCells;
	
			if ( cells ) {
				if ( colIdx !== undefined ) {
					cellWrite( cells[colIdx], colIdx );
				}
				else {
					for ( i=0, ien=cells.length ; i<ien ; i++ ) {
						cellWrite( cells[i], i );
					}
				}
			}
		}
	
		// For both row and cell invalidation, the cached data for sorting and
		// filtering is nulled out
		row._aSortData = null;
		row._aFilterData = null;
	
		// Invalidate the type for a specific column (if given) or all columns since
		// the data might have changed
		var cols = settings.aoColumns;
		if ( colIdx !== undefined ) {
			cols[ colIdx ].sType = null;
		}
		else {
			for ( i=0, ien=cols.length ; i<ien ; i++ ) {
				cols[i].sType = null;
			}
	
			// Update DataTables special `DT_*` attributes for the row
			_fnRowAttributes( settings, row );
		}
	}
	
	
	/**
	 * Build a data source object from an HTML row, reading the contents of the
	 * cells that are in the row.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {node|object} TR element from which to read data or existing row
	 *   object from which to re-read the data from the cells
	 * @param {int} [colIdx] Optional column index
	 * @param {array|object} [d] Data source object. If `colIdx` is given then this
	 *   parameter should also be given and will be used to write the data into.
	 *   Only the column in question will be written
	 * @returns {object} Object with two parameters: `data` the data read, in
	 *   document order, and `cells` and array of nodes (they can be useful to the
	 *   caller, so rather than needing a second traversal to get them, just return
	 *   them from here).
	 * @memberof DataTable#oApi
	 */
	function _fnGetRowElements( settings, row, colIdx, d )
	{
		var
			tds = [],
			td = row.firstChild,
			name, col, o, i=0, contents,
			columns = settings.aoColumns,
			objectRead = settings._rowReadObject;
	
		// Allow the data object to be passed in, or construct
		d = d !== undefined ?
			d :
			objectRead ?
				{} :
				[];
	
		var attr = function ( str, td  ) {
			if ( typeof str === 'string' ) {
				var idx = str.indexOf('@');
	
				if ( idx !== -1 ) {
					var attr = str.substring( idx+1 );
					var setter = _fnSetObjectDataFn( str );
					setter( d, td.getAttribute( attr ) );
				}
			}
		};
	
		// Read data from a cell and store into the data object
		var cellProcess = function ( cell ) {
			if ( colIdx === undefined || colIdx === i ) {
				col = columns[i];
				contents = $.trim(cell.innerHTML);
	
				if ( col && col._bAttrSrc ) {
					var setter = _fnSetObjectDataFn( col.mData._ );
					setter( d, contents );
	
					attr( col.mData.sort, cell );
					attr( col.mData.type, cell );
					attr( col.mData.filter, cell );
				}
				else {
					// Depending on the `data` option for the columns the data can
					// be read to either an object or an array.
					if ( objectRead ) {
						if ( ! col._setter ) {
							// Cache the setter function
							col._setter = _fnSetObjectDataFn( col.mData );
						}
						col._setter( d, contents );
					}
					else {
						d[i] = contents;
					}
				}
			}
	
			i++;
		};
	
		if ( td ) {
			// `tr` element was passed in
			while ( td ) {
				name = td.nodeName.toUpperCase();
	
				if ( name == "TD" || name == "TH" ) {
					cellProcess( td );
					tds.push( td );
				}
	
				td = td.nextSibling;
			}
		}
		else {
			// Existing row object passed in
			tds = row.anCells;
	
			for ( var j=0, jen=tds.length ; j<jen ; j++ ) {
				cellProcess( tds[j] );
			}
		}
	
		// Read the ID from the DOM if present
		var rowNode = row.firstChild ? row : row.nTr;
	
		if ( rowNode ) {
			var id = rowNode.getAttribute( 'id' );
	
			if ( id ) {
				_fnSetObjectDataFn( settings.rowId )( d, id );
			}
		}
	
		return {
			data: d,
			cells: tds
		};
	}
	/**
	 * Create a new TR element (and it's TD children) for a row
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow Row to consider
	 *  @param {node} [nTrIn] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @memberof DataTable#oApi
	 */
	function _fnCreateTr ( oSettings, iRow, nTrIn, anTds )
	{
		var
			row = oSettings.aoData[iRow],
			rowData = row._aData,
			cells = [],
			nTr, nTd, oCol,
			i, iLen;
	
		if ( row.nTr === null )
		{
			nTr = nTrIn || document.createElement('tr');
	
			row.nTr = nTr;
			row.anCells = cells;
	
			/* Use a private property on the node to allow reserve mapping from the node
			 * to the aoData array for fast look up
			 */
			nTr._DT_RowIndex = iRow;
	
			/* Special parameters can be given by the data source to be used on the row */
			_fnRowAttributes( oSettings, row );
	
			/* Process each column */
			for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
			{
				oCol = oSettings.aoColumns[i];
	
				nTd = nTrIn ? anTds[i] : document.createElement( oCol.sCellType );
				nTd._DT_CellIndex = {
					row: iRow,
					column: i
				};
				
				cells.push( nTd );
	
				// Need to create the HTML if new, or if a rendering function is defined
				if ( (!nTrIn || oCol.mRender || oCol.mData !== i) &&
					 (!$.isPlainObject(oCol.mData) || oCol.mData._ !== i+'.display')
				) {
					nTd.innerHTML = _fnGetCellData( oSettings, iRow, i, 'display' );
				}
	
				/* Add user defined class */
				if ( oCol.sClass )
				{
					nTd.className += ' '+oCol.sClass;
				}
	
				// Visibility - add or remove as required
				if ( oCol.bVisible && ! nTrIn )
				{
					nTr.appendChild( nTd );
				}
				else if ( ! oCol.bVisible && nTrIn )
				{
					nTd.parentNode.removeChild( nTd );
				}
	
				if ( oCol.fnCreatedCell )
				{
					oCol.fnCreatedCell.call( oSettings.oInstance,
						nTd, _fnGetCellData( oSettings, iRow, i ), rowData, iRow, i
					);
				}
			}
	
			_fnCallbackFire( oSettings, 'aoRowCreatedCallback', null, [nTr, rowData, iRow] );
		}
	
		// Remove once webkit bug 131819 and Chromium bug 365619 have been resolved
		// and deployed
		row.nTr.setAttribute( 'role', 'row' );
	}
	
	
	/**
	 * Add attributes to a row based on the special `DT_*` parameters in a data
	 * source object.
	 *  @param {object} settings DataTables settings object
	 *  @param {object} DataTables row object for the row to be modified
	 *  @memberof DataTable#oApi
	 */
	function _fnRowAttributes( settings, row )
	{
		var tr = row.nTr;
		var data = row._aData;
	
		if ( tr ) {
			var id = settings.rowIdFn( data );
	
			if ( id ) {
				tr.id = id;
			}
	
			if ( data.DT_RowClass ) {
				// Remove any classes added by DT_RowClass before
				var a = data.DT_RowClass.split(' ');
				row.__rowc = row.__rowc ?
					_unique( row.__rowc.concat( a ) ) :
					a;
	
				$(tr)
					.removeClass( row.__rowc.join(' ') )
					.addClass( data.DT_RowClass );
			}
	
			if ( data.DT_RowAttr ) {
				$(tr).attr( data.DT_RowAttr );
			}
	
			if ( data.DT_RowData ) {
				$(tr).data( data.DT_RowData );
			}
		}
	}
	
	
	/**
	 * Create the HTML header for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBuildHead( oSettings )
	{
		var i, ien, cell, row, column;
		var thead = oSettings.nTHead;
		var tfoot = oSettings.nTFoot;
		var createHeader = $('th, td', thead).length === 0;
		var classes = oSettings.oClasses;
		var columns = oSettings.aoColumns;
	
		if ( createHeader ) {
			row = $('<tr/>').appendTo( thead );
		}
	
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			column = columns[i];
			cell = $( column.nTh ).addClass( column.sClass );
	
			if ( createHeader ) {
				cell.appendTo( row );
			}
	
			// 1.11 move into sorting
			if ( oSettings.oFeatures.bSort ) {
				cell.addClass( column.sSortingClass );
	
				if ( column.bSortable !== false ) {
					cell
						.attr( 'tabindex', oSettings.iTabIndex )
						.attr( 'aria-controls', oSettings.sTableId );
	
					_fnSortAttachListener( oSettings, column.nTh, i );
				}
			}
	
			if ( column.sTitle != cell[0].innerHTML ) {
				cell.html( column.sTitle );
			}
	
			_fnRenderer( oSettings, 'header' )(
				oSettings, cell, column, classes
			);
		}
	
		if ( createHeader ) {
			_fnDetectHeader( oSettings.aoHeader, thead );
		}
		
		/* ARIA role for the rows */
	 	$(thead).find('>tr').attr('role', 'row');
	
		/* Deal with the footer - add classes if required */
		$(thead).find('>tr>th, >tr>td').addClass( classes.sHeaderTH );
		$(tfoot).find('>tr>th, >tr>td').addClass( classes.sFooterTH );
	
		// Cache the footer cells. Note that we only take the cells from the first
		// row in the footer. If there is more than one row the user wants to
		// interact with, they need to use the table().foot() method. Note also this
		// allows cells to be used for multiple columns using colspan
		if ( tfoot !== null ) {
			var cells = oSettings.aoFooter[0];
	
			for ( i=0, ien=cells.length ; i<ien ; i++ ) {
				column = columns[i];
				column.nTf = cells[i].cell;
	
				if ( column.sClass ) {
					$(column.nTf).addClass( column.sClass );
				}
			}
		}
	}
	
	
	/**
	 * Draw the header (or footer) element based on the column visibility states. The
	 * methodology here is to use the layout array from _fnDetectHeader, modified for
	 * the instantaneous column visibility, to construct the new layout. The grid is
	 * traversed over cell at a time in a rows x columns grid fashion, although each
	 * cell insert can cover multiple elements in the grid - which is tracks using the
	 * aApplied array. Cell inserts in the grid will only occur where there isn't
	 * already a cell in that position.
	 *  @param {object} oSettings dataTables settings object
	 *  @param array {objects} aoSource Layout array from _fnDetectHeader
	 *  @param {boolean} [bIncludeHidden=false] If true then include the hidden columns in the calc,
	 *  @memberof DataTable#oApi
	 */
	function _fnDrawHead( oSettings, aoSource, bIncludeHidden )
	{
		var i, iLen, j, jLen, k, kLen, n, nLocalTr;
		var aoLocal = [];
		var aApplied = [];
		var iColumns = oSettings.aoColumns.length;
		var iRowspan, iColspan;
	
		if ( ! aoSource )
		{
			return;
		}
	
		if (  bIncludeHidden === undefined )
		{
			bIncludeHidden = false;
		}
	
		/* Make a copy of the master layout array, but without the visible columns in it */
		for ( i=0, iLen=aoSource.length ; i<iLen ; i++ )
		{
			aoLocal[i] = aoSource[i].slice();
			aoLocal[i].nTr = aoSource[i].nTr;
	
			/* Remove any columns which are currently hidden */
			for ( j=iColumns-1 ; j>=0 ; j-- )
			{
				if ( !oSettings.aoColumns[j].bVisible && !bIncludeHidden )
				{
					aoLocal[i].splice( j, 1 );
				}
			}
	
			/* Prep the applied array - it needs an element for each row */
			aApplied.push( [] );
		}
	
		for ( i=0, iLen=aoLocal.length ; i<iLen ; i++ )
		{
			nLocalTr = aoLocal[i].nTr;
	
			/* All cells are going to be replaced, so empty out the row */
			if ( nLocalTr )
			{
				while( (n = nLocalTr.firstChild) )
				{
					nLocalTr.removeChild( n );
				}
			}
	
			for ( j=0, jLen=aoLocal[i].length ; j<jLen ; j++ )
			{
				iRowspan = 1;
				iColspan = 1;
	
				/* Check to see if there is already a cell (row/colspan) covering our target
				 * insert point. If there is, then there is nothing to do.
				 */
				if ( aApplied[i][j] === undefined )
				{
					nLocalTr.appendChild( aoLocal[i][j].cell );
					aApplied[i][j] = 1;
	
					/* Expand the cell to cover as many rows as needed */
					while ( aoLocal[i+iRowspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i+iRowspan][j].cell )
					{
						aApplied[i+iRowspan][j] = 1;
						iRowspan++;
					}
	
					/* Expand the cell to cover as many columns as needed */
					while ( aoLocal[i][j+iColspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i][j+iColspan].cell )
					{
						/* Must update the applied array over the rows for the columns */
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aApplied[i+k][j+iColspan] = 1;
						}
						iColspan++;
					}
	
					/* Do the actual expansion in the DOM */
					$(aoLocal[i][j].cell)
						.attr('rowspan', iRowspan)
						.attr('colspan', iColspan);
				}
			}
		}
	}
	
	
	/**
	 * Insert the required TR nodes into the table for display
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnDraw( oSettings )
	{
		/* Provide a pre-callback function which can be used to cancel the draw is false is returned */
		var aPreDraw = _fnCallbackFire( oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings] );
		if ( $.inArray( false, aPreDraw ) !== -1 )
		{
			_fnProcessingDisplay( oSettings, false );
			return;
		}
	
		var i, iLen, n;
		var anRows = [];
		var iRowCount = 0;
		var asStripeClasses = oSettings.asStripeClasses;
		var iStripes = asStripeClasses.length;
		var iOpenRows = oSettings.aoOpenRows.length;
		var oLang = oSettings.oLanguage;
		var iInitDisplayStart = oSettings.iInitDisplayStart;
		var bServerSide = _fnDataSource( oSettings ) == 'ssp';
		var aiDisplay = oSettings.aiDisplay;
	
		oSettings.bDrawing = true;
	
		/* Check and see if we have an initial draw position from state saving */
		if ( iInitDisplayStart !== undefined && iInitDisplayStart !== -1 )
		{
			oSettings._iDisplayStart = bServerSide ?
				iInitDisplayStart :
				iInitDisplayStart >= oSettings.fnRecordsDisplay() ?
					0 :
					iInitDisplayStart;
	
			oSettings.iInitDisplayStart = -1;
		}
	
		var iDisplayStart = oSettings._iDisplayStart;
		var iDisplayEnd = oSettings.fnDisplayEnd();
	
		/* Server-side processing draw intercept */
		if ( oSettings.bDeferLoading )
		{
			oSettings.bDeferLoading = false;
			oSettings.iDraw++;
			_fnProcessingDisplay( oSettings, false );
		}
		else if ( !bServerSide )
		{
			oSettings.iDraw++;
		}
		else if ( !oSettings.bDestroying && !_fnAjaxUpdate( oSettings ) )
		{
			return;
		}
	
		if ( aiDisplay.length !== 0 )
		{
			var iStart = bServerSide ? 0 : iDisplayStart;
			var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;
	
			for ( var j=iStart ; j<iEnd ; j++ )
			{
				var iDataIndex = aiDisplay[j];
				var aoData = oSettings.aoData[ iDataIndex ];
				if ( aoData.nTr === null )
				{
					_fnCreateTr( oSettings, iDataIndex );
				}
	
				var nRow = aoData.nTr;
	
				/* Remove the old striping classes and then add the new one */
				if ( iStripes !== 0 )
				{
					var sStripe = asStripeClasses[ iRowCount % iStripes ];
					if ( aoData._sRowStripe != sStripe )
					{
						$(nRow).removeClass( aoData._sRowStripe ).addClass( sStripe );
						aoData._sRowStripe = sStripe;
					}
				}
	
				// Row callback functions - might want to manipulate the row
				// iRowCount and j are not currently documented. Are they at all
				// useful?
				_fnCallbackFire( oSettings, 'aoRowCallback', null,
					[nRow, aoData._aData, iRowCount, j] );
	
				anRows.push( nRow );
				iRowCount++;
			}
		}
		else
		{
			/* Table is empty - create a row with an empty message in it */
			var sZero = oLang.sZeroRecords;
			if ( oSettings.iDraw == 1 &&  _fnDataSource( oSettings ) == 'ajax' )
			{
				sZero = oLang.sLoadingRecords;
			}
			else if ( oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0 )
			{
				sZero = oLang.sEmptyTable;
			}
	
			anRows[ 0 ] = $( '<tr/>', { 'class': iStripes ? asStripeClasses[0] : '' } )
				.append( $('<td />', {
					'valign':  'top',
					'colSpan': _fnVisbleColumns( oSettings ),
					'class':   oSettings.oClasses.sRowEmpty
				} ).html( sZero ) )[0];
		}
	
		/* Header and footer callbacks */
		_fnCallbackFire( oSettings, 'aoHeaderCallback', 'header', [ $(oSettings.nTHead).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		_fnCallbackFire( oSettings, 'aoFooterCallback', 'footer', [ $(oSettings.nTFoot).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		var body = $(oSettings.nTBody);
	
		body.children().detach();
		body.append( $(anRows) );
	
		/* Call all required callback functions for the end of a draw */
		_fnCallbackFire( oSettings, 'aoDrawCallback', 'draw', [oSettings] );
	
		/* Draw is complete, sorting and filtering must be as well */
		oSettings.bSorted = false;
		oSettings.bFiltered = false;
		oSettings.bDrawing = false;
	}
	
	
	/**
	 * Redraw the table - taking account of the various features which are enabled
	 *  @param {object} oSettings dataTables settings object
	 *  @param {boolean} [holdPosition] Keep the current paging position. By default
	 *    the paging is reset to the first page
	 *  @memberof DataTable#oApi
	 */
	function _fnReDraw( settings, holdPosition )
	{
		var
			features = settings.oFeatures,
			sort     = features.bSort,
			filter   = features.bFilter;
	
		if ( sort ) {
			_fnSort( settings );
		}
	
		if ( filter ) {
			_fnFilterComplete( settings, settings.oPreviousSearch );
		}
		else {
			// No filtering, so we want to just use the display master
			settings.aiDisplay = settings.aiDisplayMaster.slice();
		}
	
		if ( holdPosition !== true ) {
			settings._iDisplayStart = 0;
		}
	
		// Let any modules know about the draw hold position state (used by
		// scrolling internally)
		settings._drawHold = holdPosition;
	
		_fnDraw( settings );
	
		settings._drawHold = false;
	}
	
	
	/**
	 * Add the options to the page HTML for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAddOptionsHtml ( oSettings )
	{
		var classes = oSettings.oClasses;
		var table = $(oSettings.nTable);
		var holding = $('<div/>').insertBefore( table ); // Holding element for speed
		var features = oSettings.oFeatures;
	
		// All DataTables are wrapped in a div
		var insert = $('<div/>', {
			id:      oSettings.sTableId+'_wrapper',
			'class': classes.sWrapper + (oSettings.nTFoot ? '' : ' '+classes.sNoFooter)
		} );
	
		oSettings.nHolding = holding[0];
		oSettings.nTableWrapper = insert[0];
		oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling;
	
		/* Loop over the user set positioning and place the elements as needed */
		var aDom = oSettings.sDom.split('');
		var featureNode, cOption, nNewNode, cNext, sAttr, j;
		for ( var i=0 ; i<aDom.length ; i++ )
		{
			featureNode = null;
			cOption = aDom[i];
	
			if ( cOption == '<' )
			{
				/* New container div */
				nNewNode = $('<div/>')[0];
	
				/* Check to see if we should append an id and/or a class name to the container */
				cNext = aDom[i+1];
				if ( cNext == "'" || cNext == '"' )
				{
					sAttr = "";
					j = 2;
					while ( aDom[i+j] != cNext )
					{
						sAttr += aDom[i+j];
						j++;
					}
	
					/* Replace jQuery UI constants @todo depreciated */
					if ( sAttr == "H" )
					{
						sAttr = classes.sJUIHeader;
					}
					else if ( sAttr == "F" )
					{
						sAttr = classes.sJUIFooter;
					}
	
					/* The attribute can be in the format of "#id.class", "#id" or "class" This logic
					 * breaks the string into parts and applies them as needed
					 */
					if ( sAttr.indexOf('.') != -1 )
					{
						var aSplit = sAttr.split('.');
						nNewNode.id = aSplit[0].substr(1, aSplit[0].length-1);
						nNewNode.className = aSplit[1];
					}
					else if ( sAttr.charAt(0) == "#" )
					{
						nNewNode.id = sAttr.substr(1, sAttr.length-1);
					}
					else
					{
						nNewNode.className = sAttr;
					}
	
					i += j; /* Move along the position array */
				}
	
				insert.append( nNewNode );
				insert = $(nNewNode);
			}
			else if ( cOption == '>' )
			{
				/* End container div */
				insert = insert.parent();
			}
			// @todo Move options into their own plugins?
			else if ( cOption == 'l' && features.bPaginate && features.bLengthChange )
			{
				/* Length */
				featureNode = _fnFeatureHtmlLength( oSettings );
			}
			else if ( cOption == 'f' && features.bFilter )
			{
				/* Filter */
				featureNode = _fnFeatureHtmlFilter( oSettings );
			}
			else if ( cOption == 'r' && features.bProcessing )
			{
				/* pRocessing */
				featureNode = _fnFeatureHtmlProcessing( oSettings );
			}
			else if ( cOption == 't' )
			{
				/* Table */
				featureNode = _fnFeatureHtmlTable( oSettings );
			}
			else if ( cOption ==  'i' && features.bInfo )
			{
				/* Info */
				featureNode = _fnFeatureHtmlInfo( oSettings );
			}
			else if ( cOption == 'p' && features.bPaginate )
			{
				/* Pagination */
				featureNode = _fnFeatureHtmlPaginate( oSettings );
			}
			else if ( DataTable.ext.feature.length !== 0 )
			{
				/* Plug-in features */
				var aoFeatures = DataTable.ext.feature;
				for ( var k=0, kLen=aoFeatures.length ; k<kLen ; k++ )
				{
					if ( cOption == aoFeatures[k].cFeature )
					{
						featureNode = aoFeatures[k].fnInit( oSettings );
						break;
					}
				}
			}
	
			/* Add to the 2D features array */
			if ( featureNode )
			{
				var aanFeatures = oSettings.aanFeatures;
	
				if ( ! aanFeatures[cOption] )
				{
					aanFeatures[cOption] = [];
				}
	
				aanFeatures[cOption].push( featureNode );
				insert.append( featureNode );
			}
		}
	
		/* Built our DOM structure - replace the holding div with what we want */
		holding.replaceWith( insert );
		oSettings.nHolding = null;
	}
	
	
	/**
	 * Use the DOM source to create up an array of header cells. The idea here is to
	 * create a layout grid (array) of rows x columns, which contains a reference
	 * to the cell that that point in the grid (regardless of col/rowspan), such that
	 * any column / row could be removed and the new grid constructed
	 *  @param array {object} aLayout Array to store the calculated layout in
	 *  @param {node} nThead The header/footer element for the table
	 *  @memberof DataTable#oApi
	 */
	function _fnDetectHeader ( aLayout, nThead )
	{
		var nTrs = $(nThead).children('tr');
		var nTr, nCell;
		var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
		var bUnique;
		var fnShiftCol = function ( a, i, j ) {
			var k = a[i];
	                while ( k[j] ) {
				j++;
			}
			return j;
		};
	
		aLayout.splice( 0, aLayout.length );
	
		/* We know how many rows there are in the layout - so prep it */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			aLayout.push( [] );
		}
	
		/* Calculate a layout array */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			nTr = nTrs[i];
			iColumn = 0;
	
			/* For every cell in the row... */
			nCell = nTr.firstChild;
			while ( nCell ) {
				if ( nCell.nodeName.toUpperCase() == "TD" ||
				     nCell.nodeName.toUpperCase() == "TH" )
				{
					/* Get the col and rowspan attributes from the DOM and sanitise them */
					iColspan = nCell.getAttribute('colspan') * 1;
					iRowspan = nCell.getAttribute('rowspan') * 1;
					iColspan = (!iColspan || iColspan===0 || iColspan===1) ? 1 : iColspan;
					iRowspan = (!iRowspan || iRowspan===0 || iRowspan===1) ? 1 : iRowspan;
	
					/* There might be colspan cells already in this row, so shift our target
					 * accordingly
					 */
					iColShifted = fnShiftCol( aLayout, i, iColumn );
	
					/* Cache calculation for unique columns */
					bUnique = iColspan === 1 ? true : false;
	
					/* If there is col / rowspan, copy the information into the layout grid */
					for ( l=0 ; l<iColspan ; l++ )
					{
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aLayout[i+k][iColShifted+l] = {
								"cell": nCell,
								"unique": bUnique
							};
							aLayout[i+k].nTr = nTr;
						}
					}
				}
				nCell = nCell.nextSibling;
			}
		}
	}
	
	
	/**
	 * Get an array of unique th elements, one for each column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nHeader automatically detect the layout from this node - optional
	 *  @param {array} aLayout thead/tfoot layout from _fnDetectHeader - optional
	 *  @returns array {node} aReturn list of unique th's
	 *  @memberof DataTable#oApi
	 */
	function _fnGetUniqueThs ( oSettings, nHeader, aLayout )
	{
		var aReturn = [];
		if ( !aLayout )
		{
			aLayout = oSettings.aoHeader;
			if ( nHeader )
			{
				aLayout = [];
				_fnDetectHeader( aLayout, nHeader );
			}
		}
	
		for ( var i=0, iLen=aLayout.length ; i<iLen ; i++ )
		{
			for ( var j=0, jLen=aLayout[i].length ; j<jLen ; j++ )
			{
				if ( aLayout[i][j].unique &&
					 (!aReturn[j] || !oSettings.bSortCellsTop) )
				{
					aReturn[j] = aLayout[i][j].cell;
				}
			}
		}
	
		return aReturn;
	}
	
	/**
	 * Create an Ajax call based on the table's settings, taking into account that
	 * parameters can have multiple forms, and backwards compatibility.
	 *
	 * @param {object} oSettings dataTables settings object
	 * @param {array} data Data to send to the server, required by
	 *     DataTables - may be augmented by developer callbacks
	 * @param {function} fn Callback function to run when data is obtained
	 */
	function _fnBuildAjax( oSettings, data, fn )
	{
		// Compatibility with 1.9-, allow fnServerData and event to manipulate
		_fnCallbackFire( oSettings, 'aoServerParams', 'serverParams', [data] );
	
		// Convert to object based for 1.10+ if using the old array scheme which can
		// come from server-side processing or serverParams
		if ( data && $.isArray(data) ) {
			var tmp = {};
			var rbracket = /(.*?)\[\]$/;
	
			$.each( data, function (key, val) {
				var match = val.name.match(rbracket);
	
				if ( match ) {
					// Support for arrays
					var name = match[0];
	
					if ( ! tmp[ name ] ) {
						tmp[ name ] = [];
					}
					tmp[ name ].push( val.value );
				}
				else {
					tmp[val.name] = val.value;
				}
			} );
			data = tmp;
		}
	
		var ajaxData;
		var ajax = oSettings.ajax;
		var instance = oSettings.oInstance;
		var callback = function ( json ) {
			_fnCallbackFire( oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR] );
			fn( json );
		};
	
		if ( $.isPlainObject( ajax ) && ajax.data )
		{
			ajaxData = ajax.data;
	
			var newData = $.isFunction( ajaxData ) ?
				ajaxData( data, oSettings ) :  // fn can manipulate data or return
				ajaxData;                      // an object object or array to merge
	
			// If the function returned something, use that alone
			data = $.isFunction( ajaxData ) && newData ?
				newData :
				$.extend( true, data, newData );
	
			// Remove the data property as we've resolved it already and don't want
			// jQuery to do it again (it is restored at the end of the function)
			delete ajax.data;
		}
	
		var baseAjax = {
			"data": data,
			"success": function (json) {
				var error = json.error || json.sError;
				if ( error ) {
					_fnLog( oSettings, 0, error );
				}
	
				oSettings.json = json;
				callback( json );
			},
			"dataType": "json",
			"cache": false,
			"type": oSettings.sServerMethod,
			"error": function (xhr, error, thrown) {
				var ret = _fnCallbackFire( oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR] );
	
				if ( $.inArray( true, ret ) === -1 ) {
					if ( error == "parsererror" ) {
						_fnLog( oSettings, 0, 'Invalid JSON response', 1 );
					}
					else if ( xhr.readyState === 4 ) {
						_fnLog( oSettings, 0, 'Ajax error', 7 );
					}
				}
	
				_fnProcessingDisplay( oSettings, false );
			}
		};
	
		// Store the data submitted for the API
		oSettings.oAjaxData = data;
	
		// Allow plug-ins and external processes to modify the data
		_fnCallbackFire( oSettings, null, 'preXhr', [oSettings, data] );
	
		if ( oSettings.fnServerData )
		{
			// DataTables 1.9- compatibility
			oSettings.fnServerData.call( instance,
				oSettings.sAjaxSource,
				$.map( data, function (val, key) { // Need to convert back to 1.9 trad format
					return { name: key, value: val };
				} ),
				callback,
				oSettings
			);
		}
		else if ( oSettings.sAjaxSource || typeof ajax === 'string' )
		{
			// DataTables 1.9- compatibility
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, {
				url: ajax || oSettings.sAjaxSource
			} ) );
		}
		else if ( $.isFunction( ajax ) )
		{
			// Is a function - let the caller define what needs to be done
			oSettings.jqXHR = ajax.call( instance, data, callback, oSettings );
		}
		else
		{
			// Object to extend the base settings
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, ajax ) );
	
			// Restore for next time around
			ajax.data = ajaxData;
		}
	}
	
	
	/**
	 * Update the table using an Ajax call
	 *  @param {object} settings dataTables settings object
	 *  @returns {boolean} Block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdate( settings )
	{
		if ( settings.bAjaxDataGet ) {
			settings.iDraw++;
			_fnProcessingDisplay( settings, true );
	
			_fnBuildAjax(
				settings,
				_fnAjaxParameters( settings ),
				function(json) {
					_fnAjaxUpdateDraw( settings, json );
				}
			);
	
			return false;
		}
		return true;
	}
	
	
	/**
	 * Build up the parameters in an object needed for a server-side processing
	 * request. Note that this is basically done twice, is different ways - a modern
	 * method which is used by default in DataTables 1.10 which uses objects and
	 * arrays, or the 1.9- method with is name / value pairs. 1.9 method is used if
	 * the sAjaxSource option is used in the initialisation, or the legacyAjax
	 * option is set.
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {bool} block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxParameters( settings )
	{
		var
			columns = settings.aoColumns,
			columnCount = columns.length,
			features = settings.oFeatures,
			preSearch = settings.oPreviousSearch,
			preColSearch = settings.aoPreSearchCols,
			i, data = [], dataProp, column, columnSearch,
			sort = _fnSortFlatten( settings ),
			displayStart = settings._iDisplayStart,
			displayLength = features.bPaginate !== false ?
				settings._iDisplayLength :
				-1;
	
		var param = function ( name, value ) {
			data.push( { 'name': name, 'value': value } );
		};
	
		// DataTables 1.9- compatible method
		param( 'sEcho',          settings.iDraw );
		param( 'iColumns',       columnCount );
		param( 'sColumns',       _pluck( columns, 'sName' ).join(',') );
		param( 'iDisplayStart',  displayStart );
		param( 'iDisplayLength', displayLength );
	
		// DataTables 1.10+ method
		var d = {
			draw:    settings.iDraw,
			columns: [],
			order:   [],
			start:   displayStart,
			length:  displayLength,
			search:  {
				value: preSearch.sSearch,
				regex: preSearch.bRegex
			}
		};
	
		for ( i=0 ; i<columnCount ; i++ ) {
			column = columns[i];
			columnSearch = preColSearch[i];
			dataProp = typeof column.mData=="function" ? 'function' : column.mData ;
	
			d.columns.push( {
				data:       dataProp,
				name:       column.sName,
				searchable: column.bSearchable,
				orderable:  column.bSortable,
				search:     {
					value: columnSearch.sSearch,
					regex: columnSearch.bRegex
				}
			} );
	
			param( "mDataProp_"+i, dataProp );
	
			if ( features.bFilter ) {
				param( 'sSearch_'+i,     columnSearch.sSearch );
				param( 'bRegex_'+i,      columnSearch.bRegex );
				param( 'bSearchable_'+i, column.bSearchable );
			}
	
			if ( features.bSort ) {
				param( 'bSortable_'+i, column.bSortable );
			}
		}
	
		if ( features.bFilter ) {
			param( 'sSearch', preSearch.sSearch );
			param( 'bRegex', preSearch.bRegex );
		}
	
		if ( features.bSort ) {
			$.each( sort, function ( i, val ) {
				d.order.push( { column: val.col, dir: val.dir } );
	
				param( 'iSortCol_'+i, val.col );
				param( 'sSortDir_'+i, val.dir );
			} );
	
			param( 'iSortingCols', sort.length );
		}
	
		// If the legacy.ajax parameter is null, then we automatically decide which
		// form to use, based on sAjaxSource
		var legacy = DataTable.ext.legacy.ajax;
		if ( legacy === null ) {
			return settings.sAjaxSource ? data : d;
		}
	
		// Otherwise, if legacy has been specified then we use that to decide on the
		// form
		return legacy ? data : d;
	}
	
	
	/**
	 * Data the data from the server (nuking the old) and redraw the table
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} json json data return from the server.
	 *  @param {string} json.sEcho Tracking flag for DataTables to match requests
	 *  @param {int} json.iTotalRecords Number of records in the data set, not accounting for filtering
	 *  @param {int} json.iTotalDisplayRecords Number of records in the data set, accounting for filtering
	 *  @param {array} json.aaData The data to display on this page
	 *  @param {string} [json.sColumns] Column ordering (sName, comma separated)
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdateDraw ( settings, json )
	{
		// v1.10 uses camelCase variables, while 1.9 uses Hungarian notation.
		// Support both
		var compat = function ( old, modern ) {
			return json[old] !== undefined ? json[old] : json[modern];
		};
	
		var data = _fnAjaxDataSrc( settings, json );
		var draw            = compat( 'sEcho',                'draw' );
		var recordsTotal    = compat( 'iTotalRecords',        'recordsTotal' );
		var recordsFiltered = compat( 'iTotalDisplayRecords', 'recordsFiltered' );
	
		if ( draw ) {
			// Protect against out of sequence returns
			if ( draw*1 < settings.iDraw ) {
				return;
			}
			settings.iDraw = draw * 1;
		}
	
		_fnClearTable( settings );
		settings._iRecordsTotal   = parseInt(recordsTotal, 10);
		settings._iRecordsDisplay = parseInt(recordsFiltered, 10);
	
		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			_fnAddData( settings, data[i] );
		}
		settings.aiDisplay = settings.aiDisplayMaster.slice();
	
		settings.bAjaxDataGet = false;
		_fnDraw( settings );
	
		if ( ! settings._bInitComplete ) {
			_fnInitComplete( settings, json );
		}
	
		settings.bAjaxDataGet = true;
		_fnProcessingDisplay( settings, false );
	}
	
	
	/**
	 * Get the data from the JSON data source to use for drawing a table. Using
	 * `_fnGetObjectDataFn` allows the data to be sourced from a property of the
	 * source object, or from a processing function.
	 *  @param {object} oSettings dataTables settings object
	 *  @param  {object} json Data source object / array from the server
	 *  @return {array} Array of data to use
	 */
	function _fnAjaxDataSrc ( oSettings, json )
	{
		var dataSrc = $.isPlainObject( oSettings.ajax ) && oSettings.ajax.dataSrc !== undefined ?
			oSettings.ajax.dataSrc :
			oSettings.sAjaxDataProp; // Compatibility with 1.9-.
	
		// Compatibility with 1.9-. In order to read from aaData, check if the
		// default has been changed, if not, check for aaData
		if ( dataSrc === 'data' ) {
			return json.aaData || json[dataSrc];
		}
	
		return dataSrc !== "" ?
			_fnGetObjectDataFn( dataSrc )( json ) :
			json;
	}
	
	/**
	 * Generate the node required for filtering text
	 *  @returns {node} Filter control element
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlFilter ( settings )
	{
		var classes = settings.oClasses;
		var tableId = settings.sTableId;
		var language = settings.oLanguage;
		var previousSearch = settings.oPreviousSearch;
		var features = settings.aanFeatures;
		var input = '<input type="search" class="'+classes.sFilterInput+'"/>';
	
		var str = language.sSearch;
		str = str.match(/_INPUT_/) ?
			str.replace('_INPUT_', input) :
			str+input;
	
		var filter = $('<div/>', {
				'id': ! features.f ? tableId+'_filter' : null,
				'class': classes.sFilter
			} )
			.append( $('<label/>' ).append( str ) );
	
		var searchFn = function() {
			/* Update all other filter input elements for the new display */
			var n = features.f;
			var val = !this.value ? "" : this.value; // mental IE8 fix :-(
	
			/* Now do the filter */
			if ( val != previousSearch.sSearch ) {
				_fnFilterComplete( settings, {
					"sSearch": val,
					"bRegex": previousSearch.bRegex,
					"bSmart": previousSearch.bSmart ,
					"bCaseInsensitive": previousSearch.bCaseInsensitive
				} );
	
				// Need to redraw, without resorting
				settings._iDisplayStart = 0;
				_fnDraw( settings );
			}
		};
	
		var searchDelay = settings.searchDelay !== null ?
			settings.searchDelay :
			_fnDataSource( settings ) === 'ssp' ?
				400 :
				0;
	
		var jqFilter = $('input', filter)
			.val( previousSearch.sSearch )
			.attr( 'placeholder', language.sSearchPlaceholder )
			.bind(
				'keyup.DT search.DT input.DT paste.DT cut.DT',
				searchDelay ?
					_fnThrottle( searchFn, searchDelay ) :
					searchFn
			)
			.bind( 'keypress.DT', function(e) {
				/* Prevent form submission */
				if ( e.keyCode == 13 ) {
					return false;
				}
			} )
			.attr('aria-controls', tableId);
	
		// Update the input elements whenever the table is filtered
		$(settings.nTable).on( 'search.dt.DT', function ( ev, s ) {
			if ( settings === s ) {
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame...
				try {
					if ( jqFilter[0] !== document.activeElement ) {
						jqFilter.val( previousSearch.sSearch );
					}
				}
				catch ( e ) {}
			}
		} );
	
		return filter[0];
	}
	
	
	/**
	 * Filter the table using both the global filter and column based filtering
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oSearch search information
	 *  @param {int} [iForce] force a research of the master array (1) or not (undefined or 0)
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterComplete ( oSettings, oInput, iForce )
	{
		var oPrevSearch = oSettings.oPreviousSearch;
		var aoPrevSearch = oSettings.aoPreSearchCols;
		var fnSaveFilter = function ( oFilter ) {
			/* Save the filtering values */
			oPrevSearch.sSearch = oFilter.sSearch;
			oPrevSearch.bRegex = oFilter.bRegex;
			oPrevSearch.bSmart = oFilter.bSmart;
			oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive;
		};
		var fnRegex = function ( o ) {
			// Backwards compatibility with the bEscapeRegex option
			return o.bEscapeRegex !== undefined ? !o.bEscapeRegex : o.bRegex;
		};
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo As per sort - can this be moved into an event handler?
		_fnColumnTypes( oSettings );
	
		/* In server-side processing all filtering is done by the server, so no point hanging around here */
		if ( _fnDataSource( oSettings ) != 'ssp' )
		{
			/* Global filter */
			_fnFilter( oSettings, oInput.sSearch, iForce, fnRegex(oInput), oInput.bSmart, oInput.bCaseInsensitive );
			fnSaveFilter( oInput );
	
			/* Now do the individual column filter */
			for ( var i=0 ; i<aoPrevSearch.length ; i++ )
			{
				_fnFilterColumn( oSettings, aoPrevSearch[i].sSearch, i, fnRegex(aoPrevSearch[i]),
					aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensitive );
			}
	
			/* Custom filtering */
			_fnFilterCustom( oSettings );
		}
		else
		{
			fnSaveFilter( oInput );
		}
	
		/* Tell the draw function we have been filtering */
		oSettings.bFiltered = true;
		_fnCallbackFire( oSettings, null, 'search', [oSettings] );
	}
	
	
	/**
	 * Apply custom filtering functions
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCustom( settings )
	{
		var filters = DataTable.ext.search;
		var displayRows = settings.aiDisplay;
		var row, rowIdx;
	
		for ( var i=0, ien=filters.length ; i<ien ; i++ ) {
			var rows = [];
	
			// Loop over each row and see if it should be included
			for ( var j=0, jen=displayRows.length ; j<jen ; j++ ) {
				rowIdx = displayRows[ j ];
				row = settings.aoData[ rowIdx ];
	
				if ( filters[i]( settings, row._aFilterData, rowIdx, row._aData, j ) ) {
					rows.push( rowIdx );
				}
			}
	
			// So the array reference doesn't break set the results into the
			// existing array
			displayRows.length = 0;
			$.merge( displayRows, rows );
		}
	}
	
	
	/**
	 * Filter the table on a per-column basis
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sInput string to filter on
	 *  @param {int} iColumn column to filter
	 *  @param {bool} bRegex treat search string as a regular expression or not
	 *  @param {bool} bSmart use smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterColumn ( settings, searchStr, colIdx, regex, smart, caseInsensitive )
	{
		if ( searchStr === '' ) {
			return;
		}
	
		var data;
		var display = settings.aiDisplay;
		var rpSearch = _fnFilterCreateSearch( searchStr, regex, smart, caseInsensitive );
	
		for ( var i=display.length-1 ; i>=0 ; i-- ) {
			data = settings.aoData[ display[i] ]._aFilterData[ colIdx ];
	
			if ( ! rpSearch.test( data ) ) {
				display.splice( i, 1 );
			}
		}
	}
	
	
	/**
	 * Filter the data table based on user input and draw the table
	 *  @param {object} settings dataTables settings object
	 *  @param {string} input string to filter on
	 *  @param {int} force optional - force a research of the master array (1) or not (undefined or 0)
	 *  @param {bool} regex treat as a regular expression or not
	 *  @param {bool} smart perform smart filtering or not
	 *  @param {bool} caseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilter( settings, input, force, regex, smart, caseInsensitive )
	{
		var rpSearch = _fnFilterCreateSearch( input, regex, smart, caseInsensitive );
		var prevSearch = settings.oPreviousSearch.sSearch;
		var displayMaster = settings.aiDisplayMaster;
		var display, invalidated, i;
	
		// Need to take account of custom filtering functions - always filter
		if ( DataTable.ext.search.length !== 0 ) {
			force = true;
		}
	
		// Check if any of the rows were invalidated
		invalidated = _fnFilterData( settings );
	
		// If the input is blank - we just want the full data set
		if ( input.length <= 0 ) {
			settings.aiDisplay = displayMaster.slice();
		}
		else {
			// New search - start from the master array
			if ( invalidated ||
				 force ||
				 prevSearch.length > input.length ||
				 input.indexOf(prevSearch) !== 0 ||
				 settings.bSorted // On resort, the display master needs to be
				                  // re-filtered since indexes will have changed
			) {
				settings.aiDisplay = displayMaster.slice();
			}
	
			// Search the display array
			display = settings.aiDisplay;
	
			for ( i=display.length-1 ; i>=0 ; i-- ) {
				if ( ! rpSearch.test( settings.aoData[ display[i] ]._sFilterRow ) ) {
					display.splice( i, 1 );
				}
			}
		}
	}
	
	
	/**
	 * Build a regular expression object suitable for searching a table
	 *  @param {string} sSearch string to search for
	 *  @param {bool} bRegex treat as a regular expression or not
	 *  @param {bool} bSmart perform smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insensitive matching or not
	 *  @returns {RegExp} constructed object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCreateSearch( search, regex, smart, caseInsensitive )
	{
		search = regex ?
			search :
			_fnEscapeRegex( search );
		
		if ( smart ) {
			/* For smart filtering we want to allow the search to work regardless of
			 * word order. We also want double quoted text to be preserved, so word
			 * order is important - a la google. So this is what we want to
			 * generate:
			 * 
			 * ^(?=.*?\bone\b)(?=.*?\btwo three\b)(?=.*?\bfour\b).*$
			 */
			var a = $.map( search.match( /"[^"]+"|[^ ]+/g ) || [''], function ( word ) {
				if ( word.charAt(0) === '"' ) {
					var m = word.match( /^"(.*)"$/ );
					word = m ? m[1] : word;
				}
	
				return word.replace('"', '');
			} );
	
			search = '^(?=.*?'+a.join( ')(?=.*?' )+').*$';
		}
	
		return new RegExp( search, caseInsensitive ? 'i' : '' );
	}
	
	
	/**
	 * Escape a string such that it can be used in a regular expression
	 *  @param {string} sVal string to escape
	 *  @returns {string} escaped string
	 *  @memberof DataTable#oApi
	 */
	var _fnEscapeRegex = DataTable.util.escapeRegex;
	
	var __filter_div = $('<div>')[0];
	var __filter_div_textContent = __filter_div.textContent !== undefined;
	
	// Update the filtering data for each row if needed (by invalidation or first run)
	function _fnFilterData ( settings )
	{
		var columns = settings.aoColumns;
		var column;
		var i, j, ien, jen, filterData, cellData, row;
		var fomatters = DataTable.ext.type.search;
		var wasInvalidated = false;
	
		for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aFilterData ) {
				filterData = [];
	
				for ( j=0, jen=columns.length ; j<jen ; j++ ) {
					column = columns[j];
	
					if ( column.bSearchable ) {
						cellData = _fnGetCellData( settings, i, j, 'filter' );
	
						if ( fomatters[ column.sType ] ) {
							cellData = fomatters[ column.sType ]( cellData );
						}
	
						// Search in DataTables 1.10 is string based. In 1.11 this
						// should be altered to also allow strict type checking.
						if ( cellData === null ) {
							cellData = '';
						}
	
						if ( typeof cellData !== 'string' && cellData.toString ) {
							cellData = cellData.toString();
						}
					}
					else {
						cellData = '';
					}
	
					// If it looks like there is an HTML entity in the string,
					// attempt to decode it so sorting works as expected. Note that
					// we could use a single line of jQuery to do this, but the DOM
					// method used here is much faster http://jsperf.com/html-decode
					if ( cellData.indexOf && cellData.indexOf('&') !== -1 ) {
						__filter_div.innerHTML = cellData;
						cellData = __filter_div_textContent ?
							__filter_div.textContent :
							__filter_div.innerText;
					}
	
					if ( cellData.replace ) {
						cellData = cellData.replace(/[\r\n]/g, '');
					}
	
					filterData.push( cellData );
				}
	
				row._aFilterData = filterData;
				row._sFilterRow = filterData.join('  ');
				wasInvalidated = true;
			}
		}
	
		return wasInvalidated;
	}
	
	
	/**
	 * Convert from the internal Hungarian notation to camelCase for external
	 * interaction
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToCamel ( obj )
	{
		return {
			search:          obj.sSearch,
			smart:           obj.bSmart,
			regex:           obj.bRegex,
			caseInsensitive: obj.bCaseInsensitive
		};
	}
	
	
	
	/**
	 * Convert from camelCase notation to the internal Hungarian. We could use the
	 * Hungarian convert function here, but this is cleaner
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToHung ( obj )
	{
		return {
			sSearch:          obj.search,
			bSmart:           obj.smart,
			bRegex:           obj.regex,
			bCaseInsensitive: obj.caseInsensitive
		};
	}
	
	/**
	 * Generate the node required for the info display
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Information element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlInfo ( settings )
	{
		var
			tid = settings.sTableId,
			nodes = settings.aanFeatures.i,
			n = $('<div/>', {
				'class': settings.oClasses.sInfo,
				'id': ! nodes ? tid+'_info' : null
			} );
	
		if ( ! nodes ) {
			// Update display on each draw
			settings.aoDrawCallback.push( {
				"fn": _fnUpdateInfo,
				"sName": "information"
			} );
	
			n
				.attr( 'role', 'status' )
				.attr( 'aria-live', 'polite' );
	
			// Table is described by our info div
			$(settings.nTable).attr( 'aria-describedby', tid+'_info' );
		}
	
		return n[0];
	}
	
	
	/**
	 * Update the information elements in the display
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnUpdateInfo ( settings )
	{
		/* Show information about the table */
		var nodes = settings.aanFeatures.i;
		if ( nodes.length === 0 ) {
			return;
		}
	
		var
			lang  = settings.oLanguage,
			start = settings._iDisplayStart+1,
			end   = settings.fnDisplayEnd(),
			max   = settings.fnRecordsTotal(),
			total = settings.fnRecordsDisplay(),
			out   = total ?
				lang.sInfo :
				lang.sInfoEmpty;
	
		if ( total !== max ) {
			/* Record set after filtering */
			out += ' ' + lang.sInfoFiltered;
		}
	
		// Convert the macros
		out += lang.sInfoPostFix;
		out = _fnInfoMacros( settings, out );
	
		var callback = lang.fnInfoCallback;
		if ( callback !== null ) {
			out = callback.call( settings.oInstance,
				settings, start, end, max, total, out
			);
		}
	
		$(nodes).html( out );
	}
	
	
	function _fnInfoMacros ( settings, str )
	{
		// When infinite scrolling, we are always starting at 1. _iDisplayStart is used only
		// internally
		var
			formatter  = settings.fnFormatNumber,
			start      = settings._iDisplayStart+1,
			len        = settings._iDisplayLength,
			vis        = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return str.
			replace(/_START_/g, formatter.call( settings, start ) ).
			replace(/_END_/g,   formatter.call( settings, settings.fnDisplayEnd() ) ).
			replace(/_MAX_/g,   formatter.call( settings, settings.fnRecordsTotal() ) ).
			replace(/_TOTAL_/g, formatter.call( settings, vis ) ).
			replace(/_PAGE_/g,  formatter.call( settings, all ? 1 : Math.ceil( start / len ) ) ).
			replace(/_PAGES_/g, formatter.call( settings, all ? 1 : Math.ceil( vis / len ) ) );
	}
	
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnInitialise ( settings )
	{
		var i, iLen, iAjaxStart=settings.iInitDisplayStart;
		var columns = settings.aoColumns, column;
		var features = settings.oFeatures;
		var deferLoading = settings.bDeferLoading; // value modified by the draw
	
		/* Ensure that the table data is fully initialised */
		if ( ! settings.bInitialised ) {
			setTimeout( function(){ _fnInitialise( settings ); }, 200 );
			return;
		}
	
		/* Show the display HTML options */
		_fnAddOptionsHtml( settings );
	
		/* Build and draw the header / footer for the table */
		_fnBuildHead( settings );
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		/* Okay to show that something is going on now */
		_fnProcessingDisplay( settings, true );
	
		/* Calculate sizes for columns */
		if ( features.bAutoWidth ) {
			_fnCalculateColumnWidths( settings );
		}
	
		for ( i=0, iLen=columns.length ; i<iLen ; i++ ) {
			column = columns[i];
	
			if ( column.sWidth ) {
				column.nTh.style.width = _fnStringToCss( column.sWidth );
			}
		}
	
		_fnCallbackFire( settings, null, 'preInit', [settings] );
	
		// If there is default sorting required - let's do it. The sort function
		// will do the drawing for us. Otherwise we draw the table regardless of the
		// Ajax source - this allows the table to look initialised for Ajax sourcing
		// data (show 'loading' message possibly)
		_fnReDraw( settings );
	
		// Server-side processing init complete is done by _fnAjaxUpdateDraw
		var dataSrc = _fnDataSource( settings );
		if ( dataSrc != 'ssp' || deferLoading ) {
			// if there is an ajax source load the data
			if ( dataSrc == 'ajax' ) {
				_fnBuildAjax( settings, [], function(json) {
					var aData = _fnAjaxDataSrc( settings, json );
	
					// Got the data - add it to the table
					for ( i=0 ; i<aData.length ; i++ ) {
						_fnAddData( settings, aData[i] );
					}
	
					// Reset the init display for cookie saving. We've already done
					// a filter, and therefore cleared it before. So we need to make
					// it appear 'fresh'
					settings.iInitDisplayStart = iAjaxStart;
	
					_fnReDraw( settings );
	
					_fnProcessingDisplay( settings, false );
					_fnInitComplete( settings, json );
				}, settings );
			}
			else {
				_fnProcessingDisplay( settings, false );
				_fnInitComplete( settings );
			}
		}
	}
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} [json] JSON from the server that completed the table, if using Ajax source
	 *    with client-side processing (optional)
	 *  @memberof DataTable#oApi
	 */
	function _fnInitComplete ( settings, json )
	{
		settings._bInitComplete = true;
	
		// When data was added after the initialisation (data or Ajax) we need to
		// calculate the column sizing
		if ( json || settings.oInit.aaData ) {
			_fnAdjustColumnSizing( settings );
		}
	
		_fnCallbackFire( settings, null, 'plugin-init', [settings, json] );
		_fnCallbackFire( settings, 'aoInitComplete', 'init', [settings, json] );
	}
	
	
	function _fnLengthChange ( settings, val )
	{
		var len = parseInt( val, 10 );
		settings._iDisplayLength = len;
	
		_fnLengthOverflow( settings );
	
		// Fire length change event
		_fnCallbackFire( settings, null, 'length', [settings, len] );
	}
	
	
	/**
	 * Generate the node required for user display length changing
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Display length feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlLength ( settings )
	{
		var
			classes  = settings.oClasses,
			tableId  = settings.sTableId,
			menu     = settings.aLengthMenu,
			d2       = $.isArray( menu[0] ),
			lengths  = d2 ? menu[0] : menu,
			language = d2 ? menu[1] : menu;
	
		var select = $('<select/>', {
			'name':          tableId+'_length',
			'aria-controls': tableId,
			'class':         classes.sLengthSelect
		} );
	
		for ( var i=0, ien=lengths.length ; i<ien ; i++ ) {
			select[0][ i ] = new Option( language[i], lengths[i] );
		}
	
		var div = $('<div><label/></div>').addClass( classes.sLength );
		if ( ! settings.aanFeatures.l ) {
			div[0].id = tableId+'_length';
		}
	
		div.children().append(
			settings.oLanguage.sLengthMenu.replace( '_MENU_', select[0].outerHTML )
		);
	
		// Can't use `select` variable as user might provide their own and the
		// reference is broken by the use of outerHTML
		$('select', div)
			.val( settings._iDisplayLength )
			.bind( 'change.DT', function(e) {
				_fnLengthChange( settings, $(this).val() );
				_fnDraw( settings );
			} );
	
		// Update node value whenever anything changes the table's length
		$(settings.nTable).bind( 'length.dt.DT', function (e, s, len) {
			if ( settings === s ) {
				$('select', div).val( len );
			}
		} );
	
		return div[0];
	}
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Note that most of the paging logic is done in
	 * DataTable.ext.pager
	 */
	
	/**
	 * Generate the node required for default pagination
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Pagination feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlPaginate ( settings )
	{
		var
			type   = settings.sPaginationType,
			plugin = DataTable.ext.pager[ type ],
			modern = typeof plugin === 'function',
			redraw = function( settings ) {
				_fnDraw( settings );
			},
			node = $('<div/>').addClass( settings.oClasses.sPaging + type )[0],
			features = settings.aanFeatures;
	
		if ( ! modern ) {
			plugin.fnInit( settings, node, redraw );
		}
	
		/* Add a draw callback for the pagination on first instance, to update the paging display */
		if ( ! features.p )
		{
			node.id = settings.sTableId+'_paginate';
	
			settings.aoDrawCallback.push( {
				"fn": function( settings ) {
					if ( modern ) {
						var
							start      = settings._iDisplayStart,
							len        = settings._iDisplayLength,
							visRecords = settings.fnRecordsDisplay(),
							all        = len === -1,
							page = all ? 0 : Math.ceil( start / len ),
							pages = all ? 1 : Math.ceil( visRecords / len ),
							buttons = plugin(page, pages),
							i, ien;
	
						for ( i=0, ien=features.p.length ; i<ien ; i++ ) {
							_fnRenderer( settings, 'pageButton' )(
								settings, features.p[i], i, buttons, page, pages
							);
						}
					}
					else {
						plugin.fnUpdate( settings, redraw );
					}
				},
				"sName": "pagination"
			} );
		}
	
		return node;
	}
	
	
	/**
	 * Alter the display settings to change the page
	 *  @param {object} settings DataTables settings object
	 *  @param {string|int} action Paging action to take: "first", "previous",
	 *    "next" or "last" or page number to jump to (integer)
	 *  @param [bool] redraw Automatically draw the update or not
	 *  @returns {bool} true page has changed, false - no change
	 *  @memberof DataTable#oApi
	 */
	function _fnPageChange ( settings, action, redraw )
	{
		var
			start     = settings._iDisplayStart,
			len       = settings._iDisplayLength,
			records   = settings.fnRecordsDisplay();
	
		if ( records === 0 || len === -1 )
		{
			start = 0;
		}
		else if ( typeof action === "number" )
		{
			start = action * len;
	
			if ( start > records )
			{
				start = 0;
			}
		}
		else if ( action == "first" )
		{
			start = 0;
		}
		else if ( action == "previous" )
		{
			start = len >= 0 ?
				start - len :
				0;
	
			if ( start < 0 )
			{
			  start = 0;
			}
		}
		else if ( action == "next" )
		{
			if ( start + len < records )
			{
				start += len;
			}
		}
		else if ( action == "last" )
		{
			start = Math.floor( (records-1) / len) * len;
		}
		else
		{
			_fnLog( settings, 0, "Unknown paging action: "+action, 5 );
		}
	
		var changed = settings._iDisplayStart !== start;
		settings._iDisplayStart = start;
	
		if ( changed ) {
			_fnCallbackFire( settings, null, 'page', [settings] );
	
			if ( redraw ) {
				_fnDraw( settings );
			}
		}
	
		return changed;
	}
	
	
	
	/**
	 * Generate the node required for the processing node
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Processing element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlProcessing ( settings )
	{
		return $('<div/>', {
				'id': ! settings.aanFeatures.r ? settings.sTableId+'_processing' : null,
				'class': settings.oClasses.sProcessing
			} )
			.html( settings.oLanguage.sProcessing )
			.insertBefore( settings.nTable )[0];
	}
	
	
	/**
	 * Display or hide the processing indicator
	 *  @param {object} settings dataTables settings object
	 *  @param {bool} show Show the processing indicator (true) or not (false)
	 *  @memberof DataTable#oApi
	 */
	function _fnProcessingDisplay ( settings, show )
	{
		if ( settings.oFeatures.bProcessing ) {
			$(settings.aanFeatures.r).css( 'display', show ? 'block' : 'none' );
		}
	
		_fnCallbackFire( settings, null, 'processing', [settings, show] );
	}
	
	/**
	 * Add any control elements for the table - specifically scrolling
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Node to add to the DOM
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlTable ( settings )
	{
		var table = $(settings.nTable);
	
		// Add the ARIA grid role to the table
		table.attr( 'role', 'grid' );
	
		// Scrolling from here on in
		var scroll = settings.oScroll;
	
		if ( scroll.sX === '' && scroll.sY === '' ) {
			return settings.nTable;
		}
	
		var scrollX = scroll.sX;
		var scrollY = scroll.sY;
		var classes = settings.oClasses;
		var caption = table.children('caption');
		var captionSide = caption.length ? caption[0]._captionSide : null;
		var headerClone = $( table[0].cloneNode(false) );
		var footerClone = $( table[0].cloneNode(false) );
		var footer = table.children('tfoot');
		var _div = '<div/>';
		var size = function ( s ) {
			return !s ? null : _fnStringToCss( s );
		};
	
		if ( ! footer.length ) {
			footer = null;
		}
	
		/*
		 * The HTML structure that we want to generate in this function is:
		 *  div - scroller
		 *    div - scroll head
		 *      div - scroll head inner
		 *        table - scroll head table
		 *          thead - thead
		 *    div - scroll body
		 *      table - table (master table)
		 *        thead - thead clone for sizing
		 *        tbody - tbody
		 *    div - scroll foot
		 *      div - scroll foot inner
		 *        table - scroll foot table
		 *          tfoot - tfoot
		 */
		var scroller = $( _div, { 'class': classes.sScrollWrapper } )
			.append(
				$(_div, { 'class': classes.sScrollHead } )
					.css( {
						overflow: 'hidden',
						position: 'relative',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollHeadInner } )
							.css( {
								'box-sizing': 'content-box',
								width: scroll.sXInner || '100%'
							} )
							.append(
								headerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'top' ? caption : null )
									.append(
										table.children('thead')
									)
							)
					)
			)
			.append(
				$(_div, { 'class': classes.sScrollBody } )
					.css( {
						position: 'relative',
						overflow: 'auto',
						width: size( scrollX )
					} )
					.append( table )
			);
	
		if ( footer ) {
			scroller.append(
				$(_div, { 'class': classes.sScrollFoot } )
					.css( {
						overflow: 'hidden',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollFootInner } )
							.append(
								footerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'bottom' ? caption : null )
									.append(
										table.children('tfoot')
									)
							)
					)
			);
		}
	
		var children = scroller.children();
		var scrollHead = children[0];
		var scrollBody = children[1];
		var scrollFoot = footer ? children[2] : null;
	
		// When the body is scrolled, then we also want to scroll the headers
		if ( scrollX ) {
			$(scrollBody).on( 'scroll.DT', function (e) {
				var scrollLeft = this.scrollLeft;
	
				scrollHead.scrollLeft = scrollLeft;
	
				if ( footer ) {
					scrollFoot.scrollLeft = scrollLeft;
				}
			} );
		}
	
		$(scrollBody).css(
			scrollY && scroll.bCollapse ? 'max-height' : 'height', 
			scrollY
		);
	
		settings.nScrollHead = scrollHead;
		settings.nScrollBody = scrollBody;
		settings.nScrollFoot = scrollFoot;
	
		// On redraw - align columns
		settings.aoDrawCallback.push( {
			"fn": _fnScrollDraw,
			"sName": "scrolling"
		} );
	
		return scroller[0];
	}
	
	
	
	/**
	 * Update the header, footer and body tables for resizing - i.e. column
	 * alignment.
	 *
	 * Welcome to the most horrible function DataTables. The process that this
	 * function follows is basically:
	 *   1. Re-create the table inside the scrolling div
	 *   2. Take live measurements from the DOM
	 *   3. Apply the measurements to align the columns
	 *   4. Clean up
	 *
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnScrollDraw ( settings )
	{
		// Given that this is such a monster function, a lot of variables are use
		// to try and keep the minimised size as small as possible
		var
			scroll         = settings.oScroll,
			scrollX        = scroll.sX,
			scrollXInner   = scroll.sXInner,
			scrollY        = scroll.sY,
			barWidth       = scroll.iBarWidth,
			divHeader      = $(settings.nScrollHead),
			divHeaderStyle = divHeader[0].style,
			divHeaderInner = divHeader.children('div'),
			divHeaderInnerStyle = divHeaderInner[0].style,
			divHeaderTable = divHeaderInner.children('table'),
			divBodyEl      = settings.nScrollBody,
			divBody        = $(divBodyEl),
			divBodyStyle   = divBodyEl.style,
			divFooter      = $(settings.nScrollFoot),
			divFooterInner = divFooter.children('div'),
			divFooterTable = divFooterInner.children('table'),
			header         = $(settings.nTHead),
			table          = $(settings.nTable),
			tableEl        = table[0],
			tableStyle     = tableEl.style,
			footer         = settings.nTFoot ? $(settings.nTFoot) : null,
			browser        = settings.oBrowser,
			ie67           = browser.bScrollOversize,
			dtHeaderCells  = _pluck( settings.aoColumns, 'nTh' ),
			headerTrgEls, footerTrgEls,
			headerSrcEls, footerSrcEls,
			headerCopy, footerCopy,
			headerWidths=[], footerWidths=[],
			headerContent=[], footerContent=[],
			idx, correction, sanityWidth,
			zeroOut = function(nSizer) {
				var style = nSizer.style;
				style.paddingTop = "0";
				style.paddingBottom = "0";
				style.borderTopWidth = "0";
				style.borderBottomWidth = "0";
				style.height = 0;
			};
	
		// If the scrollbar visibility has changed from the last draw, we need to
		// adjust the column sizes as the table width will have changed to account
		// for the scrollbar
		var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;
		
		if ( settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined ) {
			settings.scrollBarVis = scrollBarVis;
			_fnAdjustColumnSizing( settings );
			return; // adjust column sizing will call this function again
		}
		else {
			settings.scrollBarVis = scrollBarVis;
		}
	
		/*
		 * 1. Re-create the table inside the scrolling div
		 */
	
		// Remove the old minimised thead and tfoot elements in the inner table
		table.children('thead, tfoot').remove();
	
		if ( footer ) {
			footerCopy = footer.clone().prependTo( table );
			footerTrgEls = footer.find('tr'); // the original tfoot is in its own table and must be sized
			footerSrcEls = footerCopy.find('tr');
		}
	
		// Clone the current header and footer elements and then place it into the inner table
		headerCopy = header.clone().prependTo( table );
		headerTrgEls = header.find('tr'); // original header is in its own table
		headerSrcEls = headerCopy.find('tr');
		headerCopy.find('th, td').removeAttr('tabindex');
	
	
		/*
		 * 2. Take live measurements from the DOM - do not alter the DOM itself!
		 */
	
		// Remove old sizing and apply the calculated column widths
		// Get the unique column headers in the newly created (cloned) header. We want to apply the
		// calculated sizes to this header
		if ( ! scrollX )
		{
			divBodyStyle.width = '100%';
			divHeader[0].style.width = '100%';
		}
	
		$.each( _fnGetUniqueThs( settings, headerCopy ), function ( i, el ) {
			idx = _fnVisibleToColumnIndex( settings, i );
			el.style.width = settings.aoColumns[idx].sWidth;
		} );
	
		if ( footer ) {
			_fnApplyToChildren( function(n) {
				n.style.width = "";
			}, footerSrcEls );
		}
	
		// Size the table as a whole
		sanityWidth = table.outerWidth();
		if ( scrollX === "" ) {
			// No x scrolling
			tableStyle.width = "100%";
	
			// IE7 will make the width of the table when 100% include the scrollbar
			// - which is shouldn't. When there is a scrollbar we need to take this
			// into account.
			if ( ie67 && (table.find('tbody').height() > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( table.outerWidth() - barWidth);
			}
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
		else if ( scrollXInner !== "" ) {
			// legacy x scroll inner has been given - use it
			tableStyle.width = _fnStringToCss(scrollXInner);
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
	
		// Hidden header should have zero height, so remove padding and borders. Then
		// set the width based on the real headers
	
		// Apply all styles in one pass
		_fnApplyToChildren( zeroOut, headerSrcEls );
	
		// Read all widths in next pass
		_fnApplyToChildren( function(nSizer) {
			headerContent.push( nSizer.innerHTML );
			headerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
		}, headerSrcEls );
	
		// Apply all widths in final pass
		_fnApplyToChildren( function(nToSize, i) {
			// Only apply widths to the DataTables detected header cells - this
			// prevents complex headers from having contradictory sizes applied
			if ( $.inArray( nToSize, dtHeaderCells ) !== -1 ) {
				nToSize.style.width = headerWidths[i];
			}
		}, headerTrgEls );
	
		$(headerSrcEls).height(0);
	
		/* Same again with the footer if we have one */
		if ( footer )
		{
			_fnApplyToChildren( zeroOut, footerSrcEls );
	
			_fnApplyToChildren( function(nSizer) {
				footerContent.push( nSizer.innerHTML );
				footerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
			}, footerSrcEls );
	
			_fnApplyToChildren( function(nToSize, i) {
				nToSize.style.width = footerWidths[i];
			}, footerTrgEls );
	
			$(footerSrcEls).height(0);
		}
	
	
		/*
		 * 3. Apply the measurements
		 */
	
		// "Hide" the header and footer that we used for the sizing. We need to keep
		// the content of the cell so that the width applied to the header and body
		// both match, but we want to hide it completely. We want to also fix their
		// width to what they currently are
		_fnApplyToChildren( function(nSizer, i) {
			nSizer.innerHTML = '<div class="dataTables_sizing" style="height:0;overflow:hidden;">'+headerContent[i]+'</div>';
			nSizer.style.width = headerWidths[i];
		}, headerSrcEls );
	
		if ( footer )
		{
			_fnApplyToChildren( function(nSizer, i) {
				nSizer.innerHTML = '<div class="dataTables_sizing" style="height:0;overflow:hidden;">'+footerContent[i]+'</div>';
				nSizer.style.width = footerWidths[i];
			}, footerSrcEls );
		}
	
		// Sanity check that the table is of a sensible width. If not then we are going to get
		// misalignment - try to prevent this by not allowing the table to shrink below its min width
		if ( table.outerWidth() < sanityWidth )
		{
			// The min width depends upon if we have a vertical scrollbar visible or not */
			correction = ((divBodyEl.scrollHeight > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")) ?
					sanityWidth+barWidth :
					sanityWidth;
	
			// IE6/7 are a law unto themselves...
			if ( ie67 && (divBodyEl.scrollHeight >
				divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( correction-barWidth );
			}
	
			// And give the user a warning that we've stopped the table getting too small
			if ( scrollX === "" || scrollXInner !== "" ) {
				_fnLog( settings, 1, 'Possible column misalignment', 6 );
			}
		}
		else
		{
			correction = '100%';
		}
	
		// Apply to the container elements
		divBodyStyle.width = _fnStringToCss( correction );
		divHeaderStyle.width = _fnStringToCss( correction );
	
		if ( footer ) {
			settings.nScrollFoot.style.width = _fnStringToCss( correction );
		}
	
	
		/*
		 * 4. Clean up
		 */
		if ( ! scrollY ) {
			/* IE7< puts a vertical scrollbar in place (when it shouldn't be) due to subtracting
			 * the scrollbar height from the visible display, rather than adding it on. We need to
			 * set the height in order to sort this. Don't want to do it in any other browsers.
			 */
			if ( ie67 ) {
				divBodyStyle.height = _fnStringToCss( tableEl.offsetHeight+barWidth );
			}
		}
	
		/* Finally set the width's of the header and footer tables */
		var iOuterWidth = table.outerWidth();
		divHeaderTable[0].style.width = _fnStringToCss( iOuterWidth );
		divHeaderInnerStyle.width = _fnStringToCss( iOuterWidth );
	
		// Figure out if there are scrollbar present - if so then we need a the header and footer to
		// provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)
		var bScrolling = table.height() > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
		var padding = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right' );
		divHeaderInnerStyle[ padding ] = bScrolling ? barWidth+"px" : "0px";
	
		if ( footer ) {
			divFooterTable[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style[padding] = bScrolling ? barWidth+"px" : "0px";
		}
	
		// Correct DOM ordering for colgroup - comes before the thead
		table.children('colgroup').insertBefore( table.children('thead') );
	
		/* Adjust the position of the header in case we loose the y-scrollbar */
		divBody.scroll();
	
		// If sorting or filtering has occurred, jump the scrolling back to the top
		// only if we aren't holding the position
		if ( (settings.bSorted || settings.bFiltered) && ! settings._drawHold ) {
			divBodyEl.scrollTop = 0;
		}
	}
	
	
	
	/**
	 * Apply a given function to the display child nodes of an element array (typically
	 * TD children of TR rows
	 *  @param {function} fn Method to apply to the objects
	 *  @param array {nodes} an1 List of elements to look through for display children
	 *  @param array {nodes} an2 Another list (identical structure to the first) - optional
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyToChildren( fn, an1, an2 )
	{
		var index=0, i=0, iLen=an1.length;
		var nNode1, nNode2;
	
		while ( i < iLen ) {
			nNode1 = an1[i].firstChild;
			nNode2 = an2 ? an2[i].firstChild : null;
	
			while ( nNode1 ) {
				if ( nNode1.nodeType === 1 ) {
					if ( an2 ) {
						fn( nNode1, nNode2, index );
					}
					else {
						fn( nNode1, index );
					}
	
					index++;
				}
	
				nNode1 = nNode1.nextSibling;
				nNode2 = an2 ? nNode2.nextSibling : null;
			}
	
			i++;
		}
	}
	
	
	
	var __re_html_remove = /<.*?>/g;
	
	
	/**
	 * Calculate the width of columns for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnCalculateColumnWidths ( oSettings )
	{
		var
			table = oSettings.nTable,
			columns = oSettings.aoColumns,
			scroll = oSettings.oScroll,
			scrollY = scroll.sY,
			scrollX = scroll.sX,
			scrollXInner = scroll.sXInner,
			columnCount = columns.length,
			visibleColumns = _fnGetColumns( oSettings, 'bVisible' ),
			headerCells = $('th', oSettings.nTHead),
			tableWidthAttr = table.getAttribute('width'), // from DOM element
			tableContainer = table.parentNode,
			userInputs = false,
			i, column, columnIdx, width, outerWidth,
			browser = oSettings.oBrowser,
			ie67 = browser.bScrollOversize;
	
		var styleWidth = table.style.width;
		if ( styleWidth && styleWidth.indexOf('%') !== -1 ) {
			tableWidthAttr = styleWidth;
		}
	
		/* Convert any user input sizes into pixel sizes */
		for ( i=0 ; i<visibleColumns.length ; i++ ) {
			column = columns[ visibleColumns[i] ];
	
			if ( column.sWidth !== null ) {
				column.sWidth = _fnConvertToWidth( column.sWidthOrig, tableContainer );
	
				userInputs = true;
			}
		}
	
		/* If the number of columns in the DOM equals the number that we have to
		 * process in DataTables, then we can use the offsets that are created by
		 * the web- browser. No custom sizes can be set in order for this to happen,
		 * nor scrolling used
		 */
		if ( ie67 || ! userInputs && ! scrollX && ! scrollY &&
		     columnCount == _fnVisbleColumns( oSettings ) &&
		     columnCount == headerCells.length
		) {
			for ( i=0 ; i<columnCount ; i++ ) {
				var colIdx = _fnVisibleToColumnIndex( oSettings, i );
	
				if ( colIdx !== null ) {
					columns[ colIdx ].sWidth = _fnStringToCss( headerCells.eq(i).width() );
				}
			}
		}
		else
		{
			// Otherwise construct a single row, worst case, table with the widest
			// node in the data, assign any user defined widths, then insert it into
			// the DOM and allow the browser to do all the hard work of calculating
			// table widths
			var tmpTable = $(table).clone() // don't use cloneNode - IE8 will remove events on the main table
				.css( 'visibility', 'hidden' )
				.removeAttr( 'id' );
	
			// Clean up the table body
			tmpTable.find('tbody tr').remove();
			var tr = $('<tr/>').appendTo( tmpTable.find('tbody') );
	
			// Clone the table header and footer - we can't use the header / footer
			// from the cloned table, since if scrolling is active, the table's
			// real header and footer are contained in different table tags
			tmpTable.find('thead, tfoot').remove();
			tmpTable
				.append( $(oSettings.nTHead).clone() )
				.append( $(oSettings.nTFoot).clone() );
	
			// Remove any assigned widths from the footer (from scrolling)
			tmpTable.find('tfoot th, tfoot td').css('width', '');
	
			// Apply custom sizing to the cloned header
			headerCells = _fnGetUniqueThs( oSettings, tmpTable.find('thead')[0] );
	
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				column = columns[ visibleColumns[i] ];
	
				headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== '' ?
					_fnStringToCss( column.sWidthOrig ) :
					'';
	
				// For scrollX we need to force the column width otherwise the
				// browser will collapse it. If this width is smaller than the
				// width the column requires, then it will have no effect
				if ( column.sWidthOrig && scrollX ) {
					$( headerCells[i] ).append( $('<div/>').css( {
						width: column.sWidthOrig,
						margin: 0,
						padding: 0,
						border: 0,
						height: 1
					} ) );
				}
			}
	
			// Find the widest cell for each column and put it into the table
			if ( oSettings.aoData.length ) {
				for ( i=0 ; i<visibleColumns.length ; i++ ) {
					columnIdx = visibleColumns[i];
					column = columns[ columnIdx ];
	
					$( _fnGetWidestNode( oSettings, columnIdx ) )
						.clone( false )
						.append( column.sContentPadding )
						.appendTo( tr );
				}
			}
	
			// Tidy the temporary table - remove name attributes so there aren't
			// duplicated in the dom (radio elements for example)
			$('[name]', tmpTable).removeAttr('name');
	
			// Table has been built, attach to the document so we can work with it.
			// A holding element is used, positioned at the top of the container
			// with minimal height, so it has no effect on if the container scrolls
			// or not. Otherwise it might trigger scrolling when it actually isn't
			// needed
			var holder = $('<div/>').css( scrollX || scrollY ?
					{
						position: 'absolute',
						top: 0,
						left: 0,
						height: 1,
						right: 0,
						overflow: 'hidden'
					} :
					{}
				)
				.append( tmpTable )
				.appendTo( tableContainer );
	
			// When scrolling (X or Y) we want to set the width of the table as 
			// appropriate. However, when not scrolling leave the table width as it
			// is. This results in slightly different, but I think correct behaviour
			if ( scrollX && scrollXInner ) {
				tmpTable.width( scrollXInner );
			}
			else if ( scrollX ) {
				tmpTable.css( 'width', 'auto' );
				tmpTable.removeAttr('width');
	
				// If there is no width attribute or style, then allow the table to
				// collapse
				if ( tmpTable.width() < tableContainer.clientWidth && tableWidthAttr ) {
					tmpTable.width( tableContainer.clientWidth );
				}
			}
			else if ( scrollY ) {
				tmpTable.width( tableContainer.clientWidth );
			}
			else if ( tableWidthAttr ) {
				tmpTable.width( tableWidthAttr );
			}
	
			// Get the width of each column in the constructed table - we need to
			// know the inner width (so it can be assigned to the other table's
			// cells) and the outer width so we can calculate the full width of the
			// table. This is safe since DataTables requires a unique cell for each
			// column, but if ever a header can span multiple columns, this will
			// need to be modified.
			var total = 0;
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				var cell = $(headerCells[i]);
				var border = cell.outerWidth() - cell.width();
	
				// Use getBounding... where possible (not IE8-) because it can give
				// sub-pixel accuracy, which we then want to round up!
				var bounding = browser.bBounding ?
					Math.ceil( headerCells[i].getBoundingClientRect().width ) :
					cell.outerWidth();
	
				// Total is tracked to remove any sub-pixel errors as the outerWidth
				// of the table might not equal the total given here (IE!).
				total += bounding;
	
				// Width for each column to use
				columns[ visibleColumns[i] ].sWidth = _fnStringToCss( bounding - border );
			}
	
			table.style.width = _fnStringToCss( total );
	
			// Finished with the table - ditch it
			holder.remove();
		}
	
		// If there is a width attr, we want to attach an event listener which
		// allows the table sizing to automatically adjust when the window is
		// resized. Use the width attr rather than CSS, since we can't know if the
		// CSS is a relative value or absolute - DOM read is always px.
		if ( tableWidthAttr ) {
			table.style.width = _fnStringToCss( tableWidthAttr );
		}
	
		if ( (tableWidthAttr || scrollX) && ! oSettings._reszEvt ) {
			var bindResize = function () {
				$(window).bind('resize.DT-'+oSettings.sInstance, _fnThrottle( function () {
					_fnAdjustColumnSizing( oSettings );
				} ) );
			};
	
			// IE6/7 will crash if we bind a resize event handler on page load.
			// To be removed in 1.11 which drops IE6/7 support
			if ( ie67 ) {
				setTimeout( bindResize, 1000 );
			}
			else {
				bindResize();
			}
	
			oSettings._reszEvt = true;
		}
	}
	
	
	/**
	 * Throttle the calls to a function. Arguments and context are maintained for
	 * the throttled function
	 *  @param {function} fn Function to be called
	 *  @param {int} [freq=200] call frequency in mS
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#oApi
	 */
	var _fnThrottle = DataTable.util.throttle;
	
	
	/**
	 * Convert a CSS unit width to pixels (e.g. 2em)
	 *  @param {string} width width to be converted
	 *  @param {node} parent parent to get the with for (required for relative widths) - optional
	 *  @returns {int} width in pixels
	 *  @memberof DataTable#oApi
	 */
	function _fnConvertToWidth ( width, parent )
	{
		if ( ! width ) {
			return 0;
		}
	
		var n = $('<div/>')
			.css( 'width', _fnStringToCss( width ) )
			.appendTo( parent || document.body );
	
		var val = n[0].offsetWidth;
		n.remove();
	
		return val;
	}
	
	
	/**
	 * Get the widest node
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {node} widest table node
	 *  @memberof DataTable#oApi
	 */
	function _fnGetWidestNode( settings, colIdx )
	{
		var idx = _fnGetMaxLenString( settings, colIdx );
		if ( idx < 0 ) {
			return null;
		}
	
		var data = settings.aoData[ idx ];
		return ! data.nTr ? // Might not have been created when deferred rendering
			$('<td/>').html( _fnGetCellData( settings, idx, colIdx, 'display' ) )[0] :
			data.anCells[ colIdx ];
	}
	
	
	/**
	 * Get the maximum strlen for each data column
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {string} max string length for each column
	 *  @memberof DataTable#oApi
	 */
	function _fnGetMaxLenString( settings, colIdx )
	{
		var s, max=-1, maxIdx = -1;
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			s = _fnGetCellData( settings, i, colIdx, 'display' )+'';
			s = s.replace( __re_html_remove, '' );
			s = s.replace( /&nbsp;/g, ' ' );
	
			if ( s.length > max ) {
				max = s.length;
				maxIdx = i;
			}
		}
	
		return maxIdx;
	}
	
	
	/**
	 * Append a CSS unit (only if required) to a string
	 *  @param {string} value to css-ify
	 *  @returns {string} value with css unit
	 *  @memberof DataTable#oApi
	 */
	function _fnStringToCss( s )
	{
		if ( s === null ) {
			return '0px';
		}
	
		if ( typeof s == 'number' ) {
			return s < 0 ?
				'0px' :
				s+'px';
		}
	
		// Check it has a unit character already
		return s.match(/\d$/) ?
			s+'px' :
			s;
	}
	
	
	
	function _fnSortFlatten ( settings )
	{
		var
			i, iLen, k, kLen,
			aSort = [],
			aiOrig = [],
			aoColumns = settings.aoColumns,
			aDataSort, iCol, sType, srcCol,
			fixed = settings.aaSortingFixed,
			fixedObj = $.isPlainObject( fixed ),
			nestedSort = [],
			add = function ( a ) {
				if ( a.length && ! $.isArray( a[0] ) ) {
					// 1D array
					nestedSort.push( a );
				}
				else {
					// 2D array
					$.merge( nestedSort, a );
				}
			};
	
		// Build the sort array, with pre-fix and post-fix options if they have been
		// specified
		if ( $.isArray( fixed ) ) {
			add( fixed );
		}
	
		if ( fixedObj && fixed.pre ) {
			add( fixed.pre );
		}
	
		add( settings.aaSorting );
	
		if (fixedObj && fixed.post ) {
			add( fixed.post );
		}
	
		for ( i=0 ; i<nestedSort.length ; i++ )
		{
			srcCol = nestedSort[i][0];
			aDataSort = aoColumns[ srcCol ].aDataSort;
	
			for ( k=0, kLen=aDataSort.length ; k<kLen ; k++ )
			{
				iCol = aDataSort[k];
				sType = aoColumns[ iCol ].sType || 'string';
	
				if ( nestedSort[i]._idx === undefined ) {
					nestedSort[i]._idx = $.inArray( nestedSort[i][1], aoColumns[iCol].asSorting );
				}
	
				aSort.push( {
					src:       srcCol,
					col:       iCol,
					dir:       nestedSort[i][1],
					index:     nestedSort[i]._idx,
					type:      sType,
					formatter: DataTable.ext.type.order[ sType+"-pre" ]
				} );
			}
		}
	
		return aSort;
	}
	
	/**
	 * Change the order of the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 *  @todo This really needs split up!
	 */
	function _fnSort ( oSettings )
	{
		var
			i, ien, iLen, j, jLen, k, kLen,
			sDataType, nTh,
			aiOrig = [],
			oExtSort = DataTable.ext.type.order,
			aoData = oSettings.aoData,
			aoColumns = oSettings.aoColumns,
			aDataSort, data, iCol, sType, oSort,
			formatters = 0,
			sortCol,
			displayMaster = oSettings.aiDisplayMaster,
			aSort;
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo Can this be moved into a 'data-ready' handler which is called when
		//   data is going to be used in the table?
		_fnColumnTypes( oSettings );
	
		aSort = _fnSortFlatten( oSettings );
	
		for ( i=0, ien=aSort.length ; i<ien ; i++ ) {
			sortCol = aSort[i];
	
			// Track if we can use the fast sort algorithm
			if ( sortCol.formatter ) {
				formatters++;
			}
	
			// Load the data needed for the sort, for each cell
			_fnSortData( oSettings, sortCol.col );
		}
	
		/* No sorting required if server-side or no sorting array */
		if ( _fnDataSource( oSettings ) != 'ssp' && aSort.length !== 0 )
		{
			// Create a value - key array of the current row positions such that we can use their
			// current position during the sort, if values match, in order to perform stable sorting
			for ( i=0, iLen=displayMaster.length ; i<iLen ; i++ ) {
				aiOrig[ displayMaster[i] ] = i;
			}
	
			/* Do the sort - here we want multi-column sorting based on a given data source (column)
			 * and sorting function (from oSort) in a certain direction. It's reasonably complex to
			 * follow on it's own, but this is what we want (example two column sorting):
			 *  fnLocalSorting = function(a,b){
			 *    var iTest;
			 *    iTest = oSort['string-asc']('data11', 'data12');
			 *      if (iTest !== 0)
			 *        return iTest;
			 *    iTest = oSort['numeric-desc']('data21', 'data22');
			 *    if (iTest !== 0)
			 *      return iTest;
			 *    return oSort['numeric-asc']( aiOrig[a], aiOrig[b] );
			 *  }
			 * Basically we have a test for each sorting column, if the data in that column is equal,
			 * test the next column. If all columns match, then we use a numeric sort on the row
			 * positions in the original data array to provide a stable sort.
			 *
			 * Note - I know it seems excessive to have two sorting methods, but the first is around
			 * 15% faster, so the second is only maintained for backwards compatibility with sorting
			 * methods which do not have a pre-sort formatting function.
			 */
			if ( formatters === aSort.length ) {
				// All sort types have formatting functions
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, test, sort,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						test = x<y ? -1 : x>y ? 1 : 0;
						if ( test !== 0 ) {
							return sort.dir === 'asc' ? test : -test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
			else {
				// Depreciated - remove in 1.11 (providing a plug-in option)
				// Not all sort types have formatting methods, so we have to call their sorting
				// methods.
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, l, test, sort, fn,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						fn = oExtSort[ sort.type+"-"+sort.dir ] || oExtSort[ "string-"+sort.dir ];
						test = fn( x, y );
						if ( test !== 0 ) {
							return test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
		}
	
		/* Tell the draw function that we have sorted the data */
		oSettings.bSorted = true;
	}
	
	
	function _fnSortAria ( settings )
	{
		var label;
		var nextSort;
		var columns = settings.aoColumns;
		var aSort = _fnSortFlatten( settings );
		var oAria = settings.oLanguage.oAria;
	
		// ARIA attributes - need to loop all columns, to update all (removing old
		// attributes as needed)
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			var col = columns[i];
			var asSorting = col.asSorting;
			var sTitle = col.sTitle.replace( /<.*?>/g, "" );
			var th = col.nTh;
	
			// IE7 is throwing an error when setting these properties with jQuery's
			// attr() and removeAttr() methods...
			th.removeAttribute('aria-sort');
	
			/* In ARIA only the first sorting column can be marked as sorting - no multi-sort option */
			if ( col.bSortable ) {
				if ( aSort.length > 0 && aSort[0].col == i ) {
					th.setAttribute('aria-sort', aSort[0].dir=="asc" ? "ascending" : "descending" );
					nextSort = asSorting[ aSort[0].index+1 ] || asSorting[0];
				}
				else {
					nextSort = asSorting[0];
				}
	
				label = sTitle + ( nextSort === "asc" ?
					oAria.sSortAscending :
					oAria.sSortDescending
				);
			}
			else {
				label = sTitle;
			}
	
			th.setAttribute('aria-label', label);
		}
	}
	
	
	/**
	 * Function to run on user sort request
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {boolean} [append=false] Append the requested sort to the existing
	 *    sort if true (i.e. multi-column sort)
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortListener ( settings, colIdx, append, callback )
	{
		var col = settings.aoColumns[ colIdx ];
		var sorting = settings.aaSorting;
		var asSorting = col.asSorting;
		var nextSortIdx;
		var next = function ( a, overflow ) {
			var idx = a._idx;
			if ( idx === undefined ) {
				idx = $.inArray( a[1], asSorting );
			}
	
			return idx+1 < asSorting.length ?
				idx+1 :
				overflow ?
					null :
					0;
		};
	
		// Convert to 2D array if needed
		if ( typeof sorting[0] === 'number' ) {
			sorting = settings.aaSorting = [ sorting ];
		}
	
		// If appending the sort then we are multi-column sorting
		if ( append && settings.oFeatures.bSortMulti ) {
			// Are we already doing some kind of sort on this column?
			var sortIdx = $.inArray( colIdx, _pluck(sorting, '0') );
	
			if ( sortIdx !== -1 ) {
				// Yes, modify the sort
				nextSortIdx = next( sorting[sortIdx], true );
	
				if ( nextSortIdx === null && sorting.length === 1 ) {
					nextSortIdx = 0; // can't remove sorting completely
				}
	
				if ( nextSortIdx === null ) {
					sorting.splice( sortIdx, 1 );
				}
				else {
					sorting[sortIdx][1] = asSorting[ nextSortIdx ];
					sorting[sortIdx]._idx = nextSortIdx;
				}
			}
			else {
				// No sort on this column yet
				sorting.push( [ colIdx, asSorting[0], 0 ] );
				sorting[sorting.length-1]._idx = 0;
			}
		}
		else if ( sorting.length && sorting[0][0] == colIdx ) {
			// Single column - already sorting on this column, modify the sort
			nextSortIdx = next( sorting[0] );
	
			sorting.length = 1;
			sorting[0][1] = asSorting[ nextSortIdx ];
			sorting[0]._idx = nextSortIdx;
		}
		else {
			// Single column - sort only on this column
			sorting.length = 0;
			sorting.push( [ colIdx, asSorting[0] ] );
			sorting[0]._idx = 0;
		}
	
		// Run the sort by calling a full redraw
		_fnReDraw( settings );
	
		// callback used for async user interaction
		if ( typeof callback == 'function' ) {
			callback( settings );
		}
	}
	
	
	/**
	 * Attach a sort handler (click) to a node
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortAttachListener ( settings, attachTo, colIdx, callback )
	{
		var col = settings.aoColumns[ colIdx ];
	
		_fnBindAction( attachTo, {}, function (e) {
			/* If the column is not sortable - don't to anything */
			if ( col.bSortable === false ) {
				return;
			}
	
			// If processing is enabled use a timeout to allow the processing
			// display to be shown - otherwise to it synchronously
			if ( settings.oFeatures.bProcessing ) {
				_fnProcessingDisplay( settings, true );
	
				setTimeout( function() {
					_fnSortListener( settings, colIdx, e.shiftKey, callback );
	
					// In server-side processing, the draw callback will remove the
					// processing display
					if ( _fnDataSource( settings ) !== 'ssp' ) {
						_fnProcessingDisplay( settings, false );
					}
				}, 0 );
			}
			else {
				_fnSortListener( settings, colIdx, e.shiftKey, callback );
			}
		} );
	}
	
	
	/**
	 * Set the sorting classes on table's body, Note: it is safe to call this function
	 * when bSort and bSortClasses are false
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSortingClasses( settings )
	{
		var oldSort = settings.aLastSort;
		var sortClass = settings.oClasses.sSortColumn;
		var sort = _fnSortFlatten( settings );
		var features = settings.oFeatures;
		var i, ien, colIdx;
	
		if ( features.bSort && features.bSortClasses ) {
			// Remove old sorting classes
			for ( i=0, ien=oldSort.length ; i<ien ; i++ ) {
				colIdx = oldSort[i].src;
	
				// Remove column sorting
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.removeClass( sortClass + (i<2 ? i+1 : 3) );
			}
	
			// Add new column sorting
			for ( i=0, ien=sort.length ; i<ien ; i++ ) {
				colIdx = sort[i].src;
	
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.addClass( sortClass + (i<2 ? i+1 : 3) );
			}
		}
	
		settings.aLastSort = sort;
	}
	
	
	// Get the data to sort a column, be it from cache, fresh (populating the
	// cache), or from a sort formatter
	function _fnSortData( settings, idx )
	{
		// Custom sorting function - provided by the sort data type
		var column = settings.aoColumns[ idx ];
		var customSort = DataTable.ext.order[ column.sSortDataType ];
		var customData;
	
		if ( customSort ) {
			customData = customSort.call( settings.oInstance, settings, idx,
				_fnColumnIndexToVisible( settings, idx )
			);
		}
	
		// Use / populate cache
		var row, cellData;
		var formatter = DataTable.ext.type.order[ column.sType+"-pre" ];
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aSortData ) {
				row._aSortData = [];
			}
	
			if ( ! row._aSortData[idx] || customSort ) {
				cellData = customSort ?
					customData[i] : // If there was a custom sort function, use data from there
					_fnGetCellData( settings, i, idx, 'sort' );
	
				row._aSortData[ idx ] = formatter ?
					formatter( cellData ) :
					cellData;
			}
		}
	}
	
	
	
	/**
	 * Save the state of a table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSaveState ( settings )
	{
		if ( !settings.oFeatures.bStateSave || settings.bDestroying )
		{
			return;
		}
	
		/* Store the interesting variables */
		var state = {
			time:    +new Date(),
			start:   settings._iDisplayStart,
			length:  settings._iDisplayLength,
			order:   $.extend( true, [], settings.aaSorting ),
			search:  _fnSearchToCamel( settings.oPreviousSearch ),
			columns: $.map( settings.aoColumns, function ( col, i ) {
				return {
					visible: col.bVisible,
					search: _fnSearchToCamel( settings.aoPreSearchCols[i] )
				};
			} )
		};
	
		_fnCallbackFire( settings, "aoStateSaveParams", 'stateSaveParams', [settings, state] );
	
		settings.oSavedState = state;
		settings.fnStateSaveCallback.call( settings.oInstance, settings, state );
	}
	
	
	/**
	 * Attempt to load a saved table state
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oInit DataTables init object so we can override settings
	 *  @memberof DataTable#oApi
	 */
	function _fnLoadState ( settings, oInit )
	{
		var i, ien;
		var columns = settings.aoColumns;
	
		if ( ! settings.oFeatures.bStateSave ) {
			return;
		}
	
		var state = settings.fnStateLoadCallback.call( settings.oInstance, settings );
		if ( ! state || ! state.time ) {
			return;
		}
	
		/* Allow custom and plug-in manipulation functions to alter the saved data set and
		 * cancelling of loading by returning false
		 */
		var abStateLoad = _fnCallbackFire( settings, 'aoStateLoadParams', 'stateLoadParams', [settings, state] );
		if ( $.inArray( false, abStateLoad ) !== -1 ) {
			return;
		}
	
		/* Reject old data */
		var duration = settings.iStateDuration;
		if ( duration > 0 && state.time < +new Date() - (duration*1000) ) {
			return;
		}
	
		// Number of columns have changed - all bets are off, no restore of settings
		if ( columns.length !== state.columns.length ) {
			return;
		}
	
		// Store the saved state so it might be accessed at any time
		settings.oLoadedState = $.extend( true, {}, state );
	
		// Restore key features - todo - for 1.11 this needs to be done by
		// subscribed events
		if ( state.start !== undefined ) {
			settings._iDisplayStart    = state.start;
			settings.iInitDisplayStart = state.start;
		}
		if ( state.length !== undefined ) {
			settings._iDisplayLength   = state.length;
		}
	
		// Order
		if ( state.order !== undefined ) {
			settings.aaSorting = [];
			$.each( state.order, function ( i, col ) {
				settings.aaSorting.push( col[0] >= columns.length ?
					[ 0, col[1] ] :
					col
				);
			} );
		}
	
		// Search
		if ( state.search !== undefined ) {
			$.extend( settings.oPreviousSearch, _fnSearchToHung( state.search ) );
		}
	
		// Columns
		for ( i=0, ien=state.columns.length ; i<ien ; i++ ) {
			var col = state.columns[i];
	
			// Visibility
			if ( col.visible !== undefined ) {
				columns[i].bVisible = col.visible;
			}
	
			// Search
			if ( col.search !== undefined ) {
				$.extend( settings.aoPreSearchCols[i], _fnSearchToHung( col.search ) );
			}
		}
	
		_fnCallbackFire( settings, 'aoStateLoaded', 'stateLoaded', [settings, state] );
	}
	
	
	/**
	 * Return the settings object for a particular table
	 *  @param {node} table table we are using as a dataTable
	 *  @returns {object} Settings object - or null if not found
	 *  @memberof DataTable#oApi
	 */
	function _fnSettingsFromNode ( table )
	{
		var settings = DataTable.settings;
		var idx = $.inArray( table, _pluck( settings, 'nTable' ) );
	
		return idx !== -1 ?
			settings[ idx ] :
			null;
	}
	
	
	/**
	 * Log an error message
	 *  @param {object} settings dataTables settings object
	 *  @param {int} level log error messages, or display them to the user
	 *  @param {string} msg error message
	 *  @param {int} tn Technical note id to get more information about the error.
	 *  @memberof DataTable#oApi
	 */
	function _fnLog( settings, level, msg, tn )
	{
		msg = 'DataTables warning: '+
			(settings ? 'table id='+settings.sTableId+' - ' : '')+msg;
	
		if ( tn ) {
			msg += '. For more information about this error, please see '+
			'http://datatables.net/tn/'+tn;
		}
	
		if ( ! level  ) {
			// Backwards compatibility pre 1.10
			var ext = DataTable.ext;
			var type = ext.sErrMode || ext.errMode;
	
			if ( settings ) {
				_fnCallbackFire( settings, null, 'error', [ settings, tn, msg ] );
			}
	
			if ( type == 'alert' ) {
				alert( msg );
			}
			else if ( type == 'throw' ) {
				throw new Error(msg);
			}
			else if ( typeof type == 'function' ) {
				type( settings, tn, msg );
			}
		}
		else if ( window.console && console.log ) {
			console.log( msg );
		}
	}
	
	
	/**
	 * See if a property is defined on one object, if so assign it to the other object
	 *  @param {object} ret target object
	 *  @param {object} src source object
	 *  @param {string} name property
	 *  @param {string} [mappedName] name to map too - optional, name used if not given
	 *  @memberof DataTable#oApi
	 */
	function _fnMap( ret, src, name, mappedName )
	{
		if ( $.isArray( name ) ) {
			$.each( name, function (i, val) {
				if ( $.isArray( val ) ) {
					_fnMap( ret, src, val[0], val[1] );
				}
				else {
					_fnMap( ret, src, val );
				}
			} );
	
			return;
		}
	
		if ( mappedName === undefined ) {
			mappedName = name;
		}
	
		if ( src[name] !== undefined ) {
			ret[mappedName] = src[name];
		}
	}
	
	
	/**
	 * Extend objects - very similar to jQuery.extend, but deep copy objects, and
	 * shallow copy arrays. The reason we need to do this, is that we don't want to
	 * deep copy array init values (such as aaSorting) since the dev wouldn't be
	 * able to override them, but we do want to deep copy arrays.
	 *  @param {object} out Object to extend
	 *  @param {object} extender Object from which the properties will be applied to
	 *      out
	 *  @param {boolean} breakRefs If true, then arrays will be sliced to take an
	 *      independent copy with the exception of the `data` or `aaData` parameters
	 *      if they are present. This is so you can pass in a collection to
	 *      DataTables and have that used as your data source without breaking the
	 *      references
	 *  @returns {object} out Reference, just for convenience - out === the return.
	 *  @memberof DataTable#oApi
	 *  @todo This doesn't take account of arrays inside the deep copied objects.
	 */
	function _fnExtend( out, extender, breakRefs )
	{
		var val;
	
		for ( var prop in extender ) {
			if ( extender.hasOwnProperty(prop) ) {
				val = extender[prop];
	
				if ( $.isPlainObject( val ) ) {
					if ( ! $.isPlainObject( out[prop] ) ) {
						out[prop] = {};
					}
					$.extend( true, out[prop], val );
				}
				else if ( breakRefs && prop !== 'data' && prop !== 'aaData' && $.isArray(val) ) {
					out[prop] = val.slice();
				}
				else {
					out[prop] = val;
				}
			}
		}
	
		return out;
	}
	
	
	/**
	 * Bind an event handers to allow a click or return key to activate the callback.
	 * This is good for accessibility since a return on the keyboard will have the
	 * same effect as a click, if the element has focus.
	 *  @param {element} n Element to bind the action to
	 *  @param {object} oData Data object to pass to the triggered function
	 *  @param {function} fn Callback function for when the event is triggered
	 *  @memberof DataTable#oApi
	 */
	function _fnBindAction( n, oData, fn )
	{
		$(n)
			.bind( 'click.DT', oData, function (e) {
					n.blur(); // Remove focus outline for mouse users
					fn(e);
				} )
			.bind( 'keypress.DT', oData, function (e){
					if ( e.which === 13 ) {
						e.preventDefault();
						fn(e);
					}
				} )
			.bind( 'selectstart.DT', function () {
					/* Take the brutal approach to cancelling text selection */
					return false;
				} );
	}
	
	
	/**
	 * Register a callback function. Easily allows a callback function to be added to
	 * an array store of callback functions that can then all be called together.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sStore Name of the array storage for the callbacks in oSettings
	 *  @param {function} fn Function to be called back
	 *  @param {string} sName Identifying name for the callback (i.e. a label)
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackReg( oSettings, sStore, fn, sName )
	{
		if ( fn )
		{
			oSettings[sStore].push( {
				"fn": fn,
				"sName": sName
			} );
		}
	}
	
	
	/**
	 * Fire callback functions and trigger events. Note that the loop over the
	 * callback array store is done backwards! Further note that you do not want to
	 * fire off triggers in time sensitive applications (for example cell creation)
	 * as its slow.
	 *  @param {object} settings dataTables settings object
	 *  @param {string} callbackArr Name of the array storage for the callbacks in
	 *      oSettings
	 *  @param {string} eventName Name of the jQuery custom event to trigger. If
	 *      null no trigger is fired
	 *  @param {array} args Array of arguments to pass to the callback function /
	 *      trigger
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackFire( settings, callbackArr, eventName, args )
	{
		var ret = [];
	
		if ( callbackArr ) {
			ret = $.map( settings[callbackArr].slice().reverse(), function (val, i) {
				return val.fn.apply( settings.oInstance, args );
			} );
		}
	
		if ( eventName !== null ) {
			var e = $.Event( eventName+'.dt' );
	
			$(settings.nTable).trigger( e, args );
	
			ret.push( e.result );
		}
	
		return ret;
	}
	
	
	function _fnLengthOverflow ( settings )
	{
		var
			start = settings._iDisplayStart,
			end = settings.fnDisplayEnd(),
			len = settings._iDisplayLength;
	
		/* If we have space to show extra rows (backing up from the end point - then do so */
		if ( start >= end )
		{
			start = end - len;
		}
	
		// Keep the start record on the current page
		start -= (start % len);
	
		if ( len === -1 || start < 0 )
		{
			start = 0;
		}
	
		settings._iDisplayStart = start;
	}
	
	
	function _fnRenderer( settings, type )
	{
		var renderer = settings.renderer;
		var host = DataTable.ext.renderer[type];
	
		if ( $.isPlainObject( renderer ) && renderer[type] ) {
			// Specific renderer for this type. If available use it, otherwise use
			// the default.
			return host[renderer[type]] || host._;
		}
		else if ( typeof renderer === 'string' ) {
			// Common renderer - if there is one available for this type use it,
			// otherwise use the default
			return host[renderer] || host._;
		}
	
		// Use the default
		return host._;
	}
	
	
	/**
	 * Detect the data source being used for the table. Used to simplify the code
	 * a little (ajax) and to make it compress a little smaller.
	 *
	 *  @param {object} settings dataTables settings object
	 *  @returns {string} Data source
	 *  @memberof DataTable#oApi
	 */
	function _fnDataSource ( settings )
	{
		if ( settings.oFeatures.bServerSide ) {
			return 'ssp';
		}
		else if ( settings.ajax || settings.sAjaxSource ) {
			return 'ajax';
		}
		return 'dom';
	}
	

	
	
	/**
	 * Computed structure of the DataTables API, defined by the options passed to
	 * `DataTable.Api.register()` when building the API.
	 *
	 * The structure is built in order to speed creation and extension of the Api
	 * objects since the extensions are effectively pre-parsed.
	 *
	 * The array is an array of objects with the following structure, where this
	 * base array represents the Api prototype base:
	 *
	 *     [
	 *       {
	 *         name:      'data'                -- string   - Property name
	 *         val:       function () {},       -- function - Api method (or undefined if just an object
	 *         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	 *         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	 *       },
	 *       {
	 *         name:     'row'
	 *         val:       {},
	 *         methodExt: [ ... ],
	 *         propExt:   [
	 *           {
	 *             name:      'data'
	 *             val:       function () {},
	 *             methodExt: [ ... ],
	 *             propExt:   [ ... ]
	 *           },
	 *           ...
	 *         ]
	 *       }
	 *     ]
	 *
	 * @type {Array}
	 * @ignore
	 */
	var __apiStruct = [];
	
	
	/**
	 * `Array.prototype` reference.
	 *
	 * @type object
	 * @ignore
	 */
	var __arrayProto = Array.prototype;
	
	
	/**
	 * Abstraction for `context` parameter of the `Api` constructor to allow it to
	 * take several different forms for ease of use.
	 *
	 * Each of the input parameter types will be converted to a DataTables settings
	 * object where possible.
	 *
	 * @param  {string|node|jQuery|object} mixed DataTable identifier. Can be one
	 *   of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 *   * `DataTables.Api` - API instance
	 * @return {array|null} Matching DataTables settings objects. `null` or
	 *   `undefined` is returned if no matching DataTable is found.
	 * @ignore
	 */
	var _toSettings = function ( mixed )
	{
		var idx, jq;
		var settings = DataTable.settings;
		var tables = $.map( settings, function (el, i) {
			return el.nTable;
		} );
	
		if ( ! mixed ) {
			return [];
		}
		else if ( mixed.nTable && mixed.oApi ) {
			// DataTables settings object
			return [ mixed ];
		}
		else if ( mixed.nodeName && mixed.nodeName.toLowerCase() === 'table' ) {
			// Table node
			idx = $.inArray( mixed, tables );
			return idx !== -1 ? [ settings[idx] ] : null;
		}
		else if ( mixed && typeof mixed.settings === 'function' ) {
			return mixed.settings().toArray();
		}
		else if ( typeof mixed === 'string' ) {
			// jQuery selector
			jq = $(mixed);
		}
		else if ( mixed instanceof $ ) {
			// jQuery object (also DataTables instance)
			jq = mixed;
		}
	
		if ( jq ) {
			return jq.map( function(i) {
				idx = $.inArray( this, tables );
				return idx !== -1 ? settings[idx] : null;
			} ).toArray();
		}
	};
	
	
	/**
	 * DataTables API class - used to control and interface with  one or more
	 * DataTables enhanced tables.
	 *
	 * The API class is heavily based on jQuery, presenting a chainable interface
	 * that you can use to interact with tables. Each instance of the API class has
	 * a "context" - i.e. the tables that it will operate on. This could be a single
	 * table, all tables on a page or a sub-set thereof.
	 *
	 * Additionally the API is designed to allow you to easily work with the data in
	 * the tables, retrieving and manipulating it as required. This is done by
	 * presenting the API class as an array like interface. The contents of the
	 * array depend upon the actions requested by each method (for example
	 * `rows().nodes()` will return an array of nodes, while `rows().data()` will
	 * return an array of objects or arrays depending upon your table's
	 * configuration). The API object has a number of array like methods (`push`,
	 * `pop`, `reverse` etc) as well as additional helper methods (`each`, `pluck`,
	 * `unique` etc) to assist your working with the data held in a table.
	 *
	 * Most methods (those which return an Api instance) are chainable, which means
	 * the return from a method call also has all of the methods available that the
	 * top level object had. For example, these two calls are equivalent:
	 *
	 *     // Not chained
	 *     api.row.add( {...} );
	 *     api.draw();
	 *
	 *     // Chained
	 *     api.row.add( {...} ).draw();
	 *
	 * @class DataTable.Api
	 * @param {array|object|string|jQuery} context DataTable identifier. This is
	 *   used to define which DataTables enhanced tables this API will operate on.
	 *   Can be one of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 * @param {array} [data] Data to initialise the Api instance with.
	 *
	 * @example
	 *   // Direct initialisation during DataTables construction
	 *   var api = $('#example').DataTable();
	 *
	 * @example
	 *   // Initialisation using a DataTables jQuery object
	 *   var api = $('#example').dataTable().api();
	 *
	 * @example
	 *   // Initialisation as a constructor
	 *   var api = new $.fn.DataTable.Api( 'table.dataTable' );
	 */
	_Api = function ( context, data )
	{
		if ( ! (this instanceof _Api) ) {
			return new _Api( context, data );
		}
	
		var settings = [];
		var ctxSettings = function ( o ) {
			var a = _toSettings( o );
			if ( a ) {
				settings = settings.concat( a );
			}
		};
	
		if ( $.isArray( context ) ) {
			for ( var i=0, ien=context.length ; i<ien ; i++ ) {
				ctxSettings( context[i] );
			}
		}
		else {
			ctxSettings( context );
		}
	
		// Remove duplicates
		this.context = _unique( settings );
	
		// Initial data
		if ( data ) {
			$.merge( this, data );
		}
	
		// selector
		this.selector = {
			rows: null,
			cols: null,
			opts: null
		};
	
		_Api.extend( this, this, __apiStruct );
	};
	
	DataTable.Api = _Api;
	
	// Don't destroy the existing prototype, just extend it. Required for jQuery 2's
	// isPlainObject.
	$.extend( _Api.prototype, {
		any: function ()
		{
			return this.count() !== 0;
		},
	
	
		concat:  __arrayProto.concat,
	
	
		context: [], // array of table settings objects
	
	
		count: function ()
		{
			return this.flatten().length;
		},
	
	
		each: function ( fn )
		{
			for ( var i=0, ien=this.length ; i<ien; i++ ) {
				fn.call( this, this[i], i, this );
			}
	
			return this;
		},
	
	
		eq: function ( idx )
		{
			var ctx = this.context;
	
			return ctx.length > idx ?
				new _Api( ctx[idx], this[idx] ) :
				null;
		},
	
	
		filter: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.filter ) {
				a = __arrayProto.filter.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					if ( fn.call( this, this[i], i, this ) ) {
						a.push( this[i] );
					}
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		flatten: function ()
		{
			var a = [];
			return new _Api( this.context, a.concat.apply( a, this.toArray() ) );
		},
	
	
		join:    __arrayProto.join,
	
	
		indexOf: __arrayProto.indexOf || function (obj, start)
		{
			for ( var i=(start || 0), ien=this.length ; i<ien ; i++ ) {
				if ( this[i] === obj ) {
					return i;
				}
			}
			return -1;
		},
	
		iterator: function ( flatten, type, fn, alwaysNew ) {
			var
				a = [], ret,
				i, ien, j, jen,
				context = this.context,
				rows, items, item,
				selector = this.selector;
	
			// Argument shifting
			if ( typeof flatten === 'string' ) {
				alwaysNew = fn;
				fn = type;
				type = flatten;
				flatten = false;
			}
	
			for ( i=0, ien=context.length ; i<ien ; i++ ) {
				var apiInst = new _Api( context[i] );
	
				if ( type === 'table' ) {
					ret = fn.call( apiInst, context[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'columns' || type === 'rows' ) {
					// this has same length as context - one entry for each table
					ret = fn.call( apiInst, context[i], this[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell' ) {
					// columns and rows share the same structure.
					// 'this' is an array of column indexes for each context
					items = this[i];
	
					if ( type === 'column-rows' ) {
						rows = _selector_row_indexes( context[i], selector.opts );
					}
	
					for ( j=0, jen=items.length ; j<jen ; j++ ) {
						item = items[j];
	
						if ( type === 'cell' ) {
							ret = fn.call( apiInst, context[i], item.row, item.column, i, j );
						}
						else {
							ret = fn.call( apiInst, context[i], item, i, j, rows );
						}
	
						if ( ret !== undefined ) {
							a.push( ret );
						}
					}
				}
			}
	
			if ( a.length || alwaysNew ) {
				var api = new _Api( context, flatten ? a.concat.apply( [], a ) : a );
				var apiSelector = api.selector;
				apiSelector.rows = selector.rows;
				apiSelector.cols = selector.cols;
				apiSelector.opts = selector.opts;
				return api;
			}
			return this;
		},
	
	
		lastIndexOf: __arrayProto.lastIndexOf || function (obj, start)
		{
			// Bit cheeky...
			return this.indexOf.apply( this.toArray.reverse(), arguments );
		},
	
	
		length:  0,
	
	
		map: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.map ) {
				a = __arrayProto.map.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					a.push( fn.call( this, this[i], i ) );
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		pluck: function ( prop )
		{
			return this.map( function ( el ) {
				return el[ prop ];
			} );
		},
	
		pop:     __arrayProto.pop,
	
	
		push:    __arrayProto.push,
	
	
		// Does not return an API instance
		reduce: __arrayProto.reduce || function ( fn, init )
		{
			return _fnReduce( this, fn, init, 0, this.length, 1 );
		},
	
	
		reduceRight: __arrayProto.reduceRight || function ( fn, init )
		{
			return _fnReduce( this, fn, init, this.length-1, -1, -1 );
		},
	
	
		reverse: __arrayProto.reverse,
	
	
		// Object with rows, columns and opts
		selector: null,
	
	
		shift:   __arrayProto.shift,
	
	
		sort:    __arrayProto.sort, // ? name - order?
	
	
		splice:  __arrayProto.splice,
	
	
		toArray: function ()
		{
			return __arrayProto.slice.call( this );
		},
	
	
		to$: function ()
		{
			return $( this );
		},
	
	
		toJQuery: function ()
		{
			return $( this );
		},
	
	
		unique: function ()
		{
			return new _Api( this.context, _unique(this) );
		},
	
	
		unshift: __arrayProto.unshift
	} );
	
	
	_Api.extend = function ( scope, obj, ext )
	{
		// Only extend API instances and static properties of the API
		if ( ! ext.length || ! obj || ( ! (obj instanceof _Api) && ! obj.__dt_wrapper ) ) {
			return;
		}
	
		var
			i, ien,
			j, jen,
			struct, inner,
			methodScoping = function ( scope, fn, struc ) {
				return function () {
					var ret = fn.apply( scope, arguments );
	
					// Method extension
					_Api.extend( ret, ret, struc.methodExt );
					return ret;
				};
			};
	
		for ( i=0, ien=ext.length ; i<ien ; i++ ) {
			struct = ext[i];
	
			// Value
			obj[ struct.name ] = typeof struct.val === 'function' ?
				methodScoping( scope, struct.val, struct ) :
				$.isPlainObject( struct.val ) ?
					{} :
					struct.val;
	
			obj[ struct.name ].__dt_wrapper = true;
	
			// Property extension
			_Api.extend( scope, obj[ struct.name ], struct.propExt );
		}
	};
	
	
	// @todo - Is there need for an augment function?
	// _Api.augment = function ( inst, name )
	// {
	// 	// Find src object in the structure from the name
	// 	var parts = name.split('.');
	
	// 	_Api.extend( inst, obj );
	// };
	
	
	//     [
	//       {
	//         name:      'data'                -- string   - Property name
	//         val:       function () {},       -- function - Api method (or undefined if just an object
	//         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	//         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	//       },
	//       {
	//         name:     'row'
	//         val:       {},
	//         methodExt: [ ... ],
	//         propExt:   [
	//           {
	//             name:      'data'
	//             val:       function () {},
	//             methodExt: [ ... ],
	//             propExt:   [ ... ]
	//           },
	//           ...
	//         ]
	//       }
	//     ]
	
	_Api.register = _api_register = function ( name, val )
	{
		if ( $.isArray( name ) ) {
			for ( var j=0, jen=name.length ; j<jen ; j++ ) {
				_Api.register( name[j], val );
			}
			return;
		}
	
		var
			i, ien,
			heir = name.split('.'),
			struct = __apiStruct,
			key, method;
	
		var find = function ( src, name ) {
			for ( var i=0, ien=src.length ; i<ien ; i++ ) {
				if ( src[i].name === name ) {
					return src[i];
				}
			}
			return null;
		};
	
		for ( i=0, ien=heir.length ; i<ien ; i++ ) {
			method = heir[i].indexOf('()') !== -1;
			key = method ?
				heir[i].replace('()', '') :
				heir[i];
	
			var src = find( struct, key );
			if ( ! src ) {
				src = {
					name:      key,
					val:       {},
					methodExt: [],
					propExt:   []
				};
				struct.push( src );
			}
	
			if ( i === ien-1 ) {
				src.val = val;
			}
			else {
				struct = method ?
					src.methodExt :
					src.propExt;
			}
		}
	};
	
	
	_Api.registerPlural = _api_registerPlural = function ( pluralName, singularName, val ) {
		_Api.register( pluralName, val );
	
		_Api.register( singularName, function () {
			var ret = val.apply( this, arguments );
	
			if ( ret === this ) {
				// Returned item is the API instance that was passed in, return it
				return this;
			}
			else if ( ret instanceof _Api ) {
				// New API instance returned, want the value from the first item
				// in the returned array for the singular result.
				return ret.length ?
					$.isArray( ret[0] ) ?
						new _Api( ret.context, ret[0] ) : // Array results are 'enhanced'
						ret[0] :
					undefined;
			}
	
			// Non-API return - just fire it back
			return ret;
		} );
	};
	
	
	/**
	 * Selector for HTML tables. Apply the given selector to the give array of
	 * DataTables settings objects.
	 *
	 * @param {string|integer} [selector] jQuery selector string or integer
	 * @param  {array} Array of DataTables settings objects to be filtered
	 * @return {array}
	 * @ignore
	 */
	var __table_selector = function ( selector, a )
	{
		// Integer is used to pick out a table by index
		if ( typeof selector === 'number' ) {
			return [ a[ selector ] ];
		}
	
		// Perform a jQuery selector on the table nodes
		var nodes = $.map( a, function (el, i) {
			return el.nTable;
		} );
	
		return $(nodes)
			.filter( selector )
			.map( function (i) {
				// Need to translate back from the table node to the settings
				var idx = $.inArray( this, nodes );
				return a[ idx ];
			} )
			.toArray();
	};
	
	
	
	/**
	 * Context selector for the API's context (i.e. the tables the API instance
	 * refers to.
	 *
	 * @name    DataTable.Api#tables
	 * @param {string|integer} [selector] Selector to pick which tables the iterator
	 *   should operate on. If not given, all tables in the current context are
	 *   used. This can be given as a jQuery selector (for example `':gt(0)'`) to
	 *   select multiple tables or as an integer to select a single table.
	 * @returns {DataTable.Api} Returns a new API instance if a selector is given.
	 */
	_api_register( 'tables()', function ( selector ) {
		// A new instance is created if there was a selector specified
		return selector ?
			new _Api( __table_selector( selector, this.context ) ) :
			this;
	} );
	
	
	_api_register( 'table()', function ( selector ) {
		var tables = this.tables( selector );
		var ctx = tables.context;
	
		// Truncate to the first matched table
		return ctx.length ?
			new _Api( ctx[0] ) :
			tables;
	} );
	
	
	_api_registerPlural( 'tables().nodes()', 'table().node()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTable;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().body()', 'table().body()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTBody;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().header()', 'table().header()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTHead;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().footer()', 'table().footer()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTFoot;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().containers()', 'table().container()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTableWrapper;
		}, 1 );
	} );
	
	
	
	/**
	 * Redraw the tables in the current context.
	 */
	_api_register( 'draw()', function ( paging ) {
		return this.iterator( 'table', function ( settings ) {
			if ( paging === 'page' ) {
				_fnDraw( settings );
			}
			else {
				if ( typeof paging === 'string' ) {
					paging = paging === 'full-hold' ?
						false :
						true;
				}
	
				_fnReDraw( settings, paging===false );
			}
		} );
	} );
	
	
	
	/**
	 * Get the current page index.
	 *
	 * @return {integer} Current page index (zero based)
	 *//**
	 * Set the current page.
	 *
	 * Note that if you attempt to show a page which does not exist, DataTables will
	 * not throw an error, but rather reset the paging.
	 *
	 * @param {integer|string} action The paging action to take. This can be one of:
	 *  * `integer` - The page index to jump to
	 *  * `string` - An action to take:
	 *    * `first` - Jump to first page.
	 *    * `next` - Jump to the next page
	 *    * `previous` - Jump to previous page
	 *    * `last` - Jump to the last page.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page()', function ( action ) {
		if ( action === undefined ) {
			return this.page.info().page; // not an expensive call
		}
	
		// else, have an action to take on all tables
		return this.iterator( 'table', function ( settings ) {
			_fnPageChange( settings, action );
		} );
	} );
	
	
	/**
	 * Paging information for the first table in the current context.
	 *
	 * If you require paging information for another table, use the `table()` method
	 * with a suitable selector.
	 *
	 * @return {object} Object with the following properties set:
	 *  * `page` - Current page index (zero based - i.e. the first page is `0`)
	 *  * `pages` - Total number of pages
	 *  * `start` - Display index for the first record shown on the current page
	 *  * `end` - Display index for the last record shown on the current page
	 *  * `length` - Display length (number of records). Note that generally `start
	 *    + length = end`, but this is not always true, for example if there are
	 *    only 2 records to show on the final page, with a length of 10.
	 *  * `recordsTotal` - Full data set length
	 *  * `recordsDisplay` - Data set length once the current filtering criterion
	 *    are applied.
	 */
	_api_register( 'page.info()', function ( action ) {
		if ( this.context.length === 0 ) {
			return undefined;
		}
	
		var
			settings   = this.context[0],
			start      = settings._iDisplayStart,
			len        = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1,
			visRecords = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return {
			"page":           all ? 0 : Math.floor( start / len ),
			"pages":          all ? 1 : Math.ceil( visRecords / len ),
			"start":          start,
			"end":            settings.fnDisplayEnd(),
			"length":         len,
			"recordsTotal":   settings.fnRecordsTotal(),
			"recordsDisplay": visRecords,
			"serverSide":     _fnDataSource( settings ) === 'ssp'
		};
	} );
	
	
	/**
	 * Get the current page length.
	 *
	 * @return {integer} Current page length. Note `-1` indicates that all records
	 *   are to be shown.
	 *//**
	 * Set the current page length.
	 *
	 * @param {integer} Page length to set. Use `-1` to show all records.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page.len()', function ( len ) {
		// Note that we can't call this function 'length()' because `length`
		// is a Javascript property of functions which defines how many arguments
		// the function expects.
		if ( len === undefined ) {
			return this.context.length !== 0 ?
				this.context[0]._iDisplayLength :
				undefined;
		}
	
		// else, set the page length
		return this.iterator( 'table', function ( settings ) {
			_fnLengthChange( settings, len );
		} );
	} );
	
	
	
	var __reload = function ( settings, holdPosition, callback ) {
		// Use the draw event to trigger a callback
		if ( callback ) {
			var api = new _Api( settings );
	
			api.one( 'draw', function () {
				callback( api.ajax.json() );
			} );
		}
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			_fnReDraw( settings, holdPosition );
		}
		else {
			_fnProcessingDisplay( settings, true );
	
			// Cancel an existing request
			var xhr = settings.jqXHR;
			if ( xhr && xhr.readyState !== 4 ) {
				xhr.abort();
			}
	
			// Trigger xhr
			_fnBuildAjax( settings, [], function( json ) {
				_fnClearTable( settings );
	
				var data = _fnAjaxDataSrc( settings, json );
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					_fnAddData( settings, data[i] );
				}
	
				_fnReDraw( settings, holdPosition );
				_fnProcessingDisplay( settings, false );
			} );
		}
	};
	
	
	/**
	 * Get the JSON response from the last Ajax request that DataTables made to the
	 * server. Note that this returns the JSON from the first table in the current
	 * context.
	 *
	 * @return {object} JSON received from the server.
	 */
	_api_register( 'ajax.json()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].json;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Get the data submitted in the last Ajax request
	 */
	_api_register( 'ajax.params()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].oAjaxData;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Reload tables from the Ajax data source. Note that this function will
	 * automatically re-draw the table when the remote data has been loaded.
	 *
	 * @param {boolean} [reset=true] Reset (default) or hold the current paging
	 *   position. A full re-sort and re-filter is performed when this method is
	 *   called, which is why the pagination reset is the default action.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.reload()', function ( callback, resetPaging ) {
		return this.iterator( 'table', function (settings) {
			__reload( settings, resetPaging===false, callback );
		} );
	} );
	
	
	/**
	 * Get the current Ajax URL. Note that this returns the URL from the first
	 * table in the current context.
	 *
	 * @return {string} Current Ajax source URL
	 *//**
	 * Set the Ajax URL. Note that this will set the URL for all tables in the
	 * current context.
	 *
	 * @param {string} url URL to set.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url()', function ( url ) {
		var ctx = this.context;
	
		if ( url === undefined ) {
			// get
			if ( ctx.length === 0 ) {
				return undefined;
			}
			ctx = ctx[0];
	
			return ctx.ajax ?
				$.isPlainObject( ctx.ajax ) ?
					ctx.ajax.url :
					ctx.ajax :
				ctx.sAjaxSource;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( $.isPlainObject( settings.ajax ) ) {
				settings.ajax.url = url;
			}
			else {
				settings.ajax = url;
			}
			// No need to consider sAjaxSource here since DataTables gives priority
			// to `ajax` over `sAjaxSource`. So setting `ajax` here, renders any
			// value of `sAjaxSource` redundant.
		} );
	} );
	
	
	/**
	 * Load data from the newly set Ajax URL. Note that this method is only
	 * available when `ajax.url()` is used to set a URL. Additionally, this method
	 * has the same effect as calling `ajax.reload()` but is provided for
	 * convenience when setting a new URL. Like `ajax.reload()` it will
	 * automatically redraw the table once the remote data has been loaded.
	 *
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url().load()', function ( callback, resetPaging ) {
		// Same as a reload, but makes sense to present it for easy access after a
		// url change
		return this.iterator( 'table', function ( ctx ) {
			__reload( ctx, resetPaging===false, callback );
		} );
	} );
	
	
	
	
	var _selector_run = function ( type, selector, selectFn, settings, opts )
	{
		var
			out = [], res,
			a, i, ien, j, jen,
			selectorType = typeof selector;
	
		// Can't just check for isArray here, as an API or jQuery instance might be
		// given with their array like look
		if ( ! selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined ) {
			selector = [ selector ];
		}
	
		for ( i=0, ien=selector.length ; i<ien ; i++ ) {
			a = selector[i] && selector[i].split ?
				selector[i].split(',') :
				[ selector[i] ];
	
			for ( j=0, jen=a.length ; j<jen ; j++ ) {
				res = selectFn( typeof a[j] === 'string' ? $.trim(a[j]) : a[j] );
	
				if ( res && res.length ) {
					out = out.concat( res );
				}
			}
		}
	
		// selector extensions
		var ext = _ext.selector[ type ];
		if ( ext.length ) {
			for ( i=0, ien=ext.length ; i<ien ; i++ ) {
				out = ext[i]( settings, opts, out );
			}
		}
	
		return _unique( out );
	};
	
	
	var _selector_opts = function ( opts )
	{
		if ( ! opts ) {
			opts = {};
		}
	
		// Backwards compatibility for 1.9- which used the terminology filter rather
		// than search
		if ( opts.filter && opts.search === undefined ) {
			opts.search = opts.filter;
		}
	
		return $.extend( {
			search: 'none',
			order: 'current',
			page: 'all'
		}, opts );
	};
	
	
	var _selector_first = function ( inst )
	{
		// Reduce the API instance to the first item found
		for ( var i=0, ien=inst.length ; i<ien ; i++ ) {
			if ( inst[i].length > 0 ) {
				// Assign the first element to the first item in the instance
				// and truncate the instance and context
				inst[0] = inst[i];
				inst[0].length = 1;
				inst.length = 1;
				inst.context = [ inst.context[i] ];
	
				return inst;
			}
		}
	
		// Not found - return an empty instance
		inst.length = 0;
		return inst;
	};
	
	
	var _selector_row_indexes = function ( settings, opts )
	{
		var
			i, ien, tmp, a=[],
			displayFiltered = settings.aiDisplay,
			displayMaster = settings.aiDisplayMaster;
	
		var
			search = opts.search,  // none, applied, removed
			order  = opts.order,   // applied, current, index (original - compatibility with 1.9)
			page   = opts.page;    // all, current
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			// In server-side processing mode, most options are irrelevant since
			// rows not shown don't exist and the index order is the applied order
			// Removed is a special case - for consistency just return an empty
			// array
			return search === 'removed' ?
				[] :
				_range( 0, displayMaster.length );
		}
		else if ( page == 'current' ) {
			// Current page implies that order=current and fitler=applied, since it is
			// fairly senseless otherwise, regardless of what order and search actually
			// are
			for ( i=settings._iDisplayStart, ien=settings.fnDisplayEnd() ; i<ien ; i++ ) {
				a.push( displayFiltered[i] );
			}
		}
		else if ( order == 'current' || order == 'applied' ) {
			a = search == 'none' ?
				displayMaster.slice() :                      // no search
				search == 'applied' ?
					displayFiltered.slice() :                // applied search
					$.map( displayMaster, function (el, i) { // removed search
						return $.inArray( el, displayFiltered ) === -1 ? el : null;
					} );
		}
		else if ( order == 'index' || order == 'original' ) {
			for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				if ( search == 'none' ) {
					a.push( i );
				}
				else { // applied | removed
					tmp = $.inArray( i, displayFiltered );
	
					if ((tmp === -1 && search == 'removed') ||
						(tmp >= 0   && search == 'applied') )
					{
						a.push( i );
					}
				}
			}
		}
	
		return a;
	};
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Rows
	 *
	 * {}          - no selector - use all available rows
	 * {integer}   - row aoData index
	 * {node}      - TR node
	 * {string}    - jQuery selector to apply to the TR elements
	 * {array}     - jQuery array of nodes, or simply an array of TR nodes
	 *
	 */
	
	
	var __row_selector = function ( settings, selector, opts )
	{
		var run = function ( sel ) {
			var selInt = _intVal( sel );
			var i, ien;
	
			// Short cut - selector is a number and no options provided (default is
			// all records, so no need to check if the index is in there, since it
			// must be - dev error if the index doesn't exist).
			if ( selInt !== null && ! opts ) {
				return [ selInt ];
			}
	
			var rows = _selector_row_indexes( settings, opts );
	
			if ( selInt !== null && $.inArray( selInt, rows ) !== -1 ) {
				// Selector - integer
				return [ selInt ];
			}
			else if ( ! sel ) {
				// Selector - none
				return rows;
			}
	
			// Selector - function
			if ( typeof sel === 'function' ) {
				return $.map( rows, function (idx) {
					var row = settings.aoData[ idx ];
					return sel( idx, row._aData, row.nTr ) ? idx : null;
				} );
			}
	
			// Get nodes in the order from the `rows` array with null values removed
			var nodes = _removeEmpty(
				_pluck_order( settings.aoData, rows, 'nTr' )
			);
	
			// Selector - node
			if ( sel.nodeName ) {
				if ( sel._DT_RowIndex !== undefined ) {
					return [ sel._DT_RowIndex ]; // Property added by DT for fast lookup
				}
				else if ( sel._DT_CellIndex ) {
					return [ sel._DT_CellIndex.row ];
				}
				else {
					var host = $(sel).closest('*[data-dt-row]');
					return host.length ?
						[ host.data('dt-row') ] :
						[];
				}
			}
	
			// ID selector. Want to always be able to select rows by id, regardless
			// of if the tr element has been created or not, so can't rely upon
			// jQuery here - hence a custom implementation. This does not match
			// Sizzle's fast selector or HTML4 - in HTML5 the ID can be anything,
			// but to select it using a CSS selector engine (like Sizzle or
			// querySelect) it would need to need to be escaped for some characters.
			// DataTables simplifies this for row selectors since you can select
			// only a row. A # indicates an id any anything that follows is the id -
			// unescaped.
			if ( typeof sel === 'string' && sel.charAt(0) === '#' ) {
				// get row index from id
				var rowObj = settings.aIds[ sel.replace( /^#/, '' ) ];
				if ( rowObj !== undefined ) {
					return [ rowObj.idx ];
				}
	
				// need to fall through to jQuery in case there is DOM id that
				// matches
			}
	
			// Selector - jQuery selector string, array of nodes or jQuery object/
			// As jQuery's .filter() allows jQuery objects to be passed in filter,
			// it also allows arrays, so this will cope with all three options
			return $(nodes)
				.filter( sel )
				.map( function () {
					return this._DT_RowIndex;
				} )
				.toArray();
		};
	
		return _selector_run( 'row', selector, run, settings, opts );
	};
	
	
	_api_register( 'rows()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __row_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in __row_selector?
		inst.selector.rows = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_register( 'rows().nodes()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return settings.aoData[ row ].nTr || undefined;
		}, 1 );
	} );
	
	_api_register( 'rows().data()', function () {
		return this.iterator( true, 'rows', function ( settings, rows ) {
			return _pluck_order( settings.aoData, rows, '_aData' );
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().cache()', 'row().cache()', function ( type ) {
		return this.iterator( 'row', function ( settings, row ) {
			var r = settings.aoData[ row ];
			return type === 'search' ? r._aFilterData : r._aSortData;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().invalidate()', 'row().invalidate()', function ( src ) {
		return this.iterator( 'row', function ( settings, row ) {
			_fnInvalidate( settings, row, src );
		} );
	} );
	
	_api_registerPlural( 'rows().indexes()', 'row().index()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return row;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().ids()', 'row().id()', function ( hash ) {
		var a = [];
		var context = this.context;
	
		// `iterator` will drop undefined values, but in this case we want them
		for ( var i=0, ien=context.length ; i<ien ; i++ ) {
			for ( var j=0, jen=this[i].length ; j<jen ; j++ ) {
				var id = context[i].rowIdFn( context[i].aoData[ this[i][j] ]._aData );
				a.push( (hash === true ? '#' : '' )+ id );
			}
		}
	
		return new _Api( context, a );
	} );
	
	_api_registerPlural( 'rows().remove()', 'row().remove()', function () {
		var that = this;
	
		this.iterator( 'row', function ( settings, row, thatIdx ) {
			var data = settings.aoData;
			var rowData = data[ row ];
			var i, ien, j, jen;
			var loopRow, loopCells;
	
			data.splice( row, 1 );
	
			// Update the cached indexes
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				loopRow = data[i];
				loopCells = loopRow.anCells;
	
				// Rows
				if ( loopRow.nTr !== null ) {
					loopRow.nTr._DT_RowIndex = i;
				}
	
				// Cells
				if ( loopCells !== null ) {
					for ( j=0, jen=loopCells.length ; j<jen ; j++ ) {
						loopCells[j]._DT_CellIndex.row = i;
					}
				}
			}
	
			// Delete from the display arrays
			_fnDeleteIndex( settings.aiDisplayMaster, row );
			_fnDeleteIndex( settings.aiDisplay, row );
			_fnDeleteIndex( that[ thatIdx ], row, false ); // maintain local indexes
	
			// Check for an 'overflow' they case for displaying the table
			_fnLengthOverflow( settings );
	
			// Remove the row's ID reference if there is one
			var id = settings.rowIdFn( rowData._aData );
			if ( id !== undefined ) {
				delete settings.aIds[ id ];
			}
		} );
	
		this.iterator( 'table', function ( settings ) {
			for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				settings.aoData[i].idx = i;
			}
		} );
	
		return this;
	} );
	
	
	_api_register( 'rows.add()', function ( rows ) {
		var newRows = this.iterator( 'table', function ( settings ) {
				var row, i, ien;
				var out = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
						out.push( _fnAddTr( settings, row )[0] );
					}
					else {
						out.push( _fnAddData( settings, row ) );
					}
				}
	
				return out;
			}, 1 );
	
		// Return an Api.rows() extended instance, so rows().nodes() etc can be used
		var modRows = this.rows( -1 );
		modRows.pop();
		$.merge( modRows, newRows );
	
		return modRows;
	} );
	
	
	
	
	
	/**
	 *
	 */
	_api_register( 'row()', function ( selector, opts ) {
		return _selector_first( this.rows( selector, opts ) );
	} );
	
	
	_api_register( 'row().data()', function ( data ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// Get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._aData :
				undefined;
		}
	
		// Set
		ctx[0].aoData[ this[0] ]._aData = data;
	
		// Automatically invalidate
		_fnInvalidate( ctx[0], this[0], 'data' );
	
		return this;
	} );
	
	
	_api_register( 'row().node()', function () {
		var ctx = this.context;
	
		return ctx.length && this.length ?
			ctx[0].aoData[ this[0] ].nTr || null :
			null;
	} );
	
	
	_api_register( 'row.add()', function ( row ) {
		// Allow a jQuery object to be passed in - only a single row is added from
		// it though - the first element in the set
		if ( row instanceof $ && row.length ) {
			row = row[0];
		}
	
		var rows = this.iterator( 'table', function ( settings ) {
			if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
				return _fnAddTr( settings, row )[0];
			}
			return _fnAddData( settings, row );
		} );
	
		// Return an Api.rows() extended instance, with the newly added row selected
		return this.row( rows[0] );
	} );
	
	
	
	var __details_add = function ( ctx, row, data, klass )
	{
		// Convert to array of TR elements
		var rows = [];
		var addRow = function ( r, k ) {
			// Recursion to allow for arrays of jQuery objects
			if ( $.isArray( r ) || r instanceof $ ) {
				for ( var i=0, ien=r.length ; i<ien ; i++ ) {
					addRow( r[i], k );
				}
				return;
			}
	
			// If we get a TR element, then just add it directly - up to the dev
			// to add the correct number of columns etc
			if ( r.nodeName && r.nodeName.toLowerCase() === 'tr' ) {
				rows.push( r );
			}
			else {
				// Otherwise create a row with a wrapper
				var created = $('<tr><td/></tr>').addClass( k );
				$('td', created)
					.addClass( k )
					.html( r )
					[0].colSpan = _fnVisbleColumns( ctx );
	
				rows.push( created[0] );
			}
		};
	
		addRow( data, klass );
	
		if ( row._details ) {
			row._details.remove();
		}
	
		row._details = $(rows);
	
		// If the children were already shown, that state should be retained
		if ( row._detailsShow ) {
			row._details.insertAfter( row.nTr );
		}
	};
	
	
	var __details_remove = function ( api, idx )
	{
		var ctx = api.context;
	
		if ( ctx.length ) {
			var row = ctx[0].aoData[ idx !== undefined ? idx : api[0] ];
	
			if ( row && row._details ) {
				row._details.remove();
	
				row._detailsShow = undefined;
				row._details = undefined;
			}
		}
	};
	
	
	var __details_display = function ( api, show ) {
		var ctx = api.context;
	
		if ( ctx.length && api.length ) {
			var row = ctx[0].aoData[ api[0] ];
	
			if ( row._details ) {
				row._detailsShow = show;
	
				if ( show ) {
					row._details.insertAfter( row.nTr );
				}
				else {
					row._details.detach();
				}
	
				__details_events( ctx[0] );
			}
		}
	};
	
	
	var __details_events = function ( settings )
	{
		var api = new _Api( settings );
		var namespace = '.dt.DT_details';
		var drawEvent = 'draw'+namespace;
		var colvisEvent = 'column-visibility'+namespace;
		var destroyEvent = 'destroy'+namespace;
		var data = settings.aoData;
	
		api.off( drawEvent +' '+ colvisEvent +' '+ destroyEvent );
	
		if ( _pluck( data, '_details' ).length > 0 ) {
			// On each draw, insert the required elements into the document
			api.on( drawEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				api.rows( {page:'current'} ).eq(0).each( function (idx) {
					// Internal data grab
					var row = data[ idx ];
	
					if ( row._detailsShow ) {
						row._details.insertAfter( row.nTr );
					}
				} );
			} );
	
			// Column visibility change - update the colspan
			api.on( colvisEvent, function ( e, ctx, idx, vis ) {
				if ( settings !== ctx ) {
					return;
				}
	
				// Update the colspan for the details rows (note, only if it already has
				// a colspan)
				var row, visible = _fnVisbleColumns( ctx );
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					row = data[i];
	
					if ( row._details ) {
						row._details.children('td[colspan]').attr('colspan', visible );
					}
				}
			} );
	
			// Table destroyed - nuke any child rows
			api.on( destroyEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					if ( data[i]._details ) {
						__details_remove( api, i );
					}
				}
			} );
		}
	};
	
	// Strings for the method names to help minification
	var _emp = '';
	var _child_obj = _emp+'row().child';
	var _child_mth = _child_obj+'()';
	
	// data can be:
	//  tr
	//  string
	//  jQuery or array of any of the above
	_api_register( _child_mth, function ( data, klass ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._details :
				undefined;
		}
		else if ( data === true ) {
			// show
			this.child.show();
		}
		else if ( data === false ) {
			// remove
			__details_remove( this );
		}
		else if ( ctx.length && this.length ) {
			// set
			__details_add( ctx[0], ctx[0].aoData[ this[0] ], data, klass );
		}
	
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.show()',
		_child_mth+'.show()' // only when `child()` was called with parameters (without
	], function ( show ) {   // it returns an object and this method is not executed)
		__details_display( this, true );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.hide()',
		_child_mth+'.hide()' // only when `child()` was called with parameters (without
	], function () {         // it returns an object and this method is not executed)
		__details_display( this, false );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.remove()',
		_child_mth+'.remove()' // only when `child()` was called with parameters (without
	], function () {           // it returns an object and this method is not executed)
		__details_remove( this );
		return this;
	} );
	
	
	_api_register( _child_obj+'.isShown()', function () {
		var ctx = this.context;
	
		if ( ctx.length && this.length ) {
			// _detailsShown as false or undefined will fall through to return false
			return ctx[0].aoData[ this[0] ]._detailsShow || false;
		}
		return false;
	} );
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Columns
	 *
	 * {integer}           - column index (>=0 count from left, <0 count from right)
	 * "{integer}:visIdx"  - visible column index (i.e. translate to column index)  (>=0 count from left, <0 count from right)
	 * "{integer}:visible" - alias for {integer}:visIdx  (>=0 count from left, <0 count from right)
	 * "{string}:name"     - column name
	 * "{string}"          - jQuery selector on column header nodes
	 *
	 */
	
	// can be an array of these items, comma separated list, or an array of comma
	// separated lists
	
	var __re_column_selector = /^(.+):(name|visIdx|visible)$/;
	
	
	// r1 and r2 are redundant - but it means that the parameters match for the
	// iterator callback in columns().data()
	var __columnData = function ( settings, column, r1, r2, rows ) {
		var a = [];
		for ( var row=0, ien=rows.length ; row<ien ; row++ ) {
			a.push( _fnGetCellData( settings, rows[row], column ) );
		}
		return a;
	};
	
	
	var __column_selector = function ( settings, selector, opts )
	{
		var
			columns = settings.aoColumns,
			names = _pluck( columns, 'sName' ),
			nodes = _pluck( columns, 'nTh' );
	
		var run = function ( s ) {
			var selInt = _intVal( s );
	
			// Selector - all
			if ( s === '' ) {
				return _range( columns.length );
			}
	
			// Selector - index
			if ( selInt !== null ) {
				return [ selInt >= 0 ?
					selInt : // Count from left
					columns.length + selInt // Count from right (+ because its a negative value)
				];
			}
	
			// Selector = function
			if ( typeof s === 'function' ) {
				var rows = _selector_row_indexes( settings, opts );
	
				return $.map( columns, function (col, idx) {
					return s(
							idx,
							__columnData( settings, idx, 0, 0, rows ),
							nodes[ idx ]
						) ? idx : null;
				} );
			}
	
			// jQuery or string selector
			var match = typeof s === 'string' ?
				s.match( __re_column_selector ) :
				'';
	
			if ( match ) {
				switch( match[2] ) {
					case 'visIdx':
					case 'visible':
						var idx = parseInt( match[1], 10 );
						// Visible index given, convert to column index
						if ( idx < 0 ) {
							// Counting from the right
							var visColumns = $.map( columns, function (col,i) {
								return col.bVisible ? i : null;
							} );
							return [ visColumns[ visColumns.length + idx ] ];
						}
						// Counting from the left
						return [ _fnVisibleToColumnIndex( settings, idx ) ];
	
					case 'name':
						// match by name. `names` is column index complete and in order
						return $.map( names, function (name, i) {
							return name === match[1] ? i : null;
						} );
	
					default:
						return [];
				}
			}
	
			// Cell in the table body
			if ( s.nodeName && s._DT_CellIndex ) {
				return [ s._DT_CellIndex.column ];
			}
	
			// jQuery selector on the TH elements for the columns
			var jqResult = $( nodes )
				.filter( s )
				.map( function () {
					return $.inArray( this, nodes ); // `nodes` is column index complete and in order
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise a node which might have a `dt-column` data attribute, or be
			// a child or such an element
			var host = $(s).closest('*[data-dt-column]');
			return host.length ?
				[ host.data('dt-column') ] :
				[];
		};
	
		return _selector_run( 'column', selector, run, settings, opts );
	};
	
	
	var __setColumnVis = function ( settings, column, vis ) {
		var
			cols = settings.aoColumns,
			col  = cols[ column ],
			data = settings.aoData,
			row, cells, i, ien, tr;
	
		// Get
		if ( vis === undefined ) {
			return col.bVisible;
		}
	
		// Set
		// No change
		if ( col.bVisible === vis ) {
			return;
		}
	
		if ( vis ) {
			// Insert column
			// Need to decide if we should use appendChild or insertBefore
			var insertBefore = $.inArray( true, _pluck(cols, 'bVisible'), column+1 );
	
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				tr = data[i].nTr;
				cells = data[i].anCells;
	
				if ( tr ) {
					// insertBefore can act like appendChild if 2nd arg is null
					tr.insertBefore( cells[ column ], cells[ insertBefore ] || null );
				}
			}
		}
		else {
			// Remove column
			$( _pluck( settings.aoData, 'anCells', column ) ).detach();
		}
	
		// Common actions
		col.bVisible = vis;
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		_fnSaveState( settings );
	};
	
	
	_api_register( 'columns()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __column_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in _row_selector?
		inst.selector.cols = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_registerPlural( 'columns().header()', 'column().header()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTh;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().footer()', 'column().footer()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTf;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().data()', 'column().data()', function () {
		return this.iterator( 'column-rows', __columnData, 1 );
	} );
	
	_api_registerPlural( 'columns().dataSrc()', 'column().dataSrc()', function () {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].mData;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().cache()', 'column().cache()', function ( type ) {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows,
				type === 'search' ? '_aFilterData' : '_aSortData', column
			);
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().nodes()', 'column().nodes()', function () {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows, 'anCells', column ) ;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().visible()', 'column().visible()', function ( vis, calc ) {
		var ret = this.iterator( 'column', function ( settings, column ) {
			if ( vis === undefined ) {
				return settings.aoColumns[ column ].bVisible;
			} // else
			__setColumnVis( settings, column, vis );
		} );
	
		// Group the column visibility changes
		if ( vis !== undefined ) {
			// Second loop once the first is done for events
			this.iterator( 'column', function ( settings, column ) {
				_fnCallbackFire( settings, null, 'column-visibility', [settings, column, vis, calc] );
			} );
	
			if ( calc === undefined || calc ) {
				this.columns.adjust();
			}
		}
	
		return ret;
	} );
	
	_api_registerPlural( 'columns().indexes()', 'column().index()', function ( type ) {
		return this.iterator( 'column', function ( settings, column ) {
			return type === 'visible' ?
				_fnColumnIndexToVisible( settings, column ) :
				column;
		}, 1 );
	} );
	
	_api_register( 'columns.adjust()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnAdjustColumnSizing( settings );
		}, 1 );
	} );
	
	_api_register( 'column.index()', function ( type, idx ) {
		if ( this.context.length !== 0 ) {
			var ctx = this.context[0];
	
			if ( type === 'fromVisible' || type === 'toData' ) {
				return _fnVisibleToColumnIndex( ctx, idx );
			}
			else if ( type === 'fromData' || type === 'toVisible' ) {
				return _fnColumnIndexToVisible( ctx, idx );
			}
		}
	} );
	
	_api_register( 'column()', function ( selector, opts ) {
		return _selector_first( this.columns( selector, opts ) );
	} );
	
	
	
	var __cell_selector = function ( settings, selector, opts )
	{
		var data = settings.aoData;
		var rows = _selector_row_indexes( settings, opts );
		var cells = _removeEmpty( _pluck_order( data, rows, 'anCells' ) );
		var allCells = $( [].concat.apply([], cells) );
		var row;
		var columns = settings.aoColumns.length;
		var a, i, ien, j, o, host;
	
		var run = function ( s ) {
			var fnSelector = typeof s === 'function';
	
			if ( s === null || s === undefined || fnSelector ) {
				// All cells and function selectors
				a = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					for ( j=0 ; j<columns ; j++ ) {
						o = {
							row: row,
							column: j
						};
	
						if ( fnSelector ) {
							// Selector - function
							host = data[ row ];
	
							if ( s( o, _fnGetCellData(settings, row, j), host.anCells ? host.anCells[j] : null ) ) {
								a.push( o );
							}
						}
						else {
							// Selector - all
							a.push( o );
						}
					}
				}
	
				return a;
			}
			
			// Selector - index
			if ( $.isPlainObject( s ) ) {
				return [s];
			}
	
			// Selector - jQuery filtered cells
			var jqResult = allCells
				.filter( s )
				.map( function (i, el) {
					return { // use a new object, in case someone changes the values
						row:    el._DT_CellIndex.row,
						column: el._DT_CellIndex.column
	 				};
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise the selector is a node, and there is one last option - the
			// element might be a child of an element which has dt-row and dt-column
			// data attributes
			host = $(s).closest('*[data-dt-row]');
			return host.length ?
				[ {
					row: host.data('dt-row'),
					column: host.data('dt-column')
				} ] :
				[];
		};
	
		return _selector_run( 'cell', selector, run, settings, opts );
	};
	
	
	
	
	_api_register( 'cells()', function ( rowSelector, columnSelector, opts ) {
		// Argument shifting
		if ( $.isPlainObject( rowSelector ) ) {
			// Indexes
			if ( rowSelector.row === undefined ) {
				// Selector options in first parameter
				opts = rowSelector;
				rowSelector = null;
			}
			else {
				// Cell index objects in first parameter
				opts = columnSelector;
				columnSelector = null;
			}
		}
		if ( $.isPlainObject( columnSelector ) ) {
			opts = columnSelector;
			columnSelector = null;
		}
	
		// Cell selector
		if ( columnSelector === null || columnSelector === undefined ) {
			return this.iterator( 'table', function ( settings ) {
				return __cell_selector( settings, rowSelector, _selector_opts( opts ) );
			} );
		}
	
		// Row + column selector
		var columns = this.columns( columnSelector, opts );
		var rows = this.rows( rowSelector, opts );
		var a, i, ien, j, jen;
	
		var cells = this.iterator( 'table', function ( settings, idx ) {
			a = [];
	
			for ( i=0, ien=rows[idx].length ; i<ien ; i++ ) {
				for ( j=0, jen=columns[idx].length ; j<jen ; j++ ) {
					a.push( {
						row:    rows[idx][i],
						column: columns[idx][j]
					} );
				}
			}
	
			return a;
		}, 1 );
	
		$.extend( cells.selector, {
			cols: columnSelector,
			rows: rowSelector,
			opts: opts
		} );
	
		return cells;
	} );
	
	
	_api_registerPlural( 'cells().nodes()', 'cell().node()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			var data = settings.aoData[ row ];
	
			return data && data.anCells ?
				data.anCells[ column ] :
				undefined;
		}, 1 );
	} );
	
	
	_api_register( 'cells().data()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().cache()', 'cell().cache()', function ( type ) {
		type = type === 'search' ? '_aFilterData' : '_aSortData';
	
		return this.iterator( 'cell', function ( settings, row, column ) {
			return settings.aoData[ row ][ type ][ column ];
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().render()', 'cell().render()', function ( type ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column, type );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().indexes()', 'cell().index()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return {
				row: row,
				column: column,
				columnVisible: _fnColumnIndexToVisible( settings, column )
			};
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().invalidate()', 'cell().invalidate()', function ( src ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			_fnInvalidate( settings, row, src, column );
		} );
	} );
	
	
	
	_api_register( 'cell()', function ( rowSelector, columnSelector, opts ) {
		return _selector_first( this.cells( rowSelector, columnSelector, opts ) );
	} );
	
	
	_api_register( 'cell().data()', function ( data ) {
		var ctx = this.context;
		var cell = this[0];
	
		if ( data === undefined ) {
			// Get
			return ctx.length && cell.length ?
				_fnGetCellData( ctx[0], cell[0].row, cell[0].column ) :
				undefined;
		}
	
		// Set
		_fnSetCellData( ctx[0], cell[0].row, cell[0].column, data );
		_fnInvalidate( ctx[0], cell[0].row, 'data', cell[0].column );
	
		return this;
	} );
	
	
	
	/**
	 * Get current ordering (sorting) that has been applied to the table.
	 *
	 * @returns {array} 2D array containing the sorting information for the first
	 *   table in the current context. Each element in the parent array represents
	 *   a column being sorted upon (i.e. multi-sorting with two columns would have
	 *   2 inner arrays). The inner arrays may have 2 or 3 elements. The first is
	 *   the column index that the sorting condition applies to, the second is the
	 *   direction of the sort (`desc` or `asc`) and, optionally, the third is the
	 *   index of the sorting order from the `column.sorting` initialisation array.
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {integer} order Column index to sort upon.
	 * @param {string} direction Direction of the sort to be applied (`asc` or `desc`)
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 1D array of sorting information to be applied.
	 * @param {array} [...] Optional additional sorting conditions
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 2D array of sorting information to be applied.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order()', function ( order, dir ) {
		var ctx = this.context;
	
		if ( order === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].aaSorting :
				undefined;
		}
	
		// set
		if ( typeof order === 'number' ) {
			// Simple column / direction passed in
			order = [ [ order, dir ] ];
		}
		else if ( order.length && ! $.isArray( order[0] ) ) {
			// Arguments passed in (list of 1D arrays)
			order = Array.prototype.slice.call( arguments );
		}
		// otherwise a 2D array was passed in
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSorting = order.slice();
		} );
	} );
	
	
	/**
	 * Attach a sort listener to an element for a given column
	 *
	 * @param {node|jQuery|string} node Identifier for the element(s) to attach the
	 *   listener to. This can take the form of a single DOM node, a jQuery
	 *   collection of nodes or a jQuery selector which will identify the node(s).
	 * @param {integer} column the column that a click on this node will sort on
	 * @param {function} [callback] callback function when sort is run
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order.listener()', function ( node, column, callback ) {
		return this.iterator( 'table', function ( settings ) {
			_fnSortAttachListener( settings, node, column, callback );
		} );
	} );
	
	
	_api_register( 'order.fixed()', function ( set ) {
		if ( ! set ) {
			var ctx = this.context;
			var fixed = ctx.length ?
				ctx[0].aaSortingFixed :
				undefined;
	
			return $.isArray( fixed ) ?
				{ pre: fixed } :
				fixed;
		}
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSortingFixed = $.extend( true, {}, set );
		} );
	} );
	
	
	// Order by the selected column(s)
	_api_register( [
		'columns().order()',
		'column().order()'
	], function ( dir ) {
		var that = this;
	
		return this.iterator( 'table', function ( settings, i ) {
			var sort = [];
	
			$.each( that[i], function (j, col) {
				sort.push( [ col, dir ] );
			} );
	
			settings.aaSorting = sort;
		} );
	} );
	
	
	
	_api_register( 'search()', function ( input, regex, smart, caseInsen ) {
		var ctx = this.context;
	
		if ( input === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].oPreviousSearch.sSearch :
				undefined;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( ! settings.oFeatures.bFilter ) {
				return;
			}
	
			_fnFilterComplete( settings, $.extend( {}, settings.oPreviousSearch, {
				"sSearch": input+"",
				"bRegex":  regex === null ? false : regex,
				"bSmart":  smart === null ? true  : smart,
				"bCaseInsensitive": caseInsen === null ? true : caseInsen
			} ), 1 );
		} );
	} );
	
	
	_api_registerPlural(
		'columns().search()',
		'column().search()',
		function ( input, regex, smart, caseInsen ) {
			return this.iterator( 'column', function ( settings, column ) {
				var preSearch = settings.aoPreSearchCols;
	
				if ( input === undefined ) {
					// get
					return preSearch[ column ].sSearch;
				}
	
				// set
				if ( ! settings.oFeatures.bFilter ) {
					return;
				}
	
				$.extend( preSearch[ column ], {
					"sSearch": input+"",
					"bRegex":  regex === null ? false : regex,
					"bSmart":  smart === null ? true  : smart,
					"bCaseInsensitive": caseInsen === null ? true : caseInsen
				} );
	
				_fnFilterComplete( settings, settings.oPreviousSearch, 1 );
			} );
		}
	);
	
	/*
	 * State API methods
	 */
	
	_api_register( 'state()', function () {
		return this.context.length ?
			this.context[0].oSavedState :
			null;
	} );
	
	
	_api_register( 'state.clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			// Save an empty object
			settings.fnStateSaveCallback.call( settings.oInstance, settings, {} );
		} );
	} );
	
	
	_api_register( 'state.loaded()', function () {
		return this.context.length ?
			this.context[0].oLoadedState :
			null;
	} );
	
	
	_api_register( 'state.save()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnSaveState( settings );
		} );
	} );
	
	
	
	/**
	 * Provide a common method for plug-ins to check the version of DataTables being
	 * used, in order to ensure compatibility.
	 *
	 *  @param {string} version Version string to check for, in the format "X.Y.Z".
	 *    Note that the formats "X" and "X.Y" are also acceptable.
	 *  @returns {boolean} true if this version of DataTables is greater or equal to
	 *    the required version, or false if this version of DataTales is not
	 *    suitable
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    alert( $.fn.dataTable.versionCheck( '1.9.0' ) );
	 */
	DataTable.versionCheck = DataTable.fnVersionCheck = function( version )
	{
		var aThis = DataTable.version.split('.');
		var aThat = version.split('.');
		var iThis, iThat;
	
		for ( var i=0, iLen=aThat.length ; i<iLen ; i++ ) {
			iThis = parseInt( aThis[i], 10 ) || 0;
			iThat = parseInt( aThat[i], 10 ) || 0;
	
			// Parts are the same, keep comparing
			if (iThis === iThat) {
				continue;
			}
	
			// Parts are different, return immediately
			return iThis > iThat;
		}
	
		return true;
	};
	
	
	/**
	 * Check if a `<table>` node is a DataTable table already or not.
	 *
	 *  @param {node|jquery|string} table Table node, jQuery object or jQuery
	 *      selector for the table to test. Note that if more than more than one
	 *      table is passed on, only the first will be checked
	 *  @returns {boolean} true the table given is a DataTable, or false otherwise
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    if ( ! $.fn.DataTable.isDataTable( '#example' ) ) {
	 *      $('#example').dataTable();
	 *    }
	 */
	DataTable.isDataTable = DataTable.fnIsDataTable = function ( table )
	{
		var t = $(table).get(0);
		var is = false;
	
		$.each( DataTable.settings, function (i, o) {
			var head = o.nScrollHead ? $('table', o.nScrollHead)[0] : null;
			var foot = o.nScrollFoot ? $('table', o.nScrollFoot)[0] : null;
	
			if ( o.nTable === t || head === t || foot === t ) {
				is = true;
			}
		} );
	
		return is;
	};
	
	
	/**
	 * Get all DataTable tables that have been initialised - optionally you can
	 * select to get only currently visible tables.
	 *
	 *  @param {boolean} [visible=false] Flag to indicate if you want all (default)
	 *    or visible tables only.
	 *  @returns {array} Array of `table` nodes (not DataTable instances) which are
	 *    DataTables
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    $.each( $.fn.dataTable.tables(true), function () {
	 *      $(table).DataTable().columns.adjust();
	 *    } );
	 */
	DataTable.tables = DataTable.fnTables = function ( visible )
	{
		var api = false;
	
		if ( $.isPlainObject( visible ) ) {
			api = visible.api;
			visible = visible.visible;
		}
	
		var a = $.map( DataTable.settings, function (o) {
			if ( !visible || (visible && $(o.nTable).is(':visible')) ) {
				return o.nTable;
			}
		} );
	
		return api ?
			new _Api( a ) :
			a;
	};
	
	
	/**
	 * Convert from camel case parameters to Hungarian notation. This is made public
	 * for the extensions to provide the same ability as DataTables core to accept
	 * either the 1.9 style Hungarian notation, or the 1.10+ style camelCase
	 * parameters.
	 *
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 */
	DataTable.camelToHungarian = _fnCamelToHungarian;
	
	
	
	/**
	 *
	 */
	_api_register( '$()', function ( selector, opts ) {
		var
			rows   = this.rows( opts ).nodes(), // Get all rows
			jqRows = $(rows);
	
		return $( [].concat(
			jqRows.filter( selector ).toArray(),
			jqRows.find( selector ).toArray()
		) );
	} );
	
	
	// jQuery functions to operate on the tables
	$.each( [ 'on', 'one', 'off' ], function (i, key) {
		_api_register( key+'()', function ( /* event, handler */ ) {
			var args = Array.prototype.slice.call(arguments);
	
			// Add the `dt` namespace automatically if it isn't already present
			if ( ! args[0].match(/\.dt\b/) ) {
				args[0] += '.dt';
			}
	
			var inst = $( this.tables().nodes() );
			inst[key].apply( inst, args );
			return this;
		} );
	} );
	
	
	_api_register( 'clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnClearTable( settings );
		} );
	} );
	
	
	_api_register( 'settings()', function () {
		return new _Api( this.context, this.context );
	} );
	
	
	_api_register( 'init()', function () {
		var ctx = this.context;
		return ctx.length ? ctx[0].oInit : null;
	} );
	
	
	_api_register( 'data()', function () {
		return this.iterator( 'table', function ( settings ) {
			return _pluck( settings.aoData, '_aData' );
		} ).flatten();
	} );
	
	
	_api_register( 'destroy()', function ( remove ) {
		remove = remove || false;
	
		return this.iterator( 'table', function ( settings ) {
			var orig      = settings.nTableWrapper.parentNode;
			var classes   = settings.oClasses;
			var table     = settings.nTable;
			var tbody     = settings.nTBody;
			var thead     = settings.nTHead;
			var tfoot     = settings.nTFoot;
			var jqTable   = $(table);
			var jqTbody   = $(tbody);
			var jqWrapper = $(settings.nTableWrapper);
			var rows      = $.map( settings.aoData, function (r) { return r.nTr; } );
			var i, ien;
	
			// Flag to note that the table is currently being destroyed - no action
			// should be taken
			settings.bDestroying = true;
	
			// Fire off the destroy callbacks for plug-ins etc
			_fnCallbackFire( settings, "aoDestroyCallback", "destroy", [settings] );
	
			// If not being removed from the document, make all columns visible
			if ( ! remove ) {
				new _Api( settings ).columns().visible( true );
			}
	
			// Blitz all `DT` namespaced events (these are internal events, the
			// lowercase, `dt` events are user subscribed and they are responsible
			// for removing them
			jqWrapper.unbind('.DT').find(':not(tbody *)').unbind('.DT');
			$(window).unbind('.DT-'+settings.sInstance);
	
			// When scrolling we had to break the table up - restore it
			if ( table != thead.parentNode ) {
				jqTable.children('thead').detach();
				jqTable.append( thead );
			}
	
			if ( tfoot && table != tfoot.parentNode ) {
				jqTable.children('tfoot').detach();
				jqTable.append( tfoot );
			}
	
			settings.aaSorting = [];
			settings.aaSortingFixed = [];
			_fnSortingClasses( settings );
	
			$( rows ).removeClass( settings.asStripeClasses.join(' ') );
	
			$('th, td', thead).removeClass( classes.sSortable+' '+
				classes.sSortableAsc+' '+classes.sSortableDesc+' '+classes.sSortableNone
			);
	
			if ( settings.bJUI ) {
				$('th span.'+classes.sSortIcon+ ', td span.'+classes.sSortIcon, thead).detach();
				$('th, td', thead).each( function () {
					var wrapper = $('div.'+classes.sSortJUIWrapper, this);
					$(this).append( wrapper.contents() );
					wrapper.detach();
				} );
			}
	
			// Add the TR elements back into the table in their original order
			jqTbody.children().detach();
			jqTbody.append( rows );
	
			// Remove the DataTables generated nodes, events and classes
			var removedMethod = remove ? 'remove' : 'detach';
			jqTable[ removedMethod ]();
			jqWrapper[ removedMethod ]();
	
			// If we need to reattach the table to the document
			if ( ! remove && orig ) {
				// insertBefore acts like appendChild if !arg[1]
				orig.insertBefore( table, settings.nTableReinsertBefore );
	
				// Restore the width of the original table - was read from the style property,
				// so we can restore directly to that
				jqTable
					.css( 'width', settings.sDestroyWidth )
					.removeClass( classes.sTable );
	
				// If the were originally stripe classes - then we add them back here.
				// Note this is not fool proof (for example if not all rows had stripe
				// classes - but it's a good effort without getting carried away
				ien = settings.asDestroyStripes.length;
	
				if ( ien ) {
					jqTbody.children().each( function (i) {
						$(this).addClass( settings.asDestroyStripes[i % ien] );
					} );
				}
			}
	
			/* Remove the settings object from the settings array */
			var idx = $.inArray( settings, DataTable.settings );
			if ( idx !== -1 ) {
				DataTable.settings.splice( idx, 1 );
			}
		} );
	} );
	
	
	// Add the `every()` method for rows, columns and cells in a compact form
	$.each( [ 'column', 'row', 'cell' ], function ( i, type ) {
		_api_register( type+'s().every()', function ( fn ) {
			var opts = this.selector.opts;
			var api = this;
	
			return this.iterator( type, function ( settings, arg1, arg2, arg3, arg4 ) {
				// Rows and columns:
				//  arg1 - index
				//  arg2 - table counter
				//  arg3 - loop counter
				//  arg4 - undefined
				// Cells:
				//  arg1 - row index
				//  arg2 - column index
				//  arg3 - table counter
				//  arg4 - loop counter
				fn.call(
					api[ type ](
						arg1,
						type==='cell' ? arg2 : opts,
						type==='cell' ? opts : undefined
					),
					arg1, arg2, arg3, arg4
				);
			} );
		} );
	} );
	
	
	// i18n method for extensions to be able to use the language object from the
	// DataTable
	_api_register( 'i18n()', function ( token, def, plural ) {
		var ctx = this.context[0];
		var resolved = _fnGetObjectDataFn( token )( ctx.oLanguage );
	
		if ( resolved === undefined ) {
			resolved = def;
		}
	
		if ( plural !== undefined && $.isPlainObject( resolved ) ) {
			resolved = resolved[ plural ] !== undefined ?
				resolved[ plural ] :
				resolved._;
		}
	
		return resolved.replace( '%d', plural ); // nb: plural might be undefined,
	} );

	/**
	 * Version string for plug-ins to check compatibility. Allowed format is
	 * `a.b.c-d` where: a:int, b:int, c:int, d:string(dev|beta|alpha). `d` is used
	 * only for non-release builds. See http://semver.org/ for more information.
	 *  @member
	 *  @type string
	 *  @default Version number
	 */
	DataTable.version = "1.10.12";

	/**
	 * Private data store, containing all of the settings objects that are
	 * created for the tables on a given page.
	 *
	 * Note that the `DataTable.settings` object is aliased to
	 * `jQuery.fn.dataTableExt` through which it may be accessed and
	 * manipulated, or `jQuery.fn.dataTable.settings`.
	 *  @member
	 *  @type array
	 *  @default []
	 *  @private
	 */
	DataTable.settings = [];

	/**
	 * Object models container, for the various models that DataTables has
	 * available to it. These models define the objects that are used to hold
	 * the active state and configuration of the table.
	 *  @namespace
	 */
	DataTable.models = {};
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * search information for the global filter and individual column filters.
	 *  @namespace
	 */
	DataTable.models.oSearch = {
		/**
		 * Flag to indicate if the filtering should be case insensitive or not
		 *  @type boolean
		 *  @default true
		 */
		"bCaseInsensitive": true,
	
		/**
		 * Applied search term
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sSearch": "",
	
		/**
		 * Flag to indicate if the search term should be interpreted as a
		 * regular expression (true) or not (false) and therefore and special
		 * regex characters escaped.
		 *  @type boolean
		 *  @default false
		 */
		"bRegex": false,
	
		/**
		 * Flag to indicate if DataTables is to use its smart filtering or not.
		 *  @type boolean
		 *  @default true
		 */
		"bSmart": true
	};
	
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * each individual row. This is the object format used for the settings
	 * aoData array.
	 *  @namespace
	 */
	DataTable.models.oRow = {
		/**
		 * TR element for the row
		 *  @type node
		 *  @default null
		 */
		"nTr": null,
	
		/**
		 * Array of TD elements for each row. This is null until the row has been
		 * created.
		 *  @type array nodes
		 *  @default []
		 */
		"anCells": null,
	
		/**
		 * Data object from the original data source for the row. This is either
		 * an array if using the traditional form of DataTables, or an object if
		 * using mData options. The exact type will depend on the passed in
		 * data from the data source, or will be an array if using DOM a data
		 * source.
		 *  @type array|object
		 *  @default []
		 */
		"_aData": [],
	
		/**
		 * Sorting data cache - this array is ostensibly the same length as the
		 * number of columns (although each index is generated only as it is
		 * needed), and holds the data that is used for sorting each column in the
		 * row. We do this cache generation at the start of the sort in order that
		 * the formatting of the sort data need be done only once for each cell
		 * per sort. This array should not be read from or written to by anything
		 * other than the master sorting methods.
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aSortData": null,
	
		/**
		 * Per cell filtering data cache. As per the sort data cache, used to
		 * increase the performance of the filtering in DataTables
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aFilterData": null,
	
		/**
		 * Filtering data cache. This is the same as the cell filtering cache, but
		 * in this case a string rather than an array. This is easily computed with
		 * a join on `_aFilterData`, but is provided as a cache so the join isn't
		 * needed on every search (memory traded for performance)
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_sFilterRow": null,
	
		/**
		 * Cache of the class name that DataTables has applied to the row, so we
		 * can quickly look at this variable rather than needing to do a DOM check
		 * on className for the nTr property.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *  @private
		 */
		"_sRowStripe": "",
	
		/**
		 * Denote if the original data source was from the DOM, or the data source
		 * object. This is used for invalidating data, so DataTables can
		 * automatically read data from the original source, unless uninstructed
		 * otherwise.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"src": null,
	
		/**
		 * Index in the aoData array. This saves an indexOf lookup when we have the
		 * object, but want to know the index
		 *  @type integer
		 *  @default -1
		 *  @private
		 */
		"idx": -1
	};
	
	
	/**
	 * Template object for the column information object in DataTables. This object
	 * is held in the settings aoColumns array and contains all the information that
	 * DataTables needs about each individual column.
	 *
	 * Note that this object is related to {@link DataTable.defaults.column}
	 * but this one is the internal data store for DataTables's cache of columns.
	 * It should NOT be manipulated outside of DataTables. Any configuration should
	 * be done through the initialisation options.
	 *  @namespace
	 */
	DataTable.models.oColumn = {
		/**
		 * Column index. This could be worked out on-the-fly with $.inArray, but it
		 * is faster to just hold it as a variable
		 *  @type integer
		 *  @default null
		 */
		"idx": null,
	
		/**
		 * A list of the columns that sorting should occur on when this column
		 * is sorted. That this property is an array allows multi-column sorting
		 * to be defined for a column (for example first name / last name columns
		 * would benefit from this). The values are integers pointing to the
		 * columns to be sorted on (typically it will be a single integer pointing
		 * at itself, but that doesn't need to be the case).
		 *  @type array
		 */
		"aDataSort": null,
	
		/**
		 * Define the sorting directions that are applied to the column, in sequence
		 * as the column is repeatedly sorted upon - i.e. the first value is used
		 * as the sorting direction when the column if first sorted (clicked on).
		 * Sort it again (click again) and it will move on to the next index.
		 * Repeat until loop.
		 *  @type array
		 */
		"asSorting": null,
	
		/**
		 * Flag to indicate if the column is searchable, and thus should be included
		 * in the filtering or not.
		 *  @type boolean
		 */
		"bSearchable": null,
	
		/**
		 * Flag to indicate if the column is sortable or not.
		 *  @type boolean
		 */
		"bSortable": null,
	
		/**
		 * Flag to indicate if the column is currently visible in the table or not
		 *  @type boolean
		 */
		"bVisible": null,
	
		/**
		 * Store for manual type assignment using the `column.type` option. This
		 * is held in store so we can manipulate the column's `sType` property.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"_sManualType": null,
	
		/**
		 * Flag to indicate if HTML5 data attributes should be used as the data
		 * source for filtering or sorting. True is either are.
		 *  @type boolean
		 *  @default false
		 *  @private
		 */
		"_bAttrSrc": false,
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} nTd The TD node that has been created
		 *  @param {*} sData The Data for the cell
		 *  @param {array|object} oData The data for the whole row
		 *  @param {int} iRow The row index for the aoData data store
		 *  @default null
		 */
		"fnCreatedCell": null,
	
		/**
		 * Function to get data from a cell in a column. You should <b>never</b>
		 * access data directly through _aData internally in DataTables - always use
		 * the method attached to this property. It allows mData to function as
		 * required. This function is automatically assigned by the column
		 * initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {string} sSpecific The specific data type you want to get -
		 *    'display', 'type' 'filter' 'sort'
		 *  @returns {*} The data for the cell from the given row's data
		 *  @default null
		 */
		"fnGetData": null,
	
		/**
		 * Function to set data for a cell in the column. You should <b>never</b>
		 * set the data directly to _aData internally in DataTables - always use
		 * this method. It allows mData to function as required. This function
		 * is automatically assigned by the column initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {*} sValue Value to set
		 *  @default null
		 */
		"fnSetData": null,
	
		/**
		 * Property to read the value for the cells in the column from the data
		 * source array / object. If null, then the default content is used, if a
		 * function is given then the return from the function is used.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mData": null,
	
		/**
		 * Partner property to mData which is used (only when defined) to get
		 * the data - i.e. it is basically the same as mData, but without the
		 * 'set' option, and also the data fed to it is the result from mData.
		 * This is the rendering method to match the data method of mData.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mRender": null,
	
		/**
		 * Unique header TH/TD element for this column - this is what the sorting
		 * listener is attached to (if sorting is enabled.)
		 *  @type node
		 *  @default null
		 */
		"nTh": null,
	
		/**
		 * Unique footer TH/TD element for this column (if there is one). Not used
		 * in DataTables as such, but can be used for plug-ins to reference the
		 * footer for each column.
		 *  @type node
		 *  @default null
		 */
		"nTf": null,
	
		/**
		 * The class to apply to all TD elements in the table's TBODY for the column
		 *  @type string
		 *  @default null
		 */
		"sClass": null,
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 *  @type string
		 */
		"sContentPadding": null,
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because mData
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 */
		"sDefaultContent": null,
	
		/**
		 * Name for the column, allowing reference to the column by name as well as
		 * by index (needs a lookup to work by name).
		 *  @type string
		 */
		"sName": null,
	
		/**
		 * Custom sorting data type - defines which of the available plug-ins in
		 * afnSortData the custom sorting will use - if any is defined.
		 *  @type string
		 *  @default std
		 */
		"sSortDataType": 'std',
	
		/**
		 * Class to be applied to the header element when sorting on this column
		 *  @type string
		 *  @default null
		 */
		"sSortingClass": null,
	
		/**
		 * Class to be applied to the header element when sorting on this column -
		 * when jQuery UI theming is used.
		 *  @type string
		 *  @default null
		 */
		"sSortingClassJUI": null,
	
		/**
		 * Title of the column - what is seen in the TH element (nTh).
		 *  @type string
		 */
		"sTitle": null,
	
		/**
		 * Column sorting and filtering type
		 *  @type string
		 *  @default null
		 */
		"sType": null,
	
		/**
		 * Width of the column
		 *  @type string
		 *  @default null
		 */
		"sWidth": null,
	
		/**
		 * Width of the column when it was first "encountered"
		 *  @type string
		 *  @default null
		 */
		"sWidthOrig": null
	};
	
	
	/*
	 * Developer note: The properties of the object below are given in Hungarian
	 * notation, that was used as the interface for DataTables prior to v1.10, however
	 * from v1.10 onwards the primary interface is camel case. In order to avoid
	 * breaking backwards compatibility utterly with this change, the Hungarian
	 * version is still, internally the primary interface, but is is not documented
	 * - hence the @name tags in each doc comment. This allows a Javascript function
	 * to create a map from Hungarian notation to camel case (going the other direction
	 * would require each property to be listed, which would at around 3K to the size
	 * of DataTables, while this method is about a 0.5K hit.
	 *
	 * Ultimately this does pave the way for Hungarian notation to be dropped
	 * completely, but that is a massive amount of work and will break current
	 * installs (therefore is on-hold until v2).
	 */
	
	/**
	 * Initialisation options that can be given to DataTables at initialisation
	 * time.
	 *  @namespace
	 */
	DataTable.defaults = {
		/**
		 * An array of data to use for the table, passed in at initialisation which
		 * will be used in preference to any data which is already in the DOM. This is
		 * particularly useful for constructing tables purely in Javascript, for
		 * example with a custom Ajax call.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.data
		 *
		 *  @example
		 *    // Using a 2D array data source
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          ['Trident', 'Internet Explorer 4.0', 'Win 95+', 4, 'X'],
		 *          ['Trident', 'Internet Explorer 5.0', 'Win 95+', 5, 'C'],
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine" },
		 *          { "title": "Browser" },
		 *          { "title": "Platform" },
		 *          { "title": "Version" },
		 *          { "title": "Grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using an array of objects as a data source (`data`)
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 4.0",
		 *            "platform": "Win 95+",
		 *            "version":  4,
		 *            "grade":    "X"
		 *          },
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 5.0",
		 *            "platform": "Win 95+",
		 *            "version":  5,
		 *            "grade":    "C"
		 *          }
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine",   "data": "engine" },
		 *          { "title": "Browser",  "data": "browser" },
		 *          { "title": "Platform", "data": "platform" },
		 *          { "title": "Version",  "data": "version" },
		 *          { "title": "Grade",    "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"aaData": null,
	
	
		/**
		 * If ordering is enabled, then DataTables will perform a first pass sort on
		 * initialisation. You can define which column(s) the sort is performed
		 * upon, and the sorting direction, with this variable. The `sorting` array
		 * should contain an array for each column to be sorted initially containing
		 * the column's index and a direction string ('asc' or 'desc').
		 *  @type array
		 *  @default [[0,'asc']]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.order
		 *
		 *  @example
		 *    // Sort by 3rd column first, and then 4th column
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": [[2,'asc'], [3,'desc']]
		 *      } );
		 *    } );
		 *
		 *    // No initial sorting
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": []
		 *      } );
		 *    } );
		 */
		"aaSorting": [[0,'asc']],
	
	
		/**
		 * This parameter is basically identical to the `sorting` parameter, but
		 * cannot be overridden by user interaction with the table. What this means
		 * is that you could have a column (visible or hidden) which the sorting
		 * will always be forced on first - any sorting after that (from the user)
		 * will then be performed as required. This can be useful for grouping rows
		 * together.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.orderFixed
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderFixed": [[0,'asc']]
		 *      } );
		 *    } )
		 */
		"aaSortingFixed": [],
	
	
		/**
		 * DataTables can be instructed to load data to display in the table from a
		 * Ajax source. This option defines how that Ajax call is made and where to.
		 *
		 * The `ajax` property has three different modes of operation, depending on
		 * how it is defined. These are:
		 *
		 * * `string` - Set the URL from where the data should be loaded from.
		 * * `object` - Define properties for `jQuery.ajax`.
		 * * `function` - Custom data get function
		 *
		 * `string`
		 * --------
		 *
		 * As a string, the `ajax` property simply defines the URL from which
		 * DataTables will load data.
		 *
		 * `object`
		 * --------
		 *
		 * As an object, the parameters in the object are passed to
		 * [jQuery.ajax](http://api.jquery.com/jQuery.ajax/) allowing fine control
		 * of the Ajax request. DataTables has a number of default parameters which
		 * you can override using this option. Please refer to the jQuery
		 * documentation for a full description of the options available, although
		 * the following parameters provide additional options in DataTables or
		 * require special consideration:
		 *
		 * * `data` - As with jQuery, `data` can be provided as an object, but it
		 *   can also be used as a function to manipulate the data DataTables sends
		 *   to the server. The function takes a single parameter, an object of
		 *   parameters with the values that DataTables has readied for sending. An
		 *   object may be returned which will be merged into the DataTables
		 *   defaults, or you can add the items to the object that was passed in and
		 *   not return anything from the function. This supersedes `fnServerParams`
		 *   from DataTables 1.9-.
		 *
		 * * `dataSrc` - By default DataTables will look for the property `data` (or
		 *   `aaData` for compatibility with DataTables 1.9-) when obtaining data
		 *   from an Ajax source or for server-side processing - this parameter
		 *   allows that property to be changed. You can use Javascript dotted
		 *   object notation to get a data source for multiple levels of nesting, or
		 *   it my be used as a function. As a function it takes a single parameter,
		 *   the JSON returned from the server, which can be manipulated as
		 *   required, with the returned value being that used by DataTables as the
		 *   data source for the table. This supersedes `sAjaxDataProp` from
		 *   DataTables 1.9-.
		 *
		 * * `success` - Should not be overridden it is used internally in
		 *   DataTables. To manipulate / transform the data returned by the server
		 *   use `ajax.dataSrc`, or use `ajax` as a function (see below).
		 *
		 * `function`
		 * ----------
		 *
		 * As a function, making the Ajax call is left up to yourself allowing
		 * complete control of the Ajax request. Indeed, if desired, a method other
		 * than Ajax could be used to obtain the required data, such as Web storage
		 * or an AIR database.
		 *
		 * The function is given four parameters and no return is required. The
		 * parameters are:
		 *
		 * 1. _object_ - Data to send to the server
		 * 2. _function_ - Callback function that must be executed when the required
		 *    data has been obtained. That data should be passed into the callback
		 *    as the only parameter
		 * 3. _object_ - DataTables settings object for the table
		 *
		 * Note that this supersedes `fnServerData` from DataTables 1.9-.
		 *
		 *  @type string|object|function
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.ajax
		 *  @since 1.10.0
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax.
		 *   // Note DataTables expects data in the form `{ data: [ ...data... ] }` by default).
		 *   $('#example').dataTable( {
		 *     "ajax": "data.json"
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to change
		 *   // `data` to `tableData` (i.e. `{ tableData: [ ...data... ] }`)
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": "tableData"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to read data
		 *   // from a plain array rather than an array in an object
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": ""
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Manipulate the data returned from the server - add a link to data
		 *   // (note this can, should, be done using `render` for the column - this
		 *   // is just a simple example of how the data can be manipulated).
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": function ( json ) {
		 *         for ( var i=0, ien=json.length ; i<ien ; i++ ) {
		 *           json[i][0] = '<a href="/message/'+json[i][0]+'>View message</a>';
		 *         }
		 *         return json;
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Add data to the request
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "data": function ( d ) {
		 *         return {
		 *           "extra_search": $('#extra').val()
		 *         };
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Send request as POST
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "type": "POST"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get the data from localStorage (could interface with a form for
		 *   // adding, editing and removing rows).
		 *   $('#example').dataTable( {
		 *     "ajax": function (data, callback, settings) {
		 *       callback(
		 *         JSON.parse( localStorage.getItem('dataTablesData') )
		 *       );
		 *     }
		 *   } );
		 */
		"ajax": null,
	
	
		/**
		 * This parameter allows you to readily specify the entries in the length drop
		 * down menu that DataTables shows when pagination is enabled. It can be
		 * either a 1D array of options which will be used for both the displayed
		 * option and the value, or a 2D array which will use the array in the first
		 * position as the value, and the array in the second position as the
		 * displayed options (useful for language strings such as 'All').
		 *
		 * Note that the `pageLength` property will be automatically set to the
		 * first value given in this array, unless `pageLength` is also provided.
		 *  @type array
		 *  @default [ 10, 25, 50, 100 ]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.lengthMenu
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
		 *      } );
		 *    } );
		 */
		"aLengthMenu": [ 10, 25, 50, 100 ],
	
	
		/**
		 * The `columns` option in the initialisation parameter allows you to define
		 * details about the way individual columns behave. For a full list of
		 * column options that can be set, please see
		 * {@link DataTable.defaults.column}. Note that if you use `columns` to
		 * define your columns, you must have an entry in the array for every single
		 * column that you have in your table (these can be null if you don't which
		 * to specify any options).
		 *  @member
		 *
		 *  @name DataTable.defaults.column
		 */
		"aoColumns": null,
	
		/**
		 * Very similar to `columns`, `columnDefs` allows you to target a specific
		 * column, multiple columns, or all columns, using the `targets` property of
		 * each object in the array. This allows great flexibility when creating
		 * tables, as the `columnDefs` arrays can be of any length, targeting the
		 * columns you specifically want. `columnDefs` may use any of the column
		 * options available: {@link DataTable.defaults.column}, but it _must_
		 * have `targets` defined in each object in the array. Values in the `targets`
		 * array may be:
		 *   <ul>
		 *     <li>a string - class name will be matched on the TH for the column</li>
		 *     <li>0 or a positive integer - column index counting from the left</li>
		 *     <li>a negative integer - column index counting from the right</li>
		 *     <li>the string "_all" - all columns (i.e. assign a default)</li>
		 *   </ul>
		 *  @member
		 *
		 *  @name DataTable.defaults.columnDefs
		 */
		"aoColumnDefs": null,
	
	
		/**
		 * Basically the same as `search`, this parameter defines the individual column
		 * filtering state at initialisation time. The array must be of the same size
		 * as the number of columns, and each element be an object with the parameters
		 * `search` and `escapeRegex` (the latter is optional). 'null' is also
		 * accepted and the default will be used.
		 *  @type array
		 *  @default []
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.searchCols
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchCols": [
		 *          null,
		 *          { "search": "My filter" },
		 *          null,
		 *          { "search": "^[0-9]", "escapeRegex": false }
		 *        ]
		 *      } );
		 *    } )
		 */
		"aoSearchCols": [],
	
	
		/**
		 * An array of CSS classes that should be applied to displayed rows. This
		 * array may be of any length, and DataTables will apply each class
		 * sequentially, looping when required.
		 *  @type array
		 *  @default null <i>Will take the values determined by the `oClasses.stripe*`
		 *    options</i>
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.stripeClasses
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stripeClasses": [ 'strip1', 'strip2', 'strip3' ]
		 *      } );
		 *    } )
		 */
		"asStripeClasses": null,
	
	
		/**
		 * Enable or disable automatic column width calculation. This can be disabled
		 * as an optimisation (it takes some time to calculate the widths) if the
		 * tables widths are passed in using `columns`.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.autoWidth
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "autoWidth": false
		 *      } );
		 *    } );
		 */
		"bAutoWidth": true,
	
	
		/**
		 * Deferred rendering can provide DataTables with a huge speed boost when you
		 * are using an Ajax or JS data source for the table. This option, when set to
		 * true, will cause DataTables to defer the creation of the table elements for
		 * each row until they are needed for a draw - saving a significant amount of
		 * time.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.deferRender
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajax": "sources/arrays.txt",
		 *        "deferRender": true
		 *      } );
		 *    } );
		 */
		"bDeferRender": false,
	
	
		/**
		 * Replace a DataTable which matches the given selector and replace it with
		 * one which has the properties of the new initialisation object passed. If no
		 * table matches the selector, then the new DataTable will be constructed as
		 * per normal.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.destroy
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "srollY": "200px",
		 *        "paginate": false
		 *      } );
		 *
		 *      // Some time later....
		 *      $('#example').dataTable( {
		 *        "filter": false,
		 *        "destroy": true
		 *      } );
		 *    } );
		 */
		"bDestroy": false,
	
	
		/**
		 * Enable or disable filtering of data. Filtering in DataTables is "smart" in
		 * that it allows the end user to input multiple words (space separated) and
		 * will match a row containing those words, even if not in the order that was
		 * specified (this allow matching across multiple columns). Note that if you
		 * wish to use filtering in DataTables this must remain 'true' - to remove the
		 * default filtering input box and retain filtering abilities, please use
		 * {@link DataTable.defaults.dom}.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.searching
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "searching": false
		 *      } );
		 *    } );
		 */
		"bFilter": true,
	
	
		/**
		 * Enable or disable the table information display. This shows information
		 * about the data that is currently visible on the page, including information
		 * about filtered data if that action is being performed.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.info
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "info": false
		 *      } );
		 *    } );
		 */
		"bInfo": true,
	
	
		/**
		 * Enable jQuery UI ThemeRoller support (required as ThemeRoller requires some
		 * slightly different and additional mark-up from what DataTables has
		 * traditionally used).
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.jQueryUI
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "jQueryUI": true
		 *      } );
		 *    } );
		 */
		"bJQueryUI": false,
	
	
		/**
		 * Allows the end user to select the size of a formatted page from a select
		 * menu (sizes are 10, 25, 50 and 100). Requires pagination (`paginate`).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.lengthChange
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "lengthChange": false
		 *      } );
		 *    } );
		 */
		"bLengthChange": true,
	
	
		/**
		 * Enable or disable pagination.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.paging
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "paging": false
		 *      } );
		 *    } );
		 */
		"bPaginate": true,
	
	
		/**
		 * Enable or disable the display of a 'processing' indicator when the table is
		 * being processed (e.g. a sort). This is particularly useful for tables with
		 * large amounts of data where it can take a noticeable amount of time to sort
		 * the entries.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.processing
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "processing": true
		 *      } );
		 *    } );
		 */
		"bProcessing": false,
	
	
		/**
		 * Retrieve the DataTables object for the given selector. Note that if the
		 * table has already been initialised, this parameter will cause DataTables
		 * to simply return the object that has already been set up - it will not take
		 * account of any changes you might have made to the initialisation object
		 * passed to DataTables (setting this parameter to true is an acknowledgement
		 * that you understand this). `destroy` can be used to reinitialise a table if
		 * you need.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.retrieve
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      initTable();
		 *      tableActions();
		 *    } );
		 *
		 *    function initTable ()
		 *    {
		 *      return $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false,
		 *        "retrieve": true
		 *      } );
		 *    }
		 *
		 *    function tableActions ()
		 *    {
		 *      var table = initTable();
		 *      // perform API operations with oTable
		 *    }
		 */
		"bRetrieve": false,
	
	
		/**
		 * When vertical (y) scrolling is enabled, DataTables will force the height of
		 * the table's viewport to the given height at all times (useful for layout).
		 * However, this can look odd when filtering data down to a small data set,
		 * and the footer is left "floating" further down. This parameter (when
		 * enabled) will cause DataTables to collapse the table's viewport down when
		 * the result set will fit within the given Y height.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollCollapse
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200",
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"bScrollCollapse": false,
	
	
		/**
		 * Configure DataTables to use server-side processing. Note that the
		 * `ajax` parameter must also be given in order to give DataTables a
		 * source to obtain the required data for each draw.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverSide
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "xhr.php"
		 *      } );
		 *    } );
		 */
		"bServerSide": false,
	
	
		/**
		 * Enable or disable sorting of columns. Sorting of individual columns can be
		 * disabled by the `sortable` option for each column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.ordering
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "ordering": false
		 *      } );
		 *    } );
		 */
		"bSort": true,
	
	
		/**
		 * Enable or display DataTables' ability to sort multiple columns at the
		 * same time (activated by shift-click by the user).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderMulti
		 *
		 *  @example
		 *    // Disable multiple column sorting ability
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderMulti": false
		 *      } );
		 *    } );
		 */
		"bSortMulti": true,
	
	
		/**
		 * Allows control over whether DataTables should use the top (true) unique
		 * cell that is found for a single column, or the bottom (false - default).
		 * This is useful when using complex headers.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderCellsTop
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderCellsTop": true
		 *      } );
		 *    } );
		 */
		"bSortCellsTop": false,
	
	
		/**
		 * Enable or disable the addition of the classes `sorting\_1`, `sorting\_2` and
		 * `sorting\_3` to the columns which are currently being sorted on. This is
		 * presented as a feature switch as it can increase processing time (while
		 * classes are removed and added) so for large data sets you might want to
		 * turn this off.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.orderClasses
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderClasses": false
		 *      } );
		 *    } );
		 */
		"bSortClasses": true,
	
	
		/**
		 * Enable or disable state saving. When enabled HTML5 `localStorage` will be
		 * used to save table display information such as pagination information,
		 * display length, filtering and sorting. As such when the end user reloads
		 * the page the display display will match what thy had previously set up.
		 *
		 * Due to the use of `localStorage` the default state saving is not supported
		 * in IE6 or 7. If state saving is required in those browsers, use
		 * `stateSaveCallback` to provide a storage solution such as cookies.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.stateSave
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "stateSave": true
		 *      } );
		 *    } );
		 */
		"bStateSave": false,
	
	
		/**
		 * This function is called when a TR element is created (and all TD child
		 * elements have been inserted), or registered if using a DOM source, allowing
		 * manipulation of the TR element (adding classes etc).
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} dataIndex The index of this row in the internal aoData array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.createdRow
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "createdRow": function( row, data, dataIndex ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" )
		 *          {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnCreatedRow": null,
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify any aspect you want about the created DOM.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.drawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "drawCallback": function( settings ) {
		 *          alert( 'DataTables has redrawn the table' );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnDrawCallback": null,
	
	
		/**
		 * Identical to fnHeaderCallback() but for the table footer this function
		 * allows you to modify the table footer on every 'draw' event.
		 *  @type function
		 *  @param {node} foot "TR" element for the footer
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.footerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "footerCallback": function( tfoot, data, start, end, display ) {
		 *          tfoot.getElementsByTagName('th')[0].innerHTML = "Starting index is "+start;
		 *        }
		 *      } );
		 *    } )
		 */
		"fnFooterCallback": null,
	
	
		/**
		 * When rendering large numbers in the information element for the table
		 * (i.e. "Showing 1 to 10 of 57 entries") DataTables will render large numbers
		 * to have a comma separator for the 'thousands' units (e.g. 1 million is
		 * rendered as "1,000,000") to help readability for the end user. This
		 * function will override the default method DataTables uses.
		 *  @type function
		 *  @member
		 *  @param {int} toFormat number to be formatted
		 *  @returns {string} formatted string for DataTables to show the number
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.formatNumber
		 *
		 *  @example
		 *    // Format a number using a single quote for the separator (note that
		 *    // this can also be done with the language.thousands option)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "formatNumber": function ( toFormat ) {
		 *          return toFormat.toString().replace(
		 *            /\B(?=(\d{3})+(?!\d))/g, "'"
		 *          );
		 *        };
		 *      } );
		 *    } );
		 */
		"fnFormatNumber": function ( toFormat ) {
			return toFormat.toString().replace(
				/\B(?=(\d{3})+(?!\d))/g,
				this.oLanguage.sThousands
			);
		},
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify the header row. This can be used to calculate and
		 * display useful information about the table.
		 *  @type function
		 *  @param {node} head "TR" element for the header
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.headerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "fheaderCallback": function( head, data, start, end, display ) {
		 *          head.getElementsByTagName('th')[0].innerHTML = "Displaying "+(end-start)+" records";
		 *        }
		 *      } );
		 *    } )
		 */
		"fnHeaderCallback": null,
	
	
		/**
		 * The information element can be used to convey information about the current
		 * state of the table. Although the internationalisation options presented by
		 * DataTables are quite capable of dealing with most customisations, there may
		 * be times where you wish to customise the string further. This callback
		 * allows you to do exactly that.
		 *  @type function
		 *  @param {object} oSettings DataTables settings object
		 *  @param {int} start Starting position in data for the draw
		 *  @param {int} end End position in data for the draw
		 *  @param {int} max Total number of rows in the table (regardless of
		 *    filtering)
		 *  @param {int} total Total number of rows in the data set, after filtering
		 *  @param {string} pre The string that DataTables has formatted using it's
		 *    own rules
		 *  @returns {string} The string to be displayed in the information element.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.infoCallback
		 *
		 *  @example
		 *    $('#example').dataTable( {
		 *      "infoCallback": function( settings, start, end, max, total, pre ) {
		 *        return start +" to "+ end;
		 *      }
		 *    } );
		 */
		"fnInfoCallback": null,
	
	
		/**
		 * Called when the table has been initialised. Normally DataTables will
		 * initialise sequentially and there will be no need for this function,
		 * however, this does not hold true when using external language information
		 * since that is obtained using an async XHR call.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} json The JSON object request from the server - only
		 *    present if client-side Ajax sourced data is used
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.initComplete
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "initComplete": function(settings, json) {
		 *          alert( 'DataTables has finished its initialisation.' );
		 *        }
		 *      } );
		 *    } )
		 */
		"fnInitComplete": null,
	
	
		/**
		 * Called at the very start of each table draw and can be used to cancel the
		 * draw by returning false, any other return (including undefined) results in
		 * the full draw occurring).
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @returns {boolean} False will cancel the draw, anything else (including no
		 *    return) will allow it to complete.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.preDrawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "preDrawCallback": function( settings ) {
		 *          if ( $('#test').val() == 1 ) {
		 *            return false;
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnPreDrawCallback": null,
	
	
		/**
		 * This function allows you to 'post process' each row after it have been
		 * generated for each table draw, but before it is rendered on screen. This
		 * function might be used for setting the row class name etc.
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} displayIndex The display index for the current table draw
		 *  @param {int} displayIndexFull The index of the data in the full list of
		 *    rows (after filtering)
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.rowCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "rowCallback": function( row, data, displayIndex, displayIndexFull ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" ) {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnRowCallback": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * This parameter allows you to override the default function which obtains
		 * the data from the server so something more suitable for your application.
		 * For example you could use POST data, or pull information from a Gears or
		 * AIR database.
		 *  @type function
		 *  @member
		 *  @param {string} source HTTP source to obtain the data from (`ajax`)
		 *  @param {array} data A key/value pair object containing the data to send
		 *    to the server
		 *  @param {function} callback to be called on completion of the data get
		 *    process that will draw the data on the page.
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverData
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerData": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 *  It is often useful to send extra data to the server when making an Ajax
		 * request - for example custom filtering information, and this callback
		 * function makes it trivial to send extra information to the server. The
		 * passed in parameter is the data set that has been constructed by
		 * DataTables, and you can add to this or modify it as you require.
		 *  @type function
		 *  @param {array} data Data array (array of objects which are name/value
		 *    pairs) that has been constructed by DataTables and will be sent to the
		 *    server. In the case of Ajax sourced data with server-side processing
		 *    this will be an empty array, for server-side processing there will be a
		 *    significant number of parameters!
		 *  @returns {undefined} Ensure that you modify the data array passed in,
		 *    as this is passed by reference.
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverParams
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerParams": null,
	
	
		/**
		 * Load the table state. With this function you can define from where, and how, the
		 * state of a table is loaded. By default DataTables will load from `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @return {object} The DataTables state object to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadCallback": function (settings) {
		 *          var o;
		 *
		 *          // Send an Ajax request to the server to get the data. Note that
		 *          // this is a synchronous request.
		 *          $.ajax( {
		 *            "url": "/state_load",
		 *            "async": false,
		 *            "dataType": "json",
		 *            "success": function (json) {
		 *              o = json;
		 *            }
		 *          } );
		 *
		 *          return o;
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadCallback": function ( settings ) {
			try {
				return JSON.parse(
					(settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem(
						'DataTables_'+settings.sInstance+'_'+location.pathname
					)
				);
			} catch (e) {}
		},
	
	
		/**
		 * Callback which allows modification of the saved state prior to loading that state.
		 * This callback is called when the table is loading state from the stored data, but
		 * prior to the settings object being modified by the saved state. Note that for
		 * plug-in authors, you should use the `stateLoadParams` event to load parameters for
		 * a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that is to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never loaded
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Disallow state loading by returning false
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          return false;
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadParams": null,
	
	
		/**
		 * Callback that is called when the state has been loaded from the state saving method
		 * and the DataTables settings object has been modified as a result of the loaded state.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that was loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoaded
		 *
		 *  @example
		 *    // Show an alert with the filtering value that was saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoaded": function (settings, data) {
		 *          alert( 'Saved filter was: '+data.oSearch.sSearch );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoaded": null,
	
	
		/**
		 * Save the table state. This function allows you to define where and how the state
		 * information for the table is stored By default DataTables will use `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveCallback": function (settings, data) {
		 *          // Send an Ajax request to the server with the state object
		 *          $.ajax( {
		 *            "url": "/state_save",
		 *            "data": data,
		 *            "dataType": "json",
		 *            "method": "POST"
		 *            "success": function () {}
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveCallback": function ( settings, data ) {
			try {
				(settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem(
					'DataTables_'+settings.sInstance+'_'+location.pathname,
					JSON.stringify( data )
				);
			} catch (e) {}
		},
	
	
		/**
		 * Callback which allows modification of the state to be saved. Called when the table
		 * has changed state a new state save is required. This method allows modification of
		 * the state saving object prior to actually doing the save, including addition or
		 * other state properties or modification. Note that for plug-in authors, you should
		 * use the `stateSaveParams` event to save parameters for a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveParams": null,
	
	
		/**
		 * Duration for which the saved state information is considered valid. After this period
		 * has elapsed the state will be returned to the default.
		 * Value is given in seconds.
		 *  @type int
		 *  @default 7200 <i>(2 hours)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.stateDuration
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateDuration": 60*60*24; // 1 day
		 *      } );
		 *    } )
		 */
		"iStateDuration": 7200,
	
	
		/**
		 * When enabled DataTables will not make a request to the server for the first
		 * page draw - rather it will use the data already on the page (no sorting etc
		 * will be applied to it), thus saving on an XHR at load time. `deferLoading`
		 * is used to indicate that deferred loading is required, but it is also used
		 * to tell DataTables how many records there are in the full table (allowing
		 * the information element and pagination to be displayed correctly). In the case
		 * where a filtering is applied to the table on initial load, this can be
		 * indicated by giving the parameter as an array, where the first element is
		 * the number of records available after filtering and the second element is the
		 * number of records without filtering (allowing the table information element
		 * to be shown correctly).
		 *  @type int | array
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.deferLoading
		 *
		 *  @example
		 *    // 57 records available in the table, no filtering applied
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": 57
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // 57 records after filtering, 100 without filtering (an initial filter applied)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": [ 57, 100 ],
		 *        "search": {
		 *          "search": "my_filter"
		 *        }
		 *      } );
		 *    } );
		 */
		"iDeferLoading": null,
	
	
		/**
		 * Number of rows to display on a single page when using pagination. If
		 * feature enabled (`lengthChange`) then the end user will be able to override
		 * this to a custom setting using a pop-up menu.
		 *  @type int
		 *  @default 10
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pageLength
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pageLength": 50
		 *      } );
		 *    } )
		 */
		"iDisplayLength": 10,
	
	
		/**
		 * Define the starting point for data display when using DataTables with
		 * pagination. Note that this parameter is the number of records, rather than
		 * the page number, so if you have 10 records per page and want to start on
		 * the third page, it should be "20".
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.displayStart
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "displayStart": 20
		 *      } );
		 *    } )
		 */
		"iDisplayStart": 0,
	
	
		/**
		 * By default DataTables allows keyboard navigation of the table (sorting, paging,
		 * and filtering) by adding a `tabindex` attribute to the required elements. This
		 * allows you to tab through the controls and press the enter key to activate them.
		 * The tabindex is default 0, meaning that the tab follows the flow of the document.
		 * You can overrule this using this parameter if you wish. Use a value of -1 to
		 * disable built-in keyboard navigation.
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.tabIndex
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "tabIndex": 1
		 *      } );
		 *    } );
		 */
		"iTabIndex": 0,
	
	
		/**
		 * Classes that DataTables assigns to the various components and features
		 * that it adds to the HTML table. This allows classes to be configured
		 * during initialisation in addition to through the static
		 * {@link DataTable.ext.oStdClasses} object).
		 *  @namespace
		 *  @name DataTable.defaults.classes
		 */
		"oClasses": {},
	
	
		/**
		 * All strings that DataTables uses in the user interface that it creates
		 * are defined in this object, allowing you to modified them individually or
		 * completely replace them all as required.
		 *  @namespace
		 *  @name DataTable.defaults.language
		 */
		"oLanguage": {
			/**
			 * Strings that are used for WAI-ARIA labels and controls only (these are not
			 * actually visible on the page, but will be read by screenreaders, and thus
			 * must be internationalised as well).
			 *  @namespace
			 *  @name DataTable.defaults.language.aria
			 */
			"oAria": {
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted ascending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortAscending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortAscending": " - click/return to sort ascending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortAscending": ": activate to sort column ascending",
	
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted descending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortDescending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortDescending": " - click/return to sort descending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortDescending": ": activate to sort column descending"
			},
	
			/**
			 * Pagination string used by DataTables for the built-in pagination
			 * control types.
			 *  @namespace
			 *  @name DataTable.defaults.language.paginate
			 */
			"oPaginate": {
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the first page.
				 *  @type string
				 *  @default First
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.first
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "first": "First page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sFirst": "First",
	
	
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the last page.
				 *  @type string
				 *  @default Last
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.last
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "last": "Last page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sLast": "Last",
	
	
				/**
				 * Text to use for the 'next' pagination button (to take the user to the
				 * next page).
				 *  @type string
				 *  @default Next
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.next
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "next": "Next page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sNext": "Next",
	
	
				/**
				 * Text to use for the 'previous' pagination button (to take the user to
				 * the previous page).
				 *  @type string
				 *  @default Previous
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.previous
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "previous": "Previous page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sPrevious": "Previous"
			},
	
			/**
			 * This string is shown in preference to `zeroRecords` when the table is
			 * empty of data (regardless of filtering). Note that this is an optional
			 * parameter - if it is not given, the value of `zeroRecords` will be used
			 * instead (either the default or given value).
			 *  @type string
			 *  @default No data available in table
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.emptyTable
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "emptyTable": "No data available in table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sEmptyTable": "No data available in table",
	
	
			/**
			 * This string gives information to the end user about the information
			 * that is current on display on the page. The following tokens can be
			 * used in the string and will be dynamically replaced as the table
			 * display updates. This tokens can be placed anywhere in the string, or
			 * removed as needed by the language requires:
			 *
			 * * `\_START\_` - Display index of the first record on the current page
			 * * `\_END\_` - Display index of the last record on the current page
			 * * `\_TOTAL\_` - Number of records in the table after filtering
			 * * `\_MAX\_` - Number of records in the table without filtering
			 * * `\_PAGE\_` - Current page number
			 * * `\_PAGES\_` - Total number of pages of data in the table
			 *
			 *  @type string
			 *  @default Showing _START_ to _END_ of _TOTAL_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.info
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "info": "Showing page _PAGE_ of _PAGES_"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
	
	
			/**
			 * Display information string for when the table is empty. Typically the
			 * format of this string should match `info`.
			 *  @type string
			 *  @default Showing 0 to 0 of 0 entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoEmpty
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoEmpty": "No entries to show"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoEmpty": "Showing 0 to 0 of 0 entries",
	
	
			/**
			 * When a user filters the information in a table, this string is appended
			 * to the information (`info`) to give an idea of how strong the filtering
			 * is. The variable _MAX_ is dynamically updated.
			 *  @type string
			 *  @default (filtered from _MAX_ total entries)
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoFiltered
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoFiltered": " - filtering from _MAX_ records"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoFiltered": "(filtered from _MAX_ total entries)",
	
	
			/**
			 * If can be useful to append extra information to the info string at times,
			 * and this variable does exactly that. This information will be appended to
			 * the `info` (`infoEmpty` and `infoFiltered` in whatever combination they are
			 * being used) at all times.
			 *  @type string
			 *  @default <i>Empty string</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoPostFix
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoPostFix": "All records shown are derived from real information."
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoPostFix": "",
	
	
			/**
			 * This decimal place operator is a little different from the other
			 * language options since DataTables doesn't output floating point
			 * numbers, so it won't ever use this for display of a number. Rather,
			 * what this parameter does is modify the sort methods of the table so
			 * that numbers which are in a format which has a character other than
			 * a period (`.`) as a decimal place will be sorted numerically.
			 *
			 * Note that numbers with different decimal places cannot be shown in
			 * the same table and still be sortable, the table must be consistent.
			 * However, multiple different tables on the page can use different
			 * decimal place characters.
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.decimal
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "decimal": ","
			 *          "thousands": "."
			 *        }
			 *      } );
			 *    } );
			 */
			"sDecimal": "",
	
	
			/**
			 * DataTables has a build in number formatter (`formatNumber`) which is
			 * used to format large numbers that are used in the table information.
			 * By default a comma is used, but this can be trivially changed to any
			 * character you wish with this parameter.
			 *  @type string
			 *  @default ,
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.thousands
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "thousands": "'"
			 *        }
			 *      } );
			 *    } );
			 */
			"sThousands": ",",
	
	
			/**
			 * Detail the action that will be taken when the drop down menu for the
			 * pagination length option is changed. The '_MENU_' variable is replaced
			 * with a default select list of 10, 25, 50 and 100, and can be replaced
			 * with a custom select box if required.
			 *  @type string
			 *  @default Show _MENU_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.lengthMenu
			 *
			 *  @example
			 *    // Language change only
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": "Display _MENU_ records"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Language and options change
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": 'Display <select>'+
			 *            '<option value="10">10</option>'+
			 *            '<option value="20">20</option>'+
			 *            '<option value="30">30</option>'+
			 *            '<option value="40">40</option>'+
			 *            '<option value="50">50</option>'+
			 *            '<option value="-1">All</option>'+
			 *            '</select> records'
			 *        }
			 *      } );
			 *    } );
			 */
			"sLengthMenu": "Show _MENU_ entries",
	
	
			/**
			 * When using Ajax sourced data and during the first draw when DataTables is
			 * gathering the data, this message is shown in an empty row in the table to
			 * indicate to the end user the the data is being loaded. Note that this
			 * parameter is not used when loading data by server-side processing, just
			 * Ajax sourced data with client-side processing.
			 *  @type string
			 *  @default Loading...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.loadingRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "loadingRecords": "Please wait - loading..."
			 *        }
			 *      } );
			 *    } );
			 */
			"sLoadingRecords": "Loading...",
	
	
			/**
			 * Text which is displayed when the table is processing a user action
			 * (usually a sort command or similar).
			 *  @type string
			 *  @default Processing...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.processing
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "processing": "DataTables is currently busy"
			 *        }
			 *      } );
			 *    } );
			 */
			"sProcessing": "Processing...",
	
	
			/**
			 * Details the actions that will be taken when the user types into the
			 * filtering input text box. The variable "_INPUT_", if used in the string,
			 * is replaced with the HTML text box for the filtering input allowing
			 * control over where it appears in the string. If "_INPUT_" is not given
			 * then the input box is appended to the string automatically.
			 *  @type string
			 *  @default Search:
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.search
			 *
			 *  @example
			 *    // Input text box will be appended at the end automatically
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Filter records:"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Specify where the filter should appear
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Apply filter _INPUT_ to table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sSearch": "Search:",
	
	
			/**
			 * Assign a `placeholder` attribute to the search `input` element
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.searchPlaceholder
			 */
			"sSearchPlaceholder": "",
	
	
			/**
			 * All of the language information can be stored in a file on the
			 * server-side, which DataTables will look up if this parameter is passed.
			 * It must store the URL of the language file, which is in a JSON format,
			 * and the object has the same properties as the oLanguage object in the
			 * initialiser object (i.e. the above parameters). Please refer to one of
			 * the example language files to see how this works in action.
			 *  @type string
			 *  @default <i>Empty string - i.e. disabled</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.url
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "url": "http://www.sprymedia.co.uk/dataTables/lang.txt"
			 *        }
			 *      } );
			 *    } );
			 */
			"sUrl": "",
	
	
			/**
			 * Text shown inside the table records when the is no information to be
			 * displayed after filtering. `emptyTable` is shown when there is simply no
			 * information in the table at all (regardless of filtering).
			 *  @type string
			 *  @default No matching records found
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.zeroRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "zeroRecords": "No records to display"
			 *        }
			 *      } );
			 *    } );
			 */
			"sZeroRecords": "No matching records found"
		},
	
	
		/**
		 * This parameter allows you to have define the global filtering state at
		 * initialisation time. As an object the `search` parameter must be
		 * defined, but all other parameters are optional. When `regex` is true,
		 * the search string will be treated as a regular expression, when false
		 * (default) it will be treated as a straight string. When `smart`
		 * DataTables will use it's smart filtering methods (to word match at
		 * any point in the data), when false this will not be done.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.search
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "search": {"search": "Initial search"}
		 *      } );
		 *    } )
		 */
		"oSearch": $.extend( {}, DataTable.models.oSearch ),
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * By default DataTables will look for the property `data` (or `aaData` for
		 * compatibility with DataTables 1.9-) when obtaining data from an Ajax
		 * source or for server-side processing - this parameter allows that
		 * property to be changed. You can use Javascript dotted object notation to
		 * get a data source for multiple levels of nesting.
		 *  @type string
		 *  @default data
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxDataProp
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxDataProp": "data",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * You can instruct DataTables to load data from an external
		 * source using this parameter (use aData if you want to pass data in you
		 * already have). Simply provide a url a JSON object can be obtained from.
		 *  @type string
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxSource
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxSource": null,
	
	
		/**
		 * This initialisation variable allows you to specify exactly where in the
		 * DOM you want DataTables to inject the various controls it adds to the page
		 * (for example you might want the pagination controls at the top of the
		 * table). DIV elements (with or without a custom class) can also be added to
		 * aid styling. The follow syntax is used:
		 *   <ul>
		 *     <li>The following options are allowed:
		 *       <ul>
		 *         <li>'l' - Length changing</li>
		 *         <li>'f' - Filtering input</li>
		 *         <li>'t' - The table!</li>
		 *         <li>'i' - Information</li>
		 *         <li>'p' - Pagination</li>
		 *         <li>'r' - pRocessing</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following constants are allowed:
		 *       <ul>
		 *         <li>'H' - jQueryUI theme "header" classes ('fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix')</li>
		 *         <li>'F' - jQueryUI theme "footer" classes ('fg-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix')</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following syntax is expected:
		 *       <ul>
		 *         <li>'&lt;' and '&gt;' - div elements</li>
		 *         <li>'&lt;"class" and '&gt;' - div with a class</li>
		 *         <li>'&lt;"#id" and '&gt;' - div with an ID</li>
		 *       </ul>
		 *     </li>
		 *     <li>Examples:
		 *       <ul>
		 *         <li>'&lt;"wrapper"flipt&gt;'</li>
		 *         <li>'&lt;lf&lt;t&gt;ip&gt;'</li>
		 *       </ul>
		 *     </li>
		 *   </ul>
		 *  @type string
		 *  @default lfrtip <i>(when `jQueryUI` is false)</i> <b>or</b>
		 *    <"H"lfr>t<"F"ip> <i>(when `jQueryUI` is true)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.dom
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "dom": '&lt;"top"i&gt;rt&lt;"bottom"flp&gt;&lt;"clear"&gt;'
		 *      } );
		 *    } );
		 */
		"sDom": "lfrtip",
	
	
		/**
		 * Search delay option. This will throttle full table searches that use the
		 * DataTables provided search input element (it does not effect calls to
		 * `dt-api search()`, providing a delay before the search is made.
		 *  @type integer
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.searchDelay
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchDelay": 200
		 *      } );
		 *    } )
		 */
		"searchDelay": null,
	
	
		/**
		 * DataTables features four different built-in options for the buttons to
		 * display for pagination control:
		 *
		 * * `simple` - 'Previous' and 'Next' buttons only
		 * * 'simple_numbers` - 'Previous' and 'Next' buttons, plus page numbers
		 * * `full` - 'First', 'Previous', 'Next' and 'Last' buttons
		 * * `full_numbers` - 'First', 'Previous', 'Next' and 'Last' buttons, plus
		 *   page numbers
		 *  
		 * Further methods can be added using {@link DataTable.ext.oPagination}.
		 *  @type string
		 *  @default simple_numbers
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pagingType
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pagingType": "full_numbers"
		 *      } );
		 *    } )
		 */
		"sPaginationType": "simple_numbers",
	
	
		/**
		 * Enable horizontal scrolling. When a table is too wide to fit into a
		 * certain layout, or you have a large number of columns in the table, you
		 * can enable x-scrolling to show the table in a viewport, which can be
		 * scrolled. This property can be `true` which will allow the table to
		 * scroll horizontally when needed, or any CSS unit, or a number (in which
		 * case it will be treated as a pixel measurement). Setting as simply `true`
		 * is recommended.
		 *  @type boolean|string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollX
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": true,
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"sScrollX": "",
	
	
		/**
		 * This property can be used to force a DataTable to use more width than it
		 * might otherwise do when x-scrolling is enabled. For example if you have a
		 * table which requires to be well spaced, this parameter is useful for
		 * "over-sizing" the table, and thus forcing scrolling. This property can by
		 * any CSS unit, or a number (in which case it will be treated as a pixel
		 * measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollXInner
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": "100%",
		 *        "scrollXInner": "110%"
		 *      } );
		 *    } );
		 */
		"sScrollXInner": "",
	
	
		/**
		 * Enable vertical scrolling. Vertical scrolling will constrain the DataTable
		 * to the given height, and enable scrolling for any data which overflows the
		 * current viewport. This can be used as an alternative to paging to display
		 * a lot of data in a small area (although paging and scrolling can both be
		 * enabled at the same time). This property can be any CSS unit, or a number
		 * (in which case it will be treated as a pixel measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollY
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false
		 *      } );
		 *    } );
		 */
		"sScrollY": "",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * Set the HTTP method that is used to make the Ajax call for server-side
		 * processing or Ajax sourced data.
		 *  @type string
		 *  @default GET
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverMethod
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sServerMethod": "GET",
	
	
		/**
		 * DataTables makes use of renderers when displaying HTML elements for
		 * a table. These renderers can be added or modified by plug-ins to
		 * generate suitable mark-up for a site. For example the Bootstrap
		 * integration plug-in for DataTables uses a paging button renderer to
		 * display pagination buttons in the mark-up required by Bootstrap.
		 *
		 * For further information about the renderers available see
		 * DataTable.ext.renderer
		 *  @type string|object
		 *  @default null
		 *
		 *  @name DataTable.defaults.renderer
		 *
		 */
		"renderer": null,
	
	
		/**
		 * Set the data property name that DataTables should use to get a row's id
		 * to set as the `id` property in the node.
		 *  @type string
		 *  @default DT_RowId
		 *
		 *  @name DataTable.defaults.rowId
		 */
		"rowId": "DT_RowId"
	};
	
	_fnHungarianMap( DataTable.defaults );
	
	
	
	/*
	 * Developer note - See note in model.defaults.js about the use of Hungarian
	 * notation and camel case.
	 */
	
	/**
	 * Column options that can be given to DataTables at initialisation time.
	 *  @namespace
	 */
	DataTable.defaults.column = {
		/**
		 * Define which column(s) an order will occur on for this column. This
		 * allows a column's ordering to take multiple columns into account when
		 * doing a sort or use the data from a different column. For example first
		 * name / last name columns make sense to do a multi-column sort over the
		 * two columns.
		 *  @type array|int
		 *  @default null <i>Takes the value of the column index automatically</i>
		 *
		 *  @name DataTable.defaults.column.orderData
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderData": [ 0, 1 ], "targets": [ 0 ] },
		 *          { "orderData": [ 1, 0 ], "targets": [ 1 ] },
		 *          { "orderData": 2, "targets": [ 2 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderData": [ 0, 1 ] },
		 *          { "orderData": [ 1, 0 ] },
		 *          { "orderData": 2 },
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"aDataSort": null,
		"iDataSort": -1,
	
	
		/**
		 * You can control the default ordering direction, and even alter the
		 * behaviour of the sort handler (i.e. only allow ascending ordering etc)
		 * using this parameter.
		 *  @type array
		 *  @default [ 'asc', 'desc' ]
		 *
		 *  @name DataTable.defaults.column.orderSequence
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderSequence": [ "asc" ], "targets": [ 1 ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ], "targets": [ 2 ] },
		 *          { "orderSequence": [ "desc" ], "targets": [ 3 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          { "orderSequence": [ "asc" ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ] },
		 *          { "orderSequence": [ "desc" ] },
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"asSorting": [ 'asc', 'desc' ],
	
	
		/**
		 * Enable or disable filtering on the data in this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.searchable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "searchable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "searchable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSearchable": true,
	
	
		/**
		 * Enable or disable ordering on this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.orderable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSortable": true,
	
	
		/**
		 * Enable or disable the display of this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.visible
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "visible": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "visible": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bVisible": true,
	
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} td The TD node that has been created
		 *  @param {*} cellData The Data for the cell
		 *  @param {array|object} rowData The data for the whole row
		 *  @param {int} row The row index for the aoData data store
		 *  @param {int} col The column index for aoColumns
		 *
		 *  @name DataTable.defaults.column.createdCell
		 *  @dtopt Columns
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [3],
		 *          "createdCell": function (td, cellData, rowData, row, col) {
		 *            if ( cellData == "1.7" ) {
		 *              $(td).css('color', 'blue')
		 *            }
		 *          }
		 *        } ]
		 *      });
		 *    } );
		 */
		"fnCreatedCell": null,
	
	
		/**
		 * This parameter has been replaced by `data` in DataTables to ensure naming
		 * consistency. `dataProp` can still be used, as there is backwards
		 * compatibility in DataTables for this option, but it is strongly
		 * recommended that you use `data` in preference to `dataProp`.
		 *  @name DataTable.defaults.column.dataProp
		 */
	
	
		/**
		 * This property can be used to read data from any data source property,
		 * including deeply nested objects / properties. `data` can be given in a
		 * number of different ways which effect its behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object. Note that
		 *      function notation is recommended for use in `render` rather than
		 *      `data` as it is much simpler to use as a renderer.
		 * * `null` - use the original data source for the row rather than plucking
		 *   data directly from it. This action has effects on two other
		 *   initialisation options:
		 *    * `defaultContent` - When null is given as the `data` option and
		 *      `defaultContent` is specified for the column, the value defined by
		 *      `defaultContent` will be used for the cell.
		 *    * `render` - When null is used for the `data` option and the `render`
		 *      option is specified for the column, the whole data source for the
		 *      row is used for the renderer.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * `{array|object}` The data source for the row
		 *      * `{string}` The type call data requested - this will be 'set' when
		 *        setting data or 'filter', 'display', 'type', 'sort' or undefined
		 *        when gathering data. Note that when `undefined` is given for the
		 *        type DataTables expects to get the raw data for the object back<
		 *      * `{*}` Data to set when the second parameter is 'set'.
		 *    * Return:
		 *      * The return value from the function is not required when 'set' is
		 *        the type of call, but otherwise the return is what will be used
		 *        for the data requested.
		 *
		 * Note that `data` is a getter and setter option. If you just require
		 * formatting of data for output, you will likely want to use `render` which
		 * is simply a getter and thus simpler to use.
		 *
		 * Note that prior to DataTables 1.9.2 `data` was called `mDataProp`. The
		 * name change reflects the flexibility of this property and is consistent
		 * with the naming of mRender. If 'mDataProp' is given, then it will still
		 * be used by DataTables, as it automatically maps the old name to the new
		 * if required.
		 *
		 *  @type string|int|function|null
		 *  @default null <i>Use automatically calculated column index</i>
		 *
		 *  @name DataTable.defaults.column.data
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Read table data from objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {value},
		 *    //      "version": {value},
		 *    //      "grade": {value}
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/objects.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform" },
		 *          { "data": "version" },
		 *          { "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Read information from deeply nested objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {
		 *    //         "inner": {value}
		 *    //      },
		 *    //      "details": [
		 *    //         {value}, {value}
		 *    //      ]
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform.inner" },
		 *          { "data": "platform.details.0" },
		 *          { "data": "platform.details.1" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `data` as a function to provide different information for
		 *    // sorting, filtering and display. In this case, currency (price)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": function ( source, type, val ) {
		 *            if (type === 'set') {
		 *              source.price = val;
		 *              // Store the computed dislay and filter values for efficiency
		 *              source.price_display = val=="" ? "" : "$"+numberFormat(val);
		 *              source.price_filter  = val=="" ? "" : "$"+numberFormat(val)+" "+val;
		 *              return;
		 *            }
		 *            else if (type === 'display') {
		 *              return source.price_display;
		 *            }
		 *            else if (type === 'filter') {
		 *              return source.price_filter;
		 *            }
		 *            // 'sort', 'type' and undefined all just use the integer
		 *            return source.price;
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using default content
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null,
		 *          "defaultContent": "Click to edit"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using array notation - outputting a list from an array
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "name[, ]"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 */
		"mData": null,
	
	
		/**
		 * This property is the rendering partner to `data` and it is suggested that
		 * when you want to manipulate data for display (including filtering,
		 * sorting etc) without altering the underlying data for the table, use this
		 * property. `render` can be considered to be the the read only companion to
		 * `data` which is read / write (then as such more complex). Like `data`
		 * this option can be given in a number of different ways to effect its
		 * behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object.
		 * * `object` - use different data for the different data types requested by
		 *   DataTables ('filter', 'display', 'type' or 'sort'). The property names
		 *   of the object is the data type the property refers to and the value can
		 *   defined using an integer, string or function using the same rules as
		 *   `render` normally does. Note that an `_` option _must_ be specified.
		 *   This is the default value to use if you haven't specified a value for
		 *   the data type requested by DataTables.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * {array|object} The data source for the row (based on `data`)
		 *      * {string} The type call data requested - this will be 'filter',
		 *        'display', 'type' or 'sort'.
		 *      * {array|object} The full data source for the row (not based on
		 *        `data`)
		 *    * Return:
		 *      * The return value from the function is what will be used for the
		 *        data requested.
		 *
		 *  @type string|int|function|object|null
		 *  @default null Use the data source value.
		 *
		 *  @name DataTable.defaults.column.render
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Create a comma separated list from an array of objects
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          {
		 *            "data": "platform",
		 *            "render": "[, ].name"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Execute a function to obtain data
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": "browserName()"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // As an object, extracting different data for the different types
		 *    // This would be used with a data source such as:
		 *    //   { "phone": 5552368, "phone_filter": "5552368 555-2368", "phone_display": "555-2368" }
		 *    // Here the `phone` integer is used for sorting and type detection, while `phone_filter`
		 *    // (which has both forms) is used for filtering for if a user inputs either format, while
		 *    // the formatted phone number is the one that is shown in the table.
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": {
		 *            "_": "phone",
		 *            "filter": "phone_filter",
		 *            "display": "phone_display"
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Use as a function to create a link from the data source
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "download_link",
		 *          "render": function ( data, type, full ) {
		 *            return '<a href="'+data+'">Download</a>';
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 */
		"mRender": null,
	
	
		/**
		 * Change the cell type created for the column - either TD cells or TH cells. This
		 * can be useful as TH cells have semantic meaning in the table body, allowing them
		 * to act as a header for a row (you may wish to add scope='row' to the TH elements).
		 *  @type string
		 *  @default td
		 *
		 *  @name DataTable.defaults.column.cellType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Make the first column use TH cells
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "cellType": "th"
		 *        } ]
		 *      } );
		 *    } );
		 */
		"sCellType": "td",
	
	
		/**
		 * Class to give to each cell in this column.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.class
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "class": "my_class", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "class": "my_class" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sClass": "",
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 * Generally you shouldn't need this!
		 *  @type string
		 *  @default <i>Empty string<i>
		 *
		 *  @name DataTable.defaults.column.contentPadding
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "contentPadding": "mmm"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sContentPadding": "",
	
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because `data`
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 *
		 *  @name DataTable.defaults.column.defaultContent
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit",
		 *            "targets": [ -1 ]
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sDefaultContent": null,
	
	
		/**
		 * This parameter is only used in DataTables' server-side processing. It can
		 * be exceptionally useful to know what columns are being displayed on the
		 * client side, and to map these to database fields. When defined, the names
		 * also allow DataTables to reorder information from the server if it comes
		 * back in an unexpected order (i.e. if you switch your columns around on the
		 * client-side, your server-side code does not also need updating).
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.name
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "name": "engine", "targets": [ 0 ] },
		 *          { "name": "browser", "targets": [ 1 ] },
		 *          { "name": "platform", "targets": [ 2 ] },
		 *          { "name": "version", "targets": [ 3 ] },
		 *          { "name": "grade", "targets": [ 4 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "name": "engine" },
		 *          { "name": "browser" },
		 *          { "name": "platform" },
		 *          { "name": "version" },
		 *          { "name": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sName": "",
	
	
		/**
		 * Defines a data source type for the ordering which can be used to read
		 * real-time information from the table (updating the internally cached
		 * version) prior to ordering. This allows ordering to occur on user
		 * editable elements such as form inputs.
		 *  @type string
		 *  @default std
		 *
		 *  @name DataTable.defaults.column.orderDataType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderDataType": "dom-text", "targets": [ 2, 3 ] },
		 *          { "type": "numeric", "targets": [ 3 ] },
		 *          { "orderDataType": "dom-select", "targets": [ 4 ] },
		 *          { "orderDataType": "dom-checkbox", "targets": [ 5 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          { "orderDataType": "dom-text" },
		 *          { "orderDataType": "dom-text", "type": "numeric" },
		 *          { "orderDataType": "dom-select" },
		 *          { "orderDataType": "dom-checkbox" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sSortDataType": "std",
	
	
		/**
		 * The title of this column.
		 *  @type string
		 *  @default null <i>Derived from the 'TH' value for this column in the
		 *    original HTML table.</i>
		 *
		 *  @name DataTable.defaults.column.title
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "title": "My column title", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "title": "My column title" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sTitle": null,
	
	
		/**
		 * The type allows you to specify how the data for this column will be
		 * ordered. Four types (string, numeric, date and html (which will strip
		 * HTML tags before ordering)) are currently available. Note that only date
		 * formats understood by Javascript's Date() object will be accepted as type
		 * date. For example: "Mar 26, 2008 5:03 PM". May take the values: 'string',
		 * 'numeric', 'date' or 'html' (by default). Further types can be adding
		 * through plug-ins.
		 *  @type string
		 *  @default null <i>Auto-detected from raw data</i>
		 *
		 *  @name DataTable.defaults.column.type
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "type": "html", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "type": "html" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sType": null,
	
	
		/**
		 * Defining the width of the column, this parameter may take any CSS value
		 * (3em, 20px etc). DataTables applies 'smart' widths to columns which have not
		 * been given a specific width through this interface ensuring that the table
		 * remains readable.
		 *  @type string
		 *  @default null <i>Automatic</i>
		 *
		 *  @name DataTable.defaults.column.width
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "width": "20%", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "width": "20%" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sWidth": null
	};
	
	_fnHungarianMap( DataTable.defaults.column );
	
	
	
	/**
	 * DataTables settings object - this holds all the information needed for a
	 * given table, including configuration, data and current application of the
	 * table options. DataTables does not have a single instance for each DataTable
	 * with the settings attached to that instance, but rather instances of the
	 * DataTable "class" are created on-the-fly as needed (typically by a
	 * $().dataTable() call) and the settings object is then applied to that
	 * instance.
	 *
	 * Note that this object is related to {@link DataTable.defaults} but this
	 * one is the internal data store for DataTables's cache of columns. It should
	 * NOT be manipulated outside of DataTables. Any configuration should be done
	 * through the initialisation options.
	 *  @namespace
	 *  @todo Really should attach the settings object to individual instances so we
	 *    don't need to create new instances on each $().dataTable() call (if the
	 *    table already exists). It would also save passing oSettings around and
	 *    into every single function. However, this is a very significant
	 *    architecture change for DataTables and will almost certainly break
	 *    backwards compatibility with older installations. This is something that
	 *    will be done in 2.0.
	 */
	DataTable.models.oSettings = {
		/**
		 * Primary features of DataTables and their enablement state.
		 *  @namespace
		 */
		"oFeatures": {
	
			/**
			 * Flag to say if DataTables should automatically try to calculate the
			 * optimum table and columns widths (true) or not (false).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bAutoWidth": null,
	
			/**
			 * Delay the creation of TR and TD elements until they are actually
			 * needed by a driven page draw. This can give a significant speed
			 * increase for Ajax source and Javascript source data, but makes no
			 * difference at all fro DOM and server-side processing tables.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bDeferRender": null,
	
			/**
			 * Enable filtering on the table or not. Note that if this is disabled
			 * then there is no filtering at all on the table, including fnFilter.
			 * To just remove the filtering input use sDom and remove the 'f' option.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bFilter": null,
	
			/**
			 * Table information element (the 'Showing x of y records' div) enable
			 * flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bInfo": null,
	
			/**
			 * Present a user control allowing the end user to change the page size
			 * when pagination is enabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bLengthChange": null,
	
			/**
			 * Pagination enabled or not. Note that if this is disabled then length
			 * changing must also be disabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bPaginate": null,
	
			/**
			 * Processing indicator enable flag whenever DataTables is enacting a
			 * user request - typically an Ajax request for server-side processing.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bProcessing": null,
	
			/**
			 * Server-side processing enabled flag - when enabled DataTables will
			 * get all data from the server for every draw - there is no filtering,
			 * sorting or paging done on the client-side.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bServerSide": null,
	
			/**
			 * Sorting enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSort": null,
	
			/**
			 * Multi-column sorting
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortMulti": null,
	
			/**
			 * Apply a class to the columns which are being sorted to provide a
			 * visual highlight or not. This can slow things down when enabled since
			 * there is a lot of DOM interaction.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortClasses": null,
	
			/**
			 * State saving enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bStateSave": null
		},
	
	
		/**
		 * Scrolling settings for a table.
		 *  @namespace
		 */
		"oScroll": {
			/**
			 * When the table is shorter in height than sScrollY, collapse the
			 * table container down to the height of the table (when true).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bCollapse": null,
	
			/**
			 * Width of the scrollbar for the web-browser's platform. Calculated
			 * during table initialisation.
			 *  @type int
			 *  @default 0
			 */
			"iBarWidth": 0,
	
			/**
			 * Viewport width for horizontal scrolling. Horizontal scrolling is
			 * disabled if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sX": null,
	
			/**
			 * Width to expand the table to when using x-scrolling. Typically you
			 * should not need to use this.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 *  @deprecated
			 */
			"sXInner": null,
	
			/**
			 * Viewport height for vertical scrolling. Vertical scrolling is disabled
			 * if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sY": null
		},
	
		/**
		 * Language information for the table.
		 *  @namespace
		 *  @extends DataTable.defaults.oLanguage
		 */
		"oLanguage": {
			/**
			 * Information callback function. See
			 * {@link DataTable.defaults.fnInfoCallback}
			 *  @type function
			 *  @default null
			 */
			"fnInfoCallback": null
		},
	
		/**
		 * Browser support parameters
		 *  @namespace
		 */
		"oBrowser": {
			/**
			 * Indicate if the browser incorrectly calculates width:100% inside a
			 * scrolling element (IE6/7)
			 *  @type boolean
			 *  @default false
			 */
			"bScrollOversize": false,
	
			/**
			 * Determine if the vertical scrollbar is on the right or left of the
			 * scrolling container - needed for rtl language layout, although not
			 * all browsers move the scrollbar (Safari).
			 *  @type boolean
			 *  @default false
			 */
			"bScrollbarLeft": false,
	
			/**
			 * Flag for if `getBoundingClientRect` is fully supported or not
			 *  @type boolean
			 *  @default false
			 */
			"bBounding": false,
	
			/**
			 * Browser scrollbar width
			 *  @type integer
			 *  @default 0
			 */
			"barWidth": 0
		},
	
	
		"ajax": null,
	
	
		/**
		 * Array referencing the nodes which are used for the features. The
		 * parameters of this object match what is allowed by sDom - i.e.
		 *   <ul>
		 *     <li>'l' - Length changing</li>
		 *     <li>'f' - Filtering input</li>
		 *     <li>'t' - The table!</li>
		 *     <li>'i' - Information</li>
		 *     <li>'p' - Pagination</li>
		 *     <li>'r' - pRocessing</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aanFeatures": [],
	
		/**
		 * Store data information - see {@link DataTable.models.oRow} for detailed
		 * information.
		 *  @type array
		 *  @default []
		 */
		"aoData": [],
	
		/**
		 * Array of indexes which are in the current display (after filtering etc)
		 *  @type array
		 *  @default []
		 */
		"aiDisplay": [],
	
		/**
		 * Array of indexes for display - no filtering
		 *  @type array
		 *  @default []
		 */
		"aiDisplayMaster": [],
	
		/**
		 * Map of row ids to data indexes
		 *  @type object
		 *  @default {}
		 */
		"aIds": {},
	
		/**
		 * Store information about each column that is in use
		 *  @type array
		 *  @default []
		 */
		"aoColumns": [],
	
		/**
		 * Store information about the table's header
		 *  @type array
		 *  @default []
		 */
		"aoHeader": [],
	
		/**
		 * Store information about the table's footer
		 *  @type array
		 *  @default []
		 */
		"aoFooter": [],
	
		/**
		 * Store the applied global search information in case we want to force a
		 * research or compare the old search to a new one.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 */
		"oPreviousSearch": {},
	
		/**
		 * Store the applied search for each column - see
		 * {@link DataTable.models.oSearch} for the format that is used for the
		 * filtering information for each column.
		 *  @type array
		 *  @default []
		 */
		"aoPreSearchCols": [],
	
		/**
		 * Sorting that is applied to the table. Note that the inner arrays are
		 * used in the following manner:
		 * <ul>
		 *   <li>Index 0 - column number</li>
		 *   <li>Index 1 - current sorting direction</li>
		 * </ul>
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @todo These inner arrays should really be objects
		 */
		"aaSorting": null,
	
		/**
		 * Sorting that is always applied to the table (i.e. prefixed in front of
		 * aaSorting).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aaSortingFixed": [],
	
		/**
		 * Classes to use for the striping of a table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"asStripeClasses": null,
	
		/**
		 * If restoring a table - we should restore its striping classes as well
		 *  @type array
		 *  @default []
		 */
		"asDestroyStripes": [],
	
		/**
		 * If restoring a table - we should restore its width
		 *  @type int
		 *  @default 0
		 */
		"sDestroyWidth": 0,
	
		/**
		 * Callback functions array for every time a row is inserted (i.e. on a draw).
		 *  @type array
		 *  @default []
		 */
		"aoRowCallback": [],
	
		/**
		 * Callback functions for the header on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoHeaderCallback": [],
	
		/**
		 * Callback function for the footer on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoFooterCallback": [],
	
		/**
		 * Array of callback functions for draw callback functions
		 *  @type array
		 *  @default []
		 */
		"aoDrawCallback": [],
	
		/**
		 * Array of callback functions for row created function
		 *  @type array
		 *  @default []
		 */
		"aoRowCreatedCallback": [],
	
		/**
		 * Callback functions for just before the table is redrawn. A return of
		 * false will be used to cancel the draw.
		 *  @type array
		 *  @default []
		 */
		"aoPreDrawCallback": [],
	
		/**
		 * Callback functions for when the table has been initialised.
		 *  @type array
		 *  @default []
		 */
		"aoInitComplete": [],
	
	
		/**
		 * Callbacks for modifying the settings to be stored for state saving, prior to
		 * saving state.
		 *  @type array
		 *  @default []
		 */
		"aoStateSaveParams": [],
	
		/**
		 * Callbacks for modifying the settings that have been stored for state saving
		 * prior to using the stored values to restore the state.
		 *  @type array
		 *  @default []
		 */
		"aoStateLoadParams": [],
	
		/**
		 * Callbacks for operating on the settings object once the saved state has been
		 * loaded
		 *  @type array
		 *  @default []
		 */
		"aoStateLoaded": [],
	
		/**
		 * Cache the table ID for quick access
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sTableId": "",
	
		/**
		 * The TABLE node for the main table
		 *  @type node
		 *  @default null
		 */
		"nTable": null,
	
		/**
		 * Permanent ref to the thead element
		 *  @type node
		 *  @default null
		 */
		"nTHead": null,
	
		/**
		 * Permanent ref to the tfoot element - if it exists
		 *  @type node
		 *  @default null
		 */
		"nTFoot": null,
	
		/**
		 * Permanent ref to the tbody element
		 *  @type node
		 *  @default null
		 */
		"nTBody": null,
	
		/**
		 * Cache the wrapper node (contains all DataTables controlled elements)
		 *  @type node
		 *  @default null
		 */
		"nTableWrapper": null,
	
		/**
		 * Indicate if when using server-side processing the loading of data
		 * should be deferred until the second draw.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 *  @default false
		 */
		"bDeferLoading": false,
	
		/**
		 * Indicate if all required information has been read in
		 *  @type boolean
		 *  @default false
		 */
		"bInitialised": false,
	
		/**
		 * Information about open rows. Each object in the array has the parameters
		 * 'nTr' and 'nParent'
		 *  @type array
		 *  @default []
		 */
		"aoOpenRows": [],
	
		/**
		 * Dictate the positioning of DataTables' control elements - see
		 * {@link DataTable.model.oInit.sDom}.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sDom": null,
	
		/**
		 * Search delay (in mS)
		 *  @type integer
		 *  @default null
		 */
		"searchDelay": null,
	
		/**
		 * Which type of pagination should be used.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default two_button
		 */
		"sPaginationType": "two_button",
	
		/**
		 * The state duration (for `stateSave`) in seconds.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type int
		 *  @default 0
		 */
		"iStateDuration": 0,
	
		/**
		 * Array of callback functions for state saving. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the JSON string to save that has been thus far created. Returns
		 *       a JSON string to be inserted into a json object
		 *       (i.e. '"param": [ 0, 1, 2]')</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateSave": [],
	
		/**
		 * Array of callback functions for state loading. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the object stored. May return false to cancel state loading</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateLoad": [],
	
		/**
		 * State that was saved. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oSavedState": null,
	
		/**
		 * State that was loaded. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oLoadedState": null,
	
		/**
		 * Source url for AJAX data for the table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sAjaxSource": null,
	
		/**
		 * Property from a given object from which to read the table data from. This
		 * can be an empty string (when not server-side processing), in which case
		 * it is  assumed an an array is given directly.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sAjaxDataProp": null,
	
		/**
		 * Note if draw should be blocked while getting data
		 *  @type boolean
		 *  @default true
		 */
		"bAjaxDataGet": true,
	
		/**
		 * The last jQuery XHR object that was used for server-side data gathering.
		 * This can be used for working with the XHR information in one of the
		 * callbacks
		 *  @type object
		 *  @default null
		 */
		"jqXHR": null,
	
		/**
		 * JSON returned from the server in the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"json": undefined,
	
		/**
		 * Data submitted as part of the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"oAjaxData": undefined,
	
		/**
		 * Function to get the server-side data.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnServerData": null,
	
		/**
		 * Functions which are called prior to sending an Ajax request so extra
		 * parameters can easily be sent to the server
		 *  @type array
		 *  @default []
		 */
		"aoServerParams": [],
	
		/**
		 * Send the XHR HTTP method - GET or POST (could be PUT or DELETE if
		 * required).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sServerMethod": null,
	
		/**
		 * Format numbers for display.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnFormatNumber": null,
	
		/**
		 * List of options that can be used for the user selectable length menu.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aLengthMenu": null,
	
		/**
		 * Counter for the draws that the table does. Also used as a tracker for
		 * server-side processing
		 *  @type int
		 *  @default 0
		 */
		"iDraw": 0,
	
		/**
		 * Indicate if a redraw is being done - useful for Ajax
		 *  @type boolean
		 *  @default false
		 */
		"bDrawing": false,
	
		/**
		 * Draw index (iDraw) of the last error when parsing the returned data
		 *  @type int
		 *  @default -1
		 */
		"iDrawError": -1,
	
		/**
		 * Paging display length
		 *  @type int
		 *  @default 10
		 */
		"_iDisplayLength": 10,
	
		/**
		 * Paging start point - aiDisplay index
		 *  @type int
		 *  @default 0
		 */
		"_iDisplayStart": 0,
	
		/**
		 * Server-side processing - number of records in the result set
		 * (i.e. before filtering), Use fnRecordsTotal rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type int
		 *  @default 0
		 *  @private
		 */
		"_iRecordsTotal": 0,
	
		/**
		 * Server-side processing - number of records in the current display set
		 * (i.e. after filtering). Use fnRecordsDisplay rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type boolean
		 *  @default 0
		 *  @private
		 */
		"_iRecordsDisplay": 0,
	
		/**
		 * Flag to indicate if jQuery UI marking and classes should be used.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bJUI": null,
	
		/**
		 * The classes to use for the table
		 *  @type object
		 *  @default {}
		 */
		"oClasses": {},
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if filtering has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bFiltered": false,
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if sorting has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bSorted": false,
	
		/**
		 * Indicate that if multiple rows are in the header and there is more than
		 * one unique cell per column, if the top one (true) or bottom one (false)
		 * should be used for sorting / title by DataTables.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bSortCellsTop": null,
	
		/**
		 * Initialisation object that is used for the table
		 *  @type object
		 *  @default null
		 */
		"oInit": null,
	
		/**
		 * Destroy callback functions - for plug-ins to attach themselves to the
		 * destroy so they can clean up markup and events.
		 *  @type array
		 *  @default []
		 */
		"aoDestroyCallback": [],
	
	
		/**
		 * Get the number of records in the current record set, before filtering
		 *  @type function
		 */
		"fnRecordsTotal": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsTotal * 1 :
				this.aiDisplayMaster.length;
		},
	
		/**
		 * Get the number of records in the current record set, after filtering
		 *  @type function
		 */
		"fnRecordsDisplay": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsDisplay * 1 :
				this.aiDisplay.length;
		},
	
		/**
		 * Get the display end point - aiDisplay index
		 *  @type function
		 */
		"fnDisplayEnd": function ()
		{
			var
				len      = this._iDisplayLength,
				start    = this._iDisplayStart,
				calc     = start + len,
				records  = this.aiDisplay.length,
				features = this.oFeatures,
				paginate = features.bPaginate;
	
			if ( features.bServerSide ) {
				return paginate === false || len === -1 ?
					start + records :
					Math.min( start+len, this._iRecordsDisplay );
			}
			else {
				return ! paginate || calc>records || len===-1 ?
					records :
					calc;
			}
		},
	
		/**
		 * The DataTables object for this table
		 *  @type object
		 *  @default null
		 */
		"oInstance": null,
	
		/**
		 * Unique identifier for each instance of the DataTables object. If there
		 * is an ID on the table node, then it takes that value, otherwise an
		 * incrementing internal counter is used.
		 *  @type string
		 *  @default null
		 */
		"sInstance": null,
	
		/**
		 * tabindex attribute value that is added to DataTables control elements, allowing
		 * keyboard navigation of the table and its controls.
		 */
		"iTabIndex": 0,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollHead": null,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollFoot": null,
	
		/**
		 * Last applied sort
		 *  @type array
		 *  @default []
		 */
		"aLastSort": [],
	
		/**
		 * Stored plug-in instances
		 *  @type object
		 *  @default {}
		 */
		"oPlugins": {},
	
		/**
		 * Function used to get a row's id from the row's data
		 *  @type function
		 *  @default null
		 */
		"rowIdFn": null,
	
		/**
		 * Data location where to store a row's id
		 *  @type string
		 *  @default null
		 */
		"rowId": null
	};

	/**
	 * Extension object for DataTables that is used to provide all extension
	 * options.
	 *
	 * Note that the `DataTable.ext` object is available through
	 * `jQuery.fn.dataTable.ext` where it may be accessed and manipulated. It is
	 * also aliased to `jQuery.fn.dataTableExt` for historic reasons.
	 *  @namespace
	 *  @extends DataTable.models.ext
	 */
	
	
	/**
	 * DataTables extensions
	 * 
	 * This namespace acts as a collection area for plug-ins that can be used to
	 * extend DataTables capabilities. Indeed many of the build in methods
	 * use this method to provide their own capabilities (sorting methods for
	 * example).
	 *
	 * Note that this namespace is aliased to `jQuery.fn.dataTableExt` for legacy
	 * reasons
	 *
	 *  @namespace
	 */
	DataTable.ext = _ext = {
		/**
		 * Buttons. For use with the Buttons extension for DataTables. This is
		 * defined here so other extensions can define buttons regardless of load
		 * order. It is _not_ used by DataTables core.
		 *
		 *  @type object
		 *  @default {}
		 */
		buttons: {},
	
	
		/**
		 * Element class names
		 *
		 *  @type object
		 *  @default {}
		 */
		classes: {},
	
	
		/**
		 * DataTables build type (expanded by the download builder)
		 *
		 *  @type string
		 */
		build:"bs/dt-1.10.12/af-2.1.2/b-1.2.1/e-1.5.6/fh-3.1.2/se-1.2.0",
	
	
		/**
		 * Error reporting.
		 * 
		 * How should DataTables report an error. Can take the value 'alert',
		 * 'throw', 'none' or a function.
		 *
		 *  @type string|function
		 *  @default alert
		 */
		errMode: "alert",
	
	
		/**
		 * Feature plug-ins.
		 * 
		 * This is an array of objects which describe the feature plug-ins that are
		 * available to DataTables. These feature plug-ins are then available for
		 * use through the `dom` initialisation option.
		 * 
		 * Each feature plug-in is described by an object which must have the
		 * following properties:
		 * 
		 * * `fnInit` - function that is used to initialise the plug-in,
		 * * `cFeature` - a character so the feature can be enabled by the `dom`
		 *   instillation option. This is case sensitive.
		 *
		 * The `fnInit` function has the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 *
		 * And the following return is expected:
		 * 
		 * * {node|null} The element which contains your feature. Note that the
		 *   return may also be void if your plug-in does not require to inject any
		 *   DOM elements into DataTables control (`dom`) - for example this might
		 *   be useful when developing a plug-in which allows table control via
		 *   keyboard entry
		 *
		 *  @type array
		 *
		 *  @example
		 *    $.fn.dataTable.ext.features.push( {
		 *      "fnInit": function( oSettings ) {
		 *        return new TableTools( { "oDTSettings": oSettings } );
		 *      },
		 *      "cFeature": "T"
		 *    } );
		 */
		feature: [],
	
	
		/**
		 * Row searching.
		 * 
		 * This method of searching is complimentary to the default type based
		 * searching, and a lot more comprehensive as it allows you complete control
		 * over the searching logic. Each element in this array is a function
		 * (parameters described below) that is called for every row in the table,
		 * and your logic decides if it should be included in the searching data set
		 * or not.
		 *
		 * Searching functions have the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{array|object}` Data for the row to be processed (same as the
		 *    original format that was passed in as the data source, or an array
		 *    from a DOM data source
		 * 3. `{int}` Row index ({@link DataTable.models.oSettings.aoData}), which
		 *    can be useful to retrieve the `TR` element if you need DOM interaction.
		 *
		 * And the following return is expected:
		 *
		 * * {boolean} Include the row in the searched result set (true) or not
		 *   (false)
		 *
		 * Note that as with the main search ability in DataTables, technically this
		 * is "filtering", since it is subtractive. However, for consistency in
		 * naming we call it searching here.
		 *
		 *  @type array
		 *  @default []
		 *
		 *  @example
		 *    // The following example shows custom search being applied to the
		 *    // fourth column (i.e. the data[3] index) based on two input values
		 *    // from the end-user, matching the data in a certain range.
		 *    $.fn.dataTable.ext.search.push(
		 *      function( settings, data, dataIndex ) {
		 *        var min = document.getElementById('min').value * 1;
		 *        var max = document.getElementById('max').value * 1;
		 *        var version = data[3] == "-" ? 0 : data[3]*1;
		 *
		 *        if ( min == "" && max == "" ) {
		 *          return true;
		 *        }
		 *        else if ( min == "" && version < max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && "" == max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && version < max ) {
		 *          return true;
		 *        }
		 *        return false;
		 *      }
		 *    );
		 */
		search: [],
	
	
		/**
		 * Selector extensions
		 *
		 * The `selector` option can be used to extend the options available for the
		 * selector modifier options (`selector-modifier` object data type) that
		 * each of the three built in selector types offer (row, column and cell +
		 * their plural counterparts). For example the Select extension uses this
		 * mechanism to provide an option to select only rows, columns and cells
		 * that have been marked as selected by the end user (`{selected: true}`),
		 * which can be used in conjunction with the existing built in selector
		 * options.
		 *
		 * Each property is an array to which functions can be pushed. The functions
		 * take three attributes:
		 *
		 * * Settings object for the host table
		 * * Options object (`selector-modifier` object type)
		 * * Array of selected item indexes
		 *
		 * The return is an array of the resulting item indexes after the custom
		 * selector has been applied.
		 *
		 *  @type object
		 */
		selector: {
			cell: [],
			column: [],
			row: []
		},
	
	
		/**
		 * Internal functions, exposed for used in plug-ins.
		 * 
		 * Please note that you should not need to use the internal methods for
		 * anything other than a plug-in (and even then, try to avoid if possible).
		 * The internal function may change between releases.
		 *
		 *  @type object
		 *  @default {}
		 */
		internal: {},
	
	
		/**
		 * Legacy configuration options. Enable and disable legacy options that
		 * are available in DataTables.
		 *
		 *  @type object
		 */
		legacy: {
			/**
			 * Enable / disable DataTables 1.9 compatible server-side processing
			 * requests
			 *
			 *  @type boolean
			 *  @default null
			 */
			ajax: null
		},
	
	
		/**
		 * Pagination plug-in methods.
		 * 
		 * Each entry in this object is a function and defines which buttons should
		 * be shown by the pagination rendering method that is used for the table:
		 * {@link DataTable.ext.renderer.pageButton}. The renderer addresses how the
		 * buttons are displayed in the document, while the functions here tell it
		 * what buttons to display. This is done by returning an array of button
		 * descriptions (what each button will do).
		 *
		 * Pagination types (the four built in options and any additional plug-in
		 * options defined here) can be used through the `paginationType`
		 * initialisation parameter.
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{int} page` The current page index
		 * 2. `{int} pages` The number of pages in the table
		 *
		 * Each function is expected to return an array where each element of the
		 * array can be one of:
		 *
		 * * `first` - Jump to first page when activated
		 * * `last` - Jump to last page when activated
		 * * `previous` - Show previous page when activated
		 * * `next` - Show next page when activated
		 * * `{int}` - Show page of the index given
		 * * `{array}` - A nested array containing the above elements to add a
		 *   containing 'DIV' element (might be useful for styling).
		 *
		 * Note that DataTables v1.9- used this object slightly differently whereby
		 * an object with two functions would be defined for each plug-in. That
		 * ability is still supported by DataTables 1.10+ to provide backwards
		 * compatibility, but this option of use is now decremented and no longer
		 * documented in DataTables 1.10+.
		 *
		 *  @type object
		 *  @default {}
		 *
		 *  @example
		 *    // Show previous, next and current page buttons only
		 *    $.fn.dataTableExt.oPagination.current = function ( page, pages ) {
		 *      return [ 'previous', page, 'next' ];
		 *    };
		 */
		pager: {},
	
	
		renderer: {
			pageButton: {},
			header: {}
		},
	
	
		/**
		 * Ordering plug-ins - custom data source
		 * 
		 * The extension options for ordering of data available here is complimentary
		 * to the default type based ordering that DataTables typically uses. It
		 * allows much greater control over the the data that is being used to
		 * order a column, but is necessarily therefore more complex.
		 * 
		 * This type of ordering is useful if you want to do ordering based on data
		 * live from the DOM (for example the contents of an 'input' element) rather
		 * than just the static string that DataTables knows of.
		 * 
		 * The way these plug-ins work is that you create an array of the values you
		 * wish to be ordering for the column in question and then return that
		 * array. The data in the array much be in the index order of the rows in
		 * the table (not the currently ordering order!). Which order data gathering
		 * function is run here depends on the `dt-init columns.orderDataType`
		 * parameter that is used for the column (if any).
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{int}` Target column index
		 *
		 * Each function is expected to return an array:
		 *
		 * * `{array}` Data for the column to be ordering upon
		 *
		 *  @type array
		 *
		 *  @example
		 *    // Ordering using `input` node values
		 *    $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
		 *    {
		 *      return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
		 *        return $('input', td).val();
		 *      } );
		 *    }
		 */
		order: {},
	
	
		/**
		 * Type based plug-ins.
		 *
		 * Each column in DataTables has a type assigned to it, either by automatic
		 * detection or by direct assignment using the `type` option for the column.
		 * The type of a column will effect how it is ordering and search (plug-ins
		 * can also make use of the column type if required).
		 *
		 * @namespace
		 */
		type: {
			/**
			 * Type detection functions.
			 *
			 * The functions defined in this object are used to automatically detect
			 * a column's type, making initialisation of DataTables super easy, even
			 * when complex data is in the table.
			 *
			 * The functions defined take two parameters:
			 *
		     *  1. `{*}` Data from the column cell to be analysed
		     *  2. `{settings}` DataTables settings object. This can be used to
		     *     perform context specific type detection - for example detection
		     *     based on language settings such as using a comma for a decimal
		     *     place. Generally speaking the options from the settings will not
		     *     be required
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Data type detected, or null if unknown (and thus
			 *   pass it on to the other type detection functions.
			 *
			 *  @type array
			 *
			 *  @example
			 *    // Currency type detection plug-in:
			 *    $.fn.dataTable.ext.type.detect.push(
			 *      function ( data, settings ) {
			 *        // Check the numeric part
			 *        if ( ! $.isNumeric( data.substring(1) ) ) {
			 *          return null;
			 *        }
			 *
			 *        // Check prefixed by currency
			 *        if ( data.charAt(0) == '$' || data.charAt(0) == '&pound;' ) {
			 *          return 'currency';
			 *        }
			 *        return null;
			 *      }
			 *    );
			 */
			detect: [],
	
	
			/**
			 * Type based search formatting.
			 *
			 * The type based searching functions can be used to pre-format the
			 * data to be search on. For example, it can be used to strip HTML
			 * tags or to de-format telephone numbers for numeric only searching.
			 *
			 * Note that is a search is not defined for a column of a given type,
			 * no search formatting will be performed.
			 * 
			 * Pre-processing of searching data plug-ins - When you assign the sType
			 * for a column (or have it automatically detected for you by DataTables
			 * or a type detection plug-in), you will typically be using this for
			 * custom sorting, but it can also be used to provide custom searching
			 * by allowing you to pre-processing the data and returning the data in
			 * the format that should be searched upon. This is done by adding
			 * functions this object with a parameter name which matches the sType
			 * for that target column. This is the corollary of <i>afnSortData</i>
			 * for searching data.
			 *
			 * The functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for searching
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Formatted string that will be used for the searching.
			 *
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    $.fn.dataTable.ext.type.search['title-numeric'] = function ( d ) {
			 *      return d.replace(/\n/g," ").replace( /<.*?>/g, "" );
			 *    }
			 */
			search: {},
	
	
			/**
			 * Type based ordering.
			 *
			 * The column type tells DataTables what ordering to apply to the table
			 * when a column is sorted upon. The order for each type that is defined,
			 * is defined by the functions available in this object.
			 *
			 * Each ordering option can be described by three properties added to
			 * this object:
			 *
			 * * `{type}-pre` - Pre-formatting function
			 * * `{type}-asc` - Ascending order function
			 * * `{type}-desc` - Descending order function
			 *
			 * All three can be used together, only `{type}-pre` or only
			 * `{type}-asc` and `{type}-desc` together. It is generally recommended
			 * that only `{type}-pre` is used, as this provides the optimal
			 * implementation in terms of speed, although the others are provided
			 * for compatibility with existing Javascript sort functions.
			 *
			 * `{type}-pre`: Functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for ordering
			 *
			 * And return:
			 *
			 * * `{*}` Data to be sorted upon
			 *
			 * `{type}-asc` and `{type}-desc`: Functions are typical Javascript sort
			 * functions, taking two parameters:
			 *
		     *  1. `{*}` Data to compare to the second parameter
		     *  2. `{*}` Data to compare to the first parameter
			 *
			 * And returning:
			 *
			 * * `{*}` Ordering match: <0 if first parameter should be sorted lower
			 *   than the second parameter, ===0 if the two parameters are equal and
			 *   >0 if the first parameter should be sorted height than the second
			 *   parameter.
			 * 
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    // Numeric ordering of formatted numbers with a pre-formatter
			 *    $.extend( $.fn.dataTable.ext.type.order, {
			 *      "string-pre": function(x) {
			 *        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
			 *        return parseFloat( a );
			 *      }
			 *    } );
			 *
			 *  @example
			 *    // Case-sensitive string ordering, with no pre-formatting method
			 *    $.extend( $.fn.dataTable.ext.order, {
			 *      "string-case-asc": function(x,y) {
			 *        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			 *      },
			 *      "string-case-desc": function(x,y) {
			 *        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			 *      }
			 *    } );
			 */
			order: {}
		},
	
		/**
		 * Unique DataTables instance counter
		 *
		 * @type int
		 * @private
		 */
		_unique: 0,
	
	
		//
		// Depreciated
		// The following properties are retained for backwards compatiblity only.
		// The should not be used in new projects and will be removed in a future
		// version
		//
	
		/**
		 * Version check function.
		 *  @type function
		 *  @depreciated Since 1.10
		 */
		fnVersionCheck: DataTable.fnVersionCheck,
	
	
		/**
		 * Index for what 'this' index API functions should use
		 *  @type int
		 *  @deprecated Since v1.10
		 */
		iApiIndex: 0,
	
	
		/**
		 * jQuery UI class container
		 *  @type object
		 *  @deprecated Since v1.10
		 */
		oJUIClasses: {},
	
	
		/**
		 * Software version
		 *  @type string
		 *  @deprecated Since v1.10
		 */
		sVersion: DataTable.version
	};
	
	
	//
	// Backwards compatibility. Alias to pre 1.10 Hungarian notation counter parts
	//
	$.extend( _ext, {
		afnFiltering: _ext.search,
		aTypes:       _ext.type.detect,
		ofnSearch:    _ext.type.search,
		oSort:        _ext.type.order,
		afnSortData:  _ext.order,
		aoFeatures:   _ext.feature,
		oApi:         _ext.internal,
		oStdClasses:  _ext.classes,
		oPagination:  _ext.pager
	} );
	
	
	$.extend( DataTable.ext.classes, {
		"sTable": "dataTable",
		"sNoFooter": "no-footer",
	
		/* Paging buttons */
		"sPageButton": "paginate_button",
		"sPageButtonActive": "current",
		"sPageButtonDisabled": "disabled",
	
		/* Striping classes */
		"sStripeOdd": "odd",
		"sStripeEven": "even",
	
		/* Empty row */
		"sRowEmpty": "dataTables_empty",
	
		/* Features */
		"sWrapper": "dataTables_wrapper",
		"sFilter": "dataTables_filter",
		"sInfo": "dataTables_info",
		"sPaging": "dataTables_paginate paging_", /* Note that the type is postfixed */
		"sLength": "dataTables_length",
		"sProcessing": "dataTables_processing",
	
		/* Sorting */
		"sSortAsc": "sorting_asc",
		"sSortDesc": "sorting_desc",
		"sSortable": "sorting", /* Sortable in both directions */
		"sSortableAsc": "sorting_asc_disabled",
		"sSortableDesc": "sorting_desc_disabled",
		"sSortableNone": "sorting_disabled",
		"sSortColumn": "sorting_", /* Note that an int is postfixed for the sorting order */
	
		/* Filtering */
		"sFilterInput": "",
	
		/* Page length */
		"sLengthSelect": "",
	
		/* Scrolling */
		"sScrollWrapper": "dataTables_scroll",
		"sScrollHead": "dataTables_scrollHead",
		"sScrollHeadInner": "dataTables_scrollHeadInner",
		"sScrollBody": "dataTables_scrollBody",
		"sScrollFoot": "dataTables_scrollFoot",
		"sScrollFootInner": "dataTables_scrollFootInner",
	
		/* Misc */
		"sHeaderTH": "",
		"sFooterTH": "",
	
		// Deprecated
		"sSortJUIAsc": "",
		"sSortJUIDesc": "",
		"sSortJUI": "",
		"sSortJUIAscAllowed": "",
		"sSortJUIDescAllowed": "",
		"sSortJUIWrapper": "",
		"sSortIcon": "",
		"sJUIHeader": "",
		"sJUIFooter": ""
	} );
	
	
	(function() {
	
	// Reused strings for better compression. Closure compiler appears to have a
	// weird edge case where it is trying to expand strings rather than use the
	// variable version. This results in about 200 bytes being added, for very
	// little preference benefit since it this run on script load only.
	var _empty = '';
	_empty = '';
	
	var _stateDefault = _empty + 'ui-state-default';
	var _sortIcon     = _empty + 'css_right ui-icon ui-icon-';
	var _headerFooter = _empty + 'fg-toolbar ui-toolbar ui-widget-header ui-helper-clearfix';
	
	$.extend( DataTable.ext.oJUIClasses, DataTable.ext.classes, {
		/* Full numbers paging buttons */
		"sPageButton":         "fg-button ui-button "+_stateDefault,
		"sPageButtonActive":   "ui-state-disabled",
		"sPageButtonDisabled": "ui-state-disabled",
	
		/* Features */
		"sPaging": "dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi "+
			"ui-buttonset-multi paging_", /* Note that the type is postfixed */
	
		/* Sorting */
		"sSortAsc":            _stateDefault+" sorting_asc",
		"sSortDesc":           _stateDefault+" sorting_desc",
		"sSortable":           _stateDefault+" sorting",
		"sSortableAsc":        _stateDefault+" sorting_asc_disabled",
		"sSortableDesc":       _stateDefault+" sorting_desc_disabled",
		"sSortableNone":       _stateDefault+" sorting_disabled",
		"sSortJUIAsc":         _sortIcon+"triangle-1-n",
		"sSortJUIDesc":        _sortIcon+"triangle-1-s",
		"sSortJUI":            _sortIcon+"carat-2-n-s",
		"sSortJUIAscAllowed":  _sortIcon+"carat-1-n",
		"sSortJUIDescAllowed": _sortIcon+"carat-1-s",
		"sSortJUIWrapper":     "DataTables_sort_wrapper",
		"sSortIcon":           "DataTables_sort_icon",
	
		/* Scrolling */
		"sScrollHead": "dataTables_scrollHead "+_stateDefault,
		"sScrollFoot": "dataTables_scrollFoot "+_stateDefault,
	
		/* Misc */
		"sHeaderTH":  _stateDefault,
		"sFooterTH":  _stateDefault,
		"sJUIHeader": _headerFooter+" ui-corner-tl ui-corner-tr",
		"sJUIFooter": _headerFooter+" ui-corner-bl ui-corner-br"
	} );
	
	}());
	
	
	
	var extPagination = DataTable.ext.pager;
	
	function _numbers ( page, pages ) {
		var
			numbers = [],
			buttons = extPagination.numbers_length,
			half = Math.floor( buttons / 2 ),
			i = 1;
	
		if ( pages <= buttons ) {
			numbers = _range( 0, pages );
		}
		else if ( page <= half ) {
			numbers = _range( 0, buttons-2 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
		}
		else if ( page >= pages - 1 - half ) {
			numbers = _range( pages-(buttons-2), pages );
			numbers.splice( 0, 0, 'ellipsis' ); // no unshift in ie6
			numbers.splice( 0, 0, 0 );
		}
		else {
			numbers = _range( page-half+2, page+half-1 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
			numbers.splice( 0, 0, 'ellipsis' );
			numbers.splice( 0, 0, 0 );
		}
	
		numbers.DT_el = 'span';
		return numbers;
	}
	
	
	$.extend( extPagination, {
		simple: function ( page, pages ) {
			return [ 'previous', 'next' ];
		},
	
		full: function ( page, pages ) {
			return [  'first', 'previous', 'next', 'last' ];
		},
	
		numbers: function ( page, pages ) {
			return [ _numbers(page, pages) ];
		},
	
		simple_numbers: function ( page, pages ) {
			return [ 'previous', _numbers(page, pages), 'next' ];
		},
	
		full_numbers: function ( page, pages ) {
			return [ 'first', 'previous', _numbers(page, pages), 'next', 'last' ];
		},
	
		// For testing and plug-ins to use
		_numbers: _numbers,
	
		// Number of number buttons (including ellipsis) to show. _Must be odd!_
		numbers_length: 7
	} );
	
	
	$.extend( true, DataTable.ext.renderer, {
		pageButton: {
			_: function ( settings, host, idx, buttons, page, pages ) {
				var classes = settings.oClasses;
				var lang = settings.oLanguage.oPaginate;
				var aria = settings.oLanguage.oAria.paginate || {};
				var btnDisplay, btnClass, counter=0;
	
				var attach = function( container, buttons ) {
					var i, ien, node, button;
					var clickHandler = function ( e ) {
						_fnPageChange( settings, e.data.action, true );
					};
	
					for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
						button = buttons[i];
	
						if ( $.isArray( button ) ) {
							var inner = $( '<'+(button.DT_el || 'div')+'/>' )
								.appendTo( container );
							attach( inner, button );
						}
						else {
							btnDisplay = null;
							btnClass = '';
	
							switch ( button ) {
								case 'ellipsis':
									container.append('<span class="ellipsis">&#x2026;</span>');
									break;
	
								case 'first':
									btnDisplay = lang.sFirst;
									btnClass = button + (page > 0 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								case 'previous':
									btnDisplay = lang.sPrevious;
									btnClass = button + (page > 0 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								case 'next':
									btnDisplay = lang.sNext;
									btnClass = button + (page < pages-1 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								case 'last':
									btnDisplay = lang.sLast;
									btnClass = button + (page < pages-1 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								default:
									btnDisplay = button + 1;
									btnClass = page === button ?
										classes.sPageButtonActive : '';
									break;
							}
	
							if ( btnDisplay !== null ) {
								node = $('<a>', {
										'class': classes.sPageButton+' '+btnClass,
										'aria-controls': settings.sTableId,
										'aria-label': aria[ button ],
										'data-dt-idx': counter,
										'tabindex': settings.iTabIndex,
										'id': idx === 0 && typeof button === 'string' ?
											settings.sTableId +'_'+ button :
											null
									} )
									.html( btnDisplay )
									.appendTo( container );
	
								_fnBindAction(
									node, {action: button}, clickHandler
								);
	
								counter++;
							}
						}
					}
				};
	
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame. Try / catch the error. Not good for
				// accessibility, but neither are frames.
				var activeEl;
	
				try {
					// Because this approach is destroying and recreating the paging
					// elements, focus is lost on the select button which is bad for
					// accessibility. So we want to restore focus once the draw has
					// completed
					activeEl = $(host).find(document.activeElement).data('dt-idx');
				}
				catch (e) {}
	
				attach( $(host).empty(), buttons );
	
				if ( activeEl ) {
					$(host).find( '[data-dt-idx='+activeEl+']' ).focus();
				}
			}
		}
	} );
	
	
	
	// Built in type detection. See model.ext.aTypes for information about
	// what is required from this methods.
	$.extend( DataTable.ext.type.detect, [
		// Plain numbers - first since V8 detects some plain numbers as dates
		// e.g. Date.parse('55') (but not all, e.g. Date.parse('22')...).
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal ) ? 'num'+decimal : null;
		},
	
		// Dates (only those recognised by the browser's Date.parse)
		function ( d, settings )
		{
			// V8 will remove any unknown characters at the start and end of the
			// expression, leading to false matches such as `$245.12` or `10%` being
			// a valid date. See forum thread 18941 for detail.
			if ( d && !(d instanceof Date) && ( ! _re_date_start.test(d) || ! _re_date_end.test(d) ) ) {
				return null;
			}
			var parsed = Date.parse(d);
			return (parsed !== null && !isNaN(parsed)) || _empty(d) ? 'date' : null;
		},
	
		// Formatted numbers
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal, true ) ? 'num-fmt'+decimal : null;
		},
	
		// HTML numeric
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal ) ? 'html-num'+decimal : null;
		},
	
		// HTML numeric, formatted
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal, true ) ? 'html-num-fmt'+decimal : null;
		},
	
		// HTML (this is strict checking - there must be html)
		function ( d, settings )
		{
			return _empty( d ) || (typeof d === 'string' && d.indexOf('<') !== -1) ?
				'html' : null;
		}
	] );
	
	
	
	// Filter formatting functions. See model.ext.ofnSearch for information about
	// what is required from these methods.
	// 
	// Note that additional search methods are added for the html numbers and
	// html formatted numbers by `_addNumericSort()` when we know what the decimal
	// place is
	
	
	$.extend( DataTable.ext.type.search, {
		html: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data
						.replace( _re_new_lines, " " )
						.replace( _re_html, "" ) :
					'';
		},
	
		string: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data.replace( _re_new_lines, " " ) :
					data;
		}
	} );
	
	
	
	var __numericReplace = function ( d, decimalPlace, re1, re2 ) {
		if ( d !== 0 && (!d || d === '-') ) {
			return -Infinity;
		}
	
		// If a decimal place other than `.` is used, it needs to be given to the
		// function so we can detect it and replace with a `.` which is the only
		// decimal place Javascript recognises - it is not locale aware.
		if ( decimalPlace ) {
			d = _numToDecimal( d, decimalPlace );
		}
	
		if ( d.replace ) {
			if ( re1 ) {
				d = d.replace( re1, '' );
			}
	
			if ( re2 ) {
				d = d.replace( re2, '' );
			}
		}
	
		return d * 1;
	};
	
	
	// Add the numeric 'deformatting' functions for sorting and search. This is done
	// in a function to provide an easy ability for the language options to add
	// additional methods if a non-period decimal place is used.
	function _addNumericSort ( decimalPlace ) {
		$.each(
			{
				// Plain numbers
				"num": function ( d ) {
					return __numericReplace( d, decimalPlace );
				},
	
				// Formatted numbers
				"num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_formatted_numeric );
				},
	
				// HTML numeric
				"html-num": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html );
				},
	
				// HTML numeric, formatted
				"html-num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html, _re_formatted_numeric );
				}
			},
			function ( key, fn ) {
				// Add the ordering method
				_ext.type.order[ key+decimalPlace+'-pre' ] = fn;
	
				// For HTML types add a search formatter that will strip the HTML
				if ( key.match(/^html\-/) ) {
					_ext.type.search[ key+decimalPlace ] = _ext.type.search.html;
				}
			}
		);
	}
	
	
	// Default sort methods
	$.extend( _ext.type.order, {
		// Dates
		"date-pre": function ( d ) {
			return Date.parse( d ) || 0;
		},
	
		// html
		"html-pre": function ( a ) {
			return _empty(a) ?
				'' :
				a.replace ?
					a.replace( /<.*?>/g, "" ).toLowerCase() :
					a+'';
		},
	
		// string
		"string-pre": function ( a ) {
			// This is a little complex, but faster than always calling toString,
			// http://jsperf.com/tostring-v-check
			return _empty(a) ?
				'' :
				typeof a === 'string' ?
					a.toLowerCase() :
					! a.toString ?
						'' :
						a.toString();
		},
	
		// string-asc and -desc are retained only for compatibility with the old
		// sort methods
		"string-asc": function ( x, y ) {
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		},
	
		"string-desc": function ( x, y ) {
			return ((x < y) ? 1 : ((x > y) ? -1 : 0));
		}
	} );
	
	
	// Numeric sorting types - order doesn't matter here
	_addNumericSort( '' );
	
	
	$.extend( true, DataTable.ext.renderer, {
		header: {
			_: function ( settings, cell, column, classes ) {
				// No additional mark-up required
				// Attach a sort listener to update on sort - note that using the
				// `DT` namespace will allow the event to be removed automatically
				// on destroy, while the `dt` namespaced event is the one we are
				// listening for
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) { // need to check this this is the host
						return;               // table, not a nested one
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass(
							column.sSortingClass +' '+
							classes.sSortAsc +' '+
							classes.sSortDesc
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
				} );
			},
	
			jqueryui: function ( settings, cell, column, classes ) {
				$('<div/>')
					.addClass( classes.sSortJUIWrapper )
					.append( cell.contents() )
					.append( $('<span/>')
						.addClass( classes.sSortIcon+' '+column.sSortingClassJUI )
					)
					.appendTo( cell );
	
				// Attach a sort listener to update on sort
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) {
						return;
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass( classes.sSortAsc +" "+classes.sSortDesc )
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
	
					cell
						.find( 'span.'+classes.sSortIcon )
						.removeClass(
							classes.sSortJUIAsc +" "+
							classes.sSortJUIDesc +" "+
							classes.sSortJUI +" "+
							classes.sSortJUIAscAllowed +" "+
							classes.sSortJUIDescAllowed
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortJUIAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortJUIDesc :
								column.sSortingClassJUI
						);
				} );
			}
		}
	} );
	
	/*
	 * Public helper functions. These aren't used internally by DataTables, or
	 * called by any of the options passed into DataTables, but they can be used
	 * externally by developers working with DataTables. They are helper functions
	 * to make working with DataTables a little bit easier.
	 */
	
	var __htmlEscapeEntities = function ( d ) {
		return typeof d === 'string' ?
			d.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') :
			d;
	};
	
	/**
	 * Helpers for `columns.render`.
	 *
	 * The options defined here can be used with the `columns.render` initialisation
	 * option to provide a display renderer. The following functions are defined:
	 *
	 * * `number` - Will format numeric data (defined by `columns.data`) for
	 *   display, retaining the original unformatted data for sorting and filtering.
	 *   It takes 5 parameters:
	 *   * `string` - Thousands grouping separator
	 *   * `string` - Decimal point indicator
	 *   * `integer` - Number of decimal points to show
	 *   * `string` (optional) - Prefix.
	 *   * `string` (optional) - Postfix (/suffix).
	 * * `text` - Escape HTML to help prevent XSS attacks. It has no optional
	 *   parameters.
	 *
	 * @example
	 *   // Column definition using the number renderer
	 *   {
	 *     data: "salary",
	 *     render: $.fn.dataTable.render.number( '\'', '.', 0, '$' )
	 *   }
	 *
	 * @namespace
	 */
	DataTable.render = {
		number: function ( thousands, decimal, precision, prefix, postfix ) {
			return {
				display: function ( d ) {
					if ( typeof d !== 'number' && typeof d !== 'string' ) {
						return d;
					}
	
					var negative = d < 0 ? '-' : '';
					var flo = parseFloat( d );
	
					// If NaN then there isn't much formatting that we can do - just
					// return immediately, escaping any HTML (this was supposed to
					// be a number after all)
					if ( isNaN( flo ) ) {
						return __htmlEscapeEntities( d );
					}
	
					d = Math.abs( flo );
	
					var intPart = parseInt( d, 10 );
					var floatPart = precision ?
						decimal+(d - intPart).toFixed( precision ).substring( 2 ):
						'';
	
					return negative + (prefix||'') +
						intPart.toString().replace(
							/\B(?=(\d{3})+(?!\d))/g, thousands
						) +
						floatPart +
						(postfix||'');
				}
			};
		},
	
		text: function () {
			return {
				display: __htmlEscapeEntities
			};
		}
	};
	
	
	/*
	 * This is really a good bit rubbish this method of exposing the internal methods
	 * publicly... - To be fixed in 2.0 using methods on the prototype
	 */
	
	
	/**
	 * Create a wrapper function for exporting an internal functions to an external API.
	 *  @param {string} fn API function name
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#internal
	 */
	function _fnExternApiFunc (fn)
	{
		return function() {
			var args = [_fnSettingsFromNode( this[DataTable.ext.iApiIndex] )].concat(
				Array.prototype.slice.call(arguments)
			);
			return DataTable.ext.internal[fn].apply( this, args );
		};
	}
	
	
	/**
	 * Reference to internal functions for use by plug-in developers. Note that
	 * these methods are references to internal functions and are considered to be
	 * private. If you use these methods, be aware that they are liable to change
	 * between versions.
	 *  @namespace
	 */
	$.extend( DataTable.ext.internal, {
		_fnExternApiFunc: _fnExternApiFunc,
		_fnBuildAjax: _fnBuildAjax,
		_fnAjaxUpdate: _fnAjaxUpdate,
		_fnAjaxParameters: _fnAjaxParameters,
		_fnAjaxUpdateDraw: _fnAjaxUpdateDraw,
		_fnAjaxDataSrc: _fnAjaxDataSrc,
		_fnAddColumn: _fnAddColumn,
		_fnColumnOptions: _fnColumnOptions,
		_fnAdjustColumnSizing: _fnAdjustColumnSizing,
		_fnVisibleToColumnIndex: _fnVisibleToColumnIndex,
		_fnColumnIndexToVisible: _fnColumnIndexToVisible,
		_fnVisbleColumns: _fnVisbleColumns,
		_fnGetColumns: _fnGetColumns,
		_fnColumnTypes: _fnColumnTypes,
		_fnApplyColumnDefs: _fnApplyColumnDefs,
		_fnHungarianMap: _fnHungarianMap,
		_fnCamelToHungarian: _fnCamelToHungarian,
		_fnLanguageCompat: _fnLanguageCompat,
		_fnBrowserDetect: _fnBrowserDetect,
		_fnAddData: _fnAddData,
		_fnAddTr: _fnAddTr,
		_fnNodeToDataIndex: _fnNodeToDataIndex,
		_fnNodeToColumnIndex: _fnNodeToColumnIndex,
		_fnGetCellData: _fnGetCellData,
		_fnSetCellData: _fnSetCellData,
		_fnSplitObjNotation: _fnSplitObjNotation,
		_fnGetObjectDataFn: _fnGetObjectDataFn,
		_fnSetObjectDataFn: _fnSetObjectDataFn,
		_fnGetDataMaster: _fnGetDataMaster,
		_fnClearTable: _fnClearTable,
		_fnDeleteIndex: _fnDeleteIndex,
		_fnInvalidate: _fnInvalidate,
		_fnGetRowElements: _fnGetRowElements,
		_fnCreateTr: _fnCreateTr,
		_fnBuildHead: _fnBuildHead,
		_fnDrawHead: _fnDrawHead,
		_fnDraw: _fnDraw,
		_fnReDraw: _fnReDraw,
		_fnAddOptionsHtml: _fnAddOptionsHtml,
		_fnDetectHeader: _fnDetectHeader,
		_fnGetUniqueThs: _fnGetUniqueThs,
		_fnFeatureHtmlFilter: _fnFeatureHtmlFilter,
		_fnFilterComplete: _fnFilterComplete,
		_fnFilterCustom: _fnFilterCustom,
		_fnFilterColumn: _fnFilterColumn,
		_fnFilter: _fnFilter,
		_fnFilterCreateSearch: _fnFilterCreateSearch,
		_fnEscapeRegex: _fnEscapeRegex,
		_fnFilterData: _fnFilterData,
		_fnFeatureHtmlInfo: _fnFeatureHtmlInfo,
		_fnUpdateInfo: _fnUpdateInfo,
		_fnInfoMacros: _fnInfoMacros,
		_fnInitialise: _fnInitialise,
		_fnInitComplete: _fnInitComplete,
		_fnLengthChange: _fnLengthChange,
		_fnFeatureHtmlLength: _fnFeatureHtmlLength,
		_fnFeatureHtmlPaginate: _fnFeatureHtmlPaginate,
		_fnPageChange: _fnPageChange,
		_fnFeatureHtmlProcessing: _fnFeatureHtmlProcessing,
		_fnProcessingDisplay: _fnProcessingDisplay,
		_fnFeatureHtmlTable: _fnFeatureHtmlTable,
		_fnScrollDraw: _fnScrollDraw,
		_fnApplyToChildren: _fnApplyToChildren,
		_fnCalculateColumnWidths: _fnCalculateColumnWidths,
		_fnThrottle: _fnThrottle,
		_fnConvertToWidth: _fnConvertToWidth,
		_fnGetWidestNode: _fnGetWidestNode,
		_fnGetMaxLenString: _fnGetMaxLenString,
		_fnStringToCss: _fnStringToCss,
		_fnSortFlatten: _fnSortFlatten,
		_fnSort: _fnSort,
		_fnSortAria: _fnSortAria,
		_fnSortListener: _fnSortListener,
		_fnSortAttachListener: _fnSortAttachListener,
		_fnSortingClasses: _fnSortingClasses,
		_fnSortData: _fnSortData,
		_fnSaveState: _fnSaveState,
		_fnLoadState: _fnLoadState,
		_fnSettingsFromNode: _fnSettingsFromNode,
		_fnLog: _fnLog,
		_fnMap: _fnMap,
		_fnBindAction: _fnBindAction,
		_fnCallbackReg: _fnCallbackReg,
		_fnCallbackFire: _fnCallbackFire,
		_fnLengthOverflow: _fnLengthOverflow,
		_fnRenderer: _fnRenderer,
		_fnDataSource: _fnDataSource,
		_fnRowAttributes: _fnRowAttributes,
		_fnCalculateEnd: function () {} // Used by a lot of plug-ins, but redundant
		                                // in 1.10, so this dead-end function is
		                                // added to prevent errors
	} );
	

	// jQuery access
	$.fn.dataTable = DataTable;

	// Provide access to the host jQuery object (circular reference)
	DataTable.$ = $;

	// Legacy aliases
	$.fn.dataTableSettings = DataTable.settings;
	$.fn.dataTableExt = DataTable.ext;

	// With a capital `D` we return a DataTables API instance rather than a
	// jQuery object
	$.fn.DataTable = function ( opts ) {
		return $(this).dataTable( opts ).api();
	};

	// All properties that are available to $.fn.dataTable should also be
	// available on $.fn.DataTable
	$.each( DataTable, function ( prop, val ) {
		$.fn.DataTable[ prop ] = val;
	} );


	// Information about events fired by DataTables - for documentation.
	/**
	 * Draw event, fired whenever the table is redrawn on the page, at the same
	 * point as fnDrawCallback. This may be useful for binding events or
	 * performing calculations when the table is altered at all.
	 *  @name DataTable#draw.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Search event, fired when the searching applied to the table (using the
	 * built-in global search, or column filters) is altered.
	 *  @name DataTable#search.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page change event, fired when the paging of the table is altered.
	 *  @name DataTable#page.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Order event, fired when the ordering applied to the table is altered.
	 *  @name DataTable#order.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * DataTables initialisation complete event, fired when the table is fully
	 * drawn, including Ajax data loaded, if Ajax data is required.
	 *  @name DataTable#init.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The JSON object request from the server - only
	 *    present if client-side Ajax sourced data is used</li></ol>
	 */

	/**
	 * State save event, fired when the table has changed state a new state save
	 * is required. This event allows modification of the state saving object
	 * prior to actually doing the save, including addition or other state
	 * properties (for plug-ins) or modification of a DataTables core property.
	 *  @name DataTable#stateSaveParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The state information to be saved
	 */

	/**
	 * State load event, fired when the table is loading state from the stored
	 * data, but prior to the settings object being modified by the saved state
	 * - allowing modification of the saved state is required or loading of
	 * state for a plug-in.
	 *  @name DataTable#stateLoadParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * State loaded event, fired when state has been loaded from stored data and
	 * the settings object has been modified by the loaded data.
	 *  @name DataTable#stateLoaded.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * Processing event, fired when DataTables is doing some kind of processing
	 * (be it, order, searcg or anything else). It can be used to indicate to
	 * the end user that there is something happening, or that something has
	 * finished.
	 *  @name DataTable#processing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {boolean} bShow Flag for if DataTables is doing processing or not
	 */

	/**
	 * Ajax (XHR) event, fired whenever an Ajax request is completed from a
	 * request to made to the server for new data. This event is called before
	 * DataTables processed the returned data, so it can also be used to pre-
	 * process the data returned from the server, if needed.
	 *
	 * Note that this trigger is called in `fnServerData`, if you override
	 * `fnServerData` and which to use this event, you need to trigger it in you
	 * success function.
	 *  @name DataTable#xhr.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {object} json JSON returned from the server
	 *
	 *  @example
	 *     // Use a custom property returned from the server in another DOM element
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       $('#status').html( json.status );
	 *     } );
	 *
	 *  @example
	 *     // Pre-process the data returned from the server
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       for ( var i=0, ien=json.aaData.length ; i<ien ; i++ ) {
	 *         json.aaData[i].sum = json.aaData[i].one + json.aaData[i].two;
	 *       }
	 *       // Note no return - manipulate the data directly in the JSON object.
	 *     } );
	 */

	/**
	 * Destroy event, fired when the DataTable is destroyed by calling fnDestroy
	 * or passing the bDestroy:true parameter in the initialisation object. This
	 * can be used to remove bound events, added DOM nodes, etc.
	 *  @name DataTable#destroy.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page length change event, fired when number of records to show on each
	 * page (the length) is changed.
	 *  @name DataTable#length.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {integer} len New length
	 */

	/**
	 * Column sizing has changed.
	 *  @name DataTable#column-sizing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Column visibility has changed.
	 *  @name DataTable#column-visibility.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {int} column Column index
	 *  @param {bool} vis `false` if column now hidden, or `true` if visible
	 */

	return $.fn.dataTable;
}));


/*! DataTables Bootstrap 3 integration
 * ©2011-2015 SpryMedia Ltd - datatables.net/license
 */

/**
 * DataTables integration for Bootstrap 3. This requires Bootstrap 3 and
 * DataTables 1.10 or newer.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See http://datatables.net/manual/styling/bootstrap
 * for further information.
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				// Require DataTables, which attaches to jQuery, including
				// jQuery if needed and have a $ property so we can access the
				// jQuery object that is used
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/* Set the defaults for DataTables initialisation */
$.extend( true, DataTable.defaults, {
	dom:
		"<'row'<'col-sm-6'l><'col-sm-6'f>>" +
		"<'row'<'col-sm-12'tr>>" +
		"<'row'<'col-sm-5'i><'col-sm-7'p>>",
	renderer: 'bootstrap'
} );


/* Default class modification */
$.extend( DataTable.ext.classes, {
	sWrapper:      "dataTables_wrapper form-inline dt-bootstrap",
	sFilterInput:  "form-control input-sm",
	sLengthSelect: "form-control input-sm",
	sProcessing:   "dataTables_processing panel panel-default"
} );


/* Bootstrap paging button renderer */
DataTable.ext.renderer.pageButton.bootstrap = function ( settings, host, idx, buttons, page, pages ) {
	var api     = new DataTable.Api( settings );
	var classes = settings.oClasses;
	var lang    = settings.oLanguage.oPaginate;
	var aria = settings.oLanguage.oAria.paginate || {};
	var btnDisplay, btnClass, counter=0;

	var attach = function( container, buttons ) {
		var i, ien, node, button;
		var clickHandler = function ( e ) {
			e.preventDefault();
			if ( !$(e.currentTarget).hasClass('disabled') && api.page() != e.data.action ) {
				api.page( e.data.action ).draw( 'page' );
			}
		};

		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( $.isArray( button ) ) {
				attach( container, button );
			}
			else {
				btnDisplay = '';
				btnClass = '';

				switch ( button ) {
					case 'ellipsis':
						btnDisplay = '&#x2026;';
						btnClass = 'disabled';
						break;

					case 'first':
						btnDisplay = lang.sFirst;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'previous':
						btnDisplay = lang.sPrevious;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'next':
						btnDisplay = lang.sNext;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					case 'last':
						btnDisplay = lang.sLast;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					default:
						btnDisplay = button + 1;
						btnClass = page === button ?
							'active' : '';
						break;
				}

				if ( btnDisplay ) {
					node = $('<li>', {
							'class': classes.sPageButton+' '+btnClass,
							'id': idx === 0 && typeof button === 'string' ?
								settings.sTableId +'_'+ button :
								null
						} )
						.append( $('<a>', {
								'href': '#',
								'aria-controls': settings.sTableId,
								'aria-label': aria[ button ],
								'data-dt-idx': counter,
								'tabindex': settings.iTabIndex
							} )
							.html( btnDisplay )
						)
						.appendTo( container );

					settings.oApi._fnBindAction(
						node, {action: button}, clickHandler
					);

					counter++;
				}
			}
		}
	};

	// IE9 throws an 'unknown error' if document.activeElement is used
	// inside an iframe or frame. 
	var activeEl;

	try {
		// Because this approach is destroying and recreating the paging
		// elements, focus is lost on the select button which is bad for
		// accessibility. So we want to restore focus once the draw has
		// completed
		activeEl = $(host).find(document.activeElement).data('dt-idx');
	}
	catch (e) {}

	attach(
		$(host).empty().html('<ul class="pagination"/>').children('ul'),
		buttons
	);

	if ( activeEl ) {
		$(host).find( '[data-dt-idx='+activeEl+']' ).focus();
	}
};


return DataTable;
}));

/*! AutoFill 2.1.2
 * ©2008-2015 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     AutoFill
 * @description Add Excel like click and drag auto-fill options to DataTables
 * @version     2.1.2
 * @file        dataTables.autoFill.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2010-2015 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


var _instance = 0;

/** 
 * AutoFill provides Excel like auto-fill features for a DataTable
 *
 * @class AutoFill
 * @constructor
 * @param {object} oTD DataTables settings object
 * @param {object} oConfig Configuration object for AutoFill
 */
var AutoFill = function( dt, opts )
{
	if ( ! DataTable.versionCheck || ! DataTable.versionCheck( '1.10.8' ) ) {
		throw( "Warning: AutoFill requires DataTables 1.10.8 or greater");
	}

	// User and defaults configuration object
	this.c = $.extend( true, {},
		DataTable.defaults.autoFill,
		AutoFill.defaults,
		opts
	);

	/**
	 * @namespace Settings object which contains customisable information for AutoFill instance
	 */
	this.s = {
		/** @type {DataTable.Api} DataTables' API instance */
		dt: new DataTable.Api( dt ),

		/** @type {String} Unique namespace for events attached to the document */
		namespace: '.autoFill'+(_instance++),

		/** @type {Object} Cached dimension information for use in the mouse move event handler */
		scroll: {},

		/** @type {integer} Interval object used for smooth scrolling */
		scrollInterval: null,

		handle: {
			height: 0,
			width: 0
		}
	};


	/**
	 * @namespace Common and useful DOM elements for the class instance
	 */
	this.dom = {
		/** @type {jQuery} AutoFill handle */
		handle: $('<div class="dt-autofill-handle"/>'),

		/**
		 * @type {Object} Selected cells outline - Need to use 4 elements,
		 *   otherwise the mouse over if you back into the selected rectangle
		 *   will be over that element, rather than the cells!
		 */
		select: {
			top:    $('<div class="dt-autofill-select top"/>'),
			right:  $('<div class="dt-autofill-select right"/>'),
			bottom: $('<div class="dt-autofill-select bottom"/>'),
			left:   $('<div class="dt-autofill-select left"/>')
		},

		/** @type {jQuery} Fill type chooser background */
		background: $('<div class="dt-autofill-background"/>'),

		/** @type {jQuery} Fill type chooser */
		list: $('<div class="dt-autofill-list">'+this.s.dt.i18n('autoFill.info', '')+'<ul/></div>'),

		/** @type {jQuery} DataTables scrolling container */
		dtScroll: null,

		/** @type {jQuery} Offset parent element */
		offsetParent: null
	};


	/* Constructor logic */
	this._constructor();
};



$.extend( AutoFill.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Initialise the RowReorder instance
	 *
	 * @private
	 */
	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var dtScroll = $('div.dataTables_scrollBody', this.s.dt.table().container());

		if ( dtScroll.length ) {
			this.dom.dtScroll = dtScroll;

			// Need to scroll container to be the offset parent
			if ( dtScroll.css('position') === 'static' ) {
				dtScroll.css( 'position', 'relative' );
			}
		}

		this._focusListener();

		this.dom.handle.on( 'mousedown', function (e) {
			that._mousedown( e );
			return false;
		} );

		dt.on( 'destroy.autoFill', function () {
			dt.off( '.autoFill' );
			$(dt.table().body()).off( that.s.namespace );
			$(document.body).off( that.s.namespace );
		} );
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Display the AutoFill drag handle by appending it to a table cell. This
	 * is the opposite of the _detach method.
	 *
	 * @param  {node} node TD/TH cell to insert the handle into
	 * @private
	 */
	_attach: function ( node )
	{
		var dt = this.s.dt;
		var idx = dt.cell( node ).index();
		var handle = this.dom.handle;
		var handleDim = this.s.handle;
		var dtScroll = $('div.dataTables_scrollBody', this.s.dt.table().container() );
		var scrollOffsetX=0, scrollOffsetY=0;

		if ( ! idx || dt.columns( this.c.columns ).indexes().indexOf( idx.column ) === -1 ) {
			this._detach();
			return;
		}

		if ( ! this.dom.offsetParent ) {
			this.dom.offsetParent = $(node).offsetParent();
		}

		if ( ! handleDim.height || ! handleDim.width ) {
			// Append to document so we can get its size. Not expecting it to
			// change during the life time of the page
			handle.appendTo( 'body' );
			handleDim.height = handle.outerHeight();
			handleDim.width = handle.outerWidth();
		}

		var offset = $(node).position();

		// If scrolling, and the table is not itself the offset parent, need to
		// offset for the scrolling position
		if ( dtScroll.length && this.dom.offsetParent[0] !== dt.table().node() ) {
			scrollOffsetY = dtScroll.scrollTop();
			scrollOffsetX = dtScroll.scrollLeft();
		}

		this.dom.attachedTo = node;
		handle
			.css( {
				top: offset.top + node.offsetHeight - handleDim.height + scrollOffsetY,
				left: offset.left + node.offsetWidth - handleDim.width + scrollOffsetX
			} )
			.appendTo( this.dom.offsetParent );
	},


	/**
	 * Determine can the fill type should be. This can be automatic, or ask the
	 * end user.
	 *
	 * @param {array} cells Information about the selected cells from the key
	 *     up function
	 * @private
	 */
	_actionSelector: function ( cells )
	{
		var that = this;
		var dt = this.s.dt;
		var actions = AutoFill.actions;
		var available = [];

		// "Ask" each plug-in if it wants to handle this data
		$.each( actions, function ( key, action ) {
			if ( action.available( dt, cells ) ) {
				available.push( key );
			}
		} );

		if ( available.length === 1 && this.c.alwaysAsk === false ) {
			// Only one action available - enact it immediately
			var result = actions[ available[0] ].execute( dt, cells );
			this._update( result, cells );
		}
		else {
			// Multiple actions available - ask the end user what they want to do
			var list = this.dom.list.children('ul').empty();

			// Add a cancel option
			available.push( 'cancel' );

			$.each( available, function ( i, name ) {
				list.append( $('<li/>')
					.append(
						'<div class="dt-autofill-question">'+
							actions[ name ].option( dt, cells )+
						'<div>'
					)
					.append( $('<div class="dt-autofill-button">' )
						.append( $('<button class="'+AutoFill.classes.btn+'">'+dt.i18n('autoFill.button', '&gt;')+'</button>')
							.on( 'click', function () {
								var result = actions[ name ].execute(
									dt, cells, $(this).closest('li')
								);
								that._update( result, cells );

								that.dom.background.remove();
								that.dom.list.remove();
							} )
						)
					)
				);
			} );

			this.dom.background.appendTo( 'body' );
			this.dom.list.appendTo( 'body' );

			this.dom.list.css( 'margin-top', this.dom.list.outerHeight()/2 * -1 );
		}
	},


	/**
	 * Remove the AutoFill handle from the document
	 *
	 * @private
	 */
	_detach: function ()
	{
		this.dom.attachedTo = null;
		this.dom.handle.detach();
	},


	/**
	 * Draw the selection outline by calculating the range between the start
	 * and end cells, then placing the highlighting elements to draw a rectangle
	 *
	 * @param  {node}   target End cell
	 * @param  {object} e      Originating event
	 * @private
	 */
	_drawSelection: function ( target, e )
	{
		// Calculate boundary for start cell to this one
		var dt = this.s.dt;
		var start = this.s.start;
		var startCell = $(this.dom.start);
		var endCell = $(target);
		var end = {
			row: dt.rows( { page: 'current' } ).nodes().indexOf( endCell.parent()[0] ),
			column: endCell.index()
		};

		// Be sure that is a DataTables controlled cell
		if ( ! dt.cell( endCell ).any() ) {
			return;
		}

		// if target is not in the columns available - do nothing
		if ( dt.columns( this.c.columns ).indexes().indexOf( end.column ) === -1 ) {
			return;
		}

		this.s.end = end;

		var top, bottom, left, right, height, width;

		top    = start.row    < end.row    ? startCell : endCell;
		bottom = start.row    < end.row    ? endCell   : startCell;
		left   = start.column < end.column ? startCell : endCell;
		right  = start.column < end.column ? endCell   : startCell;

		top    = top.position().top;
		left   = left.position().left;
		height = bottom.position().top + bottom.outerHeight() - top;
		width  = right.position().left + right.outerWidth() - left;

		var dtScroll = this.dom.dtScroll;
		if ( dtScroll && this.dom.offsetParent[0] !== dt.table().node() ) {
			top += dtScroll.scrollTop();
			left += dtScroll.scrollLeft();
		}

		var select = this.dom.select;
		select.top.css( {
			top: top,
			left: left,
			width: width
		} );

		select.left.css( {
			top: top,
			left: left,
			height: height
		} );

		select.bottom.css( {
			top: top + height,
			left: left,
			width: width
		} );

		select.right.css( {
			top: top,
			left: left + width,
			height: height
		} );
	},


	/**
	 * Use the Editor API to perform an update based on the new data for the
	 * cells
	 *
	 * @param {array} cells Information about the selected cells from the key
	 *     up function
	 * @private
	 */
	_editor: function ( cells )
	{
		var dt = this.s.dt;
		var editor = this.c.editor;

		if ( ! editor ) {
			return;
		}

		// Build the object structure for Editor's multi-row editing
		var idValues = {};
		var nodes = [];
		var fields = editor.fields();

		for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
			for ( var j=0, jen=cells[i].length ; j<jen ; j++ ) {
				var cell = cells[i][j];

				// Determine the field name for the cell being edited
				var col = dt.settings()[0].aoColumns[ cell.index.column ];
				var fieldName = col.editField;

				if ( fieldName === undefined ) {
					var dataSrc = col.mData;

					// dataSrc is the `field.data` property, but we need to set
					// using the field name, so we need to translate from the
					// data to the name
					for ( var k=0, ken=fields.length ; k<ken ; k++ ) {
						var field = editor.field( fields[k] );

						if ( field.dataSrc() === dataSrc ) {
							fieldName = field.name();
							break;
						}
					}
				}

				if ( ! fieldName ) {
					throw 'Could not automatically determine field data. '+
						'Please see https://datatables.net/tn/11';
				}

				if ( ! idValues[ fieldName ] ) {
					idValues[ fieldName ] = {};
				}

				var id = dt.row( cell.index.row ).id();
				idValues[ fieldName ][ id ] = cell.set;

				// Keep a list of cells so we can activate the bubble editing
				// with them
				nodes.push( cell.index );
			}
		}

		// Perform the edit using bubble editing as it allows us to specify
		// the cells to be edited, rather than using full rows
		editor
			.bubble( nodes, false )
			.multiSet( idValues )
			.submit();
	},


	/**
	 * Emit an event on the DataTable for listeners
	 *
	 * @param  {string} name Event name
	 * @param  {array} args Event arguments
	 * @private
	 */
	_emitEvent: function ( name, args )
	{
		this.s.dt.iterator( 'table', function ( ctx, i ) {
			$(ctx.nTable).triggerHandler( name+'.dt', args );
		} );
	},


	/**
	 * Attach suitable listeners (based on the configuration) that will attach
	 * and detach the AutoFill handle in the document.
	 *
	 * @private
	 */
	_focusListener: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var namespace = this.s.namespace;
		var focus = this.c.focus !== null ?
			this.c.focus :
			dt.settings()[0].keytable ?
				'focus' :
				'hover';

		// All event listeners attached here are removed in the `destroy`
		// callback in the constructor
		if ( focus === 'focus' ) {
			dt
				.on( 'key-focus.autoFill', function ( e, dt, cell ) {
					that._attach( cell.node() );
				} )
				.on( 'key-blur.autoFill', function ( e, dt, cell ) {
					that._detach();
				} );
		}
		else if ( focus === 'click' ) {
			$(dt.table().body()).on( 'click'+namespace, 'td, th', function (e) {
				that._attach( this );
			} );

			$(document.body).on( 'click'+namespace, function (e) {
				if ( ! $(e.target).parents().filter( dt.table().body() ).length ) {
					that._detach();
				}
			} );
		}
		else {
			$(dt.table().body())
				.on( 'mouseenter'+namespace, 'td, th', function (e) {
					that._attach( this );
				} )
				.on( 'mouseleave'+namespace, function (e) {
					if ( $(e.relatedTarget).hasClass('dt-autofill-handle') ) {
						return;
					}

					that._detach();
				} );
		}
	},


	/**
	 * Start mouse drag - selects the start cell
	 *
	 * @param  {object} e Mouse down event
	 * @private
	 */
	_mousedown: function ( e )
	{
		var that = this;
		var dt = this.s.dt;

		this.dom.start = this.dom.attachedTo;
		this.s.start = {
			row: dt.rows( { page: 'current' } ).nodes().indexOf( $(this.dom.start).parent()[0] ),
			column: $(this.dom.start).index()
		};

		$(document.body)
			.on( 'mousemove.autoFill', function (e) {
				that._mousemove( e );
			} )
			.on( 'mouseup.autoFill', function (e) {
				that._mouseup( e );
			} );

		var select = this.dom.select;
		var offsetParent = $(this.s.dt.table().body()).offsetParent();
		select.top.appendTo( offsetParent );
		select.left.appendTo( offsetParent );
		select.right.appendTo( offsetParent );
		select.bottom.appendTo( offsetParent );

		this._drawSelection( this.dom.start, e );

		this.dom.handle.css( 'display', 'none' );

		// Cache scrolling information so mouse move doesn't need to read.
		// This assumes that the window and DT scroller will not change size
		// during an AutoFill drag, which I think is a fair assumption
		var scrollWrapper = this.dom.dtScroll;
		this.s.scroll = {
			windowHeight: $(window).height(),
			windowWidth:  $(window).width(),
			dtTop:        scrollWrapper ? scrollWrapper.offset().top : null,
			dtLeft:       scrollWrapper ? scrollWrapper.offset().left : null,
			dtHeight:     scrollWrapper ? scrollWrapper.outerHeight() : null,
			dtWidth:      scrollWrapper ? scrollWrapper.outerWidth() : null
		};
	},


	/**
	 * Mouse drag - selects the end cell and update the selection display for
	 * the end user
	 *
	 * @param  {object} e Mouse move event
	 * @private
	 */
	_mousemove: function ( e )
	{	
		var that = this;
		var dt = this.s.dt;
		var name = e.target.nodeName.toLowerCase();
		if ( name !== 'td' && name !== 'th' ) {
			return;
		}

		this._drawSelection( e.target, e );
		this._shiftScroll( e );
	},


	/**
	 * End mouse drag - perform the update actions
	 *
	 * @param  {object} e Mouse up event
	 * @private
	 */
	_mouseup: function ( e )
	{
		$(document.body).off( '.autoFill' );

		var dt = this.s.dt;
		var select = this.dom.select;
		select.top.remove();
		select.left.remove();
		select.right.remove();
		select.bottom.remove();

		this.dom.handle.css( 'display', 'block' );

		// Display complete - now do something useful with the selection!
		var start = this.s.start;
		var end = this.s.end;

		// Haven't selected multiple cells, so nothing to do
		if ( start.row === end.row && start.column === end.column ) {
			return;
		}

		// Build a matrix representation of the selected rows
		var rows       = this._range( start.row, end.row );
		var columns    = this._range( start.column, end.column );
		var selected   = [];
		var dtSettings = dt.settings()[0];
		var dtColumns  = dtSettings.aoColumns;

		// Can't use Array.prototype.map as IE8 doesn't support it
		// Can't use $.map as jQuery flattens 2D arrays
		// Need to use a good old fashioned for loop
		for ( var rowIdx=0 ; rowIdx<rows.length ; rowIdx++ ) {
			selected.push(
				$.map( columns, function (column) {
					var cell = dt.cell( ':eq('+rows[rowIdx]+')', column+':visible', {page:'current'} );
					var data = cell.data();
					var cellIndex = cell.index();
					var editField = dtColumns[ cellIndex.column ].editField;

					if ( editField !== undefined ) {
						data = dtSettings.oApi._fnGetObjectDataFn( editField )( dt.row( cellIndex.row ).data() );
					}

					return {
						cell:  cell,
						data:  data,
						label: cell.data(),
						index: cellIndex
					};
				} )
			);
		}

		this._actionSelector( selected );
		
		// Stop shiftScroll
		clearInterval( this.s.scrollInterval );
		this.s.scrollInterval = null;
	},


	/**
	 * Create an array with a range of numbers defined by the start and end
	 * parameters passed in (inclusive!).
	 * 
	 * @param  {integer} start Start
	 * @param  {integer} end   End
	 * @private
	 */
	_range: function ( start, end )
	{
		var out = [];
		var i;

		if ( start <= end ) {
			for ( i=start ; i<=end ; i++ ) {
				out.push( i );
			}
		}
		else {
			for ( i=start ; i>=end ; i-- ) {
				out.push( i );
			}
		}

		return out;
	},


	/**
	 * Move the window and DataTables scrolling during a drag to scroll new
	 * content into view. This is done by proximity to the edge of the scrolling
	 * container of the mouse - for example near the top edge of the window
	 * should scroll up. This is a little complicated as there are two elements
	 * that can be scrolled - the window and the DataTables scrolling view port
	 * (if scrollX and / or scrollY is enabled).
	 *
	 * @param  {object} e Mouse move event object
	 * @private
	 */
	_shiftScroll: function ( e )
	{
		var that = this;
		var dt = this.s.dt;
		var scroll = this.s.scroll;
		var runInterval = false;
		var scrollSpeed = 5;
		var buffer = 65;
		var
			windowY = e.pageY - document.body.scrollTop,
			windowX = e.pageX - document.body.scrollLeft,
			windowVert, windowHoriz,
			dtVert, dtHoriz;

		// Window calculations - based on the mouse position in the window,
		// regardless of scrolling
		if ( windowY < buffer ) {
			windowVert = scrollSpeed * -1;
		}
		else if ( windowY > scroll.windowHeight - buffer ) {
			windowVert = scrollSpeed;
		}

		if ( windowX < buffer ) {
			windowHoriz = scrollSpeed * -1;
		}
		else if ( windowX > scroll.windowWidth - buffer ) {
			windowHoriz = scrollSpeed;
		}

		// DataTables scrolling calculations - based on the table's position in
		// the document and the mouse position on the page
		if ( scroll.dtTop !== null && e.pageY < scroll.dtTop + buffer ) {
			dtVert = scrollSpeed * -1;
		}
		else if ( scroll.dtTop !== null && e.pageY > scroll.dtTop + scroll.dtHeight - buffer ) {
			dtVert = scrollSpeed;
		}

		if ( scroll.dtLeft !== null && e.pageX < scroll.dtLeft + buffer ) {
			dtHoriz = scrollSpeed * -1;
		}
		else if ( scroll.dtLeft !== null && e.pageX > scroll.dtLeft + scroll.dtWidth - buffer ) {
			dtHoriz = scrollSpeed;
		}

		// This is where it gets interesting. We want to continue scrolling
		// without requiring a mouse move, so we need an interval to be
		// triggered. The interval should continue until it is no longer needed,
		// but it must also use the latest scroll commands (for example consider
		// that the mouse might move from scrolling up to scrolling left, all
		// with the same interval running. We use the `scroll` object to "pass"
		// this information to the interval. Can't use local variables as they
		// wouldn't be the ones that are used by an already existing interval!
		if ( windowVert || windowHoriz || dtVert || dtHoriz ) {
			scroll.windowVert = windowVert;
			scroll.windowHoriz = windowHoriz;
			scroll.dtVert = dtVert;
			scroll.dtHoriz = dtHoriz;
			runInterval = true;
		}
		else if ( this.s.scrollInterval ) {
			// Don't need to scroll - remove any existing timer
			clearInterval( this.s.scrollInterval );
			this.s.scrollInterval = null;
		}

		// If we need to run the interval to scroll and there is no existing
		// interval (if there is an existing one, it will continue to run)
		if ( ! this.s.scrollInterval && runInterval ) {
			this.s.scrollInterval = setInterval( function () {
				// Don't need to worry about setting scroll <0 or beyond the
				// scroll bound as the browser will just reject that.
				if ( scroll.windowVert ) {
					document.body.scrollTop += scroll.windowVert;
				}
				if ( scroll.windowHoriz ) {
					document.body.scrollLeft += scroll.windowHoriz;
				}

				// DataTables scrolling
				if ( scroll.dtVert || scroll.dtHoriz ) {
					var scroller = that.dom.dtScroll[0];

					if ( scroll.dtVert ) {
						scroller.scrollTop += scroll.dtVert;
					}
					if ( scroll.dtHoriz ) {
						scroller.scrollLeft += scroll.dtHoriz;
					}
				}
			}, 20 );
		}
	},


	/**
	 * Update the DataTable after the user has selected what they want to do
	 *
	 * @param  {false|undefined} result Return from the `execute` method - can
	 *   be false internally to do nothing. This is not documented for plug-ins
	 *   and is used only by the cancel option.
	 * @param {array} cells Information about the selected cells from the key
	 *     up function, argumented with the set values
	 * @private
	 */
	_update: function ( result, cells )
	{
		// Do nothing on `false` return from an execute function
		if ( result === false ) {
			return;
		}

		var dt = this.s.dt;
		var cell;

		// Potentially allow modifications to the cells matrix
		this._emitEvent( 'preAutoFill', [ dt, cells ] );

		this._editor( cells );

		// Automatic updates are not performed if `update` is null and the
		// `editor` parameter is passed in - the reason being that Editor will
		// update the data once submitted
		var update = this.c.update !== null ?
			this.c.update :
			this.c.editor ?
				false :
				true;

		if ( update ) {
			for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
				for ( var j=0, jen=cells[i].length ; j<jen ; j++ ) {
					cell = cells[i][j];

					cell.cell.data( cell.set );
				}
			}

			dt.draw(false);
		}

		this._emitEvent( 'autoFill', [ dt, cells ] );
	}
} );


/**
 * AutoFill actions. The options here determine how AutoFill will fill the data
 * in the table when the user has selected a range of cells. Please see the
 * documentation on the DataTables site for full details on how to create plug-
 * ins.
 *
 * @type {Object}
 */
AutoFill.actions = {
	increment: {
		available: function ( dt, cells ) {
			return $.isNumeric( cells[0][0].label );
		},

		option: function ( dt, cells ) {
			return dt.i18n(
				'autoFill.increment',
				'Increment / decrement each cell by: <input type="number" value="1">'
			);
		},

		execute: function ( dt, cells, node ) {
			var value = cells[0][0].data * 1;
			var increment = $('input', node).val() * 1;

			for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
				for ( var j=0, jen=cells[i].length ; j<jen ; j++ ) {
					cells[i][j].set = value;

					value += increment;
				}
			}
		}
	},

	fill: {
		available: function ( dt, cells ) {
			return true;
		},

		option: function ( dt, cells ) {
			return dt.i18n('autoFill.fill', 'Fill all cells with <i>'+cells[0][0].label+'</i>' );
		},

		execute: function ( dt, cells, node ) {
			var value = cells[0][0].data;

			for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
				for ( var j=0, jen=cells[i].length ; j<jen ; j++ ) {
					cells[i][j].set = value;
				}
			}
		}
	},

	fillHorizontal: {
		available: function ( dt, cells ) {
			return cells.length > 1 && cells[0].length > 1;
		},

		option: function ( dt, cells ) {
			return dt.i18n('autoFill.fillHorizontal', 'Fill cells horizontally' );
		},

		execute: function ( dt, cells, node ) {
			for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
				for ( var j=0, jen=cells[i].length ; j<jen ; j++ ) {
					cells[i][j].set = cells[i][0].data;
				}
			}
		}
	},

	fillVertical: {
		available: function ( dt, cells ) {
			return cells.length > 1 && cells[0].length > 1;
		},

		option: function ( dt, cells ) {
			return dt.i18n('autoFill.fillVertical', 'Fill cells vertically' );
		},

		execute: function ( dt, cells, node ) {
			for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
				for ( var j=0, jen=cells[i].length ; j<jen ; j++ ) {
					cells[i][j].set = cells[0][j].data;
				}
			}
		}
	},

	// Special type that does not make itself available, but is added
	// automatically by AutoFill if a multi-choice list is shown. This allows
	// sensible code reuse
	cancel: {
		available: function () {
			return false;
		},

		option: function ( dt ) {
			return dt.i18n('autoFill.cancel', 'Cancel' );
		},

		execute: function () {
			return false;
		}
	}
};


/**
 * AutoFill version
 * 
 * @static
 * @type      String
 */
AutoFill.version = '2.1.2';


/**
 * AutoFill defaults
 * 
 * @namespace
 */
AutoFill.defaults = {
	/** @type {Boolean} Ask user what they want to do, even for a single option */
	alwaysAsk: false,

	/** @type {string|null} What will trigger a focus */
	focus: null, // focus, click, hover

	/** @type {column-selector} Columns to provide auto fill for */
	columns: '', // all

	/** @type {boolean|null} Update the cells after a drag */
	update: null, // false is editor given, true otherwise

	/** @type {DataTable.Editor} Editor instance for automatic submission */
	editor: null
};


/**
 * Classes used by AutoFill that are configurable
 * 
 * @namespace
 */
AutoFill.classes = {
	/** @type {String} Class used by the selection button */
	btn: 'btn'
};


// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on( 'preInit.dt.autofill', function (e, settings, json) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var init = settings.oInit.autoFill;
	var defaults = DataTable.defaults.autoFill;

	if ( init || defaults ) {
		var opts = $.extend( {}, init, defaults );

		if ( init !== false ) {
			new AutoFill( settings, opts  );
		}
	}
} );


// Alias for access
DataTable.AutoFill = AutoFill;
DataTable.AutoFill = AutoFill;


return AutoFill;
}));


/*! Bootstrap integration for DataTables' AutoFill
 * ©2015 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net-bs', 'datatables.net-autofill'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net-bs')(root, $).$;
			}

			if ( ! $.fn.dataTable.AutoFill ) {
				require('datatables.net-autofill')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


DataTable.AutoFill.classes.btn = 'btn btn-primary';


return DataTable;
}));

/*! Buttons for DataTables 1.2.1
 * ©2016 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


// Used for namespacing events added to the document by each instance, so they
// can be removed on destroy
var _instCounter = 0;

// Button namespacing counter for namespacing events on individual buttons
var _buttonCounter = 0;

var _dtButtons = DataTable.ext.buttons;

/**
 * [Buttons description]
 * @param {[type]}
 * @param {[type]}
 */
var Buttons = function( dt, config )
{
	// Allow a boolean true for defaults
	if ( config === true ) {
		config = {};
	}

	// For easy configuration of buttons an array can be given
	if ( $.isArray( config ) ) {
		config = { buttons: config };
	}

	this.c = $.extend( true, {}, Buttons.defaults, config );

	// Don't want a deep copy for the buttons
	if ( config.buttons ) {
		this.c.buttons = config.buttons;
	}

	this.s = {
		dt: new DataTable.Api( dt ),
		buttons: [],
		listenKeys: '',
		namespace: 'dtb'+(_instCounter++)
	};

	this.dom = {
		container: $('<'+this.c.dom.container.tag+'/>')
			.addClass( this.c.dom.container.className )
	};

	this._constructor();
};


$.extend( Buttons.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public methods
	 */

	/**
	 * Get the action of a button
	 * @param  {int|string} Button index
	 * @return {function}
	 *//**
	 * Set the action of a button
	 * @param  {node} node Button element
	 * @param  {function} action Function to set
	 * @return {Buttons} Self for chaining
	 */
	action: function ( node, action )
	{
		var button = this._nodeToButton( node );

		if ( action === undefined ) {
			return button.conf.action;
		}

		button.conf.action = action;

		return this;
	},

	/**
	 * Add an active class to the button to make to look active or get current
	 * active state.
	 * @param  {node} node Button element
	 * @param  {boolean} [flag] Enable / disable flag
	 * @return {Buttons} Self for chaining or boolean for getter
	 */
	active: function ( node, flag ) {
		var button = this._nodeToButton( node );
		var klass = this.c.dom.button.active;
		var jqNode = $(button.node);

		if ( flag === undefined ) {
			return jqNode.hasClass( klass );
		}

		jqNode.toggleClass( klass, flag === undefined ? true : flag );

		return this;
	},

	/**
	 * Add a new button
	 * @param {object} config Button configuration object, base string name or function
	 * @param {int|string} [idx] Button index for where to insert the button
	 * @return {Buttons} Self for chaining
	 */
	add: function ( config, idx )
	{
		var buttons = this.s.buttons;

		if ( typeof idx === 'string' ) {
			var split = idx.split('-');
			var base = this.s;

			for ( var i=0, ien=split.length-1 ; i<ien ; i++ ) {
				base = base.buttons[ split[i]*1 ];
			}

			buttons = base.buttons;
			idx = split[ split.length-1 ]*1;
		}

		this._expandButton( buttons, config, false, idx );
		this._draw();

		return this;
	},

	/**
	 * Get the container node for the buttons
	 * @return {jQuery} Buttons node
	 */
	container: function ()
	{
		return this.dom.container;
	},

	/**
	 * Disable a button
	 * @param  {node} node Button node
	 * @return {Buttons} Self for chaining
	 */
	disable: function ( node ) {
		var button = this._nodeToButton( node );

		$(button.node).addClass( this.c.dom.button.disabled );

		return this;
	},

	/**
	 * Destroy the instance, cleaning up event handlers and removing DOM
	 * elements
	 * @return {Buttons} Self for chaining
	 */
	destroy: function ()
	{
		// Key event listener
		$('body').off( 'keyup.'+this.s.namespace );

		// Individual button destroy (so they can remove their own events if
		// needed). Take a copy as the array is modified by `remove`
		var buttons = this.s.buttons.slice();
		var i, ien;
		
		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			this.remove( buttons[i].node );
		}

		// Container
		this.dom.container.remove();

		// Remove from the settings object collection
		var buttonInsts = this.s.dt.settings()[0];

		for ( i=0, ien=buttonInsts.length ; i<ien ; i++ ) {
			if ( buttonInsts.inst === this ) {
				buttonInsts.splice( i, 1 );
				break;
			}
		}

		return this;
	},

	/**
	 * Enable / disable a button
	 * @param  {node} node Button node
	 * @param  {boolean} [flag=true] Enable / disable flag
	 * @return {Buttons} Self for chaining
	 */
	enable: function ( node, flag )
	{
		if ( flag === false ) {
			return this.disable( node );
		}

		var button = this._nodeToButton( node );
		$(button.node).removeClass( this.c.dom.button.disabled );

		return this;
	},

	/**
	 * Get the instance name for the button set selector
	 * @return {string} Instance name
	 */
	name: function ()
	{
		return this.c.name;
	},

	/**
	 * Get a button's node
	 * @param  {node} node Button node
	 * @return {jQuery} Button element
	 */
	node: function ( node )
	{
		var button = this._nodeToButton( node );
		return $(button.node);
	},

	/**
	 * Remove a button.
	 * @param  {node} node Button node
	 * @return {Buttons} Self for chaining
	 */
	remove: function ( node )
	{
		var button = this._nodeToButton( node );
		var host = this._nodeToHost( node );
		var dt = this.s.dt;

		// Remove any child buttons first
		if ( button.buttons.length ) {
			for ( var i=button.buttons.length-1 ; i>=0 ; i-- ) {
				this.remove( button.buttons[i].node );
			}
		}

		// Allow the button to remove event handlers, etc
		if ( button.conf.destroy ) {
			button.conf.destroy.call( dt.button(node), dt, $(node), button.conf );
		}

		this._removeKey( button.conf );

		$(button.node).remove();

		var idx = $.inArray( button, host );
		host.splice( idx, 1 );

		return this;
	},

	/**
	 * Get the text for a button
	 * @param  {int|string} node Button index
	 * @return {string} Button text
	 *//**
	 * Set the text for a button
	 * @param  {int|string|function} node Button index
	 * @param  {string} label Text
	 * @return {Buttons} Self for chaining
	 */
	text: function ( node, label )
	{
		var button = this._nodeToButton( node );
		var buttonLiner = this.c.dom.collection.buttonLiner;
		var linerTag = button.inCollection && buttonLiner && buttonLiner.tag ?
			buttonLiner.tag :
			this.c.dom.buttonLiner.tag;
		var dt = this.s.dt;
		var jqNode = $(button.node);
		var text = function ( opt ) {
			return typeof opt === 'function' ?
				opt( dt, jqNode, button.conf ) :
				opt;
		};

		if ( label === undefined ) {
			return text( button.conf.text );
		}

		button.conf.text = label;

		if ( linerTag ) {
			jqNode.children( linerTag ).html( text(label) );
		}
		else {
			jqNode.html( text(label) );
		}

		return this;
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Buttons constructor
	 * @private
	 */
	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var dtSettings = dt.settings()[0];
		var buttons =  this.c.buttons;

		if ( ! dtSettings._buttons ) {
			dtSettings._buttons = [];
		}

		dtSettings._buttons.push( {
			inst: this,
			name: this.c.name
		} );

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			this.add( buttons[i] );
		}

		dt.on( 'destroy', function () {
			that.destroy();
		} );

		// Global key event binding to listen for button keys
		$('body').on( 'keyup.'+this.s.namespace, function ( e ) {
			if ( ! document.activeElement || document.activeElement === document.body ) {
				// SUse a string of characters for fast lookup of if we need to
				// handle this
				var character = String.fromCharCode(e.keyCode).toLowerCase();

				if ( that.s.listenKeys.toLowerCase().indexOf( character ) !== -1 ) {
					that._keypress( character, e );
				}
			}
		} );
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Add a new button to the key press listener
	 * @param {object} conf Resolved button configuration object
	 * @private
	 */
	_addKey: function ( conf )
	{
		if ( conf.key ) {
			this.s.listenKeys += $.isPlainObject( conf.key ) ?
				conf.key.key :
				conf.key;
		}
	},

	/**
	 * Insert the buttons into the container. Call without parameters!
	 * @param  {node} [container] Recursive only - Insert point
	 * @param  {array} [buttons] Recursive only - Buttons array
	 * @private
	 */
	_draw: function ( container, buttons )
	{
		if ( ! container ) {
			container = this.dom.container;
			buttons = this.s.buttons;
		}

		container.children().detach();

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			container.append( buttons[i].inserter );

			if ( buttons[i].buttons && buttons[i].buttons.length ) {
				this._draw( buttons[i].collection, buttons[i].buttons );
			}
		}
	},

	/**
	 * Create buttons from an array of buttons
	 * @param  {array} attachTo Buttons array to attach to
	 * @param  {object} button Button definition
	 * @param  {boolean} inCollection true if the button is in a collection
	 * @private
	 */
	_expandButton: function ( attachTo, button, inCollection, attachPoint )
	{
		var dt = this.s.dt;
		var buttonCounter = 0;
		var buttons = ! $.isArray( button ) ?
			[ button ] :
			button;

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			var conf = this._resolveExtends( buttons[i] );

			if ( ! conf ) {
				continue;
			}

			// If the configuration is an array, then expand the buttons at this
			// point
			if ( $.isArray( conf ) ) {
				this._expandButton( attachTo, conf, inCollection, attachPoint );
				continue;
			}

			var built = this._buildButton( conf, inCollection );
			if ( ! built ) {
				continue;
			}

			if ( attachPoint !== undefined ) {
				attachTo.splice( attachPoint, 0, built );
				attachPoint++;
			}
			else {
				attachTo.push( built );
			}

			if ( built.conf.buttons ) {
				var collectionDom = this.c.dom.collection;
				built.collection = $('<'+collectionDom.tag+'/>')
					.addClass( collectionDom.className );
				built.conf._collection = built.collection;

				this._expandButton( built.buttons, built.conf.buttons, true, attachPoint );
			}

			// init call is made here, rather than buildButton as it needs to
			// be selectable, and for that it needs to be in the buttons array
			if ( conf.init ) {
				conf.init.call( dt.button( built.node ), dt, $(built.node), conf );
			}

			buttonCounter++;
		}
	},

	/**
	 * Create an individual button
	 * @param  {object} config            Resolved button configuration
	 * @param  {boolean} inCollection `true` if a collection button
	 * @return {jQuery} Created button node (jQuery)
	 * @private
	 */
	_buildButton: function ( config, inCollection )
	{
		var buttonDom = this.c.dom.button;
		var linerDom = this.c.dom.buttonLiner;
		var collectionDom = this.c.dom.collection;
		var dt = this.s.dt;
		var text = function ( opt ) {
			return typeof opt === 'function' ?
				opt( dt, button, config ) :
				opt;
		};

		if ( inCollection && collectionDom.button ) {
			buttonDom = collectionDom.button;
		}

		if ( inCollection && collectionDom.buttonLiner ) {
			linerDom = collectionDom.buttonLiner;
		}

		// Make sure that the button is available based on whatever requirements
		// it has. For example, Flash buttons require Flash
		if ( config.available && ! config.available( dt, config ) ) {
			return false;
		}

		var action = function ( e, dt, button, config ) {
			config.action.call( dt.button( button ), e, dt, button, config );

			$(dt.table().node()).triggerHandler( 'buttons-action.dt', [
				dt.button( button ), dt, button, config 
			] );
		};

		var button = $('<'+buttonDom.tag+'/>')
			.addClass( buttonDom.className )
			.attr( 'tabindex', this.s.dt.settings()[0].iTabIndex )
			.attr( 'aria-controls', this.s.dt.table().node().id )
			.on( 'click.dtb', function (e) {
				e.preventDefault();

				if ( ! button.hasClass( buttonDom.disabled ) && config.action ) {
					action( e, dt, button, config );
				}

				button.blur();
			} )
			.on( 'keyup.dtb', function (e) {
				if ( e.keyCode === 13 ) {
					if ( ! button.hasClass( buttonDom.disabled ) && config.action ) {
						action( e, dt, button, config );
					}
				}
			} );

		// Make `a` tags act like a link
		if ( buttonDom.tag.toLowerCase() === 'a' ) {
			button.attr( 'href', '#' );
		}

		if ( linerDom.tag ) {
			var liner = $('<'+linerDom.tag+'/>')
				.html( text( config.text ) )
				.addClass( linerDom.className );

			if ( linerDom.tag.toLowerCase() === 'a' ) {
				liner.attr( 'href', '#' );
			}

			button.append( liner );
		}
		else {
			button.html( text( config.text ) );
		}

		if ( config.enabled === false ) {
			button.addClass( buttonDom.disabled );
		}

		if ( config.className ) {
			button.addClass( config.className );
		}

		if ( config.titleAttr ) {
			button.attr( 'title', config.titleAttr );
		}

		if ( ! config.namespace ) {
			config.namespace = '.dt-button-'+(_buttonCounter++);
		}

		var buttonContainer = this.c.dom.buttonContainer;
		var inserter;
		if ( buttonContainer && buttonContainer.tag ) {
			inserter = $('<'+buttonContainer.tag+'/>')
				.addClass( buttonContainer.className )
				.append( button );
		}
		else {
			inserter = button;
		}

		this._addKey( config );

		return {
			conf:         config,
			node:         button.get(0),
			inserter:     inserter,
			buttons:      [],
			inCollection: inCollection,
			collection:   null
		};
	},

	/**
	 * Get the button object from a node (recursive)
	 * @param  {node} node Button node
	 * @param  {array} [buttons] Button array, uses base if not defined
	 * @return {object} Button object
	 * @private
	 */
	_nodeToButton: function ( node, buttons )
	{
		if ( ! buttons ) {
			buttons = this.s.buttons;
		}

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			if ( buttons[i].node === node ) {
				return buttons[i];
			}

			if ( buttons[i].buttons.length ) {
				var ret = this._nodeToButton( node, buttons[i].buttons );

				if ( ret ) {
					return ret;
				}
			}
		}
	},

	/**
	 * Get container array for a button from a button node (recursive)
	 * @param  {node} node Button node
	 * @param  {array} [buttons] Button array, uses base if not defined
	 * @return {array} Button's host array
	 * @private
	 */
	_nodeToHost: function ( node, buttons )
	{
		if ( ! buttons ) {
			buttons = this.s.buttons;
		}

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			if ( buttons[i].node === node ) {
				return buttons;
			}

			if ( buttons[i].buttons.length ) {
				var ret = this._nodeToHost( node, buttons[i].buttons );

				if ( ret ) {
					return ret;
				}
			}
		}
	},

	/**
	 * Handle a key press - determine if any button's key configured matches
	 * what was typed and trigger the action if so.
	 * @param  {string} character The character pressed
	 * @param  {object} e Key event that triggered this call
	 * @private
	 */
	_keypress: function ( character, e )
	{
		var run = function ( conf, node ) {
			if ( ! conf.key ) {
				return;
			}

			if ( conf.key === character ) {
				$(node).click();
			}
			else if ( $.isPlainObject( conf.key ) ) {
				if ( conf.key.key !== character ) {
					return;
				}

				if ( conf.key.shiftKey && ! e.shiftKey ) {
					return;
				}

				if ( conf.key.altKey && ! e.altKey ) {
					return;
				}

				if ( conf.key.ctrlKey && ! e.ctrlKey ) {
					return;
				}

				if ( conf.key.metaKey && ! e.metaKey ) {
					return;
				}

				// Made it this far - it is good
				$(node).click();
			}
		};

		var recurse = function ( a ) {
			for ( var i=0, ien=a.length ; i<ien ; i++ ) {
				run( a[i].conf, a[i].node );

				if ( a[i].buttons.length ) {
					recurse( a[i].buttons );
				}
			}
		};

		recurse( this.s.buttons );
	},

	/**
	 * Remove a key from the key listener for this instance (to be used when a
	 * button is removed)
	 * @param  {object} conf Button configuration
	 * @private
	 */
	_removeKey: function ( conf )
	{
		if ( conf.key ) {
			var character = $.isPlainObject( conf.key ) ?
				conf.key.key :
				conf.key;

			// Remove only one character, as multiple buttons could have the
			// same listening key
			var a = this.s.listenKeys.split('');
			var idx = $.inArray( character, a );
			a.splice( idx, 1 );
			this.s.listenKeys = a.join('');
		}
	},

	/**
	 * Resolve a button configuration
	 * @param  {string|function|object} conf Button config to resolve
	 * @return {object} Button configuration
	 * @private
	 */
	_resolveExtends: function ( conf )
	{
		var dt = this.s.dt;
		var i, ien;
		var toConfObject = function ( base ) {
			var loop = 0;

			// Loop until we have resolved to a button configuration, or an
			// array of button configurations (which will be iterated
			// separately)
			while ( ! $.isPlainObject(base) && ! $.isArray(base) ) {
				if ( base === undefined ) {
					return;
				}

				if ( typeof base === 'function' ) {
					base = base( dt, conf );

					if ( ! base ) {
						return false;
					}
				}
				else if ( typeof base === 'string' ) {
					if ( ! _dtButtons[ base ] ) {
						throw 'Unknown button type: '+base;
					}

					base = _dtButtons[ base ];
				}

				loop++;
				if ( loop > 30 ) {
					// Protect against misconfiguration killing the browser
					throw 'Buttons: Too many iterations';
				}
			}

			return $.isArray( base ) ?
				base :
				$.extend( {}, base );
		};

		conf = toConfObject( conf );

		while ( conf && conf.extend ) {
			// Use `toConfObject` in case the button definition being extended
			// is itself a string or a function
			if ( ! _dtButtons[ conf.extend ] ) {
				throw 'Cannot extend unknown button type: '+conf.extend;
			}

			var objArray = toConfObject( _dtButtons[ conf.extend ] );
			if ( $.isArray( objArray ) ) {
				return objArray;
			}
			else if ( ! objArray ) {
				// This is a little brutal as it might be possible to have a
				// valid button without the extend, but if there is no extend
				// then the host button would be acting in an undefined state
				return false;
			}

			// Stash the current class name
			var originalClassName = objArray.className;

			conf = $.extend( {}, objArray, conf );

			// The extend will have overwritten the original class name if the
			// `conf` object also assigned a class, but we want to concatenate
			// them so they are list that is combined from all extended buttons
			if ( originalClassName && conf.className !== originalClassName ) {
				conf.className = originalClassName+' '+conf.className;
			}

			// Buttons to be added to a collection  -gives the ability to define
			// if buttons should be added to the start or end of a collection
			var postfixButtons = conf.postfixButtons;
			if ( postfixButtons ) {
				if ( ! conf.buttons ) {
					conf.buttons = [];
				}

				for ( i=0, ien=postfixButtons.length ; i<ien ; i++ ) {
					conf.buttons.push( postfixButtons[i] );
				}

				conf.postfixButtons = null;
			}

			var prefixButtons = conf.prefixButtons;
			if ( prefixButtons ) {
				if ( ! conf.buttons ) {
					conf.buttons = [];
				}

				for ( i=0, ien=prefixButtons.length ; i<ien ; i++ ) {
					conf.buttons.splice( i, 0, prefixButtons[i] );
				}

				conf.prefixButtons = null;
			}

			// Although we want the `conf` object to overwrite almost all of
			// the properties of the object being extended, the `extend`
			// property should come from the object being extended
			conf.extend = objArray.extend;
		}

		return conf;
	}
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Statics
 */

/**
 * Show / hide a background layer behind a collection
 * @param  {boolean} Flag to indicate if the background should be shown or
 *   hidden 
 * @param  {string} Class to assign to the background
 * @static
 */
Buttons.background = function ( show, className, fade ) {
	if ( fade === undefined ) {
		fade = 400;
	}

	if ( show ) {
		$('<div/>')
			.addClass( className )
			.css( 'display', 'none' )
			.appendTo( 'body' )
			.fadeIn( fade );
	}
	else {
		$('body > div.'+className)
			.fadeOut( fade, function () {
				$(this).remove();
			} );
	}
};

/**
 * Instance selector - select Buttons instances based on an instance selector
 * value from the buttons assigned to a DataTable. This is only useful if
 * multiple instances are attached to a DataTable.
 * @param  {string|int|array} Instance selector - see `instance-selector`
 *   documentation on the DataTables site
 * @param  {array} Button instance array that was attached to the DataTables
 *   settings object
 * @return {array} Buttons instances
 * @static
 */
Buttons.instanceSelector = function ( group, buttons )
{
	if ( ! group ) {
		return $.map( buttons, function ( v ) {
			return v.inst;
		} );
	}

	var ret = [];
	var names = $.map( buttons, function ( v ) {
		return v.name;
	} );

	// Flatten the group selector into an array of single options
	var process = function ( input ) {
		if ( $.isArray( input ) ) {
			for ( var i=0, ien=input.length ; i<ien ; i++ ) {
				process( input[i] );
			}
			return;
		}

		if ( typeof input === 'string' ) {
			if ( input.indexOf( ',' ) !== -1 ) {
				// String selector, list of names
				process( input.split(',') );
			}
			else {
				// String selector individual name
				var idx = $.inArray( $.trim(input), names );

				if ( idx !== -1 ) {
					ret.push( buttons[ idx ].inst );
				}
			}
		}
		else if ( typeof input === 'number' ) {
			// Index selector
			ret.push( buttons[ input ].inst );
		}
	};
	
	process( group );

	return ret;
};

/**
 * Button selector - select one or more buttons from a selector input so some
 * operation can be performed on them.
 * @param  {array} Button instances array that the selector should operate on
 * @param  {string|int|node|jQuery|array} Button selector - see
 *   `button-selector` documentation on the DataTables site
 * @return {array} Array of objects containing `inst` and `idx` properties of
 *   the selected buttons so you know which instance each button belongs to.
 * @static
 */
Buttons.buttonSelector = function ( insts, selector )
{
	var ret = [];
	var nodeBuilder = function ( a, buttons, baseIdx ) {
		var button;
		var idx;

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( button ) {
				idx = baseIdx !== undefined ?
					baseIdx+i :
					i+'';

				a.push( {
					node: button.node,
					name: button.conf.name,
					idx:  idx
				} );

				if ( button.buttons ) {
					nodeBuilder( a, button.buttons, idx+'-' );
				}
			}
		}
	};

	var run = function ( selector, inst ) {
		var i, ien;
		var buttons = [];
		nodeBuilder( buttons, inst.s.buttons );

		var nodes = $.map( buttons, function (v) {
			return v.node;
		} );

		if ( $.isArray( selector ) || selector instanceof $ ) {
			for ( i=0, ien=selector.length ; i<ien ; i++ ) {
				run( selector[i], inst );
			}
			return;
		}

		if ( selector === null || selector === undefined || selector === '*' ) {
			// Select all
			for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
				ret.push( {
					inst: inst,
					node: buttons[i].node
				} );
			}
		}
		else if ( typeof selector === 'number' ) {
			// Main button index selector
			ret.push( {
				inst: inst,
				node: inst.s.buttons[ selector ].node
			} );
		}
		else if ( typeof selector === 'string' ) {
			if ( selector.indexOf( ',' ) !== -1 ) {
				// Split
				var a = selector.split(',');

				for ( i=0, ien=a.length ; i<ien ; i++ ) {
					run( $.trim(a[i]), inst );
				}
			}
			else if ( selector.match( /^\d+(\-\d+)*$/ ) ) {
				// Sub-button index selector
				var indexes = $.map( buttons, function (v) {
					return v.idx;
				} );

				ret.push( {
					inst: inst,
					node: buttons[ $.inArray( selector, indexes ) ].node
				} );
			}
			else if ( selector.indexOf( ':name' ) !== -1 ) {
				// Button name selector
				var name = selector.replace( ':name', '' );

				for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
					if ( buttons[i].name === name ) {
						ret.push( {
							inst: inst,
							node: buttons[i].node
						} );
					}
				}
			}
			else {
				// jQuery selector on the nodes
				$( nodes ).filter( selector ).each( function () {
					ret.push( {
						inst: inst,
						node: this
					} );
				} );
			}
		}
		else if ( typeof selector === 'object' && selector.nodeName ) {
			// Node selector
			var idx = $.inArray( selector, nodes );

			if ( idx !== -1 ) {
				ret.push( {
					inst: inst,
					node: nodes[ idx ]
				} );
			}
		}
	};


	for ( var i=0, ien=insts.length ; i<ien ; i++ ) {
		var inst = insts[i];

		run( selector, inst );
	}

	return ret;
};


/**
 * Buttons defaults. For full documentation, please refer to the docs/option
 * directory or the DataTables site.
 * @type {Object}
 * @static
 */
Buttons.defaults = {
	buttons: [ 'copy', 'excel', 'csv', 'pdf', 'print' ],
	name: 'main',
	tabIndex: 0,
	dom: {
		container: {
			tag: 'div',
			className: 'dt-buttons'
		},
		collection: {
			tag: 'div',
			className: 'dt-button-collection'
		},
		button: {
			tag: 'a',
			className: 'dt-button',
			active: 'active',
			disabled: 'disabled'
		},
		buttonLiner: {
			tag: 'span',
			className: ''
		}
	}
};

/**
 * Version information
 * @type {string}
 * @static
 */
Buttons.version = '1.2.1';


$.extend( _dtButtons, {
	collection: {
		text: function ( dt ) {
			return dt.i18n( 'buttons.collection', 'Collection' );
		},
		className: 'buttons-collection',
		action: function ( e, dt, button, config ) {
			var host = button;
			var hostOffset = host.offset();
			var tableContainer = $( dt.table().container() );
			var multiLevel = false;

			// Remove any old collection
			if ( $('div.dt-button-background').length ) {
				multiLevel = $('div.dt-button-collection').offset();
				$('body').trigger( 'click.dtb-collection' );
			}

			config._collection
				.addClass( config.collectionLayout )
				.css( 'display', 'none' )
				.appendTo( 'body' )
				.fadeIn( config.fade );

			var position = config._collection.css( 'position' );

			if ( multiLevel && position === 'absolute' ) {
				config._collection.css( {
					top: multiLevel.top + 5, // magic numbers for a little offset
					left: multiLevel.left + 5
				} );
			}
			else if ( position === 'absolute' ) {
				config._collection.css( {
					top: hostOffset.top + host.outerHeight(),
					left: hostOffset.left
				} );

				var listRight = hostOffset.left + config._collection.outerWidth();
				var tableRight = tableContainer.offset().left + tableContainer.width();
				if ( listRight > tableRight ) {
					config._collection.css( 'left', hostOffset.left - ( listRight - tableRight ) );
				}
			}
			else {
				// Fix position - centre on screen
				var top = config._collection.height() / 2;
				if ( top > $(window).height() / 2 ) {
					top = $(window).height() / 2;
				}

				config._collection.css( 'marginTop', top*-1 );
			}

			if ( config.background ) {
				Buttons.background( true, config.backgroundClassName, config.fade );
			}

			// Need to break the 'thread' for the collection button being
			// activated by a click - it would also trigger this event
			setTimeout( function () {
				// This is bonkers, but if we don't have a click listener on the
				// background element, iOS Safari will ignore the body click
				// listener below. An empty function here is all that is
				// required to make it work...
				$('div.dt-button-background').on( 'click.dtb-collection', function () {} );

				$('body').on( 'click.dtb-collection', function (e) {
					if ( ! $(e.target).parents().andSelf().filter( config._collection ).length ) {
						config._collection
							.fadeOut( config.fade, function () {
								config._collection.detach();
							} );

						$('div.dt-button-background').off( 'click.dtb-collection' );
						Buttons.background( false, config.backgroundClassName, config.fade );

						$('body').off( 'click.dtb-collection' );
						dt.off( 'buttons-action.b-internal' );
					}
				} );
			}, 10 );

			if ( config.autoClose ) {
				dt.on( 'buttons-action.b-internal', function () {
					$('div.dt-button-background').click();
				} );
			}
		},
		background: true,
		collectionLayout: '',
		backgroundClassName: 'dt-button-background',
		autoClose: false,
		fade: 400
	},
	copy: function ( dt, conf ) {
		if ( _dtButtons.copyHtml5 ) {
			return 'copyHtml5';
		}
		if ( _dtButtons.copyFlash && _dtButtons.copyFlash.available( dt, conf ) ) {
			return 'copyFlash';
		}
	},
	csv: function ( dt, conf ) {
		// Common option that will use the HTML5 or Flash export buttons
		if ( _dtButtons.csvHtml5 && _dtButtons.csvHtml5.available( dt, conf ) ) {
			return 'csvHtml5';
		}
		if ( _dtButtons.csvFlash && _dtButtons.csvFlash.available( dt, conf ) ) {
			return 'csvFlash';
		}
	},
	excel: function ( dt, conf ) {
		// Common option that will use the HTML5 or Flash export buttons
		if ( _dtButtons.excelHtml5 && _dtButtons.excelHtml5.available( dt, conf ) ) {
			return 'excelHtml5';
		}
		if ( _dtButtons.excelFlash && _dtButtons.excelFlash.available( dt, conf ) ) {
			return 'excelFlash';
		}
	},
	pdf: function ( dt, conf ) {
		// Common option that will use the HTML5 or Flash export buttons
		if ( _dtButtons.pdfHtml5 && _dtButtons.pdfHtml5.available( dt, conf ) ) {
			return 'pdfHtml5';
		}
		if ( _dtButtons.pdfFlash && _dtButtons.pdfFlash.available( dt, conf ) ) {
			return 'pdfFlash';
		}
	},
	pageLength: function ( dt ) {
		var lengthMenu = dt.settings()[0].aLengthMenu;
		var vals = $.isArray( lengthMenu[0] ) ? lengthMenu[0] : lengthMenu;
		var lang = $.isArray( lengthMenu[0] ) ? lengthMenu[1] : lengthMenu;
		var text = function ( dt ) {
			return dt.i18n( 'buttons.pageLength', {
				"-1": 'Show all rows',
				_:    'Show %d rows'
			}, dt.page.len() );
		};

		return {
			extend: 'collection',
			text: text,
			className: 'buttons-page-length',
			autoClose: true,
			buttons: $.map( vals, function ( val, i ) {
				return {
					text: lang[i],
					action: function ( e, dt ) {
						dt.page.len( val ).draw();
					},
					init: function ( dt, node, conf ) {
						var that = this;
						var fn = function () {
							that.active( dt.page.len() === val );
						};

						dt.on( 'length.dt'+conf.namespace, fn );
						fn();
					},
					destroy: function ( dt, node, conf ) {
						dt.off( 'length.dt'+conf.namespace );
					}
				};
			} ),
			init: function ( dt, node, conf ) {
				var that = this;
				dt.on( 'length.dt'+conf.namespace, function () {
					that.text( text( dt ) );
				} );
			},
			destroy: function ( dt, node, conf ) {
				dt.off( 'length.dt'+conf.namespace );
			}
		};
	}
} );


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API
 *
 * For complete documentation, please refer to the docs/api directory or the
 * DataTables site
 */

// Buttons group and individual button selector
DataTable.Api.register( 'buttons()', function ( group, selector ) {
	// Argument shifting
	if ( selector === undefined ) {
		selector = group;
		group = undefined;
	}

	return this.iterator( true, 'table', function ( ctx ) {
		if ( ctx._buttons ) {
			return Buttons.buttonSelector(
				Buttons.instanceSelector( group, ctx._buttons ),
				selector
			);
		}
	}, true );
} );

// Individual button selector
DataTable.Api.register( 'button()', function ( group, selector ) {
	// just run buttons() and truncate
	var buttons = this.buttons( group, selector );

	if ( buttons.length > 1 ) {
		buttons.splice( 1, buttons.length );
	}

	return buttons;
} );

// Active buttons
DataTable.Api.registerPlural( 'buttons().active()', 'button().active()', function ( flag ) {
	if ( flag === undefined ) {
		return this.map( function ( set ) {
			return set.inst.active( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.active( set.node, flag );
	} );
} );

// Get / set button action
DataTable.Api.registerPlural( 'buttons().action()', 'button().action()', function ( action ) {
	if ( action === undefined ) {
		return this.map( function ( set ) {
			return set.inst.action( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.action( set.node, action );
	} );
} );

// Enable / disable buttons
DataTable.Api.register( ['buttons().enable()', 'button().enable()'], function ( flag ) {
	return this.each( function ( set ) {
		set.inst.enable( set.node, flag );
	} );
} );

// Disable buttons
DataTable.Api.register( ['buttons().disable()', 'button().disable()'], function () {
	return this.each( function ( set ) {
		set.inst.disable( set.node );
	} );
} );

// Get button nodes
DataTable.Api.registerPlural( 'buttons().nodes()', 'button().node()', function () {
	var jq = $();

	// jQuery will automatically reduce duplicates to a single entry
	$( this.each( function ( set ) {
		jq = jq.add( set.inst.node( set.node ) );
	} ) );

	return jq;
} );

// Get / set button text (i.e. the button labels)
DataTable.Api.registerPlural( 'buttons().text()', 'button().text()', function ( label ) {
	if ( label === undefined ) {
		return this.map( function ( set ) {
			return set.inst.text( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.text( set.node, label );
	} );
} );

// Trigger a button's action
DataTable.Api.registerPlural( 'buttons().trigger()', 'button().trigger()', function () {
	return this.each( function ( set ) {
		set.inst.node( set.node ).trigger( 'click' );
	} );
} );

// Get the container elements for the button sets selected
DataTable.Api.registerPlural( 'buttons().containers()', 'buttons().container()', function () {
	var jq = $();

	// jQuery will automatically reduce duplicates to a single entry
	$( this.each( function ( set ) {
		jq = jq.add( set.inst.container() );
	} ) );

	return jq;
} );

// Add a new button
DataTable.Api.register( 'button().add()', function ( idx, conf ) {
	if ( this.length === 1 ) {
		this[0].inst.add( conf, idx );
	}

	return this.button( idx );
} );

// Destroy the button sets selected
DataTable.Api.register( 'buttons().destroy()', function () {
	this.pluck( 'inst' ).unique().each( function ( inst ) {
		inst.destroy();
	} );

	return this;
} );

// Remove a button
DataTable.Api.registerPlural( 'buttons().remove()', 'buttons().remove()', function () {
	this.each( function ( set ) {
		set.inst.remove( set.node );
	} );

	return this;
} );

// Information box that can be used by buttons
var _infoTimer;
DataTable.Api.register( 'buttons.info()', function ( title, message, time ) {
	var that = this;

	if ( title === false ) {
		$('#datatables_buttons_info').fadeOut( function () {
			$(this).remove();
		} );
		clearTimeout( _infoTimer );
		_infoTimer = null;

		return this;
	}

	if ( _infoTimer ) {
		clearTimeout( _infoTimer );
	}

	if ( $('#datatables_buttons_info').length ) {
		$('#datatables_buttons_info').remove();
	}

	title = title ? '<h2>'+title+'</h2>' : '';

	$('<div id="datatables_buttons_info" class="dt-button-info"/>')
		.html( title )
		.append( $('<div/>')[ typeof message === 'string' ? 'html' : 'append' ]( message ) )
		.css( 'display', 'none' )
		.appendTo( 'body' )
		.fadeIn();

	if ( time !== undefined && time !== 0 ) {
		_infoTimer = setTimeout( function () {
			that.buttons.info( false );
		}, time );
	}

	return this;
} );

// Get data from the table for export - this is common to a number of plug-in
// buttons so it is included in the Buttons core library
DataTable.Api.register( 'buttons.exportData()', function ( options ) {
	if ( this.context.length ) {
		return _exportData( new DataTable.Api( this.context[0] ), options );
	}
} );


var _exportTextarea = $('<textarea/>')[0];
var _exportData = function ( dt, inOpts )
{
	var config = $.extend( true, {}, {
		rows:           null,
		columns:        '',
		modifier:       {
			search: 'applied',
			order:  'applied'
		},
		orthogonal:     'display',
		stripHtml:      true,
		stripNewlines:  true,
		decodeEntities: true,
		trim:           true,
		format:         {
			header: function ( d ) {
				return strip( d );
			},
			footer: function ( d ) {
				return strip( d );
			},
			body: function ( d ) {
				return strip( d );
			}
		}
	}, inOpts );

	var strip = function ( str ) {
		if ( typeof str !== 'string' ) {
			return str;
		}

		if ( config.stripHtml ) {
			str = str.replace( /<[^>]*>/g, '' );
		}

		if ( config.trim ) {
			str = str.replace( /^\s+|\s+$/g, '' );
		}

		if ( config.stripNewlines ) {
			str = str.replace( /\n/g, ' ' );
		}

		if ( config.decodeEntities ) {
			_exportTextarea.innerHTML = str;
			str = _exportTextarea.value;
		}

		return str;
	};


	var header = dt.columns( config.columns ).indexes().map( function (idx) {
		return config.format.header( dt.column( idx ).header().innerHTML, idx );
	} ).toArray();

	var footer = dt.table().footer() ?
		dt.columns( config.columns ).indexes().map( function (idx) {
			var el = dt.column( idx ).footer();
			return config.format.footer( el ? el.innerHTML : '', idx );
		} ).toArray() :
		null;

	var rowIndexes = dt.rows( config.rows, config.modifier ).indexes().toArray();
	var cells = dt
		.cells( rowIndexes, config.columns )
		.render( config.orthogonal )
		.toArray();
	var columns = header.length;
	var rows = columns > 0 ? cells.length / columns : 0;
	var body = new Array( rows );
	var cellCounter = 0;

	for ( var i=0, ien=rows ; i<ien ; i++ ) {
		var row = new Array( columns );

		for ( var j=0 ; j<columns ; j++ ) {
			row[j] = config.format.body( cells[ cellCounter ], j, i );
			cellCounter++;
		}

		body[i] = row;
	}

	return {
		header: header,
		footer: footer,
		body:   body
	};
};


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables interface
 */

// Attach to DataTables objects for global access
$.fn.dataTable.Buttons = Buttons;
$.fn.DataTable.Buttons = Buttons;



// DataTables creation - check if the buttons have been defined for this table,
// they will have been if the `B` option was used in `dom`, otherwise we should
// create the buttons instance here so they can be inserted into the document
// using the API. Listen for `init` for compatibility with pre 1.10.10, but to
// be removed in future.
$(document).on( 'init.dt plugin-init.dt', function (e, settings) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var opts = settings.oInit.buttons || DataTable.defaults.buttons;

	if ( opts && ! settings._buttons ) {
		new Buttons( settings, opts ).container();
	}
} );

// DataTables `dom` feature option
DataTable.ext.feature.push( {
	fnInit: function( settings ) {
		var api = new DataTable.Api( settings );
		var opts = api.init().buttons || DataTable.defaults.buttons;

		return new Buttons( api, opts ).container();
	},
	cFeature: "B"
} );


return Buttons;
}));


/*! Bootstrap integration for DataTables' Buttons
 * ©2016 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net-bs', 'datatables.net-buttons'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net-bs')(root, $).$;
			}

			if ( ! $.fn.dataTable.Buttons ) {
				require('datatables.net-buttons')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


$.extend( true, DataTable.Buttons.defaults, {
	dom: {
		container: {
			className: 'dt-buttons btn-group'
		},
		button: {
			className: 'btn btn-default'
		},
		collection: {
			tag: 'ul',
			className: 'dt-button-collection dropdown-menu',
			button: {
				tag: 'li',
				className: 'dt-button'
			},
			buttonLiner: {
				tag: 'a',
				className: ''
			}
		}
	}
} );

DataTable.ext.buttons.collection.text = function ( dt ) {
	return dt.i18n('buttons.collection', 'Collection <span class="caret"/>');
};


return DataTable.Buttons;
}));


/*!
 * File:        dataTables.editor.min.js
 * Version:     1.5.6
 * Author:      SpryMedia (www.sprymedia.co.uk)
 * Info:        http://editor.datatables.net
 * 
 * Copyright 2012-2016 SpryMedia Limited, all rights reserved.
 * License: DataTables Editor - http://editor.datatables.net/license
 */
var H6t={'c2':"jq",'r9':"ble",'m5':"data",'Q3c':(function(L3c){return (function(N3c,x3c){return (function(v3c){return {m3c:v3c,E3c:v3c,}
;}
)(function(c3c){var G3c,r3c=0;for(var J3c=N3c;r3c<c3c["length"];r3c++){var a3c=x3c(c3c,r3c);G3c=r3c===0?a3c:G3c^a3c;}
return G3c?J3c:!J3c;}
);}
)((function(O3c,w3c,A3c,W3c){var X3c=28;return O3c(L3c,X3c)-W3c(w3c,A3c)>X3c;}
)(parseInt,Date,(function(w3c){return (''+w3c)["substring"](1,(w3c+'')["length"]-1);}
)('_getTime2'),function(w3c,A3c){return new w3c()[A3c]();}
),function(c3c,r3c){var j3c=parseInt(c3c["charAt"](r3c),16)["toString"](2);return j3c["charAt"](j3c["length"]-1);}
);}
)('3op1mo4bc'),'I4f':"ct",'J1':"dat",'X8y':"s",'a7y':"do",'M2':"et",'y8y':"r",'z1y':"l",'A1y':"n",'c4':"a",'P5f':"function",'X5y':"j",'D4':"b",'e0f':".",'P8':"T",'L3y':"t",'t3y':"fn",'D2':"e",'j1f':"ue"}
;H6t.J8c=function(e){if(H6t&&e)return H6t.Q3c.E3c(e);}
;H6t.x8c=function(i){if(H6t&&i)return H6t.Q3c.E3c(i);}
;H6t.G8c=function(d){if(H6t&&d)return H6t.Q3c.m3c(d);}
;H6t.W8c=function(b){while(b)return H6t.Q3c.E3c(b);}
;H6t.X8c=function(e){while(e)return H6t.Q3c.m3c(e);}
;H6t.w8c=function(c){while(c)return H6t.Q3c.E3c(c);}
;H6t.A8c=function(c){for(;H6t;)return H6t.Q3c.m3c(c);}
;H6t.Q8c=function(k){if(H6t&&k)return H6t.Q3c.E3c(k);}
;H6t.I8c=function(l){if(H6t&&l)return H6t.Q3c.E3c(l);}
;H6t.R8c=function(b){if(H6t&&b)return H6t.Q3c.m3c(b);}
;H6t.B8c=function(d){if(H6t&&d)return H6t.Q3c.E3c(d);}
;H6t.p8c=function(d){if(H6t&&d)return H6t.Q3c.m3c(d);}
;H6t.y8c=function(h){if(H6t&&h)return H6t.Q3c.m3c(h);}
;H6t.l8c=function(a){if(H6t&&a)return H6t.Q3c.m3c(a);}
;H6t.U8c=function(k){if(H6t&&k)return H6t.Q3c.E3c(k);}
;H6t.t8c=function(i){if(H6t&&i)return H6t.Q3c.E3c(i);}
;H6t.T3c=function(n){if(H6t&&n)return H6t.Q3c.E3c(n);}
;H6t.d3c=function(i){if(H6t&&i)return H6t.Q3c.m3c(i);}
;H6t.Y3c=function(g){for(;H6t;)return H6t.Q3c.m3c(g);}
;H6t.z3c=function(b){if(H6t&&b)return H6t.Q3c.E3c(b);}
;H6t.e3c=function(f){for(;H6t;)return H6t.Q3c.E3c(f);}
;H6t.g3c=function(m){while(m)return H6t.Q3c.E3c(m);}
;H6t.b3c=function(i){if(H6t&&i)return H6t.Q3c.m3c(i);}
;H6t.H3c=function(i){if(H6t&&i)return H6t.Q3c.E3c(i);}
;H6t.V3c=function(i){if(H6t&&i)return H6t.Q3c.E3c(i);}
;H6t.F3c=function(f){for(;H6t;)return H6t.Q3c.E3c(f);}
;(function(d){var e2=H6t.F3c("aec")?"u":"expo",P3=H6t.V3c("ff")?"oApi":"ob",s7D=H6t.H3c("7f")?"_optionsTime":"ry";"function"===typeof define&&define.amd?define([(H6t.c2+H6t.j1f+s7D),(H6t.m5+H6t.L3y+H6t.c4+H6t.r9+H6t.X8y+H6t.e0f+H6t.A1y+H6t.M2)],function(j){return d(j,window,document);}
):(P3+H6t.X5y+H6t.D2+H6t.I4f)===typeof exports?module[(e2+H6t.y8y+H6t.L3y+H6t.X8y)]=function(j,q){H6t.f3c=function(g){if(H6t&&g)return H6t.Q3c.E3c(g);}
;var R3f=H6t.b3c("2571")?"cume":"submit",J5D=H6t.g3c("67e")?"$":"active";j||(j=window);if(!q||!q[(H6t.t3y)][(H6t.J1+H6t.c4+H6t.P8+H6t.c4+H6t.D4+H6t.z1y+H6t.D2)])q=H6t.f3c("c7ad")?'" /></div></div><div class="row second"><div class="cell"><div class="drop"><span/></div></div><div class="cell"><div class="rendered"/></div></div></div></div>':require("datatables.net")(j,q)[J5D];return d(q,j,j[(H6t.a7y+R3f+H6t.A1y+H6t.L3y)]);}
:d(jQuery,window,document);}
)(function(d,j,q,h){H6t.a8c=function(b){for(;H6t;)return H6t.Q3c.m3c(b);}
;H6t.O8c=function(f){for(;H6t;)return H6t.Q3c.m3c(f);}
;H6t.L8c=function(k){while(k)return H6t.Q3c.m3c(k);}
;H6t.r8c=function(a){if(H6t&&a)return H6t.Q3c.E3c(a);}
;H6t.c8c=function(e){if(H6t&&e)return H6t.Q3c.m3c(e);}
;H6t.j8c=function(b){if(H6t&&b)return H6t.Q3c.E3c(b);}
;H6t.m8c=function(h){for(;H6t;)return H6t.Q3c.E3c(h);}
;H6t.k8c=function(d){for(;H6t;)return H6t.Q3c.E3c(d);}
;H6t.s8c=function(m){while(m)return H6t.Q3c.E3c(m);}
;H6t.S8c=function(d){for(;H6t;)return H6t.Q3c.m3c(d);}
;H6t.P8c=function(m){if(H6t&&m)return H6t.Q3c.m3c(m);}
;H6t.D8c=function(k){while(k)return H6t.Q3c.E3c(k);}
;H6t.u8c=function(c){while(c)return H6t.Q3c.E3c(c);}
;H6t.Z3c=function(n){for(;H6t;)return H6t.Q3c.m3c(n);}
;H6t.M3c=function(b){while(b)return H6t.Q3c.E3c(b);}
;H6t.q3c=function(e){if(H6t&&e)return H6t.Q3c.m3c(e);}
;H6t.h3c=function(b){if(H6t&&b)return H6t.Q3c.E3c(b);}
;H6t.i3c=function(c){while(c)return H6t.Q3c.m3c(c);}
;H6t.o3c=function(i){while(i)return H6t.Q3c.m3c(i);}
;H6t.K3c=function(m){for(;H6t;)return H6t.Q3c.E3c(m);}
;H6t.n3c=function(k){if(H6t&&k)return H6t.Q3c.E3c(k);}
;var Y7D=H6t.n3c("f1")?'</div><div data-dte-e="msg-error" class="':"6",B6D=H6t.e3c("ebb8")?"Next":"5",j3f="sion",C2="Edi",A5y="editorFields",Z2f=H6t.K3c("3b4")?"edit":"dM",e5y=H6t.z3c("6112")?"conf":"fieldTypes",j6f=H6t.o3c("45")?"eti":"module",B3f=H6t.i3c("bbfb")?"append":"datepicker",H6="pic",d5D=H6t.Y3c("a1")?"epi":"formTitle",p5D="#",X3y="epic",v6D="ked",Q6f="radio",u1D=H6t.h3c("ba5")?"liner":"ri",L4D="checkbox",S7y=" />",z1f="_v",I9f="tend",M6y="box",Y5f="fin",i5f=H6t.d3c("eb")?"npu":"prototype",e8y=H6t.q3c("a16")?"separator":"multiInfo",C7f=H6t.M3c("5f3")?"_lastSet":"modifier",y6="af",f2f=H6t.Z3c("eb1")?"slideDown":"placeholder",e0y="exten",K5="xta",G2y=H6t.T3c("42a")?"heightCalc":"ssword",p3f="safeId",M7D="/>",W3=H6t.t8c("44c8")?"parents":"_inp",z3y="readonly",I0=H6t.u8c("c3f")?"entityDecode":"_val",c0=H6t.D8c("e62")?"placeholderValue":"den",K7y=false,o3y="disabled",X9y="prop",m4D="_input",T8f=H6t.U8c("ea2a")?"_lastSet":"_i",k1="ypes",R1="cha",B5y=H6t.l8c("13")?"w":"call",I5y="Ty",v4D="div.rendered",u3c=H6t.y8c("af")?"Upl":"background",b6='" /><',g5D=H6t.P8c("426d")?"_in":"field",a4f=H6t.p8c("acb")?"Tex":"ajaxUrl",C3D=H6t.S8c("47a8")?"tet":"getUTCHours",K6f="defa",w3f=H6t.B8c("bc")?"YYYY":"labels",C7D=H6t.s8c("5f")?"sButtonText":"atet",m0D=H6t.R8c("875")?"fieldMessage":"ults",G9y="_instance",I7y=H6t.k8c("a7")?"DateTi":"multiRestore",y8D=H6t.I8c("3f8")?"multi":"2",t9y="_optionSet",V4="tU",h4y="left",p4=H6t.Q8c("8635")?"label":"nge",h0f=H6t.m8c("bb6a")?"checkbox":"text",Z6y="push",T0="ek",T6y="firstDay",v1y=H6t.j8c("26c")?"processing":"getUTCDay",n2D='utton',g9f="_pad",O5f="getSeconds",w4D=H6t.c8c("5b")?"c":"getUTCFullYear",X6f=H6t.r8c("2b")?"_h":"_scrollTop",s5="day",B8f="month",g9D=H6t.A8c("bcc2")?"Ful":"readAsDataURL",a2="change",b5f=H6t.w8c("4c")?"container":"Mo",F5f="getUTCMonth",W="ga",V=H6t.X8c("55b")?"_position":"I",r5="setSeconds",H5f="setUTCHours",Z5y="UT",q2="nput",Q6y=H6t.L8c("ffc")?"ipOpts":"pm",A8f="_o",S8y="ours",F6y="Ti",I0f="ime",o9D=H6t.O8c("4a")?"replace":"parts",X2="18n",V6D="classPrefix",v2f="_setTime",e5=H6t.W8c("c1ba")?"_closeReg":"Ou",g4f="UTC",J9=H6t.G8c("637d")?"utc":"q",z5f="_dateToUtc",K1y="_setCalander",v0y="maxDate",k3y="time",C8="mat",U3=H6t.a8c("55d4")?'an':"keyless",H0D=H6t.x8c("64")?"editor()":'ut',a4D='le',N7y=H6t.J8c("e684")?"Choose file...":'ab',K7='utt',R6="Y",V6y="moment",Z8f="DateTime",L5="dType",S0="fiel",o8y="formTitle",o6f="formMessage",E1f="ton",r4D="xtend",h9f="select",j9D="exte",T4D="move",r4f="tor_re",W9D="exes",l1y="ec",u6="ngl",o0="t_",b4f="elec",s0="tor_",G1y="formButtons",Y0D="8",P3D="editor_create",r1D="BUTTONS",P6D="bleTool",g6y="ack",n3D="e_B",c9y="_Bub",k8y="_Tab",l5="TE_Bu",o7y="ssage",a8f="Me",n8D="_I",Q3f="DTE_Labe",O8y="ateE",R2f="d_St",b2y="E_F",i3f="d_",N3="_Fi",P0D="_B",L6y="E_Fo",v9D="_For",s8D="ter",V7D="_F",C6f="_He",E0y="He",s4D="ssing",y7y="Proc",z0D="icator",S8="oce",c8f="DTE",E8f="toArray",M0f="att",U1y="abl",Y9f="Da",r6f="idSrc",N4f="jec",p5f="our",S1="min",g2y="nam",V5D="indexes",S2y=20,k9=500,v2y="dr",w9D="rce",P4="aSou",W9='tor',K5y='[',N6D="ir",U5D="rc",m8y="mD",n0f="Opt",T6f="_b",D6f="mber",V9D="ober",W7D="ber",G5f="epte",z8f="ug",q3="une",M1="J",y2f="ril",j8="ar",m9D="br",F1="uary",b7D="Ja",M0="iou",k8D="Prev",h5="Undo",F4="ues",s6="ual",h5y="eir",l4D="wis",v1f="if",U7="cted",D1="The",V0y='>).',a0f='tion',H9f='form',j4='re',F6='M',Q3='2',q8='1',m8='/',n3='et',J8='.',j3y='bles',V0D='="//',J4='ref',r6y='k',b2f='ge',w8='ar',B9D=' (<',X7D='rre',l2f='y',x7='A',v7D="ele",A4D="?",X5=" %",v9f="ure",y1f="Del",b0f="ete",n3f="De",i9f="ntr",s9="_RowI",u8f="DT",f0D="ubm",O2y=10,U0D="submitComplete",F7D="tin",l0f="Api",u2="ata",M9f="pre",o5y="subm",F6f="ca",l0D="han",c4f="mp",i1="ny",R2="_fn",a3D="vent",y5f="cu",R9f="ml",H1y="pi",D9f="up",j3D="options",Q7y=": ",h3="reate",R5D="send",J4y="put",K0D="nodeName",K3D="tit",q1D="editCount",w6f="one",Z3f="mi",W7="onComplete",T3y="setFocus",n4f="sAr",h3D="match",R7y="triggerHandler",F5="ray",Q4f="displayed",N9="splay",K1D="open",H3="Op",B2="focus.editor-focus",Q1D="closeIcb",L7f="los",g0D="closeCb",k6f="Cl",y9D="_close",D7="su",q1="onBlur",k1D="split",e9y="indexOf",N3D="oin",t4f="addClass",C3y="rea",Z="removeClass",A4f="mple",x4y="_op",h4D="processing",F4y="_co",O6f="Co",Q8D="orm",k4y="shift",a5f="utton",O9f="cr",X0y="i1",x2y="TableTools",G6="dataTable",U="Ta",O0D="but",J8f='or',G7f="footer",A5="si",D7f="pro",l1='at',U5="18",Y0y="htm",z0="aTa",z9="Sr",m3D="rl",e3D="etti",B8="oa",X5f="ur",X0D="fieldErrors",G2f="ade",X5D="string",w5="ax",B6y="jax",t1D="name",j5f="oad",X0="U",j2D="<",M4="upload",t5f="saf",J0f="value",z7D="rs",Z0f="/",o0D="ile",E5f="namespace",U3y="files",d9="files()",B8D="cells().edit()",p6f="cel",g3D="elet",i3D="let",F7y="ws",U2D="().",V4D="()",y1="Ap",W3f="div.",O6y="eac",v3y="_processing",D2f="ces",T5D="show",v2="_event",x6y="cti",H8f="display",Y6f="rin",M1y="ll",E3y="join",u2f="_pr",y4D="fie",l7y="multiGet",G5="age",x2D="par",L9f="dS",p8y="_clearDynamicInfo",s0f="con",j0f="_closeReg",s5f="ppend",E7D="find",e5D='"/></',p2="eo",s8f="_p",v3f="edit",V0f="displayFields",b0D="im",A9D="ore",r8="dit",q0D="inline",Y8f="inError",j0D=":",e6y="Nam",A7f="ma",V3D="rm",v8="ge",Q5y="ess",N8="M",S2f="main",m4y="gs",s3="Ar",J1f="ud",P1="ye",k3="map",M7="ed",H7f="_f",V6f="ajax",q6f="va",M9="ditF",v3D="rows",y8f="post",g8="Update",p0y="po",B0f="ide",w8f="da",p3="xten",X4y="eO",R4y="pt",s1="O",k0f="Ma",b6f="_a",b7f="set",x9y="ayRe",i0D="form",m2D="modifier",c1D="_crudArgs",D3f="iel",v5y="ds",B4f="tFi",x6f="edi",k8="ose",I0y="_fieldNames",o7="buttons",I5f="cal",x1="preventDefault",D3="tD",Z0y="pr",P2f="keyCode",E8="ke",I6D="all",z5="ey",u2y=13,R4f="key",d1D="attr",O3="am",h8="N",V3="stri",Y7f="ch",b8="8n",i7D="be",d2="ov",V4f="lass",E7="ff",W1y="fset",J1y="th",F3="bub",K8D="ields",O1D="tion",z6D="bb",o1y="ear",w9f="ons",Z4y="tt",b4D="prepend",n5y="tl",e4="ep",Z9y="for",Y4y="To",W9f="appendTo",a2D='" /></',w5f="ine",k5f='"><div class="',s4y='<div class="',c5D="bubble",d5="iti",V1D="bu",D8D="_formOptions",f0y="ub",a7f="_e",y9f="isPlainObject",M6="oo",N1D="je",u3y="Ob",s2D="ubb",P="mit",s7="sub",P8D="clos",q4D="bl",Q8="blur",d7="editOpts",t0y="pla",w0f="order",L5D="rd",m6f="inA",i7="unshift",y4y="pus",m5y="field",S7="classes",B4y="fields",V6="_dataSource",p6D="his",e1f="ield",U8="ror",H9D="Er",i6y="lds",s2f="ame",f2="eq",q4y=". ",I1D="ng",F9f="rra",C9D="sA",V7y=50,W6f="envelope",b9D=';</',K9='me',A6='">&',V4y='se',U0f='Cl',Y5D='D_',p9D='ckgr',s4='B',G7='e_',i2f='D_En',v8y='R',d6f='w',x5D='had',a9f='op',j5='el',G2='_E',C7y='eft',S8D='dow',W0D='ha',R8D='e_S',Z0D='ve',M6f='Wrapper',B7y='pe_',G4D='elo',c8y='nv',f6D='ED_',n0D="node",m1="row",b0="header",z9f="action",a4="der",S7D="tab",B0y="attach",I4y="able",D2D="table",d6y="z",j3="ght",q3y="lick",Z1f="ind",j7y="ppe",L0D="_C",U0y="TE_",I6f="E_",x4f="Ca",Y6D="_E",T2f="hasClass",K7f="ve",W4="os",d8="at",m3f="content",s6f="croll",q0y="eI",j4D="orma",M9y="pa",g2D="B",Y="an",g1f="style",T8="gh",L8="of",M8="se",G3="tC",L6f="opacity",m0="on",p3y="play",R0D="ro",c0y="kgr",z2f="ci",B5="yle",k8f="il",R="und",M5D="gro",y7="ac",Q0D="hil",l0="op",a7="ad",I7f="Ch",s3D="pen",w8D="ler",N5D="yContro",M3="dis",E4y=25,u6D='lo',H3f='igh',I9D='/></',I2y='oun',T6D='ckg',Z9f='x_B',W0='bo',m8f='ght',W3D='D_Li',O2='>',J3y='nt',J4f='tbox_Co',Y2D='TED_Li',W5D='apper',U4y='W',K4='_C',L5f='_Light',b5y='TE',g6='las',S4='ne',G3y='tai',q9f='on',H4='C',R1f='ox',t7y='b',y3f='h',N8D='TED',Q='er',W2f='app',S3f='htbox_Wr',F0='ig',k6='L',W1D='ED',a8D="per",u1="div",E2="TED",h0="unbind",t7="ate",b4="st",j6D="detach",V7f="off",e0="conf",F4f="animate",T3f="top",L8D="app",F2D="bi",a9y="rem",i7y="remove",o9y="bod",H2="ow",K3="S",f0f="_d",b9="H",l4="ot",y8="Fo",b3y="outerHeight",Y9D="ra",g5f="windowPadding",Q7D="ED_",o0y='"/>',C1f='wn',W8D='_S',i4f='x',X7y='_',Q2='E',e3y='T',T4='D',R5y="end",h1D="body",U8y="ckgr",e2f="scrollTop",l9y="dy",G9D="bo",Y5y="dt",Y4D="apper",J2y="_Co",g7y="Li",Y6="TE",u9y="ha",X8f="target",e6f="tent",u6y="cli",Q7="ou",S0D="ba",x2="ox",I1f="ig",b8D="ick",t4D="stop",W6D="_heightCalc",N7f="_do",a1y="background",q8D="nf",K2f="ht",A0="ei",n3y="te",w4="Class",y2D="ody",b1="appe",A7y="wr",P9f="wrapper",a9="ox_",v5="L",V3f="ED",C6y="ent",F2f="_hi",k6y="wn",c7f="ho",p4f="_s",x0f="_dom",h7D="nd",U3f="pp",S1D="append",c6D="children",d1f="_dte",V7="_shown",g3y="_init",N1f="displayController",y3="xte",s5y="lightbox",Q9="ay",E3D="isp",h0D="ispl",g7="lur",k5y="close",R3c="submit",M5="formOptions",i1f="els",X4="button",z4D="ldType",h3f="yCon",e9D="model",C5f="settings",R7f="mod",V8f="ie",y9="F",N5="ex",Z4="defaults",e8="Fi",V2f="ls",p1="od",y3D="apply",W6y="opt",u4="fo",M7f="mult",l7f="lu",J7D="ne",m4="ss",F9D="no",o4="sp",u7D="A",t6D="tio",E0f="Id",i2="blo",K1="I",p6y="de",R4D="remo",f4y="ts",J5="get",E9y="lo",S3y="own",z8y="li",P9y="ner",A3f="ontai",d3="Fn",g4="isArray",p4y="lue",T6="V",N8f="lti",y7D="mu",m0y="ace",E7f="ce",T5f="ain",a5y="cont",E0="om",Q7f="ck",w3y="he",n6y="eC",d6="ai",B7="inArray",Z6f="multiIds",k3c="Va",A7D="is",V3y="html",T5y="slideUp",G7D="spl",D5D="host",G6D="isMultiValue",C8y="focus",P6y="eF",K9f="_t",T1f="us",v3="oc",g1y="ea",t5D=", ",c1="as",y6D="has",T9f="mo",B2f="las",o2f="add",z7f="container",w1="ass",w0y="la",l9f="css",G0y="parents",J2="er",z5D="nt",I2f="co",L1y="def",F9y="ult",x5f="opts",b6y="pl",z3="ap",Z8y="hi",X9f="un",l7="ion",G9f="fun",J9D="each",D9y="h",F5D=true,Y8y="Value",X2f="lt",Q9f="click",n8="mul",W1="val",F5y="k",o5f="ic",t7f="cl",k1y="multi",c7D="multi-info",P5y="multi-value",h4="or",D6D="rr",d0="ol",w4y="tr",I1="models",a1D="ten",r8f="dom",A6y="none",M1f="lay",I6="disp",a4y="rep",M2f="ut",q9D="np",a5D=null,R3y="create",k3f="_typeFn",g4D=">",T="></",j7D="iv",G0D="</",t8='">',f5f="ms",R1y='"></',f5D="re",w3="R",H0f='u',d0D="in",l6f='p',Q6="multiValue",n2f='ti',M2D='"/><',x9f="ont",r2D="inp",h4f='lass',X0f="input",C3f='ss',D4f='la',q7y='n',c0f='t',j8y='><',j6='></',U9='iv',D3c='</',f3D="-",C1D='ass',g0y='g',f7y='m',O7f='ata',n6f='v',P0y='i',V5='<',W7f='r',y6y='o',K4y='f',l3y="label",f7f='s',H8='as',s2y='c',n8f='" ',U4D='="',L4y='e',H4f='te',o8='-',A9f='ta',K2y='a',W2y='d',E4D=' ',o7f='abe',f6y='l',K0f='"><',s6D="Na",W4y="class",y0D="yp",K2D="ix",L7y="ty",D5y="pper",e7D="wra",X6y="dito",e2y="_fnGetObjectDataFn",v8D="valFromData",b3f="oApi",G0f="ext",q6D="na",p3D="rop",C1="P",j0="ta",B1f="me",q8f="id",s3y="ld",Z9="en",b0y="x",T4f="type",w8y="pe",d7D="eld",U4f="ing",M7y="dd",v1="Error",V8y="p",Q0y="y",V0="el",W3y="u",Y7="ef",C5y="extend",P4f="ul",h9y="Field",b5="sh",m2y="pu",z0y="ach",I8y='"]',z2D="DataTable",v8f="tor",O0f="_c",u5D="'",g2f="' ",M0y="w",Z5=" '",i0="al",E8D="ni",Q0="ust",H0y="di",o5="E",Y1y="DataT",R5="ew",x7D="7",o8D="0",K2="ab",f5y="aT",t9="D",s7y="res",R8f="ui",D1y="q",L2f=" ",p9y="to",y0f="Ed",k4="1.10.7",Q2D="heck",G2D="C",O3y="ersi",t2D="eck",c9D="nCh",Z6D="io",m9="ers",X3f="v",N3y="le",T1D="ataTab",f4="d",f9y="f",I3y="",U1D="1",I0D="replace",w7="_",A3=1,H9y="message",N6="fi",N0f="ove",G4="em",T9y="g",e3="sa",c7="es",U5y="m",E1y="i18n",R9y="tle",c1y="ti",U2="title",L9y="i",G5D="ns",O4D="utt",y0="_editor",t4="editor",f7D="it",E5D="In",X3=0,V2="xt",X1y="nte",b1y="o",y2="c";function v(a){a=a[(y2+b1y+X1y+V2)][X3];return a[(b1y+E5D+f7D)][t4]||a[y0];}
function B(a,b,c,e){var x0="_ba",J0y="butto";b||(b={}
);b[(H6t.D4+O4D+b1y+H6t.A1y+H6t.X8y)]===h&&(b[(J0y+G5D)]=(x0+H6t.X8y+L9y+y2));b[U2]===h&&(b[(c1y+R9y)]=a[E1y][c][U2]);b[(U5y+c7+e3+T9y+H6t.D2)]===h&&((H6t.y8y+G4+N0f)===c?(a=a[E1y][c][(y2+b1y+H6t.A1y+N6+H6t.y8y+U5y)],b[H9y]=A3!==e?a[w7][I0D](/%d/,e):a[U1D]):b[H9y]=I3y);return b;}
var r=d[(f9y+H6t.A1y)][(f4+T1D+N3y)];if(!r||!r[(X3f+m9+Z6D+c9D+t2D)]||!r[(X3f+O3y+b1y+H6t.A1y+G2D+Q2D)](k4))throw (y0f+L9y+p9y+H6t.y8y+L2f+H6t.y8y+H6t.D2+D1y+R8f+s7y+L2f+t9+H6t.c4+H6t.L3y+f5y+K2+H6t.z1y+H6t.D2+H6t.X8y+L2f+U1D+H6t.e0f+U1D+o8D+H6t.e0f+x7D+L2f+b1y+H6t.y8y+L2f+H6t.A1y+R5+H6t.D2+H6t.y8y);var f=function(a){var P3f="uc",x7y="nst",T9D="stance",f1D="ise",b2D="ables";!this instanceof f&&alert((Y1y+b2D+L2f+o5+H0y+p9y+H6t.y8y+L2f+U5y+Q0+L2f+H6t.D4+H6t.D2+L2f+L9y+E8D+H6t.L3y+L9y+i0+f1D+f4+L2f+H6t.c4+H6t.X8y+L2f+H6t.c4+Z5+H6t.A1y+H6t.D2+M0y+g2f+L9y+H6t.A1y+T9D+u5D));this[(O0f+b1y+x7y+H6t.y8y+P3f+p9y+H6t.y8y)](a);}
;r[(o5+f4+L9y+v8f)]=f;d[(f9y+H6t.A1y)][z2D][(o5+H0y+v8f)]=f;var t=function(a,b){var j1y='*[data-dte-e="';b===h&&(b=q);return d(j1y+a+I8y,b);}
,N=X3,y=function(a,b){var c=[];d[(H6t.D2+z0y)](a,function(a,d){c[(m2y+b5)](d[b]);}
);return c;}
;f[h9y]=function(a,b,c){var Y2f="eturn",R8="sg",T7y="msg-label",B7f="msg-info",g0="ontro",B4="ieldIn",c6y='ag',O0='rro',G1="esto",J8D='lti',r2y='sg',v6f='pa',e8D="multiInfo",x4='nf',p7y='alue',T2D='ul',q9y="utC",l5f='ol',u1y='put',Y0f='pu',n1D="labelInfo",Q4y="msg",k0='bel',g3f="fix",Z1y="mePre",a2y="_fnSetObjectDataFn",n7y="lToDa",O7="dataProp",z3f="DTE_Field_",n2="Type",y0y="settin",H8D="Fie",U3D="nknown",n1=" - ",E5="ype",e=this,l=c[E1y][(U5y+P4f+c1y)],a=d[C5y](!X3,{}
,f[h9y][(f4+Y7+H6t.c4+W3y+H6t.z1y+H6t.L3y+H6t.X8y)],a);if(!f[(f9y+L9y+V0+f4+H6t.P8+E5+H6t.X8y)][a[(H6t.L3y+Q0y+V8y+H6t.D2)]])throw (v1+L2f+H6t.c4+M7y+U4f+L2f+f9y+L9y+H6t.D2+H6t.z1y+f4+n1+W3y+U3D+L2f+f9y+L9y+d7D+L2f+H6t.L3y+Q0y+w8y+L2f)+a[T4f];this[H6t.X8y]=d[(H6t.D2+b0y+H6t.L3y+Z9+f4)]({}
,f[(H8D+s3y)][(y0y+T9y+H6t.X8y)],{type:f[(f9y+L9y+H6t.D2+s3y+n2+H6t.X8y)][a[(H6t.L3y+Q0y+w8y)]],name:a[(H6t.A1y+H6t.c4+U5y+H6t.D2)],classes:b,host:c,opts:a,multiValue:!A3}
);a[(q8f)]||(a[(L9y+f4)]=z3f+a[(H6t.A1y+H6t.c4+B1f)]);a[O7]&&(a.data=a[(f4+H6t.c4+j0+C1+p3D)]);""===a.data&&(a.data=a[(q6D+U5y+H6t.D2)]);var k=r[G0f][b3f];this[v8D]=function(b){return k[e2y](a.data)(b,(H6t.D2+X6y+H6t.y8y));}
;this[(X3f+H6t.c4+n7y+j0)]=k[a2y](a.data);b=d('<div class="'+b[(e7D+D5y)]+" "+b[(L7y+w8y+C1+H6t.y8y+Y7+K2D)]+a[(H6t.L3y+y0D+H6t.D2)]+" "+b[(H6t.A1y+H6t.c4+Z1y+g3f)]+a[(H6t.A1y+H6t.c4+B1f)]+" "+a[(W4y+s6D+U5y+H6t.D2)]+(K0f+f6y+o7f+f6y+E4D+W2y+K2y+A9f+o8+W2y+H4f+o8+L4y+U4D+f6y+K2y+k0+n8f+s2y+f6y+H8+f7f+U4D)+b[l3y]+(n8f+K4y+y6y+W7f+U4D)+a[(L9y+f4)]+'">'+a[(H6t.z1y+H6t.c4+H6t.D4+V0)]+(V5+W2y+P0y+n6f+E4D+W2y+O7f+o8+W2y+H4f+o8+L4y+U4D+f7y+f7f+g0y+o8+f6y+K2y+k0+n8f+s2y+f6y+C1D+U4D)+b[(Q4y+f3D+H6t.z1y+H6t.c4+H6t.D4+V0)]+'">'+a[n1D]+(D3c+W2y+U9+j6+f6y+K2y+k0+j8y+W2y+U9+E4D+W2y+K2y+c0f+K2y+o8+W2y+H4f+o8+L4y+U4D+P0y+q7y+Y0f+c0f+n8f+s2y+D4f+C3f+U4D)+b[X0f]+(K0f+W2y+U9+E4D+W2y+K2y+c0f+K2y+o8+W2y+H4f+o8+L4y+U4D+P0y+q7y+u1y+o8+s2y+y6y+q7y+c0f+W7f+l5f+n8f+s2y+h4f+U4D)+b[(r2D+q9y+x9f+H6t.y8y+b1y+H6t.z1y)]+(M2D+W2y+P0y+n6f+E4D+W2y+K2y+c0f+K2y+o8+W2y+c0f+L4y+o8+L4y+U4D+f7y+T2D+n2f+o8+n6f+p7y+n8f+s2y+D4f+f7f+f7f+U4D)+b[Q6]+'">'+l[U2]+(V5+f7f+l6f+K2y+q7y+E4D+W2y+O7f+o8+W2y+H4f+o8+L4y+U4D+f7y+T2D+c0f+P0y+o8+P0y+x4+y6y+n8f+s2y+D4f+f7f+f7f+U4D)+b[e8D]+'">'+l[(d0D+f9y+b1y)]+(D3c+f7f+v6f+q7y+j6+W2y+P0y+n6f+j8y+W2y+P0y+n6f+E4D+W2y+K2y+c0f+K2y+o8+W2y+H4f+o8+L4y+U4D+f7y+r2y+o8+f7y+H0f+J8D+n8f+s2y+f6y+K2y+C3f+U4D)+b[(U5y+P4f+c1y+w3+G1+f5D)]+'">'+l.restore+(D3c+W2y+P0y+n6f+j8y+W2y+U9+E4D+W2y+K2y+A9f+o8+W2y+c0f+L4y+o8+L4y+U4D+f7y+f7f+g0y+o8+L4y+O0+W7f+n8f+s2y+D4f+C3f+U4D)+b["msg-error"]+(R1y+W2y+P0y+n6f+j8y+W2y+U9+E4D+W2y+K2y+c0f+K2y+o8+W2y+H4f+o8+L4y+U4D+f7y+f7f+g0y+o8+f7y+L4y+f7f+f7f+c6y+L4y+n8f+s2y+f6y+K2y+f7f+f7f+U4D)+b["msg-message"]+(R1y+W2y+P0y+n6f+j8y+W2y+P0y+n6f+E4D+W2y+K2y+c0f+K2y+o8+W2y+c0f+L4y+o8+L4y+U4D+f7y+f7f+g0y+o8+P0y+x4+y6y+n8f+s2y+D4f+f7f+f7f+U4D)+b[(f5f+T9y+f3D+L9y+H6t.A1y+f9y+b1y)]+(t8)+a[(f9y+B4+f9y+b1y)]+(G0D+f4+j7D+T+f4+j7D+T+f4+L9y+X3f+g4D));c=this[k3f](R3y,a);a5D!==c?t((L9y+q9D+M2f+f3D+y2+g0+H6t.z1y),b)[(V8y+a4y+H6t.D2+H6t.A1y+f4)](c):b[(y2+H6t.X8y+H6t.X8y)]((I6+M1f),A6y);this[(r8f)]=d[(H6t.D2+b0y+a1D+f4)](!X3,{}
,f[h9y][I1][r8f],{container:b,inputControl:t((L9y+q9D+M2f+f3D+y2+b1y+H6t.A1y+w4y+d0),b),label:t(l3y,b),fieldInfo:t(B7f,b),labelInfo:t(T7y,b),fieldError:t((U5y+H6t.X8y+T9y+f3D+H6t.D2+D6D+h4),b),fieldMessage:t((Q4y+f3D+U5y+H6t.D2+H6t.X8y+e3+T9y+H6t.D2),b),multi:t(P5y,b),multiReturn:t((U5y+R8+f3D+U5y+P4f+c1y),b),multiInfo:t(c7D,b)}
);this[r8f][k1y][(b1y+H6t.A1y)]((t7f+o5f+F5y),function(){e[(W1)](I3y);}
);this[r8f][(n8+c1y+w3+Y2f)][(b1y+H6t.A1y)](Q9f,function(){var i9="tiV";e[H6t.X8y][(U5y+W3y+X2f+L9y+Y8y)]=F5D;e[(w7+U5y+P4f+i9+H6t.c4+H6t.z1y+W3y+H6t.D2+G2D+D9y+t2D)]();}
);d[J9D](this[H6t.X8y][T4f],function(a,b){typeof b===(G9f+H6t.I4f+l7)&&e[a]===h&&(e[a]=function(){var X1="peF",b=Array.prototype.slice.call(arguments);b[(X9f+H6t.X8y+Z8y+f9y+H6t.L3y)](a);b=e[(w7+L7y+X1+H6t.A1y)][(z3+b6y+Q0y)](e,b);return b===h?e:b;}
);}
);}
;f.Field.prototype={def:function(a){var r2f="isFun",b=this[H6t.X8y][x5f];if(a===h)return a=b["default"]!==h?b[(f4+H6t.D2+f9y+H6t.c4+F9y)]:b[L1y],d[(r2f+H6t.I4f+L9y+b1y+H6t.A1y)](a)?a():a;b[L1y]=a;return this;}
,disable:function(){var H2f="sab";this[k3f]((f4+L9y+H2f+H6t.z1y+H6t.D2));return this;}
,displayed:function(){var a=this[(r8f)][(I2f+z5D+H6t.c4+L9y+H6t.A1y+J2)];return a[G0y]("body").length&&"none"!=a[l9f]((H0y+H6t.X8y+V8y+w0y+Q0y))?!0:!1;}
,enable:function(){this[k3f]("enable");return this;}
,error:function(a,b){var y5="dError",p5="eClass",c=this[H6t.X8y][(t7f+w1+H6t.D2+H6t.X8y)];a?this[r8f][z7f][(o2f+G2D+B2f+H6t.X8y)](c.error):this[(f4+b1y+U5y)][(y2+x9f+H6t.c4+L9y+H6t.A1y+J2)][(f5D+T9f+X3f+p5)](c.error);return this[(w7+f5f+T9y)](this[(f4+b1y+U5y)][(f9y+L9y+H6t.D2+H6t.z1y+y5)],a,b);}
,isMultiValue:function(){return this[H6t.X8y][(U5y+P4f+c1y+Y8y)];}
,inError:function(){return this[(H6t.a7y+U5y)][z7f][(y6D+G2D+w0y+H6t.X8y+H6t.X8y)](this[H6t.X8y][(t7f+c1+H6t.X8y+c7)].error);}
,input:function(){var x5y="extar";return this[H6t.X8y][T4f][(d0D+V8y+M2f)]?this[k3f]("input"):d((r2D+M2f+t5D+H6t.X8y+H6t.D2+N3y+H6t.I4f+t5D+H6t.L3y+x5y+g1y),this[(H6t.a7y+U5y)][z7f]);}
,focus:function(){this[H6t.X8y][(H6t.L3y+Q0y+V8y+H6t.D2)][(f9y+v3+T1f)]?this[(K9f+y0D+P6y+H6t.A1y)]("focus"):d("input, select, textarea",this[(H6t.a7y+U5y)][z7f])[C8y]();return this;}
,get:function(){if(this[G6D]())return h;var a=this[(K9f+Q0y+V8y+P6y+H6t.A1y)]("get");return a!==h?a:this[(f4+H6t.D2+f9y)]();}
,hide:function(a){var b=this[r8f][z7f];a===h&&(a=!0);this[H6t.X8y][D5D][(H0y+G7D+H6t.c4+Q0y)]()&&a?b[T5y]():b[l9f]("display","none");return this;}
,label:function(a){var b=this[r8f][(w0y+H6t.D4+V0)];if(a===h)return b[V3y]();b[(D9y+H6t.L3y+U5y+H6t.z1y)](a);return this;}
,message:function(a,b){var l4f="sag",P2="eldMe",t6="_msg";return this[t6](this[r8f][(N6+P2+H6t.X8y+l4f+H6t.D2)],a,b);}
,multiGet:function(a){var p3c="Mul",A2f="iId",l1D="multiValues",b=this[H6t.X8y][l1D],c=this[H6t.X8y][(n8+H6t.L3y+A2f+H6t.X8y)];if(a===h)for(var a={}
,e=0;e<c.length;e++)a[c[e]]=this[G6D]()?b[c[e]]:this[W1]();else a=this[(A7D+p3c+c1y+k3c+H6t.z1y+H6t.j1f)]()?b[a]:this[(W1)]();return a;}
,multiSet:function(a,b){var C8f="Valu",u7f="iV",t1="nObje",r8D="sPl",c=this[H6t.X8y][(U5y+W3y+H6t.z1y+H6t.L3y+L9y+k3c+H6t.z1y+W3y+H6t.D2+H6t.X8y)],e=this[H6t.X8y][Z6f];b===h&&(b=a,a=h);var l=function(a,b){d[B7](e)===-1&&e[(m2y+H6t.X8y+D9y)](a);c[a]=b;}
;d[(L9y+r8D+d6+t1+H6t.I4f)](b)&&a===h?d[J9D](b,function(a,b){l(a,b);}
):a===h?d[(H6t.D2+H6t.c4+y2+D9y)](e,function(a,c){l(c,b);}
):l(a,b);this[H6t.X8y][(U5y+P4f+H6t.L3y+u7f+i0+H6t.j1f)]=!0;this[(w7+n8+c1y+C8f+n6y+w3y+Q7f)]();return this;}
,name:function(){return this[H6t.X8y][x5f][(H6t.A1y+H6t.c4+B1f)];}
,node:function(){return this[(f4+E0)][(a5y+T5f+J2)][0];}
,set:function(a){var V2D="Chec",o3f="_m",K3y="yDe",b=function(a){var L2y="\n";var V1y="repl";return "string"!==typeof a?a:a[I0D](/&gt;/g,">")[(f5D+V8y+H6t.z1y+H6t.c4+E7f)](/&lt;/g,"<")[(V1y+m0y)](/&amp;/g,"&")[(f5D+V8y+w0y+E7f)](/&quot;/g,'"')[(f5D+V8y+H6t.z1y+H6t.c4+E7f)](/&#39;/g,"'")[I0D](/&#10;/g,(L2y));}
;this[H6t.X8y][(y7D+N8f+T6+H6t.c4+p4y)]=!1;var c=this[H6t.X8y][(b1y+V8y+H6t.L3y+H6t.X8y)][(H6t.D2+H6t.A1y+H6t.L3y+L9y+H6t.L3y+K3y+y2+b1y+f4+H6t.D2)];if(c===h||!0===c)if(d[g4](a))for(var c=0,e=a.length;c<e;c++)a[c]=b(a[c]);else a=b(a);this[(w7+L7y+w8y+d3)]("set",a);this[(o3f+F9y+L9y+k3c+H6t.z1y+H6t.j1f+V2D+F5y)]();return this;}
,show:function(a){var w6y="eD",b=this[(r8f)][(y2+A3f+P9y)];a===h&&(a=!0);this[H6t.X8y][D5D][(f4+L9y+G7D+H6t.c4+Q0y)]()&&a?b[(H6t.X8y+z8y+f4+w6y+S3y)]():b[(l9f)]("display",(H6t.D4+E9y+Q7f));return this;}
,val:function(a){return a===h?this[J5]():this[(H6t.X8y+H6t.D2+H6t.L3y)](a);}
,dataSrc:function(){return this[H6t.X8y][(b1y+V8y+f4y)].data;}
,destroy:function(){var L6D="troy",v5D="onta";this[(f4+E0)][(y2+v5D+L9y+P9y)][(R4D+X3f+H6t.D2)]();this[(w7+L7y+V8y+H6t.D2+d3)]((p6y+H6t.X8y+L6D));return this;}
,multiIds:function(){var N3f="ulti";return this[H6t.X8y][(U5y+N3f+K1+f4+H6t.X8y)];}
,multiInfoShown:function(a){var V5f="Inf";this[(f4+b1y+U5y)][(k1y+V5f+b1y)][(y2+H6t.X8y+H6t.X8y)]({display:a?(i2+y2+F5y):(H6t.A1y+b1y+H6t.A1y+H6t.D2)}
);}
,multiReset:function(){var G4y="Val";this[H6t.X8y][(U5y+W3y+H6t.z1y+H6t.L3y+L9y+E0f+H6t.X8y)]=[];this[H6t.X8y][(U5y+P4f+c1y+G4y+H6t.j1f+H6t.X8y)]={}
;}
,valFromData:null,valToData:null,_errorNode:function(){var W8y="ldErr";return this[(f4+b1y+U5y)][(N6+H6t.D2+W8y+h4)];}
,_msg:function(a,b,c){var K8="tml",q5y="slideDown";if((G9f+y2+t6D+H6t.A1y)===typeof b)var e=this[H6t.X8y][D5D],b=b(e,new r[(u7D+V8y+L9y)](e[H6t.X8y][(j0+H6t.D4+H6t.z1y+H6t.D2)]));a.parent()[(L9y+H6t.X8y)](":visible")?(a[V3y](b),b?a[q5y](c):a[T5y](c)):(a[(D9y+K8)](b||"")[l9f]((H0y+o4+M1f),b?(H6t.D4+E9y+y2+F5y):"none"),c&&c());return this;}
,_multiValueCheck:function(){var t1y="iI",p9f="iVa",K5f="multiReturn",o8f="iVal",r5y="inputControl",m7f="multiValu",a,b=this[H6t.X8y][Z6f],c=this[H6t.X8y][(m7f+H6t.D2+H6t.X8y)],e,d=!1;if(b)for(var k=0;k<b.length;k++){e=c[b[k]];if(0<k&&e!==a){d=!0;break;}
a=e;}
d&&this[H6t.X8y][Q6]?(this[(H6t.a7y+U5y)][r5y][l9f]({display:(F9D+H6t.A1y+H6t.D2)}
),this[r8f][(k1y)][l9f]({display:"block"}
)):(this[r8f][r5y][(l9f)]({display:(H6t.D4+H6t.z1y+b1y+Q7f)}
),this[(r8f)][(k1y)][(y2+m4)]({display:(F9D+J7D)}
),this[H6t.X8y][(y7D+H6t.z1y+H6t.L3y+o8f+W3y+H6t.D2)]&&this[W1](a));this[(r8f)][K5f][(l9f)]({display:b&&1<b.length&&d&&!this[H6t.X8y][(U5y+W3y+X2f+p9f+l7f+H6t.D2)]?"block":"none"}
);this[H6t.X8y][(D5D)][(w7+M7f+t1y+H6t.A1y+u4)]();return !0;}
,_typeFn:function(a){var l8D="typ",j7="ift",B7D="hif",b=Array.prototype.slice.call(arguments);b[(H6t.X8y+B7D+H6t.L3y)]();b[(W3y+H6t.A1y+H6t.X8y+D9y+j7)](this[H6t.X8y][(W6y+H6t.X8y)]);var c=this[H6t.X8y][(l8D+H6t.D2)][a];if(c)return c[y3D](this[H6t.X8y][(D9y+b1y+H6t.X8y+H6t.L3y)],b);}
}
;f[h9y][(U5y+p1+H6t.D2+V2f)]={}
;f[(e8+H6t.D2+H6t.z1y+f4)][Z4]={className:"",data:"",def:"",fieldInfo:"",id:"",label:"",labelInfo:"",name:null,type:(H6t.L3y+N5+H6t.L3y)}
;f[(y9+V8f+H6t.z1y+f4)][(R7f+H6t.D2+V2f)][C5f]={type:a5D,name:a5D,classes:a5D,opts:a5D,host:a5D}
;f[h9y][(T9f+p6y+H6t.z1y+H6t.X8y)][(r8f)]={container:a5D,label:a5D,labelInfo:a5D,fieldInfo:a5D,fieldError:a5D,fieldMessage:a5D}
;f[I1]={}
;f[(e9D+H6t.X8y)][(f4+A7D+V8y+H6t.z1y+H6t.c4+h3f+H6t.L3y+H6t.y8y+b1y+H6t.z1y+N3y+H6t.y8y)]={init:function(){}
,open:function(){}
,close:function(){}
}
;f[I1][(f9y+V8f+z4D)]={create:function(){}
,get:function(){}
,set:function(){}
,enable:function(){}
,disable:function(){}
}
;f[I1][C5f]={ajaxUrl:a5D,ajax:a5D,dataSource:a5D,domTable:a5D,opts:a5D,displayController:a5D,fields:{}
,order:[],id:-A3,displayed:!A3,processing:!A3,modifier:a5D,action:a5D,idSrc:a5D}
;f[I1][X4]={label:a5D,fn:a5D,className:a5D}
;f[(U5y+p1+i1f)][M5]={onReturn:R3c,onBlur:k5y,onBackground:(H6t.D4+g7),onComplete:k5y,onEsc:(y2+H6t.z1y+b1y+H6t.X8y+H6t.D2),submit:(i0+H6t.z1y),focus:X3,buttons:!X3,title:!X3,message:!X3,drawType:!A3}
;f[(f4+h0D+H6t.c4+Q0y)]={}
;var o=jQuery,n;f[(f4+E3D+H6t.z1y+Q9)][s5y]=o[(H6t.D2+y3+H6t.A1y+f4)](!0,{}
,f[I1][N1f],{init:function(){n[g3y]();return n;}
,open:function(a,b,c){var n4="_show",x8y="eta";if(n[V7])c&&c();else{n[d1f]=a;a=n[(w7+r8f)][(y2+b1y+H6t.A1y+H6t.L3y+Z9+H6t.L3y)];a[c6D]()[(f4+x8y+y2+D9y)]();a[S1D](b)[(H6t.c4+U3f+H6t.D2+h7D)](n[x0f][k5y]);n[(p4f+c7f+k6y)]=true;n[n4](c);}
}
,close:function(a,b){if(n[V7]){n[d1f]=a;n[(F2f+f4+H6t.D2)](b);n[(p4f+D9y+S3y)]=false;}
else b&&b();}
,node:function(){return n[(w7+f4+E0)][(M0y+H6t.y8y+H6t.c4+D5y)][0];}
,_init:function(){var i9y="acit",w0="ckgro",t5y="onten",C6="ghtb",o2D="ready";if(!n[(w7+o2D)]){var a=n[x0f];a[(y2+x9f+C6y)]=o((f4+L9y+X3f+H6t.e0f+t9+H6t.P8+V3f+w7+v5+L9y+C6+a9+G2D+t5y+H6t.L3y),n[(x0f)][P9f]);a[(A7y+b1+H6t.y8y)][(l9f)]("opacity",0);a[(H6t.D4+H6t.c4+w0+W3y+h7D)][l9f]((b1y+V8y+i9y+Q0y),0);}
}
,_show:function(a){var n7="Sh",U6y="Light",i1D='ho',P5D='ghtb',x4D='Li',b8f="oun",e1y="not",j6y="tatio",Z7y="ien",v9y="crollTop",G4f="ightbox",L2="TED_",d7y="Wra",M2y="Con",Y3y="htb",j2y="ED_Li",l0y="TED_L",H3D="_L",p2D="bind",t3="rou",G8y="back",E4f="nim",I4D="offsetAni",B8y="nta",b=n[(x0f)];j[(b1y+H6t.y8y+L9y+H6t.D2+B8y+H6t.L3y+Z6D+H6t.A1y)]!==h&&o((H6t.D4+y2D))[(H6t.c4+f4+f4+w4)]("DTED_Lightbox_Mobile");b[(I2f+H6t.A1y+n3y+z5D)][(l9f)]((D9y+A0+T9y+K2f),(H6t.c4+W3y+p9y));b[(M0y+H6t.y8y+z3+V8y+J2)][(y2+m4)]({top:-n[(I2f+q8D)][I4D]}
);o("body")[(H6t.c4+U3f+H6t.D2+H6t.A1y+f4)](n[x0f][a1y])[S1D](n[(N7f+U5y)][(A7y+z3+w8y+H6t.y8y)]);n[W6D]();b[P9f][t4D]()[(H6t.c4+E4f+H6t.c4+H6t.L3y+H6t.D2)]({opacity:1,top:0}
,a);b[(G8y+T9y+t3+h7D)][t4D]()[(H6t.c4+E8D+U5y+H6t.c4+n3y)]({opacity:1}
);b[k5y][p2D]((t7f+b8D+H6t.e0f+t9+H6t.P8+V3f+H3D+I1f+D9y+H6t.L3y+H6t.D4+x2),function(){n[d1f][k5y]();}
);b[(S0D+Q7f+T9y+H6t.y8y+Q7+h7D)][(H6t.D4+L9y+H6t.A1y+f4)]((u6y+Q7f+H6t.e0f+t9+l0y+I1f+K2f+H6t.D4+x2),function(){n[d1f][a1y]();}
);o((f4+L9y+X3f+H6t.e0f+t9+H6t.P8+j2y+T9y+Y3y+b1y+b0y+w7+M2y+e6f+w7+d7y+V8y+V8y+J2),b[P9f])[(H6t.D4+L9y+H6t.A1y+f4)]((y2+H6t.z1y+L9y+y2+F5y+H6t.e0f+t9+L2+v5+G4f),function(a){var r5D="_Wr";o(a[X8f])[(u9y+H6t.X8y+G2D+w0y+m4)]((t9+Y6+t9+w7+g7y+T9y+K2f+H6t.D4+b1y+b0y+J2y+H6t.A1y+n3y+z5D+r5D+Y4D))&&n[(w7+Y5y+H6t.D2)][a1y]();}
);o(j)[p2D]("resize.DTED_Lightbox",function(){n[W6D]();}
);n[(p4f+v9y)]=o((G9D+l9y))[e2f]();if(j[(b1y+H6t.y8y+Z7y+j6y+H6t.A1y)]!==h){a=o("body")[c6D]()[e1y](b[(S0D+U8y+b8f+f4)])[(e1y)](b[(e7D+V8y+w8y+H6t.y8y)]);o((h1D))[(z3+V8y+R5y)]((V5+W2y+P0y+n6f+E4D+s2y+f6y+K2y+f7f+f7f+U4D+T4+e3y+Q2+T4+X7y+x4D+P5D+y6y+i4f+W8D+i1D+C1f+o0y));o((f4+L9y+X3f+H6t.e0f+t9+H6t.P8+Q7D+U6y+H6t.D4+a9+n7+b1y+k6y))[S1D](a);}
}
,_heightCalc:function(){var h7="max",Z8D="wrap",N7="_Bo",g7D="terHe",K4D="E_He",a=n[x0f],b=o(j).height()-n[(I2f+q8D)][g5f]*2-o((f4+L9y+X3f+H6t.e0f+t9+H6t.P8+K4D+H6t.c4+f4+J2),a[(M0y+Y9D+U3f+H6t.D2+H6t.y8y)])[b3y]()-o((f4+L9y+X3f+H6t.e0f+t9+H6t.P8+o5+w7+y8+l4+H6t.D2+H6t.y8y),a[(A7y+H6t.c4+U3f+H6t.D2+H6t.y8y)])[(Q7+g7D+L9y+T9y+K2f)]();o((f4+j7D+H6t.e0f+t9+H6t.P8+o5+N7+l9y+J2y+H6t.A1y+a1D+H6t.L3y),a[(Z8D+V8y+J2)])[l9f]((h7+b9+H6t.D2+I1f+K2f),b);}
,_hide:function(a){var k1f="nbin",h5D="Wrap",G0="nbind",H3y="tb",M8D="anim",p6="setA",C2D="_scrollTop",Q3D="_M",r3D="igh",B5D="DTED",e9f="dT",w9="chi",z7y="tbox_",E6D="Ligh",e6="orientation",b=n[(f0f+b1y+U5y)];a||(a=function(){}
);if(j[e6]!==h){var c=o((f4+j7D+H6t.e0f+t9+H6t.P8+o5+t9+w7+E6D+z7y+K3+D9y+H2+H6t.A1y));c[(w9+H6t.z1y+f4+H6t.y8y+H6t.D2+H6t.A1y)]()[(H6t.c4+V8y+V8y+H6t.D2+H6t.A1y+e9f+b1y)]((o9y+Q0y));c[i7y]();}
o((G9D+f4+Q0y))[(a9y+b1y+X3f+H6t.D2+w4)]((B5D+w7+v5+r3D+H6t.L3y+H6t.D4+b1y+b0y+Q3D+b1y+F2D+H6t.z1y+H6t.D2))[e2f](n[C2D]);b[(A7y+L8D+H6t.D2+H6t.y8y)][(H6t.X8y+T3f)]()[F4f]({opacity:0,top:n[e0][(V7f+p6+E8D)]}
,function(){o(this)[(j6D)]();a();}
);b[a1y][(b4+b1y+V8y)]()[(M8D+t7)]({opacity:0}
,function(){o(this)[(p6y+j0+y2+D9y)]();}
);b[(k5y)][h0]((u6y+y2+F5y+H6t.e0f+t9+E2+w7+v5+I1f+D9y+H3y+x2));b[a1y][(W3y+G0)]("click.DTED_Lightbox");o((u1+H6t.e0f+t9+H6t.P8+Q7D+v5+L9y+T9y+K2f+H6t.D4+x2+w7+G2D+b1y+H6t.A1y+H6t.L3y+H6t.D2+H6t.A1y+H6t.L3y+w7+h5D+a8D),b[(A7y+L8D+J2)])[(W3y+H6t.A1y+H6t.D4+L9y+h7D)]((Q9f+H6t.e0f+t9+H6t.P8+Q7D+g7y+T9y+D9y+H6t.L3y+H6t.D4+b1y+b0y));o(j)[(W3y+k1f+f4)]("resize.DTED_Lightbox");}
,_dte:null,_ready:!1,_shown:!1,_dom:{wrapper:o((V5+W2y+P0y+n6f+E4D+s2y+f6y+K2y+f7f+f7f+U4D+T4+e3y+W1D+E4D+T4+e3y+W1D+X7y+k6+F0+S3f+W2f+Q+K0f+W2y+P0y+n6f+E4D+s2y+f6y+K2y+f7f+f7f+U4D+T4+N8D+X7y+k6+P0y+g0y+y3f+c0f+t7y+R1f+X7y+H4+q9f+G3y+S4+W7f+K0f+W2y+U9+E4D+s2y+g6+f7f+U4D+T4+b5y+T4+L5f+t7y+R1f+K4+q9f+H4f+q7y+c0f+X7y+U4y+W7f+W5D+K0f+W2y+U9+E4D+s2y+f6y+C1D+U4D+T4+Y2D+g0y+y3f+J4f+J3y+L4y+J3y+R1y+W2y+U9+j6+W2y+U9+j6+W2y+U9+j6+W2y+U9+O2)),background:o((V5+W2y+U9+E4D+s2y+g6+f7f+U4D+T4+e3y+Q2+W3D+m8f+W0+Z9f+K2y+T6D+W7f+I2y+W2y+K0f+W2y+P0y+n6f+I9D+W2y+P0y+n6f+O2)),close:o((V5+W2y+U9+E4D+s2y+D4f+f7f+f7f+U4D+T4+b5y+T4+X7y+k6+H3f+c0f+t7y+R1f+X7y+H4+u6D+f7f+L4y+R1y+W2y+P0y+n6f+O2)),content:null}
}
);n=f[(f4+L9y+o4+M1f)][(H6t.z1y+I1f+K2f+H6t.D4+b1y+b0y)];n[(e0)]={offsetAni:E4y,windowPadding:E4y}
;var m=jQuery,g;f[(f4+E3D+H6t.z1y+H6t.c4+Q0y)][(Z9+X3f+V0+b1y+w8y)]=m[(H6t.D2+b0y+H6t.L3y+H6t.D2+h7D)](!0,{}
,f[I1][(M3+V8y+H6t.z1y+H6t.c4+N5D+H6t.z1y+w8D)],{init:function(a){g[(d1f)]=a;g[g3y]();return g;}
,open:function(a,b,c){var b9y="lose",L0="appendChild";g[d1f]=a;m(g[(w7+r8f)][(y2+b1y+H6t.A1y+a1D+H6t.L3y)])[c6D]()[j6D]();g[x0f][(a5y+H6t.D2+H6t.A1y+H6t.L3y)][L0](b);g[(w7+r8f)][(y2+b1y+H6t.A1y+a1D+H6t.L3y)][(z3+s3D+f4+I7f+L9y+s3y)](g[(f0f+E0)][(y2+b9y)]);g[(p4f+D9y+H2)](c);}
,close:function(a,b){var L2D="hid";g[(d1f)]=a;g[(w7+L2D+H6t.D2)](b);}
,node:function(){var i6D="rapp";return g[x0f][(M0y+i6D+H6t.D2+H6t.y8y)][0];}
,_init:function(){var F3f="ili",a3="sb",Y8D="vi",q7D="tyl",Q2f="oundO",X4D="ssBac",y7f="loc",p1y="ound",X2y="gr",i0y="ity",D5="vis",S0f="appendC",p8f="e_Cont",P7="_Env";if(!g[(w7+H6t.y8y+H6t.D2+a7+Q0y)]){g[(w7+f4+b1y+U5y)][(y2+b1y+z5D+H6t.D2+z5D)]=m((f4+j7D+H6t.e0f+t9+E2+P7+V0+l0+p8f+T5f+J2),g[(w7+r8f)][(M0y+Y9D+V8y+a8D)])[0];q[(h1D)][(S0f+Q0D+f4)](g[(w7+r8f)][(H6t.D4+y7+F5y+M5D+R)]);q[h1D][(H6t.c4+U3f+H6t.D2+h7D+I7f+k8f+f4)](g[x0f][(A7y+H6t.c4+V8y+w8y+H6t.y8y)]);g[x0f][a1y][(H6t.X8y+H6t.L3y+B5)][(D5+H6t.D4+k8f+i0y)]=(Z8y+f4+f4+H6t.D2+H6t.A1y);g[(x0f)][(S0D+Q7f+X2y+p1y)][(H6t.X8y+L7y+H6t.z1y+H6t.D2)][(M3+V8y+H6t.z1y+H6t.c4+Q0y)]=(H6t.D4+y7f+F5y);g[(O0f+X4D+F5y+X2y+Q2f+V8y+H6t.c4+z2f+L7y)]=m(g[x0f][(H6t.D4+y7+c0y+b1y+R)])[(l9f)]("opacity");g[x0f][(S0D+y2+F5y+T9y+R0D+X9f+f4)][(H6t.X8y+q7D+H6t.D2)][(M3+p3y)]=(H6t.A1y+b1y+H6t.A1y+H6t.D2);g[(w7+r8f)][a1y][(b4+Q0y+N3y)][(Y8D+a3+F3f+L7y)]=(D5+L9y+H6t.D4+N3y);}
}
,_show:function(a){var z2y="nvel",B2D="iz",k2y="elop",A7="D_E",A6D="_En",x8D="offsetHeight",Z3D="win",B1="undO",P6f="ima",m2f="bloc",S8f="tyle",a3y="roun",H2y="px",n0="setH",u0f="marginL",x0y="Wid",A2="chR",c4D="dAtt",H7D="yl";a||(a=function(){}
);g[(f0f+b1y+U5y)][(y2+m0+H6t.L3y+Z9+H6t.L3y)][(H6t.X8y+H6t.L3y+B5)].height="auto";var b=g[(w7+H6t.a7y+U5y)][P9f][(H6t.X8y+H6t.L3y+H7D+H6t.D2)];b[L6f]=0;b[(M3+b6y+Q9)]="block";var c=g[(w7+f9y+L9y+H6t.A1y+c4D+H6t.c4+A2+b1y+M0y)](),e=g[(w7+w3y+I1f+D9y+G3+H6t.c4+H6t.z1y+y2)](),d=c[(b1y+f9y+f9y+M8+H6t.L3y+x0y+H6t.L3y+D9y)];b[(H0y+o4+M1f)]="none";b[L6f]=1;g[x0f][(A7y+L8D+H6t.D2+H6t.y8y)][(b4+H7D+H6t.D2)].width=d+(V8y+b0y);g[(w7+f4+b1y+U5y)][P9f][(b4+B5)][(u0f+H6t.D2+f9y+H6t.L3y)]=-(d/2)+"px";g._dom.wrapper.style.top=m(c).offset().top+c[(L8+f9y+n0+A0+T8+H6t.L3y)]+"px";g._dom.content.style.top=-1*e-20+(H2y);g[x0f][(H6t.D4+y7+F5y+T9y+a3y+f4)][g1f][(b1y+V8y+y7+L9y+L7y)]=0;g[x0f][a1y][(H6t.X8y+S8f)][(f4+L9y+o4+H6t.z1y+Q9)]=(m2f+F5y);m(g[x0f][a1y])[(Y+P6f+n3y)]({opacity:g[(w7+y2+H6t.X8y+H6t.X8y+g2D+y7+c0y+b1y+B1+M9y+z2f+L7y)]}
,(H6t.A1y+j4D+H6t.z1y));m(g[x0f][(M0y+H6t.y8y+b1+H6t.y8y)])[(f9y+H6t.c4+f4+q0y+H6t.A1y)]();g[e0][(Z3D+H6t.a7y+M0y+K3+s6f)]?m("html,body")[F4f]({scrollTop:m(c).offset().top+c[x8D]-g[(y2+b1y+q8D)][g5f]}
,function(){m(g[(w7+f4+E0)][m3f])[F4f]({top:0}
,600,a);}
):m(g[(N7f+U5y)][m3f])[(Y+L9y+U5y+d8+H6t.D2)]({top:0}
,600,a);m(g[x0f][(t7f+W4+H6t.D2)])[(F2D+h7D)]((y2+H6t.z1y+b8D+H6t.e0f+t9+H6t.P8+o5+t9+A6D+K7f+E9y+w8y),function(){g[d1f][k5y]();}
);m(g[(f0f+E0)][a1y])[(F2D+h7D)]((t7f+o5f+F5y+H6t.e0f+t9+H6t.P8+o5+A7+H6t.A1y+X3f+k2y+H6t.D2),function(){g[d1f][(S0D+U8y+b1y+W3y+h7D)]();}
);m("div.DTED_Lightbox_Content_Wrapper",g[x0f][(A7y+Y4D)])[(F2D+h7D)]("click.DTED_Envelope",function(a){var h1f="bac",b1f="tar";m(a[(b1f+T9y+H6t.D2+H6t.L3y)])[T2f]("DTED_Envelope_Content_Wrapper")&&g[d1f][(h1f+F5y+T9y+H6t.y8y+b1y+R)]();}
);m(j)[(F2D+h7D)]((H6t.y8y+c7+B2D+H6t.D2+H6t.e0f+t9+E2+Y6D+z2y+l0+H6t.D2),function(){g[W6D]();}
);}
,_heightCalc:function(){var i9D="onte",Y6y="Hei",d9f="out",r7D="TE_H",t8y="heightCalc",Q8y="lc",s2="heig";g[e0][(s2+K2f+x4f+Q8y)]?g[(y2+m0+f9y)][t8y](g[(x0f)][(M0y+H6t.y8y+H6t.c4+U3f+H6t.D2+H6t.y8y)]):m(g[x0f][m3f])[c6D]().height();var a=m(j).height()-g[(I2f+H6t.A1y+f9y)][g5f]*2-m((f4+L9y+X3f+H6t.e0f+t9+r7D+H6t.D2+H6t.c4+p6y+H6t.y8y),g[(w7+f4+b1y+U5y)][P9f])[(d9f+J2+Y6y+T9y+K2f)]()-m((f4+j7D+H6t.e0f+t9+H6t.P8+I6f+y9+b1y+l4+H6t.D2+H6t.y8y),g[x0f][P9f])[b3y]();m((f4+j7D+H6t.e0f+t9+U0y+g2D+b1y+f4+Q0y+L0D+i9D+z5D),g[x0f][(M0y+H6t.y8y+H6t.c4+U3f+H6t.D2+H6t.y8y)])[l9f]("maxHeight",a);return m(g[(d1f)][(f4+E0)][(M0y+Y9D+j7y+H6t.y8y)])[b3y]();}
,_hide:function(a){var e7="_Lightb",c9f="D_",I2="_Wra",H1="D_Li",H6D="nb",T7D="htbox",i1y="ffset";a||(a=function(){}
);m(g[(w7+H6t.a7y+U5y)][(y2+b1y+H6t.A1y+H6t.L3y+C6y)])[F4f]({top:-(g[(N7f+U5y)][(a5y+H6t.D2+z5D)][(b1y+i1y+b9+H6t.D2+L9y+T9y+D9y+H6t.L3y)]+50)}
,600,function(){var a0="norma",a0y="fadeOut",g7f="kgrou";m([g[(w7+f4+b1y+U5y)][P9f],g[(w7+f4+E0)][(H6t.D4+y7+g7f+H6t.A1y+f4)]])[a0y]((a0+H6t.z1y),a);}
);m(g[(f0f+E0)][(t7f+W4+H6t.D2)])[(W3y+H6t.A1y+H6t.D4+Z1f)]((u6y+y2+F5y+H6t.e0f+t9+Y6+t9+w7+v5+L9y+T9y+T7D));m(g[x0f][a1y])[(W3y+H6D+L9y+H6t.A1y+f4)]((y2+q3y+H6t.e0f+t9+Y6+H1+j3+H6t.D4+x2));m((f4+L9y+X3f+H6t.e0f+t9+E2+w7+g7y+T8+H6t.L3y+H6t.D4+x2+J2y+X1y+H6t.A1y+H6t.L3y+I2+V8y+V8y+H6t.D2+H6t.y8y),g[x0f][(M0y+H6t.y8y+L8D+J2)])[(h0)]((y2+z8y+Q7f+H6t.e0f+t9+H6t.P8+o5+c9f+g7y+T9y+K2f+H6t.D4+b1y+b0y));m(j)[h0]((H6t.y8y+c7+L9y+d6y+H6t.D2+H6t.e0f+t9+E2+e7+x2));}
,_findAttachRow:function(){var h2y="ier",n2y="dif",a=m(g[d1f][H6t.X8y][D2D])[(Y1y+I4y)]();return g[e0][B0y]==="head"?a[(S7D+N3y)]()[(D9y+H6t.D2+H6t.c4+a4)]():g[d1f][H6t.X8y][z9f]==="create"?a[(H6t.L3y+H6t.c4+H6t.r9)]()[b0]():a[m1](g[(w7+f4+H6t.L3y+H6t.D2)][H6t.X8y][(T9f+n2y+h2y)])[n0D]();}
,_dte:null,_ready:!1,_cssBackgroundOpacity:1,_dom:{wrapper:m((V5+W2y+P0y+n6f+E4D+s2y+D4f+C3f+U4D+T4+e3y+W1D+E4D+T4+e3y+f6D+Q2+c8y+G4D+B7y+M6f+K0f+W2y+U9+E4D+s2y+g6+f7f+U4D+T4+e3y+f6D+Q2+q7y+Z0D+u6D+l6f+R8D+W0D+S8D+k6+C7y+R1y+W2y+U9+j8y+W2y+P0y+n6f+E4D+s2y+h4f+U4D+T4+N8D+G2+c8y+j5+a9f+L4y+W8D+x5D+y6y+d6f+v8y+P0y+g0y+y3f+c0f+R1y+W2y+U9+j8y+W2y+P0y+n6f+E4D+s2y+D4f+f7f+f7f+U4D+T4+e3y+Q2+i2f+Z0D+u6D+l6f+G7+H4+y6y+q7y+G3y+q7y+L4y+W7f+R1y+W2y+U9+j6+W2y+U9+O2))[0],background:m((V5+W2y+U9+E4D+s2y+D4f+C3f+U4D+T4+e3y+f6D+Q2+q7y+n6f+L4y+f6y+y6y+l6f+G7+s4+K2y+p9D+y6y+H0f+q7y+W2y+K0f+W2y+P0y+n6f+I9D+W2y+P0y+n6f+O2))[0],close:m((V5+W2y+P0y+n6f+E4D+s2y+D4f+C3f+U4D+T4+e3y+Q2+Y5D+Q2+q7y+n6f+j5+y6y+l6f+L4y+X7y+U0f+y6y+V4y+A6+c0f+P0y+K9+f7f+b9D+W2y+P0y+n6f+O2))[0],content:null}
}
);g=f[(f4+L9y+H6t.X8y+V8y+H6t.z1y+Q9)][W6f];g[(I2f+q8D)]={windowPadding:V7y,heightCalc:a5D,attach:(m1),windowScroll:!X3}
;f.prototype.add=function(a,b){var Z7="yR",i3y="pli",U9D="ord",g1D="itF",r9y="lr",Z7D="'. ",e0D="` ",x3f=" `",s6y="ddi",f7="rror";if(d[(L9y+C9D+F9f+Q0y)](a))for(var c=0,e=a.length;c<e;c++)this[(a7+f4)](a[c]);else{c=a[(H6t.A1y+H6t.c4+B1f)];if(c===h)throw (o5+f7+L2f+H6t.c4+s6y+I1D+L2f+f9y+V8f+H6t.z1y+f4+q4y+H6t.P8+w3y+L2f+f9y+L9y+V0+f4+L2f+H6t.y8y+f2+R8f+f5D+H6t.X8y+L2f+H6t.c4+x3f+H6t.A1y+s2f+e0D+b1y+V8y+H6t.L3y+L9y+b1y+H6t.A1y);if(this[H6t.X8y][(N6+H6t.D2+i6y)][c])throw (H9D+U8+L2f+H6t.c4+f4+f4+U4f+L2f+f9y+e1f+Z5)+c+(Z7D+u7D+L2f+f9y+V8f+s3y+L2f+H6t.c4+r9y+g1y+f4+Q0y+L2f+H6t.D2+b0y+A7D+f4y+L2f+M0y+L9y+H6t.L3y+D9y+L2f+H6t.L3y+p6D+L2f+H6t.A1y+H6t.c4+B1f);this[(V6)]((L9y+H6t.A1y+g1D+V8f+s3y),a);this[H6t.X8y][B4y][c]=new f[(y9+L9y+d7D)](a,this[S7][(m5y)],this);b===h?this[H6t.X8y][(U9D+H6t.D2+H6t.y8y)][(y4y+D9y)](c):null===b?this[H6t.X8y][(h4+f4+H6t.D2+H6t.y8y)][(i7)](c):(e=d[(m6f+H6t.y8y+Y9D+Q0y)](b,this[H6t.X8y][(b1y+L5D+H6t.D2+H6t.y8y)]),this[H6t.X8y][w0f][(H6t.X8y+i3y+E7f)](e+1,0,c));}
this[(w7+f4+L9y+H6t.X8y+t0y+Z7+H6t.D2+U9D+H6t.D2+H6t.y8y)](this[(b1y+L5D+H6t.D2+H6t.y8y)]());return this;}
;f.prototype.background=function(){var b3="onBackground",a=this[H6t.X8y][d7][b3];Q8===a?this[(q4D+W3y+H6t.y8y)]():k5y===a?this[(P8D+H6t.D2)]():R3c===a&&this[(s7+P)]();return this;}
;f.prototype.blur=function(){this[(w7+H6t.D4+l7f+H6t.y8y)]();return this;}
;f.prototype.bubble=function(a,b,c,e){var t9f="inc",u8y="_focus",z1="ePosi",X1f="oseRe",h1="tons",z0f="formInfo",c2y="mErro",B2y="dre",B3D="ildr",r0y="ointer",K6y='" /></div></div><div class="',p1D='"><div/></div>',R7D="bg",E2f="sse",X4f="cat",D0f="bubbleNodes",T9="resize.",a8y="_preopen",h8f="ubble",l5D="individual",K3f="ormO",y9y="ean",l=this;if(this[(K9f+L9y+l9y)](function(){l[(H6t.D4+s2D+H6t.z1y+H6t.D2)](a,b,e);}
))return this;d[(L9y+H6t.X8y+C1+H6t.z1y+d6+H6t.A1y+u3y+N1D+y2+H6t.L3y)](b)?(e=b,b=h,c=!X3):(H6t.D4+M6+H6t.z1y+y9y)===typeof b&&(c=b,e=b=h);d[y9f](c)&&(e=c,c=!X3);c===h&&(c=!X3);var e=d[C5y]({}
,this[H6t.X8y][(f9y+K3f+V8y+t6D+H6t.A1y+H6t.X8y)][(H6t.D4+W3y+H6t.D4+q4D+H6t.D2)],e),k=this[V6](l5D,a,b);this[(a7f+f4+L9y+H6t.L3y)](a,k,(H6t.D4+h8f));if(!this[a8y]((H6t.D4+f0y+q4D+H6t.D2)))return this;var f=this[D8D](e);d(j)[m0](T9+f,function(){var f8="bble";l[(V1D+f8+C1+b1y+H6t.X8y+d5+b1y+H6t.A1y)]();}
);var i=[];this[H6t.X8y][D0f]=i[(y2+m0+X4f)][y3D](i,y(k,B0y));i=this[(y2+w0y+E2f+H6t.X8y)][c5D];k=d(s4y+i[R7D]+p1D);i=d((V5+W2y+U9+E4D+s2y+g6+f7f+U4D)+i[P9f]+k5f+i[(H6t.z1y+w5f+H6t.y8y)]+k5f+i[(H6t.L3y+H6t.c4+q4D+H6t.D2)]+(K0f+W2y+U9+E4D+s2y+h4f+U4D)+i[k5y]+K6y+i[(V8y+r0y)]+(a2D+W2y+P0y+n6f+O2));c&&(i[W9f]((h1D)),k[(z3+V8y+H6t.D2+H6t.A1y+f4+Y4y)](h1D));var c=i[(y2+D9y+B3D+Z9)]()[(f2)](X3),g=c[(y2+Z8y+H6t.z1y+B2y+H6t.A1y)](),u=g[c6D]();c[S1D](this[(H6t.a7y+U5y)][(u4+H6t.y8y+c2y+H6t.y8y)]);g[(V8y+f5D+s3D+f4)](this[(r8f)][(Z9y+U5y)]);e[H9y]&&c[(V8y+H6t.y8y+e4+H6t.D2+h7D)](this[(H6t.a7y+U5y)][z0f]);e[(c1y+n5y+H6t.D2)]&&c[b4D](this[r8f][(D9y+H6t.D2+a7+J2)]);e[(H6t.D4+M2f+h1)]&&g[S1D](this[r8f][(V1D+Z4y+w9f)]);var z=d()[(a7+f4)](i)[(H6t.c4+M7y)](k);this[(w7+t7f+X1f+T9y)](function(){z[F4f]({opacity:X3}
,function(){var Z2D="cI",o3D="nami",a2f="Dy";z[j6D]();d(j)[V7f]((H6t.y8y+H6t.D2+H6t.X8y+L9y+d6y+H6t.D2+H6t.e0f)+f);l[(w7+t7f+o1y+a2f+o3D+Z2D+H6t.A1y+f9y+b1y)]();}
);}
);k[Q9f](function(){l[Q8]();}
);u[(y2+H6t.z1y+L9y+Q7f)](function(){l[(w7+P8D+H6t.D2)]();}
);this[(H6t.D4+W3y+z6D+H6t.z1y+z1+O1D)]();z[F4f]({opacity:A3}
);this[u8y](this[H6t.X8y][(t9f+H6t.z1y+W3y+f4+P6y+K8D)],e[(u4+y2+W3y+H6t.X8y)]);this[(w7+V8y+b1y+H6t.X8y+T3f+Z9)]((H6t.D4+h8f));return this;}
;f.prototype.bubblePosition=function(){var I3D="outerWidth",b2="ft",H4y="eN",a=d("div.DTE_Bubble"),b=d("div.DTE_Bubble_Liner"),c=this[H6t.X8y][(F3+q4D+H4y+p1+c7)],e=0,l=0,k=0,f=0;d[(g1y+y2+D9y)](c,function(a,b){var e2D="ight",N4y="ffsetW",p5y="lef",c=d(b)[(L8+f9y+M8+H6t.L3y)]();e+=c.top;l+=c[(p5y+H6t.L3y)];k+=c[(N3y+b2)]+b[(b1y+N4y+L9y+f4+J1y)];f+=c.top+b[(b1y+f9y+W1y+b9+H6t.D2+e2D)];}
);var e=e/c.length,l=l/c.length,k=k/c.length,f=f/c.length,c=e,i=(l+k)/2,g=b[I3D](),u=i-g/2,g=u+g,h=d(j).width();a[l9f]({top:c,left:i}
);b.length&&0>b[(b1y+E7+H6t.X8y+H6t.D2+H6t.L3y)]().top?a[(y2+m4)]((H6t.L3y+b1y+V8y),f)[(a7+f4+G2D+V4f)]("below"):a[(H6t.y8y+G4+d2+n6y+B2f+H6t.X8y)]((i7D+H6t.z1y+H2));g+15>h?b[l9f]((H6t.z1y+H6t.D2+b2),15>u?-(u-15):-(g-h+15)):b[l9f]("left",15>u?-(u-15):0);return this;}
;f.prototype.buttons=function(a){var w5D="ttons",b=this;(w7+H6t.D4+c1+L9y+y2)===a?a=[{label:this[(L9y+U1D+b8)][this[H6t.X8y][(H6t.c4+y2+c1y+b1y+H6t.A1y)]][R3c],fn:function(){this[R3c]();}
}
]:d[g4](a)||(a=[a]);d(this[(f4+b1y+U5y)][(H6t.D4+W3y+w5D)]).empty();d[(g1y+Y7f)](a,function(a,e){var m5D="ypre",z2="tabindex",B9y="lab",X1D="abel",F3D="sN",m3y="cla",a0D="<button/>";(V3+I1D)===typeof e&&(e={label:e,fn:function(){this[R3c]();}
}
);d(a0D,{"class":b[S7][(f9y+h4+U5y)][X4]+(e[(m3y+m4+h8+O3+H6t.D2)]?L2f+e[(t7f+c1+F3D+s2f)]:I3y)}
)[(V3y)](H6t.P5f===typeof e[(H6t.z1y+X1D)]?e[l3y](b):e[(B9y+H6t.D2+H6t.z1y)]||I3y)[d1D](z2,X3)[(b1y+H6t.A1y)]((R4f+W3y+V8y),function(a){u2y===a[(F5y+z5+G2D+b1y+p6y)]&&e[(H6t.t3y)]&&e[(H6t.t3y)][(y2+I6D)](b);}
)[(b1y+H6t.A1y)]((E8+m5D+m4),function(a){u2y===a[P2f]&&a[(Z0y+H6t.D2+X3f+Z9+D3+H6t.D2+f9y+H6t.c4+W3y+X2f)]();}
)[(b1y+H6t.A1y)](Q9f,function(a){a[x1]();e[H6t.t3y]&&e[(H6t.t3y)][(I5f+H6t.z1y)](b);}
)[(L8D+H6t.D2+h7D+Y4y)](b[(H6t.a7y+U5y)][o7]);}
);return this;}
;f.prototype.clear=function(a){var W8="roy",b=this,c=this[H6t.X8y][B4y];(H6t.X8y+H6t.L3y+H6t.y8y+L9y+H6t.A1y+T9y)===typeof a?(c[a][(f4+c7+H6t.L3y+W8)](),delete  c[a],a=d[B7](a,this[H6t.X8y][(h4+f4+J2)]),this[H6t.X8y][w0f][(G7D+L9y+y2+H6t.D2)](a,A3)):d[J9D](this[I0y](a),function(a,c){b[(t7f+g1y+H6t.y8y)](c);}
);return this;}
;f.prototype.close=function(){this[(w7+t7f+k8)](!A3);return this;}
;f.prototype.create=function(a,b,c,e){var u5="yb",O1f="emb",p9="initCreate",N2y="rder",N1y="_disp",h9="_actionClass",F8D="spla",G8D="cre",S9f="editFields",l4y="idy",l=this,k=this[H6t.X8y][(f9y+K8D)],f=A3;if(this[(w7+H6t.L3y+l4y)](function(){var z1D="crea";l[(z1D+n3y)](a,b,c,e);}
))return this;(H6t.A1y+W3y+U5y+i7D+H6t.y8y)===typeof a&&(f=a,a=b,b=c);this[H6t.X8y][(x6f+B4f+V0+v5y)]={}
;for(var i=X3;i<f;i++)this[H6t.X8y][S9f][i]={fields:this[H6t.X8y][(f9y+D3f+f4+H6t.X8y)]}
;f=this[c1D](a,b,c,e);this[H6t.X8y][(H6t.c4+H6t.I4f+L9y+b1y+H6t.A1y)]=(G8D+H6t.c4+H6t.L3y+H6t.D2);this[H6t.X8y][m2D]=a5D;this[(r8f)][i0D][(H6t.X8y+L7y+H6t.z1y+H6t.D2)][(f4+L9y+F8D+Q0y)]=(H6t.D4+H6t.z1y+v3+F5y);this[h9]();this[(N1y+H6t.z1y+x9y+b1y+N2y)](this[(N6+H6t.D2+i6y)]());d[J9D](k,function(a,b){var l3c="Re";b[(U5y+W3y+N8f+l3c+H6t.X8y+H6t.M2)]();b[(b7f)](b[L1y]());}
);this[(w7+H6t.D2+X3f+H6t.D2+H6t.A1y+H6t.L3y)](p9);this[(b6f+H6t.X8y+H6t.X8y+O1f+H6t.z1y+H6t.D2+k0f+d0D)]();this[(w7+i0D+s1+R4y+L9y+b1y+G5D)](f[(W6y+H6t.X8y)]);f[(U5y+H6t.c4+u5+X4y+V8y+H6t.D2+H6t.A1y)]();return this;}
;f.prototype.dependent=function(a,b,c){var F0D="event",o5D="OS",c2f="dependent",x8="isArra";if(d[(x8+Q0y)](a)){for(var e=0,l=a.length;e<l;e++)this[c2f](a[e],b,c);return this;}
var k=this,f=this[m5y](a),i={type:(C1+o5D+H6t.P8),dataType:"json"}
,c=d[(H6t.D2+p3+f4)]({event:(y2+D9y+H6t.c4+H6t.A1y+T9y+H6t.D2),data:null,preUpdate:null,postUpdate:null}
,c),g=function(a){var i8f="Upd",c7y="preUpdate",w2f="reUp";c[(V8y+w2f+w8f+H6t.L3y+H6t.D2)]&&c[c7y](a);d[(g1y+y2+D9y)]({labels:"label",options:"update",values:"val",messages:"message",errors:"error"}
,function(b,c){a[b]&&d[(g1y+y2+D9y)](a[b],function(a,b){k[(f9y+L9y+V0+f4)](a)[c](b);}
);}
);d[(H6t.D2+H6t.c4+y2+D9y)]([(D9y+B0f),(b5+H2),"enable","disable"],function(b,c){if(a[c])k[c](a[c]);}
);c[(p0y+b4+g8)]&&c[(y8f+i8f+H6t.c4+H6t.L3y+H6t.D2)](a);}
;d(f[n0D]())[(b1y+H6t.A1y)](c[(F0D)],function(a){var j4f="bject",E9f="nO",J8y="Pl",k4f="editFie",p7="toA",q4="rge";if(-1!==d[B7](a[(H6t.L3y+H6t.c4+q4+H6t.L3y)],f[X0f]()[(p7+F9f+Q0y)]())){a={}
;a[(v3D)]=k[H6t.X8y][(k4f+i6y)]?y(k[H6t.X8y][(H6t.D2+M9+L9y+V0+v5y)],(w8f+j0)):null;a[(H6t.y8y+H2)]=a[v3D]?a[(H6t.y8y+b1y+M0y+H6t.X8y)][0]:null;a[(X3f+i0+W3y+c7)]=k[(q6f+H6t.z1y)]();if(c.data){var e=c.data(a);e&&(c.data=e);}
"function"===typeof b?(a=b(f[W1](),a,g))&&g(a):(d[(A7D+J8y+d6+E9f+j4f)](b)?d[C5y](i,b):i[(W3y+H6t.y8y+H6t.z1y)]=b,d[V6f](d[(H6t.D2+V2+H6t.D2+h7D)](i,{url:b,data:a,success:g}
)));}
}
);return this;}
;f.prototype.disable=function(a){var b=this[H6t.X8y][B4y];d[(H6t.D2+y7+D9y)](this[(H7f+e1f+h8+O3+c7)](a),function(a,e){var d2D="sabl";b[e][(H0y+d2D+H6t.D2)]();}
);return this;}
;f.prototype.display=function(a){return a===h?this[H6t.X8y][(M3+t0y+Q0y+M7)]:this[a?(b1y+V8y+Z9):(t7f+k8)]();}
;f.prototype.displayed=function(){return d[k3](this[H6t.X8y][(f9y+L9y+H6t.D2+i6y)],function(a,b){return a[(M3+V8y+w0y+P1+f4)]()?b:a5D;}
);}
;f.prototype.displayNode=function(){var A8D="rol";return this[H6t.X8y][(f4+L9y+H6t.X8y+b6y+H6t.c4+Q0y+G2D+m0+H6t.L3y+A8D+H6t.z1y+H6t.D2+H6t.y8y)][n0D](this);}
;f.prototype.edit=function(a,b,c,e,d){var j9="maybeOpen",d2y="_asse",R0y="_edit",c3y="_tid",k=this;if(this[(c3y+Q0y)](function(){k[(M7+f7D)](a,b,c,e,d);}
))return this;var f=this[(w7+y2+H6t.y8y+J1f+s3+m4y)](b,c,e,d);this[R0y](a,this[V6]((f9y+V8f+i6y),a),S2f);this[(d2y+U5y+H6t.D4+N3y+N8+H6t.c4+L9y+H6t.A1y)]();this[D8D](f[x5f]);f[j9]();return this;}
;f.prototype.enable=function(a){var r7f="dNam",b=this[H6t.X8y][B4y];d[J9D](this[(H7f+D3f+r7f+c7)](a),function(a,e){b[e][(H6t.D2+q6D+q4D+H6t.D2)]();}
);return this;}
;f.prototype.error=function(a,b){b===h?this[(w7+U5y+Q5y+H6t.c4+v8)](this[(f4+b1y+U5y)][(u4+V3D+v1)],a):this[H6t.X8y][(f9y+V8f+H6t.z1y+f4+H6t.X8y)][a].error(b);return this;}
;f.prototype.field=function(a){return this[H6t.X8y][(N6+H6t.D2+i6y)][a];}
;f.prototype.fields=function(){return d[(A7f+V8y)](this[H6t.X8y][B4y],function(a,b){return b;}
);}
;f.prototype.get=function(a){var b=this[H6t.X8y][B4y];a||(a=this[B4y]());if(d[g4](a)){var c={}
;d[J9D](a,function(a,d){c[d]=b[d][J5]();}
);return c;}
return b[a][(T9y+H6t.D2+H6t.L3y)]();}
;f.prototype.hide=function(a,b){var c=this[H6t.X8y][B4y];d[J9D](this[(w7+N6+H6t.D2+s3y+e6y+c7)](a),function(a,d){var P6="hide";c[d][P6](b);}
);return this;}
;f.prototype.inError=function(a){var l3D="formError";if(d(this[(f4+b1y+U5y)][l3D])[(L9y+H6t.X8y)]((j0D+X3f+L9y+H6t.X8y+L9y+q4D+H6t.D2)))return !0;for(var b=this[H6t.X8y][B4y],a=this[(H7f+L9y+H6t.D2+s3y+h8+O3+H6t.D2+H6t.X8y)](a),c=0,e=a.length;c<e;c++)if(b[a[c]][Y8f]())return !0;return !1;}
;f.prototype.inline=function(a,b,c){var Q1f="nli",d8y="ostopen",P2D="e_Fi",s9y="nlin",I4='_B',h7y='lin',I3f='E_In',k2D='ld',t0='ie',q6='F',L9D='ine',S5D='Inl',r1='TE_',v2D='Inli',d1='E_',C7="det",O1y="contents",e1="rmOpt",a6y="_tidy",Q5f="TE_Fi",O0y="ua",f3="isPla",e=this;d[(f3+d0D+u3y+N1D+H6t.I4f)](b)&&(c=b,b=h);var c=d[C5y]({}
,this[H6t.X8y][(u4+V3D+s1+V8y+t6D+G5D)][q0D],c),l=this[V6]((Z1f+L9y+X3f+L9y+f4+O0y+H6t.z1y),a,b),k,f,i=0,g,u=!1;d[(H6t.D2+H6t.c4+y2+D9y)](l,function(a,b){if(i>0)throw (G2D+Y+F9D+H6t.L3y+L2f+H6t.D2+r8+L2f+U5y+A9D+L2f+H6t.L3y+D9y+Y+L2f+b1y+H6t.A1y+H6t.D2+L2f+H6t.y8y+b1y+M0y+L2f+L9y+H6t.A1y+z8y+J7D+L2f+H6t.c4+H6t.L3y+L2f+H6t.c4+L2f+H6t.L3y+b0D+H6t.D2);k=d(b[B0y][0]);g=0;d[J9D](b[V0f],function(a,b){var f1y="ann";if(g>0)throw (G2D+f1y+l4+L2f+H6t.D2+f4+f7D+L2f+U5y+h4+H6t.D2+L2f+H6t.L3y+u9y+H6t.A1y+L2f+b1y+H6t.A1y+H6t.D2+L2f+f9y+L9y+H6t.D2+H6t.z1y+f4+L2f+L9y+H6t.A1y+H6t.z1y+L9y+J7D+L2f+H6t.c4+H6t.L3y+L2f+H6t.c4+L2f+H6t.L3y+b0D+H6t.D2);f=b;g++;}
);i++;}
);if(d((f4+j7D+H6t.e0f+t9+Q5f+V0+f4),k).length||this[a6y](function(){e[(L9y+H6t.A1y+z8y+J7D)](a,b,c);}
))return this;this[(w7+v3f)](a,l,"inline");var z=this[(H7f+b1y+e1+L9y+w9f)](c);if(!this[(s8f+H6t.y8y+p2+V8y+Z9)]("inline"))return this;var O=k[O1y]()[(C7+H6t.c4+y2+D9y)]();k[S1D](d((V5+W2y+P0y+n6f+E4D+s2y+h4f+U4D+T4+b5y+E4D+T4+e3y+d1+v2D+q7y+L4y+K0f+W2y+U9+E4D+s2y+g6+f7f+U4D+T4+r1+S5D+L9D+X7y+q6+t0+k2D+M2D+W2y+U9+E4D+s2y+D4f+C3f+U4D+T4+e3y+I3f+h7y+L4y+I4+H0f+c0f+c0f+y6y+q7y+f7f+e5D+W2y+U9+O2)));k[E7D]((f4+j7D+H6t.e0f+t9+Y6+w7+K1+s9y+P2D+H6t.D2+H6t.z1y+f4))[(H6t.c4+U3f+H6t.D2+h7D)](f[n0D]());c[o7]&&k[E7D]("div.DTE_Inline_Buttons")[(H6t.c4+s5f)](this[(f4+E0)][o7]);this[j0f](function(a){u=true;d(q)[(b1y+E7)]("click"+z);if(!a){k[(s0f+H6t.L3y+C6y+H6t.X8y)]()[j6D]();k[S1D](O);}
e[p8y]();}
);setTimeout(function(){if(!u)d(q)[(m0)]((y2+q3y)+z,function(a){var X8D="rg",S1y="lf",E6f="dB",t3f="Back",b=d[(f9y+H6t.A1y)][(H6t.c4+M7y+t3f)]?(a7+E6f+H6t.c4+Q7f):(Y+L9f+H6t.D2+S1y);!f[(k3f)]("owns",a[X8f])&&d[B7](k[0],d(a[(H6t.L3y+H6t.c4+X8D+H6t.D2+H6t.L3y)])[(x2D+H6t.D2+H6t.A1y+f4y)]()[b]())===-1&&e[Q8]();}
);}
,0);this[(w7+u4+y2+W3y+H6t.X8y)]([f],c[(u4+y2+T1f)]);this[(s8f+d8y)]((L9y+Q1f+J7D));return this;}
;f.prototype.message=function(a,b){var F8="nfo";b===h?this[(w7+U5y+c7+H6t.X8y+G5)](this[r8f][(i0D+K1+F8)],a):this[H6t.X8y][B4y][a][H9y](b);return this;}
;f.prototype.mode=function(){return this[H6t.X8y][z9f];}
;f.prototype.modifier=function(){return this[H6t.X8y][(R7f+L9y+f9y+L9y+H6t.D2+H6t.y8y)];}
;f.prototype.multiGet=function(a){var b=this[H6t.X8y][(f9y+L9y+H6t.D2+H6t.z1y+f4+H6t.X8y)];a===h&&(a=this[B4y]());if(d[(A7D+u7D+H6t.y8y+H6t.y8y+Q9)](a)){var c={}
;d[J9D](a,function(a,d){c[d]=b[d][l7y]();}
);return c;}
return b[a][l7y]();}
;f.prototype.multiSet=function(a,b){var r8y="ltiSet",N9f="bje",c=this[H6t.X8y][B4y];d[(A7D+C1+H6t.z1y+H6t.c4+d0D+s1+N9f+H6t.I4f)](a)&&b===h?d[(J9D)](a,function(a,b){var d4f="multiSet";c[a][d4f](b);}
):c[a][(y7D+r8y)](b);return this;}
;f.prototype.node=function(a){var b=this[H6t.X8y][(y4D+H6t.z1y+v5y)];a||(a=this[(h4+f4+J2)]());return d[g4](a)?d[(U5y+z3)](a,function(a){return b[a][n0D]();}
):b[a][n0D]();}
;f.prototype.off=function(a,b){var w7f="_eventName";d(this)[V7f](this[w7f](a),b);return this;}
;f.prototype.on=function(a,b){d(this)[(m0)](this[(w7+H6t.D2+X3f+H6t.D2+z5D+s6D+U5y+H6t.D2)](a),b);return this;}
;f.prototype.one=function(a,b){d(this)[(m0+H6t.D2)](this[(w7+H6t.D2+X3f+Z9+H6t.L3y+h8+H6t.c4+B1f)](a),b);return this;}
;f.prototype.open=function(){var E9D="sto",f4D="editOp",O9y="lle",a=this;this[(w7+f4+L9y+G7D+x9y+h4+p6y+H6t.y8y)]();this[j0f](function(){a[H6t.X8y][N1f][(y2+H6t.z1y+b1y+H6t.X8y+H6t.D2)](a,function(){var V8="icIn",l5y="_clearD";a[(l5y+Q0y+q6D+U5y+V8+f9y+b1y)]();}
);}
);if(!this[(u2f+p2+V8y+Z9)](S2f))return this;this[H6t.X8y][(H0y+H6t.X8y+V8y+H6t.z1y+H6t.c4+Q0y+G2D+x9f+R0D+O9y+H6t.y8y)][(b1y+s3D)](this,this[(f4+E0)][P9f]);this[(H7f+b1y+y2+T1f)](d[(A7f+V8y)](this[H6t.X8y][w0f],function(b){return a[H6t.X8y][(N6+d7D+H6t.X8y)][b];}
),this[H6t.X8y][(f4D+f4y)][C8y]);this[(w7+p0y+E9D+s3D)]((A7f+L9y+H6t.A1y));return this;}
;f.prototype.order=function(a){var V9f="rde",j8D="ovided",T2y="nal",E2y="slice",l8y="sort";if(!a)return this[H6t.X8y][(h4+f4+J2)];arguments.length&&!d[g4](a)&&(a=Array.prototype.slice.call(arguments));if(this[H6t.X8y][(b1y+L5D+J2)][(H6t.X8y+H6t.z1y+L9y+y2+H6t.D2)]()[l8y]()[E3y](f3D)!==a[E2y]()[l8y]()[(H6t.X5y+b1y+d0D)](f3D))throw (u7D+M1y+L2f+f9y+L9y+H6t.D2+s3y+H6t.X8y+t5D+H6t.c4+h7D+L2f+H6t.A1y+b1y+L2f+H6t.c4+f4+r8+Z6D+T2y+L2f+f9y+V8f+H6t.z1y+v5y+t5D+U5y+W3y+b4+L2f+H6t.D4+H6t.D2+L2f+V8y+H6t.y8y+j8D+L2f+f9y+h4+L2f+b1y+H6t.y8y+p6y+Y6f+T9y+H6t.e0f);d[C5y](this[H6t.X8y][(b1y+H6t.y8y+a4)],a);this[(f0f+L9y+H6t.X8y+V8y+M1f+w3+H6t.D2+b1y+V9f+H6t.y8y)]();return this;}
;f.prototype.remove=function(a,b,c,e,l){var r2="focu",H7="may",H0="ormOp",o1="semble",D0="initMultiRemove",p2f="emo",S2="tR",f1="ctio",N8y="aS",k=this;if(this[(w7+H6t.L3y+q8f+Q0y)](function(){k[i7y](a,b,c,e,l);}
))return this;a.length===h&&(a=[a]);var f=this[c1D](b,c,e,l),i=this[(w7+H6t.J1+N8y+Q7+H6t.y8y+E7f)]((N6+d7D+H6t.X8y),a);this[H6t.X8y][(H6t.c4+f1+H6t.A1y)]=(H6t.y8y+H6t.D2+U5y+N0f);this[H6t.X8y][m2D]=a;this[H6t.X8y][(M7+f7D+y9+L9y+V0+f4+H6t.X8y)]=i;this[(f4+b1y+U5y)][(Z9y+U5y)][g1f][H8f]=A6y;this[(w7+H6t.c4+x6y+m0+G2D+B2f+H6t.X8y)]();this[v2]((L9y+H6t.A1y+L9y+S2+p2f+X3f+H6t.D2),[y(i,(H6t.A1y+b1y+p6y)),y(i,(f4+H6t.c4+H6t.L3y+H6t.c4)),a]);this[v2](D0,[i,a]);this[(b6f+H6t.X8y+o1+k0f+d0D)]();this[(w7+f9y+H0+H6t.L3y+L9y+b1y+H6t.A1y+H6t.X8y)](f[x5f]);f[(H7+i7D+s1+V8y+H6t.D2+H6t.A1y)]();f=this[H6t.X8y][d7];a5D!==f[C8y]&&d(X4,this[r8f][(H6t.D4+M2f+H6t.L3y+b1y+H6t.A1y+H6t.X8y)])[(H6t.D2+D1y)](f[(r2+H6t.X8y)])[C8y]();return this;}
;f.prototype.set=function(a,b){var c=this[H6t.X8y][B4y];if(!d[y9f](a)){var e={}
;e[a]=b;a=e;}
d[(g1y+Y7f)](a,function(a,b){c[a][b7f](b);}
);return this;}
;f.prototype.show=function(a,b){var c=this[H6t.X8y][B4y];d[(H6t.D2+H6t.c4+y2+D9y)](this[I0y](a),function(a,d){c[d][T5D](b);}
);return this;}
;f.prototype.submit=function(a,b,c,e){var l=this,f=this[H6t.X8y][(f9y+V8f+H6t.z1y+v5y)],w=[],i=X3,g=!A3;if(this[H6t.X8y][(V8y+H6t.y8y+b1y+D2f+H6t.X8y+L9y+H6t.A1y+T9y)]||!this[H6t.X8y][z9f])return this;this[v3y](!X3);var h=function(){var X6D="_submit";w.length!==i||g||(g=!0,l[(X6D)](a,b,c,e));}
;this.error();d[(H6t.D2+H6t.c4+y2+D9y)](f,function(a,b){b[Y8f]()&&w[(V8y+W3y+H6t.X8y+D9y)](a);}
);d[(O6y+D9y)](w,function(a,b){f[b].error("",function(){i++;h();}
);}
);h();return this;}
;f.prototype.title=function(a){var Z2="fu",f8y="asse",b=d(this[r8f][b0])[c6D](W3f+this[(t7f+f8y+H6t.X8y)][(D9y+H6t.D2+a7+H6t.D2+H6t.y8y)][m3f]);if(a===h)return b[V3y]();(Z2+H6t.A1y+x6y+b1y+H6t.A1y)===typeof a&&(a=a(this,new r[(y1+L9y)](this[H6t.X8y][(H6t.L3y+I4y)])));b[V3y](a);return this;}
;f.prototype.val=function(a,b){return b===h?this[J5](a):this[(H6t.X8y+H6t.M2)](a,b);}
;var p=r[(u7D+V8y+L9y)][(f5D+T9y+A7D+H6t.L3y+H6t.D2+H6t.y8y)];p((H6t.D2+H0y+v8f+V4D),function(){return v(this);}
);p((R0D+M0y+H6t.e0f+y2+H6t.y8y+g1y+n3y+V4D),function(a){var b=v(this);b[R3y](B(b,a,(y2+f5D+t7)));return this;}
);p((H6t.y8y+b1y+M0y+U2D+H6t.D2+f4+f7D+V4D),function(a){var b=v(this);b[(x6f+H6t.L3y)](this[X3][X3],B(b,a,(H6t.D2+r8)));return this;}
);p((H6t.y8y+b1y+F7y+U2D+H6t.D2+r8+V4D),function(a){var b=v(this);b[(v3f)](this[X3],B(b,a,(H6t.D2+H0y+H6t.L3y)));return this;}
);p((H6t.y8y+H2+U2D+f4+H6t.D2+i3D+H6t.D2+V4D),function(a){var b=v(this);b[(f5D+U5y+b1y+K7f)](this[X3][X3],B(b,a,(a9y+d2+H6t.D2),A3));return this;}
);p((H6t.y8y+b1y+M0y+H6t.X8y+U2D+f4+g3D+H6t.D2+V4D),function(a){var b=v(this);b[(H6t.y8y+H6t.D2+U5y+N0f)](this[0],B(b,a,"remove",this[0].length));return this;}
);p((p6f+H6t.z1y+U2D+H6t.D2+f4+f7D+V4D),function(a,b){a?d[y9f](a)&&(b=a,a=(d0D+H6t.z1y+w5f)):a=q0D;v(this)[a](this[X3][X3],b);return this;}
);p(B8D,function(a){v(this)[(F3+H6t.D4+H6t.z1y+H6t.D2)](this[X3],a);return this;}
);p((N6+N3y+V4D),function(a,b){return f[(N6+N3y+H6t.X8y)][a][b];}
);p(d9,function(a,b){var K8f="file";if(!a)return f[(K8f+H6t.X8y)];if(!b)return f[U3y][a];f[U3y][a]=b;return this;}
);d(q)[m0]((b0y+D9y+H6t.y8y+H6t.e0f+f4+H6t.L3y),function(a,b,c){Y5y===a[E5f]&&c&&c[(f9y+o0D+H6t.X8y)]&&d[J9D](c[U3y],function(a,b){f[U3y][a]=b;}
);}
);f.error=function(a,b){var L1D="atabl",A0f="://",r0f="ation";throw b?a+(L2f+y9+h4+L2f+U5y+A9D+L2f+L9y+H6t.A1y+f9y+h4+U5y+r0f+t5D+V8y+H6t.z1y+g1y+M8+L2f+H6t.y8y+Y7+J2+L2f+H6t.L3y+b1y+L2f+D9y+H6t.L3y+H6t.L3y+V8y+H6t.X8y+A0f+f4+d8+L1D+c7+H6t.e0f+H6t.A1y+H6t.D2+H6t.L3y+Z0f+H6t.L3y+H6t.A1y+Z0f)+b:a;}
;f[(V8y+H6t.c4+L9y+z7D)]=function(a,b,c){var U8f="bel",e,l,f,b=d[C5y]({label:(H6t.z1y+K2+H6t.D2+H6t.z1y),value:"value"}
,b);if(d[g4](a)){e=0;for(l=a.length;e<l;e++)f=a[e],d[y9f](f)?c(f[b[(q6f+H6t.z1y+W3y+H6t.D2)]]===h?f[b[(H6t.z1y+H6t.c4+U8f)]]:f[b[J0f]],f[b[l3y]],e):c(f,f,e);}
else e=0,d[(H6t.D2+H6t.c4+Y7f)](a,function(a,b){c(b,a,e);e++;}
);}
;f[(t5f+H6t.D2+E0f)]=function(a){return a[(f5D+t0y+E7f)](/\./g,f3D);}
;f[M4]=function(a,b,c,e,l){var x2f="RL",J5y="aU",s8="adAsD",h6D="loadi",L5y="fileReadText",k=new FileReader,w=X3,i=[];a.error(b[(H6t.A1y+H6t.c4+B1f)],"");e(b,b[L5y]||(j2D+L9y+g4D+X0+V8y+h6D+H6t.A1y+T9y+L2f+f9y+L9y+N3y+G0D+L9y+g4D));k[(b1y+H6t.A1y+H6t.z1y+j5f)]=function(){var d2f="preSubmit.DTE_Upload",n0y="pecifi",g8D="No",W7y="aja",N4="inObje",c3f="Pla",t9D="ja",H4D="ajaxData",j8f="pload",p1f="uploadField",F2y="ploa",u1f="act",g=new FormData,h;g[S1D]((u1f+L9y+b1y+H6t.A1y),(W3y+F2y+f4));g[(z3+V8y+Z9+f4)](p1f,b[t1D]);g[S1D]((W3y+j8f),c[w]);b[H4D]&&b[(H6t.c4+t9D+b0y+t9+d8+H6t.c4)](g);if(b[V6f])h=b[(H6t.c4+B6y)];else if((H6t.X8y+H6t.L3y+H6t.y8y+d0D+T9y)===typeof a[H6t.X8y][V6f]||d[(L9y+H6t.X8y+c3f+N4+y2+H6t.L3y)](a[H6t.X8y][(W7y+b0y)]))h=a[H6t.X8y][(H6t.c4+t9D+b0y)];if(!h)throw (g8D+L2f+u7D+H6t.X5y+w5+L2f+b1y+V8y+t6D+H6t.A1y+L2f+H6t.X8y+n0y+M7+L2f+f9y+h4+L2f+W3y+V8y+E9y+a7+L2f+V8y+H6t.z1y+W3y+T9y+f3D+L9y+H6t.A1y);X5D===typeof h&&(h={url:h}
);var z=!A3;a[(m0)](d2f,function(){z=!X3;return !A3;}
);d[(H6t.c4+H6t.X5y+w5)](d[(C5y)]({}
,h,{type:(y8f),data:g,dataType:"json",contentType:!1,processData:!1,xhr:function(){var U1f="onl",n9D="onprogress",B9f="xhr",r0D="xSe",a=d[(H6t.c4+t9D+r0D+Z4y+L9y+H6t.A1y+m4y)][(B9f)]();a[M4]&&(a[M4][n9D]=function(a){var P1y="toFixed",J7="total",A1D="loaded",N0y="lengthComputable";a[N0y]&&(a=(100*(a[A1D]/a[J7]))[P1y](0)+"%",e(b,1===c.length?a:w+":"+c.length+" "+a));}
,a[M4][(U1f+b1y+G2f+H6t.A1y+f4)]=function(){e(b);}
);return a;}
,success:function(e){var R3D="taU",x6D="dAsD",T3D="les",H8y="red",Q0f="cc",J4D="tatu";a[V7f]("preSubmit.DTE_Upload");if(e[X0D]&&e[(y4D+s3y+H9D+R0D+z7D)].length)for(var e=e[X0D],g=0,h=e.length;g<h;g++)a.error(e[g][(t1D)],e[g][(H6t.X8y+J4D+H6t.X8y)]);else e.error?a.error(e.error):!e[M4]||!e[(W3y+V8y+H6t.z1y+b1y+H6t.c4+f4)][(L9y+f4)]?a.error(b[(t1D)],(u7D+L2f+H6t.X8y+J2+X3f+J2+L2f+H6t.D2+H6t.y8y+H6t.y8y+b1y+H6t.y8y+L2f+b1y+Q0f+X5f+H8y+L2f+M0y+D9y+o0D+L2f+W3y+b6y+B8+f4+d0D+T9y+L2f+H6t.L3y+D9y+H6t.D2+L2f+f9y+L9y+N3y)):(e[(N6+T3D)]&&d[(g1y+Y7f)](e[(N6+T3D)],function(a,b){f[U3y][a]=b;}
),i[(y4y+D9y)](e[M4][q8f]),w<c.length-1?(w++,k[(H6t.y8y+H6t.D2+H6t.c4+x6D+H6t.c4+R3D+w3+v5)](c[w])):(l[(y2+H6t.c4+M1y)](a,i),z&&a[R3c]()));}
,error:function(){var J0="ding",r4="ccu",C9="erv";a.error(b[(H6t.A1y+O3+H6t.D2)],(u7D+L2f+H6t.X8y+C9+H6t.D2+H6t.y8y+L2f+H6t.D2+H6t.y8y+R0D+H6t.y8y+L2f+b1y+r4+D6D+H6t.D2+f4+L2f+M0y+Q0D+H6t.D2+L2f+W3y+V8y+H6t.z1y+B8+J0+L2f+H6t.L3y+D9y+H6t.D2+L2f+f9y+o0D));}
}
));}
;k[(H6t.y8y+H6t.D2+s8+H6t.c4+H6t.L3y+J5y+x2f)](c[X3]);}
;f.prototype._constructor=function(a){var y3c="_ev",O9="xhr.dt",f1f="init.dt.dte",K1f="foot",i4D="ooter",C9y="formContent",O4y="rap",S3="events",x1f="eate",o3="BU",u9="ols",L7D="taTable",v0f='to',I9y='_bu',k7="info",u0y='orm_',e1D='m_',B4D='orm_con',t8f='ot',t4y='ten',u3f='ody_',F7='dy',i5="dica",Y8='in',S4y='oce',k5="wrapp",f9f="acy",v6y="formO",f4f="dataSources",f5="domTable",l6D="jaxU",G3D="dbTa";a=d[C5y](!X3,{}
,f[Z4],a);this[H6t.X8y]=d[(H6t.D2+b0y+H6t.L3y+Z9+f4)](!X3,{}
,f[I1][(H6t.X8y+e3D+H6t.A1y+T9y+H6t.X8y)],{table:a[(r8f+H6t.P8+K2+H6t.z1y+H6t.D2)]||a[(j0+q4D+H6t.D2)],dbTable:a[(G3D+H6t.D4+H6t.z1y+H6t.D2)]||a5D,ajaxUrl:a[(H6t.c4+l6D+m3D)],ajax:a[V6f],idSrc:a[(L9y+f4+z9+y2)],dataSource:a[f5]||a[D2D]?f[f4f][(H6t.J1+z0+H6t.D4+H6t.z1y+H6t.D2)]:f[f4f][(Y0y+H6t.z1y)],formOptions:a[(v6y+R4y+L9y+b1y+G5D)],legacyAjax:a[(H6t.z1y+H6t.D2+T9y+f9f+u7D+B6y)]}
);this[(W4y+H6t.D2+H6t.X8y)]=d[C5y](!X3,{}
,f[(y2+B2f+H6t.X8y+H6t.D2+H6t.X8y)]);this[(L9y+U5+H6t.A1y)]=a[(L9y+U5+H6t.A1y)];var b=this,c=this[S7];this[(f4+E0)]={wrapper:d((V5+W2y+U9+E4D+s2y+D4f+f7f+f7f+U4D)+c[(k5+J2)]+(K0f+W2y+P0y+n6f+E4D+W2y+l1+K2y+o8+W2y+c0f+L4y+o8+L4y+U4D+l6f+W7f+S4y+f7f+f7f+Y8+g0y+n8f+s2y+h4f+U4D)+c[(D7f+y2+c7+A5+H6t.A1y+T9y)][(L9y+H6t.A1y+i5+v8f)]+(R1y+W2y+P0y+n6f+j8y+W2y+U9+E4D+W2y+l1+K2y+o8+W2y+H4f+o8+L4y+U4D+t7y+y6y+F7+n8f+s2y+f6y+H8+f7f+U4D)+c[(H6t.D4+p1+Q0y)][(M0y+H6t.y8y+H6t.c4+U3f+H6t.D2+H6t.y8y)]+(K0f+W2y+U9+E4D+W2y+K2y+A9f+o8+W2y+H4f+o8+L4y+U4D+t7y+u3f+s2y+q9f+t4y+c0f+n8f+s2y+f6y+C1D+U4D)+c[(H6t.D4+b1y+l9y)][(y2+m0+H6t.L3y+Z9+H6t.L3y)]+(e5D+W2y+P0y+n6f+j8y+W2y+P0y+n6f+E4D+W2y+K2y+A9f+o8+W2y+c0f+L4y+o8+L4y+U4D+K4y+y6y+t8f+n8f+s2y+D4f+f7f+f7f+U4D)+c[(f9y+b1y+l4+J2)][P9f]+(K0f+W2y+U9+E4D+s2y+f6y+K2y+C3f+U4D)+c[G7f][(s0f+H6t.L3y+H6t.D2+z5D)]+(e5D+W2y+P0y+n6f+j6+W2y+P0y+n6f+O2))[0],form:d('<form data-dte-e="form" class="'+c[(Z9y+U5y)][(j0+T9y)]+(K0f+W2y+P0y+n6f+E4D+W2y+O7f+o8+W2y+c0f+L4y+o8+L4y+U4D+K4y+B4D+t4y+c0f+n8f+s2y+g6+f7f+U4D)+c[(u4+V3D)][(I2f+H6t.A1y+n3y+H6t.A1y+H6t.L3y)]+(e5D+K4y+y6y+W7f+f7y+O2))[0],formError:d((V5+W2y+U9+E4D+W2y+K2y+A9f+o8+W2y+c0f+L4y+o8+L4y+U4D+K4y+J8f+e1D+Q+W7f+y6y+W7f+n8f+s2y+h4f+U4D)+c[(u4+V3D)].error+(o0y))[0],formInfo:d((V5+W2y+U9+E4D+W2y+K2y+c0f+K2y+o8+W2y+c0f+L4y+o8+L4y+U4D+K4y+u0y+Y8+K4y+y6y+n8f+s2y+f6y+K2y+f7f+f7f+U4D)+c[(f9y+h4+U5y)][k7]+'"/>')[0],header:d('<div data-dte-e="head" class="'+c[(D9y+H6t.D2+H6t.c4+p6y+H6t.y8y)][(M0y+Y9D+V8y+a8D)]+'"><div class="'+c[(w3y+H6t.c4+a4)][(y2+b1y+H6t.A1y+H6t.L3y+C6y)]+'"/></div>')[0],buttons:d((V5+W2y+U9+E4D+W2y+l1+K2y+o8+W2y+c0f+L4y+o8+L4y+U4D+K4y+J8f+f7y+I9y+c0f+v0f+q7y+f7f+n8f+s2y+f6y+C1D+U4D)+c[(f9y+b1y+H6t.y8y+U5y)][(O0D+H6t.L3y+b1y+H6t.A1y+H6t.X8y)]+'"/>')[0]}
;if(d[H6t.t3y][(w8f+L7D)][(U+q4D+H6t.D2+Y4y+u9)]){var e=d[(f9y+H6t.A1y)][G6][x2y][(o3+H6t.P8+H6t.P8+s1+h8+K3)],l=this[(X0y+b8)];d[(g1y+Y7f)]([(O9f+x1f),(M7+L9y+H6t.L3y),(H6t.y8y+H6t.D2+T9f+K7f)],function(a,b){var p4D="tonText",h9D="sB",j5D="itor_";e[(M7+j5D)+b][(h9D+M2f+p4D)]=l[b][(H6t.D4+a5f)];}
);}
d[(H6t.D2+y7+D9y)](a[S3],function(a,c){b[(b1y+H6t.A1y)](a,function(){var U2f="ly",a=Array.prototype.slice.call(arguments);a[k4y]();c[(z3+V8y+U2f)](b,a);}
);}
);var c=this[r8f],k=c[(M0y+O4y+a8D)];c[C9y]=t((f9y+b1y+H6t.y8y+U5y+O0f+m0+H6t.L3y+C6y),c[(f9y+Q8D)])[X3];c[(f9y+i4D)]=t(K1f,k)[X3];c[h1D]=t(h1D,k)[X3];c[(G9D+l9y+O6f+H6t.A1y+n3y+z5D)]=t((H6t.D4+y2D+F4y+H6t.A1y+e6f),k)[X3];c[h4D]=t(h4D,k)[X3];a[(N6+d7D+H6t.X8y)]&&this[o2f](a[(f9y+L9y+V0+f4+H6t.X8y)]);d(q)[(m0)](f1f,function(a,c){var a9D="nTable";b[H6t.X8y][(j0+H6t.D4+N3y)]&&c[a9D]===d(b[H6t.X8y][D2D])[J5](X3)&&(c[y0]=b);}
)[(b1y+H6t.A1y)](O9,function(a,c,e){var d9D="Up";e&&(b[H6t.X8y][(H6t.L3y+H6t.c4+H6t.D4+H6t.z1y+H6t.D2)]&&c[(H6t.A1y+H6t.P8+H6t.c4+q4D+H6t.D2)]===d(b[H6t.X8y][(H6t.L3y+I4y)])[(v8+H6t.L3y)](X3))&&b[(x4y+H6t.L3y+L9y+w9f+d9D+w8f+n3y)](e);}
);this[H6t.X8y][N1f]=f[H8f][a[(H0y+H6t.X8y+V8y+H6t.z1y+H6t.c4+Q0y)]][(d0D+f7D)](this);this[(y3c+C6y)]((L9y+E8D+H6t.L3y+G2D+b1y+A4f+n3y),[]);}
;f.prototype._actionClass=function(){var C0f="dC",n1f="mov",a=this[S7][(H6t.c4+y2+c1y+w9f)],b=this[H6t.X8y][(H6t.c4+y2+H6t.L3y+L9y+b1y+H6t.A1y)],c=d(this[(H6t.a7y+U5y)][(A7y+H6t.c4+D5y)]);c[Z]([a[(O9f+g1y+n3y)],a[v3f],a[(H6t.y8y+H6t.D2+n1f+H6t.D2)]][E3y](L2f));(y2+C3y+n3y)===b?c[(H6t.c4+f4+C0f+B2f+H6t.X8y)](a[R3y]):v3f===b?c[t4f](a[v3f]):(f5D+U5y+b1y+X3f+H6t.D2)===b&&c[(a7+f4+G2D+H6t.z1y+w1)](a[i7y]);}
;f.prototype._ajax=function(a,b,c){var o6="Of",h2f="param",d3D="isFunction",a1f="url",Z3="xOf",a6D="plit",n5D="sF",c3D="lain",k0D="sP",T7="ditFi",w9y="ajaxUrl",d3y="OST",e={type:(C1+d3y),dataType:"json",data:null,error:c,success:function(a,c,e){var S6y="status";204===e[S6y]&&(a={}
);b(a);}
}
,l;l=this[H6t.X8y][z9f];var f=this[H6t.X8y][V6f]||this[H6t.X8y][w9y],g="edit"===l||(H6t.y8y+H6t.D2+U5y+d2+H6t.D2)===l?y(this[H6t.X8y][(H6t.D2+T7+H6t.D2+H6t.z1y+v5y)],(q8f+z9+y2)):null;d[(L9y+C9D+F9f+Q0y)](g)&&(g=g[(H6t.X5y+N3D)](","));d[(L9y+k0D+c3D+u3y+H6t.X5y+H6t.D2+y2+H6t.L3y)](f)&&f[l]&&(f=f[l]);if(d[(L9y+n5D+W3y+H6t.A1y+H6t.I4f+Z6D+H6t.A1y)](f)){var h=null,e=null;if(this[H6t.X8y][w9y]){var J=this[H6t.X8y][w9y];J[R3y]&&(h=J[l]);-1!==h[e9y](" ")&&(l=h[(H6t.X8y+a6D)](" "),e=l[0],h=l[1]);h=h[I0D](/_id_/,g);}
f(e,h,a,b,c);}
else(b4+Y6f+T9y)===typeof f?-1!==f[(L9y+h7D+H6t.D2+Z3)](" ")?(l=f[k1D](" "),e[T4f]=l[0],e[a1f]=l[1]):e[(W3y+m3D)]=f:e=d[(H6t.D2+p3+f4)]({}
,e,f||{}
),e[(W3y+H6t.y8y+H6t.z1y)]=e[a1f][I0D](/_id_/,g),e.data&&(c=d[d3D](e.data)?e.data(a):e.data,a=d[(A7D+y9+W3y+H6t.A1y+y2+H6t.L3y+L9y+b1y+H6t.A1y)](e.data)&&c?c:d[C5y](!0,a,c)),e.data=a,"DELETE"===e[T4f]&&(a=d[h2f](e.data),e[a1f]+=-1===e[a1f][(d0D+p6y+b0y+o6)]("?")?"?"+a:"&"+a,delete  e.data),d[(V6f)](e);}
;f.prototype._assembleMain=function(){var G6y="mIn",q2f="dyC",a6f="ormEr",a=this[(r8f)];d(a[P9f])[b4D](a[(w3y+a7+H6t.D2+H6t.y8y)]);d(a[G7f])[(H6t.c4+s5f)](a[(f9y+a6f+R0D+H6t.y8y)])[(H6t.c4+V8y+s3D+f4)](a[(X4+H6t.X8y)]);d(a[(H6t.D4+b1y+q2f+m0+H6t.L3y+H6t.D2+z5D)])[S1D](a[(Z9y+G6y+u4)])[(z3+w8y+H6t.A1y+f4)](a[(f9y+b1y+H6t.y8y+U5y)]);}
;f.prototype._blur=function(){var T0D="Bl",g5y="preBlur",a=this[H6t.X8y][d7];!A3!==this[v2](g5y)&&(R3c===a[q1]?this[(D7+H6t.D4+U5y+L9y+H6t.L3y)]():k5y===a[(m0+T0D+X5f)]&&this[y9D]());}
;f.prototype._clearDynamicInfo=function(){var a=this[(y2+H6t.z1y+c1+M8+H6t.X8y)][m5y].error,b=this[H6t.X8y][B4y];d("div."+a,this[(r8f)][(M0y+Y9D+V8y+a8D)])[(R4D+X3f+H6t.D2+k6f+c1+H6t.X8y)](a);d[J9D](b,function(a,b){b.error("")[H9y]("");}
);this.error("")[H9y]("");}
;f.prototype._close=function(a){var L4f="Cb",j5y="preClose";!A3!==this[v2](j5y)&&(this[H6t.X8y][g0D]&&(this[H6t.X8y][(y2+H6t.z1y+W4+n6y+H6t.D4)](a),this[H6t.X8y][(t7f+k8+L4f)]=a5D),this[H6t.X8y][(y2+L7f+q0y+y2+H6t.D4)]&&(this[H6t.X8y][Q1D](),this[H6t.X8y][Q1D]=a5D),d(h1D)[V7f](B2),this[H6t.X8y][(f4+h0D+H6t.c4+P1+f4)]=!A3,this[(w7+H6t.D2+K7f+z5D)](k5y));}
;f.prototype._closeReg=function(a){this[H6t.X8y][g0D]=a;}
;f.prototype._crudArgs=function(a,b,c,e){var s0y="boolea",l=this,f,g,i;d[y9f](a)||((s0y+H6t.A1y)===typeof a?(i=a,a=b):(f=a,g=b,i=c,a=e));i===h&&(i=!X3);f&&l[U2](f);g&&l[(V1D+H6t.L3y+H6t.L3y+w9f)](g);return {opts:d[(H6t.D2+b0y+n3y+H6t.A1y+f4)]({}
,this[H6t.X8y][(u4+V3D+H3+c1y+w9f)][S2f],a),maybeOpen:function(){i&&l[(K1D)]();}
}
;}
;f.prototype._dataSource=function(a){var S6D="dataSource",b=Array.prototype.slice.call(arguments);b[k4y]();var c=this[H6t.X8y][S6D][a];if(c)return c[(z3+b6y+Q0y)](this,b);}
;f.prototype._displayReorder=function(a){var t0D="actio",g9="Or",d4y="child",x0D="includeFields",b=d(this[(f4+E0)][(u4+H6t.y8y+U5y+O6f+z5D+H6t.D2+z5D)]),c=this[H6t.X8y][B4y],e=this[H6t.X8y][w0f];a?this[H6t.X8y][x0D]=a:a=this[H6t.X8y][x0D];b[(d4y+H6t.y8y+H6t.D2+H6t.A1y)]()[(f4+H6t.D2+H6t.L3y+y7+D9y)]();d[J9D](e,function(e,k){var g=k instanceof f[h9y]?k[(q6D+B1f)]():k;-A3!==d[(d0D+s3+H6t.y8y+Q9)](g,a)&&b[(H6t.c4+V8y+s3D+f4)](c[g][n0D]());}
);this[(a7f+X3f+H6t.D2+z5D)]((f4+L9y+N9+g9+p6y+H6t.y8y),[this[H6t.X8y][Q4f],this[H6t.X8y][(t0D+H6t.A1y)],b]);}
;f.prototype._edit=function(a,b,c){var f9="iEdi",I3="tMu",u0="Get",f8f="layReor",W0y="splice",R6y="styl",e=this[H6t.X8y][(f9y+L9y+H6t.D2+H6t.z1y+f4+H6t.X8y)],l=[],f;this[H6t.X8y][(H6t.D2+H0y+H6t.L3y+y9+D3f+v5y)]=b;this[H6t.X8y][(R7f+L9y+N6+J2)]=a;this[H6t.X8y][(H6t.c4+y2+H6t.L3y+L9y+b1y+H6t.A1y)]=(M7+f7D);this[r8f][(Z9y+U5y)][(R6y+H6t.D2)][(H0y+N9)]=(i2+y2+F5y);this[(w7+H6t.c4+y2+H6t.L3y+L9y+m0+G2D+B2f+H6t.X8y)]();d[(O6y+D9y)](e,function(a,c){var d7f="iR";c[(U5y+F9y+d7f+H6t.D2+b7f)]();f=!0;d[(H6t.D2+z0y)](b,function(b,e){var r1f="elds",R6f="iS";if(e[B4y][a]){var d=c[v8D](e.data);c[(M7f+R6f+H6t.D2+H6t.L3y)](b,d!==h?d:c[L1y]());e[(M3+b6y+Q9+y9+e1f+H6t.X8y)]&&!e[(f4+A7D+b6y+Q9+e8+r1f)][a]&&(f=!1);}
}
);0!==c[Z6f]().length&&f&&l[(m2y+b5)](a);}
);for(var e=this[(h4+a4)]()[(H6t.X8y+H6t.z1y+L9y+y2+H6t.D2)](),g=e.length;0<=g;g--)-1===d[B7](e[g],l)&&e[W0y](g,1);this[(w7+M3+V8y+f8f+p6y+H6t.y8y)](e);this[H6t.X8y][(v3f+t9+d8+H6t.c4)]=d[(N5+n3y+h7D)](!0,{}
,this[(U5y+F9y+L9y+u0)]());this[v2]((d0D+f7D+o5+r8),[y(b,(F9D+p6y))[0],y(b,(H6t.m5))[0],a,c]);this[(a7f+K7f+H6t.A1y+H6t.L3y)]((d0D+L9y+I3+X2f+f9+H6t.L3y),[b,a,c]);}
;f.prototype._event=function(a,b){var i6f="Event";b||(b=[]);if(d[(A7D+s3+F5)](a))for(var c=0,e=a.length;c<e;c++)this[(w7+H6t.D2+K7f+z5D)](a[c],b);else return c=d[i6f](a),d(this)[R7y](c,b),c[(H6t.y8y+H6t.D2+H6t.X8y+W3y+X2f)];}
;f.prototype._eventName=function(a){var v4="jo",P4D="substring",I6y="ase",x8f="toLo",s9D="spli";for(var b=a[(s9D+H6t.L3y)](" "),c=0,e=b.length;c<e;c++){var a=b[c],d=a[h3D](/^on([A-Z])/);d&&(a=d[1][(x8f+M0y+J2+G2D+I6y)]()+a[P4D](3));b[c]=a;}
return b[(v4+L9y+H6t.A1y)](" ");}
;f.prototype._fieldNames=function(a){return a===h?this[(y4D+i6y)]():!d[(L9y+n4f+Y9D+Q0y)](a)?[a]:a;}
;f.prototype._focus=function(a,b){var c=this,e,l=d[(U5y+H6t.c4+V8y)](a,function(a){return (V3+H6t.A1y+T9y)===typeof a?c[H6t.X8y][B4y][a]:a;}
);(H6t.A1y+W3y+U5y+i7D+H6t.y8y)===typeof b?e=l[b]:b&&(e=X3===b[(L9y+H6t.A1y+f4+H6t.D2+b0y+s1+f9y)]((H6t.c2+j0D))?d((u1+H6t.e0f+t9+H6t.P8+o5+L2f)+b[(a4y+H6t.z1y+m0y)](/^jq:/,I3y)):this[H6t.X8y][B4y][b]);(this[H6t.X8y][T3y]=e)&&e[(u4+y2+W3y+H6t.X8y)]();}
;f.prototype._formOptions=function(a){var a5="utto",Z4D="boolean",t7D="essa",c9="tO",U9y="rOnBack",q0="blu",D7D="ground",F0f="onBa",B0="blurOnBackground",u7="submitOnReturn",H2D="tur",J0D="rn",M1D="submitOnBlur",g3="On",y1D="closeOnComplete",S3D="line",b=this,c=N++,e=(H6t.e0f+f4+H6t.L3y+H6t.D2+K1+H6t.A1y+S3D)+c;a[y1D]!==h&&(a[W7]=a[(y2+E9y+M8+g3+O6f+A4f+H6t.L3y+H6t.D2)]?(y2+H6t.z1y+b1y+M8):A6y);a[M1D]!==h&&(a[q1]=a[M1D]?R3c:(y2+H6t.z1y+k8));a[(D7+H6t.D4+U5y+L9y+H6t.L3y+g3+w3+H6t.M2+W3y+J0D)]!==h&&(a[(m0+w3+H6t.D2+H2D+H6t.A1y)]=a[u7]?(s7+Z3f+H6t.L3y):(H6t.A1y+w6f));a[B0]!==h&&(a[(F0f+y2+F5y+D7D)]=a[(q0+U9y+M5D+R)]?Q8:(H6t.A1y+w6f));this[H6t.X8y][(H6t.D2+H0y+c9+V8y+H6t.L3y+H6t.X8y)]=a;this[H6t.X8y][q1D]=c;if(X5D===typeof a[(c1y+R9y)]||(f9y+W3y+H6t.A1y+x6y+b1y+H6t.A1y)===typeof a[U2])this[U2](a[(K3D+H6t.z1y+H6t.D2)]),a[U2]=!X3;if(X5D===typeof a[(B1f+H6t.X8y+e3+v8)]||H6t.P5f===typeof a[H9y])this[H9y](a[H9y]),a[(U5y+t7D+T9y+H6t.D2)]=!X3;Z4D!==typeof a[o7]&&(this[(O0D+p9y+G5D)](a[(H6t.D4+a5+G5D)]),a[o7]=!X3);d(q)[m0]("keydown"+e,function(c){var y4="cus",k3D="next",h6y="rev",t2y="keyC",D1D="Bu",F7f="Form",m9y="onEsc",l8="fa",O9D="reve",f2D="yCod",e8f="urn",y4f="Ret",K0="rCa",Z2y="Lo",u9D="Elem",e=d(q[(H6t.c4+y2+c1y+X3f+H6t.D2+u9D+Z9+H6t.L3y)]),f=e.length?e[0][K0D][(H6t.L3y+b1y+Z2y+M0y+H6t.D2+K0+H6t.X8y+H6t.D2)]():null;d(e)[d1D]((T4f));if(b[H6t.X8y][Q4f]&&a[(m0+y4f+e8f)]==="submit"&&c[(E8+f2D+H6t.D2)]===13&&f===(L9y+H6t.A1y+J4y)){c[(V8y+O9D+H6t.A1y+D3+H6t.D2+l8+F9y)]();b[(H6t.X8y+f0y+P)]();}
else if(c[(R4f+G2D+p1+H6t.D2)]===27){c[x1]();switch(a[m9y]){case (H6t.D4+l7f+H6t.y8y):b[Q8]();break;case "close":b[k5y]();break;case "submit":b[(H6t.X8y+W3y+H6t.D4+P)]();}
}
else e[(V8y+H6t.c4+f5D+z5D+H6t.X8y)]((H6t.e0f+t9+U0y+F7f+w7+D1D+Z4y+b1y+H6t.A1y+H6t.X8y)).length&&(c[(t2y+b1y+p6y)]===37?e[(V8y+h6y)]((V1D+Z4y+m0))[(f9y+b1y+y2+T1f)]():c[P2f]===39&&e[k3D]("button")[(u4+y4)]());}
);this[H6t.X8y][Q1D]=function(){var r9f="eydown";d(q)[V7f]((F5y+r9f)+e);}
;return e;}
;f.prototype._legacyAjax=function(a,b,c){var X7f="legacyAjax";if(this[H6t.X8y][X7f])if(R5D===a)if((y2+h3)===b||(x6f+H6t.L3y)===b){var e;d[J9D](c.data,function(a){var n8y="gacy",Q6D="ort",r4y="Edito";if(e!==h)throw (r4y+H6t.y8y+Q7y+N8+F9y+L9y+f3D+H6t.y8y+H2+L2f+H6t.D2+f4+d5+I1D+L2f+L9y+H6t.X8y+L2f+H6t.A1y+l4+L2f+H6t.X8y+W3y+U3f+Q6D+H6t.D2+f4+L2f+H6t.D4+Q0y+L2f+H6t.L3y+D9y+H6t.D2+L2f+H6t.z1y+H6t.D2+n8y+L2f+u7D+H6t.X5y+w5+L2f+f4+d8+H6t.c4+L2f+f9y+Q8D+H6t.c4+H6t.L3y);e=a;}
);c.data=c.data[e];(M7+f7D)===b&&(c[(q8f)]=e);}
else c[(L9y+f4)]=d[k3](c.data,function(a,b){return b;}
),delete  c.data;else c.data=!c.data&&c[m1]?[c[m1]]:[];}
;f.prototype._optionsUpdate=function(a){var b=this;a[(W6y+L9y+m0+H6t.X8y)]&&d[J9D](this[H6t.X8y][(f9y+L9y+d7D+H6t.X8y)],function(c){var D8y="pd";if(a[j3D][c]!==h){var e=b[(f9y+L9y+d7D)](c);e&&e[(W3y+D8y+d8+H6t.D2)]&&e[(D9f+f4+t7)](a[(l0+H6t.L3y+L9y+b1y+G5D)][c]);}
}
);}
;f.prototype._message=function(a,b){var O5D="fadeIn";H6t.P5f===typeof b&&(b=b(this,new r[(u7D+H1y)](this[H6t.X8y][(S7D+N3y)])));a=d(a);!b&&this[H6t.X8y][(I6+w0y+Q0y+H6t.D2+f4)]?a[(H6t.X8y+T3f)]()[(f9y+a7+X4y+M2f)](function(){a[(V3y)](I3y);}
):b?this[H6t.X8y][(f4+L9y+o4+M1f+M7)]?a[(t4D)]()[V3y](b)[O5D]():a[(Y0y+H6t.z1y)](b)[l9f]((f4+L9y+H6t.X8y+V8y+M1f),(H6t.D4+H6t.z1y+b1y+y2+F5y)):a[(K2f+R9f)](I3y)[l9f](H8f,A6y);}
;f.prototype._multiInfo=function(){var Z7f="multiInfoShown",w2y="sMu",S3c="incl",a=this[H6t.X8y][B4y],b=this[H6t.X8y][(S3c+J1f+H6t.D2+y9+e1f+H6t.X8y)],c=!0;if(b)for(var e=0,d=b.length;e<d;e++)a[b[e]][(L9y+w2y+X2f+L9y+T6+i0+W3y+H6t.D2)]()&&c?(a[b[e]][Z7f](c),c=!1):a[b[e]][Z7f](!1);}
;f.prototype._postopen=function(a){var m2="tiI",V9="mai",Q1="ito",T7f="submit.editor-internal",Z6="eFo",z8="oll",b=this,c=this[H6t.X8y][(f4+L9y+o4+H6t.z1y+H6t.c4+Q0y+G2D+m0+H6t.L3y+H6t.y8y+z8+H6t.D2+H6t.y8y)][(y2+H6t.c4+V8y+H6t.L3y+W3y+H6t.y8y+Z6+y2+W3y+H6t.X8y)];c===h&&(c=!X3);d(this[r8f][(i0D)])[(V7f)](T7f)[(b1y+H6t.A1y)]((D7+H6t.D4+P+H6t.e0f+H6t.D2+f4+Q1+H6t.y8y+f3D+L9y+H6t.A1y+H6t.L3y+J2+q6D+H6t.z1y),function(a){var z6y="fau";a[(V8y+H6t.y8y+H6t.D2+X3f+Z9+H6t.L3y+t9+H6t.D2+z6y+X2f)]();}
);if(c&&((V9+H6t.A1y)===a||c5D===a))d((H6t.D4+y2D))[(b1y+H6t.A1y)](B2,function(){var m9f="ents",P1D="lemen",L0y="tive",v7f="eme",Y9y="ctive";0===d(q[(H6t.c4+Y9y+o5+H6t.z1y+v7f+H6t.A1y+H6t.L3y)])[(V8y+H6t.c4+f5D+H6t.A1y+f4y)](".DTE").length&&0===d(q[(y7+L0y+o5+P1D+H6t.L3y)])[(V8y+H6t.c4+H6t.y8y+m9f)]((H6t.e0f+t9+H6t.P8+o5+t9)).length&&b[H6t.X8y][T3y]&&b[H6t.X8y][(H6t.X8y+H6t.D2+H6t.L3y+y8+y5f+H6t.X8y)][(u4+y5f+H6t.X8y)]();}
);this[(w7+U5y+P4f+m2+H6t.A1y+u4)]();this[(a7f+X3f+Z9+H6t.L3y)]((b1y+V8y+H6t.D2+H6t.A1y),[a,this[H6t.X8y][(H6t.c4+y2+H6t.L3y+L9y+m0)]]);return !X3;}
;f.prototype._preopen=function(a){var Q3y="preOpen";if(!A3===this[v2](Q3y,[a,this[H6t.X8y][(H6t.c4+y2+H6t.L3y+L9y+b1y+H6t.A1y)]]))return this[p8y](),!A3;this[H6t.X8y][Q4f]=a;return !X3;}
;f.prototype._processing=function(a){var D6="essin",f9D="roc",v7="div.DTE",Q8f="eClas",g8f="ddCla",I8f="ocessing",b=d(this[(r8f)][P9f]),c=this[r8f][(Z0y+I8f)][(H6t.X8y+H6t.L3y+Q0y+H6t.z1y+H6t.D2)],e=this[S7][(V8y+H6t.y8y+b1y+D2f+A5+H6t.A1y+T9y)][(H6t.c4+H6t.I4f+L9y+K7f)];a?(c[(M3+V8y+H6t.z1y+Q9)]=(i2+Q7f),b[(H6t.c4+g8f+m4)](e),d((f4+L9y+X3f+H6t.e0f+t9+Y6))[t4f](e)):(c[(H0y+H6t.X8y+b6y+H6t.c4+Q0y)]=A6y,b[(f5D+U5y+b1y+X3f+Q8f+H6t.X8y)](e),d(v7)[Z](e));this[H6t.X8y][(D7f+y2+H6t.D2+H6t.X8y+A5+I1D)]=a;this[(w7+H6t.D2+a3D)]((V8y+f9D+D6+T9y),[a]);}
;f.prototype._submit=function(a,b,c,e){var B6="_even",J1D="_ajax",m1y="preSubm",X3D="acyAja",R5f="ssi",e7y="proc",u4y="nged",E6="ged",G3f="llI",x1D="bTab",q1f="editData",Z8="tF",u6f="ount",X="Data",T1y="Object",f=this,k,g=!1,i={}
,n={}
,u=r[G0f][(b1y+y1+L9y)][(R2+K3+H6t.D2+H6t.L3y+T1y+X+y9+H6t.A1y)],m=this[H6t.X8y][B4y],j=this[H6t.X8y][(y7+H6t.L3y+L9y+b1y+H6t.A1y)],p=this[H6t.X8y][(H6t.D2+H0y+H6t.L3y+G2D+u6f)],o=this[H6t.X8y][m2D],q=this[H6t.X8y][(M7+L9y+Z8+V8f+H6t.z1y+v5y)],s=this[H6t.X8y][q1f],t=this[H6t.X8y][d7],v=t[R3c],x={action:this[H6t.X8y][(H6t.c4+y2+H6t.L3y+Z6D+H6t.A1y)],data:{}
}
,y;this[H6t.X8y][(f4+H6t.D4+H6t.P8+I4y)]&&(x[(H6t.L3y+H6t.c4+H6t.D4+H6t.z1y+H6t.D2)]=this[H6t.X8y][(f4+x1D+H6t.z1y+H6t.D2)]);if("create"===j||"edit"===j)if(d[(H6t.D2+H6t.c4+y2+D9y)](q,function(a,b){var O2D="bj",F2="pty",O8D="Em",W5f="isE",c={}
,e={}
;d[(J9D)](m,function(f,l){var S7f="epla",L8f="[]";if(b[(f9y+K8D)][f]){var k=l[l7y](a),h=u(f),i=d[(A7D+u7D+H6t.y8y+H6t.y8y+Q9)](k)&&f[e9y]((L8f))!==-1?u(f[(H6t.y8y+S7f+E7f)](/\[.*$/,"")+(f3D+U5y+H6t.c4+i1+f3D+y2+b1y+W3y+H6t.A1y+H6t.L3y)):null;h(c,k);i&&i(c,k.length);if(j==="edit"&&k!==s[f][a]){h(e,k);g=true;i&&i(e,k.length);}
}
}
);d[(W5f+c4f+L7y+u3y+H6t.X5y+H6t.D2+H6t.I4f)](c)||(i[a]=c);d[(L9y+H6t.X8y+O8D+F2+s1+O2D+H6t.D2+H6t.I4f)](e)||(n[a]=e);}
),"create"===j||(i0+H6t.z1y)===v||(H6t.c4+G3f+f9y+G2D+l0D+E6)===v&&g)x.data=i;else if((y2+D9y+H6t.c4+u4y)===v&&g)x.data=n;else{this[H6t.X8y][(H6t.c4+H6t.I4f+Z6D+H6t.A1y)]=null;"close"===t[W7]&&(e===h||e)&&this[y9D](!1);a&&a[(F6f+H6t.z1y+H6t.z1y)](this);this[(w7+e7y+H6t.D2+R5f+I1D)](!1);this[v2]((o5y+f7D+O6f+c4f+i3D+H6t.D2));return ;}
else(f5D+U5y+d2+H6t.D2)===j&&d[J9D](q,function(a,b){x.data[a]=b.data;}
);this[(w7+H6t.z1y+H6t.D2+T9y+X3D+b0y)]("send",j,x);y=d[C5y](!0,{}
,x);c&&c(x);!1===this[v2]((m1y+L9y+H6t.L3y),[x,j])?this[v3y](!1):this[J1D](x,function(c){var S9D="ction",L1="tE",f3f="taSo",Y7y="eEdit",E0D="_eve",q4f="stCre",F8y="reat",F1f="etDa",b3D="ldE",F6D="ors",I1y="dErro",T1="ev",n9="receiv",j9f="cyA",h3y="_leg",g;f[(h3y+H6t.c4+j9f+H6t.X5y+H6t.c4+b0y)]((n9+H6t.D2),j,c);f[(w7+T1+H6t.D2+z5D)]("postSubmit",[c,x,j]);if(!c.error)c.error="";if(!c[(y4D+H6t.z1y+I1y+z7D)])c[X0D]=[];if(c.error||c[(m5y+H9D+H6t.y8y+F6D)].length){f.error(c.error);d[(H6t.D2+H6t.c4+Y7f)](c[(y4D+b3D+H6t.y8y+U8+H6t.X8y)],function(a,b){var L3f="Err",c=m[b[t1D]];c.error(b[(H6t.X8y+j0+H6t.L3y+T1f)]||(L3f+h4));if(a===0){d(f[r8f][(G9D+f4+Q0y+G2D+b1y+H6t.A1y+n3y+z5D)],f[H6t.X8y][P9f])[F4f]({scrollTop:d(c[(F9D+f4+H6t.D2)]()).position().top}
,500);c[C8y]();}
}
);b&&b[(y2+i0+H6t.z1y)](f,c);}
else{var i={}
;f[V6]("prep",j,o,y,c.data,i);if(j===(y2+f5D+d8+H6t.D2)||j===(x6f+H6t.L3y))for(k=0;k<c.data.length;k++){g=c.data[k];f[(a7f+X3f+H6t.D2+z5D)]((H6t.X8y+F1f+j0),[c,g,j]);if(j==="create"){f[(w7+H6t.D2+a3D)]((M9f+G2D+C3y+n3y),[c,g]);f[V6]("create",m,g,i);f[v2]([(y2+F8y+H6t.D2),(p0y+q4f+H6t.c4+H6t.L3y+H6t.D2)],[c,g]);}
else if(j===(x6f+H6t.L3y)){f[(E0D+z5D)]((Z0y+Y7y),[c,g]);f[(w7+w8f+f3f+X5f+y2+H6t.D2)]("edit",o,m,g,i);f[v2]([(H6t.D2+r8),(V8y+b1y+H6t.X8y+L1+r8)],[c,g]);}
}
else if(j==="remove"){f[(a7f+a3D)]("preRemove",[c]);f[V6]("remove",o,m,i);f[(w7+T1+Z9+H6t.L3y)](["remove","postRemove"],[c]);}
f[(w7+f4+u2+K3+b1y+W3y+H6t.y8y+E7f)]("commit",j,o,c.data,i);if(p===f[H6t.X8y][q1D]){f[H6t.X8y][(H6t.c4+S9D)]=null;t[W7]==="close"&&(e===h||e)&&f[(w7+t7f+W4+H6t.D2)](true);}
a&&a[(y2+H6t.c4+M1y)](f,c);f[(B6+H6t.L3y)]("submitSuccess",[c,g]);}
f[v3y](false);f[v2]("submitComplete",[c,g]);}
,function(a,c,e){var B1y="submitCo",E1D="system";f[v2]("postSubmit",[a,c,e,x]);f.error(f[E1y].error[(E1D)]);f[(w7+V8y+H6t.y8y+b1y+D2f+H6t.X8y+U4f)](false);b&&b[(y2+H6t.c4+H6t.z1y+H6t.z1y)](f,a,c,e);f[(B6+H6t.L3y)](["submitError",(B1y+U5y+V8y+N3y+H6t.L3y+H6t.D2)],[a,c,e,x]);}
);}
;f.prototype._tidy=function(a){var Y2="draw",Z1D="rocess",E2D="bServerSide",d0f="tures",A0D="Fe",b=this,c=this[H6t.X8y][D2D]?new d[H6t.t3y][(H6t.J1+f5y+H6t.c4+H6t.D4+H6t.z1y+H6t.D2)][l0f](this[H6t.X8y][(D2D)]):a5D,e=!A3;c&&(e=c[(H6t.X8y+H6t.D2+H6t.L3y+F7D+m4y)]()[X3][(b1y+A0D+H6t.c4+d0f)][E2D]);return this[H6t.X8y][(V8y+Z1D+U4f)]?(this[(w6f)](U0D,function(){if(e)c[(b1y+H6t.A1y+H6t.D2)](Y2,a);else setTimeout(function(){a();}
,O2y);}
),!X3):(L9y+H6t.A1y+H6t.z1y+L9y+H6t.A1y+H6t.D2)===this[(M3+V8y+M1f)]()||(V1D+H6t.D4+H6t.D4+H6t.z1y+H6t.D2)===this[(f4+A7D+t0y+Q0y)]()?(this[w6f]((y2+H6t.z1y+W4+H6t.D2),function(){var Y1D="tCom";if(b[H6t.X8y][h4D])b[(m0+H6t.D2)]((H6t.X8y+f0D+L9y+Y1D+V8y+H6t.z1y+H6t.D2+n3y),function(b,d){if(e&&d)c[w6f](Y2,a);else setTimeout(function(){a();}
,O2y);}
);else setTimeout(function(){a();}
,O2y);}
)[(H6t.D4+g7)](),!X3):!A3;}
;f[Z4]={table:null,ajaxUrl:null,fields:[],display:(H6t.z1y+L9y+j3+G9D+b0y),ajax:null,idSrc:(u8f+s9+f4),events:{}
,i18n:{create:{button:(h8+H6t.D2+M0y),title:"Create new entry",submit:"Create"}
,edit:{button:"Edit",title:(y0f+f7D+L2f+H6t.D2+i9f+Q0y),submit:"Update"}
,remove:{button:(n3f+H6t.z1y+b0f),title:(y1f+b0f),submit:"Delete",confirm:{_:(s3+H6t.D2+L2f+Q0y+b1y+W3y+L2f+H6t.X8y+v9f+L2f+Q0y+Q7+L2f+M0y+L9y+b5+L2f+H6t.L3y+b1y+L2f+f4+H6t.D2+H6t.z1y+H6t.D2+H6t.L3y+H6t.D2+X5+f4+L2f+H6t.y8y+H2+H6t.X8y+A4D),1:(u7D+H6t.y8y+H6t.D2+L2f+Q0y+b1y+W3y+L2f+H6t.X8y+W3y+H6t.y8y+H6t.D2+L2f+Q0y+Q7+L2f+M0y+L9y+b5+L2f+H6t.L3y+b1y+L2f+f4+v7D+n3y+L2f+U1D+L2f+H6t.y8y+H2+A4D)}
}
,error:{system:(x7+E4D+f7f+l2f+f7f+H4f+f7y+E4D+L4y+W7f+W7f+y6y+W7f+E4D+y3f+H8+E4D+y6y+s2y+s2y+H0f+X7D+W2y+B9D+K2y+E4D+c0f+w8+b2f+c0f+U4D+X7y+t7y+f6y+K2y+q7y+r6y+n8f+y3f+J4+V0D+W2y+K2y+c0f+K2y+c0f+K2y+j3y+J8+q7y+n3+m8+c0f+q7y+m8+q8+Q3+t8+F6+y6y+j4+E4D+P0y+q7y+H9f+K2y+a0f+D3c+K2y+V0y)}
,multi:{title:"Multiple values",info:(D1+L2f+H6t.X8y+H6t.D2+N3y+U7+L2f+L9y+n3y+f5f+L2f+y2+m0+H6t.L3y+d6+H6t.A1y+L2f+f4+v1f+f9y+H6t.D2+H6t.y8y+H6t.D2+z5D+L2f+X3f+H6t.c4+p4y+H6t.X8y+L2f+f9y+h4+L2f+H6t.L3y+p6D+L2f+L9y+q9D+W3y+H6t.L3y+q4y+H6t.P8+b1y+L2f+H6t.D2+H0y+H6t.L3y+L2f+H6t.c4+H6t.A1y+f4+L2f+H6t.X8y+H6t.D2+H6t.L3y+L2f+H6t.c4+H6t.z1y+H6t.z1y+L2f+L9y+H6t.L3y+H6t.D2+f5f+L2f+f9y+h4+L2f+H6t.L3y+Z8y+H6t.X8y+L2f+L9y+q9D+M2f+L2f+H6t.L3y+b1y+L2f+H6t.L3y+D9y+H6t.D2+L2f+H6t.X8y+H6t.c4+B1f+L2f+X3f+H6t.c4+H6t.z1y+H6t.j1f+t5D+y2+H6t.z1y+L9y+y2+F5y+L2f+b1y+H6t.y8y+L2f+H6t.L3y+H6t.c4+V8y+L2f+D9y+H6t.D2+f5D+t5D+b1y+H6t.L3y+D9y+J2+l4D+H6t.D2+L2f+H6t.L3y+D9y+H6t.D2+Q0y+L2f+M0y+L9y+M1y+L2f+H6t.y8y+H6t.D2+j0+L9y+H6t.A1y+L2f+H6t.L3y+D9y+h5y+L2f+L9y+h7D+j7D+L9y+f4+s6+L2f+X3f+H6t.c4+H6t.z1y+F4+H6t.e0f),restore:(h5+L2f+y2+u9y+I1D+c7)}
,datetime:{previous:(k8D+M0+H6t.X8y),next:(h8+H6t.D2+b0y+H6t.L3y),months:(b7D+H6t.A1y+F1+L2f+y9+H6t.D2+m9D+W3y+j8+Q0y+L2f+N8+j8+y2+D9y+L2f+u7D+V8y+y2f+L2f+N8+Q9+L2f+M1+q3+L2f+M1+W3y+H6t.z1y+Q0y+L2f+u7D+z8f+W3y+H6t.X8y+H6t.L3y+L2f+K3+G5f+U5y+W7D+L2f+s1+y2+H6t.L3y+V9D+L2f+h8+d2+G4+i7D+H6t.y8y+L2f+t9+H6t.D2+E7f+D6f)[(G7D+L9y+H6t.L3y)](" "),weekdays:"Sun Mon Tue Wed Thu Fri Sat"[(G7D+f7D)](" "),amPm:[(H6t.c4+U5y),"pm"],unknown:"-"}
}
,formOptions:{bubble:d[(N5+n3y+H6t.A1y+f4)]({}
,f[(U5y+p1+H6t.D2+V2f)][M5],{title:!1,message:!1,buttons:(T6f+H6t.c4+A5+y2),submit:"changed"}
),inline:d[(H6t.D2+b0y+H6t.L3y+Z9+f4)]({}
,f[(U5y+p1+H6t.D2+V2f)][(Z9y+U5y+n0f+Z6D+H6t.A1y+H6t.X8y)],{buttons:!1,submit:"changed"}
),main:d[(G0f+R5y)]({}
,f[I1][M5])}
,legacyAjax:!1}
;var K=function(a,b,c){d[(O6y+D9y)](b,function(b,d){var R1D="taS",x9="Fr",f=d[(X3f+H6t.c4+H6t.z1y+x9+b1y+m8y+H6t.c4+H6t.L3y+H6t.c4)](c);f!==h&&C(a,d[(f4+H6t.c4+R1D+U5D)]())[(g1y+Y7f)](function(){var k9D="veC",I3c="ild";for(;this[(Y7f+I3c+h8+b1y+f4+c7)].length;)this[(R4D+k9D+Q0D+f4)](this[(f9y+N6D+H6t.X8y+H6t.L3y+I7f+I3c)]);}
)[(V3y)](f);}
);}
,C=function(a,b){var j4y='dit',c=(E8+Q0y+H6t.z1y+Q5y)===a?q:d((K5y+W2y+O7f+o8+L4y+W2y+P0y+W9+o8+P0y+W2y+U4D)+a+(I8y));return d((K5y+W2y+K2y+c0f+K2y+o8+L4y+j4y+J8f+o8+K4y+P0y+j5+W2y+U4D)+b+I8y,c);}
,D=f[(w8f+H6t.L3y+P4+w9D+H6t.X8y)]={}
,E=function(a,b){var l8f="wType",X7="Si",m6y="ver",c8="bS",V8D="oFeatures";return a[(b7f+F7D+m4y)]()[X3][V8D][(c8+J2+m6y+X7+p6y)]&&(H6t.A1y+w6f)!==b[H6t.X8y][d7][(v2y+H6t.c4+l8f)];}
,L=function(a){a=d(a);setTimeout(function(){var h0y="ghlig";a[(H6t.c4+M7y+G2D+w0y+m4)]((Z8y+h0y+D9y+H6t.L3y));setTimeout(function(){var j1=550,X9D="ghlight",g0f="emov",b7y="Hig";a[(t4f)]((H6t.A1y+b1y+b7y+D9y+z8y+T9y+D9y+H6t.L3y))[(H6t.y8y+g0f+H6t.D2+G2D+H6t.z1y+H6t.c4+H6t.X8y+H6t.X8y)]((D9y+L9y+X9D));setTimeout(function(){var b8y="noHighlight",W5y="oveC";a[(a9y+W5y+V4f)](b8y);}
,j1);}
,k9);}
,S2y);}
,F=function(a,b,c,e,d){b[(R0D+M0y+H6t.X8y)](c)[(L9y+h7D+H6t.D2+b0y+c7)]()[(O6y+D9y)](function(c){var k5D="tifi",c=b[(H6t.y8y+H2)](c),g=c.data(),i=d(g);i===h&&f.error((X0+q6D+H6t.D4+N3y+L2f+H6t.L3y+b1y+L2f+f9y+L9y+H6t.A1y+f4+L2f+H6t.y8y+b1y+M0y+L2f+L9y+f4+H6t.D2+H6t.A1y+k5D+H6t.D2+H6t.y8y),14);a[i]={idSrc:i,data:g,node:c[n0D](),fields:e,type:(R0D+M0y)}
;}
);}
,G=function(a,b,c,e,l,g){var K0y="lls";b[(y2+H6t.D2+K0y)](c)[V5D]()[J9D](function(w){var M9D="yFi",t8D="matically",q3D="nabl",A1f="tyObj",h6="Emp",j2="oColu",w2D="column",S9="cell",i=b[S9](w),j=b[m1](w[(R0D+M0y)]).data(),j=l(j),u;if(!(u=g)){u=w[w2D];u=b[(H6t.X8y+e3D+I1D+H6t.X8y)]()[0][(H6t.c4+j2+U5y+G5D)][u];var m=u[(H6t.D2+M9+L9y+H6t.D2+s3y)]!==h?u[(H6t.D2+f4+L9y+B4f+H6t.D2+H6t.z1y+f4)]:u[(m8y+u2)],n={}
;d[(g1y+y2+D9y)](e,function(a,b){var f6f="aSrc";if(d[(L9y+n4f+H6t.y8y+Q9)](m))for(var c=0;c<m.length;c++){var e=b,f=m[c];e[(f4+d8+f6f)]()===f&&(n[e[(q6D+U5y+H6t.D2)]()]=e);}
else b[(f4+d8+H6t.c4+z9+y2)]()===m&&(n[b[(g2y+H6t.D2)]()]=b);}
);d[(L9y+H6t.X8y+h6+A1f+H6t.D2+y2+H6t.L3y)](n)&&f.error((X0+q3D+H6t.D2+L2f+H6t.L3y+b1y+L2f+H6t.c4+M2f+b1y+t8D+L2f+f4+b0f+H6t.y8y+S1+H6t.D2+L2f+f9y+L9y+d7D+L2f+f9y+R0D+U5y+L2f+H6t.X8y+p5f+y2+H6t.D2+q4y+C1+H6t.z1y+g1y+H6t.X8y+H6t.D2+L2f+H6t.X8y+V8y+H6t.D2+y2+L9y+f9y+Q0y+L2f+H6t.L3y+w3y+L2f+f9y+V8f+H6t.z1y+f4+L2f+H6t.A1y+s2f+H6t.e0f),11);u=n;}
F(a,b,w[(H6t.y8y+b1y+M0y)],e,l);a[j][B0y]=(b1y+H6t.D4+N4f+H6t.L3y)===typeof c&&c[K0D]?[c]:[i[(F9D+p6y)]()];a[j][(M3+t0y+M9D+H6t.D2+H6t.z1y+v5y)]=u;}
);}
;D[G6]={individual:function(a,b){var T8D="closest",M8f="inde",z9D="responsive",w0D="eName",C1y="tDataFn",w2="nGe",c=r[G0f][(b3f)][(w7+f9y+w2+H6t.L3y+u3y+N4f+C1y)](this[H6t.X8y][r6f]),e=d(this[H6t.X8y][(S7D+H6t.z1y+H6t.D2)])[z2D](),f=this[H6t.X8y][(N6+H6t.D2+H6t.z1y+f4+H6t.X8y)],g={}
,h,i;a[(F9D+f4+w0D)]&&d(a)[T2f]((f4+H6t.L3y+H6t.y8y+f3D+f4+d8+H6t.c4))&&(i=a,a=e[z9D][(M8f+b0y)](d(a)[T8D]("li")));b&&(d[g4](b)||(b=[b]),h={}
,d[(J9D)](b,function(a,b){h[b]=f[b];}
));G(g,e,a,f,c,h);i&&d[J9D](g,function(a,b){b[B0y]=[i];}
);return g;}
,fields:function(a){var x3="columns",m1f="cells",q3f="col",n1y="ainObj",Y3f="isPl",z6f="Dat",b=r[G0f][b3f][e2y](this[H6t.X8y][(r6f)]),c=d(this[H6t.X8y][(S7D+H6t.z1y+H6t.D2)])[(z6f+z0+H6t.r9)](),e=this[H6t.X8y][B4y],f={}
;d[(Y3f+n1y+H6t.D2+H6t.I4f)](a)&&(a[(R0D+M0y+H6t.X8y)]!==h||a[(q3f+W3y+U5y+H6t.A1y+H6t.X8y)]!==h||a[(y2+V0+V2f)]!==h)?(a[(H6t.y8y+b1y+M0y+H6t.X8y)]!==h&&F(f,c,a[v3D],e,b),a[(y2+b1y+l7f+U5y+H6t.A1y+H6t.X8y)]!==h&&c[m1f](null,a[x3])[V5D]()[(g1y+y2+D9y)](function(a){G(f,c,a,e,b);}
),a[m1f]!==h&&G(f,c,a[m1f],e,b)):F(f,c,a,e,b);return f;}
,create:function(a,b){var c=d(this[H6t.X8y][D2D])[(Y9f+H6t.L3y+H6t.c4+H6t.P8+U1y+H6t.D2)]();E(c,this)||(c=c[m1][(a7+f4)](b),L(c[(H6t.A1y+b1y+p6y)]()));}
,edit:function(a,b,c,e){var w1D="plice",s0D="wIds",t2f="ject",X8="fnGetOb";b=d(this[H6t.X8y][(j0+q4D+H6t.D2)])[z2D]();if(!E(b,this)){var f=r[G0f][b3f][(w7+X8+t2f+t9+d8+H6t.c4+d3)](this[H6t.X8y][(q8f+K3+H6t.y8y+y2)]),g=f(c),a=b[(H6t.y8y+H2)]("#"+g);a[(Y+Q0y)]()||(a=b[m1](function(a,b){return g==f(b);}
));a[(H6t.c4+H6t.A1y+Q0y)]()?(a.data(c),c=d[(m6f+H6t.y8y+F5)](g,e[(m1+K1+f4+H6t.X8y)]),e[(R0D+s0D)][(H6t.X8y+w1D)](c,1)):a=b[m1][(a7+f4)](c);L(a[(n0D)]());}
}
,remove:function(a){var b=d(this[H6t.X8y][(H6t.L3y+U1y+H6t.D2)])[z2D]();E(b,this)||b[(H6t.y8y+H2+H6t.X8y)](a)[(H6t.y8y+H6t.D2+U5y+b1y+X3f+H6t.D2)]();}
,prep:function(a,b,c,e,f){var l2="rowIds";(H6t.D2+f4+f7D)===a&&(f[l2]=d[(U5y+H6t.c4+V8y)](c.data,function(a,b){var E1="isEmptyObject";if(!d[E1](c.data[b]))return b;}
));}
,commit:function(a,b,c,e){var g5="aw",C2f="jectDat",R9D="GetO",m6D="Ids";b=d(this[H6t.X8y][(H6t.L3y+K2+N3y)])[z2D]();if((M7+L9y+H6t.L3y)===a&&e[(H6t.y8y+b1y+M0y+m6D)].length)for(var f=e[(H6t.y8y+b1y+M0y+m6D)],g=r[(G0f)][(b1y+u7D+H1y)][(H7f+H6t.A1y+R9D+H6t.D4+C2f+H6t.c4+y9+H6t.A1y)](this[H6t.X8y][(q8f+K3+H6t.y8y+y2)]),h=0,e=f.length;h<e;h++)a=b[m1]("#"+f[h]),a[(Y+Q0y)]()||(a=b[m1](function(a,b){return f[h]===g(b);}
)),a[(H6t.c4+H6t.A1y+Q0y)]()&&a[(a9y+b1y+K7f)]();a=this[H6t.X8y][d7][(v2y+g5+H6t.P8+Q0y+V8y+H6t.D2)];(A6y)!==a&&b[(f4+H6t.y8y+H6t.c4+M0y)](a);}
}
;D[(D9y+H6t.L3y+U5y+H6t.z1y)]={initField:function(a){var U0="abe",w4f='di',b=d((K5y+W2y+K2y+A9f+o8+L4y+w4f+W9+o8+f6y+K2y+t7y+L4y+f6y+U4D)+(a.data||a[(H6t.A1y+H6t.c4+B1f)])+(I8y));!a[(H6t.z1y+U0+H6t.z1y)]&&b.length&&(a[l3y]=b[(Y0y+H6t.z1y)]());}
,individual:function(a,b){var S4f="urc",r3y="rmi",l3="nno",g2="]",z6="[";if(a instanceof d||a[K0D])b||(b=[d(a)[(H6t.c4+H6t.L3y+H6t.L3y+H6t.y8y)]((f4+H6t.c4+j0+f3D+H6t.D2+H0y+v8f+f3D+f9y+D3f+f4))]),a=d(a)[(M9y+H6t.y8y+H6t.D2+H6t.A1y+H6t.L3y+H6t.X8y)]((z6+f4+H6t.c4+j0+f3D+H6t.D2+H0y+v8f+f3D+L9y+f4+g2)).data((H6t.D2+f4+L9y+v8f+f3D+L9y+f4));a||(a="keyless");b&&!d[g4](b)&&(b=[b]);if(!b||0===b.length)throw (x4f+l3+H6t.L3y+L2f+H6t.c4+W3y+p9y+U5y+H6t.c4+c1y+F6f+M1y+Q0y+L2f+f4+H6t.M2+H6t.D2+r3y+H6t.A1y+H6t.D2+L2f+f9y+V8f+s3y+L2f+H6t.A1y+s2f+L2f+f9y+H6t.y8y+E0+L2f+f4+d8+H6t.c4+L2f+H6t.X8y+b1y+S4f+H6t.D2);var c=D[(K2f+R9f)][(N6+H6t.D2+H6t.z1y+v5y)][(y2+I6D)](this,a),e=this[H6t.X8y][(y4D+s3y+H6t.X8y)],f={}
;d[J9D](b,function(a,b){f[b]=e[b];}
);d[J9D](c,function(c,g){g[(H6t.L3y+Q0y+V8y+H6t.D2)]=(E7f+H6t.z1y+H6t.z1y);for(var h=a,j=b,m=d(),n=0,p=j.length;n<p;n++)m=m[(a7+f4)](C(h,j[n]));g[(M0f+H6t.c4+y2+D9y)]=m[E8f]();g[(f9y+L9y+H6t.D2+H6t.z1y+v5y)]=e;g[V0f]=f;}
);return c;}
,fields:function(a){var b={}
,c={}
,e=this[H6t.X8y][(y4D+i6y)];a||(a="keyless");d[(H6t.D2+H6t.c4+Y7f)](e,function(b,e){var p8="valToData",d=C(a,e[(H6t.J1+H6t.c4+K3+U5D)]())[(D9y+H6t.L3y+U5y+H6t.z1y)]();e[p8](c,null===d?h:d);}
);b[a]={idSrc:a,data:c,node:q,fields:e,type:(R0D+M0y)}
;return b;}
,create:function(a,b){var R0="GetObje";if(b){var c=r[G0f][(b1y+l0f)][(R2+R0+H6t.I4f+t9+H6t.c4+j0+d3)](this[H6t.X8y][(L9y+L9f+H6t.y8y+y2)])(b);d('[data-editor-id="'+c+(I8y)).length&&K(c,a,b);}
}
,edit:function(a,b,c){var k7D="eyl",Z3y="Obje",W9y="_fnGe",D5f="oAp";a=r[(H6t.D2+V2)][(D5f+L9y)][(W9y+H6t.L3y+Z3y+y2+H6t.L3y+t9+H6t.c4+H6t.L3y+H6t.c4+y9+H6t.A1y)](this[H6t.X8y][(q8f+z9+y2)])(c)||(F5y+k7D+Q5y);K(a,b,c);}
,remove:function(a){d('[data-editor-id="'+a+(I8y))[(f5D+U5y+b1y+X3f+H6t.D2)]();}
}
;f[S7]={wrapper:"DTE",processing:{indicator:(c8f+w7+C1+H6t.y8y+S8+m4+L9y+I1D+w7+K1+h7D+z0D),active:(t9+Y6+w7+y7y+H6t.D2+s4D)}
,header:{wrapper:(c8f+w7+E0y+H6t.c4+a4),content:(u8f+o5+C6f+H6t.c4+p6y+H6t.y8y+w7+G2D+b1y+H6t.A1y+H6t.L3y+H6t.D2+H6t.A1y+H6t.L3y)}
,body:{wrapper:(u8f+o5+w7+g2D+p1+Q0y),content:"DTE_Body_Content"}
,footer:{wrapper:(t9+Y6+V7D+M6+s8D),content:"DTE_Footer_Content"}
,form:{wrapper:"DTE_Form",content:(u8f+o5+v9D+U5y+L0D+b1y+H6t.A1y+a1D+H6t.L3y),tag:"",info:(c8f+V7D+b1y+H6t.y8y+U5y+w7+K1+q8D+b1y),error:(t9+Y6+w7+y9+Q8D+Y6D+D6D+b1y+H6t.y8y),buttons:(u8f+L6y+H6t.y8y+U5y+P0D+W3y+Z4y+b1y+H6t.A1y+H6t.X8y),button:"btn"}
,field:{wrapper:(c8f+N3+V0+f4),typePrefix:"DTE_Field_Type_",namePrefix:(t9+H6t.P8+o5+V7D+D3f+i3f+h8+H6t.c4+B1f+w7),label:(u8f+o5+w7+v5+H6t.c4+H6t.D4+V0),input:(u8f+b2y+L9y+H6t.D2+H6t.z1y+f4+w7+E5D+V8y+W3y+H6t.L3y),inputControl:"DTE_Field_InputControl",error:(c8f+V7D+D3f+R2f+O8y+H6t.y8y+R0D+H6t.y8y),"msg-label":(Q3f+H6t.z1y+n8D+H6t.A1y+u4),"msg-error":"DTE_Field_Error","msg-message":(c8f+w7+e8+H6t.D2+H6t.z1y+i3f+a8f+o7y),"msg-info":(u8f+o5+w7+y9+D3f+f4+w7+K1+H6t.A1y+f9y+b1y),multiValue:"multi-value",multiInfo:"multi-info",multiRestore:(n8+H6t.L3y+L9y+f3D+H6t.y8y+H6t.D2+b4+A9D)}
,actions:{create:"DTE_Action_Create",edit:"DTE_Action_Edit",remove:"DTE_Action_Remove"}
,bubble:{wrapper:(u8f+o5+L2f+t9+U0y+g2D+s2D+N3y),liner:"DTE_Bubble_Liner",table:(t9+l5+z6D+N3y+k8y+H6t.z1y+H6t.D2),close:(c8f+w7+g2D+s2D+H6t.z1y+H6t.D2+L0D+H6t.z1y+b1y+H6t.X8y+H6t.D2),pointer:"DTE_Bubble_Triangle",bg:(t9+H6t.P8+o5+c9y+H6t.D4+H6t.z1y+n3D+g6y+M5D+W3y+H6t.A1y+f4)}
}
;if(r[x2y]){var p=r[(U+P6D+H6t.X8y)][r1D],H={sButtonText:a5D,editor:a5D,formTitle:a5D}
;p[P3D]=d[(H6t.D2+b0y+H6t.L3y+H6t.D2+H6t.A1y+f4)](!X3,p[(n3y+b0y+H6t.L3y)],H,{formButtons:[{label:a5D,fn:function(){this[(H6t.X8y+f0y+Z3f+H6t.L3y)]();}
}
],fnClick:function(a,b){var w5y="eat",n4D="bm",c=b[(v3f+h4)],e=c[(X0y+Y0D+H6t.A1y)][R3y],d=b[G1y];if(!d[X3][(w0y+H6t.D4+H6t.D2+H6t.z1y)])d[X3][l3y]=e[(D7+n4D+f7D)];c[(O9f+w5y+H6t.D2)]({title:e[(H6t.L3y+L9y+H6t.L3y+N3y)],buttons:d}
);}
}
);p[(x6f+s0+M7+f7D)]=d[C5y](!0,p[(H6t.X8y+b4f+o0+H6t.X8y+L9y+u6+H6t.D2)],H,{formButtons:[{label:null,fn:function(){this[(H6t.X8y+W3y+H6t.D4+U5y+f7D)]();}
}
],fnClick:function(a,b){var z3D="bmit",q9="tS",S6="Ge",c=this[(f9y+H6t.A1y+S6+q9+H6t.D2+H6t.z1y+l1y+H6t.L3y+M7+K1+H6t.A1y+f4+W9D)]();if(c.length===1){var e=b[t4],d=e[E1y][(M7+f7D)],f=b[(f9y+b1y+H6t.y8y+U5y+g2D+M2f+p9y+H6t.A1y+H6t.X8y)];if(!f[0][l3y])f[0][l3y]=d[(H6t.X8y+W3y+z3D)];e[v3f](c[0],{title:d[(H6t.L3y+f7D+N3y)],buttons:f}
);}
}
}
);p[(x6f+r4f+T4D)]=d[(j9D+h7D)](!0,p[h9f],H,{question:null,formButtons:[{label:null,fn:function(){var a=this;this[(o5y+L9y+H6t.L3y)](function(){var j9y="fnSelectNone",T3="nce",A9="G";d[(f9y+H6t.A1y)][(f4+u2+H6t.P8+U1y+H6t.D2)][x2y][(f9y+H6t.A1y+A9+H6t.D2+H6t.L3y+K1+H6t.A1y+H6t.X8y+j0+T3)](d(a[H6t.X8y][(H6t.L3y+H6t.c4+q4D+H6t.D2)])[z2D]()[D2D]()[n0D]())[j9y]();}
);}
}
],fnClick:function(a,b){var u2D="firm",x1y="confi",a3f="irm",u5y="etS",x3D="fnG",c=this[(x3D+u5y+H6t.D2+N3y+H6t.I4f+M7+K1+H6t.A1y+p6y+b0y+H6t.D2+H6t.X8y)]();if(c.length!==0){var e=b[(H6t.D2+f4+L9y+H6t.L3y+h4)],d=e[(L9y+U1D+b8)][i7y],f=b[G1y],g=typeof d[(y2+b1y+q8D+a3f)]==="string"?d[(x1y+V3D)]:d[(I2f+H6t.A1y+u2D)][c.length]?d[(I2f+H6t.A1y+f9y+N6D+U5y)][c.length]:d[(y2+m0+f9y+a3f)][w7];if(!f[0][(H6t.z1y+K2+H6t.D2+H6t.z1y)])f[0][(w0y+H6t.D4+V0)]=d[R3c];e[(i7y)](c,{message:g[(f5D+t0y+y2+H6t.D2)](/%d/g,c.length),title:d[U2],buttons:f}
);}
}
}
);}
d[(H6t.D2+r4D)](r[(G0f)][o7],{create:{text:function(a,b,c){return a[(E1y)]((H6t.D4+W3y+Z4y+b1y+G5D+H6t.e0f+y2+f5D+H6t.c4+n3y),c[t4][E1y][R3y][X4]);}
,className:(V1D+H6t.L3y+E1f+H6t.X8y+f3D+y2+H6t.y8y+H6t.D2+d8+H6t.D2),editor:null,formButtons:{label:function(a){var t3D="ubmit";return a[E1y][(y2+h3)][(H6t.X8y+t3D)];}
,fn:function(){this[(D7+H6t.D4+P)]();}
}
,formMessage:null,formTitle:null,action:function(a,b,c,e){var v9="mTit",A0y="mB";a=e[(M7+L9y+p9y+H6t.y8y)];a[R3y]({buttons:e[(u4+H6t.y8y+A0y+a5f+H6t.X8y)],message:e[o6f],title:e[(f9y+h4+v9+N3y)]||a[(L9y+U5+H6t.A1y)][(y2+H6t.y8y+H6t.D2+H6t.c4+H6t.L3y+H6t.D2)][U2]}
);}
}
,edit:{extend:"selected",text:function(a,b,c){return a[E1y]((H6t.D4+W3y+H6t.L3y+H6t.L3y+b1y+H6t.A1y+H6t.X8y+H6t.e0f+H6t.D2+f4+f7D),c[(x6f+v8f)][(X0y+b8)][(M7+L9y+H6t.L3y)][X4]);}
,className:(H6t.D4+M2f+H6t.L3y+w9f+f3D+H6t.D2+H0y+H6t.L3y),editor:null,formButtons:{label:function(a){return a[(L9y+U1D+Y0D+H6t.A1y)][(H6t.D2+r8)][R3c];}
,fn:function(){this[(H6t.X8y+f0D+f7D)]();}
}
,formMessage:null,formTitle:null,action:function(a,b,c,e){var t1f="But",l2D="ell",B3y="mns",a=e[t4],c=b[(m1+H6t.X8y)]({selected:!0}
)[V5D](),d=b[(y2+d0+W3y+B3y)]({selected:!0}
)[V5D](),b=b[(y2+l2D+H6t.X8y)]({selected:!0}
)[V5D]();a[(v3f)](d.length||b.length?{rows:c,columns:d,cells:b}
:c,{message:e[o6f],buttons:e[(f9y+b1y+V3D+t1f+p9y+G5D)],title:e[o8y]||a[E1y][v3f][(K3D+N3y)]}
);}
}
,remove:{extend:"selected",text:function(a,b,c){return a[(L9y+U1D+b8)]((H6t.D4+W3y+H6t.L3y+H6t.L3y+m0+H6t.X8y+H6t.e0f+H6t.y8y+H6t.D2+T9f+K7f),c[t4][E1y][(H6t.y8y+G4+N0f)][(H6t.D4+O4D+b1y+H6t.A1y)]);}
,className:"buttons-remove",editor:null,formButtons:{label:function(a){return a[(L9y+U1D+Y0D+H6t.A1y)][(a9y+d2+H6t.D2)][(H6t.X8y+f0D+L9y+H6t.L3y)];}
,fn:function(){this[(D7+H6t.D4+U5y+f7D)]();}
}
,formMessage:function(a,b){var y6f="onf",o7D="confirm",c=b[v3D]({selected:!0}
)[V5D](),e=a[(X0y+Y0D+H6t.A1y)][i7y];return ((H6t.X8y+H6t.L3y+H6t.y8y+L9y+I1D)===typeof e[o7D]?e[(y2+m0+N6+V3D)]:e[(y2+y6f+L9y+H6t.y8y+U5y)][c.length]?e[o7D][c.length]:e[o7D][w7])[I0D](/%d/g,c.length);}
,formTitle:null,action:function(a,b,c,e){a=e[t4];a[(H6t.y8y+G4+d2+H6t.D2)](b[(H6t.y8y+b1y+F7y)]({selected:!0}
)[(d0D+f4+W9D)](),{buttons:e[G1y],message:e[o6f],title:e[o8y]||a[E1y][i7y][(H6t.L3y+L9y+H6t.L3y+H6t.z1y+H6t.D2)]}
);}
}
}
);f[(S0+L5+H6t.X8y)]={}
;f[Z8f]=function(a,b){var d4D="_constructor",m1D="calendar",H7y="tainer",N6f="format",R4="ance",n9f="inst",x7f="teime",D4D="-time",A4="-title",S5y="seconds",F1D="nu",f6=">:</",G8f='-time">',I8='en',C0y='al',J5f='ear',I2D='-month"/></div><div class="',U6D='-iconRight"><button>',L8y="vious",z4='-iconLeft"><button>',j7f='-title"><div class="',I8D='-date"><div class="',W1f='ct',K4f='/><',g6D="ome",D3y="W",M6D="YYYY-MM-DD",D8="sPr";this[y2]=d[(G0f+H6t.D2+h7D)](!X3,{}
,f[Z8f][Z4],b);var c=this[y2][(y2+H6t.z1y+H6t.c4+H6t.X8y+D8+H6t.D2+N6+b0y)],e=this[y2][(X0y+Y0D+H6t.A1y)];if(!j[V6y]&&M6D!==this[y2][(f9y+j4D+H6t.L3y)])throw (y0f+L9y+v8f+L2f+f4+d8+H6t.D2+H6t.L3y+b0D+H6t.D2+Q7y+D3y+f7D+D9y+b1y+M2f+L2f+U5y+g6D+H6t.A1y+H6t.L3y+H6t.X5y+H6t.X8y+L2f+b1y+H6t.A1y+H6t.z1y+Q0y+L2f+H6t.L3y+D9y+H6t.D2+L2f+f9y+h4+U5y+d8+Z5+R6+R6+R6+R6+f3D+N8+N8+f3D+t9+t9+g2f+y2+Y+L2f+H6t.D4+H6t.D2+L2f+W3y+M8+f4);var g=function(a){var Q9D='nD',O6D='co',R3='Up',A9y='imebloc';return s4y+c+(o8+c0f+A9y+r6y+K0f+W2y+P0y+n6f+E4D+s2y+g6+f7f+U4D)+c+(o8+P0y+s2y+y6y+q7y+R3+K0f+t7y+K7+y6y+q7y+O2)+e[(M9f+X3f+Z6D+W3y+H6t.X8y)]+(D3c+t7y+H0f+c0f+c0f+y6y+q7y+j6+W2y+P0y+n6f+j8y+W2y+U9+E4D+s2y+f6y+K2y+C3f+U4D)+c+(o8+f6y+N7y+j5+K0f+f7f+l6f+K2y+q7y+K4f+f7f+L4y+a4D+W1f+E4D+s2y+f6y+H8+f7f+U4D)+c+f3D+a+(e5D+W2y+U9+j8y+W2y+U9+E4D+s2y+D4f+C3f+U4D)+c+(o8+P0y+O6D+Q9D+y6y+C1f+K0f+t7y+H0D+c0f+q9f+O2)+e[(H6t.A1y+H6t.D2+V2)]+(G0D+H6t.D4+W3y+Z4y+m0+T+f4+L9y+X3f+T+f4+L9y+X3f+g4D);}
,g=d((V5+W2y+P0y+n6f+E4D+s2y+D4f+f7f+f7f+U4D)+c+(K0f+W2y+U9+E4D+s2y+D4f+f7f+f7f+U4D)+c+I8D+c+j7f+c+z4+e[(M9f+L8y)]+(D3c+t7y+H0f+c0f+c0f+y6y+q7y+j6+W2y+U9+j8y+W2y+U9+E4D+s2y+g6+f7f+U4D)+c+U6D+e[(H6t.A1y+G0f)]+(D3c+t7y+H0f+c0f+c0f+q9f+j6+W2y+P0y+n6f+j8y+W2y+P0y+n6f+E4D+s2y+f6y+K2y+f7f+f7f+U4D)+c+(o8+f6y+K2y+t7y+j5+K0f+f7f+l6f+U3+K4f+f7f+L4y+a4D+W1f+E4D+s2y+D4f+C3f+U4D)+c+I2D+c+(o8+f6y+K2y+t7y+L4y+f6y+K0f+f7f+l6f+U3+K4f+f7f+L4y+a4D+W1f+E4D+s2y+f6y+K2y+C3f+U4D)+c+(o8+l2f+J5f+e5D+W2y+P0y+n6f+j6+W2y+P0y+n6f+j8y+W2y+P0y+n6f+E4D+s2y+h4f+U4D)+c+(o8+s2y+C0y+I8+W2y+w8+e5D+W2y+P0y+n6f+j8y+W2y+P0y+n6f+E4D+s2y+D4f+C3f+U4D)+c+G8f+g((c7f+W3y+z7D))+(j2D+H6t.X8y+V8y+H6t.c4+H6t.A1y+f6+H6t.X8y+V8y+Y+g4D)+g((U5y+L9y+F1D+n3y+H6t.X8y))+(j2D+H6t.X8y+V8y+H6t.c4+H6t.A1y+f6+H6t.X8y+V8y+H6t.c4+H6t.A1y+g4D)+g(S5y)+g((H6t.c4+c4f+U5y))+(G0D+f4+j7D+T+f4+j7D+g4D));this[(f4+E0)]={container:g,date:g[E7D](H6t.e0f+c+(f3D+f4+H6t.c4+H6t.L3y+H6t.D2)),title:g[E7D](H6t.e0f+c+A4),calendar:g[E7D](H6t.e0f+c+(f3D+y2+H6t.c4+N3y+H6t.A1y+f4+H6t.c4+H6t.y8y)),time:g[E7D](H6t.e0f+c+D4D),input:d(a)}
;this[H6t.X8y]={d:a5D,display:a5D,namespace:(H6t.D2+H0y+v8f+f3D+f4+H6t.c4+x7f+f3D)+f[(t9+d8+H6t.D2+H6t.P8+L9y+U5y+H6t.D2)][(w7+n9f+R4)]++,parts:{date:a5D!==this[y2][(Z9y+C8)][h3D](/[YMD]/),time:a5D!==this[y2][(f9y+h4+U5y+H6t.c4+H6t.L3y)][(A7f+H6t.L3y+y2+D9y)](/[Hhm]/),seconds:-A3!==this[y2][(u4+V3D+H6t.c4+H6t.L3y)][e9y](H6t.X8y),hours12:a5D!==this[y2][N6f][h3D](/[haA]/)}
}
;this[r8f][(y2+m0+H7y)][(H6t.c4+j7y+h7D)](this[(H6t.a7y+U5y)][(f4+d8+H6t.D2)])[S1D](this[r8f][k3y]);this[r8f][(f4+t7)][S1D](this[r8f][U2])[(z3+V8y+H6t.D2+H6t.A1y+f4)](this[r8f][m1D]);this[d4D]();}
;d[C5y](f.DateTime.prototype,{destroy:function(){this[(F2f+f4+H6t.D2)]();this[(f4+b1y+U5y)][z7f]()[V7f]("").empty();this[(r8f)][X0f][V7f](".editor-datetime");}
,max:function(a){var N0D="_set",s8y="opti";this[y2][(v0y)]=a;this[(w7+s8y+w9f+H6t.P8+f7D+H6t.z1y+H6t.D2)]();this[(N0D+G2D+i0+H6t.c4+h7D+H6t.D2+H6t.y8y)]();}
,min:function(a){var C5D="onsTi",F8f="minDate";this[y2][F8f]=a;this[(x4y+c1y+C5D+n5y+H6t.D2)]();this[K1y]();}
,owns:function(a){var u4f="ilt";return 0<d(a)[(M9y+H6t.y8y+H6t.D2+H6t.A1y+H6t.L3y+H6t.X8y)]()[(f9y+u4f+H6t.D2+H6t.y8y)](this[(H6t.a7y+U5y)][(y2+m0+H6t.L3y+H6t.c4+L9y+H6t.A1y+H6t.D2+H6t.y8y)]).length;}
,val:function(a,b){var z5y="toS",d8f="_wri",q7="toD",i5y="momentStrict",N9y="entLocale",D3D="str";if(a===h)return this[H6t.X8y][f4];if(a instanceof Date)this[H6t.X8y][f4]=this[z5f](a);else if(null===a||""===a)this[H6t.X8y][f4]=null;else if((D3D+U4f)===typeof a)if(j[V6y]){var c=j[(T9f+U5y+H6t.D2+H6t.A1y+H6t.L3y)][J9](a,this[y2][(Z9y+C8)],this[y2][(U5y+E0+N9y)],this[y2][i5y]);this[H6t.X8y][f4]=c[(L9y+H6t.X8y+k3c+z8y+f4)]()?c[(q7+H6t.c4+n3y)]():null;}
else c=a[(C8+y2+D9y)](/(\d{4})\-(\d{2})\-(\d{2})/),this[H6t.X8y][f4]=c?new Date(Date[(g4f)](c[1],c[2]-1,c[3])):null;if(b||b===h)this[H6t.X8y][f4]?this[(d8f+n3y+e5+H6t.L3y+m2y+H6t.L3y)]():this[(f4+E0)][X0f][(q6f+H6t.z1y)](a);this[H6t.X8y][f4]||(this[H6t.X8y][f4]=this[z5f](new Date));this[H6t.X8y][H8f]=new Date(this[H6t.X8y][f4][(z5y+w4y+L9y+H6t.A1y+T9y)]());this[(w7+b7f+H6t.P8+L9y+H6t.L3y+N3y)]();this[K1y]();this[v2f]();}
,_constructor:function(){var w1f="tUT",P0="_correctMonth",j1D="sC",t0f="etim",H6f="amPm",e9="_options",D0D="secondsIncrement",c5y="onsTime",K7D="_opti",c2D="crem",r9D="tesIn",R9="_optionsTitle",h2D="hours12",h8y="lock",D9="imeb",p0D="childre",m5f="nds",c5f="sec",q1y="art",O7D="rt",a=this,b=this[y2][V6D],c=this[y2][(L9y+X2)];this[H6t.X8y][(M9y+O7D+H6t.X8y)][(w8f+H6t.L3y+H6t.D2)]||this[(r8f)][(w8f+n3y)][(y2+H6t.X8y+H6t.X8y)]((f4+L9y+o4+H6t.z1y+H6t.c4+Q0y),(H6t.A1y+b1y+H6t.A1y+H6t.D2));this[H6t.X8y][o9D][k3y]||this[(H6t.a7y+U5y)][k3y][l9f]("display",(F9D+H6t.A1y+H6t.D2));this[H6t.X8y][(V8y+q1y+H6t.X8y)][(c5f+b1y+m5f)]||(this[r8f][(H6t.L3y+I0f)][(p0D+H6t.A1y)]((f4+j7D+H6t.e0f+H6t.D2+f4+L9y+H6t.L3y+h4+f3D+f4+H6t.c4+H6t.L3y+H6t.D2+H6t.L3y+L9y+U5y+H6t.D2+f3D+H6t.L3y+D9+h8y))[f2](2)[(H6t.y8y+H6t.D2+U5y+b1y+X3f+H6t.D2)](),this[(f4+b1y+U5y)][k3y][c6D]("span")[f2](1)[i7y]());this[H6t.X8y][o9D][h2D]||this[(f4+b1y+U5y)][(c1y+U5y+H6t.D2)][(Y7f+k8f+f4+f5D+H6t.A1y)]("div.editor-datetime-timeblock")[(H6t.z1y+H6t.c4+H6t.X8y+H6t.L3y)]()[i7y]();this[R9]();this[(w7+b1y+V8y+H6t.L3y+Z6D+H6t.A1y+H6t.X8y+F6y+U5y+H6t.D2)]((D9y+S8y),this[H6t.X8y][(x2D+f4y)][h2D]?12:24,1);this[(A8f+V8y+H6t.L3y+Z6D+G5D+H6t.P8+L9y+B1f)]("minutes",60,this[y2][(U5y+L9y+H6t.A1y+W3y+r9D+c2D+H6t.D2+H6t.A1y+H6t.L3y)]);this[(K7D+c5y)]((H6t.X8y+H6t.D2+s0f+v5y),60,this[y2][D0D]);this[e9]((O3+Q6y),["am",(V8y+U5y)],c[(H6f)]);this[(r8f)][X0f][(b1y+H6t.A1y)]((u4+y5f+H6t.X8y+H6t.e0f+H6t.D2+f4+L9y+H6t.L3y+h4+f3D+f4+H6t.c4+H6t.L3y+t0f+H6t.D2+L2f+y2+H6t.z1y+b8D+H6t.e0f+H6t.D2+H0y+H6t.L3y+b1y+H6t.y8y+f3D+f4+H6t.c4+H6t.L3y+H6t.D2+H6t.L3y+L9y+B1f),function(){var h1y="ontainer";if(!a[r8f][(y2+h1y)][(A7D)]((j0D+X3f+L9y+A5+H6t.D4+N3y))&&!a[(f4+b1y+U5y)][X0f][A7D]((j0D+f4+A7D+U1y+M7))){a[W1](a[r8f][(L9y+q2)][(X3f+i0)](),false);a[(w7+T5D)]();}
}
)[(b1y+H6t.A1y)]("keyup.editor-datetime",function(){a[(f4+b1y+U5y)][z7f][(L9y+H6t.X8y)]((j0D+X3f+A7D+L9y+H6t.D4+H6t.z1y+H6t.D2))&&a[(W1)](a[r8f][(L9y+H6t.A1y+J4y)][(X3f+i0)](),false);}
);this[r8f][z7f][(b1y+H6t.A1y)]((y2+l0D+v8),"select",function(){var U6="Outp",k2f="Time",a1="Clas",c6f="rit",q5f="_w",g6f="_setT",p7f="utes",V1f="Mi",N1="asCl",o0f="tpu",U6f="iteO",X9="asClass",R0f="lan",N5y="etCa",B5f="tTi",A1="CFu",e5f="_setTitle",c=d(this),f=c[(X3f+H6t.c4+H6t.z1y)]();if(c[(D9y+H6t.c4+j1D+B2f+H6t.X8y)](b+(f3D+U5y+m0+J1y))){a[P0](a[H6t.X8y][(I6+w0y+Q0y)],f);a[e5f]();a[K1y]();}
else if(c[(y6D+k6f+H6t.c4+m4)](b+"-year")){a[H6t.X8y][(H0y+H6t.X8y+V8y+w0y+Q0y)][(H6t.X8y+H6t.M2+Z5y+A1+M1y+R6+H6t.D2+H6t.c4+H6t.y8y)](f);a[(w7+H6t.X8y+H6t.D2+B5f+H6t.L3y+N3y)]();a[(w7+H6t.X8y+N5y+R0f+p6y+H6t.y8y)]();}
else if(c[(D9y+X9)](b+"-hours")||c[(y6D+G2D+V4f)](b+(f3D+H6t.c4+U5y+Q6y))){if(a[H6t.X8y][o9D][h2D]){c=d(a[(r8f)][(I2f+H6t.A1y+H6t.L3y+H6t.c4+L9y+H6t.A1y+J2)])[E7D]("."+b+"-hours")[(W1)]()*1;f=d(a[(f4+E0)][(s0f+H6t.L3y+H6t.c4+L9y+J7D+H6t.y8y)])[(f9y+d0D+f4)]("."+b+(f3D+H6t.c4+U5y+V8y+U5y))[W1]()===(Q6y);a[H6t.X8y][f4][H5f](c===12&&!f?0:f&&c!==12?c+12:c);}
else a[H6t.X8y][f4][H5f](f);a[v2f]();a[(w7+M0y+H6t.y8y+U6f+W3y+o0f+H6t.L3y)](true);}
else if(c[(D9y+N1+H6t.c4+H6t.X8y+H6t.X8y)](b+(f3D+U5y+L9y+H6t.A1y+M2f+c7))){a[H6t.X8y][f4][(H6t.X8y+H6t.D2+w1f+G2D+V1f+H6t.A1y+p7f)](f);a[(g6f+L9y+B1f)]();a[(q5f+c6f+H6t.D2+e5+H6t.L3y+V8y+M2f)](true);}
else if(c[(D9y+H6t.c4+H6t.X8y+a1+H6t.X8y)](b+"-seconds")){a[H6t.X8y][f4][r5](f);a[(w7+H6t.X8y+H6t.D2+H6t.L3y+k2f)]();a[(w7+A7y+L9y+n3y+U6+W3y+H6t.L3y)](true);}
a[(f4+E0)][(X0f)][C8y]();a[V]();}
)[(m0)]((y2+H6t.z1y+b8D),function(c){var M4D="iteOutp",z9y="CDat",P5="yea",i7f="dI",s9f="Ind",O4="ange",I5="selectedIndex",Q5="dIn",U9f="nU",c1f="aland",b7="setC",g1="nRi",j0y="foc",u8="_se",c5="setT",A3y="CMon",d1y="etU",J6D="bled",v0="owerC",f=c[(H6t.L3y+H6t.c4+H6t.y8y+v8+H6t.L3y)][(H6t.A1y+p1+H6t.D2+e6y+H6t.D2)][(H6t.L3y+b1y+v5+v0+c1+H6t.D2)]();if(f!==(H6t.X8y+v7D+y2+H6t.L3y)){c[(H6t.X8y+H6t.L3y+l0+C1+H6t.y8y+b1y+M9y+W+H6t.L3y+l7)]();if(f==="button"){c=d(c[X8f]);f=c.parent();if(!f[(D9y+H6t.c4+j1D+H6t.z1y+H6t.c4+H6t.X8y+H6t.X8y)]((H0y+e3+J6D)))if(f[(u9y+H6t.X8y+k6f+w1)](b+"-iconLeft")){a[H6t.X8y][H8f][(H6t.X8y+d1y+H6t.P8+A3y+J1y)](a[H6t.X8y][H8f][F5f]()-1);a[(w7+c5+L9y+H6t.L3y+H6t.z1y+H6t.D2)]();a[(u8+G3+H6t.c4+w0y+h7D+J2)]();a[(f4+b1y+U5y)][X0f][(j0y+W3y+H6t.X8y)]();}
else if(f[T2f](b+(f3D+L9y+I2f+g1+T9y+K2f))){a[P0](a[H6t.X8y][(f4+A7D+V8y+H6t.z1y+H6t.c4+Q0y)],a[H6t.X8y][(H8f)][(J5+g4f+b5f+H6t.A1y+H6t.L3y+D9y)]()+1);a[(w7+H6t.X8y+H6t.D2+H6t.L3y+H6t.P8+L9y+H6t.L3y+N3y)]();a[(w7+b7+c1f+J2)]();a[(r8f)][(d0D+J4y)][(j0y+T1f)]();}
else if(f[(D9y+c1+G2D+H6t.z1y+H6t.c4+H6t.X8y+H6t.X8y)](b+(f3D+L9y+y2+b1y+U9f+V8y))){c=f.parent()[E7D]("select")[0];c[(H6t.X8y+V0+l1y+H6t.L3y+H6t.D2+Q5+f4+N5)]=c[(H6t.X8y+V0+H6t.D2+U7+K1+H6t.A1y+p6y+b0y)]!==c[j3D].length-1?c[I5]+1:0;d(c)[(y2+D9y+O4)]();}
else if(f[T2f](b+"-iconDown")){c=f.parent()[(E7D)]("select")[0];c[(H6t.X8y+v7D+U7+s9f+H6t.D2+b0y)]=c[(M8+N3y+H6t.I4f+M7+K1+H6t.A1y+f4+N5)]===0?c[j3D].length-1:c[(M8+H6t.z1y+H6t.D2+H6t.I4f+H6t.D2+i7f+H6t.A1y+f4+H6t.D2+b0y)]-1;d(c)[a2]();}
else{if(!a[H6t.X8y][f4])a[H6t.X8y][f4]=a[z5f](new Date);a[H6t.X8y][f4][(M8+H6t.L3y+g4f+g9D+H6t.z1y+R6+H6t.D2+j8)](c.data((P5+H6t.y8y)));a[H6t.X8y][f4][(H6t.X8y+H6t.M2+X0+H6t.P8+G2D+b5f+z5D+D9y)](c.data((B8f)));a[H6t.X8y][f4][(H6t.X8y+H6t.D2+w1f+z9y+H6t.D2)](c.data((s5)));a[(w7+A7y+M4D+M2f)](true);setTimeout(function(){a[(X6f+L9y+p6y)]();}
,10);}
}
else a[(r8f)][X0f][(u4+y2+W3y+H6t.X8y)]();}
}
);}
,_compareDates:function(a,b){var b5D="_dateToUtcString";return this[b5D](a)===this[b5D](b);}
,_correctMonth:function(a,b){var S6f="setUTCMont",J3f="setUTCDate",h2="setUTCMonth",q5="Date",S1f="nth",K6="ays",c=this[(w7+f4+K6+E5D+b5f+S1f)](a[w4D](),b),e=a[(T9y+H6t.D2+H6t.L3y+Z5y+G2D+q5)]()>c;a[h2](b);e&&(a[J3f](c),a[(S6f+D9y)](b));}
,_daysInMonth:function(a,b){return [31,0===a%4&&(0!==a%100||0===a%400)?29:28,31,30,31,30,31,31,30,31,30,31][b];}
,_dateToUtc:function(a){var T8y="getMinutes",r6D="getDate",K6D="etMonth",W6="Full";return new Date(Date[g4f](a[(T9y+H6t.D2+H6t.L3y+W6+R6+H6t.D2+H6t.c4+H6t.y8y)](),a[(T9y+K6D)](),a[r6D](),a[(J5+b9+Q7+z7D)](),a[T8y](),a[O5f]()));}
,_dateToUtcString:function(a){var J9f="TCD";return a[w4D]()+"-"+this[(w7+V8y+a7)](a[F5f]()+1)+"-"+this[g9f](a[(T9y+H6t.M2+X0+J9f+H6t.c4+H6t.L3y+H6t.D2)]());}
,_hide:function(){var P9="Body_",y5D="ydown",a=this[H6t.X8y][(g2y+H6t.D2+H6t.X8y+V8y+m0y)];this[(H6t.a7y+U5y)][(y2+A3f+H6t.A1y+J2)][(f4+H6t.D2+H6t.L3y+H6t.c4+Y7f)]();d(j)[(b1y+f9y+f9y)]("."+a);d(q)[(b1y+f9y+f9y)]((F5y+H6t.D2+y5D+H6t.e0f)+a);d((f4+j7D+H6t.e0f+t9+H6t.P8+I6f+P9+G2D+x9f+H6t.D2+z5D))[V7f]((H6t.X8y+s6f+H6t.e0f)+a);d("body")[V7f]("click."+a);}
,_hours24To12:function(a){return 0===a?12:12<a?a-12:a;}
,_htmlDay:function(a){var E4='ea',i8='yp',H5='ay',h7f="cte",Z5D="isab";if(a.empty)return '<td class="empty"></td>';var b=[(s5)],c=this[y2][V6D];a[(f4+Z5D+H6t.z1y+H6t.D2+f4)]&&b[(V8y+W3y+H6t.X8y+D9y)]((f4+Z5D+H6t.z1y+H6t.D2+f4));a[(H6t.L3y+p1+H6t.c4+Q0y)]&&b[(y4y+D9y)]("today");a[(H6t.X8y+H6t.D2+N3y+y2+H6t.L3y+H6t.D2+f4)]&&b[(m2y+b5)]((H6t.X8y+H6t.D2+N3y+h7f+f4));return (V5+c0f+W2y+E4D+W2y+O7f+o8+W2y+H5+U4D)+a[s5]+'" class="'+b[E3y](" ")+'"><button class="'+c+"-button "+c+(o8+W2y+H5+n8f+c0f+i8+L4y+U4D+t7y+n2D+n8f+W2y+K2y+c0f+K2y+o8+l2f+E4+W7f+U4D)+a[(P1+H6t.c4+H6t.y8y)]+'" data-month="'+a[(T9f+H6t.A1y+H6t.L3y+D9y)]+(n8f+W2y+l1+K2y+o8+W2y+H5+U4D)+a[s5]+'">'+a[(f4+H6t.c4+Q0y)]+(G0D+H6t.D4+W3y+Z4y+m0+T+H6t.L3y+f4+g4D);}
,_htmlMonth:function(a,b){var O6="><",R2y="Hea",D9D="Nu",L6="Wee",m8D="sho",h5f="_htmlWeekOfYear",i3="Numb",y5y="howWe",Z4f="_htmlDay",S4D="unctio",W4D="CD",Y2y="getU",g8y="rray",J3D="eDa",P8f="mpareD",C9f="mpa",T0y="setUTCMinutes",i5D="tUTCH",J7f="inD",Y9="tDa",H1f="fir",h6f="_daysInMonth",c=new Date,e=this[h6f](a,b),f=(new Date(Date[(Z5y+G2D)](a,b,1)))[v1y](),g=[],h=[];0<this[y2][T6y]&&(f-=this[y2][(H1f+H6t.X8y+Y9+Q0y)],0>f&&(f+=7));for(var i=e+f,j=i;7<j;)j-=7;var i=i+(7-j),j=this[y2][(U5y+J7f+H6t.c4+H6t.L3y+H6t.D2)],m=this[y2][(U5y+w5+Y9f+H6t.L3y+H6t.D2)];j&&(j[(H6t.X8y+H6t.D2+i5D+S8y)](0),j[T0y](0),j[r5](0));m&&(m[H5f](23),m[T0y](59),m[r5](59));for(var n=0,p=0;n<i;n++){var o=new Date(Date[g4f](a,b,1+(n-f))),q=this[H6t.X8y][f4]?this[(w7+I2f+C9f+H6t.y8y+H6t.D2+t9+H6t.c4+H6t.L3y+c7)](o,this[H6t.X8y][f4]):!1,r=this[(F4y+P8f+H6t.c4+n3y+H6t.X8y)](o,c),s=n<f||n>=e+f,t=j&&o<j||m&&o>m,v=this[y2][(f4+L9y+H6t.X8y+U1y+J3D+Q0y+H6t.X8y)];d[(L9y+C9D+g8y)](v)&&-1!==d[(m6f+H6t.y8y+Y9D+Q0y)](o[(Y2y+H6t.P8+W4D+Q9)](),v)?t=!0:(f9y+S4D+H6t.A1y)===typeof v&&!0===v(o)&&(t=!0);h[(y4y+D9y)](this[Z4f]({day:1+(n-f),month:b,year:a,selected:q,today:r,disabled:t,empty:s}
));7===++p&&(this[y2][(H6t.X8y+y5y+T0+i3+J2)]&&h[i7](this[h5f](n-f,b,a)),g[(Z6y)]("<tr>"+h[(H6t.X5y+N3D)]("")+(G0D+H6t.L3y+H6t.y8y+g4D)),h=[],p=0);}
c=this[y2][(t7f+c1+H6t.X8y+C1+H6t.y8y+Y7+K2D)]+(f3D+H6t.L3y+H6t.c4+q4D+H6t.D2);this[y2][(m8D+M0y+L6+F5y+D9D+U5y+W7D)]&&(c+=" weekNumber");return (V5+c0f+K2y+t7y+f6y+L4y+E4D+s2y+h4f+U4D)+c+'"><thead>'+this[(X6f+H6t.L3y+R9f+b5f+H6t.A1y+H6t.L3y+D9y+R2y+f4)]()+(G0D+H6t.L3y+D9y+g1y+f4+O6+H6t.L3y+H6t.D4+b1y+l9y+g4D)+g[(H6t.X5y+N3D)]("")+(G0D+H6t.L3y+H6t.D4+y2D+T+H6t.L3y+U1y+H6t.D2+g4D);}
,_htmlMonthHead:function(){var A6f="We",G7y="how",a=[],b=this[y2][T6y],c=this[y2][(L9y+U5+H6t.A1y)],e=function(a){var d9y="weekdays";for(a+=b;7<=a;)a-=7;return c[d9y][a];}
;this[y2][(H6t.X8y+G7y+A6f+T0+h8+W3y+U5y+H6t.D4+H6t.D2+H6t.y8y)]&&a[(m2y+H6t.X8y+D9y)]("<th></th>");for(var d=0;7>d;d++)a[(m2y+b5)]("<th>"+e(d)+(G0D+H6t.L3y+D9y+g4D));return a[(H6t.X5y+b1y+L9y+H6t.A1y)]("");}
,_htmlWeekOfYear:function(a,b,c){var e=new Date(c,0,1),a=Math[(y2+H6t.D2+k8f)](((new Date(c,b,a)-e)/864E5+e[v1y]()+1)/7);return '<td class="'+this[y2][V6D]+(o8+d6f+L4y+L4y+r6y+t8)+a+(G0D+H6t.L3y+f4+g4D);}
,_options:function(a,b,c){var D4y='ption';c||(c=b);a=this[(r8f)][z7f][(f9y+Z1f)]("select."+this[y2][(y2+H6t.z1y+H6t.c4+m4+C1+f5D+f9y+L9y+b0y)]+"-"+a);a.empty();for(var e=0,d=b.length;e<d;e++)a[(H6t.c4+V8y+w8y+h7D)]((V5+y6y+D4y+E4D+n6f+K2y+f6y+H0f+L4y+U4D)+b[e]+(t8)+c[e]+(G0D+b1y+V8y+H6t.L3y+L9y+m0+g4D));}
,_optionSet:function(a,b){var q6y="known",A8y="Pr",c=this[r8f][z7f][(N6+H6t.A1y+f4)]((h9f+H6t.e0f)+this[y2][(t7f+H6t.c4+H6t.X8y+H6t.X8y+A8y+Y7+K2D)]+"-"+a),e=c.parent()[c6D]("span");c[W1](b);c=c[(f9y+Z1f)]((b1y+V8y+c1y+b1y+H6t.A1y+j0D+H6t.X8y+b4f+H6t.L3y+H6t.D2+f4));e[(K2f+U5y+H6t.z1y)](0!==c.length?c[h0f]():this[y2][(L9y+X2)][(W3y+H6t.A1y+q6y)]);}
,_optionsTime:function(a,b,c){var S='lue',J9y="lassP",a=this[r8f][(a5y+d6+J7D+H6t.y8y)][E7D]("select."+this[y2][(y2+J9y+f5D+N6+b0y)]+"-"+a),e=0,d=b,f=12===b?function(a){return a;}
:this[(w7+V8y+H6t.c4+f4)];12===b&&(e=1,d=13);for(b=e;b<d;b+=c)a[(z3+V8y+H6t.D2+h7D)]((V5+y6y+l6f+n2f+q9f+E4D+n6f+K2y+S+U4D)+b+'">'+f(b)+(G0D+b1y+R4y+L9y+b1y+H6t.A1y+g4D));}
,_optionsTitle:function(){var y2y="ran",s1D="_ra",J6f="rRan",d5f="rRa",M3D="tFullYea",f2y="lY",P8y="getFu",s4f="getFullYear",A2y="minD",a=this[y2][(E1y)],b=this[y2][(A2y+H6t.c4+H6t.L3y+H6t.D2)],c=this[y2][v0y],b=b?b[s4f]():null,c=c?c[(P8y+H6t.z1y+f2y+H6t.D2+j8)]():null,b=null!==b?b:(new Date)[(v8+M3D+H6t.y8y)]()-this[y2][(P1+H6t.c4+d5f+p4)],c=null!==c?c:(new Date)[(T9y+H6t.D2+H6t.L3y+g9D+H6t.z1y+R6+o1y)]()+this[y2][(Q0y+g1y+J6f+T9y+H6t.D2)];this[(x4y+H6t.L3y+L9y+b1y+G5D)]("month",this[(s1D+p4)](0,11),a[(U5y+b1y+z5D+D9y+H6t.X8y)]);this[(A8f+V8y+H6t.L3y+L9y+m0+H6t.X8y)]("year",this[(w7+y2y+v8)](b,c));}
,_pad:function(a){return 10>a?"0"+a:a;}
,_position:function(){var W8f="lTo",Z9D="cro",Q4D="rHeight",I9="ute",a=this[(r8f)][X0f][(L8+W1y)](),b=this[(f4+b1y+U5y)][z7f],c=this[(f4+E0)][X0f][(b1y+I9+Q4D)]();b[l9f]({top:a.top+c,left:a[h4y]}
)[(L8D+H6t.D2+H6t.A1y+f4+Y4y)]("body");var e=b[b3y](),f=d((H6t.D4+y2D))[(H6t.X8y+Z9D+H6t.z1y+W8f+V8y)]();a.top+c+e-f>d(j).height()&&(a=a.top-e,b[l9f]((p9y+V8y),0>a?0:a));}
,_range:function(a,b){for(var c=[],e=a;e<=b;e++)c[Z6y](e);return c;}
,_setCalander:function(){var Y4f="Yea",q2D="CF",U5f="mlM",P7y="calenda";this[(H6t.a7y+U5y)][(P7y+H6t.y8y)].empty()[(H6t.c4+j7y+H6t.A1y+f4)](this[(w7+K2f+U5f+b1y+H6t.A1y+H6t.L3y+D9y)](this[H6t.X8y][(M3+V8y+H6t.z1y+H6t.c4+Q0y)][(T9y+H6t.D2+V4+H6t.P8+q2D+W3y+M1y+Y4f+H6t.y8y)](),this[H6t.X8y][(M3+p3y)][F5f]()));}
,_setTitle:function(){var d0y="tionSet",C4="isplay";this[t9y]((T9f+H6t.A1y+J1y),this[H6t.X8y][(f4+C4)][F5f]());this[(A8f+V8y+d0y)]((Q0y+g1y+H6t.y8y),this[H6t.X8y][(f4+L9y+H6t.X8y+V8y+H6t.z1y+H6t.c4+Q0y)][w4D]());}
,_setTime:function(){var R6D="getUTCMinutes",E9="inut",n6="Se",d3f="ption",h8D="To12",e6D="4",l6y="rs1",r5f="TCH",a=this[H6t.X8y][f4],b=a?a[(T9y+H6t.D2+V4+r5f+S8y)]():0;this[H6t.X8y][o9D][(D9y+b1y+W3y+l6y+y8D)]?(this[t9y]((D9y+p5f+H6t.X8y),this[(w7+D9y+b1y+X5f+H6t.X8y+y8D+e6D+h8D)](b)),this[t9y]((H6t.c4+U5y+Q6y),12>b?"am":(V8y+U5y))):this[(w7+b1y+d3f+n6+H6t.L3y)]((D9y+S8y),b);this[t9y]((U5y+E9+H6t.D2+H6t.X8y),a?a[R6D]():0);this[t9y]((M8+y2+b1y+h7D+H6t.X8y),a?a[O5f]():0);}
,_show:function(){var u3="sc",u9f="ize",l3f="positi",a=this,b=this[H6t.X8y][E5f];this[(w7+l3f+m0)]();d(j)[(b1y+H6t.A1y)]((H6t.X8y+y2+R0D+M1y+H6t.e0f)+b+(L2f+H6t.y8y+H6t.D2+H6t.X8y+u9f+H6t.e0f)+b,function(){a[V]();}
);d("div.DTE_Body_Content")[(b1y+H6t.A1y)]((u3+H6t.y8y+b1y+H6t.z1y+H6t.z1y+H6t.e0f)+b,function(){var A5D="_posi";a[(A5D+c1y+b1y+H6t.A1y)]();}
);d(q)[(m0)]("keydown."+b,function(b){var o2="_hide",w7y="yCo",q7f="eyCo";(9===b[(F5y+q7f+p6y)]||27===b[(F5y+z5+G2D+b1y+f4+H6t.D2)]||13===b[(F5y+H6t.D2+w7y+p6y)])&&a[o2]();}
);setTimeout(function(){d((H6t.D4+p1+Q0y))[m0]("click."+b,function(b){var r3="targ",u8D="filter";!d(b[(X8f)])[G0y]()[u8D](a[(H6t.a7y+U5y)][z7f]).length&&b[(r3+H6t.D2+H6t.L3y)]!==a[(f4+E0)][(r2D+M2f)][0]&&a[(X6f+B0f)]();}
);}
,10);}
,_writeOutput:function(a){var r1y="getUTCDate",s1y="Mon",v1D="tUTC",C4f="llY",T5="St",o1D="Locale",W0f="mom",b=this[H6t.X8y][f4],b=j[V6y]?j[(W0f+Z9+H6t.L3y)][J9](b,h,this[y2][(V6y+o1D)],this[y2][(T9f+U5y+H6t.D2+H6t.A1y+H6t.L3y+T5+H6t.y8y+L9y+y2+H6t.L3y)])[(f9y+h4+U5y+d8)](this[y2][(f9y+b1y+H6t.y8y+U5y+d8)]):b[(T9y+H6t.M2+X0+H6t.P8+G2D+y9+W3y+C4f+H6t.D2+H6t.c4+H6t.y8y)]()+"-"+this[(g9f)](b[(T9y+H6t.D2+v1D+s1y+J1y)]()+1)+"-"+this[g9f](b[(r1y)]());this[r8f][(d0D+V8y+M2f)][(W1)](b);a&&this[r8f][(L9y+H6t.A1y+m2y+H6t.L3y)][C8y]();}
}
);f[(I7y+U5y+H6t.D2)][G9y]=X3;f[(Y9f+n3y+H6t.P8+L9y+B1f)][(p6y+f9y+H6t.c4+m0D)]={classPrefix:(M7+L9y+H6t.L3y+b1y+H6t.y8y+f3D+f4+C7D+I0f),disableDays:a5D,firstDay:A3,format:(w3f+f3D+N8+N8+f3D+t9+t9),i18n:f[(K6f+P4f+f4y)][E1y][(w8f+C3D+L9y+U5y+H6t.D2)],maxDate:a5D,minDate:a5D,minutesIncrement:A3,momentStrict:!X3,momentLocale:(Z9),secondsIncrement:A3,showWeekNumber:!A3,yearRange:O2y}
;var I=function(a,b){var d8D="div.upload button",r7y="...",N2="Choo",n7D="upl";if(a5D===b||b===h)b=a[(n7D+b1y+a7+a4f+H6t.L3y)]||(N2+M8+L2f+f9y+k8f+H6t.D2+r7y);a[(g5D+J4y)][E7D](d8D)[V3y](b);}
,M=function(a,b,c){var Y4="input[type=file]",D8f="arV",A2D="pend",J7y="noDrop",u4D="addC",C0="dragover",x9D="xit",Y1="av",S5f="over",f0="ere",H6y="rag",r6="ag",u7y="dra",P4y="FileReader",s7f="_enabled",j2f='de',E8y='ro',k2='ec',G1f='ow',F9='learValue',c6='il',K8y='np',p0f='loa',U3c='ell',O4f='u_t',P7f='upload',L7='r_',L1f='ito',e=a[S7][(f9y+h4+U5y)][(O0D+E1f)],g=d((V5+W2y+P0y+n6f+E4D+s2y+f6y+K2y+C3f+U4D+L4y+W2y+L1f+L7+P7f+K0f+W2y+P0y+n6f+E4D+s2y+h4f+U4D+L4y+O4f+K2y+t7y+a4D+K0f+W2y+U9+E4D+s2y+f6y+H8+f7f+U4D+W7f+y6y+d6f+K0f+W2y+P0y+n6f+E4D+s2y+D4f+f7f+f7f+U4D+s2y+U3c+E4D+H0f+l6f+p0f+W2y+K0f+t7y+n2D+E4D+s2y+h4f+U4D)+e+(b6+P0y+K8y+H0f+c0f+E4D+c0f+l2f+l6f+L4y+U4D+K4y+c6+L4y+e5D+W2y+U9+j8y+W2y+U9+E4D+s2y+f6y+K2y+f7f+f7f+U4D+s2y+L4y+f6y+f6y+E4D+s2y+F9+K0f+t7y+K7+y6y+q7y+E4D+s2y+f6y+K2y+C3f+U4D)+e+(a2D+W2y+U9+j6+W2y+P0y+n6f+j8y+W2y+P0y+n6f+E4D+s2y+f6y+K2y+f7f+f7f+U4D+W7f+G1f+E4D+f7f+k2+q9f+W2y+K0f+W2y+P0y+n6f+E4D+s2y+D4f+C3f+U4D+s2y+U3c+K0f+W2y+P0y+n6f+E4D+s2y+f6y+K2y+C3f+U4D+W2y+E8y+l6f+K0f+f7f+l6f+U3+I9D+W2y+P0y+n6f+j6+W2y+P0y+n6f+j8y+W2y+P0y+n6f+E4D+s2y+f6y+K2y+f7f+f7f+U4D+s2y+U3c+K0f+W2y+P0y+n6f+E4D+s2y+D4f+C3f+U4D+W7f+L4y+q7y+j2f+j4+W2y+e5D+W2y+P0y+n6f+j6+W2y+U9+j6+W2y+U9+j6+W2y+P0y+n6f+O2));b[(g5D+V8y+M2f)]=g;b[s7f]=!X3;I(b);if(j[P4y]&&!A3!==b[(u7y+T9y+t9+H6t.y8y+l0)]){g[E7D]((u1+H6t.e0f+f4+R0D+V8y+L2f+H6t.X8y+V8y+Y))[h0f](b[(f4+H6t.y8y+r6+t9+H6t.y8y+b1y+V8y+a4f+H6t.L3y)]||(t9+H6y+L2f+H6t.c4+h7D+L2f+f4+p3D+L2f+H6t.c4+L2f+f9y+o0D+L2f+D9y+f0+L2f+H6t.L3y+b1y+L2f+W3y+V8y+H6t.z1y+b1y+H6t.c4+f4));var h=g[(f9y+L9y+H6t.A1y+f4)]((f4+L9y+X3f+H6t.e0f+f4+R0D+V8y));h[(m0)]((f4+H6t.y8y+b1y+V8y),function(e){var Q2y="Cla",L4="ansfe",D7y="dataTr",J6="originalEvent";b[(a7f+q6D+H6t.r9+f4)]&&(f[(W3y+V8y+H6t.z1y+b1y+a7)](a,b,e[J6][(D7y+L4+H6t.y8y)][(f9y+k8f+c7)],I,c),h[(f5D+U5y+b1y+K7f+Q2y+H6t.X8y+H6t.X8y)]((S5f)));return !A3;}
)[m0]((f4+H6t.y8y+H6t.c4+T9y+N3y+Y1+H6t.D2+L2f+f4+H6t.y8y+G5+x9D),function(){b[(w7+H6t.D2+q6D+H6t.r9+f4)]&&h[(H6t.y8y+H6t.D2+U5y+b1y+K7f+G2D+H6t.z1y+H6t.c4+H6t.X8y+H6t.X8y)](S5f);return !A3;}
)[(m0)](C0,function(){b[s7f]&&h[t4f]((d2+J2));return !A3;}
);a[m0](K1D,function(){var D0y="_Up";d((H6t.D4+b1y+f4+Q0y))[(m0)]((v2y+H6t.c4+T9y+b1y+K7f+H6t.y8y+H6t.e0f+t9+H6t.P8+o5+D0y+H6t.z1y+b1y+H6t.c4+f4+L2f+f4+p3D+H6t.e0f+t9+Y6+w7+u3c+j5f),function(){return !A3;}
);}
)[(b1y+H6t.A1y)]((y2+L7f+H6t.D2),function(){var I5D="_U",N2D="agove";d((o9y+Q0y))[(V7f)]((v2y+N2D+H6t.y8y+H6t.e0f+t9+Y6+I5D+b6y+b1y+a7+L2f+f4+H6t.y8y+l0+H6t.e0f+t9+Y6+w7+X0+V8y+H6t.z1y+b1y+H6t.c4+f4));}
);}
else g[(u4D+w0y+H6t.X8y+H6t.X8y)](J7y),g[(H6t.c4+V8y+A2D)](g[(f9y+L9y+h7D)](v4D));g[E7D]((u1+H6t.e0f+y2+H6t.z1y+H6t.D2+D8f+H6t.c4+l7f+H6t.D2+L2f+H6t.D4+W3y+H6t.L3y+p9y+H6t.A1y))[m0]((y2+H6t.z1y+b8D),function(){var p8D="pes";f[(N6+d7D+I5y+p8D)][M4][b7f][B5y](a,b,I3y);}
);g[(N6+h7D)](Y4)[(m0)](a2,function(){f[M4](a,b,this[(f9y+L9y+N3y+H6t.X8y)],I,function(b){c[(I5f+H6t.z1y)](a,b);g[E7D](Y4)[(X3f+H6t.c4+H6t.z1y)](I3y);}
);}
);return g;}
,A=function(a){setTimeout(function(){var Z0="trigger";a[Z0]((R1+p4),{editor:!X3,editorSet:!X3}
);}
,X3);}
,s=f[(y4D+H6t.z1y+f4+H6t.P8+k1)],p=d[(N5+H6t.L3y+R5y)](!X3,{}
,f[I1][(N6+d7D+I5y+w8y)],{get:function(a){return a[(T8f+q2)][(X3f+H6t.c4+H6t.z1y)]();}
,set:function(a,b){a[(T8f+q9D+W3y+H6t.L3y)][(X3f+H6t.c4+H6t.z1y)](b);A(a[(g5D+V8y+W3y+H6t.L3y)]);}
,enable:function(a){a[m4D][X9y](o3y,K7y);}
,disable:function(a){var t5="inpu";a[(w7+t5+H6t.L3y)][X9y]((M3+K2+H6t.z1y+H6t.D2+f4),F5D);}
}
);s[(D9y+L9y+f4+c0)]={create:function(a){a[(w7+X3f+H6t.c4+H6t.z1y)]=a[J0f];return a5D;}
,get:function(a){return a[I0];}
,set:function(a,b){a[I0]=b;}
}
;s[z3y]=d[C5y](!X3,{}
,p,{create:function(a){a[(W3+W3y+H6t.L3y)]=d((j2D+L9y+H6t.A1y+V8y+M2f+M7D))[d1D](d[(j9D+h7D)]({id:f[p3f](a[q8f]),type:(h0f),readonly:z3y}
,a[d1D]||{}
));return a[(m4D)][X3];}
}
);s[(h0f)]=d[(H6t.D2+b0y+H6t.L3y+Z9+f4)](!X3,{}
,p,{create:function(a){var k6D="<input/>";a[m4D]=d(k6D)[d1D](d[(H6t.D2+V2+R5y)]({id:f[p3f](a[q8f]),type:(H6t.L3y+H6t.D2+V2)}
,a[(H6t.c4+H6t.L3y+H6t.L3y+H6t.y8y)]||{}
));return a[(w7+X0f)][X3];}
}
);s[(M9y+G2y)]=d[C5y](!X3,{}
,p,{create:function(a){var p0="password";a[(w7+L9y+q2)]=d((j2D+L9y+q9D+W3y+H6t.L3y+M7D))[(d8+w4y)](d[(G0f+Z9+f4)]({id:f[p3f](a[q8f]),type:p0}
,a[d1D]||{}
));return a[m4D][X3];}
}
);s[(H6t.L3y+H6t.D2+K5+H6t.y8y+g1y)]=d[(e0y+f4)](!X3,{}
,p,{create:function(a){var A3D="feId",C2y="area";a[(T8f+H6t.A1y+m2y+H6t.L3y)]=d((j2D+H6t.L3y+G0f+C2y+M7D))[(d1D)](d[(j9D+h7D)]({id:f[(H6t.X8y+H6t.c4+A3D)](a[q8f])}
,a[d1D]||{}
));return a[m4D][X3];}
}
);s[(h9f)]=d[C5y](!0,{}
,p,{_addOptions:function(a,b){var L9="Pair",B1D="ions",O2f="pairs",r7="placeholderDisabled",k7f="rV",o9="hol",G5y="lace",f3y="ceh",S5="lde",v6="place",c=a[(w7+X0f)][0][(l0+O1D+H6t.X8y)],e=0;c.length=0;if(a[(v6+D9y+b1y+S5+H6t.y8y)]!==h){e=e+1;c[0]=new Option(a[f2f],a[(V8y+w0y+f3y+b1y+s3y+H6t.D2+H6t.y8y+k3c+H6t.z1y+H6t.j1f)]!==h?a[(V8y+G5y+o9+f4+H6t.D2+k7f+H6t.c4+p4y)]:"");var d=a[r7]!==h?a[r7]:true;c[0][(D9y+q8f+c0)]=d;c[0][o3y]=d;}
b&&f[O2f](b,a[(W6y+B1D+L9)],function(a,b,d){var o1f="_editor_val";c[d+e]=new Option(b,a);c[d+e][o1f]=a;}
);}
,create:function(a){var f8D="Opts",R7="ltiple",o4f="eId";a[(m4D)]=d("<select/>")[(d1D)](d[(G0f+Z9+f4)]({id:f[(H6t.X8y+y6+o4f)](a[(L9y+f4)]),multiple:a[(y7D+R7)]===true}
,a[d1D]||{}
))[(m0)]((R1+p4+H6t.e0f+f4+n3y),function(b,c){var M5y="_lastSe";if(!c||!c[(M7+L9y+H6t.L3y+h4)])a[(M5y+H6t.L3y)]=s[(H6t.X8y+H6t.D2+H6t.z1y+H6t.D2+H6t.I4f)][J5](a);}
);s[(H6t.X8y+V0+H6t.D2+y2+H6t.L3y)][(b6f+f4+f4+s1+R4y+L9y+b1y+H6t.A1y+H6t.X8y)](a,a[(l0+c1y+b1y+H6t.A1y+H6t.X8y)]||a[(L9y+V8y+f8D)]);return a[(w7+X0f)][0];}
,update:function(a,b){s[h9f][(w7+a7+f4+s1+R4y+L9y+b1y+H6t.A1y+H6t.X8y)](a,b);var c=a[C7f];c!==h&&s[h9f][(M8+H6t.L3y)](a,c,true);A(a[(w7+d0D+V8y+M2f)]);}
,get:function(a){var x5="ipl",b=a[(g5D+V8y+W3y+H6t.L3y)][(f9y+d0D+f4)]((W6y+l7+j0D+H6t.X8y+H6t.D2+H6t.z1y+H6t.D2+y2+n3y+f4))[(A7f+V8y)](function(){var o6y="or_val";return this[(a7f+H0y+H6t.L3y+o6y)];}
)[E8f]();return a[(U5y+F9y+x5+H6t.D2)]?a[e8y]?b[(H6t.X5y+N3D)](a[e8y]):b:b.length?b[0]:null;}
,set:function(a,b,c){var E5y="parat",o9f="multiple";if(!c)a[C7f]=b;a[o9f]&&a[(H6t.X8y+H6t.D2+E5y+h4)]&&!d[g4](b)?b=b[k1D](a[e8y]):d[g4](b)||(b=[b]);var e,f=b.length,g,h=false,i=a[(w7+L9y+i5f+H6t.L3y)][E7D]((b1y+V8y+c1y+b1y+H6t.A1y));a[(T8f+H6t.A1y+m2y+H6t.L3y)][(Y5f+f4)]((b1y+R4y+L9y+b1y+H6t.A1y))[J9D](function(){var n6D="lecte";g=false;for(e=0;e<f;e++)if(this[(a7f+f4+L9y+H6t.L3y+b1y+H6t.y8y+w7+W1)]==b[e]){h=g=true;break;}
this[(H6t.X8y+H6t.D2+n6D+f4)]=g;}
);if(a[f2f]&&!h&&!a[o9f]&&i.length)i[0][(H6t.X8y+V0+H6t.D2+y2+H6t.L3y+H6t.D2+f4)]=true;c||A(a[m4D]);return h;}
,destroy:function(a){a[(g5D+V8y+M2f)][V7f]("change.dte");}
}
);s[(Y7f+t2D+M6y)]=d[(H6t.D2+b0y+I9f)](!0,{}
,p,{_addOptions:function(a,b){var M4y="Pa",c=a[m4D].empty();b&&f[(M9y+L9y+z7D)](b,a[(l0+t6D+G5D+M4y+L9y+H6t.y8y)],function(b,g,h){var H9="_edito",v4f="ttr",V5y="afe",i8y="ppen";c[(H6t.c4+i8y+f4)]((V5+W2y+P0y+n6f+j8y+P0y+q7y+l6f+H0D+E4D+P0y+W2y+U4D)+f[p3f](a[q8f])+"_"+h+(n8f+c0f+l2f+l6f+L4y+U4D+s2y+y3f+L4y+s2y+r6y+t7y+y6y+i4f+b6+f6y+N7y+j5+E4D+K4y+y6y+W7f+U4D)+f[(H6t.X8y+V5y+E0f)](a[(L9y+f4)])+"_"+h+(t8)+g+"</label></div>");d("input:last",c)[(H6t.c4+v4f)]((W1+H6t.j1f),b)[0][(H9+H6t.y8y+z1f+i0)]=b;}
);}
,create:function(a){var B3="ipOpts",l9D="_addOptions";a[(T8f+i5f+H6t.L3y)]=d((j2D+f4+L9y+X3f+S7y));s[L4D][l9D](a,a[j3D]||a[B3]);return a[(w7+r2D+W3y+H6t.L3y)][0];}
,get:function(a){var b=[];a[(w7+d0D+V8y+W3y+H6t.L3y)][E7D]((L9y+q9D+M2f+j0D+y2+D9y+l1y+F5y+M7))[J9D](function(){var M4f="r_va";b[(y4y+D9y)](this[(a7f+f4+L9y+H6t.L3y+b1y+M4f+H6t.z1y)]);}
);return !a[(H6t.X8y+H6t.D2+V8y+H6t.c4+Y9D+v8f)]?b:b.length===1?b[0]:b[(H6t.X5y+b1y+L9y+H6t.A1y)](a[e8y]);}
,set:function(a,b){var c=a[m4D][E7D]((d0D+J4y));!d[g4](b)&&typeof b===(H6t.X8y+H6t.L3y+u1D+H6t.A1y+T9y)?b=b[k1D](a[e8y]||"|"):d[(L9y+C9D+F9f+Q0y)](b)||(b=[b]);var e,f=b.length,g;c[(O6y+D9y)](function(){var G9="hecke";g=false;for(e=0;e<f;e++)if(this[(a7f+f4+L9y+H6t.L3y+b1y+H6t.y8y+z1f+H6t.c4+H6t.z1y)]==b[e]){g=true;break;}
this[(y2+G9+f4)]=g;}
);A(c);}
,enable:function(a){a[m4D][E7D]((L9y+q9D+M2f))[(X9y)]("disabled",false);}
,disable:function(a){a[(w7+L9y+H6t.A1y+V8y+M2f)][(N6+h7D)]("input")[(Z0y+b1y+V8y)]((f4+L9y+H6t.X8y+K2+H6t.z1y+M7),true);}
,update:function(a,b){var N2f="ddO",c=s[L4D],d=c[(v8+H6t.L3y)](a);c[(b6f+N2f+V8y+H6t.L3y+L9y+w9f)](a,b);c[(M8+H6t.L3y)](a,d);}
}
);s[Q6f]=d[C5y](!0,{}
,p,{_addOptions:function(a,b){var O1="optionsPair",c=a[m4D].empty();b&&f[(M9y+L9y+z7D)](b,a[O1],function(b,g,h){var K9D="_ed",V1="fe",C5="safe";c[(H6t.c4+U3f+Z9+f4)]((V5+W2y+P0y+n6f+j8y+P0y+q7y+l6f+H0f+c0f+E4D+P0y+W2y+U4D)+f[(C5+K1+f4)](a[(L9y+f4)])+"_"+h+'" type="radio" name="'+a[(H6t.A1y+H6t.c4+B1f)]+(b6+f6y+o7f+f6y+E4D+K4y+J8f+U4D)+f[(e3+V1+E0f)](a[q8f])+"_"+h+'">'+g+"</label></div>");d((d0D+V8y+M2f+j0D+H6t.z1y+c1+H6t.L3y),c)[d1D]((W1+H6t.j1f),b)[0][(K9D+L9y+v8f+w7+q6f+H6t.z1y)]=b;}
);}
,create:function(a){var c0D="ip",s3c="_ad";a[(g5D+J4y)]=d("<div />");s[(Y9D+f4+Z6D)][(s3c+f4+n0f+Z6D+H6t.A1y+H6t.X8y)](a,a[j3D]||a[(c0D+n0f+H6t.X8y)]);this[m0]("open",function(){a[(w7+L9y+H6t.A1y+J4y)][(E7D)]((d0D+V8y+W3y+H6t.L3y))[(O6y+D9y)](function(){var t2="cked",Y3="che",q8y="_preChecked";if(this[q8y])this[(Y3+t2)]=true;}
);}
);return a[m4D][0];}
,get:function(a){var U7D="editor_";a=a[(w7+r2D+W3y+H6t.L3y)][E7D]((r2D+M2f+j0D+y2+D9y+H6t.D2+y2+v6D));return a.length?a[0][(w7+U7D+X3f+H6t.c4+H6t.z1y)]:h;}
,set:function(a,b){var V2y="ecked";a[m4D][(f9y+d0D+f4)]((L9y+i5f+H6t.L3y))[(O6y+D9y)](function(){var Q1y="Che",O8f="checked",p7D="_va",B6f="eChe";this[(u2f+B6f+Q7f+H6t.D2+f4)]=false;if(this[(a7f+H0y+H6t.L3y+h4+p7D+H6t.z1y)]==b)this[(s8f+H6t.y8y+n6y+w3y+y2+E8+f4)]=this[O8f]=true;else this[(s8f+H6t.y8y+H6t.D2+Q1y+y2+v6D)]=this[O8f]=false;}
);A(a[(w7+r2D+M2f)][(Y5f+f4)]((L9y+H6t.A1y+V8y+W3y+H6t.L3y+j0D+y2+D9y+V2y)));}
,enable:function(a){a[(w7+L9y+H6t.A1y+V8y+M2f)][(E7D)]((r2D+M2f))[X9y]("disabled",false);}
,disable:function(a){a[(T8f+H6t.A1y+V8y+M2f)][E7D]("input")[(D7f+V8y)]("disabled",true);}
,update:function(a,b){var L3D='lu',c=s[Q6f],d=c[(J5)](a);c[(b6f+f4+f4+H3+H6t.L3y+L9y+m0+H6t.X8y)](a,b);var f=a[(g5D+V8y+M2f)][E7D]((L9y+H6t.A1y+J4y));c[(H6t.X8y+H6t.D2+H6t.L3y)](a,f[(N6+X2f+J2)]((K5y+n6f+K2y+L3D+L4y+U4D)+d+(I8y)).length?d:f[(f2)](0)[(H6t.c4+Z4y+H6t.y8y)]("value"));}
}
);s[(f4+t7)]=d[C5y](!0,{}
,p,{create:function(a){var R2D="ale",i4="../../",u0D="eIma",o6D="dateImage",U7f="282",P9D="C_",C8D="ateFo",E3="rmat",G1D="ryui",i8D="tep",u3D="tex";a[m4D]=d("<input />")[d1D](d[(N5+a1D+f4)]({id:f[p3f](a[q8f]),type:(u3D+H6t.L3y)}
,a[(H6t.c4+H6t.L3y+H6t.L3y+H6t.y8y)]));if(d[(f4+H6t.c4+i8D+o5f+F5y+H6t.D2+H6t.y8y)]){a[m4D][t4f]((H6t.X5y+D1y+H6t.j1f+G1D));if(!a[(f4+d8+P6y+b1y+E3)])a[(f4+C8D+V3D+H6t.c4+H6t.L3y)]=d[(H6t.J1+e4+b8D+H6t.D2+H6t.y8y)][(w3+y9+P9D+U7f+y8D)];if(a[o6D]===h)a[(f4+d8+u0D+T9y+H6t.D2)]=(i4+L9y+U5y+H6t.c4+T9y+H6t.D2+H6t.X8y+Z0f+y2+R2D+H6t.A1y+f4+J2+H6t.e0f+V8y+H6t.A1y+T9y);setTimeout(function(){var V9y="icke",p2y="ateImage",B9="teF";d(a[(T8f+q2)])[(H6t.J1+X3y+F5y+H6t.D2+H6t.y8y)](d[(H6t.D2+V2+H6t.D2+h7D)]({showOn:"both",dateFormat:a[(w8f+B9+Q8D+d8)],buttonImage:a[(f4+p2y)],buttonImageOnly:true}
,a[(l0+H6t.L3y+H6t.X8y)]));d((p5D+W3y+L9y+f3D+f4+H6t.c4+H6t.L3y+H6t.D2+V8y+V9y+H6t.y8y+f3D+f4+L9y+X3f))[l9f]("display","none");}
,10);}
else a[(w7+L9y+q9D+M2f)][(M0f+H6t.y8y)]((H6t.L3y+y0D+H6t.D2),"date");return a[(T8f+H6t.A1y+V8y+M2f)][0];}
,set:function(a,b){var B3c="cke";d[(f4+H6t.c4+H6t.L3y+X3y+E8+H6t.y8y)]&&a[(w7+L9y+H6t.A1y+J4y)][T2f]((u9y+H6t.X8y+Y9f+H6t.L3y+d5D+B3c+H6t.y8y))?a[(W3+W3y+H6t.L3y)][(w8f+H6t.L3y+H6t.D2+H6+E8+H6t.y8y)]("setDate",b)[a2]():d(a[(w7+r2D+M2f)])[(X3f+i0)](b);}
,enable:function(a){var W2="disa";d[B3f]?a[(w7+d0D+J4y)][(f4+H6t.c4+n3y+H1y+y2+E8+H6t.y8y)]("enable"):d(a[m4D])[(V8y+R0D+V8y)]((W2+H6t.D4+N3y+f4),false);}
,disable:function(a){d[(f4+d8+H6t.D2+V8y+L9y+Q7f+H6t.D2+H6t.y8y)]?a[m4D][B3f]("disable"):d(a[(g5D+m2y+H6t.L3y)])[(V8y+H6t.y8y+b1y+V8y)]("disabled",true);}
,owns:function(a,b){return d(b)[(G0y)]((H0y+X3f+H6t.e0f+W3y+L9y+f3D+f4+H6t.c4+H6t.L3y+d5D+y2+F5y+H6t.D2+H6t.y8y)).length||d(b)[(V8y+H6t.c4+H6t.y8y+C6y+H6t.X8y)]((u1+H6t.e0f+W3y+L9y+f3D+f4+H6t.c4+n3y+H6+E8+H6t.y8y+f3D+D9y+H6t.D2+G2f+H6t.y8y)).length?true:false;}
}
);s[(f4+H6t.c4+H6t.L3y+j6f+U5y+H6t.D2)]=d[(H6t.D2+b0y+n3y+H6t.A1y+f4)](!X3,{}
,p,{create:function(a){var d4="pts",J2D="ker";a[m4D]=d((j2D+L9y+q9D+M2f+S7y))[(H6t.c4+H6t.L3y+w4y)](d[(H6t.D2+b0y+n3y+h7D)](F5D,{id:f[(H6t.X8y+y6+H6t.D2+K1+f4)](a[(L9y+f4)]),type:h0f}
,a[(M0f+H6t.y8y)]));a[(s8f+o5f+J2D)]=new f[(t9+d8+H6t.D2+F6y+U5y+H6t.D2)](a[m4D],d[(H6t.D2+y3+H6t.A1y+f4)]({format:a[(u4+H6t.y8y+C8)],i18n:this[E1y][(f4+H6t.c4+C3D+b0D+H6t.D2)]}
,a[(b1y+d4)]));return a[m4D][X3];}
,set:function(a,b){var m7y="_picker";a[m7y][W1](b);A(a[m4D]);}
,owns:function(a,b){return a[(w7+H1y+y2+E8+H6t.y8y)][(H2+G5D)](b);}
,destroy:function(a){var R8y="destroy",d5y="_pi";a[(d5y+Q7f+J2)][R8y]();}
,minDate:function(a,b){a[(s8f+L9y+y2+F5y+H6t.D2+H6t.y8y)][(S1)](b);}
,maxDate:function(a,b){a[(w7+H1y+y2+E8+H6t.y8y)][(U5y+H6t.c4+b0y)](b);}
}
);s[(W3y+V8y+E9y+a7)]=d[C5y](!X3,{}
,p,{create:function(a){var b=this;return M(b,a,function(c){f[e5y][(W3y+b6y+B8+f4)][(b7f)][(y2+H6t.c4+H6t.z1y+H6t.z1y)](b,a,c[X3]);}
);}
,get:function(a){return a[(w7+X3f+i0)];}
,set:function(a,b){var N6y="upload.editor",H5D="noCl",m0f="clearText",a7D="clearTex",Y0="div.clearValue button",P0f="noFileText",i2D="appen",N7D="ispla";a[(w7+q6f+H6t.z1y)]=b;var c=a[m4D];if(a[(f4+N7D+Q0y)]){var d=c[(Y5f+f4)](v4D);a[(w7+X3f+H6t.c4+H6t.z1y)]?d[(Y0y+H6t.z1y)](a[H8f](a[(z1f+H6t.c4+H6t.z1y)])):d.empty()[(i2D+f4)]((j2D+H6t.X8y+V8y+H6t.c4+H6t.A1y+g4D)+(a[P0f]||"No file")+"</span>");}
d=c[E7D](Y0);if(b&&a[(a7D+H6t.L3y)]){d[V3y](a[m0f]);c[(H6t.y8y+H6t.D2+U5y+d2+H6t.D2+G2D+w0y+H6t.X8y+H6t.X8y)]((H5D+H6t.D2+j8));}
else c[t4f]((F9D+G2D+N3y+j8));a[m4D][(f9y+L9y+h7D)](X0f)[R7y](N6y,[a[(z1f+i0)]]);}
,enable:function(a){var c8D="abled";a[(T8f+i5f+H6t.L3y)][E7D](X0f)[(V8y+p3D)](o3y,K7y);a[(w7+H6t.D2+H6t.A1y+c8D)]=F5D;}
,disable:function(a){var k9y="ena";a[(w7+d0D+V8y+M2f)][E7D](X0f)[(V8y+p3D)]((f4+L9y+H6t.X8y+H6t.c4+H6t.D4+N3y+f4),F5D);a[(w7+k9y+H6t.D4+H6t.z1y+H6t.D2+f4)]=K7y;}
}
);s[(W3y+V8y+E9y+H6t.c4+Z2f+H6t.c4+i1)]=d[(e0y+f4)](!0,{}
,p,{create:function(a){var b=this,c=M(b,a,function(c){var m6="uploadMany";a[I0]=a[I0][(I2f+H6t.A1y+y2+H6t.c4+H6t.L3y)](c);f[(f9y+V8f+s3y+H6t.P8+y0D+H6t.D2+H6t.X8y)][m6][b7f][B5y](b,a,a[I0]);}
);c[t4f]("multi")[(b1y+H6t.A1y)]((y2+H6t.z1y+L9y+y2+F5y),"button.remove",function(c){var O5="lic",i6="opP";c[(H6t.X8y+H6t.L3y+i6+p3D+H6t.c4+W+H6t.L3y+l7)]();c=d(this).data((q8f+b0y));a[(z1f+H6t.c4+H6t.z1y)][(H6t.X8y+V8y+O5+H6t.D2)](c,1);f[e5y][(D9f+E9y+a7+N8+H6t.c4+i1)][(H6t.X8y+H6t.M2)][(F6f+M1y)](b,a,a[I0]);}
);return c;}
,get:function(a){return a[I0];}
,set:function(a,b){var H1D="uplo",l1f="rH",g9y="gge",C4D="pan";b||(b=[]);if(!d[g4](b))throw (u3c+j5f+L2f+y2+b1y+M1y+H6t.D2+y2+H6t.L3y+L9y+w9f+L2f+U5y+Q0+L2f+D9y+H6t.c4+X3f+H6t.D2+L2f+H6t.c4+H6t.A1y+L2f+H6t.c4+D6D+Q9+L2f+H6t.c4+H6t.X8y+L2f+H6t.c4+L2f+X3f+H6t.c4+l7f+H6t.D2);a[I0]=b;var c=this,e=a[m4D];if(a[(f4+A7D+V8y+H6t.z1y+H6t.c4+Q0y)]){e=e[E7D]("div.rendered").empty();if(b.length){var f=d((j2D+W3y+H6t.z1y+M7D))[W9f](e);d[J9D](b,function(b,d){var e3f='ove',s5D="clas";f[(S1D)]((j2D+H6t.z1y+L9y+g4D)+a[(f4+A7D+t0y+Q0y)](d,b)+' <button class="'+c[(s5D+H6t.X8y+H6t.D2+H6t.X8y)][i0D][(V1D+H6t.L3y+H6t.L3y+b1y+H6t.A1y)]+(E4D+W7f+L4y+f7y+e3f+n8f+W2y+K2y+c0f+K2y+o8+P0y+W2y+i4f+U4D)+b+'">&times;</button></li>');}
);}
else e[S1D]((j2D+H6t.X8y+C4D+g4D)+(a[(F9D+e8+N3y+a4f+H6t.L3y)]||(h8+b1y+L2f+f9y+L9y+H6t.z1y+H6t.D2+H6t.X8y))+"</span>");}
a[(w7+r2D+W3y+H6t.L3y)][E7D]("input")[(H6t.L3y+u1D+g9y+l1f+Y+f4+N3y+H6t.y8y)]((H1D+H6t.c4+f4+H6t.e0f+H6t.D2+H0y+H6t.L3y+h4),[a[(I0)]]);}
,enable:function(a){var P7D="_en",H5y="led";a[m4D][(Y5f+f4)]("input")[X9y]((H0y+H6t.X8y+K2+H5y),false);a[(P7D+H6t.c4+H6t.r9+f4)]=true;}
,disable:function(a){var X6="enab";a[m4D][E7D]((d0D+J4y))[(X9y)]((H0y+H6t.X8y+K2+H6t.z1y+H6t.D2+f4),true);a[(w7+X6+H6t.z1y+M7)]=false;}
}
);r[(H6t.D2+b0y+H6t.L3y)][A5y]&&d[(G0f+R5y)](f[e5y],r[(G0f)][(H6t.D2+X6y+H6t.y8y+y9+V8f+s3y+H6t.X8y)]);r[(H6t.D2+b0y+H6t.L3y)][A5y]=f[e5y];f[(f9y+k8f+H6t.D2+H6t.X8y)]={}
;f.prototype.CLASS=(C2+H6t.L3y+b1y+H6t.y8y);f[(K7f+H6t.y8y+j3f)]=(U1D+H6t.e0f+B6D+H6t.e0f+Y7D);return f;}
);

/*! Bootstrap integration for DataTables' Editor
 * ©2015 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net-bs', 'datatables.net-editor'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net-bs')(root, $).$;
			}

			if ( ! $.fn.dataTable.Editor ) {
				require('datatables.net-editor')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/*
 * Set the default display controller to be our bootstrap control 
 */
DataTable.Editor.defaults.display = "bootstrap";


/*
 * Alter the buttons that Editor adds to TableTools so they are suitable for bootstrap
 */
var i18nDefaults = DataTable.Editor.defaults.i18n;
i18nDefaults.create.title = "<h3>"+i18nDefaults.create.title+"</h3>";
i18nDefaults.edit.title = "<h3>"+i18nDefaults.edit.title+"</h3>";
i18nDefaults.remove.title = "<h3>"+i18nDefaults.remove.title+"</h3>";

var tt = DataTable.TableTools;
if ( tt ) {
	tt.BUTTONS.editor_create.formButtons[0].className = "btn btn-primary";
	tt.BUTTONS.editor_edit.formButtons[0].className = "btn btn-primary";
	tt.BUTTONS.editor_remove.formButtons[0].className = "btn btn-danger";
}


/*
 * Change the default classes from Editor to be classes for Bootstrap
 */
$.extend( true, $.fn.dataTable.Editor.classes, {
	"header": {
		"wrapper": "DTE_Header modal-header"
	},
	"body": {
		"wrapper": "DTE_Body modal-body"
	},
	"footer": {
		"wrapper": "DTE_Footer modal-footer"
	},
	"form": {
		"tag": "form-horizontal",
		"button": "btn btn-default"
	},
	"field": {
		"wrapper": "DTE_Field",
		"label":   "col-lg-4 control-label",
		"input":   "col-lg-8 controls",
		"error":   "error has-error",
		"msg-labelInfo": "help-block",
		"msg-info":      "help-block",
		"msg-message":   "help-block",
		"msg-error":     "help-block",
		"multiValue":    "well well-sm multi-value",
		"multiInfo":     "small",
		"multiRestore":  "well well-sm multi-restore"
	}
} );


/*
 * Bootstrap display controller - this is effectively a proxy to the Bootstrap
 * modal control.
 */

var self;

DataTable.Editor.display.bootstrap = $.extend( true, {}, DataTable.Editor.models.displayController, {
	/*
	 * API methods
	 */
	"init": function ( dte ) {
		// init can be called multiple times (one for each Editor instance), but
		// we only support a single construct here (shared between all Editor
		// instances)
		if ( ! self._dom.content ) {
			self._dom.content = $(
				'<div class="modal fade">'+
					'<div class="modal-dialog">'+
						'<div class="modal-content"/>'+
					'</div>'+
				'</div>'
			);

			self._dom.close = $('<button class="close">&times;</div>');

			self._dom.close.click( function () {
				self._dte.close('icon');
			} );

			$(document).on('click', 'div.modal', function (e) {
				if ( $(e.target).hasClass('modal') && self._shown ) {
					self._dte.background();
				}
			} );

			dte.on( 'open.dtebs', function ( e, type ) {
				if ( type === 'inline' || type === 'bubble' ) {
					$('div.DTE input[type=text], div.DTE select, div.DTE textarea').addClass( 'form-control' );
				}
			} );
		}

		return self;
	},

	"open": function ( dte, append, callback ) {
		if ( self._shown ) {
			if ( callback ) {
				callback();
			}
			return;
		}

		self._dte = dte;
		self._shown = true;

		var content = self._dom.content.find('div.modal-content');
		content.children().detach();
		content.append( append );

		$('div.modal-header', append).prepend( self._dom.close );

		$(self._dom.content)
			.one('shown.bs.modal', function () {
				// Can only give elements focus when shown
				if ( self._dte.s.setFocus ) {
					self._dte.s.setFocus.focus();
				}

				if ( callback ) {
					callback();
				}
			})
			.one('hidden', function () {
				self._shown = false;
			})
			.appendTo( 'body' )
			.modal( {
				backdrop: "static",
				keyboard: false
			} );

		$('input:not([type=checkbox]):not([type=radio]), select, textarea', self._dom.content)
			.addClass( 'form-control' );
	},

	"close": function ( dte, callback ) {
		if ( !self._shown ) {
			if ( callback ) {
				callback();
			}
			return;
		}

		$(self._dom.content)
			.one( 'hidden.bs.modal', function () {
				$(this).detach();
			} )
			.modal('hide');

		self._dte = dte;
		self._shown = false;

		if ( callback ) {
			callback();
		}
	},

	node: function ( dte ) {
		return self._dom.content[0];
	},


	/*
	 * Private properties
	 */
	 "_shown": false,
	"_dte": null,
	"_dom": {}
} );

self = DataTable.Editor.display.bootstrap;


return DataTable.Editor;
}));


/*! FixedHeader 3.1.2
 * ©2009-2016 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     FixedHeader
 * @description Fix a table's header or footer, so it is always visible while
 *              scrolling
 * @version     3.1.2
 * @file        dataTables.fixedHeader.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2009-2016 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


var _instCounter = 0;

var FixedHeader = function ( dt, config ) {
	// Sanity check - you just know it will happen
	if ( ! (this instanceof FixedHeader) ) {
		throw "FixedHeader must be initialised with the 'new' keyword.";
	}

	// Allow a boolean true for defaults
	if ( config === true ) {
		config = {};
	}

	dt = new DataTable.Api( dt );

	this.c = $.extend( true, {}, FixedHeader.defaults, config );

	this.s = {
		dt: dt,
		position: {
			theadTop: 0,
			tbodyTop: 0,
			tfootTop: 0,
			tfootBottom: 0,
			width: 0,
			left: 0,
			tfootHeight: 0,
			theadHeight: 0,
			windowHeight: $(window).height(),
			visible: true
		},
		headerMode: null,
		footerMode: null,
		autoWidth: dt.settings()[0].oFeatures.bAutoWidth,
		namespace: '.dtfc'+(_instCounter++),
		scrollLeft: {
			header: -1,
			footer: -1
		},
		enable: true
	};

	this.dom = {
		floatingHeader: null,
		thead: $(dt.table().header()),
		tbody: $(dt.table().body()),
		tfoot: $(dt.table().footer()),
		header: {
			host: null,
			floating: null,
			placeholder: null
		},
		footer: {
			host: null,
			floating: null,
			placeholder: null
		}
	};

	this.dom.header.host = this.dom.thead.parent();
	this.dom.footer.host = this.dom.tfoot.parent();

	var dtSettings = dt.settings()[0];
	if ( dtSettings._fixedHeader ) {
		throw "FixedHeader already initialised on table "+dtSettings.nTable.id;
	}

	dtSettings._fixedHeader = this;

	this._constructor();
};


/*
 * Variable: FixedHeader
 * Purpose:  Prototype for FixedHeader
 * Scope:    global
 */
$.extend( FixedHeader.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * API methods
	 */
	
	/**
	 * Enable / disable the fixed elements
	 *
	 * @param  {boolean} enable `true` to enable, `false` to disable
	 */
	enable: function ( enable )
	{
		this.s.enable = enable;

		if ( this.c.header ) {
			this._modeChange( 'in-place', 'header', true );
		}

		if ( this.c.footer && this.dom.tfoot.length ) {
			this._modeChange( 'in-place', 'footer', true );
		}

		this.update();
	},
	
	/**
	 * Set header offset 
	 *
	 * @param  {int} new value for headerOffset
	 */
	headerOffset: function ( offset )
	{
		if ( offset !== undefined ) {
			this.c.headerOffset = offset;
			this.update();
		}

		return this.c.headerOffset;
	},
	
	/**
	 * Set footer offset
	 *
	 * @param  {int} new value for footerOffset
	 */
	footerOffset: function ( offset )
	{
		if ( offset !== undefined ) {
			this.c.footerOffset = offset;
			this.update();
		}

		return this.c.footerOffset;
	},

	
	/**
	 * Recalculate the position of the fixed elements and force them into place
	 */
	update: function ()
	{
		this._positions();
		this._scroll( true );
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */
	
	/**
	 * FixedHeader constructor - adding the required event listeners and
	 * simple initialisation
	 *
	 * @private
	 */
	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;

		$(window)
			.on( 'scroll'+this.s.namespace, function () {
				that._scroll();
			} )
			.on( 'resize'+this.s.namespace, function () {
				that.s.position.windowHeight = $(window).height();
				that.update();
			} );

		var autoHeader = $('.fh-fixedHeader');
		if ( ! this.c.headerOffset && autoHeader.length ) {
			this.c.headerOffset = autoHeader.outerHeight();
		}

		var autoFooter = $('.fh-fixedFooter');
		if ( ! this.c.footerOffset && autoFooter.length ) {
			this.c.footerOffset = autoFooter.outerHeight();
		}

		dt.on( 'column-reorder.dt.dtfc column-visibility.dt.dtfc draw.dt.dtfc column-sizing.dt.dtfc', function () {
			that.update();
		} );

		dt.on( 'destroy.dtfc', function () {
			dt.off( '.dtfc' );
			$(window).off( that.s.namespace );
		} );

		this._positions();
		this._scroll();
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Clone a fixed item to act as a place holder for the original element
	 * which is moved into a clone of the table element, and moved around the
	 * document to give the fixed effect.
	 *
	 * @param  {string}  item  'header' or 'footer'
	 * @param  {boolean} force Force the clone to happen, or allow automatic
	 *   decision (reuse existing if available)
	 * @private
	 */
	_clone: function ( item, force )
	{
		var dt = this.s.dt;
		var itemDom = this.dom[ item ];
		var itemElement = item === 'header' ?
			this.dom.thead :
			this.dom.tfoot;

		if ( ! force && itemDom.floating ) {
			// existing floating element - reuse it
			itemDom.floating.removeClass( 'fixedHeader-floating fixedHeader-locked' );
		}
		else {
			if ( itemDom.floating ) {
				itemDom.placeholder.remove();
				this._unsize( item );
				itemDom.floating.children().detach();
				itemDom.floating.remove();
			}

			itemDom.floating = $( dt.table().node().cloneNode( false ) )
				.css( 'table-layout', 'fixed' )
				.removeAttr( 'id' )
				.append( itemElement )
				.appendTo( 'body' );

			// Insert a fake thead/tfoot into the DataTable to stop it jumping around
			itemDom.placeholder = itemElement.clone( false );
			itemDom.host.prepend( itemDom.placeholder );

			// Clone widths
			this._matchWidths( itemDom.placeholder, itemDom.floating );
		}
	},

	/**
	 * Copy widths from the cells in one element to another. This is required
	 * for the footer as the footer in the main table takes its sizes from the
	 * header columns. That isn't present in the footer so to have it still
	 * align correctly, the sizes need to be copied over. It is also required
	 * for the header when auto width is not enabled
	 *
	 * @param  {jQuery} from Copy widths from
	 * @param  {jQuery} to   Copy widths to
	 * @private
	 */
	_matchWidths: function ( from, to ) {
		var get = function ( name ) {
			return $(name, from)
				.map( function () {
					return $(this).width();
				} ).toArray();
		};

		var set = function ( name, toWidths ) {
			$(name, to).each( function ( i ) {
				$(this).css( {
					width: toWidths[i],
					minWidth: toWidths[i]
				} );
			} );
		};

		var thWidths = get( 'th' );
		var tdWidths = get( 'td' );

		set( 'th', thWidths );
		set( 'td', tdWidths );
	},

	/**
	 * Remove assigned widths from the cells in an element. This is required
	 * when inserting the footer back into the main table so the size is defined
	 * by the header columns and also when auto width is disabled in the
	 * DataTable.
	 *
	 * @param  {string} item The `header` or `footer`
	 * @private
	 */
	_unsize: function ( item ) {
		var el = this.dom[ item ].floating;

		if ( el && (item === 'footer' || (item === 'header' && ! this.s.autoWidth)) ) {
			$('th, td', el).css( {
				width: '',
				minWidth: ''
			} );
		}
		else if ( el && item === 'header' ) {
			$('th, td', el).css( 'min-width', '' );
		}
	},

	/**
	 * Reposition the floating elements to take account of horizontal page
	 * scroll
	 *
	 * @param  {string} item       The `header` or `footer`
	 * @param  {int}    scrollLeft Document scrollLeft
	 * @private
	 */
	_horizontal: function ( item, scrollLeft )
	{
		var itemDom = this.dom[ item ];
		var position = this.s.position;
		var lastScrollLeft = this.s.scrollLeft;

		if ( itemDom.floating && lastScrollLeft[ item ] !== scrollLeft ) {
			itemDom.floating.css( 'left', position.left - scrollLeft );

			lastScrollLeft[ item ] = scrollLeft;
		}
	},

	/**
	 * Change from one display mode to another. Each fixed item can be in one
	 * of:
	 *
	 * * `in-place` - In the main DataTable
	 * * `in` - Floating over the DataTable
	 * * `below` - (Header only) Fixed to the bottom of the table body
	 * * `above` - (Footer only) Fixed to the top of the table body
	 * 
	 * @param  {string}  mode        Mode that the item should be shown in
	 * @param  {string}  item        'header' or 'footer'
	 * @param  {boolean} forceChange Force a redraw of the mode, even if already
	 *     in that mode.
	 * @private
	 */
	_modeChange: function ( mode, item, forceChange )
	{
		var dt = this.s.dt;
		var itemDom = this.dom[ item ];
		var position = this.s.position;

		// Record focus. Browser's will cause input elements to loose focus if
		// they are inserted else where in the doc
		var tablePart = this.dom[ item==='footer' ? 'tfoot' : 'thead' ];
		var focus = $.contains( tablePart[0], document.activeElement ) ?
			document.activeElement :
			null;

		if ( mode === 'in-place' ) {
			// Insert the header back into the table's real header
			if ( itemDom.placeholder ) {
				itemDom.placeholder.remove();
				itemDom.placeholder = null;
			}

			this._unsize( item );

			if ( item === 'header' ) {
				itemDom.host.prepend( this.dom.thead );
			}
			else {
				itemDom.host.append( this.dom.tfoot );
			}

			if ( itemDom.floating ) {
				itemDom.floating.remove();
				itemDom.floating = null;
			}
		}
		else if ( mode === 'in' ) {
			// Remove the header from the read header and insert into a fixed
			// positioned floating table clone
			this._clone( item, forceChange );

			itemDom.floating
				.addClass( 'fixedHeader-floating' )
				.css( item === 'header' ? 'top' : 'bottom', this.c[item+'Offset'] )
				.css( 'left', position.left+'px' )
				.css( 'width', position.width+'px' );

			if ( item === 'footer' ) {
				itemDom.floating.css( 'top', '' );
			}
		}
		else if ( mode === 'below' ) { // only used for the header
			// Fix the position of the floating header at base of the table body
			this._clone( item, forceChange );

			itemDom.floating
				.addClass( 'fixedHeader-locked' )
				.css( 'top', position.tfootTop - position.theadHeight )
				.css( 'left', position.left+'px' )
				.css( 'width', position.width+'px' );
		}
		else if ( mode === 'above' ) { // only used for the footer
			// Fix the position of the floating footer at top of the table body
			this._clone( item, forceChange );

			itemDom.floating
				.addClass( 'fixedHeader-locked' )
				.css( 'top', position.tbodyTop )
				.css( 'left', position.left+'px' )
				.css( 'width', position.width+'px' );
		}

		// Restore focus if it was lost
		if ( focus && focus !== document.activeElement ) {
			focus.focus();
		}

		this.s.scrollLeft.header = -1;
		this.s.scrollLeft.footer = -1;
		this.s[item+'Mode'] = mode;
	},

	/**
	 * Cache the positional information that is required for the mode
	 * calculations that FixedHeader performs.
	 *
	 * @private
	 */
	_positions: function ()
	{
		var dt = this.s.dt;
		var table = dt.table();
		var position = this.s.position;
		var dom = this.dom;
		var tableNode = $(table.node());

		// Need to use the header and footer that are in the main table,
		// regardless of if they are clones, since they hold the positions we
		// want to measure from
		var thead = tableNode.children('thead');
		var tfoot = tableNode.children('tfoot');
		var tbody = dom.tbody;

		position.visible = tableNode.is(':visible');
		position.width = tableNode.outerWidth();
		position.left = tableNode.offset().left;
		position.theadTop = thead.offset().top;
		position.tbodyTop = tbody.offset().top;
		position.theadHeight = position.tbodyTop - position.theadTop;

		if ( tfoot.length ) {
			position.tfootTop = tfoot.offset().top;
			position.tfootBottom = position.tfootTop + tfoot.outerHeight();
			position.tfootHeight = position.tfootBottom - position.tfootTop;
		}
		else {
			position.tfootTop = position.tbodyTop + tbody.outerHeight();
			position.tfootBottom = position.tfootTop;
			position.tfootHeight = position.tfootTop;
		}
	},


	/**
	 * Mode calculation - determine what mode the fixed items should be placed
	 * into.
	 *
	 * @param  {boolean} forceChange Force a redraw of the mode, even if already
	 *     in that mode.
	 * @private
	 */
	_scroll: function ( forceChange )
	{
		var windowTop = $(document).scrollTop();
		var windowLeft = $(document).scrollLeft();
		var position = this.s.position;
		var headerMode, footerMode;

		if ( ! this.s.enable ) {
			return;
		}

		if ( this.c.header ) {
			if ( ! position.visible || windowTop <= position.theadTop - this.c.headerOffset ) {
				headerMode = 'in-place';
			}
			else if ( windowTop <= position.tfootTop - position.theadHeight - this.c.headerOffset ) {
				headerMode = 'in';
			}
			else {
				headerMode = 'below';
			}

			if ( forceChange || headerMode !== this.s.headerMode ) {
				this._modeChange( headerMode, 'header', forceChange );
			}

			this._horizontal( 'header', windowLeft );
		}

		if ( this.c.footer && this.dom.tfoot.length ) {
			if ( ! position.visible || windowTop + position.windowHeight >= position.tfootBottom + this.c.footerOffset ) {
				footerMode = 'in-place';
			}
			else if ( position.windowHeight + windowTop > position.tbodyTop + position.tfootHeight + this.c.footerOffset ) {
				footerMode = 'in';
			}
			else {
				footerMode = 'above';
			}

			if ( forceChange || footerMode !== this.s.footerMode ) {
				this._modeChange( footerMode, 'footer', forceChange );
			}

			this._horizontal( 'footer', windowLeft );
		}
	}
} );


/**
 * Version
 * @type {String}
 * @static
 */
FixedHeader.version = "3.1.2";

/**
 * Defaults
 * @type {Object}
 * @static
 */
FixedHeader.defaults = {
	header: true,
	footer: false,
	headerOffset: 0,
	footerOffset: 0
};


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables interfaces
 */

// Attach for constructor access
$.fn.dataTable.FixedHeader = FixedHeader;
$.fn.DataTable.FixedHeader = FixedHeader;


// DataTables creation - check if the FixedHeader option has been defined on the
// table and if so, initialise
$(document).on( 'init.dt.dtfh', function (e, settings, json) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var init = settings.oInit.fixedHeader;
	var defaults = DataTable.defaults.fixedHeader;

	if ( (init || defaults) && ! settings._fixedHeader ) {
		var opts = $.extend( {}, defaults, init );

		if ( init !== false ) {
			new FixedHeader( settings, opts );
		}
	}
} );

// DataTables API methods
DataTable.Api.register( 'fixedHeader()', function () {} );

DataTable.Api.register( 'fixedHeader.adjust()', function () {
	return this.iterator( 'table', function ( ctx ) {
		var fh = ctx._fixedHeader;

		if ( fh ) {
			fh.update();
		}
	} );
} );

DataTable.Api.register( 'fixedHeader.enable()', function ( flag ) {
	return this.iterator( 'table', function ( ctx ) {
		var fh = ctx._fixedHeader;

		if ( fh ) {
			fh.enable( flag !== undefined ? flag : true );
		}
	} );
} );

DataTable.Api.register( 'fixedHeader.disable()', function ( ) {
	return this.iterator( 'table', function ( ctx ) {
		var fh = ctx._fixedHeader;

		if ( fh ) {
			fh.enable( false );
		}
	} );
} );

$.each( ['header', 'footer'], function ( i, el ) {
	DataTable.Api.register( 'fixedHeader.'+el+'Offset()', function ( offset ) {
		var ctx = this.context;

		if ( offset === undefined ) {
			return ctx.length && ctx[0]._fixedHeader ?
				ctx[0]._fixedHeader[el +'Offset']() :
				undefined;
		}

		return this.iterator( 'table', function ( ctx ) {
			var fh = ctx._fixedHeader;

			if ( fh ) {
				fh[ el +'Offset' ]( offset );
			}
		} );
	} );
} );


return FixedHeader;
}));


/*! Select for DataTables 1.2.0
 * 2015-2016 SpryMedia Ltd - datatables.net/license/mit
 */

/**
 * @summary     Select for DataTables
 * @description A collection of API methods, events and buttons for DataTables
 *   that provides selection options of the items in a DataTable
 * @version     1.2.0
 * @file        dataTables.select.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     datatables.net/forums
 * @copyright   Copyright 2015-2016 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net/extensions/select
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


// Version information for debugger
DataTable.select = {};

DataTable.select.version = '1.2.0';

DataTable.select.init = function ( dt ) {
	var ctx = dt.settings()[0];
	var init = ctx.oInit.select;
	var defaults = DataTable.defaults.select;
	var opts = init === undefined ?
		defaults :
		init;

	// Set defaults
	var items = 'row';
	var style = 'api';
	var blurable = false;
	var info = true;
	var selector = 'td, th';
	var className = 'selected';

	ctx._select = {};

	// Initialisation customisations
	if ( opts === true ) {
		style = 'os';
	}
	else if ( typeof opts === 'string' ) {
		style = opts;
	}
	else if ( $.isPlainObject( opts ) ) {
		if ( opts.blurable !== undefined ) {
			blurable = opts.blurable;
		}

		if ( opts.info !== undefined ) {
			info = opts.info;
		}

		if ( opts.items !== undefined ) {
			items = opts.items;
		}

		if ( opts.style !== undefined ) {
			style = opts.style;
		}

		if ( opts.selector !== undefined ) {
			selector = opts.selector;
		}

		if ( opts.className !== undefined ) {
			className = opts.className;
		}
	}

	dt.select.selector( selector );
	dt.select.items( items );
	dt.select.style( style );
	dt.select.blurable( blurable );
	dt.select.info( info );
	ctx._select.className = className;


	// Sort table based on selected rows. Requires Select Datatables extension
	$.fn.dataTable.ext.order['select-checkbox'] = function ( settings, col ) {
		return this.api().column( col, {order: 'index'} ).nodes().map( function ( td ) {
			if ( settings._select.items === 'row' ) {
				return $( td ).parent().hasClass( settings._select.className );
			} else if ( settings._select.items === 'cell' ) {
				return $( td ).hasClass( settings._select.className );
			}
			return false;
		});
	};

	// If the init options haven't enabled select, but there is a selectable
	// class name, then enable
	if ( $( dt.table().node() ).hasClass( 'selectable' ) ) {
		dt.select.style( 'os' );
	}
};

/*

Select is a collection of API methods, event handlers, event emitters and
buttons (for the `Buttons` extension) for DataTables. It provides the following
features, with an overview of how they are implemented:

## Selection of rows, columns and cells. Whether an item is selected or not is
   stored in:

* rows: a `_select_selected` property which contains a boolean value of the
  DataTables' `aoData` object for each row
* columns: a `_select_selected` property which contains a boolean value of the
  DataTables' `aoColumns` object for each column
* cells: a `_selected_cells` property which contains an array of boolean values
  of the `aoData` object for each row. The array is the same length as the
  columns array, with each element of it representing a cell.

This method of using boolean flags allows Select to operate when nodes have not
been created for rows / cells (DataTables' defer rendering feature).

## API methods

A range of API methods are available for triggering selection and de-selection
of rows. Methods are also available to configure the selection events that can
be triggered by an end user (such as which items are to be selected). To a large
extent, these of API methods *is* Select. It is basically a collection of helper
functions that can be used to select items in a DataTable.

Configuration of select is held in the object `_select` which is attached to the
DataTables settings object on initialisation. Select being available on a table
is not optional when Select is loaded, but its default is for selection only to
be available via the API - so the end user wouldn't be able to select rows
without additional configuration.

The `_select` object contains the following properties:

```
{
	items:string     - Can be `rows`, `columns` or `cells`. Defines what item 
	                   will be selected if the user is allowed to activate row
	                   selection using the mouse.
	style:string     - Can be `none`, `single`, `multi` or `os`. Defines the
	                   interaction style when selecting items
	blurable:boolean - If row selection can be cleared by clicking outside of
	                   the table
	info:boolean     - If the selection summary should be shown in the table
	                   information elements
}
```

In addition to the API methods, Select also extends the DataTables selector
options for rows, columns and cells adding a `selected` option to the selector
options object, allowing the developer to select only selected items or
unselected items.

## Mouse selection of items

Clicking on items can be used to select items. This is done by a simple event
handler that will select the items using the API methods.

 */


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Local functions
 */

/**
 * Add one or more cells to the selection when shift clicking in OS selection
 * style cell selection.
 *
 * Cell range is more complicated than row and column as we want to select
 * in the visible grid rather than by index in sequence. For example, if you
 * click first in cell 1-1 and then shift click in 2-2 - cells 1-2 and 2-1
 * should also be selected (and not 1-3, 1-4. etc)
 * 
 * @param  {DataTable.Api} dt   DataTable
 * @param  {object}        idx  Cell index to select to
 * @param  {object}        last Cell index to select from
 * @private
 */
function cellRange( dt, idx, last )
{
	var indexes;
	var columnIndexes;
	var rowIndexes;
	var selectColumns = function ( start, end ) {
		if ( start > end ) {
			var tmp = end;
			end = start;
			start = tmp;
		}
		
		var record = false;
		return dt.columns( ':visible' ).indexes().filter( function (i) {
			if ( i === start ) {
				record = true;
			}
			
			if ( i === end ) { // not else if, as start might === end
				record = false;
				return true;
			}

			return record;
		} );
	};

	var selectRows = function ( start, end ) {
		var indexes = dt.rows( { search: 'applied' } ).indexes();

		// Which comes first - might need to swap
		if ( indexes.indexOf( start ) > indexes.indexOf( end ) ) {
			var tmp = end;
			end = start;
			start = tmp;
		}

		var record = false;
		return indexes.filter( function (i) {
			if ( i === start ) {
				record = true;
			}
			
			if ( i === end ) {
				record = false;
				return true;
			}

			return record;
		} );
	};

	if ( ! dt.cells( { selected: true } ).any() && ! last ) {
		// select from the top left cell to this one
		columnIndexes = selectColumns( 0, idx.column );
		rowIndexes = selectRows( 0 , idx.row );
	}
	else {
		// Get column indexes between old and new
		columnIndexes = selectColumns( last.column, idx.column );
		rowIndexes = selectRows( last.row , idx.row );
	}

	indexes = dt.cells( rowIndexes, columnIndexes ).flatten();

	if ( ! dt.cells( idx, { selected: true } ).any() ) {
		// Select range
		dt.cells( indexes ).select();
	}
	else {
		// Deselect range
		dt.cells( indexes ).deselect();
	}
}

/**
 * Disable mouse selection by removing the selectors
 *
 * @param {DataTable.Api} dt DataTable to remove events from
 * @private
 */
function disableMouseSelection( dt )
{
	var ctx = dt.settings()[0];
	var selector = ctx._select.selector;

	$( dt.table().body() )
		.off( 'mousedown.dtSelect', selector )
		.off( 'mouseup.dtSelect', selector )
		.off( 'click.dtSelect', selector );

	$('body').off( 'click.dtSelect' );
}

/**
 * Attach mouse listeners to the table to allow mouse selection of items
 *
 * @param {DataTable.Api} dt DataTable to remove events from
 * @private
 */
function enableMouseSelection ( dt )
{
	var body = $( dt.table().body() );
	var ctx = dt.settings()[0];
	var selector = ctx._select.selector;

	body
		.on( 'mousedown.dtSelect', selector, function(e) {
			// Disallow text selection for shift clicking on the table so multi
			// element selection doesn't look terrible!
			if ( e.shiftKey || e.metaKey || e.ctrlKey ) {
				body
					.css( '-moz-user-select', 'none' )
					.one('selectstart.dtSelect', selector, function () {
						return false;
					} );
			}
		} )
		.on( 'mouseup.dtSelect', selector, function() {
			// Allow text selection to occur again, Mozilla style (tested in FF
			// 35.0.1 - still required)
			body.css( '-moz-user-select', '' );
		} )
		.on( 'click.dtSelect', selector, function ( e ) {
			var items = dt.select.items();
			var idx;

			// If text was selected (click and drag), then we shouldn't change
			// the row's selected state
			if ( window.getSelection && window.getSelection().toString() ) {
				return;
			}

			var ctx = dt.settings()[0];

			// Ignore clicks inside a sub-table
			if ( $(e.target).closest('div.dataTables_wrapper')[0] != dt.table().container() ) {
				return;
			}

			var cell = dt.cell( $(e.target).closest('td, th') );

			// Check the cell actually belongs to the host DataTable (so child
			// rows, etc, are ignored)
			if ( ! cell.any() ) {
				return;
			}

			var event = $.Event('user-select.dt');
			eventTrigger( dt, event, [ items, cell, e ] );

			if ( event.isDefaultPrevented() ) {
				return;
			}

			var cellIndex = cell.index();
			if ( items === 'row' ) {
				idx = cellIndex.row;
				typeSelect( e, dt, ctx, 'row', idx );
			}
			else if ( items === 'column' ) {
				idx = cell.index().column;
				typeSelect( e, dt, ctx, 'column', idx );
			}
			else if ( items === 'cell' ) {
				idx = cell.index();
				typeSelect( e, dt, ctx, 'cell', idx );
			}

			ctx._select_lastCell = cellIndex;
		} );

	// Blurable
	$('body').on( 'click.dtSelect', function ( e ) {
		if ( ctx._select.blurable ) {
			// If the click was inside the DataTables container, don't blur
			if ( $(e.target).parents().filter( dt.table().container() ).length ) {
				return;
			}

			// Don't blur in Editor form
			if ( $(e.target).parents('div.DTE').length ) {
				return;
			}

			clear( ctx, true );
		}
	} );
}

/**
 * Trigger an event on a DataTable
 *
 * @param {DataTable.Api} api      DataTable to trigger events on
 * @param  {boolean}      selected true if selected, false if deselected
 * @param  {string}       type     Item type acting on
 * @param  {boolean}      any      Require that there are values before
 *     triggering
 * @private
 */
function eventTrigger ( api, type, args, any )
{
	if ( any && ! api.flatten().length ) {
		return;
	}

	if ( typeof type === 'string' ) {
		type = type +'.dt';
	}

	args.unshift( api );

	$(api.table().node()).triggerHandler( type, args );
}

/**
 * Update the information element of the DataTable showing information about the
 * items selected. This is done by adding tags to the existing text
 * 
 * @param {DataTable.Api} api DataTable to update
 * @private
 */
function info ( api )
{
	var ctx = api.settings()[0];

	if ( ! ctx._select.info || ! ctx.aanFeatures.i ) {
		return;
	}

	var output  = $('<span class="select-info"/>');
	var add = function ( name, num ) {
		output.append( $('<span class="select-item"/>').append( api.i18n(
			'select.'+name+'s',
			{ _: '%d '+name+'s selected', 0: '', 1: '1 '+name+' selected' },
			num
		) ) );
	};

	add( 'row',    api.rows( { selected: true } ).flatten().length );
	add( 'column', api.columns( { selected: true } ).flatten().length );
	add( 'cell',   api.cells( { selected: true } ).flatten().length );

	// Internal knowledge of DataTables to loop over all information elements
	$.each( ctx.aanFeatures.i, function ( i, el ) {
		el = $(el);

		var exisiting = el.children('span.select-info');
		if ( exisiting.length ) {
			exisiting.remove();
		}

		if ( output.text() !== '' ) {
			el.append( output );
		}
	} );
}

/**
 * Initialisation of a new table. Attach event handlers and callbacks to allow
 * Select to operate correctly.
 *
 * This will occur _after_ the initial DataTables initialisation, although
 * before Ajax data is rendered, if there is ajax data
 *
 * @param  {DataTable.settings} ctx Settings object to operate on
 * @private
 */
function init ( ctx ) {
	var api = new DataTable.Api( ctx );

	// Row callback so that classes can be added to rows and cells if the item
	// was selected before the element was created. This will happen with the
	// `deferRender` option enabled.
	// 
	// This method of attaching to `aoRowCreatedCallback` is a hack until
	// DataTables has proper events for row manipulation If you are reviewing
	// this code to create your own plug-ins, please do not do this!
	ctx.aoRowCreatedCallback.push( {
		fn: function ( row, data, index ) {
			var i, ien;
			var d = ctx.aoData[ index ];

			// Row
			if ( d._select_selected ) {
				$( row ).addClass( ctx._select.className );
			}

			// Cells and columns - if separated out, we would need to do two
			// loops, so it makes sense to combine them into a single one
			for ( i=0, ien=ctx.aoColumns.length ; i<ien ; i++ ) {
				if ( ctx.aoColumns[i]._select_selected || (d._selected_cells && d._selected_cells[i]) ) {
					$(d.anCells[i]).addClass( ctx._select.className );
				}
			}
		},
		sName: 'select-deferRender'
	} );

	// On Ajax reload we want to reselect all rows which are currently selected,
	// if there is an rowId (i.e. a unique value to identify each row with)
	api.on( 'preXhr.dt.dtSelect', function () {
		// note that column selection doesn't need to be cached and then
		// reselected, as they are already selected
		var rows = api.rows( { selected: true } ).ids( true ).filter( function ( d ) {
			return d !== undefined;
		} );

		var cells = api.cells( { selected: true } ).eq(0).map( function ( cellIdx ) {
			var id = api.row( cellIdx.row ).id( true );
			return id ?
				{ row: id, column: cellIdx.column } :
				undefined;
		} ).filter( function ( d ) {
			return d !== undefined;
		} );

		// On the next draw, reselect the currently selected items
		api.one( 'draw.dt.dtSelect', function () {
			api.rows( rows ).select();

			// `cells` is not a cell index selector, so it needs a loop
			if ( cells.any() ) {
				cells.each( function ( id ) {
					api.cells( id.row, id.column ).select();
				} );
			}
		} );
	} );

	// Update the table information element with selected item summary
	api.on( 'draw.dtSelect.dt select.dtSelect.dt deselect.dtSelect.dt info.dt', function () {
		info( api );
	} );

	// Clean up and release
	api.on( 'destroy.dtSelect', function () {
		disableMouseSelection( api );
		api.off( '.dtSelect' );
	} );
}

/**
 * Add one or more items (rows or columns) to the selection when shift clicking
 * in OS selection style
 *
 * @param  {DataTable.Api} dt   DataTable
 * @param  {string}        type Row or column range selector
 * @param  {object}        idx  Item index to select to
 * @param  {object}        last Item index to select from
 * @private
 */
function rowColumnRange( dt, type, idx, last )
{
	// Add a range of rows from the last selected row to this one
	var indexes = dt[type+'s']( { search: 'applied' } ).indexes();
	var idx1 = $.inArray( last, indexes );
	var idx2 = $.inArray( idx, indexes );

	if ( ! dt[type+'s']( { selected: true } ).any() && idx1 === -1 ) {
		// select from top to here - slightly odd, but both Windows and Mac OS
		// do this
		indexes.splice( $.inArray( idx, indexes )+1, indexes.length );
	}
	else {
		// reverse so we can shift click 'up' as well as down
		if ( idx1 > idx2 ) {
			var tmp = idx2;
			idx2 = idx1;
			idx1 = tmp;
		}

		indexes.splice( idx2+1, indexes.length );
		indexes.splice( 0, idx1 );
	}

	if ( ! dt[type]( idx, { selected: true } ).any() ) {
		// Select range
		dt[type+'s']( indexes ).select();
	}
	else {
		// Deselect range - need to keep the clicked on row selected
		indexes.splice( $.inArray( idx, indexes ), 1 );
		dt[type+'s']( indexes ).deselect();
	}
}

/**
 * Clear all selected items
 *
 * @param  {DataTable.settings} ctx Settings object of the host DataTable
 * @param  {boolean} [force=false] Force the de-selection to happen, regardless
 *     of selection style
 * @private
 */
function clear( ctx, force )
{
	if ( force || ctx._select.style === 'single' ) {
		var api = new DataTable.Api( ctx );
		
		api.rows( { selected: true } ).deselect();
		api.columns( { selected: true } ).deselect();
		api.cells( { selected: true } ).deselect();
	}
}

/**
 * Select items based on the current configuration for style and items.
 *
 * @param  {object}             e    Mouse event object
 * @param  {DataTables.Api}     dt   DataTable
 * @param  {DataTable.settings} ctx  Settings object of the host DataTable
 * @param  {string}             type Items to select
 * @param  {int|object}         idx  Index of the item to select
 * @private
 */
function typeSelect ( e, dt, ctx, type, idx )
{
	var style = dt.select.style();
	var isSelected = dt[type]( idx, { selected: true } ).any();

	if ( style === 'os' ) {
		if ( e.ctrlKey || e.metaKey ) {
			// Add or remove from the selection
			dt[type]( idx ).select( ! isSelected );
		}
		else if ( e.shiftKey ) {
			if ( type === 'cell' ) {
				cellRange( dt, idx, ctx._select_lastCell || null );
			}
			else {
				rowColumnRange( dt, type, idx, ctx._select_lastCell ?
					ctx._select_lastCell[type] :
					null
				);
			}
		}
		else {
			// No cmd or shift click - deselect if selected, or select
			// this row only
			var selected = dt[type+'s']( { selected: true } );

			if ( isSelected && selected.flatten().length === 1 ) {
				dt[type]( idx ).deselect();
			}
			else {
				selected.deselect();
				dt[type]( idx ).select();
			}
		}
	} else if ( style == 'multi+shift' ) {
		if ( e.shiftKey ) {
			if ( type === 'cell' ) {
				cellRange( dt, idx, ctx._select_lastCell || null );
			}
			else {
				rowColumnRange( dt, type, idx, ctx._select_lastCell ?
					ctx._select_lastCell[type] :
					null
				);
			}
		}
		else {
			dt[ type ]( idx ).select( ! isSelected );
		}
	}
	else {
		dt[ type ]( idx ).select( ! isSelected );
	}
}



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables selectors
 */

// row and column are basically identical just assigned to different properties
// and checking a different array, so we can dynamically create the functions to
// reduce the code size
$.each( [
	{ type: 'row', prop: 'aoData' },
	{ type: 'column', prop: 'aoColumns' }
], function ( i, o ) {
	DataTable.ext.selector[ o.type ].push( function ( settings, opts, indexes ) {
		var selected = opts.selected;
		var data;
		var out = [];

		if ( selected === undefined ) {
			return indexes;
		}

		for ( var i=0, ien=indexes.length ; i<ien ; i++ ) {
			data = settings[ o.prop ][ indexes[i] ];

			if ( (selected === true && data._select_selected === true) ||
			     (selected === false && ! data._select_selected )
			) {
				out.push( indexes[i] );
			}
		}

		return out;
	} );
} );

DataTable.ext.selector.cell.push( function ( settings, opts, cells ) {
	var selected = opts.selected;
	var rowData;
	var out = [];

	if ( selected === undefined ) {
		return cells;
	}

	for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
		rowData = settings.aoData[ cells[i].row ];

		if ( (selected === true && rowData._selected_cells && rowData._selected_cells[ cells[i].column ] === true) ||
		     (selected === false && ( ! rowData._selected_cells || ! rowData._selected_cells[ cells[i].column ] ) )
		) {
			out.push( cells[i] );
		}
	}

	return out;
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API
 *
 * For complete documentation, please refer to the docs/api directory or the
 * DataTables site
 */

// Local variables to improve compression
var apiRegister = DataTable.Api.register;
var apiRegisterPlural = DataTable.Api.registerPlural;

apiRegister( 'select()', function () {
	return this.iterator( 'table', function ( ctx ) {
		DataTable.select.init( new DataTable.Api( ctx ) );
	} );
} );

apiRegister( 'select.blurable()', function ( flag ) {
	if ( flag === undefined ) {
		return this.context[0]._select.blurable;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.blurable = flag;
	} );
} );

apiRegister( 'select.info()', function ( flag ) {
	if ( info === undefined ) {
		return this.context[0]._select.info;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.info = flag;
	} );
} );

apiRegister( 'select.items()', function ( items ) {
	if ( items === undefined ) {
		return this.context[0]._select.items;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.items = items;

		eventTrigger( new DataTable.Api( ctx ), 'selectItems', [ items ] );
	} );
} );

// Takes effect from the _next_ selection. None disables future selection, but
// does not clear the current selection. Use the `deselect` methods for that
apiRegister( 'select.style()', function ( style ) {
	if ( style === undefined ) {
		return this.context[0]._select.style;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.style = style;

		if ( ! ctx._select_init ) {
			init( ctx );
		}

		// Add / remove mouse event handlers. They aren't required when only
		// API selection is available
		var dt = new DataTable.Api( ctx );
		disableMouseSelection( dt );
		
		if ( style !== 'api' ) {
			enableMouseSelection( dt );
		}

		eventTrigger( new DataTable.Api( ctx ), 'selectStyle', [ style ] );
	} );
} );

apiRegister( 'select.selector()', function ( selector ) {
	if ( selector === undefined ) {
		return this.context[0]._select.selector;
	}

	return this.iterator( 'table', function ( ctx ) {
		disableMouseSelection( new DataTable.Api( ctx ) );

		ctx._select.selector = selector;

		if ( ctx._select.style !== 'api' ) {
			enableMouseSelection( new DataTable.Api( ctx ) );
		}
	} );
} );



apiRegisterPlural( 'rows().select()', 'row().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'row', function ( ctx, idx ) {
		clear( ctx );

		ctx.aoData[ idx ]._select_selected = true;
		$( ctx.aoData[ idx ].nTr ).addClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'row', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'columns().select()', 'column().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'column', function ( ctx, idx ) {
		clear( ctx );

		ctx.aoColumns[ idx ]._select_selected = true;

		var column = new DataTable.Api( ctx ).column( idx );

		$( column.header() ).addClass( ctx._select.className );
		$( column.footer() ).addClass( ctx._select.className );

		column.nodes().to$().addClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'column', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'cells().select()', 'cell().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'cell', function ( ctx, rowIdx, colIdx ) {
		clear( ctx );

		var data = ctx.aoData[ rowIdx ];

		if ( data._selected_cells === undefined ) {
			data._selected_cells = [];
		}

		data._selected_cells[ colIdx ] = true;

		if ( data.anCells ) {
			$( data.anCells[ colIdx ] ).addClass( ctx._select.className );
		}
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'cell', api[i] ], true );
	} );

	return this;
} );


apiRegisterPlural( 'rows().deselect()', 'row().deselect()', function () {
	var api = this;

	this.iterator( 'row', function ( ctx, idx ) {
		ctx.aoData[ idx ]._select_selected = false;
		$( ctx.aoData[ idx ].nTr ).removeClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'row', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'columns().deselect()', 'column().deselect()', function () {
	var api = this;

	this.iterator( 'column', function ( ctx, idx ) {
		ctx.aoColumns[ idx ]._select_selected = false;

		var api = new DataTable.Api( ctx );
		var column = api.column( idx );

		$( column.header() ).removeClass( ctx._select.className );
		$( column.footer() ).removeClass( ctx._select.className );

		// Need to loop over each cell, rather than just using
		// `column().nodes()` as cells which are individually selected should
		// not have the `selected` class removed from them
		api.cells( null, idx ).indexes().each( function (cellIdx) {
			var data = ctx.aoData[ cellIdx.row ];
			var cellSelected = data._selected_cells;

			if ( data.anCells && (! cellSelected || ! cellSelected[ cellIdx.column ]) ) {
				$( data.anCells[ cellIdx.column  ] ).removeClass( ctx._select.className );
			}
		} );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'column', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'cells().deselect()', 'cell().deselect()', function () {
	var api = this;

	this.iterator( 'cell', function ( ctx, rowIdx, colIdx ) {
		var data = ctx.aoData[ rowIdx ];

		data._selected_cells[ colIdx ] = false;

		// Remove class only if the cells exist, and the cell is not column
		// selected, in which case the class should remain (since it is selected
		// in the column)
		if ( data.anCells && ! ctx.aoColumns[ colIdx ]._select_selected ) {
			$( data.anCells[ colIdx ] ).removeClass( ctx._select.className );
		}
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'cell', api[i] ], true );
	} );

	return this;
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Buttons
 */
function i18n( label, def ) {
	return function (dt) {
		return dt.i18n( 'buttons.'+label, def );
	};
}

$.extend( DataTable.ext.buttons, {
	selected: {
		text: i18n( 'selected', 'Selected' ),
		className: 'buttons-selected',
		init: function ( dt ) {
			var that = this;

			// .DT namespace listeners are removed by DataTables automatically
			// on table destroy
			dt.on( 'draw.dt.DT select.dt.DT deselect.dt.DT', function () {
				var enable = that.rows( { selected: true } ).any() ||
				             that.columns( { selected: true } ).any() ||
				             that.cells( { selected: true } ).any();

				that.enable( enable );
			} );

			this.disable();
		}
	},
	selectedSingle: {
		text: i18n( 'selectedSingle', 'Selected single' ),
		className: 'buttons-selected-single',
		init: function ( dt ) {
			var that = this;

			dt.on( 'draw.dt.DT select.dt.DT deselect.dt.DT', function () {
				var count = dt.rows( { selected: true } ).flatten().length +
				            dt.columns( { selected: true } ).flatten().length +
				            dt.cells( { selected: true } ).flatten().length;

				that.enable( count === 1 );
			} );

			this.disable();
		}
	},
	selectAll: {
		text: i18n( 'selectAll', 'Select all' ),
		className: 'buttons-select-all',
		action: function () {
			var items = this.select.items();
			this[ items+'s' ]().select();
		}
	},
	selectNone: {
		text: i18n( 'selectNone', 'Deselect all' ),
		className: 'buttons-select-none',
		action: function () {
			clear( this.settings()[0], true );
		},
		init: function ( dt ) {
			var that = this;

			dt.on( 'draw.dt.DT select.dt.DT deselect.dt.DT', function () {
				var count = dt.rows( { selected: true } ).flatten().length +
				            dt.columns( { selected: true } ).flatten().length +
				            dt.cells( { selected: true } ).flatten().length;

				that.enable( count > 0 );
			} );

			this.disable();
		}
	}
} );

$.each( [ 'Row', 'Column', 'Cell' ], function ( i, item ) {
	var lc = item.toLowerCase();

	DataTable.ext.buttons[ 'select'+item+'s' ] = {
		text: i18n( 'select'+item+'s', 'Select '+lc+'s' ),
		className: 'buttons-select-'+lc+'s',
		action: function () {
			this.select.items( lc );
		},
		init: function ( dt ) {
			var that = this;

			dt.on( 'selectItems.dt.DT', function ( e, ctx, items ) {
				that.active( items === lc );
			} );
		}
	};
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Initialisation
 */

// DataTables creation - check if select has been defined in the options. Note
// this required that the table be in the document! If it isn't then something
// needs to trigger this method unfortunately. The next major release of
// DataTables will rework the events and address this.
$(document).on( 'preInit.dt.dtSelect', function (e, ctx) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	DataTable.select.init( new DataTable.Api( ctx ) );
} );


return DataTable.select;
}));


