// ------------------全局自定义组件(简写形式)------------
Vue.directive('beyond-focus',function (el,binding) {
	// 要根据条件来决定是否focus
	if(binding.value === true)
	{
		el.focus()
	}
 
})

var appVue = new Vue({
	el: '#id_div_container',
	// 定义局部组件
	components: {
		// 大组件的beyondComponent
		beyondComponent
	},
	// data对象,要传递hash给 大组件
	data: {
		// 根据 window.location.hash 进行同步改变; 而hashString又作为 过滤数组的重要的判断条件;
       // 从而实现了地址栏 与 列表数组 的联动
       hashString: ''
	},
	// 可以把监听window的hash change事件,写到Vue实例的生命周期方法里
	created: function () {
		NSLog('created')
		// 只有hansh 发生 改变时, 才会调用本方法
		// 之所以这儿要使用箭头函数,目的就是为了利用箭头函数的特性,拿到外层(父作用域)的this (即vue实例)
		window.onhashchange = ()=>{
			NSLog('this: ' + this)
			// 拿到 window.location.hash
		    // 赋值给 data的 中间变量 hashString(即 过滤数组的条件) 
		    // #/active => active  #/completed => completed
		    this.hashString = window.location.hash.substr(2)
		    NSLog(this.hashString)
		}
		// 因为我们要一上来,就改一次hashString属性,从而根据路由自动刷新一下列表(保持住路由状态)
		// 页面初始化时,需要手动调用一次,会自动根据当前路由状态进行回显
		window.onhashchange()
	}
})
window.appVue = appVue
