function createTable(data, tableId) {
  var table = document.getElementById(tableId);
  var tbody = table.getElementsByTagName("tbody")[0];
  tbody.innerHTML = "";

  for (var i = 0; i < data.length; i++) {
    var gempaData = data[i];
    var row = document.createElement("tr");

    if (tableId === "latest-gempa-table") {
      row.innerHTML = `
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
          <img src="https://static.bmkg.go.id/${
            gempaData.Shakemap || ""
          }" alt="Shakemap" class="shakemap-img shakemap-thumbnail" data-toggle="modal" data-target="#shakemap-modal">
        </td>
      `;
    } else {
      row.innerHTML = `
        <td>${i + 1}</td>
        <td>${gempaData.Tanggal || ""}</td>
        <td>${gempaData.Jam || ""}</td>
        <td>${gempaData.Lintang || ""}</td>
        <td>${gempaData.Bujur || ""}</td>
        <td>${gempaData.Magnitude || ""}</td>
        <td>${gempaData.Kedalaman || ""}</td>
        <td>${gempaData.Wilayah || ""}</td>
        <td>${gempaData.Potensi || ""}</td>
      `;
    }

    tbody.appendChild(row);
  }
}

function updateGempaData(url) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var parser = new DOMParser();
      var xml = parser.parseFromString(xhr.responseText, "application/xml");
      var infogempa = xml.querySelector("Infogempa");
      if (infogempa) {
        var gempaData = Array.from(infogempa.querySelectorAll("gempa"));
        var formattedData = gempaData.map(function (item, index) {
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

        // Derive the table name based on the URL
        var tableName = url.includes("autogempa")
          ? "latest-gempa-table"
          : "gempa-table";

        createTable(formattedData, tableName);
      }
    }
  };

  xhr.send();
}

function getGempaInfo() {
  updateGempaData("https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.xml");
}

function getLatestGempaInfo() {
  updateGempaData("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.xml");
}

// Periodically update the latest earthquake data every 5 minutes (300,000 milliseconds)
setInterval(function () {
  getLatestGempaInfo();
}, 300000);

// Periodically update the earthquake data above M 5.0+ every 15 minutes (900,000 milliseconds)
setInterval(function () {
  getGempaInfo();
}, 900000);

// Initial data retrieval on page load
getGempaInfo();
getLatestGempaInfo();
