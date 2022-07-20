let request = fetch(
    "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
  );
  
  const getState = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("Time out!!");
    }, 5000);
    request.then((response) => {
      if (response.status == 200) {
        resolve(response.json());
      } else {
        reject("Request Failed");
      }
    });
  });
  
  getState
    .then((data) => {
      console.log(data);
      data.forEach((state) => {
        document.querySelector("#estados").innerHTML += `
            <option value="${state.id}">${state.nome}</option>
        `;
      });
    })
    .catch((err) => console.log(err));
  
  document.querySelector("#estados").addEventListener("change", (e) => {
    request = fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${e.target.value}/municipios?orderBy=nome`
    );
    const getCities = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject("Time out!!");
      }, 5000);
      request.then((response) => {
        if (response.status == 200) {
          resolve(response.json());
        } else {
          reject("Request Failed");
        }
      });
    });
  
    getCities
      .then((response) => {
        document.querySelector("#cidade").innerHTML = `
          <option disabled selected>Cidades</option>
        `;
  
        response.forEach((city) => {
          document.querySelector("#cidade").innerHTML += `
              <option value="${city.id}">${city.nome}</option>
          `;
        });
      })
      .catch((err) => console.log(err));
  });
  
  document.querySelector("#cidade").addEventListener("change", (e) => {
    let id = e.target.value;
  
    request = fetch(`https://apiprevmet3.inmet.gov.br/previsao/${id}`);
    const getClimateData = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject("Time out!!");
      }, 5000);
      request.then((response) => {
        if (response.status == 200) {
          resolve(response.json());
        } else {
          reject("Request Failed");
        }
      });
    });
  
    getClimateData
      .then((response) => {
        let datas = Object.values(response)["0"];
        showClimate(datas);
  
        console.log(datas);
      })
      .catch((err) => console.log(err));
  });
  
  function showClimate(datas) {
    document.querySelector("#resultado").innerHTML = ``;
  
    let calendar = Object.keys(datas);
    console.log(calendar);
  
    for (let [key, value] of Object.entries(datas)) {
      console.log(key);
      console.log(value);
      if (value["dia_semana"]) {
        document.querySelector("#resultado").innerHTML += `
        <p>${key}, ${value["dia_semana"]}</p>
        <img src="${value["icone"]}">
        <p>${value["resumo"]}</p>
        <p>Min:${value["temp_min"]}, Máx: ${value["temp_max"]}</p>
      `;
      } else {
        document.querySelector("#resultado").innerHTML += `
        <p>${key}, ${value.manha["dia_semana"]}</p>
        <p>Manhã</p>
        <img src="${value.manha["icone"]}">
        <p>${value.manha["resumo"]}</p>
        <p>Min:${value.manha["temp_min"]}, Máx: ${value.manha["temp_max"]}</p>
      `;
        document.querySelector("#resultado").innerHTML += `
        <p>Tarde</p>
        <img src="${value.tarde["icone"]}">
        <p>${value.tarde["resumo"]}</p>
        <p>Min:${value.tarde["temp_min"]}, Máx: ${value.tarde["temp_max"]}</p>
      `;
        document.querySelector("#resultado").innerHTML += `
        <p>Noite</p>
        <img src="${value.noite["icone"]}">
        <p>${value.noite["resumo"]}</p>
        <p>Min:${value.noite["temp_min"]}, Máx: ${value.noite["temp_max"]}</p>
      `;
      }
      document.querySelector("#resultado").innerHTML += `<br>`;
    }
  }
  