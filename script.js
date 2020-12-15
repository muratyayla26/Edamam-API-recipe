const apiId = "USE YOUR API_ID";
const apiKey = "USE YOUR API_KEY";
const url = "https://api.edamam.com/search";

const searchValue = document.getElementById("searchValue");
const searchButton = document.getElementById("searchButton");
const recipiContainer = document.querySelectorAll(".recipiContainer");
const contentContainer = document.querySelector(".contentContainer");
const moreButton = document.getElementById("moreButton");
const displayWarning = document.querySelector(".displayWarning");
let recipeFrame = [];
let memberCounter = 0;

/* Fetching first 6 recipes */

const getRecipi = async () => {

    const inputValue = searchValue.value;

    const urlToFetch = url + "?q=" + inputValue + "&app_id=" +
    apiId + "&app_key=" + apiKey + "&from=0&to=6";

    try {
        const response = await fetch(urlToFetch);

        if(response.ok){
        const jsonResponse = await response.json();
        //console.log(jsonResponse);
            if(jsonResponse.hits.length >= 6) {
                return jsonResponse;
            }
            else {
                const displayNoResult = document.createElement("p");
                displayNoResult.append(document.createTextNode("No result found..."));
                contentContainer.style.display = "none";
                moreButton.style.display = "none";
                displayWarning.append(displayNoResult);
            }
        }
        throw new Error("Request failed!");

    } catch(error) {
        console.log(error);
    }

}

/* Rendering first 6 recipes to display */

const renderRecipi = (recipi) => {
    
    for ( let j = 0; j < recipeFrame.length  ; j++) {

        const recipiName = document.createElement("h3");
        recipiName.append(document.createTextNode(recipi.hits[j].recipe.label));
        const recipiCaution = document.createElement("h4");

        if ( recipi.hits[j].recipe.cautions[0] ) {
            recipiCaution.append(document.createTextNode("Caution: " + recipi.hits[j].recipe.cautions[0]));
        }
        else {
            recipiCaution.append(document.createTextNode("Caution: Nothing allergic"));
        }

        const recipiImage = document.createElement("img");
        recipiImage.src = recipi.hits[j].recipe.image;
       
        const recipiIngredientsList = document.createElement("ul");
        const recipiIngredientsHeader = document.createElement("h5");

        recipiIngredientsHeader.append(document.createTextNode("Ingredients"));
        const recipiIngredientListCloser = document.createElement("p");
        recipiIngredientListCloser.append(document.createTextNode("X"));
        recipiIngredientsList.append(recipiIngredientListCloser);

        for( let i = 0; i < recipi.hits[j].recipe.ingredientLines.length ; i++){
        const recipiIngredientsListItem = document.createElement("li");
        recipiIngredientsListItem.append(document.createTextNode(recipi.hits[j].recipe.ingredientLines[i]));
        recipiIngredientsList.append(recipiIngredientsListItem);
        }

        recipeFrame[j].append(recipiName, recipiImage, recipiCaution, 
        recipiIngredientsHeader,recipiIngredientsList);

        recipiIngredientsHeader.addEventListener("click", () => {
            recipiIngredientsList.style.display = "block";
        })
        
        recipiIngredientListCloser.addEventListener("click", () => {
            recipiIngredientsList.style.display = "";
        })
    }  
    
}

/* Display and search conditions */

const displayContent = (event) => {
   
    event.preventDefault();

    if (searchValue.value) {
        memberCounter = 0;
        displayWarning.innerHTML = "";
        
        if(recipeFrame[0]){
            
            for( let k = 0; k < recipeFrame.length; k++) {
                recipeFrame[k].innerHTML = "" ;
            }

            for( let m = 7; m <= recipeFrame.length; m++) {
            const deleteContainer = document.querySelector(".recipiContainer#recipeFrame" + m);
            deleteContainer.remove();
            }
        }

        const recipeFrames = ["recipeFrame1", "recipeFrame2", "recipeFrame3", "recipeFrame4", "recipeFrame5", "recipeFrame6"];
        recipeFrame = [];
        recipeFrames.forEach(item => recipeFrame.push(document.getElementById(item)));

        contentContainer.style.display = "";
        moreButton.style.display= "";
        getRecipi().then(responseRecipi => renderRecipi(responseRecipi));
    }
}

/* hiding container while page loading first */

const hideContainerFirst = () => {
    contentContainer.style.display = "none";
    moreButton.style.display= "none";
}

/* Fetching more recipes */

const getMoreRecipi = async () => {

    const inputValue = searchValue.value;
    let fromPoint = recipeFrame.length;
    let toPoint = fromPoint + 3;
    const moreFetchUrl = url + "?q=" + inputValue + "&app_id=" + apiId + "&app_key=" +
    apiKey + "&from=" + fromPoint + "&to=" + toPoint;

    try {
        const response = await fetch(moreFetchUrl);
        if(response.ok) {
            jsonResponse = await response.json();
            //console.log(jsonResponse);
            return jsonResponse;
        }
        else {
            throw new Error ("Request failed!");
        }

    } catch(error) {
        console.log(error);
    }
}

/* calling more recipes function*/

const displayMoreContent = () => {
    getMoreRecipi().then(responseMoreRecipi => renderMoreRecipi(responseMoreRecipi));
}

/* Rendering more recipes */

const renderMoreRecipi = (moreRecipi) => {

    if (recipeFrame.length < 18){

        let counter = 1;
        while(counter < 4) {

            const divHolder = document.createElement("div");
            divHolder.classList.add("recipiContainer");
            divHolder.id= "recipeFrame" + [(recipeFrame.length)+ 1];
            recipeFrame.push(divHolder);
            
            const recipiName = document.createElement("h3");
            recipiName.append(document.createTextNode(moreRecipi.hits[counter - 1].recipe.label));
            const recipiCaution = document.createElement("h4");

            if ( moreRecipi.hits[counter - 1].recipe.cautions[0] ) {
                recipiCaution.append(document.createTextNode("Caution:" + moreRecipi.hits[counter - 1].recipe.cautions[0]));
            }
            else {
                recipiCaution.append(document.createTextNode("Caution: Nothing allergic"));
            }

            const recipiImage = document.createElement("img");
            recipiImage.src = moreRecipi.hits[counter - 1].recipe.image;

            const recipiIngredientsHeader = document.createElement("h5");
            recipiIngredientsHeader.append(document.createTextNode("Ingredients"));
            const recipiIngredientsList = document.createElement("ul");

            const recipiIngredientListCloser = document.createElement("p");
            recipiIngredientListCloser.append(document.createTextNode("X"));
            recipiIngredientsList.append(recipiIngredientListCloser);
            
            for( let i = 0; i < moreRecipi.hits[counter - 1].recipe.ingredientLines.length ; i++){
            const recipiIngredientsListItem = document.createElement("li");
            recipiIngredientsListItem.append(document.createTextNode(moreRecipi.hits[counter - 1].recipe.ingredientLines[i]));
            recipiIngredientsList.append(recipiIngredientsListItem);
            }
           
            recipeFrame[recipeFrame.length-1].append(recipiName, recipiImage, recipiCaution, 
            recipiIngredientsHeader,recipiIngredientsList);

            recipiIngredientsHeader.addEventListener("click", () => {
                recipiIngredientsList.style.display = "block";
              
            })
            
            recipiIngredientListCloser.addEventListener("click", () => {
                recipiIngredientsList.style.display = "";
            })

            contentContainer.append(recipeFrame[recipeFrame.length-1]);
            counter ++;
        }
    }

    else {
        if( memberCounter === 0) {
        const exceedLimit = document.createElement("p");
        exceedLimit.append(document.createTextNode("Sign up for more recipes"));
        displayWarning.append(exceedLimit);
        memberCounter++;
        }
    }
}

/* main events listeners*/

searchButton.addEventListener("click", displayContent);

window.addEventListener("load", hideContainerFirst);

moreButton.addEventListener("click", displayMoreContent);