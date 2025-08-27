
export default class Group extends Phaser.GameObjects.Group{

	constructor(scene,b){
		super(scene)
		this.base = Array.isArray(b)?b:[b]
	}
	
	_get(args,i=null){
		//get random enemy from the pool create it if needed based on args passed
		
		let index =  i
		let c = null
		

				
		//if i is undefined set index to a random index
		if(i == null) {
			index = Math.round(Math.random() * this.baseLen());
		}
		//else if i is a string find the index of corresponding element
		else if(typeof index == "string") {
			index = this.base.findIndex(e=>e.name==index)
		}
		
		
		try{
		if(!c ) c = this.getChildren().find((e)=>{
			const key =  this.base[index].name
			return (e.getName(key) && e.active == false)
		}); 
		
		}catch(e){}
	
		//if c is null or undefined create new 
		if(!c){
			let obj = this.base[index]		
			 c = new obj(...args)
			 this.add(c)
		}
		return c
	}
	
	baseLen(){
		//returns the length of base classes provided in this group minus 1 
		return this.base.length-1
	}
	
}