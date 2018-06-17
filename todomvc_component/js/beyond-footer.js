;(function () {
		// 小组件模板
		// 因为组件只能有一个根节点,所以注释要放到里面
		const template = `
			<footer class="footer">
				<!-- 	数组没有东西时, footer不用渲染
						剩余未未完成的数量
						 这儿有3种写法:
						 第1种: 直接在Mustache语法中 进行 数组的 filter
						 第2种: 使用方法包装
						 第3种: 使用计算属性
					 -->
					<span class="todo-count">
						<strong>
							<!-- 第3种, 计算属性
								 好处1: 有缓存 (会缓存计算结果,提高性能)
								 好处2: 模板没有 厚重的逻辑
								 好处3: 易维护

								 注意: 计算属性 必须也只能按属性使用 (不能用于事件处理函数,虽然它本质是getter和setter方法)
							 -->
							 {{ unSeenAnimeCount }}
					</strong>item left</span>

					
					<!-- 1. 根据 路由routing 的切换, 导致window.location.hash变化
						 2. 而监听到地址栏的hash的变化时 , 又人为导致 data中的一个 中间变量(hashString)的变化 
					 	 3. 而条件(hashString)的变化 , 又改变 计算属性 返回的结果数组 filtedAnimeArr 
					 	 4. 从而实现了对 列表的过滤与切换  -->
					<ul class="filters">
						<li>
							<a v-bind:class="{selected: key_hashString === ''}" href="#/">All</a>
						</li>
						<li>
							<a v-bind:class="{selected: key_hashString === 'active'}" href="#/active">Active</a>
						</li>
						<li>
							<a v-bind:class="{selected: key_hashString === 'completed'}" href="#/completed">Completed</a>
						</li>
					</ul>
					<!-- 如果没有已经完成的item, 那么不渲染这个按钮 
					这儿非常巧妙地使用 array的some函数
					-->
					<button v-if="key_arr.some(anime => anime.animeHaveSeen)" class="clear-completed"
					v-on:click="clearCompletedAnimeBtnClicked"
					>清除完成</button>

			</footer>
		`
		// 把小组件对象 添加到window上,供大组件 beyond-component.js使用
		window.beyondFooter = {
			// 属性简写
			template,
			// 来自父组件的数组(然后就可以使用了,注意不能改喔)
			props: ['key_arr','key_hashString'],
			// 事件处理
			methods: {
				// 点击 清除完成 按钮 事件
	            clearCompletedAnimeBtnClicked() {
	                // 把发生的点击事件 通知父组件
	                this.$emit('beyond-click')
	            }
			},
			// 计算属性 本质是一个getter/setter方法, 但是必须也只能按属性使用
			computed: {
				// 第2种 完整写法  对象形式
	            unSeenAnimeCount: {
	                // 默认 只有一个 getter
	                get: function () {
	                    var leftCount =  this.key_arr.filter(anime => 
	                            anime.animeHaveSeen === false
	                        ).length
	                    // NSLog(leftCount)
	                    return leftCount
	                }
	            }
			}
		}
	}
)()