
// Function For Custom Fetch with timeout
function fetch_custom(url, options, timeout = 5000) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), timeout)
        )
    ]);
}

const BASE_URL = 'https://webappdemo.casaaltair.com'



// To Make Menu Scrollable
const menu = document.querySelector('.sub__heading ul');
let isDown = false;
let startX;
let scrollLeft;
menu.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - menu.offsetLeft;
    scrollLeft = menu.scrollLeft;
});
menu.addEventListener('mouseleave', () => {
    isDown = false;
});
menu.addEventListener('mouseup', () => {
    isDown = false;
});
menu.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - menu.offsetLeft;
    const walk = (x - startX) * 1; //scroll-fast
    menu.scrollLeft = scrollLeft - walk;
});


// fetch_custom Initial Data From Server
const allappliances = document.querySelector('.all__appliances');
let jsondata;
async function getInitialData() {

    let url = BASE_URL + '/control'
    try {
        let rawdata = await fetch_custom(url)
        if (rawdata.status !== 200) {
            alert("Communication Error");
            return;
        }
        jsondata = await rawdata.json()

        // Converting 1st letter Capital Of Room Names 
        for (var i = 0; i < jsondata["Room Name"].length; i++) {
            jsondata["Room Name"][i].room_name = jsondata["Room Name"][i].room_name.charAt(0).toUpperCase() + jsondata["Room Name"][i].room_name.substr(1);
        }
        // Converting 1st letter Capital Of Appliances
        for (var i = 0; i < jsondata["Appliance Data"].length; i++) {
            jsondata["Appliance Data"][i].appliance_id = jsondata["Appliance Data"][i].appliance_id.charAt(0).toUpperCase() + jsondata["Appliance Data"][i].appliance_id.substr(1);
        }
        // Displaying Menu 
        jsondata["Room Name"].forEach(element => {
            if (element.room_id == 1) {
                menu.innerHTML = menu.innerHTML + "<li class='active'>" + element.room_name + "</li>";
            }
            else {
                menu.innerHTML = menu.innerHTML + "<li>" + element.room_name + "</li>";
            }
        });
        // Displaying all appliances
        let appliancesrawhtml = jsondata["Appliance Data"].map((appliance) => {
            var startingdiv = `<div class="appliance" id="${appliance.appliance_id}">`;
            var inputtag = `<input type="checkbox" value="${appliance.appliance_id}" onclick="sendRequest(event)"></input>`
            if (appliance.appliance_condition == 1) {
                startingdiv = `<div class="appliance appliance__active" id="${appliance.appliance_id}">`
                inputtag = `<input type="checkbox" value="${appliance.appliance_id}" onclick="sendRequest(event)" checked></input>`
            }
            let applianceraw =
                `${startingdiv}    
                    <img src="./img/icons/air_conditioner.svg" alt="Air Conditioner" class="appliance__icon">
                    <h2 class="appliance__heading">${appliance.appliance_name}</h2>
                        <div class="radio__button">
                            <label class="switch">
                                ${inputtag}
                            <span class="slider round"></span>
                            </label>
                        </div>
                </div>`;
            return applianceraw;
        }).join("");
        allappliances.innerHTML = appliancesrawhtml;

    } catch (error) {
        alert("Communication Error");
        console.log(error);
    }

}
getInitialData();

async function sendRequest(event) {
    event.preventDefault();

    var url = BASE_URL + "/appliance"
    var method = "POST"
    var data = {
        room: 'living room',
        appliance: event.target.value,
        app_status: event.target.checked ? "on" : "off"
    }
    if (jsondata) {
        var cappliance = jsondata["Appliance Data"].map((appliance) => {
            if (appliance.appliance_id == event.target.value) {
                var condition_changed = 0;
                if (appliance.appliance_condition == 0) {
                    condition_changed = 1;
                }
                var tempdata = {
                    room_id: 1,
                    appliance_id: appliance.appliance_id,
                    appliance_condition: condition_changed
                }

                fetch_custom(url, {
                    // Adding method type
                    method: "POST",
                    // Adding body or contents to send
                    body: JSON.stringify(tempdata),
                    // Adding headers to the request
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                }).then(response => {
                    if (response.status !== 200) {
                        alert("Communication Error");
                        return;
                    }
                    return response.json()
                })
                    .then(json => {
                        if (json.status != '200') {
                            alert("Communication Error");
                            return;
                        }
                        jsondata["Appliance Data"].forEach(element => {
                            if (element.appliance_id == event.target.value) {
                                event.target.checked = !event.target.checked;
                                var x = document.getElementById(element.appliance_id);
                                if (event.target.checked === true) {
                                    x.classList.add('appliance__active');
                                } else {
                                    x.classList.remove('appliance__active');
                                }
                            }
                        });
                        // jsondata["Appliance Data"] = json["Appliance Data"];
                        getInitialData();
                    }).catch(error => {
                        alert("Communication Error");
                    })
            }
        })
    } else {
        alert("Something Went Wrong");
    }
}

// Loop For Getting Latest Data Every Time 2 Seconds 
window.setInterval(function(){
    getInitialData();
},2000)