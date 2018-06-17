;(function () {
		// 小组件模板
		// 因为组件只能有一个根节点,所以注释要放到里面
		const template = `
			<section class="main">
				
				<!-- 全选/全不选
						 方式1: 在这儿监听 change 事件 
								 v-on:change="selectAllOrNotFunction"

						 方式2:  MVVM 高级玩法
						 使用计算属性chooseAllOrNot作为v-model 实现双向绑定 到checkbox

						 因为checkbox既有初始值, 又要勾选设置值,所以要双向绑定

						 所以,当初始化checkbox时, 会调用计算属性的getter方法

						 而当你勾选checkbox的时候,就会自动调用计算属性的 setter方法
					 -->
					<input id="toggle-all" class="toggle-all" type="checkbox"
					v-model="chooseAllOrNot"
					>
					<label for="toggle-all">Mark all as complete</label>


				<ul class="todo-list">
					<!--  三种样式
							  editing when editing 
						 	  completed when marked as completed 

						 	  这儿实行的是单向绑定class
					 	 -->

					 	 <!-- 注意: 下面这儿关于当前编辑的样式editing 有点儿巧妙
						data新增一个属性 currentEditAnime, 保存的是那一个被双击的 anime对象
						如果 两个对象一样时, 自动进入 正在编辑样式
						 -->
					<li v-for="(anime,index) in filtedAnimeArr" v-bind:class="{completed: anime.animeHaveSeen,
						editing: currentEditAnime === anime
						}">
						<div class="view">
							<!-- 根据状态选择是否选中
									 这儿实现的双向绑定
								 -->
							<input class="toggle" type="checkbox" v-model="anime.animeHaveSeen" >
							<!-- 上面的双击 要传递3个参数
							 	  第1是:  双击事件
							 	  第2是:  索引
							 	  第3是:  anime对象
							    -->
								<label v-on:dblclick="doubleClickFunction($event,index,anime)">{{ anime.animeName }}</label>

								<!-- 点击按钮删除item 
									 注意: 
									 第1个参数是索引,
									 第2个参数是手动传递的事件 $event 对象
									 (固定写法,死记硬背)
								-->
								<button class="destroy"
								v-on:click="deleteAnimeBtnClicked($event,index)"
								></button>
						</div>


						<!-- 编辑框 必须是单向绑定,因为
							1. 还有esc撤销编辑的功能 
							2. 去除editing样式,即把currentEditAnime置空即可
							3. 敲回车 或 失去焦点自动保存
							   如果没有内容,则自动删除该item


							   使用自定义指令 自动聚焦,条件是 当前编辑的对象是自己
							-->
							<input class="edit" v-bind:value="anime.animeName"
							v-on:keydown.enter="editCompleteFunction($event,index,anime)"
							v-on:blur="editCompleteFunction($event,index,anime)"
							v-on:keydown.esc="cancleEditFunction"
							v-beyond-focus="currentEditAnime === anime"  
							>
					</li>
					
				</ul>
			</section>
		`
		// 把小组件对象 添加到window上,供大组件 beyond-component.js使用
		window.beyondMain = {
			// 属性简写
			template,
			// 声明来自父组件的数组,然后就可以像data选项中返回的对象里的数据那样使用了
			// 注意: 子组件 只能使用 来自父组件的数据,  万万不可修改!!!
			// 因为违背了Vue的通信原则: 单向数据流
			// 正确做法是: 在事件发生时,把数据通过自定义事件的参数上交给父组件
			props: ['key_arr','key_hashString'],
			// 组件的data必须是一个返回对象的函数
			data: function(){
				var obj = {
					// 记录 被人双击时的那一个 anime对象
		            currentEditAnime: null,
				}
				return obj
			},
			// 计算属性
			computed: {
				// 根据条件 过滤出来的 供列表显示的 数组
	            filtedAnimeArr: {
	                get: function () {
	                    // 如果 根据路由得出的 中间变量 为 completed 或者 active ,则 过滤相应的数组 展示到界面上
	                    if(this.key_hashString === 'active'){
	                        return this.key_arr.filter(anime => 
	                                anime.animeHaveSeen === false
	                            )
	                    }else if(this.key_hashString === 'completed'){
	                        return this.key_arr.filter(anime => 
	                                anime.animeHaveSeen === true
	                            )
	                    }else{
	                        return this.key_arr
	                    }
	                }
	            },
	            // 选择全部 / 取消选择
	            chooseAllOrNot: {
	                get: function () {
	                    
	                    // 当数组中每一个 anime 都 have seen的时候, 自动勾选 checkbox
	                    // 当数组中 只要有一个anime 不是have seen时, 取消勾选 checkbox
	                    // 注意: 计算属性知道自己依赖了 数组, 所以,当 数组 变化时, 计算属性也会重新计算
	                    var b = this.key_arr.every(anime => 
	                        anime.animeHaveSeen === true
	                    )
	                    NSLog('get: ' + b)
	                    return b
	                },
	                // 只要用户 勾选或取消 绑定了此计算属性的checkbox, 就会来到setter方法 (因为有 设置值)
	                // 数组animeArr中的所有animeHaveSeen的状态也就都会跟着联动
	                set: function (param_isChecked) {
	                	// ----------------------------------
	                	// 方法2: 直接使用传进来的 新的值
	                	this.$emit('beyond-update-all',param_isChecked)    
	                	return
	                    // ----------------------------------
	                    // 方法1: 先getter,再取反 
	                    // 1. 非常巧妙! 先通过计算属性的getter方法,获取当前的 勾选 状态
	                    var isChecked = this.chooseAllOrNot
	                    // 2. 然后选择相反的状态
	                    var newIsChecked = !isChecked
	                    // NSLog('set: ' + newIsChecked)
	                    // 3. 发送自定义事件,通知父组件,同步更新全部数组中的成员状态
	                    this.$emit('beyond-update-all',newIsChecked)    
	                }
	            }
			},
			// 事件处理
			methods: {
				// 双击事件发生时调用
	            // 参数1: 双击事件
	            // 参数2: 索引
	            // 参数3: anime对象
	            doubleClickFunction(event,index,anime){
	                // 非常巧妙的1步,使用中间变量 保存被双击的对象(其实用索引也行)
	                this.currentEditAnime = anime
	            },
	            // 按esc时, 结束编辑 不保存
	            cancleEditFunction() {
	                // 1. 退出editing样式(让中间变量currentEditAnime 置null)
	                this.currentEditAnime = null
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
	                	// 发送自定义事件,告诉父组件 删除 它
	                	this.$emit('beyond-delete',index)
	                    return
	                }
	                // 2.2 如果有内容,则更新
	                // anime.animeName = newAnimeName
	                // 发送自定义事件,告诉父组件 删除 它
                	this.$emit('beyond-update',[index,newAnimeName])
	            },
	            // 当事件处理函数,没有传递参数时,第一个参数就是event
	            // 当事件处理函数传递了参数时,就没有办法再获取到event对象了
	            // 因此,我们在传递参数时,就要手动传递事件对象 $event
	            deleteAnimeBtnClicked(event,index){
	                // 发送自定义事件给父组件
	                this.$emit('beyond-delete',index)
	            }
			}
		}
	}
)()