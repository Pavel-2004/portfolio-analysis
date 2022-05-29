


const API_KEY = "625b5df8a34626.35549490"
const SYSTEM_TO_API_FORMAT = {"TSX":"TO", "TSXV":"V", "CSE":"CN", "US":"US", "NEO": "NEO"}
var portfolio = []

function convertSystemToAPIFormat(exchange){
    if(exchange){
        return SYSTEM_TO_API_FORMAT[exchange]
    } else {
        return "US"
    }
}

function findLogRegression(data, options){
    var sum = [0, 0, 0, 0], n = 0, results = [];

    for (len = data.length; n < len; n++) {
        if (data[n][1] != null) {
            sum[0] += Math.log(data[n][0]);
            sum[1] += data[n][1] * Math.log(data[n][0]);
            sum[2] += data[n][1];
            sum[3] += Math.pow(Math.log(data[n][0]), 2);
        }
    }

    var B = (n * sum[1] - sum[2] * sum[0]) / (n * sum[3] - sum[0] * sum[0]);
    var A = (sum[2] - B * sum[0]) / n;

    for (var i = 0, len = data.length; i < len; i++) {
        var coordinate = [data[i][0], A + B * Math.log(data[i][0])];
        results.push(coordinate);
    }

    var string = 'y = ' + Math.round(A*100) / 100 + ' + ' + Math.round(B*100) / 100 + ' ln(x)';

    return {equation: [A, B], points: results, string: string, originalPoints: data};
}

function csvToArray(text, options) {
    rows = text.split('\n')
    final = []
    for (let i = 0; i < rows.length; i++) {
        row = rows[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        final.push(row)
    }
    return final
}


function round(number, precision) {
    const factor = 10 ** precision;
    return Math.round(number * factor) / factor;
}


function processSelect(types, result) {

    document.getElementById("allTypes").style.display = "flex"
    document.getElementById("typeSelect").innerHTML = `<option>Please Select A Column</option>`
    for (let i = 0; i < types.length; i++) {
        option = document.createElement("option")
        option.value = i
        option.innerText = types[i]
        document.getElementById("typeSelect").append(option)
    }
    document.getElementById("amountSelect").innerHTML = `<option>Please Select Column With Amount</option>`
    for (let i = 0; i < types.length; i++) {
        option = document.createElement("option")
        option.value = i
        option.innerText = types[i]
        document.getElementById("amountSelect").append(option)
    }
    document.getElementById("totalSelect").innerHTML = `<option>Please Select The Total Value Column</option>`
    for (let i = 0; i < types.length; i++) {
        option = document.createElement("option")
        option.value = i
        option.innerText = types[i]
        document.getElementById("totalSelect").append(option)
    }
    document.getElementById("exchangeCol").innerHTML = `<option>Please Select Column With Exchange</option>`
    for (let i = 0; i < types.length; i++) {
        option = document.createElement("option")
        option.value = i
        option.innerText = types[i]
        document.getElementById("exchangeCol").append(option)
    }
    document.getElementById("teType").innerHTML = `<option>Please Select The TE type Column</option>`
    for (let i = 0; i < types.length; i++) {
        option = document.createElement("option")
        option.value = i
        option.innerText = types[i]
        document.getElementById("teType").append(option)
    }
}

function getInfo() {

}

function filterQutes(word) {
    return word.replaceAll("\"", "")
}

function getCurrentTotal(exchange, symbol, unitsNum) {
    $.ajax({
        url: "https://eodhistoricaldata.com/api/eod/" + symbol + "." + exchange + "?api_token=" + API_KEY + "&fmt=json",
        type: "get",
        async: false,
        success: function (res) {
            lastRow = res[res.length - 1]
            closePrice = lastRow["close"]

            currentTotal = [closePrice * unitsNum, closePrice]
        }
    })
    return currentTotal
}


function getHistoricalClosingPrices(symbol, exchange) {

    final = []
    dayCounter = 1
    $.ajax({
        url:"https://eodhistoricaldata.com/api/eod/" + symbol + "." + exchange + "?api_token=" + API_KEY + "&fmt=json",
        type: "get",
        async: false,
        success: function (res) {

            for (let i = 0; i < res.length; i++) {
                closePrice = res[i]["close"]
                final.push([dayCounter, closePrice])
                dayCounter++;
            }
        }
    })
    return final
}

function getLogarithmicRegression(stock, exchange) {
    data = getHistoricalClosingPrices(stock, exchange)

    return findLogRegression(data, {precision: 3})
}


function getPredictedValues(regressionPoints, equation) {
    final = []
    for (let i = regressionPoints[regressionPoints.length - 1][0]; i < regressionPoints[regressionPoints.length - 1][0] + 1; i++) {
        final.push((equation[0]+equation[1] * Math.log(i)).toFixed(2))

    }
    return final
}

function typeSelect() {
    //document.getElementById("amountSelect").value != "Please Select Column With Amount" && document.getElementById("typeSelect").value != "Please Select A Column" && document.getElementById("totalSelect").value != "Please Select The Total Value Column"  && document.getElementById("teType").value != "Please Select The TE type Column" && document.getElementById("exchangeCol").value != "Please Select Column With Exchange"
    if(true) {
        /*
        amountCol = parseInt(document.getElementById("amountSelect").value)
        symbolCol = parseInt(document.getElementById("typeSelect").value)
        totalCol = parseInt(document.getElementById("totalSelect").value)
        teTypeCol = parseInt(document.getElementById("teType").value)
        exchangeCol = parseInt(document.getElementById("exchangeCol").value)
         */

        amountCol = 8
        symbolCol = 3
        totalCol = 10
        teTypeCol = 6
        exchangeCol = 4
        document.getElementById("submitRow").style.display = "none"
        document.getElementById("allTypes").style.display = "none"
        final = []
        chartCounter = 0
        document.getElementById("graph").style.display = "flex"


        allSymbols = {}


        for (let i = 0; i < portfolio.length; i++) {
            if(filterQutes(portfolio[i][symbolCol]) != "" && filterQutes(portfolio[i][teTypeCol]) == "BUY") {
                temp = {}
                temp["symbol"] = filterQutes(portfolio[i][symbolCol])
                temp["amount"] = filterQutes(portfolio[i][amountCol])
                temp["exchange"] = filterQutes(portfolio[i][exchangeCol])
                temp["lastTotal"] = parseInt(filterQutes(portfolio[i][totalCol]))
                temp["currentTotal"] = getCurrentTotal(convertSystemToAPIFormat(temp["exchange"]), temp["symbol"], temp["amount"])
                resultRegression = getLogarithmicRegression(temp["symbol"], convertSystemToAPIFormat(temp["exchange"]))
                aRegression = resultRegression.equation[0]
                bRegression = resultRegression.equation[1]
                predictedValues = getPredictedValues(resultRegression.points, resultRegression.equation)

                temp["regressionPoints"] = resultRegression.points
                temp["originalPoints"] = resultRegression.originalPoints
                document.getElementById("graph").append(drawInfoContainer(temp["symbol"], temp["amount"], temp["lastTotal"], (temp["currentTotal"][0]).toFixed(), predictedValues, "graph" + chartCounter))
                drawChart("graph"+chartCounter, temp["originalPoints"], temp["regressionPoints"])
                chartCounter++
                final.push(temp)
            }
        }

    }



    //console.log(findLogRegression([[1,1], [2,2], [3,3]], {precision: 3}))
}