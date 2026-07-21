/* Zoho CRM Leads — the shapes these screens render, plus a snapshot of the
   real Magppie CRM to run on until the API route has credentials.

   Numbers and emails are masked here on purpose. This app follows the same
   rule as the live call: it never holds a full customer number. If you wire
   the real API, mask in the route (maskMobile / maskEmail) rather than here. */

export type LeadStatus =
  | "Not Contacted Yet"
  | "Under Follow Up"
  | "No Response/ Call Back Later"
  | "Qualified/ Drawings Awiated"
  | "Will buy in Future"
  | "Junk Lead"
  | "Not Interested";

export interface Lead {
  /** Zoho record id — the same id that arrives on call.started. */
  id: string;
  name: string;
  status: LeadStatus | string;
  source: string;
  city: string;
  email: string;
  /** already masked, e.g. "+91 98•••••608" */
  mobile: string;
  owner: string;
  createdAt: string; // ISO
  /** last touched — what "worked today" is counted from. */
  modifiedAt: string; // ISO
}

export interface LeadStats {
  total: number;
  byStatus: { label: string; count: number }[];
  bySource: { label: string; count: number }[];
}

/** How a status reads at a glance. Ember is reserved for a human on the
    line elsewhere in this app, so a dead lead uses it as text only — never
    as a fill — and nothing else borrows it. */
export function statusTone(status: string): "good" | "warm" | "cool" | "dead" {
  switch (status) {
    case "Qualified/ Drawings Awiated":
    case "Convert":
      return "good";
    case "Under Follow Up":
    case "Will buy in Future":
      return "warm";
    case "Not Interested":
    case "Junk Lead":
      return "dead";
    default:
      return "cool"; // Not Contacted Yet / No Response
  }
}

/** +919845652608 → "+91 98•••••608". Used by the API route on real data. */
export function maskMobile(raw?: string | null): string {
  if (!raw) return "—";
  const d = raw.replace(/\D/g, "");
  if (d.length < 7) return "—";
  const cc = d.length > 10 ? d.slice(0, d.length - 10) : "";
  const rest = d.slice(cc.length);
  return `${cc ? "+" + cc + " " : ""}${rest.slice(0, 2)}•••••${rest.slice(-3)}`;
}

/** name@host → "nam•••@host". */
export function maskEmail(raw?: string | null): string {
  if (!raw || !raw.includes("@")) return "—";
  const [user, host] = raw.split("@");
  return `${user.slice(0, 3)}•••@${host}`;
}

/** Zoho returns owner names as null over COQL — resolve from the users API.
 *  Keyed by user id; anything unlisted shows as "Unassigned". */
export const OWNERS: Record<string, string> = {
  "1032257000000413001": "Gursharan",
  "1032257000000414377": "Rananjay",
  "1032257000000440001": "Abhishek",
  "1032257000000442001": "Anushka",
  "1032257000000443001": "Ashish",
  "1032257000000451017": "Sowmya",
  "1032257000000451033": "Tavneet",
  "1032257000000452001": "Rahul Mahajan",
  "1032257000000453001": "Sakshi",
  "1032257000000454001": "Vaishnavi",
  "1032257000009049001": "Sachin Khanna",
  "1032257000011505042": "Ishita",
  "1032257000018948037": "Siddharth",
  "1032257000020902051": "Aayush",
  "1032257000022036018": "Sparshan",
};

/* Whole-CRM counts, straight off Zoho's aggregate COQL. */
export const STATS_SNAPSHOT: LeadStats = {
  total: 19266,
  byStatus: [
    { label: "Not Interested", count: 11015 },
    { label: "Will buy in Future", count: 2084 },
    { label: "No Response/ Call Back Later", count: 2031 },
    { label: "Under Follow Up", count: 1541 },
    { label: "Not Contacted Yet", count: 1258 },
    { label: "Junk Lead", count: 1077 },
    { label: "Qualified/ Drawings Awiated", count: 234 },
    { label: "(not set)", count: 21 },
    { label: "Fresh", count: 3 },
    { label: "Convert", count: 1 },
    { label: "Human Intervention Required(AI)", count: 1 },
  ],
  bySource: [
    { label: "Adglobal New", count: 7912 },
    { label: "(not set)", count: 1834 },
    { label: "Meta Ads", count: 1753 },
    { label: "Arch. Data", count: 1716 },
    { label: "Adglobal Old", count: 1180 },
    { label: "Website- Magppie", count: 815 },
    { label: "Direct Instagram", count: 534 },
    { label: "Scanner", count: 500 },
    { label: "ID Mumbai", count: 478 },
    { label: "Website- Magppie Kitchen", count: 342 },
    { label: "IVR", count: 221 },
    { label: "Whatsapp Picky Assist", count: 110 },
    { label: "Walk In", count: 51 },
    { label: "Architect", count: 41 },
    { label: "Referral", count: 32 },
  ],
};

const L = (
  id: string, name: string, status: string, source: string, city: string,
  email: string, mobile: string, owner: string, createdAt: string, modifiedAt: string,
): Lead => ({ id, name, status, source, city, email, mobile, owner, createdAt, modifiedAt });

/* Real Magppie leads, most-recently-worked first. Replaced at runtime by
   /api/leads when Zoho credentials are present. */
export const LEADS_SNAPSHOT: Lead[] = [
  L("1032257000023937616","Komala R","Under Follow Up","Adglobal New","Bangalore","nog•••@gmail.com","+91 80•••••703","Sachin Khanna","2026-07-20T20:35:45+05:30","2026-07-21T16:14:43+05:30"),
  L("1032257000022686531","Sangeetha Suresh","No Response/ Call Back Later","Adglobal New","Bangalore","san•••@gmail.com","+91 81•••••928","Ishita","2026-06-17T15:53:04+05:30","2026-07-21T16:13:26+05:30"),
  L("1032257000022686534","Kamlesh Patel","No Response/ Call Back Later","Adglobal New","Other","pka•••@gmail.com","+91 95•••••446","Ishita","2026-06-17T15:53:04+05:30","2026-07-21T16:12:44+05:30"),
  L("1032257000022686535","Vibha","No Response/ Call Back Later","Adglobal New","Other","vib•••@gmail.com","+91 96•••••283","Ishita","2026-06-17T15:53:04+05:30","2026-07-21T16:11:29+05:30"),
  L("1032257000023939485","Ranjeeth Reddy","Under Follow Up","Adglobal New","Bangalore","ran•••@gmail.com","+91 98•••••608","Sachin Khanna","2026-07-21T06:57:20+05:30","2026-07-21T16:12:00+05:30"),
  L("1032257000022686541","Srinivasa Reddy","No Response/ Call Back Later","Adglobal New","Other","see•••@gmail.com","+91 99•••••820","Ishita","2026-06-17T15:53:04+05:30","2026-07-21T16:10:47+05:30"),
  L("1032257000022689163","Hitesh","No Response/ Call Back Later","Adglobal New","Pune","hmu•••@gmail.com","+91 98•••••773","Ishita","2026-06-18T12:10:04+05:30","2026-07-21T16:09:31+05:30"),
  L("1032257000022693161","Cp","No Response/ Call Back Later","Adglobal New","Secunderabad","cha•••@gmail.com","+91 74•••••999","Ishita","2026-06-18T02:35:50+05:30","2026-07-21T16:08:53+05:30"),
  L("1032257000022697216","Jaatni_rj_21","No Response/ Call Back Later","Adglobal New","Jaipur","Sar•••@gmail.com","+91 96•••••787","Ishita","2026-06-18T14:41:00+05:30","2026-07-21T16:07:42+05:30"),
  L("1032257000022704407","Bharat Nayaka","No Response/ Call Back Later","Adglobal New","Mumbai","bha•••@gmail.com","+91 93•••••487","Ishita","2026-06-19T06:27:51+05:30","2026-07-21T16:06:47+05:30"),
  L("1032257000022704545","Bhumika","No Response/ Call Back Later","Adglobal New","Pune","For•••@gmail.com","+91 99•••••612","Ishita","2026-06-20T10:35:53+05:30","2026-07-21T16:06:07+05:30"),
  L("1032257000022706688","Jagdish Makwana","No Response/ Call Back Later","Adglobal New","Ahmedabad","jag•••@gmail.com","+91 90•••••006","Ishita","2026-06-19T12:56:06+05:30","2026-07-21T16:05:18+05:30"),
  L("1032257000023940512","Ranjit Kumar","No Response/ Call Back Later","Adglobal New","Bangalore","ran•••@gmail.com","+91 90•••••503","Sachin Khanna","2026-07-21T12:33:01+05:30","2026-07-21T16:05:14+05:30"),
  L("1032257000022706690","Madan Vaishnav","No Response/ Call Back Later","Adglobal New","Navsari","mad•••@gmail.com","+91 94•••••154","Ishita","2026-06-19T12:56:06+05:30","2026-07-21T16:04:43+05:30"),
  L("1032257000023927277","Mahesh Yenumula","No Response/ Call Back Later","Adglobal New","Hyderabad","mah•••@gmail.com","+91 88•••••345","Sowmya","2026-07-19T02:27:39+05:30","2026-07-21T16:04:02+05:30"),
  L("1032257000022706691","Ashok Rajput","No Response/ Call Back Later","Adglobal New","Ahmedabad","sur•••@gmail.com","+91 83•••••867","Ishita","2026-06-19T12:56:06+05:30","2026-07-21T16:03:52+05:30"),
  L("1032257000023939513","Wish Nu","No Response/ Call Back Later","Adglobal New","Hyderabad","vis•••@gmail.com","+91 94•••••220","Sowmya","2026-07-21T09:23:37+05:30","2026-07-21T16:03:22+05:30"),
  L("1032257000022706692","nandini","No Response/ Call Back Later","Adglobal New","Hyderabad","Jay•••@gmail.com","+91 82•••••799","Ishita","2026-06-19T12:56:06+05:30","2026-07-21T16:03:08+05:30"),
  L("1032257000022709562","ravi","No Response/ Call Back Later","Adglobal New","Kolkata","sac•••@gmail.com","+91 93•••••026","Ishita","2026-06-20T00:43:29+05:30","2026-07-21T16:02:30+05:30"),
  L("1032257000023969546","Sainath","Qualified/ Drawings Awiated","Adglobal New","Hyderabad","sai•••@gmail.com","+91 80•••••883","Sowmya","2026-07-20T20:07:58+05:30","2026-07-21T16:02:25+05:30"),
  L("1032257000022714155","Anant","No Response/ Call Back Later","Adglobal New","Indore","Avs•••@gmail.com","+91 70•••••755","Ishita","2026-06-18T11:09:12+05:30","2026-07-21T16:01:56+05:30"),
  L("1032257000022715283","RK","No Response/ Call Back Later","Adglobal New","Bhopal","sha•••@gmail.com","+91 93•••••666","Ishita","2026-06-18T23:16:46+05:30","2026-07-21T16:01:17+05:30"),
  L("1032257000022715328","Lalitha Thota","No Response/ Call Back Later","Adglobal New","Bangalore","Lal•••@gmail.com","+91 90•••••144","Ishita","2026-06-19T07:10:11+05:30","2026-07-21T16:00:38+05:30"),
  L("1032257000022720126","Satyam Agarwal","No Response/ Call Back Later","Adglobal New","Pune","sat•••@gmail.com","+91 90•••••311","Ishita","2026-06-18T01:33:26+05:30","2026-07-21T16:00:04+05:30"),
  L("1032257000022731415","Radhika Gupta","No Response/ Call Back Later","Adglobal New","Mumbai","jjy•••@gmail.com","+91 80•••••869","Ishita","2026-06-19T21:22:47+05:30","2026-07-21T15:59:25+05:30"),
  L("1032257000022732101","Rakshith Reddy","No Response/ Call Back Later","Adglobal New","Other","stu•••@gmail.com","+91 93•••••072","Ishita","2026-06-18T01:24:00+05:30","2026-07-21T15:58:43+05:30"),
  L("1032257000023971479","Sudeep K L","Not Interested","Adglobal New","Bangalore","sud•••@gmail.com","+91 99•••••286","Sowmya","2026-07-20T20:51:26+05:30","2026-07-21T15:58:28+05:30"),
  L("1032257000022732180","Vishal Vishu","No Response/ Call Back Later","Adglobal New","Other","vis•••@gmail.com","+91 95•••••150","Ishita","2026-06-18T13:39:01+05:30","2026-07-21T15:58:11+05:30"),
  L("1032257000022736275","Ssd traders","No Response/ Call Back Later","Adglobal New","Raipur","kap•••@gmail.com","+91 93•••••080","Ishita","2026-06-18T22:08:58+05:30","2026-07-21T15:57:33+05:30"),
  L("1032257000022740249","Paul Chetty","No Response/ Call Back Later","Adglobal New","Mumbai","bla•••@devnull.facebook.com","+91 97•••••774","Ishita","2026-06-19T06:49:29+05:30","2026-07-21T15:56:57+05:30"),
  L("1032257000022740394","JM Singh","No Response/ Call Back Later","Adglobal New","Thoubal","jit•••@yahoo.com","+91 98•••••465","Ishita","2026-06-19T20:07:07+05:30","2026-07-21T15:56:19+05:30"),
  L("1032257000022742393","Royal Rajasthan Interiors","No Response/ Call Back Later","Adglobal New","jaipur","nag•••@gmail.com","+91 99•••••670","Ishita","2026-06-19T21:24:19+05:30","2026-07-21T15:55:33+05:30"),
  L("1032257000022742455","Vgoel","No Response/ Call Back Later","Adglobal New","Karnal","vin•••@yahoo.co.in","+91 94•••••944","Ishita","2026-06-20T14:45:31+05:30","2026-07-21T15:55:00+05:30"),
  L("1032257000022745388","Kanika","No Response/ Call Back Later","Adglobal New","Hyderaba","kan•••@gmail.com","+91 88•••••474","Ishita","2026-06-19T14:24:27+05:30","2026-07-21T15:54:27+05:30"),
  L("1032257000023955236","Anuj Gupta","Not Contacted Yet","Adglobal New","Delhi NCR","Anu•••@hsc.in","+91 99•••••358","Siddharth","2026-07-19T11:35:30+05:30","2026-07-21T15:54:21+05:30"),
  L("1032257000022746429","ARUNA DEVI","No Response/ Call Back Later","Adglobal New","Kanpur","aru•••@gmail.com","+91 85•••••205","Ishita","2026-06-20T14:06:24+05:30","2026-07-21T15:53:52+05:30"),
  L("1032257000023939215","Veenu","Qualified/ Drawings Awiated","Adglobal New","Delhi NCR","vin•••@gmail.com","+91 92•••••599","Siddharth","2026-07-18T18:58:20+05:30","2026-07-21T15:51:00+05:30"),
  L("1032257000023964593","Sanjay","No Response/ Call Back Later","Adglobal New","Hyderabad","ved•••@gmail.com","+91 91•••••902","Sowmya","2026-07-20T22:11:52+05:30","2026-07-21T15:50:59+05:30"),
  L("1032257000024113033","Elaine Byrne","No Response/ Call Back Later","Adglobal New","Delhi NCR","ela•••@gmail.com","+91 70•••••357","Ishita","2026-07-21T15:30:30+05:30","2026-07-21T15:49:00+05:30"),
  L("1032257000024105037","janhavi_janu","Not Contacted Yet","Adglobal New","Banglore","Jan•••@gmail.com","+91 70•••••181","Gursharan","2026-07-21T15:48:03+05:30","2026-07-21T15:48:07+05:30"),
  L("1032257000024088020","DILEEP S H","Not Contacted Yet","Adglobal New","Bangalore","dil•••@gmail.com","+91 88•••••352","Aayush","2026-07-21T14:40:30+05:30","2026-07-21T15:35:33+05:30"),
  L("1032257000023932296","Lalan Kumar","No Response/ Call Back Later","Adglobal New","Delhi NCR","krl•••@gmail.com","+91 96•••••943","Siddharth","2026-07-19T17:36:04+05:30","2026-07-21T15:31:04+05:30"),
  L("1032257000022756437","Singh Dharmendra","No Response/ Call Back Later","Adglobal New","Lucknow","ins•••@gmail.com","+91 99•••••031","Ishita","2026-06-19T22:35:58+05:30","2026-07-21T15:21:29+05:30"),
  L("1032257000022756562","Jayshree bhaveshjoshi","No Response/ Call Back Later","Adglobal New","Mumbai","jay•••@gmail.com","+91 75•••••207","Ishita","2026-06-20T14:15:51+05:30","2026-07-21T15:20:55+05:30"),
  L("1032257000022778068","Arnav R Reddy","No Response/ Call Back Later","Website- Magppie","Bangalore","arn•••@gmail.com","+91 96•••••993","Ishita","2026-06-21T15:46:24+05:30","2026-07-21T15:20:27+05:30"),
  L("1032257000024144008","arun","Under Follow Up","Adglobal New","Delhi NCR","aru•••@gmail.com","+91 84•••••960","Siddharth","2026-07-21T14:28:39+05:30","2026-07-21T15:20:07+05:30"),
  L("1032257000022784002","Vaishnavi","No Response/ Call Back Later","Website- Magppie","Bengaluru","vai•••@gmail.com","+91 98•••••995","Ishita","2026-06-18T19:37:17+05:30","2026-07-21T15:19:42+05:30"),
  L("1032257000022804028","Lodha","No Response/ Call Back Later","Website- Magppie","Dhanbad","alo•••@gmail.com","+91 93•••••823","Ishita","2026-06-18T23:38:04+05:30","2026-07-21T15:19:15+05:30"),
  L("1032257000023962635","Rahul Kaushik","Will buy in Future","Adglobal New","Delhi ncr","Inf•••@earthmax.in","+91 92•••••835","Siddharth","2026-07-20T22:41:55+05:30","2026-07-21T15:11:47+05:30"),
  L("1032257000022922050","sachin","No Response/ Call Back Later","Adglobal New","Mumbai","sac•••@gmail.com","+91 98•••••389","Ishita","2026-06-23T16:22:58+05:30","2026-07-21T15:04:12+05:30"),
];
