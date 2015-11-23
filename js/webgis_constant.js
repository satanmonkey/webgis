$.webgis = {};
$.webgis.mapping = {};
$.webgis.db = {};
$.webgis.data = {};
$.webgis.config = {};
$.webgis.select = {};
$.webgis.control = {};
$.webgis.toolbar = {};
$.webgis.form_fields = {};
$.webgis.geometry = {};
$.webgis.remote = {};
$.webgis.websocket = {};
$.webgis.websocket.antibird = {};
$.webgis.data.antibird = {};
$.webgis.data.dn_network = {};
$.webgis.data.anti_bird_towers = [];
$.webgis.key_event = {};
$.webgis.remote.localhost = '192.168.1.113';//10.181.160.72
$.webgis.remote.arcserver_host = $.webgis.remote.localhost;
$.webgis.remote.host = $.webgis.remote.localhost;
$.webgis.remote.port = 8088;
$.webgis.remote.tiles_host = $.webgis.remote.localhost;
$.webgis.remote.tiles_port = 8088;
$.webgis.db.db_name = 'kmgd';
$.webgis.config.zaware = false;
$.webgis.current_userinfo = {};
$.webgis.websocket.antibird.WS_PROTOCOL = 'ws';
$.webgis.websocket.antibird.HOST = $.webgis.remote.localhost;
$.webgis.websocket.antibird.PORT = 8088;
$.webgis.color = {};
$.webgis.color.base_color = '#00FF00';

$.webgis.config.encrypt_key = 'kmgd111';

$.webgis.mapping.phase_color_mapping = {
    'A':'#FFFF00',
    'B':'#FF0000',
    'C':'#00FF00',
    'G':'#000000',
    'G1':'#000000',
    'L':'#000000',
    'R':'#000000'
};
$.webgis.mapping.style_mapping = {
    'point_tower' :        {icon_img:'img/features/powerlinepole.png', color:[255, 255, 0, 255],outlineColor:[0, 0, 0, 255], outlineWidth:1, pixelSize:10, labelFillColor:[128, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    //'point_tower' :        {icon_img:'img/features/repair.png', color:[255, 255, 0, 255],outlineColor:[0, 0, 0, 255], outlineWidth:1, pixelSize:10, labelFillColor:[128, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    'point_hazard' :    {icon_img:'img/features/radiation.png', color:[64, 128, 255, 255],outlineColor:[255, 255, 255, 255], outlineWidth:1, pixelSize:3, labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    'point_marker' :    {icon_img:'img/marker30x48.png', color:[64, 128, 255, 255],outlineColor:[255, 255, 255, 255], outlineWidth:1, pixelSize:3, labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    'point_dn' :    {icon_img:'img/features/expert.png', color:[64, 128, 255, 255],outlineColor:[255, 255, 255, 255], outlineWidth:1, pixelSize:8, labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    'point_dn_switch' :    {icon_img:'img/features/metronetwork.png', color:[64, 128, 255, 255],outlineColor:[255, 255, 255, 255], outlineWidth:1, pixelSize:8, labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    'point_dn_fuse' :    {icon_img:'img/features/metronetwork.png', color:[64, 128, 255, 255],outlineColor:[255, 255, 255, 255], outlineWidth:1, pixelSize:8, labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    'point_dn_load' :    {icon_img:'img/features/metronetwork.png', color:[64, 128, 255, 255],outlineColor:[255, 255, 255, 255], outlineWidth:1, pixelSize:8, labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    'point_dn_cutoff' :    {icon_img:'img/features/metronetwork.png', color:[64, 128, 255, 255],outlineColor:[255, 255, 255, 255], outlineWidth:1, pixelSize:8, labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    'point_dn_link'    :            {icon_img:'img/features/linedown.png', color:[64, 128, 255, 255],outlineColor:[255, 255, 255, 255], outlineWidth:1, pixelSize:8, labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    'point_dn_transform' :        {icon_img:'img/features/factory.png', color:[64, 128, 255, 255],outlineColor:[255, 255, 255, 255], outlineWidth:1, pixelSize:8, labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    'point_dn_transformarea' :    {icon_img:'img/features/expert.png', color:[64, 128, 255, 255],outlineColor:[255, 255, 255, 255], outlineWidth:1, pixelSize:8, labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    'point_hotel':        {icon_img:'img/features/hotel_0star.png', color:[64, 128, 255, 255],outlineColor:[255, 255, 255, 255], outlineWidth:1, pixelSize:3, labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    'point_restaurant': {icon_img:'img/features/restaurant.png', color:[64, 128, 255, 255],outlineColor:[255, 255, 255, 255], outlineWidth:1, pixelSize:3, labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    'point_mall':        {icon_img:'img/features/mall.png', color:[64, 128, 255, 255],outlineColor:[255, 255, 255, 255], outlineWidth:1, pixelSize:3, labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    'point_exitentrance': {icon_img:'img/features/entrance.png', color:[64, 128, 255, 255],outlineColor:[255, 255, 255, 255], outlineWidth:1, pixelSize:3, labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    'point_village':    {icon_img:'img/features/windmill-2.png', color:[64, 128, 255, 255],outlineColor:[255, 255, 255, 255], outlineWidth:1, pixelSize:3, labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    'point_building':    {icon_img:'img/features/office-building.png', color:[64, 128, 255, 255],outlineColor:[255, 255, 255, 255], outlineWidth:1, pixelSize:3, labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    'point_subcity':    {icon_img:'img/features/citysquare.png', color:[64, 128, 255, 255],outlineColor:[255, 255, 255, 255], outlineWidth:1, pixelSize:3, labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    'point_busstop':    {icon_img:'img/features/busstop.png', color:[64, 128, 255, 255],outlineColor:[255, 255, 255, 255], outlineWidth:1, pixelSize:3, labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    'point_park':        {icon_img:'img/features/wetlands.png', color:[64, 128, 255, 255],outlineColor:[255, 255, 255, 255], outlineWidth:1, pixelSize:3, labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    'point_provincecapital': {icon_img:'img/features/arch.png', color:[64, 128, 255, 255],outlineColor:[255, 255, 255, 255], outlineWidth:1, pixelSize:3, labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    'point_rollstop':    {icon_img:'img/features/accesdenied.png', color:[64, 128, 255, 255],outlineColor:[255, 255, 255, 255], outlineWidth:1, pixelSize:3, labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    'point_parker':        {icon_img:'img/features/parking-meter-export.png', color:[64, 128, 255, 255],outlineColor:[255, 255, 255, 255], outlineWidth:1, pixelSize:3, labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    'point_county':        {icon_img:'img/features/ghosttown.png', color:[64, 128, 255, 255],outlineColor:[255, 255, 255, 255], outlineWidth:1, pixelSize:3, labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    'point_school':        {icon_img:'img/features/school.png', color:[64, 128, 255, 255],outlineColor:[255, 255, 255, 255], outlineWidth:1, pixelSize:3, labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    'point_chemistsshop': {icon_img:'img/features/', color:[64, 128, 255, 255],outlineColor:[255, 255, 255, 255], outlineWidth:1, pixelSize:3, labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    'point_hospital':    {icon_img:'img/features/hospital-building.png', color:[64, 128, 255, 255],outlineColor:[255, 255, 255, 255], outlineWidth:1, pixelSize:3, labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    'point_bank':        {icon_img:'img/features/hospital-building.png', color:[64, 128, 255, 255],outlineColor:[255, 255, 255, 255], outlineWidth:1, pixelSize:3, labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
    'point_town':        {icon_img:'img/features/cathedral.png', color:[64, 128, 255, 255],outlineColor:[255, 255, 255, 255], outlineWidth:1, pixelSize:3, labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale: 0.6},
//};
//var g_style_polyline_mapping = {
    'polyline_marker':{color:[0, 64, 255, 255], pixelWidth:1, outlineColor:[255, 64, 255, 255], outlineWidth:1, labelFillColor:[0, 64, 255, 255], labelOutlineColor:[255, 255, 255, 255], labelScale:1},
    'polyline_hazard':{color:[255, 64, 0, 255], pixelWidth:1, outlineColor:[255, 64, 255, 255], outlineWidth:1, labelFillColor:[255, 64, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale:1},
    'polyline_speedway':{color:[255, 128, 0, 255], pixelWidth:1, outlineColor:[255, 64, 255, 255], outlineWidth:1, labelFillColor:[255, 128, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale:1},
    'polyline_heighway':{color:[255, 128, 0, 255], pixelWidth:1, outlineColor:[255, 64, 255, 255], outlineWidth:1, labelFillColor:[255, 128, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale:1},
    'polyline_nationalroad':{color:[255, 128, 0, 255], pixelWidth:1, outlineColor:[255, 64, 255, 255], outlineWidth:1, labelFillColor:[255, 128, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale:1},
    'polyline_provinceroad':{color:[255, 128, 0, 255], pixelWidth:1, outlineColor:[255, 64, 255, 255], outlineWidth:1, labelFillColor:[255, 128, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale:1},
    'polyline_railway':{color:[255, 128, 0, 255], pixelWidth:1, outlineColor:[255, 64, 255, 255], outlineWidth:1, labelFillColor:[255, 128, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale:1},
//};
//var g_style_polygon_mapping = {
    'polygon_marker':{color:[0, 64, 255, 100], outlineColor:[255, 255, 0, 255],  labelFillColor:[255, 255, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale:1},
    'polygon_hazard':{color:[255, 64, 0, 100], outlineColor:[255, 64, 0, 255],  labelFillColor:[255, 64, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale:1},
    'polygon_buffer':{color:[255, 0, 0, 50], outlineColor:[255, 64, 0, 255],  labelFillColor:[255, 0, 0, 255], labelOutlineColor:[255, 255, 255, 255], labelScale:1}
};

$.webgis.mapping.role_functions = [
    {value:'line_edit', label:'线路工程查看'},
    {value:'line_save', label:'线路工程创建与保存'},
    {value:'line_delete', label:'线路工程删除'},
    {value:'edge_save', label:'节点连接关系创建与保存'},
    {value:'edge_delete',label:'节点连接关系删除'},
    {value:'tower_save', label:'杆塔创建与保存'},
    {value:'tower_delete', label:'杆塔删除'},
    {value:'feature_save', label:'地标创建与保存'},
    {value:'feature_delete', label:'地标删除'},
    {value:'buffer_analyze', label:'缓冲区分析'},
    {value:'anti_bird_save', label:'驱鸟器修改'}
];

$.webgis.mapping.heat_map_gradient_stops = {
  '0.00': 0xffffff00,
  '0.11': 0xaaffaaff, //
  '0.22': 0x55ff55ff, //
  '0.33': 0x00ff00ff, //green
  '0.44': 0x55ff00ff, //
  '0.55': 0xaaff00ff, //
  '0.66': 0xffff00ff, //yellow
  '0.77': 0xffaa00ff,  //
  '0.88': 0xff5500ff,  //
  '1.00': 0xff0000ff  //red
};

$.webgis.mapping.models_mapping = {};
$.webgis.mapping.leaflet_old_style = {};

$.webgis.geometry.segments = [];
$.webgis.geometry.lines = [];


$.webgis.config.is_tower_focus = false;
$.webgis.config.terrain_z_offset = -40;
$.webgis.config.node_connect_mode = false;
$.webgis.config.map_backend = 'cesium';
$.webgis.config.use_catenary = true;
$.webgis.config.max_file_size = 5000000;



$.webgis.data.image_thumbnail_tower_info = [];
$.webgis.data.heatmap_layers = {};
$.webgis.data.sysrole = [];
$.webgis.data.czmls = [];
$.webgis.data.geojsons = [];
$.webgis.data.lines = [];
$.webgis.data.codes = {};
$.webgis.data.segments = [];
$.webgis.data.gltf_models_mapping = {};
$.webgis.data.models_gltf_files = [];
$.webgis.data.buffers = [];
$.webgis.data.borders = [];
$.webgis.data.dn_network.import_excel_data = {};
$.webgis.data.dn_network.import_excel_data.rset = {};
$.webgis.data.dn_network.import_excel_data.ants = {};
$.webgis.data.dn_network.import_excel_data.bayes = {};

$.webgis.constant = {};
$.webgis.constant.dn = {
    DPRATE		: 1,    // depreciation rate per year
    INTRATE		: 2,	// interest rate per year
    OMRATE		: 3,	// operation maintenance cost rate
    AUECOST		: 4,	// average unit electric cost
    AUCCOST		: 5,	// average unit capacitance cost (yuan/kvar)
    AURCOST		: 6,	// average unit reactance cost (yuan/kvar)
    TMAX	    : 7,	// max load consuming hour count (hours/year)
    BASEMVA	    : 8,	// system base rating (MVA)
    PFMETHOD	: 9,	// power flow method
    OPTMODEL	: 10,	// optimal model
    OPTMETHOD	: 11,	// optimal method，=1，linear opt; =2, nonlinear opt; =3, genetic algorithm
    ACCURACY    : 12,	// termination tolerance
    PFMAXIT		: 13,	// max iteration count
    OPFMAXIT	: 14,	// max iteration count
    POPNUM	    : 15,	// the number of population
    CPOPT	    : 16,   // computer options  =1,power flow calculate; =2 var optimization computer
    TARGET	    : 17,   // target function value
    SUCCESS	    : 18,   // converged state
    PFITER      : 19,   // the number of iteration in power flow
    OPFITER     : 20   // the number of iteration in reactive optimization
};

