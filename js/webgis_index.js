
$.webgis.data.czmls = [];
$.webgis.data.geojsons = [];
$.webgis.data.lines = [];
$.webgis.data.codes = {};
$.webgis.data.segments = [];
$.webgis.data.gltf_models_mapping = {};
$.webgis.data.models_gltf_files = [];
$.webgis.data.buffers = [];
$.webgis.data.borders = [];
$.webgis.mapping.models_mapping = {};
$.webgis.geometry.segments = [];
$.webgis.geometry.lines = [];
$.webgis.data.state_examination = {};
$.webgis.data.bbn = {};
$.webgis.data.bbn.grid_data = [];
$.webgis.data.bbn.domains_range = [];
$.webgis.data.bbn.control = {};
$.webgis.data.state_examination.control = {};
$.webgis.data.state_examination.standard = [];
$.webgis.data.state_examination.import_excel_data = [];
$.webgis.data.state_examination.list_data = [];
$.webgis.data.state_examination.record_single_form = {};
$.webgis.config.is_tower_focus = false;



$.webgis.data.image_thumbnail_tower_info = [];
$.webgis.config.terrain_z_offset = -40;
$.webgis.config.node_connect_mode = false;

$.webgis.mapping.leaflet_old_style = {};

$.webgis.data.heatmap_layers = {};

$.webgis.data.sysrole = [];
$.webgis.config.map_backend = 'cesium';
$.webgis.config.use_catenary = true;



$.webgis.config.max_file_size = 5000000;

$.webgis.data.bbn.graphiz_label = [
    {
        name: "line_state",
        display_name: "线路整体评价",
        description:"以各个单元评价的最高等级作为线路整体评价的等级"
    }
];


var DEBUG_BAYES = false;
var TREE_COLLAPSE = true;


$(function() {
    //$.validator.addMethod("select_required", function(value, element) {
    //    return $(element).multipleSelect("getSelects").length > 0;
    //}, '请选择');
    $.validator.addMethod("alpha", function(value, element) {
          return this.optional(element) || /^[A-Za-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/.test(value); // just ascii letters
    },"请输入英文、数字或常见符号，禁止输入中文");


    var coo = Cookies.get('session_data');
    if(coo)
    {
        var session_data_string = coo.replace(/\\054/g, ',').replace(/\\"/g, '"').replace(/\\\\u/g, '\\u');
        $.webgis.current_userinfo = JSON.parse(session_data_string);
        console.log("current login user: " + $.webgis.current_userinfo.displayname);
    }
    //GetParamsFromUrl();
    $.jGrowl.defaults.closerTemplate = '<div class="bubblestylesuccess">关闭所有提示信息</div>';
    
    var viewer;

    var load_init_data = function()
    {
        ShowProgressBar(true, 670, 200, '载入中', '正在载入南网编码规范，请稍候...');
        LoadCodeData($.webgis.db.db_name, function(){
            ShowProgressBar(true, 670, 200, '载入中', '正在载入线路信息，请稍候...');
            LoadLineData($.webgis.db.db_name, function(){
                ShowProgressBar(true, 670, 200, '载入中', '正在载入架空线路信息，请稍候...');
                LoadSegments($.webgis.db.db_name, function(){
                    ShowProgressBar(true, 670, 200, '载入中', '正在载入杆塔信息，请稍候...');
                    //LoadModelsList($.webgis.db.db_name, function(){
                    //    ShowProgressBar(true, 670, 200, '载入中', '正在载入3D模型信息，请稍候...');
                        LoadModelsMapping($.webgis.db.db_name, function(){
                            var extent = GetDefaultExtent($.webgis.db.db_name);
                            FlyToExtent(viewer, {extent:extent, duration:0});
                            LoadSysRole($.webgis.db.db_name, function(){
                                $('#lnglat_indicator').html( '当前用户:' + $.webgis.current_userinfo['displayname'] );
                            });
                        });

                        //$.webgis.config.zaware = true;
                        //LoadAllDNNode(viewer, $.webgis.db.db_name, function(){
                            //LoadAllDNEdge(viewer, $.webgis.db.db_name, function(){
                                //var extent = GetExtentByCzml();
                                //FlyToExtent(viewer, {extent:extent});
                                //ReloadCzmlDataSource(viewer, $.webgis.config.zaware);
                            //});
                        //});
                    
                    //});
                });
            });
        });
    };


    if(DEBUG_BAYES)
    {
        viewer = InitLeafletViewer();
        $.webgis.viewer = viewer;
        InitSearchBox(viewer);
        InitWebGISFormDefinition();
        InitDrawHelper2D(viewer);
        $.webgis.control.drawhelper.show(false);
        InitToolPanel(viewer);
        InitKeyboardEvent(viewer);
        InitStateExamination();
        InitScreenSize(viewer);
        LoadSysRole($.webgis.db.db_name, function(){
            $('#lnglat_indicator').html( '当前用户:' + $.webgis.current_userinfo['displayname'] );
        });
            //"year_num":obj.year_num + '',
            //"attention":obj.attention,
            //"description":obj.description,
            //"suggestion":obj.suggestion

//        PredictSummaryExport(null, {
//            line_name:'厂口七甸I回线',
//            year_num:5,
//            attention:'绝缘子,特殊区段',
//            description:'\
//厂口-七甸I回线#140绝缘子自爆\
//1、 #75-#82绝缘子外观检查有轻微积污（土尘），附近有污染源（长水机场外围施工），#82-#83跨越沾昆电气化铁路（复线），绝缘子为单挂单串。#73（中相V串左边横担侧第七片）自爆绝缘子未更换。绝缘子单元为注意状态。\
//2、#86  C-D侧距离乡村便道近1.0m，需建设永久性防撞墙，#72A-D侧外6m处度假区架设取土作业，形成3.5m高土坎。基础单元为注意状态   \
//3、#116-#120途径老鹰山，沿途荆棘灌木丛生，无巡线小道。#20-#23、#47-#50、#58-#60、#96-#102、#104-#106、#107-#109、#123-#125保护区内有约35000株林木待处理（垂直距离6.5-10m）。#91-#92保护区内新发社区5户居民违章建房（二层砖混）。#83 C-D腿侧外6m处修建新320国道。在建昆沪高速铁路穿越#92-#93，取土及大型施工机械作业。通道环境单元为注意状态；\
//1、 #75-#82绝缘子外观检查有轻微积污（土尘），附近有污染源（长水机场外围施工），#82-#83跨越沾昆电气化铁路（复线），绝缘子为单挂单串。#73（中相V串左边横担侧第七片）自爆绝缘子未更换。绝缘子单元为注意状态。 \
//2、#86  C-D侧距离乡村便道近1.0m，需建设永久性防撞墙，#72A-D侧外6m处度假区架设取土作业，形成3.5m高土坎。基础单元为注意状态   \
//3、#116-#120途径老鹰山，沿途荆棘灌木丛生，无巡线小道。#20-#23、#47-#50、#58-#60、#96-#102、#104-#106、#107-#109、#123-#125保护区内有约35000株林木待处理（垂直距离6.5-10m）。#91-#92保护区内新发社区5户居民违章建房（二层砖混）。#83 C-D腿侧外6m处修建新320国道。在建昆沪高速铁路穿越#92-#93，取土及大型施工机械作业。通道环境单元为注意状态；\
//                    ',
//            suggestion:'按运规要求巡视，建议及时更换\
//\
//1.C类检修：对有轻微积污的绝缘子进行清洗\
//\
//2.D类检修：加强对#83、#91-#92、#92-#93段巡视，视情况对#83加装挡土墙\
//\
//3.D类检修：及时清除通道内危急林木；D类检修：按照《昆明供电局电力线路外力破坏防治指导手册（第二版）》加强对外力破坏区的治理。\
//\
//1.C类检修：对有轻微积污的绝缘子进行清洗\
//\
//2.D类检修：加强对#83、#91-#92、#92-#93段巡视，视情况对#83加装挡土墙\
//\
//3.D类检修：及时清除通道内危急林木；D类检修：按照《昆明供电局电力线路外力破坏防治指导手册（第二版）》加强对外力破坏区的治理。\
//                    '
//        });
        return;
    }
    try{
        throw "unsupport_cesium_exception";
        ShowProgressBar(true, 670, 200, '载入中', '正在载入，请稍候...');
        viewer = InitCesiumViewer();
        $.webgis.viewer = viewer;
        InitRuler(viewer);
        InitLogout(viewer);
        InitWebGISFormDefinition();
        InitDrawHelper(viewer);
        $.webgis.control.drawhelper.show(false);
        InitPoiInfoDialog();
        //InitTowerInfoDialog();
        InitSearchBox(viewer);
        InitToolPanel(viewer);
        InitModelList(viewer);
        InitKeyboardEvent(viewer);
        load_init_data();
        InitStateExamination();
        InitScreenSize(viewer);
    }catch(ex)
    {
        console.log(ex);
        $('#cesiumContainer').empty();
        $('#control_toolpanel_kmgd_left').css('display','none');
        ShowProgressBar(false);
        $.webgis.config.map_backend = 'leaflet';
        //ShowMessage(null, 400, 300, '提示', '系统检测到该浏览器不支持最新HTML5标准WEBGL部分，因此将禁用3D视图。请使用Chrome浏览器或内置Chrome内核的浏览器以获得最佳浏览体验。', function(){
        //});
        viewer = InitLeafletViewer();
        $.webgis.viewer = viewer;

        InitHomeButton2D(viewer);
        InitLayerControl2D(viewer);
        InitRuler(viewer);
        InitNavigationHelp(viewer);
        InitLogout(viewer);

        InitWebGISFormDefinition();
        InitDrawHelper2D(viewer);
        $.webgis.control.drawhelper.show(false);

        InitPoiInfoDialog();
        //InitTowerInfoDialog();

        InitSearchBox(viewer);
        InitToolPanel(viewer);
        InitModelList(viewer);
        InitKeyboardEvent(viewer);
        load_init_data();
        InitStateExamination();
        TranslateToCN();
        InitScreenSize(viewer);
    }
    
    
    
    
    //LoadBorder(viewer, $.webgis.db.db_name, {'properties.name':'云南省'});
    //LoadBorder(viewer, $.webgis.db.db_name, {'properties.type':'cityborder'});
    //LoadBorder(viewer, $.webgis.db.db_name, {'properties.type':'countyborder'});
    
    //$.webgis.data.heatmap_layers['testheatmap'] = {
        //layer: new HeatMapImageryProvider({
                    //name:'testheatmap',
                    //viewer:viewer,
                    //points:testdata()
                //}),
        //type: 'heatmap'
    //};
    //$.webgis.data.heatmap_layers['yn_ice_100'] = {
        //layer: CreateTileHeatMap(viewer, {
                    //url:'http://xiejun-desktop:6080/arcgis/rest/services/YN_HEATMAP/yn_ice_100/ImageServer',
                    //maximumLevel: 11,
                    //name:'yn_ice_100'
                //}),
        //type: 'tile'
    //};
});

function InitStateExamination()
{
    $.getJSON( 'js/jiakongztpj2014.json')
    .done(function( data0 ){
        $.webgis.data.state_examination.standard2014 = data0;

        $.getJSON( '/standard_template2009.json')
        .done(function( data0_1 ){
            $.webgis.data.bbn.unitsub_template_2009 = data0_1;
            $.getJSON( '/standard_template2014.json')
            .done(function( data0_2 ){
                $.webgis.data.bbn.unitsub_template_2014 = data0_2;
                $.getJSON( 'js/jiakongztpj.json')
                .done(function( data ){
                    //if(success) success(data);
                    $.webgis.data.state_examination.standard = data;
                    $.getJSON( 'js/jianxiucelv.json')
                    .done(function( data1 ){
                        //if(success) success(data);
                        $.webgis.data.bbn.maintain_strategy_standard = data1;
                        QueryBBNDomainsRange();
                    })
                    .fail(function( jqxhr ){

                    });
                })
                .fail(function( jqxhr ){
                });
            })
            .fail(function( jqxhr ){
            });
        })
        .fail(function( jqxhr ){
        });
    })
    .fail(function( jqxhr ){
    });
}
function InitScreenSize(viewer)
{
    $('#cesiumContainer').css('height', $( window ).height() + 'px');
    $( window ).resize(function(e) {
        $('#cesiumContainer').css('height', $( window ).height() + 'px');
    });
}
function CreateTileHeatMap(viewer, options)
{
    var aip = new ArcGisMapServerImageryProvider({
        url : options.url,
        maximumLevel: options.maximumLevel
    });
    var lyr = viewer.scene.imageryLayers.addImageryProvider(aip);
    lyr.alpha = 0.4;
    lyr.show = true;
    lyr.name = options.name;
    return lyr;
}

//function InitPostMessageListener()
//{
    //$(window).on("message", function(e) {
        //var data = e.originalEvent.data;
        //console.log(data);
    //});
//}

function IFrameUpdateTower(tower_id, data)
{
    //for(var i in data)
    //{
    //    var geojson = data[i];
    //    var id = geojson['_id'];
    //    if($.webgis.data.geojsons[id])
    //    {
    //        $.webgis.data.geojsons[id] = geojson; //AddTerrainZOffset(geojson);
    //        $.webgis.data.czmls[id] = CreateCzmlFromGeojson($.webgis.data.geojsons[id]);
    //    }
    //}
    _.forEach(data, function(item){
        var idx = _.findIndex($.webgis.data.geojsons, '_id', item._id);
        if(idx > -1){
            $.webgis.data.geojsons[idx] = item;
            var idx1 = _.findIndex($.webgis.data.czmls, 'id', item._id);
            if(idx1 > -1){
                $.webgis.data.czmls[idx1] = CreateCzmlFromGeojson($.webgis.data.geojsons[idx]);
            }
        }
    });
    var selected_id = $.webgis.select.selected_geojson._id;
    var sel = _.find($.webgis.data.geojsons, {_id:selected_id});
    if(sel){
        $.webgis.select.selected_geojson.properties.model = sel.properties.model;
    }
}
function IFrameUpdateModel(tower_id, data)
{
    for(var i in data)
    {
        var obj = data[i];
        var model_code_height = obj['model_code_height'];
        delete obj['_id'];
        $.webgis.mapping.models_mapping[model_code_height] = obj;
    }
}
function IFrameUpdateSegments(data)
{
    _.forEach(data, function(item){
        var id = item._id;
        var find = false;
        var seg = _.find($.webgis.data.segments, {_id:id});
        if(seg){
            var idx = _.indexOf($.webgis.data.segments, seg);
            $.webgis.data.segments[idx] = item;
        }else{
            $.webgis.data.segments.push(item);
        }
        if($.webgis.select.selected_obj && $.webgis.select.selected_obj.id)
        {
            RemoveSegmentsTower($.webgis.viewer, _.find($.webgis.data.geojsons, {_id:$.webgis.select.selected_obj.id}));
            DrawSegmentsByTower($.webgis.viewer,  _.find($.webgis.data.geojsons, {_id:$.webgis.select.selected_obj.id}));
        }
    });
    //{
    //    var obj = data[i];
    //    var id = obj['_id'];
    //    var find = false;
    //    for(var j in $.webgis.data.segments)
    //    {
    //        if($.webgis.data.segments[j]['_id'] === id)
    //        {
    //            $.webgis.data.segments[j] = obj;
    //            find = true;
    //            break;
    //        }
    //    }
    //    if(!find)
    //    {
    //        $.webgis.data.segments.push(obj);
    //    }
    //    if($.webgis.select.selected_obj && $.webgis.select.selected_obj.id)
    //    {
    //        RemoveSegmentsTower($.webgis.viewer, $.webgis.data.geojsons[$.webgis.select.selected_obj.id]);
    //        DrawSegmentsByTower($.webgis.viewer, $.webgis.data.geojsons[$.webgis.select.selected_obj.id]);
    //    }
    //}
}



function LoadAllDNEdge(viewer, db_name, callback)
{
    var cond = {'db':db_name, 'collection':'edges', 'properties.webgis_type':'edge_dn'};
    MongoFind(cond, function(data){
        if(data.length>0)
        {
            $.webgis.data.geojsons =  _.uniq(_.union($.webgis.data.geojsons, data), _.property('_id'));
            _.forEach(data, function(item){
                DrawEdgeBetweenTwoNode(viewer, 'edge_dn',
                    _.result(_.find($.webgis.data.geojsons, {_id:item._id}),'properties.start'),
                    _.result(_.find($.webgis.data.geojsons, {_id:item._id}),'properties.end'),
                    false);
            });
            //for(var i in data)
            //{
            //    var id = data[i]['_id'];
            //    if(!$.webgis.data.geojsons[id]) $.webgis.data.geojsons[id] = data[i];
            //    DrawEdgeBetweenTwoNode(viewer, 'edge_dn', $.webgis.data.geojsons[id]['properties']['start'],$.webgis.data.geojsons[id]['properties']['end'], false);
            //}
        }
        if(callback) callback(data);
    });
}

function LoadEdgeByLineId(viewer, db_name, lineid, callback)
{
    console.log(lineid);
    var cond = {'db':db_name, 'collection':'-', action:'loadtoweredge', 'lineid':lineid};
    MongoFind(cond, function(data){
        if(data.length>0)
        {
            $.webgis.data.geojsons =  _.uniq(_.union($.webgis.data.geojsons, data), _.property('_id'));
        }
        if(callback) callback(data);
    });
}




function LoadAllDNNode(viewer, db_name, callback)
{
    var cond = {'db':db_name, 'collection':'features', 'properties.webgis_type':'point_dn'};
    MongoFind(cond, function(data){
        if(data.length>0)
        {
            $.webgis.data.geojsons =  _.uniq(_.union($.webgis.data.geojsons, data), _.property('_id'));
            if($.webgis.config.map_backend === 'cesium') {
                var czmls = _.map(data, function (n) {
                    return CreateCzmlFromGeojson(n);
                });
                $.webgis.data.czmls = _.uniq(_.union($.webgis.data.czmls, czmls), _.property('id'));
            }
            //for(var i in data)
            //{
            //    var id = data[i]['_id'];
            //    if(!$.webgis.data.geojsons[id]) $.webgis.data.geojsons[id] = data[i]; //AddTerrainZOffset(data[i]);
            //    if(!$.webgis.data.czmls[id]) $.webgis.data.czmls[id] = CreateCzmlFromGeojson($.webgis.data.geojsons[id]);
            //    //$.webgis.data.czmls[id]['position']['cartographicDegrees'][2] = $.webgis.data.geojsons[id]['geometry']['coordinates'][2];
            //    //console.log($.webgis.data.czmls[id]['position']['cartographicDegrees'][2]);
            //}
            if(callback) callback(data);
        }
    });
}


function InitLeafletViewer()
{
    $('#lnglat_indicator').css('width', '300px');
    $('#lnglat_indicator').css('text-align', 'right');
    $("#cesiumContainer").height($(window).height()).width($(window).width());
    $("#cesiumContainer").append('<div class="cesium-viewer-toolbar"></div>');
    $('.cesium-viewer-toolbar').css('z-index', '9');
    var center = GetDefaultCenter($.webgis.db.db_name);
    var c = L.latLng(center[1], center[0]);
    //console.log(c);
    var layers = [];
    var url_temlate, lyr;
    var baseMaps = {};
    
    url_temlate = 'http://' + $.webgis.remote.tiles_host + ':' + $.webgis.remote.tiles_port + '/tiles?image_type={image_type}&x={x}&y={y}&level={z}';

    lyr = L.tileLayer(url_temlate, {
        image_type:'amap_map',
        noWrap:true,
        tms:false,
        zoomOffset:0,
        minZoom: 1,
        maxZoom: 18,
    });
    lyr.name = '高德地图';
    lyr.iconUrl = Cesium.buildModuleUrl('/img/wmts-map.png');
    lyr.tooltip = '高德地图';
    layers.push(lyr);
    baseMaps['高德地图'] = lyr;

    lyr = L.tileLayer(url_temlate, {
        image_type:'arcgis_sat', 
        noWrap:true,
        tms:false,
        zoomOffset:0,
        zoomReverse:false,
        minZoom: 1,
        maxZoom: 18,
    });
    lyr.name = 'ESRI卫星图';
    //lyr.iconUrl = Cesium.buildModuleUrl('/img/esri-sat.png');
    lyr.iconUrl = Cesium.buildModuleUrl('/img/bingAerial.png');
    lyr.tooltip = 'ESRI卫星图';
    layers.push(lyr);
    baseMaps['ESRI卫星图'] = lyr;
    
    
    //lyr = L.tileLayer(url_temlate, {
    //    image_type:'bing_sat',
    //    noWrap:true,
    //    tms:false,
    //    zoomOffset:-1,
    //    minZoom: 1,
    //    maxZoom: 18,
    //});
    //
    //lyr.name = 'Bing卫星图';
    //lyr.iconUrl = Cesium.buildModuleUrl('/img/bingAerial.png');
    //lyr.tooltip = 'Bing卫星图';
    //layers.push(lyr);
    //baseMaps['Bing卫星图'] = lyr;
    

    //var prefix = '';
    //if($.webgis.remote.arcserver_host == '10.181.160.72')
    //{
        //prefix = 'ztgdgis/';
    //}
    //var url_arcgis = 'http://' + $.webgis.remote.arcserver_host + ':6080/arcgis/rest/services/' + prefix + 'YN_SAT/ImageServer';
    //lyr = L.esri.imageMapLayer(url_arcgis, {
        ////image_type:'arcserver_imagery',
        ////imagery_url:url_arcgis,
        ////noWrap:true,
        ////tms:false,
        ////zoomOffset:1,
        ////zoomReverse:false,
        //minZoom: 0,
        //maxZoom: 17,
    //});
    //layers.push(lyr);
    //baseMaps['YN_SAT'] = lyr;

    
    //if(CheckInternetConnection())
    //{
        //lyr = L.tileLayer.chinaProvider('GaoDe.Normal.Map');
    //}
    var map = L.map('cesiumContainer',{
        minZoom:1,
        maxZoom:18,
        zoomControl:false,
        //layers:layers,
        crs:L.CRS.EPSG900913
        //crs:L.CRS.EPSG4326
    }).setView(c, 6);
    map.layers = layers;
    
    //var markers = L.markerClusterGroup({
    //});
    $.webgis.control.leaflet_geojson_layer = L.geoJson({type: "FeatureCollection",features:[]}, {
        style: function (feature) {
            //if(feature.properties.webgis_type.indexOf('point_')>-1)
            //{
            var o = {};
            if(feature.geometry)
            {
                o.color = ColorArrayToHTMLColor($.webgis.mapping.style_mapping[feature.properties.webgis_type].color);
                var weight = 5;
                if($.webgis.mapping.style_mapping[feature.properties.webgis_type].pixelWidth)
                {
                    o.weight = $.webgis.mapping.style_mapping[feature.properties.webgis_type].pixelWidth * 5;
                }
            }
            return o;
        },
        pointToLayer:function (feature, latlng) {
            var m = L.circleMarker(latlng, {
                radius: $.webgis.mapping.style_mapping[feature.properties.webgis_type].pixelSize,
                fillColor: ColorArrayToHTMLColor($.webgis.mapping.style_mapping[feature.properties.webgis_type].color),
                color: ColorArrayToHTMLColor($.webgis.mapping.style_mapping[feature.properties.webgis_type].outlineColor),
                weight: 1,
                opacity: 1,
                fillOpacity: 0.7
            });
            //if(feature.properties.name)
            //{
                //m.bindLabel(feature.properties.name);
            //}
            return m;
        },
        onEachFeature: function (feature, layer) {
            //markers.addLayer(layer);
            layer.on('mouseover', function (e) {
                if(e.target.feature.properties.name && $('#chb_show_label_' + e.target.feature.properties.webgis_type).is(':checked'))
                {
                    $.webgis.control.drawhelper._tooltip.setVisible(true);
                }
            });
            layer.on('mousemove', function (e) {
                if(e.target.feature.properties.name && $('#chb_show_label_' + e.target.feature.properties.webgis_type).is(':checked'))
                {
                    if($.webgis.control.drawhelper._tooltip.getVisible())
                    {
                        $.webgis.control.drawhelper._tooltip.showAt(e.containerPoint, e.target.feature.properties.name);
                    }
                }
            });
            layer.on('mouseout', function (e) {
                $.webgis.control.drawhelper._tooltip.setVisible(false);
            });
            layer.on('click', function (e) {
                console.log(e.target.feature._id);
                ClearSelectColor2D(map);
                if($.webgis.select.selected_obj)
                {
                    $.webgis.select.prev_selected_obj = $.webgis.select.selected_obj;
                }
                $.webgis.select.selected_obj = e.target.feature;
                $.webgis.select.selected_obj.id = e.target.feature._id;
                if(e.target.feature && e.target.feature.properties && e.target.feature.properties.webgis_type)
                {
                    if(e.target.feature.properties.webgis_type.indexOf('point_'))
                    {
                        $.webgis.select.selected_obj.point = true;
                    }
                    else if(e.target.feature.properties.webgis_type.indexOf('polyline_'))
                    {
                        $.webgis.select.selected_obj.polyline = true;
                    }
                    else if(e.target.feature.properties.webgis_type.indexOf('polygon_'))
                    {
                        $.webgis.select.selected_obj.polygon = true;
                    }
                }
                
                
                if(!$.webgis.mapping.leaflet_old_style[e.target.feature._id])
                {
                    $.webgis.mapping.leaflet_old_style[e.target.feature._id] = {color:e.target.options.color, weight:e.target.options.weight};
                }
                e.target.setStyle({color:'green', weight: 10});
                OnSelect(map, null);
            });
            
        }
    });
    
    
    //markers.on('mouseover', function (e) {
        //if(e.layer.feature.properties.name && $('#chb_show_label_' + e.layer.feature.properties.webgis_type).is(':checked'))
        //{
            //$.webgis.control.drawhelper._tooltip.setVisible(true);
        //}
    //});
    //markers.on('mousemove', function (e) {
        //if(e.layer.feature.properties.name && $('#chb_show_label_' + e.layer.feature.properties.webgis_type).is(':checked'))
        //{
            //if($.webgis.control.drawhelper._tooltip.getVisible())
            //{
                //$.webgis.control.drawhelper._tooltip.showAt(e.containerPoint, e.layer.feature.properties.name);
            //}
        //}
    //});
    //markers.on('mouseout', function (e) {
        //$.webgis.control.drawhelper._tooltip.setVisible(false);
    //});
    //markers.on('click', function (e) {
        ////console.log(e.layer.feature._id);
    //});
    //map.addLayer(markers, false);
    map.addLayer($.webgis.control.leaflet_geojson_layer);
    
    
    //L.control.layers(baseMaps, {}).addTo(map);
    L.control.mousePosition().addTo(map);
    
    map.invalidateSize();
    return map;
}


function InitCesiumViewer()
{
    var providerViewModels = [];
    var prefix = '';
    if($.webgis.remote.arcserver_host == '10.181.160.72')
    {
        prefix = 'ztgdgis/';
    }
    providerViewModels.push(new Cesium.ProviderViewModel({
        name : '高德地图',
        iconUrl : 'img/wmts-map.png',
        tooltip : '高德地图',
        creationFunction : function() {
            return new AMapTileImageryProvider({
                url :  'http://' + $.webgis.remote.tiles_host + ':' + $.webgis.remote.tiles_port + '/tiles',
                imageType: 'amap_map',
                queryType: 'server'
            });
        }
    }));
    providerViewModels.push(new Cesium.ProviderViewModel({
        name : 'Esri卫星图',
        //iconUrl : 'img/esri-sat.png',
        iconUrl : 'img/bingAerial.png',
        tooltip : 'Esri卫星图',
        creationFunction : function() {
            return new ESRIImageryFromServerProvider({
                //url : 'http://dev.virtualearth.net',
                //mapStyle : Cesium.BingMapsStyle.AERIAL
                ////proxy : proxyIfNeeded
                url :  'http://' + $.webgis.remote.tiles_host + ':' + $.webgis.remote.tiles_port + '/tiles',
                imageType: 'arcgis_sat',
                queryType: 'server'
            });
        }
    }));
    providerViewModels.push(new Cesium.ProviderViewModel({
        name : 'YN_SAT',
        iconUrl : 'img/wmts-sat.png',
        tooltip : 'YN_SAT',
        creationFunction : function() {
            return new ArcGisMapServerImageryProvider({
                url : 'http://' + $.webgis.remote.arcserver_host + ':6080/arcgis/rest/services/' + prefix + 'YN_SAT/ImageServer',
                name: 'YN_SAT'
                //usePreCachedTilesIfAvailable:false
            });
        }
    }));
    //providerViewModels.push(new Cesium.ProviderViewModel({
    //    name : 'Bing卫星图',
    //    iconUrl : 'img/bingAerial.png',
    //    tooltip : 'Bing卫星图',
    //    creationFunction : function() {
    //        return new BingImageryFromServerProvider({
    //            //url : 'http://dev.virtualearth.net',
    //            //mapStyle : Cesium.BingMapsStyle.AERIAL
    //            ////proxy : proxyIfNeeded
    //            url :  'http://' + $.webgis.remote.tiles_host + ':' + $.webgis.remote.tiles_port + '/tiles',
    //            imageType: 'bing_sat',
    //            queryType: 'server'
    //        });
    //    }
    //}));

    //providerViewModels.push(new Cesium.ProviderViewModel({
        //name : 'Bing Maps Aerial with Labels',
        //iconUrl : 'img/bingAerialLabels.png',
        //tooltip : 'Bing Maps aerial imagery with label overlays \nhttp://www.bing.com/maps',
        //creationFunction : function() {
            //return new Cesium.BingMapsImageryProvider({
                //url : 'http://dev.virtualearth.net',
                //mapStyle : Cesium.BingMapsStyle.AERIAL_WITH_LABELS
                ////proxy : proxyIfNeeded
            //});
        //}
    //}));
    
    
    var terrainProviderViewModels = [];
    terrainProviderViewModels.push(new Cesium.ProviderViewModel({
        name : '无地形',
        iconUrl : Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/Ellipsoid.png'),
        tooltip : 'no-terrain',
        creationFunction : function() {
            return new Cesium.EllipsoidTerrainProvider();
        }
    }));


    terrainProviderViewModels.push(new Cesium.ProviderViewModel({
        name : 'quantized-mesh中国云南',
        iconUrl : Cesium.buildModuleUrl('/img/aster-gdem.png'),
        tooltip : 'quantized-mesh中国云南',
        creationFunction : function() {
            return new HeightmapAndQuantizedMeshTerrainProvider({
                //url : "terrain",
                url :  'http://' + $.webgis.remote.tiles_host + ':' + $.webgis.remote.tiles_port + '/terrain',
                terrain_type : 'quantized_mesh',
                credit : ''
            });
        }
    }));
    //terrainProviderViewModels.push(new Cesium.ProviderViewModel({
        //name : 'Small Terrain heightmaps with water',
        //iconUrl : Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/STK.png'),
        //tooltip : 'Medium-resolution, heightmap-based terrain for the entire globe. This tileset also includes a water mask. Free for use on the Internet.\nhttp://www.agi.com',
        //creationFunction : function() {
            //return new Cesium.CesiumTerrainProvider({
                //url : '//cesiumjs.org/smallterrain',
                //credit : 'Terrain data courtesy Analytical Graphics, Inc.'
            //});
        //}
    //}));
    var viewer;
    
    viewer = new Cesium.Viewer('cesiumContainer',{
        fullscreenButton:false,
        showRenderLoopErrors:false,
        scene3DOnly:true,
        animation:false,
        baseLayerPicker:true,
        geocoder:false,
        timeline:false,
        selectionIndicator:true,
        sceneModePicker:false,
        navigationInstructionsInitiallyVisible:false,
        infoBox:false,
        //useDefaultRenderLoop:true,
        imageryProviderViewModels:providerViewModels,
        terrainProviderViewModels:terrainProviderViewModels
    });
    viewer.scene.camera.frustum.fov = Cesium.Math.PI_OVER_TWO;
    TranslateToCN();
    TowerInfoMixin(viewer);
    return viewer;
}



function ClearSelectColor2D(viewer)
{
    if($.webgis.control.leaflet_geojson_layer)
    {
        $.webgis.control.leaflet_geojson_layer.eachLayer(function(layer){
            if(layer.feature && layer.feature._id)
            {
                if($.webgis.mapping.leaflet_old_style[layer.feature._id])
                {
                    var opt = $.webgis.mapping.leaflet_old_style[layer.feature._id];
                    layer.setStyle({color:opt.color, weight:opt.weight});
                    delete $.webgis.mapping.leaflet_old_style[layer.feature._id];
                }
            }
        });
    }
    viewer.eachLayer(function(layer){
        if(layer.eachLayer)
        {
            layer.eachLayer(function(lyr){
                if(lyr.geojson && lyr.geojson._id && $.webgis.mapping.leaflet_old_style[lyr.geojson._id])
                {
                    var opt = $.webgis.mapping.leaflet_old_style[lyr.geojson._id];
                    lyr.setStyle({color:opt.color, weight:opt.weight});
                    delete $.webgis.mapping.leaflet_old_style[lyr.geojson._id];
                }
                
            });
        }
    });
    
}

function RemoveCzml(id)
{
    if($.webgis.config.map_backend === 'cesium') {
        _.remove($.webgis.data.czmls, {id: id});
    }
    _.remove($.webgis.data.geojsons, {_id:id});
}
function InitKeyboardEvent(viewer)
{
    var get_current_edge = function(id0, id1)
    {
        var ret;
        for(var i in $.webgis.geometry.segments)
        {
            var seg = $.webgis.geometry.segments[i];
            if(  (seg['webgis_type'] == 'edge_dn' || seg['webgis_type'] == 'edge_tower') && seg['start'] == id0 && seg['end'] == id1)
            {
                ret = seg['primitive'];
                break;
            }
        }
        return ret;
    };
    var change_color = function(webgis_type, id)
    {
        if($.webgis.config.map_backend === 'cesium')
        {
            var c = Cesium.Color.fromCssColorString("rgba(200,200,0,1)");
            var edge = get_current_edge($.webgis.select.prev_selected_obj.id, $.webgis.select.selected_obj.id);
            var m =    Cesium.Material.fromType('PolylineArrow', {
                            color : c
                    });
            for(var i=0; i<edge.length; i++)
            {
                var p = edge.get(i);
                p.material = m;
            }
        }
        if($.webgis.config.map_backend === 'leaflet' && webgis_type && id)
        {
            var color = ColorArrayToHTMLColor([200,200,0,1]);
            var lyr_polylinegroup;
            viewer.eachLayer(function (layer) {
                if(layer.name && layer.name === webgis_type)
                {
                    lyr_polylinegroup = layer;
                    return;
                }
            });
            if(lyr_polylinegroup)
            {
                lyr_polylinegroup.eachLayer(function(layer){
                    if(layer.geojson && layer.geojson.properties && layer.geojson.properties.start === $.webgis.select.prev_selected_obj.id && layer.geojson.properties.end === $.webgis.select.selected_obj.id)
                    {
                        layer.geojson._id = id;
                        layer.setStyle({color:color, weight:5});
                        return;
                    }
                });
            }
        }
    };
    
    if($.webgis.config.map_backend === 'leaflet')
    {
        viewer.on('click', function(e){
            //console.log('mapclick');
            if($.webgis.select.selected_obj)
            {
                //$.webgis.select.prev_selected_obj = $.extend(true, {}, $.webgis.select.selected_obj);
                delete $.webgis.select.selected_obj;
                $.webgis.select.selected_obj = undefined;
            }
            if($.webgis.select.prev_selected_obj)
            {
                delete $.webgis.select.prev_selected_obj;
                $.webgis.select.prev_selected_obj = undefined;
            }
            ClearSelectColor2D(viewer);
            
        });
    }
    $(document).on('click', function(e){
        if( e.target.id != 'anti_bird_msg_list_container' && e.target.id != 'button_anti_bird' && e.target.id != 'anti_bird_msg_list_filter') {
            $("#anti_bird_msg_list_container").hide('slide', {direction:'right'}, 500);
        }
    });
    $(document).on('keydown', function(e){
        if(e.ctrlKey)
        {
            $.webgis.key_event.ctrl = true;
            e.preventDefault();
        }
    });
    
    $(document).on('keyup', function(e){
        e.preventDefault();
        if(e.keyCode == 17)//ctrl(17)
        {
            $.webgis.key_event.ctrl = false;
        }
        if($.webgis.key_event.ctrl === true && e.keyCode == 76)//ctrl(17) L(76)
        {
            //if()
            //{
                //$.jGrowl("请先勾选“线路-->显示结点关系”",{
                    //life: 2000,
                    //position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                    //theme: 'bubblestylefail',
                    //glue:'before'
                //});
                //return;
            //}
            $.webgis.config.node_connect_mode = !$.webgis.config.node_connect_mode;
            if($.webgis.config.node_connect_mode)
            {
                //$(".jGrowl-notification:last-child").remove();
                $.jGrowl('<div>连接模式开启(CTRL+L键关闭)</div><span id="div_edge_instruction"></span><button  id="btn_edge_save">保存</button>', { 
                    sticky:true,
                    //life:3000,
                    position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                    theme: 'bubblestylesuccess',
                    glue:'before',
                    afterOpen:function(){
                        $('#btn_edge_save').off();
                        $('#btn_edge_save').on('click', function(){
                            SaveEdge(viewer, null, function(data){
                                $('#btn_edge_save').attr('disabled','disabled');
                                if(data.length>0)
                                {
                                    if(data[0]['result'])
                                    {
                                        $.jGrowl(data[0]['result'], { 
                                            life: 2000,
                                            position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                                            theme: 'bubblestylefail',
                                            glue:'before'
                                        });
                                    }
                                    else
                                    {
                                        var webgis_type;
                                        _.forEach(data, function(item){
                                            webgis_type = item.properties.webgis_type;
                                            var edge = _.find($.webgis.data.geojsons, {_id:item._id});
                                            if(!edge){
                                                $.webgis.data.geojsons.push(item);
                                                if($.webgis.config.map_backend === 'leaflet'){
                                                    change_color(webgis_type, item._id);
                                                }
                                            }
                                        });
                                        //{
                                        //    var g = data[i];
                                        //    webgis_type = g['properties']['webgis_type'];
                                        //    if(!$.webgis.data.geojsons[g['_id']])
                                        //    {
                                        //        $.webgis.data.geojsons[g['_id']] = g;
                                        //        if($.webgis.config.map_backend === 'leaflet')
                                        //        {
                                        //            change_color(webgis_type, g['_id']);
                                        //        }
                                        //    }
                                        //}
                                        if($.webgis.config.map_backend === 'cesium')
                                        {
                                            change_color();
                                        }
                                        $.jGrowl("保存成功", { 
                                            life: 2000,
                                            position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                                            theme: 'bubblestylesuccess',
                                            glue:'before'
                                        });
                                    }
                                }
                            });
                        });
                        $('#btn_edge_save').attr('disabled','disabled');
                    }
                });
            }
            else
            {
                //$(".jGrowl-notification:last").trigger('jGrowl.close');
                $('.jGrowl-notification').trigger('jGrowl.close');
                $.jGrowl("连接模式关闭(CTRL+L键开启)", { 
                    life:3000,
                    position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                    theme: 'bubblestylesuccess',
                    glue:'before'
                });
            }
        }
        if(e.keyCode == 46)//delete
        {
            $('#control_toolpanel_kmgd_left').hide('slide',{}, 400, function(){
                $('#control_toolpanel_kmgd_handle').css('display','block');
            });
            try{
                $('#dlg_tower_info').dialog("close");
                $('#dlg_poi_info').dialog("close");
                
            }catch(e)
            {
                //console.log(e);
            }
            //console.log($.webgis.select.selected_obj);
            if($.webgis.select.selected_obj && $.webgis.select.selected_obj.id && $.webgis.select.selected_obj.id.properties && $.webgis.select.selected_obj.id.properties.webgis_type.indexOf('edge_')>-1)
            {
                if(!CheckPermission('edge_delete'))
                {
                    return;
                }
                var get_name = function()
                {
                    var s0 = '', s1 = '';
                    var id0 = $.webgis.select.selected_obj.id.properties.start;
                    var id1 = $.webgis.select.selected_obj.id.properties.end;
                    var g0 = _.find($.webgis.data.geojsons, {_id:id0});
                    var g1 = _.find($.webgis.data.geojsons, {_id:id1});
                    if(g0) s0 = g0.properties.name;
                    if(g1) s1 = g1.properties.name;
                    return s0 + '-' + s1;
                };
                var get_id = function()
                {
                    var ret;
                    ret = _.result(_.first(_.filter($.webgis.data.geojsons, {
                        properties:{
                            start:$.webgis.select.selected_obj.id.properties.start,
                            end:$.webgis.select.selected_obj.id.properties.end
                        }})), '_id');
                    return ret;
                };
                var name = get_name();
                
                ShowConfirm(null, 400, 280, '删除确认', '你确认要删除[' + name + ']之间的联系吗?', function(){
                    //console.log($.webgis.select.selected_obj.id);
                    var id = get_id();
                    //console.log(id);
                    if(id)
                    {
                        var cond = {'db':$.webgis.db.db_name, 'collection':'edges', 'action':'remove', '_id':id};
                        MongoFind( cond, 
                            function(data){
                                if(data.length>0)
                                {
                                    if(data[0]['ok'] === 1)
                                    {
                                        $.jGrowl("删除成功", { 
                                            life:2000,
                                            position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                                            theme: 'bubblestylesuccess',
                                            glue:'before'
                                        });
                                        if($.webgis.config.map_backend === 'leaflet')
                                        {
                                            viewer.eachLayer(function(layer){
                                                if(layer.eachLayer)
                                                {
                                                    layer.eachLayer(function(lyr){
                                                        if(lyr.geojson && lyr.geojson._id && lyr.geojson._id == id)
                                                        {
                                                            layer.removeLayer(lyr);
                                                        }
                                                    });
                                                }
                                            });
                                            
                                        }
                                    }else
                                    {
                                    }
                                }
                        });
                    }
                    RemoveSegmentsBetweenTwoNode(viewer, {id:$.webgis.select.selected_obj.id.properties.start},{id:$.webgis.select.selected_obj.id.properties.end});
                    
                });
            }
            var g;
            if($.webgis.select.selected_obj) {
                g = _.find($.webgis.data.geojsons, {_id: $.webgis.select.selected_obj.id});
            }
            if($.webgis.select.selected_obj && $.webgis.select.selected_obj.id && ($.webgis.select.selected_obj.point || $.webgis.select.selected_obj.polyline || $.webgis.select.selected_obj.polygon) && g  &&
            (  g.properties.webgis_type === 'point_marker'
            || g.properties.webgis_type === 'point_hazard'
            || g.properties.webgis_type === 'point_tower'
            || g.properties.webgis_type === 'point_dn'
            ||g.properties.webgis_type === 'polyline_marker'
            || g.properties.webgis_type === 'polyline_hazard'
            || g.properties.webgis_type === 'polygon_marker'
            || g.properties.webgis_type === 'polygon_hazard'
            || g.properties.webgis_type === 'polygon_buffer'
            ))
            {
                if(g.properties.webgis_type === 'point_tower')
                {
                    if(!CheckPermission('tower_delete'))
                    {
                        return;
                    }
                }
                if(!CheckPermission('feature_delete'))
                {
                    return;
                }
                
                ShowConfirm(null, 400, 180, '删除确认', '你确认要删除对象[' + g.properties.name + ']吗?', function(){
                    //if(g.properties.webgis_type === 'point_tower')
                    //{
                        //return;
                    //}
                    var cond = {'db':$.webgis.db.db_name, 'collection':'features', 'action':'remove', '_id':$.webgis.select.selected_obj.id};
                    MongoFind( cond, 
                        function(data){
                            //console.log(data);
                            if(data.length>0)
                            {
                                if(data[0]['ok'] === 1)
                                {
                                    $.jGrowl("删除成功", { 
                                        life:2000,
                                        position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                                        theme: 'bubblestylesuccess',
                                        glue:'before'
                                    });
                                    RemoveCzml($.webgis.select.selected_obj.id);
                                    delete $.webgis.select.prev_selected_obj;
                                    $.webgis.select.prev_selected_obj = undefined;
                                    delete $.webgis.select.selected_obj;
                                    $.webgis.select.selected_obj = undefined;
                                    viewer.selectedEntity = undefined;
                                    viewer.trackedEntity = undefined;
                                    if($.webgis.config.map_backend === 'cesium')
                                    {
                                        ReloadCzmlDataSource(viewer, $.webgis.config.zaware, true);
                                    }
                                }
                                else
                                {
                                    if(data[0]['err'] === 'edge_exist')
                                    {
                                        ShowMessage(null, 400, 300, '无法删除有关联的结点', '请先删除该结点与其他结点之间的所有关联。方法是：地图图层->线路->显示节点关系，勾选后用鼠标选择两个结点之间的关联线，点击DEL键删除。');
                                    }
                                }
                            }
                    });
                });
            }
        }
    });
}





function Logout(callback)
{
    //var cond = {'db':$.webgis.db.db_name, 'collection':'userinfo', 'url':'/logout'};
    //MongoFind(cond, function(data){
    //    if(callback) callback(data);
    //});
    var url = '/logout';
    $.get(url,{}, function( data1 ){
        if(callback) callback(data1);
    });
}

function InitLogout(viewer)
{
    var LogoutButtonViewModel = function() {
        var that = this;
        this._command = Cesium.createCommand(function() {
            //console.log('logout');
            ShowConfirm(null, 500, 200,
                '登出确认',
                '确认要登出吗?',
                function(){
                    Logout(function(data){
                        console.log(data);
                        if(data.result)
                        {
                            window.location.href = '/webgis_login.html';
                        }
                        //window.location.href = '/logout';
                    });
                },
                function(){
                }
            );
        });
        this.tooltip = '退出';
    };

    Cesium.defineProperties(LogoutButtonViewModel.prototype, {
        command : {
            get : function() {
                return this._command;
            }
        }
    });
    
    var LogoutButton = function(options) {
        if (!Cesium.defined(options) || !Cesium.defined(options.container)) {
            throw new Cesium.DeveloperError('options.container is required.');
        }
        var container = Cesium.getElement(options.container);

        var viewModel = new LogoutButtonViewModel();
        viewModel._svgPath = 'M0 765.76q0 83.936 59.292 143.472t143.228 59.536h72.224q33.184 0 56.852 -23.668t23.668 -56.852 -23.668 -56.852 -56.852 -23.668h-72.224q-17.08 0 -29.524 -12.2t-12.444 -29.768v-531.92q0 -17.08 12.444 -29.28t29.524 -12.2h72.224q33.184 0 56.852 -23.668t23.668 -56.852 -23.668 -56.608 -56.852 -23.424h-72.224q-83.936 0 -143.228 59.048t-59.292 142.984v531.92zm238.144 -251.808q0 -33.184 23.668 -56.608t56.852 -23.424h344.04l-109.8 -110.776q-23.912 -23.424 -23.912 -56.852t23.912 -56.852q23.424 -23.424 56.608 -23.424t56.608 23.424l247.416 247.904q23.424 23.424 23.424 56.608t-23.424 56.608l-242.536 242.536q-23.424 23.424 -56.608 23.424t-57.096 -23.424q-23.424 -23.424 -23.424 -56.608t23.912 -57.096l104.92 -104.92h-344.04q-32.696 0 -56.608 -23.912t-23.912 -56.608z';
        var wrapper = document.createElement('span');
        wrapper.className = 'cesium-navigationHelpButton-wrapper';
        container.appendChild(wrapper);

        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'cesium-button cesium-toolbar-button cesium-navigation-help-button';
        button.setAttribute('data-bind', '\
attr: { title: tooltip },\
click: command,\
cesiumSvgPath: { path: _svgPath, width: 1024, height: 1024 }');
        wrapper.appendChild(button);
        Cesium.knockout.applyBindings(viewModel, wrapper);

        this._container = container;
        this._viewModel = viewModel;
        this._wrapper = wrapper;

    };

    Cesium.defineProperties(LogoutButton.prototype, {
        container : {
            get : function() {
                return this._container;
            }
        },
        viewModel : {
            get : function() {
                return this._viewModel;
            }
        }
    });

    LogoutButton.prototype.isDestroyed = function() {
        return false;
    };

    LogoutButton.prototype.destroy = function() {
        Cesium.knockout.cleanNode(this._wrapper);
        this._container.removeChild(this._wrapper);
        return Cesium.destroyObject(this);
    };
    var logoutButton = new LogoutButton({
        container : $('.cesium-viewer-toolbar')[0]
    });

}

function InitLayerControl2D(viewer)
{
    var BaseLayerPickerViewModel = function(options) {
        options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);

        var imageryProviderViewModels = Cesium.defaultValue(options.layers, []);
        this.imageryProviderViewModels = imageryProviderViewModels.slice(0);


        this.dropDownVisible = false;

        Cesium.knockout.track(this, ['imageryProviderViewModels', 'dropDownVisible']);

        this.buttonTooltip = undefined;
        Cesium.knockout.defineProperty(this, 'buttonTooltip', function() {
            var selectedImagery = this.selectedImagery;
            var imageryTip = Cesium.defined(selectedImagery) ? selectedImagery.name : undefined;
            if (Cesium.defined(imageryTip)) {
                return imageryTip;
            }
            return "";
        });

        this.buttonImageUrl = undefined;
        Cesium.knockout.defineProperty(this, 'buttonImageUrl', function() {
            var viewModel = this.selectedImagery;
            return Cesium.defined(viewModel) ? viewModel.iconUrl : undefined;
        });

        this.selectedImagery = undefined;
        var selectedImageryViewModel = Cesium.knockout.observable();

        this._currentImageryProviders = [];
        Cesium.knockout.defineProperty(this, 'selectedImagery', {
            get : function() {
                return selectedImageryViewModel();
            },
            set : function(value) {
                if (selectedImageryViewModel() === value) {
                    this.dropDownVisible = false;
                    return;
                }

                var imageryLayers = viewer.layers;
                _.forEach( viewer.layers, function(layer) {
                    //var layer = viewer.layers[i];
                    if(viewer.hasLayer(layer))
                    {
                        viewer.removeLayer(layer);
                        return;
                    }
                });

                if (Cesium.defined(value)) 
                {
                    viewer.addLayer(value, true);
                }
                selectedImageryViewModel(value);
                this.dropDownVisible = false;
                
            }
        });


        var that = this;
        this._toggleDropDown = Cesium.createCommand(function() {
            that.dropDownVisible = !that.dropDownVisible;
        });

        this.selectedImagery = Cesium.defaultValue(options.selectedLayer, imageryProviderViewModels[0]);
    };

    Cesium.defineProperties(BaseLayerPickerViewModel.prototype, {
        toggleDropDown : {
            get : function() {
                return this._toggleDropDown;
            }
        }
    });
    var BaseLayerPicker = function(container, options) {
        if (!Cesium.defined(container)) {
            throw new Cesium.DeveloperError('container is required.');
        }

        container = Cesium.getElement(container);
        var viewModel = new BaseLayerPickerViewModel(options);

        var element = document.createElement('button');
        element.type = 'button';
        element.className = 'cesium-button cesium-toolbar-button';
        element.setAttribute('data-bind', '\
attr: { title: buttonTooltip },\
click: toggleDropDown');
        container.appendChild(element);

        var imgElement = document.createElement('img');
        imgElement.setAttribute('draggable', 'false');
        imgElement.className = 'cesium-baseLayerPicker-selected';
        imgElement.setAttribute('data-bind', '\
attr: { src: buttonImageUrl }');
        element.appendChild(imgElement);

        var dropPanel = document.createElement('div');
        dropPanel.className = 'cesium-baseLayerPicker-dropDown';
        dropPanel.setAttribute('data-bind', '\
css: { "cesium-baseLayerPicker-dropDown-visible" : dropDownVisible }');
        container.appendChild(dropPanel);

        var imageryTitle = document.createElement('div');
        imageryTitle.className = 'cesium-baseLayerPicker-sectionTitle';
        imageryTitle.setAttribute('data-bind', 'visible: imageryProviderViewModels.length > 0');
        imageryTitle.innerHTML = '选择地图';
        dropPanel.appendChild(imageryTitle);

        var imageryChoices = document.createElement('div');
        imageryChoices.className = 'cesium-baseLayerPicker-choices';
        imageryChoices.setAttribute('data-bind', 'foreach: imageryProviderViewModels');
        dropPanel.appendChild(imageryChoices);

        var imageryProvider = document.createElement('div');
        imageryProvider.className = 'cesium-baseLayerPicker-item';
        imageryProvider.setAttribute('data-bind', '\
css: { "cesium-baseLayerPicker-selectedItem" : $data === $parent.selectedImagery },\
attr: { title: tooltip },\
visible: true,\
click: function($data) { $parent.selectedImagery = $data; }');
        imageryChoices.appendChild(imageryProvider);

        var providerIcon = document.createElement('img');
        providerIcon.className = 'cesium-baseLayerPicker-itemIcon';
        providerIcon.setAttribute('data-bind', 'attr: { src: iconUrl }');
        providerIcon.setAttribute('draggable', 'false');
        imageryProvider.appendChild(providerIcon);

        var providerLabel = document.createElement('div');
        providerLabel.className = 'cesium-baseLayerPicker-itemLabel';
        providerLabel.setAttribute('data-bind', 'text: name');
        imageryProvider.appendChild(providerLabel);


        Cesium.knockout.applyBindings(viewModel, element);
        Cesium.knockout.applyBindings(viewModel, dropPanel);

        this._viewModel = viewModel;
        this._container = container;
        this._element = element;
        this._dropPanel = dropPanel;

        this._closeDropDown = function(e) {
            if (!(element.contains(e.target) || dropPanel.contains(e.target))) {
                viewModel.dropDownVisible = false;
            }
        };

        document.addEventListener('mousedown', this._closeDropDown, true);
        document.addEventListener('touchstart', this._closeDropDown, true);
    };

    Cesium.defineProperties(BaseLayerPicker.prototype, {
        container : {
            get : function() {
                return this._container;
            }
        },

        viewModel : {
            get : function() {
                return this._viewModel;
            }
        }
    });

    BaseLayerPicker.prototype.isDestroyed = function() {
        return false;
    };

    BaseLayerPicker.prototype.destroy = function() {
        document.removeEventListener('mousedown', this._closeDropDown, true);
        document.removeEventListener('touchstart', this._closeDropDown, true);
        Cesium.knockout.cleanNode(this._element);
        Cesium.knockout.cleanNode(this._dropPanel);
        this._container.removeChild(this._element);
        this._container.removeChild(this._dropPanel);
        return Cesium.destroyObject(this);
    };

    $.webgis.toolbar.BaseLayerPicker = new BaseLayerPicker($('.cesium-viewer-toolbar')[0], {layers:viewer.layers, selectedLayer:viewer.layers[0]});

}

function InitHomeButton2D(viewer)
{
    var viewHome = function() {
        var center = GetDefaultCenter($.webgis.db.db_name);
        var c = L.latLng(center[1], center[0]);
        viewer.setView(c, 10);
    }

    var HomeButtonViewModel = function(scene, duration) {
        
        duration = Cesium.defaultValue(duration, 1.5);

        this._scene = scene;
        this._duration = duration;

        var that = this;
        this._command = Cesium.createCommand(function() {
            viewHome();
        });

        this.tooltip = '默认视图';

        Cesium.knockout.track(this, ['tooltip']);
    };

    Cesium.defineProperties(HomeButtonViewModel.prototype, {
        scene : {
            get : function() {
                return this._scene;
            }
        },

        command : {
            get : function() {
                return this._command;
            }
        },

        duration : {
            get : function() {
                return this._duration;
            },
            set : function(value) {
                if (value < 0) {
                    throw new Cesium.DeveloperError('value must be positive.');
                }
                this._duration = value;
            }
        }
    });
    
    var HomeButton = function(container, scene, duration) {
        if (!Cesium.defined(container)) {
            throw new Cesium.DeveloperError('container is required.');
        }

        container = Cesium.getElement(container);

        var viewModel = new HomeButtonViewModel(scene, duration);

        viewModel._svgPath = 'M14,4l-10,8.75h20l-4.25-3.7188v-4.6562h-2.812v2.1875l-2.938-2.5625zm-7.0938,9.906v10.094h14.094v-10.094h-14.094zm2.1876,2.313h3.3122v4.25h-3.3122v-4.25zm5.8442,1.281h3.406v6.438h-3.406v-6.438z';

        var element = document.createElement('button');
        element.type = 'button';
        element.className = 'cesium-button cesium-toolbar-button cesium-home-button';
        element.setAttribute('data-bind', '\
attr: { title: tooltip },\
click: command,\
cesiumSvgPath: { path: _svgPath, width: 28, height: 28 }');

        container.appendChild(element);

        Cesium.knockout.applyBindings(viewModel, element);

        this._container = container;
        this._viewModel = viewModel;
        this._element = element;
    };

    Cesium.defineProperties(HomeButton.prototype, {
        container : {
            get : function() {
                return this._container;
            }
        },
        viewModel : {
            get : function() {
                return this._viewModel;
            }
        }
    });

    HomeButton.prototype.isDestroyed = function() {
        return false;
    };

    HomeButton.prototype.destroy = function() {
        Cesium.knockout.cleanNode(this._element);
        this._container.removeChild(this._element);

        return Cesium.destroyObject(this);
    };
    $.webgis.toolbar.HomeButton = new HomeButton($('.cesium-viewer-toolbar')[0]);

}


function InitNavigationHelp(viewer)
{
    var NavigationHelpButtonViewModel = function() {
        this.showInstructions = false;

        var that = this;
        this._command = Cesium.createCommand(function() {
            that.showInstructions = !that.showInstructions;
        });
        this._showClick = Cesium.createCommand(function() {
            that._touch = false;
        });
        this._showTouch = Cesium.createCommand(function() {
            that._touch = true;
        });

        this._touch = false;

        this.tooltip = '操作帮助';

        Cesium.knockout.track(this, ['tooltip', 'showInstructions', '_touch']);
    };

    Cesium.defineProperties(NavigationHelpButtonViewModel.prototype, {
        command : {
            get : function() {
                return this._command;
            }
        },

        showClick : {
            get : function() {
                return this._showClick;
            }
        },

        showTouch : {
            get: function() {
                return this._showTouch;
            }
        }
    });
    
    var NavigationHelpButton = function(options) {
        if (!Cesium.defined(options) || !Cesium.defined(options.container)) {
            throw new Cesium.DeveloperError('options.container is required.');
        }

        var container = Cesium.getElement(options.container);

        var viewModel = new NavigationHelpButtonViewModel();

        var showInsructionsDefault = Cesium.defaultValue(options.instructionsInitiallyVisible, false);
        viewModel.showInstructions = showInsructionsDefault;

        viewModel._svgPath = 'M16,1.466C7.973,1.466,1.466,7.973,1.466,16c0,8.027,6.507,14.534,14.534,14.534c8.027,0,14.534-6.507,14.534-14.534C30.534,7.973,24.027,1.466,16,1.466z M17.328,24.371h-2.707v-2.596h2.707V24.371zM17.328,19.003v0.858h-2.707v-1.057c0-3.19,3.63-3.696,3.63-5.963c0-1.034-0.924-1.826-2.134-1.826c-1.254,0-2.354,0.924-2.354,0.924l-1.541-1.915c0,0,1.519-1.584,4.137-1.584c2.487,0,4.796,1.54,4.796,4.136C21.156,16.208,17.328,16.627,17.328,19.003z';

        var wrapper = document.createElement('span');
        wrapper.className = 'cesium-navigationHelpButton-wrapper';
        container.appendChild(wrapper);

        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'cesium-button cesium-toolbar-button cesium-navigation-help-button';
        button.setAttribute('data-bind', '\
attr: { title: tooltip },\
click: command,\
cesiumSvgPath: { path: _svgPath, width: 32, height: 32 }');
        wrapper.appendChild(button);

        var instructionContainer = document.createElement('div');
        instructionContainer.className = 'cesium-navigation-help';
        instructionContainer.setAttribute('data-bind', 'css: { "cesium-navigation-help-visible" : showInstructions}');
        wrapper.appendChild(instructionContainer);

        var mouseButton = document.createElement('button');
        mouseButton.className = 'cesium-navigation-button cesium-navigation-button-left';
        mouseButton.setAttribute('data-bind', 'click: showClick, css: {"cesium-navigation-button-selected": !_touch, "cesium-navigation-button-unselected": _touch}');
        var mouseIcon = document.createElement('img');
        mouseIcon.src = Cesium.buildModuleUrl('Widgets/Images/NavigationHelp/Mouse.svg');
        mouseIcon.className = 'cesium-navigation-button-icon';
        mouseIcon.style.width = '25px';
        mouseIcon.style.height = '25px';
        mouseButton.appendChild(mouseIcon);
        mouseButton.appendChild(document.createTextNode('Mouse'));

        var touchButton = document.createElement('button');
        touchButton.className = 'cesium-navigation-button cesium-navigation-button-right';
        touchButton.setAttribute('data-bind', 'click: showTouch, css: {"cesium-navigation-button-selected": _touch, "cesium-navigation-button-unselected": !_touch}');
        var touchIcon = document.createElement('img');
        touchIcon.src = Cesium.buildModuleUrl('Widgets/Images/NavigationHelp/Touch.svg');
        touchIcon.className = 'cesium-navigation-button-icon';
        touchIcon.style.width = '25px';
        touchIcon.style.height = '25px';
        touchButton.appendChild(touchIcon);
        touchButton.appendChild(document.createTextNode('Touch'));

        instructionContainer.appendChild(mouseButton);
        instructionContainer.appendChild(touchButton);


        var clickInstructions = document.createElement('div');
        clickInstructions.className = 'cesium-click-navigation-help cesium-navigation-help-instructions';
        clickInstructions.setAttribute('data-bind', 'css: { "cesium-click-navigation-help-visible" : !_touch}');
        clickInstructions.innerHTML = '\
            <table>\
                <tr>\
                    <td><img src="' + Cesium.buildModuleUrl('Widgets/Images/NavigationHelp/MouseLeft.svg') + '" width="48" height="48" /></td>\
                    <td>\
                        <div class="cesium-navigation-help-pan">Pan view</div>\
                        <div class="cesium-navigation-help-details">Left click + drag</div>\
                    </td>\
                </tr>\
                <tr>\
                    <td><img src="' + Cesium.buildModuleUrl('Widgets/Images/NavigationHelp/MouseRight.svg') + '" width="48" height="48" /></td>\
                    <td>\
                        <div class="cesium-navigation-help-zoom">Zoom view</div>\
                        <div class="cesium-navigation-help-details">Right click + drag, or</div>\
                        <div class="cesium-navigation-help-details">Mouse wheel scroll</div>\
                    </td>\
                </tr>\
                <tr>\
                    <td><img src="' + Cesium.buildModuleUrl('Widgets/Images/NavigationHelp/MouseMiddle.svg') + '" width="48" height="48" /></td>\
                    <td>\
                        <div class="cesium-navigation-help-rotate">Rotate view</div>\
                        <div class="cesium-navigation-help-details">Middle click + drag, or</div>\
                        <div class="cesium-navigation-help-details">CTRL + Left click + drag</div>\
                    </td>\
                </tr>\
            </table>';

        instructionContainer.appendChild(clickInstructions);

        var touchInstructions = document.createElement('div');
        touchInstructions.className = 'cesium-touch-navigation-help cesium-navigation-help-instructions';
        touchInstructions.setAttribute('data-bind', 'css: { "cesium-touch-navigation-help-visible" : _touch}');
        touchInstructions.innerHTML = '\
            <table>\
                <tr>\
                    <td><img src="' + Cesium.buildModuleUrl('Widgets/Images/NavigationHelp/TouchDrag.svg') + '" width="70" height="48" /></td>\
                    <td>\
                        <div class="cesium-navigation-help-pan">Pan view</div>\
                        <div class="cesium-navigation-help-details">One finger drag</div>\
                    </td>\
                </tr>\
                <tr>\
                    <td><img src="' + Cesium.buildModuleUrl('Widgets/Images/NavigationHelp/TouchZoom.svg') + '" width="70" height="48" /></td>\
                    <td>\
                        <div class="cesium-navigation-help-zoom">Zoom view</div>\
                        <div class="cesium-navigation-help-details">Two finger pinch</div>\
                    </td>\
                </tr>\
                <tr>\
                    <td><img src="' + Cesium.buildModuleUrl('Widgets/Images/NavigationHelp/TouchTilt.svg') + '" width="70" height="48" /></td>\
                    <td>\
                        <div class="cesium-navigation-help-rotate">Tilt view</div>\
                        <div class="cesium-navigation-help-details">Two finger drag, same direction</div>\
                    </td>\
                </tr>\
                <tr>\
                    <td><img src="' + Cesium.buildModuleUrl('Widgets/Images/NavigationHelp/TouchRotate.svg') + '" width="70" height="48" /></td>\
                    <td>\
                        <div class="cesium-navigation-help-tilt">Rotate view</div>\
                        <div class="cesium-navigation-help-details">Two finger drag, opposite direction</div>\
                    </td>\
                </tr>\
            </table>';

        instructionContainer.appendChild(touchInstructions);

        Cesium.knockout.applyBindings(viewModel, wrapper);

        this._container = container;
        this._viewModel = viewModel;
        this._wrapper = wrapper;

        this._closeInstructions = function(e) {
            if (!wrapper.contains(e.target)) {
                viewModel.showInstructions = false;
            }
        };

        document.addEventListener('mousedown', this._closeInstructions, true);
        document.addEventListener('touchstart', this._closeInstructions, true);
    };

    Cesium.defineProperties(NavigationHelpButton.prototype, {
        container : {
            get : function() {
                return this._container;
            }
        },

        viewModel : {
            get : function() {
                return this._viewModel;
            }
        }
    });

    NavigationHelpButton.prototype.isDestroyed = function() {
        return false;
    };

    NavigationHelpButton.prototype.destroy = function() {
        document.removeEventListener('mousedown', this._closeInstructions, true);
        document.removeEventListener('touchstart', this._closeInstructions, true);

        Cesium.knockout.cleanNode(this._wrapper);
        this._container.removeChild(this._wrapper);

        return Cesium.destroyObject(this);
    };
    
    $.webgis.toolbar.NavigationHelpButton = new NavigationHelpButton({
        container : $('.cesium-viewer-toolbar')[0]
    });
    
}

function InitRuler(viewer)
{
    var RulerButtonViewModel = function() {
        var that = this;
        this._command = Cesium.createCommand(function() {
            if($.webgis.control.drawhelper_mode === undefined)
            {
                $.webgis.control.drawhelper_mode = 'ruler';
                $(that.button).css('background-color', 'rgba(0, 255, 0, 0.5)');
                if(!$.webgis.control.drawhelper.isVisible())
                {
                    $.webgis.control.drawhelper.show(true);
                }
                
            }
            else
            {
                $.webgis.control.drawhelper_mode = undefined;
                $(that.button).css('background-color', 'rgba(38, 38, 38, 0.75)');
                if($.webgis.control.drawhelper.isVisible())
                {
                    $.webgis.control.drawhelper.clearPrimitive();
                    $.webgis.control.drawhelper.show(false);
                }
            }
        });
        this.tooltip = '测量';
    };

    Cesium.defineProperties(RulerButtonViewModel.prototype, {
        command : {
            get : function() {
                return this._command;
            }
        }
    });
    
    var RulerButton = function(options) {
        if (!Cesium.defined(options) || !Cesium.defined(options.container)) {
            throw new Cesium.DeveloperError('options.container is required.');
        }
        var container = Cesium.getElement(options.container);

        var viewModel = new RulerButtonViewModel();
        viewModel._svgPath = 'M21.828,0L0,21.418l5.414,5.517L27.24,5.517L21.828,0z M23.486,7.317l-0.748,0.735l-1.089-1.11l-0.691,0.679l1.089,1.109  l-1.028,1.008l-1.676-1.709l-0.692,0.679l1.677,1.708L19.58,11.15l-1.088-1.109l-0.691,0.678l1.087,1.11l-1.009,0.99l-1.853-1.888  l-0.693,0.679l1.854,1.888l-0.748,0.733l-1.265-1.289l-0.692,0.679l1.265,1.289l-1.026,1.007l-1.853-1.888l-0.692,0.679l1.854,1.888  l-0.748,0.734l-1.265-1.29l-0.691,0.679l1.265,1.29l-0.948,0.93L9.79,17.049l-0.692,0.679l1.854,1.889l-0.748,0.733l-1.265-1.289  L8.249,19.74l1.264,1.289l-1.026,1.008l-1.854-1.888l-0.691,0.678l1.853,1.889L7.046,23.45l-1.265-1.29l-0.69,0.679l1.265,1.29  l-0.924,0.906l-3.53-3.598L21.81,1.901l3.53,3.597L24.177,6.64L22.5,4.931l-0.691,0.678L23.486,7.317z';
        var wrapper = document.createElement('span');
        wrapper.className = 'cesium-navigationHelpButton-wrapper';
        container.appendChild(wrapper);

        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'cesium-button cesium-toolbar-button cesium-navigation-help-button';
        button.setAttribute('data-bind', '\
attr: { title: tooltip },\
click: command,\
cesiumSvgPath: { path: _svgPath, width: 28, height: 28 }');
        wrapper.appendChild(button);
        viewModel.button = button;
        Cesium.knockout.applyBindings(viewModel, wrapper);

        this._container = container;
        this._viewModel = viewModel;
        this._wrapper = wrapper;

    };

    Cesium.defineProperties(RulerButton.prototype, {
        container : {
            get : function() {
                return this._container;
            }
        },
        viewModel : {
            get : function() {
                return this._viewModel;
            }
        }
    });
    
    
    RulerButton.prototype.isDestroyed = function() {
        return false;
    };

    RulerButton.prototype.destroy = function() {
        Cesium.knockout.cleanNode(this._wrapper);
        this._container.removeChild(this._wrapper);
        return Cesium.destroyObject(this);
    };
    
    //console.log($('.cesium-viewer-toolbar'));
    $.webgis.toolbar.rulerButton = new RulerButton({
        container : $('.cesium-viewer-toolbar')[0]
    });
}


function testheatmap(viewer)
{
    var randnum = function(min, max) {
        return Math.random() * (max - min) + min;
    };
    var randint = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    var testdata = function(mapping){
        var ret = [];
        for(var k in mapping)
        {
            var obj = {};
            obj.radius = 3;
            obj.intensity = randnum(0.2, 100.0);
            obj.center = Cesium.Cartographic.fromDegrees(mapping[k].lng, mapping[k].lat, 0);
            ret.push(obj);
        }
        return ret;
    };
    var testdata1 = function(mapping){
        var ret = [];
        for(var k in mapping)
        {
            var obj = {};
            obj.radius = 100;
            obj.intensity = randnum(0, 200);
            obj.lng = mapping[k].lng;
            obj.lat = mapping[k].lat;
            obj.name = mapping[k].name;
            obj.tower_id = mapping[k].tower_id;
            ret.push(obj);
        }
        return ret;
    };
    var testdata2d = function(mapping){
        var ret = {};
        var data = [];
        for(var k in mapping)
        {
            var obj = {};
            obj.radius = 0.15;
            obj.value = randnum(0, 50);
            obj.lng = mapping[k].lng;
            obj.lat= mapping[k].lat;
            data.push(obj);
        }
        ret.max = data.length;
        ret.data = data;
        return ret;
    };
    if($.webgis.config.map_backend === 'cesium')
    {
        var points = testdata($.webgis.data.antibird.anti_bird_equip_tower_mapping);
        $.webgis.data.heatmap_layers['testheatmap'] = {
            layer: new HeatMapImageryProvider({
                        name:'testheatmap',
                        viewer:viewer,
                        defaultAlpha:0.3,
                        gradientStops:$.webgis.mapping.heat_map_gradient_stops,
                        points:points
                    }),
            type: 'heatmap'
        };
        //var points = testdata1($.webgis.data.antibird.anti_bird_equip_tower_mapping);
        //DrawHeatMapCircle(viewer, points);
    }
    if($.webgis.config.map_backend === 'leaflet')
    {    
        var cfg = {
          // radius should be small ONLY if scaleRadius is true (or small radius is intended)
          // if scaleRadius is false it will be the constant radius used in pixels
          "radius": 2,
          "maxOpacity": 0.6, 
          // scales the radius based on map zoom
          "scaleRadius": true, 
          // if set to false the heatmap uses the global maximum for colorization
          // if activated: uses the data maximum within the current map boundaries 
          //   (there will always be a red spot with useLocalExtremas true)
          "useLocalExtrema": false,
          // which field name in your data represents the latitude - default "lat"
          latField: 'lat',
          // which field name in your data represents the longitude - default "lng"
          lngField: 'lng',
          // which field name in your data represents the data value - default "value"
          valueField: 'value'
        };
        $.webgis.data.heatmap_layers['testheatmap']  = new HeatmapOverlay(cfg);
        viewer.addLayer($.webgis.data.heatmap_layers['testheatmap'], true);
        $.webgis.data.heatmap_layers['testheatmap'].setData(testdata2d($.webgis.data.antibird.anti_bird_equip_tower_mapping));
    }
}

function DrawHeatMapPixel(viewer, hid, list)
{
    var randnum = function(min, max) {
        return Math.random() * (max - min) + min;
    }    
    var randint = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    var get_max_min = function(list)
    {
        var ret = [99999, 0];
        for(var i in list)
        {
            var item = list[i];
            if(item.count > ret[1])
            {
                ret[1] = item.count;
            }
            if(item.count < ret[0])
            {
                ret[0] = item.count;
            }
        }
        return ret;
    };
    var add_geo_info = function(list, range, pixelsize){
        var ret = [];
        for(var i in list)
        {
            var item = list[i];
            if($.webgis.data.antibird.anti_bird_equip_tower_mapping[item.imei])
            {
                var o = $.webgis.data.antibird.anti_bird_equip_tower_mapping[item.imei];
                o.radius = pixelsize;
                //o.intensity = item.count;
                o.intensity = (item.count - range[0])/(range[1] - range[0]);
                o.text = item.text;
                o.center = Cesium.Cartographic.fromDegrees(o.lng, o.lat, 0);
                ret.push(o);
            }
        }
        return ret;
    };
    var add_geo_info2d = function(list, range, radius){
        var ret = {};
        var data = [];
        for(var i in list)
        {
            var item = list[i];
            if($.webgis.data.antibird.anti_bird_equip_tower_mapping[item.imei])
            {
                var o = $.webgis.data.antibird.anti_bird_equip_tower_mapping[item.imei];
                o.radius = radius;
                o.intensity = item.count;
                //o.intensity = (item.count - range[0])/(range[1] - range[0]);
                o.text = item.text;
                data.push(o);
            }
        }
        ret.max = data.length;
        ret.data = data;
        return ret;
    };
    var range = get_max_min(list);
    if($.webgis.config.map_backend === 'cesium')
    {
        var points = add_geo_info(list, range,  3);
        if($.webgis.data.heatmap_layers[hid])
        {
            $.webgis.data.heatmap_layers[hid].layer.destroy();
            delete $.webgis.data.heatmap_layers[hid];
            //$.webgis.data.heatmap_layers[hid] = undefined;
        }
        $.webgis.data.heatmap_layers[hid] = {
            layer: new HeatMapImageryProvider({
                        name:hid,
                        viewer:viewer,
                        defaultAlpha:0.3,
                        gradientStops:$.webgis.mapping.heat_map_gradient_stops,
                        points:points
                    }),
            type: 'heatmap'
        };
    }
    if($.webgis.config.map_backend === 'leaflet')
    {    
        var points = add_geo_info2d(list, range, 0.1);
        var cfg = {
          // radius should be small ONLY if scaleRadius is true (or small radius is intended)
          // if scaleRadius is false it will be the constant radius used in pixels
          "radius": 2,
          "maxOpacity": 0.6, 
          // scales the radius based on map zoom
          "scaleRadius": true, 
          // if set to false the heatmap uses the global maximum for colorization
          // if activated: uses the data maximum within the current map boundaries 
          //   (there will always be a red spot with useLocalExtremas true)
          "useLocalExtrema": false,
          // which field name in your data represents the latitude - default "lat"
          latField: 'lat',
          // which field name in your data represents the longitude - default "lng"
          lngField: 'lng',
          // which field name in your data represents the data value - default "value"
          valueField: 'intensity'
        };
        
        if(viewer.hasLayer($.webgis.data.heatmap_layers[hid]))
        {
            viewer.removeLayer($.webgis.data.heatmap_layers[hid]);
            delete $.webgis.data.heatmap_layers[hid];
            //$.webgis.data.heatmap_layers[hid] = undefined;
        }
        $.webgis.data.heatmap_layers[hid]  = new HeatmapOverlay(cfg);
        viewer.addLayer($.webgis.data.heatmap_layers[hid], true);
        $.webgis.data.heatmap_layers[hid].setData(points);
    }

}
function DrawHeatMapCircle(viewer, hid, list, height_magnifier)
{
    var get_max_min = function(list)
    {
        var ret = [99999, 0];
        for(var i in list)
        {
            var item = list[i];
            if(item.count > ret[1])
            {
                ret[1] = item.count;
            }
            if(item.count < ret[0])
            {
                ret[0] = item.count;
            }
        }
        return ret;
    };
    var get_gradient_list = function()
    {
        var ret = [];
        for(var k in $.webgis.mapping.heat_map_gradient_stops)
        {
            //ret.push(parseFloat(k));
            ret.push(k);
        }
        ret.sort();
        return ret;
    }
    var get_alpha = function(range, gradient_list, v)
    {
        var ret = '0.5';
        var vv = (v - range[0])/(range[1] - range[0]);
        for(var i=1;i< gradient_list.length; i++)
        {
            var min = gradient_list[i-1];
            var max = gradient_list[i];
            if(vv >= parseFloat(min) && vv <= parseFloat(max))
            {
                ret = max;
                break;
            }
        }
        return ret;
    };
    var num_to_color = function(num)
    {
        var hexStr = num.toString(16);
        while (hexStr.length < 6) 
        { 
            hexStr = '0' + hexStr; 
        }
        return '#' + hexStr;
    };
    //var get_gradient_stop = function(range, gradient_list, v)
    //{
        //var ret = [255, 255, 255, 0];
        //var a = get_alpha(range, gradient_list, v);
        ////console.log(a);
        //if($.webgis.mapping.heat_map_gradient_stops[a])
        //{
            //var c = $.webgis.mapping.heat_map_gradient_stops[a];
            //c = num_to_color(c);
            //c = c.substr(0, c.length-2);
            ////console.log(c);
            //var rgba = tinycolor(c).toRgb();
            //rgba.a = Math.floor(parseFloat(a) * 256) -1;
            //ret = [rgba.r, rgba.g, rgba.b, rgba.a];
            ////console.log(ret);
        //}
        //return ret;
    //};
    var get_gradient_stop = function(range, gradient_list, v)
    {
        var ret = 'rgba(255, 255, 255, 0)';
        var a = get_alpha(range, gradient_list, v);
        if($.webgis.mapping.heat_map_gradient_stops[a])
        {
            var c = $.webgis.mapping.heat_map_gradient_stops[a];
            c = num_to_color(c);
            c = c.substr(0, c.length-2);
            var rgba = tinycolor(c).toRgb();
            rgba.a = parseFloat(a) * 0.5;
            ret = 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ',' + rgba.a + ')';
        }
        return ret;
    };
    //var get_gradient_stop2 = function(range, gradient_list, v)
    //{
        //var ret = 0;
        //var a = get_alpha(range, gradient_list, v);
        ////console.log(a);
        //if($.webgis.mapping.heat_map_gradient_stops[a])
        //{
            //ret = $.webgis.mapping.heat_map_gradient_stops[a];
        //}
        //return ret;
    //};
    
    var add_geo_info = function(list, radius){
        var ret = [];
        for(var i in list)
        {
            var item = list[i];
            if($.webgis.data.antibird.anti_bird_equip_tower_mapping[item.imei])
            {
                var o = $.webgis.data.antibird.anti_bird_equip_tower_mapping[item.imei];
                o.radius = radius;
                o.count = item.count;
                o.text = item.text;
                ret.push(o);
            }
        }
        return ret;
    };
    
    
    var range = get_max_min(list);
    var gradient_list = get_gradient_list();
    var ellipsoid = viewer.scene.globe.ellipsoid;
    var collection = new Cesium.PrimitiveCollection();
    var labels = new Cesium.LabelCollection();
    var points = add_geo_info(list, 500);
    for(var i in points)
    {
        var point = points[i];
        var rgba = get_gradient_stop(range, gradient_list, point.count);
        var alt = point.alt;
        if(!$.webgis.config.zaware) alt = 0;
        var pos = Cesium.Cartesian3.fromDegrees(point.lng, point.lat, alt);
        var pos_label = Cesium.Cartesian3.fromDegrees(point.lng, point.lat, alt + point.count * height_magnifier);
        var geometry = new Cesium.CircleGeometry({
                center : pos,
                radius: point.radius,
                ellipsoid: ellipsoid,
                extrudedHeight : point.count * height_magnifier,
                vertexFormat : Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
        });
        labels.add({
            position : pos_label,
            text : point.name + ' ' + point.text,
            font : 'bold 30px arial,sans-serif',
            fillColor : Cesium.Color.fromCssColorString(rgba),
            outlineColor : Cesium.Color.WHITE,
            style : Cesium.LabelStyle.FILL,
            pixelOffset : Cesium.Cartesian2.ZERO,
            eyeOffset : Cesium.Cartesian3.ZERO,
            horizontalOrigin : Cesium.HorizontalOrigin.LEFT,
            verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
            scale : 1.0          
        });        
        var primitive = new Cesium.Primitive({
            geometryInstances : new Cesium.GeometryInstance({
                id:    $.uuid(),
                geometry : geometry,
                attributes : {
                    color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString(rgba))
                }
            }),
            appearance : new Cesium.PerInstanceColorAppearance({
                flat:true,
                closed : true,
                translucent : true,
                //material : Cesium.Material.fromType('Color', {
                    //color : Cesium.Color.fromCssColorString(rgba)
                //}),
                renderState : {
                    depthTest : {
                        enabled : true
                    }
                }
            })
        });
        collection.add(primitive);
    }
    if($.webgis.data.heatmap_primitive === undefined)
    {
        $.webgis.data.heatmap_primitive = {};
    }
    if($.webgis.data.heatmap_primitive[hid])
    {
        if(viewer.scene.primitives.contains($.webgis.data.heatmap_primitive[hid]))
        {
            viewer.scene.primitives.remove($.webgis.data.heatmap_primitive[hid]);
        }
        delete $.webgis.data.heatmap_primitive[hid];
        //$.webgis.data.heatmap_primitive[hid] = undefined;
    }
    if($.webgis.data.heatmap_primitive[hid + 'label'])
    {
        if(viewer.scene.primitives.contains($.webgis.data.heatmap_primitive[hid + 'label']))
        {
            viewer.scene.primitives.remove($.webgis.data.heatmap_primitive[hid + 'label']);
        }
        delete $.webgis.data.heatmap_primitive[hid + 'label'];
        //$.webgis.data.heatmap_primitive[hid + 'label'] = undefined;
    }
    viewer.scene.primitives.add(collection);
    viewer.scene.primitives.add(labels);
    $.webgis.data.heatmap_primitive[hid] = collection;
    $.webgis.data.heatmap_primitive[hid + 'label'] = labels;
}



function InitDrawHelper2D(viewer)
{
    $.webgis.control.drawhelper = new DrawHelper2D(viewer, 'drawhelpertoolbar');
    var toolbar = $.webgis.control.drawhelper.addToolbar($('#' + $.webgis.control.drawhelper.toolbar_container_id)[0], {
        buttons: ['marker', 'polyline', 'polygon', 'circle', 'extent']
    });
    
    toolbar.addListener('markerCreated', function(event) {
        console.log('Marker created at ' + GetDisplayLatLngString2D(event.position, 7));
        if($.webgis.control.drawhelper_mode != 'ruler')
        {
            var m = L.marker(event.position,{
                icon:L.icon({
                    iconUrl: Cesium.buildModuleUrl('/img/marker30x48.png'),
                    iconSize: [30, 48],
                    iconAnchor: [15, 48]
                })
            });
            m.name = 'tmp_marker';
            m.addTo(viewer);
            ShowPoiInfoDialog(viewer, '添加兴趣点', 'point',  event.position);
        }
    });
    toolbar.addListener('polylineCreated', function(event) {
        //event.positions.pop();
        event.positions.pop();
        console.log('Polyline created with ' + event.positions.length + ' points');
        if($.webgis.control.drawhelper_mode != 'ruler')
        {
            ShowPoiInfoDialog(viewer, '添加线段或道路', 'polyline', event.positions);
        }
    });
    toolbar.addListener('polygonCreated', function(event) {
        //event.positions.pop();
        event.positions.pop();
        console.log('Polygon created with ' + event.positions.length + ' points');
        if($.webgis.control.drawhelper_mode != 'ruler')
        {
            ShowPoiInfoDialog(viewer, '添加多边形区域', 'polygon', event.positions);
        }
    });
    toolbar.addListener('circleCreated', function(event) {
        console.log('Circle created: center is ' + event.center.toString() + ' and radius is ' + event.radius.toFixed(1) + ' meters');
        //var circle = new DrawHelper.CirclePrimitive({
            //center: event.center,
            //radius: event.radius,
            //material: drawHelperCoverAreaMaterial
        //});
        //viewer.scene.primitives.add(circle);
        //$.webgis.control.drawhelper.addPrimitive(circle);
        if($.webgis.control.drawhelper_mode != 'ruler')
        {
            ShowPoiInfoCircleDialog(viewer, '添加圆形区域', event.center, event.radius);
        }
    });
    toolbar.addListener('extentCreated', function(event) {
        var positions = event.positions;
        console.log('Extent created (N: ' + positions[0].lat.toFixed(3) + ', E: ' + positions[2].lng.toFixed(3) + ', S: ' + positions[1].lat.toFixed(3) + ', W: ' + positions[0].lng.toFixed(3) + ')');
        if($.webgis.control.drawhelper_mode != 'ruler')
        {
            ShowPoiInfoDialog(viewer, '添加矩形区域', 'polygon', positions);
        }
    });

}


function InitDrawHelper(viewer)
{
    var ellipsoid = viewer.scene.globe.ellipsoid;
    $.webgis.control.drawhelper = new DrawHelper(viewer, 'drawhelpertoolbar');
    var toolbar = $.webgis.control.drawhelper.addToolbar($('#' + $.webgis.control.drawhelper.toolbar_container_id)[0], {
        buttons: ['marker', 'polyline', 'polygon', 'circle', 'extent']
    });
    
    
    var drawHelperCoverAreaMaterial = Cesium.Material.fromType('Color', {
        color : new Cesium.Color(1.0, 1.0, 0.0, 0.35)
    });
    
    
    toolbar.addListener('markerCreated', function(event) {
        console.log('Marker created at ' + GetDisplayLatLngString(ellipsoid, event.position, 7));
        // create one common billboard collection for all billboards
        if($.webgis.control.drawhelper_mode != 'ruler')
        {
            var b = new Cesium.BillboardCollection();
            viewer.scene.primitives.add(b);
            $.webgis.control.drawhelper.addPrimitive(b);
            var billboard = b.add({
                show : true,
                position : event.position,
                pixelOffset : new Cesium.Cartesian2(0, 0),
                eyeOffset : new Cesium.Cartesian3(0.0, 0.0, 0.0),
                horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                scale : 0.15,
                //imageIndex : 0,
                image: 'img/location_marker.png',
                color : new Cesium.Color(1.0, 1.0, 1.0, 1.0)
            });
            //billboard.setEditable();
            ShowPoiInfoDialog(viewer, '添加兴趣点', 'point', event.position);
        }
    });
    toolbar.addListener('polylineCreated', function(event) {
        //maybe cesium1.7 fix this bug
        //event.positions.pop();
        //event.positions.pop();
        console.log('Polyline created with ' + event.positions.length + ' points');
        //console.log(event.positions);
        var polyline = new DrawHelper.PolylinePrimitive({
            positions: event.positions,
            width: 5,
            geodesic: true
        });
        viewer.scene.primitives.add(polyline);
        $.webgis.control.drawhelper.addPrimitive(polyline);
        if($.webgis.control.drawhelper_mode != 'ruler')
        {
            ShowPoiInfoDialog(viewer, '添加线段或道路', 'polyline', event.positions);
        }
        //polyline.setEditable();
        //polyline.addListener('onEdited', function(event) {
            //console.log('Polyline edited, ' + event.positions.length + ' points');
        //});
    });
    toolbar.addListener('polygonCreated', function(event) {
        //maybe cesium1.7 fix this bug
        //event.positions.pop();
        //event.positions.pop();
        console.log('Polygon created with ' + event.positions.length + ' points');
        var polygon = new DrawHelper.PolygonPrimitive({
            positions: event.positions,
            material : drawHelperCoverAreaMaterial
        });
        viewer.scene.primitives.add(polygon);
        $.webgis.control.drawhelper.addPrimitive(polygon);
        if($.webgis.control.drawhelper_mode != 'ruler')
        {
            ShowPoiInfoDialog(viewer, '添加多边形区域', 'polygon', event.positions);
        }
        //polygon.setEditable();
        //polygon.addListener('onEdited', function(event) {
            //console.log('Polygon edited, ' + event.positions.length + ' points');
        //});

    });
    toolbar.addListener('circleCreated', function(event) {
        console.log('Circle created: center is ' + event.center.toString() + ' and radius is ' + event.radius.toFixed(1) + ' meters');
        var circle = new DrawHelper.CirclePrimitive({
            center: event.center,
            radius: event.radius,
            material: drawHelperCoverAreaMaterial
        });
        viewer.scene.primitives.add(circle);
        $.webgis.control.drawhelper.addPrimitive(circle);
        if($.webgis.control.drawhelper_mode != 'ruler')
        {
            ShowPoiInfoCircleDialog(viewer, '添加圆形区域', event.center, event.radius);
        }
        //ShowPoiInfoDialog(viewer, '添加圆形区域', 'circle', null, null);
        //circle.setEditable();
        //circle.addListener('onEdited', function(event) {
            //console.log('Circle edited: radius is ' + event.radius.toFixed(1) + ' meters');
        //});
    });
    toolbar.addListener('extentCreated', function(event) {
        var extent = event.extent;
        console.log('Extent created (N: ' + Cesium.Math.toDegrees(extent.north).toFixed(3) + ', E: ' + Cesium.Math.toDegrees(extent.east).toFixed(3) + ', S: ' + Cesium.Math.toDegrees(extent.south).toFixed(3) + ', W: ' + Cesium.Math.toDegrees(extent.west).toFixed(3) + ')');
        var extentPrimitive = new DrawHelper.ExtentPrimitive({
            extent: extent,
            material: drawHelperCoverAreaMaterial
        });
        viewer.scene.primitives.add(extentPrimitive);
        $.webgis.control.drawhelper.addPrimitive(extentPrimitive);
        if($.webgis.control.drawhelper_mode != 'ruler')
        {
            var positions = [];
            //console.log(extent);
            var carto = Cesium.Cartographic.fromRadians(extent.west, extent.north, 0);
            var cart3 = ellipsoid.cartographicToCartesian(carto);
            positions.push(cart3);
            carto = Cesium.Cartographic.fromRadians(extent.east, extent.north, 0);
            cart3 = ellipsoid.cartographicToCartesian(carto);
            positions.push(cart3);
            carto = Cesium.Cartographic.fromRadians(extent.east, extent.south, 0);
            cart3 = ellipsoid.cartographicToCartesian(carto);
            positions.push(cart3);
            carto = Cesium.Cartographic.fromRadians(extent.west, extent.south, 0);
            cart3 = ellipsoid.cartographicToCartesian(carto);
            positions.push(cart3);
            ShowPoiInfoDialog(viewer, '添加矩形区域', 'polygon', positions);
        }
        //extentPrimitive.setEditable();
        //extentPrimitive.addListener('onEdited', function(event) {
            //console.log('Extent edited: extent is (N: ' + event.extent.north.toFixed(3) + ', E: ' + event.extent.east.toFixed(3) + ', S: ' + event.extent.south.toFixed(3) + ', W: ' + event.extent.west.toFixed(3) + ')');
        //});
    });
    $.webgis.control.drawhelper._tooltip.setVisible(false);
}

function ShowPoiInfoCircleDialog(viewer, title, center, radius)
{
    var ellipsoid;
    if($.webgis.config.map_backend === 'cesium')
    {
        ellipsoid = viewer.scene.globe.ellipsoid;
    }
    var g = {};
    g['geometry'] = {}
    g['geometry']['type'] = 'Point';
    //console.log(center);
    if($.webgis.config.map_backend === 'cesium')
    {
        var carto = ellipsoid.cartesianToCartographic(center);
        g['geometry']['coordinates'] = [Cesium.Math.toDegrees(carto.longitude), Cesium.Math.toDegrees(carto.latitude)];
    }
    if($.webgis.config.map_backend === 'leaflet')
    {
        g['geometry']['coordinates'] = [center.lng, center.lat];
    }
    var cond = {'db':$.webgis.db.db_name, 'collection':'-', 'action':'buffer', 'data':g, 'distance':radius, 'res':8};
    //ShowProgressBar(true, 670, 200, '生成缓冲区', '正在生成缓冲区，请稍候...');
    MongoFind(cond, function(data){
        //ShowProgressBar(false);
        if(data.length>0)
        {
            var geometry = data[0];
            var positions = [];
            for(var i in geometry['coordinates'][0])
            {
                var coord = geometry['coordinates'][0][i];
                if($.webgis.config.map_backend === 'cesium')
                {
                    var carto = Cesium.Cartographic.fromDegrees(coord[0], coord[1], 0);
                    var cart3 = ellipsoid.cartographicToCartesian(carto);
                    positions.push(cart3);
                }
                if($.webgis.config.map_backend === 'leaflet')
                {
                    positions.push(L.latLng(coord[1], coord[0]));
                }
            }
            ShowPoiInfoDialog(viewer, title, 'polygon', positions);
            
        }else
        {
            ShowMessage(null, 400, 250, '出错了', '服务器生成圆形错误:返回数据为空,请确认服务正在运行.');
        }
    });

}

function InitFileUploader(div_id, fileext,  bindcollection, key) 
{
    var width = parseInt($('#' + div_id).css('width').replace('px', ''));
    var height = parseInt($('#' + div_id).css('height').replace('px', ''));
    var container_id = div_id + '_container';
    var uploader_id = 'div_' + div_id + '_uploader';
    var toggle_id = 'div_' + div_id + '_toggle_view_upload';
    var toolbar_id = div_id + '_toolbar';
    var form_id = 'form_' + div_id + '_uploader_form';
    
    $('#' + toggle_id).off();
    $('#' + toggle_id).on('click', function(){
        $('#div_' + div_id + '_upload_desciption').css('display','none');
        if($('#' + uploader_id).is(':visible') )
        {
            $('#' + uploader_id).css('display', 'none');
            $('#' + container_id).css('display', 'block');
            $('#' + toolbar_id).css('display', 'block');
            $('#' + toggle_id).html('上传附件');
        }
        else
        {
            $('#' + uploader_id).css('display', 'block');
            $('#' + container_id).css('display', 'none');
            $('#' + toolbar_id).css('display', 'none');
            $('#' + toggle_id).html('附件浏览');
        }
    });

    $('#' + form_id).fileupload({
        // Uncomment the following to send cross-domain cookies:
        //xhrFields: {withCredentials: true},
        url: 'post',
        multipart:true,
        autoUpload: false,
        sequentialUploads:true,
        submit: function(e, data){
            //console.log('submit key=' +  key);
            //console.log(data);
            var category = '';
            if(data.files[0].type === 'image/jpeg'
            || data.files[0].type === 'image/png'
            || data.files[0].type === 'image/tiff'
            || data.files[0].type === 'image/gif'
            || data.files[0].type === 'image/bmp'
            || data.files[0].type === 'image/svg+xml'
            ) {
                category = 'image';
            }
            if(data.files[0].type === 'application/vnd.ms-excel'
            || data.files[0].type === 'application/msword'
            || data.files[0].type === 'text/plain'
            ) {
                category = 'document';
            }
            if(category.length == 0) category = 'other';
            $(this).fileupload('option', 'url', 'post' + '?' 
                + 'db=' + $.webgis.db.db_name 
                //+ '&collection=fs'
                + '&bindcollection=' + bindcollection
                + '&key=' + key 
                + '&category=' + category
                + '&mimetype=' + encodeURIComponent(data.files[0].type) 
                //+ '&filename=' + encodeURIComponent(data.files[0].name)
                //+ '&size=' + data.files[0].size
                + '&description=' + encodeURIComponent($('#' + div_id + '_upload_desciption').val())
            );
        },
        change:function(){
            $('#div_' + div_id + '_upload_desciption').css('display','block');
        },
        done:function(e, data){
            //console.log(data.result);
            if(data.result)
            {
                //UpdateJssorSlider(div_id, bindcollection, key);
                UpdateFotoramaSlider(div_id, bindcollection, key, CreateFileBrowserAdditionalButton(div_id, bindcollection, key));
                $('#' + div_id + '_upload_desciption').val('');
            }
        },
        fail:function(e, data){
            console.log('fail');
            console.log(data);
        }
    });

    // Enable iframe cross-domain access via redirect option:
    $('#' + form_id).fileupload(
        'option',
        'redirect',
        window.location.href.replace(
            /\/[^\/]*$/,
            '/cors/result.html?%s'
        )
    );


    if ($.webgis.config.max_file_size > 0) {
        var res = '';
        for(var i in fileext)
        {
            res += fileext[i] + '|';
        }
        res = res.slice(0, res.length-1);
        res = '(\.|\/)(' + res + ')$';
        var re = new RegExp(res, "i");
        // Demo settings:
        $('#' + form_id).fileupload('option', {
            url: '/post',
            // Enable image resizing, except for Android and Opera,
            // which actually support image resizing, but fail to
            // send Blob objects via XHR requests:
            disableImageResize: /Android(?!.*Chrome)|Opera/
                .test(window.navigator.userAgent),
            maxFileSize: $.webgis.config.max_file_size,
            //acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
            acceptFileTypes: re
        });
        // Upload server status check for browsers with CORS support:
        if ($.support.cors) {
            $.ajax({
                url: 'post',
                type: 'HEAD'
            }).fail(function () {
                $('<div class="alert alert-danger"/>')
                    .text('文件上传服务不可用 ' +
                            new Date())
                    .appendTo('#' + form_id);
            });
        }
    } else {
        // Load existing files:
        $('#' + form_id).addClass('fileupload-processing');
        $.ajax({
            // Uncomment the following to send cross-domain cookies:
            //xhrFields: {withCredentials: true},
            url: $('#' + form_id).fileupload('option', 'url'),
            dataType: 'json',
            context: $('#' + form_id)[0]
        }).always(function () {
            $(this).removeClass('fileupload-processing');
        }).done(function (result) {
            $(this).fileupload('option', 'done')
                .call(this, $.Event('done'), {result: result});
        });
    }

}




function InitPoiInfoDialog()
{
    //$('#form_poi_info' ).webgisform("getvalidate");

}
//function InitTowerInfoDialog()
//{
    //var iframe = $('#tower_info_model').find('iframe');
    //iframe.load(function(){
        //var iframeDoc = iframe.contents().get(0);
        //$(iframeDoc).off();
        //$(iframeDoc).on('mousedown', function(e){
            //for (var i = 1; i < 99; i++)
            //{
                //iframe[0].contentWindow.clearInterval(i);
            //}
        //});
    //});
//}

function ClearHeatMap(viewer)
{
    if($.webgis.config.map_backend === 'cesium')
    {
        while(_.keys($.webgis.data.heatmap_layers).length>0)
        {
            var k = _.keys($.webgis.data.heatmap_layers)[0];
            var hm = $.webgis.data.heatmap_layers[k];
            //console.log(hm.type);
            if(hm && hm.type === 'heatmap')
            {
                hm.layer.destroy();
            }
            if(hm && hm.type === 'tile')
            {
                viewer.scene.imageryLayers.remove(hm.layer, true);
            }
            delete $.webgis.data.heatmap_layers[k];
            //$.webgis.data.heatmap_layers[k] = undefined;
        }
        while(_.keys($.webgis.data.heatmap_primitive).length>0)
        {
            var k = _.keys($.webgis.data.heatmap_primitive)[0];
            //console.log(k);
            if(viewer.scene.primitives.contains($.webgis.data.heatmap_primitive[k]))
            {
                viewer.scene.primitives.remove($.webgis.data.heatmap_primitive[k]);
            }
            delete $.webgis.data.heatmap_primitive[k];
            //$.webgis.data.heatmap_primitive[k] = undefined;
        }
    }
    if($.webgis.config.map_backend === 'leaflet')
    {
        //console.log($.webgis.data.heatmap_layers);
        while(_.keys($.webgis.data.heatmap_layers).length>0)
        {
            k = _.keys($.webgis.data.heatmap_layers)[0];
            var hm = $.webgis.data.heatmap_layers[k];
            if(viewer.hasLayer(hm))
            {
                viewer.removeLayer(hm);
                delete $.webgis.data.heatmap_layers[k];
                //$.webgis.data.heatmap_layers[k] = undefined;
            }
        }
    }
}
function InitToolPanel(viewer)
{
    $('#control_toolpanel_kmgd_handle').css('z-index', '9');
    $('#control_toolpanel_kmgd_left').css('display', 'none');
    $('#control_toolpanel_kmgd_handle').on( 'mouseenter', function(e){
        $('#control_toolpanel_kmgd_left').show('slide',{}, 400, function(){
            $(e.target).css('display','none');
        });
    });
    $('#control_toolpanel_kmgd_left').on( 'mouseleave', function(e){
        $('#control_toolpanel_kmgd_left').hide('slide',{}, 400, function(){
            $('#control_toolpanel_kmgd_handle').css('display','block');
        });
    });
    $( "#accordion_tools" ).accordion({ 
        active: 0,
        animate: 20
    });
    
    $('input[id^=chb_show_label_]').iCheck({
        checkboxClass: 'icheckbox_flat-green'
    });
    $('input[id^=chb_show_geometry_]').iCheck({
        checkboxClass: 'icheckbox_flat-green'
    });
    $('input[id^=chb_show_icon_]').iCheck({
        checkboxClass: 'icheckbox_flat-green'
    });
    $('input[id^=chb_show_icon_]').iCheck('check');
    
    //$('#chb_show_label').on('click', function(){
    $('input[id^=chb_show_label_]').on("ifChanged", function(e){
        var webgis_type = $(this).attr('id').replace('chb_show_label_', '');
        if($(this).is(':checked'))
        {
            console.log('turn on label:' + webgis_type);
        }else
        {
            console.log('turn off label:' + webgis_type);
        }
        if($.webgis.config.map_backend === 'cesium')
        {
            ReloadCzmlDataSource(viewer, $.webgis.config.zaware);
        }
    });
    $('input[id^=chb_show_geometry_]').on("ifChanged", function(e){
        var webgis_type = $(this).attr('id').replace('chb_show_geometry_', '');
        if(webgis_type === 'edge_tower')
        {
            if($(this).is(':checked'))
            {
                console.log('turn on edge:' + webgis_type);
                if($.webgis.config.map_backend === 'cesium')
                {
                    _.forEach($.webgis.data.geojsons,function(item)
                    {
                        DrawEdgeBetweenTwoNode(viewer, 'edge_tower', item.properties.start, item.properties.end, false);
                    });
                }
                if($.webgis.config.map_backend === 'leaflet')
                {
                    UpdateEdges2D(viewer, webgis_type);
                }
            }else
            {
                console.log('turn off edge:' + webgis_type);
                if($.webgis.config.map_backend === 'cesium')
                {
                    RemoveSegmentsByType(viewer, 'edge_tower');
                }
                if($.webgis.config.map_backend === 'leaflet')
                {
                    ClearEdges2D(viewer, webgis_type);
                }
            }
        }
        else
        {
            if($(this).is(':checked'))
            {
                console.log('turn on geometry:' + webgis_type);
            }else
            {
                console.log('turn off geometry:' + webgis_type);
                if($.webgis.config.map_backend === 'leaflet')
                {
                    ClearEdges2D(viewer, webgis_type);
                }
            }
            if($.webgis.config.map_backend === 'cesium')
            {
                ReloadCzmlDataSource(viewer, $.webgis.config.zaware);
            }
        }
    });
    $('input[id^=chb_show_icon_]').on("ifChanged", function(e){
        if($(this).is(':checked'))
        {
            console.log('turn on icon:' + 'point');
        }else
        {
            console.log('turn off icon:' + 'point');
        }
        if($.webgis.config.map_backend === 'cesium')
        {
            ReloadCzmlDataSource(viewer, $.webgis.config.zaware);
        }
    });
    
    $('#slider_heatmap_alpha').slider({ 
        min: 0.0,
        max: 1.0,
        step: 0.01,
        range:false,
        value:0.7,
        change: function( event, ui ) {
            //console.log(ui.value);
            $('#slider_heatmap_alpha').parent().find('label').html('透明度:' + Math.floor(ui.value*100) + '%');
            for(var k in $.webgis.data.heatmap_layers)
            {
                var hm = $.webgis.data.heatmap_layers[k];
                hm.layer.alpha = ui.value;
            }
        }
    });
    $('#but_heatmap_clear').button({label:'清除'});
    $('#but_heatmap_clear').on('click', function(){
        ClearHeatMap(viewer);
    });
    
    
    $('#but_add_poi').button({label:'添加兴趣点'});
    $('#but_add_poi').on('click', function(){
        if($.webgis.control.drawhelper.isVisible())
        {
            $.webgis.control.drawhelper.show(false);
        }
        else
        {
            $.webgis.control.drawhelper.show(true);
        }
    });
    $('#but_remove_poi').button({label:'清空兴趣点'});
    $('#but_remove_poi').on('click', function(){
        ClearPoi(viewer);
    });
    
    $('#but_line_edit').button({label:'查看线路列表'});
    $('#but_line_edit').on('click', function(){
        if(!CheckPermission('line_edit'))
        {
            return;
        }
        ShowLineDialog(viewer, 'edit');
    });
    $('#but_line_add').button({label:'新增线路'});
    $('#but_line_add').on('click', function(){
        if(!CheckPermission('line_save'))
        {
            return;
        }
        ShowLineDialog(viewer);
    });
    $('#but_line_delete').button({label:'删除'});
    $('#but_line_delete').on('click', function(){
        if(!CheckPermission('line_delete'))
        {
            return;
        }
        var arr = $('#line_choose').multipleSelect("getSelects");
        var textarr = $('#line_choose').multipleSelect("getSelects", 'text');
        var line_obj = _.find($.webgis.data.lines, {_id:arr[0]});
        if(arr.length>0 && line_obj)
        {
            ShowConfirm(null, 500, 200,
                '删除确认',
                '确认删除[' + textarr[0] + ']并保存吗? 确认的话数据将会提交到服务器上，以便所有人都能看到修改的结果。',
                function () {
                    DeleteLine(viewer, arr[0], function(){
                        LoadLineData($.webgis.db.db_name, function(){
                            $('#line_choose').empty();
                            _.forEach( $.webgis.data.lines, function(item){
                                $('#line_choose').append('<option value="' + item._id + '">' + item.properties.name + '</option>');
                            });
                            $('#line_choose').multipleSelect("refresh");
                        });                    
                    });
                },
                function () {
                    //$('#').dialog("close");
                }
            );
        }
    });
    $('#but_state_examination_view').button({label:'数据查看'});
    $('#but_state_examination_view').on('click', function(){
        ShowStateExaminationListDialog(viewer);
    });
    $('#but_state_examination_import').button({label:'数据导入'});
    $('#but_state_examination_import').on('click', function(){
        ShowStateExaminationImportDialog(viewer);
    });
    $('#but_state_examination_standard_2009').button({label:'查看标准(2009)'});
    $('#but_state_examination_standard_2009').on('click', function(){
        ShowStateExaminationStandardDialog2009(viewer);
    });
    $('#but_state_examination_standard_2014').button({label:'查看标准(2014)'});
    $('#but_state_examination_standard_2014').on('click', function(){
        ShowStateExaminationStandardDialog2014(viewer);
    });
    $('#but_state_examination_bbn').button({label:'分析预测'});
    $('#but_state_examination_bbn').on('click', function(){
        ShowStateExaminationBBNDialog(viewer);
    });
    $('#but_state_examination_analyze').button({label:'分析'});
    $('#but_state_examination_analyze').on('click', function(){
        ShowStateExaminationAnalyzeDialog(viewer);
    });
    $('#but_state_examination_strategy2009').button({label:'检修策略编辑(标准2009)'});
    $('#but_state_examination_strategy2009').on('click', function(){
        ShowStrategyEditDialog2009(viewer);
    });
    $('#but_state_examination_strategy2014').button({label:'检修策略编辑(标准2014)'});
    $('#but_state_examination_strategy2014').on('click', function(){
        ShowStrategyEditDialog2014(viewer);
    });

    $('#but_dn_add').button({label:'新增配电网络'});
    $('#but_dn_add').on('click', function(){
        if(!CheckPermission('dn_save'))
        {
            return;
        }
        ShowDNAddDialog(viewer);
    });
    $('#but_dn_remove').button({label:'清空配电网络'});
    $('#but_dn_remove').on('click', function(){
        if($.webgis.config.map_backend === 'cesium')
        {
            RemoveSegmentsByType(viewer, 'edge_dn');
        }
        if($.webgis.config.map_backend === 'leaflet')
        {
            ClearEdges2D(viewer, 'edge_dn');
        }
    });
    
    $('#but_sys_change_password').button({label:'修改密码'});
    $('#but_sys_change_password').on('click', function(){
        ShowChangePassword(viewer);
    });
    
    if($.webgis.current_userinfo['username'] === 'admin')
    {
        $('#but_sys_role_func').button({label:'权限控制'});
        $('#but_sys_role_func').on('click', function(){
            ShowRoleControl(viewer);
        });
        $('#but_sys_user').button({label:'用户管理'});
        $('#but_sys_user').on('click', function(){
            ShowUserManagement(viewer);
        });
        $('#but_sys_role').button({label:'角色管理'});
        $('#but_sys_role').on('click', function(){
            ShowRoleManagement(viewer);
        });
    }else
    {
        $('#but_sys_role_func').hide();
    }
}

function ShowStateExaminationBBNDialog(viewer)
{
    CreateDialogSkeleton(viewer, 'dlg_state_examination_bbn');
    $('#dlg_state_examination_bbn').dialog({
        width: 720,
        height: 760,
        minWidth:200,
        minHeight: 200,
        draggable: true,
        resizable: true,
        modal: false,
        position:{at: "center"},
        title:'贝叶斯信度网络(BBN)',
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
                text: "查看检修策略标准",
                click: function(e){
                    ShowMaintainStrategyStandardDialog(viewer);
                }
            },
            {
                text: "查看评价记录",
                click: function(e){
                    ShowStateExaminationListDialog(viewer);
                }
            },
            {
                text: "查看评价标准",
                click: function(e){
                    ShowStateExaminationStandardDialog2009(viewer);
                    //ShowStateExaminationStandardDialog2014(viewer);
                }
            },
            {
                text: "关闭",
                click: function(e){
                    $( this ).dialog( "close" );
                }
            }
        ]
    });
    $('#tabs_state_examination_bbn').tabs({
        collapsible: false,
        active: 0
    });
    var dpilist = _.map(['50','100','200','300'], function(item){
        return {label:item, value:item};
    });
    var rankdirlist = _.map(['LL','LR','RL','RR'], function(item){
        return {label:item, value:item};
    });
    var trimsvg = function(svg){
        var arr = svg.split('\n');
        arr = _.slice(arr, 5);
        svg = arr.join('\n');
        //console.log(svg);
        return svg;
    };
    var get_v = function(alist, id, key)
    {
        var ret;
        var findit = false;
        _.forEach(alist, function(item){
            _.forEach(item.children, function(item1){
                if( item1.id === id){
                    ret = item1[key];
                    findit = true;
                    return;
                }
            });
            if(findit){
                return;
            }
        });
        return ret;
    };
    var replace_name = function(svg)
    {
        $(svg).find('g[class=node]').each(function(i, item){
            var key = $(item).find('title').html();
            var id = $(item).attr('id');
            var id1 = key;
            if(_.startsWith(id1, 'f_unitsub_')){
                id1 = id1.replace('f_unitsub_', '');
            }
            var display_name = _.result(_.find($.webgis.data.bbn.grid_data, {name: key.replace('f_', '')}), 'display_name');
            if(_.isUndefined(display_name)){
                display_name = _.result(_.find($.webgis.data.bbn.graphiz_label, {name: key.replace('f_', '')}), 'display_name');
            }
            var cat = get_v($.webgis.data.bbn.unitsub_template_2014, id1, 'cat');
            if(cat){
                display_name = '(' + cat + ')' + display_name;
            }
            var desc = _.result(_.find($.webgis.data.bbn.grid_data, {name: key.replace('f_', '')}), 'description');
            if(_.isUndefined(desc)){
                desc = _.result(_.find($.webgis.data.bbn.graphiz_label, {name: key.replace('f_', '')}), 'description');
            }

            //console.log(display_name);
            if(display_name)
            {
                $('#div_state_examination_bbn_bbn_graphiz').find('svg').find('#' + id).find('title').html(desc);
                $('#div_state_examination_bbn_bbn_graphiz').find('svg').find('#' + id).find('text').html(display_name);
                //console.log($('#div_state_examination_bbn_bbn_graphiz').find('svg').find('#' + id)[0]);
            }
        });
    };
    var div_resize = function(e){
        var w =  $('#div_state_examination_bbn_bbn_graphiz').width();
        $('#div_state_examination_bbn_bbn_graphiz').find('svg').attr('width', w + 'px');
    };
    var query_graphiz = function(callback)
    {
        var formdata = $("#form_state_examination_bbn_bbn").webgisform('getdata');
        if(formdata.line_name.length === 0) return;
        ShowProgressBar(true, 670, 200, '查询', '正在查询，请稍候...');
        $.ajax({
            url:'/bayesian/query/graphiz',
            method:'post',
            data: JSON.stringify(formdata)
        })
        .always(function () {
            ShowProgressBar(false);
        })
        .done(function (data2) {
            //console.log(data2);
            var svg = Viz(data2, 'svg', 'dot');
            svg = trimsvg(svg);
            //console.log(svg);
            $('#div_state_examination_bbn_bbn_graphiz').html(svg);
            replace_name($('#div_state_examination_bbn_bbn_graphiz').find('svg'));
            $('#div_state_examination_bbn_bbn_graphiz').find('svg').attr('width', '642px');
            $('#div_state_examination_bbn_bbn_graphiz').find('svg').attr('height', '300px');
            $('#div_state_examination_bbn_bbn_graphiz').off();
            $('#div_state_examination_bbn_bbn_graphiz').on('elementResize', div_resize);
            //console.log($('#div_state_examination_bbn_bbn_graphiz')[0]);
            if(callback) callback();
        });
    };
    var change_line_name = function(line_name)
    {
        if(line_name.length === 0){
            $('#form_state_examination_bbn_assume .form_state_examination_bbn_assume_line_name').html('(请选择线路名称)');
            if($.webgis.data.bbn.control.node_grid)
            {
                $.webgis.data.bbn.grid_data = [];
                BBNNodeGridLoadData(viewer, $.webgis.data.bbn.grid_data);
            }
        }else{
            LoadBBNGridData(viewer, line_name, function(){
                query_graphiz();
                LoadTowerByLineName(viewer, $.webgis.db.db_name, line_name, function(data){
                    //console.log(data);
                    //if(data.length){
                    LoadLineByLineName(viewer, $.webgis.db.db_name, line_name, function(data1){
                        var extent = GetExtentByCzml();
                        FlyToExtent(viewer, {extent:extent});
                        if($.webgis.config.map_backend === 'cesium')
                        {
                            ReloadCzmlDataSource(viewer, $.webgis.config.zaware);
                        }
                        //if(_.isUndefined($.webgis.data.state_examination.list_data_current_line))
                        //{
                            ShowProgressBar(true, 670, 200, '查询', '正在查询，请稍候...');
                            $.ajax({
                                url:'/state_examination/query',
                                method:'post',
                                data: JSON.stringify({line_name:line_name})
                            })
                            .always(function () {
                                ShowProgressBar(false);
                            })
                            .done(function (data2) {
                                data2 = JSON.parse(data2);
                                $.webgis.data.state_examination.list_data_current_line = data2;
                            });
                        //}
                    });
                    //}
                });
            });
        }
        $('#form_state_examination_bbn_bbn_view_grid_line_name').html(line_name);
        $('#form_state_examination_bbn_assume .form_state_examination_bbn_assume_line_name').html(line_name);
        delete $.webgis.data.bbn.predict_grid_data;
        $.webgis.data.bbn.predict_grid_data = undefined;
    };
    var flds = [
        { display: "输电线路", id: "line_name", newline: true, type: "select", editor: { data: [] , filter:true}, defaultvalue: '', group: '查询条件', width: 400, labelwidth: 120,
            change:function(data1){
                change_line_name(data1);
            }
        },
        //{ display: "输出图像dpi", id: "dpi", newline: true, type: "select", editor: { data: dpilist }, defaultvalue: '50', group: '输出选项', width: 450, labelwidth: 120},
        //{ display: "排列类型", id: "rankdir", newline: true, type: "select", editor: { data: rankdirlist }, defaultvalue: 'LL', group: '输出选项', width: 450, labelwidth: 120},
        { display: "刷新", id: "button_refresh", newline: true, type: "button",  defaultvalue: '点击刷新', group: '操作', width: 250, labelwidth: 120,
            click:function(){
                query_graphiz();
            }
        }

    ];
    $("#form_state_examination_bbn_bbn").webgisform(flds, {
        prefix: "form_state_examination_bbn_bbn_",
        maxwidth: 620
        //margin:10,
        //groupmargin:10
    });
    var build_select = function(){
        $('#form_state_examination_bbn_bbn_line_name').empty();
        $('#form_state_examination_bbn_bbn_line_name').append('<option value="">(请选择)</option>');
        _.forEach(_.uniq(_.pluck($.webgis.data.state_examination.list_data, 'line_name')), function(item){
            $('#form_state_examination_bbn_bbn_line_name').append('<option value="' + item + '">' + item + '</option>');
        });
        $('#form_state_examination_bbn_bbn_line_name').multipleSelect('refresh');
        $('#form_state_examination_bbn_bbn_line_name').multipleSelect('setSelects', ['']);
        $('#div_state_examination_bbn_bbn_graphiz').empty();
        //$('#div_state_examination_bbn_bbn_graphiz').on('elementResize', div_resize);
    };
    if($.webgis.data.state_examination.list_data.length > 0){
        build_select();
    }else{
        ShowProgressBar(true, 670, 200, '查询', '正在查询，请稍候...');
        $.ajax({
            url:'/state_examination/query',
            method:'post',
            data: JSON.stringify({})
        })
        .always(function () {
            ShowProgressBar(false);
        })
        .done(function (data1) {
            data1 = JSON.parse(data1);
            $.webgis.data.state_examination.list_data = data1;
            build_select();
        });
    }
    BBNNodeGridLoadData(viewer, $.webgis.data.bbn.grid_data);
    change_line_name('');
    //PredictGridLoad([]);
    //PredictGridLoad1([]);
    PredictGridLoad2([]);
    $('#btn_state_examination_bbn_assume_predict').button({label:'进行预测'});
    $('#btn_state_examination_bbn_assume_predict').on('click', function(){
        //DoPredict(function(data1){
        //    DrawPredictTable(data1);
        //});
        var sels = $('#form_state_examination_bbn_bbn_line_name').multipleSelect('getSelects');
        if (sels.length === 0 || sels[0].length === 0) {
            ShowMessage(null, 400, 250, '错误', '请先选择线路');
            return;
        }
        if(_.isUndefined($.webgis.data.bbn.predict_grid_data))
        {
            DoPredict1(function(data1){
                //DrawPredictTable1(data1);
                DrawPredictTable2(data1);
                PredictSummaryDialog(viewer);
            });
        }else
        {
            PredictSummaryDialog(viewer);
        }
    });
    $('#btn_state_examination_bbn_assume_predict_export').button({label:'导出'});
    $('#btn_state_examination_bbn_assume_predict_export').on('click', function(){
        PredictExport();
    });
    //$('#btn_state_examination_bbn_assume_predict_collapse').button({label:'收起/展开'});
    //$('#btn_state_examination_bbn_assume_predict_collapse').on('click', function(){
    //    PredictCollapseExpand();
    //});
    //$('#btn_state_examination_bbn_assume_predict_summary').button({label:'查看结论'});
    //$('#btn_state_examination_bbn_assume_predict_summary').on('click', function(){
    //    PredictSummaryDialog(viewer);
    //});

    $('#cb_state_examination_bbn_assume_predict_display_0').on('click', function(){
        if(!_.isUndefined($.webgis.data.bbn.predict_grid_data)) {
            if($(this).is(':checked')){
                //DrawPredictTable(FilterNonZero());
                DrawPredictTable1(FilterNonZero1());
            }else{
                //DrawPredictTable($.webgis.data.bbn.predict_grid_data);
                //console.log($.webgis.data.bbn.predict_grid_data);
                DrawPredictTable1($.webgis.data.bbn.predict_grid_data);
            }
        }
    });
    var options = '';
    $('#form_state_examination_bbn_assume_years').empty();
    _.forEach(_.range(1, 11), function(item){
        options += '<option value="' + (item+1) + '">' + item + '年</option>';
    });
    $('#form_state_examination_bbn_assume_years').append(options);
    $('#form_state_examination_bbn_assume_years').multipleSelect({
        single:true
    });
    $('#form_state_examination_bbn_assume_years').multipleSelect('setSelects', ["6"]);
}
function FilterNonZero()
{
    var list = $.extend(true, [], $.webgis.data.bbn.predict_grid_data);
    list = _.filter(list, function(item){
        return item.p > 0;
    });
    return list;
}
function FilterNonZero1()
{
    var list = $.extend(true, [], $.webgis.data.bbn.predict_grid_data);
    list = _.map(list, function(item){
        item.result = _.filter(item.result, function(item1){
            return item1.p > 0;
        });
        return item;
    });
    return list;
}

function ShowStateExaminationDetailDocDialog(viewer)
{
    CreateDialogSkeleton(viewer, 'dlg_state_examination_detail_doc');
    $('#dlg_state_examination_detail_doc').dialog({
        width: 750,
        height: 660,
        minWidth:200,
        minHeight: 200,
        draggable: true,
        resizable: true,
        modal: false,
        position:{at: "center"},
        title:'状态评价细则',
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
                text: "关闭",
                click: function(e){
                    $( this ).dialog( "close" );
                }
            }
        ]
    });
}
function ShowMaintainStrategyStandardDialog(viewer)
{
    CreateDialogSkeleton(viewer, 'dlg_maintain_strategy_standard');
    $('#dlg_maintain_strategy_standard').dialog({
        width: 750,
        height: 660,
        minWidth:200,
        minHeight: 200,
        draggable: true,
        resizable: true,
        modal: false,
        position:{at: "center"},
        title:'检修策略标准',
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
                text: "关闭",
                click: function(e){
                    $( this ).dialog( "close" );
                }
            }
        ]
    });
    //var pdf = new PDFObject({
    //  url: "/jxcl.pdf",
    //  id: "pdfRendered",
    //  pdfOpenParams: {
    //    view: "FitH"
    //  }
    //}).embed("iframe_maintain_strategy_standard");

    //PDFJS.getDocument('/jxcl.pdf').then(function (pdf) {
    //    // Using promise to fetch the page
    //    pdf.getPage(1).then(function (page) {
    //        var scale = 1.0;
    //        var viewport = page.getViewport(scale);
    //
    //        //
    //        // Prepare canvas using PDF page dimensions
    //        //
    //        var canvas = document.getElementById('canvas_maintain_strategy_standard');
    //        var context = canvas.getContext('2d');
    //        canvas.height = viewport.height;
    //        canvas.width = viewport.width;
    //
    //        //
    //        // Render PDF page into canvas context
    //        //
    //        var renderContext = {
    //            canvasContext: context,
    //            viewport: viewport
    //        };
    //        page.render(renderContext);
    //    });
    //});
}

function ShowStateExaminationStandardDialog2009(viewer)
{
    CreateDialogSkeleton(viewer, 'dlg_state_examination_standard');
    $('#dlg_state_examination_standard').dialog({
        width: 600,
        height: 600,
        minWidth:200,
        minHeight: 200,
        draggable: true,
        resizable: true,
        modal: false,
        position:{at: "center"},
        title:'状态评价标准',
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
                text: "查看细则",
                click: function(e){
                    ShowStateExaminationDetailDocDialog(viewer);
                }
            },
            {
                text: "关闭",
                click: function(e){
                    $( this ).dialog( "close" );
                }
            }
        ]
    });
    var list = _.uniq(_.pluck($.webgis.data.state_examination.standard, 'parent'));
    var unitlist = _.map(list, function(item){
        return {value:item, label:item};
    });
    var levs = [
        {value:'', label:'(请选择等级)'},
        {value: 'I', label: GetDomainName('I')},
        {value: 'II', label: GetDomainName('II')},
        {value: 'III', label: GetDomainName('III')},
        {value: 'IV', label: GetDomainName('IV')},
    ];
    var flds = [
        //{ display: "", id: "label", newline: true, type: "label", editor: { data: '依据昆明供电局输电管理2009年所颁布的《架空输电线路状态评价细则细则》制作', color:'#FF0000' }, width:540, group: '标准依据'},
        { display: "", id: "label", newline: true, type: "label", editor: { data: '依据昆明供电局输电管理2009年所颁布的《南方电网公司35kV～500kV架空线路状态评价导则（试行）》制作', color:'#FF0000' }, width:540, group: '标准依据'},
        { display: "单元划分", id: "unit", newline: true, type: "select", editor: { data: unitlist }, defaultvalue: '', group: '线路单元', width: 350, labelwidth: 120,
            change:function(data1){
                var list = _.pluck(_.where($.webgis.data.state_examination.standard, {parent:data1}), 'name');
                $('#form_state_examination_standard_name').empty();
                //$('#form_state_examination_standard_name' ).append('<option value="">(请选择)</option>');
                _.forEach(list, function(item)
                {
                    $('#form_state_examination_standard_name' ).append('<option value="' + item + '">' + item + '</option>');
                });
                $('#form_state_examination_standard_name').multipleSelect('refresh');
                $('#form_state_examination_standard').webgisform('setdata', {'level':'', 'desc':''});
            }
        },
        { display: "状态量名称", id: "name", newline: true, type: "select", editor: { data: [] }, defaultvalue: '', group: '状态评价', width: 350, labelwidth: 120,
            change:function(data1){
                $('#form_state_examination_standard').webgisform('setdata', {'level':'', 'desc':''});
            }
        },
        { display: "状态等级划分", id: "level", newline: true, type: "select", editor: { data: levs }, defaultvalue: '', group: '状态评价', width: 350, labelwidth: 120,
            change:function(data1){
                var name = $('#form_state_examination_standard').webgisform('getdata').name;
                if(name && name.length && data1.length){
                    var levels = _.result(_.find($.webgis.data.state_examination.standard, {name:name}), 'levels');
                    if(levels[data1]){
                        $('#form_state_examination_standard').webgisform('setdata', {'desc':levels[data1].according});
                    }else{
                        $('#form_state_examination_standard').webgisform('setdata', {'desc':''});
                    }
                }else{
                    $('#form_state_examination_standard').webgisform('setdata', {'desc':''});
                }
            }
        },
        { display: "等级描述", id: "desc", newline: true, type: "textarea",  defaultvalue: '', group: '等级明细', width: 350,height:130, labelwidth: 120}
    ];
    $('#form_state_examination_standard').webgisform(flds, {
        prefix: "form_state_examination_standard_",
        maxwidth: 540
        //margin:10,
        //groupmargin:10
    });

}
function ShowStateExaminationStandardDialog2014(viewer)
{
    CreateDialogSkeleton(viewer, 'dlg_state_examination_standard2014');
    $('#dlg_state_examination_standard2014').dialog({
        width: 600,
        height: 600,
        minWidth:200,
        minHeight: 200,
        draggable: true,
        resizable: true,
        modal: false,
        position:{at: "center"},
        title:'状态评价标准2014',
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
                text: "查看细则",
                click: function(e){
                    ShowStateExaminationDetailDocDialog(viewer);
                }
            },
            {
                text: "关闭",
                click: function(e){
                    $( this ).dialog( "close" );
                }
            }
        ]
    });
    var list = _.uniq(_.pluck($.webgis.data.state_examination.standard2014, 'parent'));
    var unitlist = _.map(list, function(item){
        return {value:item, label:item};
    });
    var flds = [
        { display: "", id: "label", newline: true, type: "label", editor: { data: '依据昆明供电局输电管理2014年所颁布的《南方电网公司35kV～500kV架空线路状态评价导则（试行）》制作', color:'#FF0000' }, width:540, group: '标准依据'},
        { display: "单元划分", id: "unit", newline: true, type: "select", editor: { data: unitlist }, defaultvalue: '', group: '线路单元', width: 350, labelwidth: 120,
            change:function(data1){
                var list = _.pluck(_.where($.webgis.data.state_examination.standard2014, {parent:data1}), 'name');
                $('#form_state_examination_standard2014_name').empty();
                _.forEach(list, function(item)
                {
                    $('#form_state_examination_standard2014_name' ).append('<option value="' + item + '">' + item + '</option>');
                });
                $('#form_state_examination_standard2014_name').multipleSelect('refresh');
                $('#form_state_examination_standard2014').webgisform('setdata', { 'desc':''});
            }
        },
        { display: "状态量名称", id: "name", newline: true, type: "select", editor: { data: [] }, defaultvalue: '', group: '状态评价', width: 350, labelwidth: 120,
            change:function(data1){
                if(data1.length > 0)
                {
                    var levels = _.result(_.find($.webgis.data.state_examination.standard2014, {name:data1}), 'levels');
                    var desc = '';
                    _.forEach(levels, function(lvl){
                        desc += '劣化级别:' + lvl.level + '\n'
                            + '基础扣分:' + lvl.base_score + ',' + '权重:' + lvl.weight + ',' + '合计扣分:' + (lvl.base_score * lvl.weight) + '\n'
                            + '评分依据:' + lvl.according  + '。' + '\n\n';
                    });
                    $('#form_state_examination_standard2014').webgisform('setdata', {'desc':desc});
                }else{
                    $('#form_state_examination_standard2014').webgisform('setdata', { 'desc':''});
                }
            }
        },
        //{ display: "状态等级划分", id: "level", newline: true, type: "select", editor: { data: levs }, defaultvalue: '', group: '状态评价', width: 350, labelwidth: 120,
        //    change:function(data1){
        //        var name = $('#form_state_examination_standard').webgisform('getdata').name;
        //        if(name && name.length && data1.length){
        //            var levels = _.result(_.find($.webgis.data.state_examination.standard, {name:name}), 'levels');
        //            if(levels[data1]){
        //                $('#form_state_examination_standard').webgisform('setdata', {'desc':levels[data1].according});
        //            }else{
        //                $('#form_state_examination_standard').webgisform('setdata', {'desc':''});
        //            }
        //        }else{
        //            $('#form_state_examination_standard').webgisform('setdata', {'desc':''});
        //        }
        //    }
        //},
        { display: "", id: "desc", newline: true, type: "textarea",  defaultvalue: '', group: '等级描述', width: 530,height:130, labelwidth: 1}

    ];
    $('#form_state_examination_standard2014').webgisform(flds, {
        prefix: "form_state_examination_standard2014_",
        maxwidth: 540
        //margin:10,
        //groupmargin:10
    });
}
function GetDomainName(value)
{
    return _.result(_.find($.webgis.data.bbn.domains_range, {value:value}), 'name');
}

function RenderLevelName(item, a1, a2)
{
    return GetDomainName(a2);
}
function ShowStateExaminationListDialog(viewer)
{
    CreateDialogSkeleton(viewer, 'dlg_state_examination_list');
    $('#dlg_state_examination_list').dialog({
        width: 640,
        height: 670,
        minWidth:200,
        minHeight: 200,
        draggable: true,
        resizable: true,
        modal: false,
        position:{at: "center"},
        title:'状态评价记录',
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
                text: "批量删除",
                click: function(e){
                    var rows = $.webgis.data.state_examination.control.list_grid.getSelectedRows();
                    if(rows.length === 0) return;
                    ShowConfirm(null, 500, 200,
                        '删除确认',
                        '确认删除吗? 确认的话数据将会提交到服务器上，以便所有人都能看到修改的结果。',
                        function () {
                            DeleteStateExamination(viewer, null, function () {
                                $.webgis.data.state_examination.control.list_grid.deleteRange(rows);
                            },function(){
                            });
                        },
                        function () {
                            //$('#').dialog("close");
                        }
                    );
                }
            },
            {
                text: "关闭",
                click: function(e){
                    $( this ).dialog( "close" );
                }
            }
        ]
    });
    var reload_grid = function(list, option) {
        var get_sel = function(name) {
            var levs = [
                //{value:'', label:'(请选择等级)'},
                {value: 'I', label: GetDomainName('I')},
                {value: 'II', label: GetDomainName('II')},
                {value: 'III', label: GetDomainName('III')},
                {value: 'IV', label: GetDomainName('IV')},
            ];
            var ret = _.map(levs, function(item){
                var o = {text:item.label};
                o[name] = item.value;
                return o;
            });
            //console.log(ret);
            return ret;
        };
        var columns = [
            { display: '操作', isSort: false, width: 100, render: function (rowdata, rowindex, value)
                {
                    var h = "";
                    if (!rowdata._editing)
                    {
                        h += "<a href='javascript:StateExaminationListBeginEdit(" + rowindex + ")'>修改</a> ";
                        h += "<a href='javascript:StateExaminationListDeleteRow(" + rowindex + ")'>删除</a> ";
                    }
                    else
                    {
                        h += "<a href='javascript:StateExaminationListEndEdit(" + rowindex + ")'>提交</a> ";
                        h += "<a href='javascript:StateExaminationListCancelEdit(" + rowindex + ")'>取消</a> ";
                    }
                    return h;
                }
            },
            {display:'', name:'id', width: 1, hide: true},
            {display:'评价年份', name:'check_year', width: 70, editor: { type: 'text' }},
            //{display:'电压等级', name:'voltage', width: 70, editor: { type: 'select', date: [{voltage:'500kV',text:'500kV'},{voltage:'220kV',text:'220kV'},{voltage:'110kV',text:'110kV'}],  valueField: 'voltage'}},
            {display:'电压等级', name:'voltage', width: 70, editor: { type: 'text'}},
            {display:'线路名称', name:'line_name', width: 100, editor: { type: 'text' }},
            {display:'情况描述', name:'description', width: 200, editor: { type: 'text' }},
            {display:'检修策略', name:'suggestion', width: 200, editor: { type: 'text' }, hide:true},
            {display:'线路整体评价', name:'line_state', width: 100,
                editor: { type: 'select', data: get_sel('line_state'), valueField: 'line_state' },
                render: RenderLevelName
            },
            {display:'基础', name:'unit_1', width: 50,
                editor: { type: 'select', data: get_sel('unit_1'), valueField: 'unit_1' },
                render: RenderLevelName
            },
            {display:'杆塔', name:'unit_2', width: 50,
                editor: { type: 'select', data: get_sel('unit_2'), valueField: 'unit_2' },
                render: RenderLevelName
            },
            {display:'导地线', name:'unit_3', width: 50,
                editor: { type: 'select', data: get_sel('unit_3'), valueField: 'unit_3' },
                render: RenderLevelName
            },
            {display:'绝缘子', name:'unit_4', width: 50,
                editor: { type: 'select', data: get_sel('unit_4'), valueField: 'unit_4' },
                render: RenderLevelName
            },
            {display:'金具', name:'unit_5', width: 50,
                editor: { type: 'select', data: get_sel('unit_5'), valueField: 'unit_5' },
                render: RenderLevelName
            },
            {display:'接地装置', name:'unit_6', width: 50,
                editor: { type: 'select', data: get_sel('unit_6'), valueField: 'unit_6' },
                render: RenderLevelName
            },
            {display:'附属设施', name:'unit_7', width: 50,
                editor: { type: 'select', data: get_sel('unit_7'), valueField: 'unit_7' },
                render: RenderLevelName
            },
            {display:'通道环境', name:'unit_8', width: 50,
                editor: { type: 'select', data: get_sel('unit_8'), valueField: 'unit_8' },
                render: RenderLevelName
            }
        ];
        var tabledata = {Rows:list};
        //console.log(list);
        if(option.is_rebuild === true)
        {
            $('#div_state_examination_list_grid_container').empty();
            $('#div_state_examination_list_grid_container').append('<div id="div_state_examination_list_grid"></div>');
            $.webgis.data.state_examination.control.list_grid = $('#div_state_examination_list_grid').ligerGrid({
                columns: columns,
                data: tabledata,
                enabledEdit: true,
                clickToEdit: false,
                checkbox: true,
                pageSize: 10,
                onSelectRow:function(rowdata, rowid, rowobj){
                    //console.log(rowdata);
                    //console.log(rowobj);
                    $(rowobj).find('td').each(function (i, item) {
                        var id = $(item).attr('id');
                        if(_.endsWith(id, 'c107') || _.endsWith(id, 'c108'))
                        {
                            var div = $(item).find('div');
                            $(div).attr('title', $(div).html());
                        }
                    });
                }
            });
        }else{
            if(_.isString(option.line_name)  && option.line_name.length )
            {
                list = _.filter(list, function(item){
                    return _.includes(item.line_name, option.line_name);
                });
            }
            if(  _.isString(option.check_year) &&  option.check_year.length)
            {
                list = _.filter(list, function(item){
                    //console.log(item.check_year.toString() + '=' + option.check_year.toString());
                    return item.check_year.toString() === option.check_year.toString();
                });
            }
            if(  _.isString(option.voltage) &&  option.voltage.length)
            {
                list = _.filter(list, function(item){
                    //console.log(item.voltage.toString().replace('kV', '') + '=' + option.voltage.toString().replace('kV', ''));
                    if(item.voltage) {
                        return item.voltage.toString().replace('kV', '') === option.voltage.toString().replace('kV', '');
                    }else{
                        return false;
                    }
                });
            }
            $.webgis.data.state_examination.control.list_grid.loadData({Rows:list});
        }

    };
    ShowProgressBar(true, 670, 200, '查询', '正在查询，请稍候...');
    $.ajax({
        url:'/state_examination/query',
        method:'post',
        data: JSON.stringify({})
    })
    .always(function () {
        ShowProgressBar(false);
    })
    .done(function (data1) {
        data1 = JSON.parse(data1);
        $.webgis.data.state_examination.list_data = data1;

        //$('#form_state_examination_list_filter_line_name').empty();
        //$('#form_state_examination_list_filter_line_name').append('<option value="">(请选择)</option>');
        //_.forEach(_.uniq(_.pluck($.webgis.data.state_examination.list_data, 'line_name')), function(item){
        //    $('#form_state_examination_list_filter_line_name').append('<option value="' + item + '">' + item + '</option>');
        //});
        //$('#form_state_examination_list_filter_line_name').multipleSelect('refresh');

        $('#form_state_examination_list_filter_voltage').empty();
        $('#form_state_examination_list_filter_voltage').append('<option value="">(请选择)</option>');
        _.forEach(_.uniq(_.pluck($.webgis.data.state_examination.list_data, 'voltage')), function(item){
            if(!_.isUndefined(item))
            {
                $('#form_state_examination_list_filter_voltage').append('<option value="' + item + '">' + item  + '</option>');
            }
        });
        $('#form_state_examination_list_filter_voltage').multipleSelect('refresh');

        $('#form_state_examination_list_filter_check_year').empty();
        $('#form_state_examination_list_filter_check_year').append('<option value="">(请选择)</option>');
        _.forEach(_.uniq(_.pluck($.webgis.data.state_examination.list_data, 'check_year')), function(item){
            $('#form_state_examination_list_filter_check_year').append('<option value="' + item + '">' + item + '</option>');
        });
        $('#form_state_examination_list_filter_check_year').multipleSelect('refresh');
        reload_grid($.webgis.data.state_examination.list_data, {is_rebuild: true, line_name:'', voltage:'', check_year:''});
    })
    .fail(function (jqxhr, textStatus, e) {
        $.jGrowl("查询失败:" + e, {
            life: 2000,
            position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
            theme: 'bubblestylefail',
            glue:'before'
        });
    });

    var flds = [
        { display: "线路名称", id: "line_name", newline: true, type: "text",  defaultvalue:'', group: '过滤条件', width: 350, labelwidth: 120 ,
            change:function(data2){
                var data3 = $('#form_state_examination_list_filter').webgisform('getdata');
                reload_grid($.webgis.data.state_examination.list_data, {line_name:data2, voltage:data3.voltage, check_year:data3.check_year});
            }
        },
        { display: "电压等级", id: "voltage", newline: true, type: "select", editor: { data: [] }, defaultvalue: '', group: '过滤条件', width: 350, labelwidth: 120,
            change:function(data2){
                var data3 = $('#form_state_examination_list_filter').webgisform('getdata');
                reload_grid($.webgis.data.state_examination.list_data, {line_name:data3.line_name, voltage:data2, check_year:data3.check_year});
            }
        },
        { display: "评价年份", id: "check_year", newline: true, type: "select", editor: { data: [] }, defaultvalue: '', group: '过滤条件', width: 350, labelwidth: 120,
            change:function(data2){
                var data3 = $('#form_state_examination_list_filter').webgisform('getdata');
                reload_grid($.webgis.data.state_examination.list_data, {line_name:data3.line_name, voltage:data3.voltage, check_year:data2});
            }
        }
    ];

    $('#form_state_examination_list_filter').webgisform(flds, {
        prefix: "form_state_examination_list_filter_",
        maxwidth: 530
        //margin:10,
        //groupmargin:10
    });

}

function StateExaminationListBeginEdit(rowindex)
{
    //$.webgis.data.state_examination.control.list_grid.beginEdit(rowindex);
    var rowobj = $.webgis.data.state_examination.control.list_grid.getRow(rowindex);
    //console.log(rowobj);
    ShowStateExaminationImportDialog(null, rowobj);
}
function StateExaminationListDeleteRow(rowindex)
{
    ShowConfirm(null, 500, 200,
        '删除确认',
        '确认删除吗? 确认的话数据将会提交到服务器上，以便所有人都能看到修改的结果。',
        function () {
            var row = $.webgis.data.state_examination.control.list_grid.getRow(rowindex);
            console.log(row);
            if(row && row._id) {
                DeleteStateExamination(null, {_id:row._id}, function () {
                    $.webgis.data.state_examination.control.list_grid.deleteRow(rowindex);
                },function(){
                    $.webgis.data.state_examination.control.list_grid.cancelEdit(rowindex);
                });
            }
        },
        function () {
            //$('#').dialog("close");
        }
    );
}
function StateExaminationListEndEdit(rowindex)
{
    $.webgis.data.state_examination.control.list_grid.endEdit(rowindex);
    ShowConfirm(null, 500, 200,
        '确认',
        '确认保存吗? 确认的话数据将会提交到服务器上，以便所有人都能看到修改的结果。',
        function () {
            var row = $.webgis.data.state_examination.control.list_grid.getRow(rowindex);
            _.forIn(row, function(v, k){
                if(_.startsWith(k, '__'))
                {
                    delete row[k];
                }
            });
            //console.log(row);
            if(row) {
                SaveStateExamination(null, row, function () {
                    $.webgis.data.state_examination.control.list_grid.endEdit(rowindex);
                },function(){
                    $.webgis.data.state_examination.control.list_grid.cancelEdit(rowindex);
                });
            }
        },
        function () {
            //$('#').dialog("close");
        }
    );

}
function StateExaminationListCancelEdit(rowindex)
{
    $.webgis.data.state_examination.control.list_grid.cancelEdit(rowindex);
}

function DeleteStateExamination(viewer, data, success, fail)
{
    ShowProgressBar(true, 670, 200, '保存', '正在删除，请稍候...');
    if(_.isNull(data)){
        var rows = $.webgis.data.state_examination.control.list_grid.getSelectedRows();
        data = _.map(rows, function(item){
            return item._id;
        });
    }
    if(data.length === 0) return;
    $.ajax({
        url:'/state_examination/delete',
        method:'post',
        data: JSON.stringify({_id: data})
    })
    .always(function () {
        ShowProgressBar(false);
    })
    .done(function (data1) {
        if(data1.result) {
            $.jGrowl("删除失败:" + data1.result, {
                life: 2000,
                position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                theme: 'bubblestylefail',
                glue:'before'
            });
            if(fail) fail();
        }else{
            $.jGrowl("删除成功", {
                life: 2000,
                position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                theme: 'bubblestylesuccess',
                glue: 'before'
            });
            if(success) success();
        }
    })
    .fail(function (jqxhr, textStatus, e) {
        $.jGrowl("删除失败:" + e, {
            life: 2000,
            position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
            theme: 'bubblestylefail',
            glue:'before'
        });
        if(fail) fail();
    });

}

function PreviewStateExaminationMultiple(viewer)
{
    CreateDialogSkeleton(viewer, 'dlg_state_examination_import_preview');
    $('#dlg_state_examination_import_preview').dialog({
        width: 640,
        height: 520,
        minWidth:200,
        minHeight: 200,
        draggable: true,
        resizable: true,
        modal: false,
        position:{at: "center"},
        title:'批量导入预览',
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
                text: "导入",
                click: function(e){
                    SaveStateExaminationMultiple(viewer);
                }
            },
            {
                text: "关闭",
                click: function(e){
                    $( this ).dialog( "close" );
                }
            }
        ]
    });
    var formdata = $('#form_state_examination_import_multiple').webgisform('getdata');
    var data = _.result(_.find($.webgis.data.state_examination.import_excel_data, {sheet_name:formdata.sheet_name}), 'sheet_data');
    _.forIn(formdata, function(v, k){
        if(_.isUndefined(v)){
            delete formdata[k];
        }
    });
    delete formdata.sheet_name;

    data = _.map(data,  function(item){
        if(!_.isUndefined(item['检修设备'])){
            item.line_name = item['检修设备'];
        }
        if(!_.isUndefined(item['评价线路'])){
            item.line_name = item['评价线路'];
        }
        if(!_.isUndefined(item['电压等级'])){
            item.voltage = item['电压等级'];
        }
        if(!_.isUndefined(item['评价年份'])){
            item.check_year = item['评价年份'];
        }
        if(!_.isUndefined(item['总体评价'])){
            item.line_state = item['总体评价'];
        }
        if(!_.isUndefined(item['基础'])){
            item.unit_1 = item['基础'];
        }
        if(!_.isUndefined(item['杆塔'])){
            item.unit_2 = item['杆塔'];
        }
        if(!_.isUndefined(item['导地线'])){
            item.unit_3 = item['导地线'];
        }
        if(!_.isUndefined(item['绝缘子'])){
            item.unit_4 = item['绝缘子'];
        }
        if(!_.isUndefined(item['金具'])){
            item.unit_5 = item['金具'];
        }
        if(!_.isUndefined(item['接地装置'])){
            item.unit_6 = item['接地装置'];
        }
        if(!_.isUndefined(item['附属设施'])){
            item.unit_7 = item['附属设施'];
        }
        if(!_.isUndefined(item['通道环境'])){
            item.unit_8 = item['通道环境'];
        }
        return item;
    });


    var keys = _.values(formdata);
    _.forEach(['line_name', 'voltage', 'check_year', 'line_state', 'unit_1', 'unit_2','unit_3','unit_4','unit_5','unit_6','unit_7','unit_8'], function(item){
        if(!_.includes(keys, item)){
            keys.push(item);
        }
    });
    _.remove(keys, function(item){
        return _.includes(['检修设备', '评价线路', '电压等级', '评价年份', '总体评价', '基础', '杆塔','导地线','绝缘子','金具','接地装置','附属设施','通道环境', 'undefined'], item);
    });

    $.webgis.data.state_examination.import_data = _.map(data,  function(item){
        return _.pick(item, keys);
    });
    $.webgis.data.state_examination.import_data = _.filter($.webgis.data.state_examination.import_data, function(item){
        return !_.isEmpty(item.check_year);
    });
    $.webgis.data.state_examination.import_data = _.map($.webgis.data.state_examination.import_data, function(item){
        if(_.isString(item.voltage) && !_.endsWith(item.voltage, 'kV'))
        {
            item.voltage = item.voltage + 'kV';
        }
        if(_.isNumber(item.voltage))
        {
            item.voltage = item.voltage + 'kV';
        }
        _.forEach(['line_state', 'unit_1', 'unit_2','unit_3','unit_4','unit_5','unit_6','unit_7','unit_8'], function(item1){
            if(_.isUndefined(item[item1]) || _.isEmpty(item[item1])){
                item[item1] === 'I';
            }
            if(item[item1] === 'I'){
                item[item1] = '正常';
            }
            if(item[item1] === 'II'){
                item[item1] = '注意';
            }
            if(item[item1] === 'III'){
                item[item1] = '异常';
            }
            if(item[item1] === 'IV'){
                item[item1] = '严重';
            }
        });
        return item;
    });
    //console.log(keys);
    //console.log($.webgis.data.state_examination.import_data);
    var tabledata = {Rows:$.webgis.data.state_examination.import_data};
    var columns = [
        {display:'评价年份', name:'check_year', width: 50},
        {display:'线路名称', name:'line_name', width: 100},
        {display:'情况描述', name:'description', width: 200},
        {display:'检修策略', name:'suggestion', width: 200},
        {display:'线路整体评价', name:'line_state', width: 100},
        {display:'基础', name:'unit_1', width: 50},
        {display:'杆塔', name:'unit_2', width: 50},
        {display:'导地线', name:'unit_3', width: 50},
        {display:'绝缘子', name:'unit_4', width: 50},
        {display:'金具', name:'unit_5', width: 50},
        {display:'接地装置(拉线)', name:'unit_6', width: 50},
        {display:'附属设施', name:'unit_7', width: 50},
        {display:'通道环境(特殊区段)', name:'unit_8', width: 50}
    ];
    $('#div_state_examination_import_preview_grid').ligerGrid({
        columns:columns,
        data:tabledata,
        pageSize:10
    });
}
function GetMaxlvl(obj)
{
    var l = [];
    _.forIn(obj, function(v, k){
        if(_.startsWith(k, 'unit_')){
            if(v === 'I'){
                l.push(1);
            }
            if(v === 'II'){
                l.push(2);
            }
            if(v === 'III'){
                l.push(3);
            }
            if(v === 'IV'){
                l.push(4);
            }
        }
    });
    var ret = _.max(l);
    if(ret === 1){
        ret = 'I';
    }
    if(ret === 2){
        ret = 'II';
    }
    if(ret === 3){
        ret = 'III';
    }
    if(ret === 4){
        ret = 'IV';
    }
    return ret;
}

function ShowStateExaminationImportDialog(viewer, data)
{
    CreateDialogSkeleton(viewer, 'dlg_state_examination_import');
    $('#dlg_state_examination_import').dialog({
        width: 540,
        height: 600,
        minWidth:200,
        minHeight: 200,
        draggable: true,
        resizable: true,
        modal: false,
        position:{at: "center"},
        title:'数据导入',
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
                text: "查看评价标准",
                click: function(e){
                    ShowStateExaminationStandardDialog2009(viewer);
                    //ShowStateExaminationStandardDialog2014(viewer);
                }
            },
            {
                text: "导入...",
                click: function(e){
                    if($('#tabs_state_examination_import').tabs('option', 'active') === 0) {
                        SaveStateExaminationSingle(viewer);
                    }
                    if($('#tabs_state_examination_import').tabs('option', 'active') === 1) {
                        PreviewStateExaminationMultiple(viewer);
                    }
                }
            },
            {
                text: "关闭",
                click: function(e){
                    $( this ).dialog( "close" );
                }
            }
        ]
    });
    $('#tabs_state_examination_import').tabs({
        collapsible: false,
        active: 0
    });
    var formdata;
    if(_.isUndefined(data)){
        $('#dlg_state_examination_import').dialog('option', 'title', '数据导入');
        $('#tabs_state_examination_import').tabs( "enable", 1 );
    }else{
        formdata = $.extend(true, {}, data);
        if(formdata.check_year){
            formdata.check_year = formdata.check_year + '';
        }
        if(formdata.description && formdata.description.length>0 && _.trim(formdata.description)!='无' && _.trim(formdata.description)!='（无）' && _.trim(formdata.description)!='(无)'){
            formdata.unitsub_desc = formdata.description;
        }
        formdata.line_state = GetMaxlvl(formdata);
        $('#dlg_state_examination_import').dialog('option', 'title', '编辑记录');
        $('#tabs_state_examination_import').tabs( "disable", 1 );
    }
    var list = ['08', '09', '10', '11', '12', '13', '15'];
    //var voltagelist = [];
    //_.forIn($.webgis.data.codes['voltage_level'], function(v, k){
    //    if(_.indexOf(list, k) > -1){
    //        voltagelist.push({ value: k, label: $.webgis.data.codes['voltage_level'][k] });
    //    }
    //});
    var voltagelist = [{value:'500kV',label:'500kV'},{value:'220kV',label:'220kV'},{value:'110kV',label:'110kV'},{value:'35kV',label:'35kV'}];
    list = _.range(2000, 2030);
    var yearlist = [
        //{value:'', label:'(请选择年份)'}
    ];
     _.forEach(list, function(item){
        yearlist.push( {value:item.toString(), label:item.toString()});
    });
    var unitlist = _.uniq(_.pluck($.webgis.data.state_examination.standard, 'parent'));
    var levs = [
        //{value:'', label:'(请选择等级)'},
        {value: 'I', label: GetDomainName('I')},
        {value: 'II', label: GetDomainName('II')},
        {value: 'III', label: GetDomainName('III')},
        {value: 'IV', label: GetDomainName('IV')},
    ];
    var lines = _.map($.webgis.data.lines, function(item){
        return {label:item.properties.name, value:item._id};
    });
    lines.unshift({value:'', label:'(请选择线路)'});
    var flds = [
        { display: "线路名称", id: "line_name", newline: true, type: "text", group: '线路信息', width: 250, labelwidth: 120, validate: { required: true}},
        { display: "GIS线路绑定", id: "line_id", newline: true, type: "select", editor: { data: lines }, defaultvalue:'', group: '线路信息', width: 250, labelwidth: 120 },
        { display: "电压等级", id: "voltage", newline: true, type: "select", editor: { data: voltagelist }, defaultvalue: '13', group: '线路信息', width: 250, labelwidth: 120, validate:{ required: true}},
        { display: "评价年份", id: "check_year", newline: true, type: "select", editor: { data: yearlist }, defaultvalue: '2015', group: '线路信息', width: 250, labelwidth: 120, validate:{ required: true}},
    ];
    flds.push({ display: '线路整体', id: "line_state" , newline: true, type: "select", editor: { data: levs }, defaultvalue: 'I', group: '状态评价-整体', width: 250, labelwidth: 120, validate:{ required: true}});
    //flds.push({ display: '存在问题描述', id: "description" , newline: true, type: "textarea",  defaultvalue: '', group: '状态评价-整体', width: 250, height:120, labelwidth: 120 });
    //flds.push({ display: '检修策略', id: "suggestion" , newline: true, type: "textarea",  defaultvalue: '', group: '状态评价-整体', width: 250,  height:90, labelwidth: 120 });
    _.forEach(unitlist, function(item){
        flds.push({ display: item, id: "unit_" + (_.indexOf(unitlist, item) + 1), newline: true, type: "select", editor: { data: levs }, defaultvalue: 'I', group: '状态评价-单元', width: 250, labelwidth: 120, validate:{ required: true}});
    });
    flds.push({ display: '劣化情况描述', id: "unitsub_desc" , newline: true, type: "textarea", editor: { readonly: true }, defaultvalue: '', group: '状态评价-详细', width: 250, height:60, labelwidth: 120});
    flds.push({ display: '使用2014标准', id: "check_is_2014" , newline: true, type: "checkbox", defaultvalue: false,  group: '劣化情况输入', width: 250, labelwidth: 120});
    flds.push({ display: '', id: "unitsub_input" , newline: true, type: "button", defaultvalue: '填写劣化情况',  group: '劣化情况输入', width: 360, labelwidth: 1,
        click:function(){
            var fdata = $('#form_state_examination_import_single').webgisform('getdata');
            if(!fdata.check_is_2014){
                if(_.isUndefined(formdata)) {
                    ShowUnitSubForm2009(viewer);
                }else{
                    ShowUnitSubForm2009(viewer, formdata.line_name, parseInt(formdata.check_year));
                }
            }else{
                if(_.isUndefined(formdata)) {
                    ShowUnitSubForm2014(viewer);
                }else{
                    ShowUnitSubForm2014(viewer, formdata.line_name, parseInt(formdata.check_year));
                }
            }
        }
    });
    //flds.push({ display: '标准2009', id: "unitsub_input_2009" , newline: true, type: "button", defaultvalue: '填写劣化情况(2009标准)',  group: '劣化情况输入', width: 250, labelwidth: 120,
    //    click:function(){
    //        if(_.isUndefined(formdata)){
    //            ShowUnitSubForm2009(viewer);
    //        }else{
    //            ShowUnitSubForm2009(viewer, formdata.line_name, parseInt(formdata.check_year));
    //        }
    //    }
    //});
    //flds.push({ display: '标准2014', id: "unitsub_input_2014" , newline: true, type: "button", defaultvalue: '填写劣化情况(2014标准)',  group: '劣化情况输入', width: 250, labelwidth: 120,
    //    click:function(){
    //        if(_.isUndefined(formdata)){
    //            ShowUnitSubForm2014(viewer);
    //        }else{
    //            ShowUnitSubForm2014(viewer, formdata.line_name, parseInt(formdata.check_year));
    //        }
    //    }
    //});


    $('#form_state_examination_import_single').webgisform(flds, {
        prefix: "form_state_examination_import_single_",
        maxwidth: 430
        //margin:10,
        //groupmargin:10
    });

    if(!_.isUndefined(formdata)){
        $('#form_state_examination_import_single').webgisform('setdata', formdata);
    }

    var rebuild_column_select = function(unitlist, arr){
        var colids = ['line_name', 'voltage', 'check_year', 'line_state', 'description', 'suggestion'];
        _.forEach(_.range(1, unitlist.length + 1), function(i){
            colids.push('unit_' + i);
        });
        _.forEach(colids, function(item) {
            $('#form_state_examination_import_multiple_' + item).empty();
            //$('#form_state_examination_import_multiple_' + item).append('<option value="">(请选择)</option>');
            _.forEach(arr, function (item1) {
                $('#form_state_examination_import_multiple_' + item).append('<option value="' + item1 + '">' + item1 + '</option>');
            });
            $('#form_state_examination_import_multiple_' + item).multipleSelect('refresh');
        });
    };
    var flds1 = [
        { display: "选择Excel文件", id: "excel_file", newline: true, type: "file",  group: 'Excel文件', width: 250, labelwidth: 120,
            handleFile:function(e){
                function to_json(workbook) {
                    var result = [];
                    workbook.SheetNames.forEach(function(sheetName) {
                        var roa = XLS.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        if(roa.length > 0){
                            result.push({sheet_name:sheetName, sheet_data:roa});
                        }
                    });
                    return result;
                }
                var files = e.target.files;
                var f = files[0];

                var reader = new FileReader();
                if(f && f.name) {
                    if(!_.endsWith(f.name, '.xls')){
                        ShowMessage(null, 400, 220, '出错了', '批量导入仅支持Excel97-2003格式(.xls),如果是(.xlsx)，请转换为(.xls)');
                        return;
                    }
                    var name = f.name;
                    console.log(name);
                    reader.onload = function (e) {
                        var data = e.target.result;
                        var wb = XLS.read(data, {type: 'binary'});
                        $.webgis.data.state_examination.import_excel_data = to_json(wb);
                        var arr = _.pluck($.webgis.data.state_examination.import_excel_data, 'sheet_name');
                        $('#form_state_examination_import_multiple_sheet_name').empty();
                        $('#form_state_examination_import_multiple_sheet_name').append('<option value="">(请选择Sheet名称)</option>');
                        _.forEach(arr, function (item) {
                            $('#form_state_examination_import_multiple_sheet_name').append('<option value="' + item + '">' + item + '</option>');
                        });
                        $('#form_state_examination_import_multiple_sheet_name').multipleSelect('refresh');
                    };
                    reader.readAsBinaryString(f);
                }else{
                    $('#form_state_examination_import_multiple_sheet_name').empty();
                    $('#form_state_examination_import_multiple_sheet_name').multipleSelect('refresh');
                    rebuild_column_select(unitlist, []);
                }
            }
        },
        { display: "工作表Sheet名称", id: "sheet_name", newline: true, type: "select", editor: { data: [] }, defaultvalue:'', group: 'Excel文件', width: 200, labelwidth: 150,
            change:function(data1){
                ShowProgressBar(true, 670, 200, '查询中', '正在查询，请稍候...');
                var arr = _.keys(_.result(_.find($.webgis.data.state_examination.import_excel_data, {sheet_name:data1}), 'sheet_data')[0]);
                rebuild_column_select(unitlist, arr);
                ShowProgressBar(false);
            }
        },
        { display: "线路名列名称", id: "line_name", newline: true, type: "select", editor: { data: [] }, defaultvalue:'', group: 'Excel索引列', width: 150, labelwidth: 200, validate:{ required: true}},
        { display: "电压等级列名称", id: "voltage", newline: true, type: "select", editor: { data: [] }, defaultvalue:'', group: 'Excel索引列', width: 150, labelwidth: 200, validate:{ required: true}},
        { display: "评价年份列名称", id: "check_year", newline: true, type: "select", editor: { data: [] }, defaultvalue:'',  group: 'Excel索引列', width: 150, labelwidth: 200, validate:{ required: true}},
        { display: '线路整体评价列名称', id: "line_state" , newline: true, type: "select", editor: { data: [] }, defaultvalue:'', group: 'Excel索引列', width: 150, labelwidth: 200,validate:{ required: true}},
        { display: '存在问题描述列名称', id: "description" , newline: true, type: "select", editor: { data: [] }, defaultvalue:'', group: 'Excel索引列', width: 150, labelwidth: 200,validate:{ required: true}},
        { display: '检修策略列名称', id: "suggestion" , newline: true, type: "select", editor: { data: [] }, defaultvalue:'', group: 'Excel索引列', width: 150, labelwidth: 200, validate:{ required: true} }
    ];
    _.forEach(unitlist, function(item){
        flds1.push({ display: '[' + item + ']' + '列名称', id: "unit_" + (_.indexOf(unitlist, item) + 1), newline: true, type: "select",  editor: { data: [] }, defaultvalue:'', group: 'Excel索引列', width: 150, labelwidth: 200, validate:{ required: true} });
    });

    $('#form_state_examination_import_multiple').webgisform(flds1, {
        prefix: "form_state_examination_import_multiple_",
        maxwidth: 430
        //margin:10,
        //groupmargin:10
    });
}

function ShowStrategyEditDialog2014(viewer)
{
    var load_html = function(html) {
        $('#dlg_unitsub_strategy2014').empty();
        $('#dlg_unitsub_strategy2014').append(html);
    };
    var load_data = function(){
        _.forEach($.webgis.data.bbn.unitsub_template_2014, function(item) {
            _.forEach(item.children, function(item1) {
                $('#form_unitsub_strategy_2014').find('#textarea_' + item1.id).val(item1.strategy);
            });
        });
    };
    var save_data = function(){
        ShowConfirm(null, 500, 200,
            '保存确认',
            '确认保存吗? 确认的话数据将会提交到服务器上，以便所有人都能看到修改的结果。',
            function () {
                $('#form_unitsub_strategy_2014').find('textarea').each(function(idx, item){
                    var id = $(item).attr('id').replace('textarea_', '');
                    var unit = $(item).attr('data-unit');
                    var idx1 = _.findIndex($.webgis.data.bbn.unitsub_template_2014, 'unit', unit);
                    var idx2 = _.findIndex($.webgis.data.bbn.unitsub_template_2014[idx1].children, 'id', id);
                    $.webgis.data.bbn.unitsub_template_2014[idx1].children[idx2].strategy = _.trim($(item).val());
                    $.webgis.data.bbn.unitsub_template_2014[idx1].children[idx2].weight = parseInt($.webgis.data.bbn.unitsub_template_2014[idx1].children[idx2].weight);
                    $.webgis.data.bbn.unitsub_template_2014[idx1].children[idx2].base_score = parseInt($.webgis.data.bbn.unitsub_template_2014[idx1].children[idx2].base_score);
                });
                //console.log($.webgis.data.bbn.unitsub_template_2014);
                //return;
                ShowProgressBar(true, 670, 200, '保存', '正在保存，请稍候...');
                $.ajax({
                    url:'/state_examination/save_strategy_2014',
                    method:'post',
                    data: JSON.stringify($.webgis.data.bbn.unitsub_template_2014)
                })
                .always(function () {
                    ShowProgressBar(false);
                })
                .done(function (data1) {
                    data1 = JSON.parse(data1);
                    $.webgis.data.bbn.unitsub_template_2014 = data1;
                    $.jGrowl("保存成功", {
                        life: 2000,
                        position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                        theme: 'bubblestylesuccess',
                        glue: 'before'
                    });
                });
            },
            function () {
                $('#').dialog("close");
            }
        );
    };
    var build_dlg = function(){
        CreateDialogSkeleton(viewer, 'dlg_unitsub_strategy2014');
        $('#dlg_unitsub_strategy2014').dialog({
            width: 890,
            height: 500,
            minWidth:200,
            minHeight: 200,
            draggable: true,
            resizable: true,
            modal: false,
            position:{at: "center"},
            title:'检修策略制定(标准2014)',
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
                    text: "确定",
                    click: function(e){
                        save_data();
                        $( this ).dialog( "close" );
                    }
                },
                {
                    text: "关闭",
                    click: function(e){
                        $( this ).dialog( "close" );
                    }
                }
            ]
        });
    };
    build_dlg();
    $.ajax({
        url: '/webgis_strategy2014_form.html',
        method: 'get',
        dataType: 'html'
    })
    .done(function(page){
        load_html(page);
        load_data();
    })
    .fail(function (jqxhr, textStatus, e) {
        $.jGrowl("载入模板[/webgis_strategy2014_form.html]失败:" + e, {
            life: 2000,
            position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
            theme: 'bubblestylefail',
            glue:'before'
        });
    });
}

function ShowStrategyEditDialog2009(viewer)
{
    var load_html = function(html) {
        $('#dlg_unitsub_strategy2009').empty();
        $('#dlg_unitsub_strategy2009').append(html);
    };
    var load_data = function(){
        _.forEach($.webgis.data.bbn.unitsub_template_2009, function(item) {
            _.forEach(item.children, function(item1) {
                $('#form_unitsub_strategy_2009').find('#textarea_' + item1.id).val(item1.strategy);
            });
        });
    };
    var save_data = function(){
        ShowConfirm(null, 500, 200,
            '保存确认',
            '确认保存吗? 确认的话数据将会提交到服务器上，以便所有人都能看到修改的结果。',
            function () {
                $('#form_unitsub_strategy_2009').find('textarea').each(function(idx, item){
                    var id = $(item).attr('id').replace('textarea_', '');
                    var unit = $(item).attr('data-unit');
                    var idx1 = _.findIndex($.webgis.data.bbn.unitsub_template_2009, 'unit', unit);
                    var idx2 = _.findIndex($.webgis.data.bbn.unitsub_template_2009[idx1].children, 'id', id);
                    $.webgis.data.bbn.unitsub_template_2009[idx1].children[idx2].strategy = _.trim($(item).val());
                    $.webgis.data.bbn.unitsub_template_2009[idx1].children[idx2].weight = parseInt($.webgis.data.bbn.unitsub_template_2009[idx1].children[idx2].weight);
                    $.webgis.data.bbn.unitsub_template_2009[idx1].children[idx2].base_score = parseInt($.webgis.data.bbn.unitsub_template_2009[idx1].children[idx2].base_score);
                });
                //console.log($.webgis.data.bbn.unitsub_template_2009);
                //return;
                ShowProgressBar(true, 670, 200, '保存', '正在保存，请稍候...');
                $.ajax({
                    url:'/state_examination/save_strategy_2009',
                    method:'post',
                    data: JSON.stringify($.webgis.data.bbn.unitsub_template_2009)
                })
                .always(function () {
                    ShowProgressBar(false);
                })
                .done(function (data1) {
                    data1 = JSON.parse(data1);
                    $.webgis.data.bbn.unitsub_template_2009 = data1;
                    $.jGrowl("保存成功", {
                        life: 2000,
                        position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                        theme: 'bubblestylesuccess',
                        glue: 'before'
                    });
                });
            },
            function () {
                $('#').dialog("close");
            }
        );
    };
    var build_dlg = function(){
        CreateDialogSkeleton(viewer, 'dlg_unitsub_strategy2009');
        $('#dlg_unitsub_strategy2009').dialog({
            width: 890,
            height: 500,
            minWidth:200,
            minHeight: 200,
            draggable: true,
            resizable: true,
            modal: false,
            position:{at: "center"},
            title:'检修策略制定(标准2009)',
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
                    text: "确定",
                    click: function(e){
                        save_data();
                        $( this ).dialog( "close" );
                    }
                },
                {
                    text: "关闭",
                    click: function(e){
                        $( this ).dialog( "close" );
                    }
                }
            ]
        });
    };
    build_dlg();
    $.ajax({
        url: '/webgis_strategy2009_form.html',
        method: 'get',
        dataType: 'html'
    })
    .done(function(page){
        load_html(page);
        load_data();
    })
    .fail(function (jqxhr, textStatus, e) {
        $.jGrowl("载入模板[/webgis_strategy2009_form.html]失败:" + e, {
            life: 2000,
            position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
            theme: 'bubblestylefail',
            glue:'before'
        });
    });
}
function ShowUnitSubForm2014(viewer, line_name, check_year)
{
    var load_html = function(html){
        $('#dlg_unitsub_standard2014').empty();
        $('#dlg_unitsub_standard2014').append(html);
        bind_event();
        $('#form_unitsub_stand_2014').find('textarea').val('');
        if(!_.isUndefined(line_name) && !_.isUndefined(check_year)){
            var unitsub = _.result(_.find($.webgis.data.state_examination.list_data, {line_name:line_name, check_year:check_year}), 'unitsub');
            //console.log(unitsub);
            if(!_.isUndefined(unitsub) && unitsub.length>0){
                load_form_data(unitsub);
            }
        }
        //})
        //.fail(function (jqxhr, textStatus, e) {
        //    $.webgis.data.bbn.unitsub_template_2014 = [];
        //});
        //load_form_data();
        //CalcUnitProbability();
        //console.log(JSON.stringify($.webgis.data.bbn.unitsub_template_2014));

    };
    var load_form_data = function(data){
        //if(_.isUndefined(data))
        //{
        //    $.webgis.data.bbn.unitsub_template_2014 = [];
        //    $('#form_unitsub_stand_2014').find('textarea').each(function(idx, item){
        //        var id = $(item).attr('id').replace('textarea_', '');
        //        var unit = $(item).attr('data-unit');
        //        var weight = $(item).attr('data-weight');
        //        var level = $(item).attr('data-level');
        //        var base_score = $(item).attr('data-base_score');
        //        var name = $(item).attr('data-name');
        //        var according = $(item).attr('data-according');
        //        var desc = '';
        //        var tmp  = _.find($.webgis.data.bbn.unitsub_template_2014, {unit:unit});
        //        if(_.isUndefined(tmp))
        //        {
        //            var o = {unit:unit, children:[]};
        //            o.children.push({
        //                weight:weight,
        //                level:level,
        //                base_score:base_score,
        //                name:name,
        //                according:according,
        //                desc:desc,
        //                total_score:parseInt(weight) * parseInt(base_score),
        //                p0:{I:0, II:0, III:0, IV:0}
        //            });
        //            $.webgis.data.bbn.unitsub_template_2014.push(o);
        //        }else{
        //            var iidx = _.findIndex($.webgis.data.bbn.unitsub_template_2014, 'unit', unit);
        //            tmp.children.push({
        //                weight:weight,
        //                level:level,
        //                base_score:base_score,
        //                name:name,
        //                according:according,
        //                desc:desc,
        //                total_score:parseInt(weight) * parseInt(base_score),
        //                p0:{I:0, II:0, III:0, IV:0}
        //            });
        //            $.webgis.data.bbn.unitsub_template_2014[iidx] = tmp;
        //        }
        //    });
        //}else{
        if(!_.isUndefined(data)){
            _.forEach(data, function(item){
                 $('#form_unitsub_stand_2014').find('#textarea_' + item.id).val(item.desc);
                 $('#form_unitsub_stand_2014').find('#totalscore_' + item.id).html(item.weight * item.base_score);
            });
        }
    };
    var event_other_sel_bind = function(){
        $('#form_unitsub_stand_2014').find('select').off();
        $('#form_unitsub_stand_2014').find('select').on('change', function(e){
            var id = $(e.target).attr('id');
            var total_score = 0;
            var desc = $(e.target).closest('tr').find('textarea[id$=_other]').val();
            //console.log(id);
            if(desc.length > 0)
            {
                if (_.startsWith(id, 'other_weight_sel_')) {
                    var weight = $(e.target).val();
                    var base_score = $(e.target).closest('tr').find('select[id^=other_basescore_sel_]').val();
                    total_score = parseInt(weight) * parseInt(base_score);
                }
                if (_.startsWith(id, 'other_basescore_sel_')) {
                    var weight = $(e.target).closest('tr').find('select[id^=other_weight_sel_]').val();
                    var base_score = $(e.target).val();
                    //console.log(weight + 'x' + base_score);
                    total_score = parseInt(weight) * parseInt(base_score);
                }
                //console.log(total_score);
                $(e.target).closest('tr').find('p[id^=totalscore_]').html(total_score);
            }else{
                $(e.target).closest('tr').find('p[id^=totalscore_]').html('');

            }
        });
    };
    var get_unit = function(uuu){
        return uuu.substr(0, 6);
    };
    var get_item = function(alist, id)
    {
        var ret;
        var findit = false;
        _.forEach(alist, function(item){
            _.forEach(item.children, function(item1){
                if( item1.id === id){
                    ret = item1;
                    findit = true;
                    return;
                }
            });
            if(findit){
                return;
            }
        });
        return ret;
    };
    var bind_event = function(){
        //event_other_sel_bind();
        $('#form_unitsub_stand_2014').find('textarea').off();

        $('#form_unitsub_stand_2014').find('textarea').on('keyup change', function(e){
            var id = $(e.target).attr('id').replace('textarea_', '');

            var unit = get_unit(id);
            var it = get_item($.webgis.data.bbn.unitsub_template_2014, id);
            var weight = it.weight;
            var level = it.level;
            var base_score = it.base_score;
            var name = it.name;
            var according = it.according;
            var desc = $(e.target).val();
            var total_score = 0;
            if(_.trim(desc).length>0 && _.trim(desc) != '无' && _.trim(desc) != '(无)' && _.trim(desc) != '（无）'){
                total_score = weight *  base_score;
            }else{
                total_score = 0;
            }
            //console.log(total_score);
            var total_score_accmulate = 0;
            var total_desc = [];
            $('#form_unitsub_stand_2014').find('textarea').each(function(idx, item){
                var id1 = $(item).attr('id').replace('textarea_', '');
                var un = get_unit(id1);
                var it1 = get_item($.webgis.data.bbn.unitsub_template_2014, id1);
                var desc1 = $(item).val();
                var weight1 = it1.weight;
                var base_score1 = it1.base_score;
                var total_score1 = weight1 * base_score1;
                if(un === unit){
                    if(_.trim(desc1).length>0 && _.trim(desc1) != '无' && _.trim(desc1) != '(无)' && _.trim(desc1) != '（无）'){
                        total_score_accmulate += total_score1;
                    }
                }
                if(_.trim(desc1).length>0 && _.trim(desc1) != '无' && _.trim(desc1) != '(无)' && _.trim(desc1) != '（无）'){
                    total_desc.push(desc1);
                }
            });
            //console.log('unit:' + unit + ', total_score:' + total_score + ', total_score_accmulate:' + total_score_accmulate);
            var t = CalcUnitLevelByScore2014(unit, total_score, total_score_accmulate);

            if(_.trim(desc).length === 0){
                $(e.target).closest('tr').find('p[id^=totalscore_]').html('');
            }else{
                $(e.target).closest('tr').find('p[id^=totalscore_]').html(total_score);
            }
            if(total_score_accmulate>0){
                $('#form_unitsub_stand_2014').find('#finaltext_' + unit).html(t);
            }else{
                $('#form_unitsub_stand_2014').find('#finaltext_' + unit).html('');
            }
            //console.log(unit);
            //console.log(total_score_accmulate);
            //console.log(t);
            if(t === '正常'){
                $('#form_state_examination_import_single_' + unit).multipleSelect('setSelects', ['I']);
            }
            if(t === '注意'){
                $('#form_state_examination_import_single_' + unit).multipleSelect('setSelects', ['II']);
            }
            if(t === '异常'){
                $('#form_state_examination_import_single_' + unit).multipleSelect('setSelects', ['III']);
            }
            if(t === '严重'){
                $('#form_state_examination_import_single_' + unit).multipleSelect('setSelects', ['IV']);
            }
            $('#form_state_examination_import_single_unitsub_desc').val(total_desc.join(';'));
        });
        //$('#btn_unitsub_import').off();
        //$('#btn_unitsub_import').on('click', function(e){
        //    $('#btn_unitsub_import_file_path').html('');
        //    $('#btn_unitsub_import_file').val('');
        //    $('#btn_unitsub_import_file').trigger('click');
        //});
        //$('#btn_unitsub_import_file').off();
        //$('#btn_unitsub_import_file').on('change', function(e){
        //    var  to_json = function(workbook) {
        //        var result = [];
        //        workbook.SheetNames.forEach(function(sheetName) {
        //            var roa = XLS.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        //            if(roa.length > 0){
        //                result.push({sheet_name:sheetName, sheet_data:roa});
        //            }
        //        });
        //        return result;
        //    };
        //    var files = e.target.files;
        //    var f = files[0];
        //    var reader = new FileReader();
        //    if(f && f.name)
        //    {
        //        if(!_.endsWith(f.name, '.xls'))
        //        {
        //            $('#btn_unitsub_import_file_path').html('');
        //            ShowMessage(null, 400, 220, '出错了', '仅支持Excel97-2003格式(.xls),如果是(.xlsx)，请转换为(.xls)');
        //            return;
        //        }
        //        $('#btn_unitsub_import_file_path').html(f.name);
        //        var name = f.name;
        //        //console.log(name);
        //        reader.onload = function (e) {
        //            var data = e.target.result;
        //            var wb = XLS.read(data, {type: 'binary'});
        //            var sheets = to_json(wb);
        //            var sheet_data = sheets[0].sheet_data;
        //            $.webgis.data.bbn.xls_template_2014_id_mapping = [];
        //            var xlsidx = 0;
        //            _.forEach($.webgis.data.bbn.unitsub_template_2014, function(item) {
        //                if(xlsidx>0){
        //                    xlsidx += 1;
        //                }
        //                _.forEach(item.children, function(item1) {
        //                    $.webgis.data.bbn.xls_template_2014_id_mapping.push({id:item1.id, idx:xlsidx});
        //                    xlsidx += 1;
        //                });
        //            });
        //            //console.log( $.webgis.data.bbn.xls_template_2009_id_mapping);
        //            _.forEach(sheet_data, function(item){
        //                var idx = _.indexOf(sheet_data, item);
        //                if(!_.isUndefined(item.劣化情况描述))
        //                {
        //                    var id = _.result(_.find($.webgis.data.bbn.xls_template_2014_id_mapping, {idx: idx}), 'id');
        //                    if (!_.isUndefined(id)) {
        //                        id = 'textarea_' + id;
        //                        $('#form_unitsub_stand_2014 #' + id).val(_.trim(item.劣化情况描述));
        //                        $('#form_unitsub_stand_2014 #' + id).trigger('change');
        //                    }
        //                }
        //            });
        //        };
        //        reader.readAsBinaryString(f);
        //    }
        //});
    };

    CreateDialogSkeleton(viewer, 'dlg_unitsub_standard2014');
    $('#dlg_unitsub_standard2014').dialog({
        width: 890,
        height: 500,
        minWidth:200,
        minHeight: 200,
        draggable: true,
        resizable: true,
        modal: false,
        position:{at: "center"},
        title:'劣化情况详细描述(标准2014)',
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
                text: "确定",
                click: function(e){
                    $.webgis.data.state_examination.record_single_form = $('#form_state_examination_import_single').webgisform('getdata');
                    $.webgis.data.state_examination.record_single_form.line_state = GetMaxlvl($.webgis.data.state_examination.record_single_form);
                    $('#form_state_examination_import_single_line_state').multipleSelect('setSelects', [$.webgis.data.state_examination.record_single_form.line_state]);
                    $( this ).dialog( "close" );
                }
            },
            {
                text: "关闭",
                click: function(e){
                    //$.webgis.data.state_examination.record_single_form.list = [];
                    $( this ).dialog( "close" );
                }
            }
        ]
    });


    $.ajax({
        url: '/webgis_standard2014_form.html',
        method: 'get',
        dataType: 'html'
    })
    .done(function(page){
        load_html(page);
    })
    .fail(function (jqxhr, textStatus, e) {
        $.jGrowl("载入模板[/webgis_standard2014_form.html]失败:" + e, {
            life: 2000,
            position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
            theme: 'bubblestylefail',
            glue:'before'
        });
    });
}
function ShowUnitSubForm2009(viewer, line_name, check_year)
{
    var load_html = function(html){
        $('#dlg_unitsub_standard2009').empty();
        $('#dlg_unitsub_standard2009').append(html);
        bind_event();
        //$.ajax({
        //    url: '/standard_template2009.json',
        //    method: 'get',
        //    dataType: 'json'
        //})
        //.done(function(data){
        //    $.webgis.data.bbn.unitsub_template_2009 = data;
        $('#form_unitsub_stand_2009').find('textarea').val('');
        if(!_.isUndefined(line_name) && !_.isUndefined(check_year)){
            var unitsub = _.result(_.find($.webgis.data.state_examination.list_data, {line_name:line_name, check_year:check_year}), 'unitsub');
            //console.log(unitsub);
            if(!_.isUndefined(unitsub) && unitsub.length>0){
                load_form_data(unitsub);
            }
        }
        //load_form_data();
        //CalcUnitProbability();
        //console.log(JSON.stringify($.webgis.data.bbn.unitsub_template_2009));

    };
    var load_form_data = function(data){
        //if(_.isUndefined(data))
        //{
        //    $.webgis.data.bbn.unitsub_template_2009 = [];
        //    $('#form_unitsub_stand_2009').find('textarea').each(function(idx, item){
        //        var id = $(item).attr('id').replace('textarea_', '');
        //        var unit = $(item).attr('data-unit');
        //        var weight = $(item).attr('data-weight');
        //        var level = $(item).attr('data-level');
        //        var base_score = $(item).attr('data-base_score');
        //        var name = $(item).attr('data-name');
        //        var according = $(item).attr('data-according');
        //        var desc = '';
        //        var tmp  = _.find($.webgis.data.bbn.unitsub_template_2009, {unit:unit});
        //        if(_.isUndefined(tmp))
        //        {
        //            var o = {unit:unit, children:[]};
        //            o.children.push({
        //                weight:weight,
        //                level:level,
        //                base_score:base_score,
        //                name:name,
        //                according:according,
        //                desc:desc,
        //                total_score:parseInt(weight) * parseInt(base_score),
        //                p0:{I:0, II:0, III:0, IV:0}
        //            });
        //            $.webgis.data.bbn.unitsub_template_2009.push(o);
        //        }else{
        //            var iidx = _.findIndex($.webgis.data.bbn.unitsub_template_2009, 'unit', unit);
        //            tmp.children.push({
        //                weight:weight,
        //                level:level,
        //                base_score:base_score,
        //                name:name,
        //                according:according,
        //                desc:desc,
        //                total_score:parseInt(weight) * parseInt(base_score),
        //                p0:{I:0, II:0, III:0, IV:0}
        //            });
        //            $.webgis.data.bbn.unitsub_template_2009[iidx] = tmp;
        //        }
        //    });
        //}else{
        if(!_.isUndefined(data)){
            _.forEach(data, function(item){
                 $('#form_unitsub_stand_2009').find('#textarea_' + item.id).val(item.desc);
                 $('#form_unitsub_stand_2009').find('#totalscore_' + item.id).html(item.weight * item.base_score);
            });
        }
    };
    var event_other_sel_bind = function(){
        $('#form_unitsub_stand_2009').find('select').off();
        $('#form_unitsub_stand_2009').find('select').on('change', function(e){
            var id = $(e.target).attr('id');
            var total_score = 0;
            var desc = $(e.target).closest('tr').find('textarea[id$=_other]').val();
            //console.log(id);
            if(desc.length > 0)
            {
                if (_.startsWith(id, 'other_weight_sel_')) {
                    var weight = $(e.target).val();
                    var base_score = $(e.target).closest('tr').find('select[id^=other_basescore_sel_]').val();
                    total_score = parseInt(weight) * parseInt(base_score);
                }
                if (_.startsWith(id, 'other_basescore_sel_')) {
                    var weight = $(e.target).closest('tr').find('select[id^=other_weight_sel_]').val();
                    var base_score = $(e.target).val();
                    //console.log(weight + 'x' + base_score);
                    total_score = parseInt(weight) * parseInt(base_score);
                }
                //console.log(total_score);
                $(e.target).closest('tr').find('p[id^=totalscore_]').html(total_score);
            }else{
                $(e.target).closest('tr').find('p[id^=totalscore_]').html('');

            }
        });
    };
    var bind_event = function(){
        event_other_sel_bind();
        $('#form_unitsub_stand_2009').find('textarea').off();

        $('#form_unitsub_stand_2009').find('textarea').on('keyup change', function(e){
            var unit = $(e.target).attr('data-unit');
            var weight = $(e.target).attr('data-weight');
            var level = $(e.target).attr('data-level');
            var base_score = $(e.target).attr('data-base_score');
            var name = $(e.target).attr('data-name');
            var according = $(e.target).attr('data-according');
            var desc = $(e.target).val();
            var total_score = 0;
            if(_.trim(desc).length>0 && _.trim(desc) != '无' && _.trim(desc) != '(无)' && _.trim(desc) != '（无）'){
                if(weight.length === 0 || base_score.length === 0){
                    weight = $(e.target).closest('tr').find('select[id^=other_weight_sel_]').val();
                    base_score = $(e.target).closest('tr').find('select[id^=other_basescore_sel_]').val();
                }
                total_score = parseInt(weight) * parseInt(base_score);
            }else{
                total_score = 0;
            }
            //console.log(total_score);
            var total_score_accmulate = 0;
            var total_desc = [];
            $('#form_unitsub_stand_2009').find('textarea').each(function(idx, item){
                var un = $(item).attr('data-unit');
                var desc1 = $(item).val();
                var weight1 = $(item).attr('data-weight');
                var base_score1 = $(item).attr('data-base_score');
                if(weight1.length === 0 || base_score1.length === 0){
                    weight1 = $(item).closest('tr').find('select[id^=other_weight_sel_]').val();
                    base_score1 = $(item).closest('tr').find('select[id^=other_basescore_sel_]').val();
                }
                var total_score1 = parseInt(weight1) * parseInt(base_score1);
                if(un === unit){
                    if(_.trim(desc1).length>0 && _.trim(desc1) != '无' && _.trim(desc1) != '(无)' && _.trim(desc1) != '（无）'){
                        total_score_accmulate += total_score1;
                    }
                }
                if(_.trim(desc1).length>0 && _.trim(desc1) != '无' && _.trim(desc1) != '(无)' && _.trim(desc1) != '（无）'){
                    total_desc.push(desc1);
                }
            });
            //console.log('unit:' + unit + ', total_score:' + total_score + ', total_score_accmulate:' + total_score_accmulate);
            var t = CalcUnitLevelByScore2009(unit, total_score, total_score_accmulate);

            if(_.trim(desc).length === 0){
                $(e.target).closest('tr').find('p[id^=totalscore_]').html('');
            }else{
                $(e.target).closest('tr').find('p[id^=totalscore_]').html(total_score);
            }
            if(total_score_accmulate>0){
                $('#form_unitsub_stand_2009').find('#finaltext_' + unit).html(t);
            }else{
                $('#form_unitsub_stand_2009').find('#finaltext_' + unit).html('');
            }
            //console.log(unit);
            //console.log(total_score_accmulate);
            //console.log(t);
            if(t === '正常'){
                $('#form_state_examination_import_single_' + unit).multipleSelect('setSelects', ['I']);
            }
            if(t === '注意'){
                $('#form_state_examination_import_single_' + unit).multipleSelect('setSelects', ['II']);
            }
            if(t === '异常'){
                $('#form_state_examination_import_single_' + unit).multipleSelect('setSelects', ['III']);
            }
            if(t === '严重'){
                $('#form_state_examination_import_single_' + unit).multipleSelect('setSelects', ['IV']);
            }
            $('#form_state_examination_import_single_unitsub_desc').val(total_desc.join(';'));
        });
        $('#btn_unitsub_import').off();
        $('#btn_unitsub_import').on('click', function(e){
            $('#btn_unitsub_import_file_path').html('');
            $('#btn_unitsub_import_file').val('');
            $('#btn_unitsub_import_file').trigger('click');
        });
        $('#btn_unitsub_import_file').off();
        $('#btn_unitsub_import_file').on('change', function(e){
            var  to_json = function(workbook) {
                var result = [];
                workbook.SheetNames.forEach(function(sheetName) {
                    var roa = XLS.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    if(roa.length > 0){
                        result.push({sheet_name:sheetName, sheet_data:roa});
                    }
                });
                return result;
            };
            var files = e.target.files;
            var f = files[0];
            var reader = new FileReader();
            if(f && f.name)
            {
                if(!_.endsWith(f.name, '.xls'))
                {
                    $('#btn_unitsub_import_file_path').html('');
                    ShowMessage(null, 400, 220, '出错了', '仅支持Excel97-2003格式(.xls),如果是(.xlsx)，请转换为(.xls)');
                    return;
                }
                $('#btn_unitsub_import_file_path').html(f.name);
                var name = f.name;
                //console.log(name);
                reader.onload = function (e) {
                    var data = e.target.result;
                    var wb = XLS.read(data, {type: 'binary'});
                    var sheets = to_json(wb);
                    var sheet_data = sheets[0].sheet_data;
                    $.webgis.data.bbn.xls_template_2009_id_mapping = [];
                    var xlsidx = 0;
                    _.forEach($.webgis.data.bbn.unitsub_template_2009, function(item) {
                        if(xlsidx>0){
                            xlsidx += 1;
                        }
                        _.forEach(item.children, function(item1) {
                            $.webgis.data.bbn.xls_template_2009_id_mapping.push({id:item1.id, idx:xlsidx});
                            xlsidx += 1;
                        });
                    });
                    //console.log( $.webgis.data.bbn.xls_template_2009_id_mapping);
                    _.forEach(sheet_data, function(item){
                        var idx = _.indexOf(sheet_data, item);
                        if(!_.isUndefined(item.劣化情况描述))
                        {
                            var id = _.result(_.find($.webgis.data.bbn.xls_template_2009_id_mapping, {idx: idx}), 'id');
                            if (!_.isUndefined(id)) {
                                id = 'textarea_' + id;
                                $('#form_unitsub_stand_2009 #' + id).val(_.trim(item.劣化情况描述));
                                $('#form_unitsub_stand_2009 #' + id).trigger('change');
                            }
                        }
                    });
                };
                reader.readAsBinaryString(f);
            }
        });
    };

    CreateDialogSkeleton(viewer, 'dlg_unitsub_standard2009');
    $('#dlg_unitsub_standard2009').dialog({
        width: 890,
        height: 500,
        minWidth:200,
        minHeight: 200,
        draggable: true,
        resizable: true,
        modal: false,
        position:{at: "center"},
        title:'劣化情况详细描述(标准2009)',
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
                text: "确定",
                click: function(e){
                    $.webgis.data.state_examination.record_single_form = $('#form_state_examination_import_single').webgisform('getdata');
                    $.webgis.data.state_examination.record_single_form.line_state = GetMaxlvl($.webgis.data.state_examination.record_single_form);
                    $('#form_state_examination_import_single_line_state').multipleSelect('setSelects', [$.webgis.data.state_examination.record_single_form.line_state]);

                    $( this ).dialog( "close" );
                }
            },
            {
                text: "关闭",
                click: function(e){
                    //$.webgis.data.state_examination.record_single_form.list = [];
                    $( this ).dialog( "close" );
                }
            }
        ]
    });


    $.ajax({
        url: '/webgis_standard2009_form.html',
        method: 'get',
        dataType: 'html'
    })
    .done(function(page){
        load_html(page);
    })
    .fail(function (jqxhr, textStatus, e) {
        $.jGrowl("载入模板[/webgis_standard2009_form.html]失败:" + e, {
            life: 2000,
            position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
            theme: 'bubblestylefail',
            glue:'before'
        });
    });
}

function SaveStateExaminationMultiple(viewer)
{
    ShowConfirm(null, 500, 200,
        '保存确认',
        '确认保存吗? 确认的话数据将会提交到服务器上，以便所有人都能看到修改的结果。',
        function () {
            $.webgis.data.state_examination.import_data = BindExistLineId($.webgis.data.state_examination.import_data);
            //console.log($.webgis.data.state_examination.import_data);
            SaveStateExamination(viewer, $.webgis.data.state_examination.import_data, function(){
                $.ajax({
                    url:'/state_examination/query',
                    method:'post',
                    data: JSON.stringify({})
                })
                .always(function () {
                    ShowProgressBar(false);
                })
                .done(function (data1) {
                    data1 = JSON.parse(data1);
                    $.webgis.data.state_examination.list_data = data1;
                });
            });
        },
        function () {
            $('#').dialog("close");
        }
    );
}
function BindExistLineId(data)
{
    if(typeof data === 'string'){
        if(_.isUndefined(data.line_id) || _.isEmpty(data.line_id) || _.isNull(data.line_id))
        {
            var line_id = _.result(_.find($.webgis.data.lines, _.matchesProperty('properties.name', data.line_name)), '_id');
            if (line_id) {
                data.line_id = line_id;
            }
        }
    }
    if (data instanceof Array){
        //console.log($.webgis.data.lines);
        var data1 = _.map(data, function(item){
            if(_.isUndefined(item.line_id) || _.isEmpty(item.line_id) || _.isNull(item.line_id))
            {
                var line_id = _.result(_.find($.webgis.data.lines, _.matchesProperty('properties.name', item.line_name)), '_id');
                if (line_id) {
                    item.line_id = line_id;
                }
            }
            return item;
        });
        data = data1;
    }
    return data;
}

function SaveStateExamination(viewer, data, success, fail)
{
    var checkyear_int = function(checkyear){
        var ret = checkyear;
        if(_.isUndefined(ret)){
            ret = 0;
        }
        else if(_.isEmpty(ret)){
            ret = 0;
        }
        else if(_.isNull(ret)){
            ret = 0;
        }
        else if(_.isString(ret)) {
            ret = parseInt(ret.replace('年', ''));
        }
        return ret;
    };
    var data_modifier = function(data){
        var v = $.webgis.data.codes['voltage_level'][data.voltage];
        if(v) data.voltage = v.replace('交流', '');
        data = BindExistLineId(data);
        if(_.isObject(data)){
            data.check_year = checkyear_int(data.check_year);
            data.line_state = GetMaxlvl(data);
        }
        if(_.isArray(data)) {
            data = _.map(data, function(item){
                item.check_year = checkyear_int(item.check_year);
                item.line_state = GetMaxlvl(item);
                return item;
            });
        }
        return data;
    };
    data = data_modifier(data);
    //console.log(data);
    //return;
    ShowProgressBar(true, 670, 200, '保存', '正在保存，请稍候...');
    $.ajax({
        url:'/state_examination/save',
        method:'post',
        data: JSON.stringify(data)
    })
    .always(function () {
        ShowProgressBar(false);
    })
    .done(function (data1) {
        if(data1.result) {
            $.jGrowl("保存失败:" + data1.result, {
                life: 2000,
                position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                theme: 'bubblestylefail',
                glue:'before'
            });
            if(fail) fail();
        }else{
            $.jGrowl("保存成功", {
                life: 2000,
                position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                theme: 'bubblestylesuccess',
                glue: 'before'
            });
            if(success) success();
        }
    })
    .fail(function (jqxhr, textStatus, e) {
        $.jGrowl("保存失败:" + e, {
            life: 2000,
            position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
            theme: 'bubblestylefail',
            glue:'before'
        });
        if(fail) fail();
    });
}
function SaveStateExaminationSingle(viewer)
{
    var get_unit = function(uuu){
        return uuu.substr(0, 6);
    };
    var get_item = function(alist, id)
    {
        var ret;
        var findit = false;
        _.forEach(alist, function(item){
            _.forEach(item.children, function(item1){
                if( item1.id === id){
                    ret = item1;
                    findit = true;
                    return;
                }
            });
            if(findit){
                return;
            }
        });
        return ret;
    };
    if($('#form_state_examination_import_single').valid()) {
        ShowConfirm(null, 500, 200,
            '保存确认',
            '确认保存吗? 确认的话数据将会提交到服务器上，以便所有人都能看到修改的结果。',
            function () {
                $.webgis.data.state_examination.record_single_form = $('#form_state_examination_import_single').webgisform('getdata');
                var unitsub_desc_org = $('#form_state_examination_import_single_unitsub_desc').val();
                if(unitsub_desc_org.length>0 && _.trim(unitsub_desc_org)!='无' && _.trim(unitsub_desc_org)!='(无)' && _.trim(unitsub_desc_org)!='（无）')
                {
                    $.webgis.data.state_examination.record_single_form.description = unitsub_desc_org;
                }else{
                    $.webgis.data.state_examination.record_single_form.description =  $.webgis.data.state_examination.record_single_form.unitsub_desc;
                }
                delete $.webgis.data.state_examination.record_single_form.unitsub_desc;
                var check_is_2014 = $.webgis.data.state_examination.record_single_form.check_is_2014;
                //delete $.webgis.data.state_examination.record_single_form.check_is_2014;
                var list = [];
                var formid = '';
                if(check_is_2014){
                    formid = 'form_unitsub_stand_2014';
                }else{
                    formid = 'form_unitsub_stand_2009';
                }
                $('#' + formid).find('textarea').each(function(idx, item){
                    var id = $(item).attr('id').replace('textarea_', '');
                    var it;
                    var un;
                    if(check_is_2014)
                    {
                        un = get_unit(id);
                        it = get_item($.webgis.data.bbn.unitsub_template_2014, id);
                    }else{
                        un = $(item).attr('data-unit');
                    }
                    var desc1 = $(item).val();
                    var weight1;
                    if(check_is_2014){
                        weight1 = it.weight;
                    }else{
                        weight1 = $(item).attr('data-weight');
                    }
                    var base_score1;
                    if(check_is_2014){
                        base_score1 = it.base_score;
                    }else{
                        base_score1 = $(item).attr('data-base_score');
                    }
                    var name1;
                    if(check_is_2014){
                        name1 = it.name;
                    }else{
                        name1 = $(item).attr('data-name');
                    }

                    if(!check_is_2014)
                    {
                        if(weight1.length === 0){
                            weight1 = $(item).closest('tr').find('select[id^=other_weight_sel_]').val();
                        }
                        if(base_score1.length === 0){
                            base_score1 = $(item).closest('tr').find('select[id^=other_basescore_sel_]').val();
                        }
                    }
                    //if(check_is_2014){
                    //    id = 'unitsub_' + id;
                    //}
                    if(_.trim(desc1).length>0 && _.trim(desc1) != '无' && _.trim(desc1) != '(无)' && _.trim(desc1) != '（无）'){
                        list.push({id:id, unit:un, name:name1, desc:desc1, weight:parseInt(weight1), base_score:parseInt(base_score1) });
                    }
                });
                $.webgis.data.state_examination.record_single_form.unitsub = list;
                //if(check_is_2014){
                //    $.webgis.data.state_examination.record_single_form.check_is_2014 = true;
                //}

                //console.log($.webgis.data.state_examination.record_single_form);
                ////if(_.isString($.webgis.data.state_examination.record_single_form.check_year)){
                ////    $.webgis.data.state_examination.record_single_form.check_year = parseInt($.webgis.data.state_examination.record_single_form.check_year);
                ////}
                //return;
                SaveStateExamination(viewer, $.webgis.data.state_examination.record_single_form, function(){
                    $.ajax({
                        url:'/state_examination/query',
                        method:'post',
                        data: JSON.stringify({})
                    })
                    .always(function () {
                        ShowProgressBar(false);
                    })
                    .done(function (data1) {
                        data1 = JSON.parse(data1);
                        $.webgis.data.state_examination.list_data = data1;
                    });
                });
            },
            function () {
                $('#').dialog("close");
            }
        );
    }
}
function ClearEdges2D(viewer, webgis_type)
{
    viewer.eachLayer(function (layer) {
        if(layer.name && layer.name.indexOf( webgis_type)>-1)
        {
            viewer.removeLayer(layer);
        }
    });
    $.webgis.geometry.segments.length = 0;
}


function AddEdgeBetweenTwoNode2D(viewer, webgis_type, start_obj, end_obj, isfresh)
{
    if(CheckSegmentsExist(start_obj, end_obj, webgis_type))
    {
        return;
    }
    
    //var polylinelayer;
    //viewer.eachLayer(function (layer) {
        //if(layer.name && layer.name === webgis_type)
        //{
            //polylinelayer = layer;
            //return;
        //}
    //});
    if(webgis_type === undefined)
    {
        return;
    }
    var pair = DrawEdgeBetweenTwoNode(viewer, webgis_type, start_obj['_id'], end_obj['_id'], isfresh);
    if(pair)
    {
        var o = {};
        o['_id'] = 'tmp_edge';
        o['type'] = 'Feature';
        o['properties'] = {webgis_type:webgis_type,start:start_obj['_id'], end:end_obj['_id']};
        var color = ColorArrayToHTMLColor([200,200,0,1]);
        if(isfresh)
        {
            color = ColorArrayToHTMLColor([255,255,0,1]);
        }
        var polyline = L.polyline(pair, {
            color: color,
            weight:5,
            fillOpacity:1.0,
            clickable:true
        });
        polyline.geojson = o;            
        var edgeobj = GetEdgeLeafletByWebgisType(viewer, webgis_type, polyline);
        if(edgeobj.exist)
        {
            edgeobj.polyline.addLayer(polyline);
            edgeobj.arrow._paths.push(pair);
            edgeobj.arrow.setPaths(edgeobj.arrow._paths);
        }
    }
}

function UpdateEdges2D(viewer, webgis_type)
{
    var pairlist = [];
    _.forEach($.webgis.data.geojsons, function(item)
    {
        if(item.properties && item.properties.start && item.properties.end)
        {
            var pair = DrawEdgeBetweenTwoNode(viewer, webgis_type, item.properties.start, item.properties.end, false);
            if(pair)
            {
                pair.push(item);
                pairlist.push(pair);
            }
        }
    });
    
    if(pairlist.length>0)
    {
        //ClearEdges2D(viewer, webgis_type);
        var polylinelist = [];
        var pairlist1 = [];
        _.forEach(pairlist, function(item)
        {
            var pair = [item[0], item[1]];
            pairlist1.push(pair);
            var polyline = L.polyline(pair, {
                color: 'yellow',
                weight:5,
                fillOpacity:1.0,
                clickable:true
            });
            polyline.geojson = item[2];
            polylinelist.push(polyline);
        });
        
        if(polylinelist.length>0)
        {
            var edgeobj = GetEdgeLeafletByWebgisType(viewer, webgis_type, polylinelist[0]);
            for(var i in polylinelist)
            {
                if(i === 0 && !edgeobj.exist) continue;
                edgeobj.polyline.addLayer(polylinelist[i]);
            }
            edgeobj.arrow.setPaths(pairlist1);
        }
    }
    
}


function GetEdgeLeafletByWebgisType(viewer, webgis_type, initpolyline)
{
    var lyr_polylinegroup, lyr_arrow;
    viewer.eachLayer(function (layer) {
        if(layer.name && layer.name === webgis_type)
        {
            lyr_polylinegroup = layer;
            return;
        }
    });
    viewer.eachLayer(function (layer) {
        if(layer.name && layer.name === webgis_type + '_arrow')
        {
            lyr_arrow = layer;
            return;
        }
    });
    var exist = true;
    if(lyr_polylinegroup === undefined)
    {
        exist = false;
        var lyr_polylinegroup =  L.featureGroup([initpolyline]);
        lyr_polylinegroup.name = webgis_type;
        
        lyr_polylinegroup.on('click', function(e){
            ClearSelectColor2D(viewer);
            if($.webgis.select.selected_obj)
            {
                $.webgis.select.prev_selected_obj = $.webgis.select.selected_obj;
            }
            $.webgis.select.selected_obj = {};
            $.webgis.select.selected_obj.id = e.layer.geojson;
            console.log('edge:' + e.layer.geojson._id);
            $.webgis.mapping.leaflet_old_style[e.layer.geojson._id] = {color:e.layer.options.color, weight:e.layer.options.weight};
            e.layer.setStyle({color : 'green', weight:10});
            OnSelect(viewer, null);
        });        
        lyr_polylinegroup.addTo(viewer);
    }
    if(lyr_arrow === undefined)
    {
        exist = false;
        lyr_arrow = L.polylineDecorator([initpolyline], {
            patterns: [
                {offset: 100, repeat: 100, symbol: L.Symbol.arrowHead({pixelSize: 15, pathOptions: {fillOpacity: 1, weight: 0}})}
            ]
        });
        lyr_arrow.name = webgis_type + '_arrow';
        lyr_arrow.addTo(viewer);
    }
    return {polyline:lyr_polylinegroup, arrow:lyr_arrow, exist:exist};
}

function CreateDialogSkeleton(viewer, dlg_id)
{
    if($('#' + dlg_id).length === 0)
    {
        if (dlg_id === 'dlg_antibird_birdfamily') {
            $(document.body).append('\
            <div id="dlg_antibird_birdfamily" >\
                <div id="div_container_anti_bird_birdfamily_pics"></div>\
            </div>');
        }
        if (dlg_id === 'dlg_user_management') {
            $(document.body).append('\
            <div id="dlg_user_management" >\
                <form id="form_user_management"></form>\
            </div>');
        }
        if (dlg_id === 'dlg_role_management') {
            $(document.body).append('\
            <div id="dlg_role_management" >\
                <form id="form_role_management"></form>\
            </div>');
        }
        if (dlg_id === 'dlg_anti_bird_info') {
            $(document.body).append('\
                <div id="dlg_anti_bird_info"  >\
                    <div id="tabs_anti_bird_info">\
                        <ul>\
                            <li><a href="#anti_bird_info_pics">拍摄图片</a></li>\
                            <li><a href="#anti_bird_info_chart">统计图表</a></li>\
                        </ul>\
                        <div id="anti_bird_info_pics">\
                            <div id="div_anti_bird_info_pics">\
                            </div>\
                        </div>\
                        <div id="anti_bird_info_chart">\
                            <form id="form_anti_bird_info_chart">\
                            </form>\
                            <div id="div_anti_bird_info_chart"></div>\
                        </div>\
                    </div>\
                </div>\
            ');
        }
        if (dlg_id === 'dlg_anti_bird_statistics')
        {
            $(document.body).append('\
                <div id="dlg_anti_bird_statistics" >\
                    <div id="tabs_anti_bird_statistics">\
                        <ul>\
                            <li><a href="#anti_bird_statistics_towerlist">设备列表</a></li>\
                            <li><a href="#anti_bird_statistics_chart">统计图表</a></li>\
                            <li><a href="#anti_bird_statistics_heatmap">地理热度图</a></li>\
                            <li><a href="#anti_bird_statistics_birdmoveroute">鸟类迁徙区域</a></li>\
                        </ul>\
                        <div id="anti_bird_statistics_towerlist">\
                            <div id="div_anti_bird_statistics_towerlist_treegrid"></div>\
                        </div>\
                        <div id="anti_bird_statistics_chart">\
                            <form id="form_anti_bird_statistics_chart">\
                            </form>\
                            <div id="div_anti_bird_statistics_chart"></div>\
                        </div>\
                        <div id="anti_bird_statistics_heatmap">\
                            <form id="form_anti_bird_statistics_heatmap">\
                            </form>\
                        </div>\
                    </div>\
                </div>\
            ');
        }
        if(dlg_id === 'dlg_anti_bird_statistics_result')
        {
            $(document.body).append('\
                <div id="dlg_anti_bird_statistics_result" >\
                    <div id="tabs_anti_bird_statistics_result">\
                        <ul>\
                            <li><a href="#anti_bird_statistics_result_table">统计表</a></li>\
                            <li><a href="#anti_bird_statistics_result_chart">统计图</a></li>\
                        </ul>\
                        <div id="anti_bird_statistics_result_table">\
                            <div id="div_anti_bird_statistics_result_table"></div>\
                        </div>\
                        <div id="anti_bird_statistics_result_chart">\
                            <div id="div_anti_bird_statistics_result_chart"></div>\
                        </div>\
                    </div>\
                </div>\
            ');
        }
        if(dlg_id === 'dlg_state_examination_import'){
            $(document.body).append('\
                <div id="dlg_state_examination_import" >\
                    <div id="tabs_state_examination_import">\
                        <ul>\
                            <li><a href="#div_state_examination_import_single">单条输入</a></li>\
                            <li><a href="#div_state_examination_import_multiple">批量导入</a></li>\
                        </ul>\
                        <div id="div_state_examination_import_single">\
                            <form id="form_state_examination_import_single"></form>\
                        </div>\
                        <div id="div_state_examination_import_multiple">\
                            <form id="form_state_examination_import_multiple"></form>\
                        </div>\
                    </div>\
                </div>\
            ');
        }
        if(dlg_id === 'dlg_state_examination_standard')
        {
            $(document.body).append('\
                <div id="dlg_state_examination_standard" >\
                    <form id="form_state_examination_standard"></form>\
                </div>\
            ');
        }
        if(dlg_id === 'dlg_state_examination_standard2014')
        {
            $(document.body).append('\
                <div id="dlg_state_examination_standard2014" >\
                    <form id="form_state_examination_standard2014"></form>\
                </div>\
            ');
        }
        if(dlg_id === 'dlg_state_examination_import_preview')
        {
            $(document.body).append('\
                <div id="dlg_state_examination_import_preview" >\
                    <div id="div_state_examination_import_preview_grid"></div>\
                </div>\
            ');
        }
        if(dlg_id === 'dlg_state_examination_list')
        {
            $(document.body).append('\
                <div id="dlg_state_examination_list" >\
                    <form id="form_state_examination_list_filter"></form>\
                    <div id="div_state_examination_list_grid_container">\
                        <div id="div_state_examination_list_grid">\
                        </div>\
                    </div>\
                </div>\
            ');
        }
        if(dlg_id === 'dlg_state_examination_bbn')
        {
            $(document.body).append('\
                <div id="dlg_state_examination_bbn" >\
                    <div-- id="tabs_state_examination_bbn">\
                        <ul>\
                            <li><a href="#div_state_examination_bbn_bbn">贝叶斯信度网(BBN)</a></li>\
                            <!--li><a href="#div_state_examination_bbn_bbn_view">概率节点编辑</a></li-->\
                            <li><a href="#div_state_examination_bbn_predict">分析预测</a></li>\
                        </ul>\
                        <div id="div_state_examination_bbn_bbn">\
                            <form id="form_state_examination_bbn_bbn"></form>\
                            <div id="div_state_examination_bbn_bbn_graphiz"></div>\
                        </div>\
                        <!--div id="div_state_examination_bbn_bbn_view">\
                            <form id="form_state_examination_bbn_bbn_view_grid"></form>\
                            <div id="div_state_examination_bbn_bbn_view_grid_container">\
                                <div id="div_state_examination_bbn_bbn_view_grid"></div>\
                            </div>\
                        </div-->\
                        <div id="div_state_examination_bbn_predict">\
                            <form id="form_state_examination_bbn_assume">\
                            <fieldset style="display: none;">\
                                <legend>先决条件</legend>\
                                <div id="div_state_examination_bbn_assume_selects">\
                                </div>\
                            </fieldset>\
                            <fieldset>\
                                <legend>线路名称</legend>\
                                <div class="form_state_examination_bbn_assume_line_name">请选择线路名称</div>\
                            </fieldset>\
                            <fieldset>\
                                <legend></legend>\
                                <label for="form_state_examination_bbn_assume_years">请选择预测年限:</label><select id="form_state_examination_bbn_assume_years" name="form_state_examination_bbn_assume_years"></select>\
                            </fieldset>\
                            <div style="height:20px;"></div>\
                            <fieldset>\
                                <div id="btn_state_examination_bbn_assume_predict">\
                                </div>\
                                <div id="btn_state_examination_bbn_assume_predict_export">\
                                </div>\
                                <div id="btn_state_examination_bbn_assume_predict_collapse">\
                                </div>\
                                <div id="btn_state_examination_bbn_assume_predict_summary">\
                                </div>\
                            </fieldset>\
                            </form>\
                            <p>&nbsp;<p>&nbsp;<p>\
                            <!--input id="cb_state_examination_bbn_assume_predict_display_0" type="checkbox"/>不显示0概率项-->\
                            <div id="div_state_examination_bbn_predict_grid_container">\
                                <div id="div_state_examination_bbn_predict_grid">\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            ');
        }
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
        if (dlg_id === 'dlg_state_examination_bbn_node_grid_node_add1')
        {
            $(document.body).append('\
            <div id="dlg_state_examination_bbn_node_grid_node_add1" >\
                <form id="form_state_examination_bbn_node_grid_node_add1"></form>\
            </div>');
        }
        if (dlg_id === 'dlg_state_examination_bbn_node_grid_condition_add')
        {
            $(document.body).append('\
            <div id="dlg_state_examination_bbn_node_grid_condition_add" >\
                <form id="form_state_examination_bbn_node_grid_condition_midify"></form>\
            </div>');
        }
        if (dlg_id === 'dlg_maintain_strategy_standard')
        {
                //<canvas id="canvas_maintain_strategy_standard"></canvas>\
            $(document.body).append('\
            <div id="dlg_maintain_strategy_standard" >\
                <iframe id="iframe_maintain_strategy_standard" src="/ViewerJS/index.html#/架空输电线路状态检修策略.pdf" allowfullscreen webkitallowfullscreen></iframe>\
            </div>');
        }
        if (dlg_id === 'dlg_state_examination_detail_doc')
        {
            $(document.body).append('\
            <div id="dlg_state_examination_detail_doc" >\
                <iframe id="iframe_state_examination_detail_doc" src="/ViewerJS/index.html#/南方电网公司35kV～500kV架空线路状态评价导则（试行）.pdf" allowfullscreen webkitallowfullscreen></iframe>\
            </div>');
        }
        if (dlg_id === 'dlg_state_examination_bbn_predict_summary')
        {
            $(document.body).append('\
            <div id="dlg_state_examination_bbn_predict_summary" >\
                <fieldset>\
                    <legend>概率预测走势图</legend>\
                    <div id="div_summary_graph_legend_container_container">\
                        <div id="div_summary_graph_area_container">\
                        <span class="area_high">&nbsp;&nbsp;&nbsp;&nbsp;</span>高风险&nbsp;&nbsp;\
                        <span class="area_medium">&nbsp;&nbsp;&nbsp;&nbsp;</span>中风险&nbsp;&nbsp;\
                        <span class="area_low">&nbsp;&nbsp;&nbsp;&nbsp;</span>低风险\
                        </div>\
                        <div id="div_summary_graph_sel_container">\
                            <label for="sel_summary_graph_type">请选择线路单元</label><select id="sel_summary_graph_type"></select>\
                        </div>\
                    </div>\
                    <p>\
                        <div class="div_chb_summary_graph_history" ><input type="checkbox" id="chb_summary_graph_history">显示历史统计概率</div>\
                    </p>\
                    <div id="div_state_examination_bbn_predict_summary_graph_container"  >\
                        <div id="div_state_examination_bbn_predict_summary_graph"  >\
                        </div>\
                        <div id="flotlegend"  >\
                        </div>\
                    </div>\
                </fieldset>\
                <form id="form_state_examination_bbn_predict_summary"></form>\
            </div>\
            ');
        }
        if (dlg_id === 'dlg_unitsub_standard2009')
        {
            $(document.body).append('\
            <div id="dlg_unitsub_standard2009" >\
            </div>');
        }
        if (dlg_id === 'dlg_unitsub_strategy2009')
        {
            $(document.body).append('\
            <div id="dlg_unitsub_strategy2009" >\
            </div>');
        }
        if (dlg_id === 'dlg_unitsub_standard2014')
        {
            $(document.body).append('\
            <div id="dlg_unitsub_standard2014" >\
            </div>');
        }
        if (dlg_id === 'dlg_unitsub_strategy2014')
        {
            $(document.body).append('\
            <div id="dlg_unitsub_strategy2014" >\
            </div>');
        }
    }
}

function ShowRoleManagement(viewer){
    var rolelist = [];
    var userlist = [];
    CreateDialogSkeleton(viewer, 'dlg_role_management');
    $('#dlg_role_management').dialog({
        width: 420,
        height: 360,
        minWidth:200,
        minHeight: 200,
        draggable: true,
        resizable: true,
        modal: false,
        position:{at: "center"},
        title:'角色管理',
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
                text: "新增",
                click: function(e){
                    $('#form_role_management_rolelist').multipleSelect("setSelects", []);
                    $('#form_role_management_name').val("");
                    $('#form_role_management_displayname').val("");
                    $('#form_role_management_users').multipleSelect("setSelects", []);
                }
            },
            {
                text: "删除",
                click: function(e){
                    var selectname = $('#form_role_management_rolelist').multipleSelect("getSelects", 'text');
                    var selectid = $('#form_role_management_rolelist').multipleSelect("getSelects");
                    if(selectid.length){
                        selectid = selectid[0];
                    }
                    ShowConfirm(null, 500, 200,
                        '删除确认',
                        '确认删除角色[' + selectname.join(',') + ']吗? ',
                        function () {
                            console.log('delete role:' + selectid);
                            DeleteRole(viewer, selectid, function(){
                                reload_role(function(list){
                                    rolelist = list;
                                    $('#form_role_management_rolelist').empty();
                                    $('#form_role_management_rolelist').append($('<option />', {
                                        'value': '',
                                        'text': '(请选择)'
                                    }));
                                    _.forEach(list, function(n){
                                        $('#form_role_management_rolelist').append( $('<option />',{'value': n._id, 'text': n.displayname}));
                                    });
                                    $('#form_role_management_rolelist').multipleSelect('refresh');
                                    $('#form_role_management_rolelist').multipleSelect("setSelects", []);
                                    $('#form_role_management_name').val("");
                                    $('#form_role_management_displayname').val("");
                                    $('#form_role_management_users').multipleSelect("setSelects", []);
                                });
                            });
                        },
                        function () {
                        }
                    );
                }
            },
            {
                text: "保存",
                click: function(e){
                    if($('#form_role_management').valid())
                    {
                        var data = $('#form_role_management').webgisform('getdata');
                        var id = $('#form_role_management_rolelist').multipleSelect("getSelects");
                        if(id.length){
                            data._id = id[0];
                        }else{
                            data._id = null;
                        }
                        delete data.rolelist;
                        console.log(data);

                        var that = this;
                        ShowConfirm(null, 500, 200,
                            '保存确认',
                            '确认保存该角色吗? ',
                            function(){
                                var cond ;
                                if(data._id){
                                    cond = {'db':$.webgis.db.db_name, 'collection':'sysrole', 'action':'update','data':{name:data.name, displayname:data.displayname, users:data.users}, '_id':data._id};
                                }else{
                                    data.permission = [];
                                    data.users = [];
                                    cond = {'db':$.webgis.db.db_name, 'collection':'sysrole', 'action':'save','data':data};
                                }
                                ShowProgressBar(true, 670, 200, '保存角色信息', '正在保存角色信息，请稍候...');
                                MongoFind(cond, function(data1){
                                    ShowProgressBar(false);
                                    $.jGrowl("保存成功", {
                                        life: 2000,
                                        position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                                        theme: 'bubblestylesuccess',
                                        glue:'before'
                                    });
                                    //if(!data._id) {
                                    reload_role(function (list) {
                                        rolelist = list;
                                        $('#form_role_management_rolelist').empty();
                                        $('#form_role_management_rolelist').append($('<option />', {
                                            'value': '',
                                            'text': '(请选择)'
                                        }));
                                        _.forEach(list, function (n) {
                                            $('#form_role_management_rolelist').append($('<option />', {
                                                'value': n._id,
                                                'text': n.displayname
                                            }));
                                        });
                                        $('#form_role_management_rolelist').multipleSelect('refresh');
                                        $('#form_role_management_rolelist').multipleSelect("setSelects", []);
                                        $('#form_role_management_name').val("");
                                        $('#form_role_management_displayname').val("");
                                        $('#form_role_management_users').multipleSelect("setSelects", []);
                                    });
                                    //}
                            });
                        },function(){
                        });
                    }
                }
            },
            {
                text: "关闭",
                click: function(e){
                    $( this ).dialog( "close" );
                }
            }
        ]
    });

    var reload_role = function(callback){
        ShowProgressBar(true, 670, 200, '获取角色信息', '正在获取角色信息，请稍候...');
        var cond = {'db':$.webgis.db.db_name, 'collection':'sysrole'};
        MongoFind(cond, function(data1){
            ShowProgressBar(false);
            if(data1.result){
                ShowMessage(null, 400, 250, '获取数据出错', data1.result);
            }else {
                var list = _.filter(data1, function(n){
                    return n.name != 'admin';
                });
                if(callback) callback(list);
            }
        });
    };
    var fill_form = function(id){
        if(!id){
            $('#form_role_management_name').val("");
            $('#form_role_management_displayname').val("");
        }
        var o = _.find(rolelist, {_id:id});
        if(o){
            _.forIn(o, function(v, k){
                if(k === 'name' || k === 'displayname' || k === 'users'){
                    if(k === 'name' || k === 'displayname') {
                        $('#form_role_management_' + k).val(v);
                    }
                    if(k === 'users'){
                        if(v && v.length) {
                            $('#form_role_management_users').multipleSelect("setSelects", v);
                        }else{
                            $('#form_role_management_users').multipleSelect("setSelects", []);
                        }
                    }
                }
            });
        }
    };
    var init_form = function(list) {
        list = _.filter(list, function(n){
            return n.name != 'admin';
        });
        var roles = _.map(list, function(n){
            return {value: n._id, label: n.displayname};
        });
        roles.unshift({value:'',label:'(请选择)'});
        var flds = [
            {
                display: "角色",
                id: "rolelist",
                newline: true,
                type: "select",
                editor: {data: roles},
                group: '角色列表',
                labelwidth: 130,
                width: 200,
                change: function (selected) {
                    fill_form(selected);
                }
            },
            {
                display: "角色名称",
                id: "name",
                newline: true,
                type: "text",
                group: '角色信息',
                labelwidth: 130,
                width: 200,
                validate: {required: true}
            },
            {
                display: "显示名称",
                id: "displayname",
                newline: true,
                type: "text",
                group: '角色信息',
                labelwidth: 130,
                width: 200,
                validate: {required: true}
            },
            {
                display: "用户列表",
                id: "users",
                newline: true,
                type: "multiselect",
                editor: {data: []},
                group: '角色信息',
                labelwidth: 130,
                width: 200,
                change: function (selected) {
                    fill_form(selected);
                }
            },
        ];
        $('#form_role_management').webgisform(flds, {
            //divorspan: "div",
            prefix: "form_role_management_",
            maxwidth: 370
            //margin:10,
            //groupmargin:10
        });
        ShowProgressBar(true, 670, 200, '获取用户信息', '正在获取用户信息，请稍候...');
        var cond = {'db':$.webgis.db.db_name, 'collection':'userinfo'};
        MongoFind(cond, function(data1){
            ShowProgressBar(false);
            if(data1.result){
                ShowMessage(null, 400, 250, '获取数据出错', data1.result);
            }else {
                userlist = _.filter(data1, function(n){
                    return n.username != 'admin';
                });
                $('#form_role_management_users').empty();
                _.forEach(userlist, function (n) {
                    $('#form_role_management_users').append($('<option />', {
                        'value': n._id,
                        'text': n.displayname
                    }));
                });
                $('#form_role_management_users').multipleSelect('refresh');
                $('#form_role_management_users').multipleSelect("setSelects", []);
            }
        });
    }
    reload_role(function(list){
        rolelist = list;
        init_form(rolelist);
    });

}
function ShowUserManagement(viewer)
{
    var userlist = [];
    CreateDialogSkeleton(viewer, 'dlg_user_management');
    $('#dlg_user_management').dialog({
        width: 420,
        height: 350,
        minWidth:200,
        minHeight: 200,
        draggable: true,
        resizable: true,
        modal: false,
        position:{at: "center"},
        title:'用户管理',
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
                text: "新增",
                click: function(e){
                    $('#form_user_management_userlist').multipleSelect("setSelects", []);
                    $('#form_user_management_username').val("");
                    $('#form_user_management_displayname').val("");
                }
            },
            {
                text: "删除",
                click: function(e){
                    var selectusername = $('#form_user_management_userlist').multipleSelect("getSelects", 'text');
                    var selectuserid = $('#form_user_management_userlist').multipleSelect("getSelects");
                    if(selectuserid.length){
                        selectuserid = selectuserid[0];
                    }
                    ShowConfirm(null, 500, 200,
                        '删除确认',
                        '确认删除用户[' + selectusername.join(',') + ']吗? ',
                        function () {
                            console.log('delete user:' + selectuserid);
                            DeleteUser(viewer, selectuserid, function(){
                                reload_user(function(list){
                                    userlist = list;
                                    $('#form_user_management_userlist').empty();
                                    $('#form_user_management_userlist').append($('<option />', {
                                        'value': '',
                                        'text': '(请选择)'
                                    }));
                                    _.forEach(list, function(n){
                                        $('#form_user_management_userlist').append( $('<option />',{'value': n._id, 'text': n.displayname}));
                                    });
                                    $('#form_user_management_userlist').multipleSelect('refresh');
                                    $('#form_user_management_userlist').multipleSelect("setSelects", []);
                                    $('#form_user_management_username').val("");
                                    $('#form_user_management_displayname').val("");
                                });
                            });
                        },
                        function () {
                        }
                    );
                }
            },
            {
                text: "保存",
                click: function(e){
                    if($('#form_user_management').valid())
                    {
                        var data = $('#form_user_management').webgisform('getdata');
                        var id = $('#form_user_management_userlist').multipleSelect("getSelects");
                        if(id.length){
                            data._id = id[0];
                        }else{
                            data._id = null;
                        }
                        delete data.userlist;
                        //console.log(data);

                        var that = this;
                        ShowConfirm(null, 500, 200,
                            '保存确认',
                            '确认保存该用户信息吗? ',
                            function(){
                                var cond ;
                                if(data._id){
                                    cond = {'db':$.webgis.db.db_name, 'collection':'userinfo', 'action':'update','data':{username:data.username, displayname:data.displayname}, '_id':data._id};
                                }else{
                                    data.password = '123';
                                    cond = {'db':$.webgis.db.db_name, 'collection':'userinfo', 'action':'save','data':data};
                                }
                                ShowProgressBar(true, 670, 200, '保存用户信息', '正在保存用户信息，请稍候...');
                                MongoFind(cond, function(data1){
                                    ShowProgressBar(false);
                                    $.jGrowl("保存成功", {
                                        life: 2000,
                                        position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                                        theme: 'bubblestylesuccess',
                                        glue:'before'
                                    });
                                    if(!data._id) {
                                        reload_user(function (list) {
                                            userlist = list;
                                            $('#form_user_management_userlist').empty();
                                            $('#form_user_management_userlist').append($('<option />', {
                                                'value': '',
                                                'text': '(请选择)'
                                            }));
                                            _.forEach(list, function (n) {
                                                $('#form_user_management_userlist').append($('<option />', {
                                                    'value': n._id,
                                                    'text': n.displayname
                                                }));
                                            });
                                            $('#form_user_management_userlist').multipleSelect('refresh');
                                            $('#form_user_management_userlist').multipleSelect("setSelects", []);
                                            $('#form_user_management_username').val("");
                                            $('#form_user_management_displayname').val("");
                                        });
                                    }
                            });
                        },function(){

                        });
                    }
                }
            },
            {
                text: "关闭",
                click: function(e){
                    $( this ).dialog( "close" );
                }
            }
        ]
    });
    var reload_user = function(callback){
        ShowProgressBar(true, 670, 200, '获取用户信息', '正在获取用户信息，请稍候...');
        var cond = {'db':$.webgis.db.db_name, 'collection':'userinfo'};
        MongoFind(cond, function(data1){
            ShowProgressBar(false);
            var list = [];
            if(data1.result){
                ShowMessage(null, 400, 250, '获取数据出错', data1.result);
            }else {
                list = _.filter(data1, function(n){
                    return n.username != 'admin';
                });
                if(callback) callback(list);
            }
        });
    };
    var fill_form = function(id){
        if(!id){
            $('#form_user_management_username').val("");
            $('#form_user_management_displayname').val("");
        }
        var o = _.find(userlist, {_id:id});
        if(o){
            _.forIn(o, function(v, k){
                if(k === 'username' || k === 'displayname' ){
                    $('#form_user_management_' + k).val(v);
                }
            });
        }
    };
    var init_form = function(list) {
        var users = _.map(list, function(n){
            return {value: n._id, label: n.displayname};
        });
        users.unshift({value:'',label:'(请选择)'});
        var flds = [
            {
                display: "用户",
                id: "userlist",
                newline: true,
                type: "select",
                editor: {data: users},
                group: '用户列表',
                labelwidth: 130,
                width: 200,
                change: function (selected) {
                    fill_form(selected);
                }
            },
            {
                display: "用户名称",
                id: "username",
                newline: true,
                type: "text",
                group: '用户信息',
                labelwidth: 130,
                width: 200,
                validate: {required: true}
            },
            {
                display: "显示名称",
                id: "displayname",
                newline: true,
                type: "text",
                group: '用户信息',
                labelwidth: 130,
                width: 200,
                validate: {required: true}
            }
        ];
        $('#form_user_management').webgisform(flds, {
            //divorspan: "div",
            prefix: "form_user_management_",
            maxwidth: 370
            //margin:10,
            //groupmargin:10
        });
    }
    reload_user(function(list){
        userlist = list;
        init_form(userlist);
    });
}

function ShowChangePassword(viewer)
{
    $('#dlg_change_password').dialog({
        width: 420,
        height: 320,
        minWidth:200,
        minHeight: 200,
        draggable: true,
        resizable: true, 
        modal: false,
        position:{at: "center"},
        title:'修改密码',
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
                text: "确定", 
                click: function(e){
                    if($('#form_change_password').valid())
                    {
                        var data = $('#form_change_password').webgisform('getdata');
                        if(data.password_new != data.password_new1)
                        {
                            $.jGrowl("两次输入的新密码不一致,请检查", { 
                                life: 2000,
                                position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                                theme: 'bubblestylefail',
                                glue:'before'
                            });
                            return;
                        }
                        var that = this;
                        var userid;
                        if($.webgis.current_userinfo.username === 'admin')
                        {
                            var l = $('#form_change_password_userlist').multipleSelect('getSelects');
                            if(l.length){
                                userid = l[0];
                            }
                        }
                        else
                        {
                            userid = $.webgis.current_userinfo._id;
                            if(data.password_old != $.webgis.current_userinfo.password)
                            {
                                $.jGrowl("旧密码不正确,请检查", { 
                                    life: 2000,
                                    position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                                    theme: 'bubblestylefail',
                                    glue:'before'
                                });
                                return;
                            }
                        }
                        if(userid && userid.length>0)
                        {
                            ShowConfirm(null, 500, 200,
                                '保存确认',
                                '确认保存新修改的密码吗? ',
                                function(){
                                    var cond = {'db':$.webgis.db.db_name, 'collection':'userinfo', 'action':'update','data':{'password':data.password_new}, '_id':userid};
                                    ShowProgressBar(true, 670, 200, '保存用户信息', '正在保存用户信息，请稍候...');
                                    MongoFind(cond, function(data1){
                                        ShowProgressBar(false);
                                        $.jGrowl("保存成功", { 
                                            life: 2000,
                                            position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                                            theme: 'bubblestylesuccess',
                                            glue:'before'
                                        });
                                        $( that ).dialog( "close" );
                                });
                            },function(){
                                $( that ).dialog( "close" );
                            });
                        }else
                        {
                            $.jGrowl("请选择用户名", { 
                                life: 2000,
                                position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                                theme: 'bubblestylefail',
                                glue:'before'
                            });
                        }
                    }
                }
            },
            {     
                text: "关闭", 
                click: function(e){
                    $( this ).dialog( "close" );
                }
            }
        ]
    });
    var flds;
    if($.webgis.current_userinfo.username === 'admin')
    {
        var cond = {'db':$.webgis.db.db_name, 'collection':'userinfo'};
        ShowProgressBar(true, 670, 200, '获取用户信息', '正在获取用户信息，请稍候...');
        MongoFind(cond, function(data1){
            ShowProgressBar(false);
            var userlist = [];
            userlist = _.map(data1, function(n){
                return {value: n._id, label: n.displayname};
            });
            userlist.unshift({value:'', label: '(请选择)'});
            flds = [
                { display: "选择用户", id: "userlist", newline: true,  type: "select", editor:{data:userlist}, group:'用户信息', labelwidth:130, width:200,
                    change:function(selected){
                        var user = _.find(data1, {_id:selected});
                        if(user){
                            $('#form_change_password').webgisform('set', 'password_old', user.password);
                            var password_old = $('#form_change_password').webgisform('get', 'password_old');
                            //console.log(password_old[0]);
                            $(password_old[0]).focus(function(){
                                this.type = "text";
                            }).blur(function(){
                                this.type = "password";
                            })
                        }
                    }
                },
                { display: "旧密码", id: "password_old", newline: true,  type: "password",  group:'用户信息', labelwidth:130, width:200, validate:{required:true}},
                { display: "新密码", id: "password_new", newline: true,  type: "password",  group:'用户信息', labelwidth:130, width:200, validate:{required:true}},
                { display: "确认新密码", id: "password_new1", newline: true,  type: "password",  group:'用户信息', labelwidth:130, width:200, validate:{required:true}},
            ];
            $('#form_change_password').webgisform(flds, {
                    //divorspan: "div",
                    prefix: "form_change_password_",
                    maxwidth: 370
                    //margin:10,
                    //groupmargin:10
            });
        });
        
    }else
    {
        flds = [
            {display: "旧密码", id: "password_old", newline: true,  type: "password",  group:'用户信息', labelwidth:130, width:200, validate:{required:true}},
            {display: "新密码", id: "password_new", newline: true,  type: "password",  group:'用户信息', labelwidth:130, width:200, validate:{required:true}},
            {display: "确认新密码", id: "password_new1", newline: true,  type: "password",  group:'用户信息', labelwidth:130, width:200, validate:{required:true}},
        ];
        $('#form_change_password').webgisform(flds, {
            //divorspan: "div",
            prefix: "form_change_password_",
            maxwidth: 370
            //margin:10,
            //groupmargin:10
        });
    }
}

function ShowRoleControl(viewer)
{
    $('#dlg_change_role').dialog({
        width: 420,
        height: 570,
        minWidth:200,
        minHeight: 200,
        draggable: true,
        resizable: true, 
        modal: false,
        position:{at: "center"},
        title:'权限设定',
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
                text: "确定", 
                click: function(e){
                    var that = this;
                    if($('#form_change_role').valid())
                    {
                        ShowConfirm(null, 500, 200,
                            '保存确认',
                            '确认保存该角色权限设置吗? ',
                            function(){
                                var data = $('#form_change_role').webgisform('getdata');
                                if(data['roleid'] && data['roleid'].length>0)
                                {
                                    var cond = {'db':$.webgis.db.db_name, 'collection':'sysrole', 'action':'update','data':{'users':data['users'], 'permission':get_permission()}, '_id':data['roleid']};
                                    //console.log(cond);
                                    ShowProgressBar(true, 670, 200, '保存权限信息', '正在保存权限信息，请稍候...');
                                    MongoFind(cond, function(data1){
                                        ShowProgressBar(false);
                                        $.jGrowl("保存成功", { 
                                            life: 2000,
                                            position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                                            theme: 'bubblestylesuccess',
                                            glue:'before'
                                        });
                                        $( that ).dialog( "close" );
                                    });
                                }else
                                {
                                    $.jGrowl("请选择权限名", { 
                                        life: 2000,
                                        position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                                        theme: 'bubblestylefail',
                                        glue:'before'
                                    });
                                }
                        });
                    }
                }
            },
            {     
                text: "关闭", 
                click: function(e){
                    $( this ).dialog( "close" );
                }
            }
        ]
    });
    var get_permission = function()
    {
        var ret = [];
        $('input[id^=form_change_role_role_functions_]').each( function(i, ele){
            if($(ele).is(':checked'))
            {
                ret.push($(ele).attr('id').replace('form_change_role_role_functions_',''));
            }
        });
        return ret;
    };
    var update_form = function()
    {
        //var userlist = [];
        var rolelist = [];
        //var cond = {'db':$.webgis.db.db_name, 'collection':'userinfo'};
        var cond = {'db':$.webgis.db.db_name, 'collection':'sysrole'};
        ShowProgressBar(true, 670, 200, '获取权限信息', '正在获取权限信息，请稍候...');
        MongoFind(cond, function(data1){
            ShowProgressBar(false);
            if(data1.result){
                ShowMessage(null, 400, 250, '获取数据出错', data1.result);
            }else {
                data1 = _.filter(data1, function(n){
                    return n.name != 'admin';
                });
                rolelist = _.map(data1, function(n){
                    return {'value': n._id, 'label': n.displayname};
                });
            }

            var flds = [
                {display: "角色列表", id: "roleid", newline: true,  type: "select", editor:{data:rolelist},  group:'角色', labelwidth:130, width:200, validate:{required:true},
                    change:function(selected){
                        var users = $('#form_change_role').webgisform('get', 'users');
                        $('input[id^=form_change_role_role_functions_]' ).iCheck('uncheck');
                        var o = _.find(data1, {_id: selected});
                        if(o) {
                            $(users[0]).multipleSelect("setSelects", o.users);
                            _.forEach(o.permission, function(item)
                            {
                                $('#form_change_role_role_functions_' + item).iCheck('check');
                            });
                        }
                    }
                //{display: "用户列表", id: "users", newline: true,  type: "multiselect", editor:{data:userlist},  group:'用户', labelwidth:130, width:200, validate:{required:true}
                 },
            ];
            _.forEach($.webgis.mapping.role_functions, function(item)
            {
                flds.push({display: item.label, id: "role_functions_" + item.value, newline: true,  type: "checkbox", defaultvalue:false,  group:'允许功能', labelwidth:270});
            });
            $('#form_change_role').empty();
            $('#form_change_role').webgisform(flds, {
                prefix: "form_change_role_",
                maxwidth: 370
                //margin:10,
                //groupmargin:10
            });
        });
        //});
    };
    update_form();
}


function ClearPoi(viewer)
{
    var scene = viewer.scene;
    delete $.webgis.data.czmls;
    $.webgis.data.czmls = [];
    ReloadCzmlDataSource(viewer, $.webgis.config.zaware, true);
    for(var k in $.webgis.data.gltf_models_mapping)
    {
        var m = $.webgis.data.gltf_models_mapping[k];
        if(scene.primitives.contains(m))
        {
            var b = scene.primitives.remove(m);
            //console.log(b);
        }
    }
}

function TranslateToCN()
{
    $('.cesium-home-button').attr('title', '返回初始视角');
    $('.cesium-navigation-help-button').attr('title', '快速操作帮助');
    $($('.cesium-baseLayerPicker-sectionTitle')[0]).html('地表图源');
    //$($('.cesium-baseLayerPicker-sectionTitle')[0]).attr('imgtype', 'imagery');
    $($('.cesium-baseLayerPicker-sectionTitle')[1]).html('3D地型数据源');
    //$($('.cesium-baseLayerPicker-sectionTitle')[1]).attr('imgtype', 'terrain');
    $('.cesium-navigation-help-pan').html('平移');
    $('.cesium-navigation-help-pan').siblings().html('左键点击 + 拖动');
    $('.cesium-navigation-help-zoom').html('缩放');
    $($('.cesium-navigation-help-zoom').siblings()[0]).html('右键点击 + 拖动, 或');
    $($('.cesium-navigation-help-zoom').siblings()[1]).html('鼠标滚轮');
    $('.cesium-touch-navigation-help .cesium-navigation-help-zoom').next().html('两指滑动');
    $('.cesium-click-navigation-help .cesium-navigation-help-rotate').html('视角旋转');
    $($('.cesium-navigation-help-rotate').siblings()[0]).html('中键点击 + 拖动, 或');
    $($('.cesium-navigation-help-rotate').siblings()[1]).html('CTRL + 左键点击 + 拖动');
    $('.cesium-touch-navigation-help .cesium-navigation-help-rotate').html('视角翻转');
    $('.cesium-touch-navigation-help .cesium-navigation-help-rotate').next().html('两指同向滑动');
    $('.cesium-touch-navigation-help .cesium-navigation-help-tilt').html('视角旋转');
    $('.cesium-touch-navigation-help .cesium-navigation-help-tilt').next().html('两指反向滑动');
}

function InitModelList(viewer)
{
    //$('#tower_info_model_list_toggle').button();
    //$('#tower_info_model_list_toggle').on( 'mouseenter', function(e){
        //$(e.target).css('cursor', 'hand');
    //});
    //$('#tower_info_model_list_toggle').on( 'mouseleave', function(e){
        //$(e.target).css('cursor', 'pointer');
    //});
    $('#tower_info_model_list_toggle').on('click', function(e) {
        if($('#tower_info_model_list').css('display') == 'block')
        {
            $(e.target).html('>>显示列表');
            $('#tower_info_model_list').css('display', 'none');
            $('#tower_info_model').find('iframe').css('width', '99%');
        }
        else
        {
            $(e.target).html('<<隐藏列表');
            $('#tower_info_model_list').css('display', 'block');
            $('#tower_info_model').find('iframe').css('width', '79%');
        }
    });
    
    $('#tower_info_model_list_filter').on('keyup', function(e){
        var text = $(e.target).val();
        FilterModelList(text);
    });
}

function GetCheckedBoxList(prefix)
{
    var ret = [];
    $.each($( "input[id^=" + prefix + "]"), function(i, element){
        if($(element).is(':checked'))
        {
            ret.push($(element).attr('id').replace(prefix,''));
        }
    });
    return ret;
}
function InitSearchBox(viewer)
{
    $('#button_search_clear').on( 'click', function(){
        var v = $('#input_search').val();
        if(v.length>0)
        {
            $('#input_search').val('');
            $('#text_search_waiting').css('display','block');
            $('#text_search_waiting').html('输入关键字拼音首字母');
            $('#input_search').focus();
        }
        else
        {
            $('#input_search').hide('slide',{}, 500, function(){
                $('#button_search_clear').css('display','none');
                $('#text_search_waiting').css('display','none');
                $('#div_search_option').css('display','none');
            });
            $('#button_search').css('background-color', '#FFFFFF');
        }

    });
    $( "input[id^=chb_search_webgis_type_]").iCheck({
        checkboxClass: 'icheckbox_flat-green'
    });
    $( "#chb_search_webgis_type_polyline_line").iCheck('check');
    $( "input[id^=chb_search_webgis_type_]").on("ifChanged", function(e){
    });
    
    $( "#input_search" ).on('keyup',function(e){
        if($(e.target).val().length > 0)
        {
            $('#text_search_waiting').css('display','none');
        }
    });
    $( "#div_search_option_toggle label" ).on('mouseenter',function(e){
        if($("#div_search_option_toggle label").html() == "更多选项&gt;&gt;")
        {
            $('#div_search_option_panel').show({
                effect: "slide",
                direction: "up",
                duration: 400,
                complete:function(){
                    $("#div_search_option_toggle label").html("");
                    $('#div_search_option').css("border", "0px 1px 0px 1px solid");
                    $('#div_search_option_panel').css("border", "0px 1px 1px 1px solid");
                }
            });
        }
    });
    $( "#div_search_option_panel" ).on('mouseleave',function(e){
        $('#div_search_option_panel').hide({
            effect: "slide",
            direction: "up",
            duration: 400,
            complete:function(){
                $( "#div_search_option_toggle label").html("更多选项&gt;&gt;");
            }
        });
    });
    
    
    $( "#input_search" ).autocomplete({
        autoFocus:true,
        minLength:1,
        delay: 500,
        _resizeMenu: function() {
            this.menu.element.outerHeight( 500 );
        },        
        source:function(request,  response)
        {
            var tylist = GetCheckedBoxList('chb_search_webgis_type_');
            var py_cond = {'db':$.webgis.db.db_name, 'collection':'features;network', 'action':'pinyin_search', 'py':request.term, 'type':tylist};
            $('#text_search_waiting').css('display','block');
            $('#text_search_waiting').html('正在查询，请稍候...');
            MongoFind( py_cond, 
                function(data){
                    //console.log(data);
                    $('#text_search_waiting').css('display','none');
                    response(BuildSearchItemList(data));
            });
        },
        select: function( event, ui ) {
            //console.log(ui.item);
            if(ui.item.value === 'anti_bird_towers')
            {
                LoadAntiBirdTowers(viewer);
            }
            else if(ui.item.geojson && ui.item.geojson.geometry)
            {
                var center = get_geojson_center(ui.item.geojson);
                if(center.length === 2)
                {
                    FlyToPoint(viewer, center[0], center[1], 2000, 1.05, 4000);
                }
                ShowSearchResult(viewer, ui.item.geojson);
            }
            else if(ui.item.geojson && ui.item.geojson.properties && ui.item.geojson.properties.webgis_type && ui.item.geojson.properties.webgis_type === 'polyline_line')
            {
                var name = ui.item.geojson.properties.name;
                if(name)
                {
                    LoadTowerByLineName(viewer, $.webgis.db.db_name, name, function(data){
                        LoadLineByLineName(viewer, $.webgis.db.db_name, name, function(data1){
                            var extent = GetExtentByCzml();
                            FlyToExtent(viewer, {extent:extent});
                            if($.webgis.config.map_backend === 'cesium')
                            {
                                ReloadCzmlDataSource(viewer, $.webgis.config.zaware);
                            }
                        });
                    });
                }
            }
            else if(ui.item.geojson.type && ui.item.geojson.url && ui.item.geojson.name)
            {
                //console.log(ui.item.type + ',' + ui.item.name + ',' + ui.item.url);
                if(ui.item.geojson.type === 'heatmap_tile')
                {
                    $.webgis.data.heatmap_layers[ui.item.geojson.name] = {
                        layer: CreateTileHeatMap(viewer, {
                                    url: ui.item.geojson.url,
                                    maximumLevel: 11,
                                    name: ui.item.geojson.name
                                }),
                        type: 'tile'
                    };
                }
            }
        }
    });
    $('#button_search').on( 'click', function(){
            if($('#input_search').css('display') == 'none')
            {
                $('#input_search').show('slide',{}, 400, function(){
                    $('#button_search_clear').css('display','block');
                    $('#text_search_waiting').css('display','block');
                    $('#div_search_option').css('display','block');
                    $('#input_search').focus();
                });
                $('#button_search').css('background-color', $.webgis.color.base_color);
                
            }else
            {
                $('#input_search').hide('slide',{}, 500, function(){
                    $('#button_search_clear').css('display','none');
                    $('#text_search_waiting').css('display','none');
                    $('#div_search_option').css('display','none');
                });
                $('#button_search').css('background-color', '#FFFFFF');
            }
    });
    $('#button_search').on( 'mouseenter', function(){
        $('#button_search').css('background-color', '#00FFFF');
    });
    $('#button_search').on( 'mouseleave', function(){
        $('#button_search').css('background-color', '#FFFFFF');
        if($('#input_search').css('display') !== 'none')
        {
            $('#button_search').css('background-color', $.webgis.color.base_color);
        }
    });

}

function LoadAntiBirdTowers(viewer)
{
    if($.webgis.data.anti_bird_towers.length === 0)
    {
        var cond = {'db': $.webgis.db.db_name, 'collection': 'features', 'action': 'anti_bird_towers'};
        ShowProgressBar(true, 670, 200, '载入中', '正在载入已安装驱鸟器杆塔数据，请稍候...');
        MongoFind(cond,
            function (data) {
                ShowProgressBar(false);
                $.webgis.data.anti_bird_towers = data;
                //var imei = _.pluck($.webgis.data.antibird.anti_bird_equip_list, 'imei');
                ////console.log(imei);
                //console.log(imei.length);
                //var l = [];
                //var arr = _.forEach($.webgis.data.anti_bird_towers, function(item){
                //    l.push(item.properties.metals);
                //});
                //arr = _.flatten(l, true);
                //arr = _.filter(arr, function(n){
                //    return n.imei != undefined;
                //});
                //var imei1  = _.pluck(arr, 'imei');
                ////console.log(imei1);
                //console.log(imei1.length);
                //console.log(_.difference(imei, imei1));
                $.webgis.data.geojsons = _.uniq(_.union($.webgis.data.geojsons, data), _.property('_id'));
                if ($.webgis.config.map_backend === 'cesium') {
                    var czmls = _.map(data, function (n) {
                        return CreateCzmlFromGeojson(n);
                    });
                    $.webgis.data.czmls = _.uniq(_.union($.webgis.data.czmls, czmls), _.property('id'));
                }
                _.forEach(data, function (item) {
                    if ($.webgis.config.map_backend === 'leaflet') {
                        //console.log(item);
                        $.webgis.control.leaflet_geojson_layer.addData(item);
                    }
                });
                var extent = GetExtentByCzml();
                FlyToExtent(viewer, {extent:extent});
                if ($.webgis.config.map_backend === 'cesium') {
                    ReloadCzmlDataSource(viewer, $.webgis.config.zaware);
                }
            });
    }else{
        var data = $.webgis.data.anti_bird_towers;
        $.webgis.data.geojsons = _.uniq(_.union($.webgis.data.geojsons, data), _.property('_id'));
        if ($.webgis.config.map_backend === 'cesium') {
            var czmls = _.map(data, function (n) {
                return CreateCzmlFromGeojson(n);
            });
            $.webgis.data.czmls = _.uniq(_.union($.webgis.data.czmls, czmls), _.property('id'));
        }
        _.forEach(data, function (item) {
            if ($.webgis.config.map_backend === 'leaflet') {
                //console.log(item);
                $.webgis.control.leaflet_geojson_layer.addData(item);
            }
        });
        var extent = GetExtentByCzml();
        FlyToExtent(viewer, {extent:extent});
        if ($.webgis.config.map_backend === 'cesium') {
            ReloadCzmlDataSource(viewer, $.webgis.config.zaware);
        }
    }
}
function BuildSearchItemList(data)
{
    var ret = $.map( data, function( item, idx ) {
        var name = '', label = '';
        var pos;
        if(item.properties && item.properties.name) name = item.properties.name;
        if(item.geometry)
        {
            if(item.geometry.type == 'Point')
            {
                pos = item.geometry.coordinates;
            }
            if(item.geometry.type == 'LineString')
            {
                var idx = item.geometry.coordinates.length/2;
                pos = item.geometry.coordinates[idx];
            }
            if(item.geometry.type == 'Polygon')
            {
                var x=0, y=0;
                for(var i in item.geometry.coordinates)
                {
                    x += item.geometry.coordinates[i][0];
                    y += item.geometry.coordinates[i][1];
                }
                pos = [x / item.geometry.coordinates.length, y / item.geometry.coordinates.length];
            }
        }
        label = name;
        if(item.url && item.name)
        {
            name = item.name;
            pos = undefined;
            label = name.replace('YN_HEATMAP', '热度图');
        }
        if(item.action && item.action === 'anti_bird_towers')
        {
            name = 'anti_bird_towers';
            pos = undefined;
            label = '安装驱鸟器的杆塔';
        }
        return {
          label: label,
          value: name,
          pos:pos,
          geojson:item
        };
    });
    return ret;
}

function ShowSearchResult(viewer, geojson)
{
    //console.log(geojson);
    if(geojson._id && geojson.properties )
    {
        var _id = geojson._id;
        var g = _.find($.webgis.data.geojsons, {_id:_id});
        if(!g)
        {
            $.webgis.data.geojsons.push(geojson);
            g = geojson;
        }
        if($.webgis.config.map_backend === 'cesium')
        {
            var cz = _.find($.webgis.data.czmls, {id:_id});
            if(!cz)
            {
                if(g.properties.webgis_type.indexOf('point_') > -1)
                    $.webgis.data.czmls.push(CreatePointCzmlFromGeojson(g));
                else if(g.properties.webgis_type.indexOf('polyline_')>-1)
                    $.webgis.data.czmls.push(CreatePolyLineCzmlFromGeojson(g));
                else if(g.properties.webgis_type.indexOf('polygon_')>-1)
                    $.webgis.data.czmls.push(CreatePolygonCzmlFromGeojson(g));
                ReloadCzmlDataSource(viewer, $.webgis.config.zaware);
            }
        }
        if($.webgis.config.map_backend === 'leaflet')
        {
            if(geojson.type === undefined)
            {
                geojson.type = 'Feature';
            }
            $.webgis.control.leaflet_geojson_layer.addData(geojson);
        }

    }
}


function CreatePolygonCzmlFromGeojson(geojson)
{
    
    var get_center = function(positions){
        var x=0, y=0, z=0;
        for(var i in positions)
        {
            if(i%3 == 0) x += positions[i];
            if(i%3 == 1) y += positions[i];
            if(i%3 == 2) z += positions[i];
        }
        var len = positions.length/3;
        x = x/len;
        y = y/len;
        z = z/len;
        return [x, y, z];
    };
    var cz = {};
    var name = '';
    cz['id'] = geojson['_id'];
    cz['webgis_type'] = geojson['properties']['webgis_type'];
    cz['position'] = {};
    cz['polygon'] = {};
    cz['polygon']['positions'] = {};
    name = geojson['properties']['name'];
    var positions = GetVertexPositionsByGeojsonPolyline(geojson['geometry'], geojson['properties']['height']);
    cz['polygon']['positions']['cartographicDegrees'] = positions;
    var center = get_center(positions);
    cz['position']['cartographicDegrees'] = center;
    cz['name'] = name;
    cz['polygon']['material'] = {};
    cz['polygon']['material']['solidColor'] = {};
    var style = geojson['properties']['style'];
    var v;

    if(style && style.color) v = style.color;
    else v = GetDefaultStyleValue(cz['webgis_type'], 'color')
    cz['polygon']['material']['solidColor']['color'] = {'rgba':v};
    //if(style.image)
    //{
        //cz['polygon']['material']['image'] = {};
        //cz['polygon']['material']['image']['image'] = {'uri':style.image};
    //}
    cz['polygon']['perPositionHeight'] = {'boolean':false};
    cz['polygon']['height'] = {'number': 0};
    cz['polygon']['extrudedHeight'] = {'number': 0};
    if(cz['webgis_type'] === 'polygon_buffer')
    {
        cz['polygon']['extrudedHeight'] = {'number': 3000};
    }
    else
    {
        if(geojson['properties']['height'])
        {
            cz['polygon']['extrudedHeight'] = {'number': center[2] + geojson['properties']['height'] * 10};
        }
        else
        {
            cz['polygon']['extrudedHeight'] = {'number': center[2] * 2};
        }
    }
    cz['polygon']['fill'] = {'boolean':true};
    cz['polygon']['outline'] = {'boolean':true};
    if(style && style.outline_color) v = style.outline_color;
    else v = GetDefaultStyleValue(cz['webgis_type'], 'outlineColor')
    cz['polygon']['outlineColor'] = {'rgba': v};
    cz['polygon']['show'] = {'boolean':true};
    cz['label'] = {};
    if(style && style.label_fill_color) v = style.label_fill_color;
    else v = GetDefaultStyleValue(cz['webgis_type'], 'labelFillColor')
    cz['label']['fillColor'] = {'rgba': v};
    cz['label']['horizontalOrigin'] = 'LEFT';
    if(style && style.label_outline_color) v = style.label_outline_color;
    else v = GetDefaultStyleValue(cz['webgis_type'], 'labelOutlineColor')
    cz['label']['outlineColor'] = {'rgba': v};
    cz['label']['pixelOffset'] = {'cartesian2':[20.0, 0.0]};
    if(style && style.label_scale) v = style.label_scale;
    else v = GetDefaultStyleValue(cz['webgis_type'], 'labelScale')
    cz['label']['scale'] = {'number': v};
    cz['label']['show'] = {'boolean':false};
    cz['label']['style'] = 'FILL';
    cz['label']['font'] = 'normal normal bold 32px arial';
    cz['label']['text'] = name;
    cz['label']['verticalOrigin'] = 'CENTER';
    cz['description'] = '<!--HTML-->\r\n<p>' + name + '</p>';
    return cz;
}

function CreatePolyLineCzmlFromGeojson(geojson)
{
    var get_line_style = function(geojson){
        var ret = {};
        var color = '#000000';
        if(geojson.properties.voltage == '12')
        {
            color = '#AAF000';
        }
        if(geojson.properties.voltage == '13')
        {
            color = '#FF0000';
        }
        if(geojson.properties.voltage == '15')
        {
            color = '#0000FF';
        }
        var rgba = tinycolor(color).toRgb();
        rgba.a = Math.floor(0.5 * 256);
        ret['color'] = [ rgba.r , rgba.g , rgba.b , rgba.a ];
        ret['outline_color'] = [ 0, 0, 0, 255 ];
        ret['outline_width'] = 1;
        ret['label_fill_color'] = [255, 128, 0, 255];
        ret['label_outline_color'] = [0, 0, 0, 255];
        ret['label_scale'] = 1;
        ret['pixel_width'] = 5;
        return ret;
    };

    var get_center = function(positions){
        var i0 = Math.floor(positions.length/2);
        var i1 = i0+1;
        var i2 = i0+2;
        return [positions[i0], positions[i1], positions[i2]];
    };
    var cz = {};
    var name = geojson['properties']['name'];
    cz['id'] = geojson['_id'];
    cz['webgis_type'] = geojson['properties']['webgis_type'];
    cz['position'] = {};
    cz['polyline'] = {};
    cz['polyline']['positions'] = {};
    
    //console.log(geojson);
    if(cz['webgis_type']==='polyline_line')
    {
        
        var positions = GetVertexPositionsByGeojsonPolyline(geojson['geometry']);
        cz['polyline']['positions']['cartographicDegrees'] = positions;
        cz['position']['cartographicDegrees'] = get_center(positions);
    }
    else
    {
        var positions = GetVertexPositionsByGeojsonPolyline(geojson['geometry'], geojson['properties']['height']);
        cz['polyline']['positions']['cartographicDegrees'] = positions;
        cz['position']['cartographicDegrees'] = get_center(positions);
    }
    cz['name'] = name;
    cz['polyline']['material'] = {};
    cz['polyline']['material']['solidColor'] = {};
    var style;
    if(geojson['properties']['voltage'])
    {
        style = get_line_style(geojson);
    }else
    {
        style = geojson['properties']['style'];
    }
    var v;
    if(style && style.color) v = style.color;
    else v = GetDefaultStyleValue(cz['webgis_type'], 'color')
    cz['polyline']['material']['solidColor']['color'] = {'rgba':v};
    if(style && style.pixel_width) v = style.pixel_width;
    else v = GetDefaultStyleValue(cz['webgis_type'], 'pixelWidth')
    cz['polyline']['width'] = {'number':v};
    cz['polyline']['material']['polylineOutline'] = {};
    if(style && style.outline_color) v = style.outline_color;
    else v = GetDefaultStyleValue(cz['webgis_type'], 'outlineColor')
    cz['polyline']['material']['polylineOutline']['outlineColor'] = {'rgba': v};
    cz['polyline']['material']['polylineOutline']['outlineWidth'] = {'number': 1};
    cz['polyline']['show'] = {'boolean':true};
    cz['label'] = {};
    if(style && style.label_fill_color) v = style.label_fill_color;
    else v = GetDefaultStyleValue(cz['webgis_type'], 'labelFillColor')
    cz['label']['fillColor'] = {'rgba': v};
    cz['label']['horizontalOrigin'] = 'LEFT';
    if(style && style.label_outline_color) v = style.label_outline_color;
    else v = GetDefaultStyleValue(cz['webgis_type'], 'labelOutlineColor')
    cz['label']['outlineColor'] = {'rgba': v};
    cz['label']['pixelOffset'] = {'cartesian2':[20.0, 0.0]};
    if(style && style.label_scale) v = style.label_scale;
    else v = GetDefaultStyleValue(cz['webgis_type'], 'labelScale')
    cz['label']['scale'] = {'number': v};
    cz['label']['show'] = {'boolean':false};
    cz['label']['style'] = 'FILL';
    cz['label']['font'] = 'normal normal bold 32px arial';
    cz['label']['text'] = name;
    cz['label']['verticalOrigin'] = 'CENTER';
    cz['description'] = '<!--HTML-->\r\n<p>' + name + '</p>';
    return cz;
}

function CreatePointCzmlFromGeojson(geojson)
{
    var cz = {};
    cz['id'] = geojson['_id'];
    cz['webgis_type'] = geojson['properties']['webgis_type'];
    cz['billboard'] = {};
    cz['billboard']['color'] = {'rgba':[255, 255, 255, 255]};
    cz['billboard']['horizontalOrigin'] = 'CENTER';
    cz['billboard']['verticalOrigin'] = 'BOTTOM';
    cz['billboard']['scale'] = {'number':1.0};
    cz['billboard']['show'] = {'boolean':false};
    if(geojson['properties']['model'] === undefined)
    {
        cz['billboard']['show'] = {'boolean':true};
    }
    var name = geojson['properties']['name'];
    var subtype = cz['webgis_type'];
    if(geojson['properties']['function_type'] === 'PAE')
    {
        subtype = 'point_dn_switch'
    }
    if(geojson['properties']['function_type'] === 'PAB')
    {
        subtype = 'point_dn_transform'
    }
    if(geojson['properties']['function_type'] === 'PLM')
    {
        subtype = 'point_dn_link'
    }
    if(geojson['properties']['function_type'] === 'T')
    {
        subtype = 'point_dn_transformarea'
    }
    var style = $.webgis.mapping.style_mapping[subtype];
    var v;
    var icon_img = 'img/marker30x48.png';
    if(subtype === 'point_tower')
    {
        icon_img = style['icon_img'];
    }
    else
    {
        cz['billboard']['show'] = {'boolean':true};
        style = geojson['properties']['style'];
        if(style && style.icon && style.icon.uri) 
        {
            icon_img = style.icon.uri;
        }
        else
        {
            icon_img = GetDefaultStyleValue(subtype, 'icon_img');
        }
    }
    cz['billboard']['image'] = {'uri':icon_img};
    cz['name'] = name;
    cz['position'] = {};
    cz['position']['cartographicDegrees'] = [geojson['geometry']['coordinates'][0], geojson['geometry']['coordinates'][1], geojson['geometry']['coordinates'][2]];
    cz['point'] = {};
    if(style && style.color) v = style.color;
    else v = GetDefaultStyleValue(subtype, 'color')
    cz['point']['color'] = {'rgba':v};
    if(style && style.outline_color) v = style.outline_color;
    else v = GetDefaultStyleValue(subtype, 'outlineColor')
    cz['point']['outlineColor'] = {'rgba': v};
    if(style && style.outline_width) v = style.outline_width;
    else v = GetDefaultStyleValue(subtype, 'outlineWidth')
    cz['point']['outlineWidth'] = {'number': v};
    if(style && style.pixel_size) v = style.pixel_size;
    else v = GetDefaultStyleValue(subtype, 'pixelSize')
    cz['point']['pixelSize'] = {'number': v};
    cz['point']['show'] = {'boolean':true};
    cz['label'] = {};
    if(style && style.label_fill_color) v = style.label_fill_color;
    else v = GetDefaultStyleValue(subtype, 'labelFillColor')
    cz['label']['fillColor'] = {'rgba': v};
    cz['label']['horizontalOrigin'] = 'LEFT';
    cz['label']['verticalOrigin'] = 'BOTTOM';
    cz['label']['outlineColor'] = {'rgba': 1};
    cz['label']['pixelOffset'] = {'cartesian2':[20.0, 0.0]};
    if(style && style.label_scale) v = style.label_scale;
    else v = GetDefaultStyleValue(subtype, 'labelScale')
    cz['label']['scale'] = {'number': v};
    cz['label']['show'] = {'boolean':false};
    cz['label']['style'] = 'FILL';
    cz['label']['font'] = 'normal normal bold 32px arial';
    cz['label']['text'] = name;
    cz['description'] = '<!--HTML-->\r\n<p>' + name + '</p>';
    return cz;
}


function FilterModelList(str)
{
    try{
        $('#tower_info_model_list_selectable').selectable("destroy");
        $('#tower_info_model_list_selectable').empty();
    }catch(e)
    {
    }
    $('#tower_info_model_list_selectable').append('<li class="ui-widget-content1">' + '(无)' + '</li>');
    _.forEach($.webgis.data.models_gltf_files, function(mc)
    {
        if(str.length > 0)
        {
            if(mc.toLowerCase().indexOf(str.toLowerCase())>-1)
            {
                $('#tower_info_model_list_selectable').append('<li class="ui-widget-content1">' + mc + '</li>');
            }
        }else{
            $('#tower_info_model_list_selectable').append('<li class="ui-widget-content1">' + mc + '</li>');
        }
    });
    $("#tower_info_model_list_selectable").selectable({
        selected: function( event, ui ) {
            var model_code_height = $(ui.selected).html();
            var url = GetModelUrl(model_code_height, true);
            var iframe = $('#tower_info_model').find('iframe');
            if(url.length>0)
            {
                var obj = {};
                obj['url'] = '/' + url;
                if($.webgis.mapping.models_mapping[model_code_height])
                {
                    obj['data'] = $.webgis.mapping.models_mapping[model_code_height];
                }else
                {
                    obj['data'] = {};
                    obj['data']['contact_points'] = [];
                    obj['data']['model_code'] = GetMCByModelCode(model_code_height);
                    obj['data']['model_code_height'] = model_code_height;
                }
                if($.webgis.select.selected_obj && $.webgis.select.selected_obj.id)
                {
                    obj['tower_id'] = $.webgis.select.selected_obj.id;
                }
                if($.webgis.config.map_backend === 'cesium')
                {
                    var json = encodeURIComponent(JSON.stringify(obj));
                    iframe.attr('src', 'threejs/editor/index.html?' + json);
                }
                var get_code_height = function(code_height)
                {
                    var idx = code_height.lastIndexOf("_");
                    var num1 = code_height.substr(idx+1);
                    var rest = code_height.slice(0, idx);
                    idx = rest.lastIndexOf("_");
                    var num2 = rest.substr(idx+1);
                    var h = num2 + '.' + num1;
                    var mc = rest.slice(0, idx);
                    //console.log(h);
                    //console.log(mc);
                    return [mc, h];
                };
                var arr = get_code_height(model_code_height);
                $('#tower_info_title_model_code').html('杆塔型号：' + arr[0] + ' 呼称高：' + arr[1] + '米');
                if($.webgis.select.selected_geojson )
                {
                    if($.webgis.mapping.models_mapping[model_code_height])
                    {
                        $.webgis.select.selected_geojson['properties']['model'] = $.webgis.mapping.models_mapping[model_code_height];
                    }
                    else
                    {
                        $.webgis.select.selected_geojson['properties']['model'] = {contact_points:[],model_code:arr[0], model_code_height:model_code_height};
                    }
                }
            }else
            {
                if($.webgis.config.map_backend === 'cesium')
                {
                    iframe.attr('src', 'threejs/editor/index.html' );
                }
                if($.webgis.select.selected_geojson)
                {
                    delete $.webgis.select.selected_geojson['properties']['model'];
                    $.webgis.select.selected_geojson['properties']['model'] = undefined;
                }
            }
            //console.log($.webgis.data.geojsons[$.webgis.select.selected_obj.id]);
        },
        selecting: function( event, ui ) {
            if( $(".ui-selected, .ui-selecting").length > 1){
                  $(ui.selecting).removeClass("ui-selecting");
            }
        }
    });
}

function LoadBorder(viewer, db_name, condition, callback)
{
    var cond = {'db':db_name, 'collection':'poi_border'};
    for(var k in condition)
    {
        cond[k] = condition[k];
    }
    MongoFind( cond, 
        function(data){
            if(data.length>0)
            {
                //for(var i in data)
                //{
                //    $.webgis.data.geojsons[data[i]['_id']] = data[i];
                //}
                $.webgis.data.geojsons =  _.uniq(_.union($.webgis.data.geojsons, data), _.property('_id'));
                ReloadBorders(viewer, false);
            }
            ShowProgressBar(false);
            if(callback) callback();
    });
}

function RemoveBorders(viewer)
{
    //var l = [];
    //for(var k in $.webgis.data.borders)
    //{
    //    l.push(k);
    //}
    //for(var i in l)
    //{
    //    viewer.scene.primitives.remove($.webgis.data.borders[l[i]]);
    //    delete $.webgis.data.borders[l[i]];
    //}
    _.forEach($.webgis.data.borders, function(item){
        viewer.scene.primitives.remove(item.primitive);
    });
    $.webgis.data.borders = [];

}
function ReloadBorders(viewer, forcereload)
{
    var ellipsoid = viewer.scene.globe.ellipsoid;
    if(forcereload)
    {
        RemoveBorders(viewer);
    }
    var extent = {'west':179, 'east':-179, 'south':89, 'north':-89};
    _.forEach($.webgis.data.geojsons, function(item)
    {
        var k = item._id;
        if(!forcereload)
        {
            if(_.find($.webgis.data.borders, {id:k}))
            {
                return true;
            }
        }
        var g = item;
        if(g.properties.type && g.properties.type.indexOf('border')>-1)
        {
            var positions = [];
            //console.log(g.geometry.type);
            var arr;
            if(g.geometry.type === 'MultiPolygon')
                arr = g.geometry.coordinates[0][0];
            if(g.geometry.type === 'Polygon')
                arr = g.geometry.coordinates[0];
            for(var i=0; i < arr.length; i=i+10)
            {
                var x = arr[i][0],
                    y = arr[i][1],
                    z = 6000;
                if(g.properties.type === 'provinceborder')
                {
                    z = 8000;
                }
                if(g.properties.type === 'cityborder')
                {
                    z = 6000;
                }
                if(g.properties.type === 'countyborder')
                {
                    z = 4000;
                }
                positions.push(ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(x, y, z)) );
                if (x < extent['west']) extent['west'] = x;
                if (x > extent['east']) extent['east'] = x;
                if (y < extent['south']) extent['south'] = y;
                if (y > extent['north']) extent['north'] = y;
                
            }
            //console.log(positions.length);
            if(positions.length > 20)
            {
                var color = Cesium.Color.fromCssColorString('rgba(0, 255, 0, 0.7)');
                if(g.properties.type === 'provinceborder')
                {
                    color = Cesium.Color.fromCssColorString('rgba(255, 255, 0, 0.7)');
                }
                if(g.properties.type === 'cityborder')
                {
                    color = Cesium.Color.fromCssColorString('rgba(255, 0, 0, 0.7)');
                }
                if(g.properties.type === 'countyborder')
                {
                    color = Cesium.Color.fromCssColorString('rgba(0, 0, 255, 0.7)');
                }
                var wallInstance = new Cesium.GeometryInstance({
                    id:k,
                    geometry : new Cesium.WallGeometry({
                        positions : positions,
                    }),
                    attributes : {
                        //color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom({alpha : 1.0}))
                        //color : Cesium.ColorGeometryInstanceAttribute.fromColor()
                        color : Cesium.ColorGeometryInstanceAttribute.fromColor(color)
                    }
                });
                
                var primitive = new Cesium.Primitive({
                    geometryInstances : wallInstance,
                    appearance : new Cesium.PerInstanceColorAppearance({
                        flat:true,
                        //closed : true,
                        translucent : true,
                        renderState : {
                            depthTest : {
                                enabled : true
                            }
                        }
                    })
                });
                viewer.scene.primitives.add(primitive);
                $.webgis.data.borders.push({id:k, primitive:primitive});
            }
            
        }
    });
    FlyToExtent(viewer, {extent:extent});
}

function LoadSegments(db_name, callback)
{
    var segs_cond = {'db':db_name, 'collection':'segments'};
    MongoFind( segs_cond, 
        function(data){
            $.webgis.data.segments = data;
            ShowProgressBar(false);
            if(callback) callback();
    });
}
function LoadModelsList(db_name, callback)
{
    var cond = {'db':db_name, 'collection':'-', 'action':'models_list', 'data':{}};
    MongoFind( cond, 
        function(data){
            $.webgis.data.models_gltf_files = data;
            ShowProgressBar(false);
            if(callback) callback();
    });
}
function LoadModelsMapping(db_name, callback)
{
    var cond = {'db':db_name, 'collection':'models'};
    MongoFind( cond, 
        function(data){
            for(var i in data)
            {
                var model_code_height = data[i]['model_code_height'];
                if($.webgis.mapping.models_mapping[model_code_height] === undefined)
                {
                    var d = data[i];
                    delete d['_id'];
                    $.webgis.mapping.models_mapping[model_code_height] = d;
                }
            }
            //console.log($.webgis.mapping.models_mapping);
            ShowProgressBar(false);
            if(callback) callback();
    });
}
function GetExtentByCzml()
{
    var ret;
    ret = {'west':179, 'east':-179, 'south':89, 'north':-89};
    var gj = {type: "FeatureCollection",features: $.webgis.data.geojsons};
    //gj.features = _.values($.webgis.data.geojsons);
    //console.log(gj.features);
    var arr = geojsonExtent(gj);
    if(arr)
    {
        ret['west'] = arr[0];
        ret['south'] = arr[1];
        ret['east'] = arr[2];
        ret['north'] = arr[3];
    }else
    {
        ret = GetDefaultExtent($.webgis.db.db_name);
    }
    //console.log(ret);
    return ret;
}


function LoadCodeData(db_name, callback)
{
    var cond = {'db':db_name, 'collection':'codes'};
    MongoFind( cond, 
        function(data){
            $.webgis.data.codes = data[0];
            ShowProgressBar(false);
            if (callback) callback();
    });
}


function LoadLineData(db_name, callback)
{
    var line_cond = {'db':db_name, 'collection':'network', 'properties.webgis_type':'polyline_line'};
    MongoFind( line_cond,function(linedatas){
        $.webgis.data.lines = linedatas;
        ShowProgressBar(false);
        if (callback) callback();
    });
}

function LoadSysRole(db_name, callback)
{
    var cond = {'db':db_name, 'collection':'-', action:'getsysrole', 'userid':$.webgis.current_userinfo['_id']};
    MongoFind( cond, 
        function(data){
            ShowProgressBar(false);
            $.webgis.data.sysrole = data;
            //console.log($.webgis.data.sysrole);
            if (callback) callback();
    });
}




function AddTerrainZOffset(geojson)
{
    var add_to_coord= function(coord)
    {
        if(coord instanceof Array && coord.length==3 && $.isNumeric(coord[0]))
        {
            coord[2] = coord[2] + $.webgis.config.terrain_z_offset;
        }
        else if(coord instanceof Array)
        {
            var l = [];
            for(var i in coord)
            {
                l.push(add_to_coord(coord[i]));
            }
            coord = l;
        }
        return coord;
    }
    if(geojson['geometry'] && geojson['geometry']['coordinates'])
    {
        geojson['geometry']['coordinates'] = add_to_coord(geojson['geometry']['coordinates']);
    }
    return geojson;
}

function RemoveTerrainZOffset(geojson)
{
    var remove_to_coord= function(coord)
    {
        if(coord instanceof Array && coord.length==3 && $.isNumeric(coord[0]))
        {
            coord[2] = coord[2] - $.webgis.config.terrain_z_offset;
        }
        else if(coord instanceof Array)
        {
            var l = [];
            for(var i in coord)
            {
                l.push(remove_to_coord(coord[i]));
            }
            coord = l;
        }
        return coord;
    }
    if(geojson['geometry'] && geojson['geometry']['coordinates'])
    {
        geojson['geometry']['coordinates'] = remove_to_coord(geojson['geometry']['coordinates']);
    }
    return geojson;
}

function UpdateGeojsonPos(geojson, lng, lat, height, rotate)
{
    if(geojson['geometry'] && geojson['geometry']['coordinates'])
    {
        var coord = geojson['geometry']['coordinates'];
        if(coord instanceof Array && coord.length==3 && $.isNumeric(coord[0]))
        {
            coord[0] = parseFloat(lng);
            coord[1] = parseFloat(lat);
            coord[2] = parseFloat(height);
            geojson['geometry']['coordinates'] = coord;
        }
    }
    if(geojson['properties'] )
    {
        geojson['properties']['rotate'] = parseFloat(rotate);
    }
    return geojson;
}

function LoadTowerByLineName(viewer, db_name,  name,  callback)
{
    var geo_cond = {'db':db_name, 'collection':'mongo_get_towers_by_line_name', 'properties.name':name};
    //var ext_cond = {'db':db_name, 'collection':'mongo_get_towers_by_line_name','get_extext':true, 'properties.name':name};
    ShowProgressBar(true, 670, 200, '载入中', '正在载入[' + name + ']数据，请稍候...');
    MongoFind( geo_cond, 
        function(data){
            //console.log(data);
            ShowProgressBar(false);

            $.webgis.data.geojsons =  _.uniq(_.union($.webgis.data.geojsons, data), _.property('_id'));
            if($.webgis.config.map_backend === 'cesium') {
                var czmls = _.map(data, function (n) {
                    return CreateCzmlFromGeojson(n);
                });
                $.webgis.data.czmls = _.uniq(_.union($.webgis.data.czmls, czmls), _.property('id'));
            }
            _.forEach(data, function(item){
                if($.webgis.config.map_backend === 'leaflet')
                {
                    //console.log(item);
                    $.webgis.control.leaflet_geojson_layer.addData(item);
                }
            });
            if(callback) callback(data);
    });
}

function LoadLineByLineName(viewer, db_name, name, callback)
{
    var get_line_id = function(name){
        var ret;
        ret = _.result(_.find($.webgis.data.lines,  _.matchesProperty('properties.name', name)), '_id');
        return ret;
    };
    var _id = get_line_id(name);
    LoadEdgeByLineId(viewer, db_name, _id, callback);
    if(true) return;
    
    //var ellipsoid = viewer.scene.globe.ellipsoid;
    //if(!_id)
    //{
    //    console.log(name + " does not exist");
    //    return;
    //}
    //var cond = {'db':db_name, 'collection':'get_line_geojson', '_id':_id};
    //MongoFind(cond, function(data){
    //    if(data.length>0)
    //    {
    //        if(!$.webgis.data.geojsons[_id])
    //        {
    //            $.webgis.data.geojsons[_id] = data[0]; //AddTerrainZOffset(data[0]);
    //        }
    //        if(!$.webgis.data.czmls[_id])
    //        {
    //            $.webgis.data.czmls[_id] = CreateCzmlFromGeojson($.webgis.data.geojsons[_id]);
    //        }
    //    }
    //    if(callback) callback(data);
    //});
}

function GetVertexPositionsByGeojsonPolyline(geometry, height)
{
    var ret = [];
    var coordinates = geometry.coordinates;
    if(geometry.type === 'Polygon')
    {
        coordinates = geometry.coordinates[0];
    }
    for(var i in coordinates)
    {
        var coord = coordinates[i];
        ret.push(coord[0]);
        ret.push(coord[1]);
        if(height) 
            ret.push(coord[2] + height);
        else
            ret.push(coord[2]);
    }
    return ret;
}

function GetVertexPositionsByTowerPairs(towers_pair)
{
    var ret = [];
    var st = SortTowersByTowersPair(towers_pair);
    _.forEach(st, function(id)
    {
        var cz = _.find($.webgis.data.czmls, {id:id});
        if(cz)
        {
            ret.push(cz.position.cartographicDegrees[0]);
            ret.push(cz.position.cartographicDegrees[1]);
            ret.push(cz.position.cartographicDegrees[2]);
        }
    });
    return ret;
}


function GetIndexOfDataSourcesByName(viewer, name)
{
    var ret = -1;
    for(var i = 0; i < viewer.dataSources.length; i++)
    {
        var ds = viewer.dataSources.get(i);
        //console.log('ds.name=' + ds.name);
        if(ds.name == name)
        {
            viewer.dataSources.remove(ds);
            ret = i;
            break;
        }
    }
    return ret;
}
function GetDataSourcesByName(viewer, name)
{
    var ret;
    for(var i = 0; i < viewer.dataSources.length; i++)
    {
        var ds = viewer.dataSources.get(i);
        if(ds.name == name)
        {
            ret = ds;
            break;
        }
    }
    return ret;
}
function ReloadCzmlDataSource(viewer, z_aware, forcereload)
{
    
    var get_label_show_opt = function(){
        var r = {};
        $('input[id^=chb_show_label_]').each(function(){
            var t = $(this).attr('id').replace('chb_show_label_', '');
            r[t] = false;
            if($(this).is(':checked')) r[t] = true;
        });
        return r;
    };
    
    var get_geometry_show_opt = function(){
        var r = {};
        $('input[id^=chb_show_geometry_]').each(function(){
            var t = $(this).attr('id').replace('chb_show_geometry_', '');
            r[t] = false;
            if($(this).is(':checked')) r[t] = true;
        });
        return r;
    };
    
    var get_icon_show_opt = function(){
        var r = {};
        $('input[id^=chb_show_icon_]').each(function(){
            var t = $(this).attr('id').replace('chb_show_icon_', '');
            r[t] = false;
            if($(this).is(':checked')) r[t] = true;
        });
        return r;
    };
    

    var ellipsoid = viewer.scene.globe.ellipsoid;
    var arr = [];
    var pos;
    //console.log('z_aware=' + z_aware);
    arr.push({"id":"document", "version":"1.0"});
    _.forEach($.webgis.data.czmls, function(item)
    {
        var k = item.id;
        var obj =  $.extend(true, {}, item);
        if(!z_aware)
        {
            if(obj.position)
            {
                obj.position.cartographicDegrees = [
                    obj.position.cartographicDegrees[0],
                    obj.position.cartographicDegrees[1],
                    0
                ];
            }
            if(obj.polyline && obj.polyline.positions)
            {
                for(var i in obj.polyline.positions.cartographicDegrees)
                {
                    if(i % 3 == 2)
                    {
                        obj.polyline.positions.cartographicDegrees[i] = 0;
                    }
                }
            }
            if(obj.polygon && obj.polygon.positions)
            {
                for(var i in obj.polygon.positions.cartographicDegrees)
                {
                    if(i % 3 == 2)
                    {
                        obj.polygon.positions.cartographicDegrees[i] = 0;
                    }
                }
            }
            if(obj.polygon && obj.polygon.extrudedHeight)
            {
                obj.polygon.extrudedHeight = {'number': 0};
            }
        
        }else
        {
            //if(obj['position'] && obj['position']['cartographicDegrees'][2] == 0)
            //{
                //var height = 0;
                //var carto = Cesium.Cartographic.fromDegrees(
                    //obj['position']['cartographicDegrees'][0],  
                    //obj['position']['cartographicDegrees'][1]
                    //);
                //var h = viewer.scene.globe.getHeight(carto);
                //console.log(h);
                //if(h && h>0) height = h;
                //obj['position']['cartographicDegrees'] = [
                    //obj['position']['cartographicDegrees'][0],  
                    //obj['position']['cartographicDegrees'][1], 
                    //height
                //];
                //$.webgis.data.czmls[k]['position']['cartographicDegrees'] = obj['position']['cartographicDegrees'];
            //}
            //if(obj['polyline'] && obj['polyline']['positions'] )
            //{
                //for(var i=2; i<obj['polyline']['positions']['cartographicDegrees'].length; i=i+3)
                //{
                    //if(obj['polyline']['positions']['cartographicDegrees'][i] == 0)
                    //{
                        //var height = 0;
                        //var h = viewer.scene.globe.getHeight(Cesium.Cartographic.fromDegrees(
                                //obj['polyline']['positions']['cartographicDegrees'][i-2],  
                                //obj['polyline']['positions']['cartographicDegrees'][i-1]
                            //));
                        //if(h && h>0) height = h;
                        //obj['polyline']['positions']['cartographicDegrees'][i] = height;
                        //$.webgis.data.czmls[k]['polyline']['positions']['cartographicDegrees'][i] = height;
                    //}
                //}
            //}
        }
        var opt = get_label_show_opt();
        for(var kk in opt)
        {
            if(kk.indexOf('point_')>-1 && kk != 'point_tower' && obj.webgis_type != 'point_tower' && obj.webgis_type &&  obj.webgis_type.indexOf('point_')>-1 )
            {
                if(opt[kk] === true)
                    obj.label.show = {'boolean':true};
                if(opt[kk] === false)
                    obj.label.show = {'boolean':false};
            }
            
            if(kk === obj.webgis_type)
            {
                if(opt[kk] === true)
                    obj.label.show = {'boolean':true};
                if(opt[kk] === false)
                    obj.label.show = {'boolean':false};
            }
        }
        opt = get_icon_show_opt();
        for(var kk in opt)
        {
            if(kk.indexOf('point_')>-1 && obj.billboard)
            {
                if(obj.webgis_type && obj.webgis_type.indexOf('point_')>-1 && obj.webgis_type != 'point_tower')
                {
                    if(opt[kk] === true)
                        obj.billboard.show = {'boolean':true};
                    if(opt[kk] === false)
                        obj.billboard.show = {'boolean':false};
                }
                else if(obj.webgis_type && obj.webgis_type === 'point_tower')
                {
                    var g = _.find($.webgis.data.geojsons, {_id:k});
                    if(g && g.properties && g.properties.model && !$.isEmptyObject(g.properties.model))
                    {
                        obj.billboard.show = {'boolean':false};
                    }else
                    {
                        obj.billboard.show = {'boolean':true};
                    }

                }
            }
            else if(obj.webgis_type && kk === obj.webgis_type && obj.billboard)
            {
                if(opt[kk] === true)
                    obj.billboard.show = {'boolean':true};
                if(opt[kk] === false)
                    obj.billboard.show = {'boolean':false};
            }
        }
        opt = get_geometry_show_opt();
        for(var kk in opt)
        {
            if(kk.indexOf('polyline_line')>-1 && obj.polyline)
            {
                if(obj.webgis_type && obj.webgis_type.indexOf('polyline_line')>-1)
                {
                    if(opt[kk] === true)
                        obj.polyline.show = {'boolean':true};
                    if(opt[kk] === false)
                        obj.polyline.show = {'boolean':false};
                }
            }
        }
        arr.push(obj);
        if(viewer.selectedEntity)
        {
            if(obj.position && obj.id === viewer.selectedEntity.id)
            {
                pos = obj.position.cartographicDegrees;
            }
        }
    });
    if($.webgis.data.czmls.length === 0)
    {
        viewer.selectedEntity = undefined;
        $.webgis.select.selected_obj = undefined;
    }
    var dataSource = GetDataSourcesByName(viewer, 'czml');
    if(!dataSource)
    {
        dataSource = new Cesium.CzmlDataSource('czml');
        viewer.dataSources.add(dataSource);
    }
    dataSource.process(arr);
    if(forcereload === true)
    {
        console.log('czml forcereload');
        viewer.dataSources.remove(dataSource, true) ;
        dataSource = new Cesium.CzmlDataSource('czml');
        dataSource.load(arr);
        viewer.dataSources.add(dataSource);
    }
    
    
    if(viewer.selectedEntity && pos)
    {
        viewer.selectedEntity.position._value = ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(pos[0], pos[1], pos[2]));
    }
}
function LookAtTarget(viewer, id, zoom_factor)
{
    var scene = viewer.scene;
    //scene.camera.controller.lookAt(scene.camera.position, target, scene.camera.up);
    var ellipsoid = scene.globe.ellipsoid;
    var g = _.find($.webgis.data.geojsons, {_id:id});
    if(g)
    {
        var x = g.geometry.coordinates[0];
        var y = g.geometry.coordinates[1];
        var z = g.geometry.coordinates[2];
        
        if(zoom_factor)
            FlyToPoint(viewer, x, y, z, zoom_factor, 4000);
        else
            FlyToPoint(viewer, x, y, z, 1.09, 4000);
    }
}
function LookAtTargetExtent(viewer, id, dx, dy)
{
    var scene = viewer.scene;
    var ellipsoid = scene.globe.ellipsoid;
    var tower = _.find($.webgis.data.geojsons, {_id:id});
    if(tower)
    {
        var x = tower.geometry.coordinates[0];
        var y = tower.geometry.coordinates[1];
        var west = Cesium.Math.toRadians(x - dx);
        var south = Cesium.Math.toRadians(y - dy);
        var east = Cesium.Math.toRadians(x + dx);
        var north = Cesium.Math.toRadians(y + dy);
        //var extent = new Cesium.Extent(west, south, east, north);
        var extent = {west:west,south:south,east:east,north:north};
        FlyToExtent(viewer, {extent:extent});
    }
}
function ViewExtentByPos(viewer, lng, lat,  dx, dy)
{
    var scene = viewer.scene;
    var ellipsoid = scene.globe.ellipsoid;
    var west = Cesium.Math.toRadians(lng - dx);
    var south = Cesium.Math.toRadians(lat - dy);
    var east = Cesium.Math.toRadians(lng + dx);
    var north = Cesium.Math.toRadians(lat + dy);
    var extent = new Cesium.Extent(west, south, east, north);
    //scene.camera.controller.viewExtent(extent, ellipsoid);
    scene.camera.controller.viewExtent(extent, ellipsoid);
}


function FlyToPoint(viewer, x, y, z, factor, duration)
{
    if($.webgis.config.map_backend === 'cesium')
    {
        var scene = viewer.scene;
        var ellipsoid = scene.globe.ellipsoid;
        var destination = Cesium.Cartographic.fromDegrees(x,  y,  z * factor);

        scene.camera.flyTo({
            destination : ellipsoid.cartographicToCartesian(destination),
            duration    :duration/1000.0
        });
    }
    if($.webgis.config.map_backend === 'leaflet')
    {
        var c = L.latLng(y, x);
        viewer.setView(c, 10);
    }
    
}

function FlyToPointCart3(viewer, cartopos, duration)
{
    var scene = viewer.scene;
    var ellipsoid = scene.globe.ellipsoid;
    scene.camera.flyTo({
        destination : ellipsoid.cartographicToCartesian(cartopos),
        duration    :duration/1000.0
    });    
}

function FlyToExtent(viewer, option)
{
    if($.webgis.config.map_backend === 'cesium')
    {
        var scene = viewer.scene;
        var extent = Cesium.Rectangle.fromDegrees(option.extent.west, option.extent.south, option.extent.east, option.extent.north);
        var opt = { destination : extent };
        delete option.extent;
        opt = $.extend(true, opt, option)
        scene.camera.flyTo(opt);
    }
    if($.webgis.config.map_backend === 'leaflet')
    {
        var southWest = L.latLng(option.extent.south, option.extent.west);
        var    northEast = L.latLng(option.extent.north, option.extent.east);
        var bounds = L.latLngBounds(southWest, northEast);
        viewer.fitBounds(bounds);
    }
}

function GetTowerInfoByTowerId(id)
{
    var ret ;
    //if($.webgis.data.geojsons[id])
    //{
    //    ret = $.webgis.data.geojsons[id];
    //}
    ret = _.find($.webgis.data.geojsons, {_id:id});
    return ret;
}


function LoadTowerModelByTower(viewer, tower)
{
    var scene = viewer.scene;
    var ellipsoid = scene.globe.ellipsoid;
    if(tower)
    {
        var id = tower._id;
        if(!$.webgis.data.gltf_models_mapping[id])
        {
            if(tower.properties && tower.properties.model && tower.properties.model.model_code_height)
            {
                var lng = parseFloat($('#form_tower_info_base').webgisform('get','lng').val()),
                    lat = parseFloat($('#form_tower_info_base').webgisform('get','lat').val()),
                    height = parseFloat($('#form_tower_info_base').webgisform('get','alt').val()),
                    rotate = parseFloat($('#form_tower_info_base').webgisform('get','rotate').val());
                if(!$.webgis.config.zaware)
                {
                    height = 0;
                }else
                {
                    //var h = viewer.scene.globe.getHeight(Cesium.Cartographic.fromDegrees(lng,  lat));
                    //if(h && h>0) 
                    //{
                        //height = h;
                        //$('#form_tower_info_base').webgisform('get','alt').val(height);
                    //}
                }
                if($.isNumeric(lng) && $.isNumeric(lat) && $.isNumeric(height) && $.isNumeric(rotate))
                {
                    var url = GetModelUrl(tower.properties.model.model_code_height);
                    //console.log('cesium=' + url);
                    if(CheckUrlExist(url))
                    {
                        var model = CreateTowerModel(
                            viewer, 
                            url, 
                            lng,  
                            lat, 
                            height ,  
                            rotate,
                            10
                        );
                        if(model)
                        {
                            $.webgis.data.gltf_models_mapping[id] = model;
                            console.log("load model for [" + id + "]");
                        }
                    }else
                    {
                        console.log("model " + url + " does not exist");
                        var cz = _.find($.webgis.data.czmls, {id:id});
                        if(cz){
                            cz.billboard.show = {'boolean':true};
                        }
                        ReloadCzmlDataSource(viewer, $.webgis.config.zaware);
                    }
                }
            }
        }
        else
        {
            console.log('model for [' + id + '] already loaded');
        }
    }
}



function GetNextTowerModelData(ids)
{
    var ret = [];
    _.forEach(ids, function(id)
    {
        var tower = GetTowerInfoByTowerId(id);
        if(tower)
        {
            ret.push(tower.properties.model);
        }
    });
    return ret;
}
function GetNextModelUrl(ids)
{
    var ret = [];
    _.forEach(ids, function(id)
    {
        var tower = GetTowerInfoByTowerId(id);
        if(tower && tower.properties.model )
        {
            var url = GetModelUrl(tower.properties.model.model_code_height, true);
            if(url.length>0)
            {
                ret.push(url);
            }
        }
    });
    return ret;
}


function GetModelUrl(model_code_height, check)
{
    if(!model_code_height)
    {
        return '';
    }
    if(model_code_height === '(无)')
    {
        return '';
    }
    //var url = "gltf1/" + model_code_height + ".json" ;
    var url = "gltf/" + model_code_height + ".gltf" ;
    if(check === true)
    {
        if(!CheckUrlExist(url)) url = '';
    }
    return url;
}

function CreateTowerModel(viewer, modelurl,  lng,  lat,  height, rotate, scale) 
{
    var scene = viewer.scene;
    var ellipsoid = scene.globe.ellipsoid;
    if(modelurl.length==0)
    {
        return null;
    }
    height = Cesium.defaultValue(height, 0.0);
    var cart3 = ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(lng, lat, height));
    var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(cart3);
    
    var quat = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Z, Cesium.Math.toRadians(rotate - 90));
    var mat3 = Cesium.Matrix3.fromQuaternion(quat);
    var mat4 = Cesium.Matrix4.fromRotationTranslation(mat3, Cesium.Cartesian3.ZERO);
    //console.log(mat4.toString());
    var column2Row2Index = Cesium.Matrix4.getElementIndex(2, 2);
    if(true)
    {
        mat4[column2Row2Index] = - mat4[column2Row2Index];
    }
    //console.log(mat4.toString());
    var m = Cesium.Matrix4.multiplyTransformation(modelMatrix, mat4, mat4);
    var primitive = Cesium.Model.fromGltf({
        url : modelurl,
        modelMatrix : m,
        scale:scale,
        asynchronous:false
    });
    
    //var instance = new Cesium.GeometryInstance({
        //geometry : new Cesium.BoxGeometry({
            //dimensions : new Cesium.Cartesian3(1000000.0, 1000000.0, 500000.0)
        //}),
        //modelMatrix : Cesium.Matrix4.multiplyByTranslation(Cesium.Transforms.eastNorthUpToFixedFrame(
            //Cesium.Cartesian3.fromDegrees(0.0, 0.0), new Cesium.Cartesian3(0.0, 0.0, 1000000.0), new Cesium.Matrix4()),
        //id : 'box',
        //attributes : {
            //color : new Cesium.ColorGeometryInstanceAttribute(1, 0, 0, 1)
        //}
    //});    
    
    
    var model = scene.primitives.add(primitive);
    
    //model.readyToRender.addEventListener(function(model) {
        //model.activeAnimations.addAll({
            //speedup : 0.5,
            //loop : Cesium.ModelAnimationLoop.REPEAT
        //});

        ////// Zoom to model
        ////var worldBoundingSphere = model.computeWorldBoundingSphere();
        ////var center = worldBoundingSphere.center;
        ////var transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
        ////var camera = scene.camera;
        ////camera.transform = transform;
        ////camera.controller.constrainedAxis = Cesium.Cartesian3.UNIT_Z;
        ////var controller = scene.screenSpaceCameraController;
        ////controller.ellipsoid = Cesium.Ellipsoid.UNIT_SPHERE;
        ////controller.enableTilt = true;
        ////var r = 1.25 * Math.max(worldBoundingSphere.radius, camera.frustum.near);
        ////controller.minimumZoomDistance = r * 0.25;
        ////camera.controller.lookAt(new Cesium.Cartesian3(r, r, r), Cesium.Cartesian3.ZERO, Cesium.Cartesian3.UNIT_Z);
    //});
    return model;
}


function TowerInfoMixin(viewer) 
{
    var scene = viewer.scene;
    var ellipsoid = scene.globe.ellipsoid;
    //if (!Cesium.defined(viewer)) {
        //throw new Cesium.DeveloperError('viewer is required.');
    //}
    //if (viewer.hasOwnProperty('trackedEntity')) {
        //throw new Cesium.DeveloperError('trackedEntity is already defined by another mixin.');
    //}
    //if (viewer.hasOwnProperty('selectedEntity')) {
        //throw new Cesium.DeveloperError('selectedEntity is already defined by another mixin.');
    //}

    //var infoBox;// = viewer.infoBox;
    //var infoBoxViewModel = Cesium.defined(infoBox) ? infoBox.viewModel : undefined;

    //var selectionIndicator = viewer.selectionIndicator;
    //var selectionIndicatorViewModel = Cesium.defined(selectionIndicator) ? selectionIndicator.viewModel : undefined;
    //var enableInfoOrSelection = Cesium.defined(infoBox) || Cesium.defined(selectionIndicator);
    //enableInfoOrSelection = false;
    var eventHelper = new Cesium.EventHelper();
    //var entityView;

    function trackSelectedEntity() {
        viewer.trackedEntity = viewer.selectedEntity;
        var id = viewer.trackedEntity.id;
        LookAtTarget(viewer, id);
    }

    function clearTrackedEntity() {
        viewer.trackedEntity = undefined;
    }

    function clearSelectedEntity() {
        viewer.selectedEntity = undefined;
    }

    function clearObjects() {
        viewer.trackedEntity = undefined;
        viewer.selectedEntity = undefined;
    }

    //if (Cesium.defined(infoBoxViewModel)) {
        //eventHelper.add(infoBoxViewModel.cameraClicked, trackSelectedEntity);
        //eventHelper.add(infoBoxViewModel.closeClicked, clearSelectedEntity);
    //}

    //var scratchVertexPositions;
    //var scratchBoundingSphere;

    //function onTick(clock) {
        //var time = clock.currentTime;
        //if (Cesium.defined(entityView)) {
            //entityView.update(time);
        //}

        //var selectedEntity = viewer.selectedEntity;
        //if(selectedEntity && selectedEntity.isAvailable)
        //{
            //var showSelection = Cesium.defined(selectedEntity) && enableInfoOrSelection;
            //if (showSelection) {
                //var oldPosition = Cesium.defined(selectionIndicatorViewModel) ? selectionIndicatorViewModel.position : undefined;
                //var position;
                //var enableCamera = false;
    
                //if (selectedEntity.isAvailable(time)) {
                    //if (Cesium.defined(selectedEntity.position)) {
                        //position = selectedEntity.position.getValue(time, oldPosition);
                        //enableCamera = Cesium.defined(position) && (viewer.trackedEntity !== viewer.selectedEntity);
                    //} else if (Cesium.defined(selectedEntity.positions)) {
                        //scratchVertexPositions = selectedEntity.positions.getValue(time, scratchVertexPositions);
                        //scratchBoundingSphere = Cesium.BoundingSphere.fromPoints(scratchVertexPositions, scratchBoundingSphere);
                        //position = scratchBoundingSphere.center;
                        //// Can't track scratch positions: "enableCamera" is false.
                    //}
                    //// else "position" is undefined and "enableCamera" is false.
                //}
                //// else "position" is undefined and "enableCamera" is false.
    
                //if (Cesium.defined(selectionIndicatorViewModel)) {
                    //selectionIndicatorViewModel.position = position;
                //}
    
                //if (Cesium.defined(infoBoxViewModel)) {
                    //infoBoxViewModel.enableCamera = enableCamera;
                    //infoBoxViewModel.isCameraTracking = (viewer.trackedEntity === viewer.selectedEntity);
    
                    ////if (Cesium.defined(selectedEntity.description)) {
                        ////infoBoxViewModel.descriptionRawHtml = Cesium.defaultValue(selectedEntity.description.getValue(time), '');
                    ////} else {
                        ////infoBoxViewModel.descriptionRawHtml = '';
                    ////}
                //}
            //}
    
            //if (Cesium.defined(selectionIndicatorViewModel)) {
                //selectionIndicatorViewModel.showSelection = showSelection;
                //selectionIndicatorViewModel.update();
            //}
    
            //if (Cesium.defined(infoBoxViewModel)) {
                //infoBoxViewModel.showInfo = showSelection;
            //}
        //}else
        //{
            //selectionIndicatorViewModel.showSelection = false;
            //selectionIndicatorViewModel.update();
        //}
    //}
    //eventHelper.add(viewer.clock.onTick, onTick);

    function pickEntity(e) {
        var picked = viewer.scene.pick(e.position);
        //var ellipsoid = viewer.scene.globe.ellipsoid;
        //var cartesian = viewer.scene.camera.pickEllipsoid(e.position, ellipsoid);
        //if (cartesian) {
            ////var cartographic = ellipsoid.cartesianToCartographic(cartesian);
            ////var lng = Cesium.Math.toDegrees(cartographic.longitude).toFixed(7),
                ////lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(7);
            ////var text = '(' + lng + ',' + lat + ')';
            ////label.show = true;
            ////label.text = text;
            ////label.position = cartesian;
        //}
        
        
        if (Cesium.defined(picked)) {
            var id = Cesium.defaultValue(picked.id, picked.primitive.id);
            if (id instanceof Cesium.Entity) {
                return id;
            }
            
            //if (picked.primitive && picked.primitive instanceof Cesium.Primitive) {
            if (picked.primitive) {
                return picked;
            }
        }
    }

    function trackObject(trackedEntity) {
        if (Cesium.defined(trackedEntity) && Cesium.defined(trackedEntity.position)) {
            viewer.trackedEntity = trackedEntity;
        }
    }

    function pickAndTrackObject(e) {
        var trackedEntity = pickEntity(e);
        
        if (Cesium.defined(trackedEntity)) 
        {
            if (trackedEntity.primitive && trackedEntity.primitive instanceof Cesium.Primitive)
            {
            }
            else
            {
                trackObject(trackedEntity);
                var id = trackedEntity.id;
                LookAtTarget(viewer, id);
            }
        }
    }

    function moveOverObject(e) {
        var picked;
        try{
            picked = viewer.scene.pick(e.endPosition);
        }catch(e){}
        if (Cesium.defined(picked) && Cesium.defined($.webgis.select.selected_obj) && Cesium.defined(picked.id) && picked.id === $.webgis.select.selected_obj) 
        {
            var id = $.webgis.select.selected_obj.id;
            var g = _.find($.webgis.data.geojsons, {_id:id});
            if(g && g.properties.name)
            {
                ShowGeoTip(id, e.endPosition, g.properties.name);
            }else 
            {
                ShowGeoTip(false);
            }
        }else 
        {
            ShowGeoTip(false);
        } 
    }
    
    function pickAndSelectObject(e) {
        //viewer.selectedEntity = pickEntity(e);
        var selectedEntity = pickEntity(e);
        if(selectedEntity && selectedEntity.primitive === undefined)
        {
            viewer.selectedEntity = selectedEntity;
        }
        //console.log(selectedEntity);
        OnSelect(viewer, e, selectedEntity);
    }

    //event after terrain change
    $('.cesium-baseLayerPicker-choices').on('click', function(e){
        var db = $(e.target).parent().parent().attr('data-bind');
        if(db == 'foreach: terrainProviderViewModels')
        {
            if($(e.target).parent().attr('title') == 'no-terrain')
            {
                //console.log('no terrain');
                $.webgis.config.zaware = false;
            }
            else
            {
                $.webgis.config.zaware = true;
                //console.log('yes terrain');            
            }
            ReloadCzmlDataSource(viewer, $.webgis.config.zaware, true);
            ReloadModelPosition(viewer);
        }
    });


    if (Cesium.defined(viewer.homeButton)) {
        eventHelper.add(viewer.homeButton.viewModel.command.beforeExecute, function(commandInfo){
            clearTrackedEntity();
        });
        eventHelper.add(viewer.homeButton.viewModel.command.afterExecute, function(commandInfo){
            var extent = GetExtentByCzml();
            FlyToExtent(viewer, {extent:extent});
        });
    }

    //if (Cesium.defined(viewer.geocoder)) {
        //eventHelper.add(viewer.geocoder.viewModel.search.beforeExecute, clearObjects);
    //}

    function ClearTrackedObj(viewer)
    {
        var vm = viewer.homeButton.viewModel;
        var transitioner = vm._transitioner;
        var ellipsoid = viewer.scene.globe.ellipsoid;
        //var ellipsoid = vm._ellipsoid;
        var scene = viewer.scene;
        var mode = scene.mode;
        var controller = scene.screenSpaceCameraController;
        var flightDuration = 1;

        controller.ellipsoid = ellipsoid;
        controller.columbusViewMode = Cesium.CameraColumbusViewMode.FREE;

        var context = scene.context;
        if (Cesium.defined(transitioner) && mode === Cesium.SceneMode.MORPHING) {
            transitioner.completeMorph();
        }
        var flight;
        var description;

        if (mode === Cesium.SceneMode.SCENE2D) {
            scene.camera.flyTo({
                destination : Cesium.Extent.MAX_VALUE,
                duration : flightDuration/1000.0,
                endReferenceFrame : new Cesium.Matrix4( 0, 0, 1, 0,
                                                        1, 0, 0, 0,
                                                        0, 1, 0, 0,
                                                        0, 0, 0, 1)
            });            
        } else if (mode === Cesium.SceneMode.SCENE3D) {
            var defaultCamera = new Cesium.Camera(context);
            
            scene.camera.flyTo({
                destination : defaultCamera.position,
                duration : flightDuration/1000.0,
                up : defaultCamera.up,
                direction : defaultCamera.direction,
                endReferenceFrame : Cesium.Matrix4.IDENTITY
            });            
            
        } else if (mode === Cesium.SceneMode.COLUMBUS_VIEW) {
            scene.camera.flyTo({
                destination : position,
                duration : flightDuration/1000.0,
                up : up,
                direction : direction,
                endReferenceFrame : new Cesium.Matrix4( 0, 0, 1, 0,
                                                        1, 0, 0, 0,
                                                        0, 1, 0, 0,
                                                        0, 0, 0, 1)
            });            
        }
    }

    //function onDynamicCollectionChanged(collection, added, removed) {
        //var length = removed.length;
        //for (var i = 0; i < length; i++) {
            //var removedObject = removed[i];
            //if (viewer.trackedEntity === removedObject) {
                ////viewer.homeButton.viewModel.command();
            //}
            //if (viewer.selectedEntity === removedObject) {
                ////viewer.selectedEntity = undefined;
            //}
        //}
    //}

    //function dataSourceAdded(dataSourceCollection, dataSource) {
        //var entities = dataSource.entities ;//.getDynamicObjectCollection();
        //entities.collectionChanged.addEventListener(onDynamicCollectionChanged);
    //}

    //function dataSourceRemoved(dataSourceCollection, dataSource) {
        //var entities = dataSource.entities ;//.getDynamicObjectCollection();
        //entities.collectionChanged.removeEventListener(onDynamicCollectionChanged);

        //if (Cesium.defined(viewer.trackedEntity)) {
            ////if (entities.getById(viewer.trackedEntity.id) === viewer.trackedEntity) {
                //////viewer.homeButton.viewModel.command();
            ////}
        //}

        //if (Cesium.defined(viewer.selectedEntity)) {
            ////if (entities.getById(viewer.selectedEntity.id) === viewer.selectedEntity) {
                //////viewer.selectedEntity = undefined;
            ////}
        //}
    //}

    //var dataSources = viewer.dataSources;
    //var dataSourceLength = dataSources.length;
    //for (var i = 0; i < dataSourceLength; i++) {
        //dataSourceAdded(dataSources, dataSources.get(i));
    //}

    //eventHelper.add(viewer.dataSources.dataSourceAdded, dataSourceAdded);
    //eventHelper.add(viewer.dataSources.dataSourceRemoved, dataSourceRemoved);
    //var testwheel = function(e1, e2){
    //    console.log(e1);
    //    console.log(e2);
    //};
    viewer.screenSpaceEventHandler.setInputAction(pickAndSelectObject, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    viewer.screenSpaceEventHandler.setInputAction(pickAndTrackObject, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    viewer.screenSpaceEventHandler.setInputAction(moveOverObject, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    //viewer.screenSpaceEventHandler.setInputAction(testwheel, Cesium.ScreenSpaceEventType.WHEEL);

    viewer.trackedEntity = undefined;
    viewer.selectedEntity = undefined;

    //Cesium.knockout.track(viewer, ['trackedEntity', 'selectedEntity']);

    //var knockoutSubscriptions = [];

    //knockoutSubscriptions.push(Cesium.subscribeAndEvaluate(viewer, 'trackedEntity', function(value) {
        //var scene = viewer.scene;
        //var sceneMode = scene.frameState.mode;
        //var isTracking = Cesium.defined(value);
        //if (sceneMode === Cesium.SceneMode.COLUMBUS_VIEW || sceneMode === Cesium.SceneMode.SCENE2D) {
            //scene.screenSpaceCameraController.enableTranslate = !isTracking;
        //}

        //if (sceneMode === Cesium.SceneMode.COLUMBUS_VIEW || sceneMode === Cesium.SceneMode.SCENE3D) {
            //scene.screenSpaceCameraController.enableTilt = !isTracking;
        //}

        //if (isTracking &&  Cesium.defined(value.position)) {
            //entityView = new Cesium.EntityView(value, scene, viewer.scene.globe.ellipsoid);
        //} else {
            //entityView = undefined;
        //}
    //}));

    //knockoutSubscriptions.push(Cesium.subscribeAndEvaluate(viewer, 'selectedEntity', function(value) {
        //if (Cesium.defined(value)) {
            //if (Cesium.defined(infoBoxViewModel)) {
                //infoBoxViewModel.titleText = Cesium.defined(value.name) ? value.name : value.id;
            //}

            //if (Cesium.defined(selectionIndicatorViewModel)) {
                //selectionIndicatorViewModel.animateAppear();
            //}
        //} else {
            //if (Cesium.defined(selectionIndicatorViewModel)) {
                //selectionIndicatorViewModel.animateDepart();
            //}
        //}
    //}));

    //viewer.destroy = Cesium.wrapFunction(viewer, viewer.destroy, function() {
        //eventHelper.removeAll();

        //var i;
        //for (i = 0; i < knockoutSubscriptions.length; i++) {
            //knockoutSubscriptions[i].dispose();
        //}

        //viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        //viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        //var dataSources = viewer.dataSources;
        //var dataSourceLength = dataSources.length;
        //for (i = 0; i < dataSourceLength; i++) {
            //dataSourceRemoved(dataSources, dataSources.get(i));
        //}
    //});
}



function ReloadLinePosition(viewer)
{
    _.forEach($.webgis.data.lines, function(item)
    {
        var color = '#FF0000';
        if(item.properties.voltage == '13')
        {
            color = '#FF0000';
        }
        if(item.properties.voltage == '15')
        {
            color = '#0000FF';
        }
        var g = _.find($.webgis.data.geojsons, {_id:item._id});
        if(g)
        {
            DrawLineModelByLine(viewer, item, 4.0, color, null );
            //DrawBufferOfLine(viewer, 'test', $.webgis.data.lines[k], 1000, 3000, '#FF0000', 0.2);
        }
    });
}

function CheckIsTower(id)
{
    return _.result(_.find($.webgis.data.geojsons, {_id:id}), 'properties.webgis_type') === 'point_tower';
}

function ReloadModelPosition(viewer)
{
    var ellipsoid = viewer.scene.globe.ellipsoid;
    _.forEach($.webgis.data.czmls, function(item)
    {
        var k = item.id;
        if($.webgis.data.gltf_models_mapping[k])
        {
            var t = GetTowerInfoByTowerId(k);
            if(t)
            {
                RemoveSegmentsTower(viewer, t);
                var lng = t.geometry.coordinates[0],
                    lat = t.geometry.coordinates[1],
                    height = t.geometry.coordinates[2],
                    rotate = t.properties.rotate;
                if(!$.webgis.config.zaware) height = 0;
                PositionModel(ellipsoid, $.webgis.data.gltf_models_mapping[k], lng, lat, height, rotate);
            }
        }
    });
}

function GetNeighborTowers(ids)
{
    var ret = [];
    _.forEach(ids, function(id)
    {
        var g = _.find($.webgis.data.geojsons, {_id:id});
        if(g)
        {
            ret.push(g);
        }
    });
    return ret;
}

function GetSegmentPairsByTowTowerId(id0, id1)
{
    var ret = {};
    ret['contact_points'] = [];
    ret['t0'] = 0.9;
    ret['w'] = 0.001;
    
    for(var i in $.webgis.data.segments)
    {
        var seg = $.webgis.data.segments[i];
        if(seg['start_tower'] == id0 && seg['end_tower'] == id1)
        {
            ret['contact_points'] = seg['contact_points'];
            ret['t0'] = seg['t0'];
            ret['w'] = seg['w'];
            break;
        }
    }
    return ret;
}

function GetPhaseColor(phase)
{
    var ret = '#000000';
    if($.webgis.mapping.phase_color_mapping[phase])
    {
        ret = $.webgis.mapping.phase_color_mapping[phase];
    }
    return ret;
}

function GetContactPointByIndex(tower, side, index)
{
    var ret = null;
    for(var i in tower['properties']['model']['contact_points'])
    {
        var cp = tower['properties']['model']['contact_points'][i];
        if(cp['side'] == side && cp['contact_index'] == index)
        {
            ret = cp;
            break;
        }
    }
    return ret;
}

function RemoveSegmentsByType(viewer, webgis_type)
{
    var scene = viewer.scene;
    var remove_one = function()
    {
        var ret = false;
        for(var i in $.webgis.geometry.segments)
        {
            var seg = $.webgis.geometry.segments[i];
            if(seg.webgis_type === webgis_type)
            {
                try{
                    scene.primitives.remove(seg.primitive);
                }catch(e){}
                $.webgis.geometry.segments.splice(i,1);
                ret = true;
                break;
            }
        }
        return ret;
    };
    
    if(webgis_type===undefined)
    {
        scene.primitives.removeAll();
        $.webgis.geometry.segments.length = 0;
    }else
    {
        var ok = remove_one();
        while(ok)
        {
            ok = remove_one();
        }
    }
}

function RemoveSegmentsFromArray(node0, node1)
{
    var ret;
    var id0, id1;
    if(node0['_id'] && node1['_id'])
    {
        id0 = node0['_id'];
        id1 = node1['_id']
    }
    if(node0['id'] && node1['id'])
    {
        id0 = node0['id'];
        id1 = node1['id']
    }
    if(id0 && id1)
    {
        for(var i in $.webgis.geometry.segments)
        {
            var seg = $.webgis.geometry.segments[i];
            if(
                (seg['start'] == id0 && seg['end'] == id1)
            ||     (seg['end'] == id0 && seg['start'] == id1)
            ){
                ret = seg;
                $.webgis.geometry.segments.splice(i,1);
                break;
            }
        }
    }
    return ret;
}

function CheckSegmentsRing(node0, node1)
{
    var find_prev = function(id, list)
    {
        for(var i in list)
        {
            var seg = list[i];
            if(id == seg['end']) return seg['start'];
        }
        return undefined;
    };
    var ret = false;
    var id0, id1;
    if(node0['_id'] && node1['_id'])
    {
        id0 = node0['_id'];
        id1 = node1['_id']
    }
    if(node0['id'] && node1['id'])
    {
        id0 = node0['id'];
        id1 = node1['id']
    }
    if(id0 && id1)
    {
        var prev = id0;
        while(prev)
        {
            oldprev = prev;
            prev = find_prev(oldprev, $.webgis.geometry.segments);
            if(prev && prev == id1)
            {
                ret = true;
                break;
            }
        }
    }
    return ret;
}

function CheckSegmentsExist(node0, node1, webgis_type, callback)
{
    var ret = false;
    var id0, id1;
    if(node0['_id'] && node1['_id'])
    {
        id0 = node0['_id'];
        id1 = node1['_id']
    }
    if(node0['id'] && node1['id'])
    {
        id0 = node0['id'];
        id1 = node1['id']
    }
    if(callback === undefined)
    {
        if(id0 && id1)
        {
            for(var i in $.webgis.geometry.segments)
            {
                var seg = $.webgis.geometry.segments[i];
                if(webgis_type)
                {
                    if(seg['webgis_type'] === webgis_type
                        && ( (seg['start'] == id0 && seg['end'] == id1) || (seg['end'] == id0 && seg['start'] == id1))
                    ) {
                        ret = true;
                        break;
                    }
                }
                else
                {
                    if(
                            (seg['start'] == id0 && seg['end'] == id1)
                        ||     (seg['end'] == id0 && seg['start'] == id1)
                    ) {
                        ret = true;
                        break;
                    }
                }
            }
        }
        return ret;
    }
    else
    {
        var cond = {'db':$.webgis.db.db_name, 'collection':'-', 'action':'check_edge_exist', 'id0':id0, 'id1':id1};
        MongoFind(cond, function(data){
            ret = false;
            if(data.length>0) ret = true;
            callback(ret);
        });
    }
}


function RemoveLineModel(viewer, line_id)
{
    var m;
    var l = [];
    for(var id in $.webgis.geometry.lines)
    {
        if(id.indexOf(line_id) > -1)
        {
            var model = $.webgis.geometry.lines[id];
            l.push({id:id, model:model});
        }
    }
    while(l.length>0)
    {
        var o = l.pop();
        delete $.webgis.geometry.lines[o.id];
        viewer.scene.primitives.remove(o.model);    
    }
}



function RemoveSegmentsBetweenTwoNode(viewer, node0, node1, webgis_type)
{
    var scene = viewer.scene;
    if(CheckSegmentsExist(node0, node1, webgis_type))
    {
        var seg = RemoveSegmentsFromArray(node0, node1);
        if(seg)
        {
            if($.webgis.config.map_backend === 'cesium')
            {
                while(!seg.primitive.isDestroyed())
                {
                    var ret = scene.primitives.remove(seg.primitive);
                }
            }
        }
    }
}

function DrawBufferOfLine1(viewer, buf_id, line, width, height, color, alpha)
{
    var ellipsoid = viewer.scene.globe.ellipsoid;
    //console.log(line);
    var array = SortTowersByTowersPair(line['properties']['towers_pair']);
    //g = GetTowerGeojsonByTowerIdArray(st);
    
    var positions = GetPositions2DByCzmlArray(ellipsoid, array);
    DrawBufferCorridorGeometry(viewer, buf_id, positions, width, height, color, alpha);
}

function DrawBufferOfLine(viewer, buf_id, line, width, height, color, alpha, callback)
{
    var ellipsoid = viewer.scene.globe.ellipsoid;
    var g = _.find($.webgis.data.geojsons, {_id:line._id});
    if(g)
    {
        //var array = SortTowersByTowersPair(line['properties']['towers_pair']);
        //g = GetTowerGeojsonByTowerIdArray(array);
        
        var cond = {'db':$.webgis.db.db_name, 'collection':'-', 'action':'buffer', 'data':g, 'distance':width};
        MongoFind(cond, function(data){
            var array = data[0]['coordinates'];
            if(array.length>0) {
                var positions = GetPositionsByGeojsonCoordinatesArray(ellipsoid, array[0]);
                DrawBufferPolygon(viewer, buf_id, positions, width, height, color, alpha);
            }
            if(callback) callback();
        });
    }
}

function SortTowersByTowersPair(pairlist)
{
    var ret = [];
    var find_prev = function(id, list)
    {
        for(var i in list)
        {
            var pair =  list[i];
            if(id == pair[1]) return pair[0];
        }
        return undefined;
    };
    var find_next = function(id, list)
    {
        var r = []
        for(var i in list)
        {
            var pair =  list[i];
            if(id == pair[0])
            {
                r.push(pair[1]);
            }
        }
        return r;
    };
    
    var find_order_list = function(list,  start, index)
    {
        var l = []
        l.push(start);
        var next = find_next(start, list);
        var startold;
        while(next.length>0)
        {
            if(next.length >= index+1)
            {
                startold = start;
                start = next[index];
                l.push(start);
                var idx = list.indexOf([startold, start]);
                if(idx>-1) list.splice(idx, 1);
                next = find_next(start, list);
            }
            else
            {
                break;
            }
        }
        return l;
    };

    var list  = pairlist.slice();
    
    if(pairlist.length>0)
    {
        pair0 = pairlist[0];
        var oldprev = pair0[0];
        var prev = find_prev(oldprev, list);
        while(prev)
        {
            oldprev = prev;
            prev = find_prev(oldprev, list);
        }
        //console.log(oldprev);
        ret = find_order_list(list,  oldprev, 0);
    }
    return ret;
}

function GetTowerGeojsonByTowerIdArray(array)
{
    var ret = {'type':'LineString', 'coordinates':[]};
    _.forEach(array, function(id)
    {
        var g = _.find($.webgis.data.geojsons, {_id:id});
        if(g)
        {
            ret['coordinates'].push(g.geometry.coordinates);
        }
    });
    return ret;
}
function DrawBufferOfLine2(viewer, buf_id, line, width, height, color, alpha, callback)
{
    var ellipsoid = viewer.scene.globe.ellipsoid;
    var st = SortTowersByTowersPair(line['properties']['towers_pair']);
    g = GetTowerGeojsonByTowerIdArray(st);
    //console.log(g);
        
    var cond = {'db':$.webgis.db.db_name, 'collection':'-', 'action':'buffer', 'data':g, 'distance':width};
    MongoFind(cond, function(data){
        array = data[0]['coordinates'];
        console.log(array[0]);
        var positions = GetPositionsByGeojsonCoordinatesArray(ellipsoid, array[0]);
        DrawBufferPolygon(viewer, buf_id, positions, width, height, color, alpha);
        if(callback) callback();
    });
        
}


function RemoveBuffer(viewer, buf_id)
{
    //for(var i in $.webgis.data.buffers)
    //{
    //    if(i === buf_id)
    //    {
    //        var primitive = $.webgis.data.buffers[i];
    //        viewer.scene.primitives.remove(primitive);
    //        delete $.webgis.data.buffers[i];
    //    }
    //}
    var primitive = _.result(_.find($.webgis.data.buffers, {id:buf_id}), 'primitive');
    if(primitive){
        viewer.scene.primitives.remove(primitive);
    }
    _.remove($.webgis.data.buffers, function(n){
        return n.id === buf_id;
    });
}

function DrawBufferCorridorGeometry(viewer, buf_id, positions, width, height, color, alpha)
{
    RemoveBuffer(viewer, buf_id);
    var ellipsoid = viewer.scene.globe.ellipsoid;
    var rgba = tinycolor(color).toRgb();
    rgba.a = 0.5;
    if(alpha) rgba.a = alpha;
    rgba = 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ',' + rgba.a + ')';
    
    if(!$.webgis.config.zaware) height = 0;
    
    var corridorGeometry = new Cesium.CorridorGeometry({
            positions : positions,
            width : width*2,
            extrudedHeight : height,
            vertexFormat : Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
            cornerType: Cesium.CornerType.ROUNDED
            //cornerType: Cesium.CornerType.BEVELED
            //cornerType: Cesium.CornerType.MITERED
    });
    var primitive = new Cesium.Primitive({
        geometryInstances : new Cesium.GeometryInstance({
            id:    buf_id,
            geometry : corridorGeometry,
            attributes : {
                color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString(rgba))
            }
        }),
        appearance : new Cesium.PerInstanceColorAppearance({
            flat:true,
            closed : true,
            translucent : true,
            //material : Cesium.Material.fromType('Color', {
                //color : Cesium.Color.fromCssColorString(rgba)
            //}),
            renderState : {
                depthTest : {
                    enabled : true
                }
            }
        })
    });
    //console.log(corridorGeometry);
    viewer.scene.primitives.add(primitive);
    $.webgis.data.buffers.push({id:buf_id, primitive: primitive});
}

function DrawBufferPolygon(viewer, buf_id, positions, width, height, color, alpha)
{
    RemoveBuffer(viewer, buf_id);
    var ellipsoid = viewer.scene.globe.ellipsoid;
    var rgba = tinycolor(color).toRgb();
    rgba.a = 0.5;
    if(alpha) rgba.a = alpha;
    rgba = 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ',' + rgba.a + ')';
    
    if(!$.webgis.config.zaware) height = 0;
    
    var geometry = new Cesium.PolygonGeometry.fromPositions({
            positions : positions,
            extrudedHeight : height,
            vertexFormat : Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
    });
    var primitive = new Cesium.Primitive({
        geometryInstances : new Cesium.GeometryInstance({
            id:    buf_id,
            geometry : geometry,
            attributes : {
                color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString(rgba))
            }
        }),
        appearance : new Cesium.PerInstanceColorAppearance({
            flat:true,
            closed : true,
            translucent : true,
            //material : Cesium.Material.fromType('Color', {
                //color : Cesium.Color.fromCssColorString(rgba)
            //}),
            renderState : {
                depthTest : {
                    enabled : true
                }
            }
        })
    });
    //console.log(corridorGeometry);
    viewer.scene.primitives.add(primitive);
    $.webgis.data.buffers.push({id:buf_id, primitive: primitive});
}

function GetPositionsByGeojsonCoordinatesArray(ellipsoid, arr, force2d)
{
    var ret = [];
    for(var i in arr)
    {
        var lng = arr[i][0];
        var lat = arr[i][1];
        var alt = 0;
        if(arr[i].length == 3)
            alt = arr[i][2];
        var pos = [];
        pos.push(lng);
        pos.push(lat);
        if(force2d)
        {
            pos.push(0);
        }else
        {
            if($.webgis.config.zaware)
            {
                pos.push(alt);
            }else
            {
                pos.push(0);
            }
        }
        var carto = Cesium.Cartographic.fromDegrees(pos[0],  pos[1],  pos[2]);
        var p = ellipsoid.cartographicToCartesian(carto);
        ret.push(p);
    }
    return ret;
}

function GetPositionsByCzmlArray(ellipsoid, arr, force2d)
{
    var ret = [];
    _.forEach(arr, function(id)
    {
        var cz = _.find($.webgis.data.czmls, {id:id});
        if(cz)
        {
            var pos = [];
            pos.push(cz.position.cartographicDegrees[0]);
            pos.push(cz.position.cartographicDegrees[1]);
            if(force2d)
            {
                pos.push(0);
            }else
            {
                if($.webgis.config.zaware)
                {
                    pos.push(cz.position.cartographicDegrees[2]);
                }else
                {
                    pos.push(0);
                }
            }
            var carto = Cesium.Cartographic.fromDegrees(pos[0],  pos[1],  pos[2]);
            var p = ellipsoid.cartographicToCartesian(carto);
            ret.push(p);
        }
    });
    return ret;
}
function GetPositions2DByCzmlArray(ellipsoid, arr)
{
    return GetPositionsByCzmlArray(ellipsoid, arr, true);
}


function ReloadEdges(viewer)
{
    //RemoveSegmentsByType(viewer, 'edge_dn');
    _.forEach($.webgis.data.geojsons, function(g)
    {
        if(g && g.properties.webgis_type === 'edge_dn')
        {
            DrawEdgeBetweenTwoNode(viewer, 'edge_dn', g.properties.start, g.properties.end, false);
        }
    });
}

function DrawEdgeBetweenTwoNode(viewer, webgis_type, previd, nextid, fresh)
{
    if(!webgis_type)
    {
        return;
    }
    if($.webgis.config.map_backend === 'cesium')
    {
        var scene = viewer.scene;
        var ellipsoid = viewer.scene.globe.ellipsoid;
        var polylines = new Cesium.PolylineCollection({
            modelMatrix:Cesium.Matrix4.IDENTITY,
            depthTest : false
        });
        var positions = [];
        var czprev = _.find($.webgis.data.czmls, {id:previd});
        if(czprev)
        {
            var a = czprev.position.cartographicDegrees;
            if(!$.webgis.config.zaware) a[2] = 0;
            var carto = Cesium.Cartographic.fromDegrees(a[0], a[1], a[2]);
            var cart3 = ellipsoid.cartographicToCartesian(carto);
            positions.push(cart3);
        }
        var cznext = _.find($.webgis.data.czmls, {id:nextid});
        if(cznext)
        {
            var a = cznext.position.cartographicDegrees;
            if(!$.webgis.config.zaware) a[2] = 0;
            var carto = Cesium.Cartographic.fromDegrees(a[0], a[1], a[2]);
            var cart3 = ellipsoid.cartographicToCartesian(carto);
            positions.push(cart3);
        }
        var color = Cesium.Color.fromCssColorString("rgba(255,255,0,1)");
        if(!fresh) color = Cesium.Color.fromCssColorString("rgba(200,200,0,1)");
        var polyline = polylines.add({
            positions : positions,
            material : Cesium.Material.fromType('PolylineArrow', {
            //material : Cesium.Material.fromType('Color', {
                color : color
            }),
            width : 10.0,
            id:{ properties:{'start':previd, 'end':nextid, webgis_type:'edge_dn'}}
        });
        scene.primitives.add(polylines);
        $.webgis.geometry.segments.push({'start':previd, 'end':nextid, 'primitive':polylines, webgis_type:webgis_type, properties:{'start':previd, 'end':nextid, webgis_type:webgis_type}});
    }
    if($.webgis.config.map_backend === 'leaflet')
    {
        var g1 = _.find($.webgis.data.geojsons, {_id:previd});
        var g2 = _.find($.webgis.data.geojsons, {_id:nextid});
        if(g1 && g2)
        {
            var c1 = get_geojson_center(g1);
            var c2 = get_geojson_center(g2);
            if(c1.length>0 && c2.length>0)
            {
                var latlng1 = L.latLng(c1[1], c1[0]);
                var latlng2 = L.latLng(c2[1], c2[0]);
                var o = {start:previd, end:nextid, webgis_type:webgis_type, properties:{start:previd, end:nextid, webgis_type:webgis_type}};
                $.webgis.geometry.segments.push(o);
                return [latlng1, latlng2];
            }
        }
        
    }
}

function DrawSegmentsBetweenTwoTower(viewer, tower0, tower1, prev_len, next_len, exist)
{
    
    var scene = viewer.scene;
    if(tower0 && tower1 && !CheckSegmentsExist(tower0, tower1, 'edge_tower'))
    {
        var ellipsoid = scene.globe.ellipsoid;
        var lng0 = tower0['geometry']['coordinates'][0],
            lat0 = tower0['geometry']['coordinates'][1],
            height0 = tower0['geometry']['coordinates'][2],
            rotate0 = Cesium.Math.toRadians(tower0['properties']['rotate'] - 90),
            lng1 = tower1['geometry']['coordinates'][0],
            lat1 = tower1['geometry']['coordinates'][1],
            height1 = tower1['geometry']['coordinates'][2],
            rotate1 = Cesium.Math.toRadians(tower1['properties']['rotate'] - 90);
        
        if(!$.webgis.config.zaware)
        {
            height0 = 0;
            height1 = 0;
        }else
        {
            //var h0 = viewer.scene.globe.getHeight(Cesium.Cartographic.fromDegrees(lng0,  lat0));
            //if(h0 && h0>0) height0 = h0;
            //var h1 = viewer.scene.globe.getHeight(Cesium.Cartographic.fromDegrees(lng1,  lat1));
            //if(h1 && h1>0) height1 = h1;
        
        }

        var cart3_0 = ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(lng0, lat0, height0));
        var    modelMatrix_0 = Cesium.Transforms.eastNorthUpToFixedFrame(cart3_0);
        var    quat_0 = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Z, rotate0);
        var    rot_mat3_0 = Cesium.Matrix3.fromQuaternion(quat_0);
        
        var cart3_1 = ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(lng1, lat1, height1));
        var    modelMatrix_1 = Cesium.Transforms.eastNorthUpToFixedFrame(cart3_1);
        var    quat_1 = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Z, rotate1);
        var    rot_mat3_1 = Cesium.Matrix3.fromQuaternion(quat_1);
        
        
        var obj = GetSegmentPairsByTowTowerId(tower0['_id'], tower1['_id']);
        var t0 = obj['t0'];
        //console.log(t0);
        var w = obj['w'];
        var arr = obj['contact_points'];
        var segpairs = [];
        //var counter = {};
        for(var i in arr)
        {
            var key = arr[i].start + '-' + arr[i].end;
            //if(!counter[key]) 
                //counter[key] = 1;
            //counter[key] += 1;
            if(!exist[tower0['_id']]) exist[tower0['_id']] = [];
            if(exist[tower0['_id']].indexOf(key)<0)
            {
                exist[tower0['_id']].push(key);
                segpairs.push(arr[i]);
            }
        }
        //console.log(tower0['_id']  + '-' + tower1['_id'] );
        
        var polylines = new Cesium.PolylineCollection({
            modelMatrix:Cesium.Matrix4.IDENTITY,
            depthTest : false
        });
        
        
        for(var i in segpairs)
        {
            var pair = segpairs[i];
            var cp0 = GetContactPointByIndex(tower0, 0, pair['start']);
            var    cp1 = GetContactPointByIndex(tower1, 1, pair['end']);
            var color = Cesium.Color.fromCssColorString(GetPhaseColor(pair['phase']));
            
            
            if(cp0 && cp1)
            {
                var tran_vec3_0 = new Cesium.Cartesian3(cp0['x'], cp0['z'], cp0['y']);
                var mat4_0 = Cesium.Matrix4.fromRotationTranslation(rot_mat3_0, Cesium.Cartesian3.ZERO);
                mat4_0 = Cesium.Matrix4.multiplyByTranslation(mat4_0, tran_vec3_0, mat4_0);
                var m_0 = Cesium.Matrix4.multiplyTransformation(modelMatrix_0, mat4_0, mat4_0);
                
                
                var tran_vec3_1 = new Cesium.Cartesian3(cp1['x'], cp1['z'], cp1['y']);
                var mat4_1 = Cesium.Matrix4.fromRotationTranslation(rot_mat3_1, Cesium.Cartesian3.ZERO);
                mat4_1 = Cesium.Matrix4.multiplyByTranslation(mat4_1, tran_vec3_1, mat4_1);
                var m_1 = Cesium.Matrix4.multiplyTransformation(modelMatrix_1, mat4_1, mat4_1);

                var p0 = Cesium.Matrix4.getTranslation(m_0, m_0),
                    p1 = Cesium.Matrix4.getTranslation(m_1, m_1);
                
                var positions = CalcCatenary(ellipsoid, p0, p1, 15, t0, w);
                var polyline = polylines.add({
                    positions : positions,
                    material : Cesium.Material.fromType('Color', {
                        color : color,
                        translucent:true
                    }),
                    width : 1.0
                });
            }
        }
        
        scene.primitives.add(polylines);
        $.webgis.geometry.segments.push({'start':tower0['_id'], 'end':tower1['_id'], 'primitive':polylines, webgis_type:'edge_tower', properties:{'start':tower0['_id'], 'end':tower1['_id'], webgis_type:'edge_tower'}});
    }
    return exist;
}

function CalcCatenary(ellipsoid, p0, p1, segnum, t0, w)
{
    var ret = [];
    if($.webgis.config.use_catenary)
    {
        //var l = MathLib.sqrt((p0.x-p1.x)*(p0.x-p1.x) + (p0.y-p1.y)*(p0.y-p1.y));
        //var h = p1.z - p0.z;
        //var step = l/segnum;
        //var dx = (p1.x-p0.x)/segnum,
            //dy = (p1.y-p0.y)/segnum;
        
        //for(var i=0; i<=segnum; i++)
        //{
            //var z = get_z(l, h, p0.z, i*step, 0.7, 0.001);
            //var p = new Cesium.Cartesian3(p0.x + i * dx,  p0.y + i * dy,  z);
            //ret.push(p);
        //}
        var carto0 = ellipsoid.cartesianToCartographic(p0);
        var carto1 = ellipsoid.cartesianToCartographic(p1);
        //var l = MathLib.sqrt((carto0.longitude-carto1.longitude)*(carto0.longitude-carto1.longitude) + (carto0.latitude-carto1.latitude)*(carto0.latitude-carto1.latitude));
        var l = MathLib.sqrt((p0.x-p1.x)*(p0.x-p1.x) + (p0.y-p1.y)*(p0.y-p1.y));
        var h = carto1.height - carto0.height;
        var step = l/segnum;
        var dx = (carto1.longitude-carto0.longitude)/segnum,
            dy = (carto1.latitude-carto0.latitude)/segnum;
        
        for(var i=0; i<=segnum; i++)
        {
            var z = get_z(l, h, carto0.height, i*step, t0, w);
            var carto = new Cesium.Cartographic(carto0.longitude + i * dx,  carto0.latitude + i * dy,  z);
            var p = ellipsoid.cartographicToCartesian(carto);
            ret.push(p);
        }
    }else
    {
        ret = [    p0,p1];
    }
    return ret;
}


function RemoveSegmentsTower(viewer, tower)
{
    var scene = viewer.scene;
    var arr = GetPrevNextTowerIds(tower);

    var prev_towers = GetNeighborTowers(arr[0]);
    var next_towers = GetNeighborTowers(arr[1]);
    //console.log(prev_towers);
    //console.log(next_towers);
    for(var i in prev_towers)
    {
        var t = prev_towers[i];
        RemoveSegmentsBetweenTwoNode(viewer, t, tower, 'edge_tower');
    }
    for(var i in next_towers)
    {
        var t = next_towers[i];
        RemoveSegmentsBetweenTwoNode(viewer, tower, t, 'edge_tower');
    }
}

function GetPrevNextTowerIds(tower)
{
    var prevs = [];
    var nexts = [];
    _.forEach($.webgis.data.lines, function(item)
    {
        var towersid = item.properties.nodes;
        var j = 0;
        for(j=0; j<towersid.length; j++)
        {
            var tid = towersid[j];
            if(tid === tower['_id'])
            {
                if(j+1<towersid.length)
                {
                    var id = towersid[j+1];
                    if(nexts.indexOf(id)<0)
                    {
                        nexts.push(id);
                    }
                }
                if(j>0)
                {
                    var id = towersid[j-1];
                    if(prevs.indexOf(id)<0)
                    {
                        prevs.push(id);
                    }
                }
            }
        }
    });
    return [prevs, nexts];
}



function DrawSegmentsByTower(viewer, tower)
{
    //console.log(viewer);
    var scene = viewer.scene;
    var arr = GetPrevNextTowerIds(tower);
    var prev_towers = GetNeighborTowers(arr[0]);
    var next_towers = GetNeighborTowers(arr[1]);
    var lng = parseFloat($('#form_tower_info_base').webgisform('get','lng').val()),
        lat = parseFloat($('#form_tower_info_base').webgisform('get','lat').val()),
        height = parseFloat($('#form_tower_info_base').webgisform('get','alt').val()),
        rotate = parseFloat($('#form_tower_info_base').webgisform('get','rotate').val());
        
        
    if($.isNumeric(lng) && $.isNumeric(lat) && $.isNumeric(height) && $.isNumeric(rotate))
    {
        var tt = {};
        tt['_id'] = tower['_id'];
        tt['geometry'] = {};
        tt['geometry']['coordinates'] = [lng, lat, height];
        tt['properties'] = {};
        tt['properties']['rotate'] = rotate;
        tt['properties']['model'] = tower['properties']['model'];
        var exist = {};
        for(var i in prev_towers)
        {
            var t = prev_towers[i];
            exist = DrawSegmentsBetweenTwoTower(viewer, t, tt, prev_towers.length, 1, exist);
        }
        for(var i in next_towers)
        {
            var t = next_towers[i];
            exist = DrawSegmentsBetweenTwoTower(viewer, tt, t, 1, next_towers.length, exist);
        }
    }
}


function CheckTowerInfoModified()
{
    if(true)
    {
        return true;
    }
    var idobj = $('#form_tower_info_base').webgisform('get','id');
    if(idobj === undefined)
    {
        return false;
    }
    var id = idobj.val();
    var tower = GetTowerInfoByTowerId(id);
    if(tower)
    {
        var lng = parseFloat($('#form_tower_info_base').webgisform('get','lng').val()),
            lat = parseFloat($('#form_tower_info_base').webgisform('get','lat').val()),
            height = parseFloat($('#form_tower_info_base').webgisform('get','alt').val()),
            rotate = parseFloat($('#form_tower_info_base').webgisform('get','rotate').val());
        var mc = $('#form_tower_info_base').webgisform('get','model_code').val();
        if(lng != tower['geometry']['coordinates'][0].toFixed(6)
        || lat != tower['geometry']['coordinates'][1].toFixed(6)
        || height != tower['geometry']['coordinates'][2].toFixed(0)
        || rotate != tower['properties']['rotate']
        || mc != tower['properties']['model']['model_code']
        )
        {
            return true;
        }
        
        var ddd = $('#form_tower_info_base').webgisform('getdata');
        for(var k in tower['properties'])
        {
            //if(ddd[k])
            //if($('#form_tower_info_base').webgisform('get', k).length)
            //{
                //var v = $('#form_tower_info_base').webgisform('get', k).val();
                //if(v && tower['properties'][k] && v != tower['properties'][k] )
                //{
                    //return true;
                //}
            //}
        }
    }
    return false;
}
function DeleteRole(viewer, id, callback)
{
    var cond = {'db':$.webgis.db.db_name, 'collection':'sysrole', 'action':'remove', '_id':id};
    ShowProgressBar(true, 670, 200, '删除中', '正在删除数据，请稍候...');
    MongoFind(cond, function(data1){
        ShowProgressBar(false);
        if(data1.length>0)
        {
            if(data1[0]['ok'] === 0) {
                ShowMessage(null, 400, 250, '删除失败', '');
            } else {
                $.jGrowl("删除成功", {
                    life: 2000,
                    position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                    theme: 'bubblestylesuccess',
                    glue: 'before'
                });
                if (callback) callback();
            }
        }
    });
}
function DeleteUser(viewer, id, callback)
{
    var cond = {'db':$.webgis.db.db_name, 'collection':'userinfo', 'action':'remove', '_id':id};
    ShowProgressBar(true, 670, 200, '删除中', '正在删除数据，请稍候...');
    MongoFind(cond, function(data1){
        ShowProgressBar(false);
        if(data1.length>0)
        {
            if(data1[0]['ok'] === 0) {
                ShowMessage(null, 400, 250, '删除失败', '');
            } else {
                $.jGrowl("删除成功", {
                    life: 2000,
                    position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                    theme: 'bubblestylesuccess',
                    glue: 'before'
                });
                if (callback) callback();
            }
        }
    });
}


function DeleteLine(viewer, id, callback)
{
    var cond = {'db':$.webgis.db.db_name, 'collection':'network', 'action':'remove', '_id':id};
    ShowProgressBar(true, 670, 200, '删除保存中', '正在删除数据，请稍候...');
    MongoFind(cond, function(data1){
        ShowProgressBar(false);
        if(data1.length>0)
        {
            if(data1[0]['ok'] === 0)
            {
                var msg = ''
                if(data1[0]['err'] === 'nodes_exist')
                {
                    msg = '该线路工程或网络中还存在杆塔或其他类型的结点，请先将这些结点删除完全后再进行删除操作。';
                }
                ShowMessage(null, 400, 250, '无法删除', msg);
                //$.jGrowl("删除失败:" + data1[0]['err'], { 
                    //life: 2000,
                    //position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                    //theme: 'bubblestylefail',
                    //glue:'before'
                //});
            }
            else
            {
                $.jGrowl("删除成功", { 
                    life: 2000,
                    position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                    theme: 'bubblestylesuccess',
                    glue:'before'
                });
                if(callback) callback();
            }
        }
    });
}

function SaveLine(viewer, id, callback)
{
    var data = {};
    if(id)
    {
        data['_id'] = id;
    }else
    {
        data['_id'] = null;
    }
    var prop = $('#form_line_info').webgisform('getdata');
    data['properties'] = {};
    data['properties']['webgis_type'] = 'polyline_line';
    for(var k in prop)
    {
        data['properties'][k] = prop[k];
    }
    if(data['properties']['nodes'] === undefined)
    {
        data['properties']['nodes'] = [];
    }
    var cond = {'db':$.webgis.db.db_name, 'collection':'network', 'action':'save', 'data':data};
    ShowProgressBar(true, 670, 200, '保存中', '正在保存数据，请稍候...');
    MongoFind(cond, function(data1){
        ShowProgressBar(false);
        if(data1.length>0)
        {
            if(data1[0].result)
            {
                $.jGrowl("保存失败" + data1[0].result, { 
                    life: 2000,
                    position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                    theme: 'bubblestylefail',
                    glue:'before'
                });
                ShowMessage(null, 400, 200, '保存出错','保存出错:' + data1[0].result);
            }
            else
            {
                $.jGrowl("保存成功", {
                    life: 2000,
                    position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                    theme: 'bubblestylesuccess',
                    glue:'before'
                });
                if(callback) callback(data1);
            }
        }
    });
}
function SaveTower(viewer)
{
    if($.webgis.select.selected_geojson)
    {
        var data = $('#form_tower_info_base').webgisform('getdata');
        for(var k in data)
        {
            if(k === 'alt'
            || k === 'id'
            || k === 'lng'
            || k === 'lat'
            || k === 'model_code'
            ){
                if(k === 'alt')
                {
                    $.webgis.select.selected_geojson.geometry.coordinates[2] = parseInt(data[k]);
                }
                else if(k === 'lng')
                {
                    $.webgis.select.selected_geojson.geometry.coordinates[0] = parseFloat(data[k]);
                }
                else if(k === 'lat')
                {
                    $.webgis.select.selected_geojson.geometry.coordinates[1] = parseFloat(data[k]);
                }
                else
                {
                    continue;
                }
            }
            if($.webgis.select.selected_geojson.properties[k] === undefined)
            {}
            else
            {
                $.webgis.select.selected_geojson.properties[k] = data[k];
            }
        }
        var items = $("#listbox_tower_info_metal").ligerListBox().getSelectedItems();
        if(items && items[0])
        {
            var formdata = $('#form_tower_info_metal').webgisform('getdata');
            //console.log(formdata);
            //var idx = items[0].idx - 1;
            //if($.webgis.select.selected_geojson.properties.metals && $.webgis.select.selected_geojson.properties.metals.length>idx)
            //{
            //    $.webgis.select.selected_geojson.properties.metals[idx] = formdata;
            //}
            var m = _.find($.webgis.select.selected_geojson.properties.metals, {imei:formdata.imei});
            var idx = _.indexOf($.webgis.select.selected_geojson.properties.metals, m);
            if(m && idx>-1){
                $.webgis.select.selected_geojson.properties.metals[idx] = formdata;
            }
        }
        //console.log($.webgis.select.selected_geojson);
        //if(true) return;
        SavePoi($.webgis.select.selected_geojson, function(data1){
            //console.log(data1);
            if(data1 && data1.length>0)
            {
                if(data1[0].result)
                {
                    return;
                }
                $.webgis.control.drawhelper.clearPrimitive();
                $('#dlg_tower_info').dialog( "close" );
                ClearSelectEntity();
                _.forEach(data1, function(geojson)
                {
                    var id = geojson._id;
                    var idx = _.findIndex($.webgis.data.geojsons, '_id', id);
                    if(idx>-1){
                        $.webgis.data.geojsons[idx] = geojson; //AddTerrainZOffset(geojson);
                    }else{
                        $.webgis.data.geojsons.push(geojson);
                    }

                    
                    if($.webgis.config.map_backend === 'cesium')
                    {
                        var idx = _.findIndex($.webgis.data.czmls, 'id', id);
                        if(idx > -1){
                            $.webgis.data.czmls[idx] = CreateCzmlFromGeojson(geojson);
                        }else{
                            $.webgis.data.czmls.push(CreateCzmlFromGeojson(geojson));
                        }
                        if(geojson.properties && geojson.properties.model)
                        {
                            LoadTowerModelByTower(viewer, geojson);
                            RemoveSegmentsTower(viewer, geojson);
                            DrawSegmentsByTower(viewer, geojson);
                        }
                    }
                });
                if($.webgis.config.map_backend === 'cesium')
                {
                    ReloadCzmlDataSource(viewer, $.webgis.config.zaware);
                }
            }
        });
    }
}

function SavePoi(data, callback)
{
    //console.log(data);
    //data = RemoveTerrainZOffset(data);
    if(data.point)
    {
        delete data.point;
    }
    if(data.polyline)
    {
        delete data.polyline;
    }
    if(data.polygon)
    {
        delete data.polygon;
    }
    if(data.id)
    {
        delete data.id;
    }
    if(data.type === undefined)
    {
        data.type = 'Feature';
    }
    var cond = {'db':$.webgis.db.db_name, 'collection':'features', 'action':'save', 'data':data};
    ShowProgressBar(true, 670, 200, '保存中', '正在保存数据，请稍候...');
    MongoFind(cond, function(data1){
        ShowProgressBar(false);
        if(data1.length>0)
        {
            if(data1[0].result)
            {
                //ShowMessage(null, 400, 200, '错误','保存出错:' + data1.result, callback);
                $.jGrowl("保存失败" + data1[0].result, { 
                    life: 2000,
                    position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                    theme: 'bubblestylefail',
                    glue:'before'
                });
            }
            else
            {
                $.jGrowl("保存成功", { 
                    life: 2000,
                    position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                    theme: 'bubblestylesuccess',
                    glue:'before'
                });
            }
        }
        if(callback) callback(data1);
    });
}



function ShowTowerInfo(viewer, id)
{
    var tower = GetTowerInfoByTowerId(id);
    if(tower)
    {
        $.webgis.select.selected_geojson = $.extend(true, {}, tower);
        FilterModelList('');
        ShowTowerInfoDialog(viewer, $.webgis.select.selected_geojson);
        if($.webgis.config.map_backend === 'cesium')
        {
            LoadTowerModelByTower(viewer, $.webgis.select.selected_geojson);
            DrawSegmentsByTower(viewer, $.webgis.select.selected_geojson);
        }
    }
    else
    {
        delete $.webgis.select.selected_geojson;
        $.webgis.select.selected_geojson = undefined;
    }

}

function UpdateFotoramaSlider(div_id, bindcollection, key, buttons)
{
    //var width = parseInt($('#' + div_id).css('width').replace('px', ''));
    //var height = parseInt($('#' + div_id).css('height').replace('px', ''));
    var width = $('#' + div_id).width();
    var height = $('#' + div_id).height();
    
    //console.log('width:' + width + ',height:' + height);
    var container_id = div_id + '_container';
    var toggle_id =  'div_' + div_id + '_toggle_view_upload';    
    var data = {op:'gridfs', db:$.webgis.db.db_name, width:64, height:64, bindcollection:bindcollection, key:key};
    GridFsFind(data, function(data1){
        if($.webgis.control.image_slider_fotorama)
        {
            $.webgis.control.image_slider_fotorama.destroy();
            delete $.webgis.control.image_slider_fotorama;
            $.webgis.control.image_slider_fotorama = undefined;
        }
        $('#' + container_id).empty();
        var img_data = [];
        for (var i in data1)
        {
            var item = { 
                id: data1[i]._id, 
                _id: data1[i]._id, 
                img:'/get?op=gridfs&db=' + $.webgis.db.db_name + '&_id=' + data1[i]._id , 
                full:'/get?op=gridfs&db=' + $.webgis.db.db_name + '&_id=' + data1[i]._id , 
                thumb:'data:' + data1[i].mimetype + ';base64,' + data1[i].data, 
                caption: data1[i].filename,
                filename:data1[i].filename,
                data:data1[i].data,
                mimetype:data1[i].mimetype,
                description:data1[i].description
            };
            img_data.push(item);
        }
        if(data1.length==0)
        {
            var s = '';
            s += '<div style="text-align: center;vertical-align: middle;line-height: 400px;">';
            s += '    无照片';
            s += '</div>';
            $('#' + container_id).html(s);
        }
        
        if(!$.webgis.control.image_slider_fotorama)
        {
            var options = {
                allowfullscreen: true,
                width: width,
                height:height - 100,
                margin:0,
                nav:'thumbs',
                navposition:'bottom',
                thumbwidth:64,
                thumbheight:64,
                thumbmargin:0,
                thumbborderwidth:0,
                fit:'scaledown', //contain, cover, scaledown, none
                thumbfit:'scaledown', //contain, cover, scaledown, none
                transition:'slide', //slide, crossfade, dissolve
                clicktransition:'slide',
                transitionduration:200,
                startindex:0,
                loop:false,
                autoplay:false,//10000,
                stopautoplayontouch:true,
                keyboard:false,
                arrows:true,
                click:false,
                direction:'ltr',
                hash:true,
                data:img_data
            };
            if(data1.length>0)
            {
                var $fotoramaDiv = $('#' + container_id).fotorama(options);
                $.webgis.control.image_slider_fotorama = $fotoramaDiv.data('fotorama');
            }
        }
        if(buttons instanceof Array && buttons.length>0)
        {
            //console.log();
            AddButtonToFotorama(container_id, $.webgis.control.image_slider_fotorama, buttons);
        }
        ShowProgressBar(false);
    });

}

function UpdateJssorSlider(div_id, bindcollection, key)
{
    var width = parseInt($('#' + div_id).css('width').replace('px', ''));
    var height = parseInt($('#' + div_id).css('height').replace('px', ''));
    var container_id = div_id + '_container';
    var toggle_id =  'div_' + div_id + '_toggle_view_upload';    
    var data = {op:'gridfs', db:$.webgis.db.db_name, width:150, height:150, bindcollection:bindcollection, key:key};
    GridFsFind(data, function(data1){
        if($.webgis.control.image_slider_fotorama)
        {
            delete $.webgis.control.image_slider_fotorama;
            $.webgis.control.image_slider_fotorama = undefined;
            $.webgis.data.image_thumbnail_tower_info.length = 0;
        }
        $.webgis.data.image_thumbnail_tower_info = data1;
        $('#' + container_id).empty();
        var s = '';
        if(data1.length>0)
        {
            s += '\
            <div u="loading" style=" position: absolute; top: 0px; left: 0px;">\
                <div style="filter: alpha(opacity=70); opacity:0.7; position: absolute; display: block;\
                    background-color: #000; top: 0px; left: 0px;width: ' + width + 'px;height:' + height + 'px;">\
                </div>\
                <div style="position: absolute; display: block; background: url(img/loading.gif) no-repeat center center;\
                    top: 0px; left: 0px;width: ' + width + 'px;height:' + (height-80) + 'px;">\
                </div>\
            </div>\
            ';
        }
        s += '<div u="slides" style="cursor: default; position: absolute; left: 0px; top: 0px; width: ' + (width-20) + 'px; height: ' + (height-80) + 'px; overflow: hidden;">';
        for (var i in data1)
        {
            s += '\
            <div >\
                <img u="image" style="width: ' + (width-20) + 'px; height: ' + (height-80) + 'px;" id="' + data1[i]._id + '" src="get?op=gridfs&db=' + $.webgis.db.db_name + '&_id=' + data1[i]._id + '" >\
                <img u="thumb" src="data:' + data1[i].mimetype + ';base64,' + data1[i].data + '" >\
            </div>\
            ';
        }
        if(data1.length==0)
        {
            s += '<div style="text-align: center;vertical-align: middle;line-height: 300px;">';
            s += '    <img u="image" style="display:none;"  src="">';
            s += '    <img u="thumb" style="display:none;"  src="">';
            s += '    无照片';
            s += '</div>';
        }
        
        s += '</div>\
        <div u="thumbnavigator" class="jssort07" style="position: absolute; width: ' + width + 'px; height: 100px; left: 0px; bottom: 0px; overflow: hidden; ">\
            <div style=" background-color: #000; filter:alpha(opacity=30); opacity:.3; width: 90%; height:100%;"></div>\
            <div u="slides" style="cursor: default;">\
                <div u="prototype" class="p" style="position: absolute; width: 99px; height: 66px; top: 0; left: 0;">\
                    <thumbnailtemplate class="i" style="position:absolute;"></thumbnailtemplate>\
                    <div class="o">\
                    </div>\
                </div>\
            </div>\
            <span u="arrowleft" class="jssora11l" style="width: 37px; height: 37px; top: 123px; left: 8px;">\
            </span>\
            <span u="arrowright" class="jssora11r" style="width: 37px; height: 37px; top: 123px; right: 8px">\
            </span>\
        </div>\
        ';
        $('#' + container_id).append(s);
        
        if(!$.webgis.control.image_slider_fotorama)
        {
            var options = {
                $AutoPlay: true,                                    //[Optional] Whether to auto play, to enable slideshow, this option must be set to true, default value is false
                $AutoPlayInterval: 10000,                            //[Optional] Interval (in milliseconds) to go for next slide since the previous stopped if the slider is auto playing, default value is 3000
                $SlideDuration: 500,                                //[Optional] Specifies default duration (swipe) for slide in milliseconds, default value is 500
                $DragOrientation: 3,                                //[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 either, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $DisplayPieces is greater than 1, or parking position is not 0)

                $ArrowNavigatorOptions: {
                    $Class: $JssorArrowNavigator$,              //[Requried] Class to create arrow navigator instance
                    $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
                    $AutoCenter: 2,                                 //[Optional] Auto center arrows in parent container, 0 No, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
                    $Steps: 1                                       //[Optional] Steps to go for each navigation request, default value is 1
                },
                $ThumbnailNavigatorOptions: {
                    $Class: $JssorThumbnailNavigator$,              //[Required] Class to create thumbnail navigator instance
                    $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always

                    $Loop: 2,                                       //[Optional] Enable loop(circular) of carousel or not, 0: stop, 1: loop, 2 rewind, default value is 1
                    $SpacingX: 3,                                   //[Optional] Horizontal space between each thumbnail in pixel, default value is 0
                    $SpacingY: 3,                                   //[Optional] Vertical space between each thumbnail in pixel, default value is 0
                    $DisplayPieces: 6,                              //[Optional] Number of pieces to display, default value is 1
                    $ParkingPosition: 204,                         //[Optional] The offset position to park thumbnail,

                    $ArrowNavigatorOptions: {
                        $Class: $JssorArrowNavigator$,              //[Requried] Class to create arrow navigator instance
                        $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
                        $AutoCenter: 2,                                 //[Optional] Auto center arrows in parent container, 0 No, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
                        $Steps: 1                                       //[Optional] Steps to go for each navigation request, default value is 1
                    }
                }
            };
            if(data1.length>0)
            {
                $.webgis.control.image_slider_fotorama = new $JssorSlider$(container_id , options);
            }
        }
        ShowProgressBar(false);
        //responsive code begin
        //you can remove responsive code if you don't want the slider scales while window resizes
        function ScaleSlider() {
            //console.log($('#tower_info_photo').css('width'));
            if($.webgis.control.image_slider_fotorama)
            {
                var parentWidth = $.webgis.control.image_slider_fotorama.$Elmt.parentNode.parentNode.parentNode.parentNode.clientWidth;
                //console.log(parentWidth);
                if (parentWidth)
                {
                    //$('#tower_info_photo_container').css('width', parentWidth)
                    //$.webgis.control.image_slider_fotorama.$SetScaleWidth(Math.min(parentWidth, 550));
                    var w = parentWidth - 20;
                    $.webgis.control.image_slider_fotorama.$SetScaleWidth(w );
                    $('#' + toggle_id).css('width', (w-20) + 'px' );
                }
            }
            //else
                //window.setTimeout(ScaleSlider, 30);
        }

        //ScaleSlider();

        //if (!navigator.userAgent.match(/(iPhone|iPod|iPad|BlackBerry|IEMobile)/)) {
            //$(window).bind('resize', ScaleSlider);
        //}

        
        //if (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
        //    $(window).bind("orientationchange", ScaleSlider);
        //}
        //responsive code end

    });

}
function UpdateFileUploader(div_id)
{
    var width = parseInt($('#' + div_id).css('width').replace('px', ''));
    var height = parseInt($('#' + div_id).css('height').replace('px', ''));
    
    var upload_id = 'div_' + div_id + '_uploader'
    var form_id = 'form_' + div_id + '_uploader_form';
    try{
        $('#' + form_id).fileupload('destroy');
    }catch(e){}
    $('#' + upload_id).empty();
    $('#' + upload_id).append(
    '\
        <form id="' + form_id + '"  method="POST"  enctype="multipart/form-data">\
            <div class="row fileupload-buttonbar" >\
                <div class="col-lg-7" >\
                    <!-- The fileinput-button span is used to style the file input field as button -->\
                    <span class="btn-success fileinput-button" >\
                        <!--<i class="glyphicon glyphicon-plus"></i>-->\
                        <span >选择文件...</span>\
                        <input type="file" name="files[]">  <!--multiple-->\
                    </span>\
                    <!--<button type="submit" class="btn btn-primary start">-->\
                        <!--<!--<i class="glyphicon glyphicon-upload"></i>-->\
                        <!--<span>上传</span>-->\
                    <!--</button>-->\
                    <!--<button type="reset" class="btn btn-warning cancel">-->\
                        <!--<!--<i class="glyphicon glyphicon-ban-circle"></i>-->\
                        <!--<span>取消</span>-->\
                    <!--</button>-->\
                    <!--<button type="button" class="btn btn-danger delete">-->\
                        <!--<!--<i class="glyphicon glyphicon-trash"></i>-->\
                        <!--<span>删除</span>-->\
                    <!--</button>-->\
                    <!--<input type="checkbox" class="toggle">-->\
                    <span class="fileupload-process"></span>\
                </div>\
                <div class="col-lg-5 fileupload-progress fade">\
                    <!-- The global progress bar -->\
                    <div class="progress progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="display:none;width:90%;height:5px;margin:10px;">\
                        <div class="progress-bar progress-bar-success" style="width:0%;"></div>\
                    </div>\
                    <div class="progress-extended">&nbsp;</div>\
                </div>\
            </div>\
            <table role="presentation" class="table table-striped"><tbody class="files"></tbody></table>\
        </form>    \
    '
    );
}


function DestroyFileUploader(div_id)
{
    $('#form_' + div_id + '_uploader_form').fileupload('destroy');
    $('#div_' + div_id + '_uploader').empty();
    if($.webgis.control.image_slider_fotorama)
    {
        delete $.webgis.control.image_slider_fotorama;
        $.webgis.control.image_slider_fotorama = undefined;
        $('#' + div_id + '_container').empty();
        $.webgis.data.image_thumbnail_tower_info.length = 0;
    }
    delete $.webgis.select.selected_geojson;
    $.webgis.select.selected_geojson = undefined;
}


function AddButtonToFotorama(container_id, control, options)
{
    var stage = $('#' + container_id).find('div[class=fotorama__stage]');
    if(stage.length > 0 && control)
    {
        $.each(options, function(i, opt){
            $(stage[0]).append('<div class="' + opt.className + '" title="' + opt.title + '"></div>');
            $(stage[0]).find('div.' + opt.className ).off();
            $(stage[0]).find('div.' + opt.className ).on('click', function(){
                opt.click(control.activeFrame);
            });
        });
    }
}


function ShowTowerInfoDialog(viewer, tower)
{

    var title = '';
    title = tower['properties']['name'];
    var buttons = [];
    if($.webgis.config.map_backend === 'cesium')
    {
        buttons.push({
            text: "锁定视角", 
            click: function(e){
                $.webgis.config.is_tower_focus = !$.webgis.config.is_tower_focus;
                var selectedEntity = viewer.selectedEntity;
                if($.webgis.config.is_tower_focus)
                {
                    $(e.target).css('background-color', '#00AA00');
                    $(e.target).html('解除锁定');
                    
                    if (Cesium.defined(selectedEntity)) 
                    {
                        viewer.trackedEntity = selectedEntity;
                        var id = selectedEntity.id;
                        LookAtTarget(viewer, id);
                    }                
                }
                else
                {
                    $(e.target).css('background-color', '#000000');
                    $(e.target).html('锁定视角');
                    
                    if(selectedEntity)
                    {
                        viewer.trackedEntity = undefined;
                    }
                }
            }
        });
    }
    buttons.push({
        text: "保存", 
        click: function(){ 
            if($('#form_tower_info_base').valid())
            {
                if(!CheckPermission('tower_save'))
                {
                    return;
                }
                if(CheckTowerInfoModified())
                {
                    ShowConfirm(null, 500, 200,
                        '保存确认',
                        '检测到数据被修改，确认保存吗? 确认的话数据将会提交到服务器上，以便所有人都能看到修改的结果。',
                        function(){
                            SaveTower(viewer);
                        },
                        function(){
                        
                        }
                    );
                }
                else{
                    //$( this ).dialog( "close" );
                }
            }
        }
    });
    
    buttons.push({    
        text: "关闭", 
        click: function(){ 
            $( this ).dialog( "close" );
        }
    });
    
    
    $('#dlg_tower_info').dialog({
        width: 630,
        height: 730,
        minWidth:200,
        minHeight: 200,
        draggable: true,
        resizable: true, 
        modal: false,
        position:{at: "right center"},
        title:title,
        close: function(event, ui){
            $('#form_tower_info_metal').empty();
            DestroyFileUploader('tower_info_photo');
        },
        show: {
            effect: "slide",
            direction: "right",
            duration: 500
        },
        //hide: {
            ////effect: "blind",
            //effect: "slide",
            //direction: "right",
            //duration: 500
        //},        
        buttons:buttons
    });
    $('#tabs_tower_info').tabs({ 
        collapsible: false,
        active: 0,
        beforeActivate: function( event, ui ) {
            $('#form_tower_info_metal').empty();
            var title = ui.newTab.context.innerText;
            if(title == '杆塔模型')
            {
                $('#tower_info_model_list_filter').focus();
                var iframe = $(ui.newPanel.context).find('#tower_info_model').find('iframe');
                var url = '';
                if(tower['properties']['model'])
                {
                    url = GetModelUrl(tower['properties']['model']['model_code_height'], true);
                }
                $('#tower_info_model_list_toggle').find('a').html('>>显示列表');
                $('#tower_info_model_list').css('display', 'none');
                $('#tower_info_model').find('iframe').css('width', '99%');
                var obj = {};
                if(url.length==0)
                {
                    obj['data'] = tower['properties']['model'];
                    obj['tower_id'] = tower['_id'];
                    obj['denomi_height'] = tower['properties']['denomi_height'];
                    $('#tower_info_title_model_code').html('杆塔型号：' + '无' + ' 呼称高：' + '无');
                }
                else if(url.length>0)
                {
                    obj['url'] = '/' + url;
                    obj['data'] = tower['properties']['model'];
                    obj['tower_id'] = tower['_id'];
                    obj['denomi_height'] = tower['properties']['denomi_height'];
                    $('#tower_info_title_model_code').html('杆塔型号：' + tower['properties']['model']['model_code'] + ' 呼称高：' + GetDenomiHeightByModelCode(tower['properties']['model']['model_code_height']) + '米');
                }
                if($.webgis.config.map_backend === 'cesium')
                {
                    var json = encodeURIComponent(JSON.stringify(obj));
                    iframe.attr('src', 'threejs/editor/index.html?' + json);
                }
                if($.webgis.config.map_backend === 'leaflet')
                {
                    iframe.css('display', 'none');
                    $('#tower_info_model_blank').html('<p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>你的浏览器不支持HTML5的WEBGL标准，因此无法显示3D模型。请使用最新的Chrome浏览器或Chrome内核的浏览器');
                    $('#tower_info_model_blank')
                    .css('display', 'block')
                    .css('width', '100%')
                    .css('height', '440px');
                }
            }
            if(title == '架空线段')
            {
                var iframe = $(ui.newPanel.context).find('#tower_info_segment').find('iframe');
                var url = '';
                if(tower['properties']['model'])
                {
                    url = GetModelUrl(tower['properties']['model']['model_code_height'], true);
                }
                var arr = GetPrevNextTowerIds(tower);
                var next_ids = arr[1]
                //console.log(next_ids);
                var url_next = GetNextModelUrl(next_ids);
                if(url.length>0 && url_next.length>0)
                {
                    iframe.css('display', 'block');
                    $('#tower_info_segment_blank').css('display', 'none');
                    var obj = {};
                    obj['url'] = '/' + url;
                    for(var i in url_next)
                    {
                        url_next[i] = '/' + url_next[i];
                    }
                    obj['url_next'] = url_next;
                    obj['tower_id'] = tower['_id'];
                    obj['next_ids'] = next_ids;
                    obj['segments'] = GetSegmentsByTowerStartEnd(tower['_id'], next_ids);
                    var json = encodeURIComponent(JSON.stringify(obj));
                    if($.webgis.config.map_backend === 'cesium')
                    {
                        iframe.attr('src', 'threejs/editor/index.html?' + json);
                    }
                    if($.webgis.config.map_backend === 'leaflet')
                    {
                        iframe.css('display', 'none');
                        $('#tower_info_segment_blank').html('<p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>你的浏览器不支持HTML5的WEBGL标准，因此无法显示3D模型。请使用最新的Chrome浏览器或Chrome内核的浏览器');
                        $('#tower_info_segment_blank')
                        .css('display', 'block')
                        .css('width', '100%')
                        .css('height', '400px');
                    }
                }
                else
                {
                    $('#tower_info_segment_blank').css('display', 'block');
                    iframe.css('display', 'none');
                }
            }
            if(title == '照片文档')
            {
                ShowProgressBar(true, 670, 200, '载入中', '正在载入，请稍候...');
                CreateFileBrowser('tower_info_photo', 520, 480, ['jpg','jpeg','png', 'bmp', 'gif', 'doc', 'xls', 'xlsx', 'docx', 'pdf'], 'features', tower['_id']);
            }
        }
    });
    _.forEach($.webgis.form_fields.tower_baseinfo_fields, function(fld)
    {
        var i = _.indexOf($.webgis.form_fields.tower_baseinfo_fields, fld);
        if(fld.id === 'line_names' && fld.type === 'multiselect')
        {
            $.webgis.form_fields.tower_baseinfo_fields[i].editor.data = CreateLineNamesSelectOption();
            $.webgis.form_fields.tower_baseinfo_fields[i].editor.position = 'top';
        }
    });
    var form = $('#form_tower_info_base').webgisform($.webgis.form_fields.tower_baseinfo_fields,
    {
        prefix:'tower_baseinfo_',
        maxwidth:520
    });
    if(tower)
    {
        var rotate = tower['properties']['rotate'];
        if(rotate===undefined || rotate===null || rotate===0 ) rotate = "0";
        var data = {
            'id':tower['_id'], 
            'lng':tower['geometry']['coordinates'][0].toFixed(6),
            'lat':tower['geometry']['coordinates'][1].toFixed(6),
            'alt':tower['geometry']['coordinates'][2],
            'rotate':rotate,
            'name':title,
            'tower_code':tower['properties']['tower_code'],
            'model_code':tower['properties']['model']?tower['properties']['model']['model_code']:null,
            'denomi_height':tower['properties']['denomi_height'],
            'grnd_resistance':tower['properties']['grnd_resistance'],
            'horizontal_span':tower['properties']['horizontal_span'],
            'vertical_span':tower['properties']['vertical_span'],
            'line_names':GetLineNamesListByTowerId(tower['_id']),
            'project':tower['properties']['project']
        };
        //console.log(data);
        $('#form_tower_info_base').webgisform('setdata', data);
    }
    if(tower)
    {
        var data = [];
        var idx = 1;
        _.forEach( tower.properties.metals, function(item)
        {
            if(item.type.indexOf('驱鸟装置') > -1) {
                data.push({
                    'idx': idx,
                    'type': item.type,
                    'model': item.model,
                    'imei':item.imei
                });
                idx += 1;
            }
        });
    }
    
    
    if(!$.webgis.control.contextmenu_metal)
    {
        //$.webgis.control.contextmenu_metal = $.ligerMenu({ top: 100, left: 100, width: 150, items:
        //    [
        //    { text: '增加金具', icon:'add',
        //        children:[
        //            { text:'绝缘子串',click: AddMetal},
        //            { text:'防振锤',click: AddMetal},
        //            { text:'接地装置',click: AddMetal},
        //            { text:'基础',click: AddMetal},
        //            { text:'拉线',click: AddMetal},
        //            { text:'防鸟刺',click: AddMetal}
        //        ]
        //    },
        //    { text: '增加附件', icon:'add',
        //        children:[
        //            { text:'在线监测装置',click: AddMetal},
        //            { text:'雷电计数器',click: AddMetal},
        //            { text:'超声波驱鸟装置',click: AddMetal}
        //        ]
        //    },
        //    { text: '删除金具/附件', click: DeleteMetal,icon:'delete' }
        //    //{ line: true },
        //    //{ text: '查看', click: onclick11 },
        //    //{ text: '关闭', click: onclick112 }
        //    ]
        //});
        $.webgis.control.contextmenu_metal = $.ligerMenu({ top: 100, left: 100, width: 150, items:
            [
            { text: '驱鸟装置', icon:'add',click: AddMetal
            },
            { text: '删除驱鸟装置', click: DeleteMetal,icon:'delete' }
            ]
        });
    }
    
    try{
        $("#listbox_tower_info_metal").ligerListBox().destroy();
        $('#form_tower_info_metal').empty();
        $('#tower_info_metal').empty();
        $('#tower_info_metal').append('\
            <div id="listbox_tower_info_metal">\
            </div>\
            <form id="form_tower_info_metal">\
            </form>\
        ');
    }catch(e){
        console.log(e);
    }
    var listbox_tower_info_metal = $("#listbox_tower_info_metal").ligerListBox({
        data: data,
        valueField:'idx',
        textField: 'type',
        //readonly:true,
        columns: [
            { header: 'ID', name: 'idx', width: 20 },
            { header: '类型', name: 'type' },
            { header: '型号', name: 'model' }
        ],
        isMultiSelect: false,
        isShowCheckBox: false,
        width: 530,
        height:150,
        onSelected:function(idx, name, obj){
            if(obj)
            {
                $.webgis.select.selected_metal_item = obj;
                $.webgis.select.selected_imei = undefined;
                var o = obj;
                var flds = [];
                var formdata = {};
                if(o.type === '绝缘子串')
                {
                    flds = $.webgis.form_fields.insulator_flds;
                    var metal = tower.properties.metals[o.idx-1];
                    for(var k in metal)
                    {
                        formdata[k] = metal[k];
                    }
                }
                if(o.type === '防振锤')
                {
                    flds = $.webgis.form_fields.damper_flds;
                    var metal = tower.properties.metals[o.idx-1];
                    for(var k in metal)
                    {
                        formdata[k] = metal[k];
                    }
                }
                if(o.type === '接地装置')
                {
                    flds = $.webgis.form_fields.grd_flds;
                    var metal = tower.properties.metals[o.idx-1];
                    for(var k in metal)
                    {
                        formdata[k] = metal[k];
                    }
                }
                if(o.type === '基础')
                {
                    flds = $.webgis.form_fields.base_flds_1;
                    var metal = tower.properties.metals[o.idx-1];
                    for(var k in metal)
                    {
                        formdata[k] = metal[k];
                    }
                }
                if(o.type === '拉线' || o.type === '防鸟刺' || o.type === '在线监测装置' )
                {
                    flds = $.webgis.form_fields.base_flds_2_3_4;
                    var metal = tower.properties.metals[o.idx-1];
                    for(var k in metal)
                    {
                        formdata[k] = metal[k];
                    }
                }
                if(o.type === '雷电计数器' )
                {
                    flds = $.webgis.form_fields.base_flds_5;
                    var metal = tower.properties.metals[o.idx-1];
                    for(var k in metal)
                    {
                        formdata[k] = metal[k];
                    }
                }
                if(o.type.indexOf('驱鸟装置') > -1)
                {
                    var metal = {};
                    if(tower.properties.metals === undefined || tower.properties.metals.length === 0)
                    {
                    }else
                    {
                        metal = _.find(tower.properties.metals, {imei: o.imei});
                        //metal = tower.properties.metals[o.idx-1];
                    }
                    var enable_imei_select = true;
                    if(metal && metal.imei && metal.imei.length>0)
                    {
                        enable_imei_select = false;
                        $.webgis.select.selected_imei = metal.imei;
                    }
                    flds = UpdateBaseFields6(enable_imei_select);
                    for(var k in metal)
                    {
                        formdata[k] = metal[k];
                    }
                    formdata.type = o.type;
                }
                
                $('#form_tower_info_metal').webgisform(flds, {
                    prefix:'tower_metal_',
                    maxwidth:500
                });
                $('#form_tower_info_metal').webgisform('setdata', formdata);
            }
        }
    });
    $("#listbox_tower_info_metal").bind("contextmenu", function (e)
    {
        $.webgis.control.contextmenu_metal.show({ top: e.pageY, left: e.pageX });
        return false;
    });

}

function UpdateBaseFields6(enable_imei_select)
{
    var ret = $.extend(true, [], $.webgis.form_fields.base_flds_6);
    
    var get_flds6_default = function(){
        var obj = {};
        obj.type = '多功能驱鸟装置';
        obj.imei = '';
        _.forEach($.webgis.form_fields.base_flds_6, function(item)
        {
            if(item.id === 'manufacturer' && item.defaultvalue)
            {
                obj.manufacturer = item.defaultvalue;
            }
            if(item.id === 'model' && item.defaultvalue)
            {
                obj.model = item.defaultvalue;
            }
        });
        return obj;
    };
    
    _.forEach( $.webgis.form_fields.base_flds_6, function(fld)
    {
        var i = _.indexOf($.webgis.form_fields.base_flds_6, fld);
        if(fld.id === 'imei')
        {
            var filter = false;
            if(fld.editor && fld.editor.filter === true) filter = true;
            if(enable_imei_select)
            {
                ret[i].editor.data = $.webgis.data.antibird.anti_bird_equip_list;
                ret[i].change = function(selval){
                    var idx = $.webgis.select.selected_metal_item.idx - 1;
                    if($.webgis.select.selected_geojson['properties']['metals'] === undefined)
                    {
                        $.webgis.select.selected_geojson['properties']['metals'] = [];
                        $.webgis.select.selected_geojson['properties']['metals'].push(get_flds6_default());
                    }
                    if($.webgis.select.selected_geojson['properties']['metals'].length>idx)
                    {
                        $.webgis.select.selected_geojson['properties']['metals'][idx]['imei'] = selval;
                    }
                };
            }else
            {
                ret[i].type = 'text';
                ret[i].editor = {readonly:true};
                delete ret[i].validate;
            }
        }
    });
    return ret;
}

function CreateFileBrowserAdditionalButton(div_id, collection, id)
{
    var ret = [
        {
            title:'下载', 
            className:'phototoolbar-download',
            click:function(v){
                if(v && v._id)
                {
                    var url = '/get?' + 'op=gridfs' + '&db=' + $.webgis.db.db_name + '&_id=' + v._id +  '&attachmentdownload=true';
                    window.open(url, '_blank');
                }
            }
        },
        {
            title:'删除', 
            className:'phototoolbar-delete',
            click:function(v){
                if(v && v._id)
                {
                    ShowConfirm(null, 500, 350,
                        '删除确认',
                        '确认要删除文件[' + v.filename + ']吗?',
                        function(){
                            var data = {op:'gridfs_delete','db':$.webgis.db.db_name,_id:v._id};
                            GridFsFind(data, function(){
                                UpdateFotoramaSlider(div_id, collection, id, CreateFileBrowserAdditionalButton(div_id, collection, id));
                            });
                        },
                        function(){
                        },
                        v
                    );
                }
            }
        }
    ];
    return ret;
}


function CreateFileBrowser(div_id, width, height, fileext, collection, id)
{
    $('#' + div_id).empty();
    if(id === undefined)
    {
        ShowProgressBar(false);
        $('#' + div_id).html('请先保存，再上传图片');
        return;
    }
    $('#' + div_id).css('width', width + 'px').css('height', height + 'px');
    var html = '';
    //html += '<div  id="' + div_id + '_toolbar">';
    //html += '    <span  class="phototoolbar-download" style="display:inline-block;z-index:9;width: 24px; height: 27px; bottom: 140px; right: 80px;" data-' + div_id + '-download="">';
    //html += '    </span>';
    //html += '    <span  class="phototoolbar-delete" style="display:inline-block;z-index:9;width: 24px; height: 24px; bottom: 144px; right: 50px;" data-' + div_id + '-delete="">';
    //html += '    </span>';
    //html += '</div>';
    html += '<div id="' + div_id + '_container"  style="opacity:1.0;">';
    html += '</div>';
    html += '<div id="div_' + div_id + '_toggle_view_upload" class="btn-primary" style="width:90%;margin:10px;text-align:center;cursor:default;">上传附件</div>';
    html += '<div id="div_' + div_id + '_uploader" style="display:none">';
    html += '</div>';
    html += '<div id="div_' + div_id + '_upload_desciption" style="display:none;margin:10px;">';
    html += '    <textarea id="' + div_id + '_upload_desciption" style="width:' + (width - 40) + 'px;height:100px;border:1px ' + $.webgis.color.base_color + ' solid" rows="5" placeholder="在此输入备注..."></textarea>';
    html += '</div>';
    $('#' + div_id).append(html);
    
    $('#' + div_id + '_upload_desciption').resizable({
        minHeight:100,
        minWidth:400
    });

    UpdateFotoramaSlider(div_id, collection, id, CreateFileBrowserAdditionalButton(div_id, collection, id));
    UpdateFileUploader(div_id);
    InitFileUploader(div_id, fileext, collection, id);
}

function GetGeojsonFromPosition(ellipsoid, position, type)
{
    if(position instanceof Cesium.Cartesian3)
    {
        var carto = ellipsoid.cartesianToCartographic(position);
        position = [Cesium.Math.toDegrees(carto.longitude), Cesium.Math.toDegrees(carto.latitude)];
    }
    if(position instanceof L.LatLng)
    {
        position = [position.lng, position.lat];
    }
    if(position instanceof Array)
    {
        for(var i in position)
        {
            position[i] = GetGeojsonFromPosition(ellipsoid, position[i]);
        }
        if(type && type === 'Polygon')
        {
            var position1 = [];
            position.push(position[0]);
            position1.push(position);
            position = position1;
        }
    }
    return position;
}

function BufferCreate(viewer, type, position, distance, style, resolution, callback)
{

    var ellipsoid = viewer.scene.globe.ellipsoid;
    var t = 'Point';
    if(type.indexOf('polyline')>-1)
    {
        t = 'LineString';
    }
    if(type.indexOf('polygon')>-1) 
    {
        t = 'Polygon';
    }
    coordinates = GetGeojsonFromPosition(ellipsoid, position, t);
    //console.log(coordinates);
    var res = 4;
    if(resolution) res = resolution;
    var geojson = {type:'Feature',geometry:{type:t, coordinates: coordinates}};
    var cond = {'db':$.webgis.db.db_name, 'collection':'-', 'action':'buffer', 'data':geojson, 'distance':distance, 'res':res};
    ShowProgressBar(true, 670, 200, '生成缓冲区', '正在生成缓冲区，请稍候...');
    MongoFind(cond, function(data){
        ShowProgressBar(false);
        if(data.length>0)
        {
            var geometry = data[0];
            geojson.geometry = geometry;
            geojson._id = 'tmp_buffer';
            if(!geojson.properties)
            {
                geojson.properties = {};
            }
            geojson.properties.webgis_type = 'polygon_buffer';
            if(style) geojson.properties.style = style;
            var idx = _.findIndex($.webgis.data.geojsons, '_id', 'tmp_buffer');
            if(idx > -1){
                $.webgis.data.geojsons[idx] = geojson;
            }else{
                $.webgis.data.geojsons.push(geojson);
            }
            idx = _.findIndex($.webgis.data.czmls, 'id', 'tmp_buffer');
            if(idx > -1){
                $.webgis.data.czmls[idx] = CreateCzmlFromGeojson(geojson);
            }else{
                $.webgis.data.czmls.push(CreateCzmlFromGeojson(geojson));
            }

            ReloadCzmlDataSource(viewer, $.webgis.config.zaware);
            if(callback) callback(geojson);
        }else
        {
            ShowMessage(null, 400, 250, '出错了', '服务器生成缓冲区错误:返回数据为空,请确认服务正在运行.');
        }
    });
}

function BufferAnalyze(viewer, geojson, webgis_type, callback)
{
    var cond = {'db':$.webgis.db.db_name, 'collection':'features', 'action':'within', 'data':geojson, 'webgis_type':webgis_type, 'limit':0};
    ShowProgressBar(true, 670, 200, '缓冲区分析中', '正在生成缓冲区分析，请稍候...');
    MongoFind(cond, function(data){
        ShowProgressBar(false);
        if(callback) callback(data);
    });
}

function ShowBufferAnalyzeDialog(viewer, type, position)
{
    var ellipsoid;
    if($.webgis.config.map_backend === 'cesium')
    {
        ellipsoid = viewer.scene.globe.ellipsoid;
    }
    var buffer_geojson;
    var switch_panel = function(formname, dialog)
    {
        $('form[id^=form_buffer_]').parent().css('display', 'none');
        $('#' + formname).parent().css('display', 'block');
        
        var buttons = bind_buttons(formname, dialog);
    };
    var get_style = function()
    {
        var data = $('#form_buffer_create').webgisform('getdata');
        return data['style'];
    };
    var get_distance = function()
    {
        var data = $('#form_buffer_create').webgisform('getdata');
        return data['distance'];
    };
    var get_analyze_option = function()
    {
        var r = [];
        $('#form_buffer_analyze').find('input[id^=form_buffer_analyze_]').each(function(){
            var t = $(this).attr('id').replace('form_buffer_analyze_', '');
            if($(this).is(':checked')) r.push(t);
        });
        return r;
    };
    var clear_tmp_buffer = function()
    {
        //if($.webgis.data.geojsons['tmp_buffer'])
        //{
        //    delete $.webgis.data.geojsons['tmp_buffer'];
        //    $.webgis.data.geojsons['tmp_buffer'] = undefined;
        //}
        //if($.webgis.data.czmls['tmp_buffer'])
        //{
        //    delete $.webgis.data.czmls['tmp_buffer'];
        //    $.webgis.data.czmls['tmp_buffer'] = undefined;
        //    ReloadCzmlDataSource(viewer, $.webgis.config.zaware, true);
        //}
        _.remove( $.webgis.data.geojsons, function(n){
            return n._id === 'tmp_buffer';
        });
        _.remove( $.webgis.data.czmls, function(n){
            return n.id === 'tmp_buffer';
        });
        if($.webgis.config.map_backend === 'cesium'){
            ReloadCzmlDataSource(viewer, $.webgis.config.zaware, true);
        }

    };
    var bind_buttons = function(formname, dialog)
    {
        if(formname === 'form_buffer_create')
        {
            buttons = [
                {     text: "下一步", 
                    click: function(){ 
                        if($('#form_buffer_create').valid())
                        {
                            var style = get_style();
                            BufferCreate(viewer, type, position, get_distance(), style, 8,  function(geojson){
                                //console.log(style);
                                //console.log(geojson);
                                buffer_geojson = geojson;
                                switch_panel('form_buffer_analyze', dialog);
                                
                            });
                        }
                    }
                },
                //{     text: "清空", 
                    //click: function(){
                        //clear_tmp_buffer();
                    //}
                //},
                {     text: "关闭", 
                    click: function(){
                        clear_tmp_buffer();
                        $( dialog ).dialog( "close" );
                    }
                }
            ];
        }
        else if(formname === 'form_buffer_analyze')
        {
            buttons = [
                {     text: "上一步", 
                    click: function(){
                        clear_tmp_buffer();
                        buffer_geojson = undefined;
                        switch_panel('form_buffer_create', dialog);
                    }
                },
                {     text: "分析", 
                    click: function(){ 
                        if(buffer_geojson)
                        {
                            //console.log(buffer_geojson);
                            //console.log(get_analyze_option());
                            BufferAnalyze(viewer, buffer_geojson, get_analyze_option(), function(data){
                                //console.log(data);
                                if(data.length>0)
                                {
                                    //for(var i in data)
                                    //{
                                    //    var g = data[i];
                                    //    if(!$.webgis.data.geojsons[g['_id']]) $.webgis.data.geojsons[g['_id']] = g;//AddTerrainZOffset(g);
                                    //    if(!$.webgis.data.czmls[g['_id']]) $.webgis.data.czmls[g['_id']] = CreateCzmlFromGeojson($.webgis.data.geojsons[g['_id']]);
                                    //}

                                    $.webgis.data.geojsons =  _.uniq(_.union($.webgis.data.geojsons, data), _.property('_id'));
                                    if($.webgis.config.map_backend === 'cesium') {
                                        var czmls = _.map(data, function (n) {
                                            return CreateCzmlFromGeojson(n);
                                        });
                                        $.webgis.data.czmls = _.uniq(_.union($.webgis.data.czmls, czmls), _.property('id'));
                                        ReloadCzmlDataSource(viewer, $.webgis.config.zaware);
                                    }

                                }
                            });
                        }
                    }
                },
                //{     text: "保存", 
                    //click: function(){
                        //ShowConfirm(null, 500, 200,
                            //'保存确认',
                            //'确认保存吗? 确认的话该缓冲区域将会提交到服务器上，以便所有人都能利用该缓冲区做分析。',
                            //function(){
                                //clear_tmp_buffer();
                            //},
                            //function(){
                                //clear_tmp_buffer();
                            //}
                        //);
                    //}
                //},
                {     text: "关闭", 
                    click: function(){
                        clear_tmp_buffer();
                        $( dialog ).dialog( "close" );
                    }
                }
            ];
        }
        $('#dlg_buffer_analyze').dialog("option", "buttons", buttons);
    };
    
    
    var dialog = $('#dlg_buffer_analyze').dialog({
        width: 500,
        height: 550,
        minWidth:200,
        minHeight: 200,
        draggable: true,
        resizable: true, 
        modal: false,
        position:{at: "right center"},
        title:'缓冲区分析',
        close:function(event, ui){
        },
        show: {
            effect: "slide",
            direction: "right",
            duration: 400
        },
        hide: {
            effect: "slide",
            direction: "right",
            duration: 400
        }        
    });
    var flds = [    
        { display: "距离(米)", id: "distance", defaultvalue:2000, newline: true,  type: "spinner", step:1, min:10,max:20000, group:'参数', width:250,labelwidth:90, validate:{required:true, number: true, range:[10, 20000]}},
        { display: "填充颜色", id: "fill_color", defaultvalue:GetDefaultStyleValue('polygon_buffer', 'color'), newline: false,  type: "color", group:'样式', width:50, labelwidth:120 },
        { display: "轮廓颜色", id: "outline_color", defaultvalue:GetDefaultStyleValue('polygon_buffer', 'outlineColor'), newline: false,  type: "color", group:'样式', width:50, labelwidth:120 },
        { display: "标签颜色", id: "label_fill_color",  defaultvalue:GetDefaultStyleValue('polygon_buffer', 'labelFillColor'), newline: true,  type: "color", group:'样式', width:50, labelwidth:120 },
        //{ display: "标签尺寸", id: "label_scale", defaultvalue:GetDefaultStyleValue('polygon_buffer', 'labelScale'), newline: true,  type: "spinner", step:1, min:1,max:5, group:'样式', width:70, labelwidth:120, validate:{number: true, required:true} }
    ];
    
    $('#form_buffer_create').webgisform(flds, 
        {
            prefix:'form_buffer_create_', 
            divorspan:'div',
            maxwidth:400
    });
    var flds1 = [    
        { display: "杆塔", id: "point_tower", defaultvalue:true, newline: false,  type: "checkbox", group:'地标', width:32,labelwidth:90},
        { display: "地标", id: "point_marker", defaultvalue:true, newline: false,  type: "checkbox", group:'地标', width:32,labelwidth:90},
        { display: "隐患点", id: "point_hazard", defaultvalue:true, newline: false,  type: "checkbox", group:'地标', width:32,labelwidth:90},
        { display: "地市", id: "point_subcity", defaultvalue:false, newline: false,  type: "checkbox", group:'地点', width:32,labelwidth:90},
        { display: "区县", id: "point_county", defaultvalue:false, newline: false,  type: "checkbox", group:'地点', width:32,labelwidth:90},
        { display: "乡镇", id: "point_town", defaultvalue:false, newline: true,  type: "checkbox", group:'地点', width:32,labelwidth:90},
        { display: "村寨", id: "point_village", defaultvalue:false, newline: false,  type: "checkbox", group:'地点', width:32,labelwidth:90}
    ];
    
    $('#form_buffer_analyze').webgisform(flds1, 
        {
            prefix:'form_buffer_analyze_', 
            divorspan:'span',
            maxwidth:400
    });
    switch_panel('form_buffer_create', dialog);

}


function ShowDNAddDialog(viewer)
{
    var ellipsoid = viewer.scene.globe.ellipsoid;
    $('#dlg_dn_create').dialog({
        width: 500,
        height: 550,
        minWidth:200,
        minHeight: 200,
        draggable: true,
        resizable: true, 
        modal: false,
        position:{at: "right center"},
        title:'创建配电网络',
        close:function(event, ui){
            delete $.webgis.select.selected_geojson;
            $.webgis.select.selected_geojson = undefined;
        },
        show: {
            effect: "slide",
            direction: "right",
            duration: 400
        },
        hide: {
            effect: "slide",
            direction: "right",
            duration: 400
        },        
        buttons:[
            {     text: "保存", 
                click: function(){ 
                    if($('#form_dn_create').valid())
                    {
                        var that = this;
                        ShowConfirm(null, 500, 200,
                            '保存确认',
                            '确认保存吗? 确认的话数据将会提交到服务器上，以便所有人都能看到修改的结果。',
                            function(){
                                SaveDN(viewer, function(){
                                    $( that ).dialog( "close" );
                                });
                            },
                            function(){
                                $( that ).dialog( "close" );
                            }
                        );
                    }
                }
            },
            {     text: "关闭", 
                click: function(){ 
                    $( this ).dialog( "close" );
                }
            }
        ]
    });
    
    var flds = [
        { display: "名称", id: "name", newline: true,  type: "text", group:'信息', width:250,labelwidth:90, validate:{required:true,minlength: 1}}
    ];
    $("#form_dn_create" ).webgisform(flds, {
            divorspan:"div",
            prefix:"form_dn_create_",
            maxwidth:400
            //margin:10,
            //groupmargin:10
    });
}

function GetPropertiesByTwoNodes(viewer, id0, id1)
{
    var ret;
    //var scene = viewer.scene;
    for(var i in $.webgis.geometry.segments)
    {
        var g = $.webgis.geometry.segments[i];
        if(g.start == id0 && g.end == id1)
        {
            ret = g.properties;
            break;
        }
    }
    return ret
}

function SaveEdge(viewer, id, callback)
{
    
    if($.webgis.config.map_backend === 'cesium')
    {
        var cz, czprev;
        if($.webgis.select.selected_obj && $.webgis.select.prev_selected_obj){
            cz = _.find($.webgis.data.czmls, {id:$.webgis.select.selected_obj.id});
            czprev = _.find($.webgis.data.czmls, {id:$.webgis.select.prev_selected_obj.id});
        }
        if($.webgis.config.node_connect_mode
        && cz
        && czprev
        && cz.webgis_type === czprev.webgis_type
        )
        {
            var geojson = {};
            //var webgis_type = cz.webgis_type;
            geojson._id = id;
            geojson.type = 'Feature';
            geojson.properties = GetPropertiesByTwoNodes(viewer, $.webgis.select.prev_selected_obj.id, $.webgis.select.selected_obj.id);
            var cond = {'db':$.webgis.db.db_name, 'collection':'edges', 'action':'save', 'data':geojson};
            ShowProgressBar(true, 670, 200, '保存中', '正在保存，请稍候...');
            MongoFind(cond, function(data1){
                ShowProgressBar(false);
                if(callback) callback(data1);
            });
        }
    }
    if($.webgis.config.map_backend === 'leaflet')
    {
        var g, gprev;
        if($.webgis.select.selected_obj && $.webgis.select.prev_selected_obj){
            g = _.find($.webgis.data.geojsons, {_id:$.webgis.select.selected_obj.id});
            gprev = _.find($.webgis.data.geojsons, {_id:$.webgis.select.prev_selected_obj.id});
        }
        if($.webgis.config.node_connect_mode
        && g
        && gprev
        && g.properties
        && gprev.properties
        && g.properties.webgis_type === gprev.properties.webgis_type
        )
        {
            var geojson = {};
            geojson._id = id;
            geojson.type = 'Feature';
            geojson.properties = GetPropertiesByTwoNodes(viewer, $.webgis.select.prev_selected_obj.id, $.webgis.select.selected_obj.id);
            var cond = {'db':$.webgis.db.db_name, 'collection':'edges', 'action':'save', 'data':geojson};
            ShowProgressBar(true, 670, 200, '保存中', '正在保存，请稍候...');
            MongoFind(cond, function(data1){
                ShowProgressBar(false);
                if(callback) callback(data1);
            });
        }
    
    }
}

function SaveDN(viewer, callback)
{
    var data = $("#form_dn_create" ).webgisform('getdata');
    var geojson = {};
    geojson._id = null;
    geojson.properties = {};
    geojson.properties.webgis_type = 'polyline_dn';
    for (var k in data)
    {
        geojson['properties'][k] = data[k];
    }
    var cond = {'db':$.webgis.db.db_name, 'collection':'network', 'action':'save', 'data':geojson};
    ShowProgressBar(true, 670, 200, '保存中', '正在保存，请稍候...');
    MongoFind(cond, function(data1){
        ShowProgressBar(false);
        if(data1.length>0)
        {
            $.jGrowl("保存成功", { 
                life: 2000,
                position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                theme: 'bubblestylesuccess',
                glue:'before'
            });
        }else
        {
            $.jGrowl("保存失败", { 
                life: 2000,
                position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                theme: 'bubblestylefail',
                glue:'before'
            });
        }
        if(callback) callback(data1);
    });
}

function ShowPoiInfoDialog(viewer, title, type, position, id)
{
    var ellipsoid;
    if($.webgis.config.map_backend === 'cesium')
    {
        ellipsoid = viewer.scene.globe.ellipsoid;
    }
    $('#dlg_poi_info').dialog({
        width: 540,
        height: 680,
        minWidth:200,
        minHeight: 200,
        draggable: true,
        resizable: true, 
        modal: false,
        position:{at: "right center"},
        title:title,
        close:function(event, ui){
            delete $.webgis.select.selected_geojson;
            $.webgis.select.selected_geojson = undefined;
        },
        show: {
            effect: "slide",
            direction: "right",
            duration: 400
        },
        hide: {
            effect: "slide",
            direction: "right",
            duration: 400
        },        
        buttons:[
            {     text: "缓冲区分析", 
                click: function(){ 
                    if(!CheckPermission('buffer_analyze'))
                    {
                        return;
                    }

                    $( this ).dialog( "close" );
                    if(id )
                    {
                        var g = _.find($.webgis.data.geojsons, {_id:id});
                        if(g)
                        {
                            if ($.webgis.config.map_backend === 'cesium') {
                                if (type === 'point') {
                                    var arr = g.geometry.coordinates;
                                    var carto = Cesium.Cartographic.fromDegrees(arr[0], arr[1], arr[2]);
                                    position = ellipsoid.cartographicToCartesian(carto);
                                }
                                else if (type === 'polyline') {
                                    var arr = g.geometry.coordinates;
                                    position = [];
                                    for (var i in arr) {
                                        var carto = Cesium.Cartographic.fromDegrees(arr[i][0], arr[i][1], arr[i][2]);
                                        position.push(ellipsoid.cartographicToCartesian(carto));
                                    }
                                }
                                else if (type === 'polygon') {
                                    var arr = g.geometry.coordinates[0];
                                    position = [];
                                    for (var i in arr) {
                                        var carto = Cesium.Cartographic.fromDegrees(arr[i][0], arr[i][1], arr[i][2]);
                                        position.push(ellipsoid.cartographicToCartesian(carto));
                                    }
                                }
                            }

                            if ($.webgis.config.map_backend === 'leaflet') {
                                if (type === 'point') {
                                    var arr = g.geometry.coordinates
                                    position = L.latLng(arr[1], arr[0]);
                                }
                                else if (type === 'polyline') {
                                    var arr = g.geometry.coordinates;
                                    position = [];
                                    for (var i in arr) {
                                        var lnglat = L.latLng(arr[i][1], arr[i][0]);
                                        position.push(lnglat);
                                    }
                                }
                                else if (type === 'polygon') {
                                    var arr = g.geometry.coordinates[0];
                                    position = [];
                                    for (var i in arr) {
                                        var lnglat = L.latLng(arr[i][1], arr[i][0]);
                                        position.push(lnglat);
                                    }
                                }
                            }
                        }
                    }
                    ShowBufferAnalyzeDialog(viewer, type, position);
                }
            },
            {     text: "保存", 
                click: function(){
                    var that = $(this);
                    var v = $('#select_poi_type').val();
                    if($('#form_poi_info_' + v).valid())
                    {
                        if(!CheckPermission('feature_save'))
                        {
                            return;
                        }
                        ShowConfirm(null, 500, 200,
                            '保存确认',
                            '确认保存吗? 确认的话数据将会提交到服务器上，以便所有人都能看到修改的结果。',
                            function(){
                                var data = {};
                                data._id = id;
                                if(!data._id || data._id.length == 0) data._id = null;
                                var properties =  $('#form_poi_info_' + v).webgisform('getdata');
                                delete properties.id;

                                data.properties = properties;
                                data.properties.webgis_type = v;
                                for(var k in data.properties)
                                {
                                    if(!data.properties[k] || data.properties[k].length == 0)
                                    {
                                        data.properties[k] = null;
                                    }
                                }
                                var t = 'Point';
                                if(v.indexOf('polyline')>-1)
                                {
                                    t = 'LineString';
                                }
                                if(v.indexOf('polygon')>-1) 
                                {
                                    t = 'Polygon';
                                }
                                if(id === undefined)
                                {
                                    data.geometry = {type:t, coordinates:GetGeojsonFromPosition(ellipsoid, position, t)};
                                }
                                SavePoi(data, function(data1){
                                    ClearSelectEntity();
                                    that.dialog( "close" );
                                    
                                    if(id === undefined)
                                    {
                                        $.webgis.control.drawhelper.clearPrimitive();
                                        if(data1 && data1.length>0)
                                        {
                                            $.webgis.data.geojsons =  _.uniq(_.union($.webgis.data.geojsons, data1), _.property('_id'));
                                            if($.webgis.config.map_backend === 'cesium') {
                                                var czmls = _.map(data1, function (n) {
                                                    return CreateCzmlFromGeojson(n);
                                                });
                                                $.webgis.data.czmls = _.uniq(_.union($.webgis.data.czmls, czmls), _.property('id'));
                                            }
                                            _.forEach(data1, function(item){
                                                if($.webgis.config.map_backend === 'leaflet')
                                                {
                                                    $.webgis.control.leaflet_geojson_layer.addData(item);
                                                }
                                            });


                                            //for(var i in data1)
                                            //{
                                            //    var geojson = data1[i];
                                            //    var id = geojson['_id'];
                                            //    if(!$.webgis.data.geojsons[id])
                                            //    {
                                            //        $.webgis.data.geojsons[id] = geojson; //AddTerrainZOffset(geojson);
                                            //    }
                                            //    if($.webgis.config.map_backend === 'cesium')
                                            //    {
                                            //        if(!$.webgis.data.czmls[id])
                                            //        {
                                            //            $.webgis.data.czmls[id] = CreateCzmlFromGeojson($.webgis.data.geojsons[id]);
                                            //        }
                                            //    }
                                            //    if($.webgis.config.map_backend === 'leaflet')
                                            //    {
                                            //        $.webgis.control.leaflet_geojson_layer.addData(geojson);
                                            //    }
                                            //}
                                            if($.webgis.config.map_backend === 'cesium')
                                            {
                                                ReloadCzmlDataSource(viewer, $.webgis.config.zaware);
                                            }
                                        }
                                    }
                                });
                            },
                            function(){
                            
                            }
                        );
                    }
                }
            },
            {     text: "关闭", 
                click: function(){ 
                    $( this ).dialog( "close" );
                }
            }
        
        ]
    });
    
    
    var poitypelist = [];
    $('#select_poi_type').empty();
    if(type == 'point')
    {
        poitypelist = [
            {value:'point_marker',label:'普通地标'},
            {value:'point_hazard',label:'隐患点'},
            {value:'point_tower',label:'杆塔'},
            {value:'point_dn',label:'配电网设备'}
        ];
    }
    if(type == 'polyline')
    {
        poitypelist = [{value:'polyline_marker',label:'路线'},{value:'polyline_hazard',label:'线状隐患源'}];
    }
    if(type == 'polygon')
    {
        poitypelist = [{value:'polygon_marker',label:'区域'},{value:'polygon_hazard',label:'区域隐患源'}];
        if(id === undefined)
        {
            if($.webgis.config.map_backend === 'cesium')
            {
                AddToCzml(ellipsoid, type, position);
            }
        }
    }
        
    for(var i in poitypelist)
    {
        $('#select_poi_type').append('<option value="' + poitypelist[i]['value'] + '">' + poitypelist[i]['label'] + '</option>');
    }
    var auto = $('#select_poi_type').autocomplete({
        //position: { my: "left top", at: "left bottom", collision: "none" },
        autoFocus: false,
        source:poitypelist,
    });
    
    $("form[id^=form_poi_info_]").empty();
    var webformlist = BuildPoiForms();
    $("form[id^=form_poi_info_]").parent().css('display','none');
    if(id)
    {
        var g = _.find($.webgis.data.geojsons, {_id:id});
        if(g) {
            var wt = g.properties.webgis_type;
            $("#form_poi_info_" + wt).parent().css('display', 'block');
        }
    }
    else
    {
        $("#form_poi_info_" + type + "_marker").parent().css('display','block');
    }
    $( "#select_poi_type" ).on( "change", function( event) {
        $("form[id^=form_poi_info_]").parent().css('display','none');
        var v = event.target.value;
        webformlist[v].parent().css('display','block');
    });
    if(id )
    {
        var g = _.find($.webgis.data.geojsons, {_id:id});
        if(g){
            var data = g.properties;
            var wt = g.properties.webgis_type;
            $("#form_poi_info_" + wt).webgisform('setdata', data);
        }
    }
    
    $('#tabs_poi_info').tabs({ 
        collapsible: false,
        active: 0,
        beforeActivate: function( event, ui ) {
            var title = ui.newTab.context.innerText;
            if(title == '基础信息')
            {
            }
            if(title == '照片文档')
            {
                ShowProgressBar(true, 670, 200, '载入中', '正在载入，请稍候...');
                CreateFileBrowser('poi_info_photo', 450, 480, ['jpg','jpeg','png', 'bmp', 'gif', 'doc', 'xls', 'xlsx', 'docx', 'pdf'], 'features', id);
            }
        }
    });
}

function ClearSelectEntity()
{
    $.webgis.viewer.trackedEntity = undefined;
    $.webgis.viewer.selectedEntity = undefined;
    delete $.webgis.select.selected_geojson;
    $.webgis.select.selected_geojson = undefined;
    $.webgis.select.selected_obj = undefined;
}

function AddToCzml(ellipsoid, type, positions)
{
    var cnt = 0;
    var id;
    var g = {};
    g.geometry = {};
    g.geometry.type = '';
    g.geometry.coordinates = [];
    g.properties = {};
    g.properties.webgis_type = '';
    if(type === 'polyline')
    {
        _.forEach($.webgis.data.czmls, function(item)
        {
            if(item.id.indexOf('tmp_polyline_') > -1)
            {
                cnt += 1;
            }
        });
        id = 'tmp_polyline_' + cnt;
        g.geometry.type = 'LineString';
        g.properties.webgis_type = 'polyline_marker';
        _.forEach(positions, function(cart3)
        {
            var carto = ellipsoid.cartesianToCartographic(cart3);
            g.geometry.coordinates.push([Cesium.Math.toDegrees(carto.longitude), Cesium.Math.toDegrees(carto.latitude)]);
        });
        
    }
    if(type === 'polygon')
    {
        _.forEach($.webgis.data.czmls, function(item)
        {
            if(item.id.indexOf('tmp_polygon_')>-1)
            {
                cnt += 1;
            }
        })
        id = 'tmp_polygon_' + cnt;
        g.geometry.type = 'Polygon';
        g.properties.webgis_type = 'polygon_marker';
        g.geometry.coordinates.push([]);
        var carto_0;
        _.forEach(positions, function(cart3)
        {
            var i = _.indexOf(positions, cart3);
            if($.webgis.config.map_backend === 'cesium')
            {
                var carto = ellipsoid.cartesianToCartographic(cart3);
                if(i === 0)
                {
                    carto_0 = carto;
                }
                g.geometry.coordinates[0].push([Cesium.Math.toDegrees(carto.longitude), Cesium.Math.toDegrees(carto.latitude)]);
            }
            if($.webgis.config.map_backend === 'leaflet')
            {
                if(i === 0)
                {
                    carto_0 = cart3;
                }
                g.geometry.coordinates[0].push([cart3.lng, cart3.lat]);
            }
        });
        if($.webgis.config.map_backend === 'cesium')
        {
            g.geometry.coordinates[0].push([Cesium.Math.toDegrees(carto_0.longitude), Cesium.Math.toDegrees(carto_0.latitude)]);
        }
        if($.webgis.config.map_backend === 'leaflet')
        {
            g.geometry.coordinates[0].push([carto_0.lng, carto_0.lat]);
        }
    }
    g._id = id;
    if( !_.find($.webgis.data.czmls, {id:id}))
    {
        var cz = CreateCzmlFromGeojson(g);
        if(type === 'polygon')
        {
            cz.polygon.extrudedHeight = {'number': 3000};
            cz.polygon.material.solidColor.color = {'rgba':[255,255,0, 80]};
        }
        $.webgis.data.czmls.push(cz);
    }
    
}

function CreateCzmlFromGeojson(geojson)
{
    var ret;
    var t = geojson.geometry.type;
    if(t === 'Point')
        ret = CreatePointCzmlFromGeojson(geojson);
    if(t === 'LineString' || t === 'MultiLineString')
        ret = CreatePolyLineCzmlFromGeojson(geojson);
    if(t === 'Polygon')
        ret = CreatePolygonCzmlFromGeojson(geojson);
    return ret;
}

function BuildPoiForms()
{
    var ret = {};
    var vlist = ['point_marker', 'point_hazard', 'point_tower', 'point_dn_switch','point_dn_link','point_dn_transform','point_dn_transformarea', 'polyline_marker', 'polyline_hazard', 'polygon_marker', 'polygon_hazard'];
    _.forEach(vlist, function(v)
    {
        var fields;
        if(v === "point_tower")
        {
            fields = [
                //{ id: "id", type: "hidden" },
                { display: "名称", id: "name", newline: true,  type: "text", group:'信息', width:250,labelwidth:90, validate:{required:true,minlength: 1}},
                { display: "代码", id: "tower_code", newline: true,  type: "text", group:'信息', width:250,labelwidth:90 },
                //{ display: "塔型", id: "model_code", newline: false,  type: "text", group:'信息', width:80,labelwidth:90 },
                //{ display: "呼称高", id: "denomi_height", newline: false,  type: "spinner", step:0.1, min:0,max:100, group:'信息', width:40, validate:{number: true, range:[0, 100]}},
                //电气
                { display: "接地电阻", id: "grnd_resistance", newline: true,  type: "spinner", step:0.1, min:0,max:9999, group:'电气', width:250, validate:{number: true, required:false, range:[0, 9999]}},
                //土木
                { display: "水平档距", id: "horizontal_span", newline: false,  type: "spinner", step:0.1, min:0,max:9999, group:'土木', width:40, validate:{number: true, required:false, range:[0, 9999]} },
                { display: "垂直档距", id: "vertical_span", newline: false,  type: "spinner", step:0.1, min:0,max:9999, group:'土木', width:40, validate:{number: true, required:false, range:[0, 9999]} },
                //工程
                { display: "线路名称", id: "line_names", newline: true,  type: "select", editor:{data:[], position:'top'},  group:'工程', width:250 }
            ];
            _.forEach(fields, function(fld)
            {
                if(fld.id === 'line_names')
                {
                    fld.editor.data = CreateLineNamesSelectOption();
                    return;
                }
            });
        }
        if(v === "point_marker")
        {
            fields = [    
                { display: "显示图标", id: "icon", newline: true,  type: "icon", defaultvalue:"point_marker" ,iconlist:['point_marker', 'point_tower', 'point_hazard'], group:'信息'},
                { display: "名称", id: "name", newline: true,  type: "text", group:'信息', width:250,labelwidth:90, validate:{required:true,minlength: 1}},
                { display: "描述", id: "description", newline: true,  type: "text", group:'信息', width:250, labelwidth:90 },
                { display: "填充颜色", id: "fill_color", defaultvalue:GetDefaultStyleValue(v, 'color'), newline: false,  type: "color", group:'样式', width:50, labelwidth:120 },
                { display: "轮廓颜色", id: "outline_color", defaultvalue:GetDefaultStyleValue(v, 'outlineColor'), newline: false,  type: "color", group:'样式', width:50, labelwidth:120 },
                { display: "标签颜色", id: "label_fill_color",  defaultvalue:GetDefaultStyleValue(v, 'labelFillColor'), newline: true,  type: "color", group:'样式', width:50, labelwidth:120 },
                { display: "尺寸", id: "pixel_size", defaultvalue:GetDefaultStyleValue(v, 'pixelSize'), newline: false,  type: "spinner", step:1, min:1,max:50, group:'样式', width:30, labelwidth:120, validate:{number: true, required:true, range:[1, 50]} },
                { display: "标签尺寸", id: "label_scale", defaultvalue:GetDefaultStyleValue(v, 'labelScale'), newline: false,  type: "spinner", step:0.1, min:0.1,max:10, group:'样式', width:30, labelwidth:90, validate:{number: true, required:true, range:[0.1, 10]} }
            ];
        }
        if(v === "point_hazard")
        {
            fields = [    
                //{ id: "id", type: "hidden" },
                { display: "显示图标", id: "icon", newline: true,  type: "icon", defaultvalue:"point_marker" ,iconlist:['point_marker', 'point_tower', 'point_hazard'], group:'信息'},
                { display: "名称", id: "name", newline: true,  type: "text", group:'信息', width:250, validate:{required:true,minlength: 1}},
                { display: "高度", id: "height", newline: true,  type: "spinner",step:1, min:0,max:9999, group:'信息', width:220, validate:{number: true, range:[0, 9999]} },
                { display: "描述", id: "description", newline: true,  type: "text", group:'信息', width:250 },
                { display: "联系人", id: "contact_person", newline: true,  type: "text", group:'信息', width:250 },
                { display: "发现时间", id: "discover_date", newline: true,  type: "date", group:'信息', width:130 },
                { display: "填充颜色", id: "fill_color", defaultvalue:GetDefaultStyleValue(v, 'color'), newline: false,  type: "color", group:'样式', width:50, labelwidth:120 },
                { display: "轮廓颜色", id: "outline_color", defaultvalue:GetDefaultStyleValue(v, 'outlineColor'), newline: false,  type: "color", group:'样式', width:50, labelwidth:120 },
                { display: "标签颜色", id: "label_fill_color",  defaultvalue:GetDefaultStyleValue(v, 'labelFillColor'), newline: true,  type: "color", group:'样式', width:50, labelwidth:120 },
                { display: "尺寸", id: "pixel_size", defaultvalue:GetDefaultStyleValue(v, 'pixelSize'), newline: false,  type: "spinner", step:1, min:1,max:50, group:'样式', width:30, labelwidth:120, validate:{number: true, required:true, range:[1, 50]} },
                { display: "标签尺寸", id: "label_scale", defaultvalue:GetDefaultStyleValue(v, 'labelScale'), newline: false,  type: "spinner", step:0.1, min:0.1,max:10, group:'样式', width:30, labelwidth:90, validate:{number: true, required:true, range:[0.1, 10]} }
            ];
        }
        if(v.indexOf("point_dn_")>-1)
        {
            var function_list = [];
            //console.log($.webgis.data.codes['functional_type']);
            for(var k in $.webgis.data.codes['functional_type'])
            {
                
                if(k == 'PAE' || k == 'PAB' || k == 'PLM')
                {
                    function_list.push({value:k, label:$.webgis.data.codes['functional_type'][k]});
                }
            }
            function_list.push({value:'T', label:'变压器区域'});
            fields = [    
                //{ id: "id", type: "hidden" },
                { display: "显示图标", id: "icon", defaultvalue:"point_dn_switch", newline: true,  type: "icon", defaultvalue:"point_marker" ,iconlist:['point_marker', 'point_tower', 'point_hazard','point_dn_switch','point_dn_link','point_dn_transform','point_dn_transformarea'], group:'信息'},
                { display: "名称", id: "name", newline: true,  type: "text", group:'信息', width:250, validate:{required:true,minlength: 1}},
                { display: "功能分类", id: "function_type", newline: true,  type: "select",editor: {data:function_list}, group:'电气特性', width:250, validate:{required:true,minlength: 1}},
                { display: "填充颜色", id: "fill_color", defaultvalue:GetDefaultStyleValue(v, 'color'), newline: false,  type: "color", group:'样式', width:50, labelwidth:120 },
                { display: "轮廓颜色", id: "outline_color", defaultvalue:GetDefaultStyleValue(v, 'outlineColor'), newline: false,  type: "color", group:'样式', width:50, labelwidth:120 },
                { display: "标签颜色", id: "label_fill_color",  defaultvalue:GetDefaultStyleValue(v, 'labelFillColor'), newline: true,  type: "color", group:'样式', width:50, labelwidth:120 },
                { display: "尺寸", id: "pixel_size", defaultvalue:GetDefaultStyleValue(v, 'pixelSize'), newline: false,  type: "spinner", step:1, min:1,max:50, group:'样式', width:30, labelwidth:120, validate:{number: true, required:true, range:[1, 50]} },
                { display: "标签尺寸", id: "label_scale", defaultvalue:GetDefaultStyleValue(v, 'labelScale'), newline: false,  type: "spinner", step:0.1, min:0.1,max:10, group:'样式', width:30, labelwidth:90, validate:{number: true, required:true, range:[0.1, 10]} }
            ];
        }
        if(v === "polyline_marker")
        {
            fields = [    
                { display: "名称", id: "name", newline: true,  type: "text", group:'信息', width:250,labelwidth:90, validate:{required:true,minlength: 1}},
                { display: "描述", id: "description", newline: true,  type: "text", group:'信息', width:250, labelwidth:90 },
                { display: "填充颜色", id: "fill_color", defaultvalue:GetDefaultStyleValue(v, 'color'), newline: false,  type: "color", group:'样式', width:50, labelwidth:120 },
                //{ display: "轮廓颜色", id: "outline_color", defaultvalue:GetDefaultStyleValue(v, 'outlineColor'), newline: true,  type: "color", group:'样式', width:50, labelwidth:120 },
                { display: "标签颜色", id: "label_fill_color",  defaultvalue:GetDefaultStyleValue(v, 'labelFillColor'), newline: true,  type: "color", group:'样式', width:50, labelwidth:120 },
                //{ display: "宽度", id: "pixel_width", defaultvalue:GetDefaultStyleValue(v, 'pixelWidth'), newline: true,  type: "spinner", step:1, min:1,max:50, group:'样式', width:70, labelwidth:120, validate:{number: true, required:true, range:[1, 50]} },
                //{ display: "标签尺寸", id: "label_scale", defaultvalue:GetDefaultStyleValue(v, 'labelScale'), newline: true,  type: "spinner", step:0.1, min:0.1,max:10, group:'样式', width:70, labelwidth:120, validate:{number: true, required:true, range:[0.1, 10]} }
                { display: "宽度", id: "pixel_width", defaultvalue:GetDefaultStyleValue(v, 'pixelWidth'), newline: false,  type: "spinner", step:1, min:1,max:50, group:'样式', width:30, labelwidth:120, validate:{number: true, required:true, range:[1, 50]} },
                { display: "标签尺寸", id: "label_scale", defaultvalue:GetDefaultStyleValue(v, 'labelScale'), newline: false,  type: "spinner", step:0.1, min:0.1,max:10, group:'样式', width:30, labelwidth:90, validate:{number: true, required:true, range:[0.1, 10]} }
            ];
        }
        if(v === "polyline_hazard")
        {
            fields = [    
                { display: "名称", id: "name", newline: true,  type: "text", group:'信息', width:250, validate:{required:true,minlength: 1}},
                { display: "高度", id: "height", newline: true,  type: "spinner",step:1, min:0,max:9999, group:'信息', width:220, validate:{number: true, range:[0, 9999]} },
                { display: "描述", id: "description", newline: true,  type: "text", group:'信息', width:250 },
                { display: "联系人", id: "contact_person", newline: true,  type: "text", group:'信息', width:250 },
                { display: "发现时间", id: "discover_date", newline: true,  type: "date", group:'信息', width:130 },
                { display: "填充颜色", id: "fill_color", defaultvalue:GetDefaultStyleValue(v, 'color'), newline: false,  type: "color", group:'样式', width:50, labelwidth:120 },
                //{ display: "轮廓颜色", id: "outline_color", defaultvalue:GetDefaultStyleValue(v, 'outlineColor'), newline: true,  type: "color", group:'样式', width:50, labelwidth:120 },
                { display: "标签颜色", id: "label_fill_color",  defaultvalue:GetDefaultStyleValue(v, 'labelFillColor'), newline: true,  type: "color", group:'样式', width:50, labelwidth:120 },
                //{ display: "宽度", id: "pixel_width", defaultvalue:GetDefaultStyleValue(v, 'pixelWidth'), newline: true,  type: "spinner", step:1, min:1,max:50, group:'样式', width:70, labelwidth:120, validate:{number: true, required:true, range:[1, 50]} },
                //{ display: "标签尺寸", id: "label_scale", defaultvalue:GetDefaultStyleValue(v, 'labelScale'), newline: true,  type: "spinner", step:0.1, min:0.1,max:10, group:'样式', width:70, labelwidth:120, validate:{number: true, required:true, range:[0.1, 10]} }
                { display: "宽度", id: "pixel_width", defaultvalue:GetDefaultStyleValue(v, 'pixelWidth'), newline: false,  type: "spinner", step:1, min:1,max:50, group:'样式', width:30, labelwidth:120, validate:{number: true, required:true, range:[1, 50]} },
                { display: "标签尺寸", id: "label_scale", defaultvalue:GetDefaultStyleValue(v, 'labelScale'), newline: false,  type: "spinner", step:0.1, min:0.1,max:10, group:'样式', width:30, labelwidth:90, validate:{number: true, required:true, range:[0.1, 10]} }
            ];
        }
        if(v === "polygon_marker")
        {
            fields = [    
                { display: "名称", id: "name", newline: true,  type: "text", group:'信息', width:250,labelwidth:90, validate:{required:true,minlength: 1}},
                { display: "描述", id: "description", newline: true,  type: "text", group:'信息', width:250, labelwidth:90 },
                { display: "填充颜色", id: "fill_color", defaultvalue:GetDefaultStyleValue(v, 'color'), newline: false,  type: "color", group:'样式', width:50, labelwidth:120 },
                { display: "轮廓颜色", id: "outline_color", defaultvalue:GetDefaultStyleValue(v, 'outlineColor'), newline: false,  type: "color", group:'样式', width:50, labelwidth:120 },
                { display: "标签颜色", id: "label_fill_color",  defaultvalue:GetDefaultStyleValue(v, 'labelFillColor'), newline: true,  type: "color", group:'样式', width:50, labelwidth:120 },
                { display: "标签尺寸", id: "label_scale", defaultvalue:GetDefaultStyleValue(v, 'labelScale'), newline: true,  type: "spinner", step:0.1, min:0.1,max:10, group:'样式', width:70, labelwidth:120, validate:{number: true, required:true, range:[0.1, 10]} }
            ];
        }
        if(v === "polygon_hazard")
        {
            fields = [    
                { display: "名称", id: "name", newline: true,  type: "text", group:'信息', width:250, validate:{required:true,minlength: 1}},
                { display: "高度", id: "height", newline: true,  type: "spinner",step:1, min:0,max:9999, group:'信息', width:220, validate:{number: true, range:[0, 9999]} },
                { display: "描述", id: "description", newline: true,  type: "text", group:'信息', width:250 },
                { display: "联系人", id: "contact_person", newline: true,  type: "text", group:'信息', width:250 },
                { display: "发现时间", id: "discover_date", newline: true,  type: "date", group:'信息', width:130 },
                { display: "填充颜色", id: "fill_color", defaultvalue:GetDefaultStyleValue(v, 'color'), newline: false,  type: "color", group:'样式', width:50, labelwidth:120 },
                { display: "轮廓颜色", id: "outline_color", defaultvalue:GetDefaultStyleValue(v, 'outlineColor'), newline: false,  type: "color", group:'样式', width:50, labelwidth:120 },
                { display: "标签颜色", id: "label_fill_color",  defaultvalue:GetDefaultStyleValue(v, 'labelFillColor'), newline: true,  type: "color", group:'样式', width:50, labelwidth:120 },
                { display: "标签尺寸", id: "label_scale", defaultvalue:GetDefaultStyleValue(v, 'labelScale'), newline: true,  type: "spinner", step:0.1, min:0.1,max:10, group:'样式', width:70, labelwidth:120, validate:{number: true, required:true, range:[0.1, 10]} }
            ];
        }
        var webgis_type = v;
        if(v.indexOf('point_dn_')>-1)
        {
            webgis_type = 'point_dn';
        }
        if(!ret[webgis_type] && fields)
        {
            ret[webgis_type] = $("#form_poi_info_" + webgis_type).webgisform(fields, {
                    //divorspan:"span",
                    prefix:"form_poi_info_" + webgis_type + '_',
                    maxwidth:400
                    //margin:10,
                    //groupmargin:10
                });
        }
        
    });
    return ret;
}


function GetSegmentsByTowerStartEnd(start_id, end_ids)
{
    var ret = [];
    
    _.forEach(end_ids, function(end_id)
    {
        _.forEach($.webgis.data.segments, function(seg)
        {
            if(seg['start_tower'] == start_id && seg['end_tower'] == end_id)
            {
                ret.push(seg);
                return;
            }
        });
    });
    return ret;
}

function CheckModelCode(modelcode)
{
    var ret = false;
    var idx = _.indexOf($.webgis.data.models_gltf_files, modelcode);
    if(idx > -1){
        ret = true;
    }
    return ret;
}

function RePositionPoint(viewer, id, lng, lat, height, rotate)
{
    var idx = _.findIndex($.webgis.data.czmls, 'id', id);
    if(idx>-1 && $.isNumeric(lng) && $.isNumeric(lat) && $.isNumeric(height) && $.isNumeric(rotate))
    {
        $.webgis.data.czmls[idx].position.cartographicDegrees = [parseFloat(lng), parseFloat(lat), parseFloat(height)];
        ReloadCzmlDataSource(viewer, $.webgis.config.zaware);
    }
}

function PositionModel(ellipsoid, model, lng, lat, height, rotate)
{
    if($.isNumeric(lng) && $.isNumeric(lat) && $.isNumeric(height) && $.isNumeric(rotate))
    {
        var cart3 = ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(parseFloat(lng), parseFloat(lat), parseFloat(height)));
        var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(cart3);
        var quat = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Z, Cesium.Math.toRadians(rotate - 90));
        var mat3 = Cesium.Matrix3.fromQuaternion(quat);
        var mat4 = Cesium.Matrix4.fromRotationTranslation(mat3, Cesium.Cartesian3.ZERO);
        var column2Row2Index = Cesium.Matrix4.getElementIndex(2, 2);
        if(true)
        {
            mat4[column2Row2Index] = - mat4[column2Row2Index];
        }
        var m = Cesium.Matrix4.multiplyTransformation(modelMatrix, mat4, mat4);
        model.modelMatrix = m;
    }

}


function GetLineNamesListByTowerId(id)
{
    var ret = [];
    //for(var k in $.webgis.data.lines)
    //{
    //    if($.webgis.data.lines[k]['properties']['nodes'].indexOf(id)>-1)
    //    {
    //        ret.push(k);
    //    }
    //}
    var arr = _.filter($.webgis.data.lines, function(n){
        return _.indexOf(n.properties.nodes, id) > -1;
    });
    ret = _.pluck(arr, '_id');
    return ret;
}

function AddMetal(e)
{
    if($.webgis.select.selected_geojson)
    {
        var o = {};
        o['type'] = e.text;
        o['assembly_graph'] = '';
        o['manufacturer'] = '';
        o['model'] = '';
        if(e.text == '绝缘子串')
        {
            o['insulator_type'] = '';
            o['material'] = '';
            o['strand'] = 0;
            o['slice'] = 0;
        }
        if(e.text == '防振锤')
        {
            o['side'] = '';
            o['count'] = 0;
            o['distance'] = 0;
        }
        if(e.text == '接地装置')
        {
            o['count'] = 0;
            o['depth'] = 0;
        }
        if(e.text == '雷电计数器')
        {
            o['counter'] = 0;
        }
        if(e.text == '防鸟刺' || e.text == '在线监测装置' || e.text == '拉线')
        {
            o['count'] = 0;
        }
        if(e.text == '基础')
        {
            o['count'] = 0;
            o['platform_model'] = '';
            o['anchor_model'] = '';
            o['depth'] = 0;
        }
        if(e.text.indexOf('驱鸟装置') > -1 )
        {
            o['imei'] = '';
            var get_model = function(){
                var ret = '';
                ret = _.result(_.find($.webgis.form_fields.base_flds_6, {id:'model'}), 'defaultvalue');
                if(!ret) ret = '';
                return ret;
            };
            o['model'] = get_model();
        }
        if($.webgis.select.selected_geojson['properties']['metals'] === undefined)
        {
            $.webgis.select.selected_geojson['properties']['metals'] = [];
        }
        $.webgis.select.selected_geojson['properties']['metals'].push(o);
        var data = [];
        var idx = 1;
        _.forEach($.webgis.select.selected_geojson.properties.metals, function(item)
        {
            if(item.type.indexOf('驱鸟装置') > -1) {
                data.push({
                    'idx': idx,
                    'type': item.type,
                    'model': item.model,
                    'imei':item.imei
                });
                idx += 1;
            }
        });
        $.webgis.select.selected_metal_item = undefined;
        $("#listbox_tower_info_metal").ligerListBox().setData(data);
        $('#form_tower_info_metal').empty();
    }
}

function DeleteMetal()
{
    if($.webgis.select.selected_geojson)
    {
        if($.webgis.select.selected_geojson['properties']['metals'] && $.webgis.select.selected_geojson['properties']['metals'].length>0)
        {
            ShowConfirm(null, 500, 200,
                '删除确认',
                '确认删除该金具/附件吗? 删除后还需点击“保存”按钮以便所有人都能看到修改的结果。',
                function () {
                    $('#form_tower_info_metal').empty();
                    if($.webgis.select.selected_metal_item )
                    {
                        var o = $.webgis.select.selected_metal_item;
                        //console.log(o);
                        //console.log($.webgis.select.selected_geojson['properties']['metals']);
                        $.webgis.select.selected_geojson['properties']['metals'].splice(o.idx-1, 1);
                        //console.log($.webgis.select.selected_geojson['properties']['metals']);
                    }
                    var data = [];
                    var idx = 1;
                    _.forEach( $.webgis.select.selected_geojson.properties.metals, function(item)
                    {
                        if(item.type.indexOf('驱鸟装置') > -1) {
                            data.push({
                                'idx': idx,
                                'type': item.type,
                                'model': item.model,
                                'imei':item.imei
                            });
                            idx += 1;
                        }
                    });
                    $.webgis.select.selected_metal_item = undefined;
                    $("#listbox_tower_info_metal").ligerListBox().setData(data);
                    if(data.length === 0)
                    {
                        var items = $("#listbox_tower_info_metal").ligerListBox().getSelectedItems();
                        $("#listbox_tower_info_metal").ligerListBox().removeItems(items);
                    }
                    
                },
                function () {
                    $('#form_tower_info_metal').empty();
                }
            );
        }
    }
}

function CreateLineNamesSelectOption()
{
    var ret = [];
    _.forEach($.webgis.data.lines, function(item)
    {
        ret.push({value:item._id, label:item.properties.name});
    });
    return ret;
}

function OnSelect(viewer, e, selectedEntity)
{
    var clearselcolor = function(){
        if($.webgis.select.prev_selected_obj && $.webgis.select.prev_selected_obj.primitive && $.webgis.select.primitive_material_unselect)
        {
            $.webgis.select.prev_selected_obj.primitive.material = $.webgis.select.primitive_material_unselect;
        }
        if($.webgis.select.prev_selected_obj && $.webgis.select.prev_selected_obj.polyline && $.webgis.select.polyline_material_unselect)
        {
            $.webgis.select.prev_selected_obj.polyline.material = $.webgis.select.polyline_material_unselect;
        }
        if($.webgis.select.prev_selected_obj && $.webgis.select.prev_selected_obj.polygon && $.webgis.select.polygon_material_unselect)
        {
            $.webgis.select.prev_selected_obj.polygon.material = $.webgis.select.polygon_material_unselect;
        }
    };
    clearselcolor();
    $('#btn_edge_save').attr('disabled','disabled');
    if($.webgis.config.map_backend === 'cesium')
    {
        $('#lnglat_indicator').html( '当前用户:' + $.webgis.current_userinfo['displayname'] + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + PickLngLatFromScreen(viewer, e.position));
        //if (Cesium.defined(viewer.selectedEntity)) 
        if (Cesium.defined(selectedEntity)) 
        {
            $.webgis.select.prev_selected_obj = $.webgis.select.selected_obj;
            //$.webgis.select.selected_obj = viewer.selectedEntity;
            $.webgis.select.selected_obj = selectedEntity;
            var id = $.webgis.select.selected_obj.id;
            if (id && id.properties && id.properties.webgis_type === 'edge_dn')
            {
                clearselcolor();
                $.webgis.select.primitive_material_unselect =  $.webgis.select.selected_obj.primitive.material;
                if($.webgis.select.primitive_material_unselect)
                {
                    $.webgis.select.selected_obj.primitive.material = 
                    //Cesium.Material.fromType('PolylineOutline',{
                        //color:    $.webgis.select.primitive_material_unselect.uniforms.color,
                        //outlineColor : Cesium.Color.fromCssColorString('rgba(0, 255, 0, 1.0)'),
                        //outlineWidth: 1.0
                    //});
                    //Cesium.Material.fromType('Color', {
                        //color : Cesium.Color.fromCssColorString('rgba(0, 255, 0, 1.0)')
                    //});
                    Cesium.Material.fromType('PolylineArrow', {
                        color : Cesium.Color.fromCssColorString('rgba(0, 255, 0, 1.0)')
                    });
                }
            }
            else if ($.webgis.select.selected_obj.polyline)
            {
                if($.webgis.select.prev_selected_obj===undefined || $.webgis.select.prev_selected_obj.id != id)
                {
                    clearselcolor();
                    console.log('selected polyline id=' + id);
                    $.webgis.select.polyline_material_unselect = $.webgis.select.selected_obj.polyline.material;
                    //$.webgis.select.selected_obj.polyline.material = Cesium.ColorMaterialProperty.fromColor(Cesium.Color.fromCssColorString('rgba(0, 255, 255, 1.0)'));
                    $.webgis.select.selected_obj.polyline.material = new Cesium.ColorMaterialProperty(Cesium.Color.fromCssColorString('rgba(0, 255, 255, 1.0)'));
                    var cz = _.find($.webgis.data.czmls, {id:id});
                    if(cz && cz.webgis_type == 'polyline_line')
                    {
                        ShowLineDialog(viewer, id);
                    }
                }
            }
            else if ($.webgis.select.selected_obj.polygon)
            {
                if($.webgis.select.prev_selected_obj===undefined || $.webgis.select.prev_selected_obj.id != id)
                {
                    clearselcolor();
                    console.log('selected polygon id=' + id);
                    $.webgis.select.polygon_material_unselect = $.webgis.select.selected_obj.polygon.material;
                    //$.webgis.select.selected_obj.polygon.material = Cesium.ColorMaterialProperty.fromColor(Cesium.Color.fromCssColorString('rgba(0, 255, 0, 0.3)'));
                    $.webgis.select.selected_obj.polygon.material = new Cesium.ColorMaterialProperty(Cesium.Color.fromCssColorString('rgba(0, 255, 0, 0.3)'));
                }
            }
            else if ($.webgis.select.selected_obj.point)
            {
                clearselcolor();
                //console.log('selected marker id=' + id);
                if($.webgis.select.prev_selected_obj && $.webgis.select.prev_selected_obj.id)
                {
                    //console.log('prev selected id=' + $.webgis.select.prev_selected_obj.id);
                }
                var cz = _.find($.webgis.data.czmls, {id:id});
                if(cz && cz.webgis_type.indexOf('point_')>-1 && cz.webgis_type == 'point_tower')
                {
                    try{
                        //$('#dlg_tower_info').dialog("close");
                        $('#dlg_poi_info').dialog("close");
                    }catch(e)
                    {
                    }
                }
                if(cz && cz.webgis_type.indexOf('point_')>-1 && cz.webgis_type != 'point_tower')
                {
                    try{
                        $('#dlg_tower_info').dialog("close");
                    }catch(e)
                    {
                    }
                    ShowPoiInfoDialog(viewer, '编辑', 'point', [], id);
                }
                if(cz && cz.webgis_type.indexOf('point_')>-1)
                {
                    var webgis_type_title = '';
                    if(cz.webgis_type === 'point_tower') webgis_type_title = '杆塔';
                    if(cz.webgis_type === 'point_dn') webgis_type_title = '配电网';
                }
                if(CheckIsTower(id) && ($.webgis.select.prev_selected_obj===undefined || $.webgis.select.prev_selected_obj.id != id))
                {
                    if($.webgis.select.prev_selected_obj && $.webgis.select.prev_selected_obj.id)
                    {
                        //if(CheckTowerInfoModified())
                        if(false)
                        {
                            
                            ShowConfirm(null,500, 200,
                                '保存确认',
                                '检测到数据被修改，确认保存吗? 确认的话数据将会提交到服务器上，以便所有人都能看到修改的结果。',
                                function(){
                                    SaveTower(viewer);
                                    ShowTowerInfo(viewer, id);
                                },
                                function(){
                                    ShowTowerInfo(viewer, id);
                                }
                            );
                            
                        }else{
                            ShowTowerInfo(viewer, id);
                        }
                    }
                    else{
                        ShowTowerInfo(viewer, id);
                    }
                }
                var czprev;
                if($.webgis.select.prev_selected_obj){
                    czprev = _.find($.webgis.data.czmls, {id:$.webgis.select.prev_selected_obj.id});
                }
                if(cz  &&  czprev && czprev.webgis_type === cz.webgis_type)
                {
                    var edgeexist = CheckSegmentsExist($.webgis.select.prev_selected_obj, $.webgis.select.selected_obj, cz.webgis_type);
                    if(edgeexist)
                    {
                        $.jGrowl("该两点间该方向已存在连接",{
                            life: 2000,
                            position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                            theme: 'bubblestylefail',
                            glue:'before'
                        });
                    }
                    if($.webgis.config.node_connect_mode && !edgeexist)
                    {
                        var ring = CheckSegmentsRing($.webgis.select.prev_selected_obj, $.webgis.select.selected_obj);
                        if(ring)
                        {
                            $.jGrowl("不能形成环路",{
                                life: 2000,
                                position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                                theme: 'bubblestylefail',
                                glue:'before'
                            });
                            
                        }else
                        {
                            $('#btn_edge_save').removeAttr('disabled');
                            var g = _.find($.webgis.data.geojsons, {_id:id});
                            var gprev = _.find($.webgis.data.geojsons, {_id:$.webgis.select.prev_selected_obj.id});
                            if(g && gprev){
                                $('#div_edge_instruction').html(gprev.properties.name + '->' + g.properties.name);
                            }
                            var webgis_type;
                            if(cz.webgis_type === 'point_dn') webgis_type = 'edge_dn';
                            if(cz.webgis_type === 'point_tower') webgis_type = 'edge_tower';
                            DrawEdgeBetweenTwoNode(viewer, webgis_type, $.webgis.select.prev_selected_obj.id, id, true);
                        }
                    }
                }
            }
        }
        else{
            clearselcolor();
            ShowGeoTip(false);
            $.webgis.select.prev_selected_obj = $.webgis.select.selected_obj;            
            $.webgis.select.selected_obj = undefined;
        }
    }
    if($.webgis.config.map_backend === 'leaflet')
    {
        $('#lnglat_indicator').html( '当前用户:' + $.webgis.current_userinfo['displayname'] );
        if($.webgis.select.selected_obj && $.webgis.select.selected_obj.id)
        {
            //console.log($.webgis.select.selected_obj);
            //console.log($.webgis.select.prev_selected_obj);
            var g, gprev;
            if(typeof($.webgis.select.selected_obj.id) === 'string' )
            {
                g = _.find($.webgis.data.geojsons, {_id:$.webgis.select.selected_obj.id});
                if($.webgis.select.prev_selected_obj && $.webgis.select.prev_selected_obj.id && typeof($.webgis.select.prev_selected_obj.id) === 'string')
                {
                    gprev = _.find($.webgis.data.geojsons, {_id: $.webgis.select.prev_selected_obj.id});
                }
                var id = $.webgis.select.selected_obj.id;
                if(g && g.properties && g.properties.webgis_type == 'point_tower')
                {
                    try{
                        $('#dlg_poi_info').dialog("close");
                    }catch(e)
                    {
                    }
                    if(CheckIsTower(id) && ($.webgis.select.prev_selected_obj===undefined || $.webgis.select.prev_selected_obj.id != id))
                    {
                        if(!$.webgis.config.node_connect_mode)
                        {
                            ShowTowerInfo(viewer, id);
                        }
                    }
                }
                if(g && g.properties && g.properties.webgis_type.indexOf('point_')>-1 && g.properties.webgis_type != 'point_tower')
                {
                    try{
                        $('#dlg_tower_info').dialog("close");
                    }catch(e)
                    {
                    }
                    if(!$.webgis.config.node_connect_mode)
                    {
                        ShowPoiInfoDialog(viewer, '编辑', 'point', [], id);
                    }
                }
                if(g  && gprev && gprev.properties.webgis_type === g.properties.webgis_type)
                {
                    var edgeexist = CheckSegmentsExist($.webgis.select.prev_selected_obj, $.webgis.select.selected_obj);
                    if(edgeexist)
                    {
                        $.jGrowl("该两点间该方向已存在连接",{
                            life: 2000,
                            position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                            theme: 'bubblestylefail',
                            glue:'before'
                        });
                    }
                    
                    if($.webgis.config.node_connect_mode && !edgeexist)
                    {
                        var ring = CheckSegmentsRing($.webgis.select.prev_selected_obj, $.webgis.select.selected_obj);
                        if(ring)
                        {
                            $.jGrowl("不能形成环路",{
                                life: 2000,
                                position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                                theme: 'bubblestylefail',
                                glue:'before'
                            });
                            
                        }else
                        {
                            $('#btn_edge_save').removeAttr('disabled');
                            $('#div_edge_instruction').html(gprev.properties.name + '->' + g.properties.name);
                            var webgis_type;
                            if(g.properties.webgis_type === 'point_dn') webgis_type = 'edge_dn';
                            if(g.properties.webgis_type === 'point_tower') webgis_type = 'edge_tower';
                            AddEdgeBetweenTwoNode2D(viewer, webgis_type, $.webgis.select.prev_selected_obj, $.webgis.select.selected_obj, true);
                        }
                    }
                }
            }
            else
            {
                $.webgis.select.selected_geojson = $.webgis.select.selected_obj.id;
                //if($.webgis.select.selected_geojson._id === 'tmp_edge')
                //{
                    //$.webgis.select.selected_geojson._id = null;
                //}
            }
        }
        
        
    }    

}

function ShowLineDialog(viewer, mode)
{
    $('#dlg_line_info').dialog({
        width: 540,
        height: 700,
        minWidth:200,
        minHeight: 200,
        draggable: true,
        resizable: true, 
        modal: false,
        position:{at: "right center"},
        title:'输电线路工程信息',
        close:function(event, ui){
        },
        show: {
            effect: "slide",
            direction: "right",
            duration: 400
        },
        hide: {
            effect: "slide",
            direction: "right",
            duration: 400
        },
        buttons: [
            {
                text: "保存",
                click: function () {
                    if ($('#form_line_info').valid()) {
                        var that = this;
                        
                        var id = null, text='';
                        if($('#fld_line_edit_choose').is(':visible'))
                        {
                            var arr = $('#line_choose').multipleSelect("getSelects");
                            var textarr = $('#line_choose').multipleSelect("getSelects", 'text');
                            if(arr.length>0)
                            {
                                text = '[' + textarr[0] + ']';
                                id = arr[0];
                            }
                        }
                        
                        ShowConfirm(null, 500, 200,
                            '保存确认',
                            '确认保存' + text + '吗? 确认的话数据将会提交到服务器上，以便所有人都能看到修改的结果。',
                            function () {
                                SaveLine(viewer, id, function(data1){
                                    var idx = _.findIndex($.webgis.data.lines, '_id', data1[0]._id);
                                    if(idx < 0){
                                        $.webgis.data.lines.push(data1[0]);
                                    }else{
                                        $.webgis.data.lines[idx] = data1[0];
                                    }
                                    idx = _.findIndex($.webgis.data.geojsons, '_id', data1[0]._id);
                                    if(idx < 0){
                                        var line = {};
                                        line._id =  data1[0]._id;
                                        line.properties =  data1[0].properties;
                                        $.webgis.data.geojsons.push(line);
                                    }else{
                                        $.webgis.data.geojsons[idx].properties = data1[0].properties;
                                    }
                                });
                            },
                            function () {
                                $(that).dialog("close");
                            }
                        );
                    }
                }
            },
            {
                text: "关闭",
                click: function () {
                    $(this).dialog("close");
                }
            }
        ]
    });
    var i;
    var list = ['08', '09', '10', '11', '12', '13', '15'];
    var voltagelist = [];
    _.forIn($.webgis.data.codes['voltage_level'], function(v, k){
        if(_.indexOf(list, k) > -1){
            voltagelist.push({ value: k, label: $.webgis.data.codes['voltage_level'][k] });
        }
    });
    list = ['F000', 'A313'];
    var equipment_class = [];
    _.forIn($.webgis.data.codes['equipment_class'], function(v, k){
        if(_.indexOf(list, k) > -1){
            equipment_class.push({ value: k, label: $.webgis.data.codes['equipment_class'][k] });
        }
    });

    list = ['C', 'B', 'D', 'F', 'Q', 'P', 'S'];
    var object_class = []
    _.forIn($.webgis.data.codes['object_class'], function(v, k){
        if(_.indexOf(list, k) > -1){
            object_class.push({ value: k, label: $.webgis.data.codes['object_class'][k] });
        }
    });
    var line_status = [
        { value: '00', label: '测试' },
        { value: '20', label: '试运行' },
        { value: '21', label: '运行' },
        { value: '40', label: '检修' },
        { value: '60', label: '故障' },
        { value: '90', label: '停运' }
    ];
    
    var flds = [
        { display: "线路名称", id: "name", newline: true, type: "text", group: '信息', width: 250, labelwidth: 120, validate: { required: true, minlength: 1 } },
        { display: "管辖长度(km)", id: "manage_length", newline: true, type: "spinner", max: 1000, min: 0, step: 0.1, defaultvalue: 0, group: '信息', width: 200, labelwidth: 140, validate: { number: true,  range: [0, 1000] } },

        { display: "电压等级", id: "voltage", newline: true, type: "select", editor: { data: voltagelist }, defaultvalue: '13', group: '南网分类标准', width: 200, labelwidth: 140},
        { display: "设备类别", id: "category", newline: true, type: "select", defaultvalue: 'F000', editor: { data: equipment_class }, group: '南网分类标准', width: 200, labelwidth: 140},
        { display: "对象类别", id: "object_class", newline: true, type: "select", defaultvalue: 'S', editor: { data: object_class }, group: '南网分类标准', width: 200, labelwidth: 140},

        
        { display: "线路代码", id: "line_code", hide:true, newline: true, type: "text", group: '建设', width: 250, labelwidth: 120 },
        { display: "线路起点", id: "start_point", newline: true, type: "text", group: '建设', width: 250, labelwidth: 120 }, 
        { display: "线路终点", id: "end_point", newline: true, type: "text", group: '建设', width: 250, labelwidth: 120 },
        { display: "设计单位", id: "designer", newline: true, type: "text",  group: '建设', width: 250, labelwidth: 120 },
        { display: "监理单位", id: "supervisor", newline: true, type: "text", group: '建设', width: 250, labelwidth: 120 },
        { display: "运行单位", id: "operator", newline: true, type: "text", group: '建设', width: 250, labelwidth: 120 },
        { display: "所属单位", id: "owner", newline: true, type: "text", group: '建设', width: 250, labelwidth: 120 },
        { display: "运维单位", id: "maintenace", newline: true, type: "text", group: '建设', width: 250, labelwidth: 120 },
        { display: "建设单位", id: "investor", newline: true, type: "text", group: '建设', width: 250, labelwidth: 120 },
        { display: "施工单位", id: "constructor", newline: true, type: "text", group: '建设', width: 250, labelwidth: 120 },
        
        { display: "维护人", id: "responsible", hide:true, newline: true, type: "text", group: '运维', width: 250, labelwidth: 120 },
        { display: "维护班组", id: "team", newline: true, type: "text", group: '运维', width: 250, labelwidth: 120 },
        { display: "线路状态", id: "status", newline: true, type: "select", defaultvalue: '00', editor: { data: line_status }, group: '运维', width: 250, labelwidth: 120 },
        
        { display: "投产日期", id: "production_date", hide:true, newline: true, type: "date", group: '日期', width: 200, labelwidth: 120 },
        { display: "投运日期", id: "finish_date", newline: true, type: "date", group: '日期', width: 200, labelwidth: 120 },
        { display: "退役日期", id: "decease_date", newline: true, type: "date", group: '日期', width: 200, labelwidth: 120 }
    ];
    if(mode === 'edit')
    {
        $('#fld_line_edit_choose').css('display', 'block');
        $('#line_choose').empty();
        _.forEach($.webgis.data.lines, function(item)
        {
            $('#line_choose').append('<option value="' + item._id + '">' + item.properties.name + '</option>');
        });
        
        var select = $('#line_choose').multipleSelect({
            selectAll: false,
            selectAllText: '全部',
            selectAllDelimiter: ['(', ')'],
            allSelected: '(全部)',
            countSelected: '(选择#个,共%个)',
            noMatchesFound: '(无匹配)',
            single: true,
            filter: true,
            position: 'bottom',
            onClick:function(view){
                if(view.checked)
                {
                    //console.log(view.value);
                    var arr = $('#line_choose').multipleSelect("getSelects");
                    var line = _.find($.webgis.data.lines, {_id: view.value});
                    if(line)
                    {
                        $("#form_line_info").webgisform('clear');
                        $("#form_line_info").webgisform('setdata', line.properties);
                    }
                }
            },
            styler: function(value) {
                return 'color: ' + $.webgis.color.base_color + ';';
            }
        });
    }
    else
    {
        $('#fld_line_edit_choose').css('display', 'none');
    }
    
    $("#form_line_info").webgisform(flds, {
        //divorspan: "div",
        prefix: "form_line_info_",
        maxwidth: 420
        //margin:10,
        //groupmargin:10
    });
    $('#tabs_line_info').tabs({
        collapsible: false,
        active: 0,
        beforeActivate: function( event, ui ) {
            var title = ui.newTab.context.innerText;
            if(title == '基础信息')
            {
            }
            if(title == '照片文档')
            {
                var arr = $('#line_choose').multipleSelect("getSelects");
                //console.log(arr);
                if(arr.length>0)
                {
                    var id = arr[0];
                    ShowProgressBar(true, 670, 200, '载入中', '正在载入，请稍候...');
                    CreateFileBrowser('line_info_photo', 450, 450, ['jpg','jpeg','png', 'bmp', 'gif', 'doc', 'xls', 'xlsx', 'docx', 'pdf'], 'network', id);
                }else
                {
                    ShowMessage(null, 400, 200, '无法获取图片数据', '无法获取图片数据,请先选择输电线路.');
                }
            }
        }
    });

}



function CheckPermission(funcname)
{
    if($.webgis.current_userinfo['username'] === undefined)
    {
        return true;
    }
    if($.webgis.current_userinfo['username'] === 'admin')
    {
        return true;
    }
    var ret = false;
    if($.webgis.data.sysrole.indexOf(funcname)>-1)
    {
        ret = true;
    }
    if(ret === false)
    {
        var s = '';
        for(var i in $.webgis.mapping.role_functions)
        {
            if($.webgis.mapping.role_functions[i]['value'] === funcname)
            {
                s = $.webgis.mapping.role_functions[i]['label'];
                break;
            }
        }
        ShowMessage(null, 400, 200, '权限检查', '当前登录用户[' + $.webgis.current_userinfo['displayname'] + ']无此操作权限:[' + s + ']');
    }
    return ret;
}

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
        var name = _.result(_.find($.webgis.data.bbn.domains_range, {value:value}), 'name');
        if(name){
            ret = name;
        }
        return ret;
    };
    var ret = [];
    _.forEach(list, function(node){
        var o = {};
        o._id = node._id;
        o.name = node.name;
        o.display_name = node.display_name;
        o.children = [];
        o.op = '<a id="bbnnodegridrowadd|' + node._id + '" href="javascript:void(0);">新增关联条件</a>';
        o.op += '&nbsp;<a id="bbnnodegridrowremove|' + node._id + '" href="javascript:void(0);">删除关联条件</a>';
        //o.op += '&nbsp;<a id="bbnnodegridcondmodify|' + node._id + '" href="javascript:void(0);">修改关联条件</a>';
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
                    //o1.cond_name = _.map(item[0], function(item1){
                    //    return item1[0];
                    //}).join(',');
                    //o1.cond_display_name = _.map(item[0], function(item1){
                    //    return get_disp_name(item1[0]);
                    //}).join(',');
                    //o1.cond_display_name = '(...)';
                    //o1.event = '(...)';
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
        if(_.startsWith(o.name, 'unit_')){
            ret.push(o);
        }
    });
    return ret;
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
    return;
    var tabledata = {Rows: BuildTableList(data)};
    if(_.isUndefined($.webgis.data.bbn.control.node_grid))
    {
        var flds = [
            { display: "输电线路", id: "line_name", newline: true, type: "label", editor: { data: ''}, defaultvalue: '', group: '查询条件', width: 500, labelwidth: 120},
            { display: "",
                id: "button_save",
                newline: false,
                type: "button",
                defaultvalue: '点击保存',
                group: '操作',
                width: 110,
                labelwidth: 1,
                click:function(){
                    var q_formdata = $('#form_state_examination_bbn_bbn').webgisform('getdata');
                    if(q_formdata.line_name.length)
                    {
                        SaveBBNGridData(viewer, q_formdata.line_name, function(data1){
                            BBNNodeGridLoadData(viewer, data1);
                        });
                    }
                }
            },
            {
                display: "",
                id: "button_collapse_expand",
                newline: false,
                type: "button",
                defaultvalue: '收缩/展开',
                group: '操作',
                width: 150,
                labelwidth: 1,
                click: function () {
                    if(!_.isUndefined($.webgis.data.bbn.control.node_grid)) {
                        if(TREE_COLLAPSE)
                        {
                            $.webgis.data.bbn.control.node_grid.expandAll();
                        }else{
                            $.webgis.data.bbn.control.node_grid.collapseAll();
                        }
                        TREE_COLLAPSE = !TREE_COLLAPSE;
                    }
                }
            },
            {
                display: "",
                id: "button_reset_unit",
                newline: false,
                type: "button",
                defaultvalue: '重置单元评价数据',
                group: '操作',
                width: 210,
                labelwidth: 1,
                click: function () {
                    var q_formdata = $('#form_state_examination_bbn_bbn').webgisform('getdata');
                    if(q_formdata.line_name.length)
                    {
                        ResetBBNUnit(viewer, q_formdata.line_name, function(data1){
                            //console.log(data1);
                            var tabledata = {Rows: BuildTableList(data1)};
                            $.webgis.data.bbn.control.node_grid.loadData(tabledata);
                            $.webgis.data.bbn.control.node_grid.collapseAll();
                            BindProbabilityEditEvent(viewer);
                        });
                    }
                }
            },
        ];
        $('#form_state_examination_bbn_bbn_view_grid').webgisform(flds, {
            prefix: "form_state_examination_bbn_bbn_view_grid_",
            maxwidth: 630
            //margin:10,
            //groupmargin:10
        });

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
            {display:'单元名称', name:'name', width: 100},
            {display:'单元中文名称', name:'display_name', width: 100},
            {display:'条件名称', name:'cond_name', width: 100, hide: true},
            {display:'关联条件名称', name:'cond_display_name', width: 100},
            {display:'关联条件取值', name:'cond_value', width: 100,
                editor: {
                    type: 'select',
                    data: [{value:'cond_value1',text:'cond_value1'},{value:'cond_value2',text:'cond_value2'}],
                    valueField: 'value'
                }
            },
            {display:'单元事件分类', name:'event', width: 100},
            {display:'单元事件概率值', name:'probability', width: 100},
            {display:'操作', name:'op', width: 200},
        ];
        $.webgis.data.bbn.control.node_grid = $('#div_state_examination_bbn_bbn_view_grid').ligerGrid({
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
    BindProbabilityEditEvent(viewer);
    //$('a[id^=bbnnodegridcondremove]').off();
    //$('a[id^=bbnnodegridcondremove]').on('click', function(){
    //    var id = $(this).attr('id').split('|')[1];
    //    console.log(id);
    //});
}
function BindProbabilityEditEvent(viewer)
{
    $('a[id^=probabilityhref]').off();
    $('a[id^=probabilityhref]').on('click', function () {
        var id = $(this).attr('id');
        var value = $(this).attr('data-value');
        ShowBBNProbabilityEditDialog(viewer, id, value);
    });
    $('a[id^=bbnnodegridrowadd]').off();
    $('a[id^=bbnnodegridrowadd]').on('click', function () {
        //ShowBBNNodeGridAddDialog(viewer);
        var id = $(this).attr('id').split('|')[1];
        ShowBBNNodeGridAddDialog1(viewer, id);
    });
    $('a[id^=bbnnodegridrowremove]').off();
    $('a[id^=bbnnodegridrowremove]').on('click', function () {
        var id = $(this).attr('id').split('|')[1];
        ShowBBNNodeGridConditionDeleteDialog(viewer, id, function () {
            BBNNodeGridLoadData(viewer, $.webgis.data.bbn.grid_data);
        });
    });
    $('a[id^=bbnnodegridcondmodify]').off();
    $('a[id^=bbnnodegridcondmodify]').on('click', function () {
        var id = $(this).attr('id').split('|')[1];
        //console.log(id);
        ShowBBNNodeGridConditionModifyDialog(viewer, id);
    });
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

function ShowBBNNodeGridConditionDeleteDialog(viewer, id, callback)
{
    var get_names_arr = function(obj)
    {
        var ret = [];
        _.forEach(obj.conditions, function(cond){
            //console.log(cond[0]);
            if(cond.length && cond[0].length ){
                _.forEach(cond[0], function(item){
                    if(item.length){
                        ret.push(item[0]);
                    }
                });
            }
        });
        ret = _.uniq(ret);
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
        title:'删除条件',
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
                    var that = this;
                    var formdata = $('#form_state_examination_bbn_node_grid_condition_midify').webgisform('getdata');
                    var ids = [], names = [],  null_names = [];
                    _.forEach(formdata.conditions, function(name){
                        var o = _.find($.webgis.data.bbn.grid_data, {name:name});
                        if(o){
                            if(_.startsWith('null_', o._id)){
                                null_names.push(o.name);
                            }else{
                                ids.push(o._id);
                                names.push(o.name);
                            }
                        }
                    });
                    if(null_names.length){
                        _.forEach(null_names, function(name){
                            _.remove($.webgis.data.bbn.grid_data, {name:name});
                        });
                        _.forEach(null_names, function(name){
                            _.forEach($.webgis.data.bbn.grid_data, function(item){
                                var idx = _.indexOf($.webgis.data.bbn.grid_data, item);
                                _.forEach(item.conditions, function(cond) {
                                    var idx1 = _.indexOf(item.conditions, cond);
                                    if(cond[0].length){
                                        _.remove(cond[0], function(n){
                                            return name === n[0];
                                        });
                                    }
                                    item.conditions[idx1] = cond;
                                });
                                var existlist = [], conditions = [];
                                _.forEach(item.conditions, function(cond) {
                                    var key = ''
                                    _.forEach(cond[0], function(item1){
                                        key += item1[0] + '|' + item1[1] + '|';
                                    });
                                    //console.log(key);
                                    if(_.indexOf(existlist, key) < 0)
                                    {
                                        existlist.push(key);
                                        conditions.push(cond);
                                    }
                                });
                                item.conditions = conditions;
                                $.webgis.data.bbn.grid_data[idx] = item;
                            });
                        });
                        BBNNodeGridLoadData(viewer, $.webgis.data.bbn.grid_data);
                    }
                    if(ids.length){
                        ShowConfirm(null, 500, 200,
                            '删除确认',
                            '确认删除吗? 确认的话数据将会提交到服务器上，以便所有人都能看到修改的结果。',
                            function(){
                                DeleteBBNGridData1(viewer, ids, names,  callback);
                                $(that).dialog("close");
                            },
                            function(){
                                $(that).dialog("close");
                        });
                    }
                    $(this).dialog("close");
                }
            }
        ]
    });
    var o = _.find($.webgis.data.bbn.grid_data, {_id:id});
    var names = get_names_arr(o);
    var arr = [];
    _.forEach(names, function(name){
        var oo = _.find($.webgis.data.bbn.grid_data, {name:name});
        if(oo){
            arr.push({label:oo.display_name, value:oo.name});
        }
    });
    var flds = [
        { display: "可删除条件", id: "conditions", newline: true, type: "multiselect", editor: { data:  arr},  group: '选择条件', width: 250, labelwidth: 120, validate:{required:true}},
    ];

    $('#form_state_examination_bbn_node_grid_condition_midify').webgisform(flds, {
        prefix: "form_state_examination_bbn_node_grid_condition_midify_",
        maxwidth: 430
        //margin:10,
        //groupmargin:10
    });
}

function ShowBBNNodeGridAddDialog1(viewer, id)
{
    var get_names_arr = function(obj)
    {
        var ret = [];
        _.forEach(obj.conditions, function(cond){
            //console.log(cond[0]);
            if(cond.length && cond[0].length ){
                _.forEach(cond[0], function(item){
                    if(item.length){
                        ret.push(item[0]);
                    }
                });
            }
        });
        ret = _.uniq(ret);
        return ret;
    };
    CreateDialogSkeleton(viewer, 'dlg_state_examination_bbn_node_grid_node_add1');
    $('#dlg_state_examination_bbn_node_grid_node_add1').dialog({
        width: 550,
        height: 570,
        minWidth:200,
        minHeight: 200,
        draggable: true,
        resizable: true,
        modal: false,
        position:{at: "center"},
        title:'新增关联条件',
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
                    var formdata = $('#form_state_examination_bbn_node_grid_node_add1').webgisform('getdata');
                    //formdata.domains = ['true', 'false'];
                    //console.log(formdata);
                    if(formdata.is_use_exist === false)
                    {
                        if($('#form_state_examination_bbn_node_grid_node_add1').valid())
                        {
                            var nullcount = $.webgis.data.bbn.grid_data.length;
                            formdata._id = 'null_' + (nullcount + 1);
                            var o = {};
                            var preset = 0.5;
                            if (formdata.domains.length > 0) {
                                preset = 1.0 / formdata.domains.length;
                            }
                            if (preset === 1) {
                                preset = 0.5;
                            }
                            _.forEach(formdata.domains, function (item) {
                                //console.log(typeof(item));
                                //if(typeof(item) != 'boolean' && item.toLowerCase() === 'true') item = true;
                                //if(typeof(item) != 'boolean' && item.toLowerCase() === 'false') item = false;
                                o[item] = preset;
                            });
                            formdata.conditions = [[[], o]];
                            delete formdata.is_use_exist;
                            delete formdata.exist_nodes;
                            $.webgis.data.bbn.grid_data.push(formdata);

                            var idx = _.findIndex($.webgis.data.bbn.grid_data, '_id', id);
                            if (idx > -1) {
                                var o = _.find($.webgis.data.bbn.grid_data, {_id: id});
                                var namesarr = get_names_arr(o);
                                namesarr.push(formdata.name);
                                namesarr = _.uniq(namesarr);
                                var condlist = [];
                                _.forEach(namesarr, function (name) {
                                    var cond = _.find($.webgis.data.bbn.grid_data, {name: name});
                                    if (cond) {
                                        condlist.push(cond);
                                    }
                                });
                                o = BuildComboConditions(o, condlist);
                                $.webgis.data.bbn.grid_data[idx] = o;
                            }
                            BBNNodeGridLoadData(viewer, $.webgis.data.bbn.grid_data);
                            $(this).dialog("close");
                        }
                    }else{
                        if(formdata.exist_nodes && formdata.exist_nodes.length>0)
                        {
                            var idx = _.findIndex($.webgis.data.bbn.grid_data, '_id', id);
                            if(idx > -1)
                            {
                                var o = _.find($.webgis.data.bbn.grid_data, {_id: id});
                                var namesarr = get_names_arr(o);
                                namesarr.push(formdata.exist_nodes);
                                namesarr = _.uniq(namesarr);
                                var condlist = [];
                                _.forEach(namesarr, function(name){
                                    var cond = _.find($.webgis.data.bbn.grid_data, {name: name});
                                    if(cond){
                                        condlist.push(cond);
                                    }
                                });
                                o = BuildComboConditions(o, condlist);
                                $.webgis.data.bbn.grid_data[idx] = o;
                            }
                            BBNNodeGridLoadData(viewer, $.webgis.data.bbn.grid_data);
                            $(this).dialog("close");
                        }else{
                            var that = this;
                            ShowMessage(null, 400, 250, '错误', '请选择一个已存在节点。', function(){
                                $(that).dialog("close");
                            });
                        }
                    }
                }
            }
        ]
    });

    var domainlist = _.filter($.webgis.data.bbn.domains_range, function(item){
        return item.value === 'I' || item.value === 'II' || item.value === 'III' || item.value === 'IV' ;
    });
    var domainlist = _.map(domainlist, function(item){
        return {label:item.name, value:item.value};
    });
    var existnodelist = _.map($.webgis.data.bbn.grid_data, function(item){
        if(!_.startsWith(item.name, 'unit_')){
            return {label:item.display_name, value:item.name};
        }
    });
    existnodelist.unshift({label:'(请选择)', value:''});
    var flds = [
        { display: "是否已存在节点", id: "is_use_exist", newline: true, type: "checkbox",  group: '判断', width: 220, height:100, labelwidth: 150},
        { display: "条件名称", id: "name", newline: true, type: "text",  defaultvalue: '',addition:'(仅限英文)', group: '新增节点信息', width: 250, labelwidth: 120, validate:{required:true, alpha:true}},
        { display: "条件中文名称", id: "display_name", newline: true, type: "text",  defaultvalue: '', group: '新增节点信息', width: 250, labelwidth: 120, validate:{required:true}},
        { display: "条件取值范围", id: "domains", newline: true, type: "multiselect", editor: { data:  domainlist}, defaultvalue: ['true', 'false'], group: '新增节点信息', width: 250, labelwidth: 120, validate:{required:true}},
        { display: "节点描述", id: "description", newline: true, type: "textarea",  defaultvalue: '', group: '新增节点信息', width: 250, height:100, labelwidth: 120},
        { display: "添加已存在节点", id: "exist_nodes", newline: true, type: "select",  editor: { data:  existnodelist},  group: '已存在节点', width: 220, height:100, labelwidth: 150},
    ];

    $('#form_state_examination_bbn_node_grid_node_add1').webgisform(flds, {
        prefix: "form_state_examination_bbn_node_grid_node_add1_",
        maxwidth: 490
        //margin:10,
        //groupmargin:10
    });
    $('#form_state_examination_bbn_node_grid_node_add1_exist_nodes').multipleSelect("disable");
    $('#form_state_examination_bbn_node_grid_node_add1_is_use_exist').on('ifChecked', function(e){
        $('#form_state_examination_bbn_node_grid_node_add1_exist_nodes').multipleSelect("enable");
        $('#form_state_examination_bbn_node_grid_node_add1_domains').multipleSelect("disable");
        $('#form_state_examination_bbn_node_grid_node_add1_name').attr('readonly', 'readonly');
        $('#form_state_examination_bbn_node_grid_node_add1_display_name').attr('readonly', 'readonly');
        $('#form_state_examination_bbn_node_grid_node_add1_description').attr('readonly', 'readonly');
    });
    $('#form_state_examination_bbn_node_grid_node_add1_is_use_exist').on('ifUnchecked', function(e){
        $('#form_state_examination_bbn_node_grid_node_add1_exist_nodes').multipleSelect("disable");
        $('#form_state_examination_bbn_node_grid_node_add1_domains').multipleSelect("enable");
        $('#form_state_examination_bbn_node_grid_node_add1_name').removeAttr('readonly');
        $('#form_state_examination_bbn_node_grid_node_add1_display_name').removeAttr('readonly');
        $('#form_state_examination_bbn_node_grid_node_add1_description').removeAttr('readonly');
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
            //if (formdata === 'true') {
            //    formdata = true;
            //}
            //if (formdata === 'false') {
            //    formdata = false;
            //}
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
                                //console.log(typeof(item));
                                //if(typeof(item) != 'boolean' && item.toLowerCase() === 'true') item = true;
                                //if(typeof(item) != 'boolean' && item.toLowerCase() === 'false') item = false;
                                o[item] = 0.0;
                            });
                            formdata.conditions = [[[],o]];
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
    //if(key.toLowerCase() === 'true') key = true;
    //if(key.toLowerCase() === 'false') key = false;
    if(idx > -1)
    {
        if (conds.length === 0) {
            $.webgis.data.bbn.grid_data[idx].conditions[0][1][key] = parseFloat(value);
        }else{
            var condlist = []
            var arr1 = conds.split(',');
            _.forEach(arr1, function(item){
                var arr2 = item.split(':');
                //if(arr2[1] === 'true'){
                //    condlist.push([arr2[0],true]);
                //}
                //else if(arr2[1] === 'false'){
                //    condlist.push([arr2[0],false]);
                //}else{
                    condlist.push([arr2[0],arr2[1]]);
                //}
            });
            var idx1 = get_cond_idx($.webgis.data.bbn.grid_data[idx].conditions, condlist);
            if(idx1>-1){
                $.webgis.data.bbn.grid_data[idx].conditions[idx1][1][key] = parseFloat(value);
            }
        }
        BBNNodeGridLoadData(viewer, $.webgis.data.bbn.grid_data);
    }
}

function LoadBBNGridData(viewer, line_name, callback)
{
    if(line_name.length)
    {
        ShowProgressBar(true, 670, 200, '查询', '正在查询，请稍候...');
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
            RenderPredictSelect();

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
    }else{
        BBNNodeGridLoadData(viewer, []);
        //PredictGridLoad([]);
        //PredictGridLoad1([]);
        PredictGridLoad2([]);
    }
}
function PredictGridLoad(alist)
{
    var clear_assume_selects = function(){
        $('#div_state_examination_bbn_assume_selects').empty();
        $('#div_state_examination_bbn_assume_selects').append('<div class="blank_assume_selects">请先选择线路</div>')
    };
    if (alist.length === 0)
    {
        clear_assume_selects();
    }
    var tabledata = {Rows:alist};
    if(_.isUndefined($.webgis.data.bbn.control.predict_grid))
    {
        var columns = [
            //{display:'', name:'_id', width: 1, hide: true},
            //{display:'预测项', name:'name', width: 200},
            {display:'预测项', name:'display_name', width: 200},
            {display:'预测项取值', name:'value', width: 200},
            {display:'预测项取值概率', name:'probability', width: 200},
        ];
        $.webgis.data.bbn.control.predict_grid = $('#div_state_examination_bbn_predict_grid').ligerGrid({
            columns: columns,
            data: tabledata,
            enabledEdit: false,
            clickToEdit: false,
            //checkbox: true,
            tree: { columnName: 'display_name' },
            pageSize: 10
        });

    }else{
        $.webgis.data.bbn.control.predict_grid.loadData(tabledata);
    }
    $.webgis.data.bbn.control.predict_grid.collapseAll();
}

function PredictGridLoad2(alist)
{
    var bar_grid_width = 160;
    var get_width = function(domain, value){
        //if(domain === '正常' && value === 1){
        //    return 0;
        //}
        var ret = Math.floor((bar_grid_width-50) * value);
        //console.log(value + ', ' + ret);
        if(ret<2){
            ret = 2;
        }
        return ret;
    };
    var get_p_format = function(value)
    {
        var ret;
        if(!_.isUndefined(value)) {
            ret = (value*100).toFixed(0) + '%';
        }
        return ret;
    };
    var color_gradient = function(domain, value){
        var ret = '#00ff00';
        var diff = 1;
        var k0;
        _.forIn($.webgis.mapping.probability_gradient, function(v, k){
            if(diff > Math.abs(parseFloat(k) - value)){
                diff = Math.abs(parseFloat(k) - value);
                k0 = k;
            }
        });
        //console.log(value);
        if((domain === '正常' || domain === 'I') && value === 1){
            //console.log('aaa ' + domain + ',' + value + ',' + ret );
            return ret;
        }
        if(!_.isUndefined(k0)){
            ret = $.webgis.mapping.probability_gradient[k0];
        }
        //console.log(ret);
        //console.log(domain + ',' + value + ',' + ret );
        return ret;
    };
    var add_bar = function(rowdata){
        var ret;
        var id = rowdata.id;
        var p = rowdata.probability;
        var plist = rowdata.plist;
        var maxlvlv = 0;
        var maxlvl = 'I';
        _.forIn(plist, function(v, k){
            if(maxlvlv < v)
            {
                maxlvlv = v;
                maxlvl = k;
            }
        });
        if(!_.isUndefined(p) ){
            ret = '<span ';
            if(!_.isUndefined(plist) && !_.isEmpty(plist))
            {
                ret += ''
                    + ' data-unit-id="' + id + '" ' + ' data-plist-I="' + plist.I + '" ' + ' data-width-I="' + get_width(plist.I, plist.I) + '" '
                    + ' data-unit-id="' + id + '" ' + ' data-plist-II="' + plist.II + '" ' + ' data-width-II="' + get_width(plist.II, plist.II) + '" '
                    + ' data-unit-id="' + id + '" ' + ' data-plist-III="' + plist.III + '" ' + ' data-width-III="' + get_width(plist.III, plist.III) + '" '
                    + ' data-unit-id="' + id + '" ' + ' data-plist-IV="' + plist.IV + '" ' + ' data-width-IV="' + get_width(plist.IV, plist.IV) + '" ';
            }
            ret += '" class="span_probability_bar" style="opacity:' + '1' + ';background-color:' + color_gradient(maxlvl, p) + ';width:' + get_width(maxlvl, p) + 'px;"></span>' + '<span style="float:left">' + get_p_format(p) + '</span>';
        }
        return ret;
    };
    var get_domain_name = function(value)
    {
        return _.result(_.find($.webgis.data.bbn.domains_range, {value:value}), 'name');
    };
    var get_v = function(alist, id, key)
    {
        var ret;
        var findit = false;
        _.forEach(alist, function(item){
            _.forEach(item.children, function(item1){
                if( item1.id === id.replace('unitsub_', '')){
                    ret = item1[key];
                    findit = true;
                    return;
                }
            });
            if(findit){
                return;
            }
        });
        return ret;
    };
    var get_sugg = function(unit, lvl){
        var ms = maintain_strategy(unit, lvl);
        var ret = '检修策略:' + ms.strategy + '。\n建议时限:' + ms.timeline + '。\n措施:' + ms.suggestion + '。';
        return ret;
    };
    var strip_string = function(str, num)
    {
        if(_.isUndefined(num)){
            num = 8;
        }
        return str.substr(0, num);
    };
    var adjustdata = function(data){
        //console.log(data);
        var adjustdata_item = function(alist, item)
        {
            var years = _.pluck($.webgis.data.state_examination.list_data_current_line, 'check_year');
            var latest_year = _.max(years);
            if(!_.isUndefined(item.plist))
            {
                if(  item.plist.I === 1 || item.plist.II === 1 || item.plist.III === 1 || item.plist.IV === 1)
                {
                    var p = calc_past_probability($.webgis.data.state_examination.list_data_current_line, item.id, latest_year);
                    //console.log(p);
                    var maxlvlv = 0;
                    var maxlvl = 'I';
                    _.forEach(['I', 'II', 'III', 'IV'], function(item1){
                        item.plist[item1] = p[item.id][item1];
                        if(maxlvlv < p[item.id][item1]){
                            maxlvlv = p[item.id][item1];
                            maxlvl = item1;
                        }
                    });
                    item.probability = maxlvlv;
                    item.description = '(' + get_domain_name(maxlvl) + ')';
                    item.suggestion = get_sugg(item.id, maxlvl);
                }else{
                    var maxlvlv = 0;
                    var maxlvl = 'I';
                    _.forIn(item.plist, function(v, k){
                        if(maxlvlv < v)
                        {
                            maxlvlv = v;
                            maxlvl = k;
                        }
                    });
                    item.description = '(' + get_domain_name(maxlvl) + ')';
                    item.suggestion = get_sugg(item.id, maxlvl);
                }
            }
            return item;
        };
        data = _.map(data, function(item){
            //if(!_.isUndefined(item.plist)
            //    && (
            //        item.plist.I === 1
            //    ||  item.plist.II === 1
            //    ||  item.plist.III === 1
            //    ||  item.plist.IV === 1
            //    ))
            //{
            item = adjustdata_item(data, item);
            //}
            return item;
        });

        return data;
    };
    //console.log(alist);
    alist = _.uniq(alist, function(n){
        return n.id;
    });
    //console.log(alist);
    alist = adjustdata(alist);
    //console.log(alist);
    var tabledata = {Rows:alist};
    if(_.isUndefined($.webgis.data.bbn.control.predict_grid))
    {
        var columns = [
            //{display:'', name:'_id', width: 1, hide: true},
            {display:'预测项名称', name:'name', width: 100},
            {display:'所属单元', name:'unit', width: 80},
            //{display:'劣化等级', name:'level', width: 60},
            {display:'劣化描述', name:'description', width: 150},
            {display:'预测发生概率', name:'probability', width: bar_grid_width, render:function (rowdata, rowindex, value){
                if(_.isNumber(value)) {
                    //console.log(rowdata);
                    return add_bar(rowdata);
                }else {
                    return '';
                }
            }},
            //{display:'详细描述', name:'description', width: 230},
            {display:'检修策略', name:'suggestion', width: 230},
        ];
        $.webgis.data.bbn.control.predict_grid = $('#div_state_examination_bbn_predict_grid').ligerGrid({
            columns: columns,
            data: tabledata,
            enabledEdit: false,
            clickToEdit: false,
            //checkbox: true,
            //tree: { columnName: 'display_name' },
            pageSize: 50,
            onSelectRow:function(rowdata, rowid, rowobj){
                //console.log(rowobj);
                $(rowobj).find('td').each(function (i, item) {
                    var id = $(item).attr('id');
                    if(_.endsWith(id, 'c101') || _.endsWith(id, 'c102') || _.endsWith(id, 'c103') || _.endsWith(id, 'c105'))
                    {
                        var div = $(item).find('div');
                        $(div).attr('title', $(div).html());
                    }
                });
            }
        });
    }else{
        $.webgis.data.bbn.control.predict_grid.loadData(tabledata);
    }
    //$.webgis.data.bbn.control.predict_grid.expandAll();
    $('.span_probability_bar').closest('div').children().off();
    $('.span_probability_bar').closest('div').children().on('click', function(e){
        var div = $(e.target).closest('div');
        if(_.isUndefined(div.find('.span_probability_bar').attr('data-plist-I'))){
            $('#div_state_examination_bbn_predict_grid .div_probability_bar_extend').remove();
            return;
        }
        var unit = div.find('.span_probability_bar').attr('data-unit-id');
        var ps = {}, ws = {};
        _.forEach(['I', 'II', 'III', 'IV'], function(item){
            ps[item] = parseFloat(div.find('.span_probability_bar').attr('data-plist-' + item));
            ws[item] = parseInt(div.find('.span_probability_bar').attr('data-width-' + item));
        });
        var pos = div.position();
        $('#div_state_examination_bbn_predict_grid .div_probability_bar_extend').remove();
        $('#div_state_examination_bbn_predict_grid').append(
            '<div class="div_probability_bar_extend" style="left:' + pos.left + 'px;top:' + pos.top + 'px;">'
            + '<div class="div_probability_bar"><span style="float: left;">' + get_domain_name('I') + '</span><span' + ' class="span_probability_bar"' + ' style="background-color:' + color_gradient('I', ps.I) + ';width:' + ws.I + 'px;"></span>' + '<span style="float: left;">' + get_p_format(ps.I) + '</span><span style="float: right;" title="' + get_sugg(unit, 'I') + '">' + strip_string(get_sugg(unit, 'I')) + '</span></div>'
            + '<div class="div_probability_bar"><span style="float: left;">' + get_domain_name('II') + '</span><span class="span_probability_bar"' + ' style="background-color:' + color_gradient('II', ps.II) + ';width:' + ws.II + 'px;"></span>' + '<span style="float: left;">' + get_p_format(ps.II) + '</span><span style="float: right;" title="' + get_sugg(unit, 'II') + '">' + strip_string(get_sugg(unit, 'II')) + '</span></div>'
            + '<div class="div_probability_bar"><span style="float: left;">' + get_domain_name('III') + '</span><span class="span_probability_bar"' + ' style="background-color:' + color_gradient('III', ps.III) + ';width:' + ws.III + 'px;"></span>' + '<span style="float: left;">' + get_p_format(ps.III) + '</span><span style="float: right;" title="' + get_sugg(unit, 'III') + '">' + strip_string(get_sugg(unit, 'III')) + '</span></div>'
            + '<div class="div_probability_bar"><span style="float: left;">' + get_domain_name('IV') + '</span><span class="span_probability_bar"' + ' style="background-color:' + color_gradient('IV', ps.IV) + ';width:' + ws.IV + 'px;"></span>' + '<span style="float: left;">' + get_p_format(ps.IV) + '</span><span style="float: right;" title="' + get_sugg(unit, 'IV') + '">' + strip_string(get_sugg(unit, 'IV')) + '</span></div>'
            + '</div>');
        $('#div_state_examination_bbn_predict_grid .div_probability_bar_extend').off();
        $('#div_state_examination_bbn_predict_grid .div_probability_bar_extend').on('click', function(e){
            $('#div_state_examination_bbn_predict_grid .div_probability_bar_extend').remove();
        });
        $('#div_state_examination_bbn_predict_grid').off();
        $('#div_state_examination_bbn_predict_grid').on('mouseleave', function(e){
            $('#div_state_examination_bbn_predict_grid .div_probability_bar_extend').remove();
        });

    });
}
function PredictGridLoad1(alist)
{
    //console.log(alist);
    var bar_grid_width = 160;
    var get_width = function(domain, value){
        if(domain === '正常' && value === 1){
            return 0;
        }
        return Math.floor((bar_grid_width-50) * value);
    };
    var get_p_format = function(value)
    {
        var ret;
        if(!_.isUndefined(value)) {
            ret = (value*100).toFixed(0) + '%';
        }
        return ret;
    };
    var color_gradient = function(domain, value){
        //var v = value * 100;
        //var R = (255 * v) / 100;
        //var G = (255 * (100 - v)) / 100;
        //var B = 0;//(255 * (100 - v)) / 100;
        //var c = tinycolor('rgb ' + Math.floor(R) + ' ' + Math.floor(G) + ' ' + Math.floor(B));
        var ret = '#ffffff';
        var diff = 1;
        var k0;
        _.forIn($.webgis.mapping.probability_gradient, function(v, k){
            if(diff > Math.abs(parseFloat(k) - value)){
                diff = Math.abs(parseFloat(k) - value);
                k0 = k;
            }
        });
        //console.log(value);
        if(domain === '正常' && value === 1){
            return ret;
        }
        if(!_.isUndefined(k0)){
            ret = $.webgis.mapping.probability_gradient[k0];
        }
        //console.log(ret);
        return ret;
    };
    var add_bar = function(domain, p, p_format){
        var ret;
        if(!_.isUndefined(p)){
            ret = '<span class="span_probability_bar" style="opacity:' + p + ';background-color:' + color_gradient(domain, p) + ';width:' + get_width(domain, p) + 'px;"></span>' + '<span style="float:left">' + p_format + '</span>';
        }
        return ret;
    };

    var tabledata = {Rows:alist};
    if(_.isUndefined($.webgis.data.bbn.control.predict_grid))
    {
        var columns = [
            //{display:'', name:'_id', width: 1, hide: true},
            //{display:'预测项', name:'name', width: 200},
            {display:'线路预测等级', name:'line_state', width: 100},
            {display:'预测项名称', name:'display_name', width: 100},
            {display:'预测项取值', name:'value', width: 120},
            {display:'预测项取值概率', name:'probability', width: bar_grid_width, render:function (rowdata, rowindex, value){
                if(_.isNumber(value)) {
                    //console.log(rowdata);
                    var domain = rowdata.value;
                    var p_format = get_p_format(value);
                    return add_bar(domain, value, p_format);
                }else {
                    return '';
                }
            }},
            {display:'详细描述', name:'description', width: 230},
            {display:'检修建议', name:'suggestion', width: 230},
        ];
        $.webgis.data.bbn.control.predict_grid = $('#div_state_examination_bbn_predict_grid').ligerGrid({
            columns: columns,
            data: tabledata,
            enabledEdit: false,
            clickToEdit: false,
            //checkbox: true,
            tree: { columnName: 'display_name' },
            pageSize: 50,
            onSelectRow:function(rowdata, rowid, rowobj){
                //console.log(rowobj);
                $(rowobj).find('td').each(function (i, item) {
                    var id = $(item).attr('id');
                    if(_.endsWith(id, 'c105') )
                    {
                        var div = $(item).find('div');
                        $(div).attr('title', $(div).html());
                    }
                    if(_.endsWith(id, 'c106') )
                    {
                        var div = $(item).find('div');
                        $(div).attr('title', $(div).html());
                    }
                    if(_.endsWith(id, 'c102') )
                    {
                        var div = $(item).find('span');
                        $(div).attr('title', $(div).html());
                    }
                });
            }
        });

    }else{
        $.webgis.data.bbn.control.predict_grid.loadData(tabledata);
    }
    $.webgis.data.bbn.control.predict_grid.expandAll();
}



var GetAssumeSelects = function()
{
    var ret = [];
    $('#div_state_examination_bbn_assume_selects').find('select.assume_selects_name').each(function(i, item){
        var uid = $(item).attr('id').replace('name_', '');
        var name = $(item).val();
        var value = $('#value_' + uid).val();
        //if (value === 'true') value = true;
        //if (value === 'false') value = false;
        ret.push({name: name, value:value});
    });
    return ret;
};
function RenderPredictSelect(){
    var change_value = function(uid, alist, v)
    {
        var options1 = '<option value="">(请选择)</option>';
        if (v.length === 0) {
            $('#value_' + uid).html(options1);
            $('#value_' + uid).multipleSelect('refresh');
            $('#value_' + uid).multipleSelect('setSelects', ['']);
        }
        else
        {
            var o = _.find(alist, {name: v});
            if (o) {
                _.forEach(o.domains, function (item) {
                    var o1 = _.find($.webgis.data.bbn.domains_range, {value: item});
                    if (o1) {
                        options1 += '<option value="' + o1.value + '">' + o1.name + '</option>';
                    }
                });
                $('#value_' + uid).html(options1);
                $('#value_' + uid).multipleSelect('refresh');
                $('#value_' + uid).multipleSelect('setSelects', ['']);
            }
        }
    };
    var id0;
    var add_assume_selects = function(){
        $('#div_state_examination_bbn_assume_selects').find('.blank_assume_selects').remove();
        var grid_data = [{name:'line_state', display_name:'线路整体评价', domains:['I', 'II', 'III', 'IV']}];
         _.forEach($.webgis.data.bbn.grid_data, function(item){
            if(_.startsWith(item.name, 'unit_')) {
                grid_data.push({name: item.name, display_name: item.display_name, domains: item.domains});
            }
        });

        var options = '<option value="">(请选择)</option>';
        var options1 = '<option value="">(请选择)</option>';
        _.forEach(grid_data, function(item){
            options += '<option value="' + item.name + '">' + item.display_name +'</option>';
        });
        var uid = $.uuid();
        var title1 = '';
        var exists = GetAssumeSelects();
        if(exists.length === 0){
            title1 = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当';
            id0 = uid;
        }else{
            title1 = '&nbsp;&nbsp;&nbsp;并且';
        }
        $('#div_state_examination_bbn_assume_selects')
            .append('<div id="div_' + uid + '" class="div_assume_select">' + title1
            + '<select id="name_' + uid + '" class="assume_selects_name" >' + options + '</select>'
            + '&nbsp;&nbsp;为&nbsp;&nbsp;'
            + '<select id="value_' + uid + '" class="assume_selects_value" >' + options1 + '</select>'
            + '&nbsp;'
            + '<a class="assume_select_new" href="javascript:void(0);">新增条件</a>'
            + '&nbsp;&nbsp;'
            + '<a class="assume_select_del" href="javascript:void(0);">删除条件</a>'
            + '</div>'
        );
        $('#name_' + uid).multipleSelect({
            single: true,
            position: 'bottom',
            multipleWidth: 200,
            onClick: function(view) {
                //console.log(view);
                change_value(uid, grid_data, view.value);
            }
        });
        $('#value_' + uid).multipleSelect({
            single: true,
            position: 'bottom',
            multipleWidth: 100
        });
        $('#name_' + uid).multipleSelect('setSelects', ['']);
        change_value(uid, grid_data, '');
        $('#value_' + uid).multipleSelect('setSelects', ['']);
        $('#div_' + uid).find('a.assume_select_new').off();
        $('#div_' + uid).find('a.assume_select_del').off();
        $('#div_' + uid).find('a.assume_select_new').on('click', function(){
            add_assume_selects();
        });
        $('#div_' + uid).find('a.assume_select_del').on('click', function(){
            var id = $(this).parent().attr('id').replace('div_', '');
            if(id != id0 ) {
                $('#div_state_examination_bbn_assume_selects').find('#div_' + id).remove();
            }
        });
    };
    add_assume_selects();
}
function SaveBBNGridData(viewer, line_name, callback)
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
            var datastr = JSON.stringify(data);
            //console.log(datastr);
            //if(true) return;
            ShowProgressBar(true, 670, 200, '保存', '正在保存，请稍候...');
            $.ajax({
                url:'/bayesian/save/node',
                method:'post',
                data: datastr
            })
            .always(function () {
                ShowProgressBar(false);
            })
            .done(function (data1) {
                $.jGrowl("保存成功:" , {
                    life: 2000,
                    position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                    theme: 'bubblestylesuccess',
                    glue:'before'
                });
                data1 = _.sortBy(JSON.parse(data1), function(n) {
                    return n.name;
                });
                $.webgis.data.bbn.grid_data = data1;
                if(callback) callback(data1);
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
function SaveBBNGridDataPartial(viewer, data, callback)
{
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
        data1 = _.sortBy(JSON.parse(data1), function(n) {
            return n.name;
        });
        $.webgis.data.bbn.grid_data = data1;
        if(callback) callback(data1);
    })
    .fail(function (jqxhr, textStatus, e) {
        $.jGrowl("保存失败:" + e, {
            life: 2000,
            position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
            theme: 'bubblestylefail',
            glue:'before'
        });
    });
}

function DeleteBBNGridData(viewer, _id, callback)
{
    var remove_related = function(option)
    {
        var check_is_in = function(list, name)
        {
            var ret = false;
            _.forEach(list, function(item){
                var names = _.map(item[0], function(item1){
                    return item1[0];
                });
                if(_.indexOf(names, name)>-1){
                    ret = true;
                    return;
                }
            });
            return ret;
        };
        var names = _.pluck(_.where($.webgis.data.bbn.grid_data, option), 'name');
        var ret = [];
        _.forEach(names, function(name){
            _.forEach($.webgis.data.bbn.grid_data, function(o){
                var idx = _.findIndex($.webgis.data.bbn.grid_data, '_id', o._id);
                if(check_is_in(o.conditions, name))
                {
                    $.webgis.data.bbn.grid_data[idx].conditions = [[[], {}]];
                    _.forEach(o.domains, function (item1) {
                        $.webgis.data.bbn.grid_data[idx].conditions[0][1][item1] = 0.0;
                    });
                    //console.log($.webgis.data.bbn.grid_data[idx].conditions);
                    ret.push($.webgis.data.bbn.grid_data[idx]);
                }
            });
        });
        return ret;
    };
    var name = _.result(_.find($.webgis.data.bbn.grid_data, {_id:_id}), 'name');
    var display_name = _.result(_.find($.webgis.data.bbn.grid_data, {_id:_id}), 'display_name');
    if(_.startsWith(name, 'unit_') || _.startsWith(name, 'line_state')){
        ShowMessage(null, 400, 250, '错误', '禁止删除[' + display_name + '].');
        return;
    }
    _.remove($.webgis.data.bbn.grid_data, {_id:_id});
    ShowConfirm(null, 500, 200,
        '删除确认',
        '删除该节点将影响所有与之有关联的后继节点，确认删除[' + display_name + ']吗?',
        function () {
            ShowProgressBar(true, 670, 200, '删除', '正在删除，请稍候...');
            $.ajax({
                url:'/bayesian/delete/node',
                method:'post',
                data: JSON.stringify({_id:_id})
            })
            .always(function () {
                ShowProgressBar(false);
            })
            .done(function (data1) {
                var data = remove_related({_id:_id});
                if(data.length)
                {
                    SaveBBNGridDataPartial(viewer, data, function (data1) {
                        $.jGrowl("删除成功:", {
                            life: 2000,
                            position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                            theme: 'bubblestylesuccess',
                            glue: 'before'
                        });
                        if (callback) callback(data1);
                    });
                }else{
                    $.jGrowl("删除成功:", {
                        life: 2000,
                        position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                        theme: 'bubblestylesuccess',
                        glue: 'before'
                    });
                    if (callback) callback();
                }
            })
            .fail(function (jqxhr, textStatus, e) {
                $.jGrowl("删除失败:" + e, {
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
function DeleteBBNGridData1(viewer, idlist, namelist, callback)
{
    //console.log(idlist);
    //console.log(namelist);

    var sels = $('#form_state_examination_bbn_bbn_line_name').multipleSelect('getSelects');
    if (sels.length === 0  || sels[0].length === 0) {
        ShowMessage(null, 400, 250, '错误', '请先选择线路');
        return;
    }
    var line_name = sels[0];
    ShowProgressBar(true, 670, 200, '删除', '正在删除，请稍候...');
    $.ajax({
        url:'/bayesian/delete/node',
        method:'post',
        data: JSON.stringify({line_name:line_name, _id:idlist, names:namelist})
    })
    .always(function () {
        ShowProgressBar(false);
    })
    .done(function (data1) {
            $.jGrowl("删除成功:", {
                life: 2000,
                position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                theme: 'bubblestylesuccess',
                glue: 'before'
            });
            var arr = _.sortBy(JSON.parse(data1), function(n) {
                return n.name;
            });
            $.webgis.data.bbn.grid_data = arr;
            if (callback) callback(data1);
    })
    .fail(function (jqxhr, textStatus, e) {
        $.jGrowl("删除失败:" + e, {
            life: 2000,
            position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
            theme: 'bubblestylefail',
            glue:'before'
        });
    });
}

function DoPredict(callback)
{
    var ass = GetAssumeSelects();
    if(ass.length === 0){
        ShowMessage(null, 400, 250, '错误',  '请先选择线路');
        return;
    }
    var msg = '';
    var list = [];
    var grid_data = [{name:'line_state', display_name:'线路整体评价', domains:['I', 'II', 'III', 'IV']}];
     _.forEach($.webgis.data.bbn.grid_data, function(item){
        grid_data.push({name:item.name, display_name:item.display_name, domains:item.domains});
    });
    _.forEach(ass, function(item){
        var name = '';
        if(item.name.length === 0 || item.value.length === 0){
            if(item.name.length) {
                name = _.result(_.find(grid_data, {name: item.name}), 'display_name');
            }
            msg += '先决条件不能有空值[' + name + ']=[' +  item.value + ']<br/>';
        }
        if(item.name.length)
        {
            name = _.result(_.find(grid_data, {name: item.name}), 'display_name');
            if(_.indexOf(list, item.name) === -1) {
                list.push(item.name);
            }else{
                msg += '先决条件不能存在重复值[' + name + ']';
                return;
            }
        }
    });
    if(msg.length) {
        ShowMessage(null, 400, 250, '错误',  msg + '');
        return;
    }
    //console.log(ass);
    var sels = $('#form_state_examination_bbn_bbn_line_name').multipleSelect('getSelects');
    if(sels.length === 0  || sels[0].length === 0){
        ShowMessage(null, 400, 250, '错误',  '请先选择线路');
        return;
    }
    var line_name = sels[0];
    var data = {line_name: line_name};
    _.forEach(ass, function(item){
        data[item.name] = item.value;
    });
    ShowProgressBar(true, 670, 200, '查询', '正在查询预测，请稍候...', 140);
    $.ajax({
        url: '/bayesian/query/predict',
        method: 'post',
        data: JSON.stringify(data)
    })
    .always(function () {
        ShowProgressBar(false);
    })
    .done(function (data1) {
        data1 = JSON.parse(data1);
        var names = _.pluck(ass, 'name');
        data1 = _.filter(data1, function(item){
            return _.indexOf(names, item.name) < 0;
        });
        $.webgis.data.bbn.predict_grid_data    = data1;
        $('#cb_state_examination_bbn_assume_predict_display_0').removeAttr('checked');
        if(callback) callback(data1);
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
function DoPredict1(callback)
{
    var msg = '';
    var list = [];
    //console.log(ass);
    var sels = $('#form_state_examination_bbn_bbn_line_name').multipleSelect('getSelects');
    if(sels.length === 0 || sels[0].length === 0){
        ShowMessage(null, 400, 250, '错误',  '请先选择线路');
        return;
    }
    var line_name = sels[0];
    var data = {line_name: line_name};
    //_.forEach(ass, function(item){
    //    data[item.name] = item.value;
    //});
    data['line_state'] = ['II', 'III', 'IV'];
    //ShowProgressBar(true, 670, 200, '查询', '正在查询预测，请稍候...', 140);
    ShowProgressBar(true, 670, 200, '查询', '正在查询预测，请稍候...', 400);
    $.ajax({
        url: '/bayesian/query/predict',
        method: 'post',
        data: JSON.stringify(data)
    })
    .always(function () {
        ShowProgressBar(false);
    })
    .done(function (data1) {
        data1 = JSON.parse(data1);
        $.webgis.data.bbn.predict_grid_data    = data1;
        $('#cb_state_examination_bbn_assume_predict_display_0').removeAttr('checked');
        if(callback) callback(data1);
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

function PredictExport()
{
    if(!_.isUndefined($.webgis.data.bbn.control.predict_grid))
    {
        if($.webgis.data.bbn.control.predict_grid.rows.length===0){
            return;
        }
        var sels = $('#form_state_examination_bbn_bbn_line_name').multipleSelect('getSelects');
        if (sels.length === 0 || sels[0].length === 0) {
            ShowMessage(null, 400, 250, '错误', '请先选择线路');
            return;
        }
        var line_name = sels[0];
        var table = $('#div_state_examination_bbn_predict_grid .l-grid-body-table');
        var table1 = table.clone();
        //console.log(table1);
        var tableheader = '<thead><tr><td colspan=5>线路名称:' + line_name + '</td></tr></thead>';
        tableheader += '<thead><tr><td>线路预测等级</td><td>预测项名称</td><td>预测项取值</td><td>预测项取值概率</td><td>详细描述</td><td>检修建议</td></tr></thead>';
        table1.html(tableheader + table1.html());
        var href = ExcellentExport.excel(null, table1[0], 'Sheet1');
        window.open(href, '_blank');
    }
}
function PredictCollapseExpand()
{
    if(!_.isUndefined($.webgis.data.bbn.control.predict_grid))
    {
        if (TREE_COLLAPSE)
        {
            $.webgis.data.bbn.control.predict_grid.expandAll();
        } else {
            $.webgis.data.bbn.control.predict_grid.collapseAll();
        }
        TREE_COLLAPSE = !TREE_COLLAPSE;
    }
}

function DrawPredictTable(data)
{
    var get_p = function(alist, name, value)
    {
        var ret;
        var o = _.result(_.find(alist, {name:name, value:value}), 'p');
        if(!_.isUndefined(o)) {
            ret = o.toFixed(2);
        }
        return ret;
    };
    var is_in_assume = function(assume, name)
    {
        return !_.isUndefined(_.find(assume, {name:name}));
    };
    //console.log(data);
    var assume = GetAssumeSelects();
    var sels = $('#form_state_examination_bbn_bbn_line_name').multipleSelect('getSelects');
    var list = [];
    if(!is_in_assume(assume, 'line_state')){
        var o = {display_name:'线路整体评价', children:[]};
        var value = '';
        var probability = '';
        _.forEach(['I', 'II', 'III', 'IV'], function(item){
            var v = GetDomainName(item);
            var p = get_p(data, 'line_state', item);
            if(!_.isUndefined(p)){
                o.children.push({value:v, probability:p});
                value += v + ',';
                probability += p + ',';
            }
        });
        o.value = value;
        o.probability = probability;
        list.push(o);
    }
    _.forEach($.webgis.data.bbn.grid_data, function(item){
        if(is_in_assume(assume, item.name)){
            return true;
        }
        var o = {display_name:item.display_name};
        o.children = [];
        var value = '';
        var probability = '';
        _.forEach(item.domains, function(domain){
            var v = GetDomainName(domain);
            var p = get_p(data, item.name, domain);
            if(!_.isUndefined(p))
            {
                o.children.push({value: v, probability: p});
                value += v + ',';
                probability += p + ',';
            }
        });
        o.value = value;
        o.probability = probability;
        list.push(o);
    });
    PredictGridLoad(list);
}

function DrawPredictTable2(data)
{
    var get_v = function(alist, id, key)
    {
        var ret;
        var findit = false;
        _.forEach(alist, function(item){
            _.forEach(item.children, function(item1){
                if( item1.id === id.replace('unitsub_', '')){
                    ret = item1[key];
                    findit = true;
                    return;
                }
            });
            if(findit){
                return;
            }
        });
        return ret;
    };
    var get_unit_name = function(unit){
        var l = ['基础', '杆塔', '导地线', '绝缘子串', '金具', '接地装置', '附属设施', '通道环境'];
        var arr = unit.split('_');
        return l[parseInt(arr[1])-1];
    };
    var get_lvl_index = function(lvl){
        var l = ['I','II','III','IV'];
        return _.indexOf(l, lvl) + 1;
    };
    var get_lvl_max = function(lvlist){
        var l = _.map(lvlist, function(item){
            return get_lvl_index(item);
        });
        var m = _.max(l);
        var lo = ['I','II','III','IV'];
        return lo[m-1];
    };
    var check_lvl = function(alist, obj)
    {
        //var o = _.find(alist, {level:obj.level, id:obj.id});
        var o = _.find(alist, {id:obj.id});
        if(o)
        {
            //if(get_lvl_index(obj.level) > get_lvl_index(o.level)){
                _.remove(alist, {id:obj.id});
            //}
        }
    };
    var get_unit_suggestion = function(unit, lvl){
        var ret = '';
        var ms = maintain_strategy(unit, lvl);
        ret = '检修策略:' + ms.strategy + '。\n建议时限:' + ms.timeline + '。\n措施:' + ms.suggestion + '。';
        return ret;
    };
    var get_domain_name = function(value)
    {
        return _.result(_.find($.webgis.data.bbn.domains_range, {value:value}), 'name');
    };
    var get_max_history_level = function(){
        var ret = get_lvl_max(_.pluck($.webgis.data.state_examination.list_data_current_line, 'line_state'));
        return ret;
    };
    var get_max_p = function(amap){
        var ret = [];
        var m = 0;
        _.forIn(amap, function(v, k){
            if(k === 'I' && v === 1){
                return true;
            }
            if(v > m){
                m = v;
                ret = [k, v];
            }
        });
        return ret;
    };
    //var sels = $('#form_state_examination_bbn_bbn_line_name').multipleSelect('getSelects');
    //if (sels.length === 0 || sels[0].length === 0) {
    //    ShowMessage(null, 400, 250, '错误', '请先选择线路');
    //    return;
    //}
    //var line_name = sels[0];
    var max_history_level = get_max_history_level();
    //console.log(max_history_level);
    var list = [];
    _.forEach(data, function(item) {
        if (item.line_state === max_history_level) {
            _.forEach(_.range(1, 9), function (i) {
                var o = {};
                o.id = 'unit_' + i;
                o.name = '(' + get_unit_name(o.id) + ')';
                o.unit = get_unit_name(o.id);
                o.plist = {};
                list.push(o);
            });
            _.forEach(item.result, function (item1) {
                //if(_.startsWith(item1.name, 'unit_') && item1.p>0 && item1.value != 'I'){
                if (_.startsWith(item1.name, 'unit_')) {
                    //var o = {};
                    var oidx = _.findIndex(list, 'id', item1.name);
                    if (oidx > -1) {
                        list[oidx].plist[item1.value] = item1.p;

                    }
                }
            });
            _.forEach(list, function (item1) {
                var oidx = _.findIndex(list, 'id', item1.id);
                list[oidx].description = get_v($.webgis.data.bbn.unitsub_template_2009, item1.id, 'according');
                if(_.isUndefined(list[oidx].description)){
                    list[oidx].description = get_v($.webgis.data.bbn.unitsub_template_2014, item1.id, 'according');
                }
                var max_p = get_max_p(list[oidx].plist);
                list[oidx].probability = 0;
                if (max_p.length) {
                    list[oidx].probability = max_p[1];
                }
                list[oidx].suggestion = get_v($.webgis.data.bbn.unitsub_template_2009, item1.id, 'strategy');
                if(_.isUndefined(list[oidx].suggestion)){
                    list[oidx].suggestion = get_v($.webgis.data.bbn.unitsub_template_2014, item1.id, 'strategy');
                }
            });
        }
    });
    _.forEach(data, function(item){
        _.forEach(item.result, function(item1){
            if(_.startsWith(item1.name, 'unitsub_') && item1.p>0){
                var o = {};
                var unit = item1.name.substr(8, 6);
                o.id = item1.name;
                o.name = get_v($.webgis.data.bbn.unitsub_template_2009, item1.name, 'name');
                if(_.isUndefined(o.name)){
                    o.name = get_v($.webgis.data.bbn.unitsub_template_2014, item1.name, 'name');
                    o.name = get_v($.webgis.data.bbn.unitsub_template_2014, item1.name, 'cat') + o.name;
                }
                o.unit = get_unit_name(unit);
                //o.level = get_v($.webgis.data.bbn.unitsub_template_2009, item1.name, 'level');
                o.description = get_v($.webgis.data.bbn.unitsub_template_2009, item1.name, 'according');
                if(_.isUndefined(o.description)){
                    o.description = get_v($.webgis.data.bbn.unitsub_template_2014, item1.name, 'according');
                }
                o.probability = item1.p;
                o.suggestion = get_v($.webgis.data.bbn.unitsub_template_2009, item1.name, 'strategy');
                if(_.isUndefined(o.suggestion)){
                    o.suggestion = get_v($.webgis.data.bbn.unitsub_template_2014, item1.name, 'strategy');
                }
                list.push(o);
            }
        });
    });
    //console.log(data);
    //console.log($.webgis.data.bbn.unitsub_template_2009);
    //console.log(list);
    if(list.length === 0)
    {
        _.forEach(data, function(item){
            var line_state = item.line_state;
            _.forEach(item.result, function(item1){
                //if(_.startsWith(item1.name, 'unit_') && item1.p>0 && item1.value != 'I'){
                if(_.startsWith(item1.name, 'unit_') && item1.p>0 ){
                    var o = {};
                    var unit = item1.name;
                    o.id = item1.name;
                    o.name = '(' + get_unit_name(unit) + ')';
                    o.unit = get_unit_name(unit);
                    o.level = item1.value;
                    o.description = get_domain_name(item1.value);
                    o.probability = item1.p;
                    o.suggestion = get_unit_suggestion(item1.name, item1.value);
                    check_lvl(list, o);
                    list.push(o);
                }
            });
        });
    }
    PredictGridLoad2(list);
}
function DrawPredictTable1(data)
{
    var get_p = function(alist, name, value)
    {
        var ret;
        var o = _.result(_.find(alist, {name:name, value:value}), 'p');
        if(!_.isUndefined(o)) {
            ret = o;
        }
        return ret;
    };
    //var get_domain_name = function(value)
    //{
    //    return _.result(_.find($.webgis.data.bbn.domains_range, {value:value}), 'name');
    //};
    var is_in_assume = function(assume, name)
    {
        return !_.isUndefined(_.find(assume, {name:name}));
    };
    var get_p_format = function(value)
    {
        var ret;
        if(!_.isUndefined(value)) {
            ret = (value*100).toFixed(0) + '%';
        }
        return ret;
    };
    var get_description = function(line_state)
    {
        //console.log(line_state);
        var ret = _.pluck(_.where($.webgis.data.state_examination.list_data_current_line, {line_state:line_state}), 'description');
        if(_.isUndefined(ret)){
            ret = '';
        }else{
            ret = ret.join('\n');
        }
        return ret;
    };
    var get_suggestion = function(line_state)
    {
        //console.log(line_state);
        var ret = _.pluck(_.where($.webgis.data.state_examination.list_data_current_line, {line_state:line_state}), 'suggestion');
        if(_.isUndefined(ret)){
            ret = '';
        }else{
            ret = ret.join('\n');
            ret = ret.replace(/\s+/g, '');
            var re = /\d\.[ABCDE]/g;
            var matchlist = ret.match(re);
            _.forEach(matchlist, function(item){
                var rr = new RegExp(item, 'g');
                ret = ret.replace(rr, '\n'+ item);
            });
        }
        return ret;
    };
    var list = [];
    var assume = [{name:'line_state'}];

    _.forEach(data, function(dataitem){
        var o = {
            line_state: GetDomainName(dataitem.line_state),
            children:[],
            description:get_description(dataitem.line_state),
            suggestion:get_suggestion(dataitem.line_state),
        };
        _.forEach($.webgis.data.bbn.grid_data, function(item){
            if(is_in_assume(assume, item.name)){
                return true;
            }
            var o1 = {display_name:item.display_name};
            o1.children = [];
            var value = '';
            var probability = '';
            var max_v;
            _.forEach(item.domains, function(domain){
                var v = GetDomainName(domain);
                var p = get_p(dataitem.result, item.name, domain);
                if(!_.isUndefined(p))
                {
                    var p_format = get_p_format(p);
                    //var bar = add_bar(p, p_format);
                    o1.children.push({value: v, probability: p});
                    value += v + ',';
                    probability += p_format + ',';
                    if(p>0){
                        max_v = domain;
                    }

                }
            });
            o1.value = value;
            o1.probability = probability;
            if(max_v){
                var ms = maintain_strategy(item.name, max_v);
                if(!_.isUndefined(ms.suggestion)){
                    if(max_v === 'I'){
                        o1.suggestion = '检修策略:' + ms.strategy + '。\n建议时限:' + ms.timeline + '。';
                    }else
                    {
                        o1.suggestion = '检修策略:' + ms.strategy + '。\n建议时限:' + ms.timeline + '。\n措施:' + ms.suggestion + '。';
                    }
                }
            }
            o.children.push(o1);
        });
        list.push(o);
    });
    PredictGridLoad1(list);
}

function ResetBBNUnit(viewer, line_name, callback)
{
    ShowConfirm(null, 500, 200,
        '删除重置',
        '将根据状态评价数据重置该线路所有单元，可能影响所有自定义添加的所有前驱节点，确认重置吗?',
        function () {
            ShowProgressBar(true, 670, 200, '重置', '正在重置，请稍候...');
            $.ajax({
                url:'/bayesian/reset/unit',
                method:'post',
                data: JSON.stringify({line_name:line_name})
            })
            .always(function () {
                ShowProgressBar(false);
            })
            .done(function (data1) {
                $.jGrowl("重置成功:", {
                    life: 2000,
                    position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                    theme: 'bubblestylesuccess',
                    glue: 'before'
                });
                data1 = JSON.parse(data1);
                $.webgis.data.bbn.grid_data = data1;
                if (callback) callback(data1);
            })
            .fail(function (jqxhr, textStatus, e) {
                $.jGrowl("重置失败:" + e, {
                    life: 2000,
                    position: 'bottom-right', //top-left, top-right, bottom-left, bottom-right, center
                    theme: 'bubblestylefail',
                    glue:'before'
                });
            });
        },
        function () {

        }
    );
}

function PredictSummaryDialog(viewer)
{
    var sels = $('#form_state_examination_bbn_bbn_line_name').multipleSelect('getSelects');
    if (sels.length === 0 || sels[0].length === 0) {
        ShowMessage(null, 400, 250, '错误', '请先选择线路');
        return;
    }
    var line_name = sels[0];
    $('#dlg_state_examination_bbn_predict_summary').remove();
    CreateDialogSkeleton(viewer, 'dlg_state_examination_bbn_predict_summary');
    $('#dlg_state_examination_bbn_predict_summary').dialog({
        width: 630,
        height: 650,
        minWidth:200,
        minHeight: 200,
        draggable: true,
        resizable: true,
        modal: false,
        position:{at: "center"},
        title:'预测走势',
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
                text: "导出",
                click: function(e){
                    $('#flottooltip').hide();
                    var obj = {};
                    var sels = $('#form_state_examination_bbn_assume_years').multipleSelect('getSelects');
                    var ys = parseInt(sels[0]);
                    obj.line_name = line_name;
                    obj.year_num = ys;
                    var formdata = $('#form_state_examination_bbn_predict_summary').webgisform('getdata');
                    obj.attention = formdata.attention;
                    obj.description = formdata.description;
                    obj.suggestion = formdata.suggestion;
                    PredictSummaryExport(viewer, obj);
                }
            },
            {
                text: "确定",
                click: function(e){
                    $('#flottooltip').hide();
                    $( this ).dialog( "close" );
                    $('#dlg_state_examination_bbn_predict_summary').remove();
                }
            }
        ]
    });
    var flds = [
        { display: "重点关注", id: "attention", newline: true, type: "text",  defaultvalue: '', group: '检修意见', width: 400, labelwidth: 120},
        { display: "历史劣化记录", id: "description", newline: true, type: "textarea",  defaultvalue: '', group: '检修意见', width: 400, height:100, labelwidth: 120},
        { display: "检修建议", id: "suggestion", newline: true, type: "textarea",  defaultvalue: '', group: '检修意见', width: 400, height:100, labelwidth: 120},
    ];
    $('#form_state_examination_bbn_predict_summary').webgisform(flds, {
        prefix: "form_state_examination_bbn_predict_summary_",
        maxwidth: 530
        //margin:10,
        //groupmargin:10
    });

    var get_description = function()
    {
        var ret = '';
        _.forEach($.webgis.data.state_examination.list_data_current_line, function(item){
            ret += item.check_year + '年:\n';
            if(_.isUndefined(item.description)){
                item.description = '';
            }
            ret += item.description + '\n';
        });
        //console.log($.webgis.data.state_examination.list_data_current_line);
        //if(ret.length)
        //{
        //    ret = ret.join('\n');
        //}
        return ret;
    };
    var get_suggestion = function()
    {
        //var ret = _.pluck(_.where($.webgis.data.state_examination.list_data_current_line, {line_state:'IV'}), 'suggestion');
        //if(_.isUndefined(ret) || ret.length === 0){
        //    ret = _.pluck(_.where($.webgis.data.state_examination.list_data_current_line, {line_state:'III'}), 'suggestion');
        //}
        //if(_.isUndefined(ret) || ret.length === 0){
        //    ret = _.pluck(_.where($.webgis.data.state_examination.list_data_current_line, {line_state:'II'}), 'suggestion');
        //}
        //if(_.isUndefined(ret) || ret.length === 0){
        //    ret = _.pluck(_.where($.webgis.data.state_examination.list_data_current_line, {line_state:'I'}), 'suggestion');
        //}
        //if(_.isUndefined(ret) || ret.length === 0){
        //    ret = '';
        //}
        var check234 = function(obj){
            var ret;
            var l = ['II', 'III', 'IV'];
            _.forEach(_.range(1, 9), function(i){
                if(_.includes(l,  obj['unit_' + i])){
                    ret = {};
                    ret.unit = 'unit_' + i;
                    ret.level = obj['unit_' + i];
                    return;
                }
            });
            return ret;
        };
        var check_lvl_lt= function(a1, a2){
            var m = {'I':1, 'II':2, 'III':3, 'IV':4};
            return m[a1] < m[a2];
        };
        var get_v = function(alist, id, key)
        {
            var ret;
            _.forEach(alist, function(item){
                _.forEach(item.children, function(item1){
                    if( item1.id === id.replace('unitsub_', '')){
                        ret = item1[key];
                        return;
                    }
                });
            });
            return ret;
        };
        var ret = _.pluck($.webgis.data.state_examination.list_data_current_line, 'suggestion');
        ret = '';
        if(ret.length)
        {
            ret = ret.join('\n');
            ret = ret.replace(/\s+/g, '');
            var re = /\d\.[ABCDE]/g;
            var matchlist = ret.match(re);
            _.forEach(matchlist, function(item){
                var rr = new RegExp(item, 'g');
                ret = ret.replace(rr, '\n'+ item);
            });
        }else{
            var units = {};
            var unitsubids = [];
            _.forEach($.webgis.data.state_examination.list_data_current_line, function(item){
                if(!_.isUndefined(item.unitsub)){
                    _.forEach(item.unitsub, function(item1){
                        if(!_.includes(unitsubids, item1.id)){
                            unitsubids.push(item1.id);
                        }
                    });
                }
                var ulevel = check234(item);
                if(!_.isUndefined(ulevel))
                {
                    if(!_.has(units, ulevel.unit)){
                        units[ulevel.unit] = ulevel.level;
                    }else{
                        if(check_lvl_lt(units[ulevel.unit], ulevel.level)){
                            units[ulevel.unit] = ulevel.level;
                        }
                    }
                }
            });
            //console.log(unitsubids);
            var sarr = [];
            _.forIn(units, function(v, k){
                var o = maintain_strategy(k, v);
                if(o){
                    sarr.push(o.suggestion);
                }
            });
            ret = sarr.join('\n');
            sarr = [];
            _.forEach(unitsubids, function(item){
                var sugg = get_v($.webgis.data.bbn.unitsub_template_2009, item, 'strategy');
                if(_.isUndefined(sugg)){
                    sugg = get_v($.webgis.data.bbn.unitsub_template_2014, item, 'strategy');
                }
                sarr.push(sugg);
            });
            ret += '\n';
            ret += sarr.join('\n');
        }
        //console.log(ret);
        return ret;
    };
    var get_unit_name = function(idx){
        return _.result(_.find($.webgis.data.state_examination.standard2014, {unit_index:idx}), 'parent');
    };
    var get_attention = function()
    {
        var list = [];
        _.forEach($.webgis.data.state_examination.list_data_current_line, function(item){
            _.forIn(item, function(v, k){
                if(k.indexOf('unit_')>-1 && (v === 'II' || v === 'III' || v === 'IV'))
                {
                    list.push(get_unit_name(parseInt(k.replace('unit_', ''))));
                }
            });
        });
        list = _.uniq(list);
        return list.join(',');
    };
    $('#form_state_examination_bbn_predict_summary').webgisform('setdata', {
        attention: get_attention(),
        description: get_description(),
        suggestion: get_suggestion()
    });

    var get_latest_record = function(){
        var years = _.pluck($.webgis.data.state_examination.list_data_current_line, 'check_year');
        var latest_year = _.max(years);
        return _.find($.webgis.data.state_examination.list_data_current_line, {check_year:latest_year});
    };
    var get_p_by_year = function(filtername, year){
        var probs = calc_past_probability_series($.webgis.data.state_examination.list_data_current_line, filtername, year);
        var check_year1 = _.map(_.pluck(probs, 'check_year'), function(item){
            return moment(item, 'YYYY').toDate().getTime();
        });
        var prob = {};
        prob[filtername] = {};
        var graph_data = {};
        graph_data[filtername] = {};
        //_.forEach(_.range(1, 9), function(i){
        //    prob['unit_' + i] = {};
        //    graph_data['unit_' + i] = {};
        //});
        _.forEach(['I', 'II', 'III', 'IV'], function(item){
            prob[filtername][item] = _.map(_.pluck(probs, 'prob.' + filtername + '.' + item), function(n){
                return Math.floor(n*100);
            });
            graph_data[filtername][item] = _.zip(check_year1, prob[filtername][item]);
        });
        //console.log(check_year1);
        //console.log(graph_data[filtername]);
        var ret = [];
        _.forEach([ 'IV','III', 'II', 'I'], function(lvl){
            var o = {};
            o.id = filtername + '_' + lvl;
            o.label = '';//get_unit_name(i);
            if(lvl === 'I'){
                o.label = '正常';
                o.color = "rgb(0, 255, 0)";
                o.stack = false;
            }
            if(lvl === 'II'){
                o.label = '注意';
                o.color = "rgb(0, 0, 255)";
                o.stack = false;
            }
            if(lvl === 'III'){
                o.label = '异常';
                o.color = "rgb(255, 255, 0)";
                o.stack = true;
            }
            if(lvl === 'IV'){
                o.label = '严重';
                o.color = "rgb(255, 0, 0)";
                o.stack = true;
            }
            o.data = graph_data[filtername][lvl];
            o.lines =  {
                show: true,
                steps: false
            };
            o.points ={ show: true };
            ret.push(o);
        });
        return ret;
    };

    var draw_chart = function(){
        var sels = $('#form_state_examination_bbn_assume_years').multipleSelect('getSelects');
        var ys = parseInt(sels[0]);
        var probs = calc_future_probability_series($.webgis.data.state_examination.list_data_current_line, ys);
        //console.log(probs);
        var check_year = _.map(_.pluck(probs, 'check_year'), function(item){
            return moment(item, 'YYYY').toDate().getTime();
        });
        var prob = {line_state:{}};
        var graph_data = {line_state:{}};
        _.forEach(_.range(1, 9), function(i){
            prob['unit_' + i] = {};
            graph_data['unit_' + i] = {};
        });
        _.forEach(['I', 'II', 'III', 'IV'], function(item){
            prob['line_state'][item] = _.map(_.pluck(probs, 'prob.line_state.' + item), function(n){
                return Math.floor(n*100);
            });
            graph_data['line_state'][item] = _.zip(check_year, prob['line_state'][item]);
            _.forEach(_.range(1, 9), function(i){
                prob['unit_' + i][item] = _.map(_.pluck(probs, 'prob.unit_' + i + '.' + item), function(n){
                    return Math.floor(n*100);
                });
                graph_data['unit_' + i][item] = _.zip(check_year, prob['unit_' + i][item]);
            });
        });
        //console.log(graph_data);
        //if(!_.isUndefined($.webgis.control.flot_graph))
        //{
        //    $.webgis.control.flot_graph.destroy();
        //    $.webgis.control.flot_graph = undefined;
        //}
        var threashold_markings = [
            { color: "rgba(255, 0, 0, 0.2)", yaxis: { from: 50, to:100 }, label:'高风险' },
            { color: "rgba(255, 128, 0, 0.2)", yaxis: { from: 20, to:50 } },
            { color: "rgba(0, 255, 0, 0.2)", yaxis: { from: 0, to:20 } },
        ];
        var plot_data = [
            {
                id:'line_state_IV',
                data: graph_data.line_state.IV,
                color: "rgb(255, 0, 0)",
                label: '严重',
                stack: true,
                lines: {
                    show: true,
                    steps: false
                },
                points: { show: true }
            },
            {
                id:'line_state_III',
                data: graph_data.line_state.III,
                color: "rgb(255, 159, 0)",
                label: '异常',
                stack: true,
                lines: {
                    show: true,
                    steps: false
                },
                points: { show: true }
            },
            {
                id:'line_state_II',
                data: graph_data.line_state.II,
                color: "rgb(255, 255, 0)",
                stack: false,
                lines: {
                    show: true,
                    steps: false
                },
                points: { show: true },
                label: '注意'
            },
            {
                id:'line_state_I',
                data: graph_data.line_state.I,
                color: "rgb(0, 255, 0)",
                stack: false,
                lines: {
                    show: true,
                    steps: false
                },
                points: { show: true },
                label: '正常'
            },
        ];
        _.forEach(_.range(1, 9), function(i){
            _.forEach([ 'IV','III', 'II', 'I'], function(lvl){
                var o = {};
                o.id = 'unit_' + i + '_' + lvl;
                o.label = '';//get_unit_name(i);
                if(lvl === 'I'){
                    o.label = '正常';
                    o.color = "rgb(0, 255, 0)";
                    o.stack = false;
                }
                if(lvl === 'II'){
                    o.label = '注意';
                    o.color = "rgb(255, 255, 0)";
                    o.stack = false;
                }
                if(lvl === 'III'){
                    o.label = '异常';
                    o.color = "rgb(255, 159, 0)";
                    o.stack = true;
                }
                if(lvl === 'IV'){
                    o.label = '严重';
                    o.color = "rgb(255, 0, 0)";
                    o.stack = true;
                }
                o.data = graph_data['unit_' + i][lvl];
                o.lines =  {
                    show: true,
                    steps: false
                };
                o.points ={ show: true };
                plot_data.push(o);
            });
        });

        if(_.isUndefined($('#flottooltip')[0]))
        {
            $('<div id="flottooltip"></div>').css({
                position: "absolute",
                display: "none",
                border: "1px solid blue",
                padding: "2px",
                "background-color": "#fee",
                opacity: 0.80,
                'z-index':9999
            }).appendTo("body");
        }
        var draw_plot = function(data, ticks){
            $.webgis.control.flot_graph =  $.plot(
                "#div_state_examination_bbn_predict_summary_graph",
                data,
                {
                    series: {
                        //stack: true,
                        hoverable: true
                    },
                    xaxis: {
                        mode: "time",
                        timeformat: "%Y",
                        ticks:ticks
                    },
                    yaxis: {
                        max:100,
                        min:0,
                        tickFormatter:function(v){
                            return v + '%';
                        }
                    },
                    grid: {
                        markings: threashold_markings,
                        hoverable: true,
                        clickable: true
                    },
                    legend: {
                        show: true,
                        //container:'#flotlegend',
                        labelFormatter: function(label, series) {
                            return '<input type="checkbox" id="flotlinechart_' + series.id + '" >' + label ;
                        }
                    }
                }
            );
            $('#div_state_examination_bbn_predict_summary_graph').off();
            $('#div_state_examination_bbn_predict_summary_graph').bind('plothover', function (event, pos, item) {
                if(item){
                    var x = item.datapoint[0];
                    var y = item.datapoint[1];
                    var text = '';
                    if(y < 20){
                        text = y + '%,(低风险)';
                    }
                    if(y >= 20 && y<=50){
                        text = y + '%,(中风险)';
                    }
                    if(y > 50){
                        text = y + '%,(高风险)';
                    }
                    $("#flottooltip").html(text)
                    .css({top: item.pageY+5, left: item.pageX+5})
                    .fadeIn(200);
                }else{
                    $("#flottooltip").hide();
                }
            });

            $('input[id^=flotlinechart_]').each(function(idx, item){
                $(item).attr('checked', 'checked');
            });
            $('input[id^=flotlinechart_]').off();
            $('input[id^=flotlinechart_]').on('click', function(){
                var id1 = $(this).attr('id');
                var id = id1.replace('flotlinechart_', '');
                var o = _.find(data, {id:id});
                var checked = $(this).is(':checked');
                o.lines.show = checked;
                o.points.show = checked;
                //o.stack = checked;
                $.webgis.control.flot_graph.setData(data);
                $.webgis.control.flot_graph.draw();
            });
        };

        var filter_data = function(filtername, isshowhistory){
            if(_.isUndefined(isshowhistory)){
                isshowhistory = false;
            }
            var plot_data1 = _.filter(plot_data, function(item){
                return item.id.indexOf(filtername) > -1;
            });

            if(isshowhistory === true)
            {
                var ys = _.pluck($.webgis.data.state_examination.list_data_current_line, 'check_year');
                ys.sort();
                var y = _.last(ys);
                //console.log(ys);
                var ys1 = _.map(ys, function(item){
                    return moment(item, 'YYYY').toDate().getTime();
                });

                var ys2 = _.uniq(_.union(ys1, check_year)).sort();
                var l = get_p_by_year(filtername, y);
                var plot_data2 = $.extend(true, [], plot_data1);
                _.forEach(plot_data2, function(n){
                    var ll = _.filter(l, function(nn){
                        return n.id === nn.id;
                    });
                    _.forEach(ll, function(nn){
                        n.data = _.union(n.data, nn.data);
                    });
                    n.data = _.uniq(n.data, function(nn){
                        return nn[0];
                    });
                    n.data = _.sortBy(n.data,  function(nn){
                        return nn[0];
                    });
                });
                //console.log(plot_data2);
                draw_plot(plot_data2, ys2);
            }else{
                draw_plot(plot_data1, check_year);
            }
            //$.webgis.control.flot_graph.setData(plot_data1);
            //$.webgis.control.flot_graph.draw();
        };
        var names1 = _.uniq(_.pluck($.webgis.data.state_examination.standard2014, 'parent'));
        var names = [{label:'线路整体', value:'line_state'}];
        var i = 1;
        var options = '<option value="line_state">线路整体</option>';
        _.forEach(names1, function(item){
            names.push({label:item, value:'unit_' + i});
            options += '<option value="' + 'unit_' + i + '">' + item +'</option>';
            i += 1;
        });
        $('#sel_summary_graph_type').empty();
        $('#sel_summary_graph_type').append(options);
        $('#sel_summary_graph_type').multipleSelect({
            single: true,
            multipleWidth: 300,
            onClick: function(view) {
                //console.log(view.value);
                $('#chb_summary_graph_history').removeAttr('checked');
                filter_data( view.value);
            }
        });
        $('#chb_summary_graph_history').on('click', function(){
            var v = $('#sel_summary_graph_type').multipleSelect('getSelects')[0];
            var checked = $(this).is(':checked');
            filter_data( v, checked);
        });
        $('#sel_summary_graph_type').multipleSelect('setSelects', ['line_state']);
        filter_data( 'line_state');
    };
    var test = function(){
        var sels = $('#form_state_examination_bbn_bbn_line_name').multipleSelect('getSelects');
        if (sels.length === 0 || sels[0].length === 0) {
            ShowMessage(null, 400, 250, '错误', '请先选择线路');
            return;
        }
        var line_name = sels[0];
        $.ajax({
            url:'/state_examination/query',
            method:'post',
            data: JSON.stringify({line_name:line_name})
        })
        .always(function () {
            ShowProgressBar(false);
        })
        .done(function (data2) {
            data2 = JSON.parse(data2);
            $.webgis.data.state_examination.list_data_current_line = data2;
            draw_chart();
        });
    };
    //if(DEBUG_BAYES)
    //{
    //    test();
    //}else{
    draw_chart();
    //}

}
function PredictSummaryExport_t(viewer, obj)
{
    var loadFile=function(url,callback){
        JSZipUtils.getBinaryContent(url,callback);
    }
    loadFile("/predict_plot_template.docx",function(err,content){
        if (err) { throw e};
        //var imageModule = new ImageModule({centered:false});
        var doc = new Docxgen(content);//.attachModule(imageModule);
        doc.setData({
            "line_name":obj.line_name,
            "year_num":obj.year_num + '',
            "attention":obj.attention,
            "description":obj.description,
            "suggestion":obj.suggestion
            //"image":$.webgis.control.flot_graph.getCanvas().toDataURL()
            }
        ); //set the templateVariables
        doc.render(); //apply them (replace all occurences of {first_name} by Hipp, ...)

        //imageModule.on('finished',function(){
        //    var out= doc
        //        .getZip()
        //        .generate({type:"blob"});
        //    saveAs(out, obj.line_name + ".docx");
        //});
        var out = doc.getZip().generate({type:"blob"}); //Output the document using Data-URI
        saveAs(out, obj.line_name + ".docx");
    });
}
function PredictSummaryExport(viewer, obj)
{
    if(_.isUndefined($.webgis.control.flot_graph)){
        return;
    }
    var can = $.webgis.control.flot_graph.getCanvas();
    //console.log(can);
    var imgdata = can.toDataURL();
    //console.log(imgdata);
    var w = can.width;
    var h = can.height;
    //console.log(w + 'x' + h);
    var title =  obj.line_name + '未来' + (obj.year_num-1) + '年劣化趋势预测' ;
    var line_char_max_count = 40;
    //var s = '';
    //_.forEach(_.range(0, line_char_max_count*5 + 1), function(item){
    //    s += '啊';
    //});

    var create_text_image = function(str, textAlign){
        var ret;
        var lines = [];
        var lines1 = str.split('\n');
        _.forEach(lines1, function(line){
            if(line.length <= line_char_max_count){
                lines.push(line);
            }else{
                var i = 0;
                var line_num1 = Math.floor(line.length/line_char_max_count) + 1;
                _.forEach(_.range(0, line_num1 + 1), function(part){
                    var arr = _.slice(line, i*line_char_max_count, (i+1)*line_char_max_count);
                    var ss = arr.join('');
                    if(ss.length === 0){
                        ss = '\n';
                    }
                    lines.push(ss);
                    i += 1;
                });
            }
        });
        //console.log(lines);
        var startx = 20, starty = 15;
        var linewidth = 600, lineheight = 20;
        var c = document.createElement("canvas");
        c.width = linewidth;
        c.height = (lines.length+1) * lineheight + starty;
        //console.log(c.height);
        var ctx = c.getContext("2d");
        if(_.isUndefined(textAlign)){
            textAlign = 'left';
        }
        ctx.textAlign = textAlign;
        var idx = 0;
        _.forEach(lines, function(line){
            var y = (idx+1) * lineheight + starty;
            //console.log(y);
            ctx.fillText(line, startx,  y);
            idx += 1;
        });
        //ret.data = c.toDataURL();
        //ret.width = c.width;
        //ret.height = c.height;
        ret = c.toDataURL();
        $(c).remove();
        return ret;
    };
    //console.log(obj.description);
    var att = create_text_image('重点关注:\n' + obj.attention);
    var des = create_text_image('历史劣化记录:\n' + obj.description);
    var sug = create_text_image('检修策略建议:\n' + obj.suggestion);
    var docDefinition = {
        content:[
            {
                image:create_text_image(title)
            },
            {
                image:imgdata,
                width:Math.floor(w/1.2),
                height:Math.floor(h/1.2)
            },
            {
                image:att
            },
            {
                image:des,
                fit: [700, 700],
                pageBreak: 'after'
            },
            {
                image:sug
            },
        ]
    };
    pdfMake.createPdf(docDefinition).download(title + '.pdf');
}
