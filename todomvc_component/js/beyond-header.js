;(function () {
		// 小组件模板
		// 因为组件只能有一个根节点,所以注释要放到里面
		const template = `
			<header class="header">
				<h1 style="color:white;text-shadow:2px 2px 4px #e5cdcf;letter-spacing:5px;font-family:inherit;font-weight:380;" class="sgcontentcolor sgcenter">  
		            あの花
		        </h1>
				<input @keydown.enter="addAnimeFunction" class="new-todo" placeholder="请输入动漫名,按回车键录入" autofocus>
			</header>
		`
		// 把小组件对象 添加到window上,供大组件 beyond-component.js使用
		window.beyondHeader = {
			// 属性简写
			template,
			// 事件
			methods: {
				addAnimeFunction(event){
					NSLog('按下了回车: ' + event)
					// 获取input节点
	        		var inputNode = event.target
	        		var newAnimeName = inputNode.value.trim()
	        		
	        		// 过滤非空数据
	        		if(!newAnimeName.length){
	        			return
	        		}
	        		// 清空输入框
	        		inputNode.value = ''
	        		// 发送自定义事件, 将数据传递给父组件
	        		this.$emit('beyond-keydown',newAnimeName)
	        		
				}
			}
		}
	}
)()