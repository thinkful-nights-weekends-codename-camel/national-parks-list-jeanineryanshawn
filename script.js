'use strict';


const apiKey = 'PgnZNBF1eFlwu12cj9iDVet20makkg9JMroA4RlY'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function getStateParks(query, maxResults=10) {
  const params = {
    stateCode: query,
    limit: maxResults - 1,
    api_key: apiKey
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  fetch(url)
    .then(response => {
      if (response.ok) {
        let responseJson = response.json();
        return responseJson;
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function displayResults(responseJson) {
  let listItemsHTML = responseJson.data.map(item => {
    return `
      <li><a href="${item.url}" target="_blank"><h1>${item.fullName}</h1></a><p>${item.description}</p></li><hr>
    `;
  }).join('');
  $('.results-list').html(listItemsHTML);
  $('.searchresults').removeClass('hidden');
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#state-search').val();
    const maxResults = $('#limit-input').val();
    getStateParks(searchTerm, maxResults);
  });
}

$(watchForm);