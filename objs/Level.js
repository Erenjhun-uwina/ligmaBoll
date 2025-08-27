
import Orb from "./Orb.js"
import Ground from "./Ground.js"


import Pincher from "./enemies/Pincher.js"
import Frog from "./enemies/Frog.js"
import Totle from "./enemies/Totle.js"
import Jelly from "./enemies/Jelly.js"
import Spiked_Totle from "./enemies/Spiked_Totle.js"


import Group from "./Group.js"


let GlobalLevel


export default class Level{
	
	
	#chunk_i 
	#chunk_x
	#chunk_y
	#chunk_xw
	#ground_to_destroy
	
	constructor(sc,chunks){
		
		this.scene = sc
		this.chunks = Array.isArray(chunks)?chunks:[chunks]
		this.#chunk_i = -1
		this.#chunk_x = 0
		this.#chunk_xw = 0
		
		this.#ground_to_destroy = []
		
		this.init()
		this.generate()
		
	}
	
	toDestroy(obj){
		this.#ground_to_destroy.push(obj)
		const len = this.#ground_to_destroy.length
		
		if(len < 8)return
		this.updateToDestroy(len)
	}
	
	updateToDestroy(len = 1){
		const {grounds} = Level
		
			const g = this.#ground_to_destroy[0]
			const px = this.scene.player.x
			const gx = g.x+g.displayWidth
					
			this.#ground_to_destroy.splice(0,1)
			grounds.kill(g)
	}
	
	generate(){

		const {scene} = this
		const {width,height} = scene
		const {chunks} = this
		
		let chunk = {
			w:width,
			gap:0,
			h:200
		}	
		
		if(!(this.#chunk_i < 0)) {
			chunk = chunks[this.#chunk_i]
		}
		
		let g
		
		if(chunk.random) {
			g = this.#generate_random(chunk)
			

		}else{		
			g = this.#generate_platform(chunk)
	
			//##spawns enemy
			this.#spawn(chunk,g.x,g.y-g.h)
			
			//##spawns orbs
			this.#spawn_orbs(chunk,g.x,g.y-g.h)
		}
		this.#chunk_x = g.x
		this.#chunk_xw = g.x + g.w
		this.#chunk_y = g.y
		
		this.#chunk_i = this.#chunk_i+1 > this.chunks.length-1 ?0 : this.#chunk_i+1
	}
	
	
	#generate_random(chunk){
		const {enemies} = Level
		
		const g = this.#generate_platform(chunk.random_ground())
		
		this.#spawn(chunk.random_spawns(g.w,enemies.baseLen()),g.x,g.y-g.h)
		//TODO: random orb
		//this.#spawn_orbs(chunk.random_orbs(g.w),g.x,g.y-g.h)
		return g
	}
	
	
	#spawn_orbs(chunk = {},ix,iy){
		const {orbs} = Level
		const x = ix
		const y = iy
		
		let o = orbs._get([this.scene,x,y])
		
		if(!o)return
		o.reuse()
		o.setPosition(x,y-50)
	}
	
	
	#spawn(chunk = {},ix,iy){
		const {enemies} = Level
		const {scene} = this
		
		const {types} = chunk.spawns || chunk
		if(types == undefined)return

		const y = iy
		
		
		for(let en of types)
		{	

			//continue
			const x = ix + en.xoff 
			let e = enemies._get([scene,x,y],en.index)
			e.reuse()
			e.setPosition(x,y-e.disp_height)

			e.once("leavescreen",()=>{
				enemies.kill(e)
				e.kill()
				//console.log(enemies.getLength())
			});
		}		

	}
	
	
	#generate_platform(chunk){
		const {grounds} = Level
		const {scene} = this
		const {width,height} = scene
		
		const {w,h,gap} = chunk.ground || chunk
		
		
		let x = this.#chunk_xw 
		if(x != 0 ) x += gap
		
		const y = height
		
		const g = grounds._get([scene,x,y,w,h,0x999999])
		g.reuse(x,y)
		g.setWidth(w)
		g.setHeight(h)
		
		g.once("enterscreen",()=>{
			this.generate()
		});
		
		if(this.#chunk_i == -1){
			g.once("leavescreen",()=>{
				scene.time.delayedCall(5000,()=>grounds.remove(g))
			});
		}else{
			this.toDestroy(g);
		}
		
		return {x:x,
				w:w,
				h:h,
				y:y}
	}
	
	
	init(){
		
		Level.grounds = new Group(this.scene,Ground)
		Level.enemies = new Group(this.scene,[Frog,Totle,Spiked_Totle,Pincher])
		Level.orbs = new Group(this.scene,Orb)
		
		this.scene.ground = Level.grounds
		this.scene.enemies = Level.enemies		
		this.scene.orbs = Level.orbs		
		
		this.init_colliders()
	}
	
	init_colliders(){
		
		const {orbs,enemies,grounds} = Level
		
		this.scene.physics.add.collider(enemies,grounds,(e)=>e.emit("land"));
		
		this.scene.physics.add.overlap(enemies,enemies,
			(e1,e2)=>
			{
				if(e1.getName("Totle") && e1.kicked){		
					e1.inflict(e2,"enemy")				
				}
			});
	}
	
}