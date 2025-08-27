import Totle from "./Totle.js"


export default class Spiked_Totle extends Totle{

	inflict(target,type="player"){
	
		if(type!="player")return this.inflict_enemy(target)
		
		const {up} = this.body.touching
		const is_above =( up && !(target.hovering))
		
		if(is_above){
			this.forward(800,480)
			target.bounce()
			this.squish()
		}
		this.inflict_player(target)
	}
	
	//
	squish(){
		if(this.kicked)return
		const {flegs,blegs} = this
		const shell = this.shell_spiked
		
		shell.setPosition(shell.x,shell.y+10)
		flegs.setVisible(false)
		blegs.setVisible(false)
		this.eye.setVisible(false)
		this.kicked = true
	}
	
	//
	_reuse(){ 
		const shell = this.shell_spiked
		if(this.kicked)shell.setPosition(shell.x,shell.y-10)
		this.kicked = false
		this.body.setVelocity(0)
		this.grounded = true
		this.flegs.setVisible(true)
		this.blegs.setVisible(true)
		this.eye.setVisible(true)
	}
	
	//
	
	init_sprites(){
		this.add_sprite("blegs")
		this.add_sprite("bod")
		this.add_sprite("eye")
		this.add_sprite("flegs")
		this.add_sprite("shell_spiked")
		
		const {eye} = this
		
		this._scale = 0.7
		this.setScale(this._scale)		
		const {width,height} = this.eye
	
		this.setSize(width*0.8,height*0.7)
		this.setBodyOffset(0,-this.body.width*0.1)
	}
}