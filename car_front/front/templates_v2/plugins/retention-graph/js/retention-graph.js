/**
 * Created by Araja Jyothi Babu on 22-May-16.
 */

(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function($) {
    'use strict';
    var Retention = window.Retention || {};

    Retention = (function() {

        function Retention(element, settings) {

            var _this = this;
            
            _this.element = element;
            _this.originalOptions = settings;
            var typeConf = _this.originalOptions.retentionType;
            var data = "days";
            switch(typeConf){
            	case "Day": data = "days"; break;
            	case "Week": data = "weeks"; break;
            	case "Month": data = "months"; break;
            } 
            
            _this.defaults = {
                data : {},
                title : "Retention Analysis",
                startDate : null,
                endDate : null,
                inputDateFormat : null,
                dateDisplayFormat: null,
                cellClickEvent : function (d, i) {
                    //do something
                },
                showEmptyDataMessage : true,
                customEmptyDataMessage : null,
                enableInactive : false,
                dayClickEvent : function(day, startDate, endDate){
                    //do something
                },
                retentionDays : 7,
                retentionWeeks : 4,
                retentionMonths : 3,
                enableTooltip : true,
                enableDateRange : false,
                showAbsolute : false,
                toggleValues : true,
                showHeaderValues : false,
                retentionType: typeConf	// tv
            };

            _this.options = _this.generateOptions();

            _this.proceedFlag = Object.keys(_this.options.data).length;

            /* tuonglv */
            _this.inactiveTitle = _this.originalOptions.inactiveTitle;
            _this.activeTitle = _this.originalOptions.activeTitle;
            _this.unit = _this.originalOptions.unit;
            _this.downloadUrl = _this.originalOptions.downloadUrl;
            _this.isLTV = _this.originalOptions.isLTV;
            /* end */
            _this.totalCounts = {};

            _this.options.data = _this.sortData();

            _this.currentData = _this.options.data[data];

            _this.setDateRanges();

            _this.currentSelected = 'retention' + typeConf + 's';

            _this.isActive = true;

            _this.showValue = _this.options.showAbsolute;

            _this.isDateModified = false;

            _this.headerValues = [];

            _this.initialValues = [];

            //some dom Events
            $(document).ready(function() {
                $(document).on('click', 'td.clickable', function () {
                    _this.options.cellClickEvent($(this).attr('date'), $(this).attr('day'));
                });

                $(document).on('click', 'td.head-clickable', function () {
                    _this.options.dayClickEvent($(this).attr('day'), _this.options.startDate, _this.options.endDate);
                });

                $(document).on('mouseover mouseout', 'td.head-clickable', function () {
                    $('.col' + $(this).attr('day')).toggleClass('hover');
                });

                $(document).on('click', '#retention-active-switch', function () {
                    var body = $('.retention-body');
                    if ($(this).hasClass('retention-inactive')) {
                        _this.isActive = false;
                        _this.start(body);
                        $(this).addClass('retention-active btn-success').removeClass('retention-inactive btn-warning').text("Active");
                        /* tuonglv */
                        //$('.retention-title').text("Inactive User Analysis");
                        $('.retention-title').text(_this.inactiveTitle);
                    } else {
                        _this.isActive = true;
                        _this.start(body);
                        $(this).addClass('retention-inactive btn-warning').removeClass('retention-active btn-success').text("Inactive");
                        /* tuonglv */
                        //$('.retention-title').text("Active User Analysis");
                        $('.retention-title').text(_this.activeTitle);
                    }
                });

                $(document).on('click', '#retention-toggle-values', function () {
                    var body = $('.retention-body');
                    if (_this.showValue) {
                        _this.showValue = false;
                        _this.start(body);
                        $(this).addClass('retention-active btn-info').removeClass('retention-inactive btn-warning').text("#");
                    } else {
                        _this.showValue = true;
                        _this.start(body);
                        $(this).addClass('retention-inactive btn-primary').removeClass('retention-active btn-info').text("%");
                    }
                });

                $(document).on('click', '#retention-download-button', function () {
                    var downloadUrl = _this.downloadUrl + "&___p="  + _this.showValue;
                    window.location  = downloadUrl;
                });

                //$('input[name="retention-switch"]').click(function () {
                $(document).on('click', 'input[name="retention-switch"]', function () {
                	
                    var body = $('.retention-body');
                    var selectedKey = $(this).val();
                    var key =  selectedKey == "Day" ? 'days' : (selectedKey == "Week" ? 'weeks' : 'months');
                    if(_this.options.enableDateRange) {
                        var drp = $('#retention-date-range');
                        if(selectedKey != "Day") {
                            $(drp).attr('readonly', 'true');
                            $('.calendar').hide();
                        }else{
                            $(drp).removeAttr('readonly');
                            $('.calendar').show();
                        }
                    }
                    _this.currentSelected = 'retention' + selectedKey + 's';
                    _this.currentData = _this.options.data[key];
                    _this.start(body, false);
                });

                if(_this.options.enableDateRange) {
                    $('#retention-date-range').daterangepicker({
                        "autoApply" : true,
                        "startDate": _this.options.startDate,
                        "endDate": _this.options.endDate,
                        "minDate" : _this.options.startDate,
                        "maxDate" : _this.options.endDate,
                        'opens' : 'left',
                        "locale": {
                            "format": _this.options.inputDateFormat || "DD-MM-YYYY"
                        }
                    },function(start, end, label) {
                        _this.isDateModified = true;
                        _this.options.startDate = start;
                        _this.options.endDate = end;
                        var body = $('.retention-body');
                        _this.start(body);
                    });
                }

                if (_this.options.enableTooltip) {
                    $('body').tooltip({
                        selector: '[data-toggle="tooltip"]'
                    });
                }

            });

            _this.init();

        }

        return Retention;

    }());

    Retention.prototype.init = function () {

        var container = this.getContainer();
        var type = this.options.retentionType;
        $("input[value='" + type + "']").attr("checked", ""); //default days checked

        var body = this.getBody();
        body.appendTo(container);

        if(this.proceedFlag){
            this.start(body);
        }else{
            $('#retention-active-switch').hide();
            this.emptyMessage(body);
        }
    };

    Retention.prototype.emptyMessage = function (body) {
        if(this.options.showEmptyDataMessage){
            $('<h3 />', {
                align : 'center',
                style : 'color:red',
                text : this.options.customEmptyDataMessage ? this.options.customEmptyDataMessage : "No data available to show..!"
            }).appendTo(body);
        }
    };

    Retention.prototype.start = function (body) {
        var _this = this;
        $(body).html('');
        var table = this.getTable();
        table.appendTo(body);

        var tbody = $('<tbody />').appendTo(table);

        var rowsData = this.getRows();

        this.headerValues = new Array(this.options[this.currentSelected] + 2).join('0').split('').map(parseFloat);
        this.initialValues = new Array(rowsData.length).join('0').split('').map(parseFloat); //initialising to 0
        rowsData.forEach(function(data, index){
            _this.generateRow(data).appendTo(tbody);
            _this.initialValues[index] = data[1]; //pushes initial values before calculating retention. In fact calculating retention for these values
        });
        
        var tableHeader = this.generateTableHeader(table);
        tableHeader.prependTo(table);
    };

    Retention.prototype.toggleValueButton =  function () {
        var _this = this;
        var switchInput = $('<a />', {
            type : 'button',
            id : 'retention-toggle-values',
            class : 'retention-toggle-values btn btn-primary',
            text : '#'
        });
        return switchInput;
    };

    Retention.prototype.downloadButton =  function () {
        var _this = this;
        var switchInput = $('<a />', {
            type : 'button',
            id : 'retention-download-button',
            class : 'retention-download-button btn btn-primary',
            text : 'Download'
        });
        return switchInput;
    };

    Retention.prototype.getContainer = function () {
        var container = $('<div />', {
            class : 'retention-box'
        }).appendTo(this.element);

        var header = $('<div />', {
            class : "retention-box-header with-border"
        }).appendTo(container);

        var title = $('<p />', {
            style : 'margin-left: 10px;',
            class : "retention-title retention-box-title",
            text : this.options.title
        }).appendTo(header);

        var controls = $('<div />', {
            class : "retention-box-tools"
        }).appendTo(header);

        if(this.options.enableDateRange) {
            var anchorWrapper = $('<a />', {
                style : 'display: inline-block;margin:0 5px;'
            }).appendTo(controls);
            var dateRange = $('<input />', {
                id: "retention-date-range",
                type: "text",
                class: 'form-control'
            }).appendTo(anchorWrapper);
        }

        var switchData = this.getSwitchData();

        var switchContainer = $('<a />', {
            class : "switch-field" + (switchData.length == 1 ? " hide" : "")
        }).appendTo(controls);

        for(var key in switchData){
            $('<input />', {
                type : "radio",
                name : "retention-switch",
                id : switchData[key],
                value : switchData[key],
                class : 'form-control'
            }).appendTo(switchContainer);
            $('<label />', {
                for : switchData[key],
                title : "Feature yet to implement",
                text : switchData[key] + "s" //appending s for "days"
            }).appendTo(switchContainer);
        }

        if(this.options.enableInactive) {
            var retentionSwitch = this.getInactiveSwitch();
            retentionSwitch.appendTo(controls);
        }
        var downloadButton = this.downloadButton();
        downloadButton.appendTo(controls);
        if(this.options.toggleValues){
            var toggleValueButton = this.toggleValueButton();
            toggleValueButton.appendTo(controls);
        }


        return container;
    };

    Retention.prototype.getSwitchData = function () {
        var switchData = [];
        var _this = this;
        Object.keys(_this.options.data).forEach(function (key) {
            if(Object.keys(_this.options.data[key]).length > 0)
                switchData.push(key.capitalize().slice(0,-1));
        });
        return switchData;
    };

    Retention.prototype.getInactiveSwitch = function () {
        var _this = this;
        var switchInput = $('<a />', {
            type : 'button',
            id : 'retention-active-switch',
            class : 'retention-inactive btn btn-warning',
            text : 'Inactive',
            style : 'width: 85px;'
        });
        return switchInput;
    };

    Retention.prototype.getBody = function () {
        var body = $('<div />', {
            class : "retention-body retention-box-body"
        });
        return body;
    };

    Retention.prototype.getTable = function () {
        var table = $('<table />', {
            class : "table table-bordered text-center"
        });
        return table;
    };

    /**
     * Gives overall percentage of column
     * @param value
     * @param index, index of retention
     */
    Retention.prototype.getTotalPercentage = function (value, index) {
        var total = 0;
        var threshold = this.initialValues.length - index;
        this.initialValues.forEach(function (data, i) {
            if(i < threshold)
                total += data;
        });
        return this.getPercentage(total, value);
    };

    Retention.prototype.generateTableHeader = function (table) {
    	
        var tHead = $('<thead />').appendTo(table);
        var tHeadRow = $('<tr />', {
            class : "retention-thead"
        }).appendTo(tHead);

        var headerData = this.getHeaderData();
        var length = headerData.length;
        var _this = this;
        var td = "", span = "";
        headerData.forEach(function(data, key){ //FIXME: no need to use headerData here
            td = $('<td />', {
                class : function(){
                    return key > 0 ? "retention-cell head-clickable" : "retention-cell key-cell";
                },
                day : key-1,
                text : data + " "
            }).appendTo(tHeadRow);
            if(key > 0) {
                span = $('<span />', {
                    class: 'retention-badge badge-info',
                    text: function () {
                        return _this.showValue? _this.headerValues[key-1] : _this.getTotalPercentage(_this.headerValues[key-1], key-1) + "%";
                    }
                }).appendTo(td);
            }
        });
        $('.head-clickable .retention-cell').css('width', (85 / (length+1)) + '%');
        $('.retention-cell.key-cell').css('width', '15%');
        return tHead;
    };

    Retention.prototype.generateOptions = function () {
        var options = {};
        var keys = Object.keys(this.defaults);
        var key;
        for(var i in keys){
            key = keys[i];
            options[key] = typeof this.originalOptions[key] == 'undefined' ? this.defaults[key] : this.originalOptions[key];
        }
        return options;
    };

    Retention.prototype.sortData = function () {
        var ordered = {};
        var _this = this;
        var count = 0;
        var totalCounts = {};
        var intermediate = {};
        Object.keys(_this.options.data).forEach(function(key) {
            Object.keys(_this.options.data[key]).sort().forEach(function(subKey){
                intermediate[subKey] = _this.options.data[key][subKey];
                count += intermediate[subKey][0];
            });
            ordered[key] = intermediate;
            totalCounts[key] = count;
            intermediate = {};
            count = 0;
        });
        _this.totalCounts = totalCounts;
        return ordered;
    };

    Retention.prototype.getModifiedRows = function () {
        var rows = [];
        var keys = Object.keys(this.currentData);
        var date;
        for(var key in keys){
            date = keys[key];
            if(this.currentData.hasOwnProperty(date) && this.isDateBetween(date)) {
                rows.push([keys[key]].concat(this.currentData[keys[key]]));
            }
        }
        return rows;
    }

    Retention.prototype.getRows = function(){
        var rows = [];
        var keys = Object.keys(this.currentData);
        for(var key in keys){
            if(this.currentData.hasOwnProperty(keys[key]) && this.isDateBetween(keys[key])) {
                rows.push([keys[key]].concat(this.currentData[keys[key]]));
            }
        }
        return rows;
    };

    Retention.prototype.setDateRanges = function(){
        var rows = [];
        var keys = Object.keys(this.currentData);
        this.options.startDate = keys[0];
        this.options.endDate = keys[keys.length-1];
    };

    Retention.prototype.formatDate = function(date){
        if(! Date.parse(date))
            return date;
        return (this.options.dateDisplayFormat != null) ? (this.options.inputDateFormat ? moment(date, this.options.inputDateFormat).format(this.options.dateDisplayFormat) : moment(date).format(this.options.dateDisplayFormat)) : date;
    };

    Retention.prototype.getPercentage = function (total, value) {
        if(total == 0 || value  == 0) return 0; //handling Infinity
        return Math.round((value/total * 100) * 100) / 100;
    };

    Retention.prototype.isValidHex = function(color){
        return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
    };

    String.prototype.capitalize = function(){
        return this.toLowerCase().replace( /\b\w/g, function (m) {
            return m.toUpperCase();
        });
    };

    Retention.prototype.shadeColor = function(color, percent) { //#
        color = this.isValidHex(color) ? color : "#3f83a3"; //handling null color;
        percent = 1.0 - Math.ceil(percent / 10) / 10;
        var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
        return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
    };

    Retention.prototype.tooltipData = function(date, total, count, dayIndex, type){
        /*var fromDate = this.formatDate(date);//.format("MMM DD");
        var toDate =  moment(this.formatDate(date), this.options.dateDisplayFormat).add(dayIndex-1, "days").format(this.options.dateDisplayFormat);
        var active = this.isActive? " active " : " inactive ";
        console.log(type);
        return  "Of " + total + " users came on " + fromDate + ", " + (count + " were " + active + " on " + toDate);*/
        
    	// tv
        var from = moment(this.formatDate(date), this.options.dateDisplayFormat);
        var to = moment(this.formatDate(date), this.options.dateDisplayFormat).add(dayIndex-1, type.toLowerCase() + "s");
        var toDateFormatted = "";
        var fromDateFormatted = "";
        
        if(type == "Day"){
        	toDateFormatted = to.format(this.options.dateDisplayFormat);
        	fromDateFormatted = from.format(this.options.dateDisplayFormat);
        }else if(type == "Week"){
        	toDateFormatted = type + " " + to.isoWeek() + " - " + to.format("YYYY");
        	fromDateFormatted = type + " " + from.isoWeek() + " - " + from.format("YYYY");
        }else{
        	toDateFormatted = to.format("MMM-YYYY");
        	fromDateFormatted = from.format("MMM-YYYY");
        }
        var active = this.isActive? " active " : " inactive ";
        return  "Of " + total + this.unit +" came on " + fromDateFormatted + ", " + (count + " were " + active + " on " + toDateFormatted);
    };

    Retention.prototype.isDateBetween = function (date) {
        if(this.currentSelected != 'retentionDays') return true;
        var start = this.options.startDate;
        var end = this.options.endDate;
        date = this.options.inputDateFormat != null ? moment(date, this.options.inputDateFormat) : date;
        return this.isDateModified? start.diff(date) <= 0 && date.diff(end) <= 0 : true; //moment ref:http://momentjs.com/docs/#/displaying/difference/
    };

    Retention.prototype.getHeaderData = function(){
        var selector = $("input[name='retention-switch']:checked"); //changes by selection of switch
        var headerDataAppender = $(selector).val();
        var headerData = [];
        var length = this.options['retention' + headerDataAppender + 's'] + 2;
        if (this.isLTV == false){
            for(var i = 0; i < length; i++){
                headerData.push(i > 0? (headerDataAppender + " " + (i-1)) : (this.totalCounts[headerDataAppender.toLowerCase() + 's'] + this.unit));
            }
        }else{
            headerData.push((this.totalCounts[headerDataAppender.toLowerCase() + 's'] + this.unit));
            headerData.push("Sum Rev");
            for(var i = 1; i < length; i++){
                headerData.push(headerDataAppender + " " + (i-1));
            }
        }
        return headerData;
    };

    Retention.prototype.generateRow = function(data){
        var _this = this;
        var row = $('<tr />');
        var date = data[0];
        var dayCount = 0;
        var count = data[1] || 0; //to handle divisionBy0
        var td, div;
        var keysLength = _this.options[_this.currentSelected] + 2;
        var actualLength = data.length;
        for(var key = 0; key < keysLength; key++){
            if(key < actualLength) {
                dayCount = _this.isActive ? data[key] : count - data[key];
                _this.headerValues[key-1] += key == 1? count : dayCount;
                var className = (key > 0 ? "retention-cell" + (key > 1 ? " clickable" : "") : "retention-date") + (" col" + (key - 1));
                td = $('<td />', {
                    class: className,
                    style: function () {
                        if (key > 1) {
                            return "background-color :" + _this.shadeColor("", _this.getPercentage(count, dayCount));
                        }
                    },
                    date: date,
                    day: key - 1
                }).appendTo(row);
                div = $('<div />', {
                    'data-toggle': _this.options.enableTooltip ? "tooltip" : "",
                    'data-original-title': function () {
                    	var type = _this.options.retentionType;
                        if (key > 1) {
                            return _this.tooltipData(date, count, dayCount, key, type);
                        }
                    },
                    text: _this.displayValue(key, data[key], count)
                }).appendTo(td);
            }
        }
        return row;
    };

    Retention.prototype.displayValue = function(index, value, count){
        if(index == 0)
            return this.formatDate(value);
        if(index == 1){
            return $.MyUtils.number_format(value);
        }
        value = this.isActive? value : count - value;
        if(this.showValue){
            return $.MyUtils.number_format(value);
        }else{
            return (this.getPercentage(count, value) + " %");
        }
    };

    Retention.prototype.displayValue1 = function(index, value, count){
        if(index == 0)
            return this.formatDate(value);
        if(index == 1)
            return value;
        value = this.isActive? value : count - value;
        return this.showValue? value : (this.getPercentage(count, value) + " %");
    };

    $.fn.retention = function(options) {
        if(typeof options == 'object'){
            new Retention(this, options);
        }else{
            throw new Error("Need options to show retention graph..!");
        }
    };

}));