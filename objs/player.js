import {debounce} from "../libs/func.js"
import Entity from "./Entity.js"

const {max,min,random}= Math
const {ParticleEmitter} = Phaser.GameObjects.Particles

let player,
	scene,
	trail,
	emitter,
	eye,
	ex,
	w,
	forward_timer

let target,
	time,
	step

let t_hover


export default class Player extends Entity{

	constructor(sc,x,y){
		super(sc,x,y)		
		scene = sc
		player = this
		this._scale = 0.4

		this.grav = 1500
		this.cgrav = this.grav
		this.acc = new Phaser.Math.Vector2(0,0)
		
		this.grounded = false
		this.hovering =  false
		this.will_glide = false
		this.c_jump = 2
		
		this.body_clock = 1
		
		this.mhp = 100
		this.hp = this.mhp
		this.hp_regen = 3
		this.regen_cost = 2
		
		this.m_energy = 100
		this.energy = this.m_energy*0.4
		this.energy_regen = 3
		this.spd = 600
		this.jump_h = -800
		this.jump_cost = 5
		this.glide_cost = 6.5
		
		this.morph_duration = 30
		this.target_energy = this.mhp*0.95
		
		//attacks
		this.atk_pntr = 0
		this.atk_list = []
		this.atk_cd  = 200
		this.c_atk_cd = 0
		this.attacking = false
		this.defending = false
		
		//skills
		this.jumper  = false
		this.glider = false
		
		this.glide = debounce(this.scene,this.glide,(this.jump_h + this.grav)*0.8)
		
		const b = sc.add.circle(-100,100,50,0x000000)
		sc.physics.add.existing(b)
		b.body.setCircle(50)
		this.blast_hitbox = b
		
		this.start_bodyclock()

		this.blink()
		
		this.init_emitter()
		this.init_colliders()
		this.init_sprites()
		this.init_listeners()
		this.once("land",()=>this.forward(2000))
	}
	

	preUpdate(){
		this.squish()
		//let accy = (this.hovering)?100:this.cgrav
		this.body.setAccelerationY(this.cgrav)		
		if(this.vision)this.vision.setPosition(this.x,this.y)
	}
	
	inflict(e){
		e.disable()
	}
	
	bounce(){
				
		if(this.isDead())return
		this.body.setVelocityY(-800)
		this.setGround()
		this.reset_c_jump()
		this.end_glide()
	}
	
	
	reflect(delay = 500,vel = -this.spd)
	{	
		this.body.setVelocityX(vel)
		scene.time.delayedCall(delay,()=>this.forward(700))
	}
	
	dash(){
		this.body.setVelocityX(this.spd*5)
		trail.start()
		
		scene.time.delayedCall(200,()=>{
			if(!this.body)return
			this.body.setVelocityX(this.spd)
			trail.stop()
		});
		this.set_stance(true)
	}
	
	forward(duration = 700){
		if(this.isDead())return

		const velx = this.body.velocity.x
		
		if(velx > 20)return
		
		if(forward_timer)forward_timer.destroy() 
		
		if(this.body.touching.right){
			this.body.setVelocityX(50)
			this.setGround(true,false)
		}
			
		forward_timer = scene.time.addEvent({
			delay:0,
			callback:(data)=>{

				if(!this.body)return
				const velx = this.body.velocity.x
				const vx = min(this.spd ,(velx + this.spd/duration*10))
				this.body.setVelocityX(vx)
				
				if(velx >= this.spd){
					forward_timer.destroy()
				}
			},
			loop:true
		});
	}
	
	start_bodyclock(){
		scene.time.addEvent(
			{
				delay:this.body_clock*1000,
				callback:()=>{
					this.regen()
					},
				loop:true
			}
		);
		scene.time.addEvent(
			{
				delay:this.body_clock*200,
				callback:()=>{
					const height = scene.sys.game.canvas.height
					if(this.y > height+200)this.emit("fall")
					},
				loop:true
			}
		);
	}
	
	regen(){
		
		if(this.isDead())return
		let net_g = this.energy_regen
		net_g -= (this.will_glide?this.glide_cost:0)
		this.setEnergy(this.energy + net_g)
		
		if(this.hp/this.mhp >=1)return
		
		this.setHp(this.hp + this.hp_regen)
		if(this.hp/this.mhp < 0.70) this.setEnergy(this.energy-this.regen_cost)
	}
	
	morph(){
		if(this.isDead())return
		this.setEnergy(this.energy-60)
		this.morphing = false
		this.emit("endmorph")
	}
	
	jump(atk){

		this.end_glide()
		if(!atk && ++this.c_jump > ((this.jumper)?2:1))return
		
		this.setGround()
		this.body.setVelocityY(this.jump_h)
		this.forward(600)
		this.will_glide = true
		if(!atk)this.setEnergy(this.energy-this.jump_cost)
		
		if(!this.glider)return
		this.glide()
	}
	
	land(){
		this.emit("land")
		this.setGround(true)
		this.end_glide()
		this.hover()
	}
	

	reset_c_jump(){
		this.c_jump = 0
	}
	
	
	glide(){
		//this.body.setVelocity(0,0)
		if(this.will_glide)this.cgrav = this.grav*0.01
	}
	
	end_glide(){
		this.will_glide  = false
		this.cgrav = this.grav
	}
	
	attack(){
		if(!this.body)return
		if(this.c_atk_cd > 0 || this.atk_list.length<1)return
		const len = this.atk_list.length
		const pntr = this.atk_pntr
		
		const atk = this.atk_list[this.atk_pntr]
		
		atk.func(player)
		this.setEnergy(this.energy-(atk.cost || 0))
				
		this.atk_pntr = pntr+2 > len?0:pntr+1
		this.c_atk_cd = atk.cd || this.atk_cd
		
		scene.tweens.addCounter({
			to:0,
			from:this.atk_cd,
			duration:this.atk_cd,
			onUpdate:(t)=>{
				player.c_atk_cd = t.getValue()
			}
		});
	}
	

	hover(){

	}
	
	
	
	//####### setters 
	setGround(g = false,h){
		this.grounded = g
		this.hovering = h==undefined?g:h
		if(g)this.c_jump = 0
	}
	
	set_stance(atk=false,def){
		this.attacking = atk
		this.defending = def
		if(def = undefined) this.defending = atk
	}
	
	setHp(hp,mhp){
		if(this.isDead())return
		
		if(!isNaN(hp))
		{
			this.hp = min(this.mhp,max(hp,0))
			if(!isNaN(mhp))this.mhp = max( Number(mhp),0 )
		}
		this.emit("setHp",[this.hp,this.mhp])
		if(this.hp > 0)return
		this.die()
	}
	
	setEnergy(e,m_e){
		if(!isNaN(e))
		{	
			this.energy = min(this.m_energy,e)
			
			if(this.energy <= 0){
				this.setHp(this.hp+this.energy)
				this.energy = 0
			}
			if(!isNaN(m_e))this.m_energy = max( Number(m_e),0) 
		}
		
		this.emit("setEnergy",[this.energy,this.m_energy])
	}
	
	_setScale(s){
		this._scale = s
		this.setScale(s)
		this.trail.setScale(s)
	}
	
	//### getters
	isDead(){
		return this.dead
	}
	
	getScale(){
		return this.scale
	}
	
	//procedural animations
	die(){
		this.scene.soundFade.fade(this.scene.sounds.bg_chill,800,0.8)
		this.dead = true
		const corpse = this.scene.add.image(this.x,this.y,"ball")
		const ceye = this.scene.add.image(this.x,this.y,"eye")
		
		this.scene.tweens.add({
			targets:[corpse,ceye],
			scale:10,
			alpha:0,
			duration:600,
			ease:"Pow2"
		});
		this.destroy()
	}
	
	blink(){
		scene.tweens.add({
			targets:this.eye,
			scaleY: 0,
			duration:random()*500,
			onComplete:()=>this.open_eye()
		});
	}
	
	open_eye(){
		scene.tweens.add({
			targets:this.eye,
			scaleY:1,
			duration:100+random()*200,
			onComplete:()=>setTimeout(()=>player.blink(),random()*6000+600)
		});
	}
	
	squish(){ 
		const yvel = this.body.velocity.y
		
		const {x,y,eye,bod} = this	
		const w = this.body.width/2

		eye.setScale(0.5,eye.scaleY)
		this.body.setAngularVelocity(0)
		
		//down
		if(yvel > 70)
		{	

			scene.tweens.add({
			targets:eye,
			y:w*0.3/this._scale,
			duration:100
			});
			
			scene.tweens.add({
				targets: this,
				angle:0,
				scaleX: this._scale*1.5,
				scaleY:this._scale*0.5,
				duration:100,
				ease: 'Power2',
				delay: 0
			});
			return
		}
		
		//up
		if(yvel < -100)
		{	
			scene.tweens.add({
			targets:eye,
			y:-w*0.8/this._scale,
			duration:100
			});
			
			scene.tweens.add({
				targets: this,
				angle:0,
				scaleX: this._scale*0.5,
				scaleY: this._scale*1.5,
				duration:300,
				ease: 'Power2'
			});
			return
		}
		this.body.setAngularVelocity(this.body.velocity.x*1.2)
		scene.tweens.add({
			targets:eye,
			x:w/2/this._scale,
			y:0,
			duration:200

		});
		
		scene.tweens.add({
				targets: this,
				scaleX:  this._scale,
				scaleY: this._scale,
				duration:500,
				ease: 'Power2'
			});
	}	
	
	///##### initialization
	init_emitter(){
		let trail_p = scene.add.particles("ball")
		trail_p.setDepth(-1) 
		trail = trail_p.createEmitter(
			{
				lifespan:300,
				frequency:0,
				blendMode:"MULTIPLY",
				alpha:{start:0.3,end:0.01},
				scale:this.getScale(),
				tint:0xff5555
			}
		)
		this.trail = trail
		this.trail.stop()
		trail.startFollow(this)
	}
	
	init_colliders(){
		const {scene} = this
		scene.physics.add.overlap(this,scene.enemies,
			(p,e)=>{
				e.inflict(p)
				if(p.attacking)p.inflict(e) 
			});
		
		scene.physics.add.overlap(this,scene.orbs,
			(p,o)=>{
				o.kill()
				p.setEnergy(player.energy + o.energy)
				p.setHp(player.hp + 5)
			});
		
		
		scene.physics.add.collider(this,scene.ground,
			(p)=>{
				if(!p.body.touching.down)return
				if(p.grounded && !p.hovering)return
				p.land()
		});
	}
	
	
	
	init_sprites(){
		this.vision = this.scene.add.image(0,0,"spotlight");
		this.vision.setDepth(10).setVisible(false).setScale(2)
		this.add_sprite("bod","ball")
		this.add_sprite("eye","eye")
		this._setScale(this._scale)
		this.bod.setDepth(2)
		this.eye.setDepth(3)	
		const {width,height} = this.bod	
		this.setSize(width,height)
		
	}
	
	
	init_listeners(){
		const sc = this.scene
		const {sounds} = sc
	
		this.on("setEnergy",(d)=>{			
			if(this.energy < this.target_energy || this.morphing)return
			this.morphing = true
			this.emit("startmorph")
		});
		this.on("fall",()=>{this.die()});
		this.on("damaged",()=>sounds.damaged.play());
	} 
}