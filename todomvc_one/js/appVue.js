;(function (window) {
	'use strict';

	// var animeArr = [
	// 				{
	// 					animeID: 1,
	// 					animeName: "未闻花名",
	// 					animeHaveSeen: false
	// 				},
	// 				{
	// 					animeID: 2,
	// 					animeName: "龙与虎",
	// 					animeHaveSeen: true
	// 				},
	// 				{
	// 					animeID: 3,
	// 					animeName: "轻音少女",
	// 					animeHaveSeen: false
	// 				}
	// 			]
// ------------------全局自定义组件(简写形式)------------
// Vue.directive('beyond-focus',function (el,binding) {
// 	el.focus()
// })


// ------------------全局自定义指令(完整形式)------------
// 参数1: 指令名v-beyond-show 所对应的 参数1 在定义时, 有两种不同的写法
    //       第1种: 除了v- 的部分, 即beyond-show
    //       第2种: 驼峰命名法,可以写成 beyondShow
    // 两种写法,效果一样,都是同一个指令 v-beyond-show

    // 参数2: 是对象,其属性键值对 是5个钩子函数
Vue.directive('beyond-focus',{
    // 钩子1: 只调用一次,第一次绑定指令到元素时调用(此时,无父节点), 可做一些初始化设置
    // 再次强调,此时无父节点
    bind: function (el,binding,vnode,oldNode) {
    	// 注意:聚焦不能写在bind钩子里
        console.log('bind: el: ', el)
        console.log('bind: elのparent: ', el.parentNode)
        console.log('bind: binding: ', binding)
        console.log('')
    },
    // 钩子2: 当被绑元素inputNode 插入到dom时,调用insert方法 (只会执行一次)
    // 仅保证父节点存在,但不一定已插入到DOM中
    // 如果你要操作父节点,至少要写在这个钩子里
    inserted: function (el,binding,vnode,oldNode) {
    	
        console.log('inserted: el: ', el)
        console.log('inserted: binding: ', binding)
        console.log('inserted: elのparent: ', el.parentNode)
        console.log('')

    },
    // 钩子3:  此时DOM内部尚未更新
    // 如果要获取html更新之前的内容, 代码写这儿
    update: function (el,binding,vnode,oldNode) {
        // 指令是可以传值的, 根据传递的值(即binding对象中的value)
        // v-beyond-focus="currentEditAnime === anime"
		if(binding.value === true){
			el.focus()
		}
        
        
    },
    // 钩子4: 此时 DOM内容 已经全部更新
    // 如果要获取html更新之后的内容, 代码写这儿
    componentUpdated: function (el,binding,vnode,oldNode) {
        // console.log('componentUpdated: el: ' , el)
        // console.log('componentUpdated: binding: ' , binding)
        // console.log('')
        
    },
    // 钩子5: 
    unbind: function (el,binding,vnode,oldNode) {
        NSLog('unbind: el: ' + el)
        NSLog('unbind: binding: ' + binding)
        
    }
})
// ------------------全局自定义指令(完整形式)------------






	// var animeArr = []
	// 初始值来自 localStorage (默认初次 没有值, 便以空数组代替)
	var animeArrInitString = window.localStorage.getItem('animeArr')
	var animeArr = JSON.parse(animeArrInitString || '[]')
	// 这儿必须用window 记住, 因为本函数写在闭包里面
	window.appVue = new Vue({
		// data选项
        data: {
           animeArr: animeArr,
           // 记录 被人双击时的那一个 anime对象
           currentEditAnime: null,
           // 根据 window.location.hash 进行同步改变; 而hashString又作为 过滤数组的重要的判断条件;
           // 从而实现了地址栏 与 列表数组 的联动
           hashString: ''
        },

        // 观察者 选项
        // 注意: 不能使用 箭头函数来定义 watch选项中的函数
		// 原因是: 箭头函数 绑定的是父级作用域的上下文
        watch: {
        	// 观察data选项中的animeArr属性的一举一动,并随之执行相应的业务处理逻辑
        	animeArr: {
        		// 数组 和 对象 等引用类型,默认只能监视第1层,为了能够监视其子成员的改变, 必须 深度观察
        		deep: true,
        		// 监听开始时,立即调用(不管改没改变)
        		immediate: true,
        		// 发现改变时,随之 调用的业务逻辑 (持久化)
        		handler: function (newValue,oldValue) {
        			// NSLog('animeArr发生改变,写入本地存储')
        			window.localStorage.setItem('animeArr',JSON.stringify(newValue))
        		}
        	}
        },

        // 计算属性 本质是一个getter/setter方法, 但是必须也只能按属性使用
        computed: {
        	// 第1种写法: 直接写,  用 方法 的形式写
        	// unSeenAnimeCount(){
        	// 	var leftCount =  this.animeArr.filter(anime => 
        	// 				!anime.animeHaveSeen
        	// 			).length
        	// 	NSLog(leftCount)
        	// 	return leftCount
        	// }


        	// 第2种 完整写法  对象形式
        	unSeenAnimeCount: {
        		// 默认 只有一个 getter
        		get: function () {
        			var leftCount =  this.animeArr.filter(anime => 
        					anime.animeHaveSeen === false
        				).length
	        		// NSLog(leftCount)
	        		return leftCount
        		}
        	},
        	// 选择全部 / 取消选择
        	chooseAllOrNot: {
        		get: function () {
        			
        			// 当数组中每一个 anime 都 have seen的时候, 自动勾选 checkbox
			        // 当数组中 只要有一个anime 不是have seen时, 取消勾选 checkbox
			        // 注意: 计算属性知道自己依赖了 数组, 所以,当 数组 变化时, 计算属性也会重新计算
			        var b = this.animeArr.every(anime => 
			            anime.animeHaveSeen === true
			        )
			        NSLog('get: ' + b)
			        return b
        		},
        		// 只要用户 勾选或取消 绑定了此计算属性的checkbox, 就会来到setter方法 (因为有 设置值)
        		// 数组animeArr中的所有animeHaveSeen的状态也就都会跟着联动
        		set: function () {
        			
			        // 1. 非常巧妙! 先通过计算属性的getter方法,获取当前的 勾选 状态
			        var isChecked = this.chooseAllOrNot
			        // 2. 然后选择相反的状态
			        var newIsChecked = !isChecked
			        // NSLog('set: ' + newIsChecked)
			        // 3. 同步更新所有数组中的成员
			        this.animeArr.forEach(anime => 
			            anime.animeHaveSeen = newIsChecked
			        )
        		}
        	},
        	// 根据条件 过滤出来的 供列表显示的 数组
        	filtedAnimeArr: {
        		get: function () {
        			// 如果 根据路由得出的 中间变量 为 completed 或者 active ,则 过滤相应的数组 展示到界面上
        			if(this.hashString === 'active'){
        				return this.animeArr.filter(anime => 
        						anime.animeHaveSeen === false
        					)
        			}else if(this.hashString === 'completed'){
        				return this.animeArr.filter(anime => 
        						anime.animeHaveSeen === true
        					)
        			}else{
        				return this.animeArr
        			}
        		}
        	}
        },


        methods: {
        	addAnimeFunction(event)	{
        		NSLog('按下回车')
        		// 获取input节点
        		var inputNode = event.target
        		var newAnimeName = inputNode.value.trim()
        		NSLog(newAnimeName)
        		// 过滤非空数据
        		if(!newAnimeName.length){
        			return
        		}
        		var animeArr = this.animeArr
        		// 索引健壮性
        		var newAnimeID = -1
        		if(animeArr.length === 0){
        			newAnimeID = 1
        		}else{
        			newAnimeID = animeArr[animeArr.length -1 ].animeID + 1
        		}
        		
        		var newAnime = {
        			animeID: newAnimeID,
        			animeHaveSeen: false,
        			animeName: newAnimeName
        		}
        		animeArr.push(newAnime)
        		// 清空输入框
        		inputNode.value = ''
             	
	        },
	        selectAllOrNotFunction(event){
	        	// 先拿到节点
	        	var checkNode = event.target
	        	// 再拿到其 选中状态 checked
	        	var checkStatus = checkNode.checked
	        	NSLog(checkStatus)
	        	// 如果选中,则将数组内所有的animeHaveSeen状态置为 true
	        	this.animeArr.forEach(item => {
	        		item.animeHaveSeen = checkStatus
	        	})
	        },
	        // 当事件处理函数,没有传递参数时,第一个参数就是event
	        // 当事件处理函数传递了参数时,就没有办法再获取到event对象了
	        // 因此,我们在传递参数时,就要手动传递事件对象 $event
	        deleteAnimeBtnClicked(event,index){
	        	// 只有在 调用方法时,手动传递了$event对象,这时,我们才可以在方法里面 拿到事件对象
	        	this.animeArr.splice(index,1)
	        },
	        // 双击事件发生时调用
	        // 参数1: 双击事件
	        // 参数2: 索引
	        // 参数3: anime对象
	        doubleClickFunction(event,index,anime){
	        	// 非常巧妙的1步,使用中间变量 保存被双击的对象(其实用索引也行)
	        	this.currentEditAnime = anime
	        },
	        // 按回车 或 失去焦点时, 结束编辑
	        editCompleteFunction(event,index,anime){
	        	// 1. 退出editing样式(让中间变量currentEditAnime 置null)
	        	this.currentEditAnime = null
	        	// 2. 获取并验证 新输入的 animeName
	        	var editNode = event.target
	        	var newAnimeName = editNode.value
	        	NSLog(newAnimeName)
	        	// 2.1 如果为空,则删除该anime,
	        	if (newAnimeName.length === 0) {
	        		this.animeArr.splice(index,1)
	        		return
	        	}
	        	// 2.2 如果有内容,则更新
	        	anime.animeName = newAnimeName

	        },
	        // 按esc时, 结束编辑 不保存
	        cancleEditFunction() {
	        	// 1. 退出editing样式(让中间变量currentEditAnime 置null)
	        	this.currentEditAnime = null
	        },
	        // 点击 清除完成 按钮 事件
	        clearCompletedAnimeBtnClicked() {
	        	// 注意: 使用forEach 遍历数组时,千万不能 删除元素 
	        	// 方式一: 用for语句遍历, 并在删除后,将索引 --
	        	// for (var i = 0; i < animeArr.length; i++) {
	        	// 	if(this.animeArr[i].animeHaveSeen){
	        	// 		this.animeArr.splice(i,1)
		        // 		// 注意: 千万记得 i-- 
		        // 		i--
	        	// 	}
	        		
	        	// }

	        	// 方式二: 推荐使用filter 过滤出新数组
	        	this.animeArr = this.animeArr.filter( anime => 
	        			!anime.animeHaveSeen
	        		)
	        },
	        // 使用方法包装, 获取未观看的动漫数
	        unSeenAnimeCountFunction() {
	        	return this.animeArr.filter(anime => 
	        			!anime.animeHaveSeen
	        		).length
	        }
    	}
    }).$mount('#id_div_container')







// -------------------------------------------
	function onWindowLocationHashChanged(){
		// 拿到 window.location.hash
		var tempHashStr = window.location.hash
		// 赋值给 data的 中间变量 hashString(即 过滤数组的条件) 
		// #/active => active  #/completed => completed
		window.appVue.hashString = tempHashStr.substr(2)
	}
	// 只有hansh 发生 改变时, 才会调用本方法
	window.onhashchange = onWindowLocationHashChanged
	// 页面初始化时,手动调用一次,根据当前路由状态进行回显
	onWindowLocationHashChanged()
// -------------------------------------------


})(window);
