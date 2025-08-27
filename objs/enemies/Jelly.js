import Enemy from "./Enemy.js"

export default class Jelly extends Enemy{

	constructor(sc,x,y){
		super(sc,x,y-100)

		this.atlas = "frog"
		this.init_sprites()
		this.init_listeners()
		this.grounded = true
		this.body.setAccelerationY(1100)
	}
	

	
	forward(from,to){
		
		this.body.setVelocityX(from)
		
		this.scene.time.delayedCall(500,
			()=>this.body.setVelocityX(to || from)
		);
	}
	
	inflict(target,type="player"){
	
		if(type!="player")return this.inflict_enemy(target)
		this.inflict_player(target)
	}
	
	inflict_enemy(target){
		
		if(target.solid)this.reflect()
		target.emit("knockup")
		target.emit("poof")
	}
	
	inflict_player(target){
		
		let pd = target.defending
		const {up} = this.body.touching
		const is_above =( up && !(target.hovering))
		
		if(is_above){
			this.forward(700,340)
			target.body.setVelocityY(-500)
			target.setGround()
			target.reset_c_jump()
			this.kicked = true
		}
		else if(!pd){
			if(this.isDisabled())return
			console.log("inflict p")
			target.setEnergy(target.energy-30)
			
			const blackout = this.scene.time.addEvent({
				callback:()=>target.emit("blackout"),
				delay:200,
				loop:true
			});
			
			
			target.once("land",()=>blackout.destroy())
		}
		this.disable()
		this.scene.time.delayedCall(500,()=>this.enable(),this)
	}
	
	land(){
		if(this.grounded)return
		this.grounded = true
	}
	
	knockup(){

		if(this.grounded){
			this.body.setVelocityY(-500)
			this.grounded = false
		}
	}
	
	
	//###### initializiations
	init_listeners(){
		this.on("land",this.land);
		
		this.on("reuse",()=>{
			this.body.setVelocity(0)
			this.grounded = true
		});
		
		this.on("kill",()=>{
			
		});
		
		this.on("knockup",this.knockup);
		this.on("poof",()=>this.setScale(this._scale*0.98));
	}
	
	
	init_sprites(){

		this.add_sprite("head")
		
		const {head} = this
		
		this._scale = 0.3
		this.setScale(0.3)		
		const {width,height} = this.head
			
		this.setSize(width*0.8,height*0.8)
	}
	
}