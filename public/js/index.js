"use strict";
const selectLanguage = document.getElementById("languages");
const codeeditor = document.getElementById("codeeditor");
const inputField = document.getElementById("codeinput");
const showCodeOutput = document.getElementById("codeoutput");
const submitCodeForm = document.getElementById("sumbitcode");
const addSpinner = document.querySelector(".coderunning");
const runCodeBtn = document.querySelector(".runcodeBtn");

let codeSend = false;

// Code Snippits
function setCodeSnippits() {
  const snippits = {
    c: `#include <stdio.h>


int main(void) {
// your code goes here

return 0;
}`,

    cpp: `#include <iostream>
using namespace std;


int main() {
    // your code goes here
    
    return 0;
}`,

    py: `# your code goes here`,

    java: `/* package whatever; // don't place package name! */
import java.util.*;
import java.lang.*;
import java.io.*;


/* Name of the class has to be "CodingIDE" */
public class CodingIDE {
    public static void main (String[] args) throws java.lang.Exception {
        // your code goes here

    }
}`,
  };

  editor.session.setValue(snippits[selectLanguage.value]);
}

// On Page Load, Edit on the editor
let editor;
window.onload = function () {
  editor = ace.edit("codeeditor");
  editor.setTheme("ace/theme/monokai");
  // editor.setTheme("ace/theme/one_dark");
  editor.session.setMode("ace/mode/c_cpp");
  editor.getSession().getAnnotations();

  setCodeSnippits();
};

// On Changing programming language
selectLanguage.addEventListener("change", function (event) {
  let language = event.target.value;

  if (language === "c" || language === "cpp") {
    editor.session.setMode(`ace/mode/c_cpp`);
  } else if (language === "java") {
    editor.session.setMode(`ace/mode/java`);
  } else if (language === "py") {
    editor.session.setMode(`ace/mode/python`);
  }

  setCodeSnippits();
});

function getCodeInputs() {
  const codeInfo = {
    language: "",
    code: "",
    input: "",
  };

  codeInfo.language = selectLanguage.value;
  codeInfo.code = editor.getSession().getValue();
  codeInfo.input = inputField.value
    ? JSON.stringify([`${inputField.value.replace(/[\n]/g, ",")}`])
    : JSON.stringify([]);

  return codeInfo;
}

// Remove the spinners and button access after any error occurs
function resetUiOnError() {
  addSpinner.classList.remove("spinner");
  codeSend = false;
}

// Update the UI when code output is arrived
async function updateUI(output = "", status = false) {
  try {
    if (!output && !status) {
      codeSend = true;
      addSpinner.classList.add("spinner");
    } else {
      showCodeOutput.value = "";
      addSpinner.classList.remove("spinner");
      codeSend = false;
      showCodeOutput.value = output;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Send Code to the server
async function sendCode() {
  try {
    const codeInfo = getCodeInputs();
    const formData = new FormData();
    formData.append("language", codeInfo.language);
    formData.append("code", codeInfo.code);
    formData.append("input", codeInfo.input);

    const data = new URLSearchParams(formData);

    // IMP Change the url
    const url = `http://localhost:3000/${codeInfo.language}`;
    const getOutput = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: data,
    });

    const reader = await getOutput.json();
    const outputDataToString = reader.output;
    const removeServerInfoFromCodeOutputString = outputDataToString
      .replaceAll("\\", "")
      .replaceAll(
        `C:UsersachyuOneDriveDesktopNODE_PRJcodingIDEcodeFolders${codeInfo.language}`,
        ""
      );
    await updateUI(removeServerInfoFromCodeOutputString, true);
  } catch (error) {
    console.error(error.message);
    resetUiOnError();
  }
}

// Run Code Button
runCodeBtn.addEventListener("click", async function (event) {
  try {
    event.preventDefault();
    if (codeSend) return;
    await updateUI("");
    await sendCode();
  } catch (error) {
    console.error(error.message);
  }
});
