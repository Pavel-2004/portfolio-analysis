function initAll(result) {
    arrayResult = csvToArray(result)
    document.getElementById("submitRow").style.display = "none"
    types = arrayResult[0]
    //processSelect(types, arrayResult)
    for (let i = 1; i < arrayResult.length; i++) {
        portfolio.push(arrayResult[i])
    }
    typeSelect()
}

