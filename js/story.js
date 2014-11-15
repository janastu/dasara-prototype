(function() {
  var Sweet = Backbone.Model.extend({
    defaults: {
      'who': '',
      'what': 'img-anno',
      'where': '',
      'how': {}
    },
    initialize: function() {
    },
    hasTag: function(tag) {
      return this.get('how')['tags'].indexOf(tag);
    }
  });


  var Sweets = Backbone.Collection.extend({
    model: Sweet,
    getAll: function(options) {
      // error checking
      if(!options.what) {
        throw Error('"what" option must be passed to get sweets of a URI');
        return false;
      }
      // setting up params
      var where = options.where || null,
          what = options.what;
      var who = options.who || null;

      // url = swtr.swtstoreURL() + swtr.endpoints.get + '?where=' +
      //   encodeURIComponent(where);// '&access_token=' + swtr.access_token;
      var url = "http://digitalhampi.swtr.in/api/sweets/q?what=" + what;

      if(who) {
        url += '&who=' + who;
      }
      // get them!
      this.sync('read', this, {
        url: url,
        success: function() {
          if(typeof options.success === 'function') {
            options.success.apply(this, arguments);
          }
        },
        error: function() {
          if(typeof options.error === 'function') {
            options.error.apply(this, arguments);
          }
        }
      });
    }
  });


  var StoryView = Backbone.View.extend({
    el: "#chapter3",
    template: _.template($("#story-image-template").html()),
    events: {
      "click img": 'onImgClick',
      "click [data-target='#lightbox']": 'onWordClick'
    },
    initialize: function(options) {
      this.listenTo(this.collection, "add", this.render);
      var self = this;
      this.collection.getAll({'what':'img-anno', who:'bhanu',
                              success: function(data) {
                                self.collection.add(data);
                              }});
    },
    render: function(model) {
      // model.set({'cid': model.get('cid')});
      if(model.hasTag('mysore')) {
        $('#' + model.get('id')).append(this.template(model.toJSON()));
      }
    },
    onImgClick: function(e) {
      var el = this.collection.find(function(item) {
        return item.id == $(e.currentTarget).attr('target-id');
      });
      var infoEl = $(".hidden[for="+$(e.currentTarget).attr('target-id')+"]");
      infoEl.addClass('show');
      infoEl.removeClass('hidden');

    },
    onWordClick: function(e) {
      // Get images related to the tag and display them in a carousel
      // var tag = $(e.currentTarget).text();
      var $lightbox = $("#lightbox");
      var $img = $(e.currentTarget).find('img'),
          src = $img.attr('src'),
          alt = $img.attr('alt'),
          css = {
            'maxWidth': $(window).width() - 100,
            'maxHeight': $(window).height() - 100
          };
      $lightbox.find('.close').addClass('hidden');
      $lightbox.find('img').attr('src', src);
      $lightbox.find('img').attr('alt', alt);
      $lightbox.find('img').css(css);

    },
    onImgMouseIn: function(e) {
      $(e.currentTarget).append(this.infoTemplate());
    }
  });

  new StoryView({collection: new Sweets()});
  // $(document).ready(function() {
  var $lightbox = $('#lightbox');

  //   $('[data-target="#lightbox"]').on('click', function(event) {
  //       var $img = $(this).find('img'),
  //           src = $img.attr('src'),
  //           alt = $img.attr('alt'),
  //           css = {
  //               'maxWidth': $(window).width() - 100,
  //               'maxHeight': $(window).height() - 100
  //           };

  //       $lightbox.find('.close').addClass('hidden');
  //       $lightbox.find('img').attr('src', src);
  //       $lightbox.find('img').attr('alt', alt);
  //       $lightbox.find('img').css(css);
  //   });

  $lightbox.on('shown.bs.modal', function (e) {
    var $img = $lightbox.find('img');

    $lightbox.find('.modal-dialog').css({'width': $img.width()});
    $lightbox.find('.close').removeClass('hidden');
  });
  // });
})();
