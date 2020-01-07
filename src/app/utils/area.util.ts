import {city_data} from "./area.data";

export const getProvices = () => {
    const provices = [];
    for (const provice in city_data) {
        provices.push(provice);
    }
    return provices;
}

export const getCitysByProvice = (provice: string) => {
    if (!provice || !city_data[provice]) {
        return [];
    }
    const cities = [];
    const val = city_data[provice];
    for (const city in val) {
        cities.push(city);
    }
    return cities;
}
export const getAreaByCity = (provice: string, city: string) => {
    if (!provice || !city_data[provice] || !city_data[provice][city]) {
        return [];
    }
    return city_data[provice][city];
}