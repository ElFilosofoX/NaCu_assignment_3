let CPM = require("../../build/artistoo-cjs.js")

let config = {

	// Grid settings
	ndim : 2,
	field_size : [100,100],
	
	// CPM parameters and configuration
	conf : {
		// Basic CPM parameters
		torus : [true,true],				// Should the grid have linked borders?
		seed : 3,							// Seed for random number generation.
		T : 40,								// CPM temperature
		
		// Constraint parameters. 
		// Mostly these have the format of an array in which each element specifies the
		// parameter value for one of the cellkinds on the grid.
		// First value is always cellkind 0 (the background) and is often not used.
			
		// Adhesion parameters:
		J : [[0,10,0], 
			 [10,0,100], 
			 [0,100,0]],
		
		// VolumeConstraint parameters
		LAMBDA_V : [0,5,2],				// VolumeConstraint importance per cellkind
		V : [0,100,600],					// Target volume of each cellkind
		
		// PerimeterConstraint parameters
		LAMBDA_P : [0,5,2],				// PerimeterConstraint importance per cellkind
		P : [0,0,300],					// Target perimeter of each cellkind
		
		// ActivityConstraint parameters
		LAMBDA_ACT : [0,0,500],			// ActivityConstraint importance per cellkind
		MAX_ACT : [0,0,20],				// Activity memory duration per cellkind
		ACT_MEAN : "geometric",				// Is neighborhood activity computed as a
		// "geometric" or "arithmetic" mean?
	
	},
	
	// Simulation setup and configuration
	simsettings : {

		// Cells on the grid
		NRCELLS : [0,1],					// Number of cells to seed for all
		// non-background cellkinds.
		// Runtime etc
		BURNIN : 500,
		RUNTIME : 1000,
		RUNTIME_BROWSER : "Inf",
		
		// Visualization
		CANVASCOLOR : "eaecef",
		CELLCOLOR : ["AAAAAA","FF0000"],
		ACTCOLOR : [true,false],			// Should pixel activity values be displayed?
		SHOWBORDERS : [true, true],				// Should cellborders be displayed?
		zoom : 5,							// zoom in on canvas with this factor.
		
		// Output images
		SAVEIMG : true,					// Should a png image of the grid be saved
		// during the simulation?
		IMGFRAMERATE : 1,					// If so, do this every <IMGFRAMERATE> MCS.
		SAVEPATH : "output/img/Obstacle",				// ... And save the image in this folder.
		EXPNAME : "EpidermisWithTCells",					// Used for the filename of output images.
		
		// Output stats etc
		STATSOUT : { browser: false, node: true }, // Should stats be computed?
		LOGRATE : 10							// Output stats every <LOGRATE> MCS.
	
	}
}

function initialize(){
	/* 	The following functions are defined below and will be added to
		the simulation object.*/
	   let custommethods = {
			initializeGrid : initializeGrid,
	   }
}

meter = new FPSMeter({left:"auto", right:"5px"})
step()

function step(){
  sim.step()
  meter.tick()
  if( sim.conf["RUNTIME_BROWSER"] == "Inf" | sim.time+1 < sim.conf["RUNTIME_BROWSER"] ){
    requestAnimationFrame( step )
  }
}

function initializeGrid(){

	// add the initializer if not already there
	if( !this.helpClasses["gm"] ){ this.addGridManipulator() }

	// Obstacles cell layer
	let step = 33
	for( var i = 1 ; i < this.C.extents[0] ; i += step ){
		for( var j = 1 ; j < this.C.extents[1] ; j += step ){
			this.gm.seedCellAt( 1, [i,j] )
		}
	}
	// Seed 1 cancer cell
  this.gm.seedCellAt( 2, [this.C.extents[1]/2, this.C.extents[1]/2] )
}

let sim = new CPM.Simulation( config , custommethods)
sim.run()