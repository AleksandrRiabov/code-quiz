const highScoresList = document.querySelector('#highscores');
const clearBtn = document.querySelector('#clear');

renderAllResults();

clearBtn.addEventListener('click', () => {
  localStorage.removeItem('results');
  renderAllResults();
});


function renderAllResults() {
  //Reset ordered list
  highScoresList.innerHTML = '';

  //Get results from local storage
  const results = JSON.parse(localStorage.getItem('results')) || [];
  //if no results saved in local storage 
  if (!results.length) {
    highScoresList.textContent  = 'No results to display..'
    return
  }

  //Sort results array from highest score to the lowest
  const sortedResults = results.sort((a, b) => parseInt(a.score) - parseInt(b.score)).reverse();

  //Render all results
  sortedResults.forEach(result => renderListItem(result));
}

//=== Function to create single list item with result
function renderListItem(result) {
  const li = document.createElement('li');
  li.textContent = `${result.initials} - ${result.score}`;
  highScoresList.append(li);
}