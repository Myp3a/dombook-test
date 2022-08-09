let widgetState = false;
let currDate = new Date();
let year = currDate.getFullYear();
let month = currDate.getMonth();

const toggleWidget = () => {
    if (widgetState) {
        let widget = document.querySelector(".datepicker-widget");
        widget.parentElement.removeChild(widget);
        widgetState = false;
    }
    else {
        let widget = document.querySelector("#datepicker").content.cloneNode(true);
        widget.querySelector("#selector-year").innerHTML = `<option value="${year}">${year}</option>\n<option value="${year+1}">${year+1}</option>`;
        widget.querySelector("#selector-month").value = month.toString().padStart(2, "0");
        document.querySelector(".datepicker").appendChild(widget);
        fillDays();
        widgetState = true;
    };
};

const hideWidget = () => {
    if (widgetState) {
        toggleWidget();
    };
};

const setYear = (e) => {
    if (e.isTrusted) {
        let selMonth = Number.parseInt(document.querySelector("#selector-month").value);
        if (selMonth < month) {
            document.querySelector("#selector-year").value = year + 1;
        }
        else {
            document.querySelector("#selector-year").value = year;
        };
        fillDays();
    };
};

const setMonth = (e) => {
    if (e.isTrusted) {
        let selYear = Number.parseInt(document.querySelector("#selector-year").value);
        let selMonth = Number.parseInt(document.querySelector("#selector-month").value);
        if (selYear > year && selMonth >= month) {
            document.querySelector("#selector-month").value = (month - 1).toString().padStart(2, "0");
        }
        else if (selYear == year && selMonth < month) {
            document.querySelector("#selector-month").value = month.toString().padStart(2, "0");
        };
        fillDays();
    };
};

const fillDays = () => {
    let daysArea = document.querySelector("#selector-area");
    let table = daysArea.querySelector("#daytable");
    if (table) {
        daysArea.removeChild(table);
    }
    let daysGroup = document.querySelector("#dayblock").content.cloneNode(true);
    let selYear = Number.parseInt(document.querySelector("#selector-year").value);
    let selMonth = Number.parseInt(document.querySelector("#selector-month").value);
    let firstDay = new Date(selYear,Number.parseInt(selMonth),1);
    let weekday = firstDay.getDay();
    if (weekday == 0) weekday = 7;
    let lastDay = new Date(selYear,Number.parseInt(selMonth)+1,0).getDate();

    let place = daysGroup.querySelector("#daytable");
    let row = document.createElement("div");
    let currDay;
    row.classList.add("datepicker-widget-days-row");
    for (let i = 1; i < 8; i++) {
        let elem = document.querySelector("#daybox").content.cloneNode(true);
        if (weekday <= i) {
            currDay = i - weekday + 1;
            elem.querySelector("span").innerHTML = currDay
        };
        row.appendChild(elem);
    };
    place.appendChild(row);
    currDay++;
    let end = false;
    while (!end) {
        let i;
        let row = document.createElement("div");
        row.classList.add("datepicker-widget-days-row");
        for (i = currDay; i < currDay + 7; i++) {
            let elem = document.querySelector("#daybox").content.cloneNode(true);
            elem.querySelector("span").innerHTML = i;
            row.appendChild(elem);
            if (i == lastDay) {
                end = true;
                break;
            };
        };
        place.appendChild(row);
        currDay = i;
    };
    daysArea.appendChild(daysGroup);
};