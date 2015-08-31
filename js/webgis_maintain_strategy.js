
function maintain_strategy(node_name, node_value, node_probability)
{
    var ret = {};
    if(_.startsWith(node_name, 'unit_')){
        if(node_value === 'I'){
            ret.timeline = '基准周期或适当延长';
            ret.strategy = '根据线路实际状况，执行C类检修,可按照正常周期或延长一年执行';
            ret.suggestion = '';
        }
        if(node_value === 'II'){
            ret.timeline = '不大于基准周期';
            ret.strategy = '若用D类或E类检修可将线路恢复到正常状态，则可适时安排D类或E类检修，否则应执行C类检修';
            ret.suggestion = '';
            _.forEach($.webgis.data.bbn.maintain_strategy_standard, function(item){
                if(item.class === 'D' || item.class === 'E'){
                    _.forEach(item.items, function(item1){
                        if(_.indexOf(item1.unit_type, node_name) > -1){
                            ret.suggestion += item1.description + ';';
                        }
                    });
                }
            });
            if(ret.suggestion.length === 0){
                _.forEach($.webgis.data.bbn.maintain_strategy_standard, function(item){
                    if(item.class === 'C'){
                        _.forEach(item.items, function(item1){
                            if(_.indexOf(item1.unit_type, node_name) > -1){
                                ret.suggestion += item1.description + ';';
                            }
                        });
                    }
                });
            }

        }
        if(node_value === 'III'){
            ret.timeline = '适时安排';
            ret.strategy = '根据评价结果确定检修类型,实施停电检修前应安排D类、E类检修';
            ret.suggestion = '';
            _.forEach($.webgis.data.bbn.maintain_strategy_standard, function(item){
                if(item.class === 'A' || item.class === 'B'){
                    _.forEach(item.items, function(item1){
                        if(_.indexOf(item1.unit_type, node_name) > -1){
                            ret.suggestion += item1.description + ';';
                        }
                    });
                }
            });
            _.forEach($.webgis.data.bbn.maintain_strategy_standard, function(item){
                if(item.class === 'D' || item.class === 'E'){
                    _.forEach(item.items, function(item1){
                        if(_.indexOf(item1.unit_type, node_name) > -1){
                            ret.suggestion += item1.description + ';';
                        }
                    });
                }
            });
        }
        if(node_value === 'IV'){
            ret.timeline = '尽快安排';
            ret.strategy = '根据评价结果确定检修类型,实施停电检修前应安排D类、E类检修';
            ret.suggestion = '';
            _.forEach($.webgis.data.bbn.maintain_strategy_standard, function(item){
                if(item.class === 'A' || item.class === 'B'){
                    _.forEach(item.items, function(item1){
                        if(_.indexOf(item1.unit_type, node_name) > -1){
                            ret.suggestion += item1.description + ';';
                        }
                    });
                }
            });
            _.forEach($.webgis.data.bbn.maintain_strategy_standard, function(item){
                if(item.class === 'D' || item.class === 'E'){
                    _.forEach(item.items, function(item1){
                        if(_.indexOf(item1.unit_type, node_name) > -1){
                            ret.suggestion += item1.description + ';';
                        }
                    });
                }
            });
        }
    }
    return ret;
}

