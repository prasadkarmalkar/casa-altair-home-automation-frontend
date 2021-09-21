
function sendRequest(event) {
    event.preventDefault();
    var url = "https://webappdemo.casaaltair.com/appliance"
    var method = "POST"
    var data = {
        room: 'living room',
        appliance: event.target.value,
        app_status: event.target.checked ? "on" : "off"
    }
    // Sending The Requeest To Server
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        // Request finished.
        if (this.status === 200) {
            event.target.checked = !event.target.checked;
            // Loging The Response
            console.log(this.responseText)
            // Checking which Radio Button is Clicked And Changing The Class 
            switch (event.target.value) {
                case 'air_conditioner':
                    var x = document.getElementById('air_conditioner');
                    if (event.target.checked === true) {
                        x.classList.add('appliance__active');
                    }else{
                        x.classList.remove('appliance__active');
                    }
                    break;
                case 'led_bulb':
                    var x = document.getElementById('led_bulb');
                    if (event.target.checked === true) {
                        x.classList.add('appliance__active');
                    }else{
                        x.classList.remove('appliance__active');
                    }
                    break;
                case 'television':
                    var x = document.getElementById('television');
                    if (event.target.checked === true) {
                        x.classList.add('appliance__active');
                    }else{
                        x.classList.remove('appliance__active');
                    }
                    break;
                case 'speaker':
                    var x = document.getElementById('speaker');
                    if (event.target.checked === true) {
                        x.classList.add('appliance__active');
                    }else{
                        x.classList.remove('appliance__active');
                    }
                    break;

            }
        } else {
            // If Anything Occur Wrong Then Alert Will Show
            alert('Communication Error')
        }
    };
    xhttp.ontimeout = function (e) {
        // If Timeout Then Alert Will Show
        alert('Communication Error')
    };

    xhttp.open("POST", url);
    xhttp.timeout = 5000;
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(data));
}

