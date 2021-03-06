


function GetParamsFromUrl () {
    var ret = {};
    if(window.location.search.length>0)
    {
        //var s = decodeURIComponent(window.location.search.substr(1));
        var s = window.location.search.substr(1);
        var decrypted = CryptoJS.AES.decrypt(s,  $.webgis.config.encrypt_key);
        s = decrypted.toString(CryptoJS.enc.Utf8);
        s = decodeURIComponent(s);
        ret = JSON.parse(s);
    }
    return ret;
}


function GetDefaultExtent(db_name)
{
    if(db_name === 'kmgd' || db_name === 'kmgd_yx')
    {
        return {'west':101.69184, 'south':24.04067, 'east':103.71404, 'north':26.06087};
    }
    else if(db_name === 'ztgd')
    {
        return {'west':102.7013, 'south':26.32388, 'east':104.7235, 'north':28.34408};
    }
    else
    {
        return {'west':101.69184, 'south':24.04067, 'east':103.71404, 'north':26.06087};
    }
}
function GetDefaultCenter(db_name)
{
    var ext = GetDefaultExtent(db_name);
    return [(ext['west'] + ext['east'])/2.0, (ext['south'] + ext['north'])/2.0];
}

function InitWebGISFormDefinition()
{
    var methods = 
    {
        init : function(fields, options) 
        {
            if(!fields) return this;
            this.fields = fields;
            if(!$.fn.webgisform.fields) $.fn.webgisform.fields = {}
            $.fn.webgisform.fields[this.attr('id')] = fields;
            this.groups = [];
            this.options = $.extend({}, $.fn.webgisform.defaults, options);
            if(!$.fn.webgisform.options) $.fn.webgisform.options = {}
            $.fn.webgisform.options[this.attr('id')] = this.options;
            this.empty();
            var prefix = '';
            if($.fn.webgisform.options[this.attr('id')].prefix) prefix = $.fn.webgisform.options[this.attr('id')].prefix;
            var maxwidth = 400;
            if($.fn.webgisform.options[this.attr('id')].maxwidth) maxwidth = $.fn.webgisform.options[this.attr('id')].maxwidth;
            var divorspan = this.options.divorspan;
            var debug = true;
            if($.fn.webgisform.options[this.attr('id')].debug) debug = $.fn.webgisform.options[this.attr('id')].debug;
            
            var that = this;
            _.forEach(fields, function(fld)
            {
                var fldid = prefix + fld.id;
                if(fld.type == 'hidden')
                {
                    that.append('<input type="hidden" id="' + fldid + '">');
                }
                if(fld.group)
                {
                    if(that.groups.indexOf(fld.group) < 0)
                    {
                        that.groups.push(fld.group);
                    }
                }
            });
            _.forEach(that.groups, function(group)
            {
                var uid = $.uuid();
                var g = that.append('<fieldset id="fieldset_' + uid + '" style="min-height:50px;color:' + $.webgis.color.base_color + ';border:1px solid ' + $.webgis.color.base_color + ';margin:' + that.options.groupmargin + 'px;"><legend style="font-weight:bolder;color:' + $.webgis.color.base_color + ';">' + group + '</legend>');
                that.append('</fieldset>');
                that.append('<p></p>');
                
                
                _.forEach(fields, function(fld)
                {
                    var fldid = prefix + fld.id;
                    
                    if(fld.labelwidth) that.options.labelwidth = fld.labelwidth;
                    var newline = '';
                    var stylewidth = '';
                    if(fld.newline === false)
                    {
                        newline = 'float:left;';
                    }
                    if(fld.newline === true)
                    {
                        stylewidth = 'width:' + maxwidth + 'px;';
                        newline = 'display:block;';
                    }
                    var required = '';
                    if(fld.validate && fld.validate.required)
                    {
                        required = '<span  style="color:#FF0000;">*</span>';
                    }
                    if(fld.type == 'spinner' && fld.group == group)
                    {
                        //console.log(fldid + ' ' + newlinepara);
                        $('#' + 'fieldset_' + uid).append('<' + divorspan + ' style="' + stylewidth + 'margin:' + that.options.margin + 'px;' + newline + '"><label for="' + fldid + '" style="display:inline-block;text-align:right;width:' + that.options.labelwidth + 'px; ">' + fld.display + ':' + '</label><input  style="width:' + fld.width + 'px;" id="' + fldid + '" name="' + fldid + '">' + required + '</' + divorspan + '>');
                        var spin =     $('#' + fldid).spinner({
                            step: fld.step,
                            max:fld.max,
                            min:fld.min,
                            change:fld.change,
                            spin:fld.spin
                        });
                        if(fld.defaultvalue) $('#' + fldid).val(fld.defaultvalue);
                    }
                    if(fld.type == 'geographic' && fld.group == group)
                    {
                        $('#' + 'fieldset_' + uid).append('<' + divorspan + ' style="' + stylewidth + 'margin:' + that.options.margin + 'px;' + newline + '"><label for="' + fldid + '" style="display:inline-block;text-align:right;width:' + that.options.labelwidth + 'px;">' + fld.display + ':' + '</label><input  style="width:' + fld.width + 'px;" id="' + fldid + '" name="' + fldid + '">' + required + '</' + divorspan + '>');
                        var spin =     $('#' + fldid).spinner({
                            step: 0.00001,
                            max:179.0,
                            min:-179.0,
                            change: fld.change,
                            spin: fld.spin
                        });
                        if(fld.defaultvalue) $('#' + fldid).val(fld.defaultvalue);
                    }
                    if(fld.type == 'text' && fld.group == group)
                    {
                        var readonly = '';
                        if(fld.editor && fld.editor.readonly == true)
                        {
                            readonly = ' readonly="readonly"';
                        }
                        var additiontext = '';
                        if(fld.addition) additiontext = fld.addition;
                        $('#' + 'fieldset_' + uid).append('<' + divorspan + ' style="' + stylewidth + 'margin:' + that.options.margin + 'px;' + newline + '"><label for="' + fldid + '" style="display:inline-block;text-align:right;width:' + that.options.labelwidth + 'px;">' + fld.display + ':' + '</label><input type="text" class="ui-widget" style="width:' + fld.width + 'px;" id="' + fldid + '" name="' + fldid + '" ' + readonly + '>' + required + additiontext +'</' + divorspan + '>');
                        if(fld.defaultvalue) $('#' + fldid).val(fld.defaultvalue);
                        if(_.isFunction(fld.change)){
                            $('#' + fldid).on('change keyup click',function(e){
                                fld.change($(e.target).val());
                            });
                        }
                    }
                    if(fld.type == 'textarea' && fld.group == group)
                    {
                        var readonly = '';
                        if(fld.editor && fld.editor.readonly == true)
                        {
                            readonly = ' readonly="readonly"';
                        }
                        $('#' + 'fieldset_' + uid).append('<' + divorspan + ' style="' + stylewidth + 'margin:' + that.options.margin + 'px;' + newline + '"><label for="' + fldid + '" style="display:inline-block;text-align:right;width:' + that.options.labelwidth + 'px;">' + fld.display + ':' + '</label><textarea style="width:' + fld.width + 'px;height:' + fld.height + 'px;" id="' + fldid + '" name="' + fldid + '" ' + readonly + '></textarea>' + required + '</' + divorspan + '>');
                        if(fld.defaultvalue) $('#' + fldid).val(fld.defaultvalue);
                    }
                    if(fld.type == 'label'  && fld.group == group)
                    {
                        var align = 'center';
                        var width = 100;
                        if(fld.width) width = fld.width;
                        if(fld.editor && fld.editor.align){
                            align = fld.editor.align;
                        }
                        $('#' + 'fieldset_' + uid).append('<' + divorspan + ' style="' + stylewidth + 'margin:' + that.options.margin + 'px;' + newline + '"><label id="' + fldid + '" name="' + fldid + '"  style="display:inline-block;text-align:' + align + ';color:' + fld.editor.color + ';width:' + width + 'px">' + fld.editor.data + '' + '</label></' + divorspan + '>');
                    }
                    if(fld.type == 'password' && fld.group == group)
                    {
                        var readonly = '';
                        if(fld.editor && fld.editor.readonly == true)
                        {
                            readonly = ' readonly="readonly"';
                        }
                        $('#' + 'fieldset_' + uid).append('<' + divorspan + ' style="' + stylewidth + 'margin:' + that.options.margin + 'px;' + newline + '"><label for="' + fldid + '" style="display:inline-block;text-align:right;width:' + that.options.labelwidth + 'px;">' + fld.display + ':' + '</label><input type="password" class="ui-widget" style="width:' + fld.width + 'px;" id="' + fldid + '" name="' + fldid + '" ' + readonly + '>' + required + '</' + divorspan + '>');
                        if(fld.defaultvalue) $('#' + fldid).val(fld.defaultvalue);
                    }
                    if(fld.type == 'select' && fld.group == group)
                    {
                        var source = [];
                        if(fld.editor && fld.editor.data) source = fld.editor.data;
                        $('#' + 'fieldset_' + uid).append('<' + divorspan + ' style="' + stylewidth + 'margin:' + that.options.margin + 'px;' + newline + '"><label for="' + fldid + '" style="display:inline-block;text-align:right;width:' + that.options.labelwidth + 'px;">' + fld.display + ':' + '</label><select  style="width:' + fld.width + 'px;" id="' + fldid + '" name="' + fldid + '"></select>' + required + '</' + divorspan + '>');
                        _.forEach(source, function(src)
                        {
                            if(src){
                                $('#' + fldid).append('<option value="' + src.value + '">' + src.label + '</option>');
                            }
                        });
                        var position = 'bottom';
                        var filter = false;
                        if(fld.editor && fld.editor.filter === true) filter = true;
                        if(fld.editor && fld.editor.position) position = fld.editor.position;
                        var fld1 = fld;
                        var auto = $('#' + fldid).multipleSelect({
                            selectAll: false,
                            selectAllText: '全部',
                            selectAllDelimiter: ['(', ')'],
                            allSelected: '(全部)',
                            //minumimCountSelected: 3,
                            filter:filter,
                            countSelected: '(选择#个,共%个)',
                            noMatchesFound: '(无匹配)',
                            single: true,
                            position: position,
                            onClick:function(view){
                                if(view.checked)
                                {
                                    if(fld1.change)
                                    {
                                        fld1.change(view.value);
                                    }
                                }
                            },
                            styler: function(value) {
                                return 'color: ' + $.webgis.color.base_color + ';';
                            }
                        });
                        if(!_.isUndefined(fld.defaultvalue))
                        {
                            $('#' + fldid).multipleSelect("setSelects", [fld.defaultvalue]);
                        }
                        auto.css('border', '1px ' + $.webgis.color.base_color + ' solid');
                        auto.css('color', $.webgis.color.base_color);
                        auto.css('background', '#000000');
                    }
                    if(fld.type == 'multiselect' && fld.group == group)
                    {
                        var source = [];
                        if(fld.editor && fld.editor.data) source = fld.editor.data;
                        $('#' + 'fieldset_' + uid).append('<' + divorspan + ' style="' + stylewidth + 'margin:' + that.options.margin + 'px;' + newline + '"><label for="' + fldid + '" style="display:inline-block;text-align:right;width:' + that.options.labelwidth + 'px;">' + fld.display + ':' + '</label><select  style="width:' + fld.width + 'px;" id="' + fldid + '" name="' + fldid + '"></select>' + required + '</' + divorspan + '>');
                        for(var ii in source)
                        {
                            $('#' + fldid).append('<option value="' + source[ii]['value'] + '">' + source[ii]['label'] + '</option>');
                        }
                        var position = 'bottom';
                        if(fld.editor && fld.editor.position) position = fld.editor.position;
                        var selectAll = false;
                        if(fld.selectall) selectAll = true;
                        var filter = false;
                        if(fld.editor && fld.editor.filter === true) filter = true;
                        var auto = $('#' + fldid).multipleSelect({
                            selectAll: selectAll,
                            selectAllText: '全部',
                            selectAllDelimiter: ['(', ')'],
                            allSelected: '(全部)',
                            //minumimCountSelected: 3,
                            filter:filter,
                            countSelected: '(选择#个,共%个)',
                            noMatchesFound: '(无匹配)',
                            single: false,
                            position: position,
                            styler: function(value) {
                                return 'color: ' + $.webgis.color.base_color + ';background: #000000;';
                            }
                        });
                        if(fld.defaultvalue && fld.defaultvalue instanceof Array && fld.defaultvalue.length>0)
                        {
                            $('#' + fldid).multipleSelect("setSelects", fld.defaultvalue);
                        }
                        
                    }
                    if(fld.type == 'date' && fld.group == group)
                    {
                        var dateFormat = "yy-mm-dd";
                        if(fld.dateFormat) dateFormat = fld.dateFormat;
                        $('#' + 'fieldset_' + uid).append('<' + divorspan + ' style="' + stylewidth + 'margin:' + that.options.margin + 'px;' + newline + '"><label for="' + fldid + '" style="display:inline-block;text-align:right;width:' + that.options.labelwidth + 'px;">' + fld.display + ':' + '</label><input type="text" class="ui-widget" style="padding:7px 0px 0px 0px;width:' + fld.width + 'px;" id="' + fldid + '" name="' + fldid + '" ' + readonly + '>'  + required + '</' + divorspan + '>');
                        $('#' + fldid ).datepicker({
                            //appendText: "(yyyy-mm-dd)",
                            dateFormat:  dateFormat,
                            autoSize: false,
                            //altField: "#" + fldid,
                            buttonImage: "img/datepicker.png",
                            buttonImageOnly:true,
                            currentText: "今天",
                            monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],  
                            dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],  
                            dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],  
                            dayNamesMin: ['日','一','二','三','四','五','六'],  
                            showOn: "button",
                            duration: "slow",
                            showButtonPanel: false,
                            showAnim:"slideDown",
                            //showOptions: { 
                                ////effect: "slide",
                                ////direction: "down",
                                //duration: 100
                            //},
                            yearSuffix: '年'
                        });
                        if(fld.defaultvalue) $('#' + fldid).datepicker("setDate", fld.defaultvalue);
                    }
                    if(fld.type == 'datetime' && fld.group == group)
                    {
                        var dateFormat = "yy-mm-dd";
                        var timeFormat = "HH:mm";
                        var minDateTime, maxDateTime = moment().local().toDate();
                        if(fld.dateFormat) dateFormat = fld.dateFormat;
                        if(fld.timeFormat) timeFormat = fld.timeFormat;
                        if(fld.minDateTime) minDateTime = moment(fld.minDateTime).local().toDate();
                        if(fld.maxDateTime) maxDateTime = moment(fld.maxDateTime).local().toDate();
                        $('#' + 'fieldset_' + uid).append('<' + divorspan + ' style="' + stylewidth + 'margin:' + that.options.margin + 'px;' + newline + '"><label for="' + fldid + '" style="display:inline-block;text-align:right;width:' + that.options.labelwidth + 'px;">' + fld.display + ':' + '</label><input type="text" class="ui-widget" style="padding:7px 0px 0px 0px;width:' + fld.width + 'px;" id="' + fldid + '" name="' + fldid + '" ' + readonly + '>'  + required + '</' + divorspan + '>');
                        $('#' + fldid ).datetimepicker({
                            dateFormat:  dateFormat,
                            timeFormat:  timeFormat,
                            stepHour: 1,
                            stepMinute: 10,
                            autoSize: false,
                            buttonImage: "img/datepicker.png",
                            buttonImageOnly:true,
                            currentText: "今天",
                            monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
                            dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
                            dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
                            dayNamesMin: ['日','一','二','三','四','五','六'],
                            showOn: "button",
                            duration: "slow",
                            showButtonPanel: false,
                            showAnim:"slideDown",
                            yearSuffix: '年',
                            minDateTime:minDateTime,
                            maxDateTime:maxDateTime
                        });
                        if(fld.defaultvalue) $('#' + fldid).datetimepicker("setDate", fld.defaultvalue);
                    }
                    if(fld.type == 'icon' && fld.group == group)
                    {
                        $('#' + 'fieldset_' + uid).append('<' + divorspan + ' style="' + stylewidth + 'margin:' + that.options.margin + 'px;' + newline
                        + '"><label for="input_' + fldid + '" style="display:inline-block;text-align:right;width:' + that.options.labelwidth + 'px;">' + fld.display
                        + ':' 
                        + '</label><' + divorspan + ' style="display:inline-block;width:32px;height:32px;border:1px ' + $.webgis.color.base_color + ' solid;" id="' + fldid + '" name="' + fldid + '" ></' + divorspan + '>' + required
                        + '<ol class="kmgd-icon-selectable"  id="ol_' + fldid + '"></ol></' + divorspan + '>');
                        $('#ol_' + fldid ).css('display', 'none');
                        var defaultvalue = 'point_marker';
                        if(fld.defaultvalue) defaultvalue = fld.defaultvalue;
                        $('#' + fldid ).addClass('icon-selector-' + defaultvalue);
                        
                        $('#ol_' + fldid ).empty();
                        for(var i in fld.iconlist)
                        {
                            //$('#ol_' + fldid ).append('<li class="ui-state-default"><' + divorspan + ' class="icon-selector-' + fld.iconlist[i] + '"></' + divorspan + '></li>');
                            $('#ol_' + fldid ).append('<li class="icon-selector-' + fld.iconlist[i] + '"></li>');
                        }
                        var fldid2 = fldid ;
                        var v = fld.iconvalue;
                        $('#ol_' + fldid2 ).selectable({
                            appendTo: '#' + fldid2,
                            selected: function( event, ui ){
                                $(ui.selected).removeClass('ui-selected');
                                $('#' + fldid2).attr('class', '');
                                var cls = $(ui.selected).attr('class');
                                //console.log('[' + cls + ']');
                                //cls = cls.replace('ui-selectee', '');
                                //console.log(fldid2 + '[' + cls + ']');
                                $('#' + fldid2 ).addClass(cls);
                                $('#ol_' + fldid2 ).css('display', 'none');
                            }
                        });
                        var widget = $('#ol_' + fldid ).selectable("widget");
                        $('#' + fldid ).off();
                        var fldid3 = fldid ;
                        $('#' + fldid ).on('click', function(e){
                            if($('#ol_' + fldid3 ).css('display') === 'none')
                            {
                                $('#ol_' + fldid3 ).css('display', 'block');
                            }
                            else
                            {
                                $('#ol_' + fldid3 ).css('display', 'none');
                            }
                        });
                        $('#' + fldid ).on('mouseenter', function(e){
                            $(that).css("background-color", "#005500");
                        });
                        $('#' + fldid ).on('mouseleave', function(e){
                            $(that).css("background-color", "#000000");
                        });
                        $('#ol_' + fldid ).on('mouseleave', function(e){
                            $('#ol_' + fldid3 ).css('display', 'none');
                        });
                    }
                    if(fld.type == 'color' && fld.group == group)
                    {
                        var colorarr = [255, 0, 0, 128];
                        if(fld.defaultvalue) colorarr = fld.defaultvalue;
                        var color = ColorArrayToRgba(colorarr);
                        //console.log(fldid + ' ' + color);
                        $('#' + 'fieldset_' + uid).append('<' + divorspan + ' style="' + stylewidth + 'margin:' + that.options.margin + 'px;' + newline
                        + '"><label for="' + fldid + '" style="display:inline-block;text-align:right;width:' + that.options.labelwidth + 'px;">' + fld.display
                        + ':</label>'
                        + '<' + divorspan + '  style="display:inline-block;width:42px;height:32px;border:0px ' + $.webgis.color.base_color + ' solid;">'
                        + '<input type="color" id="' + fldid + '" name="' + fldid + '" >' + required 
                        + '</' + divorspan + '>'
                        + '</' + divorspan + '>');
                        var id = fldid;
                        $('#' + id).spectrum({
                            color: color,
                            allowEmpty: true,
                            flat: false,
                            showAlpha: true,
                            showInitial: true,
                            showPalette: false,
                            showInput: true,
                            cancelText: '取消',
                            chooseText: '确定',
                            showButtons: false,
                            preferredFormat: "rgb",
                            clickoutFiresChange: true,
                            replacerClassName: 'webgis-colorpicker',
                            containerClassName: 'webgis-colorpicker'
                        });
                        $('#' + id).next().css('display', 'inline-block');
                        $('#' + id).next().children().css('display', 'inline-block');
                        $('#' + id).next().find('.sp-preview-inner').css('display', 'inline-block');
                        $('#' + id).next().css('width', '32px');
                        $('#' + id).next().css('height', '22px');
                        $('#' + id).next().find('.sp-preview-inner').css('background-color', color);
                        //console.log($('#' + fldid).next().children().css('display'));
                    }
                    
                    if(fld.type == 'checkbox' && fld.group == group)
                    {
                        var checked = false;
                        if(fld.defaultvalue) checked = true;
                        $('#' + 'fieldset_' + uid).append('<' + divorspan + ' style="' + stylewidth + 'margin:' + that.options.margin + 'px;' + newline + '">'
                        + '<' + divorspan + '  style="display:inline-block;width:24px;height:24px;border:0px ' + $.webgis.color.base_color + ' solid;">'
                        + '<input type="checkbox" id="' + fldid + '" name="' + fldid + '" >' + required
                        + '</' + divorspan + '>'
                        + '<label for="' + fldid + '"  style="display:inline-block;text-align:left;width:' + that.options.labelwidth + 'px;">' + fld.display + '</label>'
                        + '</' + divorspan + '>');
                        var id = fldid;
                        $('#' + id).iCheck({
                            checkboxClass: 'icheckbox_flat-green'
                        });
                        if(checked) $('#' + id).iCheck('check');
                    }
                    if(fld.type == 'button' && fld.group == group)
                    {
                        $('#' + 'fieldset_' + uid).append('<' + divorspan + ' style="' + stylewidth + 'margin:' + that.options.margin + 'px;' + newline
                        + '"><label for="' + fldid + '" style="display:inline-block;text-align:right;width:' + that.options.labelwidth + 'px;">' + fld.display + ':</label>'
                        + '<div id="' + fldid + '" name="' + fldid + '" style="display:inline-block;text-align:center;width:' + fld.width + 'px">'  + '</div>'
                        + '</' + divorspan + '>');
                        var id = fldid;
                        if(fld.click){
                            $('#' + id).button({label:fld.defaultvalue});
                            //$('#' + id).off();
                            $('#' + id).on('click', fld.click);
                        }
                    }
                    if(fld.type == 'file' && fld.group == group)
                    {
                        $('#' + 'fieldset_' + uid).append('<' + divorspan + ' style="' + stylewidth + 'margin:' + that.options.margin + 'px;' + newline
                        + '"><label for="' + fldid + '" style="display:inline-block;text-align:right;width:' + that.options.labelwidth + 'px;">' + fld.display + ':</label>'
                        + '<input type="file" id="' + fldid + '" name="' + fldid + '" style="display:inline-block;text-align:center;width:' + fld.width + 'px;"/>'
                        + '</' + divorspan + '>');
                        var id = fldid;
                        if(fld.handleFile){
                            $('#' + id).off();
                            $('#' + id).on('change', fld.handleFile);
                        }
                    }

                    if(fld.type == 'slider' && fld.group == group)
                    {
                        if(fld.is_show === false)
                        $('#' + 'fieldset_' + uid).append('<' + divorspan + ' style="' + stylewidth + ' margin:' + that.options.margin + 'px;' + newline
                        + '"><label for="' + fldid + '_title_" style="display:inline-block;text-align:right;width:' + that.options.labelwidth + 'px; ">' + fld.display + ':'
                        + '</label><label style="width:' + fld.width/4*1 + 'px"  name="' + fldid + '_title_"></label>' 
                        + '<div id="' + fldid + '" style="float:right;width:' + fld.width/4*3 + 'px"></div>'
                        +  '</' + divorspan + '>');
                        var isrange = false;
                        if(fld.is_range === true) isrange = true;
                        var slide = $('#' + fldid).slider({
                            range: isrange,
                            max:100,
                            min:0,
                            values: [ 0, 100 ],
                        });
                        if(fld.defaultvalue && fld.defaultvalue instanceof Array && fld.defaultvalue.length>1) 
                        {
                            $('#' + fldid).slider( "option", "values",  fld.defaultvalue);
                        }
                        if(fld.slide)
                        {
                            var slide = fld.slide;
                            $('#' + fldid).on( "slide", function( event, ui ) {
                                if(isrange)
                                {
                                    slide(ui.values);
                                }
                                else{
                                    slide(ui.value);
                                }
                            });
                        }
                        if(fld.is_show === false)
                        {
                            //$('#' + fldid).hide();
                            $('#' + fldid).parent().hide();
                        }
                    }
                    if(fld.type == 'grid' && fld.group == group)
                    {
                        var provider = 'ligerui';
                        var defaultvalue = '...';
                        if(fld.provider) provider = fld.provider;
                        if(fld.defaultvalue) defaultvalue = fld.defaultvalue;
                        $('#' + 'fieldset_' + uid).append('<div style="' + stylewidth + 'margin:' + that.options.margin + 'px;' + newline
                        + '"><label for="' + fldid + '" style="display:inline-block;text-align:right;width:' + that.options.labelwidth + 'px;">' + fld.display + ':</label>'
                        + '<label for="' + fldid + '" name="' + fldid + '" style="border:1px solid ' + $.webgis.color.base_color + ';text-align:center;width:' + (fld.width-80) + 'px;heihgt:30px;display:inline-block;padding:6px 12px;cursor: pointer;">' + defaultvalue + '</label>'
                        + '<input id="' + fldid + '"name="' + fldid + '" type="file" style="display:none;"/>'
                        + '<div id="' + fldid + '_hasdatatip" style="width:70px;height:22px;margin:2px;float:right;"></div>'
                        + '</div>');
                        if(fld.handleFile){
                            $('#' + fldid).off();
                            $('#' + fldid).on('change', fld.handleFile);
                        }

                    }

                });
            });

            var hide = false;
            var hideparentlist = [];
            for(var i in this.fields)
            {
                var fld = this.fields[i];
                var fldid = prefix + fld.id;
                if(fld.hide && fld.hide === true)
                {
                    hide = true;
                    var group = $('#' + fldid ).parent().parent();
                    group.hide();
                    if(hideparentlist.indexOf(group) < 0)
                    {
                        hideparentlist.push(group);
                    }
                }
            }
            if(hide)
            {
                this.append('<' + divorspan + ' id="' + prefix + '_more_info" style="float:right"><a href="#">更多信息&gt;&gt;</a></' + divorspan + '>');
                $('#' + prefix + '_more_info').off();
                //$('#' + prefix + '_more_info').hover( function(){
                    //$(this).css('cursor', 'hand');
                //});
                $('#' + prefix + '_more_info').find('a').on('click', function(){
                    for(var i in hideparentlist)
                    {
                        var group = hideparentlist[i];
                        if(group.is(':visible'))
                        {
                            group.hide();
                            $(this).html('更多信息&gt;&gt;');
                        }
                        else
                        {
                            group.show();
                            $(this).html('更多信息&lt;&lt;');
                        }
                    }
                    
                });
            }
            
            
            var fields = this.fields;
            this.validate({
                errorPlacement: function(error, element) {
                    element.tooltipster('update', error.text());
                    element.tooltipster('show');                
                },
                success:function(label, element) {
                    $(element).tooltipster('hide');
                }
                //success:'valid'
            });
            _.forEach(fields, function(fld)
            {
                var fldid = prefix + fld.id;
                if(fld.validate)
                {
                    $('#' + fldid ).rules('add',fld.validate);
                    $('#' + fldid ).tooltipster({ 
                        trigger: 'custom',
                        onlyOne: false, 
                        position: 'right'
                    });
                }
            });
            return this;
        },
        clear : function()
        {
            var data = {};
            var prefix = '';
            var id = this.attr('id')
            if($.fn.webgisform.options[id] && $.fn.webgisform.options[id].prefix) prefix = $.fn.webgisform.options[id].prefix;
            //for(var k in data)
            //{
                //this.find('#' + prefix + k).val(data[k]);
            //}
            var fields = $.fn.webgisform.fields[this.attr('id')];
            for(var k in fields)
            {
                var id = fields[k]['id'];
                var typ = fields[k]['type'];
                var editor = fields[k]['editor'];
                if(typ === 'icon')
                {
                }
                else if(typ === 'color')
                {
                        this.find('#' + prefix + id).spectrum("set", ColorArrayToRgba([255, 255, 255, 255]));
                }
                else if(typ === 'date')
                {
                    //if(data[id])
                    //{
                        //this.find('#' + prefix + id).datepicker("setDate",  data[id]);
                    //}
                }
                else if(typ === 'select')
                {
                    //if(editor && editor.data && editor.data.length>0 && data[id])
                    //{
                        this.find('#' + prefix + id).multipleSelect("setSelects", []);
                    //}
                }
                else if(typ === 'multiselect')
                {
                    //if(editor && editor.data && editor.data.length>0 && data[id] && data[id] instanceof Array)
                    //{
                        this.find('#' + prefix + id).multipleSelect("setSelects", []);
                    //}
                }
                else
                {
                    if(id==='pixel_size' || id==='pixel_width' || id==='label_scale')
                    {
                        //if(data['style'] && data['style'][id])
                        //{
                            this.find('#' + prefix + id).val(0);
                        //}
                    }
                    else
                        this.find('#' + prefix + id).val('');
                }
            }
            return this;
        },
        setdata : function(data)
        {
            var prefix = '';
            var id = this.attr('id')
            if($.fn.webgisform.options[id] && $.fn.webgisform.options[id].prefix) prefix = $.fn.webgisform.options[id].prefix;
            //for(var k in data)
            //{
                //this.find('#' + prefix + k).val(data[k]);
            //}
            var fields = $.fn.webgisform.fields[this.attr('id')];
            for(var k in fields)
            {
                var id = fields[k].id;
                var typ = fields[k].type;
                var editor = fields[k].editor;
                if(typ.indexOf( 'button_') > -1 || typ === 'label' || typ === 'file' || typ === 'grid')
                {
                    continue;
                }
                else if(typ === 'icon')
                {
                    if( data.style && data.style.icon && data.style.icon.uri)
                    {
                        //var cls = 'icon-selector-' + data.webgis_type + ' ui-selectee';
                        //this.find('#' + prefix + id).attr('class', '');
                        //this.find('#' + prefix + id).addClass(cls);
                        this.find('#' + prefix + id).css('background-image', 'url(' + data.style.icon.uri + ')');
                    }
                
                }
                else if(typ === 'color')
                {
                    if(data.style && data.style[id])
                    {
                        this.find('#' + prefix + id).spectrum("set", ColorArrayToRgba(data.style[id]));
                    }
                }
                else if(typ === 'date')
                {
                    if(!_.isUndefined(data[id]))
                    {
                        this.find('#' + prefix + id).datepicker("setDate",  data[id]);
                    }
                }
                else if(typ === 'datetime')
                {
                    if(!_.isUndefined(data[id]))
                    {
                        this.find('#' + prefix + id).datetimepicker("setDate",  data[id]);
                    }
                }
                else if(typ === 'select')
                {
                    if(editor && editor.data && editor.data.length>0 && !_.isUndefined(data[id]))
                    {
                        this.find('#' + prefix + id).multipleSelect("setSelects", [data[id]]);
                    }
                }
                else if(typ === 'multiselect')
                {
                    if(editor && editor.data && editor.data.length>0 && !_.isUndefined(data[id]) && data[id] instanceof Array)
                    {
                        this.find('#' + prefix + id).multipleSelect("setSelects", data[id]);
                    }
                }
                else if(typ === 'slider')
                {
                    if( !_.isUndefined(data[id]) && data[id] instanceof Array)
                    {
                        this.find('#' + prefix + id).slider( "option", "values", data[id] );
                        this.find('label[name=' + prefix + id + '_title_]').html(data[id][0] + ' - ' + data[id][1] + ' km/h');
                    }
                }
                else if(!_.isUndefined(data[id]))
                {
                    if(id==='pixel_size' || id==='pixel_width' || id==='label_scale')
                    {
                        if(data['style'] && data['style'][id])
                        {
                            this.find('#' + prefix + id).val(data['style'][id]);
                        }
                    }
                    else
                        this.find('#' + prefix + id).val(data[id]);
                }
            }
            return this;
        },
        getdata:function()
        {
            var isInt = function(n){
                return typeof n== "number" && isFinite(n) && n%1===0;
            }            
            var prefix = '';
            if($.fn.webgisform.options[this.attr('id')].prefix) prefix = $.fn.webgisform.options[this.attr('id')].prefix;
            var fields = $.fn.webgisform.fields[this.attr('id')];
            var ret = {};
            for(var k in fields)
            {
                var id = fields[k]['id'];
                var typ = fields[k]['type'];
                if(typ === 'button' || typ === 'label' || typ === 'file' || typ === 'grid')
                {
                    continue;
                }
                else if(typ === 'icon')
                {
                    if(!ret['style']) ret['style'] = {};
                    if(!ret['style']['icon']) ret['style']['icon'] = {};
                    var c = this.find('#' + prefix + id).attr('class').replace('icon-selector-', '').replace(' ui-selectee', '');
                    var icon_img = GetDefaultStyleValue(c, 'icon_img');
                    ret['style']['icon']['uri'] = icon_img;
                }
                else if(typ === 'color')
                {
                    if(!ret['style']) ret['style'] = {};
                    ret['style'][id] = ColorRgbaToArray(this.find('#' + prefix + id).spectrum("get").toRgbString());
                }
                else if(typ === 'date')
                {
                    ret[id] = this.find('#' + prefix + id).datepicker("getDate");
                }
                else if(typ === 'datetime')
                {
                    ret[id] = this.find('#' + prefix + id).datetimepicker("getDate");
                }
                else if(typ === 'spinner')
                {
                    if(id==='pixel_size' || id==='pixel_width' || id==='label_scale')
                    {
                        var v = this.find('#' + prefix + id).val();
                        if(v>0)
                        {
                            if(isInt(v)) 
                            {
                                ret['style'][id]  = parseInt(v);
                            }else
                            {
                                ret['style'][id] = parseFloat(v);
                            }
                        }
                    }
                    else
                    {
                        ret[id] = this.find('#' + prefix + id).val();
                        if(ret[id].length>0)
                        {
                            if(isInt(ret[id])) 
                            {
                                ret[id] = parseInt(ret[id]);
                            }else
                            {
                                ret[id] = parseFloat(ret[id]);
                            }
                        }else
                            delete ret[id] ;
                    }
                }
                else if(typ === 'select')
                {
                    ret[id] = null;
                    var arr = this.find('#' + prefix + id).multipleSelect("getSelects");
                    if(arr.length>0)
                    {
                        ret[id] = arr[0];
                    }
                }
                else if(typ === 'multiselect')
                {
                    ret[id] = this.find('#' + prefix + id).multipleSelect("getSelects");
                }
                else if(typ === 'slider')
                {
                    ret[id] = this.find('#' + prefix + id).slider( "option", "values" );
                }
                else
                {
                    ret[id] = this.find('#' + prefix + id).val();
                }
            }
            return ret;
        },
        get:function(id)
        {
            var prefix = '';
            var ret ;
            if($.fn.webgisform.options[this.attr('id')] && $.fn.webgisform.options[this.attr('id')].prefix)
            {
                prefix = $.fn.webgisform.options[this.attr('id')].prefix;
                ret = this.find('#' + prefix + id);
            }
            return ret;
        },
        set:function(id, value)
        {
            var prefix = '';
            if($.fn.webgisform.options[this.attr('id')].prefix) prefix = $.fn.webgisform.options[this.attr('id')].prefix;
            var ret = this.find('#' + prefix + id);
            if(ret.length>0)
            {
                ret.val(value);
            }
            return this;
        }
        //getdefaultvalue:function(fld_id)
        //{
            //var id = this.attr('id');
            //var prefix = '';
            //if($.fn.webgisform.options[id].prefix) prefix = $.fn.webgisform.options[id].prefix;
            //var ret = null;
            //for(var i in $.fn.webgisform.fields[id])
            //{
                //var fld = $.fn.webgisform.fields[id][i];
                //if(fld.id === fld_id)
                //{
                    //if(fld.type === 'text')
                    //{
                        //ret = '(无)';
                    //}
                    //if(fld.type === 'spinner')
                    //{
                        //ret = fld.min;
                    //}
                    //if(fld.type === 'date')
                    //{
                        
                    //}
                    //break;
                //}
            //}
            //return ret;
        //}
    };    
    $.fn.webgisform = function(fields, options) 
    {
        if ( methods[fields] ) {
            return methods[ fields ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof fields === 'object' || ! fields ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  fields + ' does not exist on $.webgisform');
        }        
        
    };
    $.fn.webgisform.defaults = {
        divorspan:"div",
        labelwidth : 90,
        margin : 10.0/2,
        groupmargin : 18.0/2,
        iconsource:[]
    };
}

function ColorArrayToRgba(array)
{
    var ret = 'rgba(255,255,255,1)';
    if(array.length == 4 && Math.floor(array[0])<256  && Math.floor(array[1])<256  && Math.floor(array[2])<256  && Math.floor(array[3])<256 )
    {
        ret = 'rgba(' + Math.floor(array[0]) + ', ' +  Math.floor(array[1]) + ', ' +  Math.floor(array[2]) + ', ' +  (array[3]/256) + ')';
    }
    return ret;
}


function GetDefaultStyleValue(type, stylename)
{
    var mapping = $.webgis.mapping.style_mapping[type];
    //if(type.indexOf('point_')>-1) mapping = g_style_point_mapping[type];
    //if(type.indexOf('polyline_')>-1) mapping = g_style_polyline_mapping[type];
    //if(type.indexOf('polygon_')>-1) mapping = g_style_polygon_mapping[type];
    var ret = [255, 0, 0, 128];
    if(stylename==='pixelSize' ) ret = 3;
    if(stylename==='outlineWidth') ret = 1;
    if(stylename==='labelScale') ret = 1;
    if(stylename==='width') ret = 1;
    //console.log(type);
    //console.log(mapping);
    //console.log(stylename);
    if(mapping[stylename]) ret = mapping[stylename];
    return ret;
}

function ColorRgbaToArray(rgbastr)
{
    var c = tinycolor(rgbastr);
    //var a = Math.floor(c.getAlpha()*256-1);
    var rgba = c.toRgb();
    return [rgba.r, rgba.g, rgba.b, Math.floor(rgba.a*256-1)];
}

function ColorArrayToHTMLColor(array)
{
    var rgbastr = ColorArrayToRgba(array)
    var c = tinycolor(rgbastr);
    var ret = c.toHexString();
    return ret;
}


function MongoFind(data, success, host)
{
    //$.ajaxSetup( { "async": true, scriptCharset: "utf-8" , contentType: "application/json; charset=utf-8" } );
    var h = '';
    if(host) h = host;
    var url = h + 'post';
    if(data.url) url = h + data.url;
    //console.log(data);
    $.post(url, encodeURIComponent(JSON.stringify(data)), function( data1 ){
        //console.log(data1);

        ret = JSON.parse(decodeURIComponent(data1));
        if(success)
        {
            success(ret);
        }
    }, 'text');
}

function GridFsFind(data, success, isdownload)
{
    //$.ajaxSetup( { "async": true, scriptCharset: "utf-8" , contentType: "application/json; charset=utf-8" } );
    //console.log(data);
    if(isdownload)
    {
        $.get('get', data, function( data1 ){
            success(data1);
        });
    }else
    {
        $.getJSON('get', data, function( data1 ){
            success(data1);
        });
    }
}

function ReadTable(url, success, failed)
{
    $.ajaxSetup( { "async": true, scriptCharset: "utf-8" , contentType: "application/json; charset=utf-8" } );
    $.getJSON( url)
    .done(function( data ){
        success(data);
    })
    .fail(function( jqxhr ){
        failed();
    });    
}


function ShowProgressBar(show, width, height, title, msg, interval)
{
    if(show && $('#dlg_progress_bar').length) {
        return;
    }
    if(_.isUndefined(interval)){
        interval = 100;
    }
    $('#dlg_progress_bar').remove();
    if(show)
    {
        $('body').append('<div id="dlg_progress_bar"></div>');
        $('#dlg_progress_bar').append('<div id="div_progress_msg"></div>');
        $('#dlg_progress_bar #div_progress_msg').html(msg);
        $('#dlg_progress_bar').append('<div id="div_progress_bar"><span class="progressbartext" ></span></div>');
        
        $('#dlg_progress_bar').dialog({
            width: width,
            height: height,
            draggable: false,
            resizable: false, 
            modal: true,
            title:title
        });
        $.webgis.progress_value = 0;
        $('#div_progress_bar').progressbar({
            max:100,
            value:0
        });
        clearInterval($.webgis.progress_interval);
        $.webgis.progress_interval = setInterval(function(){
            $.webgis.progress_value += 1;
            if($.webgis.progress_value > 100) $.webgis.progress_value = 100;
            try
            {
                $('#div_progress_bar').progressbar('value', $.webgis.progress_value);
                $("#div_progress_bar span.progressbartext").text($.webgis.progress_value + "%");
            }catch(e)
            {
                clearInterval($.webgis.progress_interval);
            }
        }, interval);
    }
    else{
        //document.body.className = document.body.className.replace(/(?:\s|^)loading(?:\s|$)/, ' ');
        clearInterval($.webgis.progress_interval);
        try
        {
            $('#div_progress_bar').progressbar('destroy');
            $('#dlg_progress_bar').dialog('close');
        }catch(e)
        {
        }
    }
}

function ShowConfirm(id, width, height, title, msg, ok, cancel, thumbnail)
{
    if(thumbnail)
    {
        var s = '<div style="vertical-align: middle;line-height: ' + 40 + 'px;">' + msg  + '</div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + '<img  src="data:' + thumbnail.mimetype + ';base64,' + thumbnail.data + '" />';
        if(id)
        {
            $('#' + id ).empty();
            $('#' + id ).append('<div></div>');
            $('#' + id + ' div').html(s);
        }else
        {
            id = 'dlgconfirmdynamic';
            $('body').append('<div id="' + id + '"><div></div></div>');
            $('#' + id + ' div').html(s);
        }
    }else
    {
        if(id)
        {
            $('#' + id ).empty();
            $('#' + id ).append('<div></div>');
            $('#' + id + ' div').html(msg);
        }else
        {
            id = 'dlgconfirmdynamic';
            $('body').append('<div id="' + id + '"><div></div></div>');
            $('#' + id + ' div').html(msg);
        }
    }
    $('#' + id).dialog({
        title:title,
        closeOnEscape: false,
        modal:true,
        draggable:true,
        width:width,
        height:height,
        buttons: [ 
            {      text: "确定", 
                click: function() { 
                    $( this ).dialog( "close" ); 
                    $('#dlgconfirmdynamic').remove();
                     if(ok) ok();
                }
            },
            {    text: "取消", 
                click: function() { 
                    $( this ).dialog( "close" );
                    $('#dlgconfirmdynamic').remove();
                    if(cancel) cancel();
                } 
            }]
    });
}

function GetDisplayLatLngString(ellipsoid, cartesian, precision) 
{
    if(!cartesian) return "";
    var cartographic = ellipsoid.cartesianToCartographic(cartesian);
    if(cartographic.longitude &&  cartographic.latitude)
    {
        var height = 0;
        if(Math.abs(cartographic.height) > Cesium.Math.EPSILON1) height =  Math.floor(cartographic.height);
        var s = "(" + Cesium.Math.toDegrees(cartographic.longitude).toFixed(precision || 3) + ", " + Cesium.Math.toDegrees(cartographic.latitude).toFixed(precision || 3) + ")";
        if($.webgis.config.zaware)
        {
            s =  "(" + Cesium.Math.toDegrees(cartographic.longitude).toFixed(precision || 3) + ", " + Cesium.Math.toDegrees(cartographic.latitude).toFixed(precision || 3) + ", " + height + ")";
        }
        return s;
    }else
    {
        return "";
    }
}


function GetDisplayLatLngString2D(latlng, precision) 
{
    if(!latlng) return "";
    var s = "(" + latlng.lng.toFixed(precision || 3) + ", " + latlng.lat.toFixed(precision || 3) + ")";
    return s;
}

function ShowMessage(id, width, height, title, msg, ok)
{
    if(id)
    {
        $('#' + id ).empty();
        $('#' + id ).append('<div></div>');
        $('#' + id + ' div').html(msg);
    }else
    {
        id = 'dlgmsgdynamic';
        $('body').append('<div id="' + id + '"><div></div></div>');
        $('#' + id + ' div').html(msg);
    }
    console.log(msg);

    $('#' + id).dialog({
        title:title,
        closeOnEscape: false,
        modal:true,
        draggable:true,
        width:width,
        height:height,
        buttons: [ 
            {      text: "确定", 
                click: function() { 
                    $( this ).dialog( "close" );
                    $('#dlgmsgdynamic').remove();
                    if(ok) ok();
                }
            }]
    });
}

function GetZfromXY(lng, lat, callback)
{
    //$.ajaxSetup( { "async": true, scriptCharset: "utf-8" , contentType: "application/json; charset=utf-8" } );
    var data = {op:'alt', lng:lng, lat:lat};
    $.post('post', encodeURIComponent(JSON.stringify(data)), function( data1 ){
        ret = JSON.parse(decodeURIComponent(data1));
        callback(ret);
    }, 'text');
}

function GetZListfromXYList(list, callback)
{
    //$.ajaxSetup( { "async": true, scriptCharset: "utf-8" , contentType: "application/json; charset=utf-8" } );
    var data = {op:'alt', data:list};
    $.post('post', encodeURIComponent(JSON.stringify(data)), function( data1 ){
        ret = JSON.parse(decodeURIComponent(data1));
        callback(ret);
    }, 'text');
}

function ShowGeoTip(id, position, msg)
{
    //try{
        //$('div[id^=geotipinfo_]').tooltipster('destroy');
    //}catch(e) {}
    $('div[id^=geotipinfo_]').remove();
    
    if(id)
    {
        //$('body').append('<div class="twipsy right" style="position: absolute;top:' + position.y + 'px;left:' + position.x + 'px" id="geotipinfo_' + id + '"><div class="twipsy-arrow"></div><div class="twipsy-inner">' + msg + '</div></div>');
        //$('#geotipinfo_' + id ).tooltipster({ 
            //contentAsHTML: true,
            //animation: 'fade',//fade, grow, swing, slide, fall
            //trigger: 'custom',
            //onlyOne: true, 
            //position: 'top-right',//right, left, top, top-right, top-left, bottom, bottom-right, bottom-left
            ////theme: 'tooltipster-noir',
            //offsetX: 0,
            //offsetY: 0
        //});
        
        $('body').append('<div class="qtip-content ui-widget-content" style="position: absolute;top:' + position.y + 'px;left:' + (position.x + 20) + 'px" id="geotipinfo_' + id + '">' + msg + '</div>');
        //$('#geotipinfo_' + id ).qtip({ 
            //content: {
                //text: msg
            //}
        //});
    }
}

function PickLngLatFromScreen(viewer, screen_position)
{
    var ellipsoid = viewer.scene.globe.ellipsoid;
    var scene = viewer.scene;
    var ray = scene.camera.getPickRay(screen_position);
    var cartesian = scene.globe.pick(ray, scene);
    //var carto = ellipsoid.cartesianToCartographic(cartesian);
    var s = GetDisplayLatLngString(ellipsoid, cartesian, 6);
    //console.log(s);
    return s;
}

function ToWebMercator(cartographic)
{
    if (Math.abs(cartographic.longitude) > 180 * 0.017453292519943295 || Math.abs(cartographic.latitude) > 90 * 0.017453292519943295)
    {
        return [0.0, 0.0];
    }
    var x = 6378137.0 * cartographic.longitude;
    var y = 3189068.5 * Math.log((1.0 + Math.sin(cartographic.latitude)) / (1.0 - Math.sin(cartographic.latitude)));
    return [x, y];
}


function GetDenomiHeightByModelCode(model_code_height)
{
    var ret;
    if(model_code_height && model_code_height.length>0)
    {
        var idx = model_code_height.lastIndexOf("_");
        var num1 = model_code_height.substr(idx+1);
        var rest = model_code_height.slice(0, idx);
        idx = rest.lastIndexOf("_");
        var num2 = rest.substr(idx+1);
        var h = num2 + '.' + num1;
        ret = parseFloat(h);
    }
    return ret;
}
function GetMCByModelCode(model_code_height)
{
    var ret;
    if(model_code_height && model_code_height.length>0)
    {
        var idx = model_code_height.lastIndexOf("_");
        var rest = model_code_height.slice(0, idx);
        idx = rest.lastIndexOf("_");
        ret= rest.slice(0, idx);
    }
    return ret;
}

function CheckInternetConnection()
{
    return CheckUrlExist('http://www.baidu.com');
}
function CheckIntranetConnection()
{
    return CheckUrlExist('http://' + $.webgis.remote.host + ':' + $.webgis.remote.port);
}


function CheckUrlExist(url)
{
    var ret = false;
    try
    {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        if(http.status>= 200 && http.status < 304)
        {
            ret = true;
        }else
        {
            ret = false;
        }
    }catch(e){
        ret = false;
    }
    return ret;
}


function get_geojson_center(geojson)
{
    var ret = [];
    if(geojson.geometry.type === 'Point')
    {
        ret.push(geojson.geometry.coordinates[0]);
        ret.push(geojson.geometry.coordinates[1]);
    }
    else if(geojson.geometry.type === 'LineString')
    {
        var idx = Math.floor(geojson.geometry.coordinates.length/2);
        ret.push(geojson.geometry.coordinates[idx][0]);
        ret.push(geojson.geometry.coordinates[idx][1]);
    }
    else if(geojson.geometry.type === 'Polygon')
    {
        var x=0, y=0;
        for(var i in geojson.geometry.coordinates[0])
        {
            x += geojson.geometry.coordinates[0][i][0];
            y += geojson.geometry.coordinates[0][i][1];
        }
        ret.push(x/geojson.geometry.coordinates[0].length);
        ret.push(y/geojson.geometry.coordinates[0].length);
    }
    return ret;
}

