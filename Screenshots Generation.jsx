// script to generate screenshots

// ok and cancel button
var runButtonID = 1;
var cancelButtonID = 2;

// all the required sizes
var screenshot_types = [
	// main screenshot (android)
	{
		name: "screen",
		width: 1280, 
		height: 800
	},
	
	// iphone 4
	{
		name: "iphone3_5",
		width: 960,
		height: 640
	},

	// iphone 5
	{
		name: "iphone4",
		width: 1136,
		height: 640
	},
	
	// iphone 6
	{
		name: "iphone4_7",
		width: 1334,
		height: 750
	},
	
	// iphone 6 plus
	{
		name: "iphone5_5",
		width: 2208,
		height: 1242
	},
	
	// ipad 
	{
		name: "ipad",
		width: 2048,
		height: 1536
	},
	
	// ipad pro
	{
		name: "ipad_pro",
		width: 2732, 
		height: 2048
	},
	
	// google play cross promo
	{
		name: "google_promo",
		width: 1280,
		height: 624
	},
	
	// apple cross promo
	{
		name: "apple_promo",
		width: 1334,
		height: 600
	}
];

// call the main func
main();

function main() {
	var exportInfo = new Object();
  
    // init export info
    initExportInfo(exportInfo);
	
	// idk
	if ( DialogModes.ALL == app.playbackDisplayDialogs ) {
    	if (cancelButtonID == settingDialog(exportInfo)) {
	    	return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
	    }
	}
	
	// get a reference
	var doc = app.activeDocument; 

	// path
	var pathz = doc.path + '/gen';

	// create gen folder
	var folder = Folder(pathz);
	if(!folder.exists) folder.create();

	// get current active layer name
	var layer_name = app.activeDocument.activeLayer.name;

	// web export options
	var options = new ExportOptionsSaveForWeb();
	options.quality = 70;
	options.format = SaveDocumentType.JPEG;
	options.optimized = true;

	// for each required size
	for	(index = 0; index < screenshot_types.length; index++) {
		// check if export needed
		if (exportInfo.isExported[index]) {
			// get array element
			var screenshot_type = screenshot_types[index];
			
			// get the data
			var sc_typename = screenshot_type.name;
			var sc_width = screenshot_type.width;
			var sc_height = screenshot_type.height;
			
			// duplicate the document
			var doc_copy = app.activeDocument.duplicate(); 
			
			// do the resizing. 
			doc_copy.resizeImage(UnitValue(sc_width,"px"),UnitValue(sc_height,"px"),null,ResampleMethod.BICUBIC);
			
			// prepare name
			//var newName = sc_typename+'_'+ layer_name +'.jpg';
			var newName = sc_typename+'_'+ layer_name +'.jpg';
			
			// prepare folder for the type
			var type_path = pathz + '/' + sc_typename;
			
			var folder = Folder(type_path);
			if(!folder.exists) folder.create();
			
			// save
			doc_copy.exportDocument(File(type_path+'/'+newName),ExportType.SAVEFORWEB,options);
			
			// close
			doc_copy.close(SaveOptions.DONOTSAVECHANGES);
			
			app.playbackDisplayDialogs = DialogModes.ALL;
		}
	}

	//
	alert('done, saved in: ' + pathz)
}


function settingDialog(exportInfo)
{
    dlgMain = new Window("dialog", "Settings for export");
	
	// match our dialog background color to the host application
	var brush = dlgMain.graphics.newBrush(dlgMain.graphics.BrushType.THEME_COLOR, "appDialogBackground");
    dlgMain.graphics.backgroundColor = brush;
    dlgMain.graphics.disabledBackgroundColor = brush;

	dlgMain.orientation = 'column';
	dlgMain.alignChildren = 'left';
	
	// Select the targets
    dlgMain.add("statictext", undefined, "Select targets:");

	// -- now the radio buttons
	dlgMain.exportopt = [];
	for	(index = 0; index < screenshot_types.length; index++) {
		var type = screenshot_types[index];
		var text = type.name + ' (' + type.width + ' x ' + type.height + ')'
		dlgMain.exportopt[index] = dlgMain.add("checkbox", undefined, text);
		dlgMain.exportopt[index].value = exportInfo.isExported[index];
		dlgMain.exportopt[index].alignment = 'left';
	}
	
	
	// run btn
	dlgMain.btnRun = dlgMain.add("button", undefined, "Run" );
    dlgMain.btnRun.onClick = function() {
		dlgMain.close(runButtonID);
	}

	// cancel btn
	dlgMain.btnCancel = dlgMain.add("button", undefined, "Cancel" );
    dlgMain.btnCancel.onClick = function() { 
		dlgMain.close(cancelButtonID); 
	}
	
	 // in case we double clicked the file
    app.bringToFront();

    dlgMain.center();
    
    var result = dlgMain.show();
    
    if (cancelButtonID == result) {
		return result;  // close to quit
	}
    
    // get setting from dialog
	for	(index = 0; index < screenshot_types.length; index++) {
		exportInfo.isExported[index] = dlgMain.exportopt[index].value;
	}

    return result;
}



function initExportInfo(exportInfo)
{
	// init
	exportInfo.isExported = []
	
	// to export or not, default export is true
	for	(index = 0; index < screenshot_types.length; index++) {
		exportInfo.isExported[index] = true;
	}
}