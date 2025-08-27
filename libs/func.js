
export function debounce(scene,func,limit){
  let lastFunc
  
  return function(...args) {
    
    const context = this
    if(lastFunc)lastFunc.remove()
    
    lastFunc = scene.time.delayedCall(limit,()=>{
    	func.apply(context,args)
    })    

  }
}



