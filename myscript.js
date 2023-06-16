const displayPassword = document.querySelector("[data-passwordDisplay]");

const displayLength = document.querySelector("[data-LengthNumber]");
const slider = document.querySelector("[data-lengthSlider]");

const checkUppercase = document.getElementById("uppercase");
const checkLowercase = document.getElementById("lowercase");
const checkNumbers = document.getElementById("numbers");
const checkSymbols = document.getElementById("symbols");
const allCheckBoxes = document.querySelectorAll("input[type = checkbox]");
const generateBtn = document.querySelector(".generateButton");

const indicator = document.querySelector(".indicator");

const copyMsg = document.querySelector("[data-copyMsg]");
const copyBtn = document.querySelector("[data-copy]");

let password = "";
let passwordLength = 10;
let checkCount = 0;
const symbols = `!@#$%^&*(){}[];/><.,`;

handleSlider();
setIndicator("#fff");

function handleSlider(){
    displayLength.innerHTML = passwordLength;
    slider.value = passwordLength;
}

//updating passwordlength whenever slider is moved
slider.addEventListener('input', (event) => {
    const val = event.target.value;
    passwordLength = val;
    //when passwordLength is updated call handleSlider
    if(passwordLength < checkCount){
        passwordLength = checkCount;
    }
    handleSlider();
})

function handleCheckCount(){
    checkCount = 0;
    
    allCheckBoxes.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
            // console.log(checkCount);
        }
    })
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}


function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `1px 2px 20px 1px ${color}`;
}

function calcStrength(){
    let isUpper = false;
    let isLower = false;
    let isNum = false;
    let isSymbol = false;

    if(checkUppercase.checked) isUpper = true;
    if(checkLowercase.checked) isLower = true;
    if(checkNumbers.checked) isNum = true;
    if(checkSymbols.checked) isSymbol = true;

    if((isUpper || isLower) && isNum && isSymbol && passwordLength >= 8){
        setIndicator("green");
    }

    else if((isUpper || isLower) && (isNum || isSymbol) && passwordLength >= 6){
        setIndicator("yellow");
    }
    else{
        setIndicator("red");
    }
}

function shufflePassword(array){
    for(let i = array.length-1; i > 0; i--){
        let randomIndex = generateRnd(0, array.length-1);

        let temp = array[i];
        array[i] = array[randomIndex];
        array[randomIndex] = temp;
    }
    //to return a string
    let src = "";
    array.forEach((e) => src+= e);
    return src;
}

async function copyToClipboard(){
    try{
        await navigator.clipboard.writeText(displayPassword.value);
        copyMsg.innerHTML = "copied";
    }catch(e){
        copyMsg.innerHTML = "failed";
    }

    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

copyBtn.addEventListener('click', copyToClipboard);

allCheckBoxes.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckCount);
});


function generateRnd(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateUpperrcase(){
    //generated a random no in the ascii range of uppercase letters 
    //and converted it to an uppercase letter using fromCharCode() function
    return String.fromCharCode(generateRnd(65, 91));
}

function generateLowercase(){
    return String.fromCharCode(generateRnd(97, 122))
}

function generateNumbers(){
    return generateRnd(0, 9);
}

function generateSymbols(){
    let rndIndex = generateRnd(0, symbols.length-1);
    return symbols[rndIndex];
}

function generatePassword(){
    if(checkCount <= 0) return;

    //make the password is empty
    password = "";

    //an array of functions used in passed
    //for further use
    let funcArr = [];
    if(checkUppercase.checked){
        funcArr.push(generateUpperrcase);
    }

    if(checkLowercase.checked){
        funcArr.push(generateLowercase);
    }

    if(checkNumbers.checked){
        funcArr.push(generateNumbers);
    }

    if(checkSymbols.checked){
        funcArr.push(generateSymbols);
    }

    //addition of compulsory characters in password
    for(let i = 0; i < funcArr.length; i++){
        password += funcArr[i]();
    }

    //remaining addition
    for(let i = 0;  i < passwordLength-funcArr.length; i++){
        let index = generateRnd(0, funcArr.length);
        // console.log(index);
        password += funcArr[index]();
    }
    password = shufflePassword(Array.from(password));
    displayPassword.value = password;
    calcStrength();
}

generateBtn.addEventListener('click',generatePassword);