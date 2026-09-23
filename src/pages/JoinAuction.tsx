import React, { useState } from "react";
import { ShieldCheck, Gavel, ArrowRight, Users } from "lucide-react";
import TeamService from "@/service/TeamService";
import { Link, useNavigate } from 'react-router-dom';

import PlayerService from "@/service/PlayerService";
import { io } from "socket.io-client";
import { BACKEND_URL, TOTAL_PLAYER, roomId } from "../constants";

import { toast } from 'sonner';


const teams = [
  { id: "team-1", name: "Kannur Strikers" },
  { id: "team-2", name: "Payyanur Warriors" },
  { id: "team-3", name: "Thalassery Titans" },
  { id: "team-4", name: "Taliparamba Kings" },
];

const JoinAuction: React.FC = () => {
     const navigate = useNavigate();
  const [auctionCode, setAuctionCode] = useState("");
  const [teamId, setTeamId] = useState("");
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);

  const handleJoinAuction = async () => {
    setError("");

    if (!auctionCode.trim()) {
      setError("Please enter the auction code.");
      return;
    }

    try {
      setJoining(true);

      let authResp = await TeamService().AuthenticateAuctionCode(auctionCode);
      console.log("authResp=== ", authResp.data);
      let teamData = authResp.data;
      if(teamData.id){
        navigate("/team_owner_auction", {
        state: {
          teamData
        },
      });
      }

      
    } catch (err) {
      setError("Unable to join the auction. Please check the code.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg">
            <Gavel className="h-8 w-8 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            BK's Auction Platform
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Join the Live Player Auction
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-6 shadow-xl border border-slate-200">

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Join Auction
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the auction code provided by the auctioneer.
            </p>
          </div>

          {/* Auction Code */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Auction Code
            </label>

            <input
              type="text"
              value={auctionCode}
              onChange={(e) => {
                setAuctionCode(
                  e.target.value.toUpperCase().replace(/\s/g, "")
                );
                setError("");
              }}
              placeholder="e.g. KPL2026"
              maxLength={12}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-center text-lg font-bold tracking-[0.25em] text-slate-900 uppercase outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

         

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Join Button */}
          <button
            type="button"
            onClick={handleJoinAuction}
            disabled={joining}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {joining ? (
              "Joining..."
            ) : (
              <>
                Join Auction
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>

          {/* Security Info */}
          <div className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />

            <div>
              <p className="text-sm font-medium text-slate-700">
                Secure Auction Session
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Your selected team will be associated with this auction
                session. Do not share your auction code with others.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Powered by BK's Auction Platform
        </p>
      </div>
    </div>
  );
};

export default JoinAuction;