$.webgis.data.bbn = {};
$.webgis.data.bbn.control = {};





function BBNNodeGridBeginEdit(rowindex)
{
	$.webgis.data.bbn.control.node_grid.beginEdit(rowindex);
}
function BBNNodeGridDeleteRow(rowindex)
{
	ShowConfirm(null, 500, 200,
		'删除确认',
		'确认删除吗? 确认的话数据将会提交到服务器上，以便所有人都能看到修改的结果。',
		function () {
			var row = $.webgis.data.bbn.control.node_grid.getRow(rowindex);
			console.log(row);
			if(row && row._id) {
				//DeleteStateExamination(null, {_id:row._id}, function () {
					$.webgis.data.bbn.control.node_grid.deleteRow(rowindex);
				//},function(){
				//	$.webgis.data.bbn.control.node_grid.cancelEdit(rowindex);
				//});
			}
		},
		function () {
			//$('#').dialog("close");
		}
	);
}
function BBNNodeGridEndEdit(rowindex)
{
	$.webgis.data.bbn.control.node_grid.endEdit(rowindex);
    var row = $.webgis.data.bbn.control.node_grid.getRow(rowindex);

    if(row.row_type === '' || _.isUndefined(row.row_type)){
        $.webgis.data.bbn.control.node_grid.cancelEdit(rowindex);
        $.webgis.data.bbn.control.node_grid.updateRow(row, {display_name:'',name:'', value_type:'', probability:'', cond_value:''});
        return;
    }
    if(row.row_type === 'node_edit' && (row.name.length === 0 || row.display_name.length === 0 || row.value_type.length === 0)){
        $.webgis.data.bbn.control.node_grid.cancelEdit(rowindex);
        $.webgis.data.bbn.control.node_grid.updateRow(row, {display_name:'',name:'', value_type:'', probability:'', cond_value:''});
        return;
    }
    if(row.row_type === 'condition_edit' && (row.name.length > 0 || row.display_name.length > 0 || row.value_type.length > 0 || row.probability.length > 0)){
        $.webgis.data.bbn.control.node_grid.cancelEdit(rowindex);
        $.webgis.data.bbn.control.node_grid.updateRow(row, {display_name:'',name:'',value_type:'', probability:'', cond_value:''});
        return;
    }
    if(row.row_type === 'probability_edit' && (row.name.length > 0 || row.display_name.length > 0 || row.value_type.length > 0 || row.cond_value.length > 0)){
        $.webgis.data.bbn.control.node_grid.cancelEdit(rowindex);
        $.webgis.data.bbn.control.node_grid.updateRow(row, {display_name:'',name:'',value_type:'',probability:'', cond_value:''});
        return ;
    }

	ShowConfirm(null, 500, 200,
		'确认',
		'确认保存吗? 确认的话数据将会提交到服务器上，以便所有人都能看到修改的结果。',
		function () {

			_.forIn(row, function(v, k){
				if(_.startsWith(k, '__'))
				{
					delete row[k];
				}
			});
			console.log(row);
			if(row) {
				//SaveStateExamination(null, row, function () {
                $.webgis.data.bbn.control.node_grid.endEdit(rowindex);
				//},function(){
				//	$.webgis.data.bbn.control.node_grid.cancelEdit(rowindex);
				//});
			}
		},
		function () {
			//$('#').dialog("close");
		}
	);

}
function BBNNodeGridCancelEdit(rowindex)
{
	$.webgis.data.bbn.control.node_grid.cancelEdit(rowindex);
}

function BuildComboConditions(master, nodes)
{
    var ret =  $.extend(true, {}, master);
    ret.conditions = [];
    var l = [];
    _.forEach(nodes, function(node){
        var l2 = [];
        _.forEach(node.domains, function(domain){
            l2.push([node.name, domain])
        });
        l.push(l2);
    });
    var cp = Combinatorics.cartesianProduct.apply(this, l);
    cp = cp.toArray();
    _.forEach(cp, function(item){
        var list1 = [];
        list1.push(item);
        var o = {};
        _.forEach(master.domains, function(domain){
            o[domain] = 0.0;
        });
        list1.push(o);
        ret.conditions.push(list1);
    });
    return ret;
}

function BuildTableList(list)
{
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
        display_name:'显示名称1',
        value_type:'array',
        domains:[true, false],
        conditions:[]
    };
    name4 = BuildComboConditions(name4, [name1, name2, name3]);
    return [name1, name2, name3, name4];
}


$(function(){
    //console.log(name4);
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
        {display:'', name:'row_type', width: 1, hide: true},
        {display:'结点显示名称', name:'display_name', width: 100, editor: { type: 'text' }},
        {display:'结点名', name:'name', width: 50, editor: { type: 'text' }},
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
        {display:'结点事件概率值', name:'probability', width: 100, editor: { type: 'text' }},
    ];
    var tabledata = {Rows:BuildTableList(test_data())};
    $.webgis.data.bbn.control.node_grid = $('#div_grid').ligerGrid({
        columns: columns,
        data: tabledata,
        enabledEdit: true,
        clickToEdit: false,
        //checkbox: true,
        tree: { columnName: 'event' },
        pageSize: 10
    });
});
