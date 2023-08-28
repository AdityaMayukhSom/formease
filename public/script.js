"use strict";

/**
 * This button is used to add semester rows in table.
 * @type HTMLButtonElement
 */
const addSemesterButton = document.getElementById("add-semester");

/**
 * This button is used to remove semester rows from table.
 * @type HTMLButtonElement
 */
const removeSemesterButton = document.getElementById("remove-semester");

/**
 * Table of semester names and their corresponding marks.
 * @type HTMLTableElement
 */
const semesterTable = document.getElementById("semester-table");
const lateralEntryCheckbox = document.getElementById("lateral-entry");

/**
 * @type HTMLFormElement
 */
const cgpaForm = document.getElementById("cgpa-form");

let currentSemesterNumber = 0;

function addSemester(newSemesterNumber, handleLateral = false) {
    const newRow = document.createElement("tr");
    newRow.id = `semester${newSemesterNumber}`;
    newRow.classList.add("semester-row");

    const semesterCell = document.createElement("td");
    semesterCell.textContent = `Semester ${newSemesterNumber}`;
    newRow.appendChild(semesterCell);

    const marksCell = document.createElement("td");
    const marksInput = document.createElement("input");
    marksInput.type = "number";
    marksInput.name = `semester${newSemesterNumber}`;
    marksInput.min = "0";
    marksInput.step = "0.01";
    marksInput.max = "10";
    marksCell.appendChild(marksInput);
    newRow.appendChild(marksCell);

    // when trying to add new semester via lateral enrty,
    // it must also sort the existing semesters, so to bypass
    // sorting everytime, we first prepend the 2nd semester
    // and then prepend the first semester
    if (handleLateral) {
        semesterTable.prepend(newRow);
    } else {
        semesterTable.appendChild(newRow);
    }
}

function removeSemester(removeSemesterNumber) {
    const semesterRow = semesterTable.querySelector(
        `#semester${removeSemesterNumber}`
    );
    if (semesterRow) {
        semesterTable.removeChild(semesterRow);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    addSemesterButton.addEventListener("click", () => {
        addSemester(++currentSemesterNumber);
        if (currentSemesterNumber == 1) {
            removeSemesterButton.disabled = false;
        }
        if (currentSemesterNumber == 8) {
            addSemesterButton.disabled = true;
        }
    });

    removeSemesterButton.addEventListener("click", () => {
        if (currentSemesterNumber == 8) {
            addSemesterButton.disabled = false;
        }
        if (currentSemesterNumber == 1) {
            removeSemesterButton.disabled = true;
        }
        removeSemester(currentSemesterNumber--);
    });

    lateralEntryCheckbox.addEventListener("change", () => {
        if (lateralEntryCheckbox.checked) {
            removeSemester(1);
            removeSemester(2);

            currentSemesterNumber = Math.max(currentSemesterNumber, 2);
        } else {
            // second semester must be prepended first when handling
            // lateral entry, because we do not append, we prepend them
            addSemester(2, true);
            addSemester(1, true);
            if (currentSemesterNumber <= 2) {
                currentSemesterNumber = 2;
            }
        }
    });
});
