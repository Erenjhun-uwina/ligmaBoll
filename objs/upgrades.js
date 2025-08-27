
import {upgrades} from "./desc/upgrades.desc.js"
import {attacks} from "./desc/atks.desc.js"
const {round,random} = Math

export default class UpgradeSystem{
	

	constructor(){
		this.list = [...upgrades]
		this.atk_list = [...attacks]
		this.activated = ["none"]
	}
	
	replace(target,key,oldkey){
		if(key == undefined)throw new Error("key is undefined")
		if(oldkey == undefined)throw new Error("oldkey is undefined")
		
		const list = target.atk_list
		
		
		const atk = this.get(key,this.atk_list)
		const oldatk_i  = list.findIndex(e=>e.key == oldkey)
		
		//slpice attack list from oldatk index remove 1(old) then add new
		const oldatk = list.splice(oldatk_i,1,atk)
		
	}
	
	addAtk(target,key){
		if(key == undefined)throw new Error("key is undefined")
		
		const atk = this.get(key,this.atk_list)

		target.atk_list.push(atk)
	}
	
	activate(target,upgrade){
		
		if(target==undefined)throw new Error("Target is undefined (target,upgrade)")
		if(upgrade==undefined)throw new Error(upgrade+":Upgrade is undefined (target,upgrade)")
		
		upgrade.func(target,this)
		
		const key = upgrade.key
		this.remove(key)
		this.activated.push(key)
		//console.log(key)
	}
	
	
	
	
	get(key,arr = this.list){
		return arr.find((el) => el.key == key)
	}
	
	remove(key){
		
		const index = this.list.findIndex((e)=>e.key == key)
		if(index == -1)return 
		return this.list.splice(index,1)
	}
	
	random(a){
		
		let arr = []
		let up = this
	
		const list = this.list.filter(e => e.req.every(f=>this.activated.includes(f)))

		
		if(list.length < 1) throw(new Error("lmaoo not enough upgrades in the list"))
		
		
		for(let i = 0;i<a;i++){
			const len = list.length
			const ran = round(random()*(len-1))
			arr.push(list[ ran ])
		}
		return arr.length>1?arr:arr[0]
	}
	
	
}