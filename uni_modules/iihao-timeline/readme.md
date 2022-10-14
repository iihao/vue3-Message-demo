# rxl-timeline 时间线
### 可视化地呈现时间流信息。
因为目前没有多端需求，所以多端兼容没有测试，目前在web和微信小程序上使用。
代码简单易扩展，各位可按需求自行调整。希望能帮到大家

### 应用

使用uni_modules导入	
由rxl-timeline和rxl-timeline-itme组成
```html
<rxl-timeline>
	<rxl-timeline-item timestamp="2021-02-12" title="标题" desc="描述" :size="15">
	</rxl-timeline-item>
	<rxl-timeline-item timestamp="2021-02-17" :size="20" :showTail="false" color="red">
		<view slot="body">
			<view style="color:#555555">自定义内容</view>
		</view>
	</rxl-timeline-item>
</rxl-timeline>
```
### 属性说明

|属性名				|类型	|默认值	|说明|
|:-:				|:-:	|:-:	|:-:																							|
|showTail			|Boolean|true	|显示节点连接线
|timestamp			|String	|-		|时间																							|
|color				|String	|-		|节点颜色																							|
|title				|String	|-		|标题																							|
|desc				|String	|-		|描述																							|
|size				|Number	|16		|节点大小(单位px,最大40)																			|

### 插槽说明

开发者使用 rxl-timeline-itme 时，支持向 rxl-timeline-itme 里插入自定义内容。

|slot名	|说明				|
|:-:	|:-:				|
|body	|自定义内容			|
|icon	|自定义图标			|



```html
<rxl-timeline-item>
	<view slot="body">
		<view>自定义内容</view>
	</view>
</rxl-timeline-item>

<rxl-timeline-item :size="24">
	<icon type="success" slot="icon" :size='24'/>
</rxl-timeline-item>
```

### 事件说明

|事件			|说明				|返回参数|
|:-:			|:-:				|:-:	|
|@onIconClick	|图标点击事件			|-		|
|@onTimeClick	|时间点击事件			|-		|
|@onBodyClick	|内容点击事件			|-		|

```html
	<rxl-timeline-item 
		@onTimeClick="timeClick"
		@onIconClick="iconClick" 
		@onBodyClick="bodyClick">
	</rxl-timeline-item>
```