
// init tooltips
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })

// 0 = start, 1 = middle, 2 = end
let BLUEPRINT_BOOK_PLACEMENT = 0
let VERSION


$('#blueprintBookPlacement').change(() => {
    BLUEPRINT_BOOK_PLACEMENT = Number($('#blueprintBookPlacement').val())
})

$('#copyOutput').click(() => {
 // console.log()
    navigator.clipboard.writeText($('#outputText').val()).then(
        () => console.log("Clipboard copy success!"),
        (err) => console.error("Clipboard copy failure!", err),
    )
});


$('#createOutput').click(() => {
    let encodedBP = $("#inputStringArea").val()
    if (encodedBP == undefined || encodedBP.length == 0) 
    return
    
    VERSION = encodedBP.charAt(0)
    encodedBP = encodedBP.substring(1)
    // console.log(encodedBP)
    let uzip = pako.inflate(atob(encodedBP))
    console.log("uzip", uzip)

    let str = new TextDecoder("utf-8").decode(uzip)
    console.log("str", str)

    let bookJson = JSON.parse(str)



    // console.log(buildArrayDiff(uzip, enc))


    // let bookJson = JSON.parse(str)

    // let json = JSON.stringify(bookJson, null)
    // console.log("json", json)
    // console.log("zip", zip)
    // let newBPStr = btoa(zip)



    

    

    let initialBP = JSON.parse(str)
    console.log(initialBP)

    // console.log(VERSION + btoa(pako.deflate(JSON.stringify(BP), {level: 9})))

    // if (!BP.blueprint_book)

    let newBook = {}
    if (bookJson.blueprint_book) {
        newBook.blueprint_book = sortBlueprintBook(bookJson.blueprint_book)

        console.log(newBook)
        // let newBPjson =JSON.stringify(newBook))
        let json = JSON.stringify(newBook)
        // console.log("json", json)
        let enc =  new TextEncoder("utf-8").encode(json)
        // console.log("enc", enc)
        let zip = pako.deflate(json, {level: 9})
        // console.log("zip", zip)
        let newBPStr = Base64.encodeU(zip)
    
        // console.log(newBPStr)
        
        $('#outputText').val(VERSION + newBPStr)
        
    }
    // else 
     // console.log("NOT A BLUEPRINT BOOK!")


    
})

function buildArrayDiff(arr1, arr2){
    let newArray = []
    for (let i = 0; i < Math.max(arr1.length, arr2.length); i++)
        if (arr1[i] != arr2[i])
            newArray[i] = [arr1[i], arr2[i]]

    return newArray
}


function sortBlueprintBook(book){

    let books = [];
 // console.log("Current Book Blueprints:")
 // console.log(book.blueprints)
    for (let e of book.blueprints){
        if (e.blueprint_book){
         // console.log(e)
            books.push(e)
            switch(BLUEPRINT_BOOK_PLACEMENT){
                case 0:
                case 2:
                    book.blueprints = book.blueprints.filter((e) => !books.includes(e))
                    break;
            }        

        }        
    }
    
    get_label = (a) => {
        prop =  (a.blueprint) ? a.blueprint : 
                (a.blueprint_book) ? a.blueprint_book : 
                (a.upgrade_planner) ? a.upgrade_planner : 
                (a.deconstruction_planner) ? a.deconstruction_planner : a;
        // console.log(a)
        return prop != undefined ? 
                (prop.hasOwnProperty("label") ? prop.label : 
                prop.hasOwnProperty("version") ? `${prop.version}` : "") : "";
    }
    
    book.blueprints.sort((a, b) => {
        firstLabel  = get_label(a)
        secondLabel = get_label(b)
        return firstLabel.localeCompare(secondLabel, {numeric: true})
    })

        
    // console.log(book.blueprints)
    if (BLUEPRINT_BOOK_PLACEMENT == 0)
        books.sort((a, b) => {
            if (!b.blueprint_book.label) return 1
            if (!a.blueprint_book.label) return -1
            
            return b.blueprint_book.label.localeCompare(a.blueprint_book.label, {numeric: true})
        })
        else if (BLUEPRINT_BOOK_PLACEMENT == 2)
        books.sort((a, b) => {
            // console.log(a)
            // console.log(b)
            if (!b.blueprint_book.label) return 1
            if (!a.blueprint_book.label) return -1
            return a.blueprint_book.label.localeCompare(b.blueprint_book.label, {numeric: true})
        })
    for (let e of books){
        if (BLUEPRINT_BOOK_PLACEMENT == 0){
            book.blueprints.unshift(e)
        }
        else if (BLUEPRINT_BOOK_PLACEMENT == 2){
            book.blueprints.push(e)
        }
        e.blueprint_book = sortBlueprintBook(e.blueprint_book)
    }

    for (let i in book.blueprints){
        book.blueprints[i].index = i
        // let e = (book.blueprints[i].blueprint) ? 
        //     book.blueprints[i].blueprint : 
        //     book.blueprints[i].blueprint_book

     // console.log(e.label)
    }
    // console.log(book.blueprints)

    return book
}


// all of this was based on the notion that i had to remove
// the first byte from the b64 string, not remove the version byte at the
// start of the string (aka the 0)
// function getB64value(char){
//     let b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

//     console.log(b64.indexOf(char))
//     return b64.indexOf(char)
// }

// function getB64char(value){
//     let b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
//     console.log(b64.charAt(value))
//     return b64.charAt(value)

// }

// function getB64asBinary(value){
//     // let binarystring = 
//     return (getB64value(value)).toString(2).padStart(6, '0')
// }

// function getB64fromBinary(value){
    
//     if (value.length > 6) {
//         let string = ""
//         let debugString = ""
//         for (let i = 0; i < value.length; i += 6){
//             let portion = value.slice(i, Math.min(i + 6, value.length))
//             debugString += portion + " | "
//         }
//         console.log(debugString)
//         // for ()
//         for (let i = 0; i < value.length; i += 6){
//             let portion = value.slice(i, Math.min(i + 6, value.length))
//             console.log("Portion: " + portion)
//             string += getB64fromBinary(portion)
//         }
//         // console.log(string)
//         return string
//     }
    
//     else {
//         console.log("Converting 6-digit binary to int: " +getB64char(parseInt(value, 2)) )
//         return getB64char(parseInt(value, 2))
//     }
// }

// function getB64StringAsBinary(string){
//     let sum = ""
//     for (let i = 0; i < string.length; i++)
//         sum += getB64asBinary(string.charAt(i))

//     return sum
// }


// function getStringB64Value(string){
//     let sum = 0
//     for (let i = 0; i < string.length; i++)
//         sum += getB64value(string.charAt(i))

//     return sum
// }

// function getStringAsciiValue(string){
//     let sum = 0
//     for (let i = 0; i < string.length; i++)
//         sum += string.charCodeAt(i)

//     return sum
// }

// function stripBitsFromB64(b64, bitlength){
//     if (!bitlength || bitlength == NaN) throw "No bitlength specified!"
//     let binary = getB64StringAsBinary(b64)
//     binary = binary.substr(bitlength)

//     return getB64fromBinary(binary)        
// }

// function getBitsFromB64(b64, bitlength){
//     let binary = getB64StringAsBinary(b64)
//     return binary.substr(bitlength)
// }