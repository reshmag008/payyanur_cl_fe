import { BACKEND_URL } from "../constants";
import axios from 'axios'


export const TeamService = () => ({

    getAllTeams: () => {
        return(axios.get(BACKEND_URL + "/teams" ))
    },

    addTeam : (params:any) =>{
        return(axios.post(BACKEND_URL + "/teams", params))
    },

    AuthenticateAuctionCode : (auctionCode:string) =>{
        return(axios.get(BACKEND_URL + "/autheticateTeam/" + auctionCode ))
    },

    addBidHistory : (params:any) =>{
        return(axios.post(BACKEND_URL + "/add_bid_history", params))
    },

    getBidHistory : (playerId:number) =>{
        return(axios.get(BACKEND_URL + "/get_bid_history/" + playerId ))
    },

    addAuctionState : (params:any) =>{
        return(axios.post(BACKEND_URL + "/add_auction_state", params))
    },

    getAuctionState : (playerId:number) =>{
        return(axios.get(BACKEND_URL + "/get_auction_state/" + playerId ))
    },

    updateAuctionState : (params:any) =>{
        return(axios.put(BACKEND_URL + "/update_auction_state", params))
    }

     


   
});

export default TeamService;