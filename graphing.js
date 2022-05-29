function drawChart(tableId, oldData, newData) {
    ctx = document.getElementById(tableId)
    realXPoints = []
    realPoints = []
    for (let i = 0; i < oldData.length; i++) {
        realXPoints.push(oldData[i][0])
        realPoints.push(oldData[i][1])
    }

    regressionPoints = []
    for (let i = 0; i < newData.length; i++) {
        if(newData[i][1] < 0) {
            regressionPoints.push(0)
        } else {
            regressionPoints.push(newData[i][1])
        }

    }


    console.log(realPoints)
    console.log(regressionPoints)



    if(realPoints[realPoints.length-1] >= regressionPoints[regressionPoints.length-1]) {
        color = "green"
    } else {
        color = "red";
    }

    //console.log(color)

    data = {
        labels: realXPoints,
        datasets: [
            {
                label: 'Regression',
                data: regressionPoints,
                backgroundColor: 'blue',
                type: 'line',
                stack: 'combined'
            },
            {
                label: "Historical Points",
                data: realPoints,
                backgroundColor: color,
                type: "scatter",
                stack: "combined"
            }
        ]
    }

    config = {
        type: "line",

        data: data,
        options: {
            scales: {
                x : {
                    "type" : 'linear',
                    position: "bottom"
                }
            }
        }
    }

    myChart = new Chart(
        ctx, config
    )
}