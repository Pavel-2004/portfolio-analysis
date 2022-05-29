function drawInfoContainer(name, qty, marketValueNative, marketValueAcb, predictedValue, canvasId) {
    console.log(canvasId)
    totalContainer = document.createElement("div")
    totalContainer.classList.add("col-4")

    titleRow = document.createElement("div")
    titleRow.classList.add("row")
    titleRow.classList.add("justify-content-center")
    totalContainer.append(titleRow)


    titleCol = document.createElement("div")
    titleCol.classList.add("col-12")
    titleRow.append(titleCol)

    h3 = document.createElement("h3")
    h3.classList.add("text-center")
    h3.innerText = name
    titleCol.append(h3)

    otherInfoRow = document.createElement("div")
    otherInfoRow.classList.add("row")
    otherInfoRow.classList.add("justify-content-center")
    totalContainer.append(otherInfoRow)

    otherInfoCol = document.createElement("div")
    otherInfoCol.classList.add("col-12")
    otherInfoRow.append(otherInfoCol)

    qtyP = document.createElement("p")
    qtyP.innerText = "QTY: " + qty
    otherInfoCol.append(qtyP)


    pPredictedValues = document.createElement("p")
    pPredictedValues.innerText = "Next Closing Price Prediction: " + predictedValue
    otherInfoCol.append(pPredictedValues)

    marketValueNativeP = document.createElement("p")
    marketValueNativeP.innerText = "NATIVE MARKET VALUE:" + marketValueNative
    otherInfoCol.append(marketValueNativeP)

    marketValueAcbP = document.createElement("p")
    marketValueAcbP.innerText = "CURRENT MARKET VALUE:" + marketValueAcb
    otherInfoCol.append(marketValueAcbP)

    precentage = ((marketValueAcb - marketValueNative) / marketValueNative) * 100
    if(precentage >= 0) {
        color = "green"
        iconCode = "^"
    } else {
        color = "red"
        iconCode = "˅"
    }

    precentageP = document.createElement("p")
    precentageP.innerText = "%: "
    otherInfoCol.append(precentageP)





    pSpan = document.createElement("span")
    precentageP.append(pSpan)


    precentageValue = document.createElement("p")
    precentageValue.innerText = iconCode + " " + (Math.abs(precentage)).toFixed(2)+ "%"
    precentageValue.style.color = color
    precentageP.append(precentageValue)


    canvasRow = document.createElement("div")
    canvasRow.classList.add("row")
    canvasRow.classList.add("justify-content-center")
    totalContainer.append(canvasRow)


    canvasCol = document.createElement("div")
    canvasCol.classList.add("col-12")
    canvasRow.append(canvasCol)


    canvas = document.createElement("canvas")
    canvas.style.width = "100%"
    canvas.style.height = "30vh"
    canvas.id = canvasId
    canvasCol.append(canvas)


    return totalContainer
}