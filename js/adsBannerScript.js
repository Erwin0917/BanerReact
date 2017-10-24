'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getData(url) {
  var xhr = new XMLHttpRequest();

  var data = void 0;

  xhr.open('GET', url);

  var promise = new Promise(function (resolve, reject) {
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
        data = JSON.parse(xhr.response);
        resolve(data);
      }
    };

    xhr.onerror = function () {
      return reject(new Error('Wystąpił błąd pobierania danych'));
    };
  });

  xhr.send(null);

  return promise;
}

var AdBanner = function () {
  function AdBanner(data, container) {
    _classCallCheck(this, AdBanner);

    this.data = data;
    this.container = container;
    this.maxItemSize = null;
    this.maxImageSize = null;
  }

  _createClass(AdBanner, [{
    key: 'init',
    value: function init() {
      this.setOrientation();
      this.shuffleData(this.data);
    }
  }, {
    key: 'setOrientation',
    value: function setOrientation() {
      if (this.container.offsetWidth > this.container.offsetHeight) {
        this.container.classList.add('horizontal');
      } else this.container.classList.add('vertical');
    }
  }, {
    key: 'shuffleData',
    value: function shuffleData(data) {
      data.sort(function () {
        return 0.5 - Math.random();
      });
      this.sliceData(data);
    }
  }, {
    key: 'calcAdsNumber',
    value: function calcAdsNumber() {
      var myHeight = this.container.offsetHeight - 10 == 0 ? 300 : this.container.offsetHeight,
          myWidth = this.container.offsetWidth,
          descHeight = 30;

      var adsNumber = null;

      if (this.container.classList.contains('horizontal')) {
        adsNumber = myWidth / (myHeight - descHeight);
        this.setElementSize(myWidth, myHeight, descHeight, adsNumber);
      } else if (this.container.classList.contains('vertical')) {
        adsNumber = myHeight / (myWidth + 30);
        this.setElementSize(myWidth, myHeight, descHeight, adsNumber);
      }

      return Math.floor(adsNumber);
    }
  }, {
    key: 'setElementSize',
    value: function setElementSize(width, height, descHeight, elemNumber) {
      if (this.container.classList.contains('horizontal')) {
        this.maxImageSize = { height: height - descHeight - 10 };
        this.maxItemSize = { width: width / elemNumber };
      } else if (this.container.classList.contains('vertical')) {
        this.maxItemSize = { width: width - 10 };
        this.maxImageSize = { width: width - 10 };
      }
    }
  }, {
    key: 'sliceData',
    value: function sliceData(data) {
      var count = this.calcAdsNumber();
      count = count > data.length ? data.length : count;
      var newData = data.slice(0, count);
      this.render(newData);
    }
  }, {
    key: 'adsList',
    value: function adsList(data) {
      var _this = this;

      return data.map(function (item) {
        return _this.adsBanner(item);
      });
    }
  }, {
    key: 'adsBanner',
    value: function adsBanner(data) {
      return React.createElement(
        'div',
        { className: 'adsBanner__item', style: this.maxItemSize },
        React.createElement(
          'a',
          { href: data.url },
          React.createElement('img', { src: data.image, style: this.maxImageSize }),
          React.createElement(
            'p',
            null,
            data.name
          )
        )
      );
    }
  }, {
    key: 'render',
    value: function render(data) {
      ReactDOM.render(this.adsList(data), this.container);
    }
  }]);

  return AdBanner;
}();

// Found all containers and create new class


var adsBannerWrappers = document.querySelectorAll('.adsBanner');

function init(adsArr) {
  for (var i = 0; i < adsBannerWrappers.length; i++) {
    var myAd = new AdBanner(adsArr, adsBannerWrappers[i]);
    myAd.init();
  }
}

// Init AdBanner
function sendAdsList(data) {
  var allAdsList = data;
  init(allAdsList);
}

// Get DATA
getData('https://erwin0917.github.io/BanerReact/data.json').then(function (data) {
  return sendAdsList(data);
}).catch(function (error) {
  return console.log(error);
});
