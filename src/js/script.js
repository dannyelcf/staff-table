import '../css/style.css'
/* =========== Import services.js  =========== */
import { getData } from './services.js'

/* ================ Variables ================= */
let staff = []

/* ================ Fill table ================= */
async function init() {
    staff = await getData()
    fillStaffTable(staff)

    registerHandleEvents()
}

function createTbody(table) {
    const oldTbody = table.getElementsByTagName('tbody')
    if (oldTbody.length > 0) {
        table.removeChild(oldTbody[0])
    }
    return document.createElement('tbody')
}

function fillStaffTable(staff) {
    const table = document.getElementById('staff')
    const tbody = createTbody(table)
    staff.forEach(employee => {
        const tr = document.createElement('tr')
        tr.innerHTML = `
        <td> ${employee.id} </td>
        <td> ${employee.nome} </td>
        <td> ${employee.sobrenome} </td>
        <td> ${employee.email} </td>
        <td> ${employee.genero} </td>
        <td> ${employee.cidade} </td>
        <td> ${employee.pais} </td>
        <td> ${employee.empresa} </td>
        <td> ${employee.salario} </td>
        `
        tbody.append(tr)
        table.append(tbody)
    })
}

/* =========== Search input =========== */
function registerHandleEvents() {
    document.querySelectorAll("th[data-key]").forEach(th => {
        th.addEventListener('click', () => {
            sortTable(th.dataset)
        })
    })
    document.getElementById('search_button').addEventListener('click', searchStaff)
    document.getElementById('keyword').addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            searchStaff()
        }
    })
}

function searchStaff() {
    const searchKeyword = document.getElementById('keyword').value?.toUpperCase()
    filterStaffByKeyword(searchKeyword)
}

async function filterStaffByKeyword(keyword) {
    staff = await getData()
    staff = staff.filter(employee => {
        const values = Object.values(employee)
        return values.some(value => {
            return String(value).toUpperCase().includes(keyword)
        })
    })
    fillStaffTable(staff)
}

/* ================ Pagination ================= */

/* ================ Sort table both numerically and alphabetically ================= */

function createCompareEmployee(dataset) {
    return function compareEmployee(employee1, employee2) {
        if (employee1[dataset.key] < employee2[dataset.key]) {
            if (dataset.sort === 'asc') {
                return -1
            }
            if (dataset.sort === 'desc') {
                return 1
            }
            
        }
        if (employee1[dataset.key] > employee2[dataset.key]) {
            if (dataset.sort === 'asc') {
                return 1
            }
            if (dataset.sort === 'desc') {
                return -1
            }
        }
        return 0
    }
}

function sortTable(dataset) {
    staff.sort(createCompareEmployee(dataset))
    if (dataset.sort === 'asc') {
        dataset.sort = 'desc'
    } else {
        dataset.sort = 'asc'
    }

    fillStaffTable(staff)
}

init()