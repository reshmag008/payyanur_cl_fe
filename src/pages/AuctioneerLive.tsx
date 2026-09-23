import React, { useEffect, useState } from "react";
import {
  Search,
  ArrowLeft,
  XCircle,
  BadgeDollarSign,
  RefreshCcw,
} from "lucide-react";
import PlayerService from "@/service/PlayerService";
import { BACKEND_URL, roomId, TOTAL_PLAYER } from "../constants";
import { io } from "socket.io-client";
import { toast } from 'sonner';
import TeamService from "@/service/TeamService";



interface Bid {
  teamId: number;
  teamName: string;
  amount: number;
  time: string;
}

const AuctioneerLive: React.FC = () => {


  const [status, setStatus] = useState<
    "READY" | "BIDDING" | "PAUSED" | "SOLD" | "UNSOLD"
  >("READY");

  const [currentBid, setCurrentBid] = useState({});
  const [currentTeam, setCurrentTeam] = useState();
  const [timeLeft, setTimeLeft] = useState();


    const [soldCount, setSoldCount] = useState(0);
    const [unSoldCount, setUnSoldCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);

  const baseAmount = 1000;
const [allTeams, setAllTeams] = useState<any>([]);
const [bidFlow, setBidFlow] = useState<any>([]);
const [bidAmount, setBidAmount] = useState<number>(0);
const [currentBidTeam, setCurrentBidTeam] = useState<any>({});
const [players, setPlayers] = useState<any>([]);
const [currentBidPlayer, setCurrentBidPlayer] = useState<any>({});
const [searchText, setSearchText] = useState<string>("");
const [isLoading, setIsLoading] = useState(false);
const [popUpContent, setPopUpContent] = useState<any>({})
const [openPopUp, setOpenPopUp] = useState(false);
const [socket, setSocket] = useState<any>(null);
const [bidHistory, setBidHistory] = useState([]);
const [auctionStatus, setAuctionStatus] = useState<string>('LIVE');

const [callStage, setCallStage] = useState("");

const handleCallClick = () => {
  setCallStage((currentStage) => {
    if (currentStage === "1st Call") return "2nd Call";
    if (currentStage === "2nd Call") return "Final Call";
    return "1st Call";
  });
  PlayerService().EmitCallStage({state : callStage});
  if(callStage == 'Final Call'){
    console.log("currentBid== ", currentBid)
    if(currentBid?.player_id){
      sellPlayer();
    }else{
      setUnsoldPlayer();
    }
  }
};

useEffect(() => {
    const newSocket = io(BACKEND_URL,{
                transports: ["polling", "websocket"],
                withCredentials: true,
                reconnection: true,
            });
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const parseData = (data: any) => {
    return typeof data === "string" ? JSON.parse(data) : data;
  };

  useEffect(() => {
      if (socket) {

        socket.emit("join-room", roomId);

        socket.on('current_bid', (message: any) => {
            console.log("message== ", message);
            let messageData = parseData(message);
            console.log("messageData== ", messageData)
            setCurrentBid(messageData);
            setStatus("BIDDING");
            GetBidHistory(messageData?.player_id)
          })

        // socket.on('time_left', (timer: any) => {
        //     console.log("timer== ", timer);
        //     setTimeLeft(timer);
        //     setStatus("BIDDING");
        //   })

          

        
      }
    }, [socket]);



  useEffect(() => {
    setBidFlow([]);
    setBidAmount(0);
    setCurrentBidTeam({})
    GetAllTeams();
    GetPlayer();
    GetAllPlayers();
  }, []);


      const GetPlayer = () => {
      localStorage.setItem('close_popup', 'false');
      localStorage.setItem("team_complete",  JSON.stringify({}))
      console.log("searchText== ", searchText);
      setCurrentBidPlayer({});
      setPlayers([]);
      setBidFlow([]);
      setCurrentBidTeam({})
      setBidAmount(0)
      setIsLoading(true)
      PlayerService()
        .GetNonBidPlayers(searchText)
        .then((response: any) => {
          setCallStage("1st Call")
          let players = response?.data;
          setSearchText('')
          if (players.length === 0) {
            toast.success("No pending players");
            localStorage.setItem("selectedPlayer", JSON.stringify({}));
            localStorage.setItem("team_complete",  JSON.stringify({}))
            localStorage.setItem("currentBidTeam", JSON.stringify({}));
            localStorage.setItem('close_popup', 'false');
          }
          if (players.length === 1) {
            setCurrentBidPlayer(players[0]);
            localStorage.setItem("selectedPlayer", JSON.stringify(players[0]));
            localStorage.setItem("currentBidTeam", JSON.stringify({}));
            localStorage.setItem("team_complete",  JSON.stringify({}))
            localStorage.setItem('close_popup', 'false');
            PlayerService().displayPlayer(players[0]).then((response: any) => {
        console.log("response== ", response);
      })
            addAuctionState(players[0]);
            setIsLoading(false);
          } else {
            setPlayers(players);
            selectRandomPlayer();
          }
        });
    };
  
    const selectRandomPlayer = () => {
      const random = Math.floor(Math.random() * players.length);
      console.log(random, players[random]);
      setCurrentBidPlayer(players[random]);
      addAuctionState(players[random]);
      console.log("currentBidPlayer== ", players[random]);
      localStorage.setItem("currentBidTeam", JSON.stringify({}));
      localStorage.setItem("selectedPlayer", JSON.stringify(players[random]));
      localStorage.setItem("team_complete",  JSON.stringify({}))
      localStorage.setItem('close_popup', 'false');
      PlayerService().displayPlayer(players[random]).then((response: any) => {
        console.log("response==displayPlayer ", response);
      })
      // setTimeLeft(timeLeftSec);
      setStatus('BIDDING')
      setCurrentBid({});
      setBidHistory([])
      setIsLoading(false);
    };


    const addAuctionState = async(params:any)=>{

      let data = {
        current_player_id : params.id,
        status : 'BIDDING'
      }

      TeamService().addAuctionState(data).then((response: any) => {
        console.log("addAuctionState response== ", response);

      })

    }
    
  
     const GetAllTeams = () => {
      try {
        PlayerService()
          .getAllTeams()
          .then((response: any) => {
            setAllTeams(response?.data);
          });
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };


    const GetBidHistory = async (playerId:any)=>{
          try{
            console.log("currentBidPlayer== ", currentBidPlayer);
            
              let response = await TeamService().getBidHistory(playerId);
              console.log("bid history response== ", response?.data);
              setBidHistory(response?.data);
              setCurrentBid(response?.data?.[0])
            //   let nextBid = response?.data?.[0].bid_amount + baseAmount
            //   setNextBid(nextBid);
    
          }catch(e){
            console.log("error in GetBidHistory", e)
          }
        }



const sellPlayer = () => {
    setIsLoading(true);
    if (currentBid && currentBid.player_id) {
      let params = {
        id: currentBid?.player_id,
        team_id: currentBid.team_id,
        bid_amount: currentBid.bid_amount,
        team_name: currentBid.team_name,
        player_name: currentBid.player_name
      };
      console.log("params== ", params);


      PlayerService().sellPlayer(params).then((response: any) => {
        console.log("response.data==", response.data);
        GetPlayer();
        GetAllTeams();
        setBidFlow([]);
        setBidAmount(0);
        setCurrentBidTeam({})
        GetAllPlayers();
        if (response.data && response.data.player_count === TOTAL_PLAYER) {
          localStorage.setItem("team_complete",JSON.stringify(response.data))
          InvokeTeamComplete(response.data)
          setOpenPopUp(true);
          setPopUpContent(response.data);
          
        }
      })
    } else {
      setIsLoading(false);
      toast.warning("Please select a team and amount.");
    }

  }

    const GetAllPlayers = async () => {
      try {
        let params = {
          offset: 0,
          teamId: null
        }
        PlayerService().getAllPlayers(params).then((response: any) => {
          setSoldCount(response?.data?.soldPlayerCount);
          setUnSoldCount(response?.data?.unSoldPlayerCount);
          setPendingCount(response?.data?.pendingPlayerCount);
  
          if(response?.data?.unSoldPlayerCount==0 && response?.data?.pendingPlayerCount==0){
              setAuctionStatus("COMPLETE");
          }
  
        })
      } catch (err) {
  
      }
    }
 

  const InvokeTeamComplete = (teamData: any) => {
      PlayerService().teamComplete(teamData)
    }

 const getUnsoldPlayers = () => {
     PlayerService().getUnsoldPlayers().then((response: any) => {
       console.log("response== ", response);
       if (response && response.data && response.data.length && response.data[0] > 0) {
         GetPlayer();
         GetAllPlayers();
       } else {
         toast.success("Unsold players not found");
       }
     })
   }

  /* ================= TIMER ================= */

  // useEffect(() => {
  //   if (status !== "BIDDING") return;

  //   if (timeLeft <= 0) {

  //     console.log("currentBid==in timeleft ", currentBid);

  //   if(currentBid?.player_id){
  //       setStatus("PAUSED");
  //       sellPlayer();
  //   }else{
  //       setStatus("UNSOLD");
  //       setUnsoldPlayer();
  //   }

      
  //     return;
  //   }

  //   const timer = setInterval(() => {
  //     setTimeLeft((prev) => prev - 1);
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, [timeLeft]);

  /* ================= CONTROLS ================= */

  const startBidding = () => {
    setStatus("BIDDING");
    GetPlayer();
  };

  const pauseAuction = () => {
    setStatus("PAUSED");
  };

  const resumeAuction = () => {
    setStatus("BIDDING");
  };

  const markSold = () => {
    setStatus("SOLD");
  };

  const markUnsold = () => {
    setStatus("UNSOLD");
    setUnsoldPlayer();
  };


     const setUnsoldPlayer = () => {
      let params = {
        id: currentBidPlayer?.id,
        un_sold: true
      }
  
      PlayerService().setUnsoldPlayer(params).then((response: any) => {
        console.log("response== ", response.data);
        GetPlayer();
        GetAllPlayers();
      })
    }


  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4">

          <div>
            <h1 className="text-2xl font-black">
              BK Auctions
            </h1>

            <p className="text-sm text-slate-400">
              Auctioneer Control Panel
            </p>
          </div>

          <div className="flex items-center gap-3">

            {/* <div className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-400">
              🔴 LIVE AUCTION
            </div> */}

            {/* Auction Summary */}
<section className="grid grid-cols-3 gap-2 sm:gap-3">

  {/* Sold */}
  <div className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 sm:px-4 sm:py-3">
    <div className="flex items-center justify-between gap-2">
      <div>
        <p className="text-[9px] font-medium uppercase tracking-wider text-emerald-400 sm:text-[10px]">
          Sold
        </p>

        <p className="mt-0.5 text-lg font-black leading-none text-emerald-300 sm:text-xl">
          {soldCount}
        </p>
      </div>
    </div>

    <div className="absolute bottom-0 left-0 h-[2px] w-full bg-emerald-500" />
  </div>

  {/* Pending */}
  <div className="relative overflow-hidden rounded-xl border border-orange-500/20 bg-orange-500/10 px-3 py-2 sm:px-4 sm:py-3">
    <div className="flex items-center justify-between gap-2">
      <div>
        <p className="text-[9px] font-medium uppercase tracking-wider text-orange-400 sm:text-[10px]">
          Pending
        </p>

        <p className="mt-0.5 text-lg font-black leading-none text-orange-300 sm:text-xl">
          {pendingCount}
        </p>
      </div>
    </div>

    <div className="absolute bottom-0 left-0 h-[2px] w-full bg-orange-500" />
  </div>

  {/* Unsold */}
  <div className="relative overflow-hidden rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 sm:px-4 sm:py-3">
    <div className="flex items-center justify-between gap-2">
      <div>
        <p className="text-[9px] font-medium uppercase tracking-wider text-red-400 sm:text-[10px]">
          Unsold
        </p>

        <p className="mt-0.5 text-lg font-black leading-none text-red-300 sm:text-xl">
          {unSoldCount}
        </p>
      </div>
    </div>

    <div className="absolute bottom-0 left-0 h-[2px] w-full bg-red-500" />
  </div>

</section>



            <div className="rounded-xl bg-slate-800 px-4 py-2">
              <p className="text-[10px] uppercase text-slate-500">
                Teams
              </p>

              <p className="text-lg font-black">
                {allTeams.length}
              </p>
            </div>

          </div>
        </div>
      </header>


      {/* MAIN */}
      <main className="mx-auto max-w-[1600px] p-5">

        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">

          {/* LEFT */}
          <section className="space-y-5">

            {/* PLAYER */}
            {currentBidPlayer && currentBidPlayer.id &&
            <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">

              <div className="grid lg:grid-cols-[380px_1fr]">

                {/* IMAGE */}
                <div className="relative h-[430px] lg:h-[500px]">

                  <img
                    src={`https://storage.googleapis.com/rajas_pl/${currentBidPlayer.profile_image}`}
                    alt={currentBidPlayer.fullname}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                  <div className="absolute left-5 top-5 rounded-xl bg-black/60 px-4 py-2 backdrop-blur">
                    <p className="text-[10px] uppercase text-slate-400">
                      Player ID
                    </p>

                    <p className="text-xl font-black text-orange-400">
                      #{currentBidPlayer.id}
                    </p>
                  </div>

                  {/* <div className="absolute right-5 top-5">

                    <div
                      className={`flex h-20 w-20 flex-col items-center justify-center rounded-full border-4 ${
                        timeLeft <= 3
                          ? "border-red-500 bg-red-500/20"
                          : "border-orange-400 bg-orange-500/20"
                      }`}
                    >
                      <span className="text-2xl font-black">
                        {timeLeft}
                      </span>

                      <span className="text-[9px] uppercase">
                        seconds
                      </span>
                    </div>

                  </div> */}

                  <div className="absolute bottom-0 left-0 right-0 p-6">

                    <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold text-orange-400">
                      {currentBidPlayer.player_role}
                    </span>

                    <h2 className="mt-2 text-4xl font-black">
                      {currentBidPlayer.fullname}
                    </h2>

                    <p className="text-slate-300">
                      📍 {currentBidPlayer.location}
                    </p>

                  </div>

                </div>


                {/* BID INFORMATION */}
                <div className="flex flex-col justify-center p-7">

                  <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-500">
                    Current Bid
                  </p>

                  <p className="mt-2 text-center text-6xl font-black text-orange-400">
                    {currentBid?.bid_amount}
                  </p>

                  <div className="mt-4 text-center">

                    <p className="text-xs uppercase text-slate-500">
                      Highest Bidder
                    </p>

                    <p className="text-2xl font-bold">
                      {currentBid?.team_name}
                    </p>

                  </div>


                  {/* STATUS */}
                  <div className="mt-8 flex justify-center">

                    <StatusBadge status={status} />

                  </div>

                </div>

              </div>


              {/* PLAYER DETAILS */}
              <div className="grid grid-cols-2 border-t border-slate-800 md:grid-cols-4">

                <Info
                  label="Base Price"
                  value={baseAmount}
                />

                <Info
                  label="Batting"
                  value={currentBidPlayer.batting_style}
                />

                <Info
                  label="Bowling"
                  value={currentBidPlayer.bowling_style}
                />

                <Info
                  label="Role"
                  value={currentBidPlayer.player_role}
                />

              </div>

            </div>
            }


            {/* AUCTION CONTROLS */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">

              <h3 className="mb-4 text-lg font-bold">
                Auction Controls
              </h3>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-5">

                <button
                  onClick={startBidding}
                  // disabled={status === "BIDDING"}
                  className="rounded-xl bg-orange-500 px-4 py-4 font-black hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
                >
                  ▶ GET PLAYER
                </button>

                {/* <button
                  onClick={pauseAuction}
                  disabled={status !== "BIDDING"}
                  className="rounded-xl bg-yellow-500 px-4 py-4 font-black text-black hover:bg-yellow-400 disabled:bg-slate-700 disabled:text-slate-500"
                >
                  ⏸ PAUSE
                </button>

                <button
                  onClick={resumeAuction}
                  disabled={status !== "PAUSED"}
                  className="rounded-xl bg-blue-500 px-4 py-4 font-black hover:bg-blue-400 disabled:bg-slate-700 disabled:text-slate-500"
                >
                  ▶ RESUME
                </button> */}

                <button
                  onClick={handleCallClick}
                  className="px-6 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                >
                  {callStage}
                </button>


                <button
                  onClick={markSold}
                  disabled={
                    currentTeam === "-" ||
                    status === "SOLD"
                  }
                  className="rounded-xl bg-emerald-600 px-4 py-4 font-black hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500"
                >
                  ✓ SOLD
                </button>

                <button
                  onClick={setUnsoldPlayer}
                  disabled={status === "UNSOLD"}
                  className="rounded-xl bg-red-600 px-4 py-4 font-black hover:bg-red-500 disabled:bg-slate-700 disabled:text-slate-500"
                >
                  ✕ UNSOLD
                </button>

              </div>

              <button
                onClick={getUnsoldPlayers}
                className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-800 py-3 font-bold hover:bg-slate-700"
              >
                GET UNSOLD PLAYERS →
              </button>

            </div>

          </section>


          {/* RIGHT SIDEBAR */}
          <aside className="space-y-5">

            {/* CONNECTED TEAMS */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">

              <div className="mb-4 flex items-center justify-between">

                <h3 className="font-bold">
                  Teams
                </h3>

                <span className="text-xs text-slate-500">
                  {allTeams.length} TEAMS
                </span>

              </div>

              <div className="space-y-2">

                {allTeams.map((team) => (

                  <div
                    key={team.id}
                    className="flex items-center justify-between rounded-xl bg-slate-800/70 p-3"
                  >

                    <div className="flex items-center gap-3">

                      <span
                        className={`h-3 w-3 rounded-full ${
                           "bg-emerald-400"
                        }`}
                      />

                      <div>
                        <p className="text-sm font-bold">
                          {team.team_name}
                        </p>

                        <p className="text-[10px] text-slate-500">
                          Purse {team.total_points}
                        </p>
                      </div>

                    </div>

                    <span className="text-[10px] font-bold text-slate-500">
                      Max Bid {team.max_bid_amount}
                    </span>

                  </div>

                ))}

              </div>

            </div>


            {/* BID HISTORY */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">

              <h3 className="mb-4 font-bold">
                Live Bid History
              </h3>

              <div className="space-y-2">

                {bidHistory.length === 0 ? (

                  <div className="rounded-xl bg-slate-800 p-5 text-center text-sm text-slate-500">
                    No bids yet
                  </div>

                ) : (

                  bidHistory.map((bid, index) => (

                    <div
                      key={index}
                      className={`flex items-center justify-between rounded-xl p-3 ${
                        index === 0
                          ? "border border-orange-500/20 bg-orange-500/10"
                          : "bg-slate-800/60"
                      }`}
                    >

                      <div>

                        <p className="text-sm font-bold">
                          {bid.team_name}
                        </p>

                        <p className="text-[10px] text-slate-500">
                          {bid.updatedAt}
                        </p>

                      </div>

                      <p className="font-black">
                        {bid.bid_amount}
                      </p>

                    </div>

                  ))

                )}

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
};


/* ================= COMPONENTS ================= */

const Info = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="border-r border-slate-800 p-4">
    <p className="text-[10px] uppercase text-slate-500">
      {label}
    </p>

    <p className="mt-1 text-sm font-bold">
      {value}
    </p>
  </div>
);


const StatusBadge = ({
  status,
}: {
  status: string;
}) => {

  const config: Record<string, string> = {
    READY: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    BIDDING: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    PAUSED: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    SOLD: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    UNSOLD: "bg-red-500/10 text-red-400 border-red-500/30",
  };

  return (
    <div
      className={`rounded-full border px-6 py-2 text-sm font-black ${
        config[status]
      }`}
    >
      {status}
    </div>
  );
};

export default AuctioneerLive;