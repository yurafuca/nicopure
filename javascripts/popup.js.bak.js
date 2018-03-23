import $ from 'jquery';
import { Loading } from './loading';

$(function() {
  const loading = new Loading($('#mylistgroup'));

  Promise.resolve()
    .then(loading.start())
    .then(Nicoapi.isLogined)
    .then(function(result) {
      if (result === false) {
        loading.done();
        MyListItemView.message('PLEASE_LOGIN');
      }
    })
    .then(Nicoapi.getMylistGroup)
    .then(function(mylists) {
      MyListView.appendDef();
      if (mylists.length === 0) {
        reject();
      }
      MyListView.show(mylists);
      loading.done();
    })
    .then(loading.done());
});

$(function() {
  $(document).on('click', '.mylist', function() {
    $('#mylistitem').addClass('logoback');

    $('.mylist').removeClass('selected');
    $(this).addClass('selected');

    MyListItemView.clear();

    const dom = new MyListView($(this));
    const loading = new Loading($('#mylistitem'));
    const id = $(this)
      .find('.id')
      .text();
    let getapi = null;
    if (id === 'deflist') {
      getapi = Nicoapi.getDeflistItem;
    } else {
      getapi = Nicoapi.getMylistItem;
    }
    getapi(id).then(function(videos) {
      $('#mylistitem').removeClass('logoback');
      if (videos.length === 0) {
        MyListItemView.message('NO_ITEM');
      }
      dom.select();
      MyListItemView.show(videos);
    });

    $('#mylisttitle').text(
      $(this)
        .find('.name')
        .text()
    );
  });
});

function removeBackground() {}
