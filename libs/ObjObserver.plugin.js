export default class ObjObserver  extends Phaser.Plugins.ScenePlugin {

	constructor(sc,key){
		super(sc,key)
		console.log("objObserver")
	}
	
	
	is_onscreen(obj){
		if(!obj)return
		
		const sc = this.scene
		var boundsA = obj.getBounds();
		var boundsB = sc.cameras.main.worldView;
		return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
	}
	
	check_leavescreen(obj){
		
		const sc = this.scene	
		let ons  = this.is_onscreen(obj)
		
		const onleave = sc.time.addEvent({
			delay:100,
			callback:()=>{
				
				if(!obj.scene)return onleave.destroy()
				let iv = this.is_onscreen(obj)
			
				if(iv == ons) return
				ons = iv
				
				if(iv){
					obj.emit("enterscreen",obj)
				}else{
					obj.emit("leavescreen",obj)
				}
				
			
				},
				callbackScope:this,
				loop:true
		});
		return onleave
	}
}