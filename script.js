'use strict';


const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
countriesContainer.innerHTML = '';
const renderError = msg => {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.color = 'red';
  countriesContainer.style.fontWeight = '900';
};

////////////////////////////////////////////////////////////

const renderCountry = function (data, className = '') {
  const html = `
    <article class="country ${className}">
      <img class="country__img" src="${data.flag}" />
      <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
      +data.population / 1000000
    ).toFixed(1)} M people</p>
      <p class="country__row"><span>🌎</span>${numberWithSpaces(
      data.area
    )} km<sup>2</sup></p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
      </div>
    </article>
    `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.color = '#000';
  countriesContainer.style.fontWeight = '500';
};
function numberWithSpaces(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function doTheThing() {
  const nameEl = document.querySelectorAll('.country__name');
  console.log(nameEl);
  nameEl.forEach(el => {
    el.addEventListener('click', function () {
      const valueOfName = el.innerHTML;
      getCountryData(valueOfName);
    });
  });
}

document.querySelector('#submitBtn').addEventListener('click', event => {
  event.preventDefault();
  countriesContainer.innerHTML = '';
  const countryInput = document.querySelector('#contryInput').value;
  getCountryData(countryInput);
});

//////////////////////////////////////////////////////////// w

const getCountryData = function (country) {
  countriesContainer.innerHTML = '';
  fetch(`https://restcountries.eu/rest/v2/name/${country}`)
    .then(response => {
      console.log(response);

      if (!response.ok) {
        throw new Error(`Country not found! (${response.status})`);
      }

      return response.json();
    })
    .then(data => {
      renderCountry(data[0]);
      const neighbours = data[0].borders;
      // const neighbours = ['qwedoe','wedd'];
      // if (!neighbours) {
      //   throw new Error(`Neighbour not found`);
      // }
      let nbArray = new Array();
      for (let ctry in neighbours) {
        nbArray[ctry] = fetch(
          `https://restcountries.eu/rest/v2/alpha/${neighbours[ctry]}`
        );
      }
      return nbArray;
    })
    .then(response => {
      console.log(response.length);
      for (let i = 0; i < response.length; i++) {
        response[i] = response[i]
          .then(rps => {
            if (!rps.ok) {
              throw new Error(`Country not found! (${rps.status})`);
            }
            return rps.json();
          })
          .catch(err =>
            renderError(`Something went wrong! ${err.message}. Try again!`)
          );
      }
      return response;
    })
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        data[i] = data[i].then(dt => {
          renderCountry(dt, 'neighbour');
        })
      }
    })
    .catch(err => {
      console.error(`${err} 💥💥💥`);
      renderError(`Something went wrong! ${err.message}. Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = '1';
      setTimeout(()=>{
        doTheThing()
      },2000);
    });
};



///////////////////////////////////////

// const getCountryData = function (country) {
//   const req = new XMLHttpRequest();
//   req.open('GET', `https://restcountries.eu/rest/v2/name/${country}`);
//   req.send();

//   req.addEventListener('load', function () {
//     const [data] = JSON.parse(req.responseText);
//     console.log(data);

//     const html = `
// 	<article class="country">
// 		<img class="country__img" src="${data.flag}" />
// 		<div class="country__data">
// 		<h3 class="country__name">${data.name}</h3>
// 		<h4 class="country__region">${data.region}</h4>
// 		<p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(
//       1)} M people</p>
// 		<p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
// 		<p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
// 		</div>
// 	</article>
// 	`;
//     countriesContainer.insertAdjacentHTML('beforeend', html);
//     countriesContainer.style.opacity = '1';
//   });
// };

// getCountryData('uzbekistan');

/////////////////////////////////////////////////////////////////////////////////////

// const renderCountry = function (data, className='') {

//   const html = `
//     <article class="country ${className}">
//       <img class="country__img" src="${data.flag}" />
//       <div class="country__data">
//       <h3 class="country__name">${data.name}</h3>
//       <h4 class="country__region">${data.region}</h4>
//       <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(
//         1)} M people</p>
//       <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
//       <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
//       </div>
//     </article>
//     `;
//   countriesContainer.insertAdjacentHTML('beforeend', html);
//   countriesContainer.style.opacity = '1';

// }

/////////////////////////////////////////////////////////////////////////////

// const getCountryAndNeighbour = function (country) {

//   //AJAX call country 1
//   const req = new XMLHttpRequest();
//   req.open('GET', `https://restcountries.eu/rest/v2/name/${country}`);
//   req.send();

//   req.addEventListener('load', function () {
//     const [data] = JSON.parse(req.responseText);
//     console.log(data);

//     //render country one
//     renderCountry(data);

//     //Get neighbour country
//     const neighbour = data.borders;
//     if(!neighbour) return;
// for(let ctry in neighbour){
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.eu/rest/v2/alpha/${neighbour[ctry]}`);
//   request.send();

//   request.addEventListener('load', function () {
//     const data2 = JSON.parse(this.responseText);
//     renderCountry(data2, 'neighbour');
//   })
// }
//   });
// };
