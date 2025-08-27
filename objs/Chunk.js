
export default class Chunk {

	

	constructor(sc,config){
		this.scene = sc
		this.#init(config)
	}
	
	
	//return a random ground
	random_ground(){
		
		const {scene} = this
		const ground = {} 
		ground.w = Math.random()*scene.width + scene.width * 0.5
		ground.h = 70 + Math.random() * 200
		ground.gap = Math.random()*100 + 200 
		
		return ground
	}
	
	//return array of random enemy based on platform width passed
	random_spawns(w,enLen){
		
		const {scene} = this
		const spawns = {}
		
		spawns.space = Math.random()*200+270
		spawns.types = []
		
		
		
		const count = Math.round(w/spawns.space)

		let inx
		
		for(let i=1;i<=count;i++){
									
			if(Math.random() < Math.min(count/i,0.1)) continue
			const x = i * spawns.space

			if(x+spawns.space > w )break		

			inx =  Math.round( Math.random()*enLen )
			
			const en = {}
			
			en.xoff = x
			en.yoff = 0
			en.index = inx
			
			spawns.types.push(en)
		}
		
		return spawns
	}
	
	
	////initialize
	
	#init(config = {}){
		
		if(config == "random")this.random = true
		
		const {ground,spawns,orbs} = config
		
		const g = this.#init_ground(ground)
		const s = this.#init_spawns(spawns)
		//const o = 
	
		this.orbs = orbs
	} 
	
	#init_spawns(spawns){
		
		this.spawns = spawns || {}
		
		const s = this.spawns
		if(s.xoff == undefined)this.spawns.xoff = 300
		
		if(s.types  == undefined)return
		//loop through all types set xoff if undefined
		s.types.forEach((e,i)=>{
			if(e.xoff == undefined)e.xoff == s.gap
		});
	}

	#init_ground(ground){
	
		this.ground = ground || {}		

		
		const g = this.ground				
		if(g.w == undefined)this.ground.w = this.scene.width
		if(g.h == undefined)this.ground.h = 200
		if(g.gap == undefined)this.ground.gap = 200
				
	}
  		
}