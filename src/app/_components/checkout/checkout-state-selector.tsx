import React from "react";
import { useFormik } from "formik";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

interface StateProvinceOption {
  value: string;
  label: string;
}

interface CountryRegions {
  [key: string]: {
    name: string;
    options: StateProvinceOption[];
  };
}

const countryRegions: CountryRegions = {
  US: {
    name: "State",
    options: [
      { value: "AL", label: "Alabama" },
      { value: "AK", label: "Alaska" },
      { value: "AZ", label: "Arizona" },
      { value: "AR", label: "Arkansas" },
      { value: "CA", label: "California" },
      { value: "CO", label: "Colorado" },
      { value: "CT", label: "Connecticut" },
      { value: "DE", label: "Delaware" },
      { value: "DC", label: "District of Columbia" },
      { value: "FL", label: "Florida" },
      { value: "GA", label: "Georgia" },
      { value: "HI", label: "Hawaii" },
      { value: "ID", label: "Idaho" },
      { value: "IL", label: "Illinois" },
      { value: "IN", label: "Indiana" },
      { value: "IA", label: "Iowa" },
      { value: "KS", label: "Kansas" },
      { value: "KY", label: "Kentucky" },
      { value: "LA", label: "Louisiana" },
      { value: "ME", label: "Maine" },
      { value: "MD", label: "Maryland" },
      { value: "MA", label: "Massachusetts" },
      { value: "MI", label: "Michigan" },
      { value: "MN", label: "Minnesota" },
      { value: "MS", label: "Mississippi" },
      { value: "MO", label: "Missouri" },
      { value: "MT", label: "Montana" },
      { value: "NE", label: "Nebraska" },
      { value: "NV", label: "Nevada" },
      { value: "NH", label: "New Hampshire" },
      { value: "NJ", label: "New Jersey" },
      { value: "NM", label: "New Mexico" },
      { value: "NY", label: "New York" },
      { value: "NC", label: "North Carolina" },
      { value: "ND", label: "North Dakota" },
      { value: "OH", label: "Ohio" },
      { value: "OK", label: "Oklahoma" },
      { value: "OR", label: "Oregon" },
      { value: "PA", label: "Pennsylvania" },
      { value: "RI", label: "Rhode Island" },
      { value: "SC", label: "South Carolina" },
      { value: "SD", label: "South Dakota" },
      { value: "TN", label: "Tennessee" },
      { value: "TX", label: "Texas" },
      { value: "UT", label: "Utah" },
      { value: "VT", label: "Vermont" },
      { value: "VA", label: "Virginia" },
      { value: "WA", label: "Washington" },
      { value: "WV", label: "West Virginia" },
      { value: "WI", label: "Wisconsin" },
      { value: "WY", label: "Wyoming" },
    ],
  },
  CA: {
    name: "Province",
    options: [
      { value: "AB", label: "Alberta" },
      { value: "BC", label: "British Columbia" },
      { value: "MB", label: "Manitoba" },
      { value: "NB", label: "New Brunswick" },
      { value: "NL", label: "Newfoundland and Labrador" },
      { value: "NS", label: "Nova Scotia" },
      { value: "NT", label: "Northwest Territories" },
      { value: "NU", label: "Nunavut" },
      { value: "ON", label: "Ontario" },
      { value: "PE", label: "Prince Edward Island" },
      { value: "QC", label: "Quebec" },
      { value: "SK", label: "Saskatchewan" },
      { value: "YT", label: "Yukon" },
    ],
  },
  AU: {
    name: "State",
    options: [
      { value: "ACT", label: "Australian Capital Territory" },
      { value: "NSW", label: "New South Wales" },
      { value: "NT", label: "Northern Territory" },
      { value: "QLD", label: "Queensland" },
      { value: "SA", label: "South Australia" },
      { value: "TAS", label: "Tasmania" },
      { value: "VIC", label: "Victoria" },
      { value: "WA", label: "Western Australia" },
    ],
  },
  NZ: {
    name: "Region",
    options: [
      { value: "AUK", label: "Auckland" },
      { value: "BOP", label: "Bay of Plenty" },
      { value: "CAN", label: "Canterbury" },
      { value: "GIS", label: "Gisborne" },
      { value: "HKB", label: "Hawke's Bay" },
      { value: "MBH", label: "Marlborough" },
      { value: "MWT", label: "Manawatu-Wanganui" },
      { value: "NSN", label: "Nelson" },
      { value: "NTL", label: "Northland" },
      { value: "OTA", label: "Otago" },
      { value: "STL", label: "Southland" },
      { value: "TAS", label: "Tasman" },
      { value: "TKI", label: "Taranaki" },
      { value: "WGN", label: "Wellington" },
      { value: "WKO", label: "Waikato" },
      { value: "WTC", label: "West Coast" },
    ],
  },
  GB: {
    name: "County",
    options: [
      { value: "BDF", label: "Bedfordshire" },
      { value: "BRK", label: "Berkshire" },
      { value: "BKM", label: "Buckinghamshire" },
      { value: "CAM", label: "Cambridgeshire" },
      { value: "CHS", label: "Cheshire" },
      { value: "CON", label: "Cornwall" },
      { value: "CUL", label: "Cumberland" },
      { value: "DBY", label: "Derbyshire" },
      { value: "DEV", label: "Devon" },
      { value: "DOR", label: "Dorset" },
      { value: "DUR", label: "Durham" },
      { value: "ESS", label: "Essex" },
      { value: "GLS", label: "Gloucestershire" },
      { value: "HAM", label: "Hampshire" },
      { value: "HRT", label: "Hertfordshire" },
      { value: "HUN", label: "Huntingdonshire" },
      { value: "KEN", label: "Kent" },
      { value: "LAN-ENG", label: "Lancashire" },
      { value: "LEI", label: "Leicestershire" },
      { value: "LIN", label: "Lincolnshire" },
      { value: "LND", label: "London" },
      { value: "MSX", label: "Middlesex" },
      { value: "NFK", label: "Norfolk" },
      { value: "NTH", label: "Northamptonshire" },
      { value: "NBL", label: "Northumberland" },
      { value: "NTT", label: "Nottinghamshire" },
      { value: "OXF", label: "Oxfordshire" },
      { value: "RUT", label: "Rutland" },
      { value: "SHR", label: "Shropshire" },
      { value: "SOM", label: "Somerset" },
      { value: "STS", label: "Staffordshire" },
      { value: "SFK", label: "Suffolk" },
      { value: "SRY", label: "Surrey" },
      { value: "SSX", label: "Sussex" },
      { value: "WAR", label: "Warwickshire" },
      { value: "WES", label: "Westmorland" },
      { value: "WIL", label: "Wiltshire" },
      { value: "WOR", label: "Worcestershire" },
      { value: "YKS", label: "Yorkshire" },

      // Scotland
      { value: "ABD", label: "Aberdeenshire" },
      { value: "ANS", label: "Angus" },
      { value: "ARL", label: "Argyll" },
      { value: "AYR", label: "Ayrshire" },
      { value: "BAN", label: "Banffshire" },
      { value: "BEW", label: "Berwickshire" },
      { value: "BUT", label: "Bute" },
      { value: "CAI", label: "Caithness" },
      { value: "CLK", label: "Clackmannanshire" },
      { value: "DFS", label: "Dumfriesshire" },
      { value: "DNB", label: "Dunbartonshire" },
      { value: "ELN", label: "East Lothian" },
      { value: "FIF", label: "Fife" },
      { value: "INV", label: "Inverness-shire" },
      { value: "KCD", label: "Kincardineshire" },
      { value: "KRS", label: "Kinross-shire" },
      { value: "KKD", label: "Kirkcudbrightshire" },
      { value: "LAN-SCO", label: "Lanarkshire" },
      { value: "MLN", label: "Midlothian" },
      { value: "MOR", label: "Moray" },
      { value: "NAI", label: "Nairnshire" },
      { value: "OKI", label: "Orkney" },
      { value: "PEE", label: "Peeblesshire" },
      { value: "PER", label: "Perthshire" },
      { value: "REN", label: "Renfrewshire" },
      { value: "ROS", label: "Ross and Cromarty" },
      { value: "ROX", label: "Roxburghshire" },
      { value: "SEL", label: "Selkirkshire" },
      { value: "SHI", label: "Shetland" },
      { value: "STI", label: "Stirlingshire" },
      { value: "SUT", label: "Sutherland" },
      { value: "WLN", label: "West Lothian" },
      { value: "WIG", label: "Wigtownshire" },

      // Wales
      { value: "AGY", label: "Anglesey" },
      { value: "BRE", label: "Brecknockshire" },
      { value: "CAE", label: "Caernarfonshire" },
      { value: "CGN", label: "Cardiganshire" },
      { value: "CMN", label: "Carmarthenshire" },
      { value: "DEN", label: "Denbighshire" },
      { value: "FLN", label: "Flintshire" },
      { value: "GLA", label: "Glamorgan" },
      { value: "MER", label: "Merionethshire" },
      { value: "MON", label: "Monmouthshire" },
      { value: "MGY", label: "Montgomeryshire" },
      { value: "PEM", label: "Pembrokeshire" },
      { value: "RAD", label: "Radnorshire" },
    ],
  },
  FR: {
    name: "Region",
    options: [
      { value: "ARA", label: "Auvergne-Rhône-Alpes" },
      { value: "BFC", label: "Bourgogne-Franche-Comté" },
      { value: "BRE", label: "Bretagne" },
      { value: "CVL", label: "Centre-Val de Loire" },
      { value: "COR", label: "Corse" },
      { value: "GES", label: "Grand Est" },
      { value: "HDF", label: "Hauts-de-France" },
      { value: "IDF", label: "Île-de-France" },
      { value: "NOR", label: "Normandie" },
      { value: "NAQ", label: "Nouvelle-Aquitaine" },
      { value: "OCC", label: "Occitanie" },
      { value: "PDL", label: "Pays de la Loire" },
      { value: "PAC", label: "Provence-Alpes-Côte d'Azur" },
      // Overseas regions
      { value: "GP", label: "Guadeloupe" },
      { value: "MQ", label: "Martinique" },
      { value: "GF", label: "Guyane" },
      { value: "RE", label: "La Réunion" },
      { value: "YT", label: "Mayotte" },
    ],
  },
  DE: {
    name: "State",
    options: [
      { value: "BW", label: "Baden-Württemberg" },
      { value: "BY", label: "Bayern" },
      { value: "BE", label: "Berlin" },
      { value: "BB", label: "Brandenburg" },
      { value: "HB", label: "Bremen" },
      { value: "HH", label: "Hamburg" },
      { value: "HE", label: "Hessen" },
      { value: "MV", label: "Mecklenburg-Vorpommern" },
      { value: "NI", label: "Niedersachsen" },
      { value: "NW", label: "Nordrhein-Westfalen" },
      { value: "RP", label: "Rheinland-Pfalz" },
      { value: "SL", label: "Saarland" },
      { value: "SN", label: "Sachsen" },
      { value: "ST", label: "Sachsen-Anhalt" },
      { value: "SH", label: "Schleswig-Holstein" },
      { value: "TH", label: "Thüringen" },
    ],
  },
  IE: {
    name: "County",
    options: [
      { value: "CW", label: "Carlow" },
      { value: "CN", label: "Cavan" },
      { value: "CE", label: "Clare" },
      { value: "C", label: "Cork" },
      { value: "DL", label: "Donegal" },
      { value: "D", label: "Dublin" },
      { value: "G", label: "Galway" },
      { value: "KY", label: "Kerry" },
      { value: "KE", label: "Kildare" },
      { value: "KK", label: "Kilkenny" },
      { value: "LS", label: "Laois" },
      { value: "LM", label: "Leitrim" },
      { value: "LK", label: "Limerick" },
      { value: "LD", label: "Longford" },
      { value: "LH", label: "Louth" },
      { value: "MO", label: "Mayo" },
      { value: "MH", label: "Meath" },
      { value: "MN", label: "Monaghan" },
      { value: "OY", label: "Offaly" },
      { value: "RN", label: "Roscommon" },
      { value: "SO", label: "Sligo" },
      { value: "TA", label: "Tipperary" },
      { value: "WD", label: "Waterford" },
      { value: "WH", label: "Westmeath" },
      { value: "WX", label: "Wexford" },
      { value: "WW", label: "Wicklow" },
    ],
  },
  IL: {
    name: "District",
    options: [
      { value: "D", label: "Central" },
      { value: "HA", label: "Haifa" },
      { value: "JM", label: "Jerusalem" },
      { value: "N", label: "Northern" },
      { value: "SD", label: "Southern" },
      { value: "TA", label: "Tel Aviv" },
    ],
  },
  DK: {
    name: "Region",
    options: [
      { value: "H", label: "Hovedstaden" },
      { value: "M", label: "Midtjylland" },
      { value: "N", label: "Nordjylland" },
      { value: "SJ", label: "Sjælland" },
      { value: "SD", label: "Syddanmark" },
    ],
  },
  FI: {
    name: "Region",
    options: [
      { value: "UU", label: "Uusimaa" },
      { value: "VS", label: "Varsinais-Suomi" },
      { value: "ST", label: "Satakunta" },
      { value: "KH", label: "Kanta-Häme" },
      { value: "PR", label: "Pirkanmaa" },
      { value: "PH", label: "Päijät-Häme" },
      { value: "KY", label: "Kymenlaakso" },
      { value: "EK", label: "Etelä-Karjala" },
      { value: "ES", label: "Etelä-Savo" },
      { value: "PS", label: "Pohjois-Savo" },
      { value: "PK", label: "Pohjois-Karjala" },
      { value: "KS", label: "Keski-Suomi" },
      { value: "EP", label: "Etelä-Pohjanmaa" },
      { value: "PO", label: "Pohjanmaa" },
      { value: "KP", label: "Keski-Pohjanmaa" },
      { value: "PP", label: "Pohjois-Pohjanmaa" },
      { value: "KA", label: "Kainuu" },
      { value: "LA", label: "Lappi" },
      { value: "AH", label: "Ahvenanmaa" },
    ],
  },
  IS: {
    name: "Region",
    options: [
      { value: "HO", label: "Höfuðborgarsvæði" },
      { value: "SU", label: "Suðurnes" },
      { value: "VE", label: "Vesturland" },
      { value: "VF", label: "Vestfirðir" },
      { value: "NV", label: "Norðurland vestra" },
      { value: "NE", label: "Norðurland eystra" },
      { value: "AU", label: "Austurland" },
      { value: "SU", label: "Suðurland" },
    ],
  },
  NO: {
    name: "County",
    options: [
      { value: "AG", label: "Agder" },
      { value: "IN", label: "Innlandet" },
      { value: "MR", label: "Møre og Romsdal" },
      { value: "NO", label: "Nordland" },
      { value: "OS", label: "Oslo" },
      { value: "RO", label: "Rogaland" },
      { value: "TF", label: "Troms og Finnmark" },
      { value: "TR", label: "Trøndelag" },
      { value: "VE", label: "Vestfold og Telemark" },
      { value: "VL", label: "Vestland" },
      { value: "VI", label: "Viken" },
    ],
  },
  SE: {
    name: "County",
    options: [
      { value: "AB", label: "Stockholm" },
      { value: "AC", label: "Västerbotten" },
      { value: "BD", label: "Norrbotten" },
      { value: "C", label: "Uppsala" },
      { value: "D", label: "Södermanland" },
      { value: "E", label: "Östergötland" },
      { value: "F", label: "Jönköping" },
      { value: "G", label: "Kronoberg" },
      { value: "H", label: "Kalmar" },
      { value: "I", label: "Gotland" },
      { value: "K", label: "Blekinge" },
      { value: "M", label: "Skåne" },
      { value: "N", label: "Halland" },
      { value: "O", label: "Västra Götaland" },
      { value: "S", label: "Värmland" },
      { value: "T", label: "Örebro" },
      { value: "U", label: "Västmanland" },
      { value: "W", label: "Dalarna" },
      { value: "X", label: "Gävleborg" },
      { value: "Y", label: "Västernorrland" },
      { value: "Z", label: "Jämtland" },
    ],
  },
};

type Props = {
  formik: ReturnType<typeof useFormik>;
  country: string;
};

const StateProvinceSelect = ({ formik, country }: Props) => {
  const currentCountry = countryRegions[country];

  return (
    <>
      <label className="font-bold text-[14px] pb-2">
        {currentCountry.name}
      </label>
      <div className="relative w-full">
        <select
          name="state"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.state}
          className="w-full border-[1px] border-[#333] px-4 py-2 text-[16px] sm:text-[14px] rounded-md bg-white"
        >
          <option disabled value="">
            Select {currentCountry.name}
          </option>
          {currentCountry.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDownIcon className="w-4 h-4 text-[#555] bg-white" />
        </span>
      </div>
    </>
  );
};

export default StateProvinceSelect;
