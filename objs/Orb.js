import Entity from "./Entity.js"

const energy = 40


export default class Orb extends Entity{
	
	constructor(sc,x,y){
		super(sc,x,y)

		this.atlas = "orb"
		this._scale = 20
		this.init_sprites()
		this.init_colliders()
		this.init_listeners()
		sc.objObserver.check_leavescreen(this)
	}

	flap(){

		const {scene} = this

		const dirx = Math.random()*2-1 
		const yspd = 100
		const xspd = 100

		
		this.body.setVelocity(dirx*xspd,-yspd)
		 
		this.ftimer = scene.time.delayedCall(100+Math.random()*700,()=>this.flap())		
		
		if(!this.metabolize)return
		this.set_energy(this.energy * 0.90)
	}
	
	set_energy(e){
		this.energy = e
		
		this.scene.tweens.add({
			targets:this,
			scale:e/this._scale,
			duration:300,
			onComplete:()=>{
				if(this.energy<= 5)this.kill()
			}
		});
		
		this.scene.tweens.add({
			targets:this.glow,
			scale:0,
			duration:150,
			yoyo:true
		});

	}
	
	//##### inits
	init_listeners(){

		this.on("enterscreen",()=>{
			this.metabolize = true
			this.flap()
			this.body.setAccelerationY(200)
		});
		
		this.on("reuse",()=>{
			this.setScale(0)
			this.set_energy(Math.random()*10+energy)
			this.glow.setScale(1)
		});
		
		this.on("kill",()=>{
			if(this.ftimer)this.ftimer.destroy()
			this.body.setAccelerationY(0)
			this.metabolize = false
		});
		
	}
	
	init_sprites(){
		this.add_sprite("bod","base")
		this.add_sprite("glow","glow")
		
		
		
		const ns = this.bod.width*0.5
		this.setSize(ns,ns)
	}
	
	init_colliders(){
		const {scene} = this
		scene.physics.add.collider(this,scene.ground)
	}
}
