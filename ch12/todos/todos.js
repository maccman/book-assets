jQuery(function($){
  
  // Our basic Todo model has `content` and `done` attributes.
  window.Todo = Backbone.Model.extend({
    defaults: {
      done: false
    },

    toggle: function() {
      this.save({done: !this.get("done")});
    }
  });
  
  window.TodoList = Backbone.Collection.extend({
    model: Todo,

    // Save all of the todo items under the `"todos"` namespace.
    localStorage: new Store("todos"),

    // Filter down the list of all todo items that are finished.
    done: function() {
      return this.filter(function(todo){ return todo.get('done'); });
    },

    remaining: function() {
      return this.without.apply(this, this.done());
    }
  });

  // Create our global collection of Todos.
  window.Todos = new TodoList;
  
  window.TodoView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",

    // Cache the template function for a single item.
    template: $("#item-template").template(),

    events: {
      "change   .check"        : "toggleDone",
      "dblclick .todo-content" : "edit",
      "click    .todo-destroy" : "destroy",
      "keypress .todo-input"   : "updateOnEnter",
      "blur     .todo-input"   : "close"
    },

    initialize: function() {
      _.bindAll(this, 'render', 'close', 'remove', 'edit');
      this.model.bind('change', this.render);
      this.model.bind('destroy', this.remove);
    },

    render: function() {
      var element = jQuery.tmpl(this.template, this.model.toJSON());
      $(this.el).html(element);
      this.input = this.$(".todo-input");
      return this;
    },

    toggleDone: function() {
      this.model.toggle();
    },    

    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
      $(this.el).addClass("editing");
      this.input.focus();
    },

    // Close the `"editing"` mode, saving changes to the todo.
    close: function(e) {
      this.model.save({content: this.input.val()});
      $(this.el).removeClass("editing");
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function(e) {
      if (e.keyCode == 13) e.target.blur();
    },

    remove: function() {
      $(this.el).remove();
    },

    destroy: function() {
      this.model.destroy();
    }
  });
  
  // Our overall **AppView** is the top-level piece of UI.
  window.AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#todoapp"),

    statsTemplate: $("#stats-template").template(),

    events: {
      "keypress #new-todo":  "createOnEnter",
      "click .todo-clear a": "clearCompleted"
    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {
      _.bindAll(this, 'addOne', 'addAll', 'render');

      this.input    = this.$("#new-todo");

      Todos.bind('add',     this.addOne);
      Todos.bind('refresh', this.addAll);
      Todos.bind('all',     this.render);

      Todos.fetch();
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      var done = Todos.done().length;
      var element = jQuery.tmpl(this.statsTemplate, {
        total:      Todos.length,
        done:       Todos.done().length,
        remaining:  Todos.remaining().length
      });
      this.$('#todo-stats').html(element);
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(todo) {
      var view = new TodoView({model: todo});
      this.$("#todo-list").append(view.render().el);
    },

    // Add all items in the **Todos** collection at once.
    addAll: function() {
      Todos.each(this.addOne);
    },

    // If you hit return in the main input field, create new **Todo** model
    createOnEnter: function(e) {
      if (e.keyCode != 13) return;

      var value = this.input.val();
      if ( !value ) return;

      Todos.create({content: value});
      this.input.val('');
    },

    clearCompleted: function() {
      _.each(Todos.done(), function(todo){ todo.destroy(); });
      return false;
    }
  });

  // Finally, we kick things off by creating the **App**.
  window.App = new AppView;
});