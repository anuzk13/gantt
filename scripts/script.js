google.charts.load('current', {'packages':['gantt']});
google.charts.setOnLoadCallback(drawGID);

function toMilliseconds(minutes) {
  return minutes * 60 * 1000;
}

function drawChart(data) {

  var otherData = new google.visualization.DataTable();
  otherData.addColumn('string', 'Task ID');
  otherData.addColumn('string', 'Task Name');
  otherData.addColumn('string', 'Resource');
  otherData.addColumn('date', 'Start');
  otherData.addColumn('date', 'End');
  otherData.addColumn('number', 'Duration');
  otherData.addColumn('number', 'Percent Complete');
  otherData.addColumn('string', 'Dependencies');

  otherData.addRows([
    ['toTrain', 'Walk to train stop', 'walk', null, null, toMilliseconds(5), 100, null],
    ['music', 'Listen to music', 'music', null, null, toMilliseconds(70), 100, null],
    ['wait', 'Wait for train', 'wait', null, null, toMilliseconds(10), 100, 'toTrain'],
    ['train', 'Train ride', 'train', null, null, toMilliseconds(45), 75, 'wait'],
    ['toWork', 'Walk to work', 'walk', null, null, toMilliseconds(10), 0, 'train'],
    ['work', 'Sit down at desk', null, null, null, toMilliseconds(2), 0, 'toWork'],
  ]);

  var options = {
    height: 2000,
    width: 4200,
    gantt: {
      defaultStartDateMillis: new Date(2015, 3, 28),
      labelStyle: {
        fontName: 'Arial',
        fontSize: 16,
        },
        labelMaxWidth: 1100,
        criticalPathEnabled: false, // Critical path arrows will be the same as other arrows.
        arrow: {
            angle: 100,
            width: 5,
            color: 'blue',
            radius: 0
        }
    }
  };

  var chart = new google.visualization.Gantt(document.getElementById('chart_div'));
  google.visualization.events.addListener(chart, 'ready', function () {
        chart_div.innerHTML = '<img src="' + chart.getImageURI() + '">';
        console.log(chart_div.innerHTML);
      });

  chart.draw(data, options);
}

function drawGID() {
  var queryString = encodeURIComponent('SELECT A, B, C, D, E, F, G, H');

  var query = new google.visualization.Query(
      'https://docs.google.com/spreadsheets/d/1glZdhRuIK_BR9GDv2vtH1Gez6bqPfKtOAOt52ND_9DI/gviz/tq?gid=0&headers=1&tq=' + queryString);
  query.send(handleQueryResponse);
}

function handleQueryResponse(response) {
  if (response.isError()) {
    alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }

  var data = response.getDataTable();
  console.log(data)
  drawChart(data)
}
