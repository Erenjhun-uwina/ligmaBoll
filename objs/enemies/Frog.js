import Enemy from "./Enemy.js"

export default class Frog extends Enemy{

	constructor(sc,x,y){
		super(sc,x,y)

		this.atlas = "frog"
		this.init_sprites()
		this.init_listeners()
		this.grounded = true
		this.body.setAccelerationY(1100)
	}

	inflict(target,type="player"){
		if(type!="player")return this.inflict_enemy(target)
		this.inflict_player(target)
	}
	
	inflict_enemy(target){
	}
	
	inflict_player(target){
		const pd = target.defending


		const {up} = this.body.touching
		const is_above =( up && !(target.hovering))
		
		if(is_above){
			target.bounce()
			this.squish()
		}
		else if(!pd && !this.isDisabled()){

			target.reflect(100,-600)
			target.setEnergy(target.energy-20)
			target.emit("damaged")
		}
		// disable then enable after 0.5 secs
		this.disable()
		this.scene.time.delayedCall(500,()=>this.enable(),this)
	}
	
	
	
	
	land(){
		if(this.grounded) return
		this.grounded = true
		this.body.setVelocity(0,0)
		
		this.scene.time.delayedCall(Math.random()*1000+1000,
			()=>{
				if(this.grounded && !this.kicked)this.jump()
				},
		this)
		
		this.legs.setPosition(0)
	}
	
	jump(){
		this.grounded = false
		this.body.setVelocity(-200,-600)
		this.legs.setPosition(0,this.legs.height*0.20)
	}
	
	knockup(){
		if(!this.grounded)return
		this.body.setVelocityY(-600)
		this.grounded = false
	}
	//###### anim
	
	squish(){
		this.kicked = true
		this.scene.tweens.add({
			targets:this,
			duration:200,
			ease:"power2",
			yoyo:true,
			scaleY:{from:this.scaleY,to:this.scaleY*0.5},
			onComplete:()=>{
				this.kicked = false
				this.body.setVelocityY(-300)
				}
		});
	}
	
	//###### initialization
	
	init_listeners(){
		const sc = this.scene
		this.on("reuse",()=>{
			this.body.setVelocityY(200)
			this.jump()
		});
		

		this.on("land",()=>this.land())
		this.on("knockup",()=>this.knockup())
		this.on("poof",()=>this.setScale(this._scale*0.9))
		this.on("kill",()=>this.kicked = false)
	}
	

	init_sprites(){
		this.add_sprite("legs")
		this.add_sprite("head")
		this.add_sprite("leye")
		this.add_sprite("reye")
		this.add_sprite("reye")
		
		const {leye,reye,head,legs,lmouth} = this
		this._scale = 1


		this.setScale(this._scale)		
		const {width,height} = this.head
		this.setSize(width*0.75,height*0.7)
	}
	
}