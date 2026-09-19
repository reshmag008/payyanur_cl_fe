export interface Player {
  id: string;
  fullname: string;
  contact_no: string;
  whatsapp_no:string;
  location: string;
  player_role: string;
  batting_style: string;
  bowling_style: string;
  profile_image: string;
  bid_amount : number
  jersey_name : string;
  jersey_no : string;
  jersey_size : string;
  status : number;
  payment_screenshot : string;
}

export const playerRoles = [
  "Batsman",
  "Bowler",
  "All-Rounder",
  "Wicket-Keeper",
  "WK-Batsman"
] as const;

export const battingStyles = [
  "Right Hand",
  "Left Hand",
  "None"
] as const;

export const bowlingStyles = [
  "Right Hand",
  "Left Hand",
  "None"
] as const;

export const sizeList = [
  "XXXL 46",
  "XXL 44",
  "XL 42",
  "L 40",
  "M 38",
  "S 36",
]as const;
