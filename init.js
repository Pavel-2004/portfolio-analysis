
const input = document.getElementById("csv")
input.addEventListener('change', function(e){
    //this is temporary until more types are added

    const reader = new FileReader()


    reader.onload = function (){
        result = initAll(reader.result)

        if(result){
            //successful case
        } else{
            //error occurred
        }
    }
    reader.readAsText(input.files[0])
})