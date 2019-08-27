# jslib
对原生JS的封装代码  
  
异步GET请求
```
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
```
