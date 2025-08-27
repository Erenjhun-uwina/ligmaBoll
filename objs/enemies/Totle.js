import Enemy from "./Enemy.js"

export default class Totle extends Enemy{

	constructor(sc,x,y){
		super(sc,x,y-100)

		this.atlas = "totle"
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
		
		const {up} = this.body.touching
		const is_above =( up && !(target.hovering))
		
		if(is_above){
			this.forward(800,480)
			target.bounce()
			this.squish()
			return
		}
		this.inflict_player(target)
	}
	
	inflict_enemy(target){
		if(target.solid)this.reflect()
		target.emit("knockup")
		target.emit("poof")
	}
	
	inflict_player(target){
		if(this.isDisabled())return
		target.setEnergy(target.energy-30)
		target.emit("damaged")
		this.disable()
		this.scene.time.delayedCall(600,()=>this.enable(),this)
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
	
	//anim
	
	squish(){
		if(this.kicked)return
		const {shell,flegs,blegs} = this
			
		shell.setPosition(shell.x,shell.y+10)
		flegs.setVisible(false)
		blegs.setVisible(false)
		this.eye.setVisible(false)
		this.kicked = true
	}
	
	
	//###### initializiations
	init_listeners(){
		this.on("land",this.land);
		
		this.on("reuse",()=>{
			this._reuse()
		});
		
		this.on("knockup",this.knockup);
		this.on("poof",()=>{
			this.setScale(this._scale*0.98)
			this.squish()
			});
	}
	
	_reuse(){
		if(this.kicked)this.shell.setPosition(this.shell.x,this.shell.y-10)
		this.kicked = false
		this.body.setVelocity(0)
		this.grounded = true
		this.flegs.setVisible(true)
		this.blegs.setVisible(true)
		this.eye.setVisible(true)
	}
	
	reflect(){
		if(this.isDisabled("e"))return
		this.disable("e") 
		this.forward(this.body.velocity.x*-1);
		this.scene.time.delayedCall(700,()=>this.enable("e"));
	}
	
	init_sprites(){
		this.add_sprite("blegs")
		this.add_sprite("bod")
		this.add_sprite("eye")
		this.add_sprite("flegs")
		this.add_sprite("shell")
		
		const {eye} = this
		
		this._scale = 0.7
		this.setScale(this._scale)		
		const {width,height} = this.eye
		

		this.setSize(width*0.8,height*0.7)
		this.setBodyOffset(0,-this.body.width*0.1)
	}
	
	
	
}