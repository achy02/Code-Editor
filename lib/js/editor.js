// Retrieve Elements
const consoleLogList = document.querySelector(".editor__console-logs");
const executeCodeBtn = document.querySelector(".editor__run");
const resetCodeBtn = document.querySelector(".editor__reset");
const downloadCodeBtn = document.querySelector(".editor__download");

// Replace PROXY_URL with the actual URL of your CORS proxy
const PROXY_URL = "https://cors-anywhere.herokuapp.com/";

// Set up the API endpoint URL
const API_URL = "https://api.jdoodle.com/v1/execute";

// Setup Ace
let codeEditor = ace.edit("editorCode");
let defaultCode = 'print("hello world");';
let consoleMessages = [];
let lang = "python3";
function setLang() {
  lang = document.getElementById("language").value;
  if (lang == "nodejs") {
    language = "ace/mode/javascript";
  } else if (lang == "python3") {
    language = "ace/mode/python";
  }
  // else if (lang == "reactjs") {
  //   language = "ace/mode/jsx";
  // }
  else {
    language = `ace/mode/${lang}`;
  }
  codeEditor.session.setMode(language);
  codeEditor.setOptions({
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
  });
  // alert(language);
}
let editorLib = {
  clearConsoleScreen() {
    consoleMessages.length = 0;

    // Remove all elements in the log list
    while (consoleLogList.firstChild) {
      consoleLogList.removeChild(consoleLogList.firstChild);
    }
  },
  printToConsole() { },
  init() {
    // Configure Ace

    // Theme
    codeEditor.setTheme("ace/theme/monokai");

    // Set language
    language = "ace/mode/python";
    codeEditor.session.setMode(language);

    // Set Options
    codeEditor.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
    });

    // Set Default Code
    codeEditor.setValue(defaultCode);
  },
};

// Events
executeCodeBtn.addEventListener("click", () => {
  // Clear console messages
  editorLib.clearConsoleScreen();

  // Get input from the code editor
  const userCode = codeEditor.getValue();

  //for compiler api
  try {
    const program = {
      script: userCode,
      language: lang,
      versionIndex: "0",
      clientId: "5715b31dddb014988ed4e6b8f1409111",
      clientSecret:
        "de4cb87bb0f2075dcac2cf98a74a5f7b336612cfce05360d8a152e36443c78bc",
    };

    fetch(`${PROXY_URL}${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(program),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.output);
        outputMsg = data.output;
        document.getElementById("p1").innerHTML = outputMsg;
        // Handle the response data here
      })
      .catch((error) => {
        // Handle any errors here
      });
  } catch (err) {
    console.error(err);
  }

  // Print to the console
  editorLib.printToConsole();
});

resetCodeBtn.addEventListener("click", () => {
  // Clear ace editor
  codeEditor.setValue(" ");

  // Clear console messages
  editorLib.clearConsoleScreen();
});

// Download code as a file with the selected language extension
downloadCodeBtn.addEventListener("click", () => {
  lang = document.getElementById("language").value;
  const userCode = codeEditor.getValue();

  // Determine the file extension based on the selected language
  var fileExtension = "";
  switch (lang) {
    case "python3":
      fileExtension = "py";
      break;
    case "java":
      fileExtension = "java";
      break;
    case "nodejs":
      fileExtension = "js";
      break;
    case "reactjs":
      fileExtension = "js";
      break;
    default:
      fileExtension = "txt";
  }

  // Create a Blob containing the code
  var blob = new Blob([userCode], { type: "text/plain" });

  // Create a download link and trigger the download
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "code." + fileExtension;
  a.style.display = "none";
  document.body.appendChild(a);

  // Trigger the download automatically
  a.click();
  document.body.removeChild(a);
});
editorLib.init();
