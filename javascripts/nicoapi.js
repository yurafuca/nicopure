class Nicoapi {
  constructor() {
    // do nothing.
  }

  static isLogined() {
    return new Promise(function(resolve, reject) {
      $.post(
        'http://www.nicovideo.jp/api/mylistgroup/list',
        function(response) {
          console.log(response);
          switch (response.status) {
            case 'ok':
              resolve(true);
              break;
            case 'fail':
              resolve(false);
              break;
          }
        },
        'json'
      );
    });
  }

  static getMylistGroup() {
    return new Promise(function(resolve, reject) {
      $.post(
        'http://www.nicovideo.jp/api/mylistgroup/list',
        function(response) {
          console.log(response.mylistgroup);
          switch (response.status) {
            case 'ok':
              resolve(response.mylistgroup);
              break;
            case 'fail':
              reject(new Error('Couldnt connect /api/mylistgroup/list'));
              break;
          }
        },
        'json'
      );
    });
  }

  static getDeflistItem() {
    return new Promise(function(resolve, reject) {
      $.post(
        'http://www.nicovideo.jp/api/deflist/list',
        function(response) {
          console.log(response.mylistitem);
          switch (response.status) {
            case 'ok':
              resolve(response.mylistitem);
              break;
            case 'fail':
              reject(new Error('Couldnt connect /api/deflist/list'));
              break;
          }
        },
        'json'
      );
    });
  }

  static getMylistItem(listId) {
    return new Promise(function(resolve, reject) {
      $.post(
        'http://www.nicovideo.jp/api/mylist/list?group_id=' + listId,
        function(response) {
          console.log(response.mylistitem);
          switch (response.status) {
            case 'ok':
              resolve(response.mylistitem);
              break;
            case 'fail':
              reject(new Error('Couldnt connect /api/mylist/list?group_id='));
              break;
          }
        },
        'json'
      );
    });
  }
}
