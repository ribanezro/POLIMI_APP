const url = 'https://monumentapp-73e8e79b6ee2.herokuapp.com/';

//Función para obtener la lista de monumentos por país
export const MonumentsListByCountry = async () => {
    const response = await fetch(`${url}places/by-country/`);
    const data = await response.json();
    return data;
}

//Función para obtener la lista de monumentos
export const monumentsList = async () => {
    console.log("Fetching monuments...");
    const response = await fetch(`${url}places/`);
    console.log("Response:", response);
    const data = await response.json();
    return data;
}


