class MyListView {
  constructor(dom) {
    this.dom = dom;
  }

  static show(mylists) {
    $.each(mylists, function(index, mylist) {
      let dom = MyListView.toDom(mylist);
      $('#mylistgroup').append(dom);
    });
  }

  static toDom(mylist) {
    let dom = $('<div class ="mylist"><span class="name"></span><span class="id"></span></div>');
    dom.find('.name').text(mylist.name);
    dom.find('.id').text(mylist.id);
    return dom;
  }

  static message(type) {
    var message = {
      NO_ITEM: '登録されているマイリストがありません．'
    };
    $('#mylistgroup').text(message[type]);
  }

  static appendDef() {
    let deflist = {
      name: 'とりあえずマイリスト',
      id: 'deflist'
    };
    let dom = MyListView.toDom(deflist);
    $('#mylistgroup').append(dom);
  }

  select(myList) {
    this.dom.addClass('is_selected');
  }

  unSelect(myList) {
    this.dom.removeClass('is_selected');
  }
}
