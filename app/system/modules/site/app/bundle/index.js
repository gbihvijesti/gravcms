!function(e){function t(i){if(n[i])return n[i].exports;var s=n[i]={exports:{},id:i,loaded:!1};return e[i].call(s.exports,s,s.exports,t),s.loaded=!0,s.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t){e.exports={el:"#site",data:function(){return _.merge({edit:void 0,menu:this.$session.get("site.menu",{}),menus:[],nodes:[],tree:!1,selected:[]},window.$data)},created:function(){this.Menus=this.$resource("api/site/menu{/id}"),this.Nodes=this.$resource("api/site/node{/id}");var e=this;this.load().then(function(){e.$set("menu",_.find(e.menus,"id",e.$get("menu.id"))||e.menus[0])})},ready:function(){var e=this;UIkit.nestable(this.$els.nestable,{maxDepth:20,group:"site.nodes"}).on("change.uk.nestable",function(t,n,i,s){s&&"removed"!==s&&e.Nodes.save({id:"updateOrder"},{menu:e.menu.id,nodes:n.list()}).then(e.load,function(){this.$notify("Reorder failed.","danger")})})},methods:{load:function(){var e=this;return Vue.Promise.all([this.Menus.query(),this.Nodes.query()]).then(function(t){e.$set("menus",t[0].data),e.$set("nodes",t[1].data),e.$set("selected",[]),_.find(e.menus,"id",e.$get("menu.id"))||e.$set("menu",e.menus[0])},function(){e.$notify("Loading failed.","danger")})},isActive:function(e){return this.menu&&this.menu.id===e.id},selectMenu:function(e){this.$set("selected",[]),this.$set("menu",e),this.$session.set("site.menu",e)},removeMenu:function(e){this.Menus["delete"]({id:e.id})["finally"](this.load)},editMenu:function(e){e||(e={id:"",label:""}),this.$set("edit",_.merge({positions:[]},e)),this.$refs.modal.open()},saveMenu:function(e){this.Menus.save({menu:e}).then(this.load,function(e){this.$notify(e.data,"danger")}),this.cancel()},getMenu:function(e){return _.find(this.menus,function(t){return _.contains(t.positions,e)})},cancel:function(){this.$refs.modal.close()},status:function(e){var t=this.getSelected();t.forEach(function(t){t.status=e}),this.Nodes.save({id:"bulk"},{nodes:t}).then(function(){this.load(),this.$notify("Page(s) saved.")})},moveNodes:function(e){var t=this.getSelected();t.forEach(function(t){t.menu=e}),this.Nodes.save({id:"bulk"},{nodes:t}).then(function(){this.load(),this.$notify(this.$trans("Pages moved to %menu%.",{menu:_.find(this.menus.concat({id:"trash",label:this.$trans("Trash")}),"id",e).label}))})},removeNodes:function(){if("trash"!==this.menu.id){var e=this.getSelected();e.forEach(function(e){e.status=0}),this.moveNodes("trash")}else this.Nodes["delete"]({id:"bulk"},{ids:this.selected}).then(function(){this.load(),this.$notify("Page(s) deleted.")})},getType:function(e){return _.find(this.types,"id",e.type)},getSelected:function(){return this.nodes.filter(function(e){return this.isSelected(e)},this)},isSelected:function(e,t){return _.isArray(e)?_.every(e,function(e){return this.isSelected(e,t)},this):this.selected.indexOf(e.id)!==-1&&(!t||!this.tree[e.id]||this.isSelected(this.tree[e.id],!0))},toggleSelect:function(e){var t=this.selected.indexOf(e.id);t==-1?this.selected.push(e.id):this.selected.splice(t,1)}},computed:{showDelete:function(){return this.showMove&&_.every(this.getSelected(),function(e){return!(this.getType(e)||{})["protected"]},this)},showMove:function(){return this.isSelected(this.getSelected(),!0)}},watch:{"menu + nodes":{handler:function(){this.$set("tree",_(this.nodes).filter({menu:this.menu.id}).sortBy("priority").groupBy("parent_id").value())},deep:!0}},filters:{label:function(e){return _.result(_.find(this.menus,"id",e),"label")},"protected":function(e){return _.reject(e,"protected",!0)},trash:function(e){return _.reject(e,"id","trash")},divided:function(e){return _.reject(e,"fixed",!0).concat({divider:!0},_.filter(e,"fixed",!0))}},components:{node:{name:"node",props:["node","tree"],template:"#node",computed:{isFrontpage:function(){return"/"===this.node.url},type:function(){return this.$root.getType(this.node)||{}}},methods:{setFrontpage:function(){this.$root.Nodes.save({id:"frontpage"},{id:this.node.id},function(){this.$root.load(),this.$notify("Frontpage updated.")})},toggleStatus:function(){this.node.status=1===this.node.status?0:1,this.$root.Nodes.save({id:this.node.id},{node:this.node}).then(function(){this.$root.load(),this.$notify("Page saved.")})}}}}},Vue.ready(e.exports)}]);