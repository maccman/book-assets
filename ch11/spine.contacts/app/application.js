jQuery(function($){
  window.App = Spine.Controller.create({
    el: $("body"),
    
    elements: {
      "#sidebar": "sidebarEl",
      "#contacts": "contactsEl"
    },
    
    init: function(){
      this.sidebar = Sidebar.inst({el: this.sidebarEl});
      this.contact = Contacts.inst({el: this.contactsEl});
      
      Contact.fetch();
    }
  }).inst();
});