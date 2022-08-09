let widgetState = false;
let currDate = new Date();
let year = currDate.getFullYear();
let month = currDate.getMonth();

const checkDates = () => {
    let fromInput = document.querySelector("#from");
    let toInput = document.querySelector("#to");
    let fromDate = fromInput.valueAsDate;
    let toDate = toInput.valueAsDate;
    if (fromDate > toDate && toDate) {
        [toInput.value, fromInput.value] = [fromInput.value, toInput.value];
    };
};

const oneWay = () => {
    document.querySelector("#to").value = "";
    removeWidget();
};

const createWidget = (direction) => {
    let dirName;
    let fromInput = document.querySelector("#from");
    let fromDate = fromInput.valueAsDate;
    if (!fromDate) {
        direction = "from";
    };
    if (direction == "to") {
        dirName = "До:";
    };
    if (direction == "from") {
        dirName = "От:";
    };
    let widget = document.querySelector("#datepicker").content.cloneNode(true);
    widget.querySelector("#selector-year").innerHTML = `<option value="${year}">${year}</option>\n<option value="${year+1}">${year+1}</option>`;
    widget.querySelector("#selector-month").value = month.toString().padStart(2, "0");
    widget.querySelector("#direction").innerHTML = dirName;
    if (direction == "to") {
        let oneWayBtn = document.createElement("button");
        oneWayBtn.textContent = "В одну сторону";
        oneWayBtn.addEventListener("click",oneWay);
        widget.querySelector(".datepicker-widget-header").appendChild(oneWayBtn);
    };
    document.querySelector(".datepicker").appendChild(widget);
    document.querySelector(".datepicker-widget").setAttribute("data-direction",direction);
    fillDays();
    widgetState = true;
};

const removeWidget = () => {
    let widget = document.querySelector(".datepicker-widget");
    widget.parentElement.removeChild(widget);
    widgetState = false;
};

const toggleWidget = (e) => {
    let direction = e.currentTarget.id;
    if (direction != "to" && direction != "from") {
        direction = "";
    };
    if (widgetState) {
        removeWidget();
        if (direction) {
            createWidget(direction);
        }
        else {
            checkDates();
        };
    }
    else {
        if (direction) {
            createWidget(direction);
        };
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

const setDay = (e) => {
    let dayBox = e.currentTarget;
    let direction = document.querySelector("#widget").getAttribute("data-direction");
    let day = dayBox.querySelector("span").innerHTML;
    if (day) {
        let selYear = Number.parseInt(document.querySelector("#selector-year").value);
        let selMonth = Number.parseInt(document.querySelector("#selector-month").value);
        let chosenDate = `${selYear}-${(selMonth + 1).toString().padStart(2, "0")}-${day.padStart(2, "0")}`;
        if (direction == "to") {
            document.querySelector("#to").value = chosenDate;
            removeWidget();
            checkDates();
        }
        else if (direction == "from") {
            document.querySelector("#from").value = chosenDate;
            removeWidget();
            createWidget("to");
        };
    };
};

const fillDays = () => {
    let daysArea = document.querySelector("#selector-area");
    let table = daysArea.querySelector("#daytable");
    if (table) {
        daysArea.removeChild(table);
    };
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
            elem.querySelector("span").innerHTML = currDay;
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