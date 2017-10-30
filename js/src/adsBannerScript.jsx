import React from 'react';
import ReactDOM from 'react-dom';

function getData(url) {
  const xhr = new XMLHttpRequest();

  let data;

  xhr.open('GET', url);

  const promise = new Promise((resolve, reject) => {
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
        data = JSON.parse(xhr.response);
        resolve(data);
      }
    };

    xhr.onerror = () => reject(new Error('Wystąpił błąd pobierania danych'));
  });

  xhr.send(null);

  return promise;
}

class AdBanner {
  constructor(data, container) {
    this.data = data;
    this.container = container;
    this.maxItemSize = null;
    this.maxImageSize = null;
  }

  init() {
    this.setOrientation();
    this.shuffleData(this.data);
  }

  setOrientation() {
    if (this.container.offsetWidth > this.container.offsetHeight) {
      this.container.classList.add('horizontal');
    } else this.container.classList.add('vertical');
  }

  shuffleData(data) {
    data.sort(() => (0.5 - Math.random()));
    this.sliceData(data);
  }

  calcAdsNumber() {
    const myHeight = ((this.container.offsetHeight) - 10) == 0 ? 300 : this.container.offsetHeight,
      myWidth = this.container.offsetWidth,
      descHeight = 30;

    let adsNumber = null;

    if (this.container.classList.contains('horizontal')) {
      adsNumber = myWidth / (myHeight - descHeight);
      this.setElementSize(myWidth, myHeight, descHeight, adsNumber);
    } else if (this.container.classList.contains('vertical')) {
      adsNumber = myHeight / (myWidth + 30);
      this.setElementSize(myWidth, myHeight, descHeight, adsNumber);
    }

    return Math.floor(adsNumber);
  }

  setElementSize(width, height, descHeight, elemNumber) {
    if (this.container.classList.contains('horizontal')) {
      this.maxImageSize = { height: height - descHeight - 10 };
      this.maxItemSize = { width: width / elemNumber };
    } else if (this.container.classList.contains('vertical')) {
      this.maxItemSize = { width: width - 10 };
      this.maxImageSize = { width: width - 10 };
    }
  }

  sliceData(data) {
    let count = this.calcAdsNumber();
    count = (count > data.length) ? data.length : count;
    const newData = data.slice(0, count);
    this.render(newData);
  }

  adsList(data) {
    return (
      data.map(item => this.adsBanner(item))
    );
  }

  adsBanner(data) {
    return (
      <div className="adsBanner__item" style={this.maxItemSize}>
        <a href={data.url}>
          <img src={data.image} style={this.maxImageSize} />
          <p>{data.name}</p>
        </a>
      </div>
    );
  }

  render(data) {
    ReactDOM.render(this.adsList(data), this.container);
  }
}


// Found all containers and create new class
const adsBannerWrappers = document.querySelectorAll('.adsBanner');

function init(adsArr) {
  for (let i = 0; i < adsBannerWrappers.length; i++) {
    const myAd = new AdBanner(adsArr, adsBannerWrappers[i]);
    myAd.init();
  }
}

// Init AdBanner
function sendAdsList(data) {
  const allAdsList = data;
  init(allAdsList);
}


// Get DATA
getData('https://erwin0917.github.io/BanerReact/data.json')
  .then(data => sendAdsList(data))
  .catch(error => console.log(error));
