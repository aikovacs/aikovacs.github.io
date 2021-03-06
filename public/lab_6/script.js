// You may wish to find an effective randomizer function on MDN.

function range(int) {
  const arr = [];
  for (let i = 0; i < int; i += 1) {
    arr.push(i);
  }
  return arr;
}

function sortFunction(org, compare, key) {
  if (org[key] < compare[key]) {
    return -1;
  } if (org[key] > compare[key]) {
    return 1;
  }
  return 0;
}

document.body.addEventListener('submit', async (e) => {
  e.preventDefault(); // this stops whatever the browser wanted to do itself.
  const form = $(e.target).serializeArray(); // here we're using jQuery to serialize the form
  fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form)
  })
    .then((fromServer) => fromServer.json())
    .then((fromServer) => {
      function getRandomInt(min, max) {
        const min1 = Math.ceil(min);
        const max1 = Math.floor(max);
        return Math.floor(Math.random() * (max1 - min1) + min1);
      }

      if (document.querySelector('.flex-inner')) {
        document.querySelector('.flex-inner').remove();
      }

      const newArray = range(10);
      const newArray2 = newArray.map(() => {
        const indexer = getRandomInt(0, 244)
        return fromServer[indexer];
      });

      const reversed = newArray2.sort((org, compare) => sortFunction(org, compare, 'name'));

      const ol = document.createElement('ol');
      ol.className = 'flex-inner';
      $('form').prepend(ol);

      reversed.forEach((el, i) => {
        const li = document.createElement('li');
        $(li).append(`<label for=${el.code}>${el.name}</label>`);
        $(li).append(`<input type="checkbox" value=${el.code} id=${el.code} />`);
        $(ol).append(li);
      });

      console.log('fromServer', fromServer);
    })
    .catch((err) => console.log(err));
});