var STORAGE_KEY = 'todos-vuejs-demo'
var todoStorage = {
  fetch: function() {
    var todos = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )
    todos.forEach(function(todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

const app= new Vue({
    el: '#app',
    data:{
        todos: [],

        options: [
            {value: -1, lable: 'すべて'},
            {value: 0, lable: '作業中'},
            {value: 1, lable: '完了'},
        ],

        current:-1
    },

    method:{
        //TODOリストの追加
        doAdd: function(event, value){
            //refで名前をつけた要素を参照
            var comment = this.$refs.comment
            //コメントの入力がなければreturnを返す
            if(!comment.value.length){
                return
            }

            this.todos.push({
                id: todoStorage.uid++,
                comment: comment.value,
                state: 0
            })
            //フォーム要素を空にする
            comment.value = ''
        },

        //状態変更の処理
        doChangeState: function(item){
            item.state = item.state ? 0 : 1
        },

        //TODOリストの削除
        doRemove: function(item){
            var index = this.todos.indexOf(item)
            this.todos.splice(index, 1)
        }
    },

    watch:{
        todos:{
            handler: function(todos){
                todoStorage.save(todos)
            },

            deep: true
        }
    },

    computed:{
        //currentが-1ならすべて
        //それ以外ならcurrentとstatuが一致するモノだけに絞り込む
        computedTodos: function(){
           return this.todos.filter(function(el){
               return this.current < 0 ? true : this.corrent === el.state
           }, this) 
        },

        //{0: 作業中, 1: 完了, -1: すべて}
        labels(){
            return this.options.reduce(function(a, b){
                return Object.assign(a, {[b.value]: b.label})
            }, {})
        }


    },

    created(){
        this.todos = todoStorage.fetch()
    }


})