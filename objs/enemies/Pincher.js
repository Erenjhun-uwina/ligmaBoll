import Enemy from "./Enemy.js"


export default class Pincher extends Enemy{
	constructor(sc,x,y){
		super(sc,x,y)
		
		//adding the textures
		this.atlas = "pincher"
		this.init_sprites()
		this.init_listeners()
		this.solid = true
	}
	
	inflict(target){
	
		if(this.isDisabled()) return
		this.scene.sounds.snap.play()
		this.close_jaw(()=>{
			target.emit("blackout")
			target.setEnergy(target.energy-30)
			
			target.emit("damaged")
		});	

		this.disable()
	}
	

	
	init_listeners(){
		
		this.on("kill",()=>this.disable("p",false) )
		
		this.on("enterscreen",()=>{
			if(this.isDisabled())return
			this.open_jaw()
		});

		this.on("leavescreen",()=>{
			this.close_jaw()
		});
	}
	
	init_sprites(){
		this.add_sprite("pbody","body")
		this.add_sprite("head")
		this.add_sprite("eye")
		this.add_sprite("pb")
		this.add_sprite("pa")
		this.add_sprite("glow")
		
		const {pa,pb,pbody,head,eye,glow,x,y} = this
		
		pa.setOrigin(0.6,0.7)
		pb.setOrigin(0.6,0.7)
		
		const sc = this.scene
		glow.setScale(0)
		glow.setBlendMode("Multiply")
		
		this._scale = 1.1
		this.setScale(this._scale)		
		
		let paw = this.body.width*0.4

		this.setDepth(4)
		this.setSize(pa.width*0.8,pa.height*0.55)
		//this.setBodyOffset(-paw,0)
	}


	open_jaw(){
		const {pa,pb,body,head,eye,scene,glow} = this
		let paw = pa.width*0.1
		let pah = pa.width*0.2

		pa.setPosition(paw,pah)
		pb.setPosition(paw,pah)
		const delay = Math.random()*300+100
		const dur = Math.random()*200+500
		
		scene.tweens.add({
			targets:pa,
			angle:70,
			duration:dur,
			ease:"Bounce",
			delay:delay
		})			
		scene.tweens.add({
			targets:pb,
			angle:-70,
			duration:dur,
			ease:"Bounce",
			delay:delay
		})
		
		scene.tweens.add({
			targets:glow,
			scale:1.5,
			alpha:0.5,
			duration:700,
			ease:"Power2",
			delay:delay
		})		
	}

	close_jaw(cb){
		const {pa,pb,body,head,eye,glow,scene} = this
		scene.tweens.add({
			targets:pa,
			angle:0,
			duration:50,
			ease:"Power2"
		})		
		scene.tweens.add({
			targets:glow,
			alpha:0,
			scale:0,
			duration:50,
			ease:"Bounce",
			onComplete:cb
		})		
		
		scene.tweens.add({
			targets:pb,
			angle:0,
			duration:50,
			ease:"Power2"
		})
	}
}