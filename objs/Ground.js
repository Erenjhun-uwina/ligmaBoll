
export default class Ground extends Phaser.GameObjects.Rectangle{

	constructor(sc,x=0,y=0,w=0,h=200,fill = 0x555555){
		
		super(sc,x,y,w,h,0x00)
		sc.add.existing(this)
		sc.physics.add.existing(this)
		
		this.body.setImmovable(true)
		this.setOrigin(0,1)
		this.setDepth(-3)
		

		this.top = y-h
		this.topH = 100
		this.topY = this.top+this.topH/2
		
		this.sprite = sc.add.rectangle(x,this.topY,w,this.topH,fill)
		const sp = this.sprite
		sp.setOrigin(0,1)
		sp.setDepth(-2)
		
		sc.objObserver.check_leavescreen(this)
	}
	
	setWidth(w){
		this.displayWidth = w
		this.sprite.displayWidth = w
	}
	
	setHeight(h){
		this.displayHeight = h
		this.sprite.setPosition(this.x,this.y-h + this.topH/2)
	}
	
	reuse(x,y){
		this.setPosition(x,y)
		this.sprite.setPosition(x,this.topY)		
		this.setActive(true)
		this.body.setEnable(true)
		this.setVisible(true)
	}
}