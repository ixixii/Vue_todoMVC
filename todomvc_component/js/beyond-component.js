;(
	function () {
		var initAnimeArr = [
			{animeID: 1,animeName: "未闻花名",animeHaveSeen: false},
			{animeID: 2,animeName: "龙与虎",animeHaveSeen: true},
			{animeID: 3,animeName: "轻音少女",animeHaveSeen: false}]

		// 初始值来自 localStorage (默认初次 没有值, 便以空数组代替)
	    var animeArrInitString = window.localStorage.getItem('animeArr')
	    var animeArr = JSON.parse(animeArrInitString || '[]')
	    if(animeArr.length === 0){
	    	console.log(animeArr)
	    	animeArr = initAnimeArr
	    }


		// 大组件的模板代码
		const template = `
			<div>
				<section class="todoapp">
					<!-- 子组件发出的自定义事件 -->
					<beyond-header v-on:beyond-keydown="addAnimeCallback"></beyond-header>
					<!-- props第2步, 将数据 传递给子组件
						 其中 key_arr是子组件的props选项中预先声明的
					 -->


					<!-- 使用虚拟元素template将这个元素两个包起来 
						 1是为了 避免代码冗余
						 2是为了 避免套上额外的div
					-->
				    <template v-if="animeArr.length">
					<!-- 数组没有东西时,不要渲染 -->

						<beyond-main v-bind:key_hashString="key_hash"  v-bind:key_arr="animeArr" v-on:beyond-update="updateAnimeCallback" v-on:beyond-delete="deleteAnimeCallback" v-on:beyond-update-all="chooseAllOrNotCallback"></beyond-main>
						<beyond-footer v-bind:key_hashString="key_hash" v-bind:key_arr="animeArr" v-on:beyond-click="clearCompletedAnimeBtnClickedCallback"></beyond-footer>
					</template>
				</section>
				<beyond-copyright></beyond-copyright>
			</div>
		`
		// 把大组件对象 添加到window上,供appVue.js使用
		window.beyondComponent = {
			// 属性简写
			template,
			// 接收来自父组件的数据(只是中转,要传递给子组件)
			props: ['key_hash'],
			// 定义自己的4个子组件
			components: {
				// 同样的 属性简写
				beyondHeader,
				beyondMain,
				beyondFooter,
				beyondCopyright
			},
			// data是返回一个对象的函数
			data: function () {
				var obj = {
					animeArr: animeArr
				}	
				return obj
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

			// 事件处理
			methods: {
				// 纯业务方法,类似于CRUD
				addAnimeCallback(newAnimeName){
					NSLog('父组件: ' + newAnimeName)
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

				},
				// 纯业务方法
				clearCompletedAnimeBtnClickedCallback(){
					// 方式二: 推荐使用filter 过滤出新数组
	                this.animeArr = this.animeArr.filter( anime => 
	                        !anime.animeHaveSeen
	                    )
				},
				// 纯业务方法
				updateAnimeCallback(arr){
					var index = arr[0]
					var newAnimeName = arr[1]
					this.animeArr[index].animeName = newAnimeName
				},
				// 纯业务方法
				deleteAnimeCallback(index){
					NSLog(this)
					this.animeArr.splice(index,1)
				},
				// 纯业务方法
				chooseAllOrNotCallback(isChecked) {
					this.animeArr.forEach(anime => 
                        anime.animeHaveSeen = isChecked
                    )
				}
			}
		}
	}
)()