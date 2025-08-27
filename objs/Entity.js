


export default class Entity extends Phaser.GameObjects.Container{
	
		#disabled_p
		#disabled_e
		
		constructor(sc,x,y){
			super(sc,x,y)

			sc.physics.add.existing(this)
			sc.add.existing(this)
			this.atlas == null
			
			
			//custom datas
			this._scale = 1

		}
		

		
		reuse(){
		
			if(this.isDisabled("p")!=undefined)this.enable()
			if(this.isDisabled("e")!=undefined)this.enable("e")
			
			this.setActive(true)
			this.body.setEnable(true)
			this.setVisible(true)
			this.alpha = 1
			this.emit("reuse")
		}
		
		getName(n){
			
			let nn = this.constructor.name
			if(n)nn = (nn==n)
			return nn
		}
		

		kill(){
			this.setVisible(false)
			this.setActive(false)
			this.body.setEnable(false)
			this.emit("kill")
		}
		
		setSize(width,height){
			this.body.setSize(width,height)
			this.body.setOffset(-width/2,-height/2)
			this.disp_height = height
		}
		
		set_size(width,height){
			this.body.setSize(width,height)
			this.body.setOffset(-width/2,-height/2)
			this.disp_height = height
		}
		
		setBodyOffset(ix=0,iy){
			if(iy==undefined)iy=ix
			
			const {x,y} = this.body.offset
			this.body.setOffset(x+ ix,y+ iy)
		}
		
		disable(type = "p",val = true){
			
			if(!type == "p" && !type == "e")throw new Error("first arg 'Type' should be 'e' for enemy of 'p' for player")
			if(type=="e")this.#disabled_e = val
			if(type=="p")this.#disabled_p = val
		}
		
		enable(type = "p",val = true){
			this.disable(type,!val)
		}
		
		
		isDisabled(type = "p"){
			if(!type == "p" && !type == "e")throw new Error("first arg 'Type' should be 'e' for enemy of 'p' for player")
			return type == "p" ?this.#disabled_p : this.#disabled_e
		}
		
		isEnabled(type = "p"){
			return  !this.isDisabled(type)
		}
		
		add_sprite(_name,i,useAtlas = true){
			if(_name == undefined) throw new Error("this requires two args(_name,img)")
			
			let img = i 
			let sp
			
			if( i == undefined) img = _name
			
			if(this.atlas!=null){sp = this.scene.add.image(0,0,this.atlas,`${img}.png`)}
			else{sp = this.scene.add.image(0,0,img)}
			
			this[_name] = sp
			this.add(sp)
			
			if(this.resized )return
			
			this.resized  = true
			this.setSize(sp.width,sp.height)
		}

}