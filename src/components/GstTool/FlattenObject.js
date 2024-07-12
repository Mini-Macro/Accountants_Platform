function flattenObject(obj, prefix = "") {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + "_" : "";
    if (
      typeof obj[k] === "object" &&
      obj[k] !== null &&
      !Array.isArray(obj[k])
    ) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else if (Array.isArray(obj[k])) {
      obj[k].forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          Object.assign(acc, flattenObject(item, `${pre}${k}_${index}`));
        } else {
          acc[`${pre}${k}_${index}`] = item;
        }
      });
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
}

// Example usage:
const nestedObject = {
  stjCd: "MHCG0862",
  lgnm: "NAVNEET MUNDHARA",
  stj: "GUKULPETH_502",
  dty: "Regular",
  adadr: [
    {
      addr: {
        bnm: "SHREE RESIDENCY",
        st: "AMRAVATI ROAD",
        loc: "Nagpur",
        bno: "201",
        dst: "Nagpur",
        lt: "21.098973",
        locality: "",
        pncd: "440023",
        landMark: "SCHOOL OF SCHOLARS",
        stcd: "Maharashtra",
        geocodelvl: "pincode",
        flno: "2",
        lg: "78.807618",
      },
      ntr: "Import",
    },
  ],
  cxdt: "",
  nba: ["Retail Business", "Import"],
  gstin: "27AAKPM3407D1ZY",
  lstupdt: "22/05/2023",
  rgdt: "27/08/2018",
  ctb: "Proprietorship",
  pradr: {
    addr: {
      bnm: "Indian Transport plaza",
      st: "katol amravati road bypass",
      loc: "Nagpur",
      bno: "Plot no. 65",
      dst: "Nagpur",
      lt: "21.109655",
      locality: "Tawakal Layout",
      pncd: "440016",
      landMark: "shivam electricals",
      stcd: "Maharashtra",
      geocodelvl: "pincode",
      flno: "2",
      lg: "78.982356",
    },
    ntr: "Retail Business",
  },
  tradeNam: "S P INDUSTRIES",
  sts: "Active",
  ctjCd: "VG0104",
  ctj: "RANGE IV",
  einvoiceStatus: "Yes",
};

const flattenedObject = flattenObject(nestedObject);
console.log(flattenedObject);
