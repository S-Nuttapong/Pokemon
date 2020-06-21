
document.querySelector('#upload').addEventListener('click', function (e) {
    if (document.querySelector('#submit-image')) {
        // checking file if its store old data we need to clear it
        // let file = document.querySelector('#submit-image').files
        // console.log(`submit-image button's file: ${file}`)
        if (document.querySelector('#submit-image').files) {
            document.querySelector('#submit-image').value = ""  // clearing old files if they exist
        }
        console.log('firing click event')
        document.querySelector('#submit-image').click();
    }

    e.preventDefault()
}, false);

let droparea = document.getElementById('upload');
['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
    droparea.addEventListener(eventName, preventDefaults, false)
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
};

//drag it inside droparea
['dragenter', 'dragover'].forEach((eventName) => {
    droparea.addEventListener(eventName, highlight, false)
});

// if we drop image or drag image outside droparea
['dragleave', 'drop'].forEach((eventName) => {
    droparea.addEventListener(eventName, unhighlight, false)
});

//when drop event takes place do the action (function(e)) where e is event
droparea.addEventListener('drop', function (e) {
    let dt = e.dataTransfer
    let fileArray = Array.from(dt.files)

    console.log('from draganddrop:')
    console.log(fileArray)

    fileArray.forEach((fileArray) => previewFile(fileArray))
});

document.querySelector('#go-back').addEventListener('click', function () {
    switchcard(0);
});

document.querySelector('#detect-image').addEventListener('click', function () {
    // for making post to image classification endpoint {
    const img = document.querySelector('.display-image').getAttribute('src');
    const url = 'http://127.0.0.1:5000/predict';
    // console.log(img);
    console.log(`making request to ${url}`)
    Postrequest(img, url);

    switchcard(2)

});

//Go back, to make new predction
document.querySelector('#go-back-2').addEventListener('click', function() {
    document.querySelector('#stat-table').innerHTML = '';
    switchcard(0);
});

//<---------------------------------------------------- WRITE FUNCTIONS REQUIRED BELOW -------------------------------------------------->

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
};


function highlight(e) {
    droparea.classList.add('highlight')
};

function unhighlight(e) {
    droparea.classList.remove('highlight')
};



//onchange (when image is submit)
function Preprocess(files) {
    console.log(`caught change from submit button: files: ${files}`);
    let fileArray = Array.from(files)
    console.log(`converting to FileArray: ${fileArray}`);
    //iterate through array like for i in list 
    //can also express as enumerate if we return index
    fileArray.forEach((fileArray) => previewFile(fileArray))
}

function previewFile(file) {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function () {
        //push uploaded image to src
        let img = document.querySelector('.display-image')
        img.src = reader.result  //<img src='source from file' , reader.result --> encode file to base64
        switchcard(1)

    }
}

function switchcard(cardNo) {
    const containers = ['#upload', '.card2', '.card3', '.card5'] //index: 0, 1, 2, 3
    // console.log(`target card to be switched: ${containers[cardNo]}`)
    // containers.forEach((containers) => (container == containers[cardNo]) ? document.querySelector(container).style.display = "block" : document.querySelector(container).style.display = "none";
    containers.forEach((container) => {
        if (container == containers[cardNo]) {
            console.log(`set ${containers[cardNo]} display to block`)
            document.querySelector(container).style.display = "block"; //set which cards to be visible
        }
        else {
            document.querySelector(container).style.display = "none"; //set which cards to be invisible

        }
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function display_result(items) {
    let element = document.querySelector('#stat-table')
    let html = ''

    items.forEach(item => {
        let category = item[0]
        let percent = Math.round(item[1] * 100)

        html +=    `<div class="card">
                        <div class="card-body d-xl-flex align-items-xl-end" style="padding: 0px;padding-top: 20px;padding-bottom: 20px;padding-right: 6%;"><img class="mx-auto" src="assets/img/stat-image/` + category +`.jpg" style="width: 55%;margin: 0px 56.125px 0px 56.125px;" />
                            <div style="color: #212529;width: 30%;height: 240px;"><span style="font-size: 35px;">` + category + `</span><span class="d-xl-flex justify-content-xl-start align-items-xl-start" style="font-size: 20px;margin-top: 41%;margin-left: 1%;">Confident</span>
                                <div class="progress d-xl-flex" style="width: 100%;height: 25%;font-size: 20px;margin: 0px;margin-top: 0;">
                                    <div class="progress-bar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: 50%;">` + percent + `%</div>
                                </div>
                            </div>
                        </div>
                    </div>`;
    })
    if (element) {
        console.log(`injecting DOM to: ${element}`)
        element.insertAdjacentHTML('beforeend', html)
    }
    switchcard(3)
}

function Postrequest(img, url) {

    console.log('making request')
    const formdata = new FormData();
    formdata.append('image', img) //formdata = object --> contains (key, value)
    fetch(url, {
        method: 'POST',
        body: formdata,
        // mode: 'no-cors',

    }).then(function (response) {
        let json_respone = response.json()
        return json_respone
    }).then(function (json) {
        console.log('GET response as JSON:');
        console.log(json); // Here’s our JSON object
        // Object.keys(json).forEach(key => {
        //     console.log(`${key}: ${json[key]}`)
        // })

        let items = Object.keys(json).map(key => [key, json[key]])  //--> equivalent to // let items = Object.keys(json).map(function(key) {
        //     return [key, json[key]];
        // })
        items.sort((first, second) => second[1] - first[1])

        items.forEach(item => {
            console.log(`${item[0]}: ${item[1]}`);
        })

        display_result(items)

        // sleep(3000).then(() => switchcard(0))
    });
}
