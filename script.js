let addbtnContainer = document.querySelector(".add-sheet_container");
let sheetList = document.querySelector(".sheet-list");
let firstSheet = document.querySelector(".sheet");
let Allcells = document.querySelectorAll(".grid .col");
let addressBar = document.querySelector(".address-box");
let leftBtn = document.querySelector(".left");
let rightBtn = document.querySelector(".right");
let centerBtn = document.querySelector(".center");
let fontSizeBtn = document.querySelector(".font-size");
let fontFamilyBtn = document.querySelector(".font-family");
let boldBtn = document.querySelector(".bold");
let ItalicBtn = document.querySelector(".Italic");
let underlineBtn = document.querySelector(".underline");
let textColorBtn = document.querySelector("#color");
let bgColorBtn = document.querySelector("#bg-color");
let allAlignBtns = document.querySelectorAll(".alignment-container>*");
let formulaInput = document.querySelector(".formula-box");
let gridContainer = document.querySelector(".grid_container");
let topLeftBlock = document.querySelector(".top-left-block");
let sheetDB = workSheetDB[0];
let selectedCell = ''

firstSheet.addEventListener("click", handleActiveSheet);

// create sheets and add functionalities
addbtnContainer.addEventListener("click", function(){
    let sheetsArr = document.querySelectorAll(".sheet");
    let lastSheetElem = sheetsArr[sheetsArr.length-1];
    let idx = lastSheetElem.getAttribute("sheetIdx");
    idx = Number(idx);
    let NewSheet = document.createElement("div");
    NewSheet.setAttribute("class", "sheet");
    NewSheet.setAttribute("sheetIdx", idx+1);
    NewSheet.innerText = `Sheet ${idx + 1}`;

    sheetList.appendChild(NewSheet);
    //  db
    // active set 
    sheetsArr.forEach(function (sheet) {
        sheet.classList.remove("active-sheet");
    })
    sheetsArr = document.querySelectorAll(".sheet");
    sheetsArr[sheetsArr.length - 1].classList.add("active-sheet");
    // 2 d array 
    initCurrentSheetDb();
    // /current change
    sheetDB = workSheetDB[idx];
    // cell empty 
    // new page element value empty
    initUI();
    NewSheet.addEventListener("click", handleActiveSheet);
})

function handleActiveSheet(e){
    let MySheet  = e.currentTarget;
    let sheetArr = document.querySelectorAll(".sheet");
    sheetArr.forEach(function(sheet){
        sheet.classList.remove("active-sheet");
    })
    if(!MySheet .classList[1]){
        MySheet .classList.add("active-sheet");
    }
    //  index
    let sheetIdx = MySheet.getAttribute("sheetIdx");
    sheetDB = workSheetDB[sheetIdx - 1];
    // get data from that and set ui
    setUI(sheetDB);
}
// *****************************************************
//  address set on click of a cell 

for(let i =  0; i < Allcells.length; i++){
    Allcells[i].addEventListener("click", function handleCell(e){
        let rid = Number(Allcells[i].getAttribute("rid"));
        let cid = Number(Allcells[i].getAttribute("cid"));
        let rowAdd = rid + 1;
        let colAdd = String.fromCharCode(cid + 65);
        let address = colAdd + rowAdd;
        addressBar.value = address;
        let cellObject = sheetDB[rid][cid];
        // styling-> set 
        // object styling set 
        // UI 
        // cell
        // boldness
        if(cellObject.bold == true){
            boldBtn.classList.add('active-btn');
        }
        else{
            boldBtn.classList.remove('active-btn');
        }

        //underline
        if(cellObject.underline == 'underline'){
            underlineBtn.classList.add('active-btn');
        }
        else{
            underlineBtn.classList.remove('active-btn');
        }

        //italic
        if(cellObject.italic == 'italic'){
            ItalicBtn.classList.add('active-btn');
        }
        else{
            ItalicBtn.classList.remove('active-btn');
        }

        //font-size
        let SizeOptions = fontSizeBtn.querySelectorAll('option');
        for(let i = 0; i < SizeOptions.length; i++){
            if(cellObject.fontSize == SizeOptions[i].getAttribute('value')){
                SizeOptions[i].selected = 'selected';
                break;
            }
        }
        
        //font-family
        let FamilyOptions = fontFamilyBtn.querySelectorAll('option');
        for(let i = 0; i < SizeOptions.length; i++){
            if(cellObject.fontFamily == FamilyOptions[i].getAttribute('value')){
                FamilyOptions[i].selected = 'selected';
                break;
            }
        }

        //align
        for (let i = 0; i < allAlignBtns.length; i++) {
            allAlignBtns[i].classList.remove("active-btn");
        }
        console.log(cellObject.halign);
        if (cellObject.halign == "left") {
            // left active
            leftBtn.classList.add("active-btn")
        } else if (cellObject.halign == "right") {
            rightBtn.classList.add("active-btn")
            // right active
        } else if (cellObject.halign == "center") {
            centerBtn.classList.add("active-btn")
        }


        //formula Bar
        if (cellObject.formula != "") {
            formulaInput.value = cellObject.formula;
        } else {
            formulaInput.value = "";
        }

    });
    Allcells[i].addEventListener("keydown", function (e) {
        let obj = Allcells[i].getBoundingClientRect();
        let height = obj.height;
        let address = addressBar.value;
        let { rid, cid } = getRIdCIdfromAddress(address);
        let leftCol = document.querySelectorAll(".left-col .left-col_box")[rid];
        leftCol.style.height = height + "px";
    });
}

gridContainer.addEventListener("scroll", function () {
    // console.log(e);
    let top = gridContainer.scrollTop;
    let left = gridContainer.scrollLeft;
    console.log(left);
    topLeftBlock.style.top = top + "px";
    topRow.style.top = top + "px";
    leftCol.style.left = left + "px";
    topLeftBlock.style.left = left + "px";
})
//initial cell click emulate
Allcells[0].click();

/***********************************Text align buttons ********************************/
leftBtn.addEventListener("click", function(){
    let address = addressBar.value;
    let {cid, rid} = getRidCidFromAddress(address);
    console.log(rid, cid);
    let cell = document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);
    cell.style.textAlign = "left";
    for (let i = 0; i < allAlignBtns.length; i++) {
        allAlignBtns[i].classList.remove("active-btn");
    }
    leftBtn.classList.add("active-btn");
    // db update 
    let cellObject = sheetDB[rid][cid];
    cellObject.halign = "left";
});

rightBtn.addEventListener("click", function(){
    let address = addressBar.value;
    let {cid, rid} = getRidCidFromAddress(address);
    console.log(rid, cid);
    let cell = document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);
    cell.style.textAlign = "right";
    for (let i = 0; i < allAlignBtns.length; i++) {
        allAlignBtns[i].classList.remove("active-btn");
    }
    rightBtn.classList.add("active-btn");
    // db update 
    let cellObject = sheetDB[rid][cid];
    cellObject.halign = "right";

});

centerBtn.addEventListener("click", function(){
    let address = addressBar.value;
    let {cid, rid} = getRidCidFromAddress(address);
    console.log(rid, cid);
    let cell = document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);
    cell.style.textAlign = "center";
    for (let i = 0; i < allAlignBtns.length; i++) {
        allAlignBtns[i].classList.remove("active-btn");
    }
    centerBtn.classList.add("active-btn");
    let cellObject = sheetDB[rid][cid];
    cellObject.halign = "center";
});


/* ******************************Formatiing************************************* */
fontSizeBtn.addEventListener("change", function(e){
    let address = addressBar.value;
    let {cid, rid} = getRidCidFromAddress(address);
    let cell = document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);
    cell.style.fontSize = e.target.value+"px";
    cellObject = sheetDB[rid][cid];
    cellObject.fontSize = e.target.value;
    
});

fontFamilyBtn.addEventListener("change", function(e){
    let address = addressBar.value;
    let {cid, rid} = getRidCidFromAddress(address);
    let cell = document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);
    cell.style.fontFamily = e.target.value;
    cellObject = sheetDB[rid][cid];
    cellObject.fontFamily = e.target.value;

});

boldBtn.addEventListener("click", function(e){
    let isActive = boldBtn.classList.contains("active-btn");
    let address = addressBar.value;
    let { rid, cid } = getRidCidFromAddress(address);
    let cell = document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);
    let cellObject = sheetDB[rid][cid];
    if (isActive == false) {
        // cell text bold
        cell.style.fontWeight = "bold";
        boldBtn.classList.add("active-btn");
        cellObject.bold = true
    } else {
        // cell text normal
        cell.style.fontWeight = "normal";
        boldBtn.classList.remove("active-btn");
        cellObject.bold = false
    }
});

underlineBtn.addEventListener("click", function(e){
    let isActive = underlineBtn.classList.contains("active-btn");
    let address = addressBar.value;
    let { rid, cid } = getRidCidFromAddress(address);
    let cell = document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);
    let cellObject = sheetDB[rid][cid];
    
    if (isActive == false) {
        // cell text bold
        cell.style.textDecoration = "underline";
        underlineBtn.classList.add("active-btn");
        cellObject.underline = 'underline';
    } else {
        // cell text normal
        cell.style.textDecoration = "none";
        underlineBtn.classList.remove("active-btn");
        cellObject.underline = 'none';
    }
});

ItalicBtn.addEventListener("click", function(e){
    let isActive = ItalicBtn.classList.contains("active-btn");
    let address = addressBar.value;
    let { rid, cid } = getRidCidFromAddress(address);
    let cell = document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);
    let cellObject = sheetDB[rid][cid];
    
    if (isActive == false) {
        // cell text bold
        cell.style.fontStyle = "italic";
        ItalicBtn.classList.add("active-btn");
        cellObject.italic = 'italic';
    } else {
        // cell text normal
        cell.style.fontStyle = "normal";
        ItalicBtn.classList.remove("active-btn");
        cellObject.italic = 'normal';
    }
});

textColorBtn.addEventListener("change", function(e){
    let address = addressBar.value;
    let {cid, rid} = getRidCidFromAddress(address);
    let cell = document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);
    cell.style.color = e.target.value;

});

bgColorBtn.addEventListener("change", function(e){
    let address = addressBar.value;
    let {cid, rid} = getRidCidFromAddress(address);
    let cell = document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);
    cell.style.backgroundColor = e.target.value;
});



// Helper function
function initUI() {
    for (let i = 0; i < Allcells.length; i++) {
        // boldness
        Allcells[i].style.fontWeight = "normal";
        Allcells[i].style.fontStyle = "normal";
        Allcells[i].style.textDecoration = "none";
        Allcells[i].style.fontFamily = "Arial";
        Allcells[i].style.fontSize = "16px";
        Allcells[i].style.textAlign = "left";
        Allcells[i].innerText = "";
    }
}
function setUI(sheetDB) {
    for (let i = 0; i < sheetDB.length; i++) {
        for (let j = 0; j < sheetDB[i].length; j++) {
            let cell = document.querySelector(`.col[rid="${i}"][cid="${j}"]`);
            let { bold, italic, underline, fontFamily, fontSize, halign, value } = sheetDB[i][j];
            cell.style.fontWeight = bold == true ? "bold" : "normal";
            cell.innerText = value;
        }
    }
}

// ********Formula code*******************
// cell blur
// "value"-> value
//  fomrula value-> manually value set  
for (let i = 0; i < Allcells.length; i++) {
    Allcells[i].addEventListener("blur", function handleCell() {
        let address = addressBar.value;
        let { rid, cid } = getRidCidFromAddress(address);
        let cellObject = sheetDB[rid][cid];
        let cell = document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);
//  formula -> 40, 40
        if (cellObject.value == cell.innerText) {
            return;
        }

        if (cellObject.formula) {
            removeFormula(cellObject, address);
        }
        cellObject.value = cell.innerText;
        // depend update 
        changeChildrens(cellObject);
    });
}

// formula bar enter
// value -> formula set
// old formula -> new formula  
formulaInput.addEventListener("keydown", function (e) {

    if (e.key == "Enter" && formulaInput.value != "") {
        let Newformula = formulaInput.value;
        // cellObject formula
        let address = addressBar.value;
        // getCurrentCell
        let { rid, cid } = getRidCidFromAddress(address);
        let cellObject = sheetDB[rid][cid];
        let prevFormula = cellObject.formula;
        if (prevFormula == Newformula) {
            return;
        }
        if (prevFormula != "" && prevFormula != Newformula) {
            removeFormula(cellObject, address);
        }
        let evaluatedValue = evaluateFormula(Newformula);
        // alert(value);
        //    UI change
        setUIByFormula(evaluatedValue, rid, cid);
        // db -> works
        setFormula(evaluatedValue, Newformula, rid, cid, address);
        changeChildrens(cellObject);
    }
})

function evaluateFormula(formula) {
    // "( A1 + A2 )"
    let formulaTokens = formula.split(" ");
    // split
    // [(, A1, +, A2,)]
    for (let i = 0; i < formulaTokens.length; i++) {
        let firstCharOfToken = formulaTokens[i].charCodeAt(0);
        if (firstCharOfToken >= 65 && firstCharOfToken <= 90) {
            // console.log(formulaTokens[i]);
            // A1
            let { rid, cid } = getRidCidFromAddress(formulaTokens[i]);
            let cellObject = sheetDB[rid][cid];
            //  getting value from  db
            let { value } = cellObject;
            formula = formula.replace(formulaTokens[i], value);
        }
    }
    // infix evaluation
    let ans = eval(formula);
    return ans;
    // eval
    // ( 10 + 20 )
}
function setUIByFormula(value, rid, cid) {
    document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`).innerText = value;
    //  parent add yourself as a
}
function setFormula(value, formula, rid, cid, address) {
    let cellObject = sheetDB[rid][cid];
    cellObject.value = value;
    cellObject.formula = formula;
    let formulaTokens = formula.split(" ");
    for (let i = 0; i < formulaTokens.length; i++) {
        let firstCharOfToken = formulaTokens[i].charCodeAt(0);
        if (firstCharOfToken >= 65 && firstCharOfToken <= 90) {
            // console.log(formulaTokens[i]);
            let parentRIdCid = getRidCidFromAddress(formulaTokens[i]);
            let cellObject = sheetDB[parentRIdCid.rid][parentRIdCid.cid];
            //  getting value from  db
            cellObject.children.push(address)
        }
    }
}
function changeChildrens(cellObject) {
    let childrens = cellObject.children;
    for (let i = 0; i < childrens.length; i++) {
        let chAddress = childrens[i];
        let chRICIObj = getRidCidFromAddress(chAddress);
        let chObj = sheetDB[chRICIObj.rid][chRICIObj.cid];
        let formula = chObj.formula;
        let evaluatedValue = evaluateFormula(formula);
        setUIByFormula(evaluatedValue, chRICIObj.rid, chRICIObj.cid);
        chObj.value = evaluatedValue;
        changeChildrens(chObj);
    }

}
// remove yourself from parent;s children array
function removeFormula(cellObject, address) {
    // (A1)
    let formula = cellObject.formula;
    let formulaTokens = formula.split(" ");
    for (let i = 0; i < formulaTokens.length; i++) {
        let firstCharOfToken = formulaTokens[i].charCodeAt(0);
        if (firstCharOfToken >= 65 && firstCharOfToken <= 90) {
            // console.log(formulaTokens[i]);
            let parentRIdCid = getRidCidFromAddress(formulaTokens[i]);
            let parentCellObject = sheetDB[parentRIdCid.rid][parentRIdCid.cid];
            //  getting value from  db
            let childrens = parentCellObject.children;
            let idx = childrens.indexOf(address);
            childrens.splice(idx, 1);
        }
    }
    cellObject.formula = "";

}

//*****************************************Helper Function***************************************
function getRidCidFromAddress(address){
    let cellColAdr = address.charCodeAt(0);
    let cellRowAdr = address.slice(1);
    let cid = cellColAdr - 65;
    let rid = Number(cellRowAdr) - 1;
    return {cid, rid};
}