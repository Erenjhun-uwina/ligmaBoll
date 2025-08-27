import Entity from "../Entity.js"


export default class Enemies extends Entity{
	constructor(sc,x,y){
		super(sc,x,y)


		this.#init_listeners()
	}
	
	
	#init_listeners(){		
		this.on("reuse",()=>{
			
			this.disabled = false
			
			if(this.observer){
				this.observer.destroy()
				this.observer = null
			}
			
			this.observer = this.scene.objObserver.check_leavescreen(this)
			
			const lifetimer = this.scene.time.addEvent({
				duration:1000,
				callback:()=>{
					
					if(!this.scene.player)return
					const px = this.scene.player.x
					const ex = this.x
					
					if(px-ex < 500)return
					this.emit("leavescreen")
					lifetimer.destroy()
				},
				loop:true
			});
		
		this.on("enterscreen",()=>this.observer.destroy());
		});
	}
	
}
