;(
	function () {
		// 小组件模板
		// 因为组件只能有一个根节点,所以注释要放到里面
		const template = `
			 <footer id="copyright">
	            <p style="font-size:14px;text-align:center;font-style:italic;">  
	            Copyright © <a id="author">2018</a> Powered by <a id="author">beyond</a>  
	            </p>        
	         </footer>
		`
		// 把小组件对象 添加到window上,供大组件 beyond-component.js使用
		window.beyondCopyright = {
			// 属性简写
			template
		}
	}
)()