const googleAfids = [
  "YT",
  "GD",
  "GSHOP",
  "GSEARCH",
  "Discovery",
  "CTC",
  "CTCJ",
];

export const isGoogle = (afid: string) => googleAfids.includes(afid);
