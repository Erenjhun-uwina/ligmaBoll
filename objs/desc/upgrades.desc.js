
class Upgrade{
	constructor(key,desc,req = "none",func,cb){
		this.key = key
		this.desc = desc
		this.func = func
		this.cb = cb,
		this.req = Array.isArray(req)?req:[req]
		}
} 

const {round,random} = Math


export const upgrades = [
	new Upgrade("giga","+20% mhp\n+30% size","none", 
		(target)=>{
			target.mhp = round( target.mhp * 1.2)
			target._setScale(target.scale*1.3)
	}),
	
	new Upgrade("mega","+10% mhp\n+30% size\nheal 10% mhp\n+10% energy cap","giga",
		(target)=>{
			target.mhp = round( target.mhp * 1.1)
			target._setScale(target.scale*1.3)
			target.setHp( round( target.hp * 1.1) )
			target.m_energy *= 1.1
		}),
	
	new Upgrade("titan","+10% mhp\n+40% size\nheal 10% mhp\n+20% energy cap\n+300% regen","mega",
		(target)=>{
			target.mhp = round( target.mhp * 1.1)
			target._setScale(target.scale*1.4)
			target.setHp( round( target.mhp * 1.1))
			target.hp_regen *= 3
			target.m_energy *= 1.2
	}),
	new Upgrade("diver","+5% mhp","none",
		(target,sys)=>{		
			sys.addAtk(target,"dive")
		}),
		
	new Upgrade("sumo","+5% mhp","diver",
		(target,sys)=>{		
			sys.addAtk(target,"slam")
		}),
		
	new Upgrade("sucker","+20% m_energy","none",
		(target,sys)=>{		
			sys.addAtk(target,"blast")
		}),
	
	new Upgrade("hopper","double jump","none",
		(target)=>{
			target.jumper = true
		}),
	new Upgrade("glidder","double jump","hopper",
		(target)=>{
			target.glider = true
		}),
]