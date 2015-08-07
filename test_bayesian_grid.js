$.webgis.data.bbn = {};
$.webgis.data.bbn.control = {};
$.webgis.data.bbn.grid_data = [];
$.webgis.data.bbn.domains_range = [];

    //{value:true, name: '真'},
    //{value:false, name: '假'},
    //{value:'I', name: 'I级'},
    //{value:'II', name: 'II级'},
    //{value:'III', name: 'III级'},
    //{value:'IV', name: 'IV级'},
    //{value:'high', name: '高'},
    //{value:'low', name: '低'},
    //{value:'medium', name: '中'},


function BuildComboConditions(master, nodes)
{
    var ret =  $.extend(true, {}, master);
    ret.conditions = [];
    if(nodes.length)
    {
        var l = [];
        _.forEach(nodes, function (node) {
            var l2 = [];
            _.forEach(node.domains, function (domain) {
                l2.push([node.name, domain])
            });
            l.push(l2);
        });
        var cp = Combinatorics.cartesianProduct.apply(this, l);
        cp = cp.toArray();
        _.forEach(cp, function (item) {
            var list1 = [];
            list1.push(item);
            var o = {};
            _.forEach(master.domains, function (domain) {
                o[domain] = 0.0;
            });
            list1.push(o);
            ret.conditions.push(list1);
        });
    }else
    {
        var o = {};
        _.forEach(master.domains, function (domain) {
            o[domain] = 0.0;
        });
        ret.conditions.push([[],o]);
    }
    return ret;
}
var ProbabilityFloatFormat = function(value, digit)
{
    if(_.isUndefined(digit)){
        digit = 2;
    }
    if(!_.isNumber(value))
    {
        value = parseFloat(value);
    }
    return value.toFixed(digit);
}

function BuildTableList(list)
{
    var get_id = function(name)
    {
        return _.result(_.find(list, {name:name}), '_id');

    };
    var get_disp_name = function(name)
    {
        return _.result(_.find(list, {name:name}), 'display_name');
    };
    var get_value_disp = function(value)
    {
        var ret = value;
        if(value === 'true') value = true;
        if(value === 'false') value = false;
        var name = _.result(_.find($.webgis.data.bbn.domains_range, {value:value}), 'name');
        if(name){
            ret = name;
        }
        return ret;
    };
    var ret = [];
    //var list = [
    //    {_id:111,   name:'name1', display_name:'显示名称1',
    //        children:[
    //        {
    //            cond_name: 'cond_name1,cond_name2',
    //            children: [
    //                {  cond_name: 'cond_name1', cond_display_name: '条件显示名称1', cond_value: 'cond_value1'},
    //                {  cond_name: 'cond_name2', cond_display_name: '条件显示名称2', cond_value: 'cond_value2'},
    //            ]
    //        },
    //        {
    //            event: 'value1', probability: '<a href="javascript:void(0)">0.3333</a>',
    //        },
    //        {
    //            event: 'value2', probability: '<a href="javascript:void(0)">0.2222</a>',
    //        },
    //        {
    //            event: 'value3', probability: '<a href="javascript:void(0)">0.4444</a>',
    //        },
    //        {
    //            event: 'value4', probability: '<a href="javascript:void(0)">0.5555</a>',
    //        }
    //        ]
    //    }
    //];
    _.forEach(list, function(node){
        var o = {};
        o._id = node._id;
        o.name = node.name;
        o.display_name = node.display_name;
        o.children = [];
        o.op = '<a id="bbnnodegridrowadd|' + node._id + '" href="javascript:void(0);">新增</a>';
        o.op += '&nbsp;<a id="bbnnodegridrowremove|' + node._id + '" href="javascript:void(0);">删除</a>';
        o.op += '&nbsp;<a id="bbnnodegridcondmodify|' + node._id + '" href="javascript:void(0);">修改关联条件</a>';
        //o.op += '&nbsp;<a id="bbnnodegridcondremove|' + node._id + '" href="javascript:void(0);">删除条件</a>';
        if(node.conditions && node.conditions.length)
        {
            if(node.conditions[0][0].length === 0)
            {
                _.forIn(node.conditions[0][1], function(v, k){
                    o.children.push({event:get_value_disp(k), probability:'<a title="点击开始编辑" id="probabilityhref|_id@' + node._id + '||event:' + k + '" href="javascript:void(0)" data-value="' + v + '">' + ProbabilityFloatFormat(v) + '</a>'});
                });
            }
            else{
                _.forEach(node.conditions, function(item){
                    var o1 = {};
                    o1.cond_name = _.map(item[0], function(item1){
                        return item1[0];
                    }).join(',');
                    o1.children = [];
                    var pairlist = [];
                    _.forEach(item[0], function(item1){
                        o1.children.push({cond_name:item1[0], cond_display_name:get_disp_name(item1[0]), cond_value:get_value_disp(item1[1])});
                        pairlist.push( item1[0] + ':' + item1[1] );
                    });
                    pairlist = pairlist.join(',');
                    o.children.push(o1);
                    _.forIn(item[1], function(v, k){
                        o.children.push({event:get_value_disp(k), probability:'<a title="点击开始编辑" id="probabilityhref|_id@' + node._id + '|' + pairlist + '|event:' + k + '" href="javascript:void(0)" data-value="' + v + '">' + ProbabilityFloatFormat(v) + '</a>'});
                    });
                });
            }
        }
        ret.push(o);
    });
    return ret;
}

function test_data()
{
    var name1 = {
        _id:'1111',
        name : 'name1',
        display_name:'显示名称1',
        domains:[true, false],
        conditions:[
            [[],{
                true:0.02,
                false:0.92
            }]
        ]
    };

    var name2 = {
        _id:'2222',
        name : 'name2',
        display_name:'显示名称2',
        domains:[true, false],
        conditions:[
            [[],{
                true:0.4,
                false:0.6
            }]
        ]
    };

    var name3 = {
        _id:'3333',
        name : 'name3',
        display_name:'显示名称3',
        domains:['str1', 'str2', 'str3'],
        conditions:[
            [[],{
                'str1':0.2,
                'str2':0.8
            }]
        ]
    };

    var name4 = {
        _id:'4444',
        name : 'name4',
        display_name:'显示名称4',
        value_type:'array',
        //domains:[true, false],
        domains:['str3', 'str4', 'str5'],
        conditions:[]
    };
    name4 = BuildComboConditions(name4, [name1, name2, name3]);
    return [name1, name2, name3, name4];
}

function QueryBBNDomainsRange(callback)
{
    ShowProgressBar(true, 670, 200, '查询', '正在查询，请稍候...');
    $.ajax({
        url: '/bayesian/query/domains_range',
        method: 'post',
        data: JSON.stringify({})
    })
    .always(function () {
        ShowProgressBar(false);
    })
    .done(function (data1) {
        $.webgis.data.bbn.domains_range = JSON.parse(data1);
        if(callback) callback();
    })
    .fail(function (jqxhr, textStatus, e) {
        $.jGrowl("查询失败:" + e, {
            life: 2000,
            position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
            theme: 'bubblestylefail',
            glue: 'before'
        });
    });
}
function BBNNodeGridLoadData(viewer, data)
{
    var tabledata = {Rows: BuildTableList(data)};
    if(_.isUndefined($.webgis.data.bbn.control.node_grid))
    {
        var columns = [
            //{ display: '操作', isSort: false, width: 100, render: function (rowdata, rowindex, value)
            //    {
            //        var h = "";
            //        if (!rowdata._editing)
            //        {
            //            h += "<a href='javascript:BBNNodeGridBeginEdit(" + rowindex + ")'>修改</a> ";
            //            h += "<a href='javascript:BBNNodeGridDeleteRow(" + rowindex + ")'>删除</a> ";
            //        }
            //        else
            //        {
            //            h += "<a href='javascript:BBNNodeGridEndEdit(" + rowindex + ")'>提交</a> ";
            //            h += "<a href='javascript:BBNNodeGridCancelEdit(" + rowindex + ")'>取消</a> ";
            //        }
            //        return h;
            //    }
            //},
            {display:'', name:'_id', width: 1, hide: true},
            {display:'结点名', name:'name', width: 100},
            {display:'结点显示名称', name:'display_name', width: 100},
            //{display:'结点概率取值类型', name:'value_type', width: 200,
            //    editor: {
            //        type: 'select',
            //        data: [{value_type:'boolean',text:'布尔型(真/假)'},{value_type:'array',text:'字符串数组'}],
            //        valueField: 'value_type'
            //    }
            //},
            {display:'条件名称', name:'cond_name', width: 100},
            {display:'条件显示名称', name:'cond_display_name', width: 100},
            {display:'条件取值', name:'cond_value', width: 100,
                editor: {
                    type: 'select',
                    data: [{value:'cond_value1',text:'cond_value1'},{value:'cond_value2',text:'cond_value2'}],
                    valueField: 'value'
                }
            },
            {display:'结点事件分类', name:'event', width: 100},
            {display:'结点事件概率值', name:'probability', width: 100},
            {display:'操作', name:'op', width: 200},
        ];
        $.webgis.data.bbn.control.node_grid = $('#div_grid').ligerGrid({
            columns: columns,
            data: tabledata,
            enabledEdit: true,
            clickToEdit: false,
            //checkbox: true,
            tree: { columnName: 'event' },
            pageSize: 10
        });
    }else {
        $.webgis.data.bbn.control.node_grid.loadData(tabledata);
    }
    $.webgis.data.bbn.control.node_grid.collapseAll();
    $('a[id^=probabilityhref]').off();
    $('a[id^=probabilityhref]').on('click', function(){
        var id = $(this).attr('id');
        var value = $(this).attr('data-value');
        ShowBBNProbabilityEditDialog(viewer, id, value);
    });
    $('a[id^=bbnnodegridrowadd]').off();
    $('a[id^=bbnnodegridrowadd]').on('click', function(){
        ShowBBNNodeGridAddDialog(viewer);
    });
    $('a[id^=bbnnodegridrowremove]').off();
    $('a[id^=bbnnodegridrowremove]').on('click', function(){
        var id = $(this).attr('id').split('|')[1];
        var name = _.result(_.find($.webgis.data.bbn.grid_data, {_id:id}), 'display_name');
        ShowConfirm(null, 500, 200,
            '删除确认',
            '确认删除[' + name + ']吗?',
            function () {
                _.remove($.webgis.data.bbn.grid_data, {_id:id});
                BBNNodeGridLoadData(viewer, $.webgis.data.bbn.grid_data);
            },
            function () {

            }
        );
    });
    $('a[id^=bbnnodegridcondmodify]').off();
    $('a[id^=bbnnodegridcondmodify]').on('click', function(){
        var id = $(this).attr('id').split('|')[1];
        //console.log(id);
        ShowBBNNodeGridConditionModifyDialog(viewer, id);
    });
    //$('a[id^=bbnnodegridcondremove]').off();
    //$('a[id^=bbnnodegridcondremove]').on('click', function(){
    //    var id = $(this).attr('id').split('|')[1];
    //    console.log(id);
    //});
}

function ShowBBNNodeGridConditionModifyDialog(viewer, id)
{
    var valid_data = function(formdata)
    {
        var ret = false;
        if(formdata.conditions.length)
        {
            ret = true;
        }
        return ret;
    };
    CreateDialogSkeleton(viewer, 'dlg_state_examination_bbn_node_grid_condition_add');
	$('#dlg_state_examination_bbn_node_grid_condition_add').dialog({
		width: 520,
		height: 350,
		minWidth:200,
		minHeight: 200,
		draggable: true,
		resizable: true,
		modal: false,
		position:{at: "center"},
		title:'新增条件',
		close: function(event, ui){
		},
		show: {
			effect: "blind",
			//direction: "right",
			duration: 200
		},
		hide: {
			effect: "blind",
			//direction: "right",
			duration: 200
		},
		buttons:[
			{
				text: "取消",
				click: function(e){
					$( this ).dialog( "close" );
				}
			},
			{
				text: "确定",
				click: function(e){
                    var formdata = $('#form_state_examination_bbn_node_grid_condition_midify').webgisform('getdata');
                    var idx = _.findIndex($.webgis.data.bbn.grid_data, '_id', id);
                    if(idx > -1)
                    {
                        var o = _.find($.webgis.data.bbn.grid_data, {_id: id});
                        var condlist = [];
                        _.forEach(formdata.conditions, function(condname){
                            var cond = _.find($.webgis.data.bbn.grid_data, {name: condname});
                            if(cond){
                                condlist.push(cond);
                            }
                        });
                        o = BuildComboConditions(o, condlist);
                        $.webgis.data.bbn.grid_data[idx] = o;
                        BBNNodeGridLoadData(viewer, $.webgis.data.bbn.grid_data);
                    }
                    $(this).dialog("close");
				}
			}
		]
	});

    var selfname = _.result(_.find($.webgis.data.bbn.grid_data, {_id:id}), 'name');
    var conditions = _.result(_.find($.webgis.data.bbn.grid_data, {_id:id}), 'conditions');
    var defaultvalue = [];
    if(conditions.length && conditions[0].length && conditions[0][0].length)
    {
        _.forEach(conditions[0][0], function(item){
            defaultvalue.push(item[0]);
        });
    }
    var arr = _.map($.webgis.data.bbn.grid_data, function(item){
        return {label:item.display_name, value:item.name};
    });
    var condlist = _.filter(arr, function(item){
        return (item.value != selfname) && !_.startsWith(item.value, 'unit_');
    });
    var flds = [
        { display: "可选择条件", id: "conditions", newline: true, type: "multiselect", editor: { data:  condlist}, defaultvalue:defaultvalue,  group: '选择条件结点', width: 250, labelwidth: 120, validate:{required:true}},
    ];

	$('#form_state_examination_bbn_node_grid_condition_midify').webgisform(flds, {
		prefix: "form_state_examination_bbn_node_grid_condition_midify_",
		maxwidth: 430
		//margin:10,
		//groupmargin:10
	});

}
function ShowBBNNodeGridAddDialog(viewer)
{
    var valid_data = function(formdata)
    {
        var ret = false;
        if(formdata.domains.length)
        {
            ret = true;
        }
        return ret;
    };
    var trans_boolean = function(formdata)
    {
        if(_.isString(formdata))
        {
            if (formdata === 'true') {
                formdata = true;
            }
            if (formdata === 'false') {
                formdata = false;
            }
        }
        else if(_.isArray(formdata)){
            formdata = _.map(formdata, function (item) {
                return trans_boolean(item);
            });
        }
        else if(_.isPlainObject(formdata))
        {
            _.forIn(formdata, function (v, k) {
                formdata[k] = trans_boolean(v);
            });
        }
        return formdata;
    };
    CreateDialogSkeleton(viewer, 'dlg_state_examination_bbn_node_grid_node_add');
	$('#dlg_state_examination_bbn_node_grid_node_add').dialog({
		width: 520,
		height: 500,
		minWidth:200,
		minHeight: 200,
		draggable: true,
		resizable: true,
		modal: false,
		position:{at: "center"},
		title:'新增事件结点',
		close: function(event, ui){
		},
		show: {
			effect: "blind",
			//direction: "right",
			duration: 200
		},
		hide: {
			effect: "blind",
			//direction: "right",
			duration: 200
		},
		buttons:[
			{
				text: "取消",
				click: function(e){
					$( this ).dialog( "close" );
				}
			},
			{
				text: "确定",
				click: function(e){
                    if($('#form_state_examination_bbn_node_grid_node_add').valid()) {
                        var formdata = $('#form_state_examination_bbn_node_grid_node_add').webgisform('getdata');
                        if (valid_data(formdata)) {
                            formdata = trans_boolean(formdata);
                            var nullcount = $.webgis.data.bbn.grid_data.length;
                            formdata._id = 'null_' + (nullcount + 1);
                            var o = {};
                            _.forEach(formdata.domains, function(item){
                                o[item] = 0.0;
                            });
                            formdata.conditions = [[[],o]];
                            console.log(formdata);
                            $.webgis.data.bbn.grid_data.push(formdata);
                            BBNNodeGridLoadData(viewer, $.webgis.data.bbn.grid_data);
                            $(this).dialog("close");
                        }
                    }
				}
			}
		]
	});

    var domainlist = _.map($.webgis.data.bbn.domains_range, function(item){
        return {label:item.name, value:item.value};
    });
    var flds = [
        { display: "节点名称", id: "name", newline: true, type: "text",  defaultvalue: '', group: '节点信息', width: 250, labelwidth: 120, validate:{required:true}},
        { display: "显示名称", id: "display_name", newline: true, type: "text",  defaultvalue: '', group: '节点信息', width: 250, labelwidth: 120, validate:{required:true}},
        { display: "事件取值范围", id: "domains", newline: true, type: "multiselect", editor: { data:  domainlist}, defaultvalue: [true, false], group: '节点信息', width: 250, labelwidth: 120, validate:{required:true}},
        { display: "节点描述", id: "description", newline: true, type: "textarea",  defaultvalue: '', group: '节点信息', width: 250, height:200, labelwidth: 120},
    ];

	$('#form_state_examination_bbn_node_grid_node_add').webgisform(flds, {
		prefix: "form_state_examination_bbn_node_grid_node_add_",
		maxwidth: 430
		//margin:10,
		//groupmargin:10
	});

}

function CreateDialogSkeleton(viewer, dlg_id)
{
    if ($('#' + dlg_id).length === 0)
    {
        if (dlg_id === 'dlg_state_examination_bbn_probability_edit')
        {
            $(document.body).append('\
			<div id="dlg_state_examination_bbn_probability_edit" >\
				<form id="form_state_examination_bbn_probability_edit"></form>\
			</div>');
        }
        if (dlg_id === 'dlg_state_examination_bbn_node_grid_node_add')
        {
            $(document.body).append('\
			<div id="dlg_state_examination_bbn_node_grid_node_add" >\
				<form id="form_state_examination_bbn_node_grid_node_add"></form>\
			</div>');
        }
        if (dlg_id === 'dlg_state_examination_bbn_node_grid_condition_add')
        {
            $(document.body).append('\
			<div id="dlg_state_examination_bbn_node_grid_condition_add" >\
				<form id="form_state_examination_bbn_node_grid_condition_midify"></form>\
			</div>');
        }
    }
}

function ShowBBNProbabilityEditDialog(viewer, id, value)
{
    var valid_probability = function(formdata)
    {
        var ret = true;
        if(formdata.type === '0'){
            var v = parseFloat(formdata.probability);
            if(_.isNaN(v)){
                ShowMessage(null, 400, 250, '格式错误', '请输入0-1之间的实数.');
                ret = false;
            }else if(v>1 || v<0){
                ShowMessage(null, 400, 250, '格式错误', '请输入0-1之间的实数.');
                ret = false;
            }
        }
        if(formdata.type === '1'){
            var v1 = parseFloat(formdata.total);
            var v2 = parseFloat(formdata.count);
            if(_.isNaN(v1) || _.isNaN(v2)){
                ShowMessage(null, 400, 250, '格式错误', '请输入0-1000000之间的整数.');
                ret = false;
            }else if(v1 < v2){
                ShowMessage(null, 400, 250, '错误', '频次数必须小于等于总数.');
                ret = false;
            }
        }
        return ret;
    }
    CreateDialogSkeleton(viewer, 'dlg_state_examination_bbn_probability_edit');
	$('#dlg_state_examination_bbn_probability_edit').dialog({
		width: 520,
		height: 350,
		minWidth:200,
		minHeight: 200,
		draggable: true,
		resizable: true,
		modal: false,
		position:{at: "center"},
		title:'概率编辑',
		close: function(event, ui){
		},
		show: {
			effect: "blind",
			//direction: "right",
			duration: 200
		},
		hide: {
			effect: "blind",
			//direction: "right",
			duration: 200
		},
		buttons:[
			{
				text: "取消",
				click: function(e){
					$( this ).dialog( "close" );
				}
			},
			{
				text: "确定",
				click: function(e){
                    var formdata = $('#form_state_examination_bbn_probability_edit').webgisform('getdata');
                    if(valid_probability(formdata))
                    {
                        var v = 0;
                        if(formdata.type === '0'){
                            v = parseFloat(formdata.probability);
                        }
                        if(formdata.type === '1'){
                            v = parseFloat(formdata.count)/parseFloat(formdata.total);
                        }
                        SetBBNNodeGridData(viewer, id, ProbabilityFloatFormat(v));
                        $(this).dialog("close");
                    }
				}
			}
		]
	});
    var switch_type = function(typ)
    {
        $('#form_state_examination_bbn_probability_edit_probability').closest('fieldset').hide();
        $('#form_state_examination_bbn_probability_edit_total').closest('fieldset').hide();
        if(typ === '0')
        {
            $('#form_state_examination_bbn_probability_edit_probability').closest('fieldset').show();
        }
        if(typ === '1')
        {
            $('#form_state_examination_bbn_probability_edit_total').closest('fieldset').show();
        }
    };
    var flds = [
        { display: "输入类型", id: "type", newline: true, type: "select", editor: { data: [{label:'直接输入概率',value:'0'},{label:'输入频次和总数',value:'1'}] }, defaultvalue: '0', group: '类型', width: 250, labelwidth: 120,
			change:function(data1){
                switch_type(data1);
			}
		},
        { display: "概率", id: "probability", newline: true, type: "spinner", min:0.0, max:1.0, step:0.01, defaultvalue: ProbabilityFloatFormat(value), group: '直接输入概率', width: 250, labelwidth: 120, validate:{number: true, range:[0, 1]}},
        { display: "总数", id: "total", newline: true, type: "spinner", min:0, max:1000000, step:1, defaultvalue: 1000000, group: '输入频次和总数', width: 250, labelwidth: 120, validate:{number: true, range:[0, 1000000]}},
        { display: "频次", id: "count", newline: true, type: "spinner", min:0, max:1000000, step:1, defaultvalue: 0, group: '输入频次和总数', width: 250, labelwidth: 120, validate:{number: true, range:[0, 1000000]}},
    ];
	$('#form_state_examination_bbn_probability_edit').webgisform(flds, {
		prefix: "form_state_examination_bbn_probability_edit_",
		maxwidth: 430
		//margin:10,
		//groupmargin:10
	});
    switch_type('0');
}

function SetBBNNodeGridData(viewer, hrefid, value)
{
    var tow_list_equal = function(list, list1)
    {
        var ret = true;
        _.forEach(list1, function(item1){
            ret = ret && _.any(list, function(item){
                    return item[0] === item1[0] && item[1] === item1[1];
                });
            if(!ret) return;
        });
        return ret;
    };
    var get_cond_idx = function(list, list1){
        var ret = -1;
        _.forEach(list, function(item){
            if( tow_list_equal(item[0], list1)){
                ret = _.indexOf(list, item);
                return;
            }
        });
        return ret;
    };
    var arr = hrefid.split('|');
    var _id = arr[1].split('@')[1];
    var conds = arr[2];
    var idx = _.findIndex($.webgis.data.bbn.grid_data, '_id', _id);
    var key = arr[3].split(':')[1]
    if(idx > -1)
    {
        if (conds.length === 0) {
            $.webgis.data.bbn.grid_data[idx].conditions[0][1][key] = ProbabilityFloatFormat(value);
        }else{
            var condlist = []
            var arr1 = conds.split(',');
            _.forEach(arr1, function(item){
                var arr2 = item.split(':');
                if(arr2[1] === 'true'){
                    condlist.push([arr2[0],true]);
                }
                else if(arr2[1] === 'false'){
                    condlist.push([arr2[0],false]);
                }else{
                    condlist.push([arr2[0],arr2[1]]);
                }
            });
            var idx1 = get_cond_idx($.webgis.data.bbn.grid_data[idx].conditions, condlist);
            if(idx1>-1){
                $.webgis.data.bbn.grid_data[idx].conditions[idx1][1][key] = ProbabilityFloatFormat(value);
            }
        }
        BBNNodeGridLoadData(viewer, $.webgis.data.bbn.grid_data);
    }
}

function LoadBBNGridData(viewer, line_name)
{
    if(line_name.length)
    {
        $.ajax({
            url: '/bayesian/query/node',
            method: 'post',
            data: JSON.stringify({line_name: line_name})
        })
        .always(function () {
            ShowProgressBar(false);
        })
        .done(function (data1) {
            var arr = _.sortBy(JSON.parse(data1), function(n) {
                return n.name;
            });
            $.webgis.data.bbn.grid_data = arr;
            //console.log(arr);
            BBNNodeGridLoadData(viewer, $.webgis.data.bbn.grid_data);
        })
        .fail(function (jqxhr, textStatus, e) {
            $.jGrowl("查询失败:" + e, {
                life: 2000,
                position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                theme: 'bubblestylefail',
                glue: 'before'
            });
        });
    }else{
        BBNNodeGridLoadData(viewer, []);
    }
}
function SaveBBNGridData(viewer, line_name)
{
	ShowConfirm(null, 500, 200,
		'确认',
		'确认保存吗? 确认的话数据将会提交到服务器上，以便所有人都能看到修改的结果。',
		function () {
            var data = _.map($.webgis.data.bbn.grid_data, function(item){
                if(_.startsWith(item._id, 'null_')){
                    item._id = null;
                }
                item.line_name = line_name;
                return item;
            });
			console.log(data);
            //if(true) return;
            ShowProgressBar(true, 670, 200, '保存', '正在保存，请稍候...');
            $.ajax({
                url:'/bayesian/save/node',
                method:'post',
                data: JSON.stringify(data)
            })
            .always(function () {
                ShowProgressBar(false);
            })
            .done(function (data1) {
            })
            .fail(function (jqxhr, textStatus, e) {
                $.jGrowl("保存失败:" + e, {
                    life: 2000,
                    position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                    theme: 'bubblestylefail',
                    glue:'before'
                });
            });
		},
		function () {
			//$('#').dialog("close");
		}
	);
}
$(function(){
    QueryBBNDomainsRange(function(){
        //console.log($.webgis.data.bbn.domains_range);
    });
    InitWebGISFormDefinition();
    $.webgis.data.bbn.grid_data = [];//test_data();
    BBNNodeGridLoadData(null, $.webgis.data.bbn.grid_data);
    $('#save').on('click', function(){
        var line_name = $('#lines').val();
        if(line_name.length)
        {
            SaveBBNGridData(null, line_name);
        }
    });
    $.ajax({
        url:'/state_examination/query/line_names',
        method:'post',
        data: JSON.stringify({})
    })
    .always(function () {
        //ShowProgressBar(false);
    })
    .done(function (data1) {
        $('#lines').append('<option value=""></option>');
        var data1 = JSON.parse(data1) ;
        _.forEach(data1,function(item){
            $('#lines').append('<option value="' + item + '">' + item + '</option>');
        });
        $('#lines').on('change', function(){
            LoadBBNGridData(null, $(this).val());
        });
    })
});

