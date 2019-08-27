/*****************************************************************

 **********************        C O R E        **********************

  ********************************************************************/

// newtpl可以不传，传值则用newtpl代替原模板 (dom object @newtpl)
HTMLElement.prototype.setData=function(newtpl){
	let tpl
	if(typeof newtpl=='object'){
		tpl=newtpl
	}else{
		if(this.tpl){
			tpl=this.tpl
		}else{
			tpl=this
		}	
	}
	let newdom=tpl.cloneNode(true)
	// 先判断--if (从外到内)
	setIf([newdom])
	function setIf(domlist){
		for (var i = 0; i < domlist.length; i++) {
			let name=domlist[i].getAttribute('--if')
			if(name===null){
				setIf(domlist[i].children)
				continue
			}
			let obj
			if(obj=name.match(/{{(.*?)}}/)){
				try {
					obj=eval(obj[1])
				} catch(e) {
					console.log(e);
				}
				
			}else{
				obj=name
			}
			if(obj){
				domlist[i].removeAttribute('--if')
				setIf(domlist[i].children)
				continue
			}else{
				
				domlist[i].remove()
				console.log('remove',newdom)
				console.log(domlist[i])
			}
		}
	}

	// 再找--for （从内到外
	setFor([newdom])
	function setFor(domlist){
		// 到最底返回true，接收到true后继续
		if(domlist.length==0){
			return true
		}
		for (var i = 0; i < domlist.length; i++) {
			if(setFor(domlist[i].children)){
				let name=domlist[i].getAttribute('--for')
				domlist[i].removeAttribute('--for')
				if(name===null){
					continue
				}
				let obj
				if(obj=name.match(/{{(.*?)}}/)){
					try {
						obj=eval(obj[1])
					} catch(e) {
						obj=null
						console.log(e)
					}
				}else{
					obj=name
				}
				// 组装每条--for
				let html=''
				let str=domlist[i].outerHTML
				let patt=new RegExp('{{(.*?)}}','g')
				let match=[]
				let tmp
				// 获取里面所有的{{}}
				while((tmp=patt.exec(str))!=null){
					match.push(tmp)
				}
				for(let k in obj){
					let item=obj[k]
					let str0=str
					for(let k0 in match){
						try {
							tmp=eval(match[k0][1])
						} catch(e) {
							console.log(e);
						}
						tmp==undefined?tmp='':null
						str0=str0.replace(match[k0][0],tmp)
					}
					html+=str0
				}
				domlist[i].outerHTML=html
			}
		}
		return true
	}
	
	// 最后处理剩余的{{}} （从头到尾）
	let patt=new RegExp('{{(.*?)}}','g'),match=[],tmp
	newdom.classList.add('--setData')
	let pnode=this.parentNode
	let html=newdom.outerHTML
	while((tmp=patt.exec(html))!=null){
		match.push(tmp)
	}
	for(let k0 in match){
		try {
			tmp=eval(match[k0][1])
		} catch(e) {
			console.log(e);
		}
		
		tmp==undefined?tmp='':null
		html=html.replace(match[k0][0],tmp)
	}
	this.outerHTML=html//会用一个新dom对象
	let that=pnode.querySelector('.--setData')
	that.tpl=tpl
	that.classList.remove('--setData')
	return html
}

function xhrget(url,fun=function(res){console.log(res)},asyn=true,credentials=true){
	let xhr=new XMLHttpRequest()
	xhr.withCredentials = credentials
	xhr.open('get',url,asyn)
	xhr.send()
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){	
			try {
				if(xhr.status==200){
					json=JSON.parse(xhr.responseText)
					if(json.length==0){
						json=null
					}
					fun(json)
				}else{
					console.log('xhr返回异常：',xhr.status)
					console.log(xhr.responseText)
				}
			} catch(e) {
				console.log(e)
				fun(xhr.responseText)
			}
		}
	}
}


/*****************************************************************

 *********************        A R R A Y        *********************

  ********************************************************************/
// 数组去重
function uniq(arr){
    var temp = [];
    var index = [];
    var l = arr.length;
    for(var i = 0; i < l; i++) {
        for(var j = i + 1; j < l; j++){
            if (arr[i] === arr[j]){
                i++;
                j = i;
            }
        }
        temp.push(arr[i]);
        index.push(i);
    }
    return temp;
}









/*****************************************************************

 *******************        S N I P P I T        *******************

  ********************************************************************/

// localStorage:
function getLS(a){
	return localStorage.getItem(a)
}
function setLS(a,b){
	return localStorage.setItem(a,b)
}

// 数组去重
function uniq(array){
    var temp = [];
    var index = [];
    var l = array.length;
    for(var i = 0; i < l; i++) {
        for(var j = i + 1; j < l; j++){
            if (array[i] === array[j]){
                i++;
                j = i;
            }
        }
        temp.push(array[i]);
        index.push(i);
    }
    return temp;
}