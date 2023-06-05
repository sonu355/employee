var editingEmployeeIndex = -1;
var editingEmployeeIndex = -1;

function onFormSubmit(event) {
    event.preventDefault();
    var name = document.getElementById("name").value;
    var position = document.getElementById("position").value;
    var about = document.getElementById("about").value;
    var joiningDate = document.getElementById("joining_date").value;
    var employee = {
        name: name,
        position: position,
        about: about,
        joiningDate: joiningDate
    };
    var employees = JSON.parse(localStorage.getItem("employees")) || [];
    if (editingEmployeeIndex !== -1) {
        employees[editingEmployeeIndex] = employee;
        editingEmployeeIndex = -1;
    } else {
        employees.push(employee);
    }
    localStorage.setItem("employees", JSON.stringify(employees));
    clearFormFields();
    displayEmployeeTable();
}

function clearFormFields() {
    document.getElementById("name").value = "";
    document.getElementById("position").value = "";
    document.getElementById("about").value = "";
    document.getElementById("joining_date").value = "";
}

function editEmployee(index) {
    var employees = JSON.parse(localStorage.getItem("employees")) || [];
    if (index >= 0 && index < employees.length) {
        var employee = employees[index];
        document.getElementById("name").value = employee.name;
        document.getElementById("position").value = employee.position;
        document.getElementById("about").value = employee.about;
        document.getElementById("joining_date").value = employee.joiningDate;
        editingEmployeeIndex = index;
    }
}

function deleteEmployee(index) {
    var employees = JSON.parse(localStorage.getItem("employees")) || [];
    if (index >= 0 && index < employees.length) {
        employees.splice(index, 1);
        localStorage.setItem("employees", JSON.stringify(employees));
        displayEmployeeTable();
    }

}

function displayEmployeeTable() {
    var employees = JSON.parse(localStorage.getItem("employees")) || [];
    var tableBody = document.getElementById("employeeTableBody");
    tableBody.innerHTML = "";
    employees.forEach(function (employee, index) {
        var row = document.createElement("tr");
        row.innerHTML = `
      <td>${employee.name}</td>
      <td>${employee.position}</td>
      <td>${employee.about}</td>
      <td>${employee.joiningDate}</td>
      <td><button onclick="editEmployee(${index})">Edit</button></td>
      <td><button onclick="deleteEmployee(${index})">Delete</button></td>
    `;
        tableBody.appendChild(row);
    });
}

displayEmployeeTable();

var form = document.getElementById("employeeForm");
form.addEventListener("submit", onFormSubmit);

const allTr = document.querySelectorAll("#employeeTableBody tr")
const searchInput = document.getElementById('searchInput');
const tableBody = document.getElementById("employeeTableBody");
searchInput.addEventListener('input', searchResults);

function searchResults(event) {
    const searchStr = event.target.value.toLowerCase()
    tableBody.innerHTML = ""
    allTr.forEach((tr) => {
        const td_in_tr = tr.querySelectorAll("td")
        if (td_in_tr[0].innerText.toLowerCase().indexOf(searchStr) > -1) {
            tableBody.appendChild(tr)
        }
    })
    if (tableBody.innerHTML == "") {
        tableBody.innerHTML = "No employees found"
    }
    if (searchInput == " ") {
        displayRecords()
        generatePage()
    }
    document.getElementById("page-details").innerHTML = ""
}

let total_records_tr = document.querySelectorAll("#employeeTableBody tr")
let total_records = total_records_tr.length
let records_per_page = 5;
let page_number = 1;
let total_page = Math.ceil(total_records / records_per_page)

generatePage()
displayRecords()

function displayRecords() {
    var tableBody = document.getElementById("employeeTableBody");

    let startIndex = (page_number - 1) * records_per_page;
    let endIndex = startIndex + (records_per_page - 1)
    if (endIndex >= total_records) {
        endIndex = total_records - 1
    }
    let statement = '';
    for (let i = startIndex; i <= endIndex; i++) {
        statement += `<tr>${total_records_tr[i].innerHTML}</tr>`
    }
    tableBody.innerHTML = statement;
    document.querySelectorAll(".dynamic-item").forEach((item) => {
        item.classList.remove("active")
    })

    if (page_number == 1) {
        document.getElementById("prevBtn").parentElement.classList.add("disabled")
    } else {
        document.getElementById("prevBtn").parentElement.classList.remove("disabled")
    }

    if (page_number == total_page) {
        document.getElementById("nextBtn").parentElement.classList.add("disabled")
    } else {
        document.getElementById("nextBtn").parentElement.classList.remove("disabled")
    }

    document.getElementById("page-details").innerHTML = ` ${startIndex + 1} to ${endIndex + 1} `
}

function generatePage() {
    let prevBtn = `<li class="page-item ">
  <a href="javascript:void(0)" id="prevBtn" class="page-link" onclick="prevBtn()">Previous</a>
</li>`
    let nextBtn = ` <li class="page-item"><a id="nextBtn" href="javascript:void(0)" class="page-link" onclick ="nextBtn()">
  Next
</a></li>`
    let buttons = "";
    let activeClass = "";

    for (let i = 1; i <= total_page; i++) {
        if (i == 1) {
            activeClass = "active"
        } else {
            activeClass = ""
        }
        buttons += `<li class="page-item dynamic-item ${activeClass}" id="page${i}">
      <a href="#" class="page-link">
          ${i}
      </a>
  </li>`
    }
    document.getElementById("pagination").innerHTML = `${prevBtn}  ${nextBtn}`

}

function prevBtn() {
    page_number--;
    displayRecords()
}

function nextBtn() {
    page_number++;
    displayRecords()
}