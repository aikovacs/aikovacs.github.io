function convertRestaurantsToCategories(restaurantList) {
  // process your restaurants here!
  console.table(restaurantList);
  const list = restaurantList.reduce((collection, item, i) => {
    const findCategory = collection.find((findItem) => findItem.label === item.category);
    if (!findCategory) {
      collection.push({
        label: item.category,
        y: 1
      });
    } else {
      const position = collection.findIndex(el => el.label === item.category);
      // eslint-disable-next-line no-param-reassign
      collection[position].y += 1;
    }
    return collection;
  }, []);
  return list;
}

function makeYourOptionsObject(datapointsFromRestaurantsList) {
  // set your chart configuration here!
  CanvasJS.addColorSet('customColorSet1', [
    '#F2E088',
    '#F2D0A7',
    '#A67C58',
    '#592222',
    '#F26B6B'
  ]);

  return {
    animationEnabled: true,
    colorSet: 'customColorSet1',
    title: {
      text: 'Places to eat out in future'
    },
    axisX: {
      interval: 1,
      labelFontSize: 12
    },
    axisY2: {
      interlacedColor: 'rgba(1,77,101,.2)',
      gridColor: 'rgba(1,77,101,.1)',
      title: 'Restaurants By Category',
      labelFontSize: 12,
      scaleBreaks: {customBreaks: [{
        startValue: 40,
        endValue: 50,
        color: 'orange',
        type: 'zigzag'
      },
      {
        startValue: 85,
        endValue: 100,
        color: 'orange',
        type: 'zigzag'
      },
      {
        startValue: 140,
        endValue: 175,
        color: 'orange',
        type: 'zigzag'
      }]}
    },
    data: [{
      type: 'bar',
      name: 'restaurants',
      axisYType: 'secondary',
      dataPoints: datapointsFromRestaurantsList
    }]
  };
}

function runThisWithResultsFromServer(jsonFromServer) {
  console.log('jsonFromServer', jsonFromServer);
  sessionStorage.setItem('restaurantList', JSON.stringify(jsonFromServer)); // don't mess with this, we need it to provide unit testing support
  // Process your restaurants list
  // Make a configuration object for your chart
  // Instantiate your chart
  const reorganizedData = convertRestaurantsToCategories(jsonFromServer);
  const options = makeYourOptionsObject(reorganizedData);
  const chart = new CanvasJS.Chart('chartContainer', options);
  chart.render();
}

// Leave lines 52-67 alone; do your work in the functions above
document.body.addEventListener('submit', async (e) => {
  e.preventDefault(); // this stops whatever the browser wanted to do itself.
  const form = $(e.target).serializeArray();
  fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form)
  })
    .then((fromServer) => fromServer.json())
    .then((jsonFromServer) => runThisWithResultsFromServer(jsonFromServer))
    .catch((err) => {
      console.log(err);
    });
});