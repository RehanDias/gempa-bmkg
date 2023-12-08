// Check if the browser object is defined
var api = typeof browser !== "undefined" ? browser : chrome;

// Function to create a table based on the provided data and table ID
function createTable(data, tableId) {
  var table = document.getElementById(tableId);

  if (!table) {
    console.error("Table not found with ID:", tableId);
    return;
  }

  var tbody = table.querySelector("tbody");

  if (!tbody) {
    console.error("Tbody not found inside table with ID:", tableId);
    return;
  }

  tbody.innerHTML = "";

  data.forEach(function (gempaData, index) {
    var row = document.createElement("tr");

    var tableContent =
      tableId === "latest-gempa-table"
        ? `
        <td>${gempaData.Tanggal || ""}</td>
        <td>${gempaData.Jam || ""}</td>
        <td>${gempaData.Lintang || ""}</td>
        <td>${gempaData.Bujur || ""}</td>
        <td>${gempaData.Magnitude || ""}</td>
        <td>${gempaData.Kedalaman || ""}</td>
        <td>${gempaData.Wilayah || ""}</td>
        <td>${gempaData.Potensi || ""}</td>
        <td>${gempaData.Dirasakan || ""}</td>
        <td>
          <a href="https://static.bmkg.go.id/${
            gempaData.Shakemap || ""
          }" class="shakemap-thumbnail" data-fancybox="gallery" data-caption="Shakemap">
            <img src="https://static.bmkg.go.id/${
              gempaData.Shakemap || ""
            }" alt="Shakemap" class="shakemap-img img-thumbnail">
          </a>
        </td>
      `
        : `
        <td>${index + 1}</td>
        <td>${gempaData.Tanggal || ""}</td>
        <td>${gempaData.Jam || ""}</td>
        <td>${gempaData.Lintang || ""}</td>
        <td>${gempaData.Bujur || ""}</td>
        <td>${gempaData.Magnitude || ""}</td>
        <td>${gempaData.Kedalaman || ""}</td>
        <td>${gempaData.Wilayah || ""}</td>
        <td>${gempaData.Potensi || ""}</td>
      `;

    row.innerHTML = tableContent;
    tbody.appendChild(row);
  });
}

// Function to update earthquake data based on URL
function updateGempaData(url) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      var parser = new DOMParser();
      var xml = parser.parseFromString(xhr.responseText, "application/xml");
      var infogempa = xml.querySelector("Infogempa");

      if (infogempa) {
        var gempaData = Array.from(infogempa.querySelectorAll("gempa"));
        var formattedData = gempaData.map(function (item) {
          return {
            Tanggal: item.querySelector("Tanggal")
              ? item.querySelector("Tanggal").textContent
              : "",
            Jam: item.querySelector("Jam")
              ? item.querySelector("Jam").textContent
              : "",
            Lintang: item.querySelector("Lintang")
              ? item.querySelector("Lintang").textContent
              : "",
            Bujur: item.querySelector("Bujur")
              ? item.querySelector("Bujur").textContent
              : "",
            Magnitude: item.querySelector("Magnitude")
              ? item.querySelector("Magnitude").textContent
              : "",
            Kedalaman: item.querySelector("Kedalaman")
              ? item.querySelector("Kedalaman").textContent
              : "",
            Wilayah: item.querySelector("Wilayah")
              ? item.querySelector("Wilayah").textContent
              : "",
            Potensi: item.querySelector("Potensi")
              ? item.querySelector("Potensi").textContent
              : "",
            Dirasakan: item.querySelector("Dirasakan")
              ? item.querySelector("Dirasakan").textContent
              : "",
            Shakemap: item.querySelector("Shakemap")
              ? item.querySelector("Shakemap").textContent
              : "",
          };
        });

        var tableName = url.includes("autogempa")
          ? "latest-gempa-table"
          : "gempa-table";
        createTable(formattedData, tableName);
      }
    } else {
      console.error("Error fetching data. Status code: " + xhr.status);
    }
  };

  xhr.send();
}

// Function to get earthquake information
function getGempaInfo() {
  updateGempaData("https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.xml");
}

// Function to get the latest earthquake information automatically every 5 minutes
function getLatestGempaInfo() {
  updateGempaData("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.xml");
}

// Set intervals for calling functions
setInterval(getLatestGempaInfo, 300000);
setInterval(getGempaInfo, 900000);

// Event listener when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  getGempaInfo();
  getLatestGempaInfo();

  // Fancybox initialization using jQuery
  $(".shakemap-thumbnail").fancybox({
    loop: true,
    buttons: ["slideShow", "fullScreen", "thumbs", "close"],
    animationEffect: "fade",
    transitionEffect: "slide",
    thumbs: {
      autoStart: true,
      hideOnClose: true,
    },
    caption: function (instance, item) {
      return (
        item.opts.caption +
        " - Image " +
        (instance.index + 1) +
        " of " +
        instance.group.length
      );
    },
  });

  // Trigger fancybox on click
  $(".shakemap-thumbnail").on("click", function () {
    var index = $(".shakemap-thumbnail").index(this);
    $(".shakemap-thumbnail").eq(index).trigger("click");
  });
});
