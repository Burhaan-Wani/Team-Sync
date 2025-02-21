import { v4 as uuidv4 } from "uuid";
export const generateInviteCode = () =>
    uuidv4().split("-").toString().slice(0, 8);

export const generateTaskCode = () =>
    uuidv4().split("-").toString().slice(0, 4);
