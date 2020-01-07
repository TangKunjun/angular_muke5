import {GB2260} from "./identity.data";

export const extractInfo = (idNo: string) => {
    const addrPart = idNo.substring(0, 6);
    const birthPart = idNo.substring(6, 14);

    return {
        addrCode: addrPart,
        dateOfBirth: birthPart.slice(0, 4) + '-' + birthPart.slice(4, 6) + '-' + birthPart.slice(6, 8)
    };
}

export const isValidAddr = (addr: string) => {
    return GB2260[addr] !== undefined;
}

export const getAddrByCode = (code: string) => {
    const provice = GB2260[code.substring(0, 2) + '0000'];
    const city = GB2260[code.substring(0, 4) + '00'].replace(provice, '');
    const district = GB2260[code].replace(provice + city, '');
    return {
        provice,
        city,
        district
    };
};