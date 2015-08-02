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


$(function(){
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
        {display:'结点概率取值类型', name:'value_type', width: 200,
            editor: {
                type: 'select',
                data: [{value_type:'boolean',text:'布尔型(真/假)'},{value_type:'array',text:'字符串数组'}],
                valueField: 'value_type'
            }
        },
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
    var list = [
        {_id:111, row_type:'node_edit', name:'name1', display_name:'显示名称1', value_type:'array',
            children:[
            {
                cond_name: 'cond_name1,cond_name2',
                children: [
                    {row_type:'condition_edit', cond_name: 'cond_name1', cond_display_name: '条件显示名称1', cond_value: 'cond_value1'},
                    {row_type:'condition_edit', cond_name: 'cond_name2', cond_display_name: '条件显示名称2', cond_value: 'cond_value2'},
                ]
            },
            {
                row_type:'probability_edit', event: 'value1', probability: '<a href="javascript:void(0)">0.3333</a>',
            },
            {
                row_type:'probability_edit', event: 'value2', probability: '<a href="javascript:void(0)">0.2222</a>',
            },
            {
                row_type:'probability_edit', event: 'value3', probability: '<a href="javascript:void(0)">0.4444</a>',
            },
            {
                row_type:'probability_edit', event: 'value4', probability: '<a href="javascript:void(0)">0.5555</a>',
            }
            ]
        }
    ];
    var tabledata = {Rows:list};
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
